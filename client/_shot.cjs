const puppeteer=require('puppeteer');
(async()=>{const b=await puppeteer.launch({headless:'new'});const p=await b.newPage();
await p.emulateMediaFeatures([{name:'prefers-color-scheme',value:'light'}]);
await p.setViewport({width:parseInt(process.env.W||'1440',10),height:1000});
p.on('pageerror',e=>console.log('PAGE ERROR:',e.message));
await p.goto(process.env.URL_,{waitUntil:'networkidle0',timeout:60000});
await new Promise(r=>setTimeout(r,1400));
const i=await p.evaluate((vw)=>{const bad=[];document.querySelectorAll('*').forEach(el=>{
 const r=el.getBoundingClientRect();if(r.width===0)return;
 if(r.right>vw+1||r.left<-1){const c=(el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className||'').toString();
 if(!c.includes('skip-link'))bad.push(c.slice(0,50))}});
 return{docW:document.documentElement.scrollWidth,vw,bad:bad.slice(0,4),h:document.body.scrollHeight}},parseInt(process.env.W||'1440',10));
console.log(JSON.stringify(i));
await p.screenshot({path:process.env.OUT,fullPage:true});
await b.close()})();
