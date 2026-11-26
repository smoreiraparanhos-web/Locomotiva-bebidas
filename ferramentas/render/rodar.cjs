const { chromium } = require('playwright');
const fs = require('fs'); const http = require('http'); const path = require('path');
const raiz = __dirname;
const tipos = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript' };
const srv = http.createServer((q, r) => { const f = path.join(raiz, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': tipos[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }).listen(8765);
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const nomes = process.argv[2].split(','); const esc = process.argv[3] || '1'; const alfa = process.argv[4] === 'a';
  fs.mkdirSync(path.join(raiz, 'saida'), { recursive: true });
  for (const n of nomes) {
    const t0 = Date.now();
    const p = await b.newPage();
    p.on('console', m => { if (m.type() === 'error' || m.type()==='warning') console.log(n, m.type(), m.text().slice(0, 300)); });
    p.on('pageerror', e => console.log(n, 'ERRO', e.message));
    await p.goto(`http://localhost:8765/render.html?t=${n}&s=${esc}${alfa ? '&a=1' : ''}`);
    await p.waitForFunction(() => window.__pronto, null, { timeout: 600000 });
    const url = await p.evaluate(() => window.__pronto);
    fs.writeFileSync(path.join(raiz, 'saida', `${n}${alfa ? '-a' : ''}.png`), Buffer.from(url.split(',')[1], 'base64'));
    console.log(n, ((Date.now() - t0) / 1000).toFixed(1) + 's');
    await p.close();
  }
  await b.close(); srv.close();
})();
