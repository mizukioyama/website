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
(async () => {
  fs.mkdirSync(output, { recursive: true });
  for (const route of [...routes, 'css/menu.css', 'js/menu.js']) {
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
    for (const width of [1920, 1440, 1024, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => results.errors.push({ width, url: page.url(), message: error.message }));
      for (const route of routes) {
        await page.goto(new URL(route, base).href);
        await expect(page.locator('.toggle_btn')).toHaveAttribute('data-menu-bound', 'true');
        await expect(page.locator('#navArea .inner a')).toHaveCount(6);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false, route + ' horizontal overflow');
        const side = page.locator('body > .page-navigation');
        if (width >= 1024) {
          await expect(page.locator('#navArea nav')).toHaveAttribute('aria-hidden', 'false');
          for (const ratio of [.55, 1, 1.5, 0]) {
            await scroll(page, ratio);
            const y = await page.evaluate(() => scrollY);
            await expect(page.locator('#navArea nav')).toHaveAttribute('aria-hidden', String(y >= 900 * .55));
            await expect(page.locator('header .head')).toBeVisible();
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
            const link = side.locator('a').first();
            const target = await link.getAttribute('href');
            await link.focus(); await page.keyboard.press('Enter');
            await expect(page.locator(target)).toBeFocused();
            await page.goBack();
            await scroll(page, 1.5);
          }
        } else {
          await expect(side).toHaveCount(0);
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
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.content__slide').nth(1)).toHaveClass(/active/, { timeout: 5000 });
    await expect(page.locator('.content__slide').first()).toHaveClass(/active/, { timeout: 7000 });
    await scroll(page, 0);
    await page.locator('#navArea .inner a').filter({ hasText: 'Art Index' }).click();
    await expect(page).toHaveURL(/gallery.html$/);
    await page.goBack();
    await expect(page).toHaveURL(base);
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
