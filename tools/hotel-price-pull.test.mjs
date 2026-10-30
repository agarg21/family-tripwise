import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, access, writeFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateRequest, runRequest, hotelRows, RESERVE_PER_SEARCH_USD, MAX_SEARCHES } from "./hotel-price-pull.mjs";
import { cumulativeSpend } from "./seo-opportunity-pull.mjs";

const today = "2026-10-30";
const base = { label: "coral-4n", keyword: "Atlantis The Coral", location_coordinate: "25.0866,-77.3233", check_in: "2027-01-11", check_out: "2027-01-15", adults: 2, children: [5, 8], match: "Coral" };
const request = { action: "G12", purpose: "test", hotel_searches: [base, { ...base, label: "coral-1n", check_out: "2027-01-12" }] };
const ok = (items, cost = 0.003) => async () => new Response(JSON.stringify({ cost, tasks: [{ status_code: 20000, result: [{ datetime: "2026-10-30 09:00:00 +00:00", items }] }] }));
const item = (title, price) => ({ type: "hotel_search_item", title, stars: 4, is_paid: false, prices: { price, price_without_discount: null, currency: "USD", discount_text: "23% less than usual", visitors: 4, check_in: "2027-01-11", check_out: "2027-01-15" } });

test("valid request computes nights and a conservative reserve from code", () => {
  const r = validateRequest(request, { today, priorSpend: 0.4 });
  assert.equal(r.searches[0].nights, 4); assert.equal(r.searches[1].nights, 1);
  assert.equal(r.reserved, 2 * RESERVE_PER_SEARCH_USD);
});

test("rejects past, impossible or oversized stays, bad parties and extra fields", () => {
  const bad = [
    { ...base, check_in: "2026-10-29" }, { ...base, check_in: "2027-02-30" }, { ...base, check_out: base.check_in },
    { ...base, check_out: "2027-03-01" }, { ...base, adults: 0 }, { ...base, children: [18] }, { ...base, children: [1, 2, 3, 4, 5] },
    { ...base, match: "" }, { ...base, label: "Bad Label" }, { ...base, location_coordinate: "Nassau" }, { ...base, keyword: " x" }, { ...base, price: 1 },
  ];
  for (const s of bad) assert.throws(() => validateRequest({ ...request, hotel_searches: [s] }, { today, priorSpend: 0 }), undefined, JSON.stringify(s));
  assert.throws(() => validateRequest({ ...request, budget: 99 }, { today, priorSpend: 0 }), /Unexpected request field/);
  assert.throws(() => validateRequest({ ...request, action: "FT-RES-001" }, { today, priorSpend: 0 }), /action/);
  assert.throws(() => validateRequest({ ...request, hotel_searches: [base, { ...base }] }, { today, priorSpend: 0 }), /Duplicate/);
  assert.throws(() => validateRequest({ ...request, hotel_searches: Array.from({ length: MAX_SEARCHES + 1 }, (_, i) => ({ ...base, label: `s${i}` })) }, { today, priorSpend: 0 }));
  assert.throws(() => validateRequest(request, { today, priorSpend: 19.95 }), /Budget/);
});

