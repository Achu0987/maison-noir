import type { Metadata } from "next";
import "./globals.css";
import "./site.css";
import "./features.css";
import "./type.css";
import "./fx.css";
import "./hero2.css";
import "./more.css";
import Providers from "@/components/Providers";
import { CartDrawer, Cursor, Floaters, Footer, Header, MenuPanel, QuickView, SearchOverlay, SizeGuide } from "@/components/Chrome";

export const metadata: Metadata = {
  title: "Maison Noir | Unisex tailoring, knitwear, denim and outerwear",
  description: "Small-run unisex tailoring, knitwear, denim and outerwear in black and earth tones. Free delivery over ₹10,000.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Hanken+Grotesk:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&display=swap" rel="stylesheet" />
        <noscript><style>{`[data-reveal]{opacity:1!important;transform:none!important}.mask>span{transform:none!important}`}</style></noscript>
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
          <MenuPanel />
          <SearchOverlay />
          <CartDrawer />
          <QuickView />
          <SizeGuide />
          <Cursor />
          <Floaters />
        </Providers>
      </body>
    </html>
  );
}
