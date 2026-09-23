import { cancunEvidence } from "./data.mjs";

function dateValue(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new TypeError("Use a YYYY-MM-DD evidence date.");
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new RangeError("Invalid evidence date.");
  return date.getTime();
}

function validate(input) {
  if (input?.adults !== undefined && input.adults !== 2) throw new RangeError("This prototype supports exactly two adults.");
  if (!input || !Array.isArray(input.childAges) || input.childAges.length < 1 || input.childAges.length > 5 ||
      !input.childAges.every(age => Number.isInteger(age) && age >= 0 && age <= 17)) {
    throw new TypeError("Provide one to five child ages from0 to17; this prototype assumes two adults.");
  }
  const pottyTrained = input.pottyTrained ?? input.childAges.map(() => null);
  if (!Array.isArray(pottyTrained) || pottyTrained.length !== input.childAges.length ||
      !pottyTrained.every(value => value === true || value === false || value === null)) throw new TypeError("Provide true, false or null toilet-training status for each child.");
  const channel = input.channel ?? "unknown";
  if (!["unknown", "direct-suite", "third-party", "flight-package"].includes(channel)) throw new TypeError("Unsupported booking channel.");
  const nights = input.nights ?? null;
  if (nights !== null && (!Number.isInteger(nights) || nights < 1 || nights > 365)) throw new RangeError("Nights must be1 to365, or unknown.");
  const newReservation = input.newReservation ?? null;
  if (![true, false, null].includes(newReservation)) throw new TypeError("New reservation must be true, false or null.");
  const asOf = input.asOf ?? new Date().toISOString().slice(0, 10);
  if (dateValue(asOf) < dateValue(cancunEvidence.checkedOn)) throw new RangeError("Comparison cannot predate its evidence.");
  return { ...input, pottyTrained, channel, nights, newReservation, asOf };
}

function transferStatus(rule, input) {
  if (rule.rule === "extra") return "extra-under-standard-terms";
  if (["third-party", "flight-package"].includes(input.channel) || input.newReservation === false ||
      (input.nights !== null && input.nights < rule.minimumNights)) return "outside-published-offer";
  if (input.channel === "unknown" || input.nights === null || input.newReservation === null) return "conditions-unknown";
  return "within-published-offer-conditions";
}

// Independent fields prevent a club-age match from becoming a booking/room-fit claim.
export function compareCancunFamily(input) {
  const request = validate(input);
  const sourceLinks = ids => ids.map(id => ({ id, url: cancunEvidence.sources[id], checkedOn: cancunEvidence.checkedOn, publishedOn: null, evidenceClass: "official-published-fact" }));
  return {
    adults: 2,
    childAges: [...request.childAges],
    checkedOn: cancunEvidence.checkedOn,
    recheckOn: cancunEvidence.recheckOn,
    needsRecheck: dateValue(request.asOf) >= dateValue(cancunEvidence.recheckOn),
    scope: "Published-policy screening only; no live inventory, confirmed booking, price ranking or childcare guarantee.",
    records: cancunEvidence.records.map(record => ({
      id: record.id, hotel: record.hotel, area: record.area,
      room: {
        ...structuredClone(record.room),
        status: record.room.capacityStatus === "disputed" ? "disputed" :
          request.childAges.length + 2 > record.room.maximum ? "above-published-maximum" : "within-published-maximum-not-confirmed",
        sources: sourceLinks(record.room.sourceIds),
        bookingAcceptance: "unknown"
      },
      children: request.childAges.map((age, index) => {
        const program = record.clubs.programs.find(item => age >= item.min && age <= item.max);
        const training = request.pottyTrained[index];
        const status = !program ? "no-published-age-match" : program.parentRequired ? "parent-required" :
          program.pottyRequired && training === false ? "published-condition-not-met" :
          program.pottyRequired && training === null ? "toilet-training-check-needed" : "published-age-match-confirm-admission";
        return { age, status, program: program?.name ?? null, registration: program?.registration ?? null, sources: sourceLinks(record.clubs.sourceIds) };
      }),
      clubChecks: [...record.clubs.checks],
      transfers: { status: transferStatus(record.transfers, request), airport: record.transfers.airport ?? "confirm-route", checks: [...record.transfers.checks], sources: sourceLinks(record.transfers.sourceIds) },
      cost: { total: null, currency: null, status: "unknown-not-quoted", checks: [...record.extras.checks], sources: sourceLinks(record.extras.sourceIds) }
    }))
  };
}
