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
  { key: "policy", path: "policy.html", title: /Policy|Mizuki|小山瑞樹/i },
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

function createRuntimeMonitor(page, entry = {}) {
  const runtime = {
    pageErrors: [],
    consoleErrors: [],
    consoleWarnings: [],
    localResourceFailures: [],
    externalResourceFailures: []
  };

  page.on("pageerror", error => runtime.pageErrors.push(error.message));
  page.on("console", message => {
    const source = message.location()?.url || "";
    if (message.type() === "error" && (!source || isLocal(source))) {
      runtime.consoleErrors.push(message.text());
      return;
    }
    if (message.type() === "warning") {
      runtime.consoleWarnings.push({
        source: source || "(no source)",
        text: message.text()
      });
    }
  });
  page.on("response", response => {
    const status = response.status();
    if (status < 400) return;

    const target = isLocal(response.url())
      ? runtime.localResourceFailures
      : runtime.externalResourceFailures;
    const expectedDocument404 =
      entry.status === 404 &&
      isLocal(response.url()) &&
      response.request().resourceType() === "document";

    if (!expectedDocument404) {
      target.push(status + " " + response.url());
    }
  });
  page.on("requestfailed", request => {
    const target = isLocal(request.url())
      ? runtime.localResourceFailures
      : runtime.externalResourceFailures;
    target.push(
      "FAILED " + request.url() + " " + (request.failure()?.errorText || "")
    );
  });

  return runtime;
}

function relevantConsoleErrors(runtime, entry = {}) {
  return entry.status === 404
    ? runtime.consoleErrors.filter(message =>
        !message.includes("Failed to load resource: the server responded with a status of 404")
      )
    : runtime.consoleErrors;
}

function assertRuntimeClean(runtime, entry = {}) {
  expect(runtime.pageErrors, "runtime page errors / uncaught exceptions").toEqual([]);
  expect(relevantConsoleErrors(runtime, entry), "same-origin console errors").toEqual([]);
  expect(runtime.localResourceFailures, "same-origin failed resources").toEqual([]);
}

async function attachRuntimeObservations(testInfo, entry, runtime) {
  const observations = {
    consoleWarnings: [...new Map(
      runtime.consoleWarnings.map(item => [
        item.source + "\n" + item.text,
        item
      ])
    ).values()],
    externalResourceFailures: [...new Set(runtime.externalResourceFailures)]
  };

  if (!observations.consoleWarnings.length && !observations.externalResourceFailures.length) {
    return;
  }

  console.log(
    "[runtime-observation:" + entry.key + "] " + JSON.stringify(observations)
  );
  await testInfo.attach("runtime-observations-" + entry.key + ".json", {
    body: Buffer.from(JSON.stringify(observations, null, 2)),
    contentType: "application/json"
  });
}

async function expectHorizontalFit(locator, label) {
  const count = await locator.count();
  const viewportWidth = await locator.first().evaluate(() => document.documentElement.clientWidth);

  for (let index = 0; index < count; index += 1) {
    const item = locator.nth(index);
    if (!await item.isVisible()) continue;

    const box = await item.boundingBox();
    expect(box, label + " should have a layout box").not.toBeNull();
    expect(box.x, label + " extends past the left viewport edge").toBeGreaterThanOrEqual(-2);
    expect(
      box.x + box.width,
      label + " extends past the right viewport edge"
    ).toBeLessThanOrEqual(viewportWidth + 2);

    const widthMetrics = await item.evaluate(element => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      overflowX: getComputedStyle(element).overflowX
    }));
    if (!["auto", "scroll"].includes(widthMetrics.overflowX)) {
      expect(
        widthMetrics.scrollWidth - widthMetrics.clientWidth,
        label + " has internal horizontal overflow"
      ).toBeLessThanOrEqual(2);
    }
  }
}

