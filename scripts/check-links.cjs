const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outputDirectory = path.join(root, "docs");
const projectBasePath = "/website/";
const siteOrigin = "https://mizukioyama.github.io";
const referencePattern = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
const cssUrlPattern = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
const fetchPattern = /\bfetch\(\s*["']([^"']+)["']/gi;
const anchorPattern = /<a\b([^>]*)\bhref\s*=\s*(["'])([^"']+)\2([^>]*)>([\s\S]*?)<\/a\s*>/gi;
const indexableOutputs = [
   "index.html",
   "gallery.html",
   "artist-statement.html",
   "biography.html",
   "information.html",
   "contact.html",
   "order.html",
   "policy.html",
   "exhibitions/yurayura/index.html"
];
const expectedStaticPrimaryPaths = [
   "/website/",
   "/website/gallery.html",
   "/website/artist-statement.html",
   "/website/biography.html",
   "/website/information.html",
   "/website/contact.html",
   "/website/order.html",
   "/website/policy.html"
];

function listFiles(directory, extensionPattern) {
   if (!fs.existsSync(directory)) {
      return [];
   }

   return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
         return listFiles(absolutePath, extensionPattern);
      }

      return extensionPattern.test(entry.name) ? [absolutePath] : [];
   });
}

function stripQueryAndHash(reference) {
   return reference.split("#", 1)[0].split("?", 1)[0];
}

function safeDecode(value) {
   try {
      return decodeURIComponent(value);
   } catch {
      return value;
   }
}

function isInsideOutput(target) {
   const relative = path.relative(outputDirectory, target);
   return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function resolveProjectAbsolute(pathname) {
   const normalizedBase = projectBasePath.endsWith("/")
      ? projectBasePath
      : `${projectBasePath}/`;

   if (pathname === normalizedBase.slice(0, -1)) {
      pathname = normalizedBase;
   }

   if (!pathname.startsWith(normalizedBase)) {
      return null;
   }

   const siteRelativePath = safeDecode(pathname.slice(normalizedBase.length));
   return path.resolve(outputDirectory, siteRelativePath);
}

function resolveReference(sourceFile, reference) {
   const cleanReference = stripQueryAndHash(reference.trim());

   if (!cleanReference || cleanReference === "#" || cleanReference.startsWith("#")) {
      return null;
   }

   if (cleanReference.startsWith("//") || cleanReference.startsWith("\\\\")) {
      return null;
   }

   if (/^[a-z][a-z0-9+.-]*:/i.test(cleanReference)) {
      let url;
      try {
         url = new URL(cleanReference);
      } catch {
         return null;
      }

      if ((url.protocol === "http:" || url.protocol === "https:")
         && url.origin === siteOrigin) {
         return resolveProjectAbsolute(url.pathname);
      }

      return null;
   }

   if (cleanReference.startsWith("/")) {
      return resolveProjectAbsolute(cleanReference);
   }

   return path.resolve(path.dirname(sourceFile), safeDecode(cleanReference));
}

function resolveIndexTarget(target) {
   if (!target) {
      return null;
   }

   if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      return path.join(target, "index.html");
   }

   return target;
}

function getAttribute(attributes, name) {
   const expression = "\\b" + name + "\\s*=\\s*([\"'])(([\\s\\S])*?)\\1";
   const match = attributes.match(new RegExp(expression, "i"));
   return match ? match[2].trim() : null;
}

function stripHtml(value) {
   return value
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
}

function checkReference(sourceFile, reference, label, missing) {
   const target = resolveIndexTarget(resolveReference(sourceFile, reference));

   if (!target) {
      return;
   }

   if (!isInsideOutput(target)) {
      missing.push(`${label} -> ${reference} (resolves outside docs/)`);
      return;
   }

   if (!fs.existsSync(target)) {
      missing.push(`${label} -> ${reference}`);
   }
}

const missing = [];
const crawlFailures = [];
const inboundIndexableLinks = new Map(indexableOutputs.map(output => [output, new Set()]));

