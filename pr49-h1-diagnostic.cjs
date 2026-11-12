const fs = require("node:fs");
const file = "tests/visual/visual.spec.cjs";
let code = fs.readFileSync(file, "utf8");
function replaceOnce(before, after) {
  if (code.split(before).length !== 2) throw new Error("Diagnostic anchor changed: " + before);
  code = code.replace(before, after);
}
replaceOnce('await page.emulateMedia({ reducedMotion: "reduce" });\n    const response = await page.goto(entry.path', 'await page.emulateMedia({ reducedMotion: process.env.DIAG_MOTION || "reduce" });\n    const response = await page.goto(entry.path');
replaceOnce('      const captureStarted = performance.now();', `
      const readTitle = () => page.evaluate(() => {
        const h1 = document.querySelector(".h1-text h1.text");
        const style = getComputedStyle(h1);
        const box = h1.getBoundingClientRect().toJSON();
        const button = document.querySelector("#navArea .toggle_btn");
        return {text:h1.textContent, complete:h1.dataset.visualTitleComplete,
          dudCount:h1.querySelectorAll(".dud").length, box, fontStatus:document.fonts.status,
          font:style.font, fontAvailable:document.fonts.check(style.font, h1.textContent),
          mask:style.maskImage, clip:style.backgroundClip, background:style.backgroundImage,
          fill:style.webkitTextFillColor, opacity:style.opacity,
          animations:h1.getAnimations().map(a => ({state:a.playState,time:a.currentTime})),
          button:button?.getBoundingClientRect().toJSON(), scrollY,
          reduced:matchMedia("(prefers-reduced-motion: reduce)").matches};
      });
      const before = await readTitle();
      const captureStarted = performance.now();`);
replaceOnce('      screenshotDiagnostics = {\n        ...preflight,', `
      const after = await readTitle();
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await page.screenshot({path:testInfo.outputPath("diagnostic-title-" + i + ".png"),
          clip:{x:Math.max(0, Math.floor(after.box.x)), y:Math.max(0, Math.floor(after.box.y)),
                width:Math.max(1, Math.min(preflight.viewport.width - Math.max(0, Math.floor(after.box.x)), Math.floor(after.box.width))),
                height:Math.max(1, Math.floor(after.box.height))},
          animations:"disabled", caret:"hide"});
      }
      console.log("[h1-diagnostic]", JSON.stringify({before,after,preflight}));
      screenshotDiagnostics = {
        ...preflight,`);
fs.writeFileSync(file, code);