async function expectViewportModalFit(locator, label) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  const viewport = await locator.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: window.innerHeight
  }));

  expect(box, label + " should have a layout box").not.toBeNull();
  expect(box.x, label + " extends past the left edge").toBeGreaterThanOrEqual(-2);
  expect(box.y, label + " extends past the top edge").toBeGreaterThanOrEqual(-2);
  expect(box.x + box.width, label + " extends past the right edge").toBeLessThanOrEqual(viewport.width + 2);
  expect(box.y + box.height, label + " extends past the bottom edge").toBeLessThanOrEqual(viewport.height + 2);
}

async function assertBilingualPage(page, label) {
  await expect(page.locator("body")).toHaveAttribute("data-language-mode", "bilingual");
  const state = await page.evaluate(() => {
    const visible = element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const languageControl = document.querySelector("#langChenge");
    const proseLanguages = [...document.querySelectorAll("main .work > p[lang]")]
      .map(element => element.getAttribute("lang"));
    const proseElements = [...document.querySelectorAll("main .work > p[lang]")];
    const englishPairVisuals = proseElements
      .filter(element => element.getAttribute("lang") === "en")
      .map(element => {
        const style = getComputedStyle(element);
        const next = element.nextElementSibling;
        const nextStyle = next ? getComputedStyle(next) : null;
        return {
          borderTopWidth: parseFloat(style.borderTopWidth) || 0,
          borderTopStyle: style.borderTopStyle,
          nextLanguage: next?.getAttribute("lang") || null,
          nextMarginTop: nextStyle ? parseFloat(nextStyle.marginTop) || 0 : null
        };
      });
    const statementQuestionLanguages = [...document.querySelectorAll("main .statement-questions > p[lang]")]
      .map(element => element.getAttribute("lang"));
    return {
      japaneseRegions: [...document.querySelectorAll('[lang="ja"]')].filter(visible).length,
      englishRegions: [...document.querySelectorAll('[lang="en"]')].filter(visible).length,
      languageControlVisible: Boolean(languageControl && visible(languageControl) && !languageControl.hidden),
      standaloneEnglishContent: document.querySelectorAll('main .state-box > .content[lang="en"]').length,
      proseLanguages,
      englishPairVisuals,
      statementQuestionLanguages
    };
  });

  expect(state.japaneseRegions, label + " should show Japanese regions").toBeGreaterThan(0);
  expect(state.englishRegions, label + " should show English regions").toBeGreaterThan(0);
  expect(state.languageControlVisible, label + " should hide the language switch UI").toBe(false);
  expect(state.standaloneEnglishContent, label + " should not keep a separate English content block").toBe(0);
  expect(state.proseLanguages.length % 2, label + " prose should contain Japanese/English pairs").toBe(0);
  for (let index = 0; index < state.proseLanguages.length; index += 2) {
    expect(state.proseLanguages[index], label + " prose pair should start in Japanese").toBe("ja");
    expect(state.proseLanguages[index + 1], label + " prose pair should place English directly after Japanese").toBe("en");
  }
  for (let index = 0; index < state.englishPairVisuals.length; index += 1) {
    const pair = state.englishPairVisuals[index];
    expect(pair.borderTopWidth, label + " English translation should have a divider").toBeGreaterThanOrEqual(1);
    expect(pair.borderTopStyle, label + " English divider should be visible").not.toBe("none");
    if (pair.nextLanguage !== null) {
      expect(pair.nextLanguage, label + " next bilingual pair should restart in Japanese").toBe("ja");
      expect(pair.nextMarginTop, label + " bilingual pairs should keep a readable gap").toBeGreaterThan(0);
    }
  }
  if (label === "artist-statement") {
    expect(state.statementQuestionLanguages).toHaveLength(10);
    for (let index = 0; index < state.statementQuestionLanguages.length; index += 2) {
      expect(state.statementQuestionLanguages[index], "Artist Statement question pair should start in Japanese").toBe("ja");
      expect(state.statementQuestionLanguages[index + 1], "Artist Statement question pair should place English directly after Japanese").toBe("en");
    }
  }
}

