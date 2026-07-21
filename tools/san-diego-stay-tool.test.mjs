import assert from "node:assert/strict";
import test from "node:test";

import { buildStayChecklist } from "../site/san-diego-stay-tool.mjs";

test("builds a bounded default beach-and-driving checklist", () => {
  const result = buildStayChecklist({ primary: "beach", transport: "driving" });

  assert.match(result.summary, /usable beach access/);
  assert.equal(result.checks.length, 3);
  assert.equal(new Set(result.checks).size, result.checks.length);
  assert.ok(result.checks.some((check) => check.includes("property-to-usable-beach")));
  assert.ok(result.checks.some((check) => check.includes("parking availability and cost")));
});

test("adds every selected family constraint without declaring a universal best area", () => {
  const result = buildStayChecklist({
    primary: "car-light",
    transport: "car-light",
    needs: ["stroller", "nap", "kitchen", "nap"],
  });

  assert.equal(result.checks.length, 6);
  assert.equal(new Set(result.checks).size, result.checks.length);
  assert.ok(result.checks.some((check) => check.includes("stroller-storage rules")));
  assert.ok(result.checks.some((check) => check.includes("actual nap window")));
  assert.ok(result.checks.some((check) => check.includes("guest-laundry access")));
  assert.match(result.summary, /two area-and-hotel combinations/);
  assert.doesNotMatch(result.summary, /best area|recommend|UNKNOWN/i);
});

test("rejects unsupported decision inputs", () => {
  assert.throws(
    () => buildStayChecklist({ primary: "unknown", transport: "driving" }),
    /Unsupported primary constraint/,
  );
  assert.throws(
    () => buildStayChecklist({ primary: "value", transport: "teleport" }),
    /Unsupported transport mode/,
  );
});
