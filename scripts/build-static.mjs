// Builds a fully static copy of the storefront for GitHub Pages.
// The API routes (orders, admin, reviews, forms) need a server, so they are left out of this build.
// Usage: node scripts/build-static.mjs  ->  writes ./out-static
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const root = process.cwd();
const tmp = path.join(root, "..", ".mn-static-build");
const skip = new Set(["node_modules", ".next", ".next-build", ".git", ".scratch", ".taste-skill", "data", "out", "out-static", ".vercel", "scripts"]);

fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });
for (const name of fs.readdirSync(root)) {
  if (skip.has(name) || name.startsWith(".env")) continue;
  fs.cpSync(path.join(root, name), path.join(tmp, name), { recursive: true });
}
// server-only parts
fs.rmSync(path.join(tmp, "app", "api"), { recursive: true, force: true });
fs.rmSync(path.join(tmp, "app", "admin"), { recursive: true, force: true });
fs.writeFileSync(path.join(tmp, "next.config.mjs"), `export default { output: "export", trailingSlash: true, reactStrictMode: true, images: { unoptimized: true } };\n`);
fs.symlinkSync(path.join(root, "node_modules"), path.join(tmp, "node_modules"), "junction");

execSync("npx next build", { cwd: tmp, stdio: "inherit", env: { ...process.env, NEXT_PUBLIC_STATIC: "1" } });

const out = path.join(root, "out-static");
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(tmp, "out"), out, { recursive: true });
fs.writeFileSync(path.join(out, ".nojekyll"), "");
fs.copyFileSync(path.join(out, "404", "index.html"), path.join(out, "404.html"));
fs.rmSync(tmp, { recursive: true, force: true });
console.log("Static site ready in out-static");
