// D52 (#12): collapsed holiday price cards. The "From" figure in each summary is the lowest night its table shows,
// "also" figures from a second search included (integrity P2, 2026-11-20), and it names that hotel.
import test from "node:test";
import assert from "node:assert/strict";
import { createFamilyHotelPages } from "./page-generation/family-hotel-pages.mjs";

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const pages = createFamilyHotelPages({ esc, pageShell: ({ body }) => body });
const money = (text) => [...text.matchAll(/\$([\d,]+)/g)].map((m) => Number(m[1].replace(",", "")));

test("holiday card summaries name the lowest night in their own table", () => {
  for (const [name, html] of [["nyc", pages.newYorkCityFamilyHotelPage("2026-11-20")], ["chicago", pages.chicagoFamilyHotelPage("2026-11-20")], ["las-vegas", pages.lasVegasFamilyHotelPage("2026-11-20")]]) {
    const cards = [...html.matchAll(/<details class="detail-card hotel-card hotel-holiday-card">([\s\S]*?)<\/details>/g)];
    assert.equal(cards.length, 2, name);
    for (const [, card] of cards) {
      const from = Number(card.match(/<strong>From \$([\d,]+) a night<\/strong> <small>([^<·]+) ·/)[1].replace(",", ""));
      const hotel = card.match(/<strong>From \$[\d,]+ a night<\/strong> <small>([^<·]+?) ·/)[1];
      const rows = [...card.match(/<tbody>([\s\S]*?)<\/tbody>/)[1].matchAll(/<tr><td>([^<]+)<\/td>([\s\S]*?)<\/tr>/g)];
      const low = Math.min(...rows.flatMap((row) => money(row[2])));
      assert.equal(from, low, `${name}: summary ${from} vs table ${low}`);
      assert.ok(rows.some((row) => row[1] === hotel && money(row[2]).includes(low)), `${name}: ${hotel} holds ${low}`);
      assert.match(card, /one-night estimate · see all \d+ priced hotels · seen Nov 14/);
    }
  }
  // Chicago New Year: Residence Inn $184 with $155 in another search; the card leads with $155.
  assert.match(pages.chicagoFamilyHotelPage("2026-11-20"), /New Year's weekend, Jan 1–3, 2027<\/h3><span class="hotel-card-price"><strong>From \$155 a night<\/strong> <small>Residence Inn/);
});
