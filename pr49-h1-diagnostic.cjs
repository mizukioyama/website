const fs = require("node:fs");
const file = "tests/visual/visual.spec.cjs";
let code = fs.readFileSync(file, "utf8");
function replaceOnce(before, after) {
  if (code.split(before).length !== 2) throw new Error("Diagnostic anchor changed: " + before);
  code = code.replace(before, after);
}
replaceOnce('await page.emulateMedia({ reducedMotion: "reduce" });\n    const response = await page.goto(entry.path', 'await page.emulateMedia({ reducedMotion: process.env.DIAG_MOTION || "reduce" });\n    const response = await page.goto(entry.path');
replaceOnce('      screenshotDiagnostics = {\n        ...preflight,', `
      await page.screenshot({path:testInfo.outputPath("viewport.png"), animations:"disabled", caret:"hide"});
      screenshotDiagnostics = {
        ...preflight,`);
fs.writeFileSync(file, code);
