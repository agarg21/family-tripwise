import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), "../site");
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".pdf": "application/pdf"
};

export function createSitePreviewServer(root = SITE) {
  if (lstatSync(root).isSymbolicLink()) throw new Error("Preview root cannot be a symlink");
  const assets = new Map();
  // Snapshot public assets only. Requests never resolve paths or read the filesystem.
  function collect(directory, prefix = "") {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.isSymbolicLink()) continue;
      const path = join(directory, entry.name);
      const route = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) collect(path, route);
      else if (entry.isFile() && TYPES[extname(entry.name)]) {
        assets.set(route, { bytes: readFileSync(path), type: TYPES[extname(entry.name)] });
      }
    }
  }
  collect(root);
  return createServer((request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Robots-Tag", "noindex, nofollow");
    const fail = (status) => { response.writeHead(status); response.end(); };
    if (request.headers.host !== `127.0.0.1:${request.socket.localPort}`) return fail(403);
    if (request.headers.origin && request.headers.origin !== `http://${request.headers.host}`) return fail(403);
    if (request.headers["sec-fetch-site"] === "cross-site") return fail(403);
    if (!["GET", "HEAD"].includes(request.method)) {
      response.setHeader("Allow", "GET, HEAD");
      return fail(405);
    }
    let route;
    try { route = decodeURIComponent((request.url ?? "").split("?")[0]); }
    catch { return fail(400); }
    if (!route.startsWith("/") || route.includes("\\") || route.includes("\0") ||
        route.split("/").some((part) => part.startsWith("."))) return fail(400);
    if (route.endsWith("/")) route += "index.html";
    const asset = assets.get(route);
    if (!asset) return fail(404);
    response.writeHead(200, { "Content-Type": asset.type, "Content-Length": asset.bytes.length });
    response.end(request.method === "HEAD" ? undefined : asset.bytes);
  });
}

export async function startSitePreview({ port = 4173, root = SITE } = {}) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error("Invalid preview port");
  const server = createSitePreviewServer(root);
  await new Promise((resolveStarted, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolveStarted);
  });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = process.argv[2] === undefined ? 4173 : Number(process.argv[2]);
  try {
    const server = await startSitePreview({ port });
    console.log(`Site-only preview: http://127.0.0.1:${server.address().port}/`);
    console.log("Snapshot of site/ only. Restart after generating or editing pages. Ctrl-C to stop.");
    for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => server.close());
  } catch (error) {
    console.error(`Preview failed: ${error.message}`);
    process.exitCode = 1;
  }
}
