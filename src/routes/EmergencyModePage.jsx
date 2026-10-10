import {Link} from 'react-router-dom';
import NoDataNotice from '../components/NoDataNotice';
import {PH} from '../data/phrases';
import {ACT,HZ,SEV} from '../i18n/translations';
import OfficialLinks from '../components/OfficialLinks';
import {useApp} from '../context/AppContext';
export default function EmergencyModePage(){
  const {lang,t,city,data,hasData}=useApp();const {alerts:ALERTS,shelters:SHEL}=data;const D=hasData?[...new Set(ALERTS.flatMap(a=>a.do))]:['high','charge','shelter'],A=hasData?[...new Set(ALERTS.flatMap(a=>a.avoid))]:['drive','pole'];
  return(<div className="hc big"><h2>⚠️ {t('quick')}</h2><p style={{fontSize:16}}>Location: <b>{city.name}</b>{city.detail?`, ${city.detail}`:''}</p>
    {hasData?<>
    <div className="card"><b>Active alerts (simulated)</b><ul>{ALERTS.map(a=><li key={a.id}>{SEV[a.sev][lang]} — {HZ[a.hz][lang]}, {a.loc}</li>)}</ul></div>
    <div className="card"><b>✅ {t('do')}</b><ul>{D.map(k=><li key={k}>{ACT[k][lang]}</li>)}</ul><b>⛔ {t('avoid')}</b><ul>{A.map(k=><li key={k}>{ACT[k][lang]}</li>)}</ul></div>
    <div className="card"><b>🏠 Shelters (demo)</b><ul>{SHEL.map(s=><li key={s.n}>{s.n}</li>)}</ul><p style={{fontSize:16}}>No emergency phone numbers are listed. Look up your official local emergency number. This app cannot contact rescue services or send an SOS.</p></div></>:<><NoDataNotice city={city} compact/>
    <div className="card"><b>General precautions (not tied to any live alert)</b><p style={{fontSize:16}}>Generic extreme-weather guidance only; follow instructions from local authorities.</p><b>✅ {t('do')}</b><ul>{D.map(k=><li key={k}>{ACT[k][lang]}</li>)}</ul><b>⛔ {t('avoid')}</b><ul>{A.map(k=><li key={k}>{ACT[k][lang]}</li>)}</ul></div></>}
    <div className="card"><b>📞 India national emergency number: 112</b><p style={{fontSize:16}}>112 is India's single emergency number (verify locally). This app does not dial it or contact anyone for you.</p><a className="btn big tel" href="tel:112">Call 112 from your phone</a></div>
    <div className="card">{PH.slice(0,3).map(p=><p key={p.en}>{p.en}<br/><b lang={lang}>{p[lang]}</b></p>)}</div>
    <div className="row"><Link className="btn big" to="/map">🗺️ {t('map')}</Link><Link className="btn big" to="/phrases">💬 {t('phr')}</Link></div></div>);
}
