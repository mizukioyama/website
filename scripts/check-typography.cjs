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

function compoundHasId(compound, name) {
  return new RegExp("#" + name + "(?![\\w-])").test(compound);
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

function selectorTargetsBiographyParagraph(selector) {
  return selectorBranches(selector).some(branch => {
    const compounds = selectorCompounds(branch);
    let previous = -1;
    for (const [kind, name] of [["id", "bio"], ["id", "state"], ["class", "content"], ["class", "work"]]) {
      const found = compounds.findIndex((compound, index) =>
        index > previous && (kind === "id" ? compoundHasId(compound, name) : compoundHasClass(compound, name))
      );
      if (found < 0) return false;
      previous = found;
    }
    return compounds.slice(previous + 1).some(compound =>
      compoundHasTag(compound, "p") && !/:not\(\s*\.text\b/i.test(compound)
    );
  });
}

function selectorTargetsContainerTextParagraph(selector, containerClass) {
  return selectorBranches(selector).some(branch => {
    const compounds = selectorCompounds(branch);
    const container = compounds.findIndex(compound => compoundHasClass(compound, containerClass));
    return container >= 0 && compounds.slice(container + 1).some(compound =>
      compoundHasTag(compound, "p") &&
      compoundHasClass(compound, "text") &&
      !/:not\(\s*\.text\b/i.test(compound)
    );
  });
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

function requireInlineStyleRule(file, selectorMatches, contextMatches, declarationsMatch, label) {
  const found = inlineCssRules(file).some(rule =>
    selectorMatches(rule.selector) &&
    contextMatches(rule.contexts) &&
    declarationsMatch(rule.declarations)
  );
  if (!found) errors.push(file + ": missing " + label);
}

requireText("css/all.css", "--font-body-size: clamp(12px, calc(10.4px + 0.4vw), 14px);", "shared body scale");
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

const hasBodyToken = declarations =>
  normalizedCssValue(declarations.get("font-size")) === "var(--font-body-size)";
const outsideMobileMedia = contexts =>
  !contexts.some(context => /max-width\s*:\s*599px/i.test(context));
const biographyMobileMedia = contexts =>
  contexts.some(context => /@media\b/i.test(context) && /max-width\s*:\s*599px/i.test(context));

requireInlineStyleRule(
  "biography.html",
  selectorTargetsEnglishTextParagraph,
  outsideMobileMedia,
  hasBodyToken,
  "desktop English paragraph using the shared Standard Pages body token"
);
requireInlineStyleRule(
  "biography.html",
  selectorTargetsBiographyParagraph,
  biographyMobileMedia,
  hasBodyToken,
  "mobile Biography work paragraphs using the shared Standard Pages body token"
);
requireInlineStyleRule(
  "artist-statement.html",
  selector => selectorTargetsContainerTextParagraph(selector, "work"),
  outsideMobileMedia,
  hasBodyToken,
  "desktop Statement English paragraphs using the shared Standard Pages body token"
);
requireInlineStyleRule(
  "artist-statement.html",
  selector => selectorTargetsContainerTextParagraph(selector, "timeline-copy"),
  outsideMobileMedia,
  declarations => hasBodyToken(declarations) && normalizedCssValue(declarations.get("border-top")) === "1px solid #333",
  "desktop Statement timeline English body token and divider"
);
forbidText("artist-statement.html", "font-size: max(12px, var(--font-caption-size));", "normal English body must not use caption sizing");
forbidText("biography.html", "font-size: max(12px, var(--font-caption-size));", "normal English body must not use caption sizing");

if (errors.length) {
  console.error("Typography source check failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log("Typography source check passed: shared body sizing and bilingual body-copy invariants are intact.");
