// Builds a fully static copy of the storefront for GitHub Pages.
// The API routes (orders, admin, reviews, forms) need a server, so they are left out of this build.
//
//   node scripts/build-static.mjs                              -> ./out-static   (site at the domain root, e.g. user.github.io)
//   BASE=/repo-name node scripts/build-static.mjs              -> ./out-static   (site at user.github.io/repo-name/)
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const BASE = (process.env.BASE || "").replace(/\/$/, "");
const root = process.cwd();
const tmp = path.join(root, "..", ".mn-static-build");
const skip = new Set(["node_modules", ".next", ".next-build", ".git", ".scratch", ".taste-skill", "data", "out", "out-static", "out-base", ".vercel", "scripts"]);

fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });
for (const name of fs.readdirSync(root)) {
  if (skip.has(name) || name.startsWith(".env")) continue;
  fs.cpSync(path.join(root, name), path.join(tmp, name), { recursive: true });
}
// server-only parts
fs.rmSync(path.join(tmp, "app", "api"), { recursive: true, force: true });
fs.rmSync(path.join(tmp, "app", "admin"), { recursive: true, force: true });
const cfg = { output: "export", trailingSlash: true, reactStrictMode: true, images: { unoptimized: true }, ...(BASE ? { basePath: BASE, assetPrefix: BASE } : {}) };
fs.writeFileSync(path.join(tmp, "next.config.mjs"), `export default ${JSON.stringify(cfg)};\n`);
fs.symlinkSync(path.join(root, "node_modules"), path.join(tmp, "node_modules"), "junction");

execSync("npx next build", { cwd: tmp, stdio: "inherit" });

const out = path.join(root, "out-static");
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(tmp, "out"), out, { recursive: true });

if (BASE) {
  // Plain image paths in the code ("/products/x.jpg") are not touched by basePath, so prefix them here.
  const re = /(["'`(=])(\/(?:products|editorial|hero)\/)/g;
  let files = 0;
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== "products" && e.name !== "editorial" && e.name !== "hero") walk(p); continue; }
      if (!/\.(html|js|css|txt)$/.test(e.name)) continue;
      const s = fs.readFileSync(p, "utf8");
      const n = s.replace(re, `$1${BASE}$2`);
      if (n !== s) { fs.writeFileSync(p, n); files++; }
    }
  })(out);
  console.log(`Prefixed image paths in ${files} files with ${BASE}`);
}

fs.writeFileSync(path.join(out, ".nojekyll"), "");
fs.copyFileSync(path.join(out, "404", "index.html"), path.join(out, "404.html"));
fs.rmSync(tmp, { recursive: true, force: true });
console.log("Static site ready in out-static" + (BASE ? ` (base ${BASE})` : ""));
