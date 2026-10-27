const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const routes=['','gallery.html','biography.html','artist-statement.html','information.html','order.html','contact.html','policy.html','exhibitions/yurayura/','404.html'];
async function prepare(page){
 await page.route('**/__preview/yurayura-events.json*',r=>r.fulfill({contentType:'application/json',body:'[]'}));
 await page.route('https://code.jquery.com/jquery-3.7.1.min.js',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.resolve(__dirname,'../../docs/js/jquery-3.7.1.min.js'),'utf8')}));
 for(const pattern of ['https://fonts.googleapis.com/**','https://fonts.gstatic.com/**','https://use.typekit.net/**','https://p.typekit.net/**'])await page.route(pattern,r=>r.fulfill({contentType:r.request().resourceType()==='stylesheet'?'text/css':'application/octet-stream',body:''}));
}
for(const route of routes)test('Shared desktop navigation / standard background '+(route||'Home'),async({page})=>{
 await prepare(page);await page.emulateMedia({reducedMotion:"reduce"});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(route);await page.addStyleTag({path:path.resolve(__dirname,'stabilize.css')});
 await expect(page.locator('#navArea nav')).toBeAttached();
 await expect(page.locator('[data-static-primary-navigation], [data-static-footer]')).toHaveCount(0);
 if(route)await expect(page.locator('#footer-container footer')).toHaveCount(1);
 const nav=page.locator('#navArea nav'),toggle=page.locator('.toggle_btn');
 if(page.viewportSize().width>=1024){
  await expect(nav).toBeVisible();await expect(toggle).toBeHidden();
  for(const link of await page.locator('#navArea .inner a').all()){
   await expect(link).toBeVisible();const b=await link.boundingBox();expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(page.viewportSize().width+1);
   await link.focus();await expect(link).toBeFocused();
  }
  await expect(page.locator('header [aria-current="page"]')).toHaveCount(['information.html','policy.html','exhibitions/yurayura/','404.html'].includes(route)?0:1);
  if(!route){const header=await page.locator('header').boundingBox();const creator=await page.locator('.back__slide.active .creator').boundingBox();expect(creator.y).toBeGreaterThanOrEqual(header.y+header.height);}

 }else{
  await expect(nav).toHaveAttribute('inert','');await toggle.focus();await page.keyboard.press('Enter');
  await expect(page.locator('#navArea')).toHaveClass(/open/);await expect(nav).not.toHaveAttribute('inert','');
  await page.keyboard.press('Escape');await expect(toggle).toBeFocused();await expect(nav).toHaveAttribute('inert','');
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 if(route){
  expect(await page.locator('main').evaluate(e=>Number(getComputedStyle(e).zIndex))).toBeGreaterThan(await page.locator('#portfolio-overlay-animation').evaluate(e=>Number(getComputedStyle(e).zIndex)));
  await expect(page.locator('html')).toHaveAttribute('data-background-accent','trunkSphere');await expect(page.locator('#selected-ink-field-canvas')).toHaveCount(1);await expect(page.locator('#portfolio-overlay-animation .organic-flow-canvas')).toHaveCount(1);await expect(page.locator('#vanta-bg-bio canvas')).toHaveCount(0);}
 expect(errors).toEqual([]);
});
test('Every standard background mounts once and responds to Reduced Motion',async({page},info)=>{
 test.skip(info.project.name!=='desktop-1440','Shared lifecycle runs once.');test.setTimeout(120000);await prepare(page);
 for(const route of routes.filter(Boolean)){
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(route);
  await expect(page.locator('#vanta-bg-bio canvas')).toHaveCount(1);await expect(page.locator('#portfolio-overlay-animation .organic-flow-canvas')).toHaveCount(1);
  await page.evaluate(()=>window.__PORTFOLIO_BACKGROUND_ACCENTS__.mountTrunkSphere());await expect(page.locator('#vanta-bg-bio canvas')).toHaveCount(1);
  await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('#vanta-bg-bio canvas')).toHaveCount(0);
 }
});
test('Common-source static fallback supports JavaScript-disabled navigation',async({browser},info)=>{
 test.skip(!['desktop-1440','mobile-390'].includes(info.project.name),'Fallback checked at desktop and mobile.');
 const c=await browser.newContext({javaScriptEnabled:false,viewport:info.project.use.viewport});const p=await c.newPage();
 for(const route of routes){await p.goto(route);const nav=p.locator('[data-static-primary-navigation]');await expect(nav).toBeVisible();await expect(nav.locator('a')).toHaveCount(6);await nav.locator('a[href="/website/gallery.html"]').click();await expect(p).toHaveURL(/gallery\.html$/);}
 await c.close();
});

test('Fixed desktop header leaves Biography anchor headings visible',async({page})=>{
 test.skip(page.viewportSize().width<1024,'Desktop fixed-header clearance only.');
 await prepare(page);await page.emulateMedia({reducedMotion:'reduce'});await page.goto('biography.html');
 await page.addStyleTag({path:path.resolve(__dirname,'stabilize.css')});
 for(const href of ['#biography-overview','#career-timeline','#biography-records','#full-biography']){
  await page.locator('.reading-nav a[href="'+href+'"]').click();
  const target=await page.locator(href).boundingBox(),header=await page.locator('header').boundingBox();
  expect(target.y).toBeGreaterThanOrEqual(header.y+header.height);
 }
});

