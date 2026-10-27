import { calculateAdmissionBudget } from "./admission-budget.mjs";

const usd = cents => `USD ${(cents / 100).toFixed(2)}`;
const localDate = () => new Intl.DateTimeFormat("en-CA", {
  timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit"
}).format(new Date());

function whole(value, minimum, maximum) {
  if (typeof value !== "string" || !/^\d+$/.test(value.trim())) throw new TypeError("Enter whole ages.");
  const number = Number(value);
  if (!Number.isInteger(number) || number < minimum || number > maximum) throw new RangeError("Input outside supported range.");
  return number;
}

export function admissionPriceMessage(record) {
  if (record.publishedAdmissionSubtotalCents === null) return "Price unknown for this party.";
  return `${usd(record.publishedAdmissionSubtotalCents)} standard admission subtotal. ` +
    (record.needsRecheck ? "Recheck due; historical arithmetic only." : "Published rates, not a checkout quote.");
}

export function initializeAdmissionBudget(document, {today = localDate} = {}) {
  const form=document.querySelector("#admission-budget-form"), basis=document.querySelector("#admission-budget-basis"),
    status=document.querySelector("#admission-budget-status"), results=document.querySelector("#admission-results"),
    fields=document.querySelector("#admission-age-fields");
  if (!form || !basis || !status || !results || !fields) return;
  const count=form.elements.namedItem("traveler_count"), visit=form.elements.namedItem("visit_date");
  if (!count || !visit) return;
  let tariffs;
  try {
    tariffs=JSON.parse(basis.textContent);
    calculateAdmissionBudget(tariffs,{travelerAges:[18],asOf:today(),visitDate:today()});
  } catch { return; }
  const node=(tag,text) => {
    const element=document.createElement(tag);
    if (text !== undefined) element.textContent=text;
    return element;
  };
  const ageInputs=() => Array.from(fields.querySelectorAll("input"));
  let drafts=[];
  const clear=message => {
    results.replaceChildren();results.hidden=true;status.textContent=message;
  };
  const resize=() => {
    const length=whole(count.value,1,14);
    ageInputs().forEach((input,index)=>{drafts[index]=input.value;});
    const labels=Array.from({length},(_,index)=>{
      const label=node("label",`Traveler ${index+1} age`), input=node("input");
      input.type="number";input.name=`traveler_age_${index}`;input.id=`admission-age-${index}`;
      input.min="0";input.max="120";input.step="1";input.required=true;
      input.value=drafts[index] ?? "";label.htmlFor=input.id;label.append(input);
      return label;
    });
    fields.replaceChildren(...labels);
  };
  const render=result => {
    const table=node("table"), caption=node("caption","Your party's standard admission comparison"), head=node("thead"), header=node("tr"), body=node("tbody");
    for (const title of ["Outing","Published Admission Subtotal","Basis and Limits"]) {
      const cell=node("th",title);cell.scope="col";header.append(cell);
    }
    head.append(header);
    for (const record of result.records) {
      const row=node("tr"), name=node("th",record.name), price=node("td"), context=node("td");name.scope="row";
      price.append(node("p",admissionPriceMessage(record)),node("p",record.taxAndFeeStatus));
      if (record.unknownReason) price.append(node("p",record.unknownReason));
      context.append(node("p",record.channel),node("p",record.guests.map(guest=>
        `Age ${guest.age}: ${guest.cents === null ? "rate unknown" : `${guest.ticket}, ${usd(guest.cents)}`}`).join("; ")),
        node("p",record.needsRecheck ? `Rates observed ${record.checkedOn} on the official site; that observation is older than your date allows, so check the current price.` : `Rates observed ${record.checkedOn} on the official site; check the current price before buying.`),node("p",`Excluded: ${record.exclusions.join("; ")}.`));
      const source=node("a","Official admission source");source.href=record.sourceUrl;context.append(source);
      row.append(name,price,context);body.append(row);
    }
    table.append(caption,head,body);results.replaceChildren(table);results.hidden=false;
    const unknown=result.records.filter(record=>record.publishedAdmissionSubtotalCents===null).length;
    const due=result.records.filter(record=>record.needsRecheck).length;
    status.textContent=`${result.records.length-unknown} published subtotals; ${unknown} prices unknown. ` +
      `${due} choices rely on an older rate observation for this date. Admission, operation and complete day costs remain unconfirmed.`;
  };
  try { resize();visit.min=today(); } catch { return; }
  form.addEventListener("input",event=>{
    try { if(event.target===count) resize(); } catch { /* Keep the last fields until the count is valid. */ }
    clear("Inputs changed; previous subtotals no longer apply.");
  });
  form.addEventListener("submit",event=>{
    event.preventDefault();
    clear("Comparison unresolved.");
    try {
      const inputs=ageInputs(), size=whole(count.value,1,14), asOf=today();visit.min=asOf;
      if(inputs.length!==size) throw new TypeError("Traveler count is incomplete.");
      render(calculateAdmissionBudget(tariffs,{travelerAges:inputs.map(input=>whole(input.value,0,120)),asOf,visitDate:visit.value}));
    } catch { clear("Comparison unresolved. Check every whole age, at least one adult and a visit date that is not past."); }
  });
  form.addEventListener("reset",event=>{
    event.preventDefault();count.value="4";visit.value="";drafts=[];fields.replaceChildren();resize();
    clear("No party calculated.");
  });
  form.hidden=false;
}

if (typeof document !== "undefined") initializeAdmissionBudget(document);
