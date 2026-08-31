const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const sourceDirectories = ["src", "scripts"];
const files = ["webpack.config.js", "babel.config.cjs"];

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

for (const directory of sourceDirectories) {
   collectJavaScriptFiles(directory);
}

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

if (failures.length > 0) {
   for (const failure of failures) {
      console.error(`JavaScript syntax error: ${failure.file}`);
      console.error(failure.output);
   }
   process.exitCode = 1;
} else {
   console.log(`JavaScript syntax check passed (${files.length} files).`);
}
