import { createSign } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const monitorPath = join(rootDir, "ops", "gsc-monitor.json");
const outputDir = join(rootDir, "ops", "gsc-snapshots");
const property = "sc-domain:familytripwise.com";

export function base64url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function buildServiceAccountAssertion(credentials, nowSeconds = Math.floor(Date.now() / 1000)) {
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: nowSeconds,
      exp: nowSeconds + 3600,
    }),
  );
  const unsigned = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  return `${unsigned}.${base64url(signer.sign(credentials.private_key))}`;
}

export function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function performanceWindow(now = new Date()) {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 2));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);
  return { startDate: isoDate(start), endDate: isoDate(end) };
}

export function finalizedThroughFromProbe(payload, fallbackDate) {
  const firstIncomplete = payload?.metadata?.first_incomplete_date;
  if (!firstIncomplete) return { date: fallbackDate, basis: "conservative-two-day-lag" };
  const cutoff = new Date(`${firstIncomplete}T00:00:00Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() - 1);
  return { date: isoDate(cutoff), basis: "gsc-first-incomplete-date" };
}

export function summarizeInspection(url, payload) {
  const result = payload?.inspectionResult?.indexStatusResult ?? {};
  const indexed = result.verdict === "PASS";
  return {
    url,
    indexed,
    verdict: result.verdict ?? "UNKNOWN",
    coverage_state: result.coverageState ?? "UNKNOWN",
    indexing_state: result.indexingState ?? "UNKNOWN",
    page_fetch_state: result.pageFetchState ?? "UNKNOWN",
    robots_txt_state: result.robotsTxtState ?? "UNKNOWN",
    last_crawl_time: result.lastCrawlTime ?? null,
  };
}

export function normalizePageRows(rows = []) {
  return rows.map((row) => {
    const impressions = row.impressions ?? 0;
    return {
      url: row.keys?.[0] ?? "UNKNOWN",
      clicks: row.clicks ?? 0,
      impressions,
      ctr_percent: impressions > 0 ? Number(((row.ctr ?? 0) * 100).toFixed(2)) : null,
      average_position: impressions > 0 ? Number((row.position ?? 0).toFixed(2)) : null,
    };
  });
}

export function normalizeAggregate(row = {}) {
  const impressions = row.impressions ?? 0;
  return {
    latest_known_impressions: impressions,
    latest_known_clicks: row.clicks ?? 0,
    latest_known_ctr_percent: impressions > 0 ? Number(((row.ctr ?? 0) * 100).toFixed(2)) : null,
    latest_known_average_position: impressions > 0 ? Number((row.position ?? 0).toFixed(2)) : null,
  };
}

export function validatePublicSnapshot(snapshot, allowedUrls) {
  const required = ["schema_version", "site", "property", "visibility", "collection_mode", "collected_at", "data_through", "gsc"];
  for (const field of required) {
    if (snapshot[field] === undefined || snapshot[field] === null || snapshot[field] === "") {
      throw new Error(`Snapshot is missing required field: ${field}`);
    }
  }
  if (snapshot.visibility !== "public-summary" || snapshot.site !== "family-tripwise" || snapshot.property !== property) {
    throw new Error("Snapshot identity or visibility is invalid for the public Family Tripwise repository.");
  }
  if (snapshot.gsc?.priority_inspection?.indexing_requested !== false) {
    throw new Error("Public snapshots must record that indexing was not requested.");
  }
  const serialized = JSON.stringify(snapshot);
  for (const forbiddenKey of ["access_token", "refresh_token", "private_key", "client_email", "query_rows", "raw_queries"]) {
    if (new RegExp(`"${forbiddenKey}"\\s*:`).test(serialized)) {
      throw new Error(`Snapshot contains forbidden field: ${forbiddenKey}`);
    }
  }
  if (!(allowedUrls instanceof Set) || allowedUrls.size === 0) {
    throw new Error("A non-empty checked-in URL allowlist is required for snapshot validation.");
  }
  const publicRows = [
    ...(snapshot.gsc?.performance?.page_rows ?? []).map((item) => item.url),
    ...(snapshot.gsc?.priority_inspection?.urls ?? []).map((item) => item.url),
    ...(snapshot.gsc?.priority_inspection?.unknown_urls ?? []),
  ];
  for (const url of publicRows) {
    if (!allowedUrls.has(url)) {
      throw new Error(`Snapshot contains a URL outside the checked-in allowlist: ${url}`);
    }
  }
  return true;
}

async function apiJson(url, accessToken, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: options.signal ?? AbortSignal.timeout(30_000),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${url} returned ${response.status}: ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : {};
}

async function getAccessToken(credentials) {
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: buildServiceAccountAssertion(credentials),
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(30_000),
  });
  const payload = await response.json();
  if (!response.ok || !payload.access_token) {
    throw new Error(`OAuth token exchange failed (${response.status}): ${JSON.stringify(payload)}`);
  }
  return payload.access_token;
}

async function querySearchAnalytics(accessToken, request) {
  const encodedProperty = encodeURIComponent(property);
  return apiJson(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedProperty}/searchAnalytics/query`,
    accessToken,
    { method: "POST", body: JSON.stringify(request) },
  );
}

