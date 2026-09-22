const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const errors = [];

function sourceFiles(directory, extensions) {
  const absolute = path.join(root, directory);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap(entry => {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(relative, extensions);
    return extensions.some(extension => entry.name.endsWith(extension)) ? [relative] : [];
  });
}

function requireText(file, fragment, label) {
  if (!read(file).includes(fragment)) {
    errors.push(`${file}: missing ${label}`);
  }
}

function forbidText(file, fragment, label) {
  if (read(file).includes(fragment)) {
    errors.push(`${file}: ${label}`);
  }
}

requireText("css/all.css", "--font-body-size: clamp(12px, calc(10.4px + 0.4vw), 14px);", "shared body scale");
for (const file of [
  "css/all.css",
  "css/gallery.css",
  "css/menu.css",
  "css/footer.css",
  "assets/css/user-settings.css"
]) {
  forbidText(file, "--legacy-px-", "migration-only legacy token must not ship");
  forbidText(file, "--font-nav-size", "navigation compatibility alias must not ship");
  forbidText(file, "--font-header-footer-size", "header/footer compatibility alias must not ship");
  forbidText(file, "--type-caption-size", "caption compatibility alias must not ship");
}
for (const page of ["index.html", "gallery.html", "biography.html", "artist-statement.html", "contact.html", "order.html", "policy.html"]) {
  requireText(page, "assets/css/user-settings.css?v=20260922-typography", "user settings stylesheet link");
}
forbidText("css/gallery.css", "--font-body-size:", "must not override the shared body token");

const customPropertyFiles = [
  ...sourceFiles("css", [".css"]),
  ...sourceFiles("assets/css", [".css"]),
  ...fs.readdirSync(root).filter(file => file.endsWith(".html")),
  ...sourceFiles("src", [".html", ".css", ".js"]),
  ...sourceFiles("js", [".js"])
];
const customPropertyDeclarations = new Set();
const customPropertyReferences = new Set();
for (const file of customPropertyFiles) {
  const source = read(file).replace(/\/\*[\s\S]*?\*\//g, "");
  for (const match of source.matchAll(/@property\s+(--[\w-]+)\s*\{/g)) {
    customPropertyDeclarations.add(match[1]);
  }
  for (const match of source.matchAll(/(?:^|[;\n{]\s*)(--[\w-]+)\s*:/gm)) {
    customPropertyDeclarations.add(match[1]);
  }
  for (const match of source.matchAll(/var\(\s*(--[\w-]+)/g)) {
    customPropertyReferences.add(match[1]);
  }
}
for (const name of customPropertyReferences) {
  if (!customPropertyDeclarations.has(name)) {
    errors.push(`undefined custom property reference: ${name}`);
  }
}
for (const name of customPropertyDeclarations) {
  if (!customPropertyReferences.has(name)) {
    errors.push(`unused custom property: ${name}`);
  }
}

requireText("biography.html", "p.text{\n            font-size: var(--font-body-size);", "desktop English body token");
requireText("biography.html", "#bio #state .content .work > p.text {", "mobile English body selector");
requireText("biography.html", "padding: 0.75rem 0 0 !important;\n                font-size: var(--font-body-size);", "mobile English body token");

requireText("artist-statement.html", ".work > p.text {\n            font-size: var(--font-body-size);", "Statement English body token");
requireText("artist-statement.html", ".timeline-copy > p.text {", "Statement timeline English selector");
requireText("artist-statement.html", "border-top: 1px solid #333;\n            font-size: var(--font-body-size);", "Statement timeline English body token");
forbidText("artist-statement.html", "font-size: max(12px, var(--font-caption-size));", "normal English body must not use caption sizing");
forbidText("biography.html", "font-size: max(12px, var(--font-caption-size));", "normal English body must not use caption sizing");

if (errors.length) {
  console.error("Typography source check failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log("Typography source check passed: shared body sizing and bilingual body-copy invariants are intact.");
