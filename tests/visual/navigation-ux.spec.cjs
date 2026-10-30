const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
async function prepare(page){
 await page.route('https://code.jquery.com/jquery-3.7.1.min.js',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync(require('node:path').resolve(__dirname,'../../docs/js/jquery-3.7.1.min.js'),'utf8')}));
 for(const p of ['https://fonts.googleapis.com/**','https://fonts.gstatic.com/**','https://use.typekit.net/**','https://p.typekit.net/**'])await page.route(p,r=>r.fulfill({body:'',contentType:'text/css'}));
}
async function focused(page, locator) {
 try { await expect(locator).toBeFocused(); }
 catch(error) { console.log('FOCUS_EVIDENCE', await locator.evaluate(e=>({hasFocus:document.hasFocus(),active:document.activeElement.outerHTML.slice(0,160),connected:e.isConnected,inert:e.closest('[inert]')?.outerHTML.slice(0,120),visibility:getComputedStyle(e).visibility,parentVisibility:getComputedStyle(e.parentElement).visibility,scrollY}))); throw error; }
}
for(const width of [1920,1600,1440,1300,1299,1280,1024])test('Navigation UX desktop '+width,async({page},info)=>{
 test.skip(info.project.name!=='desktop-1440','One dedicated responsive matrix.');await prepare(page);await page.setViewportSize({width,height:900});await page.goto('order.html');const nav=page.locator('#navArea'),panel=nav.locator('nav'),button=nav.locator('.toggle_btn'),side=page.locator('body>.page-navigation');
 await expect(button).toBeHidden();await expect(panel).toHaveAttribute('aria-hidden','false');await expect(nav.locator('.inner a')).toHaveCount(6);
 await page.evaluate(()=>scrollTo({top:innerHeight*.6,behavior:'instant'}));await expect(button).toBeVisible();await expect(panel).toHaveAttribute('aria-hidden','true');await button.click();await expect(button).toHaveAttribute('aria-expanded','true');await focused(page,nav.locator('.inner a').first());await expect(page.locator('#langChange')).toBeVisible();
 await page.keyboard.press('Shift+Tab');await expect(button).toBeFocused();await page.keyboard.press('Tab');await focused(page,nav.locator('.inner a').first());await page.keyboard.press('Escape');await expect(button).toBeFocused();await expect(panel).toHaveAttribute('aria-hidden','true');
 await button.press('Enter');await expect(button).toHaveAttribute('aria-expanded','true');await page.evaluate(()=>scrollTo({top:innerHeight*.9,behavior:'instant'}));await page.setViewportSize({width:width+1,height:700});await expect(button).toHaveAttribute('aria-expanded','true');await expect(panel).toBeVisible();await page.setViewportSize({width,height:900});await page.locator('main').click({position:{x:4,y:350}});await expect(button).toHaveAttribute('aria-expanded','false');
 await page.evaluate(()=>scrollTo({top:innerHeight*1.2,behavior:'instant'}));await expect(side).toHaveAttribute('aria-hidden','false');const box=await side.boundingBox();expect(box.y+box.height/2).toBeCloseTo(450,0);
 for(const link of await side.locator('a').all()){const r=await link.boundingBox();expect(r.height).toBeGreaterThanOrEqual(44);expect(r.width).toBeGreaterThanOrEqual(44);}
 await expect(side.locator('a').first()).toBeVisible();await side.locator('a').first().focus();await focused(page,side.locator('a').first());await page.evaluate(()=>{const f=document.querySelector('#footer-container');scrollTo({top:scrollY+f.getBoundingClientRect().top-innerHeight-32,behavior:'instant'});});await expect(side).toHaveAttribute('aria-hidden','true');await expect(button).toBeFocused();expect(await side.evaluate(e=>e.inert)).toBe(true);
 await page.evaluate(()=>scrollTo({top:innerHeight*1.2,behavior:'instant'}));await expect(side).toHaveAttribute('aria-hidden','false');await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await expect(button).toBeHidden();await expect(panel).toHaveAttribute('aria-hidden','false');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('Navigation UX all six sidebars center vertically and clear Footer',async({page},info)=>{
 test.skip(info.project.name!=='desktop-1440');test.setTimeout(120000);await prepare(page);
 for(const height of [450,600,900])for(const route of ['biography.html','artist-statement.html','information.html','order.html','policy.html','exhibitions/yurayura/']){
  await page.setViewportSize({width:1024,height});await page.goto(route);await page.evaluate(()=>scrollTo({top:innerHeight,behavior:'instant'}));const side=page.locator('body>.page-navigation');await expect(side).toHaveAttribute('aria-hidden','false');const r=await side.boundingBox();expect(r.y+r.height/2).toBeCloseTo(height/2,0);expect(r.y).toBeGreaterThanOrEqual(0);expect(r.y+r.height).toBeLessThanOrEqual(height);
  await page.evaluate(()=>{const f=document.querySelector('#footer-container');scrollTo({top:scrollY+f.getBoundingClientRect().top-innerHeight-24,behavior:'instant'});});await expect(side).toHaveAttribute('aria-hidden','true');
 }
});

test('Navigation UX responsive button semantics and target dimensions',async({page},info)=>{
 test.skip(info.project.name!=='mobile-390');await prepare(page);await page.goto('gallery.html');const button=page.locator('.toggle_btn');await expect(button).toHaveJSProperty('tagName','BUTTON');const r=await button.boundingBox();expect(r.width).toBe(64);expect(r.height).toBe(64);expect(844-r.y-r.height).toBeCloseTo(390*.35,0);expect(390-r.x-r.width).toBeCloseTo(390*.05,0);
 await button.click();await expect(button).toHaveAttribute('aria-expanded','true');const opened=await button.boundingBox();expect(opened).toEqual(r);for(const a of await page.locator('#navArea .inner a').all()){const b=await a.boundingBox();expect(b.width).toBeGreaterThanOrEqual(44);expect(b.height).toBeGreaterThanOrEqual(44);}await page.keyboard.press('Escape');await expect(button).toBeFocused();
 await page.locator('#category-header').click();for(const item of await page.locator('#category-menu [data-category]:visible').all()){const b=await item.boundingBox();expect(b.height).toBeGreaterThanOrEqual(44);}expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('Navigation UX compact reload history and all six destinations',async({page},info)=>{
 test.skip(info.project.name!=='desktop-1440');test.setTimeout(90000);await prepare(page);
 const paths=['/website/','/website/gallery.html','/website/biography.html','/website/artist-statement.html','/website/order.html','/website/contact.html'];
 for(let i=0;i<6;i++){
  await page.goto('order.html');await page.evaluate(()=>scrollTo({top:innerHeight*.6,behavior:'instant'}));await expect(page.locator('#navArea')).toHaveClass(/is-compact/);await page.reload();await expect(page.locator('#navArea')).toHaveClass(/is-compact/);await page.locator('.toggle_btn').click();await page.locator('#navArea .inner a').nth(i).click();await expect.poll(()=>new URL(page.url()).pathname).toBe(paths[i]);
  if(i!==4){await page.goBack();await expect(page.locator('#navArea')).not.toHaveClass(/open/);await expect(page.locator('.toggle_btn')).toBeVisible();}
 }
});

test('Navigation UX 125 and 200 percent equivalent reflow',async({browser},info)=>{
 test.skip(info.project.name!=='desktop-1440');test.setTimeout(120000);
 for(const scale of [1.25,2])for(const physicalWidth of [1920,1440,1280,1024]){
  const width=Math.floor(physicalWidth/scale),height=Math.floor(900/scale),context=await browser.newContext({baseURL:info.project.use.baseURL,viewport:{width,height},deviceScaleFactor:scale,reducedMotion:'reduce'}),page=await context.newPage();await prepare(page);
  for(const route of ['biography.html','artist-statement.html','information.html','order.html','policy.html','exhibitions/yurayura/']){await page.goto(route);await page.evaluate(()=>scrollTo({top:innerHeight*1.2,behavior:'instant'}));const button=page.locator('.toggle_btn');await expect(button).toBeVisible();const b=await button.boundingBox();expect(b.width).toBeGreaterThanOrEqual(44);expect(b.height).toBeGreaterThanOrEqual(44);await button.click();await expect(button).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');await expect(button).toBeFocused();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
  await context.close();
 }
});

test('Navigation UX language controls retain click and keyboard behavior',async({page},info)=>{
 test.skip(info.project.name==='tablet-768');await prepare(page);await page.goto('order.html');const ja=page.locator('#langChange label[for="langJa"]'),en=page.locator('#langChange label[for="langEn"]');
 for(const label of [ja,en]){const r=await label.boundingBox();expect(r.width).toBeGreaterThanOrEqual(44);expect(r.height).toBeGreaterThanOrEqual(44);}
 await en.focus();await page.keyboard.press('Enter');await expect(en).toHaveAttribute('aria-pressed','true');expect(await page.evaluate(()=>window.getPortfolioLanguage())).toBe('en');await ja.focus();await page.keyboard.press('Space');await expect(ja).toHaveAttribute('aria-pressed','true');expect(await page.evaluate(()=>window.getPortfolioLanguage())).toBe('ja');
 if(info.project.name==='desktop-1440')await page.evaluate(()=>scrollTo({top:innerHeight*.6,behavior:'instant'}));await page.locator('.toggle_btn').click();if(info.project.name==='desktop-1440')await expect(page.locator('#langChange')).toBeVisible();else await expect(page.locator('#langChange')).toBeHidden();await page.keyboard.press('Escape');await expect(page.locator('#langChange')).toBeVisible();
});

test('Standalone Information and exhibition links have usable hit areas',async({page},info)=>{
 test.setTimeout(120000); // Six route/viewport combinations, each in both languages.
 test.skip(info.project.name!=='desktop-1440','One dedicated responsive and language matrix.');await prepare(page);
 for(const width of [1920,1024,390])for(const route of ['information.html','exhibitions/yurayura/']){
  await page.setViewportSize({width,height:900});await page.goto(route);
  for(const language of ['Ja','En']){
   await page.locator('#langChange label[for="lang'+language+'"]').click();
   const links=page.locator('a.info-link:visible,.info-link>a:visible,.detail-link:visible,.back-link:visible');expect(await links.count()).toBeGreaterThan(0);
   for(const link of await links.all()){
    await link.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));const r=await link.boundingBox();expect(r.width).toBeGreaterThanOrEqual(44);expect(r.height).toBeGreaterThanOrEqual(44);
    expect(await link.evaluate(e=>{const r=e.getBoundingClientRect(),h=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return e===h||e.contains(h);})).toBe(true);
   }
  }
 }
});
