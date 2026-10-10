import {useState,useEffect,useMemo,useRef,useCallback} from 'react';
import {MapContainer,TileLayer,Circle,Marker,Popup,Polyline,useMap,useMapEvents} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {Link} from 'react-router-dom';
import {LocateFixed,Maximize2,Minimize2,Crosshair,RotateCw,Loader2,AlertTriangle} from 'lucide-react';
import {useApp} from '../context/AppContext';
import MapLegend from './MapLegend';

// Base-map providers. The map starts with OpenStreetMap; if its tiles repeatedly fail to load
// (blocked network, provider outage) it falls back once to CARTO Voyager, which also uses OSM data.
export const TILE_PROVIDERS=[
  {id:'osm',name:'OpenStreetMap',url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',maxZoom:19,
   attr:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'},
  {id:'carto',name:'CARTO Voyager (OpenStreetMap data)',url:'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',maxZoom:19,subdomains:'abcd',
   attr:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>'}];

const mk=(cls,emoji,size=34)=>L.divIcon({className:`mk ${cls}`,html:`<span aria-hidden="true">${emoji}</span>`,iconSize:[size,size],iconAnchor:[size/2,size/2],popupAnchor:[0,-size/2]});
const ICON={closure:mk('mk-closure','🚧'),shelter:mk('mk-shelter','🏠'),help:mk('mk-help','🛟'),city:mk('mk-city','📍',38),me:mk('mk-me','',18),origin:mk('mk-origin','A',30),dest:mk('mk-dest','B',30),alt:mk('mk-alt','↪',28)};

// Leaflet only measures its container once at start-up. If the container changes size afterwards
// (fonts load, sidebar wraps, window resizes, full-screen toggles, tab becomes visible) the map keeps
// the old size and shows grey, unloaded areas. This keeps the map in sync with its container.
function MapSizer(){
  const map=useMap();
  useEffect(()=>{
    let raf=0;const fix=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>map.invalidateSize({animate:false}))};
    const el=map.getContainer();const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(fix):null;ro?.observe(el);
    const ts=[0,150,600,1500].map(ms=>setTimeout(fix,ms));
    window.addEventListener('resize',fix);window.addEventListener('orientationchange',fix);window.addEventListener('load',fix);document.addEventListener('visibilitychange',fix);
    document.fonts?.ready?.then(fix);
    return()=>{cancelAnimationFrame(raf);ro?.disconnect();ts.forEach(clearTimeout);window.removeEventListener('resize',fix);window.removeEventListener('orientationchange',fix);window.removeEventListener('load',fix);document.removeEventListener('visibilitychange',fix)};
  },[map]);
  return null;
}
// Mouse-wheel zoom only after the map is clicked, so scrolling the page never gets trapped by the map.
function WheelGuard(){const m=useMapEvents({click:()=>m.scrollWheelZoom.enable(),mouseout:()=>m.scrollWheelZoom.disable()});return null}

function View({city,focus,me,route,recenter}){
  const m=useMap();
  const cityKey=`${city.ll[0]},${city.ll[1]}`;
  useEffect(()=>{m.invalidateSize({animate:false});
    if(city.bbox)m.fitBounds(city.bbox,{padding:[20,20],maxZoom:15,animate:false});else m.setView(city.ll,city.zoom,{animate:false});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[cityKey,recenter,m]);
  const fk=focus?`${focus.ll[0]},${focus.ll[1]},${focus.n||''}`:'';
  useEffect(()=>{if(focus)m.setView(focus.ll,Math.max(m.getZoom(),13),{animate:true})},[fk,m]); // eslint-disable-line react-hooks/exhaustive-deps
  const mk2=me?`${me[0]},${me[1]}`:'';
  useEffect(()=>{if(me)m.setView(me,14,{animate:true})},[mk2,m]); // eslint-disable-line react-hooks/exhaustive-deps
  const rk=route?`${route.o},${route.d},${route.alt||''}`:'';
  useEffect(()=>{if(route){m.invalidateSize({animate:false});m.fitBounds(L.latLngBounds([route.o,route.d,...(route.alt?[route.alt]:[])]).pad(.25),{animate:false})}},[rk,m]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
const Pop=({n,al,sim=true})=><Popup><b>{n}</b>{sim&&<><br/><small>SIMULATED DEMO DATA</small></>}{al&&<><br/><Link to={`/?alert=${al}`}>View related alert</Link></>}</Popup>;

/**
 * layers: which overlays to draw. focus: {ll,n} to zoom to. route: {o,d,alt,bad,oName,dName} approximate line.
 * size: 'lg' (map page, ~72vh) or 'md' (embedded). Hazard overlays only render when the selected place has a dataset.
 */
export default function MapView({layers={zones:1,closures:1,shelters:1,help:1},focus=null,route=null,size='md',alertFocus=null}){
  const {say,city,data,hasData}=useApp();
  const {zones,closures,shelters,help}=data;
  const [me,setMe]=useState(null);const [full,setFull]=useState(false);const [recenter,setRecenter]=useState(0);
  const [prov,setProv]=useState(0);const [tileKey,setTileKey]=useState(0);const [tile,setTile]=useState('loading');const [notice,setNotice]=useState('');
  const cnt=useRef({ok:0,fail:0});const slow=useRef();
  const provider=TILE_PROVIDERS[prov];
  const resetTiles=useCallback(()=>{cnt.current={ok:0,fail:0};setTile('loading');clearTimeout(slow.current);slow.current=setTimeout(()=>setTile(t=>t==='loading'?'slow':t),10000)},[]);
  useEffect(()=>{resetTiles();return()=>clearTimeout(slow.current)},[prov,tileKey,resetTiles]);
  useEffect(()=>{setMe(null)},[city.id]);
  useEffect(()=>{if(!full)return;const k=e=>{if(e.key==='Escape')setFull(false)};document.addEventListener('keydown',k);document.body.classList.add('map-full');return()=>{document.removeEventListener('keydown',k);document.body.classList.remove('map-full')}},[full]);
  const onTile=useMemo(()=>({
    tileload:()=>{cnt.current.ok++;setTile('ok');clearTimeout(slow.current)},
    tileerror:()=>{const c=cnt.current;c.fail++;
      if(c.ok===0&&c.fail>=4){
        if(prov<TILE_PROVIDERS.length-1){setNotice(`${TILE_PROVIDERS[prov].name} tiles could not be loaded, so the map switched to ${TILE_PROVIDERS[prov+1].name}.`);setProv(prov+1)}
        else{setTile('error');clearTimeout(slow.current)}
      }},
    load:()=>{if(cnt.current.ok>0){setTile('ok');clearTimeout(slow.current)}else if(cnt.current.fail>0)setTile('error')}
  }),[prov]);
  const locate=()=>{if(!navigator.geolocation)return say('Geolocation is not supported by this browser');navigator.geolocation.getCurrentPosition(p=>setMe([p.coords.latitude,p.coords.longitude]),()=>say('Location permission denied — the map still works without it'))};
  const fz=alertFocus?zones.find(z=>z.al===alertFocus):null;
  const focusPt=focus||(fz?{ll:fz.ll,n:fz.n}:null);
  const altLine=route?.alt?[route.o,route.alt,route.d]:null;
  const cls=`mapbox ${size==='lg'?'mapbox-lg':'mapbox-md'}${full?' full':''}`;
  return(<div className="mapwrap">
    <div className={cls} role="region" aria-label={`Map of ${city.name}`} data-testid="mapbox">
      <MapContainer center={city.ll} zoom={city.zoom} minZoom={3} maxZoom={provider.maxZoom} scrollWheelZoom={false} worldCopyJump className="leafmap">
        <TileLayer key={`${provider.id}-${tileKey}`} attribution={provider.attr} url={provider.url} subdomains={provider.subdomains||'abc'} maxZoom={provider.maxZoom} eventHandlers={onTile}/>
        <MapSizer/><WheelGuard/>
        <View city={city} focus={focusPt} me={me} route={route} recenter={recenter}/>
        <Marker position={city.ll} icon={ICON.city} zIndexOffset={-1000} title={`Selected location: ${city.name}`} alt={`Selected location: ${city.name}`}>
          <Popup><b>{city.name}</b><br/>{city.detail&&<>{city.detail}<br/></>}<small>{city.ll[0].toFixed(4)}, {city.ll[1].toFixed(4)}</small><br/>
            <small>{hasData?'Inside the SIMULATED demo coverage area.':'No emergency data configured for this location.'}</small></Popup></Marker>
        {hasData&&layers.zones&&zones.map(z=><Circle key={z.n} center={z.ll} radius={z.r} pathOptions={{color:z.sev===3?'#b71c1c':'#e08600',weight:2,fillOpacity:.22}}><Pop n={z.n+' hazard zone'} al={z.al}/></Circle>)}
        {hasData&&layers.closures&&closures.map(c=><Marker key={c.n} position={c.ll} icon={ICON.closure} title={c.n} alt={c.n}><Pop n={c.n} al={c.al}/></Marker>)}
        {hasData&&layers.shelters&&shelters.map(s=><Marker key={s.n} position={s.ll} icon={ICON.shelter} title={s.n} alt={s.n}><Pop n={s.n} al={s.al}/></Marker>)}
        {hasData&&layers.help&&help.map(s=><Marker key={s.n} position={s.ll} icon={ICON.help} title={s.n} alt={s.n}><Pop n={s.n+' (no real contact info)'} al={s.al}/></Marker>)}
        {me&&<Marker position={me} icon={ICON.me} alt="Your location"><Popup>You are here (from your device)</Popup></Marker>}
        {route&&<><Polyline positions={[route.o,route.d]} pathOptions={{color:route.bad?'#b71c1c':'#0a6c8f',weight:4,dashArray:'8 8'}}/>
          <Marker position={route.o} icon={ICON.origin} alt="Route start"><Popup>Start: {route.oName}</Popup></Marker>
          <Marker position={route.d} icon={ICON.dest} alt="Route end"><Popup>End: {route.dName}</Popup></Marker></>}
        {altLine&&<><Polyline positions={altLine} pathOptions={{color:'#1b6e3a',weight:4,dashArray:'2 8'}}/><Marker position={route.alt} icon={ICON.alt} alt="Alternative via point"><Popup>Possible alternative via {route.altName} (approximate)</Popup></Marker></>}
      </MapContainer>
      <div className="map-tools">
        <button type="button" onClick={()=>setFull(f=>!f)} aria-pressed={full} aria-label={full?'Exit full screen':'Full screen map'}>{full?<Minimize2 size={16} aria-hidden="true"/>:<Maximize2 size={16} aria-hidden="true"/>}<span>{full?'Exit':'Full screen'}</span></button>
        <button type="button" onClick={()=>setRecenter(n=>n+1)} aria-label="Re-centre on selected location"><Crosshair size={16} aria-hidden="true"/><span>Re-centre</span></button>
        <button type="button" onClick={locate} aria-label="Show my location"><LocateFixed size={16} aria-hidden="true"/><span>My location</span></button>
      </div>
      {tile==='loading'&&<div className="map-chip" role="status"><Loader2 size={14} className="spin" aria-hidden="true"/> Loading map tiles…</div>}
    </div>
    {notice&&<p className="res warn" role="status">ℹ️ {notice} <button type="button" onClick={()=>setNotice('')}>Dismiss</button></p>}
    {(tile==='error'||tile==='slow')&&<p className="res warn" role="alert"><AlertTriangle size={16} aria-hidden="true"/> {tile==='error'?'Map tiles could not be loaded (offline, blocked network or provider outage). Place markers and overlays still work, but the base map is missing.':'Map tiles are loading slowly. Your connection may be weak.'}
      {' '}<button type="button" onClick={()=>{setProv(0);setNotice('');setTileKey(k=>k+1)}}><RotateCw size={14} aria-hidden="true"/> Retry map</button></p>}
    <MapLegend hasData={hasData} layers={layers} route={!!route}/>
    <small className="muted">Base map needs an internet connection and is not available offline. Map data © OpenStreetMap contributors.</small>
  </div>);
}
