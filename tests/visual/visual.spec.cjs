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
      ja: "自然、心、感情、在り方、想像、生命、記憶、波動、エネルギー",
      en: "Nature, Mind, Emotions, State of being, Imagination, Life, Memory, Vibrations, Energy",
      jaLines: ["自然、心、", "感情、在り方、", "想像、生命、", "記憶、波動、エネルギー"],
      enLines: ["Nature, Mind,", "Emotions, State of being,", "Imagination, Life,", "Memory, Vibrations, Energy"],
      dataSubtitle: "自然、心、<br>感情、在り方、<br>想像、生命、<br>記憶、波動、エネルギー"
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
    await expectHorizontalFit(page.locator(".information-page .info-section[aria-labelledby=\"upcoming-title\"] .history-table"), "Information Upcoming table");
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
        expectedMarginTop: Math.min(window.innerWidth, window.innerHeight) * 0.6,
        titleBottom: title.getBoundingClientRect().bottom,
        sectionTop: sectionTitle.getBoundingClientRect().top
      };
    });
    expect(layout, "Order layout geometry should be measurable").not.toBeNull();
    expect(Math.abs(layout.marginTop - layout.expectedMarginTop), "Order should use the shared 60vmin content offset").toBeLessThanOrEqual(1.5);
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

    const layout = await page.evaluate(() => {
      const content = document.querySelector(".exhibition-page .content");
      const title = document.querySelector(".exhibition-page > .h1-text h1");
      const sectionTitle = content?.querySelector(":scope > h2");
      if (!content || !title || !sectionTitle) return null;
      const contentStyle = getComputedStyle(content);
      return {
        marginTop: parseFloat(contentStyle.marginTop) || 0,
        expectedMarginTop: Math.min(window.innerWidth, window.innerHeight) * 0.6,
        titleBottom: title.getBoundingClientRect().bottom,
        sectionTop: sectionTitle.getBoundingClientRect().top
      };
    });
    expect(layout, "Yurayura layout geometry should be measurable").not.toBeNull();
    expect(Math.abs(layout.marginTop - layout.expectedMarginTop), "Yurayura should use the shared 60vmin content offset").toBeLessThanOrEqual(1.5);
    expect(layout.titleBottom, "Yurayura H1 must remain above page content").toBeLessThan(layout.sectionTop);
  }
}

async function exerciseSharedRuntimeInteractions(page) {
  const toggle = page.locator("#navArea .toggle_btn");
  await expect(toggle).toHaveAttribute("role", "button");
  await expect(toggle).toHaveAttribute("tabindex", "0");

  const openState = await toggle.evaluate(element => {
    element.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true,
      cancelable: true
    }));
    const nav = element.closest("#navArea");
    return {
      open: Boolean(nav?.classList.contains("open")),
      expanded: element.getAttribute("aria-expanded")
    };
  });
  expect(openState).toEqual({ open: true, expanded: "true" });

  const closedState = await toggle.evaluate(element => {
    element.dispatchEvent(new KeyboardEvent("keydown", {
      key: " ",
      code: "Space",
      bubbles: true,
      cancelable: true
    }));
    const nav = element.closest("#navArea");
    return {
      open: Boolean(nav?.classList.contains("open")),
      expanded: element.getAttribute("aria-expanded")
    };
  });
  expect(closedState).toEqual({ open: false, expanded: "false" });
}

