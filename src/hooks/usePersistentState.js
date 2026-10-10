import {useState,useEffect} from 'react';
// useState backed by localStorage; falls back silently if storage is blocked or corrupted.
export default function usePersistentState(key,init){
  const [v,setV]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):init}catch{return init}});
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(v))}catch{/* storage unavailable */}},[key,v]);
  return [v,setV];
}
