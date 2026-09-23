const fs = require("node:fs");
const { chromium } = require("@playwright/test");

const oldBase = process.env.CONTACT_OLD_URL || "http://127.0.0.1:4174/website/";
const currentBase = process.env.CONTACT_CURRENT_URL || "http://127.0.0.1:4173/website/";
const outputPath = process.env.CONTACT_DIAGNOSTIC_OUTPUT || "contact-diagnostic-report.json";
const selectors = [
  ["main", "main"], ["contactForm", "#contactForm"], ["formRow", "#contactForm .form-row"],
  ["alignCenter", "#contactForm .align-center"], ["consentText", "#consent-text"],
  ["submitButton", "#contactForm .submit-btn"], ["footerContainer", "#footer-container"], ["footer", "footer"]
];
const styleProperties = ["margin-top", "margin-bottom", "padding-top", "padding-bottom", "font-size", "line-height", "display", "position"];
const tokenNames = [
  "--font-body-size", "--font-ui-size", "--type-form-field-size", "--type-form-radio-size",
  "--type-form-radio-group-size", "--type-form-consent-size", "--type-form-button-size",
  "--tracking-form-submit", "--tracking-form-copy", "--tracking-form-message"
];

function snapshot(element) {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  const before = getComputedStyle(element, "::before");
  const after = getComputedStyle(element, "::after");
  return {
    tag: element.tagName.toLowerCase(), id: element.id || "",
    className: typeof element.className === "string" ? element.className : "",
    rect: { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width },
    style: Object.fromEntries(styleProperties.map(property => [property, style.getPropertyValue(property)])),
    pseudo: {
      before: { content: before.content, display: before.display, position: before.position },
      after: { content: after.content, display: after.display, position: after.position }
    },
    text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 240)
  };
}

async function collectPage(page, baseURL) {
  const runtime = { pageErrors: [], consoleErrors: [], resourceFailures: [] };
  page.on("pageerror", error => runtime.pageErrors.push(error.message));
  page.on("console", message => { if (message.type() === "error") runtime.consoleErrors.push(message.text()); });
  page.on("requestfailed", request => runtime.resourceFailures.push({ url: request.url(), error: request.failure()?.errorText || "" }));
  page.on("response", response => { if (response.status() >= 400) runtime.resourceFailures.push({ url: response.url(), status: response.status() }); });
  await page.goto(baseURL + "contact.html", { waitUntil: "networkidle" });
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await page.waitForTimeout(500);

  const result = await page.evaluate(({ selectors, styleProperties, tokenNames }) => {
    function browserSnapshot(element) {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const before = getComputedStyle(element, "::before");
      const after = getComputedStyle(element, "::after");
      return {
        tag: element.tagName.toLowerCase(), id: element.id || "",
        className: typeof element.className === "string" ? element.className : "",
        rect: { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width },
        style: Object.fromEntries(styleProperties.map(property => [property, style.getPropertyValue(property)])),
        pseudo: {
          before: { content: before.content, display: before.display, position: before.position },
          after: { content: after.content, display: after.display, position: after.position }
        },
        text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 240)
      };
    }
    const bySelector = Object.fromEntries(selectors.map(([name, selector]) => [name, browserSnapshot(document.querySelector(selector))]));
    const form = document.querySelector("#contactForm");
    const button = document.querySelector("#contactForm .submit-btn");
    const childSnapshot = (element, index) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        index, tag: element.tagName.toLowerCase(), id: element.id || "",
        className: typeof element.className === "string" ? element.className : "",
        hidden: style.display === "none" || style.visibility === "hidden",
        rect: { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width }
      };
    };
    const formChildren = form ? [...form.children].map(childSnapshot) : [];
    const adjacent = button ? {
      parent: browserSnapshot(button.parentElement),
      previousElement: browserSnapshot(button.previousElementSibling),
      nextElement: browserSnapshot(button.nextElementSibling),
      parentChildren: [...button.parentElement.children].map(childSnapshot)
    } : null;
    const hiddenInputs = [...document.querySelectorAll("#contactForm input[type=hidden], #contactForm iframe")].map(browserSnapshot);
    const tokens = Object.fromEntries(tokenNames.map(name => [name, getComputedStyle(document.documentElement).getPropertyValue(name).trim()]));
    return {
      bySelector, formChildren, adjacent, hiddenInputs, tokens, body: browserSnapshot(document.body),
      documentMetrics: {
        documentScrollHeight: document.documentElement.scrollHeight, bodyScrollHeight: document.body.scrollHeight,
        documentClientWidth: document.documentElement.clientWidth, viewportWidth: window.innerWidth, viewportHeight: window.innerHeight
      }
    };
  }, { selectors, styleProperties, tokenNames });
  return { url: page.url(), result, runtime };
}

function compare(oldValue, currentValue, pathName, differences) {
  if (oldValue === null || currentValue === null) {
    if (oldValue !== currentValue) differences.push({ path: pathName, old: oldValue, current: currentValue });
    return;
  }
  if (typeof oldValue !== "object" || typeof currentValue !== "object") {
    const numeric = typeof oldValue === "number" && typeof currentValue === "number";
    if ((numeric && Math.abs(oldValue - currentValue) > 0.01) || (!numeric && oldValue !== currentValue)) differences.push({ path: pathName, old: oldValue, current: currentValue });
    return;
  }
  for (const key of new Set([...Object.keys(oldValue), ...Object.keys(currentValue)])) compare(oldValue[key], currentValue[key], pathName + "." + key, differences);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const contextOptions = { viewport: { width: 1440, height: 900 }, colorScheme: "dark", reducedMotion: "reduce" };
    const oldPage = await browser.newPage(contextOptions);
    const currentPage = await browser.newPage(contextOptions);
    const old = await collectPage(oldPage, oldBase);
    const current = await collectPage(currentPage, currentBase);
    const differences = [];
    compare(old.result, current.result, "contact", differences);
    const report = {
      comparison: {
        old: { commit: process.env.CONTACT_OLD_COMMIT, url: oldBase },
        current: { commit: process.env.CONTACT_CURRENT_COMMIT, url: currentBase },
        browser: await browser.version(), viewport: { width: 1440, height: 900 }
      }, old, current, differences, firstDifference: differences[0] || null
    };
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + "\n");
    console.log("CONTACT_DIAGNOSTIC_FULL_REPORT");
    console.log(JSON.stringify({ comparison: report.comparison, old: report.old, current: report.current, firstDifference: report.firstDifference }, null, 2));
    console.log(JSON.stringify({ firstDifference: report.firstDifference, differenceCount: differences.length, oldMetrics: old.result.documentMetrics, currentMetrics: current.result.documentMetrics, oldRuntime: old.runtime, currentRuntime: current.runtime }, null, 2));
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
