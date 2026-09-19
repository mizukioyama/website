const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outputDirectory = path.resolve(
   process.env.SEO_OUTPUT_DIR || path.join(root, "docs")
);
const sourceOnly = process.argv.includes("--source-only");
const siteOrigin = "https://mizukioyama.github.io/website";
const canonicalPersonId = "https://mizukioyama.github.io/website/#person";
const canonicalPersonName = "小山瑞樹";
const canonicalPersonAlternateName = "Mizuki Oyama";
const canonicalPersonJobTitle = "Abstract Artist";
const confirmedPersonSameAs = [
   "https://camp-fire.jp/profile/OyamaMizuki",
   "https://note.com/merry_ruff8755",
   "https://www.instagram.com/1998_m.oyama/"
];
const retiredDomains = [
   "oyama-artist-gallery.online",
   "freelife-artist.com"
];
const exhibitionsSourceDirectory = path.join(root, "src", "exhibitions");

function toPosixPath(value) {
   return value.split(path.sep).join("/");
}

function listExhibitionPages(directory = exhibitionsSourceDirectory) {
   if (!fs.existsSync(directory)) {
      return [];
   }

   return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
         return listExhibitionPages(absolutePath);
      }

      if (entry.name.toLowerCase() !== "index.html") {
         return [];
      }

      const source = toPosixPath(path.relative(root, absolutePath));
      const output = toPosixPath(path.relative(path.join(root, "src"), absolutePath));
      const canonicalPath = output.replace(/index\.html$/i, "");

      return [{
         output,
         source,
         canonical: `${siteOrigin}/${canonicalPath}`,
         kind: "exhibition"
      }];
   });
}

const exhibitionPages = listExhibitionPages();

const indexablePages = [
   { output: "index.html", source: "index.html", canonical: `${siteOrigin}/` },
   {
      output: "artist-statement.html",
      source: "artist-statement.html",
      canonical: `${siteOrigin}/artist-statement.html`
   },
   {
      output: "biography.html",
      source: "biography.html",
      canonical: `${siteOrigin}/biography.html`
   },
   {
      output: "order.html",
      source: "order.html",
      canonical: `${siteOrigin}/order.html`
   },
   { output: "gallery.html", source: "gallery.html", canonical: `${siteOrigin}/gallery.html` },
   { output: "contact.html", source: "contact.html", canonical: `${siteOrigin}/contact.html` },
   { output: "policy.html", source: "policy.html", canonical: `${siteOrigin}/policy.html` },
   {
      output: "information.html",
      source: "src/information.html",
      canonical: `${siteOrigin}/information.html`
   },
   ...exhibitionPages
];

const nonIndexablePages = [
   { output: "matching.html", source: "src/matching.html" },
   { output: "bot.html", source: "src/bot.html" },
   { output: "404.html", source: "src/404.html" }
];

const legacyRedirectPages = [
   {
      output: "exhibition-yurayura-2026.html",
      source: "src/exhibition-yurayura-2026.html",
      canonical: `${siteOrigin}/exhibitions/yurayura/`,
      destination: "./exhibitions/yurayura/"
   }
];

function readFile(relativePath, directory = root) {
   const absolutePath = path.join(directory, relativePath);

   if (!fs.existsSync(absolutePath)) {
      return null;
   }

   return fs.readFileSync(absolutePath, "utf8");
}

