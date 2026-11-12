// Gera um quadro da composição ElencoArticulado (uso: node still-elenco.mjs quadro saida.png escala)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
const root = '/home/user/3d/estudio-animacoes-3d';
const serveUrl = await bundle({ entryPoint: root + '/src/index.ts' });
const composition = await selectComposition({ serveUrl, id: 'ElencoArticulado' });
await renderStill({ composition, serveUrl, frame: Number(process.argv[2]), output: process.argv[3], scale: Number(process.argv[4] ?? 1), imageFormat: 'png' });
console.log('ok');
