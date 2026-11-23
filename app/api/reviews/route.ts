import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { clean, read, uid, write } from "@/lib/db";

type Review = { id: string; slug: string; name: string; rating: number; text: string; photo?: string; status: "pending" | "approved" | "rejected"; createdAt: string };

export async function GET(req: Request) {
  const slug = clean(new URL(req.url).searchParams.get("slug"), 80);
  const all = await read<Review[]>("reviews", []);
  const list = all.filter((r) => r.slug === slug && r.status === "approved").sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(({ id, name, rating, text, photo, createdAt }) => ({ id, name, rating, text, photo, createdAt }));
  return NextResponse.json({ reviews: list });
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const slug = clean(b.slug, 80), name = clean(b.name, 60), text = clean(b.text, 1200);
  const rating = Math.max(1, Math.min(5, Math.floor(Number(b.rating) || 0)));
  if (!slug || !name || text.length < 10 || !rating) return NextResponse.json({ error: "Add your name, a rating and at least a sentence." }, { status: 400 });
  let photo: string | undefined;
  if (typeof b.photo === "string" && b.photo.startsWith("data:image/")) {
    const m = /^data:image\/(png|jpeg|webp);base64,(.+)$/.exec(b.photo);
    if (!m) return NextResponse.json({ error: "Photo must be a JPG, PNG or WebP" }, { status: 400 });
    const buf = Buffer.from(m[2], "base64");
    if (buf.length > 2_000_000) return NextResponse.json({ error: "Photo must be under 2 MB" }, { status: 400 });
    const file = `${uid("r", 8)}.${m[1] === "jpeg" ? "jpg" : m[1]}`;
    const dir = path.join(process.cwd(), "public", "uploads", "reviews");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, file), buf);
    photo = `/uploads/reviews/${file}`;
  }
  const all = await read<Review[]>("reviews", []);
  all.push({ id: uid("R", 6), slug, name, rating, text, photo, status: "pending", createdAt: new Date().toISOString() });
  await write("reviews", all);
  return NextResponse.json({ ok: true, message: "Thank you. Your review will appear once it is approved." });
}
