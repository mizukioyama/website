const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { minify: minifyHtml } = require("html-minifier-terser");

const root = path.resolve(__dirname, "..");
const outputDirectory = path.join(root, "docs");

function toPosixPath(value) {
   return value.split(path.sep).join("/");
}

function listExhibitionIndexSources(directory = path.join(root, "src", "exhibitions")) {
   if (!fs.existsSync(directory)) {
      return [];
   }

   return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
         return listExhibitionIndexSources(absolutePath);
      }

      if (entry.name.toLowerCase() !== "index.html") {
         return [];
      }

      const source = toPosixPath(path.relative(root, absolutePath));
      const output = toPosixPath(path.relative(path.join(root, "src"), absolutePath));
      return [{ source, output }];
   });
}

async function normalizeKnownPostBuildHtml(content) {
   let normalized = content
      .replace(/(\.(?:css|js))\?v=[^"'\s>]+/gi, "$1")
      .replace(/Nature inspire/g, "NatureInspire")
      .replace(/Nature Inspire/g, "NatureInspire");

   const minifyOptions = {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      keepClosingSlash: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true
   };

   // html-minifier-terser / clean-css is not fully idempotent for some inline
   // CSS (for example translateX() -> translate() or omitted default easing).
   // Normalize both source and generated HTML toward the same fixed point so the
   // direct-copy check measures content drift, not minification pass count. A
   // generous cap is intentional because clean-css can apply optimizations in
   // successive passes (color/currentColor/media-query canonicalization).
   for (let pass = 0; pass < 12; pass += 1) {
      const minified = await minifyHtml(normalized, minifyOptions);
      if (minified === normalized) {
         break;
      }
      normalized = minified;
   }

   normalized = normalized.replace(
      /(<script\b[^>]*>)([\s\S]*?)(<\/script\s*>)/gi,
      (full, open, source, close) => {
         if (!/\btype\s*=\s*(?:["']application\/ld\+json["']|application\/ld\+json)/i.test(open)) {
            return full;
         }
         return open + JSON.stringify(JSON.parse(source)) + close;
      }
   );

   return normalizeInlineCss(normalized);
}

function normalizeCssForComparison(css) {
   // clean-css can produce semantically equivalent CSS across repeated passes.
   // Canonicalize only inline <style> CSS used by the direct-copy comparison.
   let normalized = css.replace(/translateX\(([^()]*)\)/g, "translate($1)");

   normalized = normalized.replace(
      /(transition(?:-[a-z-]+)?):([^;}]+)/gi,
      (full, property, value) => {
         const canonicalValue = value
            .replace(/\bease(?=\s*(?:,|$))/g, "")
            .replace(/\s+,/g, ",")
            .trim();
         return `${property}:${canonicalValue}`;
      }
   );

   let result = "";
   let quote = null;
   let escaped = false;

   for (let index = 0; index < normalized.length; index += 1) {
      const char = normalized[index];

      if (quote) {
         result += char;
         if (escaped) {
            escaped = false;
         } else if (char === "\\") {
            escaped = true;
         } else if (char === quote) {
            quote = null;
         }
         continue;
      }

      if (char === "\"" || char === "'") {
         quote = char;
         result += char;
         continue;
      }

      if (char === ",") {
         result = result.replace(/\s+$/, "");
         result += ",";
         while (/\s/.test(normalized[index + 1] || "")) {
            index += 1;
         }
         continue;
      }

      result += char;
   }

   return result;
}

function normalizeInlineCss(html) {
   return html.replace(
      /(<style\b[^>]*>)([\s\S]*?)(<\/style\s*>)/gi,
      (full, open, css, close) => open + normalizeCssForComparison(css) + close
   );
}

function describeFirstDifference(left, right) {
   const max = Math.min(left.length, right.length);
   let index = 0;
   while (index < max && left[index] === right[index]) {
      index += 1;
   }
   const start = Math.max(0, index - 80);
   const end = index + 120;
   return {
      index,
      source: left.slice(start, end),
      output: right.slice(start, end)
   };
}

function listHtmlFiles(directory) {
   if (!fs.existsSync(directory)) {
      return [];
   }

   return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
         return listHtmlFiles(absolutePath);
      }

      return /\.html?$/i.test(entry.name) ? [absolutePath] : [];
   });
}

