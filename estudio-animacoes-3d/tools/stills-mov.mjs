// Prévias da demonstração de movimentos: um quadro no meio de cada movimento.
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const frames = process.argv[2].split(',').map(Number);
const out = path.join(root, 'out', 'stills-mov');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'index.ts') });
const composition = await selectComposition({ serveUrl, id: 'MovimentosMad' });
for (const f of frames) {
  const o = path.join(out, `f${String(f).padStart(5, '0')}.jpg`);
  await renderStill({ composition, serveUrl, frame: f, output: o, scale: Number(process.argv[3] ?? 0.25), imageFormat: 'jpeg', jpegQuality: 80 });
}
console.log('ok');
