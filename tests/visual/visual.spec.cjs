const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");

const localJquery = fs.readFileSync(
  path.resolve(__dirname, "../../docs/js/jquery-3.7.1.min.js"),
  "utf8"
);

const visualBaselineProjects = new Set(["desktop-1440", "mobile-390"]);
const fullAudit = process.env.VISUAL_FULL === "1";

test("Navigation cells and pagination retain complete hit areas", async ({ page }) => {
  await page.goto("gallery.html");
  const next = page.locator(".next-btn");
  await expect(next).toBeVisible();
  const box = await next.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  if (page.viewportSize().width >= 1299) {
    for (const link of await page.locator("#navArea .inner li a").all()) {
      const dimensions = await link.evaluate(el => ({ link: el.getBoundingClientRect().width, cell: el.parentElement.getBoundingClientRect().width }));
      expect(Math.abs(dimensions.link - dimensions.cell)).toBeLessThan(1);
    }
  }
});

test("Contact policy opener supports native keyboard activation", async ({ page }) => {
  await page.goto("contact.html");
  const opener = page.locator("#contactForm button.modal-open-label");
  await expect(opener).toBeVisible();
  const box = await opener.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
  await opener.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#modal-toggle")).toBeChecked();
  await expect(page.locator('.modal-box')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.modal-close-label')).toBeFocused();
  expect(await page.locator(".modal-close-label").evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
  await page.keyboard.press("Escape");
  await expect(page.locator("#modal-toggle")).not.toBeChecked();
  await expect(opener).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.locator("#modal-toggle")).toBeChecked();
  await page.locator(".modal-close-label").press("Space");
  await expect(page.locator("#modal-toggle")).not.toBeChecked();
  await page.locator("#radio2").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#radio1")).toBeChecked();
});

test("Gallery controls remain operable after hit-area changes", async ({ page }, testInfo) => {
  await prepareDeterministicNetwork(page);
  await page.goto("gallery.html");
  await stabilize(page, pages.find(entry => entry.key === "gallery"));
  await exerciseGalleryRuntime(page, testInfo.project.name, testInfo);
});

test("Contact controls remain operable after hit-area changes", async ({ page }, testInfo) => {
  await prepareDeterministicNetwork(page);
  await page.goto("contact.html");
  await stabilize(page, pages.find(entry => entry.key === "contact"));
  await exerciseContactRuntime(page, testInfo);
});

test("Mobile reading-link hover does not move later click targets", async ({ page }) => {
  await prepareDeterministicNetwork(page);
  for (const width of [375, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("biography.html");
    await stabilize(page, pages.find(entry => entry.key === "biography"));
    const reading = page.locator("main .reading-nav");
    const height = await reading.evaluate(element => element.getBoundingClientRect().height);
    await reading.locator("a").last().hover();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    expect(Math.abs(await reading.evaluate(element => element.getBoundingClientRect().height) - height)).toBeLessThan(1);
    await page.locator("footer > a").first().hover();
    expect(Math.abs(await reading.evaluate(element => element.getBoundingClientRect().height) - height)).toBeLessThan(1);
  }
});

test("Home VIEW is the single native Gallery CTA without modal or slide side effects", async ({ page }) => {
  await prepareDeterministicNetwork(page);
  await observeHomeSlides(page);
  await page.goto("");
  await completeHomeEntry(page);
  await page.waitForFunction(() => window.__visualHomeSlideHistory.length >= 3 && window.__visualHomeSlideHistory.at(-1) === 0);
  await expect(page.locator(".content__slide.exit")).toHaveCount(0);
  await expect(page.locator("#modal-toggle,.modal-overlay,.modal-box,button.modal-open-label")).toHaveCount(0);
  await expect(page.locator("#countdown-2")).toHaveText("CLOSED");
  await expect(page.locator(".content__slide:nth-child(2) .view-policy-button")).toBeDisabled();
  const view = page.locator(".content__slide.active .button-wrap a.button");
  await expect(view).toHaveText("View");
  await expect(view).toHaveAttribute("href", "/website/gallery.html");
  await expect(view).not.toHaveAttribute("data-home-slide");
  await expect(page.locator(".content__slide.active .button-wrap > *")).toHaveCount(1);
  const before = await page.evaluate(() => window.__visualHomeSlideHistory.length);
  await page.evaluate(() => window.addEventListener('pagehide', () => sessionStorage.setItem('viewClickSlideCount', window.__visualHomeSlideHistory.length), {once:true}));
  await view.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/gallery\.html$/);
  expect(await page.evaluate(() => Number(sessionStorage.getItem('viewClickSlideCount')))).toBe(before);
  await page.goBack();
  await expect(page.locator("#home-entry")).toBeHidden();
  await expect(page.locator("#loading-bg")).toBeHidden();
});

test("Home entry chooses language before starting the existing loading sequence", async ({ page }) => {
  await prepareDeterministicNetwork(page);
  await page.goto("");
  await expect(page.locator("#home-entry")).toBeVisible();
  const entryBox = await page.locator("#home-entry").boundingBox();
  expect(entryBox.width).toBe(page.viewportSize().width);
  expect(entryBox.height).toBe(page.viewportSize().height);
  await expect(page.locator("#loading-bg")).toBeHidden();
  await page.locator('[data-entry-language="en"]').click();
  await expect(page.locator('[data-entry-language="en"]')).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator("main").evaluate(element => element.inert)).toBe(true);
  await page.locator("#home-start").press("Space");
  await expect(page.locator("#home-entry")).toBeHidden();
  await expect(page.locator("#loading-bg")).toHaveAttribute("aria-label", /This website/);
  await expect(page.locator("#loading-bg [lang=ja]").first()).toBeHidden();
  await expect(page.locator("#loading-bg")).toBeHidden({ timeout: 25000 });
  expect(await page.evaluate(() => localStorage.getItem("selectedLang"))).toBe("en");
  await page.goto("order.html");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goBack();
  await expect(page.locator("#home-entry")).toBeHidden();
  await expect(page.locator("#loading-bg")).toBeHidden();
});

test("Contact policy follows stored language and requires explicit consent", async ({ page }) => {
  await prepareDeterministicNetwork(page);
  await page.addInitScript(() => { localStorage.setItem("selectedLang", "en"); localStorage.setItem("lang", "en"); });
  await page.goto("contact.html");
  await page.locator("button.modal-open-label").click();
  await expect(page.locator("#policy-modal-content")).toHaveAttribute("aria-busy", "false");
  await expect(page.locator('#policy-modal-content > [lang="en"]')).toBeVisible();
  await expect(page.locator('#policy-modal-content > [lang="ja"]')).toBeHidden();
  await expect(page.getByRole("dialog", { name: "Site Policy" })).toHaveAttribute("aria-labelledby", "policy-modal-title");
  await expect(page.locator(".policy-modal-header h2")).toHaveText("Site Policy");
  await expect(page.locator("#policy-modal-content #policy-ja, #policy-modal-content #policy-en")).toHaveCount(0);
  const sourceHeadings = await page.evaluate(async () => {
    const source = new DOMParser().parseFromString(await (await fetch("policy.html")).text(), "text/html");
    return [source.querySelector("#policy-ja")?.textContent.trim(), source.querySelector("#policy-en")?.textContent.trim()];
  });
  expect(sourceHeadings).toEqual(["Policy", "Policy"]);
  await expect(page.locator("#consent")).toBeEnabled();
  await expect(page.locator("#consent")).not.toBeChecked();
  const close = page.locator(".modal-close-label");
  const before = await close.boundingBox();
  await page.locator("#policy-modal-content").evaluate(element => element.scrollTop = element.scrollHeight);
  expect((await close.boundingBox()).y).toBe(before.y);
  await page.keyboard.press("Escape");
  await expect(page.locator("button.modal-open-label")).toBeFocused();
  await expect(page.locator("#consent")).not.toBeChecked();
  let unconsentedRequests = 0;
  await page.route("https://script.google.com/macros/s/**", route => { unconsentedRequests++; return route.fulfill({ status: 200, body: "Successfully submitted" }); });
  await page.locator('label[for="radio2"]').click();
  await page.locator('#name').fill('Local verification');
  await page.locator('#email').fill('visual@example.com');
  await page.locator('#message').fill('Fixture only; no external form submission.');
  await page.locator('.submit-btn').click();
  expect(await page.locator('#consent').evaluate(element => element.checkValidity())).toBe(false);
  expect(unconsentedRequests).toBe(0);
  await page.locator("#consent").check();
  await expect(page.locator("#consent")).toBeChecked();
  await page.route("**/website/policy.html", route => route.fulfill({ status: 500, body: "Unavailable" }));
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("button.modal-open-label").click();
  await expect(page.locator("#policy-modal-content")).toHaveAttribute("aria-busy", "false");
  await expect(page.locator("#consent")).toBeDisabled();
  await expect(page.locator("#consent")).not.toBeChecked();
});

test("Approved navigation remains safe across release widths and the desktop boundary", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "One serial breakpoint sweep per run.");
  testInfo.setTimeout(90000); // Ten resize/scroll/menu/keyboard states, not a longer screenshot wait.
  await prepareDeterministicNetwork(page);
  await page.goto("order.html");
  await stabilize(page, {key:"order"});
  for (const width of [1920, 1440, 1300, 1299, 1280, 1024, 430, 390, 375, 320]) {
    await page.setViewportSize({width, height:900});
    await page.evaluate(() => { document.activeElement?.blur(); scrollTo({top:0, behavior:"instant"}); });
    const toggle = page.locator('.toggle_btn');
    if (width >= 1024) {
      await expect(page.locator('.head a')).toHaveCSS('font-size', '18px');
      for (const link of await page.locator('#navArea .inner a').all()) await expect(link).toHaveCSS('font-size','16px');
      const menu = await page.locator('#navArea').boundingBox();
      if ([1920,1440].includes(width)) expect(Math.abs(menu.width - (width===1920?1200:1080))).toBeLessThan(1);
      await page.evaluate(() => scrollTo({top:Math.ceil(innerHeight*.55),behavior:"instant"}));
      await expect(toggle).toBeVisible();
    }
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('#navArea .inner a')).toHaveCount(6);
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded','false');
    if (width >= 1024) {
      await page.evaluate(() => { document.activeElement?.blur(); scrollTo({top:innerHeight*1.5,behavior:"instant"}); });
      const side = page.locator('body > .page-navigation');
      await expect(side).toHaveAttribute('aria-hidden','false');
      const geometry = await page.locator('main .content:visible').first().evaluate(e=>{const c=e.getBoundingClientRect(),s=document.querySelector('body > .page-navigation').getBoundingClientRect();return {gap:c.left-s.right,sideCenter:s.left+s.width/2,left:c.left,vertical:s.top+s.height/2};});
      expect(geometry.gap).toBeGreaterThanOrEqual(23.9);
      expect(Math.abs(geometry.vertical-450)).toBeLessThan(1);
      expect(Math.abs(geometry.sideCenter-geometry.left/2)).toBeLessThan(1);
      await side.locator('a').first().focus();
      await page.evaluate(()=>{const f=document.querySelector('#footer-container');scrollTo({top:scrollY+f.getBoundingClientRect().top-innerHeight-32,behavior:"instant"});});
      await expect(side).toHaveAttribute('aria-hidden','true');
      expect(await side.evaluate(e=>e.contains(document.activeElement))).toBe(false);
    } else {
      const r=await toggle.boundingBox();
      expect(r.width).toBe(64); expect(r.height).toBe(64);
      expect(Math.abs(r.x+r.width-(width-width*.05))).toBeLessThan(1);
      expect(Math.abs(r.y+r.height-(900-width*.35))).toBeLessThan(1);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  }
});

test("Home language selection works without persistent storage", async ({ page }) => {
  await prepareDeterministicNetwork(page);
  await page.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new Error('Storage unavailable')};Storage.prototype.setItem=()=>{throw new Error('Storage unavailable')};});
  await page.goto("");
  await expect(page.locator('#home-entry')).toBeVisible();
  await page.locator('[data-entry-language="en"]').click();
  await expect(page.locator('[data-entry-language="en"]')).toHaveAttribute('aria-pressed','true');
  await page.locator('#home-start').click();
  await expect(page.locator('#loading-bg')).toHaveAttribute('aria-label',/This website/);
  await expect(page.locator('#loading-bg')).toBeHidden({timeout:25000});
  expect(await page.evaluate(()=>document.querySelector('main').inert)).toBe(false);
  await expect(page.locator('html')).toHaveAttribute('lang','en');
});

