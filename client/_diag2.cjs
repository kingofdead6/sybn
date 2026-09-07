const puppeteer=require('puppeteer');
(async()=>{const b=await puppeteer.launch({headless:'new'});const p=await b.newPage();
await p.emulateMediaFeatures([{name:'prefers-color-scheme',value:'light'}]);
await p.setViewport({width:1440,height:1000});
await p.goto('http://localhost:5173/about',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1600));
const at=async(lbl)=>console.log(lbl, await p.evaluate(()=>{
  const li=[...document.querySelectorAll('ol li')];
  return li.slice(0,2).map(e=>({op:getComputedStyle(e).opacity, top:Math.round(e.getBoundingClientRect().top)}));
}));
await at('initial   :');
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
await new Promise(r=>setTimeout(r,1500));
await at('scrolled  :');
await b.close()})();
