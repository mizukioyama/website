const {test,expect}=require('@playwright/test');
const {createHash}=require('node:crypto');
const approved=require('./fixtures/phase123-approved-copy.json');
test.afterEach(async({page})=>{
 const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
 expect(overflow,'page and body must both fit the viewport').toBeLessThanOrEqual(2);
 const nav=page.locator('main .reading-nav, main .statement-reading-nav');
 if(await nav.count()){
 const overlap=await nav.evaluate(e=>document.querySelector('main .h1-text').getBoundingClientRect().bottom-e.getBoundingClientRect().top);
 expect(overlap,'page index must follow the H1 and subtitle').toBeLessThanOrEqual(0);
 }
});
const hash=s=>createHash('sha256').update(s.replace(/\s+/g,' ').trim()).digest('hex');

test('Phase 1 concluded exhibition remains consistent in both languages',async({page})=>{
 for(const lang of ['ja','en']){
  await page.goto('information.html');
  await page.evaluate(l=>{localStorage.setItem('selectedLang',l);localStorage.setItem('lang',l)},lang);
  await page.reload();
  await expect(page.locator('[aria-labelledby="upcoming-title"]')).not.toContainText('ゆらゆら');
  const past=page.locator('[aria-labelledby="past-title"]');
  await expect(past).toContainText(lang==='ja'?'開催終了':'Concluded');
  await expect(past.locator(`a[lang="${lang}"]`)).toBeVisible();
  await past.locator(`a[lang="${lang}"]`).click();
  await expect(page).toHaveURL(/exhibitions\/yurayura\/$/);
  await expect(page.locator(`.lead [lang="${lang}"]`)).toBeVisible();
  await expect(page.locator('.lead')).toContainText(lang==='ja'?'初回の会期は終了':'first edition has concluded');
  await expect(page.locator('main')).not.toContainText('現在は会期前');
  await expect(page.locator('#future-title').locator('..')).toContainText(lang==='ja'?'実現済みの制度ではありません':'rather than an established system');
 }
});

test('Phase 2 overview, original story and records are accessible and intact',async({page})=>{
 await page.goto('biography.html');
 const summary=await page.locator('#biography-overview > p[lang="ja"]').textContent();
 expect(summary.length).toBeGreaterThanOrEqual(400);expect(summary.length).toBeLessThanOrEqual(600);
 await expect(page.locator('#biography-overview > p[lang="en"]')).toBeVisible();
 expect((await page.locator('#full-biography .work > p').allTextContents()).map(hash)).toEqual(approved.biography);
 expect((await page.locator('#biography-records table').allTextContents()).map(hash)).toEqual(approved.records);
 await expect(page.locator('#career-timeline tbody tr')).toHaveCount(5);
 for(const href of ['#biography-overview','#career-timeline','#biography-records','#full-biography']){
  const link=page.locator(`.reading-nav a[href="${href}"]`);await link.focus();await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(href+'$'));
  await expect(page.locator(href)).toBeFocused();
  expect(await page.locator(href).evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.top<innerHeight})).toBe(true);
 }
});

test('Phase 3 statement and five questions preserve the approved wording',async({page})=>{
 await page.goto('artist-statement.html');
 expect((await page.locator('main .work > p').allTextContents()).map(hash)).toEqual(approved['artist-statement']);
 expect(hash(await page.locator('main .timeline').textContent())).toBe(approved.questions);
 await expect(page.locator('.timeline-item')).toHaveCount(5);
 await expect(page.locator('.h1-text')).toHaveAttribute('data-subtitle','揺らぎ、感覚、記憶<br>色と余白、<br>見えないもの<br>固定された視点を緩めること');
 for(const href of ['#main-statement','#statement-questions']){
  await page.locator(`.statement-reading-nav a[href="${href}"]`).focus();await page.keyboard.press('Enter');
  await expect(page.locator(href)).toBeFocused();
 }
});
