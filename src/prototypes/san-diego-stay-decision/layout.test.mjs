import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

const DEFAULT_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CHROME_PATH = process.env.CHROME_PATH || DEFAULT_CHROME;

function devtoolsUrl(process) {
  return new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(() => reject(new Error(`Chrome did not expose DevTools. ${output}`)), 10_000);

    process.stderr.on("data", (chunk) => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timeout);
        resolve(match[1]);
      }
    });
    process.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Chrome exited before exposing DevTools (code ${code}). ${output}`));
    });
  });
}

async function connectCdp(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 1;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });

  return {
    close: () => socket.close(),
    send(method, params = {}, sessionId) {
      const id = nextId++;
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
  };
}

async function evaluate(cdp, sessionId, expression) {
  const result = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }, sessionId);
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function waitFor(cdp, sessionId, expression, timeoutMs = 5_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await evaluate(cdp, sessionId, expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for: ${expression}`);
}

test("expanded evidence table scrolls inside the 390px mobile viewport", { skip: !existsSync(CHROME_PATH), timeout: 20_000 }, async (t) => {
  const userDataDir = mkdtempSync(join(tmpdir(), "family-tripwise-chrome-"));
  const chrome = spawn(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--allow-file-access-from-files",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ]);
  let cdp;
  t.after(async () => {
    cdp?.close();
    chrome.kill();
    if (chrome.exitCode === null) await Promise.race([once(chrome, "exit"), delay(2_000)]);
    rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  });

  cdp = await connectCdp(await devtoolsUrl(chrome));
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  await cdp.send("Page.enable", {}, sessionId);
  await cdp.send("Runtime.enable", {}, sessionId);
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  }, sessionId);

  const pageUrl = pathToFileURL(join(import.meta.dirname, "index.html")).href;
  await cdp.send("Page.navigate", { url: pageUrl }, sessionId);
  await waitFor(cdp, sessionId, "document.readyState === 'complete' && Boolean(document.querySelector('#decision-form'))");
  await evaluate(cdp, sessionId, "document.querySelector('#decision-form').requestSubmit()");
  await waitFor(cdp, sessionId, "Boolean(document.querySelector('.candidate-card details'))");
  await evaluate(cdp, sessionId, "document.querySelector('.candidate-card details').open = true");
  await evaluate(cdp, sessionId, "new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))");

  const metrics = await evaluate(cdp, sessionId, `(() => {
    const wrapper = document.querySelector('.candidate-card details .table-wrap');
    const card = document.querySelector('.candidate-card');
    return {
      viewportWidth: document.documentElement.clientWidth,
      pageScrollWidth: document.documentElement.scrollWidth,
      wrapperClientWidth: wrapper.clientWidth,
      wrapperScrollWidth: wrapper.scrollWidth,
      cardRight: card.getBoundingClientRect().right,
    };
  })()`);

  assert.ok(metrics.pageScrollWidth <= metrics.viewportWidth, JSON.stringify(metrics));
  assert.ok(metrics.cardRight <= metrics.viewportWidth, JSON.stringify(metrics));
  assert.ok(metrics.wrapperScrollWidth > metrics.wrapperClientWidth, JSON.stringify(metrics));
});
