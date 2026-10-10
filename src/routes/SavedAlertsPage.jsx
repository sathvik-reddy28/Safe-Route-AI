import {Link} from 'react-router-dom';
import AlertCard from '../components/AlertCard';
import {useApp} from '../context/AppContext';
const STALE_MS=3*3600e3;
export default function SavedAlertsPage(){
  const {t,saved,hasData,data}=useApp();const ALERTS=data.alerts;const now=Date.now();
  const items=saved.map(s=>({s,a:ALERTS.find(x=>x.id===s.id)})).filter(x=>x.a);
  return(<><h2>{t('saved')}</h2>
    {items.length?items.map(({s,a})=><div key={a.id}>{now-s.t>STALE_MS&&<div className="res warn" role="alert">⚠️ Saved over 3 hours ago — may be outdated. Check official sources.</div>}
      <small>Saved: {new Date(s.t).toLocaleString()} · Data last updated (simulated): {a.upd}</small><AlertCard a={a}/></div>)
      :<div className="card">{saved.length&&!hasData?`You have ${saved.length} saved alert(s) from the simulated Chennai scenario. They appear only when the selected location is inside the Chennai demo area.`:<>Nothing saved yet. Use “Save” on an alert from the <Link to="/">dashboard</Link>. Saved items stay only in this browser.</>}</div>}</>);
}
