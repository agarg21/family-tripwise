import { createHash } from "node:crypto";
import { lstatSync, readFileSync } from "node:fs";
import { dirname, join, parse, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { startSitePreview } from "./preview-site.mjs";

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), "../site");
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

function validatePaths(paths) {
  if (!Array.isArray(paths) || paths.length < 1 || paths.length > 20 ||
      paths.some((path) => typeof path !== "string" ||
        !/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.[A-Za-z0-9]+$/.test(path)) ||
      new Set(paths).size !== paths.length) {
    throw new Error("Provide 1-20 distinct public asset paths, such as /index.html; no URLs, queries or traversal");
  }
}

function publicFileBytes(root, path) {
  const parts = path.slice(1).split("/");
  let file = root;
  for (const [index, part] of parts.entries()) {
    file = join(file, part);
    const stat = lstatSync(file);
    if (stat.isSymbolicLink() || (index < parts.length - 1 ? !stat.isDirectory() : !stat.isFile())) {
      throw new Error("Asset is not a regular public file");
    }
  }
  return readFileSync(file);
}

function validateRoot(root) {
  if (typeof root !== "string" || !root) throw new Error("Invalid preview root");
  const normalized = resolve(root);
  let component = parse(normalized).root;
  for (const part of relative(component, normalized).split(sep).filter(Boolean)) {
    component = join(component, part);
    if (lstatSync(component).isSymbolicLink()) throw new Error("Preview root cannot contain a symlink");
  }
  if (!lstatSync(normalized).isDirectory()) throw new Error("Preview root must be a directory");
  return normalized;
}

export async function preflightPreview({ root = SITE, paths = ["/index.html"], timeoutMs = 3000 } = {}) {
  validatePaths(paths);
  const assetPaths = paths.slice();
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 30000) throw new Error("Invalid preflight timeout");
  const snapshotRoot = validateRoot(root);
  const server = await startSitePreview({ root: snapshotRoot, port: 0 });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const report = {
    scope: "server-only", origin, serverStopped: false,
    browserAccess: "not-checked", rendering: "not-checked", actualBrowserDownload: "not-checked",
    releaseEligible: false, passed: false, checks: []
  };
  try {
    for (const path of assetPaths) {
      const check = { path, passed: false };
      report.checks.push(check);
      try {
        const response = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(timeoutMs), redirect: "error" });
        check.status = response.status;
        const bytes = Buffer.from(await response.arrayBuffer());
        check.bytes = bytes.length;
        check.sha256 = digest(bytes);
        check.contentType = response.headers.get("content-type");
        check.noIndex = response.headers.get("x-robots-tag") === "noindex, nofollow";
        check.noStore = response.headers.get("cache-control") === "no-store";
        check.noSniff = response.headers.get("x-content-type-options") === "nosniff";
        // HTTP parity verifies only the snapshot, never browser permission or layout.
        check.passed = response.status === 200 && check.noIndex && check.noStore && check.noSniff &&
          bytes.equals(publicFileBytes(snapshotRoot, path));
      } catch (error) {
        check.error = error.message;
      }
    }
    report.passed = report.checks.every((check) => check.passed);
  } finally {
    await new Promise((done, reject) => server.close((error) => error ? reject(error) : done()));
    report.serverStopped = true;
  }
  return report;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const paths = process.argv.slice(2);
    const report = await preflightPreview(paths.length ? { paths } : {});
    console.log(JSON.stringify(report, null, 2));
    if (!report.passed) process.exitCode = 1;
  } catch (error) {
    console.error(`Preview preflight failed: ${error.message}`);
    process.exitCode = 1;
  }
}