const pages = [
  { key: "home", path: "", title: /Mizuki|小山瑞樹/i, footer: false },
  {
    key: "gallery", path: "gallery.html", title: /Gallery|Art|Mizuki|小山瑞樹/i,
    subtitle: { mode: "switchable", ja: "作品一覧", en: "Artworks", dataSubtitle: "作品一覧" }
  },
  {
    key: "biography", path: "biography.html", title: /Biography|Mizuki|小山瑞樹/i,
    subtitle: {
      mode: "bilingual", ja: "感覚を信じ、表現を探し続けた歩み",
      en: "A journey of trusting one's instincts and ceaselessly seeking a form of expression.",
      dataSubtitle: "感覚を信じ、表現を探し続けた歩み"
    }
  },
  {
    key: "artist-statement", path: "artist-statement.html", title: /Statement|Mizuki|小山瑞樹/i,
    subtitle: {
      mode: "bilingual",
      ja: "揺らぎ、感覚、記憶 色と余白、 見えないもの 固定された視点を緩めること",
      en: "Fluctuation, Sensation, Memory Color and Space, the Invisible Loosening Fixed Ways of Seeing",
      jaLines: ["揺らぎ、感覚、記憶", "色と余白、", "見えないもの", "固定された視点を緩めること"],
      enLines: ["Fluctuation, Sensation, Memory", "Color and Space,", "the Invisible", "Loosening Fixed Ways of Seeing"],
      dataSubtitle: "揺らぎ、感覚、記憶<br>色と余白、<br>見えないもの<br>固定された視点を緩めること"
    }
  },
  {
    key: "information", path: "information.html", title: /Information|Mizuki|小山瑞樹/i,
    subtitle: { mode: "switchable", ja: "活動・展示情報", en: "Exhibition Information" }
  },
  {
    key: "order", path: "order.html", title: /Order|Mizuki|小山瑞樹/i,
    subtitle: { mode: "switchable", ja: "作品・制作のご依頼", en: "Works & Commissions", dataSubtitle: "作品・制作のご依頼" }
  },
  {
    key: "contact", path: "contact.html", title: /Contact|Mizuki|小山瑞樹/i,
    subtitle: { mode: "bilingual", ja: "依頼 | 問い合わせ", en: "Requests | Inquiries", dataSubtitle: "依頼 | 問い合わせ" }
  },
  {
    key: "policy", path: "policy.html", title: /Policy|Mizuki|小山瑞樹/i,
    subtitle: { mode: "switchable", ja: "当Webサイト利用について", en: "Use of This Website", dataSubtitle: "当Webサイト利用について" }
  },
  {
    key: "404",
    path: "__visual-missing__/deep/path/",
    title: /404|Page not found/i,
    status: 404
  },
  {
    key: "yurayura",
    path: "exhibitions/yurayura/",
    title: /ゆらゆら|Yurayura/i,
    subtitle: { mode: "switchable", ja: "グループ展「ゆらゆら」", en: "Group Exhibition “Yurayura”" }
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
    rippleAssetRequests: [],
    localResourceFailures: [],
    externalResourceFailures: []
  };

  page.on("request", request => {
    if (/(?:^|\/)(?:jquery\.ripples-min\.js|bg_wave\.js)(?:[?#]|$)/.test(request.url())) {
      runtime.rippleAssetRequests.push(request.url());
    }
  });
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
    const languageControl = document.querySelector("#langChange");
    const proseLanguages = [
      ...document.querySelectorAll("main .work > p.state-txt, main .work > p.text")
    ].map(element => element.classList.contains("state-txt") ? "ja" : "en");
    const proseElements = [...document.querySelectorAll("main .work > p.state-txt, main .work > p.text")];
    const englishPairVisuals = proseElements
      .filter(element => element.classList.contains("text"))
      .map(element => {
        const style = getComputedStyle(element);
        const next = element.nextElementSibling;
        const nextStyle = next ? getComputedStyle(next) : null;
        return {
          borderTopWidth: parseFloat(style.borderTopWidth) || 0,
          borderTopStyle: style.borderTopStyle,
          nextLanguage: next?.classList.contains("state-txt") ? "ja" : null,
          nextMarginTop: nextStyle ? parseFloat(nextStyle.marginTop) || 0 : null
        };
      });
    const statementTimelineItems = [...document.querySelectorAll("main .timeline > .timeline-item")].map(item => {
      const japaneseTitle = item.querySelector(":scope > .timeline-title");
      const japaneseBody = item.querySelector(".timeline-copy > p:not(.text)");
      const englishBody = item.querySelector(".timeline-copy > p.text");
      const englishStyle = englishBody ? getComputedStyle(englishBody) : null;
      const copy = item.querySelector(".timeline-copy");
      const copyStyle = copy ? getComputedStyle(copy) : null;
      return {
        japaneseTitle: Boolean(japaneseTitle),
        japaneseBody: Boolean(japaneseBody),
        englishBody: Boolean(englishBody),
        englishBorderTopWidth: englishStyle ? parseFloat(englishStyle.borderTopWidth) || 0 : 0,
        englishBorderTopStyle: englishStyle?.borderTopStyle || "",
        timelineBorderLeftWidth: copyStyle ? parseFloat(copyStyle.borderLeftWidth) || 0 : 0,
        timelineBorderLeftStyle: copyStyle?.borderLeftStyle || ""
      };
    });
    return {
      japaneseRegions: [
        ...document.querySelectorAll(
          "main .work > p.state-txt, main .timeline > .timeline-item > .timeline-title, main .timeline-copy > p:not(.text)"
        )
      ].filter(visible).length,
      englishRegions: [
        ...document.querySelectorAll(
          "main .work > p.text, main .timeline-copy > p.text, main .subtext-en, main .timeline-title-en, main .en-txt"
        )
      ].filter(visible).length,
      languageControlVisible: Boolean(languageControl && visible(languageControl) && !languageControl.hidden),
      standaloneEnglishContent: document.querySelectorAll('main .state-box > .content[lang="en"]').length,
      proseLanguages,
      englishPairVisuals,
      statementTimelineItems
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
    expect(state.statementTimelineItems).toHaveLength(5);
    for (const item of state.statementTimelineItems) {
      expect(item.japaneseTitle, "Artist Statement timeline should keep its Japanese numbered heading").toBe(true);
      expect(item.japaneseBody, "Artist Statement timeline should keep Japanese body text").toBe(true);
      expect(item.englishBody, "Artist Statement timeline should place English below Japanese").toBe(true);
      expect(item.timelineBorderLeftWidth, "Artist Statement timeline should keep its vertical rule").toBeGreaterThanOrEqual(1);
      expect(item.timelineBorderLeftStyle, "Artist Statement timeline vertical rule should be visible").not.toBe("none");
      expect(item.englishBorderTopWidth, "Artist Statement timeline English should keep its divider").toBeGreaterThanOrEqual(1);
      expect(item.englishBorderTopStyle, "Artist Statement timeline English divider should be visible").not.toBe("none");
    }
  }
}

async function assertSwitchableBodyLanguage(page, language, label) {
  const visibleCounts = await page.locator('main [lang="ja"], main [lang="en"]').evaluateAll(elements => {
    return elements.reduce((counts, element) => {
      if (element.closest(".h1-text .subtext")) return counts;
      const style = window.getComputedStyle(element);
      const visible = element.getClientRects().length > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden";
      if (visible) counts[element.getAttribute("lang")] += 1;
      return counts;
    }, { ja: 0, en: 0 });
  });
  const otherLanguage = language === "ja" ? "en" : "ja";
  expect(visibleCounts[language], label + " should show localized body content in " + language)
    .toBeGreaterThan(0);
  expect(visibleCounts[otherLanguage], label + " should hide non-selected body content in " + otherLanguage)
    .toBe(0);
}

async function assertOrderPricingContent(page, language, label) {
  const content = page.locator('.order-page .content[lang="' + language + '"]');
  const pricing = content.locator(".order-pricing");
  await expect(pricing, label + " pricing section should be visible").toBeVisible();
  await expect(pricing.locator(":scope > h2"), label + " pricing heading").toHaveText(
    language === "ja" ? "料金について" : "Pricing"
  );

  const table = pricing.locator(".order-price-table");
  await expect(table, label + " pricing table").toBeVisible();
  await expect(table).toHaveAttribute("aria-label", language === "ja" ? "料金表" : "Commission pricing");
  await expect(table.locator("thead")).toHaveCount(0);
  await expect(table.locator("tbody tr")).toHaveCount(5);

  const expectedPairs = language === "ja"
    ? [
        [["F4", "333 × 242 mm", "¥60,000"], ["F15", "652 × 530 mm", "¥120,000"]],
        [["F6", "410 × 318 mm", "¥71,000"], ["F20", "727 × 606 mm", "¥165,000〜"]],
        [["F8", "455 × 380 mm", "¥83,000"], ["F25", "803 × 652 mm", "¥198,000〜"]],
        [["F10", "530 × 455 mm", "¥95,000"], ["F30", "910 × 727 mm", "¥231,000〜"]],
        [["F12", "606 × 500 mm", "¥107,000"], ["F40〜", "1000 × 803 mm〜", "要相談"]]
      ]
    : [
        [["F4", "333 × 242 mm", "¥60,000"], ["F15", "652 × 530 mm", "¥120,000"]],
        [["F6", "410 × 318 mm", "¥71,000"], ["F20", "727 × 606 mm", "From ¥165,000"]],
        [["F8", "455 × 380 mm", "¥83,000"], ["F25", "803 × 652 mm", "From ¥198,000"]],
        [["F10", "530 × 455 mm", "¥95,000"], ["F30", "910 × 727 mm", "From ¥231,000"]],
        [["F12", "606 × 500 mm", "¥107,000"], ["F40+", "1000 × 803 mm and above", "Please inquire"]]
      ];

  const groups = await table.locator("tbody tr").evaluateAll(rows => rows.map(row =>
    Array.from(row.cells).map(cell => [
      cell.querySelector(".order-price-size")?.textContent.trim() || "",
      (cell.querySelector(".order-dimensions")?.textContent || "").replace(/\s+/g, " ").trim(),
      cell.querySelector(".order-price-amount")?.textContent.trim() || ""
    ])
  ));
  expect(groups, label + " five rows with the prescribed left/right size pairs").toEqual(expectedPairs);

  const cellLayout = await table.locator("tbody tr").evaluateAll(rows => rows.map(row => {
    const [left, right] = row.cells;
    const leftStyle = getComputedStyle(left);
    const rightStyle = getComputedStyle(right);
    return {
      count: row.cells.length,
      widthDifference: Math.abs(left.getBoundingClientRect().width - right.getBoundingClientRect().width),
      leftBorder: leftStyle.borderLeftWidth,
      dividerWidth: rightStyle.borderLeftWidth,
      dividerStyle: rightStyle.borderLeftStyle
    };
  }));
  expect(cellLayout.map(row => row.count), label + " two cells per row").toEqual(Array(5).fill(2));
  expect(cellLayout.every(row => row.widthDifference <= 1), label + " equal two-column widths").toBe(true);
  expect(cellLayout.map(({ leftBorder, dividerWidth, dividerStyle }) => ({ leftBorder, dividerWidth, dividerStyle })),
    label + " thin center divider").toEqual(Array.from({ length: 5 }, () => ({
      leftBorder: "0px",
      dividerWidth: "1px",
      dividerStyle: "solid"
    })));

  const dimensionFit = await table.locator(".order-dimensions").evaluateAll(elements =>
    elements.every(element => element.scrollWidth <= element.clientWidth + 1)
  );
  expect(dimensionFit, label + " dimensions should wrap without overflowing their size cells").toBe(true);

  const viewportWidth = page.viewportSize().width;
  const internalLayout = await table.locator("tbody td.order-price-cell").evaluateAll(cells => cells.map(cell => {
    const grid = cell.querySelector(".order-price-cell-layout");
    const cellBox = cell.getBoundingClientRect();
    const pieces = Object.fromEntries([".order-price-size", ".order-dimensions", ".order-price-amount"].map(selector => {
      const box = grid.querySelector(selector).getBoundingClientRect();
      return [selector, {
        left: box.left - cellBox.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        centerY: box.top + box.height / 2,
        height: box.height
      }];
    }));
    const dimension = grid.querySelector(".order-dimensions");
    const previousWhiteSpace = dimension.style.whiteSpace;
    dimension.style.whiteSpace = "nowrap";
    const naturalDimensionWidth = dimension.scrollWidth;
    dimension.style.whiteSpace = previousWhiteSpace;
    return {
      display: getComputedStyle(grid).display,
      cellWidth: cellBox.width,
      gridWidth: grid.getBoundingClientRect().width,
      naturalDimensionWidth,
      dimensionClientWidth: dimension.clientWidth,
      dimensionLineHeight: parseFloat(getComputedStyle(dimension).lineHeight),
      pieces
    };
  }));
  expect(internalLayout.map(item => item.display), label + " each price cell uses an internal grid")
    .toEqual(Array(10).fill("grid"));

  if (viewportWidth <= 599) {
    for (const item of internalLayout) {
      const { ".order-price-size": size, ".order-dimensions": dimensions, ".order-price-amount": amount } = item.pieces;
      expect(Math.abs(size.centerY - amount.centerY), label + " mobile size and price share the first row")
        .toBeLessThanOrEqual(2);
      expect(dimensions.top, label + " mobile dimensions sit on the second row")
        .toBeGreaterThanOrEqual(Math.max(size.bottom, amount.bottom) - 1);
      const dimensionsAreSingleLine = dimensions.height <= item.dimensionLineHeight + 1;
      const sizeLabel = await table.locator("tbody td.order-price-cell").nth(internalLayout.indexOf(item))
        .locator(".order-price-size").innerText();
      const isF40English = language === "en" && sizeLabel.trim() === "F40+";
      if (!isF40English) {
        expect(dimensionsAreSingleLine, label + " mobile dimensions fit on one line: " + JSON.stringify({
          sizeLabel,
          cellWidth: item.cellWidth,
          gridWidth: item.gridWidth,
          dimensionClientWidth: item.dimensionClientWidth,
          naturalDimensionWidth: item.naturalDimensionWidth,
          dimensionHeight: dimensions.height,
          dimensionLineHeight: item.dimensionLineHeight
        })).toBe(true);
      }
    }
  } else {
    for (const item of internalLayout) {
      const { ".order-price-size": size, ".order-dimensions": dimensions, ".order-price-amount": amount } = item.pieces;
      expect(Math.abs(size.centerY - dimensions.centerY), label + " desktop values align on one row")
        .toBeLessThanOrEqual(2);
      expect(Math.abs(size.centerY - amount.centerY), label + " desktop price shares the size row")
        .toBeLessThanOrEqual(2);
    }

    for (const selector of [".order-price-size", ".order-dimensions", ".order-price-amount"]) {
      for (const cellColumn of [0, 1]) {
        const offsets = internalLayout
          .filter((_, index) => index % 2 === cellColumn)
          .map(item => item.pieces[selector].left);
        expect(Math.max(...offsets) - Math.min(...offsets), label + " aligned " + selector + " column")
          .toBeLessThanOrEqual(2);
      }
    }

    if (viewportWidth >= 1024) {
      for (const item of internalLayout) {
        const { ".order-price-size": size, ".order-dimensions": dimensions } = item.pieces;
        const sizeLabel = await table.locator("tbody td.order-price-cell").nth(internalLayout.indexOf(item))
          .locator(".order-price-size").innerText();
        const isF40English = language === "en" && sizeLabel.trim() === "F40+";
        if (!isF40English) {
          expect(dimensions.height, label + " dimensions remain on one line at desktop widths")
            .toBeLessThanOrEqual(size.height + 1);
        }
      }
    }
  }

  await expect(pricing).toContainText(language === "ja"
    ? "寸法はF規格の標準サイズ（長辺 × 短辺）です。"
    : "Dimensions shown are standard F-format sizes (long side × short side).");
  await expect(pricing).toContainText(language === "ja"
    ? "表示価格は消費税込み・国内送料込みの目安です。"
    : "Prices shown include consumption tax and standard domestic shipping within Japan.");
  await expect(pricing).toContainText(language === "ja"
    ? "作品の配送は、作品サイズや仕様に応じて、ヤマト運輸の美術便など作品に適した配送方法をご案内します。"
    : "Depending on the size and specifications of the artwork, an appropriate art-handling delivery service, such as Yamato Transport's art transportation service, will be arranged.");
  await expect(pricing.locator(".order-policy-link"), label + " Site Policy link").toHaveAttribute("href", "policy.html");
  await expect(pricing.locator(".order-policy-link")).toHaveText("Site Policy");
  await expectHorizontalFit(table, label + " pricing table");
}

async function assertOrderCancellationPolicy(page, language, label) {
  const content = page.locator('#policy .content[lang="' + language + '"]');
  const section = content.locator(".order-cancellation-policy");
  const sectionHeading = language === "ja" ? "オーダー・キャンセルポリシー" : "Order & Cancellation Policy";
  const subheadings = language === "ja"
    ? ["料金・お見積り", "キャンセル", "返品・交換", "配送・破損について"]
    : ["Pricing and Quotations", "Cancellations", "Returns and Exchanges", "Delivery and Damage"];
  const externalLinksHeading = language === "ja" ? "外部リンク" : "External Links";

  await expect(section, label + " order policy section should be visible").toBeVisible();
  await expect(section.locator(":scope > h2"), label + " order policy title").toHaveText(sectionHeading);
  await expect(section.locator(":scope > h3"), label + " order policy subheadings").toHaveText(subheadings);

  const policyHeadings = await content.locator(".policy h2, .policy h3").allTextContents();
  const externalLinksIndex = policyHeadings.indexOf(externalLinksHeading);
  expect(externalLinksIndex, label + " External Links heading should remain").toBeGreaterThanOrEqual(0);
  expect(policyHeadings[externalLinksIndex + 1], label + " order policy should follow External Links")
    .toBe(sectionHeading);
  expect(policyHeadings.indexOf("Privacy Policy"), label + " Privacy Policy should follow order policy")
    .toBeGreaterThan(policyHeadings.indexOf(sectionHeading));

  await expect(section).toContainText(language === "ja"
    ? "制作開始前のキャンセルについては、すでに発生している材料費、手配費その他の実費がある場合、それらを差し引いたうえで返金内容をご案内します。"
    : "If a commission is cancelled before production begins, any material costs, arrangement fees, or other expenses already incurred may be deducted before determining the amount to be refunded.");
  await expect(section).toContainText(language === "ja"
    ? "配送会社の補償範囲を超える独自の補償は行いません。"
    : "no additional compensation beyond the carrier's applicable compensation will be provided.");
  await expectHorizontalFit(section, label + " order policy section");
}

async function assertH1Subtitle(page, entry, label = entry.key) {
  const subtitle = entry.subtitle;
  if (!subtitle) return;

  const h1Text = page.locator("main .h1-text");
  const paragraph = h1Text.locator(":scope > p.subtext");
  await expect(paragraph, label + " should use one shared H1 subtitle paragraph").toHaveCount(1);
  await expect(paragraph, label + " should share Contact's noise/subtext classes").toHaveClass(/\bnoise\b/);
  await expect(h1Text.locator(":scope > p.subtext-en"), label + " should not keep a separate English subtitle")
    .toHaveCount(0);
  const followsH1 = await paragraph.evaluate(element => element.previousElementSibling?.matches("h1") === true);
  expect(followsH1, label + " subtitle should immediately follow its H1").toBe(true);
  const languageOrder = await paragraph.evaluate(element =>
    Array.from(element.children)
      .filter(child => child.matches('[lang="ja"],[lang="en"]'))
      .map(child => child.getAttribute("lang"))
  );
  expect(languageOrder, label + " subtitle should put Japanese before English").toEqual(["ja", "en"]);

  const normalizeCopy = value => value.replace(/\s+/g, " ").trim();
  const japanese = paragraph.locator(':scope > [lang="ja"]');
  const english = paragraph.locator(':scope > [lang="en"]');
  if (subtitle.jaLines) {
    const readLines = locator => locator.evaluate(element => {
      const lines = [""];
      const visit = node => {
        if (node.nodeType === Node.TEXT_NODE) {
          lines[lines.length - 1] += node.nodeValue;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === "BR") lines.push("");
          else for (const child of node.childNodes) visit(child);
        }
      };
      visit(element);
      return lines.map(line => line.replace(/\s+/g, " ").trim());
    });
    const [japaneseLines, englishLines] = await Promise.all([readLines(japanese), readLines(english)]);
    expect(japaneseLines, label + " Japanese subtitle line breaks").toEqual(subtitle.jaLines);
    expect(englishLines, label + " English subtitle line breaks").toEqual(subtitle.enLines);
  } else {
    const japaneseCopy = await japanese.textContent();
    const englishCopy = await english.textContent();
    expect(normalizeCopy(japaneseCopy), label + " Japanese subtitle copy").toBe(normalizeCopy(subtitle.ja));
    expect(normalizeCopy(englishCopy), label + " English subtitle copy").toBe(normalizeCopy(subtitle.en));
  }

  if (subtitle.dataSubtitle !== undefined) {
    await expect(h1Text, label + " should preserve its existing data-subtitle").toHaveAttribute(
      "data-subtitle",
      subtitle.dataSubtitle
    );
  }

  await expect(japanese, label + " should always show the Japanese subtitle").toBeVisible();
  await expect(english, label + " should always show the English subtitle").toBeVisible();
  const [japaneseBox, englishBox] = await Promise.all([
    japanese.boundingBox(),
    english.boundingBox()
  ]);
  expect(japaneseBox, label + " Japanese subtitle should have a layout box").not.toBeNull();
  expect(englishBox, label + " English subtitle should have a layout box").not.toBeNull();
  expect(
    englishBox.y,
    label + " English subtitle should appear on a separate line below Japanese"
  ).toBeGreaterThanOrEqual(japaneseBox.y + japaneseBox.height - 1);

  if (subtitle.mode === "bilingual") {
    await expect(page.locator("#langChange"), label + " should hide the language switch UI").toBeHidden();
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    return;
  }

  const selectedLanguage = await page.locator("html").getAttribute("lang");
  expect(["ja", "en"], label + " should have a valid selected language").toContain(selectedLanguage);
  await expect(page.locator("#langChange"), label + " should keep the switch UI available").toBeVisible();
  await expect(page.locator('#langChange input[value="' + selectedLanguage + '"]'))
    .toBeChecked();
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
    await expectHorizontalFit(page.locator('.information-page .info-section[aria-labelledby="upcoming-title"] [data-yurayura-feed-status]:visible'), "Information Upcoming empty state");
    await expectHorizontalFit(page.locator(".information-page .past-activities-table"), "Information Past Activities table");
    await expectHorizontalFit(page.locator(".information-page .info-link:visible"), "Information links");
  }

  if (entry.key === "order") {
    await expectHorizontalFit(page.locator(".order-page .content"), "Order content");
    await expectHorizontalFit(page.locator(".order-page .history-table"), "Order table");
    await expectHorizontalFit(page.locator(".order-page .timeline"), "Order process");
    await expectHorizontalFit(page.locator(".order-page .order-cta"), "Order CTA");

    const layout = await page.evaluate(() => {
      const content = document.querySelector(".order-page .content");
      const title = document.querySelector(".order-page > .h1-text h1");
      const sectionTitle = content?.querySelector(":scope > h2");
      if (!content || !title || !sectionTitle) return null;
      const contentStyle = getComputedStyle(content);
      return {
        marginTop: parseFloat(contentStyle.marginTop) || 0,
        expectedMarginTop: matchMedia("(max-width: 599px)").matches ? 0 : Math.min(window.innerWidth, window.innerHeight) * 0.6,
        titleBottom: title.getBoundingClientRect().bottom,
        sectionTop: sectionTitle.getBoundingClientRect().top
      };
    });
    expect(layout, "Order layout geometry should be measurable").not.toBeNull();
    expect(Math.abs(layout.marginTop - layout.expectedMarginTop), "Order uses mobile flow without a duplicate offset; wider layouts retain60vmin").toBeLessThanOrEqual(1.5);
    expect(layout.titleBottom, "Order H1 must remain above page content").toBeLessThan(layout.sectionTop);
  }

  if (entry.key === "contact") {
    await expectHorizontalFit(page.locator("#contactForm"), "Contact form");
    await expectHorizontalFit(
      page.locator("#contactForm input:not([type='hidden']), #contactForm textarea, #contactForm .submit-btn"),
      "Contact form control"
    );
    await expectHorizontalFit(
      page.locator('#contactForm label[for="name"], #contactForm label[for="email"], #contactForm label[for="message"]'),
      "Contact form label"
    );
    await expectHorizontalFit(
      page.locator('#contactForm button.modal-open-label'),
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

    const layout = await page.evaluate(() => {
      const content = document.querySelector(".exhibition-page .content");
      const title = document.querySelector(".exhibition-page > .h1-text h1");
      const sectionTitle = content?.querySelector(":scope > h2");
      if (!content || !title || !sectionTitle) return null;
      const contentStyle = getComputedStyle(content);
      return {
        marginTop: parseFloat(contentStyle.marginTop) || 0,
        expectedMarginTop: matchMedia("(max-width: 599px)").matches ? 0 : Math.min(window.innerWidth, window.innerHeight) * 0.6,
        titleBottom: title.getBoundingClientRect().bottom,
        sectionTop: sectionTitle.getBoundingClientRect().top
      };
    });
    expect(layout, "Yurayura layout geometry should be measurable").not.toBeNull();
    expect(Math.abs(layout.marginTop - layout.expectedMarginTop), "Yurayura uses mobile flow without a duplicate offset; wider layouts retain60vmin").toBeLessThanOrEqual(1.5);
    expect(layout.titleBottom, "Yurayura H1 must remain above page content").toBeLessThan(layout.sectionTop);
  }
}

async function exerciseSharedRuntimeInteractions(page) {
  const toggle = page.locator("#navArea .toggle_btn");
  await expect(toggle).toHaveJSProperty("tagName", "BUTTON");
  await expect(toggle).toHaveJSProperty("tabIndex", 0);
  if (page.viewportSize().width >= 1024) {
    await expect(toggle).toBeHidden();
    await expect(page.locator("#navArea nav")).toBeVisible();
    await expect(page.locator("#navArea nav")).not.toHaveAttribute("inert", "");
    return;
  }

  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#navArea")).toHaveClass(/open/);
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#navArea")).not.toHaveClass(/open/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
}

async function exerciseGalleryRuntime(page, projectName, testInfo) {
  const categoryHeader = page.locator("#category-header");
  const categoryMenu = page.locator("#category-menu");
  const resultCount = page.locator("#gallery-result-count");
  const emptyState = page.locator("#gallery-empty-state");
  const gallery = page.locator("#gallery-container");
  const pagination = page.locator("#pagination");
  const initialLanguage = await page.locator("html").getAttribute("lang");

  const initialGeometry = await page.evaluate(() => {
    const box = document.querySelector(".gallery-box");
    const grid = document.querySelector("#gallery-container");
    const count = document.querySelector("#gallery-result-count");
    const firstCard = grid?.querySelector(":scope > .work");
    const boxRect = box?.getBoundingClientRect();
    const gridRect = grid?.getBoundingClientRect();
    const countRect = count?.getBoundingClientRect();
    const cardRect = firstCard?.getBoundingClientRect();
    return {
      boxLeft: boxRect?.left ?? 0,
      boxWidth: boxRect?.width ?? 0,
      gridLeft: gridRect?.left ?? 0,
      gridWidth: gridRect?.width ?? 0,
      countLeft: countRect?.left ?? 0,
      countWidth: countRect?.width ?? 0,
      cardLeft: cardRect?.left ?? 0,
      columns: grid ? getComputedStyle(grid).gridTemplateColumns.split(/\s+/).length : 0
    };
  });

  const expectedColumns = (page.viewportSize()?.width || 0) >= 1200 ? 4 : 2;
  expect(initialGeometry.columns, "Gallery column count follows the 4/2-column breakpoint policy")
    .toBe(expectedColumns);

  const currentGeometry = async () => page.evaluate(() => {
    const boxRect = document.querySelector(".gallery-box")?.getBoundingClientRect();
    const grid = document.querySelector("#gallery-container");
    const gridRect = grid?.getBoundingClientRect();
    const countRect = document.querySelector("#gallery-result-count")?.getBoundingClientRect();
    const cardRect = grid?.querySelector(":scope > .work")?.getBoundingClientRect();
    return {
      boxLeft: boxRect?.left ?? 0,
      boxWidth: boxRect?.width ?? 0,
      gridHidden: Boolean(grid?.hidden),
      gridLeft: gridRect?.left ?? 0,
      gridWidth: gridRect?.width ?? 0,
      countLeft: countRect?.left ?? 0,
      countWidth: countRect?.width ?? 0,
      cardLeft: cardRect?.left ?? 0,
      columns: grid ? getComputedStyle(grid).gridTemplateColumns.split(/\s+/).length : 0
    };
  });

  const assertStableGeometry = async empty => {
    const geometry = await currentGeometry();
    expect(geometry.boxLeft, "Filter state must not move the Gallery composition")
      .toBeCloseTo(initialGeometry.boxLeft, 1);
    expect(geometry.boxWidth, "Filter state must not resize the Gallery composition")
      .toBeCloseTo(initialGeometry.boxWidth, 1);
    expect(geometry.countLeft, "Result Count must keep its aligned horizontal position")
      .toBeCloseTo(initialGeometry.countLeft, 1);
    expect(geometry.countWidth, "Result Count must keep the Gallery width")
      .toBeCloseTo(initialGeometry.countWidth, 1);
    if (!empty) {
      expect(geometry.columns, "Filter state must preserve the responsive column count")
        .toBe(initialGeometry.columns);
      expect(geometry.gridLeft, "Filter state must not move the artwork grid")
        .toBeCloseTo(initialGeometry.gridLeft, 1);
      expect(geometry.gridWidth, "Filter state must not resize the artwork grid")
        .toBeCloseTo(initialGeometry.gridWidth, 1);
      expect(geometry.countLeft, "Result Count must align to the artwork grid")
        .toBeCloseTo(geometry.gridLeft, 1);
      expect(geometry.countWidth, "Result Count must match the artwork grid width")
        .toBeCloseTo(geometry.gridWidth, 1);
      expect(geometry.cardLeft, "Filtered works should start in the first grid column")
        .toBeCloseTo(initialGeometry.cardLeft, 1);
    }
  };

  const assertTotal = async total => {
    const language = await page.locator("html").getAttribute("lang");
    await expect(resultCount).toHaveAttribute("data-result-count", String(total));
    await expect(resultCount).toHaveText(
      language === "ja" ? "該当作品 " + total + "件" : total + " works"
    );
    await expect(resultCount).toHaveAttribute("data-selected-genre");
    await expect(resultCount).toHaveAttribute("data-selected-year");
    await expect(gallery.locator(":scope > .work")).toHaveCount(Math.min(total, 8));

    const totalPages = Math.ceil(total / 8);
    if (totalPages === 0) {
      expect(await gallery.evaluate(element => element.hidden)).toBe(true);
      await expect(gallery).toHaveCSS("display", "none");
      await expect(emptyState).toBeVisible();
      expect(await pagination.evaluate(element => element.hidden)).toBe(true);
      await expect(pagination).toHaveCSS("display", "none");
      await expect(pagination.locator("button")).toHaveCount(0);
      await assertStableGeometry(true);
      return;
    }

    expect(await gallery.evaluate(element => element.hidden)).toBe(false);
    await expect(emptyState).toBeHidden();
    expect(await pagination.evaluate(element => element.hidden)).toBe(false);
    await expect(pagination.locator("button[aria-label=\"Page " + totalPages + "\"]"))
      .toBeVisible();
    await assertStableGeometry(false);
  };

  const openCategory = async () => {
    if (await categoryHeader.getAttribute("aria-expanded") !== "true") {
      await categoryHeader.click();
    }
    await expect(categoryHeader).toHaveAttribute("aria-expanded", "true");
    const geometry = await currentGeometry();
    expect(geometry.countLeft, "Opening Category must not misalign Result Count")
      .toBeCloseTo(initialGeometry.countLeft, 1);
    if (!geometry.gridHidden) {
      expect(geometry.gridLeft, "Opening Category must not move the artwork grid sideways")
        .toBeCloseTo(initialGeometry.gridLeft, 1);
      expect(geometry.gridWidth, "Opening Category must not resize the artwork grid")
        .toBeCloseTo(initialGeometry.gridWidth, 1);
    }
  };

  const selectFilter = async (value, key) => {
    await openCategory();
    const option = categoryMenu.locator("[data-category=\"" + value + "\"]");
    if (key) {
      await option.press(key);
    } else {
      await option.click();
    }
    await expect(categoryHeader).toHaveAttribute("aria-expanded", "false");
  };

  const assertFilterState = async (genre, year) => {
    await expect(resultCount).toHaveAttribute("data-selected-genre", genre);
    await expect(resultCount).toHaveAttribute("data-selected-year", year);
    await expect(categoryMenu.locator("[data-category=\"Paint\"]"))
      .toHaveAttribute("aria-pressed", String(genre === "Paint"));
    await expect(categoryMenu.locator("[data-category=\"2024\"]"))
      .toHaveAttribute("aria-pressed", String(year === "2024"));
    await expect(categoryMenu.locator("[data-category=\"2025\"]"))
      .toHaveAttribute("aria-pressed", String(year === "2025"));
    await expect(categoryMenu.locator("[data-category=\"all\"]"))
      .toHaveAttribute("aria-pressed", String(genre === "all" && year === "all"));
  };

  const setLanguage = async language => {
    const label = language === "ja" ? "langJa" : "langEn";
    await page.locator('#langChange label[for="' + label + '"]').click();
    await expect(page.locator("html")).toHaveAttribute("lang", language);
  };


  await expect(resultCount).toHaveAttribute("data-result-count", "69");
  await assertTotal(69);
  await assertFilterState("all", "all");
  await expect(pagination.locator('button[aria-label="Page 9"]')).toBeVisible();

  await pagination.locator('button[aria-label="Page 2"]').click();
  await expect(pagination.locator('[aria-current="page"]')).toHaveAttribute("aria-label", "Page 2");
  await expect(gallery.locator(":scope > .work")).toHaveCount(8);
  await selectFilter("Paint");
  await assertTotal(25);
  await assertFilterState("Paint", "all");
  await expect(pagination.locator('[aria-current="page"]')).toHaveAttribute("aria-label", "Page 1");
  await expect(pagination.locator('button[aria-label="Page 4"]')).toBeVisible();

  await selectFilter("2024");
  await assertTotal(1);
  await assertFilterState("Paint", "2024");
  await expect(pagination.locator('button[aria-label="Page 2"]')).toHaveCount(0);

  // Clearing only Year keeps Genre; clearing only Genre keeps Year.
  await selectFilter("2024");
  await assertTotal(25);
  await assertFilterState("Paint", "all");
  await selectFilter("Paint");
  await assertTotal(69);
  await assertFilterState("all", "all");
  await selectFilter("2024");
  await assertTotal(4);
  await assertFilterState("all", "2024");
  await selectFilter("Paint");
  await assertTotal(1);
  await assertFilterState("Paint", "2024");
  await selectFilter("Paint");
  await assertTotal(4);
  await assertFilterState("all", "2024");

  await selectFilter("Paint");
  await selectFilter("2025");
  await assertFilterState("Paint", "2025");
  await assertTotal(0);
  await expect(emptyState).toHaveText("該当作品なし。");

  await setLanguage("en");
  await assertFilterState("Paint", "2025");
  await assertTotal(0);
  await expect(emptyState).toHaveText("No matching works.");
  await setLanguage("ja");
  await assertTotal(0);
  await expect(emptyState).toHaveText("該当作品なし。");

  await selectFilter("2024");
  await assertTotal(1);
  await assertFilterState("Paint", "2024");
  await selectFilter("Paint");
  await assertTotal(4);
  await assertFilterState("all", "2024");

  await setLanguage("en");
  await assertTotal(4);
  await assertFilterState("all", "2024");
  await setLanguage(initialLanguage);
  await assertTotal(4);
  await assertFilterState("all", "2024");

  await selectFilter("all");
  await assertTotal(69);
  await assertFilterState("all", "all");

  // Filter controls support Enter and Space and expose matching pressed state.
  await selectFilter("Paint", "Enter");
  await assertTotal(25);
  await assertFilterState("Paint", "all");
  await selectFilter("2024", "Space");
  await assertTotal(1);
  await assertFilterState("Paint", "2024");
  await selectFilter("2024", "Space");
  await assertTotal(25);
  await assertFilterState("Paint", "all");
  await selectFilter("Paint", "Enter");
  await assertTotal(69);
  await assertFilterState("all", "all");

  const firstWork = gallery.locator(":scope > .work").first();
  const firstThumbnail = firstWork.locator(".work-img > img");
  const firstTitle = firstWork.locator(".view-policy-button p").first();
  await expect(firstThumbnail).toHaveAttribute("alt", await firstTitle.textContent());

  await setLanguage("en");
  await expect(firstThumbnail).toHaveAttribute("alt", await firstTitle.textContent());
  await setLanguage(initialLanguage);
  await expect(firstThumbnail).toHaveAttribute("alt", await firstTitle.textContent());

  // Filter/language changes schedule an existing smooth scroll to the top.
  // Let it finish before asking Playwright to scroll the artwork into view.
  await page.evaluate(() => new Promise(resolve => {
    let previous = window.scrollY;
    let stableFrames = 0;
    const settle = () => {
      const current = window.scrollY;
      stableFrames = Math.abs(current - previous) < 0.5 ? stableFrames + 1 : 0;
      previous = current;
      if (stableFrames >= 6) resolve();
      else requestAnimationFrame(settle);
    };
    requestAnimationFrame(settle);
  }));
  await firstWork.locator(".view-policy-button").click();
  await expectViewportModalFit(page.locator("#modalBox"), "Gallery artwork modal");
  await expect(page.locator("#modalCloseBtn")).toBeVisible();
  await expect(page.locator("#modalBox img").first()).toHaveAttribute(
    "alt",
    await page.locator("#modalBox .works h2").textContent()
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
async function assertContactFormUiLabels(page, label) {
  const fieldLabels = [
    { field: "name", text: "* Name（お名前）", required: true },
    { field: "email", text: "* Email（メールアドレス）", required: true },
    { field: "message", text: "Message（お問い合わせ内容）", required: false }
  ];

  const expectedMarkerFontSize = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.textContent = "*";
    probe.style.position = "fixed";
    probe.style.visibility = "hidden";
    probe.style.fontSize = window.innerWidth <= 600
      ? "var(--font-caption-size)"
      : "var(--type-form-button-size)";
    document.body.append(probe);
    const size = getComputedStyle(probe).fontSize;
    probe.remove();
    return size;
  });

  for (const item of fieldLabels) {
    const fieldLabel = page.locator(`label[for="${item.field}"]`);
    await expect(fieldLabel, label + " " + item.field + " label copy").toHaveText(item.text);
    await expect(fieldLabel.locator("[lang]"), label + " " + item.field + " label must be one UI string").toHaveCount(0);

    const layout = await fieldLabel.evaluate(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const centers = Array.from(range.getClientRects())
        .map(rect => (rect.top + rect.bottom) / 2)
        .sort((a, b) => a - b);
      const style = getComputedStyle(element);
      const lineHeight = Number.parseFloat(style.lineHeight)
        || Number.parseFloat(style.fontSize) * 1.2;
      let lineCount = 0;
      let lastCenter = null;
      for (const center of centers) {
        if (lastCenter === null || Math.abs(center - lastCenter) > lineHeight * 0.55) {
          lineCount += 1;
          lastCenter = center;
        }
      }
      const marker = element.querySelector(".required-marker");
      if (!marker) {
        return { lineCount, markerCount: 0 };
      }
      const markerStyle = getComputedStyle(marker);
      return {
        lineCount,
        markerCount: element.querySelectorAll(".required-marker").length,
        markerText: marker.textContent.trim(),
        markerIsDirectChild: marker.parentElement === element,
        markerFontSize: markerStyle.fontSize,
        markerColor: markerStyle.color,
        markerLetterSpacing: markerStyle.letterSpacing,
        labelColor: style.color
      };
    });

    expect(layout.lineCount, label + " " + item.field + " label should stay on one line").toBe(1);
    expect(layout.markerCount, label + " " + item.field + " required-marker count")
      .toBe(item.required ? 1 : 0);
    if (item.required) {
      expect(layout.markerText, label + " " + item.field + " marker should contain only the asterisk").toBe("*");
      expect(layout.markerIsDirectChild, label + " " + item.field + " marker should be scoped to the asterisk")
        .toBe(true);
      expect(layout.markerFontSize, label + " " + item.field + " marker font size should use its component token")
        .toBe(expectedMarkerFontSize);
      expect(layout.markerColor, label + " " + item.field + " marker color should not reach label copy")
        .not.toBe(layout.labelColor);
      expect(layout.markerLetterSpacing, label + " " + item.field + " marker tracking should stay scoped")
        .toBe("-4px");
    }
  }

  const policyParagraph = page.locator("#contactForm .form-field.align-center > label > p");
  await expect(policyParagraph).toContainText("Please review the Site Policy before submitting.");
  await expect(policyParagraph).not.toContainText("送信前にサイトポリシーをご確認ください。");
  await expect(policyParagraph.locator("[lang]"), label + " Site Policy form copy should be English-only")
    .toHaveCount(0);

  const consentCopy = page.locator("#consent-text");
  await expect(consentCopy).toHaveText("I have read and agree to the Site Policy.");
  await expect(consentCopy.locator("[lang]"), label + " consent copy should be a single English UI string")
    .toHaveCount(0);

  const policyLink = page.locator("button.modal-open-label");
  await expect(policyLink).toHaveText("Site Policy");
  await expect(policyLink.locator("[lang]"), label + " Policy link should be English-only")
    .toHaveCount(0);

  const submit = page.locator(".submit-btn");
  await expect(submit).toHaveText("SEND");
  await expect(submit.locator("[lang]"), label + " submit should be English-only")
    .toHaveCount(0);
}

