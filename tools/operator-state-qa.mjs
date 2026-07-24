import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const staleReleasePattern =
  /\b(?:release pending|commit and release pending|awaiting commit|awaiting release|awaiting commit\/release|review-clean-release-pending)\b/i;

function read(root, path) {
  return readFileSync(join(root, path), "utf8");
}

function lineValue(markdown, label) {
  const match = markdown.match(new RegExp(`^${label}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim() ?? null;
}

function latestSnapshotDate(root) {
  const directory = join(root, "ops/gsc-snapshots");
  return readdirSync(directory)
    .map((name) => name.match(/^(\d{4}-\d{2}-\d{2})\.json$/)?.[1])
    .filter(Boolean)
    .sort()
    .at(-1);
}

function releaseOrder(item) {
  return (
    item.released_at ??
    `${item.completed_on ?? item.selected_on ?? "0000-00-00"}T00:00:00Z`
  );
}

function latestRecordedReleaseItem(items) {
  return items
    .filter((item) => item.release_state === "released-and-production-verified")
    .sort((left, right) => releaseOrder(right).localeCompare(releaseOrder(left)))[0];
}

function contextsForId(contents, id) {
  const lines = contents.split("\n");
  const contexts = lines.filter((line) => line.includes(id));

  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].startsWith("### ")) continue;
    let end = index + 1;
    while (end < lines.length && !lines[end].startsWith("### ")) end += 1;
    const section = lines.slice(index, end).join("\n");
    if (section.includes(id)) contexts.push(section);
  }

  return contexts;
}

export function checkOperatorState(root) {
  const errors = [];
  const roadmap = JSON.parse(read(root, "ops/seo-roadmap.json"));
  const roadmapMarkdown = read(root, "ops/seo-roadmap.md");
  const currentCycle = read(root, "ops/current-cycle.md");
  const snapshotDate = latestSnapshotDate(root);

  const ids = roadmap.items.map((item) => item.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) errors.push(`Duplicate roadmap IDs: ${[...new Set(duplicateIds)].join(", ")}`);

  const metadataChecks = [
    ["Last updated", roadmap.last_updated],
    ["Last re-scored", roadmap.last_rescored_on],
    ["Next re-score due", roadmap.next_rescore_due]
  ];
  for (const [label, expected] of metadataChecks) {
    const actual = lineValue(roadmapMarkdown, label);
    if (actual !== expected) errors.push(`${label} mismatch: JSON=${expected}, markdown=${actual ?? "missing"}`);
  }

  const snapshotJson = `ops/gsc-snapshots/${snapshotDate}.json`;
  const snapshotMarkdown = `ops/gsc-snapshots/${snapshotDate}.md`;
  if (!roadmapMarkdown.includes(snapshotJson)) {
    errors.push(`Human roadmap does not reference latest GSC snapshot ${snapshotJson}`);
  }
  if (!currentCycle.includes(snapshotMarkdown)) {
    errors.push(`Current cycle does not reference latest GSC snapshot ${snapshotMarkdown}`);
  }

  for (const item of roadmap.items) {
    if (item.status === "completed" && item.release_state === "review-clean-release-pending") {
      errors.push(`${item.id} is completed but still marked release-pending`);
    }
    if (item.release_state === "released-and-production-verified") {
      if (!/^[0-9a-f]{40}$/.test(item.release_commit ?? "")) {
        errors.push(`${item.id} has an invalid or missing release_commit`);
      }
      if (!Number.isInteger(item.pages_run) || item.pages_run <= 0) {
        errors.push(`${item.id} has an invalid or missing pages_run`);
      }
    }
  }

  const released = latestRecordedReleaseItem(roadmap.items);
  if (!released) {
    errors.push("No released-and-production-verified roadmap item exists");
    return errors;
  }

  const narrativePaths = [
    "ops/seo-roadmap.md",
    "ops/current-cycle.md",
    ...(released.target_paths ?? []).filter(
      (path) => path.startsWith("status/") || path.startsWith("backlog/")
    )
  ].filter((path, index, all) => all.indexOf(path) === index && existsSync(join(root, path)));

  for (const path of narrativePaths) {
    const contents = read(root, path);
    const staleContext = contextsForId(contents, released.id).find((context) =>
      staleReleasePattern.test(context)
    );
    if (staleContext) {
      errors.push(`${path} still uses pending-release language for ${released.id}`);
    }
  }

  if (!currentCycle.includes(released.release_commit)) {
    errors.push(`Current cycle does not record latest release commit ${released.release_commit}`);
  }
  if (!currentCycle.includes(String(released.pages_run))) {
    errors.push(`Current cycle does not record latest Pages run ${released.pages_run}`);
  }

  return errors;
}

const modulePath = resolve(fileURLToPath(import.meta.url));
const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (modulePath === invokedPath) {
  const root = resolve(dirname(modulePath), "..");
  const errors = checkOperatorState(root);
  if (errors.length) {
    console.error(`Operator state QA failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log("Operator state QA passed with 0 errors.");
  }
}
