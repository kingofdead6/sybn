const puppeteer=require('puppeteer');
(async()=>{const b=await puppeteer.launch({headless:'new'});const p=await b.newPage();
await p.emulateMediaFeatures([{name:'prefers-color-scheme',value:'light'}]);
await p.setViewport({width:1440,height:1000});
p.on('pageerror',e=>console.log('PAGE ERROR:',e.message));
p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE:',m.text().slice(0,200))});
await p.goto('http://localhost:5173/about',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1600));
console.log(await p.evaluate(()=>{
  const dd=[...document.querySelectorAll('dd')];
  const li=[...document.querySelectorAll('ol li')];
  return {
    ddCount:dd.length,
    ddText:dd.slice(0,3).map(e=>JSON.stringify(e.textContent)),
    ddOpacity:dd.slice(0,3).map(e=>getComputedStyle(e).opacity),
    liCount:li.length,
    liText:li.slice(0,2).map(e=>e.textContent.trim().slice(0,30)),
    liOpacity:li.slice(0,2).map(e=>getComputedStyle(e).opacity),
  };
}));
await b.close()})();