async function assertContactBilingualPage(page, label) {
  await expect(page.locator("body")).toHaveAttribute("data-language-mode", "bilingual");
  await expect(page.locator("#langChange")).toBeHidden();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator("#contact .h1-text .subtext [lang=ja]")).toBeVisible();
  await expect(page.locator("#contact .h1-text .subtext [lang=en]")).toBeVisible();
  await expect(page.locator("#contact .content p[lang=ja]")).toBeVisible();
  await expect(page.locator("#contact .content p[lang=en]")).toBeVisible();

  const introLanguages = await page.locator("#contact .content").evaluate(element =>
    Array.from(element.children)
      .filter(child => child.matches("p[lang]"))
      .map(child => child.getAttribute("lang"))
  );
  expect(introLanguages, label + " intro should pair Japanese followed by English").toEqual(["ja", "en"]);

  await expect(page.locator('label[for="radio1"]')).toHaveText(/依頼\s*request/);
  await expect(page.locator('label[for="radio2"]')).toHaveText(/問い合わせ\s*inquiry/);
  await assertContactFormUiLabels(page, label);

  const pairedControls = [
    ['#contact .h1-text .subtext', "Contact subtitle"],
    ['label[for="radio1"]', "request"],
    ['label[for="radio2"]', "inquiry"]
  ];

  for (const entry of pairedControls) {
    const pair = page.locator(entry[0]);
    await expect(pair.locator(':scope > [lang="ja"]')).toBeVisible();
    await expect(pair.locator(':scope > [lang="en"]')).toBeVisible();
    const languages = await pair.evaluate(element =>
      Array.from(element.children)
        .filter(child => child.matches('[lang="ja"],[lang="en"]'))
        .map(child => child.getAttribute("lang"))
    );
    expect(languages, label + " " + entry[1] + " should place Japanese before English").toEqual(["ja", "en"]);
    const lineOrder = await pair.evaluate(element => {
      const japanese = element.querySelector(':scope > [lang="ja"]').getBoundingClientRect();
      const english = element.querySelector(':scope > [lang="en"]').getBoundingClientRect();
      return { japaneseBottom: japanese.bottom, englishTop: english.top };
    });
    expect(
      lineOrder.englishTop,
      label + " " + entry[1] + " English should appear directly below Japanese"
    ).toBeGreaterThanOrEqual(lineOrder.japaneseBottom - 1);
  }
}

