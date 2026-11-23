import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { Pic, Reveal } from "@/components/ui";
import { posts } from "@/lib/products";

export const metadata = { title: "Blog | Maison Noir" };

export default function Blog() {
  return (
    <main>
      <PageBanner title="Our blog" crumb="Blog" />
      <section className="section">
        <div className="wrap blogs">
          {posts.map((b, i) => (
            <Reveal key={b.slug} delay={i * 0.1}>
              <Link href={`/blog/${b.slug}`} className="post" data-cursor="Read">
                <div className="im"><Pic img={b.image} alt={b.title} /></div>
                <div className="tx">
                  <span className="by"><b>{b.cat}</b> / By {b.by} / {b.date}</span>
                  <h3>{b.title}</h3>
                  <p>{b.excerpt}</p>
                  <span className="more-link">Read more <i /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
