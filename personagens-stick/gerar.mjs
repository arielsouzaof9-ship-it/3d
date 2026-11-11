// Gera os personagens "stick" de "O Número da Palma" em SVG + uma folha de elenco (HTML/PNG).
//   node personagens-stick/gerar.mjs
// Saída: personagens-stick/svg/*.svg, personagens-stick/elenco.html, personagens-stick/elenco.png
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.dirname(new URL(import.meta.url).pathname);
const LINHA = '#2a2230';
const PELE = { clara: '#f6e3d3', media: '#e2b48c', morena: '#b9805a', escura: '#7a4b30' };

// ---------- Rostos ----------
const rosto = (e, cx, cy, r) => {
  const ex = r * 0.34, ey = cy - r * 0.05, er = r * 0.075;
  const olhos = {
    feliz: `<path d="M${cx - ex - er * 1.6} ${ey + er} q${er * 1.6} ${-er * 2.4} ${er * 3.2} 0 M${cx + ex - er * 1.6} ${ey + er} q${er * 1.6} ${-er * 2.4} ${er * 3.2} 0" stroke="${LINHA}" stroke-width="${r * 0.06}" fill="none" stroke-linecap="round"/>`,
    triste: `<circle cx="${cx - ex}" cy="${ey + er}" r="${er}" fill="${LINHA}"/><circle cx="${cx + ex}" cy="${ey + er}" r="${er}" fill="${LINHA}"/><path d="M${cx - ex - er * 2} ${ey - er * 2.2} l${er * 3} ${-er * 1.2} M${cx + ex + er * 2} ${ey - er * 2.2} l${-er * 3} ${-er * 1.2}" stroke="${LINHA}" stroke-width="${r * 0.045}" stroke-linecap="round"/>`,
    surpreso: `<circle cx="${cx - ex}" cy="${ey}" r="${er * 1.7}" fill="#fff" stroke="${LINHA}" stroke-width="${r * 0.04}"/><circle cx="${cx + ex}" cy="${ey}" r="${er * 1.7}" fill="#fff" stroke="${LINHA}" stroke-width="${r * 0.04}"/><circle cx="${cx - ex}" cy="${ey}" r="${er * 0.8}" fill="${LINHA}"/><circle cx="${cx + ex}" cy="${ey}" r="${er * 0.8}" fill="${LINHA}"/>`,
    confiante: `<path d="M${cx - ex - er * 1.5} ${ey} h${er * 3} M${cx + ex - er * 1.5} ${ey} h${er * 3}" stroke="${LINHA}" stroke-width="${r * 0.06}" stroke-linecap="round"/><circle cx="${cx - ex + er * 0.4}" cy="${ey + er * 0.9}" r="${er * 0.8}" fill="${LINHA}"/><circle cx="${cx + ex + er * 0.4}" cy="${ey + er * 0.9}" r="${er * 0.8}" fill="${LINHA}"/>`,
    dormindo: `<path d="M${cx - ex - er * 1.5} ${ey} q${er * 1.5} ${er * 2} ${er * 3} 0 M${cx + ex - er * 1.5} ${ey} q${er * 1.5} ${er * 2} ${er * 3} 0" stroke="${LINHA}" stroke-width="${r * 0.05}" fill="none" stroke-linecap="round"/>`,
  };
  olhos.neutro = `<circle cx="${cx - ex}" cy="${ey}" r="${er}" fill="${LINHA}"/><circle cx="${cx + ex}" cy="${ey}" r="${er}" fill="${LINHA}"/>`;
  olhos.chorando = olhos.triste;
  olhos.assustado = olhos.surpreso;
  const my = cy + r * 0.32, mw = r * 0.22;
  const boca = {
    neutro: `<path d="M${cx - mw * 0.6} ${my} h${mw * 1.2}" stroke="${LINHA}" stroke-width="${r * 0.05}" stroke-linecap="round"/>`,
    feliz: `<path d="M${cx - mw} ${my - mw * 0.3} q${mw} ${mw * 1.4} ${mw * 2} 0 z" fill="${LINHA}"/><path d="M${cx - mw * 0.55} ${my + mw * 0.25} q${mw * 0.55} ${mw * 0.35} ${mw * 1.1} 0" fill="#e5737d"/>`,
    triste: `<path d="M${cx - mw * 0.8} ${my + mw * 0.4} q${mw * 0.8} ${-mw * 0.9} ${mw * 1.6} 0" stroke="${LINHA}" stroke-width="${r * 0.05}" fill="none" stroke-linecap="round"/>`,
    surpreso: `<ellipse cx="${cx}" cy="${my + mw * 0.1}" rx="${mw * 0.45}" ry="${mw * 0.6}" fill="${LINHA}"/>`,
    confiante: `<path d="M${cx - mw} ${my} q${mw * 1.2} ${mw * 0.9} ${mw * 2} ${-mw * 0.4}" stroke="${LINHA}" stroke-width="${r * 0.05}" fill="none" stroke-linecap="round"/>`,
    dormindo: `<path d="M${cx - mw * 0.5} ${my} q${mw * 0.5} ${mw * 0.5} ${mw} 0" stroke="${LINHA}" stroke-width="${r * 0.045}" fill="none" stroke-linecap="round"/>`,
    assustado: `<path d="M${cx - mw} ${my + mw * 0.2} l${mw * 0.4} ${-mw * 0.35} l${mw * 0.4} ${mw * 0.35} l${mw * 0.4} ${-mw * 0.35} l${mw * 0.4} ${mw * 0.35} l${mw * 0.4} ${-mw * 0.35}" stroke="${LINHA}" stroke-width="${r * 0.045}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`,
  };
  boca.chorando = boca.triste;
  const extra =
    (['feliz', 'neutro', 'dormindo', 'confiante'].includes(e) ? `<ellipse cx="${cx - ex - er * 1.2}" cy="${cy + r * 0.2}" rx="${r * 0.12}" ry="${r * 0.07}" fill="#f2a0a8" opacity="0.6"/><ellipse cx="${cx + ex + er * 1.2}" cy="${cy + r * 0.2}" rx="${r * 0.12}" ry="${r * 0.07}" fill="#f2a0a8" opacity="0.6"/>` : '') +
    (e === 'chorando' ? `<path d="M${cx - ex} ${ey + er * 2} q${-er} ${er * 4} 0 ${er * 5} q${er} ${-er} 0 ${-er * 5}" fill="#6ab7ff"/><path d="M${cx + ex} ${ey + er * 2} q${-er} ${er * 4} 0 ${er * 5} q${er} ${-er} 0 ${-er * 5}" fill="#6ab7ff"/>` : '') +
    (e === 'assustado' ? `<path d="M${cx + r * 0.75} ${cy - r * 0.6} q${-r * 0.12} ${r * 0.2} 0 ${r * 0.3} q${r * 0.12} ${-r * 0.1} 0 ${-r * 0.3}" fill="#9fd4ff"/>` : '');
  return olhos[e] + boca[e] + extra;
};

