import {Link} from 'react-router-dom';
import {useApp} from '../context/AppContext';
export const NO_DATA_MESSAGE='No verified emergency alerts are configured for this location. The map displays geographical information only.';
// Shown instead of any simulated content when the selected location has no emergency data.
export default function NoDataNotice({city,compact}){
  const {setCity}=useApp();
  return(<div className="card nodata" role="status" data-testid="no-data"><b>{NO_DATA_MESSAGE}</b>
    <p>SafeRoute AI has no alerts, hazard zones, road closures or shelter information for <b>{city.name}</b>, not even simulated. A lack of data does <b>not</b> mean the area is safe. Check official sources such as the local disaster-management authority, the India Meteorological Department (IMD) and the National Disaster Management Authority (NDMA).</p>
    {!compact&&<p>You can still use the <Link to="/map">map</Link>, the <Link to="/route">route sketch tool</Link> and the <Link to="/phrases">phrasebook</Link>, or open the <button type="button" className="lnk" style={{border:0,background:'none',padding:0,color:'var(--a)',textDecoration:'underline'}} onClick={()=>setCity({id:'chennai',name:'Chennai',state:'Tamil Nadu',detail:'Tamil Nadu',ll:[13.0827,80.2707],zoom:11})}>SIMULATED Chennai demo scenario</button>. This app cannot contact rescue services or send an SOS.</p>}</div>);
}