async function exerciseContactLanguage(page, testInfo) {
  await assertContactBilingualPage(page, "Contact visual runtime");

  const languagePreferenceBefore = await page.evaluate(() => [
    localStorage.getItem("selectedLang"),
    localStorage.getItem("lang")
  ]);

  await page.locator('label[for="radio1"]').click();
  await expect(page.locator(".request-options legend [lang=ja]")).toBeVisible();
  await expect(page.locator(".request-options legend [lang=en]")).toBeVisible();
  await expect(page.locator('label[for="request-order"] [lang=ja]')).toBeVisible();
  await expect(page.locator('label[for="request-order"] [lang=en]')).toBeVisible();
  const categoryLanguages = await page.locator('label[for="request-order"]').evaluate(element =>
    Array.from(element.children).map(child => child.getAttribute("lang"))
  );
  expect(categoryLanguages, "Contact request category should place Japanese before English").toEqual(["ja", "en"]);

  await expect.poll(() => page.evaluate(() => [
    localStorage.getItem("selectedLang"),
    localStorage.getItem("lang")
  ])).toEqual(languagePreferenceBefore);

  if (fullAudit) {
    await page.screenshot({
      path: testInfo.outputPath("contact-bilingual-full-page.png"),
      fullPage: true,
      animations: "disabled",
      caret: "hide"
    });
  }

  await page.locator('button.modal-open-label').click();
  await expect(page.locator("#policy-modal-content")).toHaveAttribute("aria-busy", "false");
  const policyLanguage = await page.evaluate(() => window.getPortfolioLanguage());
  await expect(page.locator('#policy-modal-content > div[lang="' + policyLanguage + '"]')).toBeVisible();
  await expect(page.locator('#policy-modal-content > div[lang="' + (policyLanguage === 'ja' ? 'en' : 'ja') + '"]')).toBeHidden();
  await expect(page.locator('body > .modal-box .modal-close-label [lang="' + policyLanguage + '"]')).toBeVisible();
  const modalCloseLanguages = await page.locator("body > .modal-box .modal-close-label").evaluate(element =>
    Array.from(element.children).map(child => child.getAttribute("lang"))
  );
  expect(modalCloseLanguages, "Contact Site Policy modal close should place Japanese before English").toEqual(["ja", "en"]);
  const policyLanguages = await page.locator("#policy-modal-content").evaluate(element =>
    Array.from(element.children)
      .filter(child => child.matches('div[lang="ja"],div[lang="en"]'))
      .map(child => child.getAttribute("lang"))
  );
  expect(policyLanguages, "Contact Site Policy modal should place Japanese before English").toEqual(["ja", "en"]);
  await page.locator("body > .modal-box .modal-close-label").click();

  const expectedStoredLanguage = await page.evaluate(() => window.getPortfolioLanguage?.() || "ja");
  await page.goto("order.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("lang", expectedStoredLanguage);
  await page.goto("contact.html", { waitUntil: "domcontentloaded" });
  await assertContactBilingualPage(page, "Contact after Order navigation");
  await expect.poll(() => page.evaluate(() => [
    localStorage.getItem("selectedLang"),
    localStorage.getItem("lang")
  ])).toEqual(languagePreferenceBefore);

  await page.reload({ waitUntil: "domcontentloaded" });
  await assertContactBilingualPage(page, "Contact after reload");
  await expect.poll(() => page.evaluate(() => [
    localStorage.getItem("selectedLang"),
    localStorage.getItem("lang")
  ])).toEqual(languagePreferenceBefore);
}
async function exerciseContactRuntime(page, testInfo) {
  await exerciseContactLanguage(page, testInfo);
  const form = page.locator("#contactForm");
  await expect(form).toHaveAttribute("method", /post/i);
  await expect(form).toHaveAttribute("action", /^https:\/\/script\.google\.com\/macros\/s\//);

  const requestRadio = page.locator("#radio1");
  const inquiryRadio = page.locator("#radio2");
  const consent = page.locator("#consent");

  await expect(requestRadio).toHaveAttribute("required", "");
  await expect(page.locator("#name")).toHaveAttribute("required", "");
  await expect(page.locator("#email")).toHaveAttribute("required", "");
  await expect(page.locator("#message")).toHaveAttribute("required", "");
  await expect(consent).toBeDisabled();
  await expect(consent).not.toBeChecked();

  await page.locator('label[for="radio1"]').click();
  await expect(page.locator(".request-options")).toBeVisible();
  await expectHorizontalFit(page.locator(".request-options"), "Contact request options");
  await expect(page.locator('input[name="requestCategory"]')).toHaveCount(5);
  for (const input of await page.locator('input[name="requestCategory"]').all()) {
    await expect(input).toHaveAttribute("required", "");
  }
  await page.locator('label[for="request-order"]').click();
  await expect(page.locator("#request-order")).toBeChecked();

  await page.locator('label[for="radio2"]').click();
  await expect(inquiryRadio).toBeChecked();
  await expect(page.locator(".request-options")).toBeHidden();
  await expect(page.locator('input[name="requestCategory"]:checked')).toHaveCount(0);

  await page.locator('label[for="radio1"]').click();
  await page.locator('label[for="request-order"]').click();

  await page.locator('button.modal-open-label').click();
  await expect(page.locator("#modal-toggle")).toBeChecked();
  await expectViewportModalFit(page.locator("body > .modal-box"), "Contact SitePolicy modal");
  await expect(consent).toBeEnabled();
  await expect(consent).not.toBeChecked();

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
  await consent.check();

  await page.route("https://script.google.com/macros/s/**", async route => {
    await route.fulfill({
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: "Successfully submitted"
    });
  });

  await page.locator("#name").fill("Visual Regression Test");
  await page.locator("#email").fill("visual@example.com");
  await page.locator("#message").fill("Order and Contact flow verification.");
  await page.locator(".submit-btn").click();

  await expect(page.locator("#thanksModal")).toHaveClass(/show/);
  await expect(page.locator("#thanksModal p[lang=ja]")).toBeVisible();
  await expect(page.locator("#thanksModal p[lang=en]")).toBeHidden();
  const thanksLanguages = await page.locator("#thanksModal .thanks-modal-body").evaluate(element =>
    Array.from(element.children)
      .filter(child => child.matches("p[lang]"))
      .map(child => child.getAttribute("lang"))
  );
  expect(thanksLanguages, "Contact thanks modal should place Japanese before English").toEqual(["ja", "en"]);
  await expect(page.locator('.form-status [lang="ja"]')).toHaveText("送信しました。");
  await expect(page.locator('.form-status [lang="ja"]')).toBeVisible();
  await expect(page.locator('.form-status [lang="en"]')).toHaveText("Your message has been sent.");
  await expect(page.locator('.form-status [lang="en"]')).toBeVisible();
  await expect(page.locator("#contactForm")).toBeVisible();
  await expect(requestRadio).not.toBeChecked();
  await expect(page.locator(".request-options")).toBeHidden();

  const thanksClose = page.locator("#thanksModal .close");
  await expect(thanksClose).toBeFocused();
  const closeTop = (await thanksClose.boundingBox()).y;
  await page.locator('#thanksModal .thanks-modal-body').evaluate(e => e.scrollTop=e.scrollHeight);
  expect((await thanksClose.boundingBox()).y).toBeCloseTo(closeTop, 0);
  await page.keyboard.press('Tab');
  await expect(thanksClose).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.submit-btn')).toBeFocused();
  await expect(page.locator("#thanksModal")).not.toHaveClass(/show/);
  await page.waitForTimeout(350);
  await expect(page.locator("#langChange")).toBeHidden();
  await expect(page.locator("#thanksModal .close")).toHaveAttribute("aria-label", "閉じる");
}

const informationPastActivityRows = [
  ["2026.10", "開催終了 グループ展「ゆらゆら」｜企画・主催 2026年10月6日 — 10月12日", "Concluded Group Exhibition “Yurayura”｜Planning / Organizer October 6 — 12, 2026"],
  ["2025", "03｜日台の絆展 会場 / 台湾", "March｜Japan-Taiwan Bond Exhibition Venue / Taiwan"],
  ["2023", "06｜第2回日仏友好オリジナル切手展 会場 / フランス", "June | 2nd Japan-France Friendship Original Stamp Exhibition Venue / France"],
  ["2022", "11｜芸術の虎展 会場 / 日光東照宮美術館 04｜日アセアン友好文化交流展 会場 / 東京アセアンセンター", "November | Tigers of Art Exhibition Venue: Nikko Toshogu Museum April | Japan-ASEAN Friendship and Cultural Exchange Exhibition Venue: Tokyo ASEAN Centre"],
  ["2021", "11｜サロン・ド・アール・ジャポネ 会場 / フランス 08｜OASISU2021 会場 / 大阪あべのハルカス 04｜チャリティアート展 会場 / 東京", "November | Salon d'Art Japonais, Venue: France August | OASISU 2021, Venue: Abeno Harukas, Osaka April | Charity Art Exhibition, Venue: Tokyo"]
];

async function assertInformationPastHistory(page, language, label) {
  const table = page.locator(".information-page .past-activities-table");
  await expect(table, label + " Biography-style Past Activities table").toHaveCount(1);
  await expect(table).toHaveClass(/portfolio-history-table/);
  await expect(table.locator("thead th")).toHaveCount(2);
  await expect(table.locator("thead th")).toHaveClass([/tb-title/, /tb-title/]);
  await expect(table.locator("thead th").first()).toHaveText("Year");
  await expect(table.locator("thead th").nth(1).locator('[lang="ja"]')).toHaveText("活動・展示");
  await expect(table.locator("thead th").nth(1).locator('[lang="en"]')).toHaveText("Activities / Exhibitions");
  await expect(table.locator("tbody tr")).toHaveCount(informationPastActivityRows.length);
  await expect(table.locator('tbody tr[lang]')).toHaveCount(0);

  const rows = await table.locator("tbody tr").evaluateAll(elements => elements.map(row => {
    const normalize = value => (typeof value === "string" ? value : [...value.childNodes]
      .map(node => node.nodeName === "BR" ? " " : node.textContent || "")
      .join(""))
      .replace(/\s+/gu, " ")
      .trim();
    return [
      normalize(row.querySelector("td.year")?.textContent || ""),
      normalize(row.querySelector('td.tb-content > span[lang="ja"]')),
      normalize(row.querySelector('td.tb-content > span[lang="en"]'))
    ];
  }));
  expect(rows, label + " year, month, exhibition, and venue records").toEqual(informationPastActivityRows);

  for (let index = 0; index < informationPastActivityRows.length; index += 1) {
    const row = table.locator("tbody tr").nth(index);
    await expect(row.locator('td.tb-content > span[lang="ja"]'))[language === "ja" ? "toBeVisible" : "toBeHidden"]();
    await expect(row.locator('td.tb-content > span[lang="en"]'))[language === "en" ? "toBeVisible" : "toBeHidden"]();
  }
  await expect(table.locator("thead th").nth(1).locator('[lang="ja"]'))[language === "ja" ? "toBeVisible" : "toBeHidden"]();
  await expect(table.locator("thead th").nth(1).locator('[lang="en"]'))[language === "en" ? "toBeVisible" : "toBeHidden"]();
}

async function compareInformationPastTableWithBiography(page, label) {
  const informationTable = page.locator(".information-page .past-activities-table");
  const referencePage = await page.context().newPage();
  try {
    const viewport = page.viewportSize();
    if (viewport) await referencePage.setViewportSize(viewport);
    await prepareDeterministicNetwork(referencePage);
    await referencePage.goto(new URL("biography.html", page.url()).href, { waitUntil: "domcontentloaded" });
    const biographyTable = referencePage.locator("#biography-records .portfolio-history-table").first();
    await expect(biographyTable, label + " Biography history table").toBeVisible();

    const profile = async table => table.evaluate(element => {
      const getProperties = (node, names) => {
        const style = getComputedStyle(node);
        return Object.fromEntries(names.map(name => [name, style[name]]));
      };
      const tableRect = element.getBoundingClientRect();
      const parentStyle = getComputedStyle(element.parentElement);
      const parentContentWidth = element.parentElement.clientWidth
        - parseFloat(parentStyle.paddingLeft)
        - parseFloat(parentStyle.paddingRight);
      const header = element.querySelector("thead th");
      const year = element.querySelector("tbody .year");
      const content = element.querySelector("tbody .tb-content");
      const english = element.querySelector("tbody .en-txt");
      const yearRect = year.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const sharedProperties = [
        "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
        "borderBottomWidth", "borderBottomStyle", "borderBottomColor",
        "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textAlign",
        "verticalAlign", "textTransform", "whiteSpace", "overflowWrap", "color"
      ];
      return {
        table: {
          tableLayout: getComputedStyle(element).tableLayout,
          borderCollapse: getComputedStyle(element).borderCollapse,
          marginTop: getComputedStyle(element).marginTop,
          widthRatio: tableRect.width / parentContentWidth,
          yearColumnRatio: yearRect.width / tableRect.width,
          contentColumnRatio: contentRect.width / tableRect.width
        },
        header: getProperties(header, sharedProperties),
        year: getProperties(year, sharedProperties),
        content: getProperties(content, sharedProperties),
        english: getProperties(english, [...sharedProperties, "marginTop"])
      };
    });

    const informationProfile = await profile(informationTable);
    const biographyProfile = await profile(biographyTable);
    expect(informationProfile.table.tableLayout, label + " table layout").toBe(biographyProfile.table.tableLayout);
    expect(informationProfile.table.borderCollapse, label + " table border model").toBe(biographyProfile.table.borderCollapse);
    expect(informationProfile.table.marginTop, label + " table spacing").toBe(biographyProfile.table.marginTop);
    expect(informationProfile.table.widthRatio, label + " table width").toBeCloseTo(biographyProfile.table.widthRatio, 2);
    expect(informationProfile.table.yearColumnRatio, label + " Year-column width").toBeCloseTo(biographyProfile.table.yearColumnRatio, 2);
    expect(informationProfile.table.contentColumnRatio, label + " content-column width").toBeCloseTo(biographyProfile.table.contentColumnRatio, 2);
    expect(informationProfile.header, label + " header style").toEqual(biographyProfile.header);
    expect(informationProfile.year, label + " Year-column style").toEqual(biographyProfile.year);
    expect(informationProfile.content, label + " activity-column style").toEqual(biographyProfile.content);
    expect(informationProfile.english, label + " English-copy style").toEqual(biographyProfile.english);
  } finally {
    await referencePage.close();
  }
}

async function exerciseInformationLanguage(page, testInfo) {
  await expect(page.locator("body")).toHaveAttribute("data-language-mode", "switchable");
  await expect(page.locator("#langChange")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator(".information-page .content > h2 [lang=ja]")).toBeVisible();
  await expect(page.locator("#upcoming-title [lang=ja]")).toBeVisible();
  await expect(page.locator("#past-title [lang=ja]")).toBeVisible();
  await expect(page.locator('#past-title [lang="ja"]')).toHaveText("過去の活動");
  await expect(page.locator('.info-section[aria-labelledby="upcoming-title"] [data-yurayura-feed-status][lang="ja"]')).toBeVisible();
  await assertInformationPastHistory(page, "ja", "Information Past Activities in Japanese");
  await expect(page.locator(".information-intro p[lang=ja]")).toBeVisible();
  await expect(page.locator(".information-intro p[lang=en]")).toHaveCount(1);
  await expect(page.locator(".information-intro p[lang=en]")).toBeHidden();
  await expect(page.locator(".past-activities-table tbody tr")).toHaveCount(5);
  await expect(page.locator('.past-activities-table tbody tr[lang="ja"], .past-activities-table tbody tr[lang="en"]')).toHaveCount(0);
  await expect(page.locator('.info-link[lang="ja"][href="exhibitions/yurayura/"]')).toBeVisible();
  await expect(page.locator('.info-link a[lang="ja"][href="https://mizukioyama.github.io/yurayura/information.html"]')).toBeVisible();
  await expect(page.locator('.info-link[lang="en"][href="exhibitions/yurayura/"]')).toBeHidden();

  await page.locator('#langChange label[for="langEn"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".information-page .content > h2 [lang=ja]")).toBeHidden();
  await expect(page.locator(".information-page .content > h2 [lang=en]")).toBeVisible();
  await expect(page.locator("#upcoming-title [lang=ja]")).toBeHidden();
  await expect(page.locator("#past-title [lang=ja]")).toBeHidden();
  await expect(page.locator('#past-title [lang="en"]')).toHaveText("Past Activities");
  await assertInformationPastHistory(page, "en", "Information Past Activities in English");
  await expect(page.locator('.info-section[aria-labelledby="upcoming-title"] [data-yurayura-feed-status][lang="ja"]')).toBeHidden();
  await expect(page.locator('.info-section[aria-labelledby="upcoming-title"] [data-yurayura-feed-status][lang="en"]')).toBeVisible();
  await expect(page.locator(".information-intro p[lang=ja]")).toBeHidden();
  await expect(page.locator(".information-intro p[lang=en]")).toBeVisible();
  await expect(page.locator(".information-intro p[lang=en]")).toContainText("Current and upcoming exhibitions");
  await expect(page.locator("#upcoming-title [lang=en]")).toBeVisible();
  await expect(page.locator("#past-title [lang=en]")).toBeVisible();
  await expect(page.locator('.past-activities-table span[lang="en"]').filter({ hasText: "Group Exhibition" })).toBeVisible();
  await expect(page.locator('.past-activities-table span[lang="en"]').filter({ hasText: "Group Exhibition" })).toBeVisible();
  await expect(page.locator('.info-link a[lang="en"][href="https://mizukioyama.github.io/yurayura/information.html"]')).toBeVisible();
  const englishDetailLink = page.locator('.info-link[lang="en"][href="exhibitions/yurayura/"]');
  await expect(englishDetailLink).toBeVisible();
  await expect(englishDetailLink).toHaveText("View exhibition details");
  await expect(englishDetailLink).toHaveAttribute("href", "exhibitions/yurayura/");
  await expect(page.locator('.info-link[lang="ja"][href="exhibitions/yurayura/"]')).toBeHidden();
  await expectHorizontalFit(page.locator(".information-page .content"), "Information content in English");
  await expectHorizontalFit(page.locator(".information-page .past-activities-table"), "Information table in English");
  await expectHorizontalFit(page.locator(".information-page .info-link:visible"), "Information links in English");
  const englishDiagnostics = await layoutDiagnostics(page);
  expect(englishDiagnostics.overflow, "English Information has horizontal overflow").toBe(0);
  expect(englishDiagnostics.clippedText, "visible English Information text is clipped").toEqual([]);
  await expect.poll(() => page.evaluate(() => [
    localStorage.getItem("selectedLang"),
    localStorage.getItem("lang")
  ])).toEqual(["en", "en"]);
  if (fullAudit) {
    await page.screenshot({
      path: testInfo.outputPath("information-en-full-page.png"),
      fullPage: true,
      animations: "disabled",
      caret: "hide"
    });
  }

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('#langChange input[value="en"]')).toBeChecked();
  await expect(page.locator("#upcoming-title [lang=en]")).toBeVisible();
  await expect(page.locator('.info-link[lang="en"][href="exhibitions/yurayura/"]')).toBeVisible();
  await page.locator('#langChange label[for="langJa"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator(".information-intro p[lang=ja]")).toBeVisible();
  await assertInformationPastHistory(page, "ja", "Information Past Activities restored in Japanese");
  await expect(page.locator('.info-link[lang="ja"][href="exhibitions/yurayura/"]')).toBeVisible();
  await expect(page.locator('.info-link[lang="en"][href="exhibitions/yurayura/"]')).toBeHidden();
}

async function exerciseInformationRuntime(page, testInfo) {
  await exerciseInformationLanguage(page, testInfo);
  const sections = page.locator(".information-page .info-section");
  await expect(sections).toHaveCount(2);

  const headings = await sections.locator("h2").allInnerTexts();
  expect(headings.map(text => text.trim())).toEqual(["開催中・開催予定", "過去の活動"]);
  await compareInformationPastTableWithBiography(page, "Information table matches Biography at " + page.viewportSize().width + "px");

  const upcoming = page.locator('section[aria-labelledby="upcoming-title"]');
  await expect(page.locator("[data-yurayura-current-events] tr, [data-yurayura-upcoming-events] tr")).toHaveCount(0);
  await expect(upcoming).toContainText("現在、開催が確定している展示の告知はありません。");
  await expect(page.locator('section[aria-labelledby="past-title"]')).toContainText("2026年10月6日 — 10月12日");

  const detailLink = page.getByRole("link", { name: "展示詳細を見る" });
  await expect(detailLink).toBeVisible();
  await expect(detailLink).toHaveAttribute("href", "exhibitions/yurayura/");
}

async function exerciseOrderRuntime(page) {
  await page.waitForLoadState("load");
  const contactLink = page
    .getByRole("link", { name: /Contact Us｜お問い合わせ/i })
    .first();
  await expect(contactLink).toBeVisible();
  await expect(contactLink).toHaveAttribute("href", "contact.html");
  await Promise.all([
    page.waitForURL(/\/website\/contact\.html$/),
    contactLink.click()
  ]);
  await page.waitForLoadState("domcontentloaded");

  const form = page.locator("#contactForm");
  await expect(form).toBeAttached();
  await expect(form).toHaveAttribute("method", /post/i);
  await expect(form).toHaveAttribute("action", /^https:\/\/script\.google\.com\/macros\/s\//);
  await expect(page.locator("#radio1")).toBeAttached();
  await expect(page.locator("#radio2")).toBeAttached();
  await expect(page.locator("#name")).toBeAttached();
  await expect(page.locator("#email")).toBeAttached();
  await expect(page.locator("#message")).toBeAttached();
}

async function observeHomeSlides(page) {
  await page.addInitScript(() => {
    window.__visualHomeSlideHistory = [];
    document.addEventListener("DOMContentLoaded", () => {
      const root = document.querySelector("#mainContent");
      if (!root) return;
      const slides = [...root.querySelectorAll(".content__slide")];
      let lastIndex = -1;
      const recordActiveSlide = () => {
        const activeIndex = slides.findIndex(slide => slide.classList.contains("active"));
        if (activeIndex < 0 || activeIndex === lastIndex) return;
        lastIndex = activeIndex;
        window.__visualHomeSlideHistory.push(activeIndex);
      };
      recordActiveSlide();
      new MutationObserver(recordActiveSlide).observe(root, {
        attributes: true,
        attributeFilter: ["class"],
        subtree: true
      });
    }, { once: true });
  });

}

async function prepareDeterministicNetwork(page) {
  // Observe the real animation promise; the initial static heading can already
  // match its label before TextScramble has started replacing its letters.
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      if (typeof TextScramble === "undefined") return;
      const setText = TextScramble.prototype.setText;
      TextScramble.prototype.setText = function (text) {
        const isPageTitle = this.el.matches(".h1-text h1.text");
        if (isPageTitle) this.el.dataset.visualTitleComplete = "false";
        const completion = setText.call(this, text);
        if (isPageTitle) completion.then(() => {
          this.el.dataset.visualTitleComplete = "true";
        });
        return completion;
      };
    }, { once: true });
  });

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

  // CI has no local Yurayura source file; per-test routes can replace this deterministic empty feed.
  await page.route("**/website/__preview/yurayura-events.json*", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: "[]"
  }));
}

