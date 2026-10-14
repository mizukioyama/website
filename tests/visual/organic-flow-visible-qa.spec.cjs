const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");

const localJquery = fs.readFileSync(
  path.resolve(__dirname, "../../docs/js/jquery-3.7.1.min.js"),
  "utf8"
);

const pageRoutes = [
  { key: "biography", path: "biography.html" },
  { key: "artist-statement", path: "artist-statement.html" }
];

const variants = [
  { key: "contour", label: "A-organic-contour", firstRandom: 0.1 },
  { key: "ribbons", label: "B-flowing-ribbons", firstRandom: 0.3 },
  { key: "currents", label: "C-branching-currents", firstRandom: 0.5 },
  { key: "atmosphere", label: "D-atmospheric-flow", firstRandom: 0.7 },
  { key: "hybrid-random", label: "E-hybrid-random", firstRandom: 0.9 }
];

const viewports = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 }
];

function seededValues(seed, count) {
  let state = seed >>> 0;
  const values = [];
  for (let index = 0; index < count; index += 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    values.push(state / 0x100000000);
  }
  return values;
}

function seedFor(route, viewport, variant) {
  return Array.from(route + "|" + viewport + "|" + variant)
    .reduce((seed, character) => (Math.imul(seed ^ character.charCodeAt(0), 16777619) >>> 0), 2166136261);
}

