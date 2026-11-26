import test from "node:test";
import assert from "node:assert/strict";
import { headroom } from "./ops-headroom.mjs";

test("warns at 90% of a limit, not before", () => {
  assert.deepEqual(headroom({ "a.md": 1000 }, () => 900), []);
  assert.match(headroom({ "a.md": 1000 }, () => 901)[0], /a\.md is 901 of 1000 bytes \(90%\)/);
});
