import PageBanner from "@/components/PageBanner";

export const metadata = { title: "Privacy policy | Maison Noir" };

export default function Privacy() {
  return (
    <main>
      <PageBanner title="Privacy policy" crumb="Privacy policy" />
      <section className="section">
        <div className="wrap">
          <div className="prose">
            <p className="muted">Placeholder text. Have this reviewed before launch.</p>
            <h2 className="display">What we collect</h2>
            <p>When you place an order or write to us we collect your name, email, phone number and delivery address. We use them only to fulfil your order and answer your questions.</p>
            <h2 className="display">How we use it</h2>
            <p>We do not sell your data. We share your delivery details with our courier and payment details with our payment provider, and with no one else.</p>
            <h2 className="display">Your choices</h2>
            <p>You can ask us to correct or delete your data at any time by writing to hello@maisonnoir.example.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
