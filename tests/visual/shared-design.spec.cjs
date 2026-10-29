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
  await page.evaluate(async()=>{scrollTo({top:innerHeight*1.1,behavior:'instant'});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))});
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

test('Editorial desktop header keeps six equal columns in a right-aligned fluid menu',async({page},info)=>{
 test.skip(info.project.name!=='desktop-1440','Desktop width audit runs once.');
 test.setTimeout(90000);await prepare(page);
 const labels=['Top','Art Index','Biography','Artist Statement','Order','Contact'];
 const paths=['/website/','/website/gallery.html','/website/biography.html','/website/artist-statement.html','/website/order.html','/website/contact.html'];
 for(const width of [1024,1280,1440,1600,1800,1920])for(const route of ['','gallery.html']){
  await page.setViewportSize({width,height:900});await page.goto(route);
  await page.addStyleTag({path:path.resolve(__dirname,'stabilize.css')});
  const links=page.locator('#navArea .inner a');await expect(links).toHaveText(labels);
  const inner=await page.locator('#navArea').boundingBox();expect(inner.width).toBeLessThanOrEqual(1200);expect(inner.x+inner.width).toBeCloseTo(width,0);if(width>=1440)expect(inner.width).toBeCloseTo(Math.min(1200,width*.25+720),0);
  const cells=await page.locator('#navArea .inner li').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().width));if(width>=1299)expect(Math.max(...cells)-Math.min(...cells)).toBeLessThan(1);
  const brand=await page.locator('header .head').boundingBox();expect(brand.x+brand.width).toBeLessThan(inner.x);
  const states=await links.evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {href:e.href,x:r.x,y:r.y,width:r.width,image:s.backgroundImage,mask:s.maskImage,fill:s.webkitTextFillColor,color:s.color,shadow:s.textShadow,size:s.fontSize}}));
  const centers=states.map(s=>s.x+s.width/2),steps=centers.slice(1).map((x,i)=>x-centers[i]);if(width>=1299)expect(Math.max(...steps)-Math.min(...steps)).toBeLessThan(1);else {const gaps=states.slice(1).map((s,i)=>s.x-states[i].x-states[i].width);expect(Math.max(...gaps)-Math.min(...gaps)).toBeLessThan(1);}
  let lastRight=0,top;
  for(let i=0;i<labels.length;i++){
   const cs=states[i];expect(new URL(cs.href).pathname).toBe(paths[i]);
   expect(cs.x).toBeGreaterThanOrEqual(lastRight);lastRight=cs.x+cs.width;top??=cs.y;expect(cs.y).toBeCloseTo(top,0);
   expect(cs.size).toBe('16px');expect(cs.image).toBe('none');expect(cs.mask).toBe('none');expect(cs.fill).toBe(cs.color);expect(cs.shadow).toBe('none');
  }
  const logo=page.locator('header .head a');
  await expect(logo).toHaveCSS('font-size','18px');
  await logo.hover();
  const ornament=await logo.evaluate(e=>{const r=e.getBoundingClientRect(),p=getComputedStyle(e,'::before');return {anchor:r.width,x:r.x,parentX:e.parentElement.getBoundingClientRect().x,pseudo:parseFloat(p.width),position:getComputedStyle(e).position}});
  expect(ornament.x).toBeCloseTo(ornament.parentX,0);expect(ornament.position).toBe('relative');expect(ornament.pseudo).toBeLessThanOrEqual(ornament.anchor*1.1+1);
  await logo.focus();expect(await logo.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
  const first=links.first();await first.focus();expect(await first.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
  await first.hover();expect(await first.evaluate(e=>getComputedStyle(e).textDecorationLine)).toContain('underline');
  expect(lastRight).toBeLessThanOrEqual(inner.x+inner.width);if(route)await expect(page.locator('#footer-container a[href$="information.html"]')).toHaveCount(1);
 }
});
test('Mobile bilingual reading flow keeps titles artwork and anchors separate',async({page},info)=>{
 test.skip(info.project.name!=='mobile-390','Reading width audit runs once.');test.setTimeout(120000);await prepare(page);
 for(const width of [320,375,390,430,768])for(const route of ['biography.html','artist-statement.html']){
  await page.setViewportSize({width,height:900});await page.goto(route);await page.addStyleTag({path:path.resolve(__dirname,'stabilize.css')});
  await page.waitForFunction(()=>{const e=document.querySelector('.h1-text h1.text');return !e||e.innerText.trim()===e.getAttribute('aria-label')&&!e.querySelector('.dud')});
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('.state-img img').evaluate(img=>img.complete?Promise.resolve():new Promise(resolve=>img.addEventListener('load',resolve,{once:true})));
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

// Desktop scroll navigation is threshold based, independent of direction.
test('Desktop scroll thresholds and in-page navigation preserve keyboard access',async({page},info)=>{
 test.setTimeout(180000);await prepare(page);
 const desktop=page.viewportSize().width>=1024;
 const withSidebar=['biography.html','artist-statement.html','information.html','order.html','policy.html','exhibitions/yurayura/'];
 const widths=desktop?[1024,1280,1440]:[page.viewportSize().width];
 for(const width of widths){
  await page.setViewportSize({width,height:900});
  for(const route of routes){
   await page.goto(route);await page.addStyleTag({path:path.resolve(__dirname,'stabilize.css')});await page.evaluate(()=>document.fonts.ready);await expect(page.locator('#navArea nav')).toHaveAttribute('aria-hidden',desktop?'false':'true');
   const side=page.locator('body > .page-navigation');
   for(const ratio of [0,0.5,0.6,0.9,1.1,0.6,0]){
    await page.evaluate(async r=>{document.activeElement?.blur();scrollTo({top:innerHeight*r,behavior:'instant'});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))},ratio);
    await expect.poll(()=>page.evaluate(d=>document.querySelector('#navArea nav').getAttribute('aria-hidden')===(d?String(scrollY>=innerHeight*0.55):'true'),desktop)).toBe(true);
    if(desktop&&withSidebar.includes(route)){
     await expect(side).toHaveCount(1);
     await expect.poll(()=>side.getAttribute('aria-hidden')).toBe(String(await page.evaluate(()=>scrollY<innerHeight)));
    }else await expect(side).toHaveCount(0);
   }
   if(desktop){
    await page.locator('#navArea .inner a').first().focus();await page.evaluate(async()=>{scrollTo({top:innerHeight*1.1,behavior:'instant'});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))});
    await expect(page.locator('#navArea nav')).toHaveAttribute('aria-hidden','false');
    await page.keyboard.press('Tab');await page.evaluate(()=>document.activeElement.blur());
    await expect(page.locator('#navArea nav')).toHaveAttribute('aria-hidden',String(await page.evaluate(()=>scrollY>=innerHeight*0.55)));
    if(withSidebar.includes(route)){
     await page.evaluate(async()=>{scrollTo({top:innerHeight*1.1,behavior:'instant'});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))});
     for(const link of await side.locator('a').all()){
      await page.evaluate(async()=>{scrollTo({top:innerHeight*1.1,behavior:'instant'});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))});await expect(link).toBeVisible();await expect(side).toHaveAttribute('aria-hidden','false');await link.focus();await expect(link, route+' at '+width).toBeFocused();await page.keyboard.press('Enter');
      const id=await link.getAttribute('href');await expect(page.locator(id)).toBeFocused();
      await expect.poll(()=>page.locator(id).evaluate(e=>Math.round(e.getBoundingClientRect().top))).toBeGreaterThanOrEqual(0);
     }
    }
   }
  }
 }
});


