import { cancunEvidence } from "./data.mjs";

export const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const list = values => `<ul>${values.map(value => `<li>${esc(value)}</li>`).join("")}</ul>`;
export const sources = (ids, label) => `<p class="sources">${ids.map((id, index) => `<a href="${esc(cancunEvidence.sources[id])}">${esc(label)}${ids.length > 1 ? ` ${index + 1}` : ""}</a>`).join(" / ")}</p>`;

const capacity = record => record.room.capacityStatus === "disputed"
  ? record.room.capacityConflict ?? "Capacity disputed: 4 versus 5"
  : `Published maximum: ${record.room.maximum}`;

export function renderQuickComparison() {
  return `<div class="quick-table-scroll" role="region" aria-label="Six resort room comparison" tabindex="0"><table class="quick-table">
    <caption>Six room categories · Sources checked ${esc(cancunEvidence.checkedOn)} · Recheck due ${esc(cancunEvidence.recheckOn)}</caption>
    <thead><tr><th scope="col">Resort and exact room</th><th scope="col">Published capacity and sleeping places</th><th scope="col">Before booking</th></tr></thead>
    <tbody>${cancunEvidence.records.map(record => `<tr><th scope="row"><a href="#${esc(record.id)}">${esc(record.hotel)}</a><span>${esc(record.room.category)}</span><span>${esc(record.area)}</span></th><td><strong>${esc(capacity(record))}</strong><p>${esc(record.room.beds)}</p>${sources(record.room.sourceIds, "Room source")}</td><td>${list(record.room.checks)}<a href="#${esc(record.id)}">${esc(record.hotel)}: club, transfer and fee checks</a></td></tr>`).join("\n")}</tbody>
  </table></div>`;
}

export function bookingChecklistText() {
  const recordSources = ids => [...new Set(ids)].map(id => `${id}: ${cancunEvidence.sources[id]}`).join("\n");
  return `FAMILY TRIPWISE - CANCUN BOOKING CHECKLIST
https://familytripwise.com/where-to-stay/cancun-family-resorts.html#quick-comparison
Sources checked: ${cancunEvidence.checkedOn}; recheck due: ${cancunEvidence.recheckOn}.
Research-based screening, not a quote or confirmed booking. Check the live page for updates.

YOUR BOOKING
Travel dates: ____________________ Adults: ____ Children's ages at travel: ____________________
Resort / exact room category: _______________________________________________________________
Booking channel: ____________________ Nights: ____ Confirmation contact and date: ___________

[ ] Written acceptance of the exact party and children's ages in the exact room category.
[ ] Every sleeping place, rollaway/crib charges and guaranteed connections confirmed.
[ ] Each child's club admission, accompaniment, toilet-training, registration and hours checked.
[ ] Itemized room, tax, resort-fee, transfer, childcare and extra-activity quote obtained.
[ ] Airport transfer booking conditions and arrangements confirmed, not just advertised.
[ ] Cancellation terms and dated renovation, pool, beach or operational changes checked.
Unresolved questions: ______________________________________________________________________

SIX ROOM RECORDS
Published maxima do not establish dated availability or exact-party acceptance.
Club-age matches do not establish admission. Unknown is not a negative finding.

${cancunEvidence.records.map(record => `${record.hotel} - ${record.area}
Room: ${record.room.category}
${capacity(record)}
Beds: ${record.room.beds}
${record.room.checks.map(check => `Room check: ${check}`).join("\n")}
Club bands: ${record.clubs.programs.length ? record.clubs.programs.map(p => `${p.min}-${p.max} ${p.name}${p.parentRequired ? "; parent must stay" : ""}${p.registration ? "; registration required" : ""}${p.pottyRequired ? "; fully toilet-trained" : ""}`).join(" | ") : "Exact age rules unknown in this record"}
${record.clubs.checks.map(check => `Club check: ${check}`).join("\n")}
${record.transfers.rule === "direct-offer" ? `Transfer offer: ${record.transfers.airport}, minimum ${record.transfers.minimumNights} nights.\n` : ""}${record.transfers.checks.map(check => `Transfer check: ${check}`).join("\n")}
${record.extras.checks.map(check => `Cost check: ${check}`).join("\n")}
Complete stay cost and availability: unknown.
${recordSources([...record.room.sourceIds, ...record.clubs.sourceIds, ...record.transfers.sourceIds, ...record.extras.sourceIds])}`).join("\n\n")}
`;
}