// ---------- Cabelos e chapéus (atrás = desenhado antes da cabeça) ----------
const cabelo = (tipo, cor, cx, cy, r) => {
  const s = `fill="${cor}" stroke="${LINHA}" stroke-width="${r * 0.05}"`;
  switch (tipo) {
    case 'curto': return { frente: `<path d="M${cx - r * 0.98} ${cy - r * 0.05} C${cx - r} ${cy - r * 1.25}, ${cx + r} ${cy - r * 1.25}, ${cx + r * 0.98} ${cy - r * 0.05} C${cx + r * 0.7} ${cy - r * 0.55}, ${cx - r * 0.2} ${cy - r * 0.62}, ${cx - r * 0.98} ${cy - r * 0.05} z" ${s}/>` };
    case 'topete': return { frente: `<path d="M${cx - r * 0.98} ${cy - r * 0.1} C${cx - r} ${cy - r * 1.2}, ${cx + r * 0.2} ${cy - r * 1.5}, ${cx + r * 0.98} ${cy - r * 0.1} C${cx + r * 0.6} ${cy - r * 0.5}, ${cx + r * 0.1} ${cy - r * 0.75}, ${cx - r * 0.3} ${cy - r * 0.55} C${cx - r * 0.6} ${cy - r * 0.45}, ${cx - r * 0.8} ${cy - r * 0.25}, ${cx - r * 0.98} ${cy - r * 0.1} z" ${s}/>` };
    case 'rabo': return {
      atras: `<path d="M${cx + r * 0.7} ${cy - r * 0.5} q${r * 0.9} ${r * 0.2} ${r * 0.75} ${r * 1.3} q${-r * 0.35} ${-r * 0.5} ${-r * 0.55} ${-r * 0.75} z" ${s}/>`,
      frente: `<path d="M${cx - r * 0.98} ${cy} C${cx - r * 1.05} ${cy - r * 1.25}, ${cx + r * 1.05} ${cy - r * 1.25}, ${cx + r * 0.98} ${cy} C${cx + r * 0.5} ${cy - r * 0.6}, ${cx - r * 0.5} ${cy - r * 0.6}, ${cx - r * 0.98} ${cy} z" ${s}/>`,
    };
    case 'longo': return {
      atras: `<path d="M${cx - r * 1.05} ${cy - r * 0.2} q${-r * 0.1} ${r * 1.2} ${r * 0.15} ${r * 1.6} h${r * 1.8} q${r * 0.25} ${-r * 0.4} ${r * 0.15} ${-r * 1.6} z" ${s}/>`,
      frente: `<path d="M${cx - r * 1.0} ${cy + r * 0.1} C${cx - r * 1.1} ${cy - r * 1.3}, ${cx + r * 1.1} ${cy - r * 1.3}, ${cx + r * 1.0} ${cy + r * 0.1} C${cx + r * 0.7} ${cy - r * 0.5}, ${cx + r * 0.1} ${cy - r * 0.55}, ${cx} ${cy - r * 0.7} C${cx - r * 0.1} ${cy - r * 0.55}, ${cx - r * 0.7} ${cy - r * 0.5}, ${cx - r * 1.0} ${cy + r * 0.1} z" ${s}/>`,
    };
    case 'coque': return {
      atras: `<circle cx="${cx}" cy="${cy - r * 1.05}" r="${r * 0.38}" ${s}/>`,
      frente: `<path d="M${cx - r * 0.98} ${cy - r * 0.05} C${cx - r} ${cy - r * 1.2}, ${cx + r} ${cy - r * 1.2}, ${cx + r * 0.98} ${cy - r * 0.05} C${cx + r * 0.6} ${cy - r * 0.6}, ${cx - r * 0.6} ${cy - r * 0.6}, ${cx - r * 0.98} ${cy - r * 0.05} z" ${s}/>`,
    };
    case 'crespo': return { atras: Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (1.05 + i * 0.1); return `<circle cx="${cx + Math.cos(a) * r * 0.85}" cy="${cy + Math.sin(a) * r * 0.85}" r="${r * 0.32}" ${s}/>`; }).join('') };
    case 'chanel': return {
      atras: `<path d="M${cx - r * 1.08} ${cy - r * 0.2} v${r * 0.85} h${r * 2.16} v${-r * 0.85} z" ${s}/>`,
      frente: `<path d="M${cx - r * 1.0} ${cy + r * 0.05} C${cx - r * 1.1} ${cy - r * 1.3}, ${cx + r * 1.1} ${cy - r * 1.3}, ${cx + r * 1.0} ${cy + r * 0.05} L${cx + r * 0.8} ${cy - r * 0.35} H${cx - r * 0.8} z" ${s}/>`,
    };
    case 'careca': return { frente: `<path d="M${cx - r * 0.98} ${cy - r * 0.1} q${r * 0.1} ${r * 0.35} ${r * 0.25} ${r * 0.3} M${cx + r * 0.98} ${cy - r * 0.1} q${-r * 0.1} ${r * 0.35} ${-r * 0.25} ${r * 0.3}" stroke="${cor}" stroke-width="${r * 0.14}" stroke-linecap="round" fill="none"/>` };
    case 'bebe': return { frente: `<path d="M${cx} ${cy - r * 0.98} q${r * 0.25} ${-r * 0.3} ${r * 0.05} ${-r * 0.45}" stroke="${cor}" stroke-width="${r * 0.07}" fill="none" stroke-linecap="round"/>` };
    default: return {};
  }
};
const chapeu = (tipo, cor, cx, cy, r) => {
  const s = `fill="${cor}" stroke="${LINHA}" stroke-width="${r * 0.05}"`;
  if (tipo === 'capacete') cy -= r * 0.2;
  if (tipo === 'capacete') return `<path d="M${cx - r * 0.95} ${cy - r * 0.25} C${cx - r * 0.95} ${cy - r * 1.35}, ${cx + r * 0.95} ${cy - r * 1.35}, ${cx + r * 0.95} ${cy - r * 0.25} z" ${s}/><path d="M${cx - r * 1.25} ${cy - r * 0.22} h${r * 2.5} v${r * 0.16} h${-r * 2.5} z" ${s}/><path d="M${cx} ${cy - r * 1.1} v${r * 0.85}" stroke="${LINHA}" stroke-width="${r * 0.05}" opacity="0.5"/>`;
  if (tipo === 'bone') return `<path d="M${cx - r * 0.95} ${cy - r * 0.3} C${cx - r * 0.95} ${cy - r * 1.3}, ${cx + r * 0.95} ${cy - r * 1.3}, ${cx + r * 0.95} ${cy - r * 0.3} z" ${s}/><path d="M${cx + r * 0.2} ${cy - r * 0.32} q${r * 0.8} ${-r * 0.1} ${r * 1.15} ${r * 0.12} h${-r * 1.2} z" ${s}/>`;
  if (tipo === 'touca') return `<path d="M${cx - r * 0.95} ${cy - r * 0.35} C${cx - r * 0.95} ${cy - r * 1.3}, ${cx + r * 0.95} ${cy - r * 1.3}, ${cx + r * 0.95} ${cy - r * 0.35} z" ${s}/>`;
  return '';
};

