export type Img = { src: string; pos?: string; scale?: number };
export type Product = {
  slug: string; name: string; category: string; gender: "Men" | "Women" | "Unisex";
  price: number; compareAt?: number; sku: string; stock: number; tag?: "On Sale" | "New" | "Hot";
  fabric: string; blurb: string; images: Img[]; sizes: string[]; details: string[]; care: string; soldOut?: string[];
};

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const FREE_SHIP = 10000;
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export const products: Product[] = [
  {
    slug: "noir-leather-biker-jacket", name: "Noir Leather Biker Jacket", category: "Jackets", gender: "Unisex", price: 18900, compareAt: 22500, sku: "MN-JK-0101", stock: 6, tag: "On Sale", soldOut: ["XS", "XXL"],
    fabric: "Full-grain lambskin leather",
    blurb: "A compact biker in soft, grained lambskin. Asymmetric zip, four zip pockets and a collar that stands up on its own.",
    images: [{ src: "/products/leather-1.jpg", pos: "50% 64%", scale: 1.9 }, { src: "/products/leather-2.jpg", pos: "50% 64%", scale: 1.9 }], sizes: SIZES,
    details: ["Full-grain lambskin, cotton lining", "Asymmetric YKK zip", "Four zip pockets", "Slim, cropped unisex block"],
    care: "Leather clean only. Store on a wide hanger away from direct sun.",
  },
  {
    slug: "indigo-chore-jacket", name: "Indigo Chore Jacket", category: "Jackets", gender: "Unisex", price: 7900, sku: "MN-JK-0102", stock: 14, tag: "New",
    fabric: "12oz rigid indigo denim",
    blurb: "A workwear chore jacket in rigid indigo denim with four patch pockets and a printed cotton lining. Fades to your own wear.",
    images: [{ src: "/products/denim-jacket.jpg", pos: "50% 36%", scale: 1.3 }], sizes: SIZES,
    details: ["12oz rigid indigo denim", "Four patch pockets", "Printed cotton lining", "Corozo buttons"],
    care: "Wash rarely, cold, inside out. Hang to dry.",
  },
  {
    slug: "eclipse-long-puffer", name: "Eclipse Long Puffer", category: "Jackets", gender: "Unisex", price: 14900, compareAt: 17900, sku: "MN-JK-0103", stock: 9, tag: "Hot", soldOut: ["XXL"],
    fabric: "Recycled nylon, down fill",
    blurb: "A long quilted coat with a storm collar that sits high on the jaw. Warm without the bulk, cut loose enough to wear over tailoring.",
    images: [{ src: "/products/puffer.jpg", pos: "56% 66%", scale: 1.7 }, { src: "/products/puffer-2.jpg", pos: "58% 66%", scale: 1.7 }], sizes: SIZES,
    details: ["Water-resistant recycled nylon shell", "Responsibly sourced down and feather fill", "Two-way front zip with storm flap", "Hidden zip pockets"],
    care: "Dry clean or gentle wash at 30°C. Do not tumble dry hot.",
  },
  {
    slug: "sable-pinstripe-blazer", name: "Sable Pinstripe Blazer", category: "Suit", gender: "Unisex", price: 16800, sku: "MN-ST-0201", stock: 8, soldOut: ["XS", "S"],
    fabric: "Wool blend, half canvas",
    blurb: "A single-breasted blazer in a fine black pinstripe wool. Soft shoulder, half-canvas chest and a clean notch lapel.",
    images: [{ src: "/products/blazer.jpg", pos: "50% 52%" }], sizes: SIZES,
    details: ["Wool blend suiting, fully lined", "Half-canvas construction", "Four-button working cuffs", "Two flap pockets, one chest pocket"],
    care: "Dry clean only. Steam to refresh. Store on a wide hanger.",
  },
  {
    slug: "linen-oxford-shirt", name: "Linen Oxford Shirt", category: "Shirts", gender: "Unisex", price: 6400, compareAt: 7800, sku: "MN-SH-0301", stock: 22, tag: "On Sale",
    fabric: "Washed European linen",
    blurb: "A relaxed shirt in washed linen that softens with every wear. Horn-effect buttons, one chest pocket, a collar that stands on its own.",
    images: [{ src: "/products/shirt.jpg", pos: "40% 50%" }], sizes: SIZES,
    details: ["100% washed linen", "Horn-effect buttons", "Relaxed unisex block", "Pre-washed, minimal shrinkage"],
    care: "Machine wash cold. Line dry. Iron damp for a crisp finish.",
  },
  {
    slug: "everyday-crew-tee", name: "Everyday Crew Tee", category: "T-Shirts", gender: "Unisex", price: 2900, sku: "MN-TS-0401", stock: 60,
    fabric: "260gsm combed cotton",
    blurb: "The tee we wanted and could not find: dense, boxy through the body and cut with a collar that does not stretch out.",
    images: [{ src: "/products/tee.jpg", pos: "50% 55%", scale: 1.25 }, { src: "/products/tee-flat.jpg", pos: "50% 52%", scale: 1.8 }], sizes: SIZES,
    details: ["260gsm combed ring-spun cotton", "Garment dyed", "Rib collar with taped neck", "Boxy unisex fit"],
    care: "Machine wash cold, inside out. Tumble dry low.",
  },
  {
    slug: "heavyweight-v-neck-tee", name: "Heavyweight V-Neck Tee", category: "T-Shirts", gender: "Unisex", price: 3200, sku: "MN-TS-0402", stock: 41, tag: "New",
    fabric: "280gsm pima cotton",
    blurb: "A deep, clean V in dense pima cotton. Sits flat under a shirt and holds its shape after a year of washing.",
    images: [{ src: "/products/tee-vneck.jpg", pos: "50% 45%" }], sizes: SIZES,
    details: ["280gsm pima cotton", "Deep V neckline", "Tubular body, no side seams", "Pre-shrunk"],
    care: "Machine wash cold. Tumble dry low.",
  },
  {
    slug: "studio-folded-tee", name: "Studio Cotton Tee", category: "T-Shirts", gender: "Unisex", price: 2600, compareAt: 3200, sku: "MN-TS-0403", stock: 33, tag: "On Sale",
    fabric: "220gsm slub cotton",
    blurb: "A lighter slub-cotton tee in an off-white that looks better the more it is worn. Easy through the shoulder, soft from day one.",
    images: [{ src: "/products/tee-dark.jpg", pos: "50% 50%", scale: 1.1 }], sizes: SIZES,
    details: ["220gsm slub cotton", "Off-white garment dye", "Rib crew neck", "Relaxed unisex fit"],
    care: "Machine wash cold. Tumble dry low.",
  },
  {
    slug: "merino-knit-pullover", name: "Merino Knit Pullover", category: "Sweater", gender: "Unisex", price: 9800, compareAt: 11800, sku: "MN-SW-0501", stock: 12, tag: "On Sale", soldOut: ["S"],
    fabric: "Extra-fine merino wool",
    blurb: "A fine-gauge merino pullover in earthy tones. Light enough to layer, warm enough to wear alone.",
    images: [{ src: "/products/knit-beige.jpg", pos: "50% 55%" }, { src: "/products/knit.jpg", pos: "50% 40%" }], sizes: SIZES,
    details: ["100% extra-fine merino wool", "Fine 12-gauge knit", "Ribbed collar, cuffs and hem", "Naturally temperature regulating"],
    care: "Hand wash cold with wool detergent. Dry flat.",
  },
  {
    slug: "chunky-cable-knit", name: "Chunky Cable Knit", category: "Sweater", gender: "Unisex", price: 10900, sku: "MN-SW-0502", stock: 10, tag: "New",
    fabric: "Lambswool and cotton blend",
    blurb: "A heavy cable knit in oat and charcoal. Roomy, textured and made to be worn for years.",
    images: [{ src: "/products/knit-stack.jpg", pos: "50% 50%" }], sizes: SIZES,
    details: ["Lambswool and cotton blend", "Cable and rib stitch", "Drop shoulder", "Ribbed funnel neck"],
    care: "Hand wash cold. Dry flat. Do not wring.",
  },
  {
    slug: "stonewash-relaxed-jeans", name: "Stonewash Relaxed Jeans", category: "Jeans", gender: "Unisex", price: 8400, sku: "MN-JN-0601", stock: 18,
    fabric: "11oz cotton denim",
    blurb: "A relaxed, stonewashed jean already broken in. Easy through the leg and soft from the first day.",
    images: [{ src: "/products/denim.jpg", pos: "60% 55%" }, { src: "/products/jeans.jpg", pos: "50% 50%", scale: 1.1 }], sizes: SIZES,
    details: ["11oz stonewashed cotton denim", "Relaxed fit, full length", "Button fly", "Pre-washed, no shrinkage"],
    care: "Machine wash cold. Tumble dry low.",
  },
  {
    slug: "raw-selvedge-jeans", name: "Raw Selvedge Jeans", category: "Jeans", gender: "Unisex", price: 8900, compareAt: 10500, sku: "MN-JN-0602", stock: 16, tag: "On Sale",
    fabric: "12oz Japanese selvedge denim",
    blurb: "A straight leg in deep indigo that fades to your own wear pattern. Mid rise, a little room through the thigh, clean at the hem.",
    images: [{ src: "/products/jeans-trio.jpg", pos: "50% 50%", scale: 1.35 }], sizes: SIZES,
    details: ["12oz Japanese selvedge denim", "Mid rise, straight leg", "Copper rivets, five-pocket", "Unwashed, will shrink slightly"],
    care: "Wash rarely, cold, inside out. Hang to dry.",
  },
];