async function completeHomeEntry(page) {
  if (!await page.locator('#home-entry').count()) return;
  await expect(page.locator('#loading-bg')).toHaveAttribute('data-typing-started', 'true');
  if (await page.locator('#home-entry').isVisible()) await page.locator('#home-start').click();
  await page.waitForFunction(() => !document.querySelector('main.top-page').inert && document.getElementById('home-entry').hidden);
  await expect(page.locator('#loading-bg')).toBeHidden();
}

async function stabilize(page, entry = {}) {
  await completeHomeEntry(page);
  await page.addStyleTag({ path: path.resolve(__dirname, "stabilize.css") });

  // These pages run both the primary WebGL field and TRUNK in visual tests.
  // Their letter-by-letter H1 reveal advances on RAF, so allow slower CI renderers more time.
  const titleAnimationTimeoutMs = ["biography", "artist-statement", "order"].includes(entry.key) ? 15000 : 5000;
  await page.evaluate(async timeoutMs => {
    const title = document.querySelector(".h1-text h1.text");
    if (!title) return;
    const target = title.getAttribute("aria-label");
    if (!target) return;

    await new Promise((resolve, reject) => {
      let stableTimer;
      const timeoutTimer = setTimeout(() => {
        observer.disconnect();
        reject(new Error("Page title did not finish its text animation."));
      }, timeoutMs);
      const finish = () => {
        observer.disconnect();
        clearTimeout(timeoutTimer);
        resolve();
      };
      const check = () => {
        clearTimeout(stableTimer);
        if (title.dataset.visualTitleComplete === "true"
          && title.innerText.trim() === target.trim() && !title.querySelector(".dud")) {
          stableTimer = setTimeout(finish, 300);
        }
      };
      const observer = new MutationObserver(check);
      observer.observe(title, {
        childList: true, characterData: true, subtree: true,
        attributes: true, attributeFilter: ["data-visual-title-complete"]
      });
      check();
    });
  }, titleAnimationTimeoutMs);

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
          if (!first.classList.contains("active")) first.classList.add("active");
          if (first.classList.contains("exit")) first.classList.remove("exit");
          for (const sibling of first.parentElement.children) {
            if (sibling !== first && (sibling.classList.contains('active') || sibling.classList.contains('exit'))) sibling.classList.remove("active", "exit");
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
    if (entry.key === "home" || entry.key === "contact" || (
      fullAudit && ["biography", "artist-statement"].includes(entry.key)
    ) || (
      testInfo.project.name === "desktop-1440"
      && ["biography", "order", "information"].includes(entry.key)
    )) {
      // Keep full-page heavy cases bounded while allowing the seven viewport audit to finish.
      testInfo.setTimeout(60000);
    }

    const runtime = createRuntimeMonitor(page, entry);
    let homeSuppressedDelays = [];
    let screenshotDiagnostics = null;

    if (entry.key === "home") {
      // Generated docs/js/time.js is minified, so match its caller stack rather than callback names.
      // Hold only the known 2s/6s carousel timers; keep CSS and canvas animation frames running.
      await page.addInitScript(() => {
        const nativeSetTimeout = window.setTimeout.bind(window);
        window.__visualHomeAutoAdvanceSuppressed = [];
        window.setTimeout = (callback, delay, ...args) => {
          const stack = new Error().stack || "";
          const isHomeAutoAdvance = [2000, 6000].includes(Number(delay))
            && /\/js\/time\.js(?:[?#:]|$)/.test(stack);

          if (isHomeAutoAdvance) {
            window.__visualHomeAutoAdvanceSuppressed.push(Number(delay));
            return nativeSetTimeout(() => {}, delay, ...args);
          }
          return nativeSetTimeout(callback, delay, ...args);
        };
      });
    }

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
    if (entry.key === "information") {
      await page.route("**/website/__preview/yurayura-events.json*", route => route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "[]"
      }));
    }
    // Match the reduced-motion setting used to create the committed layout baselines.
    // Normal-motion drawing and preference changes have independent lifecycle tests.
    await page.emulateMedia({ reducedMotion: "reduce" });
    const response = await page.goto(entry.path, { waitUntil: "domcontentloaded" });
    expect(response, "navigation should return a response").not.toBeNull();
    expect(response.status()).toBe(entry.status || 200);
    if (entry.key === "information") await expect(page.locator("[data-yurayura-feed]")).toHaveAttribute("data-state", "ready");

    if (entry.key === "yurayura") {
      const event = await page.locator('script[type="application/ld+json"]').evaluate(script => JSON.parse(script.textContent));
      expect(event).toEqual({
        "@context": "https://schema.org",
        "@type": "Event",
        "@id": "https://mizukioyama.github.io/website/exhibitions/yurayura/#event",
        "url": "https://mizukioyama.github.io/website/exhibitions/yurayura/",
        "name": "グループ展「ゆらゆら」",
        "description": "小山瑞樹が企画・主催するグループ展「ゆらゆら」。",
        "startDate": "2026-10-06",
        "endDate": "2026-10-12",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "organizer": {
          "@type": "Person",
          "@id": "https://mizukioyama.github.io/website/#person",
          "name": "小山瑞樹",
          "alternateName": "Mizuki Oyama",
          "jobTitle": "Abstract Artist"
        }
      });
    }

    await stabilize(page, entry);

    if (entry.key === "home") {
      homeSuppressedDelays = await page.evaluate(
        () => window.__visualHomeAutoAdvanceSuppressed || []
      );
      expect(
        homeSuppressedDelays,
        "Home screenshot must suppress both auto-advance timers from generated time.js"
      ).toEqual([2000, 6000]);
    }

    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator("#header-container header")).toBeAttached();
    await expect(page.locator("#header-container .head a")).toBeAttached();
    await expect(page.locator("#navArea .toggle_btn")).toBeAttached();
    if (entry.footer !== false) {
      await expect(page.locator("#footer-container footer")).toBeAttached();
    }
    await assertSharedHeaderFooterTypography(page, testInfo, entry.footer !== false);
    await assertH1Subtitle(page, entry);

    if (entry.key === "order" || entry.key === "policy") {
      const language = await page.locator("html").getAttribute("lang");
      await assertSwitchableBodyLanguage(page, language, entry.key);
      if (entry.key === "order") {
        await assertOrderPricingContent(page, language, "Order visual regression");
      } else {
        await assertOrderCancellationPolicy(page, language, "Policy visual regression");
      }
    }

    if (entry.key === "information") {
      const titleBox = await page.locator(".information-page > .h1-text").boundingBox();
      const sectionTitleBox = await page.locator(".information-page .content > h2").boundingBox();

      expect(titleBox, "Information H1 and subtitle should have a layout box").not.toBeNull();
      expect(sectionTitleBox, "Information section heading should have a layout box").not.toBeNull();
      expect(
        titleBox.y + titleBox.height,
        "Information H1 and subtitle must not overlap the section heading/content"
      ).toBeLessThan(sectionTitleBox.y);
    }

    const diagnostics = await layoutDiagnostics(page);
    expect(diagnostics.overflow, "document has horizontal overflow")[entry.key === "information" ? "toBe" : "toBeLessThanOrEqual"](entry.key === "information" ? 0 : 2);
    expect(diagnostics.clippedText, "visible main text is clipped inside its box").toEqual([]);
    expect(diagnostics.brokenVisibleImages, "visible image failed to load").toEqual([]);
    await testInfo.attach("layout-diagnostics-" + entry.key + ".json", {
      body: Buffer.from(JSON.stringify(diagnostics, null, 2)), contentType: "application/json"
    });

    await assertResponsivePageGeometry(page, entry);

    if (["biography", "artist-statement"].includes(entry.key)) {
      await assertBilingualPage(page, entry.key);
    }

    // Run Home's interactive menu assertion before the expensive full-page
    // capture, which can consume most of its bounded CI test budget.
    if (entry.key === "home") {
      await exerciseSharedRuntimeInteractions(page);
    }

    if (process.env.VISUAL_SKIP_SNAPSHOTS !== "1" && entry.baseline !== false && visualBaselineProjects.has(testInfo.project.name)) {
      if (["biography", "artist-statement"].includes(entry.key)) {
        // Keep established page-layout baselines deterministic. Organic Flow is
        // checked separately by the production-runtime lifecycle assertions.
        await page.addStyleTag({
          content: "#portfolio-overlay-animation .organic-flow-canvas { visibility: hidden !important; }"
        });
      }
      const heavyDesktopCapture = testInfo.project.name === "desktop-1440"
        && ["home", "biography"].includes(entry.key);
      const captureTimeoutMs = heavyDesktopCapture ? 30000 : 15000;
      const preflight = await page.evaluate(async () => {
        const started = performance.now();
        let fontTimer;
        const fontReadyWithinBudget = await Promise.race([
          document.fonts.ready.then(() => true),
          new Promise(resolve => { fontTimer = setTimeout(() => resolve(false), 1000); })
        ]);
        clearTimeout(fontTimer);
        return {
          fontReadyWithinBudget,
          fontReadyWaitMs: performance.now() - started,
          fontStatus: document.fonts.status,
          fontFaceCount: document.fonts.size,
          documentHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
          viewport: {width: innerWidth, height: innerHeight},
          reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
          canvasCount: document.querySelectorAll("canvas").length,
          trunkCanvasCount: document.querySelectorAll("#vanta-bg-bio canvas").length,
          selectedInk: window.__selectedInkField?.getState?.() || null,
          organicFlow: window.__organicFlowProduction?.getState?.() || null
        };
      });
      const captureStarted = performance.now();
      const errorsBeforeCapture = testInfo.errors.length;
      await test.step("Screenshot comparison (runtime continues after mismatch)", async () => {
        // Keep the mismatch as a test failure without skipping independent runtime checks.
        await expect.soft(page).toHaveScreenshot(entry.key + ".png", {
          fullPage: true,
          timeout: captureTimeoutMs
        });
      });
      // Preserve Linux review evidence even when the full-page comparator passes.
      // Full-page tolerance can admit a small but intentional shared-header change.
      const reviewCapturePath = testInfo.outputPath("review-" + entry.key + ".png");
      await page.screenshot({ path: reviewCapturePath, fullPage: true, animations: "disabled", caret: "hide" });
      await testInfo.attach("review-" + entry.key + ".png", { path: reviewCapturePath, contentType: "image/png" });
      screenshotDiagnostics = {
        ...preflight,
        captureTimeoutMs,
        workers: testInfo.config.workers,
        captureElapsedMs: performance.now() - captureStarted,
        screenshotFailureCount: testInfo.errors.length - errorsBeforeCapture
      };
      await testInfo.attach("capture-diagnostics-" + entry.key + ".json", {
        body: Buffer.from(JSON.stringify(screenshotDiagnostics, null, 2)),
        contentType: "application/json"
      });
    } else if (fullAudit) {
      if (["biography", "artist-statement"].includes(entry.key)) {
        await page.addStyleTag({
          content: "#portfolio-overlay-animation .organic-flow-canvas { visibility: hidden !important; }"
        });
      }
      await page.screenshot({
        path: testInfo.outputPath(entry.key + "-full-page.png"),
        fullPage: true,
        animations: "disabled",
        caret: "hide"
      });
    }

    await test.step("Independent runtime interactions and final error checks", async () => {
      let completed = false;
      try {
        if (!["home", "biography", "artist-statement", "404", "yurayura"].includes(entry.key)) {
          await exerciseSharedRuntimeInteractions(page);
        }
        if (entry.key === "gallery") {
          await exerciseGalleryRuntime(page, testInfo.project.name, testInfo);
        }
        if (entry.key === "information") {
          await exerciseInformationRuntime(page, testInfo);
        }
        if (entry.key === "contact") {
          await exerciseContactRuntime(page, testInfo);
        }
        if (entry.key === "order") {
          await exerciseOrderRuntime(page);
        }

        assertRuntimeClean(runtime, entry);
        await attachRuntimeObservations(testInfo, entry, runtime);
        completed = true;
      } finally {
        await testInfo.attach("runtime-verification-" + entry.key + ".json", {
          body: Buffer.from(JSON.stringify({
            completed, pageErrors: runtime.pageErrors,
            consoleErrors: relevantConsoleErrors(runtime, entry),
            localResourceFailures: runtime.localResourceFailures,
            externalResourceFailures: runtime.externalResourceFailures,
            layoutBeforeCapture: diagnostics
          }, null, 2)), contentType: "application/json"
        });
        if (entry.key === "home") {
          const evidence = {
            commitSHA: process.env.GITHUB_SHA || null,
            project: testInfo.project.name,
            homeSuppressedDelays,
            screenshot: screenshotDiagnostics,
            runtime: {
              completed,
              pageErrors: runtime.pageErrors,
              consoleErrors: relevantConsoleErrors(runtime, entry),
              consoleWarnings: runtime.consoleWarnings,
              localResourceFailures: runtime.localResourceFailures,
              externalResourceFailures: runtime.externalResourceFailures
            },
            layoutBeforeCapture: diagnostics
          };
          fs.writeFileSync(
            testInfo.outputPath("home-stability-evidence.json"),
            JSON.stringify(evidence, null, 2)
          );
          console.log("[home-stability-evidence] " + JSON.stringify(evidence));
        }
      }
    });
  });
}

async function resolveCssFontToken(page, tokenName) {
  return page.evaluate(name => {
    const probe = document.createElement("span");
    probe.style.cssText = "position: fixed; visibility: hidden; font-size: var(" + name + ");";
    document.body.appendChild(probe);
    const size = parseFloat(getComputedStyle(probe).fontSize);
    probe.remove();
    return size;
  }, tokenName);
}

async function assertSharedHeaderFooterTypography(page, testInfo, hasFooter = true) {
  const expected = Math.round((await resolveCssFontToken(page, "--type-header-footer-size")) * 10) / 10;
  expect(expected, "Header/Footer token should resolve at " + testInfo.project.name).toBeGreaterThan(0);

  const sizes = await page.evaluate(hasFooterValue => ({
    header: parseFloat(getComputedStyle(document.querySelector("#header-container .head a")).fontSize),
    footer: hasFooterValue
      ? [...document.querySelectorAll("#footer-container footer a")]
          .map(link => parseFloat(getComputedStyle(link).fontSize))
      : []
  }), hasFooter);
  const roundToTenth = value => Math.round(value * 10) / 10;

  const desktop = page.viewportSize().width >= 1024;
  expect(roundToTenth(sizes.header), "Header brand: explicit PC component exception").toBe(desktop ? 18 : expected);
  if (desktop) {
    const menuSizes = await page.locator("#navArea .inner a").evaluateAll(es => es.map(e => parseFloat(getComputedStyle(e).fontSize)));
    expect(menuSizes).toEqual([16, 16, 16, 16, 16, 16]);
  }
  if (hasFooter) {
    expect(sizes.footer.length, "Footer navigation should exist").toBeGreaterThan(0);
    for (const size of sizes.footer) {
      expect(roundToTenth(size), "Footer navigation font-size").toBe(expected);
      if (!desktop) expect(Math.abs(size - sizes.header), "Mobile Header/Footer share the original token").toBeLessThanOrEqual(0.05);
    }
  }
}

test("Home display and creator labels retain their typography roles; Biography H2s share a group size", async ({ page }) => {
  const roundToTenth = value => Math.round(value * 10) / 10;

  await prepareDeterministicNetwork(page);
  await page.goto("", { waitUntil: "domcontentloaded" });
  const homeH2Expected = roundToTenth(await resolveCssFontToken(page, "--type-home-h2-size"));
  const homeDisplayH2Size = await page.locator("h2.title__inner").first().evaluate(element =>
    parseFloat(getComputedStyle(element).fontSize)
  );
  expect(roundToTenth(homeDisplayH2Size), "Home display H2 font-size").toBe(homeH2Expected);

  const homeCreatorExpected = roundToTenth(await resolveCssFontToken(page, "--type-home-creator-size"));
  const homeCreatorSizes = (await page.locator("h2.creator-title").evaluateAll(elements =>
    elements.map(element => parseFloat(getComputedStyle(element).fontSize))
  )).map(roundToTenth);
  expect(homeCreatorSizes.length, "Home creator identity labels should exist").toBe(2);
  expect(homeCreatorSizes, "Home creator identity labels should use their component token").toEqual([
    homeCreatorExpected,
    homeCreatorExpected
  ]);

  await page.goto("biography.html", { waitUntil: "domcontentloaded" });
  const standardSizes = await page.locator("#bio #state .content h2").evaluateAll(elements =>
    elements.map(element => getComputedStyle(element).fontSize)
  );
  expect(standardSizes.length, "Biography normal H2 elements should exist").toBeGreaterThan(1);
  expect(new Set(standardSizes).size, "Standard-page normal H2 elements should share one size").toBe(1);
});

test("shared body typography matches the documented responsive scale", async ({ page }) => {
  const roundToTenth = value => Math.round(value * 10) / 10;

  await prepareDeterministicNetwork(page);
  await page.goto("", { waitUntil: "domcontentloaded" });
  const homeExpected = Math.round((await resolveCssFontToken(page, "--type-home-p-size")) * 10) / 10;
  expect(homeExpected, "Home body typography token should resolve").toBeGreaterThan(0);
  const homeSize = await page.locator("main p").first().evaluate(element =>
    parseFloat(getComputedStyle(element).fontSize)
  );
  expect(roundToTenth(homeSize), "Home body font-size").toBe(homeExpected);

  await page.goto("biography.html", { waitUntil: "domcontentloaded" });
  const standardExpected = Math.round((await resolveCssFontToken(page, "--type-page-p-size")) * 10) / 10;
  expect(standardExpected, "Standard body typography token should resolve").toBeGreaterThan(0);
  const biographySize = await page.locator("#bio #state .content .work > p.state-txt").first().evaluate(element =>
    parseFloat(getComputedStyle(element).fontSize)
  );
  expect(roundToTenth(biographySize), "Biography body font-size").toBe(standardExpected);

  const biographyEnglishSize = await page.locator("#bio #state .content .work > p.text").first().evaluate(element =>
    parseFloat(getComputedStyle(element).fontSize)
  );
  expect(roundToTenth(biographyEnglishSize), "Biography English body font-size").toBe(standardExpected);

  await page.goto("artist-statement.html", { waitUntil: "domcontentloaded" });

  const statementJapaneseSize = await page.locator("#state .content .work > p.state-txt").first().evaluate(element =>
    parseFloat(getComputedStyle(element).fontSize)
  );
  expect(roundToTenth(statementJapaneseSize), "Statement Japanese body font-size").toBe(standardExpected);

  const statementEnglishSize = await page.locator("#state .content .work > p.text").first().evaluate(element =>
    parseFloat(getComputedStyle(element).fontSize)
  );
  expect(roundToTenth(statementEnglishSize), "Statement English body font-size").toBe(standardExpected);

  const statementTimelineEnglishSize = await page.locator("#state .timeline-copy > p.text").first().evaluate(element =>
    parseFloat(getComputedStyle(element).fontSize)
  );
  expect(roundToTenth(statementTimelineEnglishSize), "Statement timeline English body font-size").toBe(standardExpected);
});

