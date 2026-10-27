function dateValue(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new TypeError("Use YYYY-MM-DD dates.");
  const stamp = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(stamp) || new Date(stamp).toISOString().slice(0, 10) !== value) throw new RangeError("Invalid date.");
  return stamp;
}

function dense(array) {
  if (!Array.isArray(array) || Object.getPrototypeOf(array) !== Array.prototype ||
      Reflect.ownKeys(array).length !== array.length + 1) return false;
  for (let index = 0; index < array.length; index += 1) {
    const field = Object.getOwnPropertyDescriptor(array, index);
    if (!field || !Object.hasOwn(field, "value")) return false;
  }
  return true;
}

function validateTariff(tariff) {
  if (!tariff || typeof tariff !== "object" || tariff.currency !== "USD" ||
      !["id", "name", "product", "channel", "sourceUrl", "taxAndFeeStatus"].every(key => typeof tariff[key] === "string" && tariff[key].length > 0) ||
      !dense(tariff.bands) || !dense(tariff.exclusions) || !tariff.exclusions.every(item => typeof item === "string"))
    throw new TypeError("Invalid maintained admission tariff.");
  const url = new URL(tariff.sourceUrl);
  if (url.protocol !== "https:" || url.username || url.password) throw new TypeError("Use a public HTTPS source.");
  if (dateValue(tariff.recheckOn) <= dateValue(tariff.checkedOn)) throw new RangeError("Invalid tariff review window.");
  for (const band of tariff.bands) {
    if (!band || !Number.isInteger(band.minimumAge) || band.minimumAge < 0 || band.minimumAge > 120 ||
        !(band.maximumAge === null || Number.isInteger(band.maximumAge) && band.maximumAge >= band.minimumAge && band.maximumAge <= 120) ||
        !Number.isSafeInteger(band.cents) || band.cents < 0 || band.cents > 10000000 ||
        typeof band.label !== "string" || !band.label) throw new TypeError("Invalid age band or integer-cent rate.");
  }
  for (let age = 0; age <= 120; age += 1) {
    if (tariff.bands.filter(band => age >= band.minimumAge && (band.maximumAge === null || age <= band.maximumAge)).length > 1)
      throw new RangeError("Overlapping admission age bands.");
  }
}

export function calculateAdmissionBudget(tariffs, input) {
  if (!input || !dense(input.travelerAges) || input.travelerAges.length < 1 || input.travelerAges.length > 14 ||
      !input.travelerAges.every(age => Number.isInteger(age) && age >= 0 && age <= 120) ||
      !input.travelerAges.some(age => age >= 18)) throw new TypeError("Provide one to fourteen exact traveler ages, including an adult, from 0 to 120.");
  const asOf = dateValue(input.asOf), visit = dateValue(input.visitDate);
  if (visit < asOf) throw new RangeError("Visit cannot predate assessment.");
  if (!dense(tariffs) || !tariffs.length) throw new TypeError("Provide maintained tariffs.");
  const ids = new Set();
  const records = tariffs.map(tariff => {
    validateTariff(tariff);
    if (ids.has(tariff.id)) throw new TypeError("Duplicate admission choice.");
    ids.add(tariff.id);
    if (asOf < dateValue(tariff.checkedOn)) throw new RangeError("Assessment predates the evidence.");
    const needsRecheck = asOf >= dateValue(tariff.recheckOn) || visit >= dateValue(tariff.recheckOn);
    const guests = input.travelerAges.map(age => {
      const band = tariff.bands.find(item => age >= item.minimumAge && (item.maximumAge === null || age <= item.maximumAge));
      return { age, ticket: band?.label ?? null, cents: band?.cents ?? null };
    });
    const missingAges = guests.filter(guest => guest.cents === null).map(guest => guest.age);
    // An uncovered guest makes the whole-party subtotal unknown, not a partial price.
    const subtotal = missingAges.length ? null : guests.reduce((sum, guest) => sum + guest.cents, 0);
    return {
      id: tariff.id, name: tariff.name, currency: tariff.currency,
      product: tariff.product, channel: tariff.channel, guests,
      publishedAdmissionSubtotalCents: subtotal,
      status: subtotal === null ? "price-unknown" : needsRecheck ? "historical-subtotal-needs-recheck" : "published-subtotal-not-quote",
      missingAges, unknownReason: missingAges.length ? tariff.unknownReason ?? "No published rate mapped for one or more ages." : null,
      checkedOn: tariff.checkedOn, recheckOn: tariff.recheckOn, needsRecheck,
      sourceUrl: tariff.sourceUrl, taxAndFeeStatus: tariff.taxAndFeeStatus,
      exclusions: [...tariff.exclusions], completeDayCostCents: null,
      selectedDateAvailability: "unknown", admissionAcceptance: "unknown"
    };
  });
  return {
    travelerAges: [...input.travelerAges], asOf: input.asOf, visitDate: input.visitDate, records,
    scope: "Standard published admission arithmetic, not a checkout quote, lowest eligible price, confirmed entry, suitability ranking or complete day budget. Conditional concessions, promotions and memberships are not applied. Groups of fifteen or more need separate terms."
  };
}
