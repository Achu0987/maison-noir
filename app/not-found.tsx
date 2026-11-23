import PageBanner from "@/components/PageBanner";
import { Btn } from "@/components/ui";

export default function NotFound() {
  return (
    <main>
      <PageBanner title="Not found" crumb="404" />
      <section className="section"><div className="wrap" style={{ display: "grid", gap: 24, justifyItems: "start" }}><p style={{ fontSize: 20 }}>That page does not exist.</p><Btn href="/shop" variant="red">Back to the shop</Btn></div></section>
    </main>
  );
}
