// Prévias de "O Número da Palma (mad)": node tools/stills-palma.mjs [quadros] [escala]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root = path.resolve(import.meta.dirname, '..');

const tl = (await import(pathToFileURL(path.join(root, 'src', 'mad', 'timeline-palma.ts')).href)).TL_PALMA;
const ini = tl.LINES.map((_, i) => (i === 0 ? 0 : tl.W(i, 0)));
const fim = [...ini.slice(1), tl.END];
const frames = process.argv[2] ? process.argv[2].split(',').map(Number) : ini.map((a, i) => Math.round((a + (fim[i] - a) * 0.75) * 30));
const out = path.join(root, 'out', 'stills-palma');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'index.ts') });
const composition = await selectComposition({ serveUrl, id: 'NumeroPalmaMad' });
for (const f of frames) await renderStill({ composition, serveUrl, frame: f, output: path.join(out, `f${String(f).padStart(5, '0')}.jpg`), scale: Number(process.argv[3] ?? 0.25), imageFormat: 'jpeg', jpegQuality: 80 });
console.log('ok', frames.length);
