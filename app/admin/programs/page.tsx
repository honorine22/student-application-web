"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { client } from "../../../sanity/lib/client";
import AdminSidebar from "../AdminSidebar";
import { PROGRAMS, TRAINING_LOCATIONS, trainingLocationValue } from "../../lib/admissions";

type Program = {_id?:string;title:string;description:string;isActive:boolean;restrictedLocation:string;sortOrder:number;isDefault?:boolean};
const blank:Program={title:"",description:"",isActive:true,restrictedLocation:"",sortOrder:10};
const defaults:Program[]=PROGRAMS.map((p,i)=>({title:p.label,description:"Existing admissions program",isActive:true,restrictedLocation:"restrictedLocation" in p?p.restrictedLocation:"",sortOrder:i+1,isDefault:true}));

export default function ProgramsPage(){
 const [saved,setSaved]=useState<Program[]>([]),[draft,setDraft]=useState<Program>(blank),[open,setOpen]=useState(false),[saving,setSaving]=useState(false);
 useEffect(()=>{client.fetch<Program[]>(`*[_type=="program"]|order(sortOrder asc,title asc){_id,title,description,isActive,restrictedLocation,sortOrder}`).then(setSaved).catch(()=>toast.error("Programs could not be loaded."))},[]);
 const items=useMemo(()=>{const titles=new Set(saved.map(p=>p.title.toLowerCase()));return [...defaults.filter(p=>!titles.has(p.title.toLowerCase())),...saved].sort((a,b)=>a.sortOrder-b.sortOrder||a.title.localeCompare(b.title))},[saved]);
 const showNew=()=>{setDraft({...blank,sortOrder:items.length+1});setOpen(true)};
 const showEdit=(p:Program)=>{setDraft({...p,_id:p.isDefault?undefined:p._id});setOpen(true)};
 const save=async()=>{if(!draft.title.trim())return toast.error("Program name is required.");setSaving(true);try{const now=new Date().toISOString(),data={title:draft.title.trim(),description:draft.description,isActive:draft.isActive,restrictedLocation:draft.restrictedLocation,sortOrder:Number(draft.sortOrder)||10,updatedAt:now};if(draft._id){await client.patch(draft._id).set(data).commit();setSaved(list=>list.map(p=>p._id===draft._id?{...p,...data}:p))}else{const made=await client.create({_type:"program",...data,createdAt:now});setSaved(list=>[...list,made as Program])}setOpen(false);toast.success("Program saved.")}catch{toast.error("Program could not be saved.")}finally{setSaving(false)}};
 const remove=async(p:Program)=>{if(!p._id)return;try{await client.delete(p._id);setSaved(list=>list.filter(x=>x._id!==p._id));toast.success("Program removed.")}catch{toast.error("Program could not be removed.")}};
 return <main className="dashboard min-h-screen bg-etp-surface lg:grid lg:grid-cols-[235px_1fr]">
  <AdminSidebar active="programs"/><section className="dashboard-main min-w-0 p-4 sm:p-6 lg:p-9">
   <header className="dashboard-header"><div><span className="eyebrow">Program management</span><h1>Programs</h1><p>Control what applicants can study and where each program is available.</p></div></header>
   <section className="program-page-table"><header><div><h2>All programs</h2><span>{items.length} programs available to applicants</span></div><button className="button button-dark" onClick={showNew}><Plus/>New program</button></header>
    <div className="table-scroll"><table className="applications-table"><thead><tr><th>Program</th><th>Availability</th><th>Study location</th><th>Order</th><th>Actions</th></tr></thead><tbody>{items.map(p=><tr key={p._id||`default-${p.title}`}><td><strong>{p.title}</strong><small>{p.description||"No description"}</small></td><td><span className={p.isActive?"program-live":"program-off"}>{p.isActive?"Active":"Inactive"}</span></td><td>{p.restrictedLocation||"All locations"}</td><td>{p.sortOrder}</td><td><div className="inline-actions"><button onClick={()=>showEdit(p)}><Pencil/>Edit</button>{!p.isDefault&&<button className="danger" onClick={()=>remove(p)}><Trash2/>Remove</button>}</div></td></tr>)}</tbody></table></div>
   </section>
  </section>
  {open&&<div className="program-modal-backdrop" onMouseDown={()=>setOpen(false)}><form className="program-page-form program-modal" onSubmit={e=>{e.preventDefault();save()}} onMouseDown={e=>e.stopPropagation()}>
   <header className="program-modal-header"><div><span className="eyebrow">{draft._id||draft.isDefault?"Edit program":"New program"}</span><h2>{draft._id||draft.isDefault?"Update program":"Add a program"}</h2></div><button type="button" className="program-modal-close" onClick={()=>setOpen(false)} aria-label="Close"><X/></button></header>
   <label className="field"><span>Program name *</span><input value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/></label>
   <label className="field"><span>Description</span><textarea rows={3} value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})}/></label>
   <div className="program-modal-fields"><label className="field"><span>Required study location</span><select value={draft.restrictedLocation} onChange={e=>setDraft({...draft,restrictedLocation:e.target.value})}><option value="">All locations</option>{TRAINING_LOCATIONS.map(x=><option key={`${x.district}-${x.name}`} value={trainingLocationValue(x)}>{x.name} · {x.district}</option>)}</select></label><label className="field"><span>Display order</span><input type="number" value={draft.sortOrder} onChange={e=>setDraft({...draft,sortOrder:Number(e.target.value)})}/></label></div>
   <label className="program-toggle"><input type="checkbox" checked={draft.isActive} onChange={e=>setDraft({...draft,isActive:e.target.checked})}/>Accepting applications</label>
   <div className="program-modal-actions"><button type="button" className="button button-ghost" onClick={()=>setOpen(false)}>Cancel</button><button className="button button-lime" disabled={saving}>{saving?"Saving…":"Save program"}<Check/></button></div>
  </form></div>}
 </main>
}