export const categories = [
  { slug: "T-Shirts", image: { src: "/products/tee-vneck.jpg", pos: "50% 45%" } },
  { slug: "Sweater", image: { src: "/products/knit-beige.jpg", pos: "50% 55%" } },
  { slug: "Suit", image: { src: "/products/blazer.jpg", pos: "50% 52%" } },
  { slug: "Shirts", image: { src: "/products/shirt.jpg", pos: "40% 50%" } },
  { slug: "Jeans", image: { src: "/products/denim.jpg", pos: "60% 55%" } },
  { slug: "Jackets", image: { src: "/products/denim-jacket.jpg", pos: "50% 36%", scale: 1.3 } },
];

export const bySlug = (s: string) => products.find((p) => p.slug === s);
export const onSale = products.filter((p) => p.compareAt);

export function recommendSize(heightCm: number, weightKg: number) {
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  let i = heightCm < 158 ? 0 : heightCm < 166 ? 1 : heightCm < 174 ? 2 : heightCm < 182 ? 3 : heightCm < 190 ? 4 : 5;
  if (bmi > 25.5) i += 1;
  if (bmi > 29) i += 1;
  if (bmi < 18.2) i -= 1;
  return SIZES[Math.max(0, Math.min(5, i))];
}

export const services = [
  { t: "Free Delivery", d: "Free shipping on all orders over ₹10,000", icon: "truck" },
  { t: "Online Support", d: "Style help on chat, 10am to 8pm daily", icon: "support" },
  { t: "Money Return", d: "14-day returns on unworn pieces", icon: "return" },
  { t: "Secure Payment", d: "UPI, cards and netbanking, all encrypted", icon: "card" },
] as const;

