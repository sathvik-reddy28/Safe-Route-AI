// Straight-line hazard check. NOT road navigation. Hazards come only from configured (here: SIMULATED) datasets.
import {ZONES,CLOSE} from '../data/hazards';import {WP} from '../data/locations';import {SEV} from '../i18n/translations';import {hv} from '../utils/distance';
import {datasetFor} from '../data/datasets';
const STEPS=40;
const along=(a,b,i)=>[a[0]+(b[0]-a[0])*i/STEPS,a[1]+(b[1]-a[1])*i/STEPS];
export const hits=(a,b)=>{const o=new Set();for(let i=0;i<=STEPS;i++){const p=along(a,b,i);ZONES.forEach(z=>hv(p,z.ll)<z.r&&o.add('Hazard zone: '+z.n+' ('+SEV[z.sev].en+')'));CLOSE.forEach(c=>hv(p,c.ll)<500&&o.add('Near closure: '+c.n))}return[...o]};
/** True if any part of the line lies inside an area for which we hold hazard data. */
export const lineCovered=(a,b)=>{for(let i=0;i<=STEPS;i++)if(datasetFor(along(a,b,i)))return true;return false};
export function checkRoute(o,d){
  const covered=lineCovered(o.ll,d.ll);const h=covered?hits(o.ll,d.ll):[];
  const bothIn=!!datasetFor(o.ll)&&!!datasetFor(d.ll);
  const alt=h.length&&bothIn?WP.find(w=>!hits(o.ll,w.ll).length&&!hits(w.ll,d.ll).length)||null:null;
  return{hits:h,alt,covered,km:hv(o.ll,d.ll)/1000};
}
