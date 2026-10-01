import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { modelRecords, requireNewOutput } from "./evidence-audit.mjs";

const denied = (source) => [401, 403].includes(source?.http_status) || ["challenge-or-empty-review", "access-denied-carried-forward"].includes(source?.state);
const changed = new Set(["text-changed-review", "structured-price-changed-review"]);
const retrieved = (source) => typeof source?.text_sha256 === "string";
const attempt = (source, audit) => source.last_attempt_at || (source.http_status || source.text_sha256 || denied(source) ? audit.collected_at : null);

export function reviewAudit(current, previous, { expectedRecords = [], expectedUrls = [] } = {}) {
  if (!Array.isArray(current?.pages) || !Array.isArray(current?.sources) || !Array.isArray(previous?.sources) || current.factual_dates_renewed !== false) throw new Error("Invalid audit or automatic fact renewal");
  const sources = new Map(current.sources.map((source) => [source.url, source]));
  const prior = new Map(previous.sources.map((source) => [source.url, source]));
  const pages = new Map(current.pages.map((page) => [page.url, page]));
  if (sources.size !== current.sources.length || prior.size !== previous.sources.length || pages.size !== current.pages.length) throw new Error("Duplicate audit identity");
  if (expectedUrls.length && (pages.size !== expectedUrls.length || expectedUrls.some((url) => !pages.has(url)))) throw new Error("Canonical page coverage mismatch");
  const records = current.pages.flatMap((page) => page.records || []);
  const byId = new Map(records.map((record) => [record.id, record]));
  if (records.length !== byId.size) throw new Error("Duplicate field record");
  for (const expected of expectedRecords) {
    const record = byId.get(expected.id);
    if (!record) throw new Error(`Missing model field: ${expected.id}`);
    const { freshness, ...retained } = record;
    if (JSON.stringify(retained) !== JSON.stringify(expected)) throw new Error(`Model/date/basis drift: ${expected.id}`);
  }
  const requiredSources = new Set([...current.pages.flatMap((page) => page.sources || []), ...records.flatMap((record) => record.source_urls || [])]);
  for (const url of requiredSources) if (!sources.has(url)) throw new Error(`Required source missing from audit: ${url}`);
  let carried = 0, deferred = 0, comparable = 0, newSources = 0;
  for (const source of current.sources) {
    const old = prior.get(source.url);
    if (!old) newSources++;
    if (old && denied(old)) {
      if (source.state !== "access-denied-carried-forward" || attempt(source, current) !== attempt(old, previous)) throw new Error("Denied source retried or attempt date lost");
      carried++;
    }
    if (source.collection_deferred || source.state === "deferred-limit") {
      deferred++;
    }
    if (source.collection_deferred) {
      if (!old || source.text_sha256 !== old.text_sha256 || attempt(source, current) !== attempt(old, previous)) throw new Error("Deferred evidence lost or renewed");
    } else if (retrieved(old) && retrieved(source)) comparable++;
  }
  for (const old of previous.sources) if (denied(old) && !sources.has(old.url)) throw new Error("Prior denial absent from current inventory; reconcile source removal");
  const deferredQueue = current.sources.filter((source) => source.collection_deferred || source.state === "deferred-limit")
    .map((source) => ({ url: source.url, state: source.state, pages: source.pages, last_attempt_at: source.last_attempt_at || null, classification: "deferred-no-new-evidence" }));
  const queue = current.sources.filter((source) => !source.collection_deferred && (changed.has(source.state) || (!retrieved(source) && !["not-fetched", "deferred-limit", "access-denied-carried-forward"].includes(source.state))))
    .map((source) => {
      const affected = records.filter((record) => record.source_urls?.includes(source.url));
      return { url: source.url, state: source.state, pages: source.pages, mapped_record_ids: affected.map((record) => record.id),
        priority: affected.some((record) => /price|room|fee/.test(record.field)) ? 1 : affected.length ? 2 : 3,
        classification: changed.has(source.state) ? "hash-delta-unreconciled-may-be-noise" : "collection-gap-not-factual-change" };
    }).sort((a, b) => a.priority - b.priority || a.url.localeCompare(b.url));
  const due = records.filter((record) => record.freshness?.state !== "within-review-interval")
    .map((record) => ({ id: record.id, page_url: record.page_url, field: record.field, verified_on: record.verified_on, state: record.freshness?.state || "unknown", due_on: record.freshness?.due_on || null }));
  return { schema_version: 1, collected_at: current.collected_at, previous_collected_at: previous.collected_at,
    automatic_fact_renewal: false, automatic_publication: false,
    summary: { canonical_pages: pages.size, sources: sources.size, newly_inventoried_sources: newSources, comparable_retrieved_sources: comparable,
      carried_denials: carried, deferred_sources: deferred, changed_sources: queue.filter((source) => changed.has(source.state)).length,
      collection_gaps: queue.filter((source) => !changed.has(source.state)).length, due_or_unknown_fields: due.length,
      model_records_checked: expectedRecords.length, elapsed_seconds: current.elapsed_seconds },
    source_review_queue: queue, field_review_queue: due, deferred_source_queue: deferredQueue,
    limitations: ["Hash changes include navigation, booking inventory and dynamic text; none is a reconciled fact change.", "Newly inventoried sources are baselines, not growth or proof of fresh claims.", "Unchanged bodies and successful collection never renew property/price/review observation dates.", "Same-day repeat validates workflow controls, not long-term noise rate, complete claim coverage or all-family prices.", "Denied sources remain narrow research gaps; no bypass or new attempt is authorized."] };
}

async function main() {
  const args = process.argv.slice(2);
  const option = (name) => args.includes(name) ? args[args.indexOf(name) + 1] : null;
  const currentPath = option("--current"), previousPath = option("--previous"), output = option("--output");
  if (!currentPath || !previousPath || !output) throw new Error("Require --current, --previous and new --output paths");
  await requireNewOutput(resolve(output));
  const current = JSON.parse(await readFile(currentPath, "utf8"));
  const previous = JSON.parse(await readFile(previousPath, "utf8"));
  const sitemap = await readFile(new URL("../site/sitemap.xml", import.meta.url), "utf8");
  const expectedUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const report = reviewAudit(current, previous, { expectedRecords: modelRecords(), expectedUrls });
  await mkdir(dirname(resolve(output)), { recursive: true });
  await writeFile(output, JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
  console.log(JSON.stringify({ ...report.summary, output }, null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
