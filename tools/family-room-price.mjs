import { validDate } from "./hotel-evidence.mjs";

const text = value => typeof value === "string" && value.trim().length > 0;
const sameAges = (a, b) => JSON.stringify([...a].sort((x, y) => x - y)) === JSON.stringify([...b].sort((x, y) => x - y));
const validParty = p => p && Number.isInteger(p.adults) && p.adults > 0 && Array.isArray(p.child_ages) &&
  p.child_ages.every(age => Number.isInteger(age) && age >= 0 && age <= 17);

export function validateRoomPrices(observations, pack) {
  if (!Array.isArray(observations)) return ["Price observations must be an array"];
  const errors = [];
  const identities = new Set();
  for (const o of observations) {
    const fail = message => errors.push(`${o?.record_id ?? "observation"}: ${message}`);
    if (!o || ![1, 2, 3].includes(o.schema_version) || o.evidence_class !== "BOOKING_CHECK" || !validDate(o.checked_on)) {
      fail("Invalid date/class"); continue;
    }
    const record = pack.records.find(r => r.id === o.record_id);
    if (!record || o.category !== record.category || o.source_url !== pack.sources[record.source_id].url ||
        !text(o.source_surface) || !text(o.fee_basis) || !text(o.limitation)) fail("Missing/mismatched category source and basis");
    if (o.configuration_count !== 1 || !["GBP", "USD"].includes(o.currency) ||
        o.currency !== record?.price?.currency || o.unit !== "configuration/stay") fail("Unsupported pricing unit/currency or record mismatch");
    if (!validDate(o.arrival) || !validDate(o.departure) || !Number.isInteger(o.nights) || o.nights < 1 ||
        (Date.parse(o.departure) - Date.parse(o.arrival)) / 86400000 !== o.nights) fail("Stay/night mismatch");
    if (!validParty(o.party)) { fail("Invalid family party"); continue; }
    const engine = o.engine_party;
    if (o.schema_version >= 2 && (!text(o.booking_category) || !text(o.configuration_basis) ||
        !text(o.deposit_basis) || !["individual-ages", "provider-age-band-counts"].includes(engine?.age_input_mode)))
      fail("Missing priced-configuration, age-input or deposit basis");
    const individualUnknown = o.schema_version === 3 && engine?.age_input_mode === "individual-ages" &&
      engine.adult_from_age === null && engine.child_age_from === null && engine.child_age_to === null &&
      engine.classification_basis === "unpublished-cutoffs-exact-individual-party";
    if (o.schema_version === 3 && !individualUnknown) fail("Schema3 requires explicit unknown cutoffs and individual ages");
    if (individualUnknown) {
      if (!validParty(engine) || engine.adults !== o.party.adults || !sameAges(engine.child_ages, o.party.child_ages))
        fail("Individually entered party does not match; unknown cutoffs cannot reclassify ages");
    } else if (!engine || !Number.isInteger(engine.adult_from_age) || engine.adult_from_age < 1 ||
        !Number.isInteger(engine.child_age_from) || engine.child_age_from < 0 ||
        engine.child_age_to !== engine.adult_from_age - 1 || engine.child_age_from > engine.child_age_to ||
        !validParty(engine)) { fail("Invalid engine age basis"); continue; }
    if (!individualUnknown) {
      const younger = o.party.child_ages.filter(age => age >= engine.child_age_from && age < engine.adult_from_age);
      const adultCount = o.party.adults + o.party.child_ages.filter(age => age >= engine.adult_from_age).length;
      if (o.party.child_ages.some(age => age < engine.child_age_from) || engine.adults !== adultCount ||
          !sameAges(younger, engine.child_ages)) fail("Engine party does not match actual ages");
    }
    const identity = JSON.stringify([o.record_id, o.checked_on, o.arrival, o.departure, o.party.adults, [...o.party.child_ages].sort((a, b) => a - b)]);
    if (identities.has(identity)) fail("Duplicate price identity");
    identities.add(identity);
    if (!Array.isArray(o.rates) || !o.rates.length) { fail("Missing rate plans"); continue; }
    const plans = new Set();
    for (const rate of o.rates) {
      if (o.schema_version >= 2 && !["public", "membership-required"].includes(rate?.eligibility))
        fail("Missing/unsupported rate eligibility");
      if (!rate || ![rate.plan, rate.meals, rate.cancellation].every(text) ||
          !Number.isFinite(rate.stay_amount) || rate.stay_amount <= 0 ||
          !Number.isSafeInteger(Math.round(rate.stay_amount * 100)) || plans.has(rate.plan)) fail("Invalid/duplicate rate plan");
      plans.add(rate?.plan);
    }
  }
  return errors;
}

export function roomPriceForTask(observations, pack, recordId, party, asOf) {
  const errors = validateRoomPrices(observations, pack);
  if (errors.length) throw new Error(errors.join("; "));
  if (!validParty(party) || !validDate(asOf)) throw new Error("Invalid pricing task");
  const stay = party.stay ?? pack.scenario?.stay;
  if (!stay || !validDate(stay.arrival) || !validDate(stay.departure)) return null;
  const observation = observations.filter(o => o.record_id === recordId && o.checked_on <= asOf &&
    o.arrival === stay.arrival && o.departure === stay.departure && o.party.adults === party.adults &&
    sameAges(o.party.child_ages, party.child_ages)).sort((a, b) => b.checked_on.localeCompare(a.checked_on))[0];
  if (!observation) return null;
  const rates = observation.rates.filter(rate => observation.schema_version === 1 || rate.eligibility === "public").map(rate => ({ ...rate,
    nightly_average: Math.round(rate.stay_amount * 100 / observation.nights) / 100 }));
  if (!rates.length) return null;
  const age = (Date.parse(asOf) - Date.parse(observation.checked_on)) / 86400000;
  return { status: age > 14 ? "historical-dated-stay-samples" : "dated-stay-samples",
    currency: observation.currency, unit: "configuration/night", amount: null,
    amount_from: Math.min(...rates.map(rate => rate.nightly_average)), amount_to: Math.max(...rates.map(rate => rate.nightly_average)),
    observed_on: observation.checked_on, category: observation.category, configuration_count: 1,
    party: structuredClone(observation.party), engine_party: structuredClone(observation.engine_party),
    booking_category: observation.booking_category ?? observation.category,
    configuration_basis: observation.configuration_basis ?? "See source-surface and limitation context",
    age_input_mode: observation.engine_party.age_input_mode ?? "not-recorded",
    deposit_basis: observation.deposit_basis ?? "not-established",
    excluded_rate_plans: observation.rates.filter(rate => observation.schema_version >= 2 && rate.eligibility !== "public").map(rate => rate.plan),
    stay: { arrival: observation.arrival, departure: observation.departure, nights: observation.nights },
    rates, fee_basis: observation.fee_basis, source_url: observation.source_url, source_surface: observation.source_surface,
    evidence_class: "BOOKING_CHECK", derivation_class: "EDITORIAL_INTERPRETATION",
    observation_limitation: observation.limitation,
    limitation: "Nightly equivalents of displayed rate plans for one dated stay, not a typical seasonal range, final fee-inclusive quote, future availability or hotel value ranking." };
}