for (const output of indexableOutputs) {
   const htmlFile = path.join(outputDirectory, output);
   if (!fs.existsSync(htmlFile)) {
      crawlFailures.push("docs/" + output + ": indexable page is missing");
      continue;
   }

   const contents = fs.readFileSync(htmlFile, "utf8").replace(/<!--[\s\S]*?-->/g, "");
   const staticNavMatch = contents.match(
      /<nav\b[^>]*data-static-primary-navigation[^>]*>([\s\S]*?)<\/nav\s*>/i
   );

   if (!staticNavMatch) {
      crawlFailures.push("docs/" + output + ": static primary navigation fallback is missing");
   } else {
      const navHtml = staticNavMatch[1];
      for (const expectedPath of expectedStaticPrimaryPaths) {
         const doubleQuoted = 'href="' + expectedPath + '"';
         const singleQuoted = "href='" + expectedPath + "'";
         if (!navHtml.includes(doubleQuoted) && !navHtml.includes(singleQuoted)) {
            crawlFailures.push(
               "docs/" + output + ": static primary navigation is missing " + expectedPath
            );
         }
      }
   }

   for (const match of contents.matchAll(anchorPattern)) {
      const attributes = match[1] + " " + match[4];
      const href = match[3].trim();
      const label = getAttribute(attributes, "aria-label") || stripHtml(match[5]);

      if (!label) {
         crawlFailures.push("docs/" + output + ": anchor " + href + " has no accessible name");
      }
      if (/^(?:こちら|here|click here)$/i.test(label)) {
         crawlFailures.push(
            "docs/" + output + ": anchor " + href + ' uses ambiguous text "' + label + '"'
         );
      }

      const target = resolveIndexTarget(resolveReference(htmlFile, href));
      if (!target || !isInsideOutput(target)) continue;

      const targetOutput = path.relative(outputDirectory, target).split(path.sep).join("/");
      if (inboundIndexableLinks.has(targetOutput) && targetOutput !== output) {
         inboundIndexableLinks.get(targetOutput).add(output);
      }
   }
}

for (const [output, sources] of inboundIndexableLinks) {
   if (sources.size === 0) {
      crawlFailures.push("docs/" + output + ": indexable page is orphaned from static HTML links");
   }
}

for (const htmlFile of listFiles(outputDirectory, /\.html$/i)) {
   // Ignore examples kept in HTML comments (for example path/to/image.jpg).
   const contents = fs.readFileSync(htmlFile, "utf8").replace(/<!--([\s\S]*?)-->/g, "");
   const label = path.relative(root, htmlFile);

   for (const match of contents.matchAll(referencePattern)) {
      checkReference(htmlFile, match[1].trim(), label, missing);
   }
}

for (const cssFile of listFiles(outputDirectory, /\.css$/i)) {
   const contents = fs.readFileSync(cssFile, "utf8");
   const label = path.relative(root, cssFile);

   for (const match of contents.matchAll(cssUrlPattern)) {
      checkReference(cssFile, match[1].trim(), label, missing);
   }
}

for (const jsFile of listFiles(outputDirectory, /\.js$/i)) {
   const contents = fs.readFileSync(jsFile, "utf8");
   const label = `${path.relative(root, jsFile)} fetches`;

   for (const match of contents.matchAll(fetchPattern)) {
      // Fetches in the current published bundle are document-relative. Use
      // the site root document as the baseline while still validating
      // /website/... and same-origin absolute project URLs.
      checkReference(
         path.join(outputDirectory, "index.html"),
         match[1].trim(),
         label,
         missing
      );
   }
}

const failures = [...missing, ...crawlFailures];

if (failures.length > 0) {
   console.error("Local link/crawlability check failed:");
   for (const failure of failures) {
      console.error("- " + failure);
   }
   process.exitCode = 1;
} else {
   console.log(
      "Local HTML/CSS/JavaScript references and static indexable-page crawl paths passed, including /website/ project-root links."
   );
}
