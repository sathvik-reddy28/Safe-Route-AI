import {NavLink,Outlet} from 'react-router-dom';
import {Shield,LayoutDashboard,Map as MapIcon,Navigation,SearchCheck,MessageSquare,Bookmark,Siren,Database,Globe} from 'lucide-react';
import {useApp} from '../context/AppContext';
import LocationSelector from './LocationSelector';
import {LN} from '../i18n/translations';
const NAV=[['/',LayoutDashboard,'dash'],['/map',MapIcon,'map'],['/route',Navigation,'route'],['/verify',SearchCheck,'verify'],['/phrases',MessageSquare,'phr'],['/saved',Bookmark,'saved'],['/quick',Siren,'quick'],['/sources',Database,'sources']];
export default function AppLayout(){
  const {lang,setLang,t,city,hasData,online}=useApp();
  return(<>
    <div className="sim" role="status">{hasData?'SIMULATED DEMO DATA — fictional Chennai extreme-rainfall scenario. Not a real emergency. Not an official alert service.':`No emergency data available for ${city.name}. Chennai's SIMULATED demo scenario is hidden here. Not an official alert service.`}</div>
    {!online&&<div className="offline" role="alert">You are offline. Map tiles and place search are unavailable; saved alerts, the phrasebook and quick mode still work from this device.</div>}
    <header><div><h1><Shield size={22} aria-hidden="true"/> SafeRoute AI</h1><small>Understand the Alert. Know the Risk. Find Your Next Step.</small></div>
      <label><Globe size={16} aria-hidden="true"/> <select aria-label="Language" value={lang} onChange={e=>setLang(e.target.value)}>{Object.entries(LN).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label></header>
    <nav aria-label="Main">{NAV.map(([to,I,k])=><NavLink key={to} to={to} end={to==='/'}><I size={18} aria-hidden="true"/> {t(k)}</NavLink>)}</nav>
    <main><LocationSelector/><Outlet/></main></>);
}
