import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import { bySlug, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = bySlug(slug);
  return { title: p ? `${p.name} | Maison Noir` : "Maison Noir" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();
  return <ProductClient p={p} />;
}
