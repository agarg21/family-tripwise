import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { extname, join } from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = new URL("../site/", import.meta.url).pathname;
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
const srv = createServer((req, res) => { let p = join(root, decodeURIComponent(req.url.split("?")[0])); if (!existsSync(p)) { res.statusCode = 404; return res.end(); } res.setHeader("content-type", types[extname(p)] ?? "application/octet-stream"); res.end(readFileSync(p)); }).listen(0);
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 800 } });
for (const u of process.argv.slice(2)) { await pg.goto(`http://localhost:${srv.address().port}/${u}`, { waitUntil: "load" });
console.log(u, await pg.evaluate(() => [".tap-link-list", ".tap-card-list", ".source-section > details.hotel-card"].map((s) => { const e = document.querySelector(s); return e ? `${s}=${Math.round(e.getBoundingClientRect().width)}` : `${s}=none`; }).join(" "))); }
await b.close(); srv.close();