export function renderOverview() {
  return cancunEvidence.records.map(record => `<article class="resort-row" id="${esc(record.id)}">
    <header><h3>${esc(record.hotel)}</h3><p class="area">${esc(record.area)}</p><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(record.hotel + " Mexico")}">Map location</a></header>
    <div><h4>Room</h4><p><strong>${esc(record.room.category)}</strong></p><p class="key-fact">${record.room.capacityStatus === "disputed" ? esc(record.room.capacityConflict ?? "Capacity disputed: 4 versus 5") : `Published maximum: ${record.room.maximum}`}</p><p>${esc(record.room.beds)}</p>${list(record.room.checks)}${sources(record.room.sourceIds, "Official room details")}</div>
    <div><h4>Club ages</h4>${record.clubs.programs.length ? list(record.clubs.programs.map(program => `${program.min}-${program.max}: ${program.name}${program.parentRequired ? "; parent must stay" : ""}${program.registration ? "; registration required" : ""}${program.pottyRequired ? "; fully toilet-trained" : ""}`)) : "<p>Exact club-age rules: unknown in this record.</p>"}${sources(record.clubs.sourceIds, record.clubs.programs.length ? "Official club rules" : "Official pages checked")}<details><summary>Admission checks</summary>${list(record.clubs.checks)}</details></div>
    <div><h4>Transfers &amp; extra costs</h4>${record.transfers.rule === "direct-offer" ? `<p>Round-trip ${esc(record.transfers.airport)} airport offer: minimum ${record.transfers.minimumNights} nights.</p>` : ""}${list(record.transfers.checks)}${sources(record.transfers.sourceIds, record.transfers.rule === "unknown" ? "Official page checked" : "Official transfer terms")}${list(record.extras.checks)}${sources(record.extras.sourceIds, "Official extras")}<p><strong>Stay total: unknown.</strong> No dated quote or availability confirmed.</p></div>
  </article>`).join("\n");
}

const roomMessages = {
  disputed: "Room capacity disputed. Do not treat this category as confirmed for your party.",
  "above-published-maximum": "Your party exceeds this category's published maximum.",
  "within-published-maximum-not-confirmed": "Headcount is within the published maximum; exact-age acceptance and availability still need confirmation."
};
const childMessages = {
  "no-published-age-match": "No exact published club-age match in this record. Ask about alternatives; this does not mean no activities.",
  "parent-required": "Parent must stay; this is not drop-off care.",
  "published-condition-not-met": "Full toilet-training requirement is not met.",
  "toilet-training-check-needed": "Confirm full toilet training before relying on admission.",
  "published-age-match-confirm-admission": "Published age match only; confirm admission and current conditions."
};
const transferMessages = {
  "policy-unknown": "Transfer inclusion is unknown in this record; confirm your booking terms and transport cost.",
  "extra-under-standard-terms": "Transfers are extra under standard terms; check any package-specific inclusion.",
  "outside-published-offer": "Outside the published direct-booking transfer offer; check separate arrangements.",
  "conditions-unknown": "Transfer offer cannot be assessed until booking channel, nights and new-booking status are known.",
  "within-published-offer-conditions": "Meets the published CUN transfer-offer conditions, not a confirmed transfer. Arrange it with the resort."
};

export function renderResults(result) {
  return `${result.needsRecheck ? '<p class="notice"><strong>Source refresh due.</strong> These rules may have changed. Treat every result as provisional and verify directly.</p>' : ""}
  <p class="result-scope">Two adults; children aged ${result.childAges.map(esc).join(", ")}. Club ages are not hotel child-rate ages. Room acceptance, current availability and total cost remain unconfirmed.</p>
  <div class="result-grid">${result.records.map(record => `<article class="result-card">
    <h3><a href="#${esc(record.id)}">${esc(record.hotel)}</a></h3>
    <p class="room-status" data-status="${esc(record.room.status)}">${esc(roomMessages[record.room.status])}</p>
${record.room.layoutStatus === "unknown" ? "<p><strong>Sleeping layout unresolved:</strong> confirm every sleeping place and whether connection is guaranteed.</p>" : ""}
    <ul class="child-results">${record.children.map((child, index) => `<li data-status="${esc(child.status)}"><strong>Child ${index + 1}, age ${child.age}${child.program ? `: ${esc(child.program)}` : ""}.</strong> ${esc(childMessages[child.status])}${child.registration === true ? " Registration required." : ""}</li>`).join("")}</ul>
    <p data-transfer="${esc(record.transfers.status)}">${esc(transferMessages[record.transfers.status])}</p>
    ${sources(record.room.sourceIds, "Confirm room")}${sources([...new Set(record.children.flatMap(child => child.sources.map(source => source.id)))], "Confirm club")}${sources(record.transfers.sources.map(source => source.id), "Confirm transfer")}
  </article>`).join("")}</div>`;
}

export function childFields(count, saved = []) {
  return Array.from({ length: count }, (_, index) => {
    const value = saved[index] ?? { age: "", training: "unknown" };
    return `<div class="child-input"><label for="age-${index}">Child ${index + 1} age at travel<input id="age-${index}" name="age-${index}" type="number" inputmode="numeric" min="0" max="17" step="1" required value="${esc(value.age)}"></label><label for="training-${index}">Child ${index + 1} fully toilet-trained<select id="training-${index}" name="training-${index}">${[["unknown", "Not specified"], ["yes", "Yes"], ["no", "No"]].map(([key, label]) => `<option value="${key}"${value.training === key ? " selected" : ""}>${label}</option>`).join("")}</select></label></div>`;
  }).join("");
}
