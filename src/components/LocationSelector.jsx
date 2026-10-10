import {MapPin} from 'lucide-react';
import {CITIES} from '../data/cities';
import {useApp} from '../context/AppContext';
import PlaceSearch from './PlaceSearch';
export default function LocationSelector(){
  const {city,setCity,say,hasData}=useApp();
  const choose=c=>{setCity(c);say('Location: '+c.name)};
  return(<section className="card loc" aria-label="Selected location">
    <div className="row loc-head"><MapPin size={18} aria-hidden="true"/><b data-testid="city-name">{city.name}</b>
      {city.detail&&<span className="muted">{city.detail}</span>}
      {hasData?<span className="tag sim">SIMULATED DEMO DATA</span>:<span className="tag">No emergency data configured</span>}</div>
    <PlaceSearch onSelect={choose}/>
    <div className="row chips" role="group" aria-label="Popular destinations (shortcuts)"><small className="muted">Popular:</small>
      {CITIES.map(c=><button type="button" key={c.id} className={`chip${city.id===c.id?' on':''}`} aria-pressed={city.id===c.id} onClick={()=>choose({...c,detail:c.state,source:'preset'})}>{c.name}{c.id==='chennai'?' (demo)':''}</button>)}</div>
    <details className="about"><summary>About place search and data</summary><small className="muted">Place search © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> via Nominatim. Searches run after you pause typing, are cached, and are limited to 1 per second. Only the Chennai area has (simulated) emergency data; for every other place only the map and place details are shown.</small></details></section>);
}
