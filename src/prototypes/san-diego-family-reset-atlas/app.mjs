import { syntheticAtlasRecords } from "./data.mjs";
import { filterRecords, validateAtlas } from "./schema.mjs";

const validationErrors = validateAtlas(syntheticAtlasRecords);
if (validationErrors.length > 0) throw new Error(`Invalid synthetic atlas fixtures: ${validationErrors.join("; ")}`);

const elements = {
  search: document.querySelector("#atlas-search"),
  clusterFilters: document.querySelector("#cluster-filters"),
  typeFilters: document.querySelector("#type-filters"),
  clear: document.querySelector("#clear-filters"),
  count: document.querySelector("#result-count"),
  markers: document.querySelector("#map-markers"),
  mapEmpty: document.querySelector("#map-empty"),
  list: document.querySelector("#record-list"),
  details: document.querySelector("#record-details"),
};

const state = {
  query: "",
  clusters: new Set(),
  resetTypes: new Set(),
  selectedId: syntheticAtlasRecords[0].anchor_id,
};

function unique(field) {
  return [...new Set(syntheticAtlasRecords.map((record) => record[field]))].sort();
}

function createFilters(container, values, groupName, selectedSet) {
  const fragment = document.createDocumentFragment();
  values.forEach((value, index) => {
    const label = document.createElement("label");
    label.className = "filter-choice";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = groupName;
    input.value = value;
    input.id = `${groupName}-${index}`;
    input.addEventListener("change", () => {
      if (input.checked) selectedSet.add(value);
      else selectedSet.delete(value);
      render();
    });
    const span = document.createElement("span");
    span.textContent = value;
    label.append(input, span);
    fragment.append(label);
  });
  container.append(fragment);
}

function currentRecords() {
  return filterRecords(syntheticAtlasRecords, {
    query: state.query,
    clusters: [...state.clusters],
    resetTypes: [...state.resetTypes],
  });
}

function selectRecord(id, { focusDetails = false } = {}) {
  state.selectedId = id;
  render();
  if (focusDetails) elements.details.focus({ preventScroll: true });
}

function pill(text, extraClass = "") {
  const span = document.createElement("span");
  span.className = `pill ${extraClass}`.trim();
  span.textContent = text;
  return span;
}

function renderMarkers(records) {
  elements.markers.replaceChildren();
  records.forEach((record, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "marker";
    button.style.left = `${record.map_position.x}%`;
    button.style.top = `${record.map_position.y}%`;
    button.textContent = String(index + 1);
    button.setAttribute("aria-label", `Select ${record.name}, synthetic ${record.reset_type} record`);
    button.setAttribute("aria-pressed", String(record.anchor_id === state.selectedId));
    button.addEventListener("click", () => selectRecord(record.anchor_id, { focusDetails: true }));
    elements.markers.append(button);
  });
  elements.mapEmpty.hidden = records.length > 0;
}

function renderList(records) {
  elements.list.replaceChildren();
  records.forEach((record, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "record-card";
    button.setAttribute("aria-pressed", String(record.anchor_id === state.selectedId));
    button.setAttribute("aria-label", `View schema details for ${record.name}`);
    button.addEventListener("click", () => selectRecord(record.anchor_id, { focusDetails: true }));

    const pills = document.createElement("span");
    pills.className = "pill-row";
    pills.append(pill(`#${index + 1}`), pill(record.reset_type), pill("UNKNOWN", "unknown"));
    const heading = document.createElement("h3");
    heading.textContent = record.name;
    const cluster = document.createElement("p");
    cluster.textContent = record.cluster;
    button.append(pills, heading, cluster);
    elements.list.append(button);
  });

  if (records.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No synthetic records match. Clear one or more filters to continue.";
    elements.list.append(empty);
  }
}

function renderDetails(record) {
  elements.details.replaceChildren();
  if (!record) {
    const empty = document.createElement("p");
    empty.textContent = "Select a visible synthetic record to inspect its schema fields.";
    elements.details.append(empty);
    return;
  }

  const title = document.createElement("h3");
  title.textContent = record.name;
  const pills = document.createElement("p");
  pills.className = "pill-row";
  pills.append(pill("synthetic"), pill(record.confidence, "unknown"), pill("human review needed", "unknown"));

  const fields = [
    ["Cluster", record.cluster],
    ["Reset type", record.reset_type],
    ["Source fact field", record.source_fact],
    ["Provenance", `${record.source_owner}; source URL: none (synthetic fixture)`],
    ["Checked at", record.checked_at],
    ["Coordinate state", record.coordinates.status],
    ["Operational caveat", record.operational_caveat],
    ["Reuse note", record.license_or_reuse_note],
  ];
  const list = document.createElement("dl");
  list.className = "details-grid";
  fields.forEach(([term, value]) => {
    const wrapper = document.createElement("div");
    const dt = document.createElement("dt");
    dt.textContent = term;
    const dd = document.createElement("dd");
    dd.textContent = value;
    wrapper.append(dt, dd);
    list.append(wrapper);
  });
  elements.details.append(title, pills, list);
}

function render() {
  const records = currentRecords();
  if (!records.some((record) => record.anchor_id === state.selectedId)) state.selectedId = records[0]?.anchor_id ?? null;
  elements.count.textContent = `${records.length} of ${syntheticAtlasRecords.length} fixtures`;
  renderMarkers(records);
  renderList(records);
  renderDetails(records.find((record) => record.anchor_id === state.selectedId));
}

createFilters(elements.clusterFilters, unique("cluster"), "cluster", state.clusters);
createFilters(elements.typeFilters, unique("reset_type"), "reset-type", state.resetTypes);

elements.search.addEventListener("input", () => {
  state.query = elements.search.value;
  render();
});

elements.clear.addEventListener("click", () => {
  state.query = "";
  state.clusters.clear();
  state.resetTypes.clear();
  elements.search.value = "";
  document.querySelectorAll('.control-panel input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });
  render();
  elements.search.focus();
});

render();