async function main() {
if (!fs.existsSync(outputDirectory)) {
   console.error("Generated output directory is missing: docs/");
   process.exitCode = 1;
   return;
}

const failures = [];
let scriptCount = 0;
const generatedPageNames = new Set([
   "index.html",
   "artist-statement.html",
   "biography.html",
   "order.html",
   "contact.html",
   "gallery.html",
   "information.html",
   "404.html",
   "exhibition-yurayura-2026.html",
   "policy.html"
]);
const exhibitionIndexPattern = /^exhibitions\/(?:[^/]+\/)+index\.html$/;

for (const absolutePath of listHtmlFiles(outputDirectory)) {
   const relativePath = path.relative(root, absolutePath);
   const outputRelativePath = toPosixPath(path.relative(outputDirectory, absolutePath));
   const html = fs.readFileSync(absolutePath, "utf8");
   const isGeneratedPage = (
      path.dirname(absolutePath) === outputDirectory
      && generatedPageNames.has(path.basename(absolutePath))
   ) || exhibitionIndexPattern.test(outputRelativePath);

   if (isGeneratedPage && !/^\s*<!doctype\s+html\s*>/i.test(html)) {
      failures.push(`${relativePath}: missing a standards-mode <!DOCTYPE html>`);
   }

   const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
   let match;
   let scriptIndex = 0;

   while ((match = scriptPattern.exec(html)) !== null) {
      const attributes = match[1] || "";
      const source = match[2] || "";

      if (/\bsrc\s*=/.test(attributes) || !source.trim()) {
         continue;
      }

      const isJsonLd = /\btype\s*=\s*(?:["']application\/ld\+json["']|application\/ld\+json)/i.test(attributes);
      if (isJsonLd) {
         try {
            JSON.parse(source);
         } catch (error) {
            failures.push(`${relativePath} JSON-LD: ${error.message}`);
         }
         continue;
      }

      scriptIndex += 1;
      scriptCount += 1;

      if (/&(?:amp|lt|gt);/.test(source)) {
         failures.push(`${relativePath} inline script ${scriptIndex}: HTML entity found in JavaScript`);
         continue;
      }

      const result = spawnSync(process.execPath, ["--check", "-"], {
         input: source,
         encoding: "utf8"
      });

      if (result.status !== 0) {
         failures.push(
            `${relativePath} inline script ${scriptIndex}: ${(result.stderr || result.stdout).trim()}`
         );
      }
   }
}

const directCopyPairs = [
   { source: "googlee46325beaf44a5bb.html", output: "googlee46325beaf44a5bb.html" },
   { source: "src/information.html", output: "information.html" },
   { source: "src/404.html", output: "404.html" },
   { source: "src/exhibition-yurayura-2026.html", output: "exhibition-yurayura-2026.html" },
   ...listExhibitionIndexSources()
];

for (const pair of directCopyPairs) {
   const sourcePath = path.join(root, pair.source);
   const outputPath = path.join(outputDirectory, pair.output);

   if (!fs.existsSync(sourcePath)) {
      failures.push(`${pair.source}: direct-copy source is missing`);
      continue;
   }

   if (!fs.existsSync(outputPath)) {
      failures.push(`docs/${pair.output}: direct-copy output is missing`);
      continue;
   }

   const source = fs.readFileSync(sourcePath, "utf8");
   const output = fs.readFileSync(outputPath, "utf8");
   const comparableSource = /\.html?$/i.test(pair.source)
      ? await normalizeKnownPostBuildHtml(source)
      : source;
   const comparableOutput = /\.html?$/i.test(pair.output)
      ? await normalizeKnownPostBuildHtml(output)
      : output;

   if (comparableSource !== comparableOutput) {
      const difference = describeFirstDifference(comparableSource, comparableOutput);
      failures.push(
         `docs/${pair.output}: differs from direct-copy source ${pair.source} beyond known post-build transforms at index ${difference.index}; source=${JSON.stringify(difference.source)}; output=${JSON.stringify(difference.output)}`
      );
   }
}

if (failures.length > 0) {
   console.error("Generated site consistency check failed:");
   failures.forEach(failure => console.error(`- ${failure}`));
   process.exitCode = 1;
} else {
   console.log(`Generated site consistency check passed (${scriptCount} scripts).`);
}
}

main().catch(error => {
   console.error(error);
   process.exitCode = 1;
});
