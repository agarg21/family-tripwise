import { validDate } from "./hotel-evidence.mjs";

const text = value => typeof value === "string" && value.trim().length > 0;
const ordinaryDense = values => {
  if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || Object.hasOwn(values, Symbol.iterator)) return false;
  for (let index = 0; index < values.length; index++) if (!Object.hasOwn(values, index)) return false;
  return true;
};
const sortedAges = ages => {
  const values = [];
  for (let index = 0; index < ages.length; index++) values.push(ages[index]);
  return values.sort((a, b) => a - b);
};
const sameAges = (a, b) => JSON.stringify(sortedAges(a)) === JSON.stringify(sortedAges(b));
const validParty = p => {
  if (!p || !Number.isInteger(p.adults) || p.adults <= 0 || !ordinaryDense(p.child_ages)) return false;
  for (let index = 0; index < p.child_ages.length; index++) {
    const age = p.child_ages[index];
    if (!Object.hasOwn(p.child_ages, index) || !Number.isInteger(age) || age < 0 || age > 17) return false;
  }
  return true;
};

// Standalone price helpers require a validateRoomPack-approved pack; screening enforces it.
export function validateRoomPrices(observations, pack) {
  if (!ordinaryDense(observations)) return ["Price observations must be an ordinary dense array"];
  const errors = [];
  const identities = new Set();
  for (const o of observations) {
    const fail = message => errors.push(`${o?.record_id ?? "observation"}: ${message}`);
    if (!o || ![1, 2, 3, 4, 5].includes(o.schema_version) || o.evidence_class !== "BOOKING_CHECK" || !validDate(o.checked_on)) {
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
        !text(o.deposit_basis) || !["individual-ages", "provider-age-band-counts", "provider-counts-unknown-child-band"].includes(engine?.age_input_mode)))
      fail("Missing priced-configuration, age-input or deposit basis");
    if (engine?.age_input_mode === "provider-counts-unknown-child-band" && o.schema_version !== 5)
      fail("Unknown child-band mode requires schema5");
    const individualUnknown = o.schema_version === 3 && engine?.age_input_mode === "individual-ages" &&
      engine.adult_from_age === null && engine.child_age_from === null && engine.child_age_to === null &&
      engine.classification_basis === "unpublished-cutoffs-exact-individual-party";
    const countUnknown = o.schema_version === 4 && engine?.age_input_mode === "provider-age-band-counts" &&
      engine.adult_from_age === null && Number.isInteger(engine.child_age_from) && engine.child_age_from >= 0 &&
      Number.isInteger(engine.child_age_to) && engine.child_age_to >= engine.child_age_from && engine.child_age_to <= 17 &&
      engine.child_ages === null && engine.individual_ages_entered === false &&
      engine.classification_basis === "unpublished-adult-cutoff-published-child-band-counts" &&
      o.requested_individual_ages_confirmed === false && text(o.currency_basis) &&
      ["OBSERVED_ISO_CURRENCY", "EDITORIAL_INTERPRETATION"].includes(o.currency_evidence_class);
    const childBandUnknown = o.schema_version === 5 && engine?.age_input_mode === "provider-counts-unknown-child-band" &&
      Number.isInteger(engine.adult_from_age) && engine.adult_from_age > 0 &&
      engine.child_age_from === null && engine.child_age_to === null && engine.child_ages === null &&
      engine.individual_ages_entered === false && engine.requested_individual_ages_confirmed === false &&
      engine.classification_basis === "published-adult-cutoff-unknown-child-band-counts" &&
      o.requested_individual_ages_confirmed === false && o.party_basis === "requested-task-context-not-provider-age-acceptance" &&
      text(o.currency_basis) && ["OBSERVED_ISO_CURRENCY", "EDITORIAL_INTERPRETATION"].includes(o.currency_evidence_class);
    if (o.schema_version === 3 && !individualUnknown) fail("Schema3 requires explicit unknown cutoffs and individual ages");
    if (o.schema_version === 4 && !countUnknown) { fail("Schema4 requires explicit count-only, child-band, unknown-adult-cutoff and currency basis"); continue; }
    if (o.schema_version === 5 && !childBandUnknown) { fail("Schema5 requires explicit unknown child-band, unconfirmed task ages, count mode and currency basis"); continue; }
    if (childBandUnknown) {
      // Match recorded search context, not provider acceptance of the requested ages.
      if (!Number.isInteger(engine.adults) || engine.adults !== o.party.adults ||
          !Number.isInteger(engine.children) || engine.children < 1 || engine.children !== o.party.child_ages.length ||
          o.party.child_ages.some(age => age >= engine.adult_from_age))
        fail("Unknown-child-band counts mismatch or conflict with published adult cutoff");
    } else if (countUnknown) {
      // Published child bands can qualify requested ages without inventing the complementary adult cutoff.
      if (!Number.isInteger(engine.adults) || engine.adults !== o.party.adults ||
          !Number.isInteger(engine.children) || engine.children !== o.party.child_ages.length ||
          o.party.child_ages.some(age => age < engine.child_age_from || age > engine.child_age_to))
        fail("Count-only engine party does not match requested party within published child band");
    } else if (individualUnknown) {
      if (!validParty(engine) || engine.adults !== o.party.adults || !sameAges(engine.child_ages, o.party.child_ages))
        fail("Individually entered party does not match; unknown cutoffs cannot reclassify ages");
    } else if (!engine || !Number.isInteger(engine.adult_from_age) || engine.adult_from_age < 1 ||
        !Number.isInteger(engine.child_age_from) || engine.child_age_from < 0 ||
        engine.child_age_to !== engine.adult_from_age - 1 || engine.child_age_from > engine.child_age_to ||
        !validParty(engine)) { fail("Invalid engine age basis"); continue; }
    if (!individualUnknown && !countUnknown && !childBandUnknown) {
      const younger = o.party.child_ages.filter(age => age >= engine.child_age_from && age < engine.adult_from_age);
      const adultCount = o.party.adults + o.party.child_ages.filter(age => age >= engine.adult_from_age).length;
      if (o.party.child_ages.some(age => age < engine.child_age_from) || engine.adults !== adultCount ||
          !sameAges(younger, engine.child_ages)) fail("Engine party does not match actual ages");
    }
    const identity = JSON.stringify([o.record_id, o.checked_on, o.arrival, o.departure, o.party.adults, sortedAges(o.party.child_ages)]);
    if (identities.has(identity)) fail("Duplicate price identity");
    identities.add(identity);
    if (!ordinaryDense(o.rates) || !o.rates.length) { fail("Missing rate plans"); continue; }
    const plans = new Set();
    for (const rate of o.rates) {
      if (o.schema_version >= 2 && !["public", "membership-required"].includes(rate?.eligibility))
        fail("Missing/unsupported rate eligibility");
      if (!rate || ![rate.plan, rate.meals, rate.cancellation].every(text) ||
          !Number.isFinite(rate.stay_amount) || rate.stay_amount <= 0 ||
          !Number.isSafeInteger(Math.round(rate.stay_amount * 100)) || plans.has(rate.plan)) fail("Invalid/duplicate rate plan");
      plans.add(rate?.plan);
      if (rate && ["object", "function"].includes(typeof rate) && "cancellation_deadline_local_date" in rate) {
        const deadline = Object.getOwnPropertyDescriptor(rate, "cancellation_deadline_local_date");
        if (!deadline || !Object.hasOwn(deadline, "value") || !deadline.enumerable || !validDate(deadline.value))
          fail("Cancellation deadline must be an own enumerable ISO calendar date");
      }
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
  const rates = observation.rates.filter(rate => observation.schema_version === 1 || rate.eligibility === "public").map(rate => {
    const deadline = rate.cancellation_deadline_local_date;
    return { ...structuredClone(rate), nightly_average: Math.round(rate.stay_amount * 100 / observation.nights) / 100,
      ...(deadline ? { cancellation_deadline_date_relation: asOf < deadline ? "BEFORE_RECORDED_LOCAL_DATE" :
        asOf === deadline ? "SAME_RECORDED_LOCAL_DATE" : "AFTER_RECORDED_LOCAL_DATE" } : {}) };
  });
  if (!rates.length) return null;
  const age = (Date.parse(asOf) - Date.parse(observation.checked_on)) / 86400000;
  const status = observation.schema_version === 5 ? "dated-age-unresolved-count-samples" :
    observation.schema_version === 4 ? "dated-count-only-stay-samples" : "dated-stay-samples";
  return { status: age > 14 ? `historical-${status}` : status,
    currency: observation.currency, unit: "configuration/night", amount: null,
    amount_from: Math.min(...rates.map(rate => rate.nightly_average)), amount_to: Math.max(...rates.map(rate => rate.nightly_average)),
    observed_on: observation.checked_on, category: observation.category, configuration_count: 1,
    party: structuredClone(observation.party), engine_party: structuredClone(observation.engine_party),
    booking_category: observation.booking_category ?? observation.category,
    configuration_basis: observation.configuration_basis ?? "See source-surface and limitation context",
    age_input_mode: observation.engine_party.age_input_mode ?? "not-recorded",
    ...(observation.schema_version >= 4 ? { requested_individual_ages_confirmed: false,
      currency_basis: observation.currency_basis, currency_evidence_class: observation.currency_evidence_class } : {}),
    ...(observation.schema_version === 5 ? { party_basis: observation.party_basis } : {}),
    deposit_basis: observation.deposit_basis ?? "not-established",
    excluded_rate_plans: observation.rates.filter(rate => observation.schema_version >= 2 && rate.eligibility !== "public").map(rate => rate.plan),
    stay: { arrival: observation.arrival, departure: observation.departure, nights: observation.nights },
    rates, fee_basis: observation.fee_basis, source_url: observation.source_url, source_surface: observation.source_surface,
    evidence_class: "BOOKING_CHECK", derivation_class: "EDITORIAL_INTERPRETATION",
    observation_limitation: observation.limitation,
    limitation: "Nightly equivalents of displayed rate plans for one dated stay, not a typical seasonal range, final fee-inclusive quote, future availability or hotel value ranking." +
      (observation.schema_version === 5 ? " Child-age applicability unresolved; requested task ages were not confirmed by the provider." : "") };
}
