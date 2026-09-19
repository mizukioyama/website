const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

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

function normalizeKnownPostBuildHtml(content) {
   return content
      .replace(/css\/menu\.css(?:\?v=[^"']*)?/g, "css/menu.css")
      .replace(/css\/form\.css(?:\?v=[^"']*)?/g, "css/form.css")
      .replace(/js\/form\.js(?:\?v=[^"']*)?/g, "js/form.js")
      .replace(/Nature inspire/g, "NatureInspire")
      .replace(/Nature Inspire/g, "NatureInspire");
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
   "bot.html",
   "contact.html",
   "gallery.html",
   "information.html",
   "404.html",
   "exhibition-yurayura-2026.html",
   "matching.html",
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
      ? normalizeKnownPostBuildHtml(source)
      : source;
   const comparableOutput = /\.html?$/i.test(pair.output)
      ? normalizeKnownPostBuildHtml(output)
      : output;

   if (comparableSource !== comparableOutput) {
      let firstDifference = 0;
      const maxComparableLength = Math.min(comparableSource.length, comparableOutput.length);
      while (
         firstDifference < maxComparableLength &&
         comparableSource[firstDifference] === comparableOutput[firstDifference]
      ) {
         firstDifference += 1;
      }
      const start = Math.max(0, firstDifference - 120);
      const end = firstDifference + 240;
      console.error(`DIFF ${pair.source} -> docs/${pair.output} at ${firstDifference}`);
      console.error(`SOURCE: ${JSON.stringify(comparableSource.slice(start, end))}`);
      console.error(`OUTPUT: ${JSON.stringify(comparableOutput.slice(start, end))}`);
      failures.push(
         `docs/${pair.output}: differs from direct-copy source ${pair.source} beyond known post-build transforms`
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
