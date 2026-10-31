// Design-system guardrail (docs/plan/design-review.md): counts raw colors and font sizes in site/styles.css
// outside the :root token block. tools/design-tokens.test.mjs fails if either count rises above
// tools/design-tokens-baseline.json, so new CSS must use tokens (var(--c-*), var(--t-*)).
// `node tools/design-tokens.mjs --write-baseline` lowers the baseline after a cleanup; it refuses to raise it.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const cssPath = new URL("../site/styles.css", import.meta.url);
export const baselinePath = new URL("./design-tokens-baseline.json", import.meta.url);

export function countRaw(css) {
  const body = css.replace(/:root\s*\{[^}]*\}/, "").replace(/\/\*[\s\S]*?\*\//g, "");
  const colors = (body.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) ?? []).length;
  const fontSizes = (body.match(/font-size\s*:\s*[^;}]+/g) ?? []).filter((d) => !/var\(--t-|inherit|smaller|larger|1em\b|100%/.test(d)).length;
  return { colors, fontSizes };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const now = countRaw(readFileSync(cssPath, "utf8"));
  const base = JSON.parse(readFileSync(baselinePath, "utf8"));
  console.log(`raw colors ${now.colors} (baseline ${base.colors}), raw font sizes ${now.fontSizes} (baseline ${base.fontSizes})`);
  if (process.argv.includes("--write-baseline")) {
    if (now.colors > base.colors || now.fontSizes > base.fontSizes) { console.error("Refusing to raise the baseline: use tokens instead."); process.exit(1); }
    writeFileSync(baselinePath, `${JSON.stringify(now, null, 2)}\n`);
    console.log("Baseline lowered.");
  }
}
