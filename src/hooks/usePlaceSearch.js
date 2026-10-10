import {useState,useEffect,useRef,useCallback} from 'react';
import {searchPlaces,normalizeQuery,MIN_CHARS} from '../services/geocodeService';
// Debounced, abortable place search. status: idle | short | loading | ok | empty | error
export const DEBOUNCE_MS=800;
export default function usePlaceSearch(initial=''){
  const [q,setQ]=useState(initial);
  const [st,setSt]=useState({status:'idle',results:[],error:null});
  const timer=useRef(),ctl=useRef(),seq=useRef(0);
  const cancel=()=>{clearTimeout(timer.current);ctl.current?.abort()};
  const run=useCallback(async text=>{
    const s=normalizeQuery(text);
    cancel();
    if(!s){setSt({status:'idle',results:[],error:null});return}
    if(s.length<MIN_CHARS){setSt({status:'short',results:[],error:null});return}
    const my=++seq.current;ctl.current=new AbortController();
    setSt(p=>({status:'loading',results:p.results,error:null}));
    try{const r=await searchPlaces(s,{signal:ctl.current.signal});if(my===seq.current)setSt({status:r.length?'ok':'empty',results:r,error:null})}
    catch(e){if(e.name==='AbortError'||my!==seq.current)return;setSt({status:e.code==='invalid'?'short':'error',results:[],error:e})}
  },[]);
  const change=useCallback(v=>{
    setQ(v);cancel();++seq.current;
    const s=normalizeQuery(v);
    if(!s)return setSt({status:'idle',results:[],error:null});
    if(s.length<MIN_CHARS)return setSt({status:'short',results:[],error:null});
    setSt(p=>({status:'loading',results:p.results,error:null}));
    timer.current=setTimeout(()=>run(v),DEBOUNCE_MS);
  },[run]);
  const fill=useCallback(v=>{cancel();++seq.current;setQ(v);setSt({status:'idle',results:[],error:null})},[]);
  const reset=useCallback(()=>{cancel();++seq.current;setQ('');setSt({status:'idle',results:[],error:null})},[]);
  useEffect(()=>()=>cancel(),[]);
  return{q,setQ:change,searchNow:()=>run(q),retry:()=>run(q),reset,fill,...st};
}
