"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import { useCart } from "@/components/Providers";
import { Btn, Pic } from "@/components/ui";
import { payOrder, postJSON } from "@/lib/client";
import { FREE_SHIP, inr } from "@/lib/products";

export default function Checkout() {
  const router = useRouter();
  const { detailed, subtotal, setQty, clear } = useCart();
  const shipping = subtotal >= FREE_SHIP || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;
  const [pay, setPay] = useState<"cod" | "razorpay">("cod");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setErr("");
    const f = new FormData(e.currentTarget);
    const body = {
      kind: "order", name: f.get("name"), email: f.get("email"), phone: f.get("phone"), address: f.get("address"), note: f.get("note"), payment: pay,
      items: detailed.map((d) => ({ slug: d.product.slug, size: d.line.size, qty: d.line.qty })),
    };
    const r = await postJSON<{ order: { id: string; email: string; name: string } }>("/api/orders", body);
    if (!r.ok) { setErr(r.data.error || "Something went wrong."); setBusy(false); return; }
    const { id, email, name } = r.data.order;
    clear();
    if (pay === "razorpay") await payOrder(id, email, name);
    router.push(`/order?id=${id}&e=${encodeURIComponent(email)}`);
  };

  return (
    <main>
      <PageBanner title="Checkout" crumb="Checkout" />
      <div className="wrap">
        {detailed.length === 0 ? (
          <div className="empty" style={{ padding: "100px 0" }}><p>Your cart is empty.</p><Btn href="/shop" variant="red">Browse the shop</Btn></div>
        ) : (
          <div className="co">
            <form className="form" onSubmit={submit}>
              <label className="field">Full name<input name="name" required autoComplete="name" /></label>
              <label className="field">Email<input name="email" type="email" required autoComplete="email" /></label>
              <label className="field">Phone<input name="phone" type="tel" required autoComplete="tel" /></label>
              <label className="field">Delivery address<textarea name="address" required autoComplete="street-address" /></label>
              <label className="field">Note (optional)<input name="note" /></label>
              <fieldset className="payopt">
                <legend>Payment</legend>
                <label className={pay === "cod" ? "on" : ""}><input type="radio" name="pay" checked={pay === "cod"} onChange={() => setPay("cod")} /> Cash on delivery</label>
                <label className={pay === "razorpay" ? "on" : ""}><input type="radio" name="pay" checked={pay === "razorpay"} onChange={() => setPay("razorpay")} /> Pay online (UPI, cards, netbanking)</label>
              </fieldset>
              {err && <p role="alert" className="form-err">{err}</p>}
              <Btn type="submit" variant="red" disabled={busy}>{busy ? "Placing order…" : `Place order · ${inr(total)}`}</Btn>
              <p className="note">You earn {Math.floor(total / 100)} Noir Club points on this order. Online payment works once Razorpay keys are added to the server. Until then choose cash on delivery.</p>
            </form>
            <aside className="summary" aria-label="Order summary">
              {detailed.map(({ line, product }) => (
                <div className="line" key={line.slug + line.size}>
                  <span className="im"><Pic img={product.images[0]} alt={product.name} /></span>
                  <div>
                    <h3>{product.name}</h3>
                    <p className="small muted">Size {line.size}</p>
                    <div className="qty">
                      <button type="button" aria-label="Decrease quantity" onClick={() => setQty(line.slug, line.size, line.qty - 1)}>−</button>
                      <span>{line.qty}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => setQty(line.slug, line.size, line.qty + 1)}>+</button>
                    </div>
                  </div>
                  <div className="tnum">{inr(product.price * line.qty)}</div>
                </div>
              ))}
              <div className="sub"><span>Delivery</span><span className="tnum">{shipping === 0 ? "Free" : inr(shipping)}</span></div>
              <div className="sub display" style={{ fontSize: 34 }}><span>Total</span><span className="tnum">{inr(total)}</span></div>
              <Link href="/shop" className="u small">Continue shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
