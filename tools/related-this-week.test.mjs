import test from "node:test";
import assert from "node:assert/strict";
import { relatedGuides } from "./page-generation/site-chrome.mjs";

// Design P3 11-20: the week link sat after 10+ ski pills and was easy to miss; it now follows the first list.
test("this-week link follows the city guide list, before the ski pills", () => {
  for (const page of ["ski/okemo-conditions.html", "where-to-stay/new-york-city-family-hotels.html", "things-to-do/chicago-with-kids.html"]) {
    const nav = relatedGuides("../", page);
    const week = nav.indexOf('class="related-this-week"');
    assert.ok(week > 0, `${page}: week link present`);
    assert.ok(week > nav.indexOf("</ul>"), `${page}: after the first list`);
    assert.equal(nav.indexOf("</ul>"), nav.lastIndexOf("</ul>", week), `${page}: directly after the first list`);
    assert.match(nav, /this&nbsp;week<\/a>/, `${page}: no orphaned "week"`);
  }
});
