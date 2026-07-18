import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { assertProtectedOutputPath, buildQueryRequest, latestPublicSnapshot, normalizeQueryRows } from "./gsc-query-export.mjs";

test("refuses to write protected query exports into the public repository", () => {
  assert.throws(
    () => assertProtectedOutputPath("/repo/ops/private", "/repo"),
    /outside the public Family Tripwise repository/,
  );
  assert.equal(assertProtectedOutputPath("/protected/family-tripwise", "/repo"), "/protected/family-tripwise");
});

test("normalizes page-query rows without country or device dimensions", () => {
  assert.deepEqual(
    normalizeQueryRows([{ keys: ["https://familytripwise.com/page.html", "family hotel"], clicks: 1, impressions: 10, ctr: 0.1, position: 7.123 }]),
    [
      {
        page: "https://familytripwise.com/page.html",
        query: "family hotel",
        clicks: 1,
        impressions: 10,
        ctr_percent: 10,
        average_position: 7.12,
      },
    ],
  );
});

test("builds an optional exact-page filter for query exports", () => {
  assert.deepEqual(buildQueryRequest({ startDate: "2026-06-19", endDate: "2026-07-16", pageUrl: "https://familytripwise.com/page.html" }), {
    startDate: "2026-06-19",
    endDate: "2026-07-16",
    dataState: "final",
    type: "web",
    dimensions: ["page", "query"],
    rowLimit: 25_000,
    dimensionFilterGroups: [
      {
        filters: [{ dimension: "page", operator: "equals", expression: "https://familytripwise.com/page.html" }],
      },
    ],
  });
});

test("aligns protected exports to the latest public snapshot period", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ftw-gsc-snapshots-"));
  await mkdir(dir, { recursive: true });
  await writeFile(
    join(dir, "2026-07-18.json"),
    JSON.stringify({ gsc: { performance: { period_start: "2026-06-19", period_end: "2026-07-16" } } }),
    "utf8",
  );
  const source = await latestPublicSnapshot(dir);
  assert.equal(source.name, "2026-07-18.json");
  assert.equal(source.startDate, "2026-06-19");
  assert.equal(source.endDate, "2026-07-16");
});