test('PC sidebar and right-aligned reading column share the available width',async({page},info)=>{
 test.skip(info.project.name!=='desktop-1440','Responsive geometry audit runs once.');test.setTimeout(240000);await prepare(page);
 const cases=[... [1920,1600,1440,1300,1299,1280,1024,768,390].map(width=>({width,height:900})),... [600,768,1080,1200].map(height=>({width:1024,height}))];
 for(const {width,height} of cases){
  await page.setViewportSize({width,height});
  for(const route of ['biography.html','artist-statement.html','information.html','order.html','policy.html','exhibitions/yurayura/']){
   await page.goto(route);await page.addStyleTag({path:path.resolve(__dirname,'stabilize.css')});
   const side=page.locator('body > .page-navigation');
   if(width<1024){await expect(side).toHaveCount(0);continue;}
   for(const lang of ['Ja','En']){
    const label=page.locator('label[for="lang'+lang+'"]');if(await label.isVisible())await label.click();
    await page.evaluate(async()=>{document.activeElement?.blur();scrollTo({top:innerHeight,behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});
    await expect(side).toHaveAttribute('aria-hidden','false');
    const layout=await side.evaluate(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n),intersects=b=>r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top;
     return {x:r.x,margin:parseFloat(s.marginLeft),left:s.left,width:r.width,maxWidth:parseFloat(s.maxWidth),overlap:[...document.querySelectorAll('main .content, main .state-img img')].some(e=>e.getClientRects().length&&intersects(e.getBoundingClientRect())),overflow:document.documentElement.scrollWidth>innerWidth+1,clipped:[...n.querySelectorAll('a')].some(e=>e.scrollWidth>e.clientWidth+1)};});
    expect(layout.x,route+' '+width+' '+lang).toBeCloseTo(Math.min(width,height)*(width<=1299?0.03:0.1),0);expect(layout.margin).toBeCloseTo(layout.x,0);expect(layout.left).toBe('0px');
    const columns=await page.locator('main .content:visible').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect();return {width:r.width,right:r.right,parentRight:p.right-parseFloat(getComputedStyle(e.parentElement).paddingRight),rightGap:innerWidth-r.right,gap:r.left-document.querySelector('body > .page-navigation').getBoundingClientRect().right,internal:[...e.querySelectorAll('.biography-section > h2,.biography-section > h3,.biography-section > p,.biography-section > table,.statement-section-heading,.work > p.state-txt,.order-lead,.history-table,.information-intro,.lead')].filter(t=>t.getClientRects().length).map(t=>{const q=t.getBoundingClientRect(),ts=getComputedStyle(t);return {left:q.left-r.left,padding:parseFloat(ts.paddingLeft),right:q.right-r.right};})};}));
    for(const c of columns){expect(c.width).toBeCloseTo(Math.max(800,Math.min(860,800+(width-1024)*60/896)),0);expect(c.right).toBeCloseTo(c.parentRight,0);expect(c.rightGap).toBeCloseTo(Math.min(width,height)*0.04,0);expect(c.gap).toBeGreaterThanOrEqual(23.9);for(const t of c.internal){expect(Math.abs(t.left)).toBeLessThan(1);expect(t.padding).toBe(0);expect(t.right).toBeLessThanOrEqual(1);}}
    expect(layout.width).toBeLessThanOrEqual(layout.maxWidth+1);expect(layout.overlap,route+' '+width+' '+lang).toBe(false);expect(layout.overflow).toBe(false);expect(layout.clipped).toBe(false);
   }
  }
 }
});
