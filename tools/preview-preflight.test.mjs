import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { preflightPreview } from "./preview-preflight.mjs";

function fixture(t) {
  const parent = realpathSync(mkdtempSync(join(tmpdir(), "ft-preflight-")));
  const root = join(parent, "site");
  mkdirSync(root);
  mkdirSync(join(root, "downloads"));
  const html = "<h1>Hotels</h1><a href='/downloads/hotels.csv' download>Download</a>";
  const csv = '"Hotel","Budget"\n"Example","USD200-300 per room/night, historical"\n';
  writeFileSync(join(root, "index.html"), html);
  writeFileSync(join(root, "downloads/hotels.csv"), csv);
  writeFileSync(join(parent, "secret.txt"), "private");
  symlinkSync(join(parent, "secret.txt"), join(root, "leak.txt"));
  symlinkSync(parent, join(root, "outside"));
  writeFileSync(join(root, "not-public.bin"), "unknown file type");
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  return { root, html, csv };
}

test("preflight verifies exact HTML/CSV bytes and keeps browser gates uncompleted", async (t) => {
  const { root, html, csv } = fixture(t);
  const report = await preflightPreview({ root, paths: ["/index.html", "/downloads/hotels.csv"] });
  assert.equal(report.passed, true);
  assert.equal(report.scope, "server-only");
  assert.equal(report.serverStopped, true);
  assert.equal(report.releaseEligible, false);
  for (const gate of ["browserAccess", "rendering", "actualBrowserDownload"]) assert.equal(report[gate], "not-checked");
  assert.match(report.origin, /^http:\/\/127\.0\.0\.1:\d+$/);
  for (const [index, expected] of [html, csv].entries()) {
    const check = report.checks[index];
    assert.equal(check.status, 200);
    assert.equal(check.bytes, Buffer.byteLength(expected));
    assert.equal(check.sha256, createHash("sha256").update(expected).digest("hex"));
    assert.equal(check.passed, true);
    assert.ok(check.noIndex && check.noStore && check.noSniff);
  }
  assert.match(report.checks[1].contentType, /^text\/csv/);
  await assert.rejects(fetch(`${report.origin}/index.html`), /fetch failed/);
});

test("missing assets, symlinks and unrecognized extensions fail closed and stop the server", async (t) => {
  const { root } = fixture(t);
  const report = await preflightPreview({ root, paths: ["/missing.html", "/leak.txt", "/outside/secret.txt", "/not-public.bin"] });
  assert.equal(report.passed, false);
  assert.equal(report.serverStopped, true);
  assert.equal(report.releaseEligible, false);
  assert.ok(report.checks.every((check) => !check.passed && check.status === 404));
  await assert.rejects(fetch(`${report.origin}/index.html`), /fetch failed/);
});

test("preflight refuses external URLs, ambiguous routes and duplicate or oversized input", async () => {
  for (const paths of [[], null, "index.html", ["http://localhost:4173/index.html"], ["/../index.html"], ["/.env"],
    ["/outside/%2e%2e/index.html"], ["/index.html?x=1"], ["/index.html#x"], ["//index.html"], ["/x\\index.html"],
    ["/index.html", "/index.html"], Array.from({ length: 21 }, (_, n) => `/file${n}.html`)]) {
    await assert.rejects(preflightPreview({ paths }), /public asset paths/);
  }
  for (const timeoutMs of [0, -1, 1.5, NaN, 30001]) await assert.rejects(preflightPreview({ timeoutMs }), /timeout/);
});

test("preflight refuses symlink-root aliases and ancestor links before serving", async (t) => {
  const { root } = fixture(t);
  const alias = join(root, "outside");
  for (const candidate of [alias, `${alias}/`, `${alias}/.`, `${alias}//`, join(alias, "site")]) {
    await assert.rejects(preflightPreview({ root: candidate }), /symlink/, candidate);
  }
  for (const candidate of ["", null, 3]) await assert.rejects(preflightPreview({ root: candidate }), /root/);
  await assert.rejects(preflightPreview({ root: join(root, "index.html") }), /directory/);
  const normal = await preflightPreview({ root: `${root}/.` });
  assert.equal(normal.passed, true);
  assert.equal(normal.serverStopped, true);
});

test("validated input is snapshotted before asynchronous startup", async (t) => {
  const { root } = fixture(t);
  const paths = ["/index.html"];
  const pending = preflightPreview({ root, paths });
  paths.push("/missing.html");
  const report = await pending;
  assert.equal(report.passed, true);
  assert.deepEqual(report.checks.map((check) => check.path), ["/index.html"]);
  assert.equal(report.serverStopped, true);
});
