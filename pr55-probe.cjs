const fs=require('node:fs');
const f='tests/visual/visual.spec.cjs';
let s=fs.readFileSync(f,'utf8');
function replace(a,b){if(s.split(a).length!==2)throw Error(a);s=s.replace(a,b);}
replace('await page.emulateMedia({ reducedMotion: "reduce" });\n    const response = await page.goto(entry.path','await page.emulateMedia({ reducedMotion: process.env.PR55_MOTION });\n    const response = await page.goto(entry.path');
replace('      const captureStarted = performance.now();',`      const heading = page.locator(".h1-text h1.text");
      if (process.env.PR55_SETTLE === "1") {
        await heading.evaluate(async title => {
          const font = getComputedStyle(title);
          await document.fonts.load(font.fontStyle + " " + font.fontWeight + " " + font.fontSize + " " + font.fontFamily, title.textContent);
          await document.fonts.ready;
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });
      }
      const headingState = await heading.evaluate(title => {
        const css = getComputedStyle(title);
        const range = document.createRange();
        range.selectNodeContents(title);
        const rect = range.getBoundingClientRect().toJSON();
        return { text: title.textContent, label: title.getAttribute("aria-label"), completed: title.dataset.visualTitleComplete,
          children: title.childElementCount, rect, opacity: css.opacity, visibility: css.visibility,
          mask: css.maskImage, lines: css.getPropertyValue("--lines"), clip: css.backgroundClip,
          font: css.fontFamily, fonts: [...document.fonts].map(({family,status}) => ({family,status})),
          motion: matchMedia("(prefers-reduced-motion: reduce)").matches, animations: title.getAnimations().map(a=>({name:a.animationName,state:a.playState})),
          fontStatus:document.fonts.status, scrollY };
      });
      require("node:fs").writeFileSync(testInfo.outputPath("h1-state.json"), JSON.stringify({headingState,preflight},null,2));
      const captureStarted = performance.now();`);
fs.writeFileSync(f,s);
