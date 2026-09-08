import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const base = path.resolve('docs');
const tabs = await (await fetch('http://127.0.0.1:9227/json')).json();
const tab = tabs.find(t => t.type === 'page');
if (!tab) throw new Error('No browser page');
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let sequence = 0;
const pending = new Map();
ws.onmessage = ({data}) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const {resolve, reject} = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
  }
};
function call(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, {resolve, reject});
    ws.send(JSON.stringify({id, method, params}));
  });
}
await call('Page.enable');
await call('Emulation.setDeviceMetricsOverride', {width:1000,height:1300,deviceScaleFactor:1,mobile:false});
await call('Page.navigate', {url:pathToFileURL(path.join(base,'mygov-concept.html')).href});
await call('Runtime.evaluate', {expression:'document.fonts.ready.then(() => true)',awaitPromise:true});
const check = await call('Runtime.evaluate', {expression:`JSON.stringify(Array.from(document.querySelectorAll('.page')).map((p,i)=>{const r=p.getBoundingClientRect(), f=p.querySelector('.foot').getBoundingClientRect(); const children=Array.from(p.children).filter(c=>!c.classList.contains('foot'));const bottom=Math.max(...children.map(c=>c.getBoundingClientRect().bottom));return {page:i+1,contentBottom:Math.round(bottom-r.top),footerTop:Math.round(f.top-r.top),overflow:bottom>f.top-8,scrollOverflow:p.scrollHeight>p.clientHeight+1, text:p.innerText.length};}))`,returnByValue:true});
const pages = JSON.parse(check.result.value);
console.log(JSON.stringify({pages:pages.length,issues:pages.filter(p=>p.overflow||p.scrollOverflow),totalCharacters:pages.reduce((s,p)=>s+p.text,0)},null,2));
await fs.writeFile(path.join(base,'mygov-pdf-validation.json'),JSON.stringify(pages,null,2));
if (pages.some(p=>p.overflow||p.scrollOverflow)) {ws.close();process.exitCode=1;} else {
  const pdf = await call('Page.printToPDF',{printBackground:true,preferCSSPageSize:true,displayHeaderFooter:false,generateTaggedPDF:true,generateDocumentOutline:true});
  await fs.writeFile(path.join(base,'Permit-Portal-myGov-Texniki-Konseptual-Sened-AZ.pdf'),Buffer.from(pdf.data,'base64'));
  for (const pageNumber of [1,7,18,24,26,32,38]) {
    const rect = await call('Runtime.evaluate',{expression:`(()=>{const r=document.querySelectorAll('.page')[${pageNumber-1}].getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()`,returnByValue:true});
    const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:rect.result.value});
    await fs.writeFile(path.join(base,`mygov-preview-${pageNumber}.png`),Buffer.from(shot.data,'base64'));
  }
  console.log('PDF and preview images generated.');
  ws.close();
}
