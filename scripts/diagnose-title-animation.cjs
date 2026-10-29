// Temporary Linux investigation: observe the unmodified public animation.
const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const {spawn}=require('node:child_process');
const out = path.resolve('test-results/title-diagnostic');
(async () => {
  fs.mkdirSync(out, {recursive:true});
  const server=spawn(process.execPath,['scripts/visual-server.cjs'],{stdio:'ignore'});
  for(let i=0;i<100;i++){if(await fetch('http://127.0.0.1:4173/website/').then(r=>r.ok).catch(()=>false))break;await new Promise(r=>setTimeout(r,100));}
  const browser = await chromium.launch();
  const results=[];
  try {
    for (const competing of [false,true]) {
      const competitor = competing ? await browser.newPage({viewport:{width:1440,height:900}, reducedMotion:'no-preference'}) : null;
      if (competitor) await competitor.goto('http://127.0.0.1:4173/website/biography.html', {waitUntil:'domcontentloaded'});
      for (const base of ['http://127.0.0.1:4173/website/','https://mizukioyama.github.io/website/']) {
        for (const motion of ['reduce','no-preference']) {
          const page = await browser.newPage({viewport:{width:1440,height:900},reducedMotion:motion});
          await page.addInitScript(() => {
            window.__titleProbe={samples:[],raf:0,mutations:0};
            const p=window.__titleProbe;
            const frame=()=>{p.raf++;requestAnimationFrame(frame);};requestAnimationFrame(frame);
            addEventListener('DOMContentLoaded',()=>{
              const original=TextScramble.prototype.setText;
              TextScramble.prototype.setText=function(text){
                const promise=original.call(this,text);
                promise.then(()=>{p.completed={ms:performance.now()-p.started,text:this.el.textContent,dud:this.el.querySelectorAll('.dud').length,raf:p.raf,mutations:p.mutations,visibility:document.visibilityState};});
                return promise;
              };
              const title=document.querySelector('.h1-text h1.text');
              p.started=performance.now();p.initial=title?.textContent;p.target=title?.getAttribute('aria-label');
              if (!title)return;
              new MutationObserver(()=>{p.mutations++;}).observe(title,{childList:true,subtree:true,characterData:true});
              setInterval(()=>{
                const sample={ms:performance.now()-p.started,text:title.textContent,dud:title.querySelectorAll('.dud').length,raf:p.raf,mutations:p.mutations,visibility:document.visibilityState,ink:window.__selectedInkField?.getState?.()?.frameCount};
                p.samples.push(sample);
              },100);
            });
          });
          for (const route of ['order.html','policy.html']) {
            await page.goto(base+route,{waitUntil:'domcontentloaded'});
            await page.waitForFunction(()=>window.__titleProbe?.completed,{timeout:30000}).catch(()=>{});
            const result={base,motion,competing,route,...await page.evaluate(()=>window.__titleProbe)};
            results.push(result);console.log('TITLE_DIAGNOSTIC '+JSON.stringify(result));
          }
          await page.close();
        }
      }
      if(competitor)await competitor.close();
    }
  } finally { await browser.close();server.kill();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2)); }
})();