test("Home carousel still advances automatically outside screenshot stabilization", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "The Home carousel runtime is checked once per run."
  );

  await page.emulateMedia({ reducedMotion: "no-preference" });
  const runtime = createRuntimeMonitor(page, { key: "home" });
  await prepareDeterministicNetwork(page);
  await observeHomeSlides(page);

  const response = await page.goto("", { waitUntil: "domcontentloaded" });
  await completeHomeEntry(page);
  expect(response, "Home carousel should return a document response").not.toBeNull();
  expect(response.status(), "Home carousel document status").toBe(200);
  await page.waitForFunction(() => {
    const history = window.__visualHomeSlideHistory || [];
    return history.includes(0) && history.includes(1);
  }, null, { timeout: 8000 });

  const slideHistory = await page.evaluate(() => window.__visualHomeSlideHistory);
  expect(slideHistory[0], "Home should begin on the first slide").toBe(0);
  expect(slideHistory, "Home should automatically advance to the second slide").toContain(1);
  const selectedLanguage = await page.locator("#langChange input:checked").getAttribute("value");
  await expect(page.locator("#langChange .lang-button." + selectedLanguage)).toHaveClass(/active/);
  assertRuntimeClean(runtime, { key: "home" });
});

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

  const expected = {
    "Top": "/website/",
    "Art Index": "/website/gallery.html",
    "Artist Statement": "/website/artist-statement.html",
    "Biography": "/website/biography.html",
    "Contact": "/website/contact.html",
    "Order": "/website/order.html"
  };

  const toggle = page.locator("#navArea .toggle_btn");
  await expect(toggle).toHaveJSProperty("tagName", "BUTTON");
  await expect(toggle).toHaveJSProperty("tabIndex", 0);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toHaveAttribute("aria-label", "Open navigation menu");

  if (page.viewportSize().width < 1024) {
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#navArea")).toHaveClass(/open/);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toHaveAttribute("aria-label", "Close navigation menu");
  } else {
    await expect(toggle).toBeHidden();
    await expect(page.locator("#navArea nav")).toBeVisible();
  }

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

  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#navArea")).not.toHaveClass(/open/);

  await pageBackLink.click();
  await page.waitForURL(/\/website\/information\.html$/);
  await expect(page.locator(".information-page")).toBeAttached();

  assertRuntimeClean(runtime, entry);
  await attachRuntimeObservations(testInfo, entry, runtime);
});

test("Yurayura language content switches at all seven viewport widths", async ({ page }, testInfo) => {
  test.skip(
    !fullAudit || testInfo.project.name !== "desktop-1440",
    "The complete seven-width language sequence runs in full-audit mode and is checked once."
  );
  // Twenty-one viewport/language states need headroom when the suite runs in parallel.
  testInfo.setTimeout(60000);

  const entry = { key: "yurayura-language-seven-widths" };
  const runtime = createRuntimeMonitor(page, entry);
  await prepareDeterministicNetwork(page);
  await page.addInitScript(() => {
    localStorage.setItem("selectedLang", "ja");
    localStorage.setItem("lang", "ja");
  });

  const response = await page.goto("exhibitions/yurayura/", { waitUntil: "domcontentloaded" });
  expect(response.status()).toBe(200);
  await expect(page.locator("#header-container header")).toBeAttached();
  await expect(page.locator("#footer-container footer")).toBeAttached();

  const localizedHeadings = [
    "#exhibition-title",
    "#detail-title",
    "#concept-title",
    "#project-title",
    "#artists-title",
    "#view-title",
    "#future-title",
    "#links-title"
  ];
  const viewportWidths = [1440, 1280, 1024, 768, 430, 390, 375];

  const assertLanguage = async language => {
    const state = await page.evaluate(({ language, headingSelectors }) => {
      const otherLanguage = language === "ja" ? "en" : "ja";
      const isVisible = element => Boolean(
        element.getClientRects().length && getComputedStyle(element).visibility !== "hidden"
      );
      const headingStates = headingSelectors.map(selector => {
        const heading = document.querySelector(selector);
        return {
          selectedVisible: isVisible(heading.querySelector('[lang="' + language + '"]')),
          otherVisible: isVisible(heading.querySelector('[lang="' + otherLanguage + '"]'))
        };
      });
      const lead = document.querySelector(".lead p");
      const localizedRowLabels = [...document.querySelectorAll('.history-table [role="rowheader"]')];
      const selectedRowLabels = localizedRowLabels.filter(row =>
        isVisible(row.querySelector('[lang="' + language + '"]'))
      ).length;
      const otherRowLabelsVisible = localizedRowLabels.some(row =>
        isVisible(row.querySelector('[lang="' + otherLanguage + '"]'))
      );
      const control = document.querySelector("#langChange");
      const rootOverflow = Math.max(
        document.documentElement.scrollWidth,
        document.body?.scrollWidth || 0
      ) - document.documentElement.clientWidth;

      return {
        mode: document.body.dataset.languageMode,
        rootLanguage: document.documentElement.lang,
        selectedRadio: document.querySelector('#langChange input[value="' + language + '"]')?.checked,
        controlVisible: isVisible(control),
        headings: headingStates,
        leadSelectedVisible: isVisible(lead.querySelector('[lang="' + language + '"]')),
        leadOtherVisible: isVisible(lead.querySelector('[lang="' + otherLanguage + '"]')),
        rowHeaderCount: localizedRowLabels.length,
        selectedRowLabels,
        otherRowLabelsVisible,
        artistNames: [...document.querySelectorAll(".artist-list p")].map(item => item.textContent.trim()),
        detailLinkSelectedVisible: isVisible(document.querySelector('a.detail-link [lang="' + language + '"]')),
        backLinkSelectedVisible: isVisible(document.querySelector('a.back-link [lang="' + language + '"]')),
        storedLanguage: localStorage.getItem("selectedLang"),
        compatibilityLanguage: localStorage.getItem("lang"),
        overflow: rootOverflow,
        mainText: document.querySelector("main").innerText
      };
    }, { language, headingSelectors: localizedHeadings });

    expect(state.mode).toBe("switchable");
    expect(state.rootLanguage).toBe(language);
    expect(state.selectedRadio).toBe(true);
    expect(state.controlVisible).toBe(true);
    expect(state.headings).toEqual(localizedHeadings.map(() => ({
      selectedVisible: true,
      otherVisible: false
    })));
    expect(state.leadSelectedVisible).toBe(true);
    expect(state.leadOtherVisible).toBe(false);
    expect(state.rowHeaderCount).toBe(6);
    expect(state.selectedRowLabels).toBe(6);
    expect(state.otherRowLabelsVisible).toBe(false);
    expect(state.artistNames).toEqual(["Mizuki", "かおる", "咲", "クリカン"]);
    expect(state.detailLinkSelectedVisible).toBe(true);
    expect(state.backLinkSelectedVisible).toBe(true);
    expect(state.storedLanguage).toBe(language);
    expect(state.compatibilityLanguage).toBe(language);
    expect(state.overflow, "Yurayura has horizontal overflow in " + language).toBeLessThanOrEqual(2);
    expect(state.mainText).toContain(language === "ja" ? "2026年10月6日 — 10月12日" : "October 6–12, 2026");
  };

  for (const width of viewportWidths) {
    await page.setViewportSize({ width, height: 900 });
    await assertLanguage("ja");
    await page.locator('#langChange label[for="langEn"]').click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await assertLanguage("en");
    await page.locator('#langChange label[for="langJa"]').click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await assertLanguage("ja");
  }

  const event = await page.locator('script[type="application/ld+json"]').evaluate(script => JSON.parse(script.textContent));
  expect(event).toEqual({
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": "https://mizukioyama.github.io/website/exhibitions/yurayura/#event",
    "url": "https://mizukioyama.github.io/website/exhibitions/yurayura/",
    "name": "グループ展「ゆらゆら」",
    "description": "小山瑞樹が企画・主催するグループ展「ゆらゆら」。",
    "startDate": "2026-10-06",
    "endDate": "2026-10-12",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "organizer": {
      "@type": "Person",
      "@id": "https://mizukioyama.github.io/website/#person",
      "name": "小山瑞樹",
      "alternateName": "Mizuki Oyama",
      "jobTitle": "Abstract Artist"
    }
  });

  assertRuntimeClean(runtime, entry);
  await attachRuntimeObservations(testInfo, entry, runtime);
});

test("H1 subtitles stay Japanese then English across seven viewport widths", async ({ page }, testInfo) => {
  test.skip(
    !fullAudit || testInfo.project.name !== "desktop-1440",
    "The complete seven-width subtitle matrix runs once in full-audit mode."
  );
  testInfo.setTimeout(90000);

  const entry = { key: "h1-subtitle-seven-widths" };
  const runtime = createRuntimeMonitor(page, entry);
  await prepareDeterministicNetwork(page);
  await page.addInitScript(() => {
    localStorage.setItem("selectedLang", "ja");
    localStorage.setItem("lang", "ja");
  });

  const subtitlePages = pages.filter(item => item.subtitle);
  const localizedBodyPages = new Set(["information", "order", "policy", "yurayura"]);
  const viewports = [
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
    { width: 1024, height: 900 },
    { width: 768, height: 1024 },
    { width: 430, height: 932 },
    { width: 390, height: 844 },
    { width: 375, height: 812 }
  ];

  for (const pageEntry of subtitlePages) {
    const response = await page.goto(pageEntry.path, { waitUntil: "domcontentloaded" });
    expect(response.status(), pageEntry.key + " should load").toBe(200);

    for (const viewport of viewports) {
      const { width } = viewport;
      await page.setViewportSize(viewport);

      const languages = pageEntry.subtitle.mode === "switchable"
        ? ["ja", "en", "ja"]
        : ["ja"];

      for (const language of languages) {
        if (pageEntry.subtitle.mode === "switchable") {
          const currentLanguage = await page.locator("html").getAttribute("lang");
          if (currentLanguage !== language) {
            const labelFor = language === "ja" ? "langJa" : "langEn";
            await page.locator('#langChange label[for="' + labelFor + '"]').click();
            await expect(page.locator("html")).toHaveAttribute("lang", language);
          }
        }

        await assertH1Subtitle(page, pageEntry, pageEntry.key + " at " + width + "px (" + language + ")");
        if (pageEntry.subtitle.mode === "switchable" && localizedBodyPages.has(pageEntry.key)) {
          await assertSwitchableBodyLanguage(page, language, pageEntry.key + " at " + width + "px");
        }

        const overflow = await page.evaluate(() => Math.max(
          document.documentElement.scrollWidth,
          document.body?.scrollWidth || 0
        ) - document.documentElement.clientWidth);
        expect(overflow, pageEntry.key + " horizontal overflow at " + width + "px")
          .toBeLessThanOrEqual(2);
      }
    }
  }

  assertRuntimeClean(runtime, entry);
  await attachRuntimeObservations(testInfo, entry, runtime);
});

