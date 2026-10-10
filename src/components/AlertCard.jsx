import {Link} from 'react-router-dom';
import {Bookmark,Map as MapIcon} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {SEV,HZ,EXP,ACT} from '../i18n/translations';
export default function AlertCard({a}){
  const {lang,t,saved,toggleSave}=useApp();const sv=saved.some(s=>s.id===a.id);
  return(<article className={`card sev${a.sev}`} id={a.id}>
    <div className="row"><span className={`badge b${a.sev}`}>{SEV[a.sev][lang]}</span><span className="tag">{HZ[a.hz][lang]}</span><span className="tag sim">SIMULATED</span></div>
    <h3>{HZ[a.hz][lang]} — {a.loc}</h3><p>{EXP[a.hz][lang]}</p>
    <details><summary>Original warning (English)</summary><p>{a.orig}</p></details>
    <div className="two"><div><b>✅ {t('do')}</b><ul>{a.do.map(k=><li key={k}>{ACT[k][lang]}</li>)}</ul></div><div><b>⛔ {t('avoid')}</b><ul>{a.avoid.map(k=><li key={k}>{ACT[k][lang]}</li>)}</ul></div></div>
    <small>Source: {a.src} ({a.kind}) · Issued {a.iss} · Updated {a.upd} · No expiry set in demo data</small>
    <div className="row"><button aria-pressed={sv} onClick={()=>toggleSave(a.id)}><Bookmark size={16}/> {sv?'✔ ':''}{t('save')}</button><Link className="btn" to={`/map?alert=${a.id}`}><MapIcon size={16}/> {t('map')}</Link></div>
  </article>);
}
