function dateStamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new TypeError("Use YYYY-MM-DD dates.");
  const stamp = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(stamp) || new Date(stamp).toISOString().slice(0, 10) !== value) throw new RangeError("Invalid date.");
  return stamp;
}

const dense = value => Array.isArray(value) && Array.from(value).every((_, index) => Object.hasOwn(value, index));

export function calculateLakeEolaRental(rental, input) {
  if (!rental || rental.id !== "lake-eola-swan-boat" || rental.currency !== "USD" ||
      !Number.isSafeInteger(rental.centsPerRental) || rental.centsPerRental < 0 || rental.centsPerRental > 10000000 ||
      rental.rentalMinutes !== 30 || rental.maximumPeoplePerBoat !== 5 || rental.maximumPoundsPerBoat !== 1400 ||
      !dense(rental.closedWeekdays) || rental.closedWeekdays.length !== 1 || rental.closedWeekdays[0] !== 1 ||
      !["name", "product", "unit", "taxAndFeeStatus"].every(key => typeof rental[key] === "string" && rental[key].length) ||
      !["conditions", "exclusions"].every(key => dense(rental[key]) && rental[key].length && rental[key].every(x => typeof x === "string" && x.length)))
    throw new TypeError("Invalid maintained Lake Eola rental record.");
  for (const value of [rental.sourceUrl, rental.unitSourceUrl]) {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) throw new TypeError("Use public HTTPS sources.");
  }
  const checked = dateStamp(rental.checkedOn), recheck = dateStamp(rental.recheckOn);
  const asOf = dateStamp(input?.asOf), visit = dateStamp(input?.visitDate);
  if (recheck <= checked || asOf < checked || visit < asOf) throw new RangeError("Invalid evidence or assessment window.");
  if (!Number.isInteger(input.partySize) || input.partySize < 1 || input.partySize > 14 ||
      !dense(input.boatLoads) || input.boatLoads.length < 1 || input.boatLoads.length > 14 ||
      !input.boatLoads.every(size => Number.isInteger(size) && size >= 1 && size <= rental.maximumPeoplePerBoat) ||
      input.boatLoads.reduce((sum, size) => sum + size, 0) !== input.partySize)
    throw new TypeError("Provide explicit boat loads of one to five people covering the whole party (one to fourteen).");
  const needsRecheck = asOf >= recheck || visit >= recheck;
  const publishedClosedWeekday = rental.closedWeekdays.includes(new Date(visit).getUTCDay());
  return {
    id: rental.id, name: rental.name, currency: rental.currency, product: rental.product, unit: rental.unit,
    partySize: input.partySize, boatLoads: [...input.boatLoads], rentals: input.boatLoads.length,
    centsPerRental: rental.centsPerRental, rentalMinutes: rental.rentalMinutes,
    publishedRentalSubtotalCents: publishedClosedWeekday ? null : rental.centsPerRental * input.boatLoads.length,
    status: publishedClosedWeekday ? "published-closed-weekday" : needsRecheck ? "historical-subtotal-needs-recheck" : "published-rental-subtotal-not-quote",
    asOf: input.asOf, visitDate: input.visitDate, checkedOn: rental.checkedOn, recheckOn: rental.recheckOn,
    needsRecheck, publishedClosedWeekday, sourceUrl: rental.sourceUrl, unitSourceUrl: rental.unitSourceUrl,
    maximumPeoplePerBoat: rental.maximumPeoplePerBoat, maximumPoundsPerBoat: rental.maximumPoundsPerBoat,
    taxAndFeeStatus: rental.taxAndFeeStatus, conditions: [...rental.conditions], exclusions: [...rental.exclusions],
    actualWeightsWithinLimit: "not-assessed", childSupervisionAndAgeEligibility: "not-established",
    selectedDateAvailability: "unknown", simultaneousBoatsAvailable: "unknown", completeDayCostCents: null,
    scope: "Arithmetic for explicit passenger counts and one 30-minute rental per listed boat. Counts are not an approved seating or supervision plan; no automatic allocation, weight, age, weather, operation, availability, safety or suitability assurance. Not park admission, a checkout quote or complete day cost."
  };
}