test("receipt keeps dated rows, matched hotels, cost and the stated limitations", async () => {
  const dir = await mkdtemp(join(tmpdir(), "tripwise-hotel-"));
  try {
    const out = join(dir, "dataforseo-x-2026-10-30.json");
    const req = validateRequest(request, { today, priorSpend: 0.4 });
    let body;
    const report = await runRequest(req, out, { auth: "test-only", fetcher: async (_u, init) => { body = JSON.parse(init.body)[0]; return ok([item("Atlantis The Coral", 512), item("Atlantis The Royal", 640), { type: "ad" }])(); } });
    assert.deepEqual(body.children, [5, 8]); assert.equal(body.currency, "USD"); assert.equal(body.depth, 18);
    assert.equal(report.searches.length, 2);
    assert.equal(report.searches[0].matched.length, 1); assert.equal(report.searches[0].matched_count, 1);
    assert.ok(report.limitations.some((l) => /not verified savings/.test(l))); assert.equal(report.searches[0].matched[0].price, 512);
    assert.equal(report.searches[0].results.length, 2);
    assert.deepEqual(report.searches[0].party, { adults: 2, child_ages: [5, 8] });
    assert.ok(report.limitations.some((l) => /per night or for the whole stay/.test(l)));
    assert.equal(report.total_cost_usd, 0.006);
    assert.deepEqual(JSON.parse(await readFile(out, "utf8")), report);
    await assert.rejects(runRequest(req, out, { auth: "t", fetcher: async () => { throw new Error("no"); } }), /already exists/);
    // The ledger counts this receipt toward cumulative spend.
    assert.ok(Math.abs((await cumulativeSpend(dir)) - 0.406) < 1e-9);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("provider failure stops without retry and the ledger reserves the unknown call", async () => {
  const dir = await mkdtemp(join(tmpdir(), "tripwise-hotel-fail-"));
  try {
    const out = join(dir, "r.json");
    let calls = 0;
    const req = validateRequest(request, { today, priorSpend: 1 });
    await assert.rejects(runRequest(req, out, { auth: "t", fetcher: async () => { calls++; throw new Error("network"); } }), /no automatic paid retry/);
    assert.equal(calls, 1);
    const saved = JSON.parse(await readFile(out, "utf8"));
    assert.equal(saved.calls[0].status, "outcome-unknown");
    assert.ok(Math.abs((await cumulativeSpend(dir)) - 1.05) < 1e-9);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("rows treat missing, zero or negative prices as unknown, never free", () => {
  const { rows } = hotelRows({ tasks: [{ result: [{ items: [{ type: "hotel_search_item", title: "X", prices: { price: -1 } }, { type: "hotel_search_item", title: "Y" }, { type: "hotel_search_item", title: "Z", prices: { price: 0, price_without_discount: 0 } }] }] }] });
  assert.equal(rows[0].price, null); assert.equal(rows[1].price, null); assert.equal(rows[2].price, null); assert.equal(rows[2].price_without_discount, null);
});

test("location: exactly one of a geo code or a coordinate, sent as given", async () => {
  const { location_coordinate, ...noCoord } = base;
  assert.throws(() => validateRequest({ ...request, hotel_searches: [noCoord] }, { today, priorSpend: 0 }), /exactly one/);
  assert.throws(() => validateRequest({ ...request, hotel_searches: [{ ...base, location_code: 2044 }] }, { today, priorSpend: 0 }), /exactly one/);
  assert.throws(() => validateRequest({ ...request, hotel_searches: [{ ...noCoord, location_code: "2044" }] }, { today, priorSpend: 0 }), /location code/);
  const req = validateRequest({ ...request, hotel_searches: [{ ...noCoord, location_code: 2044 }] }, { today, priorSpend: 0 });
  const dir = await mkdtemp(join(tmpdir(), "tripwise-hotel-loc-"));
  try {
    let body;
    const r = await runRequest(req, join(dir, "r.json"), { auth: "t", fetcher: async (_u, init) => { body = JSON.parse(init.body)[0]; return ok([])(); } });
    assert.equal(body.location_code, 2044); assert.equal("location_coordinate" in body, false);
    assert.deepEqual(r.searches[0].location, { location_code: 2044 });
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("committed hotel price requests validate (prior spend at the floor)", async () => {
  const dir = new URL("../ops/research-requests/", import.meta.url);
  for (const name of await readdir(dir)) {
    if (!name.endsWith(".json")) continue;
    const json = JSON.parse(await readFile(new URL(name, dir), "utf8"));
    if (!json.hotel_searches) continue;
    const day = name.match(/(20\d\d-\d\d-\d\d)\.json$/)[1];
    assert.doesNotThrow(() => validateRequest(json, { today: day, priorSpend: 0.4 }), name);
  }
});
