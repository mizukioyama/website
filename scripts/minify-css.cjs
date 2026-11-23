// Minify the built CSS in docs/ (level 1 only: whitespace/comments,
// no rule restructuring, so the cascade is untouched).
const fs = require("fs");
const path = require("path");
const CleanCSS = require("clean-css");

const targets = [];
function collect(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) collect(p);
    else if (name.endsWith(".css")) targets.push(p);
  }
}
collect(path.join(__dirname, "..", "docs", "css"));
collect(path.join(__dirname, "..", "docs", "assets", "css"));

const minifier = new CleanCSS({ level: 1, inline: false, rebase: false });
let before = 0, after = 0;
for (const file of targets) {
  const src = fs.readFileSync(file, "utf8");
  const out = minifier.minify(src);
  if (out.errors && out.errors.length) {
    console.error("minify failed:", file, out.errors);
    process.exit(1);
  }
  before += src.length;
  after += out.styles.length;
  fs.writeFileSync(file, out.styles);
}
console.log(`minify-css: ${targets.length} files, ${before} -> ${after} bytes`);
