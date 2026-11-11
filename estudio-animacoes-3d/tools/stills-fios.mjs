// Prévias da animação "Fios Brancos" (personagens mad): um quadro no meio de cada cena.
//   node tools/stills-fios.mjs [quadros separados por vírgula] [escala]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root = path.resolve(import.meta.dirname, '..');
const { LINES, W, END, FPS } = await import(pathToFileURL(path.join(root, 'src', 'mad', process.env.TL || 'timeline-fios.ts')).href);
const ini = LINES.map((_, i) => (i === 0 ? 0 : W(i, 0)));
const fim = [...ini.slice(1), END];
const frames = process.argv[2] ? process.argv[2].split(',').map(Number) : ini.map((a, i) => Math.round((a + (fim[i] - a) * 0.75) * FPS));
const scale = Number(process.argv[3] ?? 0.25);
const out = path.join(root, 'out', 'stills-fios');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'index.ts') });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || 'FiosBrancos' });
for (const f of frames) {
  const o = path.join(out, `f${String(f).padStart(5, '0')}.jpg`);
  await renderStill({ composition, serveUrl, frame: f, output: o, scale, imageFormat: 'jpeg', jpegQuality: 80 });
  console.log(path.relative(root, o));
}
