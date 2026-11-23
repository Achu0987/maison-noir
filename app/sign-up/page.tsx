"use client";
import { useState } from "react";
import PageBanner from "@/components/PageBanner";
import { Btn, Split } from "@/components/ui";
import { postJSON } from "@/lib/client";

export default function SignUp() {
  const [done, setDone] = useState(false);
  return (
    <main>
      <PageBanner title="Sign up" crumb="Sign up" />
      <section className="section">
        <div className="wrap" style={{ maxWidth: 640 }}>
          <Split text="Join Maison Noir" className="display" />
          {done ? (
            <p style={{ marginTop: 28, fontSize: 20 }}>Thank you. We will email you when accounts open.</p>
          ) : (
            <form className="form" style={{ marginTop: 28 }} onSubmit={async (e) => { e.preventDefault(); const f = new FormData(e.currentTarget); const r = await postJSON("/api/forms", { type: "member", name: f.get("name"), email: f.get("email") }); if (r.ok) setDone(true); }}>
              <label className="field">Full name<input name="name" required autoComplete="name" /></label>
              <label className="field">Email<input name="email" type="email" required autoComplete="email" /></label>
              <Btn type="submit" variant="red">Join the list</Btn>
              <p className="note">Customer accounts are coming soon. Join the list and we will let you know.</p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
