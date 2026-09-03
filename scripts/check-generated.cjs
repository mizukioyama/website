const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const outputDirectory = path.join(root, "docs");

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
   "bot.html",
   "contact.html",
   "gallery.html",
   "information.html",
   "matching.html",
   "policy.html"
]);

for (const absolutePath of listHtmlFiles(outputDirectory)) {
   const relativePath = path.relative(root, absolutePath);
   const html = fs.readFileSync(absolutePath, "utf8");
   const isGeneratedPage = path.dirname(absolutePath) === outputDirectory
      && generatedPageNames.has(path.basename(absolutePath));

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

      if (/\btype\s*=\s*["']application\/ld\+json["']/i.test(attributes)) {
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

if (failures.length > 0) {
   console.error("Generated inline JavaScript check failed:");
   failures.forEach(failure => console.error(`- ${failure}`));
   process.exitCode = 1;
} else {
   console.log(`Generated inline JavaScript check passed (${scriptCount} scripts).`);
}