export const posts = [
  { slug: "how-to-layer-a-puffer", cat: "Style Notes", by: "Studio Team", date: "12 Nov 2026", title: "How to layer a long puffer without the bulk", image: { src: "/editorial/e06.jpg", pos: "50% 35%" }, excerpt: "Start with a fine knit, keep the trouser straight and let the coat do the volume. Four combinations that work every time.", body: ["A long puffer does the heavy lifting, so everything underneath it should stay lean. Start with a fine-gauge knit or a heavyweight tee, never two thick layers.", "Keep the trouser straight or relaxed. A tapered leg under a long coat makes the whole outfit look top-heavy.", "Finish with one dark, matte shoe and nothing else shiny. The coat is the statement."] },
  { slug: "denim-care-guide", cat: "Care", by: "Studio Team", date: "02 Nov 2026", title: "Denim care: wash less, fade better", image: { src: "/products/jeans-trio.jpg", pos: "50% 50%", scale: 1.3 }, excerpt: "Raw and selvedge denim rewards patience. Here is how often to wash, how to dry and when to leave it alone.", body: ["Raw denim needs a few months before its first wash. Wear it, move in it, and let it take your shape.", "When you do wash, turn it inside out, use cold water and hang it to dry. Never tumble.", "Stains can be spot-cleaned with a soft brush. The less water, the longer the indigo holds."] },
  { slug: "capsule-wardrobe", cat: "Wardrobe", by: "Studio Team", date: "24 Oct 2026", title: "Twelve pieces, one capsule wardrobe", image: { src: "/editorial/e13.jpg", pos: "50% 28%" }, excerpt: "A short list of clothes that all work together: why we make fewer things and how to choose what to keep.", body: ["A capsule wardrobe is not about owning less for its own sake. It is about owning clothes that all go with each other.", "Choose one colour family, build outward in texture, and buy the best cloth you can afford for the pieces you wear most.", "Our whole collection is built to be mixed. Any knit works with any trouser, and any coat works with all of it."] },
];

export const faqs = [
  { q: "How long does delivery take?", a: "Orders ship in 2 working days. Delivery takes 3 to 6 working days across India. You will get tracking by email and SMS." },
  { q: "What is your returns policy?", a: "You can return any unworn piece with tags within 14 days of delivery. Refunds go back to the original payment method." },
  { q: "How do I find my size?", a: "Every product page has a size finder. Enter your height and weight and we suggest a size. Our block is unisex and relaxed, so size down for a closer fit." },
  { q: "Do you ship internationally?", a: "Not yet. We currently ship within India only. Join the newsletter to hear when international shipping opens." },
  { q: "How should I care for my clothes?", a: "Care instructions are on every product page. As a rule: wash cold, wash less and dry flat or on a line." },
  { q: "Can I change or cancel an order?", a: "Yes, within 12 hours of placing it. Write to us with your order number and we will sort it out." },
];

export const reviews = [
  { name: "Sample Reviewer", item: "Eclipse Long Puffer", text: "Warm, long and exactly as pictured. The collar sits properly and the zip never catches. Sample review text, replace with real customer feedback." },
  { name: "Sample Reviewer", item: "Indigo Chore Jacket", text: "The denim is heavy and the fit is easy over a knit. Sample review text, replace with real customer feedback." },
  { name: "Sample Reviewer", item: "Merino Knit Pullover", text: "Soft, light and no itch at all. I wear it every week. Sample review text, replace with real customer feedback." },
];
