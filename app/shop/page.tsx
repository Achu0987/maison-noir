import { Suspense } from "react";
import ShopClient from "./ShopClient";
import PageBanner from "@/components/PageBanner";

export const metadata = { title: "Shop | Maison Noir" };

export default function ShopPage() {
  return (
    <main>
      <PageBanner title="The shop" crumb="Shop" />
      <Suspense fallback={null}><ShopClient /></Suspense>
    </main>
  );
}
