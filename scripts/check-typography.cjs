const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const errors = [];

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


function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function parseDeclarations(body) {
  const declarations = new Map();
  for (const declaration of body.split(";")) {
    const colon = declaration.indexOf(":");
    if (colon < 0) continue;
    const property = declaration.slice(0, colon).trim().toLowerCase();
    const value = declaration.slice(colon + 1).trim();
    if (property) declarations.set(property, value);
  }
  return declarations;
}

function collectCssRules(source) {
  const rules = [];

  function parse(css, contexts = []) {
    let cursor = 0;
    while (cursor < css.length) {
      const open = css.indexOf("{", cursor);
      if (open < 0) break;

      let prelude = css.slice(cursor, open).trim();
      const lastSemicolon = prelude.lastIndexOf(";");
      if (lastSemicolon >= 0) prelude = prelude.slice(lastSemicolon + 1).trim();

      let depth = 0;
      let quote = null;
      let escaped = false;
      let close = -1;
      for (let index = open; index < css.length; index += 1) {
        const character = css[index];
        if (quote) {
          if (escaped) escaped = false;
          else if (character === "\\") escaped = true;
          else if (character === quote) quote = null;
          continue;
        }
        if (character === '"' || character === "'") {
          quote = character;
        } else if (character === "{") {
          depth += 1;
        } else if (character === "}") {
          depth -= 1;
          if (depth === 0) {
            close = index;
            break;
          }
        }
      }
      if (close < 0) break;

      const body = css.slice(open + 1, close);
      if (/^@(media|supports|container|layer)\b/i.test(prelude)) {
        parse(body, [...contexts, prelude]);
      } else if (prelude && !prelude.startsWith("@")) {
        rules.push({ selector: prelude, declarations: parseDeclarations(body), contexts });
      }
      cursor = close + 1;
    }
  }

  parse(stripCssComments(source));
  return rules;
}

function inlineCssRules(file) {
  const html = read(file);
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)];
  return styles.flatMap(match => collectCssRules(match[1]));
}

function selectorBranches(selector) {
  return selector.split(",").map(branch => branch.trim()).filter(Boolean);
}

function selectorCompounds(branch) {
  return branch
    .replace(/\s*[>+~]\s*/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function compoundHasClass(compound, name) {
  return new RegExp("\\." + name + "(?![\\w-])").test(compound);
}

function compoundHasTag(compound, name) {
  return compound === name || [".", "#", ":", "["].some(suffix => compound.startsWith(name + suffix));
}

function selectorTargetsEnglishTextParagraph(selector) {
  return selectorBranches(selector).some(branch =>
    selectorCompounds(branch).some(compound =>
      compoundHasTag(compound, "p") &&
      compoundHasClass(compound, "text") &&
      !/:not\(\s*\.text\b/i.test(compound)
    )
  );
}

function normalizedCssValue(value) {
  return (value || "").replace(/\s+/g, " ").trim().toLowerCase();
}

function requireRootTokenMapping(file, token, expectedValue, label) {
  const found = collectCssRules(read(file)).some(rule =>
    selectorBranches(rule.selector).some(branch => branch === ":root") &&
    normalizedCssValue(rule.declarations.get(token)) === normalizedCssValue(expectedValue)
  );
  if (!found) errors.push(file + ": missing " + label);
}

requireText("css/all.css", "font-size: var(--font-body-size);", "shared body token use");
requireText("assets/css/user-settings.css", "--type-body-size: clamp(12px, calc(11.2958px + 0.1878vw), 14px);", "user settings body scale");
for (const page of ["index.html", "gallery.html", "biography.html", "artist-statement.html", "contact.html", "order.html", "policy.html"]) {
  requireText(page, "assets/css/user-settings.css?v=20260922-typography", "user settings stylesheet link");
}
forbidText("css/gallery.css", "--font-body-size:", "must not override the shared body token");

requireRootTokenMapping(
  "assets/css/user-settings.css",
  "--font-body-size",
  "var(--type-page-p-size)",
  "shared body alias to the Standard Pages paragraph token"
);

// Normal reading copy now inherits the shared Standard-page paragraph rule.
// Check its real source rather than requiring duplicate inline declarations.
const galleryRules = collectCssRules(read("css/gallery.css"));
if (!galleryRules.some(rule => rule.selector === "p" &&
  normalizedCssValue(rule.declarations.get("font-size")) === "var(--type-page-p-size)")) {
  errors.push("css/gallery.css: normal reading paragraphs must use the shared Standard Pages token");
}
if (!galleryRules.some(rule => rule.selector === "#state.statement :is(.biography-section, .work) > p.text" &&
  normalizedCssValue(rule.declarations.get("border-top")) === "1px solid var(--text)")) {
  errors.push("css/gallery.css: shared English reading paragraphs must retain their divider");
}
for (const file of ["biography.html", "artist-statement.html", "css/gallery.css", "css/mobile.css"]) {
  const rules = file.endsWith(".html") ? inlineCssRules(file) : collectCssRules(read(file));
  for (const rule of rules) {
    if (!selectorTargetsEnglishTextParagraph(rule.selector)) continue;
    const size = normalizedCssValue(rule.declarations.get("font-size"));
    if (size && !["var(--font-body-size)", "var(--type-page-p-size)"].includes(size)) {
      errors.push(file + ": English reading paragraphs must not override the Standard Pages body role");
    }
  }
}
forbidText("artist-statement.html", "font-size: max(12px, var(--font-caption-size));", "normal English body must not use caption sizing");
forbidText("biography.html", "font-size: max(12px, var(--font-caption-size));", "normal English body must not use caption sizing");

if (errors.length) {
  console.error("Typography source check failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log("Typography source check passed: shared body sizing and bilingual body-copy invariants are intact.");
