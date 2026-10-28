// Display-only spacing repair for evidence notes that were recorded with
// collapsed whitespace (for example "before11:59PM", "2adults/3kids",
// "with25USDHomewoodservicefee"). It only inserts spaces: no number, word,
// date or currency is changed, so the underlying research record stays the
// source of truth. Applied to visible sentences only (strings that already
// contain a space and are not URLs, paths or JSON).

const CURRENCIES = "USD|GBP|MXN|EUR|CAD";
const MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December";

// Collapsed compound words seen in the maintained research notes. Each entry
// restores the spaces only; keep the letters identical apart from spacing,
// except "atcheckin" where the hyphen matches the site's "check-in" spelling.
const COMPOUNDS = [
  ["Hiltonservicefee", "Hilton service fee"],
  ["Homewoodservicefee", "Homewood service fee"],
  ["totalperroom", "total per room"],
  ["perroom", "per room"],
  ["andunder", "and under"],
  ["mandatoryfee", "mandatory fee"],
  ["Mandatoryfee", "Mandatory fee"],
  ["finalallfeecheckout", "final all-fee checkout"],
  ["finalallfee", "final all-fee"],
  ["dailyfoodcredit", "daily food credit"],
  ["dailydrycleaningcredit", "daily dry cleaning credit"],
  ["roomservice", "room service"],
  ["selfparking", "self parking"],
  ["typicalseasonal", "typical seasonal"],
  ["nightlyequivalent", "nightly equivalent"],
  ["Genericeligibility", "Generic eligibility"],
  ["non-memberlabel", "non-member label"],
  ["latecancel", "late cancel"],
  ["percentoffer", "percent offer"],
  ["percentofstay", "percent of stay"],
  ["SeptemberSale", "September Sale"],
  ["beforearrival", "before arrival"],
  ["onarrival", "on arrival"],
  ["originalcard", "original card"],
  ["atcheckin", "at check-in"],
  ["5xNights", "5x Nights"],
  ["whole70sqm", "whole 70sqm"]
];

const looksStructural = text =>
  !/\s/.test(text) || /^(?:https?:|mailto:|\.{0,2}\/|#|[{[])/.test(text.trim());

export function readableText(value) {
  const text = String(value ?? "");
  if (looksStructural(text)) return text;
  let out = text;
  for (const [squashed, spaced] of COMPOUNDS) out = out.replaceAll(squashed, spaced);
  return out
    // currency code glued to an amount or a word: "USD781", "872.21USDfee", "card289/352USD"
    .replace(new RegExp(`\\b(${CURRENCIES})(?=\\d)`, "g"), "$1 ")
    .replace(new RegExp(`(\\d)(${CURRENCIES})\\b`, "g"), "$1 $2")
    .replace(new RegExp(`(\\d)(${CURRENCIES})(?=[A-Za-z])`, "g"), "$1 $2 ")
    // month glued to a preceding word or a following day: "beforeOctober28" -> "before October 28"
    .replace(new RegExp(`([a-z])(${MONTHS})`, "g"), "$1 $2")
    .replace(new RegExp(`\\b(${MONTHS}|Nov|Oct|Sep|Dec)(?=\\d)`, "g"), "$1 ")
    // day followed by a year without a space: "5,2026" -> "5, 2026"
    .replace(/(\d),(20\d\d)\b/g, "$1, $2")
    // lowercase or Capitalized word glued to a number: "before11", "ages4/8/12", "Sleeps6"
    .replace(/\b([A-Za-z]*[a-z]{2}|a)(?=\d)/g, "$1 ")
    // number glued to a following word of 3+ lowercase letters: "2adults", "72hours", "70sqm"
    .replace(/(\d)([a-z]{3,})/g, "$1 $2")
    // a word freed by the previous step can itself be glued to a number: "2nights15" -> "2 nights 15"
    .replace(/\b([A-Za-z]*[a-z]{2})(?=\d)/g, "$1 ")
    // percent glued to a word, and a clock time glued to AM/PM
    .replace(/(\d%)([A-Za-z])/g, "$1 $2")
    .replace(/(\d)(AM|PM)\b/g, "$1 $2");
}

// Tokens that still read as words glued to numbers after repair. All-caps
// codes such as "INC20PC" are provider labels and are not counted.
export function runTogetherTokens(text) {
  const found = String(text).match(/\b[A-Za-z]+\d+[A-Za-z]+\b|\b[a-z]{2,}\d{2,}\b|\b\d+[a-z]{4,}\b|\b\d+[A-Z]{2,}[A-Za-z]*[a-z]\b/g) ?? [];
  return found.filter(token => !/^[A-Z0-9]+$/.test(token));
}
