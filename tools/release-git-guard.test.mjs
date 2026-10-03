import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { checkReleaseGit, parseGuardOptions, validateManifest } from "./release-git-guard.mjs";

const cli = fileURLToPath(new URL("./release-git-guard.mjs", import.meta.url));
const hash = value => createHash("sha256").update(value).digest("hex");
const fixture = t => {
  const root = mkdtempSync(join(tmpdir(), "ft-git-guard-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync("git", ["-C", root, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git("init", "-b", "main");
  git("config", "user.name", "Fixture");
  git("config", "user.email", "fixture@example.invalid");
  git("config", "commit.gpgsign", "false");
  const write = (path, value) => writeFileSync(join(root, path), value);
  write("selected.txt", "baseline\n");
  write("other.txt", "other baseline\n");
  git("add", "selected.txt", "other.txt");
  git("commit", "-m", "baseline");
  const base = git("rev-parse", "HEAD");
  git("update-ref", "refs/remotes/origin/main", base);
  const manifest = () => ({ schema_version: 1, expected_head: git("rev-parse", "HEAD"),
    expected_origin: git("rev-parse", "refs/remotes/origin/main"), reviewed_files: { "selected.txt": hash("reviewed\n") } });
  const commit = (path, value, message) => {
    write(path, value); git("add", "--", path); git("commit", "-m", message);
    return git("rev-parse", "HEAD");
  };
  return { root, git, write, base, manifest, commit };
};

test("before-stage permits preserved dirty work without changing repository or index", t => {
  const f = fixture(t);
  f.write("selected.txt", "reviewed\n"); f.write("other.txt", "dirty\n"); f.write("untracked.txt", "keep\n");
  const before = f.git("status", "--porcelain=v1");
  const index = readFileSync(join(f.root, ".git/index"));
  assert.equal(checkReleaseGit(f.root, "before-stage", f.manifest()).ok, true);
  assert.equal(f.git("status", "--porcelain=v1"), before);
  assert.deepEqual(readFileSync(join(f.root, ".git/index")), index);
  assert.equal(f.git("rev-parse", "HEAD"), f.base);
});

test("before-commit accepts exact staged reviewed bytes, not unstaged edits", t => {
  const f = fixture(t); f.write("selected.txt", "reviewed\n"); f.git("add", "selected.txt");
  f.write("selected.txt", "later unstaged edit\n");
  assert.equal(checkReleaseGit(f.root, "before-commit", f.manifest()).ok, true);
  assert.throws(() => checkReleaseGit(f.root, "before-stage", f.manifest()), /Index must be empty/);
});

test("staged extra paths or changed bytes fail before commit", t => {
  const f = fixture(t); f.write("selected.txt", "wrong\n"); f.git("add", "selected.txt");
  assert.throws(() => checkReleaseGit(f.root, "before-commit", f.manifest()), /content differs/);
  f.write("selected.txt", "reviewed\n"); f.write("other.txt", "extra\n"); f.git("add", "selected.txt", "other.txt");
  assert.throws(() => checkReleaseGit(f.root, "before-commit", f.manifest()), /Staged paths/);
});

test("unstaged selected hash, empty stage and deleted versus unreadable are distinct", t => {
  const f = fixture(t); f.write("selected.txt", "wrong\n");
  assert.throws(() => checkReleaseGit(f.root, "before-stage", f.manifest()), /content differs/);
  assert.throws(() => checkReleaseGit(f.root, "before-commit", f.manifest()), /Staged paths/);
  rmSync(join(f.root, "selected.txt"));
  const m = f.manifest(); m.reviewed_files["selected.txt"] = null;
  assert.equal(checkReleaseGit(f.root, "before-stage", m).ok, true);
  f.git("add", "selected.txt");
  assert.equal(checkReleaseGit(f.root, "before-commit", m).ok, true);
});

test("behind state blocks every phase even when pins are accurate", t => {
  const f = fixture(t); const remote = f.commit("other.txt", "remote\n", "remote");
  f.git("update-ref", "refs/remotes/origin/main", remote); f.git("reset", "--hard", f.base);
  for (const phase of ["before-stage", "before-commit", "before-push"]) {
    const m = f.manifest();
    if (phase === "before-push") { delete m.reviewed_files; m.reviewed_commits = [{sha:f.base, reviewed_files:{"selected.txt":hash("baseline\n")}}]; }
    assert.throws(() => checkReleaseGit(f.root, phase, m), /ahead or diverged/);
  }
});

test("083-like divergence blocks without any repair or mutation", t => {
  const f = fixture(t); const remote = f.commit("other.txt", "remote snapshot\n", "remote");
  f.git("update-ref", "refs/remotes/origin/main", remote); f.git("reset", "--hard", f.base);
  const local = f.commit("selected.txt", "reviewed\n", "local reviewed action");
  const before = f.git("status", "--porcelain=v1");
  assert.throws(() => checkReleaseGit(f.root, "before-stage", f.manifest()), /1 local, 1 remote/);
  assert.equal(f.git("rev-parse", "HEAD"), local);
  assert.equal(f.git("rev-parse", "refs/remotes/origin/main"), remote);
  assert.equal(f.git("status", "--porcelain=v1"), before);
});

test("stale HEAD and origin pins fail, local ahead blocks new staging", t => {
  const f = fixture(t); const m = f.manifest();
  const local = f.commit("selected.txt", "reviewed\n", "local");
  assert.throws(() => checkReleaseGit(f.root, "before-stage", m), /pins changed/);
  assert.throws(() => checkReleaseGit(f.root, "before-stage", f.manifest()), /HEAD equal/);
  f.git("update-ref", "refs/remotes/origin/main", local);
  const current = f.manifest(); current.expected_origin = f.base;
  assert.throws(() => checkReleaseGit(f.root, "before-stage", current), /pins changed/);
});

test("wrong branch and detached HEAD fail closed", t => {
  const f = fixture(t); f.git("switch", "-c", "other");
  assert.throws(() => checkReleaseGit(f.root, "before-stage", f.manifest()), /branch must be main/);
  f.git("checkout", "--detach", f.base);
  assert.throws(() => checkReleaseGit(f.root, "before-stage", f.manifest()), /Git read failed/);
});

test("complete reviewed multi-commit outgoing range passes without dirty work mutation", t => {
  const f = fixture(t); const first = f.commit("selected.txt", "reviewed\n", "one");
  const second = f.commit("other.txt", "second reviewed\n", "two");
  f.write("untracked.txt", "keep\n");
  const m = {schema_version:1, expected_head:second, expected_origin:f.base, reviewed_commits:[
    {sha:first, reviewed_files:{"selected.txt":hash("reviewed\n")}},
    {sha:second, reviewed_files:{"other.txt":hash("second reviewed\n")}}
  ]};
  assert.equal(checkReleaseGit(f.root, "before-push", m).ahead, 2);
  assert.equal(readFileSync(join(f.root, "untracked.txt"), "utf8"), "keep\n");
  assert.throws(() => checkReleaseGit(f.root, "before-push", {...m,reviewed_commits:m.reviewed_commits.slice(1)}), /outgoing range/);
  assert.throws(() => checkReleaseGit(f.root, "before-push", {...m,reviewed_commits:[...m.reviewed_commits].reverse()}), /outgoing range/);
});

test("outgoing path/hash mismatch and staged work fail before push", t => {
  const f = fixture(t); const local = f.commit("selected.txt", "reviewed\n", "local");
  const m = {schema_version:1,expected_head:local,expected_origin:f.base,
    reviewed_commits:[{sha:local,reviewed_files:{"selected.txt":hash("wrong\n")}}]};
  assert.throws(() => checkReleaseGit(f.root, "before-push", m), /Committed content/);
  m.reviewed_commits[0].reviewed_files = {"other.txt":hash("reviewed\n")};
  assert.throws(() => checkReleaseGit(f.root, "before-push", m), /Commit paths/);
  m.reviewed_commits[0].reviewed_files = {"selected.txt":hash("reviewed\n")};
  f.write("other.txt", "staged\n"); f.git("add", "other.txt");
  assert.throws(() => checkReleaseGit(f.root, "before-push", m), /unstaged index/);
});

test("reviewed deletion passes outgoing scope with null resulting hash", t => {
  const f = fixture(t); f.git("rm", "selected.txt"); f.git("commit", "-m", "reviewed deletion");
  const local = f.git("rev-parse", "HEAD");
  assert.equal(checkReleaseGit(f.root, "before-push", {schema_version:1,expected_head:local,expected_origin:f.base,
    reviewed_commits:[{sha:local,reviewed_files:{"selected.txt":null}}]}).ok, true);
});

test("push without outgoing history and shallow repositories fail closed", t => {
  const f = fixture(t);
  const m = {schema_version:1,expected_head:f.base,expected_origin:f.base,
    reviewed_commits:[{sha:f.base,reviewed_files:{"selected.txt":hash("baseline\n")}}]};
  assert.throws(() => checkReleaseGit(f.root,"before-push",m),/outgoing commits/);
  writeFileSync(join(f.root,".git/shallow"),f.base+"\n");
  assert.throws(() => checkReleaseGit(f.root,"before-stage",f.manifest()),/Shallow history/);
});

test("merge commits are rejected even when all outgoing commits are declared", t => {
  const f = fixture(t); f.git("switch","-c","side");
  const side = f.commit("other.txt","side\n","side"); f.git("switch","main");
  const main = f.commit("selected.txt","reviewed\n","main");
  f.git("merge","--no-ff","side","-m","fixture merge");
  const merge = f.git("rev-parse","HEAD");
  const records = {
    [side]:{sha:side,reviewed_files:{"other.txt":hash("side\n")}},
    [main]:{sha:main,reviewed_files:{"selected.txt":hash("reviewed\n")}},
    [merge]:{sha:merge,reviewed_files:{"other.txt":hash("side\n")}}
  };
  const m = {schema_version:1,expected_head:merge,expected_origin:f.base,
    reviewed_commits:f.git("rev-list","--reverse",`${f.base}..${merge}`).split("\n").map(sha=>records[sha])};
  assert.throws(() => checkReleaseGit(f.root,"before-push",m),/Merge or root/);
});

test("resolved unfinished merge is rejected before committing exact reviewed content", t => {
  const f = fixture(t); f.git("switch","-c","side");
  f.commit("selected.txt","reviewed\n","side"); f.git("switch","main");
  f.git("merge","--no-ff","--no-commit","side");
  const before = f.git("status","--porcelain=v1");
  const index = readFileSync(join(f.root,".git/index"));
  assert.throws(() => checkReleaseGit(f.root,"before-commit",f.manifest()),/Active Git operation: MERGE_HEAD/);
  assert.deepEqual(readFileSync(join(f.root,".git/index")),index);
  assert.equal(f.git("status","--porcelain=v1"),before);
  assert.equal(f.git("rev-parse","HEAD"),f.base);
});

test("all supported active-operation markers reject every release phase", t => {
  const f = fixture(t); f.write("selected.txt","reviewed\n"); f.git("add","selected.txt");
  for(const marker of ["CHERRY_PICK_HEAD","REVERT_HEAD","rebase-merge","rebase-apply","sequencer"]){
    const path=join(f.root,".git",marker);
    if(marker.endsWith("HEAD"))writeFileSync(path,f.base+"\n");else mkdirSync(path);
    for(const phase of ["before-stage","before-commit","before-push"]){
      const m=f.manifest();
      if(phase==="before-push"){delete m.reviewed_files;m.reviewed_commits=[{sha:f.base,reviewed_files:{"selected.txt":hash("baseline\n")}}];}
      assert.throws(()=>checkReleaseGit(f.root,phase,m),/Active Git operation/);
    }
    rmSync(path,{recursive:true,force:true});
  }
});

test("legacy graft cannot hide an outgoing side commit or merge parent", t => {
  const f=fixture(t);f.git("switch","-c","side");
  f.commit("other.txt","side\n","side");f.git("switch","main");
  const main=f.commit("selected.txt","reviewed\n","main");
  f.git("merge","--no-ff","side","-m","fixture merge");
  const merge=f.git("rev-parse","HEAD");
  writeFileSync(join(f.root,".git/info/grafts"),`${merge} ${main}\n`);
  const m={schema_version:1,expected_head:merge,expected_origin:f.base,reviewed_commits:[
    {sha:main,reviewed_files:{"selected.txt":hash("reviewed\n")}},
    {sha:merge,reviewed_files:{"other.txt":hash("side\n")}}
  ]};
  const index=readFileSync(join(f.root,".git/index"));
  assert.throws(()=>checkReleaseGit(f.root,"before-push",m),/Legacy Git grafts/);
  assert.deepEqual(readFileSync(join(f.root,".git/index")),index);
  assert.equal(readFileSync(join(f.root,".git/info/grafts"),"utf8"),`${merge} ${main}\n`);
});

test("symlink and directory scope fail rather than being treated as regular reviewed files", t => {
  const f = fixture(t); rmSync(join(f.root, "selected.txt")); symlinkSync("other.txt", join(f.root,"selected.txt"));
  const m = f.manifest(); m.reviewed_files["selected.txt"] = hash("other baseline\n");
  assert.throws(() => checkReleaseGit(f.root, "before-stage", m), /regular files/);
  f.git("add", "selected.txt");
  assert.throws(() => checkReleaseGit(f.root, "before-commit", m), /regular stage-zero/);
});

test("manifest rejects invalid types, paths, pins, unknown fields and sparse commit arrays", t => {
  const f = fixture(t); const m = f.manifest();
  for (const bad of [null, [], {...m,schema_version:"1"}, {...m,expected_head:"HEAD"}, {...m,extra:true},
    {...m,reviewed_files:{}}, {...m,reviewed_files:{"../escape":hash("x")}},
    {...m,reviewed_files:{"a/.git/x":hash("x")}}, {...m,reviewed_files:{"selected.txt":false}}]) {
    assert.throws(() => validateManifest(bad, "before-stage"));
  }
  const record = {sha:f.base,reviewed_files:m.reviewed_files};
  for (const commits of [[], new Array(1), [record,record], [{...record,sha:1}]]) {
    assert.throws(() => validateManifest({schema_version:1,expected_head:f.base,expected_origin:f.base,reviewed_commits:commits}, "before-push"));
  }
  assert.throws(() => validateManifest(m, "stage"));
});

test("CLI options reject missing, duplicate and unknown options", () => {
  assert.equal(parseGuardOptions(["--manifest","/tmp/m.json","--phase","before-commit"])["--phase"], "before-commit");
  for (const args of [[],["--phase"],["--phase","bad","--manifest","p"],
    ["--phase","before-stage","--phase","before-push"],["--write","yes","--manifest","p"]]) {
    assert.throws(() => parseGuardOptions(args));
  }
});

test("CLI nonzero exit can gate later mutations and redirected Git index is rejected", t => {
  const f = fixture(t); f.write("selected.txt", "reviewed\n");
  const manifestPath = join(f.root, "manifest.json"); writeFileSync(manifestPath,JSON.stringify(f.manifest()));
  const args = [cli,"--phase","before-stage","--manifest",manifestPath];
  assert.equal(spawnSync(process.execPath,args,{cwd:f.root}).status,0);
  const result = spawnSync(process.execPath,args,{cwd:f.root,env:{...process.env,GIT_INDEX_FILE:join(f.root,"redirect-index")}});
  assert.equal(result.status,1); assert.match(result.stderr.toString(),/Unsupported Git environment/);
  const graftResult=spawnSync(process.execPath,args,{cwd:f.root,env:{...process.env,GIT_GRAFT_FILE:join(f.root,"grafts")}});
  assert.equal(graftResult.status,1);assert.match(graftResult.stderr.toString(),/Unsupported Git environment/);
  f.write("selected.txt", "unreviewed\n");
  assert.equal(spawnSync(process.execPath,args,{cwd:f.root}).status,1);
  assert.equal(f.git("rev-parse","HEAD"),f.base);
});
