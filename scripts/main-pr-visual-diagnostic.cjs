const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("@playwright/test");
const { PNG } = require("pngjs");

const oldBase = process.env.VISUAL_OLD_URL || "http://127.0.0.1:4174/website/";
const currentBase = process.env.VISUAL_CURRENT_URL || "http://127.0.0.1:4173/website/";
const outputDir = process.env.VISUAL_OUTPUT_DIR || "main-pr-visual-diagnostic";
const viewports = (process.env.VISUAL_VIEWPORTS || "1440x900,1280x900,1024x900,768x900,430x900,390x900,375x900")
  .split(",")
  .map(value => {
    const [width, height] = value.split("x").map(Number);
    return { width, height };
  });
const pages = [
  ["home", ""],
  ["gallery", "gallery.html"],
  ["biography", "biography.html"],
  ["artist-statement", "artist-statement.html"],
  ["information", "information.html"],
  ["order", "order.html"],
  ["contact", "contact.html"],
  ["policy", "policy.html"],
  ["404", "__visual-missing__/deep/path/"],
  ["yurayura", "exhibitions/yurayura/"]
];

fs.mkdirSync(outputDir, { recursive: true });

function fixedRuntime(page) {
  return page.addInitScript(() => {
    const RealDate = Date;
    const fixed = new RealDate("2026-09-19T06:00:00Z").valueOf();
    class FixedDate extends RealDate {
      constructor(...args) { super(...(args.length ? args : [fixed])); }
      static now() { return fixed; }
    }
    window.Date = FixedDate;
    Math.random = () => 0.42;
  });
}

function runtimeMonitor(page) {
  const runtime = { pageErrors: [], consoleErrors: [], resourceErrors: [], externalResourceFailures: [] };
  page.on("pageerror", error => runtime.pageErrors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") runtime.consoleErrors.push(message.text());
  });
  page.on("response", response => {
    if (response.status() >= 400) runtime.resourceErrors.push(`${response.status()} ${response.url()}`);
  });
  page.on("requestfailed", request => runtime.resourceErrors.push(`FAILED ${request.url()} ${request.failure()?.errorText || ""}`));
  return runtime;
}

async function stabilize(page) {
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    document.querySelectorAll("video, audio").forEach(media => { media.pause?.(); media.currentTime = 0; });
  });
}

async function pageSnapshot(page) {
  return page.evaluate(() => {
    const box = selector => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right,
        width: rect.width, height: rect.height,
        fontSize: style.fontSize, lineHeight: style.lineHeight,
        display: style.display, position: style.position
      };
    };
    const main = document.querySelector("main");
    const body = document.body;
    return {
      documentHeight: document.documentElement.scrollHeight,
      bodyWidth: body.getBoundingClientRect().width,
      viewportWidth: window.innerWidth,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      header: box("#header-container header"),
      main: box("main"),
      footer: box("#footer-container footer"),
      page: box("html"),
      key: {
        galleryGrid: box("#gallery-container"),
        biographyTable: box("main table"),
        statementTimeline: box("main .timeline"),
        informationContent: box(".information-page .content"),
        orderContent: box(".order-page .content"),
        contactForm: box("#contactForm"),
        policyContent: box(".policy-page .content"),
        yurayuraMain: box("main")
      }
    };
  });
}

function pixelDiff(oldBuffer, currentBuffer, diffPath) {
  const oldImage = PNG.sync.read(oldBuffer);
  const currentImage = PNG.sync.read(currentBuffer);
  const width = Math.max(oldImage.width, currentImage.width);
  const height = Math.max(oldImage.height, currentImage.height);
  const diff = new PNG({ width, height });
  let differentPixels = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const oldInside = x < oldImage.width && y < oldImage.height;
      const currentInside = x < currentImage.width && y < currentImage.height;
      const diffIndex = (y * width + x) * 4;
      if (!oldInside || !currentInside) {
        diff.data[diffIndex] = 255;
        diff.data[diffIndex + 1] = 0;
        diff.data[diffIndex + 2] = 0;
        diff.data[diffIndex + 3] = 255;
        differentPixels += 1;
        continue;
      }
      const oldIndex = (y * oldImage.width + x) * 4;
      const currentIndex = (y * currentImage.width + x) * 4;
      const same = [0, 1, 2, 3].every(channel => oldImage.data[oldIndex + channel] === currentImage.data[currentIndex + channel]);
      if (same) {
        diff.data[diffIndex] = 0;
        diff.data[diffIndex + 1] = 0;
        diff.data[diffIndex + 2] = 0;
        diff.data[diffIndex + 3] = 0;
      } else {
        diff.data[diffIndex] = 255;
        diff.data[diffIndex + 1] = 0;
        diff.data[diffIndex + 2] = 0;
        diff.data[diffIndex + 3] = 255;
        differentPixels += 1;
      }
    }
  }
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  return { old: { width: oldImage.width, height: oldImage.height }, current: { width: currentImage.width, height: currentImage.height }, differentPixels, totalPixels: width * height };
}

async function capture(browser, baseUrl, pagePath, viewport, destination) {
  const page = await browser.newPage({ viewport, colorScheme: "dark", reducedMotion: "reduce" });
  await fixedRuntime(page);
  const runtime = runtimeMonitor(page);
  const response = await page.goto(baseUrl + pagePath, { waitUntil: "networkidle" });
  await stabilize(page);
  const image = await page.screenshot({ fullPage: true, animations: "disabled", caret: "hide" });
  fs.writeFileSync(destination, image);
  const snapshot = await pageSnapshot(page);
  await page.close();
  return { status: response?.status() ?? null, runtime, snapshot };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const comparisons = [];
  try {
    for (const [key, pagePath] of pages) {
      for (const viewport of viewports) {
        const stem = `${key}-${viewport.width}`;
        const oldPath = path.join(outputDir, `${stem}-main.png`);
        const currentPath = path.join(outputDir, `${stem}-pr.png`);
        const diffPath = path.join(outputDir, `${stem}-diff.png`);
        const old = await capture(browser, oldBase, pagePath, viewport, oldPath);
        const current = await capture(browser, currentBase, pagePath, viewport, currentPath);
        const pixels = pixelDiff(fs.readFileSync(oldPath), fs.readFileSync(currentPath), diffPath);
        comparisons.push({ key, pagePath, viewport, old, current, pixels });
        console.log(JSON.stringify({ key, viewport, differentPixels: pixels.differentPixels, oldSize: pixels.old, currentSize: pixels.current, oldErrors: old.runtime, currentErrors: current.runtime }));
      }
    }
    const report = {
      comparison: { oldCommit: process.env.VISUAL_OLD_COMMIT, currentCommit: process.env.VISUAL_CURRENT_COMMIT, browser: await browser.version(), viewports, pages },
      summary: {
        total: comparisons.length,
        pixelEqual: comparisons.filter(item => item.pixels.differentPixels === 0).length,
        pixelDifferent: comparisons.filter(item => item.pixels.differentPixels !== 0).length,
        geometryDifferent: comparisons.filter(item => JSON.stringify(item.old.snapshot) !== JSON.stringify(item.current.snapshot)).length,
        runtimeErrors: comparisons.filter(item => Object.values(item.old.runtime).some(value => value.length) || Object.values(item.current.runtime).some(value => value.length)).length
      },
      comparisons
    };
    fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2) + "\n");
    console.log("MAIN_PR_VISUAL_DIAGNOSTIC_SUMMARY");
    console.log(JSON.stringify(report.summary, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
