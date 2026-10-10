import {OFFICIAL_LINKS} from '../data/officialLinks';
export default function OfficialLinks(){
  return(<div className="card"><b>Where to find real alerts (external, not connected to this app)</b>
    <ul>{OFFICIAL_LINKS.map(l=><li key={l.u}><a href={l.u} target="_blank" rel="noopener noreferrer">{l.n}</a></li>)}</ul>
    <small className="muted">Links open the official websites. SafeRoute AI does not fetch or relay their data.</small></div>);
}
