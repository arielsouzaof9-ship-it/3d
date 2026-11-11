// PERSONAGENS MAD: gera todos os personagens stick em SVG + folhas de elenco (HTML/PNG).
//   node mad/gerar.mjs
// Saída: mad/svg/*.svg, mad/catalogo.json e as folhas mad/*.html
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.dirname(new URL(import.meta.url).pathname);
import { stick, PELE, LINHA } from './stick.mjs';

// ---------- Elenco ----------
const ELENCO = [
  { id: 'nina-bebe', nome: 'Nina (bebê)', k: { tipo: 'bebe', pele: PELE.morena, roupa: '#f6b8c8', cabelo: 'bebe', corCabelo: '#2a1a12', rosto: 'dormindo', braco: 'palma', numero: '1', corNumero: '#e9e3d6' } },
  { id: 'nina-crianca', nome: 'Nina (criança)', k: { tipo: 'crianca', pele: PELE.morena, roupa: '#f2c94c', calca: '#2f5fa8', sapato: '#d8352f', cabelo: 'rabo', corCabelo: '#2a1a12', rosto: 'triste', braco: 'baixo', numero: '1', corNumero: '#e9e3d6' } },
  { id: 'nina-bombeira', nome: 'Nina (bombeira)', k: { tipo: 'adulto', pele: PELE.morena, roupa: '#c8452e', calca: '#2b2b30', colete: '#f2c94c', cabelo: 'rabo', corCabelo: '#2a1a12', chapeu: 'capacete', corChapeu: '#f2c94c', rosto: 'confiante', braco: 'continencia', lanterna: true } },
  { id: 'rafael-bebe', nome: 'Rafael (bebê)', k: { tipo: 'bebe', pele: PELE.clara, roupa: '#9cc3e6', cabelo: 'bebe', corCabelo: '#3a2416', rosto: 'feliz', braco: 'palma', numero: '1.000.000' } },
  { id: 'rafael-crianca', nome: 'Rafael (criança)', k: { tipo: 'crianca', pele: PELE.clara, roupa: '#26262c', calca: '#26262c', gravata: '#c22a2a', cabelo: 'topete', corCabelo: '#3a2416', rosto: 'feliz', braco: 'acena' } },
  { id: 'rafael-empresario', nome: 'Rafael (empresário)', k: { tipo: 'adulto', pele: PELE.clara, roupa: '#26262c', calca: '#26262c', gravata: '#c22a2a', cabelo: 'topete', corCabelo: '#3a2416', rosto: 'confiante', braco: 'palma', numero: '1.000.000' } },
  { id: 'mae-nina', nome: 'Mãe da Nina', k: { tipo: 'adulto', pele: PELE.morena, roupa: '#2fa36b', calca: '#2c3346', cabelo: 'longo', corCabelo: '#1f140e', rosto: 'triste', braco: 'baixo' } },
  { id: 'pai-rafael', nome: 'Pai do Rafael', k: { tipo: 'adulto', pele: PELE.clara, roupa: '#6d7480', calca: '#4f5560', gravata: '#a3242a', cabelo: 'curto', corCabelo: '#2b2421', oculos: true, rosto: 'feliz', braco: 'acena' } },
  { id: 'mae-rafael', nome: 'Mãe do Rafael', k: { tipo: 'adulto', pele: PELE.clara, roupa: '#2f4f8f', saia: '#2f4f8f', cabelo: 'chanel', corCabelo: '#c8572b', rosto: 'feliz', braco: 'cintura' } },
  { id: 'fotografo', nome: 'Fotógrafo', k: { tipo: 'adulto', pele: PELE.escura, roupa: '#3d5fcf', calca: '#2c3346', cabelo: 'crespo', corCabelo: '#1a120c', chapeu: 'bone', corChapeu: '#e5484d', rosto: 'surpreso', braco: 'palma', camera: true } },
  { id: 'vo-zuza', nome: 'Vó (visita)', k: { tipo: 'idoso', pele: PELE.clara, roupa: '#7b5aa6', saia: '#5b467e', cabelo: 'coque', corCabelo: '#d6d6d6', oculos: true, rosto: 'surpreso', braco: 'baixo', bolsa: true } },
  { id: 'mae-bebe', nome: 'Mãe do bebê', k: { tipo: 'adulto', pele: PELE.media, roupa: '#4fb3b6', calca: '#4fb3b6', cabelo: 'chanel', corCabelo: '#1a1410', rosto: 'chorando', braco: 'colo' } },
  { id: 'colega-1', nome: 'Colega da escola', k: { tipo: 'crianca', pele: PELE.media, roupa: '#3aa14a', calca: '#2f5fa8', cabelo: 'curto', corCabelo: '#3a2416', chapeu: 'touca', corChapeu: '#2f6fb3', rosto: 'feliz', braco: 'acena' } },
  { id: 'colega-2', nome: 'Colega da escola', k: { tipo: 'crianca', pele: PELE.escura, roupa: '#7b5aa6', calca: '#2c3346', cabelo: 'crespo', corCabelo: '#120c08', rosto: 'feliz', braco: 'cintura' } },
  { id: 'colega-3', nome: 'Colega da escola', k: { tipo: 'crianca', pele: PELE.clara, roupa: '#e5484d', saia: '#e5484d', cabelo: 'chanel', corCabelo: '#d9b56a', rosto: 'feliz', braco: 'baixo' } },
  { id: 'vizinho', nome: 'Comprador', k: { tipo: 'idoso', pele: PELE.media, roupa: '#f2efe6', calca: '#4a4f3e', cabelo: 'careca', corCabelo: '#e6e6e6', bigode: true, rosto: 'assustado', braco: 'baixo' } },
];

