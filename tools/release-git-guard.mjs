import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstatSync, readFileSync, realpathSync } from "node:fs";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const phases = new Set(["before-stage", "before-commit", "before-push"]);
const oid = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/;
const digest = /^[a-f0-9]{64}$/;
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const fail = message => { throw new Error(message); };
const list = bytes => bytes.toString("utf8").split("\0").filter(Boolean);

function exactKeys(value, keys, label) {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      Object.keys(value).sort().join(",") !== [...keys].sort().join(",")) {
    fail(`Invalid ${label} fields`);
  }
}

function files(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) || !Object.keys(value).length) {
    fail("Reviewed files must be a nonempty path-to-SHA256 object");
  }
  for (const [path, sha] of Object.entries(value)) {
    if (!/^[A-Za-z0-9._/-]+$/.test(path) || path.startsWith("/") ||
        path.split("/").some(part => !part || part === "." || part === ".." || part === ".git") ||
        (sha !== null && (typeof sha !== "string" || !digest.test(sha)))) {
      fail("Invalid reviewed path or SHA256");
    }
  }
}

export function validateManifest(manifest, phase) {
  if (!phases.has(phase)) fail("Invalid release phase");
  const scope = phase === "before-push" ? "reviewed_commits" : "reviewed_files";
  exactKeys(manifest, ["schema_version", "expected_head", "expected_origin", scope], "manifest");
  if (manifest.schema_version !== 1 || typeof manifest.expected_head !== "string" ||
      !oid.test(manifest.expected_head) || typeof manifest.expected_origin !== "string" ||
      !oid.test(manifest.expected_origin)) fail("Invalid schema or full commit pins");
  if (phase !== "before-push") files(manifest.reviewed_files);
  else {
    const commits = manifest.reviewed_commits;
    if (!Array.isArray(commits) || !commits.length) fail("Reviewed commits must be nonempty");
    const seen = new Set();
    for (let i = 0; i < commits.length; i += 1) {
      exactKeys(commits[i], ["sha", "reviewed_files"], "commit record");
      if (typeof commits[i].sha !== "string" || !oid.test(commits[i].sha) || seen.has(commits[i].sha)) {
        fail("Invalid or duplicate reviewed commit");
      }
      seen.add(commits[i].sha);
      files(commits[i].reviewed_files);
    }
  }
  return manifest;
}

function samePaths(actual, expected, label) {
  if (JSON.stringify([...actual].sort()) !== JSON.stringify([...expected].sort())) {
    fail(`${label} paths do not match reviewed exact scope`);
  }
}