test("Order pricing and cancellation policy stay complete in both languages", async ({ page }, testInfo) => {
  test.skip(
    fullAudit && testInfo.project.name !== "desktop-1440",
    "The complete seven-width pricing and policy sequence runs once in full-audit mode."
  );
  testInfo.setTimeout(90000);

  const entry = { key: "order-pricing-policy-language" };
  const runtime = createRuntimeMonitor(page, entry);
  await prepareDeterministicNetwork(page);
  await page.addInitScript(() => {
    // Match the existing visual fixtures: keep the actual scramble, but make
    // its random frame schedule reproducible while verifying pricing/copy.
    Math.random = () => 0.42;
    localStorage.setItem("selectedLang", "ja");
    localStorage.setItem("lang", "ja");
  });

  const pagesToVerify = [
    { key: "order", path: "order.html", assertContent: assertOrderPricingContent },
    { key: "policy", path: "policy.html", assertContent: assertOrderCancellationPolicy }
  ];
  const viewports = fullAudit
    ? [
        { width: 1440, height: 900 },
        { width: 1280, height: 800 },
        { width: 1024, height: 900 },
        { width: 768, height: 1024 },
        { width: 430, height: 932 },
        { width: 390, height: 844 },
        { width: 375, height: 812 }
      ]
    : [testInfo.project.use.viewport];

  for (const pageEntry of pagesToVerify) {
    const response = await page.goto(pageEntry.path, { waitUntil: "domcontentloaded" });
    expect(response.status(), pageEntry.key + " should load").toBe(200);
    await stabilize(page, pageEntry);

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      for (const language of ["ja", "en", "ja"]) {
        const currentLanguage = await page.locator("html").getAttribute("lang");
        if (currentLanguage !== language) {
          const labelFor = language === "ja" ? "langJa" : "langEn";
          await page.locator('#langChange label[for="' + labelFor + '"]').click();
          await expect(page.locator("html")).toHaveAttribute("lang", language);
        }

        const label = pageEntry.key + " at " + viewport.width + "px (" + language + ")";
        await expect(page.locator('#langChange input[value="' + language + '"]')).toBeChecked();
        await assertSwitchableBodyLanguage(page, language, label);
        await pageEntry.assertContent(page, language, label);

        const overflow = await page.evaluate(() => Math.max(
          document.documentElement.scrollWidth,
          document.body?.scrollWidth || 0
        ) - document.documentElement.clientWidth);
        expect(overflow, label + " has horizontal overflow").toBe(0);
      }
    }
  }

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
    if (page.viewportSize().width >= 1024) {
      await expect(toggle).toBeHidden();
      await expect(page.locator("#navArea nav")).toBeVisible();
      return;
    }
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(page.locator("#navArea")).toHaveClass(/open/);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  };

  await visitHome();
  await openMenu();

  const expectedMenuPaths = {
    "Top": "/website/",
    "Art Index": "/website/gallery.html",
    "Artist Statement": "/website/artist-statement.html",
    "Biography": "/website/biography.html",
    "Contact": "/website/contact.html",
    "Order": "/website/order.html"
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

  // Secondary routes remain reachable from the Gallery Footer.
  const informationLink = page
    .locator("#footer-container")
    .getByRole("link", { name: "Information", exact: true })
    .first();
  await Promise.all([
    page.waitForURL(/\/website\/information\.html$/),
    informationLink.click()
  ]);
  await expect(page.locator(".information-page")).toBeAttached();

  const exhibitionDetail = page.locator(
    'a.info-link[lang="ja"][href="exhibitions/yurayura/"]'
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

  // The exhibition Footer retains Policy without duplicating the primary menu.
  const policyLink = page
    .locator("#footer-container")
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

test("Header menu follows saved language and hides language controls while open", async ({ page }, testInfo) => {
  test.skip(page.viewportSize().width >= 1024, "The exhibition overlay is a mobile/tablet menu; desktop navigation is covered independently.");
  const entry = { key: "header-menu-language" };
  const runtime = createRuntimeMonitor(page, entry);
  await prepareDeterministicNetwork(page);

  await page.addInitScript(() => {
    localStorage.setItem("selectedLang", "en");
    localStorage.setItem("lang", "en");
  });

  const languageControl = page.locator("#langChange");
  const menu = page.locator("#navArea");
  const toggle = page.locator("#navArea .toggle_btn");
  const japanesePanel = page.locator("#navArea .menu_ja-txt");
  const englishPanel = page.locator("#navArea .menu_en-txt");

  const assertMenuLanguage = async (language, bilingual, label) => {
    await toggle.click();
    await expect(menu).toHaveClass(/open/);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#navArea #mask > hr.menu_ber"), label + " language panel separator should be absent").toHaveCount(0);
    await expect(japanesePanel.locator("ul > hr.menu_ber"), label + " Japanese exhibition/awards separator should remain").toHaveCount(1);
    await expect(englishPanel.locator("ul > hr"), label + " English exhibition/awards separator should remain").toHaveCount(1);
    await expect(languageControl, label + " language UI should be hidden while menu is open").toBeHidden();
    await expect(languageControl).toHaveAttribute("hidden", "");
    await expect(languageControl).toHaveAttribute("aria-hidden", "true");
    await expect(languageControl).toHaveAttribute("inert", "");

    if (language === "ja") {
      await expect(japanesePanel, label + " Japanese exhibition information should be visible").toBeVisible();
      await expect(englishPanel, label + " English exhibition information should be hidden").toBeHidden();
      await expect(japanesePanel).not.toHaveAttribute("aria-hidden", "true");
      await expect(englishPanel).toHaveAttribute("aria-hidden", "true");
    } else {
      await expect(englishPanel, label + " English exhibition information should be visible").toBeVisible();
      await expect(japanesePanel, label + " Japanese exhibition information should be hidden").toBeHidden();
      await expect(englishPanel).not.toHaveAttribute("aria-hidden", "true");
      await expect(japanesePanel).toHaveAttribute("aria-hidden", "true");
    }

    const overflow = await page.evaluate(() => Math.max(
      document.documentElement.scrollWidth,
      document.body?.scrollWidth || 0
    ) - document.documentElement.clientWidth);
    expect(overflow, label + " menu has horizontal overflow").toBeLessThanOrEqual(2);

    await toggle.click();
    await expect(menu).not.toHaveClass(/open/);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    if (bilingual) {
      await expect(languageControl, label + " bilingual page should keep language UI hidden after close").toBeHidden();
    } else {
      await expect(languageControl, label + " switchable page should restore language UI after close").toBeVisible();
      await expect(languageControl).not.toHaveAttribute("aria-hidden", "true");
      await expect(languageControl).not.toHaveAttribute("inert", "");
    }
  };

  const galleryResponse = await page.goto("gallery.html", { waitUntil: "domcontentloaded" });
  expect(galleryResponse.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('#langChange input[value="en"]')).toBeChecked();
  await assertMenuLanguage("en", false, "Gallery with saved English");

  await page.locator('#langChange label[for="langJa"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(japanesePanel).not.toHaveAttribute("hidden", "");
  await expect(englishPanel).toHaveAttribute("hidden", "");
  await assertMenuLanguage("ja", false, "Gallery after immediate Japanese switch");

  await page.locator('#langChange label[for="langEn"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('#langChange input[value="en"]')).toBeChecked();
  await assertMenuLanguage("en", false, "Gallery after English reload");

  const biographyResponse = await page.goto("biography.html", { waitUntil: "domcontentloaded" });
  expect(biographyResponse.status()).toBe(200);
  await expect(page.locator("body")).toHaveAttribute("data-language-mode", "bilingual");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(languageControl).toBeHidden();
  await expect.poll(() => page.evaluate(() => [
    localStorage.getItem("selectedLang"),
    localStorage.getItem("lang")
  ])).toEqual(["en", "en"]);
  await assertH1Subtitle(page, pages.find(item => item.path === "biography.html"), "Biography with saved English");
  await assertMenuLanguage("en", true, "Biography with saved English");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect.poll(() => page.evaluate(() => [
    localStorage.getItem("selectedLang"),
    localStorage.getItem("lang")
  ])).toEqual(["en", "en"]);

  assertRuntimeClean(runtime, entry);
  await attachRuntimeObservations(testInfo, entry, runtime);
});

async function verifyOrganicFlowShowcaseReload(page, pagePath) {
  await prepareDeterministicNetwork(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });

  const waitForFirstFrame = async () => {
    await expect.poll(() => page.evaluate(() => {
      const state = window.__organicFlowProduction?.getState?.();
      return state?.engine?.frameCount ?? 0;
    }), {
      message: "Organic Flow should render its first frame after the document becomes interactive",
      timeout: 10000
    }).toBeGreaterThan(0);
  };

  const firstResponse = await page.goto(pagePath, { waitUntil: "domcontentloaded" });
  expect(firstResponse.status()).toBe(200);
  await waitForFirstFrame();
  const first = await page.evaluate(() => window.__organicFlowProduction.getState());
  expect(first.status).toBe("active");
  expect(["contour", "ribbons", "currents", "atmosphere", "hybrid-random"]).toContain(first.variant);
  expect(first.lastVariant).toBe(first.variant);
  expect(first.canvasCount).toBe(1);
  expect(first.engine.rafActive).toBe(true);
  expect(first.engine.frameCount).toBeGreaterThan(0);
  expect(page.url()).toContain(pagePath);
  if (first.variant === "hybrid-random") {
    expect(Object.values(first.hybridContributions).reduce((sum, value) => sum + value, 0)).toBe(100);
  }

  await page.setViewportSize({ width: 1280, height: 800 });
  const resized = await page.evaluate(() => window.__organicFlowProduction.getState());
  expect(resized.variant).toBe(first.variant);
  expect(resized.canvasCount).toBe(1);

  const reloadResponse = await page.reload({ waitUntil: "domcontentloaded" });
  expect(reloadResponse.status()).toBe(200);
  await waitForFirstFrame();
  const reloaded = await page.evaluate(() => window.__organicFlowProduction.getState());
  expect(page.url()).toContain(pagePath);
  expect(reloaded.status).toBe("active");
  expect(reloaded.variant).not.toBe(first.variant);
  expect(reloaded.lastVariant).toBe(reloaded.variant);
  expect(reloaded.canvasCount).toBe(1);
  expect(reloaded.engine.rafActive).toBe(true);
  if (reloaded.variant === "hybrid-random") {
    expect(Object.values(reloaded.hybridContributions).reduce((sum, value) => sum + value, 0), "Hybrid Random weights should sum to 100").toBe(100);
  }

  const localSettingsKeys = await page.evaluate(() => Object.keys(localStorage).sort());
  expect(localSettingsKeys.some(key => /organic.?flow/i.test(key))).toBe(false);
}

for (const pagePath of ["biography.html", "artist-statement.html"]) {
  test("Organic Flow Showcase Random reloads " + pagePath + " without repeat or resize reroll", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-1440",
      "Organic Flow selection lifecycle is checked once per normal run."
    );
    test.setTimeout(90000);
    await verifyOrganicFlowShowcaseReload(page, pagePath);
  });
}

test("Selected Ink Field initializes on all nine production routes", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "Background initialization is audited once per normal run."
  );

  const runtime = createRuntimeMonitor(page);
  await prepareDeterministicNetwork(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });

  let previousOrganicVariant = null;
  for (const entry of pages.filter(item => item.key !== "404")) {
    const rippleRequestCountBeforeRoute = runtime.rippleAssetRequests.length;
    const response = await page.goto(entry.path, { waitUntil: "domcontentloaded" });
    expect(response.status(), entry.key + " should return HTTP 200").toBe(200);
    await page.waitForLoadState("load");
    await expect(page.locator("html"), entry.key + " should enable Selected Ink Field mode")
      .toHaveClass(/selected-ink-field-mode/);
    await expect.poll(
      () => page.evaluate(() => Boolean(
        window.__selectedInkField &&
        window.__selectedInkField.getState().frameCount > 0
      )),
      { message: entry.key + " should render at least one Ink Field frame" }
    ).toBe(true);

    const state = await page.evaluate(() => {
      const engine = window.__selectedInkField;
      const canvas = document.querySelector("#selected-ink-field-canvas");
      const trunk = document.querySelector("#vanta-bg-bio");
      const overlay = document.querySelector("#portfolio-overlay-animation");
      const overlayStyle = overlay ? getComputedStyle(overlay) : null;
      const content = document.querySelector("main");
      return {
        mode: window.__PORTFOLIO_BACKGROUND_SYSTEM__,
        canvasCount: document.querySelectorAll("#selected-ink-field-canvas").length,
        canvasWidth: canvas?.width || 0,
        canvasHeight: canvas?.height || 0,
        trunkCanvasCount: document.querySelectorAll("#vanta-bg-bio canvas").length,
        overlayDomCount: document.querySelectorAll("#portfolio-overlay-animation").length,
        overlayStylesheetCount: Array.from(document.styleSheets).filter(sheet =>
          sheet.href && new URL(sheet.href).pathname.endsWith("/css/background-overlay.css")
        ).length,
        overlay: overlay && trunk ? {
          position: overlayStyle.position,
          zIndex: overlayStyle.zIndex,
          pointerEvents: overlayStyle.pointerEvents,
          ariaHidden: overlay.getAttribute("aria-hidden"),
          childElementCount: overlay.childElementCount,
          appearsAfterTrunk: Boolean(trunk.compareDocumentPosition(overlay) & Node.DOCUMENT_POSITION_FOLLOWING),
          selectedInkZIndex: canvas ? getComputedStyle(canvas).zIndex : null,
          trunkZIndex: getComputedStyle(trunk).zIndex,
          contentZIndex: content ? getComputedStyle(content).zIndex : null,
          width: overlay.getBoundingClientRect().width,
          height: overlay.getBoundingClientRect().height
        } : null,
        rippleDomCount: document.querySelectorAll(".ripples").length,
        rippleCanvasCount: document.querySelectorAll(".ripples canvas").length,
        rippleScriptCount: Array.from(document.scripts).filter(script =>
          /(?:jquery\.ripples-min\.js|bg_wave\.js)(?:[?#]|$)/.test(script.src)
        ).length,
        fogCanvasCount: document.querySelectorAll("#vanta-bg canvas").length,
        organicCanvasCount: document.querySelectorAll("#portfolio-overlay-animation .organic-flow-canvas").length,
        organic: window.__organicFlowProduction ? window.__organicFlowProduction.getState() : null,
        trunkInstanceActive: Boolean(
          window.__PORTFOLIO_BACKGROUND_ACCENTS__ &&
          window.__PORTFOLIO_BACKGROUND_ACCENTS__.getTrunkSphereInstance()
        ),
        engine: engine ? engine.getState() : null
      };
    });

    expect(state.mode, entry.key + " background engine").toBe("selectedInkField");
    expect(state.canvasCount, entry.key + " Selected Ink Field canvas count").toBe(1);
    expect(state.canvasWidth, entry.key + " canvas width").toBeGreaterThan(0);
    expect(state.canvasHeight, entry.key + " canvas height").toBeGreaterThan(0);
    const trunkExpected = entry.key !== "home";
    expect(state.organicCanvasCount, entry.key + " Organic Flow canvas count").toBe(trunkExpected ? 1 : 0);
    expect(state.trunkCanvasCount, entry.key + " TRUNK canvas count").toBe(trunkExpected ? 1 : 0);
    expect(state.overlayDomCount, entry.key + " overlay layer count").toBe(trunkExpected ? 1 : 0);
    expect(state.overlayStylesheetCount, entry.key + " overlay stylesheet count").toBe(trunkExpected ? 1 : 0);
    if (trunkExpected) {
      expect(state.overlay, entry.key + " overlay should sit above TRUNK and below page content").toEqual({
        position: "fixed",
        zIndex: "5",
        pointerEvents: "none",
        ariaHidden: "true",
        childElementCount: 1,
        appearsAfterTrunk: true,
        selectedInkZIndex: "-1",
        trunkZIndex: "0",
        contentZIndex: "10",
        width: 1440,
        height: 900
      });
      expect(state.organic.status, entry.key + " Organic Flow runtime status").toBe("active");
      expect(state.organic.lastVariant, entry.key + " persisted Showcase Random selection")
        .toBe(state.organic.variant);
      expect(["contour", "ribbons", "currents", "atmosphere", "hybrid-random"])
        .toContain(state.organic.variant);
      expect(state.organic.engine.rafActive, entry.key + " should have one Organic Flow RAF loop").toBe(true);
      expect(state.organic.engine.frameCount, entry.key + " should render Organic Flow frames").toBeGreaterThan(0);
      if (previousOrganicVariant) {
        expect(state.organic.variant, entry.key + " should not repeat the prior route selection")
          .not.toBe(previousOrganicVariant);
      }
      previousOrganicVariant = state.organic.variant;
      if (state.organic.variant === "hybrid-random") {
        expect(Object.values(state.organic.hybridContributions).reduce((sum, value) => sum + value, 0)).toBe(100);
      }
    } else {
      expect(state.overlay, entry.key + " should not receive the initial overlay layer").toBeNull();
    }
    expect(state.rippleDomCount, entry.key + " Ripple DOM count").toBe(0);
    expect(state.rippleCanvasCount, entry.key + " Ripple canvas count").toBe(0);
    expect(state.rippleScriptCount, entry.key + " Ripple script element count").toBe(0);
    expect(runtime.rippleAssetRequests.length, entry.key + " Ripple asset request count")
      .toBe(rippleRequestCountBeforeRoute);
    expect(state.fogCanvasCount, entry.key + " VANTA.FOG canvas count").toBe(0);
    expect(state.trunkInstanceActive, entry.key + " TRUNK instance").toBe(trunkExpected);
    expect(state.engine.legacyCanvasCount, entry.key + " disabled legacy canvas count").toBe(0);
    expect(state.engine.trunkCanvasCount, entry.key + " engine TRUNK canvas count").toBe(trunkExpected ? 1 : 0);
    if (trunkExpected) {
      const repeatedMount = await page.evaluate(() => {
        const accents = window.__PORTFOLIO_BACKGROUND_ACCENTS__;
        const current = accents.getTrunkSphereInstance();
        const returned = accents.mountTrunkSphere();
        return { canvasCount: document.querySelectorAll("#vanta-bg-bio canvas").length, sameInstance: current === returned };
      });
      expect(repeatedMount).toEqual({ canvasCount: 1, sameInstance: true });
    }
    expect(state.engine.frameCount, entry.key + " animation frame count").toBeGreaterThan(0);
    expect(state.engine.webglErrors, entry.key + " WebGL errors").toEqual([]);
    assertRuntimeClean(runtime, entry);
  }

  expect(runtime.rippleAssetRequests, "Ripple production assets should never be requested")
    .toEqual([]);
  await attachRuntimeObservations(testInfo, { key: "selected-ink-field" }, runtime);
});

test("Background overlay layer remains full viewport and non-interactive at all seven widths", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "The overlay viewport geometry is audited once per normal run."
  );
  test.setTimeout(180000);

  const runtime = createRuntimeMonitor(page);
  await prepareDeterministicNetwork(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });

  const viewports = [
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
    { width: 1024, height: 900 },
    { width: 768, height: 1024 },
    { width: 430, height: 932 },
    { width: 390, height: 844 },
    { width: 375, height: 812 }
  ];
  const overlayPages = pages.filter(item => ["biography", "artist-statement"].includes(item.key));

  for (const entry of overlayPages) {
    await page.setViewportSize(viewports[0]);
    const initialResponse = await page.goto(entry.path, { waitUntil: "domcontentloaded" });
    expect(initialResponse.status(), entry.key + " should return HTTP 200").toBe(200);
    await expect(page.locator("#selected-ink-field-canvas"), entry.key + " Selected Ink canvas should mount")
      .toBeAttached();
    await expect(page.locator("#vanta-bg-bio canvas"), entry.key + " TRUNK canvas should mount")
      .toBeAttached();
    await expect(page.locator("#portfolio-overlay-animation .organic-flow-canvas"), entry.key + " Organic Flow canvas should mount")
      .toBeAttached();

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect.poll(() => page.evaluate(() => {
        const overlay = document.querySelector("#portfolio-overlay-animation");
        if (!overlay) return null;
        const rect = overlay.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      })).toEqual({ width: viewport.width, height: viewport.height });

      const rippleRequestCountBeforeRoute = runtime.rippleAssetRequests.length;

      const layer = await page.evaluate(() => {
        const canvas = document.querySelector("#selected-ink-field-canvas");
        const trunk = document.querySelector("#vanta-bg-bio");
        const overlay = document.querySelector("#portfolio-overlay-animation");
        const content = document.querySelector("main#state");
        const rect = overlay.getBoundingClientRect();
        return {
          selectedInkCanvasCount: document.querySelectorAll("#selected-ink-field-canvas").length,
          trunkCanvasCount: document.querySelectorAll("#vanta-bg-bio canvas").length,
          overlayCount: document.querySelectorAll("#portfolio-overlay-animation").length,
          overlay: {
            position: getComputedStyle(overlay).position,
            zIndex: getComputedStyle(overlay).zIndex,
            pointerEvents: getComputedStyle(overlay).pointerEvents,
            ariaHidden: overlay.getAttribute("aria-hidden"),
            childElementCount: overlay.childElementCount,
            appearsAfterTrunk: Boolean(trunk.compareDocumentPosition(overlay) & Node.DOCUMENT_POSITION_FOLLOWING),
            selectedInkZIndex: getComputedStyle(canvas).zIndex,
            trunkZIndex: getComputedStyle(trunk).zIndex,
            contentZIndex: getComputedStyle(content).zIndex,
            organicCanvasCount: document.querySelectorAll("#portfolio-overlay-animation .organic-flow-canvas").length,
            width: rect.width,
            height: rect.height
          },
          rippleDomCount: document.querySelectorAll(".ripples").length
        };
      });

      expect(layer.selectedInkCanvasCount, entry.key + " Selected Ink canvas count").toBe(1);
      expect(layer.trunkCanvasCount, entry.key + " TRUNK canvas count").toBe(1);
      expect(layer.overlayCount, entry.key + " overlay count").toBe(1);
      expect(layer.overlay, entry.key + " layer order at " + viewport.width + "px").toEqual({
        position: "fixed",
        zIndex: "5",
        pointerEvents: "none",
        ariaHidden: "true",
        childElementCount: 1,
        appearsAfterTrunk: true,
        selectedInkZIndex: "-1",
        trunkZIndex: "0",
        contentZIndex: "10",
        organicCanvasCount: 1,
        width: viewport.width,
        height: viewport.height
      });
      expect(layer.rippleDomCount, entry.key + " Ripple DOM count").toBe(0);
      expect(runtime.rippleAssetRequests.length, entry.key + " Ripple request count")
        .toBe(rippleRequestCountBeforeRoute);
      assertRuntimeClean(runtime, entry);
    }
  }

  expect(runtime.rippleAssetRequests, "Ripple assets should not be requested at any viewport")
    .toEqual([]);
  await attachRuntimeObservations(testInfo, { key: "background-overlay-seven-viewports" }, runtime);
});


test("VANTA.TRUNK accent respects reduced motion and motion preference changes", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "Reduced-motion background lifecycle is checked once per normal run."
  );
  test.setTimeout(120000);

  await prepareDeterministicNetwork(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const biographyResponse = await page.goto("biography.html", { waitUntil: "domcontentloaded" });
  expect(biographyResponse.status()).toBe(200);
  await page.waitForLoadState("load");
  expect(await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  await expect(page.locator("#selected-ink-field-canvas")).toBeAttached();
  const reducedSelectedInk = await page.evaluate(() => window.__selectedInkField.getState());
  expect(reducedSelectedInk.reducedMotion).toBe(true);
  expect(reducedSelectedInk.canvasCount).toBe(1);
  await expect.poll(() => page.locator("#vanta-bg-bio canvas").count()).toBe(0);
  await expect.poll(() => page.locator("#portfolio-overlay-animation .organic-flow-canvas").count()).toBe(1);
  const reducedOrganic = await page.evaluate(() => window.__organicFlowProduction.getState());
  expect(reducedOrganic.status).toBe("active");
  expect(reducedOrganic.engine.reducedMotion).toBe(true);
  expect(reducedOrganic.engine.rafActive).toBe(false);
  expect(reducedOrganic.engine.frameCount).toBe(0);
  expect(await page.evaluate(() => window.__PORTFOLIO_BACKGROUND_ACCENTS__
    .getTrunkSphereInstance())).toBeNull();

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(() => page.locator("#vanta-bg-bio canvas").count(), { timeout: 20000 }).toBe(1);
  await expect.poll(() => page.evaluate(() => window.__organicFlowProduction.getState().engine.frameCount), { timeout: 20000 }).toBeGreaterThan(0);
  const resumedOrganic = await page.evaluate(() => window.__organicFlowProduction.getState());
  expect(resumedOrganic.canvasCount).toBe(1);
  expect(resumedOrganic.engine.rafActive).toBe(true);
  await expect.poll(() => page.evaluate(() => window.__selectedInkField.getState().frameCount), { timeout: 20000 }).toBeGreaterThan(0);
  expect(await page.evaluate(() => Boolean(window.__PORTFOLIO_BACKGROUND_ACCENTS__
    .getTrunkSphereInstance()))).toBe(true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.locator("#vanta-bg-bio canvas").count(), { timeout: 20000 }).toBe(0);
  const pausedOrganic = await page.evaluate(() => window.__organicFlowProduction.getState());
  expect(pausedOrganic.canvasCount).toBe(1);
  expect(pausedOrganic.engine.rafActive).toBe(false);
  await page.waitForTimeout(120);
  expect((await page.evaluate(() => window.__organicFlowProduction.getState())).engine.frameCount)
    .toBe(pausedOrganic.engine.frameCount);
  expect(await page.evaluate(() => window.__PORTFOLIO_BACKGROUND_ACCENTS__
    .getTrunkSphereInstance())).toBeNull();

  const statementResponse = await page.goto("artist-statement.html", { waitUntil: "domcontentloaded" });
  expect(statementResponse.status()).toBe(200);
  await page.waitForLoadState("load");
  const statementMotionState = await page.evaluate(() => ({
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    trunkCanvasCount: document.querySelectorAll("#vanta-bg-bio canvas").length,
    trunkInstanceActive: Boolean(window.__PORTFOLIO_BACKGROUND_ACCENTS__
      .getTrunkSphereInstance()),
    organicReducedMotion: window.__organicFlowProduction.getState().engine.reducedMotion,
    organicRafActive: window.__organicFlowProduction.getState().engine.rafActive
  }));
  expect(statementMotionState).toEqual({
    reducedMotion: true,
    trunkCanvasCount: 0,
    trunkInstanceActive: false,
    organicReducedMotion: true,
    organicRafActive: false
  });

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(() => page.evaluate(() => (
    document.querySelectorAll("#vanta-bg-bio canvas").length === 1 &&
    window.__organicFlowProduction.getState().engine.frameCount > 0
  )), { timeout: 20000 }).toBe(true);
  const statementMotionResumed = await page.evaluate(() => ({
    reducedMotion: window.__organicFlowProduction.getState().engine.reducedMotion,
    rafActive: window.__organicFlowProduction.getState().engine.rafActive,
    frameCount: window.__organicFlowProduction.getState().engine.frameCount
  }));
  expect(statementMotionResumed.reducedMotion).toBe(false);
  expect(statementMotionResumed.rafActive).toBe(true);
  expect(statementMotionResumed.frameCount).toBeGreaterThan(0);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.locator("#vanta-bg-bio canvas").count(), { timeout: 20000 }).toBe(0);
  const statementMotionPaused = await page.evaluate(() => window.__organicFlowProduction.getState().engine);
  expect(statementMotionPaused.reducedMotion).toBe(true);
  expect(statementMotionPaused.rafActive).toBe(false);
});
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




