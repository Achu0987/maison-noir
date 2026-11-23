import Link from "next/link";
import { notFound } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import { Pic, Reveal } from "@/components/ui";
import { posts } from "@/lib/products";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const next = posts.filter((p) => p.slug !== slug);
  return (
    <main>
      <PageBanner title={post.title} crumb={post.cat} />
      <section className="section">
        <div className="wrap" style={{ display: "grid", gap: 48, justifyItems: "center" }}>
          <Reveal className="img-reveal"><div style={{ width: "min(980px, 100%)", aspectRatio: "16/9" }}><Pic img={post.image} alt={post.title} /></div></Reveal>
          <div className="prose">
            <p className="muted small">By {post.by} / {post.date}</p>
            {post.body.map((t, i) => <p key={i}>{t}</p>)}
          </div>
          <div className="prose" style={{ width: "100%" }}>
            <h2 className="display">Keep reading</h2>
            {next.map((n) => <Link key={n.slug} href={`/blog/${n.slug}`} className="u" style={{ fontSize: 22 }}>{n.title}</Link>)}
          </div>
        </div>
      </section>
    </main>
  );
}
