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
 await page.route('**/website/__preview/yurayura-events.json*',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
 for(const lang of ['ja','en']){
  await page.goto('information.html');
  await page.evaluate(l=>{localStorage.setItem('selectedLang',l);localStorage.setItem('lang',l)},lang);
  await page.reload();
  await expect(page.locator('[data-yurayura-current-events] tr, [data-yurayura-upcoming-events] tr')).toHaveCount(0);
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


const isoSecond = value => new Date(value).toISOString().replace(/\.\d{3}Z$/, "Z");

function eventFixture(id,edition,start,end,portfolioJa,portfolioEn,overrides={}) {
 return {
  id,edition,published:true,city:'横浜',venue:'確認済み会場',startsAt:start,endsAt:end,
  officialUrl:'https://mizukioyama.github.io/yurayura/information.html#past-exhibitions',
  artists:['Mizuki','かおる'],artworkCount:18,
  copy:{
   yurayura:{ja:'作品と空間のあいだに余白をひらきます。',en:'The exhibition opens a space between artworks and their surroundings.'},
   portfolio:{ja:portfolioJa,en:portfolioEn}
  },
  ...overrides
 };
}

test('Portfolio information reads distinct safe event data and keeps the first-edition archive',async({page})=>{
 const now=Date.now();
 const attack='<img src=x onerror=window.__portfolioXss=true>';
 const fixtures=[
  eventFixture('yurayura-01',1,'2026-10-06T13:00:00+09:00','2026-10-12T13:00:00+09:00','First edition archive copy','First edition archive copy in English',{portfolioDetailUrl:'https://mizukioyama.github.io/website/exhibitions/yurayura/'}),
  eventFixture('yurayura-02',2,isoSecond(now-3600000),isoSecond(now+3600000),attack,'Second edition is currently open.'),
  eventFixture('yurayura-03',3,isoSecond(now+86400000),isoSecond(now+172800000),'Second edition is planned.','A future edition is planned.'),
  eventFixture('yurayura-04',4,isoSecond(now-864000000),isoSecond(now-777600000),'A later past archive.','A later past archive in English.'),
  eventFixture('yurayura-05',5,null,null,'Dates are not scheduled yet.','Dates are not scheduled yet.',{city:null,venue:null,portfolioDetailUrl:undefined})
 ];
 await page.route('**/website/__preview/yurayura-events.json*',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(fixtures)}));
 await page.goto('information.html');
 await expect(page.locator('[data-yurayura-feed]')).toHaveAttribute('data-state','ready');
 await expect(page.locator('[data-yurayura-current-events]')).toContainText('開催中');
 await expect(page.locator('[data-yurayura-upcoming-events]')).toContainText('Second edition is planned.');
 await expect(page.locator('[data-yurayura-past-events]')).toContainText('A later past archive.');
 const undatedRow=page.locator('[data-yurayura-upcoming-events] tr').filter({hasText:'Dates are not scheduled yet.'});
 await expect(undatedRow.locator('[data-event-state="undated"]')).toContainText('日程未定');
 await expect(page.locator('.past-activities-table')).toContainText('グループ展「ゆらゆら」｜企画・主催');
 await expect(page.locator('[data-yurayura-current-events] img')).toHaveCount(0);
 expect(await page.evaluate(()=>window.__portfolioXss)).toBeUndefined();
 await expect(page.locator('[data-yurayura-current-events]')).toContainText(attack);
 await expect(page.locator('[data-yurayura-current-events] a').first()).toHaveAttribute('href',fixtures[1].officialUrl);
 await expect(page.locator('[data-yurayura-current-events] a[lang="ja"][href="https://mizukioyama.github.io/yurayura/"]')).toBeVisible();
 await page.locator('#langChange label[for="langEn"]').click();
 await expect(page.locator('[data-yurayura-past-events] [lang="en"]').filter({hasText:'A later past archive in English.'})).toBeVisible();
 await expect(page.locator('[data-yurayura-past-events] [lang="ja"]').filter({hasText:'A later past archive.'})).toBeHidden();
 await expect(undatedRow.locator('[data-event-state="undated"]')).toContainText('Not scheduled');
});

test('Portfolio feed switches to English and shows an explicit error without claiming there is no event',async({page})=>{
 const now=Date.now();
 const fixture=eventFixture('yurayura-02',2,isoSecond(now+86400000),isoSecond(now+172800000),'Portfolio日本語紹介','Portfolio English introduction.');
 await page.addInitScript(()=>{localStorage.setItem('selectedLang','en');localStorage.setItem('lang','en');});
 await page.route('**/website/__preview/yurayura-events.json*',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([fixture])}));
 await page.goto('information.html');
 await expect(page.locator('[data-yurayura-feed]')).toHaveAttribute('data-state','ready');
 await expect(page.locator('[data-yurayura-upcoming-events]')).toContainText('Portfolio English introduction.');
 await expect(page.locator('[data-yurayura-upcoming-events] [lang="en"]').filter({hasText:'Portfolio English introduction.'})).toBeVisible();
 await expect(page.locator('[data-yurayura-upcoming-events] [lang="ja"]').filter({hasText:'Portfolio日本語紹介'})).toBeHidden();
 await page.unroute('**/website/__preview/yurayura-events.json*');
 await page.route('**/website/__preview/yurayura-events.json*',route=>route.fulfill({status:503,contentType:'application/json',body:'{}'}));
 await page.reload();
 await expect(page.locator('[data-yurayura-feed]')).toHaveAttribute('data-state','error');
 await expect(page.locator('[data-yurayura-feed-status][lang="en"]')).toContainText('could not be loaded');
 await expect(page.locator('[data-yurayura-feed-status][lang="en"]')).toBeVisible();
 await expect(page.locator('[data-yurayura-feed]')).not.toContainText('There are currently no confirmed upcoming exhibitions');
 await expect(page.locator('.past-activities-table')).toContainText('Group Exhibition “Yurayura”');
});
