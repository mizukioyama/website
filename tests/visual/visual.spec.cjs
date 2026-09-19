const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");

const localJquery = fs.readFileSync(
  path.resolve(__dirname, "../../docs/js/jquery-3.7.1.min.js"),
  "utf8"
);

const visualBaselineProjects = new Set(["desktop-1440", "mobile-390"]);
const fullAudit = process.env.VISUAL_FULL === "1";

const pages = [
  { key: "home", path: "", title: /Mizuki|小山瑞樹/i, footer: false },
  { key: "gallery", path: "gallery.html", title: /Gallery|Art|Mizuki|小山瑞樹/i },
  { key: "biography", path: "biography.html", title: /Biography|Mizuki|小山瑞樹/i },
  { key: "artist-statement", path: "artist-statement.html", title: /Statement|Mizuki|小山瑞樹/i },
  { key: "information", path: "information.html", title: /Information|Mizuki|小山瑞樹/i },
  { key: "order", path: "order.html", title: /Order|Mizuki|小山瑞樹/i },
  { key: "contact", path: "contact.html", title: /Contact|Mizuki|小山瑞樹/i },
  {
    key: "404",
    path: "__visual-missing__/deep/path/",
    title: /404|Page not found/i,
    status: 404
  },
  {
    key: "yurayura",
    path: "exhibitions/yurayura/",
    title: /ゆらゆら|Yurayura/i
  }
];

function isLocal(url) {
  try {
    return new URL(url).hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

async function prepareDeterministicNetwork(page) {
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
}

async function stabilize(page) {
  await page.addStyleTag({ path: path.resolve(__dirname, "stabilize.css") });

  await page.waitForFunction(() => {
    const title = document.querySelector(".h1-text h1.text");
    if (!title) return true;
    const target = title.getAttribute("aria-label");
    return !target || title.innerText.trim() === target.trim();
  }, null, { timeout: 3500 }).catch(() => {});

  await page.evaluate(() => {
    const year = document.querySelector("#year");
    if (year) year.textContent = "2026";
  });

  await page.waitForTimeout(150);
  await page.mouse.move(0, 0);
}

async function layoutDiagnostics(page) {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const overflow = Math.max(
      document.documentElement.scrollWidth,
      document.body?.scrollWidth || 0
    ) - viewportWidth;

    const selectors = "main h1, main h2, main h3, main p, main a, main li, main td, main th";
    const clippedText = [...document.querySelectorAll(selectors)]
      .filter(element => {
        const style = getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden") return false;
        if (Number(style.opacity) === 0) return false;
        if (!["hidden", "clip"].includes(style.overflowX)) return false;
        return element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 2;
      })
      .slice(0, 12)
      .map(element => ({
        tag: element.tagName,
        text: (element.textContent || "").trim().slice(0, 80),
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth
      }));

    const brokenVisibleImages = [...document.images]
      .filter(image => {
        const rect = image.getBoundingClientRect();
        return rect.bottom > 0
          && rect.top < window.innerHeight
          && rect.right > 0
          && rect.left < window.innerWidth;
      })
      .filter(image => image.complete && image.naturalWidth === 0)
      .map(image => image.currentSrc || image.src);

    return { overflow, clippedText, brokenVisibleImages };
  });
}

