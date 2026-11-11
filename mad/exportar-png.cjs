// Exporta cada SVG de mad/svg para PNG com fundo transparente (mad/png) e
// renderiza as folhas de elenco (mad/*.png).   node mad/exportar-png.cjs
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 360, height: 520 }, deviceScaleFactor: 2 });
  fs.mkdirSync(path.join(DIR, 'png'), { recursive: true });
  const svgs = fs.readdirSync(path.join(DIR, 'svg')).filter((f) => f.endsWith('.svg'));
  for (const f of svgs) {
    await p.setContent(`<html><body style="margin:0;background:transparent">${fs.readFileSync(path.join(DIR, 'svg', f), 'utf8')}</body></html>`);
    await p.locator('svg').screenshot({ path: path.join(DIR, 'png', f.replace('.svg', '.png')), omitBackground: true });
  }
  const s = await b.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 1 });
  for (const h of ['elenco', 'estilos', 'mais', 'extra']) {
    await s.goto('file://' + path.join(DIR, `${h}.html`));
    await s.screenshot({ path: path.join(DIR, `${h}.png`), fullPage: true });
  }
  await b.close();
  console.log(`ok: ${svgs.length} PNGs em mad/png + 4 folhas`);
})();
