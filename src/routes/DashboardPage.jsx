import {useState,useEffect} from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import NoDataNotice from '../components/NoDataNotice';
import {SEV,HZ} from '../i18n/translations';
import AlertCard from '../components/AlertCard';
import LocationDetails from '../components/LocationDetails';
import OfficialLinks from '../components/OfficialLinks';
import {useApp} from '../context/AppContext';
export default function DashboardPage(){
  const {lang,t,city,data,hasData}=useApp();const {alerts:ALERTS,zones:ZONES,shelters:SHEL}=data;const [sp]=useSearchParams();const focus=sp.get('alert');
  const [f,setF]=useState({sev:'',hz:'',loc:''});const set=k=>e=>setF({...f,[k]:e.target.value});
  const L=ALERTS.filter(a=>(!f.sev||a.sev===+f.sev)&&(!f.hz||a.hz===f.hz)&&(!f.loc||a.loc.includes(f.loc)));
  const recent=[...ALERTS].sort((a,b)=>b.upd.localeCompare(a.upd));
  useEffect(()=>{if(focus)document.getElementById(focus)?.scrollIntoView({behavior:'smooth'})},[focus]);
  if(!hasData)return(<><h2>{t('dash')}</h2><NoDataNotice city={city}/><div className="grid"><LocationDetails/><OfficialLinks/></div>
    <div className="row"><Link className="btn" to="/map">🗺️ {t('map')}</Link><Link className="btn" to="/route">🧭 {t('route')}</Link><Link className="btn" to="/phrases">💬 {t('phr')}</Link><Link className="btn" to="/quick">⚠️ {t('quick')}</Link></div></>);
  return(<><h2>{t('dash')}</h2>
    <div className="grid">
      <LocationDetails/>
      <div className="card"><b>Scenario summary</b><p>Simulated extreme rainfall over south Chennai: {ALERTS.length} demo alerts, {ZONES.length} hazard zones, {SHEL.length} demo shelters.</p></div>
      <div className="card"><b>Affected areas</b><p>{ZONES.map(z=>`${z.n} (${SEV[z.sev][lang]})`).join(', ')}</p></div>
      <div className="card"><b>Designated shelters (demo)</b><ul>{SHEL.map(s=><li key={s.n}>{s.n}</li>)}</ul></div>
      <div className="card"><b>Recent updates</b><ul>{recent.map(a=><li key={a.id}>{a.upd} — {HZ[a.hz][lang]}, {a.loc}</li>)}</ul></div></div>
    <div className="row"><Link className="btn" to="/map">🗺️ {t('map')}</Link><Link className="btn" to="/route">🧭 {t('route')}</Link><Link className="btn" to="/verify">🔎 {t('verify')}</Link><Link className="btn" to="/phrases">💬 {t('phr')}</Link><Link className="btn" to="/quick">⚠️ {t('quick')}</Link></div>
    <div className="row"><label>Severity <select value={f.sev} onChange={set('sev')}><option value="">All</option>{[3,2,1].map(s=><option key={s} value={s}>{SEV[s].en}</option>)}</select></label>
      <label>Hazard <select value={f.hz} onChange={set('hz')}><option value="">All</option>{Object.keys(HZ).map(h=><option key={h} value={h}>{HZ[h].en}</option>)}</select></label>
      <label>Location <select value={f.loc} onChange={set('loc')}><option value="">All</option>{ZONES.map(z=><option key={z.n}>{z.n}</option>)}</select></label></div>
    {L.length?L.map(a=><AlertCard key={a.id} a={a}/>):<div className="card">No alerts match these filters. Try “All”.</div>}</>);
}
