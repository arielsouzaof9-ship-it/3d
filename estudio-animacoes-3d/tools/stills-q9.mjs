// Prévias de "O Quarto Nove": node tools/stills-q9.mjs <parte 1|2|3> [quadros] [escala]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root = path.resolve(import.meta.dirname, '..');
const parte = process.argv[2] ?? '1';
const tl = (await import(pathToFileURL(path.join(root, 'src', 'mad', 'timeline-q9.ts')).href))[`TL${parte}`];
const ini = tl.LINES.map((_, i) => (i === 0 ? 0 : tl.W(i, 0)));
const fim = [...ini.slice(1), tl.END];
const frames = process.argv[3] ? process.argv[3].split(',').map(Number) : ini.map((a, i) => Math.round((a + (fim[i] - a) * 0.75) * 30));
const out = path.join(root, 'out', `stills-q9-${parte}`);
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'index.ts') });
const composition = await selectComposition({ serveUrl, id: `QuartoNove${parte}` });
for (const f of frames) await renderStill({ composition, serveUrl, frame: f, output: path.join(out, `f${String(f).padStart(5, '0')}.jpg`), scale: Number(process.argv[4] ?? 0.25), imageFormat: 'jpeg', jpegQuality: 80 });
console.log('ok', frames.length);