for (const entry of pages) {
  test(entry.key + " visual and layout regression", async ({ page }, testInfo) => {
    const pageErrors = [];
    const consoleErrors = [];
    const localResourceFailures = [];

    await page.addInitScript(() => {
      const RealDate = Date;
      const fixed = new RealDate("2026-09-19T06:00:00Z").valueOf();

      class FixedDate extends RealDate {
        constructor(...args) {
          super(...(args.length ? args : [fixed]));
        }

        static now() {
          return fixed;
        }
      }

      window.Date = FixedDate;
      Math.random = () => 0.42;
    });

    page.on("pageerror", error => pageErrors.push(error.message));
    page.on("console", message => {
      if (message.type() !== "error") return;
      const source = message.location()?.url || "";
      if (!source || isLocal(source)) {
        consoleErrors.push(message.text());
      }
    });
    page.on("response", response => {
      const status = response.status();
      if (status < 400 || !isLocal(response.url())) return;
      const expectedDocument404 =
        entry.status === 404 && response.request().resourceType() === "document";
      if (!expectedDocument404) {
        localResourceFailures.push(status + " " + response.url());
      }
    });
    page.on("requestfailed", request => {
      if (isLocal(request.url())) {
        localResourceFailures.push(
          "FAILED " + request.url() + " " + (request.failure()?.errorText || "")
        );
      }
    });

    await prepareDeterministicNetwork(page);
    const response = await page.goto(entry.path, { waitUntil: "domcontentloaded" });
    expect(response, "navigation should return a response").not.toBeNull();
    expect(response.status()).toBe(entry.status || 200);

    await stabilize(page);

    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator("#header-container header")).toBeAttached();
    await expect(page.locator("#header-container .head a")).toBeAttached();
    await expect(page.locator("#navArea .toggle_btn")).toBeAttached();
    if (entry.footer !== false) {
      await expect(page.locator("#footer-container footer")).toBeAttached();
    }

    const diagnostics = await layoutDiagnostics(page);
    expect(diagnostics.overflow, "document has horizontal overflow").toBeLessThanOrEqual(2);
    expect(diagnostics.clippedText, "visible main text is clipped inside its box").toEqual([]);
    expect(diagnostics.brokenVisibleImages, "visible image failed to load").toEqual([]);

    expect(pageErrors, "runtime page errors").toEqual([]);
    const relevantConsoleErrors = entry.status === 404
      ? consoleErrors.filter(message =>
          !message.includes("Failed to load resource: the server responded with a status of 404")
        )
      : consoleErrors;
    expect(relevantConsoleErrors, "same-origin console errors").toEqual([]);
    expect(localResourceFailures, "same-origin failed resources").toEqual([]);

    if (visualBaselineProjects.has(testInfo.project.name)) {
      await expect(page).toHaveScreenshot(entry.key + ".png", {
        fullPage: true,
        timeout: 15000
      });
    } else if (fullAudit) {
      await page.screenshot({
        path: testInfo.outputPath(entry.key + "-full-page.png"),
        fullPage: true,
        animations: "disabled",
        caret: "hide"
      });
    }
  });
}

test("404 keyboard focus and recovery links", async ({ page }, testInfo) => {
  await prepareDeterministicNetwork(page);
  const response = await page.goto("__visual-missing__/focus/check/", { waitUntil: "domcontentloaded" });
  expect(response.status()).toBe(404);
  await stabilize(page);

  const links = page.locator(".not-found-links a");
  await expect(links).toHaveCount(3);
  await expect(links.nth(0)).toHaveAttribute("href", "/website/");
  await expect(links.nth(1)).toHaveAttribute("href", "/website/gallery.html");
  await expect(links.nth(2)).toHaveAttribute("href", "/website/information.html");

  await page.keyboard.press("Tab");
  let focused = page.locator(":focus");

  for (let index = 0; index < 40; index += 1) {
    const href = await focused.getAttribute("href").catch(() => null);
    if (href === "/website/") break;
    await page.keyboard.press("Tab");
    focused = page.locator(":focus");
  }

  await expect(focused).toHaveAttribute("href", "/website/");

  const focusStyle = await focused.evaluate(element => {
    const style = getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth
    };
  });

  expect(focusStyle.outlineStyle).not.toBe("none");
  expect(focusStyle.outlineWidth).not.toBe("0px");

  if (fullAudit) {
    await page.screenshot({
      path: testInfo.outputPath("404-focus.png"),
      fullPage: false
    });
  }
});

test("Yurayura nested navigation resolves to project root", async ({ page }) => {
  await prepareDeterministicNetwork(page);
  const response = await page.goto("exhibitions/yurayura/", { waitUntil: "domcontentloaded" });
  expect(response.status()).toBe(200);
  await stabilize(page);

  const expected = {
    "Art Index": "/website/gallery.html",
    "Artist Statement": "/website/artist-statement.html",
    "Biography": "/website/biography.html",
    "Information": "/website/information.html",
    "Contact Us": "/website/contact.html",
    "Order": "/website/order.html"
  };

  const toggle = page.locator("#navArea .toggle_btn");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#navArea")).toHaveClass(/open/);

  for (const [label, expectedPath] of Object.entries(expected)) {
    const link = page
      .locator("#navArea nav")
      .getByRole("link", { name: label, exact: true })
      .first();
    const href = await link.getAttribute("href");
    expect(new URL(href).pathname).toBe(expectedPath);
  }

  const footerInformation = page
    .locator("#footer-container")
    .getByRole("link", { name: "Information", exact: true });
  const footerHref = await footerInformation.getAttribute("href");
  expect(new URL(footerHref).pathname).toBe("/website/information.html");

  const pageBackLink = page.locator("a.back-link");
  await expect(pageBackLink).toHaveAttribute("href", "../../information.html");
});
