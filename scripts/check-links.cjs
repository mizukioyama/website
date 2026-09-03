const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outputDirectory = path.join(root, "docs");
const referencePattern = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
const cssUrlPattern = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
const fetchPattern = /\bfetch\(\s*["']([^"']+)["']/gi;

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

function isExternalReference(reference) {
   return reference === "#"
      || reference.startsWith("#")
      || reference.startsWith("/")
      || /^(?:[a-z][a-z0-9+.-]*:|\\\\)/i.test(reference);
}

function resolveReference(sourceFile, reference) {
   const cleanReference = reference.split("#", 1)[0].split("?", 1)[0];

   if (!cleanReference) {
      return null;
   }

   return path.resolve(path.dirname(sourceFile), cleanReference);
}

const missing = [];

for (const htmlFile of listFiles(outputDirectory, /\.html$/i)) {
   // Ignore examples kept in HTML comments (for example path/to/image.jpg).
   const contents = fs.readFileSync(htmlFile, "utf8").replace(/<!--([\s\S]*?)-->/g, "");

   for (const match of contents.matchAll(referencePattern)) {
      const reference = match[1].trim();

      if (isExternalReference(reference)) {
         continue;
      }

      const target = resolveReference(htmlFile, reference);

      if (target && !fs.existsSync(target)) {
         missing.push(`${path.relative(root, htmlFile)} -> ${reference}`);
      }
   }
}

for (const cssFile of listFiles(outputDirectory, /\.css$/i)) {
   const contents = fs.readFileSync(cssFile, "utf8");

   for (const match of contents.matchAll(cssUrlPattern)) {
      const reference = match[1].trim();

      if (isExternalReference(reference)) {
         continue;
      }

      const target = resolveReference(cssFile, reference);

      if (target && !fs.existsSync(target)) {
         missing.push(`${path.relative(root, cssFile)} -> ${reference}`);
      }
   }
}

for (const jsFile of listFiles(outputDirectory, /\.js$/i)) {
   const contents = fs.readFileSync(jsFile, "utf8");

   for (const match of contents.matchAll(fetchPattern)) {
      const reference = match[1].trim();

      if (isExternalReference(reference)) {
         continue;
      }

      // Fetches in the published site are document-relative, regardless of
      // which JavaScript file contains the call.
      const target = resolveReference(path.join(outputDirectory, "index.html"), reference);

      if (target && !fs.existsSync(target)) {
         missing.push(`${path.relative(root, jsFile)} fetches ${reference}`);
      }
   }
}

if (missing.length > 0) {
   console.error("Missing local build references:");
   for (const reference of missing) {
      console.error(`- ${reference}`);
   }
   process.exitCode = 1;
} else {
   console.log("Local HTML/CSS/JavaScript references check passed.");
}