async function getSitemap(accessToken, sitemapUrl) {
  return apiJson(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    accessToken,
  );
}

async function inspectUrl(accessToken, url) {
  return apiJson("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", accessToken, {
    method: "POST",
    body: JSON.stringify({ inspectionUrl: url, siteUrl: property, languageCode: "en-US" }),
  });
}

export function sitemapCounts(payload) {
  const contents = payload.contents ?? [];
  return {
    discovered_pages: contents
      .filter((item) => item.type === "web")
      .reduce((sum, item) => sum + Number(item.submitted ?? 0), 0),
    discovered_videos: contents
      .filter((item) => item.type === "video")
      .reduce((sum, item) => sum + Number(item.submitted ?? 0), 0),
  };
}

export function sitemapStatus(payload) {
  if (payload.isPending) return "Pending";
  if (Number(payload.errors ?? 0) > 0) return "Error";
  if (Number(payload.warnings ?? 0) > 0) return "Warning";
  return "Success";
}

async function publicUrlAllowlist(monitor) {
  const sitemap = await readFile(join(rootDir, "site", "sitemap.xml"), "utf8");
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
  return new Set([...sitemapUrls, ...monitor.urls]);
}

export function renderMarkdown(snapshot) {
  const performance = snapshot.gsc.performance;
  const inspection = snapshot.gsc.priority_inspection;
  const lines = [
    "# Family Tripwise GSC Snapshot",
    "",
    `- Collected: ${snapshot.collected_at}`,
    `- Finalized performance data through: ${snapshot.data_through}`,
    `- Collection mode: ${snapshot.collection_mode}`,
    `- Sitemap: ${snapshot.gsc.sitemap_status}; ${snapshot.gsc.discovered_pages} discovered pages; last read ${snapshot.gsc.sitemap_last_read ?? "UNKNOWN"}`,
    `- 28-day performance: ${performance.latest_known_impressions} impressions, ${performance.latest_known_clicks} clicks, ${performance.latest_known_ctr_percent ?? "UNKNOWN"}${performance.latest_known_ctr_percent === null ? "" : "%"} CTR, average position ${performance.latest_known_average_position ?? "UNKNOWN"}`,
    `- Priority URL Inspection: ${inspection.indexed} of ${inspection.inspected} indexed; ${inspection.unknown} unknown`,
    `- Indexing requested: no`,
    "",
    "## Page-level performance",
    "",
    "| Page | Clicks | Impressions | CTR | Position |",
    "|---|---:|---:|---:|---:|",
  ];
  for (const row of performance.page_rows) {
    const ctr = row.ctr_percent === null ? "UNKNOWN" : `${row.ctr_percent}%`;
    lines.push(`| ${row.url} | ${row.clicks} | ${row.impressions} | ${ctr} | ${row.average_position ?? "UNKNOWN"} |`);
  }
  lines.push(
    "",
    "This public summary intentionally omits credentials, complete raw query exports, and country/device rows.",
    "",
  );
  return lines.join("\n");
}

