import {useState} from 'react';
import {PH} from '../data/phrases';
import {VC} from '../i18n/translations';
import usePersistentState from '../hooks/usePersistentState';
import {useApp} from '../context/AppContext';
export default function PhrasebookPage(){
  const {t,say}=useApp();const [q,setQ]=useState(''),[cat,setCat]=useState(''),[big,setBig]=usePersistentState('sr_big',false);
  const L=PH.filter(p=>(!cat||p.c===cat)&&(!q||[p.en,p.ta,p.te,p.hi].join(' ').toLowerCase().includes(q.toLowerCase())));
  const copy=async x=>{try{await navigator.clipboard.writeText(x);say('Copied')}catch{say('Copy blocked by browser')}};
  const speak=(x,l)=>{if(!('speechSynthesis' in window))return say('Text-to-speech not supported');const s=new SpeechSynthesisUtterance(x);s.lang=VC[l];s.onerror=()=>say('Speech failed — this device may lack the voice');speechSynthesis.speak(s)};
  return(<><h2>{t('phr')}</h2>
    <div className="row"><input type="search" aria-label="Search phrases" placeholder="Search phrases" value={q} onChange={e=>setQ(e.target.value)}/>
      <select aria-label="Category" value={cat} onChange={e=>setCat(e.target.value)}><option value="">All</option>{['help','shelter','medical','info'].map(c=><option key={c}>{c}</option>)}</select>
      <label><input type="checkbox" checked={!!big} onChange={e=>setBig(e.target.checked)}/> Large text</label></div>
    <div className={big?'lg':''}>{L.length?L.map(p=><div className="card" key={p.en}><b className="ph">{p.en}</b>
      {['ta','te','hi'].map(l=><div className="row ph" key={l}><span lang={l} style={{flex:1}}>{p[l]}</span><button onClick={()=>copy(p[l])}>Copy</button><button aria-label="Speak" onClick={()=>speak(p[l],l)}>🔊</button></div>)}</div>):<div className="card">No phrases found.</div>}</div></>);
}
