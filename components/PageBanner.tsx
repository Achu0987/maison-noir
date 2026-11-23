import Link from "next/link";
import { Split } from "./ui";

export default function PageBanner({ title, crumb }: { title: string; crumb: string }) {
  return (
    <section className="pbanner" aria-label={title}>
      <div className="wrap">
        <Split tag="h1" text={title} className="display" immediate delay={0.2} stagger={0.1} />
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>{crumb}</span></nav>
      </div>
    </section>
  );
}