async function assertResponsivePageGeometry(page, entry) {
  if (entry.key === "home") {
    await expectHorizontalFit(
      page.locator("#mainContent .content__slide.active"),
      "Home active content"
    );
    await expectHorizontalFit(
      page.locator("#mainContent .content__slide.active .button-wrap"),
      "Home CTA group"
    );
  }

  if (entry.key === "gallery") {
    await expectHorizontalFit(page.locator("#gallery-container"), "Gallery grid");
    await expectHorizontalFit(
      page.locator("#gallery-container .work-img img"),
      "Gallery artwork image"
    );
    await expectHorizontalFit(page.locator("#pagination"), "Gallery pagination");
    await expectHorizontalFit(page.locator("#category-header"), "Gallery category control");
  }

  if (["biography", "artist-statement"].includes(entry.key)) {
    await expectHorizontalFit(page.locator("main .content"), entry.key + " content");
  }

  if (entry.key === "biography") {
    await expectHorizontalFit(page.locator("main table"), "Biography table");
  }

  if (entry.key === "information") {
    await expectHorizontalFit(page.locator(".information-page .content"), "Information content");
    await expectHorizontalFit(page.locator(".information-page .history-table"), "Information table");
    await expectHorizontalFit(page.locator(".information-page .info-link"), "Information links");
  }

  if (entry.key === "order") {
    await expectHorizontalFit(page.locator(".order-page .content"), "Order content");
    await expectHorizontalFit(page.locator(".order-page .history-table"), "Order table");
    await expectHorizontalFit(page.locator(".order-page .timeline"), "Order process");
    await expectHorizontalFit(page.locator(".order-page .order-cta"), "Order CTA");
  }

  if (entry.key === "contact") {
    await expectHorizontalFit(page.locator("#contactForm"), "Contact form");
    await expectHorizontalFit(
      page.locator("#contactForm input:not([type='hidden']), #contactForm textarea, #contactForm .submit-btn"),
      "Contact form control"
    );
    await expectHorizontalFit(
      page.locator('#contactForm label[for="modal-toggle"]'),
      "Contact SitePolicy control"
    );
  }

  if (entry.key === "policy") {
    await expectHorizontalFit(page.locator("#policy .content"), "Policy content");
  }

  if (entry.key === "404") {
    await expectHorizontalFit(page.locator(".not-found-content"), "404 recovery content");
    await expectHorizontalFit(page.locator(".not-found-links a"), "404 recovery links");
  }

  if (entry.key === "yurayura") {
    await expectHorizontalFit(page.locator(".exhibition-page .content"), "Yurayura content");
    await expectHorizontalFit(page.locator(".exhibition-page .history-table"), "Yurayura details table");
    await expectHorizontalFit(page.locator(".exhibition-page .link-row a"), "Yurayura related links");
  }
}

async function exerciseSharedRuntimeInteractions(page) {
  const toggle = page.locator("#navArea .toggle_btn");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#navArea")).toHaveClass(/open/);
  await page.keyboard.press("Space");
  await expect(page.locator("#navArea")).not.toHaveClass(/open/);

  const englishLabel = page.locator('#langChenge label[for="langEn"]');
  if (await englishLabel.isVisible()) {
    await englishLabel.click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.locator('#langChenge label[for="langJa"]').click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  }
}

