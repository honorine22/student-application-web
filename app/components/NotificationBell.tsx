"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, FileText, Receipt, X } from "lucide-react";
import { client } from "../../sanity/lib/client";
import { toast } from "sonner";

type Notification = { _id: string; title: string; message: string; type?: string; isRead?: boolean; createdAt?: string; link?: string };

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    client.fetch<Notification[]>(`*[_type == "notification"] | order(createdAt desc)[0...20]{_id,title,message,type,isRead,createdAt,link}`)
      .then(setItems).catch(() => undefined);
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => panel.current && !panel.current.contains(event.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const markAllRead = async () => {
    const unread = items.filter((item) => !item.isRead);
    if (!unread.length) return;
    const previous = items;
    setItems(items.map((item) => ({ ...item, isRead: true })));
    try {
      let transaction = client.transaction();
      unread.forEach((item) => { transaction = transaction.patch(item._id, { set: { isRead: true } }); });
      await transaction.commit();
    } catch {
      setItems(previous);
      toast.error("Notifications could not be updated.");
    }
  };

  const unread = items.filter((item) => !item.isRead).length;
  return (
    <div className="notification-wrap" ref={panel}>
      <button className="icon-button" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} aria-expanded={open} onClick={() => setOpen(!open)}>
        <Bell size={19} />{unread > 0 && <span className="notification-badge">{unread > 9 ? "9+" : unread}</span>}
      </button>
      {open && <div className="notification-panel" role="dialog" aria-label="Notifications">
        <div className="notification-head"><div><span className="eyebrow">Updates</span><h3>Notifications</h3></div><button className="icon-button small" aria-label="Close notifications" onClick={() => setOpen(false)}><X size={16}/></button></div>
        {unread > 0 && <button className="mark-read" onClick={markAllRead}><CheckCheck size={15}/> Mark all as read</button>}
        <div className="notification-list">
          {items.length === 0 ? <div className="empty-notifications"><Bell size={24}/><p>No notifications yet.</p></div> : items.map((item) => <a href={item.link || "#"} key={item._id} className={`notification-item ${item.isRead ? "" : "unread"}`}>
            <span className="notification-icon">{item.type === "payment" ? <Receipt size={17}/> : <FileText size={17}/>}</span><span><strong>{item.title}</strong><small>{item.message}</small><time>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently"}</time></span>
          </a>)}
        </div>
      </div>}
    </div>
  );
}

