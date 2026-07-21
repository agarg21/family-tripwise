const PRIMARY_CHECKS = {
  beach: {
    label: "usable beach access",
    question: "Trace the exact property-to-usable-beach route, including crossings, surfaces, seasonal restrictions, parking, and current County water status.",
  },
  activities: {
    label: "activity-route simplicity",
    question: "List the family's priority activities, then compare exact property-to-activity routes for the actual dates and dayparts.",
  },
  "car-light": {
    label: "a car-light trip",
    question: "Test exact stops, service frequency, transfers, walking segments, elevators, and the return trip for each priority activity.",
  },
  quiet: {
    label: "quiet reset time",
    question: "Ask about the exact room category and location relative to traffic, elevators, event space, pool decks, nightlife, airport paths, and construction.",
  },
  value: {
    label: "full-stay value",
    question: "Compare bookable totals for the same dates and occupancy, including taxes, parking, resort or destination fees, meals, transport, and cancellation terms.",
  },
  room: {
    label: "room and sleep setup",
    question: "Confirm the exact bed layout, occupancy, sofa-bed wording, crib or rollaway policy, connecting-room rules, elevator access, and room-location options.",
  },
};

const TRANSPORT_CHECKS = {
  driving: "Check current drive times at the intended dayparts, parking availability and cost, in/out privileges, and car-seat or rideshare constraints.",
  "car-light": "Use current MTS schedules and alerts, then verify the complete sidewalk, crossing, elevator, stroller, transfer, and return route from the exact property.",
};

const EXTRA_CHECKS = {
  stroller: "Walk or inspect each exact route for sidewalks, crossings, grades, elevator dependencies, boarding constraints, and stroller-storage rules.",
  nap: "Time a realistic midday return with waiting, parking or transfers, loading a child and stroller, elevators, and the family's actual nap window.",
  kitchen: "Verify the exact room's refrigerator, microwave, cooking equipment, dishwasher, and guest-laundry access on the official property source or directly with the property.",
};

const BASE_CHECKS = [
  "Keep two area-and-hotel combinations until the route and room checks are complete.",
];

function selectedNeeds(formData) {
  return formData.getAll("need").filter((need) => Object.hasOwn(EXTRA_CHECKS, need));
}

export function buildStayChecklist({ primary, transport, needs = [] }) {
  if (!Object.hasOwn(PRIMARY_CHECKS, primary)) throw new TypeError(`Unsupported primary constraint: ${primary}`);
  if (!Object.hasOwn(TRANSPORT_CHECKS, transport)) throw new TypeError(`Unsupported transport mode: ${transport}`);

  const validNeeds = [...new Set(needs.filter((need) => Object.hasOwn(EXTRA_CHECKS, need)))];
  const checks = [
    PRIMARY_CHECKS[primary].question,
    TRANSPORT_CHECKS[transport],
    ...validNeeds.map((need) => EXTRA_CHECKS[need]),
    ...BASE_CHECKS,
  ];

  return {
    summary: `Focus the final comparison on ${PRIMARY_CHECKS[primary].label}, then apply these checks to two area-and-hotel combinations.`,
    checks: [...new Set(checks)],
  };
}

function renderChecklist(summaryElement, listElement, result) {
  summaryElement.textContent = result.summary;
  const ownerDocument = listElement.ownerDocument;
  const items = result.checks.map((check) => {
    const item = ownerDocument.createElement("li");
    item.textContent = check;
    return item;
  });
  listElement.replaceChildren(...items);
}

export function initStayTool(root = globalThis.document) {
  if (!root) return false;

  const form = root.querySelector("#san-diego-stay-tool");
  const summary = root.querySelector("#stay-tool-summary");
  const list = root.querySelector("#stay-tool-checklist");
  if (!form || !summary || !list) return false;

  const update = () => {
    const formData = new FormData(form);
    const result = buildStayChecklist({
      primary: formData.get("primary"),
      transport: formData.get("transport"),
      needs: selectedNeeds(formData),
    });
    renderChecklist(summary, list, result);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    update();
  });
  update();
  return true;
}

if (typeof document !== "undefined") initStayTool(document);
