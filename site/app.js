const areaData = {
  missionBay: {
    name: "Mission Bay",
    summary:
      "Easiest default for first-time family trips: resort pools, bay beaches, short drives, and calmer evenings.",
    logistics: "9/10",
    stroller: "8/10",
    value: "6/10",
    caveat: "Avoid if you want to walk out to many restaurants every night."
  },
  laJolla: {
    name: "La Jolla",
    summary:
      "Best for scenic beach mornings, tide pools, sea lions, and families who are comfortable handling parking and hills.",
    logistics: "6/10",
    stroller: "5/10",
    value: "5/10",
    caveat: "Great with older kids, but stroller routes can be uneven near the cove."
  },
  downtown: {
    name: "Downtown / Little Italy",
    summary:
      "Best when you want walkable meals, harbor time, and shorter rides to Balboa Park without a beach-resort setup.",
    logistics: "7/10",
    stroller: "7/10",
    value: "6/10",
    caveat: "Check room size, parking fees, and noise before booking."
  },
  coronado: {
    name: "Coronado",
    summary:
      "Best for a classic beach vacation feel, quieter streets, and an easy ferry day from the waterfront.",
    logistics: "7/10",
    stroller: "8/10",
    value: "4/10",
    caveat: "Usually pricier, especially around school breaks and summer weekends."
  },
  hotelCircle: {
    name: "Hotel Circle / Mission Valley",
    summary:
      "Best value base if you have a car and want shorter drives to the zoo, beaches, and inland attractions.",
    logistics: "7/10",
    stroller: "6/10",
    value: "9/10",
    caveat: "Choose this for price and parking, not neighborhood charm."
  }
};

const form = document.querySelector("#stay-form");
const areaName = document.querySelector("#area-name");
const areaSummary = document.querySelector("#area-summary");
const logisticsScore = document.querySelector("#logistics-score");
const strollerScore = document.querySelector("#stroller-score");
const valueScore = document.querySelector("#value-score");
const areaCaveat = document.querySelector("#area-caveat");

function getChecked(name) {
  return form.querySelector(`input[name="${name}"]:checked`)?.value;
}

function getNeeds() {
  return [...form.querySelectorAll('input[name="need"]:checked')].map((input) => input.value);
}

function chooseArea() {
  const age = getChecked("age");
  const style = getChecked("style");
  const needs = getNeeds();

  if (style === "value") return areaData.hotelCircle;
  if (style === "city" || needs.includes("transit")) return areaData.downtown;
  if (style === "beach" && age === "teen") return areaData.laJolla;
  if (style === "beach") return areaData.coronado;
  if (age === "baby" || age === "toddler" || needs.includes("pool")) return areaData.missionBay;
  return areaData.downtown;
}

function renderArea() {
  const area = chooseArea();
  areaName.textContent = area.name;
  areaSummary.textContent = area.summary;
  logisticsScore.textContent = area.logistics;
  strollerScore.textContent = area.stroller;
  valueScore.textContent = area.value;
  areaCaveat.textContent = area.caveat;
}

form.addEventListener("change", renderArea);
renderArea();

const chips = [...document.querySelectorAll(".chip")];
const activities = [...document.querySelectorAll(".activity-card")];

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const filter = chip.dataset.filter;
    chips.forEach((item) => item.classList.toggle("active", item === chip));
    activities.forEach((activity) => {
      const tags = activity.dataset.tags.split(" ");
      activity.hidden = filter !== "all" && !tags.includes(filter);
    });
  });
});

