import { anchorCatalog, atlasRecords } from "./data.mjs";
import { approvedEvidenceReferences } from "./evidence-registry.mjs";
import { filterRecords, TRUST_FIELDS, validateAtlas } from "./schema.mjs";

const expectedAnchorIds = anchorCatalog.map((anchor) => anchor.anchor_id);
const validationErrors = validateAtlas(atlasRecords, { expectedAnchorIds, approvedEvidenceReferences });
if (validationErrors.length > 0) throw new Error(`Invalid atlas candidate: ${validationErrors.join("; ")}`);

const elements = {
  search: document.querySelector("#atlas-search"),
  clusterFilters: document.querySelector("#cluster-filters"),
  typeFilters: document.querySelector("#type-filters"),
  clear: document.querySelector("#clear-filters"),
  count: document.querySelector("#result-count"),
  markers: document.querySelector("#map-markers"),
  mapEmpty: document.querySelector("#map-empty"),
  list: document.querySelector("#record-list"),
  detailsPanel: document.querySelector(".details-panel"),
  details: document.querySelector("#record-details"),
};

const state = {
  query: "",
  clusters: new Set(),
  resetTypes: new Set(),
  selectedRecordId: atlasRecords[0].record_id,
};

function unique(field) {
  return [...new Set(atlasRecords.map((record) => record[field]))].sort();
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
  return filterRecords(atlasRecords, {
    query: state.query,
    clusters: [...state.clusters],
    resetTypes: [...state.resetTypes],
  });
}

function selectRecord(recordId, { focusDetails = false } = {}) {
  state.selectedRecordId = recordId;
  render();
  if (focusDetails) {
    elements.detailsPanel.scrollTop = 0;
    if (window.matchMedia("(max-width: 1050px)").matches) {
      elements.detailsPanel.scrollIntoView({ block: "start" });
    }
    elements.detailsPanel.focus({ preventScroll: true });
  }
}

function pill(text, extraClass = "") {
  const span = document.createElement("span");
  span.className = `pill ${extraClass}`.trim();
  span.textContent = text;
  return span;
}

function recordsByVisibleAnchor(records) {
  const byAnchor = new Map();
  for (const record of records) {
    if (!byAnchor.has(record.anchor_id)) byAnchor.set(record.anchor_id, []);
    byAnchor.get(record.anchor_id).push(record);
  }
  return anchorCatalog.filter((anchor) => byAnchor.has(anchor.anchor_id)).map((anchor) => ({ anchor, records: byAnchor.get(anchor.anchor_id) }));
}

function renderMarkers(records) {
  elements.markers.replaceChildren();
  const visibleAnchors = recordsByVisibleAnchor(records);
  const selectedAnchorId = atlasRecords.find((record) => record.record_id === state.selectedRecordId)?.anchor_id;

  visibleAnchors.forEach(({ anchor, records: anchorRecords }, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "marker";
    button.style.left = `${anchor.map_position.x}%`;
    button.style.top = `${anchor.map_position.y}%`;
    button.textContent = String(index + 1);
    button.setAttribute(
      "aria-label",
      `Select ${anchor.name}, ${anchorRecords.length} evidence ${anchorRecords.length === 1 ? "record" : "records"}`,
    );
    button.setAttribute("aria-pressed", String(anchor.anchor_id === selectedAnchorId));
    button.addEventListener("click", () => selectRecord(anchorRecords[0].record_id, { focusDetails: true }));
    elements.markers.append(button);
  });
  elements.mapEmpty.hidden = visibleAnchors.length > 0;
}

function renderList(records) {
  elements.list.replaceChildren();
  records.forEach((record) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "record-card";
    button.setAttribute("aria-pressed", String(record.record_id === state.selectedRecordId));
    button.setAttribute("aria-label", `View evidence for ${record.name}: ${record.reset_type}`);
    button.addEventListener("click", () => selectRecord(record.record_id, { focusDetails: true }));

    const pills = document.createElement("span");
    pills.className = "pill-row";
    pills.append(pill(record.reset_type), pill(record.confidence), pill("human review needed", "unknown"));
    const heading = document.createElement("h3");
    heading.textContent = record.name;
    const fact = document.createElement("p");
    fact.textContent = record.source_fact;
    button.append(pills, heading, fact);
    elements.list.append(button);
  });

  if (records.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No evidence records match. Clear one or more filters to continue.";
    elements.list.append(empty);
  }
}

function appendDetail(list, term, value) {
  const wrapper = document.createElement("div");
  const dt = document.createElement("dt");
  dt.textContent = term;
  const dd = document.createElement("dd");
  if (value instanceof Node) dd.append(value);
  else dd.textContent = value;
  wrapper.append(dt, dd);
  list.append(wrapper);
}

function renderDetails(record) {
  elements.details.replaceChildren();
  if (!record) {
    const empty = document.createElement("p");
    empty.textContent = "Select a visible record to inspect its evidence and unresolved checks.";
    elements.details.append(empty);
    return;
  }

  const title = document.createElement("h3");
  title.textContent = record.name;
  const pills = document.createElement("p");
  pills.className = "pill-row";
  pills.append(pill(record.reset_type), pill(record.confidence), pill(record.reuse_status, "unknown"));

  const sourceLink = document.createElement("a");
  sourceLink.href = record.source_url;
  sourceLink.target = "_blank";
  sourceLink.rel = "noopener noreferrer";
  sourceLink.textContent = record.source_url;

  const trustSummary = TRUST_FIELDS.map((field) => `${field.replaceAll("_", " ")}: ${record.trust_states[field]}`).join("; ");
  const list = document.createElement("dl");
  list.className = "details-grid";
  appendDetail(list, "Record ID", record.record_id);
  appendDetail(list, "Cluster", record.cluster);
  appendDetail(list, "Source-bounded fact", record.source_fact);
  appendDetail(list, "Source owner", record.source_owner);
  appendDetail(list, "Source", sourceLink);
  appendDetail(list, "Source updated", record.source_published_or_updated_at ?? "UNKNOWN");
  appendDetail(list, "Checked", record.checked_at);
  appendDetail(list, "Evidence / confidence", `${record.evidence_class}; ${record.confidence}`);
  appendDetail(list, "Coordinate state", record.coordinates.status);
  appendDetail(list, "Trust states", trustSummary);
  appendDetail(list, "Verify before use", record.operational_caveat);
  appendDetail(list, "Reuse boundary", record.license_or_reuse_note);
  elements.details.append(title, pills, list);
}

function render() {
  const records = currentRecords();
  if (!records.some((record) => record.record_id === state.selectedRecordId)) state.selectedRecordId = records[0]?.record_id ?? null;
  const anchorCount = new Set(records.map((record) => record.anchor_id)).size;
  elements.count.textContent =
    `${records.length} ${records.length === 1 ? "record" : "records"} · ` +
    `${anchorCount} ${anchorCount === 1 ? "anchor" : "anchors"}`;
  renderMarkers(records);
  renderList(records);
  renderDetails(records.find((record) => record.record_id === state.selectedRecordId));
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
