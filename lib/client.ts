"use client";

export async function postJSON<T = Record<string, unknown>>(url: string, body: unknown): Promise<{ ok: boolean; status: number; data: T & { error?: string } }> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      // The static GitHub Pages build has no server, so API calls come back as a page, not JSON.
      return { ok: false, status: res.status, data: { error: "This is the static preview of the site, so orders, bookings and forms are switched off here." } as T & { error?: string } };
    }
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: "Could not reach the server. Please try again." } as T & { error?: string } };
  }
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