// Cross the tablet/desktop breakpoint without leaving focus or scroll locks behind.
test('Navigation resize restores focusability and unlocked scrolling',async({page})=>{
 await prepare(page);await page.emulateMedia({reducedMotion:'reduce'});await page.goto('biography.html');
 await page.setViewportSize({width:900,height:900});
 const nav=page.locator('#navArea nav'),toggle=page.locator('.toggle_btn');
 await expect(nav).toHaveAttribute('inert','');
 await toggle.focus();await page.keyboard.press('Space');await expect(page.locator('#navArea')).toHaveClass(/open/);
 await page.setViewportSize({width:1024,height:900});
 await expect(nav).not.toHaveAttribute('inert','');await expect(toggle).toBeHidden();
 await expect(page.locator('#navArea')).not.toHaveClass(/open/);
 expect(await page.evaluate(()=>[document.body,document.documentElement].every(e=>getComputedStyle(e).overflowY!=='hidden'))).toBe(true);
 await page.setViewportSize({width:1023,height:900});await expect(nav).toHaveAttribute('inert','');
 await nav.locator('a').first().evaluate(e=>e.focus());await expect(nav.locator('a').first()).not.toBeFocused();
 await toggle.focus();await page.keyboard.press('Enter');await page.keyboard.press('Escape');await expect(toggle).toBeFocused();
});

test('Standard backgrounds recover from persisted lifecycle events without duplicate canvases',async({page},info)=>{
 test.skip(info.project.name!=='desktop-1440','Lifecycle runs once, all nine standard routes.');
 test.setTimeout(120000);await prepare(page);
 for(const route of routes.filter(Boolean)){
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(route);
  await expect(page.locator('#vanta-bg-bio canvas')).toHaveCount(1);
  await page.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});
  await expect(page.locator('#vanta-bg-bio canvas')).toHaveCount(1);
  await expect(page.locator('#selected-ink-field-canvas')).toHaveCount(1);
  await expect(page.locator('#portfolio-overlay-animation .organic-flow-canvas')).toHaveCount(1);
  await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('#vanta-bg-bio canvas')).toHaveCount(0);
 }
});

test('Editorial desktop header keeps six single-color links inside 1200px',async({page},info)=>{
 test.skip(info.project.name!=='desktop-1440','Desktop width audit runs once.');
 test.setTimeout(90000);await prepare(page);
 const labels=['Top','ArtIndex','Biography','Artist Statement','Order','Contact'];
 const paths=['/website/','/website/gallery.html','/website/biography.html','/website/artist-statement.html','/website/order.html','/website/contact.html'];
 for(const width of [1024,1280,1440,1920])for(const route of ['','gallery.html']){
  await page.setViewportSize({width,height:900});await page.goto(route);
  await page.addStyleTag({path:path.resolve(__dirname,'stabilize.css')});
  const links=page.locator('#navArea .inner a');await expect(links).toHaveText(labels);
  const inner=await page.locator('.header-inner').boundingBox();expect(inner.width).toBeLessThanOrEqual(1200);expect(Math.abs(inner.x-(width-inner.width)/2)).toBeLessThan(1);
  const states=await links.evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {href:e.href,x:r.x,y:r.y,width:r.width,image:s.backgroundImage,mask:s.maskImage,fill:s.webkitTextFillColor,color:s.color,shadow:s.textShadow}}));
  let lastRight=0,top;
  for(let i=0;i<labels.length;i++){
   const cs=states[i];expect(new URL(cs.href).pathname).toBe(paths[i]);
   expect(cs.x).toBeGreaterThanOrEqual(lastRight);lastRight=cs.x+cs.width;top??=cs.y;expect(cs.y).toBeCloseTo(top,0);
   expect(cs.image).toBe('none');expect(cs.mask).toBe('none');expect(cs.fill).toBe(cs.color);expect(cs.shadow).toBe('none');
  }
  const first=links.first();await first.focus();expect(await first.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
  await first.hover();expect(await first.evaluate(e=>getComputedStyle(e).textDecorationLine)).toContain('underline');
  expect(lastRight).toBeLessThanOrEqual(inner.x+inner.width);if(route)await expect(page.locator('#footer-container a[href$="information.html"]')).toHaveCount(1);
 }
});
test('Mobile bilingual reading flow keeps titles artwork and anchors separate',async({page},info)=>{
 test.skip(info.project.name!=='mobile-390','Reading width audit runs once.');test.setTimeout(120000);await prepare(page);
 for(const width of [320,375,390,430,768])for(const route of ['biography.html','artist-statement.html']){
  await page.setViewportSize({width,height:900});await page.goto(route);await page.addStyleTag({path:path.resolve(__dirname,'stabilize.css')});
  const title=await page.locator('.h1-text').boundingBox(),image=await page.locator('.state-img').boundingBox(),content=await page.locator('#state .content').boundingBox();
  if(width<600){expect(title.y+title.height).toBeLessThanOrEqual(image.y);expect(image.y+image.height).toBeLessThan(content.y);expect(content.x).toBeGreaterThanOrEqual(24);expect(content.x+content.width).toBeLessThanOrEqual(width-24);}
  for(const link of await page.locator('.reading-nav a').all()){
   const b=await link.boundingBox();expect(b.height).toBeGreaterThanOrEqual(44);await link.click();
   const href=await link.getAttribute('href'),target=page.locator(href);const box=await target.boundingBox();expect(box.y).toBeGreaterThanOrEqual(64);await expect(target).toBeFocused();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(route==='artist-statement.html')await expect(page.locator('.timeline-item')).toHaveCount(5);
 }
});
