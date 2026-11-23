"use client";

export async function postJSON<T = Record<string, unknown>>(url: string, body: unknown): Promise<{ ok: boolean; status: number; data: T & { error?: string } }> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

declare global { interface Window { Razorpay?: new (o: Record<string, unknown>) => { open: () => void } } }

function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/* Opens Razorpay for an existing order. Returns "paid", "cancelled" or an error message. */
export async function payOrder(id: string, email: string, name: string): Promise<"paid" | "cancelled" | string> {
  const created = await postJSON<{ key: string; rzpOrderId: string; amount: number }>("/api/razorpay", { id, email });
  if (!created.ok) return created.data.error || "Online payment is not available right now.";
  if (!(await loadRazorpay()) || !window.Razorpay) return "Could not load the payment window.";
  return new Promise((resolve) => {
    const rz = new window.Razorpay!({
      key: created.data.key, amount: created.data.amount, currency: "INR", name: "Maison Noir", description: `Order ${id}`, order_id: created.data.rzpOrderId,
      prefill: { name, email }, theme: { color: "#d3121e" },
      handler: async (resp: Record<string, string>) => {
        const v = await postJSON("/api/razorpay", { id, email, verify: resp });
        resolve(v.ok ? "paid" : v.data.error || "Payment could not be verified.");
      },
      modal: { ondismiss: () => resolve("cancelled") },
    });
    rz.open();
  });
}
