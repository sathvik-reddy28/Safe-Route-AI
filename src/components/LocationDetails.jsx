import {Link} from 'react-router-dom';
import {useApp} from '../context/AppContext';
import {DEMO_DATASET,distanceToDataset} from '../data/datasets';
// Shows exactly what is known about the selected place and which data exists for it.
export default function LocationDetails(){
  const {city,hasData,dataset}=useApp();
  const km=Math.round(distanceToDataset(city.ll)/1000);
  return(<div className="card" data-testid="loc-details"><b>Selected location</b>
    <dl className="dl"><dt>Place</dt><dd>{city.name}</dd>
      {city.detail&&<><dt>Area</dt><dd>{city.detail}, India</dd></>}
      <dt>Coordinates</dt><dd>{city.ll[0].toFixed(4)}, {city.ll[1].toFixed(4)}</dd>
      <dt>Place source</dt><dd>{city.source==='geocoded'?'OpenStreetMap Nominatim search result':'Built-in popular shortcut (coordinates fixed in the app)'}</dd>
      <dt>Emergency data</dt><dd>{hasData?<><span className="tag sim">SIMULATED DEMO DATA</span> {dataset.label}</>:<><span className="tag na">UNAVAILABLE</span> none configured{km<2000?` (nearest demo area is ${km} km away and does not apply)`:''}</>}</dd></dl>
    <div className="row"><Link className="btn" to="/map">🗺️ Open map</Link></div></div>);
}
