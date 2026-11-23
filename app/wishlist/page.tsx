"use client";
import PageBanner from "@/components/PageBanner";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/Providers";
import { Btn } from "@/components/ui";
import { bySlug } from "@/lib/products";

export default function Wishlist() {
  const { wish } = useCart();
  const items = wish.map(bySlug).filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <main>
      <PageBanner title="Wishlist" crumb="Wishlist" />
      <section className="section">
        <div className="wrap">
          {items.length === 0 ? (
            <div className="empty"><p>Nothing saved yet. Tap the heart on any piece to keep it here.</p><Btn href="/shop" variant="red">Browse the shop</Btn></div>
          ) : (
            <div className="grid4">{items.map((p, i) => <ProductCard key={p.slug} p={p} i={i} />)}</div>
          )}
        </div>
      </section>
    </main>
  );
}