// Expressões da Nina e do Rafael (adultos) para trocar durante o vídeo.
const ROSTOS = ['neutro', 'feliz', 'triste', 'chorando', 'surpreso', 'assustado', 'confiante', 'dormindo'];

fs.mkdirSync(path.join(DIR, 'svg'), { recursive: true });
for (const c of ELENCO) fs.writeFileSync(path.join(DIR, 'svg', `${c.id}.svg`), stick(c.k));
for (const e of ROSTOS) {
  const nina = ELENCO.find((c) => c.id === 'nina-bombeira').k;
  const rafa = ELENCO.find((c) => c.id === 'rafael-empresario').k;
  fs.writeFileSync(path.join(DIR, 'svg', `nina-rosto-${e}.svg`), stick({ ...nina, rosto: e, braco: 'baixo', lanterna: false }));
  fs.writeFileSync(path.join(DIR, 'svg', `rafael-rosto-${e}.svg`), stick({ ...rafa, rosto: e, braco: 'baixo', numero: undefined }));
}

const card = (svg, nome) => `<figure>${svg}<figcaption>${nome}</figcaption></figure>`;
const head = (k, e) => {
  const s = stick({ ...k, rosto: e, braco: 'baixo', numero: undefined, lanterna: false });
  return `<figure class="mini">${s.replace('viewBox="0 0 360 520"', 'viewBox="95 70 170 170"').replace('width="360" height="520"', 'width="120" height="120"')}<figcaption>${e}</figcaption></figure>`;
};
const nina = ELENCO.find((c) => c.id === 'nina-bombeira').k;
const rafa = ELENCO.find((c) => c.id === 'rafael-empresario').k;
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Elenco stick</title><style>
body{margin:0;background:#f6efe2;font-family:"Arial Black",Arial,sans-serif;color:#2a2230;padding:40px 48px}
h1{margin:0 0 4px;font-size:46px} p{margin:0 0 24px;font-family:Arial;font-size:18px;color:#6a5a50}
h2{font-size:24px;margin:28px 0 8px}
.grid{display:grid;grid-template-columns:repeat(8,1fr);gap:10px}
figure{margin:0;background:#fff;border-radius:18px;padding:8px 4px 10px;text-align:center;box-shadow:0 2px 0 #e2d6c2}
figure svg{width:100%;height:auto}
figcaption{font-size:15px;margin-top:2px}
.row{display:grid;grid-template-columns:repeat(8,1fr);gap:10px}
.mini svg{width:100%;height:auto}.mini figcaption{font-family:Arial;font-size:13px;font-weight:700}
</style></head><body>
<h1>O Número da Palma: elenco stick</h1>
<p>Cabeça redonda, rosto simples, camiseta colorida, braços e pernas de palito. Cada personagem também está em SVG na pasta <b>svg/</b>.</p>
<div class="grid">${ELENCO.map((c) => card(stick(c.k), c.nome)).join('')}</div>
<h2>Expressões: Nina</h2><div class="row">${ROSTOS.map((e) => head(nina, e)).join('')}</div>
<h2>Expressões: Rafael</h2><div class="row">${ROSTOS.map((e) => head(rafa, e)).join('')}</div>
</body></html>`;
fs.writeFileSync(path.join(DIR, 'elenco.html'), html);
console.log(`ok: ${ELENCO.length} personagens + ${ROSTOS.length * 2} expressões em ${path.join(DIR, 'svg')}`);

// ============================================================================
// Elenco extra: estilos variados no mesmo modelo stick.
// ============================================================================
const P2 = { ...PELE, muitoEscura: '#4e2f1e', rosada: '#f3cdb8' };
const ESTILOS = [
  { id: 'medica', nome: 'Médica', k: { tipo: 'adulto', pele: P2.media, roupa: '#4fb3b6', jaleco: '#ffffff', calca: '#4fb3b6', cabelo: 'coque', corCabelo: '#3a2416', estetoscopio: true, item: 'prancheta', rosto: 'feliz', braco: 'baixo' } },
  { id: 'policial', nome: 'Policial', k: { tipo: 'adulto', corpo: 'alto', pele: P2.escura, roupa: '#1f2f5c', calca: '#1a2547', cabelo: 'curto', corCabelo: '#120c08', chapeu: 'quepe', corChapeu: '#1f2f5c', peito: 'distintivo', rosto: 'confiante', braco: 'cintura' } },
  { id: 'chef', nome: 'Chef de cozinha', k: { tipo: 'adulto', corpo: 'gordo', pele: P2.clara, roupa: '#ffffff', avental: '#e5484d', calca: '#2a2a2e', cabelo: 'curto', corCabelo: '#3a2416', bigode: true, chapeu: 'chef', corChapeu: '#ffffff', item: 'pizza', rosto: 'feliz', braco: 'palma' } },
  { id: 'professor', nome: 'Professor', k: { tipo: 'idoso', pele: P2.clara, roupa: '#8a6a4a', colete: undefined, calca: '#4a4f3e', cabelo: 'careca', corCabelo: '#d6d6d6', barba: true, corBarba: '#d6d6d6', oculos: true, item: 'livro', rosto: 'neutro', braco: 'palma', gravata: '#2f4f8f' } },
  { id: 'estudante', nome: 'Estudante', k: { tipo: 'crianca', pele: P2.media, roupa: '#ffffff', estampa: 'listras', estampaCor: '#3d8bfd', calca: '#2c3346', cabelo: 'franja', corCabelo: '#2a1a12', mochila: '#e5484d', item: 'livro', rosto: 'feliz', braco: 'palma', sapato: '#f2f2f2' } },
  { id: 'roqueiro', nome: 'Roqueiro', k: { tipo: 'adulto', corpo: 'magro', pele: P2.clara, roupa: '#1a1a1e', calca: '#2c3346', cabelo: 'moicano', corCabelo: '#e5484d', oculosEscuros: true, item: 'violao', rosto: 'confiante', braco: 'colo', peito: 'raio', peitoCor: '#e5484d' } },
  { id: 'rapper', nome: 'Rapper', k: { tipo: 'adulto', pele: P2.muitoEscura, roupa: '#f2c94c', capuz: '#f2c94c', calca: '#2c3346', cabelo: 'curto', corCabelo: '#120c08', chapeu: 'bone-tras', corChapeu: '#1a1a1e', colar: '#f2c94c', item: 'microfone', rosto: 'confiante', braco: 'acena', sapato: '#ffffff' } },
  { id: 'atleta', nome: 'Jogador de futebol', k: { tipo: 'adulto', corpo: 'alto', pele: P2.morena, roupa: '#2fa36b', peito: '10', calca: '#ffffff', short: true, cabelo: 'afro', corCabelo: '#1a120c', item: 'bola', rosto: 'feliz', braco: 'palma', sapato: '#f2c94c' } },
  { id: 'rei', nome: 'Rei', k: { tipo: 'adulto', corpo: 'gordo', pele: P2.rosada, roupa: '#7b2fa6', capa: '#c8252e', calca: '#4a2a66', cabelo: 'curto', corCabelo: '#9a6a3a', barba: true, chapeu: 'coroa', item: 'espada', rosto: 'confiante', braco: 'palma', colar: '#f2c94c' } },
  { id: 'princesa', nome: 'Princesa', k: { tipo: 'adulto', pele: P2.media, roupa: '#f28fb0', saia: '#f28fb0', vestido: true, cabelo: 'longo', corCabelo: '#2a1a12', chapeu: 'coroa', item: 'flor', rosto: 'feliz', braco: 'acena' } },
  { id: 'heroi', nome: 'Super-herói', k: { tipo: 'adulto', corpo: 'alto', pele: P2.clara, roupa: '#2f6fd8', calca: '#2f6fd8', capa: '#e5484d', mascara: '#e5484d', cabelo: 'topete', corCabelo: '#1a1410', peito: 'estrela', rosto: 'confiante', braco: 'cintura', sapato: '#e5484d' } },
  { id: 'magico', nome: 'Mágico', k: { tipo: 'adulto', corpo: 'magro', pele: P2.clara, roupa: '#1a1a1e', calca: '#1a1a1e', gravata: '#c22a2a', cabelo: 'curto', corCabelo: '#1a1410', bigode: true, chapeu: 'cartola', corChapeu: '#1a1a1e', capa: '#5b1f6e', item: 'varinha', rosto: 'confiante', braco: 'acena' } },
  { id: 'cientista', nome: 'Cientista maluco', k: { tipo: 'idoso', pele: P2.clara, roupa: '#8fb7d9', jaleco: '#ffffff', calca: '#3b4250', cabelo: 'espetado', corCabelo: '#eeeeee', oculos: true, item: 'tubo', rosto: 'assustado', braco: 'palma' } },
  { id: 'fazendeiro', nome: 'Fazendeiro', k: { tipo: 'adulto', corpo: 'gordo', pele: P2.media, roupa: '#c8452e', estampa: 'xadrez', estampaCor: '#3a1a18', calca: '#3d5fcf', cabelo: 'curto', corCabelo: '#3a2416', barba: true, chapeu: 'palha', corChapeu: '#e8c87a', rosto: 'feliz', braco: 'cintura', sapato: '#6b4a2e' } },
  { id: 'influencer', nome: 'Influencer', k: { tipo: 'adulto', pele: P2.clara, roupa: '#f28fb0', calca: '#ffffff', cabelo: 'rabo', corCabelo: '#e8c240', oculosEscuros: true, item: 'celular', rosto: 'feliz', braco: 'palma', peito: 'coracao', peitoCor: '#ffffff' } },
  { id: 'gamer', nome: 'Gamer', k: { tipo: 'adulto', corpo: 'baixo', pele: P2.media, roupa: '#5b3fa6', capuz: '#5b3fa6', calca: '#2c3346', cabelo: 'franja', corCabelo: '#2a1a12', chapeu: 'fone', corChapeu: '#2fe0a6', item: 'controle', rosto: 'surpreso', braco: 'colo' } },
  { id: 'turista', nome: 'Turista na praia', k: { tipo: 'adulto', corpo: 'gordo', pele: P2.rosada, roupa: '#3dc4d8', estampa: 'florido', estampaCor: '#ffffff', calca: '#f2c94c', short: true, cabelo: 'careca', corCabelo: '#9a6a3a', oculosEscuros: true, chapeu: 'palha', corChapeu: '#f2e0a8', item: 'celular', rosto: 'feliz', braco: 'palma', sapato: '#e5484d' } },
  { id: 'ladrao', nome: 'Ladrão', k: { tipo: 'adulto', corpo: 'magro', pele: P2.clara, roupa: '#ffffff', estampa: 'listras', estampaCor: '#1a1a1e', calca: '#1a1a1e', cabelo: 'curto', corCabelo: '#1a1410', chapeu: 'gorro', corChapeu: '#1a1a1e', mascara: '#1a1a1e', item: 'saco', rosto: 'confiante', braco: 'baixo' } },
  { id: 'pintora', nome: 'Pintora', k: { tipo: 'adulto', pele: P2.escura, roupa: '#f2c94c', avental: '#ffffff', calca: '#2f5fa8', cabelo: 'afro', corCabelo: '#120c08', chapeu: 'boina', corChapeu: '#c8252e', item: 'pincel', item2: 'paleta', rosto: 'feliz', braco: 'palma' } },
  { id: 'menina-trancas', nome: 'Menina de tranças', k: { tipo: 'crianca', pele: P2.muitoEscura, roupa: '#e5484d', estampa: 'bolinhas', estampaCor: '#ffffff', saia: '#e5484d', cabelo: 'trancas', corCabelo: '#120c08', item: 'flor', rosto: 'feliz', braco: 'acena' } },
  { id: 'menino-bone', nome: 'Menino de boné', k: { tipo: 'crianca', pele: P2.clara, roupa: '#3aa14a', peito: '7', calca: '#2f5fa8', short: true, cabelo: 'curto', corCabelo: '#c8572b', chapeu: 'bone', corChapeu: '#e5484d', item: 'bola', rosto: 'feliz', braco: 'palma' } },
  { id: 'vovo-bengala', nome: 'Vovô de bengala', k: { tipo: 'idoso', corpo: 'baixo', pele: P2.morena, roupa: '#f2efe6', colete: undefined, calca: '#6b5a44', cabelo: 'careca', corCabelo: '#e6e6e6', bigode: true, chapeu: 'boina', corChapeu: '#6b5a44', oculos: true, item2: 'bengala', rosto: 'feliz', braco: 'baixo' } },
  { id: 'executiva', nome: 'Executiva', k: { tipo: 'adulto', corpo: 'alto', pele: P2.morena, roupa: '#2c3346', calca: '#2c3346', cabelo: 'chanel', corCabelo: '#1a1410', colar: '#e9e3d6', item: 'maleta', rosto: 'confiante', braco: 'baixo', sapato: '#c22a2a' } },
  { id: 'cavaleiro', nome: 'Cavaleiro', k: { tipo: 'adulto', pele: P2.clara, roupa: '#a9b0bc', calca: '#7c8494', capa: '#2f4f8f', cabelo: 'curto', corCabelo: '#c8572b', peito: 'estrela', peitoCor: '#2f4f8f', item: 'espada', rosto: 'confiante', braco: 'palma', barba: true } },
];
for (const c of ESTILOS) fs.writeFileSync(path.join(DIR, 'svg', `${c.id}.svg`), stick(c.k));
const html2 = html
  .replace('<title>Elenco stick</title>', '<title>Estilos stick</title>')
  .replace(/<h1>[\s\S]*<\/body>/, `<h1>Elenco stick: estilos variados</h1>
<p>${ESTILOS.length} personagens novos no mesmo modelo: corpos (alto, baixo, magro, gordo), cabelos, chapéus, estampas e objetos.</p>
<div class="grid">${ESTILOS.map((c) => card(stick(c.k), c.nome)).join('')}</div>
</body>`);
fs.writeFileSync(path.join(DIR, 'estilos.html'), html2);
console.log(`ok: ${ESTILOS.length} personagens de estilos variados`);

// ============================================================================
// Elenco extra 2: mais personagens.
// ============================================================================
const MAIS = [
  { id: 'astronauta', nome: 'Astronauta', k: { tipo: 'adulto', pele: P2.media, roupa: '#f4f4f6', calca: '#f4f4f6', mochila: '#c9ccd4', cabelo: 'curto', corCabelo: '#2a1a12', chapeu: 'astronauta', peito: 'estrela', peitoCor: '#3d8bfd', item: 'bandeira', rosto: 'surpreso', braco: 'palma', sapato: '#9aa0aa' } },
  { id: 'pirata', nome: 'Pirata', k: { tipo: 'adulto', corpo: 'gordo', pele: P2.clara, roupa: '#ffffff', estampa: 'listras', estampaCor: '#c22a2a', calca: '#2c3346', cabelo: 'curto', corCabelo: '#1a1410', barba: true, chapeu: 'pirata', corChapeu: '#1a1a1e', tapaOlho: true, item: 'espada', rosto: 'confiante', braco: 'palma', sapato: '#6b4a2e' } },
  { id: 'palhaco', nome: 'Palhaço', k: { tipo: 'adulto', pele: '#fff4ea', roupa: '#f2c94c', estampa: 'bolinhas', estampaCor: '#e5484d', calca: '#3d8bfd', cabelo: 'afro', corCabelo: '#ff7a2f', nariz: '#e5484d', item: 'balao', rosto: 'feliz', braco: 'acena', sapato: '#e5484d', gravata: '#2fa36b' } },
  { id: 'enfermeiro', nome: 'Enfermeiro', k: { tipo: 'adulto', pele: P2.escura, roupa: '#3aa17a', calca: '#3aa17a', cabelo: 'curto', corCabelo: '#120c08', chapeu: 'touca', corChapeu: '#3aa17a', estetoscopio: true, item: 'prancheta', rosto: 'feliz', braco: 'baixo', sapato: '#ffffff' } },
  { id: 'pedreiro', nome: 'Pedreiro', k: { tipo: 'adulto', corpo: 'gordo', pele: P2.morena, roupa: '#3d5fcf', colete: '#ff8a2f', calca: '#4a4f3e', cabelo: 'curto', corCabelo: '#2a1a12', bigode: true, chapeu: 'capacete', corChapeu: '#ff8a2f', item: 'martelo', rosto: 'confiante', braco: 'palma', sapato: '#6b4a2e' } },
  { id: 'carteiro', nome: 'Carteiro', k: { tipo: 'adulto', pele: P2.clara, roupa: '#f2c94c', calca: '#2f5fa8', cabelo: 'curto', corCabelo: '#c8572b', chapeu: 'bone', corChapeu: '#2f5fa8', bolsa: true, item: 'carta', rosto: 'feliz', braco: 'palma' } },
  { id: 'entregador', nome: 'Entregador', k: { tipo: 'adulto', corpo: 'magro', pele: P2.muitoEscura, roupa: '#e5484d', calca: '#2c3346', mochila: '#e5484d', cabelo: 'curto', corCabelo: '#120c08', chapeu: 'bone', corChapeu: '#e5484d', item: 'caixa', rosto: 'feliz', braco: 'palma', sapato: '#ffffff' } },
  { id: 'garcom', nome: 'Garçom', k: { tipo: 'adulto', corpo: 'alto', pele: P2.media, roupa: '#ffffff', calca: '#1a1a1e', gravata: '#1a1a1e', avental: '#1a1a1e', cabelo: 'vampiro', corCabelo: '#2a1a12', bigode: true, item: 'bandeja', rosto: 'confiante', braco: 'palma' } },
  { id: 'juiza', nome: 'Juíza', k: { tipo: 'adulto', pele: P2.escura, roupa: '#ffffff', jaleco: '#1a1a1e', calca: '#1a1a1e', cabelo: 'coque', corCabelo: '#d6d6d6', oculos: true, item: 'malhete', rosto: 'confiante', braco: 'palma' } },
  { id: 'detetive', nome: 'Detetive', k: { tipo: 'adulto', corpo: 'alto', pele: P2.clara, roupa: '#ffffff', jaleco: '#c8a36a', calca: '#5a4a3a', gravata: '#5a3a22', cabelo: 'curto', corCabelo: '#3a2416', chapeu: 'fedora', corChapeu: '#7a5a3a', item: 'lupa', rosto: 'confiante', braco: 'palma' } },
  { id: 'cowboy', nome: 'Caubói', k: { tipo: 'adulto', pele: P2.media, roupa: '#c8452e', estampa: 'xadrez', estampaCor: '#ffffff', colete: undefined, calca: '#3d5fcf', cabelo: 'curto', corCabelo: '#3a2416', bigode: true, chapeu: 'cowboy', corChapeu: '#a8743a', item: 'laco', rosto: 'feliz', braco: 'palma', sapato: '#6b4a2e', colar: '#e5484d' } },
  { id: 'ninja', nome: 'Ninja', k: { tipo: 'adulto', corpo: 'magro', pele: P2.clara, roupa: '#1a1a1e', calca: '#1a1a1e', cabelo: 'nenhum', ninja: '#1a1a1e', item: 'espada', rosto: 'confiante', braco: 'palma' } },
  { id: 'bruxa', nome: 'Bruxa', k: { tipo: 'idoso', pele: '#b9e0a5', roupa: '#5b3fa6', saia: '#5b3fa6', vestido: true, cabelo: 'longo', corCabelo: '#e6e6e6', chapeu: 'bruxa', corChapeu: '#2a1a3a', nariz: '#9ccf86', item2: 'vassoura', rosto: 'confiante', braco: 'baixo' } },
  { id: 'vampiro', nome: 'Vampiro', k: { tipo: 'adulto', corpo: 'alto', pele: '#eef0f6', roupa: '#1a1a1e', calca: '#1a1a1e', capa: '#8a1a24', gravata: '#8a1a24', cabelo: 'vampiro', corCabelo: '#120c08', presas: true, rosto: 'confiante', braco: 'cintura' } },
  { id: 'zumbi', nome: 'Zumbi', k: { tipo: 'adulto', pele: '#9cc48a', roupa: '#7a8a9a', calca: '#5a4a6a', cabelo: 'curto', corCabelo: '#3a3a2a', curativo: true, rosto: 'assustado', braco: 'colo' } },
  { id: 'noiva', nome: 'Noiva', k: { tipo: 'adulto', pele: P2.morena, roupa: '#ffffff', saia: '#ffffff', vestido: true, cabelo: 'coque', corCabelo: '#2a1a12', chapeu: 'veu', item: 'buque', rosto: 'feliz', braco: 'palma' } },
  { id: 'noivo', nome: 'Noivo', k: { tipo: 'adulto', pele: P2.clara, roupa: '#26262c', calca: '#26262c', gravata: '#1a1a1e', cabelo: 'topete', corCabelo: '#c8572b', colar: undefined, rosto: 'feliz', braco: 'acena' } },
  { id: 'bailarina', nome: 'Bailarina', k: { tipo: 'crianca', pele: P2.clara, roupa: '#f6b8c8', tutu: '#f6b8c8', cabelo: 'coque', corCabelo: '#e8c240', rosto: 'feliz', braco: 'acena', sapato: '#f6b8c8' } },
  { id: 'skatista', nome: 'Skatista', k: { tipo: 'adulto', corpo: 'magro', pele: P2.media, roupa: '#2fa36b', capuz: '#2fa36b', calca: '#c9a86a', short: true, cabelo: 'franja', corCabelo: '#2a1a12', chapeu: 'bone-tras', corChapeu: '#e5484d', item: 'skate', rosto: 'confiante', braco: 'palma', sapato: '#1a1a1e' } },
  { id: 'surfista', nome: 'Surfista', k: { tipo: 'adulto', corpo: 'alto', pele: P2.morena, roupa: '#3dc4d8', estampa: 'florido', estampaCor: '#f2c94c', calca: '#f2c94c', short: true, cabelo: 'longo', corCabelo: '#e8c240', item: 'prancha', rosto: 'feliz', braco: 'baixo', sapato: P2.morena } },
  { id: 'dj', nome: 'DJ', k: { tipo: 'adulto', pele: P2.escura, roupa: '#1a1a1e', peito: 'raio', peitoCor: '#2fe0a6', calca: '#2c3346', cabelo: 'afro', corCabelo: '#120c08', chapeu: 'fone', corChapeu: '#2fe0a6', oculosEscuros: true, item: 'disco', rosto: 'feliz', braco: 'palma', colar: '#f2c94c' } },
  { id: 'menino-balao', nome: 'Menino com balão', k: { tipo: 'crianca', corpo: 'baixo', pele: P2.muitoEscura, roupa: '#f2c94c', calca: '#e5484d', short: true, cabelo: 'crespo', corCabelo: '#120c08', item: 'balao', rosto: 'feliz', braco: 'palma', sapato: '#3d8bfd' } },
  { id: 'vovo-trico', nome: 'Vovó', k: { tipo: 'idoso', corpo: 'gordo', pele: P2.media, roupa: '#e5a3c0', estampa: 'florido', estampaCor: '#ffffff', saia: '#7b5aa6', cabelo: 'coque', corCabelo: '#e6e6e6', oculos: true, item: 'flor', rosto: 'feliz', braco: 'palma' } },
  { id: 'aluna', nome: 'Aluna', k: { tipo: 'crianca', pele: P2.clara, roupa: '#ffffff', saia: '#2f4f8f', cabelo: 'trancas', corCabelo: '#c8572b', mochila: '#7b5aa6', oculos: true, item: 'livro', rosto: 'feliz', braco: 'palma' } },
];
for (const c of MAIS) fs.writeFileSync(path.join(DIR, 'svg', `${c.id}.svg`), stick(c.k));
fs.writeFileSync(path.join(DIR, 'mais.html'), html
  .replace('<title>Elenco stick</title>', '<title>Mais personagens stick</title>')
  .replace(/<h1>[\s\S]*<\/body>/, `<h1>Elenco stick: mais personagens</h1>
<p>${MAIS.length} personagens novos: fantasia, aventura, profissões, festas e esportes.</p>
<div class="grid">${MAIS.map((c) => card(stick(c.k), c.nome)).join('')}</div>
</body>`));
console.log(`ok: ${MAIS.length} personagens extras`);

// ============================================================================
// Elenco extra 3: ainda mais personagens.
// ============================================================================
const EXTRA3 = [
  { id: 'papai-noel', nome: 'Papai Noel', k: { tipo: 'idoso', corpo: 'gordo', pele: P2.rosada, roupa: '#d23a3a', calca: '#d23a3a', cinto: '#1a1a1e', cabelo: 'curto', corCabelo: '#ffffff', barba: true, corBarba: '#ffffff', chapeu: 'noel', item: 'presentes', rosto: 'feliz', braco: 'palma', sapato: '#1a1a1e' } },
  { id: 'fada', nome: 'Fada', k: { tipo: 'crianca', pele: P2.clara, roupa: '#9be3c8', tutu: '#9be3c8', asas: '#d4f0ff', cabelo: 'longo', corCabelo: '#e8c240', chapeu: 'veu', item: 'varinha', rosto: 'feliz', braco: 'acena', sapato: '#9be3c8' } },
  { id: 'anjo', nome: 'Anjo', k: { tipo: 'crianca', pele: P2.media, roupa: '#ffffff', saia: '#ffffff', vestido: true, asas: '#ffffff', aureola: true, cabelo: 'crespo', corCabelo: '#e8c240', item: 'harpa', rosto: 'feliz', braco: 'palma' } },
  { id: 'diabinho', nome: 'Diabinho', k: { tipo: 'crianca', pele: '#f08070', roupa: '#c22a2a', calca: '#c22a2a', cabelo: 'curto', corCabelo: '#1a1410', chifres: '#7a1a1a', item2: 'tridente', rosto: 'confiante', braco: 'baixo', sapato: '#1a1a1e' } },
  { id: 'robo', nome: 'Robô', k: { tipo: 'adulto', pele: '#c9ccd4', roupa: '#9aa0aa', calca: '#7c8494', cabelo: 'nenhum', robo: true, peito: 'raio', peitoCor: '#2fe0a6', rosto: 'surpreso', braco: 'acena', sapato: '#5a606a' } },
  { id: 'alien', nome: 'Alienígena', k: { tipo: 'adulto', corpo: 'magro', pele: '#8fe08a', roupa: '#5b3fa6', calca: '#5b3fa6', cabelo: 'nenhum', antenas: '#f2c94c', peito: 'estrela', peitoCor: '#f2c94c', rosto: 'surpreso', braco: 'acena', sapato: '#2a1a3a' } },
  { id: 'mumia', nome: 'Múmia', k: { tipo: 'adulto', pele: '#efe4c8', roupa: '#efe4c8', estampa: 'listras', estampaCor: '#d8caa6', calca: '#e3d6b4', cabelo: 'nenhum', mumia: true, rosto: 'assustado', braco: 'colo', sapato: '#d8caa6' } },
  { id: 'mergulhador', nome: 'Mergulhador', k: { tipo: 'adulto', pele: P2.media, roupa: '#1a1a1e', calca: '#1a1a1e', mochila: '#f2c94c', cabelo: 'curto', corCabelo: '#2a1a12', mergulho: '#f2c94c', rosto: 'feliz', braco: 'acena', sapato: '#3dc4d8' } },
  { id: 'piloto', nome: 'Piloto de avião', k: { tipo: 'adulto', corpo: 'alto', pele: P2.escura, roupa: '#ffffff', jaleco: '#1f2f5c', calca: '#1f2f5c', gravata: '#1f2f5c', cabelo: 'curto', corCabelo: '#d6d6d6', bigode: true, chapeu: 'piloto', corChapeu: '#1f2f5c', oculosEscuros: true, item: 'maleta', rosto: 'confiante', braco: 'baixo' } },
  { id: 'aeromoca', nome: 'Comissária de bordo', k: { tipo: 'adulto', pele: P2.clara, roupa: '#2f4f8f', saia: '#2f4f8f', cabelo: 'coque', corCabelo: '#c8572b', colar: '#e5484d', item: 'bandeja', rosto: 'feliz', braco: 'palma', sapato: '#2f4f8f' } },
  { id: 'marinheiro', nome: 'Marinheiro', k: { tipo: 'adulto', pele: P2.morena, roupa: '#ffffff', calca: '#ffffff', gravata: '#2f4f8f', cabelo: 'curto', corCabelo: '#1a120c', chapeu: 'marinheiro', corChapeu: '#ffffff', rosto: 'feliz', braco: 'continencia', sapato: '#1a1a1e' } },
  { id: 'mecanico', nome: 'Mecânico', k: { tipo: 'adulto', corpo: 'gordo', pele: P2.clara, roupa: '#3d5fcf', calca: '#3d5fcf', cabelo: 'curto', corCabelo: '#3a2416', bigode: true, chapeu: 'bone', corChapeu: '#e5484d', item: 'chave', rosto: 'confiante', braco: 'palma', curativo: true } },
  { id: 'padeiro', nome: 'Padeiro', k: { tipo: 'adulto', corpo: 'baixo', pele: P2.media, roupa: '#ffffff', avental: '#e8c87a', calca: '#5a4a3a', cabelo: 'curto', corCabelo: '#2a1a12', bigode: true, chapeu: 'chef', corChapeu: '#ffffff', item: 'pao', rosto: 'feliz', braco: 'palma' } },
  { id: 'sorveteira', nome: 'Sorveteira', k: { tipo: 'adulto', pele: P2.morena, roupa: '#f6b8c8', estampa: 'listras', estampaCor: '#ffffff', calca: '#3dc4d8', short: true, cabelo: 'rabo', corCabelo: '#2a1a12', chapeu: 'viseira', corChapeu: '#3dc4d8', item: 'sorvete', rosto: 'feliz', braco: 'palma', sapato: '#ffffff' } },
  { id: 'jardineira', nome: 'Jardineira', k: { tipo: 'adulto', pele: P2.escura, roupa: '#f2c94c', avental: '#2fa36b', calca: '#2fa36b', cabelo: 'trancas', corCabelo: '#120c08', chapeu: 'palha', corChapeu: '#e8c87a', item: 'regador', rosto: 'feliz', braco: 'palma', sapato: '#6b4a2e' } },
  { id: 'pescador', nome: 'Pescador', k: { tipo: 'idoso', pele: P2.morena, roupa: '#6b8a5a', colete: undefined, calca: '#3d5fcf', cabelo: 'curto', corCabelo: '#d6d6d6', barba: true, corBarba: '#d6d6d6', chapeu: 'bucket', corChapeu: '#c9a86a', item: 'vara', rosto: 'feliz', braco: 'palma', sapato: '#3a3a2a' } },
  { id: 'dentista', nome: 'Dentista', k: { tipo: 'adulto', pele: P2.clara, roupa: '#8fd0e0', jaleco: '#ffffff', calca: '#8fd0e0', cabelo: 'chanel', corCabelo: '#1a1410', mascaraCirurgica: '#bfe6ff', item: 'escova', rosto: 'feliz', braco: 'palma' } },
  { id: 'cabeleireira', nome: 'Cabeleireira', k: { tipo: 'adulto', pele: P2.media, roupa: '#1a1a1e', avental: '#f28fb0', calca: '#1a1a1e', cabelo: 'chanel', corCabelo: '#b05ad9', item: 'tesoura', rosto: 'confiante', braco: 'palma', colar: '#f2c94c' } },
  { id: 'boxeador', nome: 'Boxeador', k: { tipo: 'adulto', corpo: 'alto', pele: P2.muitoEscura, roupa: '#ffffff', calca: '#c22a2a', short: true, cinto: '#f2c94c', cabelo: 'nenhum', luvas: '#d23a3a', rosto: 'confiante', braco: 'cintura', sapato: '#ffffff' } },
  { id: 'tenista', nome: 'Tenista', k: { tipo: 'adulto', pele: P2.clara, roupa: '#ffffff', saia: '#ffffff', cabelo: 'rabo', corCabelo: '#e8c240', chapeu: 'viseira', corChapeu: '#2fa36b', item: 'raquete', rosto: 'confiante', braco: 'palma', sapato: '#ffffff' } },
  { id: 'corredora', nome: 'Corredora campeã', k: { tipo: 'adulto', corpo: 'magro', pele: P2.escura, roupa: '#ff8a2f', peito: '1', calca: '#1a1a1e', short: true, cabelo: 'afro', corCabelo: '#120c08', medalha: true, rosto: 'feliz', braco: 'acena', sapato: '#3dc4d8' } },
  { id: 'cadeirante', nome: 'Cadeirante', k: { tipo: 'adulto', pele: P2.media, roupa: '#3d8bfd', calca: '#2c3346', cadeira: '#5a606a', cabelo: 'franja', corCabelo: '#3a2416', rosto: 'feliz', braco: 'acena', sapato: '#e5484d' } },
  { id: 'cantora', nome: 'Cantora', k: { tipo: 'adulto', pele: P2.morena, roupa: '#b05ad9', estampa: 'bolinhas', estampaCor: '#f2c94c', saia: '#b05ad9', vestido: true, cabelo: 'longo', corCabelo: '#2a1a12', colar: '#f2c94c', item: 'microfone', rosto: 'feliz', braco: 'palma' } },
  { id: 'bebe-chorando', nome: 'Bebê chorão', k: { tipo: 'bebe', pele: P2.clara, roupa: '#f2c94c', cabelo: 'bebe', corCabelo: '#c8572b', rosto: 'chorando' } },
];
for (const c of EXTRA3) fs.writeFileSync(path.join(DIR, 'svg', `${c.id}.svg`), stick(c.k));
fs.writeFileSync(path.join(DIR, 'extra.html'), html
  .replace('<title>Elenco stick</title>', '<title>Personagens extras stick</title>')
  .replace(/<h1>[\s\S]*<\/body>/, `<h1>Elenco stick: ainda mais personagens</h1>
<p>${EXTRA3.length} personagens novos: fantasia, profissões, esportes, festas e inclusão.</p>
<div class="grid">${EXTRA3.map((c) => card(stick(c.k), c.nome)).join('')}</div>
</body>`));
console.log(`ok: ${EXTRA3.length} personagens extras (3)`);

// ---------- Catálogo (usado pelo README e pela exportação PNG) ----------
const grupos = [['O Número da Palma', ELENCO], ['Estilos variados', ESTILOS], ['Mais personagens', MAIS], ['Ainda mais personagens', EXTRA3]];
const catalogo = grupos.flatMap(([g, l]) => l.map((c) => ({ id: c.id, nome: c.nome, grupo: g })));
fs.writeFileSync(path.join(DIR, 'catalogo.json'), JSON.stringify(catalogo, null, 2));
console.log(`ok: catalogo.json com ${catalogo.length} personagens`);
