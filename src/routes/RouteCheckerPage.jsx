import {useState,useEffect} from 'react';
import MapView from '../components/MapView';
import PlaceSearch from '../components/PlaceSearch';
import {checkRoute} from '../services/routeService';
import {hv} from '../utils/distance';
import {useApp} from '../context/AppContext';
const pt=c=>c?{id:c.id,name:c.name,detail:c.detail||'',ll:c.ll}:null;
export default function RouteCheckerPage(){
  const {t,city,data,hasData}=useApp();const PL=data.places;
  const [o,setO]=useState(pt(city)),[d,setD]=useState(null),[r,setR]=useState(null),[err,setErr]=useState('');
  // Inputs follow the selected location: start = selected place, destination cleared, old result dropped.
  useEffect(()=>{setO(pt(city));setD(null);setR(null);setErr('')},[city.id,city.ll[0],city.ll[1]]);// eslint-disable-line react-hooks/exhaustive-deps
  const setPoint=(set)=>p=>{set({id:p.id,name:p.name,detail:p.detail||'',ll:p.ll});setR(null);setErr('')};
  const run=()=>{
    if(!o||!d){setR(null);return setErr('Choose both a start and a destination.')}
    if(hv(o.ll,d.ll)<100){setR(null);return setErr('Start and destination are the same place. Choose two different places.')}
    setErr('');const res=checkRoute(o,d);setR({...res,o:o.ll,d:d.ll,oName:o.name,dName:d.name,alt:res.alt?.ll,altName:res.alt?.n,bad:res.hits.length>0});
  };
  const demoBtns=(set)=>Object.values(PL).map(p=><button type="button" key={p.n} className="chip" onClick={()=>setPoint(set)({id:'demo-'+p.n,name:p.n,detail:'Chennai (demo place)',ll:p.ll})}>{p.n}</button>);
  return(<><h2>{t('route')}</h2>
    <div className="card"><div className="pick">
      <div><PlaceSearch key={'o'+(o?.id||'')+(o?.ll||'')} label="Start" placeholder="Search a start place in India…" clearOnSelect={false} initial={o?.name||''} onSelect={setPoint(setO)}/>{hasData&&<div className="row chips">{demoBtns(setO)}</div>}</div>
      <div><PlaceSearch key={'d'+(d?.id||'')+(d?.ll||'')} label="Destination" placeholder="Search a destination in India…" clearOnSelect={false} initial={d?.name||''} onSelect={setPoint(setD)}/>{hasData&&<div className="row chips">{demoBtns(setD)}</div>}</div></div>
      <div className="row"><button className="on" type="button" onClick={run}>Check route</button>
        {o&&d&&<small className="muted">{o.name} → {d.name}</small>}</div>
      <small className="muted">Approximation: a straight line between two points, NOT real roads or navigation. It is checked only against hazards in configured datasets (currently only the SIMULATED Chennai scenario).</small></div>
    {err&&<div className="res warn" role="alert">{err}</div>}
    {r&&(r.bad?<div className="res bad" role="alert" data-testid="route-result"><b>⚠️ This approximate route may cross simulated hazards</b><ul>{r.hits.map(h=><li key={h}>{h}</li>)}</ul>
      {r.altName?<p>🟢 Possible alternative (approximate): via <b>{r.altName}</b>. It avoids all <i>simulated</i> hazards but is not confirmed safe.</p>:<p>No alternative avoiding all sample hazards was found. Follow official guidance and consider waiting.</p>}</div>
      :r.covered?<div className="res warn" role="status" data-testid="route-result"><b>No simulated hazard intersects this approximate line.</b><p>This does <b>not</b> mean the route is safe. Real roads and live conditions are not covered. Follow official guidance.</p></div>
      :<div className="res warn" role="status" data-testid="route-result"><b>No hazard data is configured along this route, so hazards could not be checked.</b><p>This is <b>not</b> a statement that the route is safe. The line is about {r.km.toFixed(0)} km long and ignores real roads. Check official local sources.</p></div>)}
    <MapView size="md" route={r}/></>);
}