test("portfolio copy candidate preserves approved content", async ({ page }, testInfo) => {
  const normalize = value => value.replace(/\s+/g, " ").trim();
  const expectUniqueParagraphs = async locator => {
    const paragraphs = (await locator.allTextContents()).map(normalize);
    expect(new Set(paragraphs).size, "approved paragraphs should not be duplicated").toBe(paragraphs.length);
  };
  await page.goto("", { waitUntil: "domcontentloaded" });
  await completeHomeEntry(page);
  await expect(page.locator("#mainContent .content__slide.active h1")).toHaveText("Mizuki Oyama");
  expect(normalize(await page.locator('#mainContent .content__slide.active .desc[lang="ja"]').textContent()))
    .toBe("抽象アーティスト 1998 — Japan");
  expect(normalize(await page.locator('#mainContent .content__slide.active .desc[lang="en"]').textContent()))
    .toBe("Abstract Artist 1998 — Japan");
  const enter = page.locator("#mainContent .content__slide.active .button-wrap a.button");
  await expect(enter).toHaveText("View");
  await expect(enter).toHaveAttribute("href", "/website/gallery.html");
  await enter.click();
  await expect(page).toHaveURL(/\/website\/gallery\.html$/);

  await page.goto("biography.html", { waitUntil: "domcontentloaded" });
  const biographyJapanese = page.locator("main .work > p.state-txt");
  const biographyEnglish = page.locator('main .work > p.text[lang="en"]');
  await expect(biographyJapanese).toHaveCount(35);
  await expect(biographyEnglish).toHaveCount(35);
  await expectUniqueParagraphs(biographyJapanese);
  await expectUniqueParagraphs(biographyEnglish);
  await expect(biographyJapanese.first()).toHaveText("抽象アーティスト。1998年、宮城県仙台市生まれ。");
  await expect(biographyEnglish.first()).toHaveText("Mizuki Oyama is an abstract artist born in 1998 in Sendai, Miyagi Prefecture, Japan.");
  await expect(biographyJapanese.last()).toContainText("幼い頃から続けてきた「つくる」という行為を起点に");
  await expect(biographyEnglish.last()).toContainText("shape both his own expression and the environment around it.");
  await expect(page.locator("main .portfolio-history-table").first()).toBeAttached();

  await page.goto("artist-statement.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('main .h1-text .subtext [lang="ja"]')).toContainText("揺らぎ、感覚、記憶");
  await expect(page.locator('main .h1-text .subtext [lang="en"]')).toContainText("Fluctuation, Sensation, Memory");
  await expect(page.locator("main .work > p.state-txt")).toHaveCount(7);
  await expect(page.locator("main .work > p.text")).toHaveCount(7);
  await expectUniqueParagraphs(page.locator("main .work > p.state-txt"));
  await expectUniqueParagraphs(page.locator("main .work > p.text"));
  await expect(page.locator("main .timeline > .timeline-item > p.timeline-title")).toHaveText([
    "01 なぜ抽象なのか",
    "02 何を表現しているのか",
    "03 どのように作るのか",
    "04 アートとは何か",
    "05 作品と鑑賞者"
  ]);
  await expect(page.locator("main .timeline-title-en")).toHaveText([
    "01 Why Abstraction",
    "02 What I Express",
    "03 How I Create",
    "04 What Art Means to Me",
    "05 The Work and the Viewer"
  ]);
  await expect(page.locator("main .timeline-item").first().locator(".timeline-copy > p").first())
    .toContainText("抽象には、ひとつの正解がない。");
  await expect(page.locator("main .timeline-item").last().locator(".timeline-copy > p.text"))
    .toContainText("I hope each viewer can receive it freely");
});

test("switchable pages preserve language through navigation and reload", async ({ page }, testInfo) => {
  test.skip(
    !["desktop-1440", "mobile-390"].includes(testInfo.project.name),
    "Switchable-page persistence is verified on representative desktop and mobile viewports."
  );
  const mobileAudit = testInfo.project.name === "mobile-390";
  // The desktop pass reloads every page and verifies the nested Yurayura round trip.
  testInfo.setTimeout(60000);

  const entry = { key: "switchable-language-persistence" };
  const runtime = createRuntimeMonitor(page, entry);
  await prepareDeterministicNetwork(page);
  await page.addInitScript(() => {
    if (localStorage.getItem("selectedLang") === null) {
      localStorage.setItem("selectedLang", "en");
      localStorage.setItem("lang", "en");
    }
  });

  const pagesToVerify = [
    { name: "Home", path: "", localizedContent: true },
    {
      name: "Gallery", path: "gallery.html", localizedContent: false,
      subtitle: { mode: "switchable", ja: "作品一覧", en: "Artworks", dataSubtitle: "作品一覧" }
    },
    {
      name: "Information", path: "information.html", localizedContent: true,
      subtitle: { mode: "switchable", ja: "活動・展示情報", en: "Exhibition Information" }
    },
    {
      name: "Order", path: "order.html", localizedContent: true,
      subtitle: { mode: "switchable", ja: "作品・制作のご依頼", en: "Works & Commissions", dataSubtitle: "作品・制作のご依頼" }
    },
    {
      name: "Policy", path: "policy.html", localizedContent: true,
      subtitle: { mode: "switchable", ja: "当Webサイト利用について", en: "Use of This Website", dataSubtitle: "当Webサイト利用について" }
    },
    {
      name: "Yurayura", path: "exhibitions/yurayura/", localizedContent: true,
      subtitle: { mode: "switchable", ja: "グループ展「ゆらゆら」", en: "Group Exhibition “Yurayura”" }
    }
  ];

  const assertSelectedLanguage = async (pageName, language, localizedContent, subtitle) => {
    await expect(page.locator("#langChange")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page.locator("#langChange input[value='" + language + "']")).toBeChecked();

    if (subtitle) {
      await assertH1Subtitle(page, { key: pageName, subtitle }, pageName);
    }
    if (!localizedContent) return;

    await assertSwitchableBodyLanguage(page, language, pageName);
    const metrics = await page.evaluate(() => ({
      overflow: Math.max(
        document.documentElement.scrollWidth,
        document.body?.scrollWidth || 0
      ) - document.documentElement.clientWidth
    }));
    expect(metrics.overflow, pageName + " has horizontal overflow in " + language).toBeLessThanOrEqual(2);
  };

  for (const entryPage of pagesToVerify) {
    const pageResponse = await page.goto(entryPage.path, { waitUntil: "domcontentloaded" });
    expect(pageResponse.status(), entryPage.name + " should load").toBe(200);
    await assertSelectedLanguage(entryPage.name, "en", entryPage.localizedContent, entryPage.subtitle);
    if (!mobileAudit) {
      await page.reload({ waitUntil: "domcontentloaded" });
      await assertSelectedLanguage(entryPage.name, "en", entryPage.localizedContent, entryPage.subtitle);
    }
  }

  if (mobileAudit) {
    await page.reload({ waitUntil: "domcontentloaded" });
    await assertSelectedLanguage("Yurayura mobile reload", "en", true, pagesToVerify[5].subtitle);
  } else {
    await page.locator('a.back-link [lang="en"]').click();
    await expect(page.locator(".information-page")).toBeAttached();
    await assertSelectedLanguage("Information after Yurayura", "en", true, pagesToVerify[2].subtitle);
    await page.reload({ waitUntil: "domcontentloaded" });
    await assertSelectedLanguage("Information after Yurayura reload", "en", true, pagesToVerify[2].subtitle);
    await page.locator('a.info-link[lang="en"][href="exhibitions/yurayura/"]').click();
    await expect(page).toHaveURL(/\/website\/exhibitions\/yurayura\/$/);
    await assertSelectedLanguage("Yurayura after Information", "en", true, pagesToVerify[5].subtitle);
  }

  if (!mobileAudit) {
    await page.locator('#langChange label[for="langJa"]').click();
    await assertSelectedLanguage("Yurayura", "ja", true, pagesToVerify[5].subtitle);
    await page.locator('#langChange label[for="langEn"]').click();
    await assertSelectedLanguage("Yurayura", "en", true, pagesToVerify[5].subtitle);
  }

  assertRuntimeClean(runtime, entry);
  await attachRuntimeObservations(testInfo, entry, runtime);
});


test("Biography, Artist Statement, and Contact stay bilingual while language preference persists", async ({ page }, testInfo) => {
  const entry = { key: "bilingual-pages-interaction" };
  const runtime = createRuntimeMonitor(page, entry);
  await prepareDeterministicNetwork(page);

  await page.addInitScript(() => {
    localStorage.setItem("selectedLang", "en");
    localStorage.setItem("lang", "en");
  });

  await page.goto("order.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('#langChange input[value="en"]')).toBeChecked();

  await page.goto("contact.html", { waitUntil: "domcontentloaded" });
  await assertContactBilingualPage(page, "Contact after Order");
  await assertH1Subtitle(page, pages.find(entry => entry.key === "contact"), "Contact after Order");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect.poll(() => page.evaluate(() => [
    localStorage.getItem("selectedLang"),
    localStorage.getItem("lang")
  ])).toEqual(["en", "en"]);

  await page.reload({ waitUntil: "domcontentloaded" });
  await assertContactBilingualPage(page, "Contact after reload");
  await assertH1Subtitle(page, pages.find(entry => entry.key === "contact"), "Contact after reload");
  await expect.poll(() => page.evaluate(() => [
    localStorage.getItem("selectedLang"),
    localStorage.getItem("lang")
  ])).toEqual(["en", "en"]);

  await page.goto("order.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('#langChange input[value="en"]')).toBeChecked();

  for (const path of ["biography.html", "artist-statement.html"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await assertBilingualPage(page, path);
    await assertH1Subtitle(page, pages.find(entry => entry.path === path), path);
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect.poll(() => page.evaluate(() => [
      localStorage.getItem("selectedLang"),
      localStorage.getItem("lang")
    ])).toEqual(["en", "en"]);
  }

  await page.goto("gallery.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('#langChange input[value="en"]')).toBeChecked();

  await page.goto("contact.html", { waitUntil: "domcontentloaded" });
  await assertContactBilingualPage(page, "Contact after returning from Gallery");
  await assertH1Subtitle(page, pages.find(entry => entry.key === "contact"), "Contact after returning from Gallery");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect.poll(() => page.evaluate(() => [
    localStorage.getItem("selectedLang"),
    localStorage.getItem("lang")
  ])).toEqual(["en", "en"]);

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

    const englishParagraph = page.locator("main .work > p.text").first();
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
        const flow = document.querySelector("main .timeline .timeline-copy > p.text");
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

  const metrics = await page.locator("#biography-records table").first().evaluate(table => {
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


test("PC headings use the same real Regular face instead of installed font substitution", async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1440', 'Actual-font audit runs once.');
  await prepareDeterministicNetwork(page);
  await page.emulateMedia({reducedMotion:'reduce'});
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  for (const route of ['gallery.html','biography.html','artist-statement.html','contact.html']) {
    await page.goto(route); await page.evaluate(() => document.fonts.ready);
    const title = page.locator('.h1-text h1');
    await expect(title).toHaveCSS('font-weight', '100');
    await expect(title).toHaveCSS('font-synthesis', 'none');
    const doc = await cdp.send('DOM.getDocument');
    const node = await cdp.send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'.h1-text h1'});
    const fonts = (await cdp.send('CSS.getPlatformFontsForNode',{nodeId:node.nodeId})).fonts;
    expect(fonts.some(font => font.isCustomFont && font.postScriptName === 'ShipporiMincho-Regular'), route).toBe(true);
  }
  await cdp.detach();
});

test("Custom cursor stays above reading dialogs without intercepting their close controls", async ({page},info) => {
  test.skip(info.project.name !== 'desktop-1440', 'Fine-pointer layering runs once; touch has a separate context audit.');
  await prepareDeterministicNetwork(page); await page.emulateMedia({reducedMotion:'reduce'});
  for (const route of ['gallery.html','contact.html']) {
    await page.goto(route);
    const opener = page.locator(route==='gallery.html'?'#gallery-container .view-policy-button':'.modal-open-label').first();
    await opener.click();
    const dialog = page.locator(route==='gallery.html'?'#modalBox':'.modal-box[role="dialog"]');
    await expect(dialog).toHaveCSS('opacity','1');
    const close = dialog.locator(route==='gallery.html'?'#modalCloseBtn':'.modal-close-label');
    const bounds = await close.boundingBox();
    await page.evaluate(() => window.addEventListener('mousemove', event => { window.__cursorActualMouse = {x:event.clientX,y:event.clientY}; }, {once:true}));
    await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);
    const actualMouse = await page.evaluate(() => window.__cursorActualMouse);
    const cursor = page.locator('#cursor'); await expect(cursor).toHaveCSS('opacity','1');
    await expect(cursor).toHaveCSS('pointer-events','none');
    expect(Number(await cursor.evaluate(e=>getComputedStyle(e).zIndex))).toBeGreaterThan(Number(await dialog.evaluate(e=>getComputedStyle(e).zIndex)));
    const center = await cursor.boundingBox();
    expect(center.x+center.width/2).toBeCloseTo(actualMouse.x,0);
    expect(center.y+center.height/2).toBeCloseTo(actualMouse.y,0);
    await close.click(); await expect(dialog).toBeHidden(); await expect(opener).toBeFocused();
  }
});

test('Home card layers retain the same measured golden ratio at all PC release widths', async ({page},info) => {
  test.skip(info.project.name !== 'desktop-1440', 'PC geometry audit runs once at all five widths.');
  await prepareDeterministicNetwork(page);
  await page.goto('');
  for (const width of [1920,1600,1440,1280,1024]) {
    await page.setViewportSize({width,height:900});
    const ratios=await page.evaluate(()=>{
      const rect=e=>{const r=e.getBoundingClientRect();return r.width/r.height};
      return [...[document.querySelector('.card'),...document.querySelectorAll('.card__slide'),document.querySelector('.card_line')].map(rect),...[...document.querySelectorAll('.back__slide')].map(e=>{const s=getComputedStyle(e,'::before');return parseFloat(s.width)/parseFloat(s.height)})];
    });
    for(const ratio of ratios)expect(ratio,`${width}px card layer`).toBeCloseTo((1+Math.sqrt(5))/2,3);
    const view=page.locator('.content__slide:first-child a.button');
    expect(parseFloat(await view.evaluate(e=>getComputedStyle(e).fontSize))).toBeLessThanOrEqual(14);
    const r=await view.boundingBox();expect(r.width).toBeGreaterThanOrEqual(44);expect(r.height).toBeGreaterThanOrEqual(44);
  }
});

test('Contact completion follows saved language and cursor remains non-intercepting during mocked success', async ({page},info) => {
  test.skip(!['desktop-1440','mobile-390'].includes(info.project.name), 'Completion language and input audits use representative desktop and touch widths.');
  await prepareDeterministicNetwork(page);
  let requests=0;
  await page.route('https://script.google.com/**',route=>{requests++;return route.fulfill({status:200,contentType:'text/plain',body:'Successfully submitted'});});
  for(const language of ['ja','en']) {
    await page.goto('contact.html');
    await page.evaluate(language=>{localStorage.setItem('selectedLang',language);localStorage.setItem('lang',language)},language);
    await page.reload();
    await expect(page.locator('#policy-modal-content')).toHaveAttribute('aria-busy','false');
    await page.locator('label[for="radio2"]').click();
    await page.locator('.modal-open-label').click();
    await expect(page.locator('.modal-box')).toHaveCSS('opacity','1');
    await page.keyboard.press('Escape');
    await page.locator('#consent').check();
    await page.locator('#name').fill('Mocked release verification');
    await page.locator('#email').fill('mock@example.com');
    await page.locator('#message').fill('Mocked response only; no external form submission.');
    await page.locator('.submit-btn').click();
    const dialog=page.locator('#thanksModal'),close=dialog.locator('.close');
    await expect(dialog).toHaveClass(/show/);
    await expect(dialog.locator(`p[lang="${language}"]`)).toBeVisible();
    await expect(dialog.locator(`p[lang="${language==='ja'?'en':'ja'}"]`)).toBeHidden();
    await expect(close).toBeFocused();
    if(info.project.name==='desktop-1440') {
      const r=await close.boundingBox();
      await page.evaluate(()=>window.addEventListener('mousemove',e=>window.__thanksMouse={x:e.clientX,y:e.clientY},{once:true}));
      await page.mouse.move(r.x+r.width/2,r.y+r.height/2);
      const state=await page.evaluate(()=>{const e=document.querySelector('#cursor'),r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,pointer:getComputedStyle(e).pointerEvents,z:+getComputedStyle(e).zIndex,dialogZ:+getComputedStyle(document.querySelector('#thanksModal')).zIndex,mouse:window.__thanksMouse}});
      expect(state.pointer).toBe('none');expect(state.z).toBeGreaterThan(state.dialogZ);
      expect(state.x).toBeCloseTo(state.mouse.x,0);expect(state.y).toBeCloseTo(state.mouse.y,0);
      await close.click();
    } else await page.keyboard.press('Escape');
    await expect(dialog).not.toHaveClass(/show/);await expect(page.locator('.submit-btn')).toBeFocused();
  }
  expect(requests).toBe(2);
});

test('Home card switch is a stable card-corner button independent of native View', async ({page},info) => {
  test.skip(info.project.name!=='desktop-1440', 'One desktop case covers the four PC geometry widths.');
  await prepareDeterministicNetwork(page); await observeHomeSlides(page);
  await page.goto('');await completeHomeEntry(page);
  await page.waitForFunction(()=>window.__visualHomeSlideHistory.length>=3&&window.__visualHomeSlideHistory.at(-1)===0);
  const control=page.locator('.card > button.content__ping');
  await expect(control).toHaveCount(1);await expect(control).toHaveAttribute('data-home-slide','2');
  for(const width of [1920,1440,1280,1024]){
    await page.setViewportSize({width,height:900});
    const box=await control.boundingBox(),card=await page.locator('.card').boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
    expect(card.x+card.width-box.x-box.width).toBeCloseTo(24,0);
    expect(card.y+card.height-box.y-box.height).toBeCloseTo(24,0);
    const hits=await control.evaluate(e=>{const r=e.getBoundingClientRect();return [[r.x+r.width/2,r.y+r.height/2],[r.x+4,r.y+r.height/2],[r.right-4,r.y+r.height/2],[r.x+r.width/2,r.y+4],[r.x+r.width/2,r.bottom-4]].every(([x,y])=>e.contains(document.elementFromPoint(x,y)))});
    expect(hits).toBe(true);
  }
  await page.waitForTimeout(3100); // The automatic return retains the existing 3000ms slide lock.
  const before=await control.boundingBox();await control.press('Enter');
  await expect(page.locator('.content__slide:nth-child(2)')).toHaveClass(/active/);
  await expect(control).toHaveAttribute('data-home-slide','1');
  const after=await control.boundingBox();expect(after.x).toBeCloseTo(before.x,0);expect(after.y).toBeCloseTo(before.y,0);
  await page.waitForTimeout(3100); // Existing slide lock releases after exactly 3000ms.
  await control.press('Space');await expect(page.locator('.content__slide:first-child')).toHaveClass(/active/);
  await expect(control).toHaveAttribute('data-home-slide','2');
  await expect(page.locator('.content__slide.active a.button')).toHaveAttribute('href','/website/gallery.html');
});

test('Contact Policy uses compact existing typography without changing reading-frame padding', async ({page},info) => {
  test.skip(!['desktop-1440','mobile-390'].includes(info.project.name),'Representative PC and phone component sizes.');
  await prepareDeterministicNetwork(page);await page.goto('contact.html');
  await page.locator('.modal-open-label').click();await expect(page.locator('.modal-box')).toHaveCSS('opacity','1');
  const measurements=await page.locator('#policy-modal-content').evaluate(e=>{
    const p=[...e.querySelectorAll('p')].find(p=>p.getBoundingClientRect().height>0),h=[...e.querySelectorAll('h3')].find(h=>h.getBoundingClientRect().height>0),s=getComputedStyle(p),hs=getComputedStyle(h),body=getComputedStyle(e);
    return{size:parseFloat(s.fontSize),leading:parseFloat(s.lineHeight)/parseFloat(s.fontSize),paragraph:s.marginBottom,section:hs.marginTop,padding:body.paddingLeft};
  });
  expect(measurements.size).toBeGreaterThanOrEqual(14);expect(measurements.size).toBeLessThanOrEqual(16);
  expect(measurements.leading).toBeCloseTo(1.8,2);expect(measurements.paragraph).toBe('18px');expect(measurements.section).toBe('28px');
  expect(measurements.padding).toBe(info.project.name==='desktop-1440'?'32px':'20px');
  await page.keyboard.press('Escape');await expect(page.locator('.modal-open-label')).toBeFocused();
  await expect(page.locator('#consent')).not.toBeChecked();
});