async function exerciseGalleryRuntime(page, projectName, testInfo) {
  const categoryHeader = page.locator("#category-header");
  if (projectName.startsWith("mobile-") && await categoryHeader.isVisible()) {
    await categoryHeader.click();
    await expect(categoryHeader).toHaveAttribute("aria-expanded", "true");
  }

  const paintCategory = page.locator('#category-menu li[data-category="Paint"]');
  await paintCategory.click();
  await expect(page.locator("#gallery-container .work").first()).toBeVisible();

  const firstWork = page.locator("#gallery-container .work").first();
  const firstThumbnail = firstWork.locator(".work-img > img");
  const firstTitle = firstWork.locator(".view-policy-button h2");
  await expect(firstThumbnail).toHaveAttribute("alt", await firstTitle.textContent());

  await page.locator('#langChenge label[for="langEn"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(firstThumbnail).toHaveAttribute("alt", await firstTitle.textContent());
  await page.locator('#langChenge label[for="langJa"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(firstThumbnail).toHaveAttribute("alt", await firstTitle.textContent());

  await page.locator(".view-policy-button").first().click();
  await expectViewportModalFit(page.locator("#modalBox"), "Gallery artwork modal");
  await expect(page.locator("#modalCloseBtn")).toBeVisible();
  await expect(page.locator("#modalBox img").first()).toHaveAttribute(
    "alt",
    await page.locator("#modalBox h2").first().textContent()
  );

  if (fullAudit) {
    await page.screenshot({
      path: testInfo.outputPath("gallery-modal.png"),
      fullPage: false,
      animations: "disabled",
      caret: "hide"
    });
  }

  await page.locator("#modalCloseBtn").click();
  await expect(page.locator("#modalBox")).toBeHidden();
}

async function exerciseContactRuntime(page, testInfo) {
  await page.locator('label[for="radio1"]').click();
  await expect(page.locator(".request-options")).toBeVisible();
  await expectHorizontalFit(page.locator(".request-options"), "Contact request options");

  await page.locator('label[for="radio2"]').click();
  await expect(page.locator(".request-options")).toBeHidden();

  await page.locator('label[for="modal-toggle"].modal-open-label').click();
  await expect(page.locator("#modal-toggle")).toBeChecked();
  await expectViewportModalFit(page.locator("body > .modal-box"), "Contact SitePolicy modal");

  if (fullAudit) {
    await page.screenshot({
      path: testInfo.outputPath("contact-policy-modal.png"),
      fullPage: false,
      animations: "disabled",
      caret: "hide"
    });
  }

  await page.locator("body > .modal-box .modal-close-label").click();
  await expect(page.locator("#modal-toggle")).not.toBeChecked();
}

async function exerciseOrderRuntime(page) {
  await page.waitForLoadState("load");
  const contactLink = page
    .getByRole("link", { name: /Contact Us｜お問い合わせ/i })
    .first();
  await expect(contactLink).toBeVisible();
  await contactLink.click();
  await page.waitForURL(/\/website\/contact\.html$/);
  await page.waitForLoadState("domcontentloaded");
  await expect(page.locator("#contactForm")).toBeAttached();
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

async function stabilize(page, entry = {}) {
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

  if (entry.key === "home") {
    await page.evaluate(() => {
      const selectors = [".back__slide", ".card__slide", ".content__slide"];
      const forceFirstSlide = () => {
        for (const selector of selectors) {
          const first = document.querySelector(`${selector}:first-child`);
          if (!first) continue;
          first.classList.add("active");
          first.classList.remove("exit");
          for (const sibling of first.parentElement.children) {
            if (sibling !== first) sibling.classList.remove("active", "exit");
          }
        }
      };

      window.__visualHomeSlideObserver?.disconnect?.();
      forceFirstSlide();

      const observer = new MutationObserver(forceFirstSlide);
      for (const selector of selectors) {
        const first = document.querySelector(`${selector}:first-child`);
        if (first?.parentElement) {
          observer.observe(first.parentElement, {
            attributes: true,
            subtree: true,
            attributeFilter: ["class"]
          });
        }
      }
      window.__visualHomeSlideObserver = observer;
    });
  }

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
    const runtime = createRuntimeMonitor(page, entry);

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

    await prepareDeterministicNetwork(page);
    const response = await page.goto(entry.path, { waitUntil: "domcontentloaded" });
    expect(response, "navigation should return a response").not.toBeNull();
    expect(response.status()).toBe(entry.status || 200);

    await stabilize(page, entry);

    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator("#header-container header")).toBeAttached();
    await expect(page.locator("#header-container .head a")).toBeAttached();
    await expect(page.locator("#navArea .toggle_btn")).toBeAttached();
    if (entry.footer !== false) {
      await expect(page.locator("#footer-container footer")).toBeAttached();
    }
    await assertSharedHeaderFooterTypography(page, testInfo, entry.footer !== false);

    if (entry.key === "information") {
      const titleBox = await page.locator(".information-page > .h1-text h1").boundingBox();
      const sectionTitleBox = await page.locator(".information-page .content > h2").boundingBox();

      expect(titleBox, "Information H1 should have a layout box").not.toBeNull();
      expect(sectionTitleBox, "Information section heading should have a layout box").not.toBeNull();
      expect(
        titleBox.y + titleBox.height,
        "Information noise H1 must not overlap the section heading/content"
      ).toBeLessThan(sectionTitleBox.y);
    }

    const diagnostics = await layoutDiagnostics(page);
    expect(diagnostics.overflow, "document has horizontal overflow").toBeLessThanOrEqual(2);
    expect(diagnostics.clippedText, "visible main text is clipped inside its box").toEqual([]);
    expect(diagnostics.brokenVisibleImages, "visible image failed to load").toEqual([]);

    await assertResponsivePageGeometry(page, entry);

    if (["biography", "artist-statement"].includes(entry.key)) {
      await assertBilingualPage(page, entry.key);
    }

    if (entry.baseline !== false && visualBaselineProjects.has(testInfo.project.name)) {
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

    if (!["biography", "artist-statement", "404", "yurayura"].includes(entry.key)) {
      await exerciseSharedRuntimeInteractions(page);
    }
    if (entry.key === "gallery") {
      await exerciseGalleryRuntime(page, testInfo.project.name, testInfo);
    }
    if (entry.key === "contact") {
      await exerciseContactRuntime(page, testInfo);
    }
    if (entry.key === "order") {
      await exerciseOrderRuntime(page);
    }

    assertRuntimeClean(runtime, entry);
    await attachRuntimeObservations(testInfo, entry, runtime);
  });
}

function expectedHeaderFooterSize(projectName) {
  const expectedByProject = {
    "desktop-1440": 25.6,
    "desktop-1280": 24.6,
    "tablet-1024": 22.6,
    "tablet-768": 20.5,
    "mobile-430": 18,
    "mobile-390": 18,
    "mobile-375": 18
  };
  return expectedByProject[projectName];
}

async function assertSharedHeaderFooterTypography(page, testInfo, hasFooter = true) {
  const expected = expectedHeaderFooterSize(testInfo.project.name);
  expect(expected, "viewport should have a documented Header/Footer target").toBeDefined();

  const sizes = await page.evaluate(hasFooterValue => ({
    header: parseFloat(getComputedStyle(document.querySelector("#header-container .head a")).fontSize),
    footer: hasFooterValue
      ? [...document.querySelectorAll("#footer-container footer a")]
          .map(link => parseFloat(getComputedStyle(link).fontSize))
      : []
  }), hasFooter);
  const roundToTenth = value => Math.round(value * 10) / 10;

  expect(roundToTenth(sizes.header), "Header brand font-size").toBe(expected);
  if (hasFooter) {
    expect(sizes.footer.length, "Footer navigation should exist").toBeGreaterThan(0);
    for (const size of sizes.footer) {
      expect(roundToTenth(size), "Footer navigation font-size").toBe(expected);
      expect(Math.abs(size - sizes.header), "Header/Footer font-size should match").toBeLessThanOrEqual(0.05);
    }
  }
}

test("404 keyboard focus and recovery links", async ({ page }, testInfo) => {
  const entry = { key: "404-interaction", status: 404 };
  const runtime = createRuntimeMonitor(page, entry);
  await prepareDeterministicNetwork(page);
  const response = await page.goto("__visual-missing__/focus/check/", { waitUntil: "domcontentloaded" });
  expect(response.status()).toBe(404);
  await stabilize(page, entry);

  await exerciseSharedRuntimeInteractions(page);

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

  await focused.click();
  await page.waitForURL(/\/website\/$/);
  await expect(page.locator("#header-container header")).toBeAttached();

  assertRuntimeClean(runtime, entry);
  await attachRuntimeObservations(testInfo, entry, runtime);

  if (fullAudit) {
    await page.screenshot({
      path: testInfo.outputPath("404-focus.png"),
      fullPage: false
    });
  }
});

test("Yurayura nested navigation resolves to project root", async ({ page }, testInfo) => {
  const entry = { key: "yurayura-interaction" };
  const runtime = createRuntimeMonitor(page, entry);
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
  await expect(toggle).toHaveAttribute("role", "button");
  await expect(toggle).toHaveAttribute("tabindex", "0");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toHaveAttribute("aria-label", "Open navigation menu");

  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#navArea")).toHaveClass(/open/);
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(toggle).toHaveAttribute("aria-label", "Close navigation menu");

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

  await page.keyboard.press("Space");
  await expect(page.locator("#navArea")).not.toHaveClass(/open/);

  await pageBackLink.click();
  await page.waitForURL(/\/website\/information\.html$/);
  await expect(page.locator(".information-page")).toBeAttached();

  assertRuntimeClean(runtime, entry);
  await attachRuntimeObservations(testInfo, entry, runtime);
});

test("primary navigation and conversion paths", async ({ page }, testInfo) => {
  test.skip(
    !["desktop-1440", "mobile-390"].includes(testInfo.project.name),
    "Primary conversion paths are verified on representative desktop and mobile viewports."
  );

  const entry = { key: "navigation-conversion" };
  const runtime = createRuntimeMonitor(page, entry);
  await prepareDeterministicNetwork(page);

  const visitHome = async () => {
    const response = await page.goto("", { waitUntil: "domcontentloaded" });
    expect(response.status()).toBe(200);
    await stabilize(page);
    await expect(page.locator("#header-container header")).toBeAttached();
  };

  const openMenu = async () => {
    const toggle = page.locator("#navArea .toggle_btn");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(page.locator("#navArea")).toHaveClass(/open/);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  };

  await visitHome();
  await openMenu();

  const expectedMenuPaths = {
    "Art Index": "/website/gallery.html",
    "Artist Statement": "/website/artist-statement.html",
    "Biography": "/website/biography.html",
    "Information": "/website/information.html",
    "Contact Us": "/website/contact.html",
    "Order": "/website/order.html",
    "Site Policy": "/website/policy.html"
  };

  for (const [label, expectedPath] of Object.entries(expectedMenuPaths)) {
    const link = page
      .locator("#navArea nav")
      .getByRole("link", { name: label, exact: true })
      .first();
    const href = await link.getAttribute("href");
    expect(new URL(href).pathname).toBe(expectedPath);
  }

  const galleryLink = page
    .locator("#navArea nav")
    .getByRole("link", { name: "Art Index", exact: true })
    .first();
  await Promise.all([
    page.waitForURL(/\/website\/gallery\.html$/),
    galleryLink.click()
  ]);
  await expect(page.locator("#gallery-container")).toBeAttached();

  await visitHome();
  await openMenu();

  const informationLink = page
    .locator("#navArea nav")
    .getByRole("link", { name: "Information", exact: true })
    .first();
  await Promise.all([
    page.waitForURL(/\/website\/information\.html$/),
    informationLink.click()
  ]);
  await expect(page.locator(".information-page")).toBeAttached();

  const exhibitionDetail = page.locator(
    'a.info-link[href="exhibitions/yurayura/"]'
  );
  await expect(exhibitionDetail).toHaveCount(1);
  await expect(exhibitionDetail).toContainText("展示詳細を見る");
  await Promise.all([
    page.waitForURL(/\/website\/exhibitions\/yurayura\/$/),
    exhibitionDetail.click()
  ]);
  await expect(page.locator(".exhibition-page")).toBeAttached();

  const officialSite = page.locator(
    'a.detail-link[href="https://mizukioyama.github.io/yurayura/"]'
  );
  await expect(officialSite).toHaveCount(1);
  await expect(officialSite).toContainText("ゆらゆら公式サイト");
  await expect(officialSite).toHaveAttribute("target", "_blank");
  await expect(officialSite).toHaveAttribute("rel", /noopener/);
  await expect(officialSite).toHaveAttribute("rel", /noreferrer/);

  await visitHome();
  await openMenu();

  const policyLink = page
    .locator("#navArea nav")
    .getByRole("link", { name: "Site Policy", exact: true })
    .first();
  await Promise.all([
    page.waitForURL(/\/website\/policy\.html$/),
    policyLink.click()
  ]);
  await expect(page.locator("#policy .content").first()).toBeAttached();

  assertRuntimeClean(runtime, entry);
  await attachRuntimeObservations(testInfo, entry, runtime);
});

for (const entry of [
  { key: "information-motion-runtime", path: "information.html" },
  { key: "yurayura-motion-runtime", path: "exhibitions/yurayura/" }
]) {
  test(entry.key + " initializes without runtime errors", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "Motion initialization is audited once per normal run."
    );

    const runtime = createRuntimeMonitor(page, entry);
    await prepareDeterministicNetwork(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });

    const response = await page.goto(entry.path, { waitUntil: "domcontentloaded" });
    expect(response.status()).toBe(200);
    await page.waitForLoadState("load");

    await expect(page.locator("#vanta-bg-bio canvas").first()).toBeAttached();

    assertRuntimeClean(runtime, entry);
    await attachRuntimeObservations(testInfo, entry, runtime);
  });
}