async function exerciseGalleryRuntime(page, projectName, testInfo) {
  const categoryHeader = page.locator("#category-header");
  if (await categoryHeader.isVisible() && await categoryHeader.getAttribute("aria-expanded") !== "true") {
    await categoryHeader.click();
    await expect(categoryHeader).toHaveAttribute("aria-expanded", "true");
  }

  const paintCategory = page.locator('#category-menu li[data-category="Paint"]');
  await paintCategory.click();
  await expect(categoryHeader).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#gallery-container .work").first()).toBeVisible();

  const firstWork = page.locator("#gallery-container .work").first();
  const firstThumbnail = firstWork.locator(".work-img > img");
  const firstTitle = firstWork.locator(".view-policy-button p").first();
  await expect(firstThumbnail).toHaveAttribute("alt", await firstTitle.textContent());

  await page.locator('#langChange label[for="langEn"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(firstThumbnail).toHaveAttribute("alt", await firstTitle.textContent());
  await page.locator('#langChange label[for="langJa"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(firstThumbnail).toHaveAttribute("alt", await firstTitle.textContent());

  await page.locator(".view-policy-button").first().click();
  await expectViewportModalFit(page.locator("#modalBox"), "Gallery artwork modal");
  await expect(page.locator("#modalCloseBtn")).toBeVisible();
  await expect(page.locator("#modalBox img").first()).toHaveAttribute(
    "alt",
    await page.locator("#modalBox .works p").first().textContent()
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
  await expect(consentCopy).toHaveText("I have reviewed the Site Policy.");
  await expect(consentCopy.locator("[lang]"), label + " consent copy should be a single English UI string")
    .toHaveCount(0);

  const policyLink = page.locator("label.modal-open-label");
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

  await page.locator('label[for="modal-toggle"].modal-open-label').click();
  await expect(page.locator("#policy-modal-content")).toHaveAttribute("aria-busy", "false");
  await expect(page.locator('#policy-modal-content > div[lang="ja"]')).toBeVisible();
  await expect(page.locator('#policy-modal-content > div[lang="en"]')).toBeVisible();
  await expect(page.locator("body > .modal-box .modal-close-label [lang=ja]")).toBeVisible();
  await expect(page.locator("body > .modal-box .modal-close-label [lang=en]")).toBeVisible();
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

  await page.locator('label[for="modal-toggle"].modal-open-label').click();
  await expect(page.locator("#modal-toggle")).toBeChecked();
  await expectViewportModalFit(page.locator("body > .modal-box"), "Contact SitePolicy modal");
  await expect(consent).toBeEnabled();
  await expect(consent).toBeChecked();

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
  await expect(page.locator("#thanksModal p[lang=en]")).toBeVisible();
  const thanksLanguages = await page.locator("#thanksModal .modal-content").evaluate(element =>
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

  await page.locator("#thanksModal .close").click();
  await expect(page.locator("#thanksModal")).not.toHaveClass(/show/);
  await page.waitForTimeout(350);
  await expect(page.locator("#langChange")).toBeHidden();
  await expect(page.locator("#thanksModal .close")).toHaveAttribute("aria-label", "閉じる");
}

const informationPastActivityRows = [
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
      normalize(row.querySelector('td.tb-content > [lang="ja"]')),
      normalize(row.querySelector('td.tb-content > [lang="en"]'))
    ];
  }));
  expect(rows, label + " year, month, exhibition, and venue records").toEqual(informationPastActivityRows);

  for (let index = 0; index < informationPastActivityRows.length; index += 1) {
    const row = table.locator("tbody tr").nth(index);
    await expect(row.locator('td.tb-content > [lang="ja"]'))[language === "ja" ? "toBeVisible" : "toBeHidden"]();
    await expect(row.locator('td.tb-content > [lang="en"]'))[language === "en" ? "toBeVisible" : "toBeHidden"]();
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
    const biographyTable = referencePage.locator("#state .content .portfolio-history-table").first();
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
  await expect(page.locator('.info-section[aria-labelledby="upcoming-title"] .history-table thead th:first-child [lang="ja"]')).toBeVisible();
  await assertInformationPastHistory(page, "ja", "Information Past Activities in Japanese");
  await expect(page.locator(".information-intro p[lang=ja]")).toBeVisible();
  await expect(page.locator(".information-intro p[lang=en]")).toHaveCount(1);
  await expect(page.locator(".information-intro p[lang=en]")).toBeHidden();
  await expect(page.locator(".past-activities-table tbody tr")).toHaveCount(4);
  await expect(page.locator('.past-activities-table tbody tr[lang="ja"], .past-activities-table tbody tr[lang="en"]')).toHaveCount(0);
  await expect(page.locator('.info-link[lang="ja"]')).toBeVisible();
  await expect(page.locator('.info-link[lang="en"]')).toBeHidden();

  await page.locator('#langChange label[for="langEn"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".information-page .content > h2 [lang=ja]")).toBeHidden();
  await expect(page.locator(".information-page .content > h2 [lang=en]")).toBeVisible();
  await expect(page.locator("#upcoming-title [lang=ja]")).toBeHidden();
  await expect(page.locator("#past-title [lang=ja]")).toBeHidden();
  await expect(page.locator('#past-title [lang="en"]')).toHaveText("Past Activities");
  await assertInformationPastHistory(page, "en", "Information Past Activities in English");
  await expect(page.locator('.info-section[aria-labelledby="upcoming-title"] .history-table thead th:first-child [lang="ja"]')).toBeHidden();
  await expect(page.locator('.info-section[aria-labelledby="upcoming-title"] .history-table thead th:first-child [lang="en"]')).toBeVisible();
  await expect(page.locator(".information-intro p[lang=ja]")).toBeHidden();
  await expect(page.locator(".information-intro p[lang=en]")).toBeVisible();
  await expect(page.locator(".information-intro p[lang=en]")).toContainText("Current and upcoming exhibitions");
  await expect(page.locator("#upcoming-title [lang=en]")).toBeVisible();
  await expect(page.locator("#past-title [lang=en]")).toBeVisible();
  await expect(page.locator('.history-table tbody tr[lang="ja"]').first()).toBeHidden();
  await expect(page.locator('.history-table span[lang="en"]').filter({ hasText: "Group Exhibition" })).toBeVisible();
  await expect(page.locator('.info-section[aria-labelledby="upcoming-title"] .history-table span[lang="en"]').filter({ hasText: "Group Exhibition" })).toBeVisible();
  const englishDetailLink = page.locator('.info-link[lang="en"]');
  await expect(englishDetailLink).toBeVisible();
  await expect(englishDetailLink).toHaveText("View exhibition details");
  await expect(englishDetailLink).toHaveAttribute("href", "exhibitions/yurayura/");
  await expect(page.locator('.info-link[lang="ja"]')).toBeHidden();
  await expectHorizontalFit(page.locator(".information-page .content"), "Information content in English");
  await expectHorizontalFit(page.locator(".information-page .history-table"), "Information table in English");
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
  await expect(page.locator('.info-link[lang="en"]')).toBeVisible();
  await page.locator('#langChange label[for="langJa"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator(".information-intro p[lang=ja]")).toBeVisible();
  await assertInformationPastHistory(page, "ja", "Information Past Activities restored in Japanese");
  await expect(page.locator('.info-link[lang="ja"]')).toBeVisible();
  await expect(page.locator('.info-link[lang="en"]')).toBeHidden();
}

async function exerciseInformationRuntime(page, testInfo) {
  await exerciseInformationLanguage(page, testInfo);
  const sections = page.locator(".information-page .info-section");
  await expect(sections).toHaveCount(2);

  const headings = await sections.locator("h2").allInnerTexts();
  expect(headings.map(text => text.trim())).toEqual(["開催予定", "過去の活動"]);
  await compareInformationPastTableWithBiography(page, "Information table matches Biography at " + page.viewportSize().width + "px");

  const upcoming = page.locator('section[aria-labelledby="upcoming-title"]');
  await expect(upcoming).toContainText("2026.10");
  await expect(upcoming).toContainText("グループ展「ゆらゆら」");
  await expect(upcoming).toContainText("2026年10月6日 — 10月12日");

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

  await page.evaluate(async () => {
    const title = document.querySelector(".h1-text h1.text");
    if (!title) return;
    const target = title.getAttribute("aria-label");
    if (!target) return;

    await new Promise((resolve, reject) => {
      let stableTimer;
      const timeoutTimer = setTimeout(() => {
        observer.disconnect();
        reject(new Error("Page title did not finish its text animation."));
      }, 5000);
      const finish = () => {
        observer.disconnect();
        clearTimeout(timeoutTimer);
        resolve();
      };
      const check = () => {
        clearTimeout(stableTimer);
        if (title.innerText.trim() === target.trim() && !title.querySelector(".dud")) {
          stableTimer = setTimeout(finish, 300);
        }
      };
      const observer = new MutationObserver(check);
      observer.observe(title, { childList: true, characterData: true, subtree: true });
      check();
    });
  });

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
    if (entry.key === "home" || entry.key === "contact" || (
      testInfo.project.name === "desktop-1440"
      && ["biography", "order", "information"].includes(entry.key)
    )) {
      // Large desktop captures and Contact form runtime checks need more time on CI.
      testInfo.setTimeout(60000);
    }

    const runtime = createRuntimeMonitor(page, entry);

    if (entry.key === "home") {
      // Keep the first Home slide stable without freezing CSS/WebGL animation frames.
      await page.addInitScript(() => {
        const nativeSetTimeout = window.setTimeout.bind(window);
        window.setTimeout = (callback, delay, ...args) => {
          const source = typeof callback === "function"
            ? Function.prototype.toString.call(callback)
            : "";
          const isHomeAutoAdvance =
            (delay === 2000 && /goToSlide\(slideElements,\s*2\)/.test(source))
            || (delay === 6000 && /goToSlide\(slideElements,\s*1\)/.test(source));

          if (isHomeAutoAdvance) {
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
    const response = await page.goto(entry.path, { waitUntil: "domcontentloaded" });
    expect(response, "navigation should return a response").not.toBeNull();
    expect(response.status()).toBe(entry.status || 200);

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

    await assertResponsivePageGeometry(page, entry);

    if (["biography", "artist-statement"].includes(entry.key)) {
      await assertBilingualPage(page, entry.key);
    }

    if (process.env.VISUAL_SKIP_SNAPSHOTS !== "1" && entry.baseline !== false && visualBaselineProjects.has(testInfo.project.name)) {
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

  expect(roundToTenth(sizes.header), "Header brand font-size").toBe(expected);
  if (hasFooter) {
    expect(sizes.footer.length, "Footer navigation should exist").toBeGreaterThan(0);
    for (const size of sizes.footer) {
      expect(roundToTenth(size), "Footer navigation font-size").toBe(expected);
      expect(Math.abs(size - sizes.header), "Header/Footer font-size should match").toBeLessThanOrEqual(0.05);
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

test("Header menu follows saved language and hides language controls while open", async ({ page }, testInfo) => {
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

test("Selected Ink Field initializes on all nine production routes", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "Background initialization is audited once per normal run."
  );

  const runtime = createRuntimeMonitor(page);
  await prepareDeterministicNetwork(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });

  for (const entry of pages.filter(item => item.key !== "404")) {
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
      return {
        mode: window.__PORTFOLIO_BACKGROUND_SYSTEM__,
        canvasCount: document.querySelectorAll("#selected-ink-field-canvas").length,
        canvasWidth: canvas?.width || 0,
        canvasHeight: canvas?.height || 0,
        legacyCanvasCount: document.querySelectorAll(
          ".ripples canvas, #vanta-bg canvas, #vanta-bg-bio canvas"
        ).length,
        engine: engine ? engine.getState() : null
      };
    });

    expect(state.mode, entry.key + " background engine").toBe("selectedInkField");
    expect(state.canvasCount, entry.key + " Selected Ink Field canvas count").toBe(1);
    expect(state.canvasWidth, entry.key + " canvas width").toBeGreaterThan(0);
    expect(state.canvasHeight, entry.key + " canvas height").toBeGreaterThan(0);
    expect(state.legacyCanvasCount, entry.key + " legacy Ripple/VANTA canvases").toBe(0);
    expect(state.engine.frameCount, entry.key + " animation frame count").toBeGreaterThan(0);
    expect(state.engine.webglErrors, entry.key + " WebGL errors").toEqual([]);
    assertRuntimeClean(runtime, entry);
  }

  await attachRuntimeObservations(testInfo, { key: "selected-ink-field" }, runtime);
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