export function checkReleaseGit(root, phase, manifest) {
  validateManifest(manifest, phase);
  // Refuse redirected Git state rather than checking a different index or repository.
  for (const name of ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE", "GIT_COMMON_DIR",
    "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES", "GIT_SHALLOW_FILE", "GIT_NAMESPACE", "GIT_GRAFT_FILE"]) {
    if (process.env[name] !== undefined) fail(`Unsupported Git environment: ${name}`);
  }
  root = realpathSync(root);
  const git = args => {
    try {
      return execFileSync("git", ["--no-replace-objects", "-C", root, ...args],
        { maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
    } catch { fail("Git read failed; release blocked"); }
  };
  const text = args => git(args).toString("utf8").trim();
  if (realpathSync(text(["rev-parse", "--show-toplevel"])) !== root) fail("Use repository root");
  for (const marker of ["MERGE_HEAD", "CHERRY_PICK_HEAD", "REVERT_HEAD", "rebase-merge", "rebase-apply", "sequencer", "info/grafts"]) {
    const path = resolve(root, text(["rev-parse", "--git-path", marker]));
    try {
      lstatSync(path);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    fail(marker === "info/grafts" ? "Legacy Git grafts unsupported" : `Active Git operation: ${marker}; stop`);
  }
  if (text(["rev-parse", "--is-shallow-repository"]) !== "false") fail("Shallow history unsupported");
  if (text(["symbolic-ref", "--short", "HEAD"]) !== "main") fail("Release branch must be main");
  const head = text(["rev-parse", "--verify", "HEAD^{commit}"]);
  const origin = text(["rev-parse", "--verify", "refs/remotes/origin/main^{commit}"]);
  if (head !== manifest.expected_head || origin !== manifest.expected_origin) fail("Commit pins changed");
  const counts = text(["rev-list", "--left-right", "--count", `${origin}...${head}`]).split(/\s+/).map(Number);
  const [behind, ahead] = counts;
  if (counts.length !== 2 || counts.some(n => !Number.isSafeInteger(n) || n < 0)) fail("Invalid branch counts");
  if (behind) fail(`Remote history is ahead or diverged (${ahead} local, ${behind} remote); stop`);
  if (list(git(["ls-files", "--unmerged", "-z"])).length) fail("Unmerged index; stop");
  const staged = list(git(["diff", "--cached", "--name-only", "--no-renames", "-z"]));
  const treeHash = (ref, path) => {
    const entries = list(git(["ls-tree", "-z", ref, "--", path]));
    if (!entries.length) return null;
    if (entries.length !== 1) fail("Unexpected tree entry");
    const entry = entries[0].match(/^(100644|100755) blob ([a-f0-9]+)\t(.+)$/);
    if (!entry || entry[3] !== path) fail("Reviewed files must be regular blobs");
    return hash(git(["cat-file", "blob", entry[2]]));
  };
  if (phase === "before-push") {
    if (!ahead || staged.length) fail("Push requires outgoing commits and an unstaged index");
    const outgoing = text(["rev-list", "--reverse", `${origin}..${head}`]).split("\n");
    if (JSON.stringify(outgoing) !== JSON.stringify(manifest.reviewed_commits.map(c => c.sha))) {
      fail("Complete outgoing range differs from reviewed commits");
    }
    for (const commit of manifest.reviewed_commits) {
      if (text(["rev-list", "--parents", "-n", "1", commit.sha]).split(" ").length !== 2) {
        fail("Merge or root commit unsupported");
      }
      const changed = list(git(["diff-tree", "--no-commit-id", "--name-only", "--no-renames", "-r", "-z", commit.sha]));
      samePaths(changed, Object.keys(commit.reviewed_files), "Commit");
      for (const [path, sha] of Object.entries(commit.reviewed_files)) {
        if (treeHash(commit.sha, path) !== sha) fail("Committed content differs from reviewed hash");
      }
    }
  } else {
    if (ahead) fail("Before staging/commit requires HEAD equal to origin/main");
    if (phase === "before-stage" && staged.length) fail("Index must be empty before staging");
    if (phase === "before-commit") samePaths(staged, Object.keys(manifest.reviewed_files), "Staged");
    for (const [path, sha] of Object.entries(manifest.reviewed_files)) {
      let actual;
      if (phase === "before-stage") {
        const absolute = resolve(root, path);
        try {
          if (!lstatSync(absolute).isFile() || !realpathSync(absolute).startsWith(root + sep)) {
            fail("Reviewed worktree files must be regular files inside repository");
          }
          actual = hash(readFileSync(absolute));
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
          actual = null;
        }
      } else {
        const entries = list(git(["ls-files", "--stage", "-z", "--", path]));
        actual = null;
        if (entries.length) {
          const entry = entries[0].match(/^(100644|100755) ([a-f0-9]+) 0\t(.+)$/);
          if (entries.length !== 1 || !entry || entry[3] !== path) fail("Reviewed index files must be regular stage-zero blobs");
          actual = hash(git(["cat-file", "blob", entry[2]]));
        }
      }
      if (actual !== sha) fail("Selected content differs from reviewed hash");
    }
  }
  return { ok: true, phase, head, origin, ahead, behind, read_only: true,
    limitation: "Local fetched refs only; not live remote, review authority, QA, or atomic release protection" };
}

export function parseGuardOptions(args) {
  const result = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    if (!["--phase", "--manifest"].includes(key) || typeof args[i + 1] !== "string" ||
        args[i + 1].startsWith("--") || result[key]) fail("Use exactly --phase PHASE --manifest PATH");
    result[key] = args[i + 1];
  }
  if (Object.keys(result).length !== 2 || !phases.has(result["--phase"])) fail("Missing or invalid options");
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const options = parseGuardOptions(process.argv.slice(2));
    const manifest = JSON.parse(readFileSync(options["--manifest"], "utf8"));
    console.log(JSON.stringify(checkReleaseGit(process.cwd(), options["--phase"], manifest), null, 2));
  } catch (error) {
    console.error(`Release Git guard blocked: ${error.message}`);
    process.exitCode = 1;
  }
}
