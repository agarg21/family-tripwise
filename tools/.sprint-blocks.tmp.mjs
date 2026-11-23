import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = new URL("../site/", import.meta.url).pathname;
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const srv = createServer((req, res) => { let p = join(root, decodeURIComponent(req.url.split("?")[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html"); if (!existsSync(p)) { res.statusCode = 404; return res.end(); } res.setHeader("content-type", types[extname(p)] ?? "application/octet-stream"); res.end(readFileSync(p)); }).listen(0);
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
for (const u of process.argv.slice(2)) {
await pg.goto(`http://localhost:${srv.address().port}/${u}`, { waitUntil: "load" });
const out = await pg.evaluate(() => ({ H: document.documentElement.scrollHeight, rows: [...document.querySelectorAll("main > *, body > header, body > footer")].map((e) => [e.tagName + (e.id ? "#" + e.id : "") + "." + (e.className || "").split(" ")[0], (e.innerText || "").replace(/\s+/g, " ").slice(0, 50), Math.round(e.getBoundingClientRect().height)]) }));
console.log("==", u, (out.H / 844).toFixed(1), "screens");
for (const [t, txt, h] of out.rows) if (h > 40) console.log((h / 844).toFixed(2).padStart(5), t.padEnd(40), txt);
}
await b.close(); srv.close();