test("all sitemap pages are registered for visual checks", async ({}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "Visual coverage manifest is checked once per run."
  );

  const sitemap = fs.readFileSync(
    path.resolve(__dirname, "../../docs/sitemap.xml"),
    "utf8"
  );

  const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(match => new URL(match[1]).pathname)
    .filter(pathname => pathname.startsWith("/website/"))
    .map(pathname => pathname.slice("/website/".length))
    .map(pathname => pathname || "");

  const registeredPaths = new Set(
    pages
      .filter(entry => entry.status !== 404)
      .map(entry => entry.path)
  );

  const missing = sitemapPaths.filter(pathname => !registeredPaths.has(pathname));
  expect(
    missing,
    "Every sitemap page must be registered in Visual Regression or explicitly designed as non-indexable."
  ).toEqual([]);
});


test("Biography and Artist Statement stay bilingual while language preference persists", async ({ page }, testInfo) => {
  const entry = { key: "bilingual-pages-interaction" };
  const runtime = createRuntimeMonitor(page, entry);
  await prepareDeterministicNetwork(page);

  await page.addInitScript(() => {
    localStorage.setItem("selectedLang", "en");
    localStorage.setItem("lang", "en");
  });

  for (const path of ["biography.html", "artist-statement.html"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await stabilize(page);
    await assertBilingualPage(page, path);
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  }

  await page.goto("gallery.html", { waitUntil: "domcontentloaded" });
  await stabilize(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('#langChenge input[value="en"]')).toBeChecked();

  await page.goto("biography.html", { waitUntil: "domcontentloaded" });
  await stabilize(page);
  await assertBilingualPage(page, "Biography after returning from Gallery");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");

  assertRuntimeClean(runtime, entry);
  await attachRuntimeObservations(testInfo, entry, runtime);
});


for (const entry of [
  { key: "biography", path: "biography.html" },
  { key: "artist-statement", path: "artist-statement.html" }
]) {
  test(entry.key + " mobile English reading comfort", async ({ page }, testInfo) => {
    test.skip(
      !testInfo.project.name.startsWith("mobile-"),
      "Mobile reading metrics are checked only on mobile viewport projects."
    );

    await page.addInitScript(() => {
      localStorage.setItem("selectedLang", "en");
      localStorage.setItem("lang", "en");
    });
    await prepareDeterministicNetwork(page);

    const response = await page.goto(entry.path, { waitUntil: "domcontentloaded" });
    expect(response.status()).toBe(200);
    await stabilize(page);

    const englishParagraph = page.locator('main .work > p.text[lang="en"]').first();
    await expect(englishParagraph).toBeVisible();

    const metrics = await englishParagraph.evaluate((paragraph, key) => {
      const paragraphStyle = getComputedStyle(paragraph);
      const rootOverflow = Math.max(
        document.documentElement.scrollWidth,
        document.body?.scrollWidth || 0
      ) - document.documentElement.clientWidth;

      const result = {
        rootOverflow,
        paragraphFontSize: parseFloat(paragraphStyle.fontSize),
        paragraphLineHeight: parseFloat(paragraphStyle.lineHeight),
        paragraphWordBreak: paragraphStyle.wordBreak || "",
        paragraphOverflowWrap: paragraphStyle.overflowWrap || ""
      };

      if (key === "artist-statement") {
        const flow = document.querySelector('main .statement-questions > p.text[lang="en"]');
        const flowStyle = flow ? getComputedStyle(flow) : null;
        result.flowFontSize = flowStyle ? parseFloat(flowStyle.fontSize) : 0;
        result.flowLineHeight = flowStyle ? parseFloat(flowStyle.lineHeight) : 0;
        result.flowWordBreak = flowStyle?.wordBreak || "";
      }

      return result;
    }, entry.key);

    expect(metrics.rootOverflow, "English mobile page has horizontal overflow").toBeLessThanOrEqual(2);
    expect(metrics.paragraphFontSize, "English paragraph font is too small").toBeGreaterThanOrEqual(12);
    expect(
      metrics.paragraphLineHeight / metrics.paragraphFontSize,
      "English paragraph line-height is too tight"
    ).toBeGreaterThanOrEqual(1.75);
    expect(metrics.paragraphWordBreak, "English paragraphs must not use break-all").not.toBe("break-all");

    if (entry.key === "artist-statement") {
      expect(metrics.flowFontSize, "Statement flow text is too small").toBeGreaterThanOrEqual(12);
      expect(
        metrics.flowLineHeight / metrics.flowFontSize,
        "Statement flow line-height is too tight"
      ).toBeGreaterThanOrEqual(1.75);
      expect(metrics.flowWordBreak, "Statement flow must not use break-all").not.toBe("break-all");
    }
  });
}

test("Biography mobile table reading comfort", async ({ page }, testInfo) => {
  test.skip(
    !testInfo.project.name.startsWith("mobile-"),
    "Biography table metrics are checked only on mobile viewport projects."
  );

  await prepareDeterministicNetwork(page);
  const response = await page.goto("biography.html", { waitUntil: "domcontentloaded" });
  expect(response.status()).toBe(200);
  await stabilize(page);

  const metrics = await page.locator("#state table").first().evaluate(table => {
    const year = table.querySelector("td.year");
    const content = table.querySelector("td.tb-content");
    const translation = table.querySelector("td.tb-content span");
    const yearStyle = year ? getComputedStyle(year) : null;
    const contentStyle = content ? getComputedStyle(content) : null;
    const translationStyle = translation ? getComputedStyle(translation) : null;

    return {
      yearFontSize: yearStyle ? parseFloat(yearStyle.fontSize) : 0,
      contentFontSize: contentStyle ? parseFloat(contentStyle.fontSize) : 0,
      contentLineHeight: contentStyle ? parseFloat(contentStyle.lineHeight) : 0,
      translationFontSize: translationStyle ? parseFloat(translationStyle.fontSize) : 0,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    };
  });

  expect(metrics.scrollWidth - metrics.clientWidth, "Biography table causes horizontal overflow").toBeLessThanOrEqual(2);
  expect(metrics.yearFontSize, "Biography year column is too small").toBeGreaterThanOrEqual(12);
  expect(metrics.contentFontSize, "Biography table text is too small").toBeGreaterThanOrEqual(12);
  expect(metrics.translationFontSize, "Biography table translation is too small").toBeGreaterThanOrEqual(11);
  expect(
    metrics.contentLineHeight / metrics.contentFontSize,
    "Biography table line-height is too tight"
  ).toBeGreaterThanOrEqual(1.5);
});
