import { cancunEvidence } from "./data.mjs";

export const esc = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const list = values => `<ul>${values.map(value => `<li>${esc(value)}</li>`).join("")}</ul>`;
export const sources = (ids, label) => `<p class="sources">${ids.map((id, index) => `<a href="${esc(cancunEvidence.sources[id])}">${esc(label)}${ids.length > 1 ? ` ${index + 1}` : ""}</a>`).join(" / ")}</p>`;

export function renderOverview() {
  return cancunEvidence.records.map(record => `<article class="resort-row" id="${esc(record.id)}">
    <header><h3>${esc(record.hotel)}</h3><p class="area">${esc(record.area)}</p><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(record.hotel + " Mexico")}">Map location</a></header>
    <div><h4>Room</h4><p><strong>${esc(record.room.category)}</strong></p><p class="key-fact">${record.room.capacityStatus === "disputed" ? "Capacity disputed: 4 versus 5" : `Published maximum: ${record.room.maximum}`}</p><p>${esc(record.room.beds)}</p>${list(record.room.checks)}${sources(record.room.sourceIds, "Official room details")}</div>
    <div><h4>Club ages</h4>${list(record.clubs.programs.map(program => `${program.min}-${program.max}: ${program.name}${program.parentRequired ? "; parent must stay" : ""}${program.registration ? "; registration required" : ""}${program.pottyRequired ? "; fully toilet-trained" : ""}`))}${sources(record.clubs.sourceIds, "Official club rules")}<details><summary>Admission checks</summary>${list(record.clubs.checks)}</details></div>
    <div><h4>Transfers &amp; extra costs</h4>${record.transfers.rule === "direct-offer" ? `<p>Round-trip ${esc(record.transfers.airport)} airport offer: minimum ${record.transfers.minimumNights} nights.</p>` : ""}${list(record.transfers.checks)}${sources(record.transfers.sourceIds, "Official transfer terms")}${list(record.extras.checks)}${sources(record.extras.sourceIds, "Official extras")}<p><strong>Stay total: unknown.</strong> No dated quote or availability confirmed.</p></div>
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
