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
    .replace(/@@SITE:([^@]*)@@/g, (_match, sitePath) =>
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


const pageSources = ["index.html", "gallery.html", "biography.html", "artist-statement.html", "order.html", "contact.html", "policy.html", "src/information.html", "src/exhibitions/yurayura/index.html", "src/404.html"];
const headerSource = fs.readFileSync(path.join(root, "src/components/header.html"), "utf8");
const primaryLinks = [...headerSource.matchAll(/<li><a href="@@SITE:([^@]*)@@"[^>]*>([^<]+)<\/a>/g)];
const fallback = '<nav class="static-primary-navigation" data-static-primary-navigation aria-label="Primary navigation">\n' +
  primaryLinks.map(match => '  <a href="/website/' + match[1] + '">' + match[2] + '</a>').join('\n') + '\n</nav>';
const footerFallback = fs.readFileSync(path.join(root, "src/components/footer.html"), "utf8")
  .trim().replace("<footer>", '<footer data-static-footer>')
  .replace(/@@SITE:([^@]*)@@/g, (_match, sitePath) => "/website/" + sitePath);
for (const source of pageSources) {
  const file = path.join(root, source);
  const original = fs.readFileSync(file, "utf8");
  let updated = /<nav\b[^>]*data-static-primary-navigation[^>]*>[\s\S]*?<\/nav>/.test(original)
    ? (original.match(/<nav\b[^>]*data-static-primary-navigation[^>]*>[\s\S]*?<\/nav>/)[0].replace(/\r\n/g, "\n") === fallback
      ? original
      : original.replace(/<nav\b[^>]*data-static-primary-navigation[^>]*>[\s\S]*?<\/nav>/, fallback))
    : original.replace('<div id="header-container"></div>', '<div id="header-container">' + fallback + '</div>');
  updated = /<footer\b[^>]*data-static-footer[^>]*>[\s\S]*?<\/footer>/.test(updated)
    ? updated.replace(/<footer\b[^>]*data-static-footer[^>]*>[\s\S]*?<\/footer>/, footerFallback)
    : updated.replace('<div id="footer-container"></div>', '<div id="footer-container">' + footerFallback + '</div>');
  if (updated !== original) {
    if (process.argv.includes("--check")) {
      console.error("Static navigation is stale: " + source);
      process.exit(1);
    }
    fs.writeFileSync(file, updated, "utf8");
  }
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
