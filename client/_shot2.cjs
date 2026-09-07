const puppeteer=require('puppeteer');
(async()=>{const b=await puppeteer.launch({headless:'new'});const p=await b.newPage();
await p.emulateMediaFeatures([{name:'prefers-color-scheme',value:process.env.THEME||'light'}]);
const W=parseInt(process.env.W||'1440',10);
await p.setViewport({width:W,height:1000});
p.on('pageerror',e=>console.log('PAGE ERROR:',e.message));
await p.goto(process.env.URL_,{waitUntil:'networkidle0',timeout:60000});
await new Promise(r=>setTimeout(r,1300));
// Walk the page so every reveal fires, then return to the top before capturing.
await p.evaluate(async()=>{await new Promise(res=>{let y=0;const t=setInterval(()=>{y+=400;window.scrollTo(0,y);
  if(y>=document.body.scrollHeight){clearInterval(t);res()}},60)})});
await new Promise(r=>setTimeout(r,1200));
await p.evaluate(()=>window.scrollTo(0,0));
await new Promise(r=>setTimeout(r,500));
const i=await p.evaluate((vw)=>{const bad=[];document.querySelectorAll('*').forEach(el=>{
 const r=el.getBoundingClientRect();if(r.width===0)return;
 if(r.right>vw+1||r.left<-1){const c=(el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className||'').toString();
 if(!c.includes('skip-link'))bad.push(c.slice(0,45))}});
 let faded=0;document.querySelectorAll('section *').forEach(el=>{if(el.getBoundingClientRect().width>0&&+getComputedStyle(el).opacity<0.99)faded++});
 return{docW:document.documentElement.scrollWidth,vw,bad:bad.slice(0,4),faded,h:document.body.scrollHeight}},W);
console.log(JSON.stringify(i));
await p.screenshot({path:process.env.OUT,fullPage:true});
await b.close()})();
