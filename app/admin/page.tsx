"use client";
import { useCallback, useEffect, useState } from "react";
import { Btn } from "@/components/ui";
import { inr } from "@/lib/products";

type Order = { id: string; createdAt: string; kind: string; name: string; email: string; phone: string; address: string; items: { name: string; size?: string; qty: number }[]; total: number; status: string; payment: string; paid: boolean };
type Review = { id: string; slug: string; name: string; rating: number; text: string; photo?: string; status: string };
type Data = { orders: Order[]; bookings: Record<string, string>[]; notify: Record<string, string>[]; reviews: Review[]; members: Record<string, string>[]; subscribers: Record<string, string>[]; defaultPassword: boolean };
const TABS = ["Orders", "Reviews", "Bookings", "Restock", "People"] as const;

export default function Admin() {
  const [data, setData] = useState<Data | null>(null);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<(typeof TABS)[number]>("Orders");

  const load = useCallback(async () => {
    const r = await fetch("/api/admin");
    if (r.ok) setData(await r.json()); else setData(null);
  }, []);
  useEffect(() => { load(); }, [load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    const r = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { setPw(""); load(); } else setErr("Wrong password");
  };
  const patch = async (body: object) => { await fetch("/api/admin", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); load(); };
  const logout = async () => { await fetch("/api/admin", { method: "DELETE" }); setData(null); };

  if (!data) {
    return (
      <main className="admin-wrap">
        <form className="form admin-login" onSubmit={login}>
          <h1 className="display" style={{ fontSize: 56 }}>Admin</h1>
          <label className="field">Password<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus required /></label>
          {err && <p role="alert" className="form-err">{err}</p>}
          <Btn type="submit" variant="red">Sign in</Btn>
        </form>
      </main>
    );
  }
  const revenue = data.orders.filter((o) => o.paid || o.payment === "cod").reduce((s, o) => s + o.total, 0);
  return (
    <main className="admin-wrap">
      <div className="wrap">
        <div className="admin-top"><h1 className="display" style={{ fontSize: 56 }}>Dashboard</h1><button className="u" onClick={logout}>Sign out</button></div>
        {data.defaultPassword && <p className="form-err">You are using the default password. Set ADMIN_PASSWORD in .env.local before going live.</p>}
        <div className="admin-stats">
          <div><b className="tnum">{data.orders.length}</b><span>Orders</span></div>
          <div><b className="tnum">{inr(revenue)}</b><span>Order value</span></div>
          <div><b className="tnum">{data.reviews.filter((r) => r.status === "pending").length}</b><span>Reviews to approve</span></div>
          <div><b className="tnum">{data.bookings.length}</b><span>Studio bookings</span></div>
        </div>
        <div className="tabs" role="tablist">{TABS.map((t) => <button key={t} role="tab" aria-selected={t === tab} className={"tab" + (t === tab ? " on" : "")} onClick={() => setTab(t)}>{t}</button>)}</div>

        {tab === "Orders" && (
          <div className="tbl-wrap"><table className="tbl">
            <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
            <tbody>{data.orders.map((o) => (
              <tr key={o.id}>
                <td><b>{o.id}</b><br /><small>{new Date(o.createdAt).toLocaleString("en-IN")}</small></td>
                <td>{o.name}<br /><small>{o.email} {o.phone}</small><br /><small>{o.address}</small></td>
                <td>{o.items.map((i, n) => <div key={n}>{i.name}{i.size ? ` · ${i.size}` : ""} × {i.qty}</div>)}</td>
                <td className="tnum">{inr(o.total)}</td>
                <td>{o.payment === "cod" ? "Cash on delivery" : "Online"} · <button className="u" onClick={() => patch({ type: "order", id: o.id, status: o.status, paid: !o.paid })}>{o.paid ? "Paid" : "Mark paid"}</button></td>
                <td><select className="select" value={o.status} onChange={(e) => patch({ type: "order", id: o.id, status: e.target.value })}>{["Placed", "Packed", "Shipped", "Delivered"].map((s) => <option key={s}>{s}</option>)}</select></td>
              </tr>
            ))}</tbody>
          </table>{data.orders.length === 0 && <p className="empty">No orders yet.</p>}</div>
        )}
        {tab === "Reviews" && (
          <div className="tbl-wrap">{data.reviews.length === 0 && <p className="empty">No reviews yet.</p>}
            {data.reviews.map((r) => (
              <div className="rv-row" key={r.id}>
                {r.photo && <img src={r.photo} alt="" />}
                <div><b>{r.name}</b> · {"★".repeat(r.rating)} · <small>{r.slug}</small><p>{r.text}</p></div>
                <div className="row-tools"><span className="tagpill">{r.status}</span><button className="u" onClick={() => patch({ type: "review", id: r.id, status: "approved" })}>Approve</button><button className="u" onClick={() => patch({ type: "review", id: r.id, status: "rejected" })}>Reject</button></div>
              </div>
            ))}
          </div>
        )}
        {tab === "Bookings" && <Simple rows={data.bookings} cols={["date", "slot", "name", "email", "phone", "people", "note"]} />}
        {tab === "Restock" && <Simple rows={data.notify} cols={["email", "slug", "size", "createdAt"]} />}
        {tab === "People" && <div><h3 className="display" style={{ fontSize: 30 }}>Club members</h3><Simple rows={data.members} cols={["name", "email", "createdAt"]} /><h3 className="display" style={{ fontSize: 30, marginTop: 30 }}>Newsletter</h3><Simple rows={data.subscribers} cols={["email", "createdAt"]} /></div>}
      </div>
    </main>
  );
}

function Simple({ rows, cols }: { rows: Record<string, string>[]; cols: string[] }) {
  if (rows.length === 0) return <p className="empty">Nothing here yet.</p>;
  return <div className="tbl-wrap"><table className="tbl"><thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{cols.map((c) => <td key={c}>{String(r[c] ?? "")}</td>)}</tr>)}</tbody></table></div>;
}
