import {useId,useState,useRef,useEffect} from 'react';
import {Search,Loader2,MapPin,AlertTriangle,RotateCw,X} from 'lucide-react';
import usePlaceSearch from '../hooks/usePlaceSearch';
import {MIN_CHARS} from '../services/geocodeService';
// Accessible search-as-you-pause combobox for any place in India (WAI-ARIA combobox + listbox pattern).
export default function PlaceSearch({label='Search any place in India',placeholder='City, town, village, neighbourhood or landmark…',onSelect,clearOnSelect=true,initial='',autoFocus=false}){
  const id=useId(),lid=id+'-list',sid=id+'-status';
  const s=usePlaceSearch(initial);const [open,setOpen]=useState(false);const [act,setAct]=useState(-1);const box=useRef(),inp=useRef();
  useEffect(()=>{setAct(-1)},[s.results]);
  useEffect(()=>{const h=e=>{if(box.current&&!box.current.contains(e.target))setOpen(false)};document.addEventListener('pointerdown',h);return()=>document.removeEventListener('pointerdown',h)},[]);
  const pick=p=>{onSelect(p);setOpen(false);if(clearOnSelect)s.reset();else s.fill(p.name)};
  const listOpen=open&&s.status==='ok'&&s.results.length>0;
  const key=e=>{
    if(e.key==='ArrowDown'){e.preventDefault();if(!listOpen){setOpen(true);return}setAct(a=>(a+1)%s.results.length)}
    else if(e.key==='ArrowUp'){e.preventDefault();if(listOpen)setAct(a=>(a<=0?s.results.length:a)-1)}
    else if(e.key==='Home'&&listOpen){e.preventDefault();setAct(0)}
    else if(e.key==='End'&&listOpen){e.preventDefault();setAct(s.results.length-1)}
    else if(e.key==='Escape'){if(open){e.preventDefault();setOpen(false)}else if(s.q)s.reset()}
    else if(e.key==='Enter'){e.preventDefault();if(listOpen&&act>=0)pick(s.results[act]);else{setOpen(true);s.searchNow()}}
  };
  const msg=()=>{
    if(s.status==='short'&&s.q.trim())return <p className="ps-msg" id={sid}>Keep typing — at least {MIN_CHARS} characters are needed to search.</p>;
    if(s.status==='loading')return <p className="ps-msg" id={sid}><Loader2 size={15} className="spin" aria-hidden="true"/> Searching places in India…</p>;
    if(s.status==='empty')return <p className="ps-msg warn" id={sid}>No places found for “{s.q.trim()}”. Check the spelling, add the state (for example “Kurnool, Andhra Pradesh”) or try a nearby larger place.</p>;
    if(s.status==='error')return <p className="ps-msg err" id={sid}><AlertTriangle size={15} aria-hidden="true"/> {s.error?.message||'Search failed.'} <button type="button" onClick={s.retry}><RotateCw size={14} aria-hidden="true"/> Retry</button></p>;
    if(s.status==='ok')return <p className="ps-msg" id={sid}>{s.results.length} match{s.results.length===1?'':'es'}{s.results.length>1?' — pick the right one':''}. Use ↑ ↓ and Enter.</p>;
    return <p className="ps-msg" id={sid}>Type a place name, or press Enter to search.</p>;
  };
  return(<div className="ps" ref={box}>
    <label htmlFor={id} className="ps-label">{label}</label>
    <div className="ps-field"><Search size={18} aria-hidden="true"/>
      <input ref={inp} id={id} type="search" role="combobox" autoComplete="off" autoCorrect="off" spellCheck="false" inputMode="search" enterKeyHint="search" autoFocus={autoFocus}
        aria-expanded={listOpen} aria-controls={lid} aria-autocomplete="list" aria-describedby={sid} aria-activedescendant={listOpen&&act>=0?`${id}-o${act}`:undefined}
        placeholder={placeholder} value={s.q} onChange={e=>{s.setQ(e.target.value);setOpen(true)}} onFocus={()=>setOpen(true)} onKeyDown={key}/>
      {s.status==='loading'&&<Loader2 size={18} className="spin" aria-hidden="true"/>}
      {s.q&&<button type="button" className="ps-x" aria-label="Clear search" onClick={()=>{s.reset();inp.current?.focus()}}><X size={16} aria-hidden="true"/></button>}
    </div>
    <div aria-live="polite">{open||s.status==='error'?msg():null}</div>
    {listOpen&&<ul className="ps-list" id={lid} role="listbox" aria-label="Place suggestions">
      {s.results.map((r,i)=><li key={r.id} id={`${id}-o${i}`} role="option" aria-selected={i===act} className={i===act?'act':''}
        onMouseDown={e=>e.preventDefault()} onClick={()=>pick(r)} onMouseMove={()=>setAct(i)}>
        <MapPin size={16} aria-hidden="true"/><span className="ps-txt"><b>{r.name}</b><small>{[r.detail,r.country].filter(Boolean).join(', ')}</small></span><span className="tag">{r.type}</span></li>)}
    </ul>}
  </div>);
}
