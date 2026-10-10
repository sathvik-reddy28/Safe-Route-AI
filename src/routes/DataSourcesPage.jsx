import {useState,useEffect} from 'react';
import {ALERTS} from '../data/alerts';
import {ZONES,CLOSE} from '../data/hazards';
import {SHEL,HELP} from '../data/shelters';
import {REFS} from '../data/verificationRecords';
import {DEMO_DATASET} from '../data/datasets';
import {getGeocoderStatus} from '../services/geocodeService';
import OfficialLinks from '../components/OfficialLinks';
import {useApp} from '../context/AppContext';
const ROWS=[['Alerts',ALERTS.length],['Hazard zones',ZONES.length],['Road closures',CLOSE.length],['Shelters & help points',SHEL.length+HELP.length],['Verification records',REFS.length]];
const T={live:['live','Live (from provider)'],sim:['sim','Simulated'],na:['na','Unavailable'],off:['off','On demand']};
const Tag=({k})=><span className={`tag ${T[k][0]}`}>{T[k][1]}</span>;
export default function DataSourcesPage(){
  const {t,city,hasData,online}=useApp();const [tiles,setTiles]=useState('checking');const g=getGeocoderStatus();
  useEffect(()=>{if(!online){setTiles('offline');return}setTiles('checking');const i=new Image();i.onload=()=>setTiles('reachable');i.onerror=()=>setTiles('unavailable');i.src='https://tile.openstreetmap.org/0/0/0.png';return()=>{i.onload=i.onerror=null}},[online]);
  return(<><h2>{t('sources')}</h2>
    <div className="card"><b>Emergency data for {city.name}</b>
      <div style={{overflowX:'auto'}}><table><thead><tr><th>Dataset</th><th>Records</th><th>Source type</th><th>Status</th><th>Last updated</th></tr></thead><tbody>
      {hasData?ROWS.map(([n,c])=><tr key={n}><td>{n}</td><td>{c}</td><td>Simulated</td><td><Tag k="sim"/> static, not live</td><td>{DEMO_DATASET.updated}</td></tr>)
        :<tr><td colSpan="5"><Tag k="na"/> No emergency datasets are configured for {city.name}. Nothing is shown rather than guessing.</td></tr>}</tbody></table></div></div>
    <div className="card"><b>External services</b>
      <div style={{overflowX:'auto'}}><table><thead><tr><th>Service</th><th>Provider</th><th>Status</th></tr></thead><tbody>
      <tr><td>Base map tiles</td><td>OpenStreetMap (CARTO fallback)</td><td>{tiles==='reachable'?<Tag k="live"/>:tiles==='checking'?'Checking…':<Tag k="na"/>} {tiles==='offline'?'You are offline':tiles==='unavailable'?'Tiles could not be loaded from this network':''}</td></tr>
      <tr><td>Place search</td><td>Nominatim at {g.endpoint}</td><td><Tag k="off"/> {g.state==='ok'?`last search succeeded ${new Date(g.at).toLocaleTimeString()}`:g.state==='error'?`last search failed: ${g.error}`:'no search made in this session yet'}</td></tr>
      <tr><td>Live weather / emergency alert feed</td><td>none connected</td><td><Tag k="na"/> Not implemented. No official verification is performed.</td></tr></tbody></table></div></div>
    <div className="card"><b>Source types</b><ul><li><b>Official:</b> government agencies — none connected in this app.</li><li><b>Verified partner:</b> trusted organisations — only simulated examples.</li><li><b>Community:</b> unverified citizen reports — only simulated examples.</li><li><b>Simulated:</b> invented for demonstration — the Chennai scenario.</li><li><b>Unavailable:</b> nothing configured; shown explicitly instead of guessed.</li></ul>
      <p className="muted">No API keys are used. Source links are not available for simulated records. Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>. Place search by Nominatim.</p></div>
    <OfficialLinks/></>);
}