function getAttribute(tag, attributeName) {
   const quoted = tag.match(
      new RegExp(`\\b${attributeName}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i")
   );

   if (quoted) {
      return quoted[2].trim();
   }

   const unquoted = tag.match(
      new RegExp(`\\b${attributeName}\\s*=\\s*([^\\s>]+)`, "i")
   );

   return unquoted ? unquoted[1].trim() : null;
}

function getTitle(html) {
   return html.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1].trim() || null;
}

function getMeta(html, attributeName, attributeValue) {
   const tags = html.match(/<meta\b[^>]*>/gi) || [];
   const tag = tags.find(candidate =>
      getAttribute(candidate, attributeName)?.toLowerCase() === attributeValue.toLowerCase()
   );

   return tag ? getAttribute(tag, "content") : null;
}

function getCanonical(html) {
   const tags = html.match(/<link\b[^>]*>/gi) || [];
   const tag = tags.find(candidate =>
      getAttribute(candidate, "rel")?.toLowerCase().split(/\s+/).includes("canonical")
   );

   return tag ? getAttribute(tag, "href") : null;
}

function getRefreshDestination(html) {
   const refresh = getMeta(html, "http-equiv", "refresh") || "";
   const match = refresh.match(/(?:^|;)\s*url\s*=\s*(.+)$/i);

   if (!match) {
      return null;
   }

   return match[1].trim().replace(/^["']|["']$/g, "");
}

function collectObjects(value, collected = []) {
   if (!value || typeof value !== "object") {
      return collected;
   }

   if (Array.isArray(value)) {
      for (const item of value) collectObjects(item, collected);
      return collected;
   }

   collected.push(value);
   for (const child of Object.values(value)) {
      collectObjects(child, collected);
   }
   return collected;
}

function getJsonLdObjects(html) {
   const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
   const objects = [];

   for (const match of html.matchAll(pattern)) {
      if (getAttribute(match[1], "type")?.toLowerCase() !== "application/ld+json") {
         continue;
      }

      try {
         objects.push(JSON.parse(match[2]));
      } catch {
         // validateJsonLd reports the parse failure with source context.
      }
   }

   return objects;
}

function validatePersonIdentity(relativePath, html, failures) {
   const retiredReference = retiredDomains.find(domain => html.includes(domain));
   if (retiredReference) {
      failures.push(`${relativePath}: retired domain reference must be removed (${retiredReference})`);
   }

   const objects = getJsonLdObjects(html).flatMap(item => collectObjects(item, []));
   const personNodes = objects.filter(item =>
      item && item["@type"] === "Person" && item["@id"] === canonicalPersonId
   );

   for (const person of personNodes) {
      if (person.name && person.name !== canonicalPersonName) {
         failures.push(`${relativePath}: canonical Person name must be ${canonicalPersonName}`);
      }
      if (person.alternateName && person.alternateName !== canonicalPersonAlternateName) {
         failures.push(`${relativePath}: canonical Person alternateName must be ${canonicalPersonAlternateName}`);
      }
      if (person.jobTitle && person.jobTitle !== canonicalPersonJobTitle) {
         failures.push(`${relativePath}: canonical Person jobTitle must be ${canonicalPersonJobTitle}`);
      }
   }

   if (relativePath === "index.html" || relativePath === "biography.html") {
      const person = personNodes[0];
      if (!person) {
         failures.push(`${relativePath}: canonical Person JSON-LD is missing`);
         return;
      }

      if (person.name !== canonicalPersonName) {
         failures.push(`${relativePath}: canonical Person name is missing or incorrect`);
      }
      if (person.alternateName !== canonicalPersonAlternateName) {
         failures.push(`${relativePath}: canonical Person alternateName is missing or incorrect`);
      }
      if (person.jobTitle !== canonicalPersonJobTitle) {
         failures.push(`${relativePath}: canonical Person jobTitle is missing or incorrect`);
      }
      if (person.url !== `${siteOrigin}/`) {
         failures.push(`${relativePath}: canonical Person url must be ${siteOrigin}/`);
      }
      if (!person.disambiguatingDescription) {
         failures.push(`${relativePath}: canonical Person disambiguatingDescription is missing`);
      }
      if (!person.description) {
         failures.push(`${relativePath}: canonical Person description is missing`);
      }

      const sameAs = Array.isArray(person.sameAs) ? [...person.sameAs].sort() : [];
      const expectedSameAs = [...confirmedPersonSameAs].sort();
      if (JSON.stringify(sameAs) !== JSON.stringify(expectedSameAs)) {
         failures.push(`${relativePath}: canonical Person sameAs must contain only confirmed identity URLs`);
      }
   }
}

function validateExhibitionSeo(relativePath, html, expectedCanonical, failures) {
   const ogUrl = getMeta(html, "property", "og:url");
   if (ogUrl !== expectedCanonical) {
      failures.push(`${relativePath}: og:url must be ${expectedCanonical}`);
   }

   const event = getJsonLdObjects(html).find(item =>
      item && typeof item === "object" && item["@type"] === "Event"
   );

   if (!event) {
      failures.push(`${relativePath}: Event JSON-LD is missing`);
      return;
   }

   if (event.url !== expectedCanonical) {
      failures.push(`${relativePath}: Event JSON-LD url must be ${expectedCanonical}`);
   }

   if (event["@id"] !== `${expectedCanonical}#event`) {
      failures.push(`${relativePath}: Event JSON-LD @id must be ${expectedCanonical}#event`);
   }
}

function validateLegacyRedirect(relativePath, html, expectedCanonical, expectedDestination, failures) {
   const metadata = validatePage(relativePath, html, expectedCanonical, failures, {
      requireNoindex: true,
      requireH1: false,
      requireOpenGraphImageMetadata: false
   });

   if (!metadata) {
      return;
   }

   const destination = getRefreshDestination(html);
   if (destination !== expectedDestination) {
      failures.push(`${relativePath}: meta refresh must point to ${expectedDestination}`);
   }
}

function getLanguage(html) {
   const htmlTag = html.match(/<html\b[^>]*>/i)?.[0];
   return htmlTag ? getAttribute(htmlTag, "lang") : null;
}

function countHeadings(html, level) {
   return (html.match(new RegExp(`<h${level}\\b`, "gi")) || []).length;
}

function hasNoindex(html) {
   const robots = getMeta(html, "name", "robots") || "";
   return /\bnoindex\b/i.test(robots);
}

function hasIndexableRobots(html) {
   const robots = getMeta(html, "name", "robots") || "";
   return /\bindex\b/i.test(robots) &&
      /\bfollow\b/i.test(robots) &&
      /max-image-preview\s*:\s*large/i.test(robots);
}

function normalizeBrand(value) {
   if (typeof value !== "string") return value;
   return value
      .replace(/Nature\s+inspire/gi, "NatureInspire")
      .replace(/Nature\s*Inspire/gi, "NatureInspire");
}

function validateSitemap(relativePath, sitemap, failures) {
   if (!sitemap) {
      failures.push(`${relativePath}: file is missing`);
      return;
   }

   const entries = [...sitemap.matchAll(/<url>\s*([\s\S]*?)<\/url>/gi)].map(match => match[1]);
   const locations = entries.map(entry => entry.match(/<loc>\s*([^<]+?)\s*<\/loc>/i)?.[1] || null);
   const expectedLocations = indexablePages.map(page => page.canonical);

   for (const expectedLocation of expectedLocations) {
      if (!locations.includes(expectedLocation)) {
         failures.push(`${relativePath}: sitemap is missing ${expectedLocation}`);
      }
   }

   const notFoundLocation = `${siteOrigin}/404.html`;
   if (locations.includes(notFoundLocation)) {
      failures.push(`${relativePath}: sitemap must not include the 404 page`);
   }

   for (const [index, entry] of entries.entries()) {
      const location = locations[index] || `entry ${index + 1}`;
      const lastmod = entry.match(/<lastmod>\s*(\d{4}-\d{2}-\d{2})\s*<\/lastmod>/i)?.[1];
      if (!lastmod) {
         failures.push(`${relativePath}: lastmod is missing for ${location}`);
      }
   }
}

function validateRobots(relativePath, robots, failures) {
   if (!robots) {
      failures.push(`${relativePath}: file is missing`);
      return;
   }

   if (!/^\s*User-agent:\s*\*\s*$/im.test(robots)) {
      failures.push(`${relativePath}: User-agent * is missing`);
   }
   if (!/^\s*Allow:\s*\/\s*$/im.test(robots)) {
      failures.push(`${relativePath}: Allow / is missing`);
   }
   if (!new RegExp(`^\\s*Sitemap:\\s*${siteOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml\\s*$`, "im").test(robots)) {
      failures.push(`${relativePath}: sitemap URL is missing or incorrect`);
   }
}

function validateJsonLd(relativePath, html, failures) {
   const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
   let blockIndex = 0;

   for (const match of html.matchAll(pattern)) {
      if (getAttribute(match[1], "type")?.toLowerCase() !== "application/ld+json") {
         continue;
      }

      blockIndex += 1;

      try {
         JSON.parse(match[2]);
      } catch (error) {
         failures.push(`${relativePath}: JSON-LD block ${blockIndex} is invalid (${error.message})`);
      }
   }
}

function validatePage(relativePath, html, expectedCanonical, failures, options = {}) {
   if (!html) {
      failures.push(`${relativePath}: file is missing`);
      return null;
   }

   const title = getTitle(html);
   const description = getMeta(html, "name", "description");
   const canonical = getCanonical(html);
   const language = getLanguage(html);

   if (options.requireTitle !== false && !title) failures.push(`${relativePath}: title is missing`);
   if (options.requireDescription !== false && !description) {
      failures.push(`${relativePath}: meta description is missing`);
   }
   if (options.requireCanonical !== false && !canonical) {
      failures.push(`${relativePath}: canonical is missing`);
   }
   if (expectedCanonical && canonical && canonical !== expectedCanonical) {
      failures.push(`${relativePath}: canonical must be ${expectedCanonical}`);
   }
   if (language !== "ja") failures.push(`${relativePath}: html lang must be ja`);

   if (options.requireH1 && countHeadings(html, 1) !== 1) {
      failures.push(`${relativePath}: expected exactly one h1`);
   }

   if (options.requireNoindex && !hasNoindex(html)) {
      failures.push(`${relativePath}: noindex is missing`);
   }

   if (options.requireIndexableRobots && !hasIndexableRobots(html)) {
      failures.push(`${relativePath}: indexable robots directive is missing`);
   }

   if (options.requireOpenGraphImageMetadata) {
      const imageType = getMeta(html, "property", "og:image:type");
      const imageWidth = getMeta(html, "property", "og:image:width");
      const imageHeight = getMeta(html, "property", "og:image:height");
      if (imageType !== "image/jpeg") failures.push(`${relativePath}: og:image:type must be image/jpeg`);
      if (imageWidth !== "1920") failures.push(`${relativePath}: og:image:width must be 1920`);
      if (imageHeight !== "1080") failures.push(`${relativePath}: og:image:height must be 1080`);
   }

   validateJsonLd(relativePath, html, failures);

   return { title, description, canonical };
}

if (!sourceOnly && !fs.existsSync(outputDirectory)) {
   console.error(`SEO output directory is missing: ${path.relative(root, outputDirectory) || outputDirectory}`);
   process.exitCode = 1;
   return;
}

const failures = [];

for (const page of indexablePages) {
   const sourceHtml = readFile(page.source);
   const sourceMeta = validatePage(page.source, sourceHtml, page.canonical, failures, {
      requireH1: true,
      requireIndexableRobots: true,
      requireOpenGraphImageMetadata: true
   });

   if (sourceHtml) {
      validatePersonIdentity(page.source, sourceHtml, failures);
   }

   if (page.kind === "exhibition" && sourceHtml) {
      validateExhibitionSeo(page.source, sourceHtml, page.canonical, failures);
   }

   if (sourceOnly || !sourceMeta) continue;

   const outputHtml = readFile(page.output, outputDirectory);
   const outputMeta = validatePage(page.output, outputHtml, page.canonical, failures, {
      requireIndexableRobots: true,
      requireOpenGraphImageMetadata: true
   });

   if (outputHtml) {
      validatePersonIdentity(page.output, outputHtml, failures);
   }

   if (page.kind === "exhibition" && outputHtml) {
      validateExhibitionSeo(page.output, outputHtml, page.canonical, failures);
   }

   if (!outputMeta) continue;

   for (const field of ["title", "description", "canonical"]) {
      const sourceValue = field === "canonical" ? sourceMeta[field] : normalizeBrand(sourceMeta[field]);
      const outputValue = field === "canonical" ? outputMeta[field] : normalizeBrand(outputMeta[field]);
      if (sourceValue !== outputValue) {
         failures.push(`${page.output}: ${field} differs from ${page.source}`);
      }
   }
}

for (const page of nonIndexablePages) {
   const sourceHtml = readFile(page.source);
   const options = {
      requireNoindex: true,
      requireDescription: false,
      requireCanonical: false
   };
   validatePage(page.source, sourceHtml, "", failures, options);

   if (sourceOnly) continue;

   const outputHtml = readFile(page.output, outputDirectory);
   validatePage(page.output, outputHtml, "", failures, options);
}

for (const page of legacyRedirectPages) {
   const sourceHtml = readFile(page.source);
   validateLegacyRedirect(page.source, sourceHtml, page.canonical, page.destination, failures);

   if (sourceOnly) continue;

   const outputHtml = readFile(page.output, outputDirectory);
   validateLegacyRedirect(page.output, outputHtml, page.canonical, page.destination, failures);
}

const exhibitionTitles = new Map();
const exhibitionDescriptions = new Map();

for (const page of exhibitionPages) {
   const html = readFile(page.source);
   if (!html) continue;

   for (const [label, value, registry] of [
      ["title", getTitle(html), exhibitionTitles],
      ["description", getMeta(html, "name", "description"), exhibitionDescriptions]
   ]) {
      if (!value) continue;
      if (registry.has(value)) {
         failures.push(`${page.source}: duplicate exhibition ${label} also used by ${registry.get(value)}`);
      } else {
         registry.set(value, page.source);
      }
   }
}

const sourceSitemap = readFile("sitemap.xml");
validateSitemap("sitemap.xml", sourceSitemap, failures);

const sourceRobots = readFile("robots.txt");
validateRobots("robots.txt", sourceRobots, failures);

if (!sourceOnly) {
   validateSitemap("docs/sitemap.xml", readFile("sitemap.xml", outputDirectory), failures);
   validateRobots("docs/robots.txt", readFile("robots.txt", outputDirectory), failures);
}

if (failures.length > 0) {
   console.error("SEO metadata check failed:");
   failures.forEach(failure => console.error(`- ${failure}`));
   process.exitCode = 1;
} else {
   const mode = sourceOnly ? "source" : "source and generated output";
   console.log(`SEO metadata check passed (${mode}).`);
}
