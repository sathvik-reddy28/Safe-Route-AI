import {createContext,useContext,useState,useCallback,useEffect,useMemo,useRef} from 'react';
import usePersistentState from '../hooks/usePersistentState';
import {UI} from '../i18n/translations';
import {DEFAULT_CITY} from '../data/cities';
import {datasetFor} from '../data/datasets';
import {ALERTS} from '../data/alerts';import {ZONES,CLOSE} from '../data/hazards';import {SHEL,HELP} from '../data/shelters';import {PL,WP} from '../data/locations';
const Ctx=createContext(null);
// Simulated Chennai data is exposed ONLY when the selected coordinates lie inside the demo dataset's coverage area.
const FULL={alerts:ALERTS,zones:ZONES,closures:CLOSE,shelters:SHEL,help:HELP,places:PL,waypoints:WP};
const EMPTY={alerts:[],zones:[],closures:[],shelters:[],help:[],places:{},waypoints:[]};
export const useApp=()=>useContext(Ctx);
const validLL=l=>Array.isArray(l)&&l.length===2&&l.every(Number.isFinite);
// Accepts presets, geocoder results and older saved values; returns a clean city object or null.
export function toCity(x){
  if(!x||typeof x.name!=='string'||!validLL(x.ll))return null;
  const [lat,lon]=x.ll;if(lat<-90||lat>90||lon<-180||lon>180)return null;
  return{id:String(x.id||`pt-${lat.toFixed(4)}-${lon.toFixed(4)}`),name:x.name,detail:x.detail||x.state||'',state:x.state||'',ll:[lat,lon],
    bbox:Array.isArray(x.bbox)&&x.bbox.length===2?x.bbox:null,zoom:Number.isFinite(x.zoom)?x.zoom:12,source:x.source||'preset',type:x.type||''};
}
export function AppProvider({children}){
  const [lang,setLang]=usePersistentState('sr_lang','en');
  const [raw,setSaved]=usePersistentState('sr_saved',[]);
  const [rawCity,setRawCity]=usePersistentState('sr_city',DEFAULT_CITY);
  const city=useMemo(()=>toCity(rawCity)||toCity(DEFAULT_CITY),[rawCity]);
  const dataset=useMemo(()=>datasetFor(city.ll),[city]);
  const hasData=!!dataset;const data=hasData?FULL:EMPTY;
  const [toast,setToast]=useState('');const tm=useRef();
  const [online,setOnline]=useState(typeof navigator==='undefined'||navigator.onLine!==false);
  const saved=Array.isArray(raw)?raw.filter(s=>s&&s.id&&s.t):[];
  const say=useCallback(m=>{setToast(m);clearTimeout(tm.current);tm.current=setTimeout(()=>setToast(''),2500)},[]);
  const setCity=useCallback(c=>{const n=toCity(c);if(n)setRawCity(n)},[setRawCity]);
  useEffect(()=>{document.documentElement.lang=['en','ta','te','hi'].includes(lang)?lang:'en'},[lang]);
  useEffect(()=>{const on=()=>setOnline(true),off=()=>setOnline(false);window.addEventListener('online',on);window.addEventListener('offline',off);return()=>{window.removeEventListener('online',on);window.removeEventListener('offline',off)}},[]);
  const t=k=>UI[k]?.[lang]||UI[k]?.en||k;
  const toggleSave=id=>{const has=saved.some(s=>s.id===id);setSaved(has?saved.filter(s=>s.id!==id):[...saved,{id,t:Date.now()}]);say(has?'Removed from saved':'Saved')};
  return <Ctx.Provider value={{lang,setLang,saved,toggleSave,t,say,city,setCity,hasData,dataset,data,online}}>{children}{toast&&<div className="toast" role="status">{toast}</div>}</Ctx.Provider>;
}
