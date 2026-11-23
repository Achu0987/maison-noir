"use client";
import PageBanner from "@/components/PageBanner";
import { Btn, Reveal, Split } from "@/components/ui";

export default function Contact() {
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    window.location.href = `mailto:hello@maisonnoir.example?subject=${encodeURIComponent(String(f.get("subject") || "Hello"))}&body=${encodeURIComponent(`From: ${f.get("name")} (${f.get("email")})\n\n${f.get("message")}`)}`;
  };
  return (
    <main>
      <PageBanner title="Contact" crumb="Contact" />
      <section className="section">
        <div className="wrap two" style={{ alignItems: "start" }}>
          <div>
            <Split text="Write to us" className="display" />
            <Reveal delay={0.1}>
              <div className="prose" style={{ marginTop: 26 }}>
                <p>Questions about fit, fabric or an order? We reply within one working day.</p>
                <p><b>Email</b><br />hello@maisonnoir.example</p>
                <p><b>Phone</b><br />+91 98765 43210, 10am to 8pm</p>
                <p><b>Studio</b><br />Chennai, India. Visits by appointment.</p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <form className="form" onSubmit={submit}>
              <label className="field">Name<input name="name" required autoComplete="name" /></label>
              <label className="field">Email<input name="email" type="email" required autoComplete="email" /></label>
              <label className="field">Subject<input name="subject" /></label>
              <label className="field">Message<textarea name="message" required /></label>
              <Btn type="submit" variant="red">Send message</Btn>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