test("captures visible Organic Flow variants on both candidate pages", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "This evidence run manages the requested 1440/768/390 widths within one isolated browser context."
  );
  test.setTimeout(240000);

  const observations = [];
  let currentRandomTape = [];

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("https://code.jquery.com/jquery-3.7.1.min.js", route => {
    route.fulfill({
      status: 200,
      contentType: "text/javascript; charset=utf-8",
      body: localJquery
    });
  });
  for (const pattern of [
    "https://fonts.googleapis.com/**",
    "https://fonts.gstatic.com/**",
    "https://use.typekit.net/**",
    "https://p.typekit.net/**"
  ]) {
    await page.route(pattern, route => {
      const isStylesheet = route.request().resourceType() === "stylesheet";
      route.fulfill({
        status: 200,
        contentType: isStylesheet ? "text/css; charset=utf-8" : "application/octet-stream",
        body: ""
      });
    });
  }
  await page.addInitScript(() => {
    try {
      sessionStorage.removeItem("portfolioOrganicFlow:lastShowcaseVariant:v1");
    } catch (error) {
      // The browser test context may restrict storage on its initial blank page.
    }
  });

  await page.route("**/organic-flow-production.js*", async route => {
    const response = await route.fetch();
    const source = await response.text();
    const testHook = `value: Object.freeze({
      getState,
      setVariantForTest(choice, seed) {
        if (!validChoices.includes(choice) || !instance) return false;
        const engine = window.OrganicFlow;
        const isHybridRandom = choice === "hybrid-random";
        const random = engine.createSeededRandom(seed);
        const nextContributions = isHybridRandom
          ? engine.randomizeHybridContributions(random)
          : { ...HYBRID_BASE };
        instance.setMode(isHybridRandom ? "hybrid" : "manual");
        instance.setVariant(isHybridRandom ? "contour" : choice);
        if (isHybridRandom) instance.setHybridContributions(nextContributions);
        selectedChoice = choice;
        selectedContributions = nextContributions;
        const overlay = document.getElementById("portfolio-overlay-animation");
        if (overlay) overlay.dataset.organicFlowVariant = selectedChoice;
        rememberChoice(selectedChoice);
        return true;
      }
    })`;
    const testableSource = source.replace("value: Object.freeze({ getState })", testHook);
    if (testableSource === source) throw new Error("Visible Organic Flow test hook could not be installed.");
    const wrappedSource = [
      "(() => {",
      "  const nativeRandom = Math.random;",
      "  const fixedValues = " + JSON.stringify(currentRandomTape) + ";",
      "  let fixedIndex = 0;",
      "  Math.random = () => fixedIndex < fixedValues.length ? fixedValues[fixedIndex++] : nativeRandom();",
      "  try {",
      testableSource,
      "  } finally {",
      "    Math.random = nativeRandom;",
      "  }",
      "})();"
    ].join("\n");

    await route.fulfill({ response, body: wrappedSource });
  });

  for (const route of pageRoutes) {
    for (const viewport of viewports) {
      const pageSeed = seedFor(route.key, viewport.width, "visible-qa-runtime");
      currentRandomTape = [0.1, ...seededValues(pageSeed, 24)];
      await page.setViewportSize(viewport);

      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      expect(response.status(), route.key + " should load at " + viewport.width + "px")
        .toBe(200);
      await page.waitForLoadState("load");
      await expect.poll(() => page.locator(".h1-text h1.text").evaluate(title => {
        const target = title.getAttribute("aria-label");
        return Boolean(target && title.innerText.trim() === target.trim() && !title.querySelector(".dud"));
      }), { timeout: 30000 }).toBe(true);
      await expect.poll(() => page.evaluate(() => {
        const state = window.__organicFlowProduction?.getState?.();
        return state && state.engine ? state.engine.frameCount : 0;
      }), { timeout: 15000 }).toBeGreaterThan(0);

      for (const variant of variants) {
        const seed = seedFor(route.key, viewport.width, variant.key);
        const applied = await page.evaluate(({ choice, fixedSeed }) => {
          return window.__organicFlowProduction?.setVariantForTest?.(choice, fixedSeed) === true;
        }, { choice: variant.key, fixedSeed: seed });
        expect(applied, route.key + " test-only variant hook at " + viewport.width + "px")
          .toBe(true);

        const observation = await page.evaluate(() => {
          const state = window.__organicFlowProduction.getState();
          const canvas = document.querySelector("#portfolio-overlay-animation .organic-flow-canvas");
          const rect = canvas.getBoundingClientRect();
          return {
            page: location.pathname,
            viewport: { width: innerWidth, height: innerHeight },
            variant: state.variant,
            hybridContributions: state.hybridContributions,
            organicCanvasCount: state.canvasCount,
            canvasVisible: getComputedStyle(canvas).visibility !== "hidden" &&
              Number(getComputedStyle(canvas).opacity) !== 0,
            canvasBounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            frameCount: state.engine.frameCount,
            rafActive: state.engine.rafActive,
            canvasResolution: state.engine.canvasResolution,
            dpr: state.engine.dpr,
            totalCanvasCount: document.querySelectorAll("canvas").length,
            heading: document.querySelector(".h1-text h1.text")?.getAttribute("aria-label") || null,
            documentScrollWidth: document.documentElement.scrollWidth,
            documentClientWidth: document.documentElement.clientWidth
          };
        });

        expect(observation.variant, route.key + " selected fixed variant at " + viewport.width + "px")
          .toBe(variant.key);
        expect(observation.organicCanvasCount).toBe(1);
        expect(observation.canvasVisible).toBe(true);
        expect(observation.canvasBounds.width).toBeGreaterThanOrEqual(viewport.width - 1);
        expect(observation.canvasBounds.height).toBeGreaterThan(0);
        expect(observation.frameCount).toBeGreaterThan(0);
        expect(observation.rafActive).toBe(true);
        expect(observation.documentScrollWidth).toBeLessThanOrEqual(observation.documentClientWidth);
        if (variant.key === "hybrid-random") {
          expect(Object.values(observation.hybridContributions).reduce((sum, value) => sum + value, 0))
            .toBe(100);
        }

        await page.waitForTimeout(180);
        const imageName = "organic-flow-visible-" + route.key + "-" + viewport.width + "-" + variant.label;
        await testInfo.attach(imageName + ".png", {
          body: await page.screenshot({ fullPage: false }),
          contentType: "image/png"
        });

        if (viewport.width === 768) {
          await page.evaluate(() => window.scrollTo(0, Math.min(520, document.documentElement.scrollHeight - innerHeight)));
          await page.waitForTimeout(180);
          const scrollY = await page.evaluate(() => window.scrollY);
          expect(scrollY).toBeGreaterThan(0);
          await testInfo.attach(imageName + "-scrolled.png", {
            body: await page.screenshot({ fullPage: false }),
            contentType: "image/png"
          });
          await page.evaluate(() => window.scrollTo(0, 0));
        }

        observations.push({
          route: route.key,
          viewport: viewport.width,
          variant: variant.key,
          seed,
          ...observation
        });
      }
    }
  }

  await testInfo.attach("organic-flow-visible-qa-summary.json", {
    body: Buffer.from(JSON.stringify({
      testOnlyDeterministicVariantAndSeed: true,
      productionRandomnessChanged: false,
      routes: pageRoutes.map(route => route.path),
      viewports: viewports.map(viewport => viewport.width),
      variants: variants.map(variant => variant.key),
      screenshotCount: 40,
      observations
    }, null, 2)),
    contentType: "application/json"
  });
});
