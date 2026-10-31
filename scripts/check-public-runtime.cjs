// Verify the deployed Pages bytes and real browser runtime after deployment.
// No resource interception or fixture substitution is used here.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { chromium, expect } = require('@playwright/test');
const base = process.env.PUBLIC_BASE_URL || 'https://mizukioyama.github.io/website/';
const output = path.resolve('test-results/public-runtime');
const routes = ['', 'gallery.html', 'biography.html', 'artist-statement.html', 'information.html', 'order.html', 'contact.html', 'policy.html', 'exhibitions/yurayura/', '404.html'];
const sidebarRoutes = new Set(['biography.html', 'artist-statement.html', 'information.html', 'order.html', 'policy.html', 'exhibitions/yurayura/']);
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const results = { revision: process.env.GITHUB_SHA || null, base, bytes: [], cases: [], errors: [] };
async function scroll(page, ratio) {
  await page.evaluate(async ratio => {
    document.activeElement?.blur();
    scrollTo({ top: Math.ceil(innerHeight * ratio), behavior: 'instant' });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, ratio);
}
async function enterHome(page, language = 'ja') {
  const entry = page.locator('#home-entry');
  await expect(page.locator('#loading-bg')).toHaveAttribute('data-typing-started', 'true');
  if (await entry.isVisible()) {
    await page.locator('[data-entry-language="' + language + '"]').click();
    await page.locator('#home-start').click();
    await expect(entry).toBeHidden();
    await expect(page.locator('#loading-bg')).toHaveAttribute('aria-label', language === 'en' ? /This website/ : /当Webサイト/);
    await expect(page.locator('#loading-bg [lang="' + (language === 'en' ? 'ja' : 'en') + '"]').first()).toBeHidden();
    await page.waitForFunction(() => !document.querySelector('main.top-page').inert);
  }
  await expect(page.locator('#loading-bg')).toBeHidden({ timeout: 90000 });
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  for (const route of [...routes, 'css/menu.css', 'css/gallery.css', 'css/mobile.css', 'assets/css/user-settings.css', 'js/menu.js', 'js/form.js', 'js/time.js', 'css/all.css', 'css/form.css', 'css/index.css', 'css/index-tablet.css']) {
    const file = !route || route.endsWith('/') ? route + 'index.html' : route;
    const url = new URL(route, base);
    url.searchParams.set('release-check', process.env.GITHUB_SHA || 'local');
    const response = await fetch(url);
    assert.equal(response.status, 200, route + ' HTTP');
    const actual = digest(Buffer.from(await response.arrayBuffer()));
    const expected = digest(fs.readFileSync(path.resolve('docs', file)));
    assert.equal(actual, expected, route + ' must match the built deployment revision');
    results.bytes.push({ route, sha256: actual });
  }
  const browser = await chromium.launch();
  try {
    for (const width of [1920, 1440, 1280, 1024, 430, 390, 375, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => {
        if (typeof TextScramble === 'undefined') return;
        const original = TextScramble.prototype.setText;
        TextScramble.prototype.setText = function(text) {
          const completion = original.call(this, text);
          if (this.el.matches('.h1-text h1')) completion.then(() => { window.__runtimeTitleComplete = true; });
          return completion;
        };
      }, { once: true }));
      page.on('pageerror', error => results.errors.push({ width, url: page.url(), message: error.message }));
      for (const route of routes) {
        await page.goto(new URL(route, base).href);
        if (!route) {
          await enterHome(page);
          const card = await page.locator('.card').boundingBox();
          assert.ok(Math.abs(card.width / card.height - (width <= 430 ? 1 / 1.618 : 1.618)) < .01, 'Home golden ratio');
          assert.ok(card.x >= 0 && card.y >= 0 && card.x + card.width <= width + 1 && card.y + card.height <= 901, 'Home card viewport fit');
        }
        for (const heading of await page.locator('h1').all()) await expect(heading).toHaveCSS('font-weight', '100');
        await expect(page.locator('.toggle_btn')).toHaveAttribute('data-menu-bound', 'true');
        await expect(page.locator('#navArea .inner a')).toHaveCount(6);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false, route + ' horizontal overflow');
        const side = page.locator('body > .page-navigation');
        if (width >= 1024) {
          await expect(page.locator('header .head a')).toHaveCSS('font-size', '18px');
          for (const link of await page.locator('#navArea .inner a').all()) await expect(link).toHaveCSS('font-size', '16px');
          await expect(page.locator('#navArea nav')).toHaveAttribute('aria-hidden', 'false');
          for (const ratio of [.55, 1, 1.5, 0]) {
            await scroll(page, ratio);
            const y = await page.evaluate(() => scrollY);
            await expect(page.locator('#navArea nav')).toHaveAttribute('aria-hidden', String(y >= 900 * .55));
            await expect(page.locator('header .head')).toBeVisible();
            const compact = y >= 900 * .55;
            const toggle = page.locator('.toggle_btn');
            if (compact) {
              await expect(toggle).toBeVisible();
              await toggle.click();
              await expect(toggle).toHaveAttribute('aria-expanded', 'true');
              await expect(page.locator('#navArea .inner a')).toHaveCount(6);
              await page.keyboard.press('Escape');
              await expect(toggle).toBeFocused();
              await expect(toggle).toHaveAttribute('aria-expanded', 'false');
            } else await expect(toggle).toBeHidden();
            if (sidebarRoutes.has(route)) {
              await expect(side).toHaveCount(1);
              await expect(side).toHaveAttribute('aria-hidden', String(y < 900));
            } else await expect(side).toHaveCount(0);
          }
          if (width === 1920 || width === 1440) {
            const menu = await page.locator('#navArea').boundingBox();
            assert.ok(Math.abs(menu.width - (width === 1920 ? 1200 : 1080)) < 1);
            assert.ok(Math.abs(menu.x + menu.width - width) < 1);
          }
          if (sidebarRoutes.has(route)) {
            await scroll(page, 1.5);
            const columns = await page.locator('main .content:visible').evaluateAll(es => es.map(e => {
              const r=e.getBoundingClientRect(), side=document.querySelector('body > .page-navigation').getBoundingClientRect();
              return {width:r.width, rightGap:innerWidth-r.right, gap:r.left-side.right, sideCenter:side.left+side.width/2, columnLeft:r.left};
            }));
            for (const c of columns) {
              assert.ok(Math.abs(c.width-Math.min(800,width-Math.min(width,900)*0.04-32))<1, route+' content width');
              assert.ok(Math.abs(c.rightGap-Math.min(width,900)*0.04)<1, route+' right gutter');
              assert.ok(Math.abs(c.sideCenter-c.columnLeft/2)<1, route+' sidebar centered in the left free area');
              assert.ok(c.gap>=23.9, route+' sidebar clearance');
            }
            const link = side.locator('a').first();
            const target = await link.getAttribute('href');
            await link.focus(); await page.keyboard.press('Enter');
            await expect(page.locator(target)).toBeFocused();
            await page.goBack();
            await scroll(page, 1.5);
          }
        } else {
          await expect(side).toHaveCount(0);
          if (width <= 430) {
            const r = await page.locator('.toggle_btn').boundingBox();
            assert.equal(r.width, 64); assert.equal(r.height, 64);
            assert.ok(Math.abs(r.x + r.width - (width - width * .05)) < 1);
            assert.ok(Math.abs(r.y + r.height - (900 - width * .35)) < 1);
          }
          if (route && route !== '404.html') {
            await page.waitForFunction(() => window.__runtimeTitleComplete);
            const title = await page.locator('.h1-text h1').boundingBox();
            assert.ok(Math.abs(title.y + title.height / 2 - 450) < 1, route + ' initial H1 center');
          }
          await page.locator('.toggle_btn').click();
          await expect(page.locator('#navArea')).toHaveClass(/open/);
          await page.keyboard.press('Escape');
          await expect(page.locator('.toggle_btn')).toBeFocused();
          await expect(page.locator('#navArea')).not.toHaveClass(/open/);
        }
        const en = page.locator('label[for="langEn"]');
        if (await en.isVisible()) {
          await en.click(); assert.equal(await page.evaluate(() => window.getPortfolioLanguage()), 'en');
          await page.locator('label[for="langJa"]').click();
        }
        if (width >= 1024 && sidebarRoutes.has(route)) {
          await scroll(page, 1.2);
          await expect(side).toHaveAttribute('aria-hidden', 'false');
          const r = await side.boundingBox(); assert.ok(Math.abs(r.y + r.height / 2 - 450) < 1);
          await page.evaluate(() => { const f = document.querySelector('#footer-container'); scrollTo({top:scrollY + f.getBoundingClientRect().top - innerHeight - 32,behavior:'instant'}); });
          await expect(side).toHaveAttribute('aria-hidden', 'true');
          await scroll(page, 1.2); await expect(side).toHaveAttribute('aria-hidden', 'false');
        }
        if (route === 'gallery.html') {
          await expect(page.locator('#gallery-container > .work').first()).toBeVisible();
          await page.locator('#category-header').click();
          const paint = page.locator('#category-menu [data-category="Paint"]');
          await paint.click(); await expect(paint).toHaveAttribute('aria-pressed', 'true');
          await page.locator('#gallery-container .view-policy-button').first().click();
          await expect(page.locator('#modalBox')).toBeVisible();
          await page.locator('#modalCloseBtn').click();
          await expect(page.locator('#modalBox')).toBeHidden();
        }
        if (route === 'contact.html') {
          await page.locator('button.modal-open-label').click();
          await expect(page.locator('#policy-modal-content')).toHaveAttribute('aria-busy', 'false');
          await expect(page.getByRole('dialog', {name:'Site Policy'})).toBeVisible();
          await expect(page.locator('#policy-modal-content #policy-ja, #policy-modal-content #policy-en')).toHaveCount(0);
          const language = await page.evaluate(() => window.getPortfolioLanguage());
          await expect(page.locator('#policy-modal-content > [lang="' + language + '"]')).toBeVisible();
          await expect(page.locator('#policy-modal-content > [lang="' + (language === 'en' ? 'ja' : 'en') + '"]')).toBeHidden();
          await expect(page.locator('#consent')).not.toBeChecked();
          const close = page.locator('.modal-close-label');
          const position = await close.boundingBox();
          await page.locator('#policy-modal-content').evaluate(element => element.scrollTop = element.scrollHeight);
          assert.ok(Math.abs((await close.boundingBox()).y - position.y) < 1, 'Policy close remains fixed');
          await page.keyboard.press('Escape');
          await expect(page.locator('button.modal-open-label')).toBeFocused();
          await expect(page.locator('#consent')).not.toBeChecked();
          assert.equal(await page.locator('#consent').evaluate(element => element.required && !element.checkValidity()), true);
        }
        if (route === 'information.html') await expect(page.locator('[data-yurayura-feed]')).toHaveAttribute('data-state', 'ready', { timeout: 20000 });
        if (width === 1920 && ['order.html', 'biography.html', 'artist-statement.html'].includes(route)) {
          await scroll(page, 1.5);
          await page.screenshot({ path: path.join(output, route.replace('.html', '') + '-1920.png') });
        }
        results.cases.push({ route: route || 'Home', width, pass: true });
        console.log('Public runtime PASS:', width, route || 'Home');
      }
      await context.close();
    }
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
    page.on('pageerror', error => results.errors.push({ url: page.url(), message: error.message }));
    await page.bringToFront();
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await enterHome(page, 'en');
    await expect(page.locator('.content__slide').nth(1)).toHaveClass(/active/, { timeout: 5000 });
    await expect(page.locator('.content__slide').first()).toHaveClass(/active/, { timeout: 7000 });
    await scroll(page, 0);
    // Observe the real intro ending before using the existing Enter path.
    await expect(page.locator('#loading-bg')).toBeHidden({ timeout: 90000 });
    await page.locator('#mainContent .content__slide.active .button-wrap a.button').click();
    await expect(page).toHaveURL(/gallery.html$/);
    await page.goBack();
    await expect(page).toHaveURL(base);
    await expect(page.locator('#home-entry')).toBeHidden();
    await expect(page.locator('#loading-bg')).toBeHidden();
    await page.goto(new URL('gallery.html', base).href);
    await expect(page.locator('canvas')).toHaveCount(3);
    await page.waitForFunction(() => window.__selectedInkField?.getState().frameCount > 0 && window.__organicFlowProduction?.getState().engine.frameCount > 0);
    assert.deepEqual(await page.evaluate(() => window.__selectedInkField.getState().webglErrors), []);
    await expect(page.locator('main')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0.05)');
    await page.goto(new URL('biography.html', base).href);
    await expect(page.locator('#vanta-bg-bio canvas')).toHaveCount(1);
    await page.waitForFunction(() => window.__organicFlowProduction?.getState().engine.frameCount > 0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('#vanta-bg-bio canvas')).toHaveCount(0);
    const missing = await page.goto(new URL('__release-missing__/', base).href);
    assert.equal(missing.status(), 404);
    assert.match(await page.title(), /404/);
    assert.deepEqual(results.errors, [], 'public JavaScript page errors');
  } finally { await browser.close(); }
  results.pass = true;
})().catch(error => { results.pass = false; results.failure = error.stack; process.exitCode = 1; }).finally(() => {
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
});
