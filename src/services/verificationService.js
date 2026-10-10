// Local keyword/location/hazard/status matching. NOT live verification.
import {REFS} from '../data/verificationRecords';
export function classify(t){const c=t.toLowerCase().replace(/\./g,''),hz=new Set();[['flood',/rain|flood|water|inundat/],['closed',/clos|shut|block|open/],['shelter',/shelter|camp|relief/],['other',/\bdam\b|burst|cyclone|tsunami|landslide/]].forEach(([k,r])=>r.test(c)&&hz.add(k));
const sc=REFS.map(r=>({r,l:r.loc.some(x=>c.includes(x)),h:hz.has(r.hz)})).filter(x=>x.l||x.h).sort((a,b)=>(b.l+b.h)-(a.l+a.h)),b=sc[0];
if(!b||hz.has('other')&&!(b.l&&b.h))return{k:'Unverified',cl:'warn',why:'No reference record matches this location and hazard. That does not mean the claim is false — check official sources.',recs:[]};
const r=b.r;if(b.l&&b.h){if(r.expired)return{k:'Potentially outdated',cl:'warn',why:'It matches a record that has expired, so the situation may have changed.',recs:[r]};
if(r.hz==='shelter'&&/full|clos|shut/.test(c)||r.hz==='closed'&&/\bopen/.test(c)&&!/clos|shut|block/.test(c))return{k:'Contradictory',cl:'bad',why:'Location and hazard match a reference record, but the claimed status conflicts with it.',recs:[r]};
return{k:'Matches available information',cl:'ok',why:'Location and hazard both match an active reference record (simulated).',recs:[r]}}
return{k:'Partially matching',cl:'warn',why:b.l?'The location appears in our records but the hazard/status differs.':'The hazard type matches our records but the location is not in the reference dataset.',recs:sc.slice(0,2).map(x=>x.r)}}
