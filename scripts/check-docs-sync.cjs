const { spawnSync } = require("node:child_process");

function runGit(args) {
  return spawnSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

const repoCheck = runGit(["rev-parse", "--is-inside-work-tree"]);
if (repoCheck.status !== 0 || repoCheck.stdout.trim() !== "true") {
  console.log("docs committed-sync check skipped: not running inside a Git work tree.");
  process.exit(0);
}

const status = runGit(["status", "--porcelain", "--", "docs"]);
if (status.status !== 0) {
  console.error(status.stderr || "Unable to inspect docs Git status.");
  process.exit(status.status || 1);
}

const changed = status.stdout.trim();
if (changed) {
  console.error("Committed docs/ is stale after build.");
  console.error("Run npm run build, review docs/, and commit the generated output.");
  console.error(changed);
  process.exit(1);
}

console.log("Committed docs/ matches the deterministic generated build output.");
