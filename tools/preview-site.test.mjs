import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { request } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { startSitePreview } from "./preview-site.mjs";

async function fixture(t) {
  const parent = mkdtempSync(join(tmpdir(), "ft-preview-"));
  const root = join(parent, "site");
  mkdirSync(root);
  mkdirSync(join(root, "where-to-stay"));
  mkdirSync(join(root, ".private"));
  writeFileSync(join(root, "index.html"), "<h1>Preview</h1>");
  writeFileSync(join(root, "where-to-stay/hotel.html"), "<details><summary>Hotel</summary>Room</details>");
  writeFileSync(join(root, "styles.css"), "body{color:black}");
  writeFileSync(join(root, "app.mjs"), "export const preview = true;");
  writeFileSync(join(root, ".private/secret.txt"), "private");
  writeFileSync(join(root, ".env"), "private");
  writeFileSync(join(parent, "secret.txt"), "private");
  symlinkSync(join(parent, "secret.txt"), join(root, "leak.txt"));
  symlinkSync(parent, join(root, "outside"));
  const server = await startSitePreview({ root, port: 0 });
  t.after(async () => {
    await new Promise((done) => server.close(done));
    rmSync(parent, { recursive: true, force: true });
  });
  const port = server.address().port;
  const get = (path, { method = "GET", headers = {} } = {}) => new Promise((resolve, reject) => {
    const req = request({ hostname: "127.0.0.1", port, path, method, headers }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }));
    });
    req.on("error", reject);
    req.end();
  });
  return { get, root, server, port };
}

test("preview binds loopback and serves immutable public HTML/CSS/module snapshots", async (t) => {
  const { get, root, server } = await fixture(t);
  assert.equal(server.address().address, "127.0.0.1");
  const home = await get("/");
  assert.equal(home.status, 200);
  assert.equal(home.body, "<h1>Preview</h1>");
  assert.equal(home.headers["cache-control"], "no-store");
  assert.equal(home.headers["x-robots-tag"], "noindex, nofollow");
  assert.match((await get("/styles.css?v=1")).headers["content-type"], /^text\/css/);
  assert.match((await get("/app.mjs")).headers["content-type"], /^text\/javascript/);
  assert.equal((await get("/where-to-stay/hotel.html")).status, 200);
  assert.equal((await get("/index.html", { method: "HEAD" })).body, "");
  writeFileSync(join(root, "index.html"), "changed");
  assert.equal((await get("/")).body, home.body);
});

test("preview rejects filesystem paths, traversal, malformed paths, hidden files and symlinks", async (t) => {
  const { get } = await fixture(t);
  for (const path of ["/../secret.txt", "/%2e%2e/secret.txt", "/where-to-stay/%2e%2e/index.html", "/.env", "/.private/secret.txt", "/%00", "/%zz", "/foo%5cbar", "http://example.com/"]) {
    assert.equal((await get(path)).status, 400, path);
  }
  for (const path of ["/secret.txt", "/leak.txt", "/outside/secret.txt", "/where-to-stay/", "/AGENTS.md", "/ops/seo-roadmap.json"]) {
    assert.equal((await get(path)).status, 404, path);
  }
});

test("preview rejects writes, foreign hosts and cross-origin requests", async (t) => {
  const { get, port } = await fixture(t);
  for (const method of ["POST", "PUT", "DELETE", "OPTIONS"]) assert.equal((await get("/", { method })).status, 405);
  assert.equal((await get("/", { headers: { Host: `evil.example:${port}` } })).status, 403);
  assert.equal((await get("/", { headers: { Origin: "https://example.com" } })).status, 403);
  assert.equal((await get("/", { headers: { "Sec-Fetch-Site": "cross-site" } })).status, 403);
  assert.equal((await get("/", { headers: { Origin: `http://127.0.0.1:${port}` } })).status, 200);
});

test("preview refuses invalid ports", async () => {
  for (const port of [-1, 65536, NaN, 1.5]) await assert.rejects(startSitePreview({ port }), /Invalid preview port/);
});

test("preview refuses a symlink root and reports an occupied port", async (t) => {
  const { root, port } = await fixture(t);
  await assert.rejects(startSitePreview({ root: join(root, "outside"), port: 0 }), /symlink/);
  await assert.rejects(startSitePreview({ root, port }), { code: "EADDRINUSE" });
});

test("real preview serves affected pages and stylesheet byte-for-byte", async (t) => {
  const server = await startSitePreview({ port: 0 });
  t.after(() => new Promise((done) => server.close(done)));
  for (const path of ["where-to-stay/san-antonio-family-hotels.html", "where-to-stay/chicago-family-hotels.html", "styles.css"]) {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/${path}`);
    assert.equal(response.status, 200);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), readFileSync(new URL(`../site/${path}`, import.meta.url)));
  }
});
