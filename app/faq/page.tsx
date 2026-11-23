import PageBanner from "@/components/PageBanner";
import { Reveal } from "@/components/ui";
import { faqs } from "@/lib/products";

export const metadata = { title: "FAQ | Maison Noir" };

export default function FAQ() {
  return (
    <main>
      <PageBanner title="FAQ" crumb="FAQ" />
      <section className="section">
        <div className="wrap" style={{ maxWidth: 980 }}>
          <div className="acc">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <details open={i === 0}><summary>{f.q}</summary><div className="body">{f.a}</div></details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