// ---------- Corpo stick ----------
// k = { pele, cabelo, corCabelo, roupa, calca, sapato?, saia?, chapeu?, corChapeu?, gravata?, colete?, oculos?, bigode?, tipo: 'adulto'|'crianca'|'idoso'|'bebe', braco: 'baixo'|'acena'|'palma'|'cintura'|'continencia'|'colo', rosto, numero?, etiqueta?, bolsa? }
export const stick = (k, w = 300, h = 520) => {
  const kid = k.tipo === 'crianca', baby = k.tipo === 'bebe', old = k.tipo === 'idoso';
  const S = baby ? 0.55 : kid ? 0.78 : 1;
  const cx = w / 2;
  const chao = h - 30;
  const perna = (baby ? 0 : kid ? 110 : 150) * (old ? 0.95 : 1);
  const troncoH = (baby ? 0 : kid ? 95 : 125) * 1;
  const troncoW = (kid ? 84 : 102) * (old ? 1.08 : 1);
  const r = (baby ? 64 : kid ? 64 : 66);
  const quadril = chao - perna;
  const ombro = quadril - troncoH;
  const cy = baby ? chao - 150 : ombro - r * 0.82;
  const lw = 9.5 * (kid ? 0.9 : 1);
  const GROSSO = lw * 2.3;
  // Braços e pernas: mesma grossura, com contorno escuro.
  const membro = (d, cor) => `<path d="${d}" stroke="${LINHA}" stroke-width="${GROSSO + 8}" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="${d}" stroke="${cor}" stroke-width="${GROSSO}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  const st = `stroke="${LINHA}" stroke-width="${lw}" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  let out = '';
  // sombra
  out += `<ellipse cx="${cx}" cy="${chao + 6}" rx="${baby ? 70 : 70 * S}" ry="9" fill="#000" opacity="0.12"/>`;
  if (baby) {
    // bebê enrolado na manta
    // perninhas curtas saindo da manta (mesma grossura dos braços)
    out += membro(`M${cx - 24} ${chao - 50} L${cx - 30} ${chao - 6} M${cx + 24} ${chao - 50} L${cx + 30} ${chao - 6}`, k.pele);
    out += `<ellipse cx="${cx - 32}" cy="${chao}" rx="15" ry="9" fill="${k.pele}" stroke="${LINHA}" stroke-width="4"/><ellipse cx="${cx + 32}" cy="${chao}" rx="15" ry="9" fill="${k.pele}" stroke="${LINHA}" stroke-width="4"/>`;
    out += `<ellipse cx="${cx}" cy="${chao - 84}" rx="66" ry="50" fill="${k.roupa}" stroke="${LINHA}" stroke-width="5"/>`;
    out += `<path d="M${cx - 50} ${chao - 104} q50 26 100 0" stroke="${LINHA}" stroke-width="4" fill="none" opacity="0.35"/>`;
    // bracinho do outro lado
    out += membro(`M${cx - 40} ${chao - 84} L${cx - 72} ${chao - 58}`, k.pele) + `<circle cx="${cx - 74}" cy="${chao - 56}" r="${GROSSO / 2 + 6}" fill="${k.pele}" stroke="${LINHA}" stroke-width="4"/>`;
  } else {
    // pernas
    const pe = (x) => `<ellipse cx="${x}" cy="${chao}" rx="${17 * S}" ry="${9 * S}" fill="${k.sapato ?? LINHA}" stroke="${LINHA}" stroke-width="3"/>`;
    const lx = troncoW * 0.22;
    if (k.calca && !k.saia) {
      const pl = `M${cx - lx} ${quadril - 4} L${cx - lx - 4} ${chao - 8} M${cx + lx} ${quadril - 4} L${cx + lx + 4} ${chao - 8}`;
      out += membro(pl, k.calca);
    } else {
      const pl = `M${cx - lx} ${quadril - 4} L${cx - lx - 4} ${chao - 8} M${cx + lx} ${quadril - 4} L${cx + lx + 4} ${chao - 8}`;
      out += membro(pl, k.pele);
    }
    out += pe(cx - lx - 8) + pe(cx + lx + 8);
    if (k.saia) out += `<path d="M${cx - troncoW * 0.55} ${quadril - 12} L${cx - troncoW * 0.85} ${quadril + 42 * S} H${cx + troncoW * 0.85} L${cx + troncoW * 0.55} ${quadril - 12} z" fill="${k.saia}" stroke="${LINHA}" stroke-width="4"/>`;
    // braços (desenhados atrás do tronco nas poses baixas)
    const bracos = {
      baixo: [`M${cx - troncoW / 2 + 6} ${ombro + 14} L${cx - troncoW / 2 - 18} ${ombro + 70} L${cx - troncoW / 2 - 22} ${ombro + 112}`, `M${cx + troncoW / 2 - 6} ${ombro + 14} L${cx + troncoW / 2 + 18} ${ombro + 70} L${cx + troncoW / 2 + 22} ${ombro + 112}`],
      acena: [`M${cx - troncoW / 2 + 6} ${ombro + 14} L${cx - troncoW / 2 - 18} ${ombro + 70} L${cx - troncoW / 2 - 22} ${ombro + 112}`, `M${cx + troncoW / 2 - 6} ${ombro + 14} L${cx + troncoW / 2 + 48} ${ombro - 10} L${cx + troncoW / 2 + 62} ${ombro - 70}`],
      palma: [`M${cx - troncoW / 2 + 6} ${ombro + 14} L${cx - troncoW / 2 - 18} ${ombro + 70} L${cx - troncoW / 2 - 22} ${ombro + 112}`, `M${cx + troncoW / 2 - 6} ${ombro + 14} L${cx + troncoW / 2 + 40} ${ombro + 30} L${cx + troncoW / 2 + 70} ${ombro - 30}`],
      cintura: [`M${cx - troncoW / 2 + 6} ${ombro + 14} L${cx - troncoW / 2 - 34} ${ombro + 55} L${cx - troncoW / 2 + 4} ${ombro + 92}`, `M${cx + troncoW / 2 - 6} ${ombro + 14} L${cx + troncoW / 2 + 34} ${ombro + 55} L${cx + troncoW / 2 - 4} ${ombro + 92}`],
      continencia: [`M${cx - troncoW / 2 + 6} ${ombro + 14} L${cx - troncoW / 2 - 18} ${ombro + 70} L${cx - troncoW / 2 - 22} ${ombro + 112}`, `M${cx + troncoW / 2 - 6} ${ombro + 14} L${cx + troncoW / 2 + 52} ${ombro - 4} L${cx + r * 0.62} ${cy - r * 0.45}`],
      colo: [`M${cx - troncoW / 2 + 6} ${ombro + 14} L${cx - troncoW / 2 - 6} ${ombro + 66} L${cx + 20} ${ombro + 72}`, `M${cx + troncoW / 2 - 6} ${ombro + 14} L${cx + troncoW / 2 + 6} ${ombro + 66} L${cx - 20} ${ombro + 72}`],
    }[k.braco ?? 'baixo'];
    const mao = (d) => { const p = d.trim().split(/[ ML]+/).filter(Boolean); const x = p[p.length - 2], y = p[p.length - 1]; return `<circle cx="${x}" cy="${y}" r="${GROSSO / 2 + 6}" fill="${k.pele}" stroke="${LINHA}" stroke-width="4"/>`; };
    const frenteBracos = ['colo', 'cintura'].includes(k.braco);
    const desenhaBracos = bracos.map((d) => membro(d, k.manga ?? k.roupa)).join('') + bracos.map(mao).join('');
    if (!frenteBracos) out += desenhaBracos;
    // tronco (camiseta)
    { const a = troncoW, hh = troncoH, b = quadril + 8;
      out += `<path d="M${cx - 0.36 * a} ${ombro} Q${cx - 0.5 * a} ${ombro} ${cx - 0.5 * a} ${ombro + 0.25 * hh} C${cx - 0.57 * a} ${ombro + 0.7 * hh} ${cx - 0.52 * a} ${b} ${cx - 0.28 * a} ${b} H${cx + 0.28 * a} C${cx + 0.52 * a} ${b} ${cx + 0.57 * a} ${ombro + 0.7 * hh} ${cx + 0.5 * a} ${ombro + 0.25 * hh} Q${cx + 0.5 * a} ${ombro} ${cx + 0.36 * a} ${ombro} z" fill="${k.roupa}" stroke="${LINHA}" stroke-width="5"/>`; }
    if (k.colete) out += `<path d="M${cx - troncoW * 0.47} ${ombro + 30} h${troncoW * 0.94} M${cx - troncoW * 0.5} ${ombro + 70} h${troncoW}" stroke="${k.colete}" stroke-width="10"/>`;
    if (k.gravata) out += `<path d="M${cx} ${ombro + 2} l-9 12 l9 50 l9 -50 z" fill="${k.gravata}" stroke="${LINHA}" stroke-width="3"/><path d="M${cx - 16} ${ombro} l16 14 l16 -14" fill="#fff" stroke="${LINHA}" stroke-width="3"/>`;
    if (k.avental) out += `<rect x="${cx - troncoW * 0.32}" y="${ombro + 30}" width="${troncoW * 0.64}" height="${troncoH - 24}" rx="6" fill="${k.avental}" stroke="${LINHA}" stroke-width="3"/>`;
    if (k.etiqueta) out += `<rect x="${cx + 4}" y="${ombro + 26}" width="24" height="14" rx="3" fill="#fff" stroke="${LINHA}" stroke-width="2"/>`;
    if (frenteBracos) out += desenhaBracos;
    if (k.bolsa) out += `<path d="M${cx - troncoW / 2 + 8} ${ombro + 4} L${cx + troncoW / 2 + 16} ${quadril - 30}" stroke="#6b4a2e" stroke-width="5"/><rect x="${cx + troncoW / 2 + 2}" y="${quadril - 36}" width="34" height="28" rx="5" fill="#8a5a32" stroke="${LINHA}" stroke-width="3"/>`;
    if (k.camera) out += `<rect x="${cx + troncoW / 2 + 40}" y="${ombro + 18}" width="44" height="30" rx="5" fill="#2a2a2e" stroke="${LINHA}" stroke-width="3"/><circle cx="${cx + troncoW / 2 + 62}" cy="${ombro + 33}" r="9" fill="#555" stroke="#111" stroke-width="2"/>`;
    if (k.lanterna) out += `<rect x="${cx - troncoW / 2 - 34}" y="${ombro + 100}" width="16" height="30" rx="4" fill="#e8c240" stroke="${LINHA}" stroke-width="3"/><path d="M${cx - troncoW / 2 - 26} ${ombro + 132} l-40 70 h80 z" fill="#fff6c0" opacity="0.55"/>`;
  }
  // cabeça
  const hair = cabelo(k.cabelo, k.corCabelo, cx, cy, r);
  out += hair.atras ?? '';
  out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${k.pele}" stroke="${LINHA}" stroke-width="5"/>`;
  out += hair.frente ?? '';
  out += chapeu(k.chapeu, k.corChapeu, cx, cy, r);
  if (k.oculos) out += `<circle cx="${cx - r * 0.34}" cy="${cy - r * 0.05}" r="${r * 0.2}" fill="none" stroke="${LINHA}" stroke-width="4"/><circle cx="${cx + r * 0.34}" cy="${cy - r * 0.05}" r="${r * 0.2}" fill="none" stroke="${LINHA}" stroke-width="4"/><path d="M${cx - r * 0.14} ${cy - r * 0.05} h${r * 0.28}" stroke="${LINHA}" stroke-width="4"/>`;
  out += rosto(k.rosto ?? 'neutro', cx, cy, r);
  if (k.bigode) out += `<path d="M${cx - r * 0.3} ${cy + r * 0.22} q${r * 0.3} ${-r * 0.2} ${r * 0.3} 0 q0 ${-r * 0.2} ${r * 0.3} 0 q-${r * 0.05} ${r * 0.2} -${r * 0.3} ${r * 0.12} q-${r * 0.25} ${r * 0.08} -${r * 0.3} -${r * 0.12} z" fill="${k.corCabelo}" stroke="${LINHA}" stroke-width="2"/>`;
  if (baby && k.braco === 'palma') out += membro(`M${cx + 40} ${chao - 96} L${cx + 82} ${chao - 150}`, k.pele) + `<circle cx="${cx + 84}" cy="${chao - 154}" r="${GROSSO / 2 + 6}" fill="${k.pele}" stroke="${LINHA}" stroke-width="3.5"/>`;
  // número da palma
  if (k.numero) {
    const n = k.numero, bw = Math.max(46, n.length * 19 + 22);
    const px = baby ? cx + 84 : k.braco === 'palma' ? cx + troncoW / 2 + 70 : cx + troncoW / 2 + 22;
    const py = baby ? chao - 154 : k.braco === 'palma' ? ombro - 30 : ombro + 112;
    const bx = Math.min(w - bw - 6, Math.max(6, px - bw / 2)), by = baby ? py - 84 : k.braco === 'palma' ? Math.min(py - 64, cy - r - 52) : py - 64;
    out += `<rect x="${bx}" y="${by}" width="${bw}" height="38" rx="9" fill="#1b1530" stroke="${k.corNumero ?? '#ffd23a'}" stroke-width="3"/><text x="${bx + bw / 2}" y="${by + 27}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="22" fill="${k.corNumero ?? '#ffd23a'}">${n}</text>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${out}</svg>`;
};

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
  return `<figure class="mini">${s.replace('viewBox="0 0 300 520"', 'viewBox="65 70 170 170"').replace('width="300" height="520"', 'width="120" height="120"')}<figcaption>${e}</figcaption></figure>`;
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
