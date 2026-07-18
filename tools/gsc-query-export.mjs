import { createSign } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { basename, join, resolve } from "node:path";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const property = "sc-domain:familytripwise.com";
const defaultOutputDir =
  "/Users/apoorvagarg/Documents/SEO Agent/seo-lab/operator/state/family-tripwise/protected-gsc-query-exports";

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

export function assertProtectedOutputPath(outputDir, publicRepoRoot = rootDir) {
  const resolvedOutput = resolve(outputDir);
  const resolvedRepo = resolve(publicRepoRoot);
  if (resolvedOutput === resolvedRepo || resolvedOutput.startsWith(`${resolvedRepo}/`)) {
    throw new Error("Protected query exports must be written outside the public Family Tripwise repository.");
  }
  return resolvedOutput;
}

export function normalizeQueryRows(rows = []) {
  return rows.map((row) => {
    const impressions = row.impressions ?? 0;
    return {
      page: row.keys?.[0] ?? "UNKNOWN",
      query: row.keys?.[1] ?? "UNKNOWN",
      clicks: row.clicks ?? 0,
      impressions,
      ctr_percent: impressions > 0 ? Number(((row.ctr ?? 0) * 100).toFixed(2)) : null,
      average_position: impressions > 0 ? Number((row.position ?? 0).toFixed(2)) : null,
    };
  });
}

export function buildQueryRequest({ startDate, endDate, pageUrl = null, rowLimit = 25_000 }) {
  const request = {
    startDate,
    endDate,
    dataState: "final",
    type: "web",
    dimensions: ["page", "query"],
    rowLimit,
  };
  if (pageUrl) {
    request.dimensionFilterGroups = [
      {
        filters: [{ dimension: "page", operator: "equals", expression: pageUrl }],
      },
    ];
  }
  return request;
}

export async function latestPublicSnapshot(snapshotDir = join(rootDir, "ops", "gsc-snapshots")) {
  const files = (await readdir(snapshotDir)).filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name)).sort();
  if (files.length === 0) throw new Error("No public GSC snapshots are available for period alignment.");
  const name = files.at(-1);
  const snapshot = JSON.parse(await readFile(join(snapshotDir, name), "utf8"));
  const performance = snapshot.gsc?.performance;
  if (!performance?.period_start || !performance?.period_end) {
    throw new Error(`${name} does not contain a finalized performance period.`);
  }
  return { name, snapshot, startDate: performance.period_start, endDate: performance.period_end };
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
  return apiJson(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`,
    accessToken,
    { method: "POST", body: JSON.stringify(request) },
  );
}

export async function collectProtectedQueryExport({
  credentials,
  outputDir = process.env.FTW_GSC_QUERY_EXPORT_DIR || defaultOutputDir,
  pageUrl = process.env.FTW_GSC_QUERY_PAGE || null,
  now = new Date(),
} = {}) {
  if (!credentials?.client_email || !credentials?.private_key) {
    throw new Error("GSC service-account credentials with client_email and private_key are required.");
  }
  const protectedDir = assertProtectedOutputPath(outputDir);
  const source = await latestPublicSnapshot();
  const accessToken = await getAccessToken(credentials);
  const request = buildQueryRequest({ startDate: source.startDate, endDate: source.endDate, pageUrl });
  const payload = await querySearchAnalytics(accessToken, request);
  const rows = normalizeQueryRows(payload.rows);
  const exportPayload = {
    schema_version: 1,
    site: "family-tripwise",
    property,
    visibility: "protected-query-export",
    collection_mode: "search-console-api-readonly",
    collected_at: now.toISOString(),
    source_public_snapshot: source.name,
    period_start: source.startDate,
    period_end: source.endDate,
    page_filter: pageUrl,
    row_count: rows.length,
    rows,
    private_fields_omitted_from_public_repo: ["complete raw query rows", "country and device rows"],
  };
  await mkdir(protectedDir, { recursive: true, mode: 0o700 });
  const suffix = pageUrl ? `-${basename(pageUrl).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}` : "";
  const outputPath = join(protectedDir, `${source.endDate}${suffix}.json`);
  await writeFile(outputPath, `${JSON.stringify(exportPayload, null, 2)}\n`, { mode: 0o600 });
  return { outputPath, exportPayload };
}

async function main() {
  const rawCredentials = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!rawCredentials) throw new Error("GSC_SERVICE_ACCOUNT_JSON is required.");
  const credentials = JSON.parse(rawCredentials);
  const { outputPath, exportPayload } = await collectProtectedQueryExport({ credentials });
  console.log(`Wrote protected GSC query export to ${outputPath}`);
  console.log(`Rows: ${exportPayload.row_count}; period: ${exportPayload.period_start} to ${exportPayload.period_end}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await main();
}