export async function collectSnapshot({ credentials, monitor, now = new Date() }) {
  const accessToken = await getAccessToken(credentials);
  const fallbackWindow = performanceWindow(now);
  const probeStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7));
  const probePayload = await querySearchAnalytics(accessToken, {
    startDate: isoDate(probeStart),
    endDate: isoDate(now),
    dataState: "all",
    type: "web",
    dimensions: ["date"],
    rowLimit: 10,
  });
  const finalizedThrough = finalizedThroughFromProbe(probePayload, fallbackWindow.endDate);
  const finalizedEnd = new Date(`${finalizedThrough.date}T00:00:00Z`);
  const window = performanceWindow(new Date(finalizedEnd.getTime() + 2 * 86_400_000));
  const aggregatePayload = await querySearchAnalytics(accessToken, {
    ...window,
    dataState: "final",
    type: "web",
    rowLimit: 1,
  });
  const pagePayload = await querySearchAnalytics(accessToken, {
    ...window,
    dataState: "final",
    type: "web",
    dimensions: ["page"],
    rowLimit: 100,
  });
  const sitemapPayload = await getSitemap(accessToken, monitor.sitemap);
  const inspectionRows = [];
  for (const url of monitor.urls) {
    inspectionRows.push(summarizeInspection(url, await inspectUrl(accessToken, url)));
  }

  const aggregate = normalizeAggregate(aggregatePayload.rows?.[0]);
  const counts = sitemapCounts(sitemapPayload);
  const indexed = inspectionRows.filter((item) => item.indexed).length;
  const unknownRows = inspectionRows.filter((item) => item.verdict === "UNKNOWN");
  const notIndexedRows = inspectionRows.filter((item) => !item.indexed && item.verdict !== "UNKNOWN");
  return {
    schema_version: 1,
    site: "family-tripwise",
    property,
    visibility: "public-summary",
    collection_mode: "search-console-api-readonly",
    collected_at: now.toISOString(),
    data_through: window.endDate,
    requested_period_end: fallbackWindow.endDate,
    completeness: finalizedThrough.basis === "gsc-first-incomplete-date" ? "finalized" : "finalized-conservative",
    finalization_basis: finalizedThrough.basis,
    gsc: {
      sitemap_status: sitemapStatus(sitemapPayload),
      sitemap_last_read: sitemapPayload.lastDownloaded ?? null,
      sitemap_errors: Number(sitemapPayload.errors ?? 0),
      sitemap_warnings: Number(sitemapPayload.warnings ?? 0),
      ...counts,
      performance: {
        status: "finalized",
        period_start: window.startDate,
        period_end: window.endDate,
        ...aggregate,
        snapshot_date: window.endDate,
        page_rows: normalizePageRows(pagePayload.rows),
      },
      priority_inspection: {
        inspected: inspectionRows.length,
        indexed,
        not_indexed: notIndexedRows.length,
        not_indexed_urls: notIndexedRows.map((item) => item.url),
        unknown: unknownRows.length,
        unknown_urls: unknownRows.map((item) => item.url),
        indexing_requested: false,
        urls: inspectionRows,
      },
    },
    private_fields_omitted: ["credentials", "complete raw query rows", "country and device rows"],
  };
}

async function main() {
  if (process.argv.includes("--validate-existing")) {
    const monitor = JSON.parse(await readFile(monitorPath, "utf8"));
    const allowedUrls = await publicUrlAllowlist(monitor);
    const files = (await readdir(outputDir)).filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name)).sort();
    for (const name of files) validatePublicSnapshot(JSON.parse(await readFile(join(outputDir, name), "utf8")), allowedUrls);
    console.log(`Validated ${files.length} public GSC snapshot files.`);
    return;
  }
  const rawCredentials = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!rawCredentials) throw new Error("GSC_SERVICE_ACCOUNT_JSON is required.");
  const credentials = JSON.parse(rawCredentials);
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("GSC_SERVICE_ACCOUNT_JSON must contain client_email and private_key.");
  }
  const monitor = JSON.parse(await readFile(monitorPath, "utf8"));
  const snapshot = await collectSnapshot({ credentials, monitor });
  validatePublicSnapshot(snapshot, await publicUrlAllowlist(monitor));
  const date = snapshot.collected_at.slice(0, 10);
  await writeFile(join(outputDir, `${date}.json`), `${JSON.stringify(snapshot, null, 2)}\n`);
  await writeFile(join(outputDir, `${date}.md`), renderMarkdown(snapshot));
  console.log(`Wrote normalized GSC snapshot for ${date} using data through ${snapshot.data_through}.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await main();
}
