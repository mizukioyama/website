const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outputDirectory = path.resolve(
   process.env.SEO_OUTPUT_DIR || path.join(root, "docs")
);
const sourceOnly = process.argv.includes("--source-only");
const siteOrigin = "https://mizukioyama.github.io/website";

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
   { output: "gallery.html", source: "gallery.html", canonical: `${siteOrigin}/gallery.html` },
   { output: "contact.html", source: "contact.html", canonical: `${siteOrigin}/contact.html` },
   { output: "policy.html", source: "policy.html", canonical: `${siteOrigin}/policy.html` },
   {
      output: "information.html",
      source: "src/information.html",
      canonical: `${siteOrigin}/information.html`
   }
];

const nonIndexablePages = [
   { output: "matching.html", source: "src/matching.html" },
   { output: "bot.html", source: "src/bot.html" }
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

   if (sourceOnly || !sourceMeta) continue;

   const outputHtml = readFile(page.output, outputDirectory);
   const outputMeta = validatePage(page.output, outputHtml, page.canonical, failures, {
      requireIndexableRobots: true,
      requireOpenGraphImageMetadata: true
   });

   if (!outputMeta) continue;

   for (const field of ["title", "description", "canonical"]) {
      if (sourceMeta[field] !== outputMeta[field]) {
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
