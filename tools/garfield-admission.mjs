import { readFileSync } from "node:fs";
import { validDate } from "./hotel-evidence.mjs";

export const garfieldEvidence = JSON.parse(readFileSync(new URL("../docs/research/chicago-garfield-admission-2026-10-13.json", import.meta.url)));

function validate(evidence) {
  if (evidence?.schema_version !== 1 || evidence.evidence_class !== "OFFICIAL_VISITOR_FACT" ||
      !validDate(evidence.checked_on) || evidence.currency !== "USD" || evidence.unit !== "person/general-admission" ||
      evidence.source_url !== "https://garfieldconservatory.org/visit/" || evidence.ticket_url !== "https://garfieldconservatory.org/tickets/" ||
      evidence.resident_admission?.amount !== 0 || evidence.resident_admission.eligibility !== "each-visitor-verified-city-of-chicago-resident" ||
      !Array.isArray(evidence.rates) || evidence.rates.length !== 4 ||
      JSON.stringify(evidence.closed_weekdays) !== '["Monday","Tuesday"]' ||
      evidence.childrens_garden?.reservation_minutes !== 30 || evidence.childrens_garden.separate_reservation !== true)
    throw new Error("Invalid Garfield admission evidence");
  const bounds = [[0, 6], [7, 17], [18, 64], [65, null]];
  evidence.rates.forEach((rate, index) => {
    if (rate.min_age !== bounds[index][0] || rate.max_age !== bounds[index][1] ||
        (rate.amount === null ? rate.evidence_class !== "NOT_ESTABLISHED" :
          !Number.isFinite(rate.amount) || rate.amount < 0 || !Number.isSafeInteger(rate.amount * 100) || rate.evidence_class !== "OFFICIAL_VISITOR_FACT"))
      throw new Error("Invalid rate band or evidence class");
  });
}

export function garfieldAdmission(ages, residency, evidence = garfieldEvidence) {
  validate(evidence);
  if (!Array.isArray(ages) || !ages.length || Object.keys(ages).length !== ages.length ||
      !ages.every(age => Number.isInteger(age) && age >= 0 && age <= 120) ||
      !["nonresident", evidence.resident_admission.eligibility].includes(residency)) throw new Error("Invalid age/residency task");
  const unknownAges = [], components = ages.map(age => {
    const band = evidence.rates.find(rate => age >= rate.min_age && (rate.max_age === null || age <= rate.max_age));
    const amount = residency === evidence.resident_admission.eligibility ? 0 : band.amount;
    if (amount === null) unknownAges.push(age);
    return { age, amount };
  });
  return { currency: evidence.currency, unit: "party/general-admission-known-rate-subtotal", checked_on: evidence.checked_on,
    components, unknown_ages: unknownAges, known_rate_subtotal: components.reduce((total, part) => total + (part.amount ?? 0) * 100, 0) / 100,
    complete_rate_coverage: unknownAges.length === 0, complete_checkout_total: false,
    eligibility: residency, tax_fee_total: evidence.tax_fee_total, exact_visit_date: evidence.exact_visit_date };
}

export function garfieldView(evidence = garfieldEvidence) {
  validate(evidence);
  const rate = index => `USD ${evidence.rates[index].amount}`;
  return { evidence,
    cost: `Verified Chicago residents free; visitors ${rate(2)}/adult 18-64`,
    rain: "Indoor; closed Monday/Tuesday",
    booking: "Entry ticket; separate 30-minute slot if visiting children's garden",
    summary: "Closed Monday/Tuesday. Entry ticket required; the children's garden has its own 30-minute reservation.",
    examples: evidence.scenarios.map(task => ({ ...task, ...garfieldAdmission(task.ages, task.residency, evidence) })) };
}

const e = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
export function renderGarfieldAdmission(view = garfieldView()) {
  const { evidence } = view;
  return `      <section class="container page-section rank-ready-section" id="garfield-admission" aria-labelledby="garfield-admission-title">
        <h2 id="garfield-admission-title">Garfield Park: admission and reservations</h2>
        <p>Closed Monday/Tuesday. Conservatory entry needs a ticket; the EMG Children's Garden needs its own 30-minute reservation.</p>
        <p>Nonresident rates per person: ages 18-64 USD ${e(evidence.rates[2].amount)}; ages 7-17 USD ${e(evidence.rates[1].amount)}; ages 65+ USD ${e(evidence.rates[3].amount)}. Under-seven rate unconfirmed. Chicago residents need individual residency verification.</p>
        <div class="comparison-scroll garfield-admission-comparison" tabindex="0" role="region" aria-label="Garfield Park admission examples">
          <table class="comparison-table"><thead><tr><th scope="col">Party</th><th scope="col">Known-rate<br>subtotal</th><th scope="col">Still to check</th></tr></thead><tbody>
${view.examples.map(example => `            <tr><th scope="row">${e(example.label)}</th><td>USD ${example.known_rate_subtotal.toFixed(2)}${example.unknown_ages.length ? `<br><small>+ unpriced<br>age ${e(example.unknown_ages.join(", "))}</small>` : ""}</td><td>${example.unknown_ages.length ? `Rate for age ${e(example.unknown_ages.join(", "))}; ` : ""}${example.eligibility === evidence.resident_admission.eligibility ? "Each person's ZIP/address evidence; " : ""}date, fees and garden slot</td></tr>`).join("\n")}
          </tbody></table>
        </div>
        <p class="review-label">Published-rate arithmetic, not checkout totals. Garden cost, taxes/fees and dated availability unconfirmed; transport, meals and donations excluded. Admission checked ${e(evidence.checked_on)}; other activity facts retain their dates.</p>
        <p><a href="${e(evidence.source_url)}">Visitor rules</a> <a href="${e(evidence.ticket_url)}">Ticket availability</a></p>
      </section>`;
}
