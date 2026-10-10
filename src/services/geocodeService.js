// Place search for India via OpenStreetMap Nominatim (or any Nominatim-compatible endpoint).
// Usage policy: https://operations.osmfoundation.org/policies/nominatim/
//  - max 1 request/second (enforced by a queue below)
//  - no request on every keystroke (the UI debounces; short queries are never sent)
//  - results are cached (memory + sessionStorage) and identical queries are never re-sent
//  - stale requests are aborted
// The public server does not officially support autocomplete. For heavy production use, point
// VITE_GEOCODER_URL at your own Nominatim instance or a commercial provider.
const BASE=(import.meta.env.VITE_GEOCODER_URL||'https://nominatim.openstreetmap.org/search').trim();
export const MIN_CHARS=3;
const MIN_GAP_MS=1100,TTL_MS=24*3600e3,MAX_CACHE=150;
const cache=new Map();
let lastSent=0,chain=Promise.resolve();
const status={state:'idle',at:null,error:''};   // read by the Data sources page
export const getGeocoderStatus=()=>({...status,endpoint:new URL(BASE,location.href).host});

export class GeocodeError extends Error{constructor(code,message){super(message);this.code=code}}
const abortErr=()=>{const e=new Error('Aborted');e.name='AbortError';return e};
export const normalizeQuery=q=>(q||'').replace(/\s+/g,' ').trim();

try{const s=JSON.parse(sessionStorage.getItem('sr_geo_cache')||'[]');if(Array.isArray(s))s.forEach(([k,v])=>cache.set(k,v))}catch{/* storage unavailable */}
const persist=()=>{try{sessionStorage.setItem('sr_geo_cache',JSON.stringify([...cache].slice(-MAX_CACHE)))}catch{/* ignore */}};
const remember=(k,v)=>{cache.delete(k);cache.set(k,{v,t:Date.now()});while(cache.size>MAX_CACHE)cache.delete(cache.keys().next().value);persist()};

const wait=(ms,signal)=>new Promise((res,rej)=>{
  if(signal?.aborted)return rej(abortErr());
  const t=setTimeout(()=>{signal?.removeEventListener('abort',ab);res()},ms);
  const ab=()=>{clearTimeout(t);rej(abortErr())};signal?.addEventListener('abort',ab,{once:true});
});

// Short readable description from Nominatim's addressdetails
export function shapeResult(r){
  const a=r.address||{};
  const primary=r.name||a.village||a.town||a.city||a.suburb||a.neighbourhood||a.hamlet||String(r.display_name||'').split(',')[0];
  const locality=a.suburb||a.neighbourhood||a.village||a.town||a.city||a.municipality||'';
  const district=a.state_district||a.county||a.district||'';
  const bits=[locality!==primary?locality:'',district,a.state].filter(Boolean);
  const uniq=bits.filter((b,i)=>b!==primary&&bits.indexOf(b)===i);
  const ll=[parseFloat(r.lat),parseFloat(r.lon)];
  let bbox=null;
  if(Array.isArray(r.boundingbox)&&r.boundingbox.length===4){
    const [s,n,w,e]=r.boundingbox.map(parseFloat);
    if([s,n,w,e].every(Number.isFinite)&&n>s&&e>w)bbox=[[s,w],[n,e]];
  }
  return{id:`osm-${r.osm_type||'x'}-${r.osm_id||r.place_id}`,name:String(primary||'').trim(),
    detail:uniq.join(', '),state:a.state||'',country:a.country||'India',type:String(r.type||r.category||'place').replace(/_/g,' '),
    full:String(r.display_name||''),ll,bbox,zoom:12,source:'geocoded',cc:(a.country_code||'in').toLowerCase()};
}

async function fetchOnce(q,signal){
  const url=`${BASE}?${new URLSearchParams({q,format:'jsonv2',countrycodes:'in',addressdetails:'1',limit:'8',dedupe:'1','accept-language':'en'})}`;
  let res;
  try{res=await fetch(url,{signal,headers:{Accept:'application/json'}})}
  catch(e){if(e.name==='AbortError')throw e;throw new GeocodeError('network','Place search could not be reached. Check your internet connection and try again.')}
  if(res.status===429)throw new GeocodeError('rate','The search service is asking us to slow down. Wait a few seconds and try again.');
  if(!res.ok)throw new GeocodeError('http',`The search service returned an error (HTTP ${res.status}). Try again later.`);
  let j;try{j=await res.json()}catch{throw new GeocodeError('parse','The search service returned an unreadable response.')}
  if(!Array.isArray(j))throw new GeocodeError('parse','The search service returned an unexpected response.');
  return j.map(shapeResult).filter(r=>r.name&&r.cc==='in'&&r.ll.every(Number.isFinite));
}

/** Search Indian places. Resolves to an array (possibly empty). Rejects with GeocodeError or AbortError. */
export function searchPlaces(query,{signal}={}){
  const q=normalizeQuery(query);
  if(q.length<MIN_CHARS)return Promise.reject(new GeocodeError('invalid',`Type at least ${MIN_CHARS} characters.`));
  if(!/[\p{L}\p{N}]/u.test(q))return Promise.reject(new GeocodeError('invalid','Enter a place name using letters or numbers.'));
  const key=q.toLowerCase(),hit=cache.get(key);
  if(hit&&Date.now()-hit.t<TTL_MS)return Promise.resolve(hit.v);
  const run=chain.then(async()=>{
    if(signal?.aborted)throw abortErr();
    const again=cache.get(key);if(again&&Date.now()-again.t<TTL_MS)return again.v;
    const gap=MIN_GAP_MS-(Date.now()-lastSent);if(gap>0)await wait(gap,signal);
    lastSent=Date.now();
    try{const out=await fetchOnce(q,signal);remember(key,out);status.state='ok';status.at=Date.now();status.error='';return out}
    catch(e){if(e.name!=='AbortError'){status.state='error';status.at=Date.now();status.error=e.message}throw e}
  });
  chain=run.catch(()=>{});
  return run;
}
