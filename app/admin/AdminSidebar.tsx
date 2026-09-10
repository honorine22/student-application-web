"use client";
import { Bell, BookOpen, LayoutDashboard, LogOut, Receipt, Users } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function AdminSidebar({active,count=0}:{active:"overview"|"applications"|"payments"|"programs"|"notifications";count?:number}){
 return <aside className="dashboard-sidebar hidden h-screen flex-col border-r border-black/10 bg-white lg:sticky lg:top-0 lg:flex"><a href="/" className="brand dashboard-brand"><span className="brand-mark">E</span><span>ETP <small>Admissions</small></span></a><nav><span>Workspace</span><a href="/admin" className={active==="overview"?"active":""}><LayoutDashboard/>Overview</a><a href="/admin?view=applications" className={active==="applications"?"active":""}><Users/>Applications {count>0&&<b>{count}</b>}</a><a href="/admin?view=payments" className={active==="payments"?"active":""}><Receipt/>Payment review</a><a href="/admin/programs" className={active==="programs"?"active":""}><BookOpen/>Programs</a><a href="/admin/notifications" className={active==="notifications"?"active":""}><Bell/>Notifications</a></nav><div className="sidebar-user"><span>EA</span><div><strong>ETP Admin</strong><small>Admissions team</small></div><button className="sidebar-logout" onClick={()=>signOut(auth).then(()=>window.location.href="/login")} aria-label="Log out"><LogOut/></button></div></aside>
}
