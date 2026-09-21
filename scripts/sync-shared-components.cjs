const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const menuPath = path.join(root, "js", "menu.js");
const targets = [
  {
    name: "HEADER_MARKUP",
    source: "src/components/header.html"
  },
  {
    name: "FOOTER_MARKUP",
    source: "src/components/footer.html"
  }
];

function compileMarkup(source) {
  return source
    .trim()
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${")
    .replace(/@@SITE:([^@]+)@@/g, (_match, sitePath) =>
      "\${siteHref(" + JSON.stringify(sitePath) + ")}"
    );
}

function renderSegment(target) {
  const sourcePath = path.join(root, target.source);
  const source = fs.readFileSync(sourcePath, "utf8");
  return [
    "// BEGIN GENERATED " + target.name + " — source: " + target.source,
    "const " + target.name + " = `",
    compileMarkup(source),
    "`;",
    "// END GENERATED " + target.name
  ].join("\n");
}

let current = fs.readFileSync(menuPath, "utf8");
let expected = current;

for (const target of targets) {
  const pattern = new RegExp(
    "// BEGIN GENERATED " + target.name +
      "[\\s\\S]*?// END GENERATED " + target.name
  );
  if (!pattern.test(expected)) {
    throw new Error(
      "Missing generated component markers for " + target.name + " in js/menu.js"
    );
  }
  expected = expected.replace(pattern, renderSegment(target));
}

if (process.argv.includes("--check")) {
  if (expected !== current) {
    console.error(
      "Shared component output is stale. Run npm run sync:components and commit js/menu.js."
    );
    process.exit(1);
  }
  console.log("Shared component output is in sync.");
  process.exit(0);
}

if (expected !== current) {
  fs.writeFileSync(menuPath, expected, "utf8");
  console.log("Updated js/menu.js from shared components.");
} else {
  console.log("Shared components already in sync.");
}
