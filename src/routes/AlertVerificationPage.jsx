import {useState,useEffect} from 'react';
import {classify} from '../services/verificationService';
import {SAMPLES} from '../data/verificationRecords';
import {useApp} from '../context/AppContext';
export default function AlertVerificationPage(){
  const {t,city,hasData}=useApp();const [text,setText]=useState('');const [res,setRes]=useState(null);
  useEffect(()=>{setRes(null)},[city.id]);
  const run=v=>{const x=v.trim();setRes(!x?{empty:1}:hasData?classify(x):{k:'Unverified',cl:'warn',why:`No reference records exist for ${city.name}, so this claim cannot be compared. That does not mean it is false. Check official local sources.`,recs:[]})};
  return(<><h2>{t('verify')}</h2>
    <div className="card"><label htmlFor="vt">Paste a forwarded message or claim</label><textarea id="vt" rows="4" style={{width:'100%'}} value={text} onChange={e=>setText(e.target.value)}/>
      <div className="row"><button className="on" onClick={()=>run(text)}>Check against demo records</button>{hasData&&SAMPLES.map((s,i)=><button key={i} onClick={()=>{setText(s);run(s)}}>Sample {i+1}</button>)}</div>
      <small className="muted">Local demonstration only: compares with simulated records. It cannot verify live alerts, government sources or internet content, and “unverified” does not mean false.</small></div>
    {res?.empty&&<div className="res warn" role="alert">Please paste a message first.</div>}
    {res&&!res.empty&&<div className={`res ${res.cl}`} role="status"><b>{res.k}</b><p>{res.why}</p>{res.recs.map(r=><p key={r.id}>📄 <b>{r.id}:</b> {r.t}</p>)}<small>Simulated reference data — not an official verification.</small></div>}</>);
}
