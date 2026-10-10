import {useState,useEffect} from 'react';
import {useSearchParams,Link} from 'react-router-dom';
import MapView from '../components/MapView';
import {useApp} from '../context/AppContext';
import NoDataNotice from '../components/NoDataNotice';
const N={zones:'🟥 Hazard zones',closures:'🚧 Road closures',shelters:'🏠 Shelters',help:'🛟 Help points (demo)'};
export default function MapPage(){
  const {t,city,hasData,data}=useApp();const [sp]=useSearchParams();const [layers,setL]=useState({zones:1,closures:1,shelters:1,help:1});
  const [focus,setFocus]=useState(null);
  useEffect(()=>{setFocus(null)},[city.id]);
  const spots=[...data.shelters.map(s=>({...s,k:'Shelter'})),...data.closures.map(s=>({...s,k:'Closure'})),...data.help.map(s=>({...s,k:'Help point'}))];
  return(<><h2>{t('map')}</h2>
    {hasData?<p className="muted">All hazards, shelters and help points are SIMULATED DEMO DATA.</p>:<NoDataNotice city={city} compact/>}
    <div className="map-layout"><MapView layers={layers} focus={focus} alertFocus={sp.get('alert')} size="lg"/>
      <aside className="side" aria-label="Map layers and places">
        {hasData?<>
          <div className="card"><b>Layers</b><div role="group" aria-label="Map layers" style={{display:'grid',gap:6,marginTop:6}}>{Object.entries(N).map(([k,v])=><label key={k}><input type="checkbox" checked={!!layers[k]} onChange={e=>setL({...layers,[k]:e.target.checked})}/> {v}</label>)}</div></div>
          <div className="card"><b>Jump to (simulated)</b><ul>{data.zones.map(z=><li key={z.n}><button type="button" className="lnk" onClick={()=>setFocus({ll:z.ll,n:z.n})}>{z.n} hazard zone</button> · <Link to={`/?alert=${z.al}`}>alert</Link></li>)}
            {spots.map(s=><li key={s.n}><button type="button" className="lnk" onClick={()=>setFocus({ll:s.ll,n:s.n})}>{s.n}</button> <small className="muted">({s.k})</small></li>)}</ul></div>
        </>:<div className="card"><b>No overlays for {city.name}</b><p>Hazard zones, closures and shelters are not configured for this location. Search another place or pick a popular destination above.</p></div>}
      </aside></div></>);
}
