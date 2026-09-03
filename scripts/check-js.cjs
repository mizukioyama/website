const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const sourceDirectories = ["src", "scripts"];
const files = ["webpack.config.js", "babel.config.cjs"];
const htmlFiles = [];

function collectJavaScriptFiles(directory) {
   const absoluteDirectory = path.join(root, directory);

   if (!fs.existsSync(absoluteDirectory)) {
      return;
   }

   for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
      const relativePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
         collectJavaScriptFiles(relativePath);
      } else if (/\.c?js$/i.test(entry.name)) {
         files.push(relativePath);
      }
   }
}

function collectHtmlFiles(directory) {
   const absoluteDirectory = path.join(root, directory);

   if (!fs.existsSync(absoluteDirectory)) {
      return;
   }

   for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
      const relativePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
         collectHtmlFiles(relativePath);
      } else if (/\.html?$/i.test(entry.name)) {
         htmlFiles.push(relativePath);
      }
   }
}

for (const directory of sourceDirectories) {
   collectJavaScriptFiles(directory);
}

collectHtmlFiles("src");

const failures = [];

for (const relativePath of files.sort()) {
   const absolutePath = path.join(root, relativePath);
   const result = spawnSync(process.execPath, ["--check", absolutePath], {
      encoding: "utf8"
   });

   if (result.status !== 0) {
      failures.push({
         file: relativePath,
         output: `${result.stdout || ""}${result.stderr || ""}`.trim()
      });
   }
}

function collectInlineScripts(relativePath) {
   const absolutePath = path.join(root, relativePath);
   const html = fs.readFileSync(absolutePath, "utf8");
   const scripts = [];
   const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
   let match;

   while ((match = scriptPattern.exec(html)) !== null) {
      const attributes = match[1] || "";
      const source = match[2] || "";

      if (/\bsrc\s*=/.test(attributes) || /\btype\s*=\s*["']application\/ld\+json["']/i.test(attributes)) {
         continue;
      }

      if (source.trim()) {
         scripts.push({ source, line: html.slice(0, match.index).split("\n").length });
      }
   }

   return scripts;
}

for (const relativePath of htmlFiles.sort()) {
   const inlineScripts = collectInlineScripts(relativePath);

   inlineScripts.forEach(({ source, line }, index) => {
      const result = spawnSync(process.execPath, ["--check", "-"], {
         input: source,
         encoding: "utf8"
      });

      if (result.status !== 0) {
         failures.push({
            file: `${relativePath} (inline script ${index + 1}, line ${line})`,
            output: `${result.stdout || ""}${result.stderr || ""}`.trim()
         });
      }
   });
}

if (failures.length > 0) {
   for (const failure of failures) {
      console.error(`JavaScript syntax error: ${failure.file}`);
      console.error(failure.output);
   }
   process.exitCode = 1;
} else {
   const inlineScriptCount = htmlFiles.reduce(
      (count, relativePath) => count + collectInlineScripts(relativePath).length,
      0
   );
   console.log(`JavaScript syntax check passed (${files.length} files, ${inlineScriptCount} inline scripts).`);
}
