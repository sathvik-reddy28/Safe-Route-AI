export default function MapLegend({hasData,layers,route}){
  const items=[['📍','mk-city','Selected location',true]];
  if(hasData){
    items.push(['','sw-zone3','Severe hazard zone (simulated)',layers.zones],['','sw-zone2','Moderate hazard zone (simulated)',layers.zones],
      ['🚧','mk-closure','Road closure (simulated)',layers.closures],['🏠','mk-shelter','Shelter (simulated)',layers.shelters],['🛟','mk-help','Help point (simulated, no real contact)',layers.help]);
  }
  if(route)items.push(['A','mk-origin','Route start',true],['B','mk-dest','Route end',true],['','sw-line','Approximate straight line (not roads)',true]);
  return(<div className="legend" role="group" aria-label="Map legend"><b>Legend</b>
    {items.filter(i=>i[3]!==0&&i[3]!==false).map(([e,c,l])=><span key={l} className="lg-i"><i className={`lg-sw ${c}`} aria-hidden="true">{e}</i>{l}</span>)}
    {!hasData&&<span className="lg-note">No hazard zones, closures or shelters are configured for this location. The map shows geographical information only.</span>}
  </div>);
}
