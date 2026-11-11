// Motor dos PERSONAGENS MAD: stick(k) devolve o SVG de um personagem.
// Sem efeitos colaterais: pode ser importado por scripts (gerar.mjs) e pela animação (Remotion).
export const LINHA = '#2a2230';
export const PELE = { clara: '#f6e3d3', media: '#e2b48c', morena: '#b9805a', escura: '#7a4b30' };

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
    case 'moicano': return { frente: `<path d="M${cx - r * 0.18} ${cy - r * 0.92} L${cx - r * 0.12} ${cy - r * 1.55} L${cx} ${cy - r * 1.25} L${cx + r * 0.12} ${cy - r * 1.6} L${cx + r * 0.2} ${cy - r * 0.92} z" ${s}/>` };
    case 'afro': return { atras: `<circle cx="${cx}" cy="${cy - r * 0.25}" r="${r * 1.32}" ${s}/>` };
    case 'trancas': return {
      atras: [-1, 1].map((d) => `<path d="M${cx + d * r * 0.85} ${cy - r * 0.2} q${d * r * 0.35} ${r * 0.7} ${d * r * 0.15} ${r * 1.5}" stroke="${LINHA}" stroke-width="${r * 0.34}" stroke-linecap="round" fill="none"/><path d="M${cx + d * r * 0.85} ${cy - r * 0.2} q${d * r * 0.35} ${r * 0.7} ${d * r * 0.15} ${r * 1.5}" stroke="${cor}" stroke-width="${r * 0.24}" stroke-linecap="round" stroke-dasharray="${r * 0.18} ${r * 0.06}" fill="none"/>`).join(''),
      frente: `<path d="M${cx - r * 0.98} ${cy} C${cx - r * 1.05} ${cy - r * 1.25}, ${cx + r * 1.05} ${cy - r * 1.25}, ${cx + r * 0.98} ${cy} C${cx + r * 0.5} ${cy - r * 0.6}, ${cx - r * 0.5} ${cy - r * 0.6}, ${cx - r * 0.98} ${cy} z" ${s}/><path d="M${cx} ${cy - r} v${r * 0.42}" stroke="${LINHA}" stroke-width="${r * 0.04}" opacity="0.5"/>`,
    };
    case 'franja': return {
      atras: `<path d="M${cx - r * 1.02} ${cy - r * 0.2} v${r * 0.6} h${r * 2.04} v${-r * 0.6} z" ${s}/>`,
      frente: `<path d="M${cx - r * 1.0} ${cy - r * 0.05} C${cx - r * 1.1} ${cy - r * 1.3}, ${cx + r * 1.1} ${cy - r * 1.3}, ${cx + r * 1.0} ${cy - r * 0.05} L${cx + r * 0.85} ${cy - r * 0.3} L${cx + r * 0.5} ${cy - r * 0.42} L${cx + r * 0.15} ${cy - r * 0.32} L${cx - r * 0.25} ${cy - r * 0.42} L${cx - r * 0.6} ${cy - r * 0.32} L${cx - r * 0.85} ${cy - r * 0.38} z" ${s}/>`,
    };
    case 'espetado': return { frente: `<path d="M${cx - r * 0.98} ${cy - r * 0.15} L${cx - r * 1.15} ${cy - r * 0.75} L${cx - r * 0.7} ${cy - r * 0.8} L${cx - r * 0.75} ${cy - r * 1.3} L${cx - r * 0.25} ${cy - r * 1.05} L${cx} ${cy - r * 1.5} L${cx + r * 0.25} ${cy - r * 1.05} L${cx + r * 0.75} ${cy - r * 1.3} L${cx + r * 0.7} ${cy - r * 0.8} L${cx + r * 1.15} ${cy - r * 0.75} L${cx + r * 0.98} ${cy - r * 0.15} C${cx + r * 0.5} ${cy - r * 0.6}, ${cx - r * 0.5} ${cy - r * 0.6}, ${cx - r * 0.98} ${cy - r * 0.15} z" ${s}/>` };
    case 'vampiro': return { frente: `<path d="M${cx - r * 0.98} ${cy - r * 0.05} C${cx - r} ${cy - r * 1.25}, ${cx + r} ${cy - r * 1.25}, ${cx + r * 0.98} ${cy - r * 0.05} C${cx + r * 0.75} ${cy - r * 0.45}, ${cx + r * 0.3} ${cy - r * 0.62}, ${cx} ${cy - r * 0.38} C${cx - r * 0.3} ${cy - r * 0.62}, ${cx - r * 0.75} ${cy - r * 0.45}, ${cx - r * 0.98} ${cy - r * 0.05} z" ${s}/>` };
    case 'bebe': return { frente: `<path d="M${cx} ${cy - r * 0.98} q${r * 0.25} ${-r * 0.3} ${r * 0.05} ${-r * 0.45}" stroke="${cor}" stroke-width="${r * 0.07}" fill="none" stroke-linecap="round"/>` };
    default: return {};
  }
};
const chapeu = (tipo, cor, cx, cy, r) => {
  const s = `fill="${cor}" stroke="${LINHA}" stroke-width="${r * 0.05}"`;
  if (tipo === 'capacete') cy -= r * 0.2;
  if (tipo === 'capacete') return `<path d="M${cx - r * 0.95} ${cy - r * 0.25} C${cx - r * 0.95} ${cy - r * 1.35}, ${cx + r * 0.95} ${cy - r * 1.35}, ${cx + r * 0.95} ${cy - r * 0.25} z" ${s}/><path d="M${cx - r * 1.25} ${cy - r * 0.22} h${r * 2.5} v${r * 0.16} h${-r * 2.5} z" ${s}/><path d="M${cx} ${cy - r * 1.1} v${r * 0.85}" stroke="${LINHA}" stroke-width="${r * 0.05}" opacity="0.5"/>`;
  if (tipo === 'bone') return `<path d="M${cx - r * 0.95} ${cy - r * 0.3} C${cx - r * 0.95} ${cy - r * 1.3}, ${cx + r * 0.95} ${cy - r * 1.3}, ${cx + r * 0.95} ${cy - r * 0.3} z" ${s}/><path d="M${cx + r * 0.2} ${cy - r * 0.32} q${r * 0.8} ${-r * 0.1} ${r * 1.15} ${r * 0.12} h${-r * 1.2} z" ${s}/>`;
  if (tipo === 'chef') return `<path d="M${cx - r * 0.7} ${cy - r * 0.65} v${-r * 0.55} ${''}" fill="none"/><path d="M${cx - r * 0.72} ${cy - r * 0.62} L${cx - r * 0.72} ${cy - r * 1.05} C${cx - r * 1.25} ${cy - r * 1.2}, ${cx - r * 0.9} ${cy - r * 1.95}, ${cx - r * 0.35} ${cy - r * 1.6} C${cx - r * 0.2} ${cy - r * 2.15}, ${cx + r * 0.45} ${cy - r * 2.1}, ${cx + r * 0.45} ${cy - r * 1.62} C${cx + r * 1.0} ${cy - r * 1.9}, ${cx + r * 1.25} ${cy - r * 1.2}, ${cx + r * 0.72} ${cy - r * 1.05} L${cx + r * 0.72} ${cy - r * 0.62} z" ${s}/><path d="M${cx - r * 0.72} ${cy - r * 0.85} h${r * 1.44}" stroke="${LINHA}" stroke-width="${r * 0.04}" opacity="0.4"/>`;
  if (tipo === 'quepe') return `<path d="M${cx - r * 0.95} ${cy - r * 0.45} L${cx - r * 1.05} ${cy - r * 1.05} Q${cx} ${cy - r * 1.35} ${cx + r * 1.05} ${cy - r * 1.05} L${cx + r * 0.95} ${cy - r * 0.45} z" ${s}/><path d="M${cx - r * 0.95} ${cy - r * 0.5} h${r * 1.9} v${r * 0.18} h${-r * 1.9} z" fill="${LINHA}"/><path d="M${cx - r * 0.85} ${cy - r * 0.34} q${r * 0.85} ${r * 0.3} ${r * 1.7} 0 z" fill="${LINHA}"/><path d="M${cx} ${cy - r * 1.02} l${r * 0.1} ${r * 0.14} l${r * 0.16} 0 l${-r * 0.13} ${r * 0.1} l${r * 0.05} ${r * 0.16} l${-r * 0.18} ${-r * 0.1} l${-r * 0.18} ${r * 0.1} l${r * 0.05} ${-r * 0.16} l${-r * 0.13} ${-r * 0.1} l${r * 0.16} 0 z" fill="#f2c94c"/>`;
  if (tipo === 'coroa') return `<path d="M${cx - r * 0.62} ${cy - r * 0.78} L${cx - r * 0.72} ${cy - r * 1.42} L${cx - r * 0.36} ${cy - r * 1.12} L${cx} ${cy - r * 1.55} L${cx + r * 0.36} ${cy - r * 1.12} L${cx + r * 0.72} ${cy - r * 1.42} L${cx + r * 0.62} ${cy - r * 0.78} z" fill="#f2c94c" stroke="${LINHA}" stroke-width="${r * 0.05}" stroke-linejoin="round"/><circle cx="${cx}" cy="${cy - r * 0.98}" r="${r * 0.09}" fill="#e5484d"/><circle cx="${cx - r * 0.4}" cy="${cy - r * 0.92}" r="${r * 0.07}" fill="#3d8bfd"/><circle cx="${cx + r * 0.4}" cy="${cy - r * 0.92}" r="${r * 0.07}" fill="#3d8bfd"/>`;
  if (tipo === 'cartola') return `<path d="M${cx - r * 0.6} ${cy - r * 0.75} L${cx - r * 0.6} ${cy - r * 1.75} H${cx + r * 0.6} L${cx + r * 0.6} ${cy - r * 0.75} z" ${s}/><path d="M${cx - r * 0.6} ${cy - r * 0.98} h${r * 1.2} v${r * 0.16} h${-r * 1.2} z" fill="#c22a2a"/><path d="M${cx - r * 1.1} ${cy - r * 0.78} q${r * 1.1} ${r * 0.18} ${r * 2.2} 0 v${r * 0.1} q${-r * 1.1} ${r * 0.18} ${-r * 2.2} 0 z" ${s}/>`;
  if (tipo === 'gorro') return `<path d="M${cx - r * 0.95} ${cy - r * 0.3} C${cx - r * 0.95} ${cy - r * 1.4}, ${cx + r * 0.95} ${cy - r * 1.4}, ${cx + r * 0.95} ${cy - r * 0.3} z" ${s}/><path d="M${cx - r * 1.0} ${cy - r * 0.48} h${r * 2.0} v${r * 0.26} h${-r * 2.0} z" ${s}/><circle cx="${cx}" cy="${cy - r * 1.18}" r="${r * 0.2}" fill="#fff" stroke="${LINHA}" stroke-width="${r * 0.05}"/>`;
  if (tipo === 'palha') return `<ellipse cx="${cx}" cy="${cy - r * 0.62}" rx="${r * 1.55}" ry="${r * 0.26}" ${s}/><path d="M${cx - r * 0.7} ${cy - r * 0.65} C${cx - r * 0.7} ${cy - r * 1.45}, ${cx + r * 0.7} ${cy - r * 1.45}, ${cx + r * 0.7} ${cy - r * 0.65} z" ${s}/><path d="M${cx - r * 0.7} ${cy - r * 0.8} h${r * 1.4}" stroke="#c22a2a" stroke-width="${r * 0.12}"/>`;
  if (tipo === 'bone-tras') return `<path d="M${cx - r * 0.95} ${cy - r * 0.3} C${cx - r * 0.95} ${cy - r * 1.3}, ${cx + r * 0.95} ${cy - r * 1.3}, ${cx + r * 0.95} ${cy - r * 0.3} z" ${s}/><path d="M${cx - r * 0.2} ${cy - r * 1.02} q${-r * 0.8} ${-r * 0.25} ${-r * 1.15} ${r * 0.05} l${r * 0.5} ${r * 0.18} z" ${s}/>`;
  if (tipo === 'boina') return `<ellipse cx="${cx + r * 0.15}" cy="${cy - r * 0.78}" rx="${r * 1.05}" ry="${r * 0.42}" transform="rotate(-8 ${cx} ${cy})" ${s}/><circle cx="${cx + r * 0.2}" cy="${cy - r * 1.22}" r="${r * 0.08}" fill="${LINHA}"/>`;
  if (tipo === 'fone') return `<path d="M${cx - r * 1.0} ${cy - r * 0.05} C${cx - r * 1.1} ${cy - r * 1.45}, ${cx + r * 1.1} ${cy - r * 1.45}, ${cx + r * 1.0} ${cy - r * 0.05}" stroke="${LINHA}" stroke-width="${r * 0.22}" fill="none"/><path d="M${cx - r * 1.0} ${cy - r * 0.05} C${cx - r * 1.1} ${cy - r * 1.45}, ${cx + r * 1.1} ${cy - r * 1.45}, ${cx + r * 1.0} ${cy - r * 0.05}" stroke="${cor}" stroke-width="${r * 0.12}" fill="none"/>${[-1, 1].map((d) => `<rect x="${cx + d * r * 1.02 - r * 0.2}" y="${cy - r * 0.32}" width="${r * 0.4}" height="${r * 0.6}" rx="${r * 0.14}" ${s}/>`).join('')}`;
  if (tipo === 'pirata') return `<path d="M${cx - r * 1.25} ${cy - r * 0.6} Q${cx - r * 0.9} ${cy - r * 1.2} ${cx - r * 0.55} ${cy - r * 1.05} Q${cx} ${cy - r * 1.7} ${cx + r * 0.55} ${cy - r * 1.05} Q${cx + r * 0.9} ${cy - r * 1.2} ${cx + r * 1.25} ${cy - r * 0.6} Q${cx} ${cy - r * 0.85} ${cx - r * 1.25} ${cy - r * 0.6} z" ${s}/><circle cx="${cx}" cy="${cy - r * 1.05}" r="${r * 0.14}" fill="#fff"/><path d="M${cx - r * 0.18} ${cy - r * 0.8} l${r * 0.36} ${-r * 0.12} M${cx + r * 0.18} ${cy - r * 0.8} l${-r * 0.36} ${-r * 0.12}" stroke="#fff" stroke-width="${r * 0.06}"/>`;
  if (tipo === 'bruxa') return `<path d="M${cx - r * 0.7} ${cy - r * 0.72} L${cx + r * 0.1} ${cy - r * 2.3} Q${cx + r * 0.45} ${cy - r * 2.2} ${cx + r * 0.6} ${cy - r * 1.95} L${cx + r * 0.25} ${cy - r * 2.0} L${cx + r * 0.7} ${cy - r * 0.72} z" ${s}/><ellipse cx="${cx}" cy="${cy - r * 0.7}" rx="${r * 1.45}" ry="${r * 0.22}" ${s}/><path d="M${cx - r * 0.68} ${cy - r * 0.92} h${r * 1.36}" stroke="#7be07b" stroke-width="${r * 0.14}"/>`;
  if (tipo === 'cowboy') return `<path d="M${cx - r * 1.5} ${cy - r * 0.78} Q${cx - r * 1.45} ${cy - r * 0.5} ${cx} ${cy - r * 0.55} Q${cx + r * 1.45} ${cy - r * 0.5} ${cx + r * 1.5} ${cy - r * 0.78} Q${cx + r * 1.2} ${cy - r * 0.6} ${cx + r * 0.7} ${cy - r * 0.7} L${cx + r * 0.65} ${cy - r * 1.35} Q${cx} ${cy - r * 1.15} ${cx - r * 0.65} ${cy - r * 1.35} L${cx - r * 0.7} ${cy - r * 0.7} Q${cx - r * 1.2} ${cy - r * 0.6} ${cx - r * 1.5} ${cy - r * 0.78} z" ${s}/><path d="M${cx - r * 0.7} ${cy - r * 0.82} h${r * 1.4}" stroke="${LINHA}" stroke-width="${r * 0.1}"/>`;
  if (tipo === 'fedora') return `<ellipse cx="${cx}" cy="${cy - r * 0.68}" rx="${r * 1.3}" ry="${r * 0.2}" ${s}/><path d="M${cx - r * 0.72} ${cy - r * 0.7} L${cx - r * 0.65} ${cy - r * 1.3} Q${cx} ${cy - r * 1.1} ${cx + r * 0.65} ${cy - r * 1.3} L${cx + r * 0.72} ${cy - r * 0.7} z" ${s}/><path d="M${cx - r * 0.7} ${cy - r * 0.82} h${r * 1.4}" stroke="${LINHA}" stroke-width="${r * 0.12}"/>`;
  if (tipo === 'veu') return `<path d="M${cx - r * 0.45} ${cy - r * 0.9} Q${cx} ${cy - r * 1.25} ${cx + r * 0.45} ${cy - r * 0.9}" stroke="#d6dae2" stroke-width="${r * 0.1}" fill="none"/>${[-0.3, 0, 0.3].map((d) => `<circle cx="${cx + d * r}" cy="${cy - r * (1.05 + (d ? 0 : 0.08))}" r="${r * 0.07}" fill="#bfe6ff" stroke="${LINHA}" stroke-width="${r * 0.03}"/>`).join('')}`;
  if (tipo === 'marinheiro') return `<path d="M${cx - r * 0.85} ${cy - r * 0.55} Q${cx} ${cy - r * 1.55} ${cx + r * 0.85} ${cy - r * 0.55} z" ${s}/><path d="M${cx - r * 0.95} ${cy - r * 0.62} q${r * 0.95} ${r * 0.22} ${r * 1.9} 0 v${r * 0.16} q${-r * 0.95} ${r * 0.22} ${-r * 1.9} 0 z" ${s}/><path d="M${cx - r * 0.85} ${cy - r * 0.5} h${r * 1.7}" stroke="#2f4f8f" stroke-width="${r * 0.08}"/>`;
  if (tipo === 'bucket') return `<path d="M${cx - r * 0.75} ${cy - r * 0.55} L${cx - r * 0.6} ${cy - r * 1.25} Q${cx} ${cy - r * 1.4} ${cx + r * 0.6} ${cy - r * 1.25} L${cx + r * 0.75} ${cy - r * 0.55} z" ${s}/><path d="M${cx - r * 1.2} ${cy - r * 0.35} L${cx - r * 0.78} ${cy - r * 0.6} H${cx + r * 0.78} L${cx + r * 1.2} ${cy - r * 0.35} Q${cx} ${cy - r * 0.45} ${cx - r * 1.2} ${cy - r * 0.35} z" ${s}/>`;
  if (tipo === 'viseira') return `<path d="M${cx - r * 0.98} ${cy - r * 0.42} Q${cx} ${cy - r * 0.8} ${cx + r * 0.98} ${cy - r * 0.42} v${r * 0.16} Q${cx} ${cy - r * 0.62} ${cx - r * 0.98} ${cy - r * 0.26} z" ${s}/><path d="M${cx - r * 0.1} ${cy - r * 0.62} q${r * 0.8} ${-r * 0.05} ${r * 1.3} ${r * 0.25} h${-r * 1.15} z" ${s}/>`;
  if (tipo === 'piloto') return `<path d="M${cx - r * 0.95} ${cy - r * 0.45} L${cx - r * 1.05} ${cy - r * 1.0} Q${cx} ${cy - r * 1.3} ${cx + r * 1.05} ${cy - r * 1.0} L${cx + r * 0.95} ${cy - r * 0.45} z" ${s}/><path d="M${cx - r * 0.85} ${cy - r * 0.34} q${r * 0.85} ${r * 0.3} ${r * 1.7} 0 z" fill="${LINHA}"/><path d="M${cx - r * 0.4} ${cy - r * 0.82} q${r * 0.2} ${-r * 0.12} ${r * 0.4} 0 q${r * 0.2} ${-r * 0.12} ${r * 0.4} 0 l${-r * 0.4} ${r * 0.1} z" fill="#f2c94c" stroke="${LINHA}" stroke-width="2"/>`;
  if (tipo === 'noel') return `<path d="M${cx - r * 0.95} ${cy - r * 0.45} C${cx - r * 0.8} ${cy - r * 1.5}, ${cx + r * 0.6} ${cy - r * 1.6}, ${cx + r * 1.2} ${cy - r * 0.55} L${cx + r * 0.95} ${cy - r * 0.45} z" fill="#d23a3a" stroke="${LINHA}" stroke-width="${r * 0.05}"/><path d="M${cx - r * 1.0} ${cy - r * 0.6} h${r * 2.0} v${r * 0.28} h${-r * 2.0} z" fill="#fff" stroke="${LINHA}" stroke-width="${r * 0.05}"/><circle cx="${cx + r * 1.22}" cy="${cy - r * 0.48}" r="${r * 0.18}" fill="#fff" stroke="${LINHA}" stroke-width="${r * 0.05}"/>`;
  if (tipo === 'touca') return `<path d="M${cx - r * 0.95} ${cy - r * 0.35} C${cx - r * 0.95} ${cy - r * 1.3}, ${cx + r * 0.95} ${cy - r * 1.3}, ${cx + r * 0.95} ${cy - r * 0.35} z" ${s}/>`;
  return '';
};

let UID = 0;
// ---------- Objetos de mão ----------
const item = (tipo, x, y, k, chao) => {
  const L = `stroke="${LINHA}" stroke-width="3.5" stroke-linejoin="round"`;
  switch (tipo) {
    case 'livro': return `<g transform="translate(${x} ${y}) rotate(-10)"><rect x="-26" y="-34" width="52" height="40" rx="4" fill="#c8452e" ${L}/><rect x="-22" y="-30" width="44" height="6" fill="#fff" opacity="0.7"/></g>`;
    case 'bola': return `<g transform="translate(${x + 4} ${y - 30})"><circle r="24" fill="#fff" ${L}/><path d="M0 -9 l9 6 -3 10 h-12 l-3 -10 z" fill="${LINHA}"/><path d="M0 -9 V-24 M9 -3 L22 -8 M6 7 L14 20 M-6 7 L-14 20 M-9 -3 L-22 -8" stroke="${LINHA}" stroke-width="2.5"/></g>`;
    case 'microfone': return `<g transform="translate(${x} ${y}) rotate(-20)"><rect x="-6" y="-46" width="12" height="44" rx="5" fill="#2a2a2e" ${L}/><circle cy="-52" r="13" fill="#9aa0aa" ${L}/></g>`;
    case 'pincel': return `<g transform="translate(${x} ${y}) rotate(25)"><rect x="-4" y="-60" width="8" height="56" rx="3" fill="#b07a45" ${L}/><path d="M-6 -60 q6 -22 12 0 z" fill="#e5484d" ${L}/></g>`;
    case 'paleta': return `<g transform="translate(${x - 8} ${y - 8})"><ellipse rx="32" ry="22" fill="#e9d2a6" ${L}/><circle cx="-12" cy="-6" r="6" fill="#e5484d"/><circle cx="4" cy="-10" r="6" fill="#3d8bfd"/><circle cx="16" cy="2" r="6" fill="#f2c94c"/><circle cx="-2" cy="8" r="6" fill="#2fa36b"/></g>`;
    case 'varinha': return `<g transform="translate(${x} ${y}) rotate(30)"><rect x="-4" y="-70" width="8" height="66" rx="3" fill="${LINHA}"/><rect x="-4" y="-70" width="8" height="12" fill="#fff"/></g><path d="M${x + 44} ${y - 70} l5 11 l12 1 l-9 8 l3 12 l-11 -6 l-11 6 l3 -12 l-9 -8 l12 -1 z" fill="#f2c94c" ${L}/>`;
    case 'celular': return `<g transform="translate(${x} ${y}) rotate(-8)"><rect x="-15" y="-50" width="30" height="52" rx="6" fill="#2a2a2e" ${L}/><rect x="-11" y="-45" width="22" height="38" rx="3" fill="#7fd1ff"/></g>`;
    case 'maleta': return `<g transform="translate(${x} ${y + 30})"><rect x="-32" y="-26" width="64" height="46" rx="6" fill="#6b4a2e" ${L}/><path d="M-12 -26 v-10 h24 v10" fill="none" ${L}/><rect x="-6" y="-8" width="12" height="8" fill="#f2c94c"/></g>`;
    case 'tubo': return `<g transform="translate(${x} ${y}) rotate(-15)"><path d="M-9 -58 v46 a9 9 0 0 0 18 0 v-46 z" fill="#fff" ${L}/><path d="M-9 -30 v18 a9 9 0 0 0 18 0 v-18 z" fill="#7be07b"/><circle cx="2" cy="-68" r="5" fill="#7be07b" opacity="0.8"/><circle cx="-6" cy="-80" r="3.5" fill="#7be07b" opacity="0.6"/></g>`;
    case 'bengala': return `<path d="M${x} ${y - 6} V${chao - 2}" stroke="${LINHA}" stroke-width="11" stroke-linecap="round"/><path d="M${x} ${y - 6} V${chao - 2}" stroke="#8a5a32" stroke-width="6" stroke-linecap="round"/><path d="M${x} ${y - 6} q0 -22 -20 -16" stroke="#8a5a32" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    case 'saco': return `<g transform="translate(${x} ${y + 34})"><path d="M-30 4 q-6 -40 22 -44 h16 q28 4 22 44 q0 14 -30 14 q-30 0 -30 -14 z" fill="#c9a86a" ${L}/><path d="M-10 -40 l10 -10 l10 10" fill="none" ${L}/><text y="4" text-anchor="middle" font-family="Arial Black, Arial" font-weight="900" font-size="24" fill="#2e6b34">$</text></g>`;
    case 'prancheta': return `<g transform="translate(${x - 10} ${y - 4}) rotate(-8)"><rect x="-24" y="-40" width="48" height="60" rx="5" fill="#b07a45" ${L}/><rect x="-18" y="-32" width="36" height="46" fill="#fff"/><path d="M-12 -22 h24 M-12 -12 h24 M-12 -2 h16" stroke="${LINHA}" stroke-width="2.5" opacity="0.6"/></g>`;
    case 'violao': return `<g transform="translate(${x - 26} ${y + 6}) rotate(-35)"><rect x="-5" y="-86" width="10" height="56" fill="#5a3a22" ${L}/><path d="M0 -36 c-26 0 -30 22 -18 32 c-14 12 -10 38 18 38 c28 0 32 -26 18 -38 c12 -10 8 -32 -18 -32 z" fill="#d98c3f" ${L}/><circle cy="2" r="8" fill="${LINHA}"/></g>`;
    case 'pizza': return `<g transform="translate(${x} ${y - 10})"><path d="M-30 -10 L30 -10 L0 40 z" fill="#f2c94c" ${L}/><path d="M-30 -10 Q0 -22 30 -10" stroke="#c98a3a" stroke-width="10" fill="none"/><circle cx="-6" cy="4" r="5" fill="#d23a3a"/><circle cx="8" cy="12" r="5" fill="#d23a3a"/></g>`;
    case 'espada': return `<g transform="translate(${x} ${y}) rotate(20)"><rect x="-5" y="-96" width="10" height="84" fill="#d6dae2" ${L}/><rect x="-18" y="-14" width="36" height="8" rx="3" fill="#f2c94c" ${L}/><rect x="-4" y="-6" width="8" height="18" fill="#6b4a2e" ${L}/></g>`;
    case 'flor': return `<g transform="translate(${x} ${y})"><path d="M0 -6 V-50" stroke="#2fa36b" stroke-width="5"/>${[0, 1, 2, 3, 4].map((j) => `<circle cx="${Math.cos(j * 1.256) * 10}" cy="${-56 + Math.sin(j * 1.256) * 10}" r="8" fill="#f28fb0" ${L}/>`).join('')}<circle cy="-56" r="6" fill="#f2c94c"/></g>`;
    case 'controle': return `<g transform="translate(${x} ${y - 8})"><path d="M-30 -10 q0 -14 14 -14 h32 q14 0 14 14 l4 18 q2 12 -10 12 q-8 0 -14 -10 h-20 q-6 10 -14 10 q-12 0 -10 -12 z" fill="#3a3a44" ${L}/><circle cx="12" cy="-10" r="4" fill="#e5484d"/><circle cx="20" cy="-4" r="4" fill="#3d8bfd"/><path d="M-18 -10 h12 M-12 -16 v12" stroke="#fff" stroke-width="3"/></g>`;
    case 'skate': return `<g transform="translate(${x + 6} ${y + 10}) rotate(-70)"><rect x="-56" y="-9" width="112" height="18" rx="9" fill="#e5484d" ${L}/><circle cx="-34" cy="14" r="7" fill="#f2c94c" ${L}/><circle cx="34" cy="14" r="7" fill="#f2c94c" ${L}/></g>`;
    case 'prancha': return `<g transform="translate(${x + 18} ${y - 30})"><ellipse rx="20" ry="92" fill="#3dc4d8" ${L}/><path d="M0 -88 V88" stroke="#fff" stroke-width="5"/></g>`;
    case 'caixa': return `<g transform="translate(${x - 6} ${y - 20})"><rect x="-32" y="-30" width="64" height="52" rx="3" fill="#c9965a" ${L}/><path d="M-32 -16 h64 M0 -30 v14" stroke="${LINHA}" stroke-width="3"/><rect x="-24" y="-4" width="22" height="14" fill="#fff" opacity="0.8"/></g>`;
    case 'carta': return `<g transform="translate(${x + 4} ${y - 18}) rotate(-10)"><rect x="-28" y="-18" width="56" height="36" rx="3" fill="#fff" ${L}/><path d="M-28 -18 L0 4 L28 -18" fill="none" ${L}/><rect x="14" y="-14" width="10" height="12" fill="#e5484d"/></g>`;
    case 'bandeja': return `<g transform="translate(${x} ${y - 6})"><ellipse rx="40" ry="8" fill="#c9ccd4" ${L}/><path d="M-16 -6 q2 -26 10 -30 h12 q8 4 10 30 z" fill="#ffffff" opacity="0.85" ${L}/><path d="M-12 -14 h22" stroke="#e5484d" stroke-width="5"/></g>`;
    case 'martelo': return `<g transform="translate(${x} ${y}) rotate(25)"><rect x="-5" y="-62" width="10" height="58" rx="3" fill="#8a5a32" ${L}/><rect x="-22" y="-76" width="44" height="20" rx="4" fill="#9aa0aa" ${L}/></g>`;
    case 'malhete': return `<g transform="translate(${x} ${y}) rotate(25)"><rect x="-4" y="-50" width="8" height="46" rx="3" fill="#6b4a2e" ${L}/><rect x="-20" y="-68" width="40" height="22" rx="8" fill="#8a5a32" ${L}/></g>`;
    case 'vassoura': return `<path d="M${x - 8} ${y - 90} L${x + 4} ${y + 70}" stroke="${LINHA}" stroke-width="11" stroke-linecap="round"/><path d="M${x - 8} ${y - 90} L${x + 4} ${y + 70}" stroke="#8a5a32" stroke-width="6" stroke-linecap="round"/><path d="M${x - 12} ${y + 64} L${x - 28} ${y + 120} H${x + 34} L${x + 18} ${y + 64} z" fill="#e8c87a" ${L}/><path d="M${x - 14} ${y + 76} h34" stroke="#c22a2a" stroke-width="5"/>`;
    case 'lupa': return `<g transform="translate(${x} ${y}) rotate(-30)"><rect x="-5" y="-30" width="10" height="28" rx="3" fill="#6b4a2e" ${L}/><circle cy="-52" r="22" fill="#bfe6ff" opacity="0.6"/><circle cy="-52" r="22" fill="none" stroke="${LINHA}" stroke-width="6"/><circle cy="-52" r="22" fill="none" stroke="#c9a14a" stroke-width="3"/></g>`;
    case 'buque': return `<g transform="translate(${x} ${y - 6})"><path d="M-6 0 L0 30 L6 0" fill="#2fa36b" ${L}/>${[[-12, -8, '#f28fb0'], [0, -16, '#ffffff'], [12, -8, '#f28fb0'], [-6, 2, '#ffffff'], [8, 2, '#f2c94c']].map(([a, b, c]) => `<circle cx="${a}" cy="${b}" r="10" fill="${c}" ${L}/>`).join('')}</g>`;
    case 'laco': return `<g transform="translate(${x + 10} ${y - 20})"><ellipse rx="30" ry="22" fill="none" stroke="#c9965a" stroke-width="6"/><ellipse rx="30" ry="22" fill="none" stroke="${LINHA}" stroke-width="1.5"/><path d="M-20 18 q-10 20 6 34" stroke="#c9965a" stroke-width="6" fill="none"/></g>`;
    case 'disco': return `<g transform="translate(${x + 4} ${y - 26})"><circle r="30" fill="#1a1a1e" ${L}/><circle r="20" fill="none" stroke="#444" stroke-width="2"/><circle r="10" fill="#e5484d"/><circle r="2.5" fill="#fff"/></g>`;
    case 'balao': { const t = Math.min(110, y - 80); return `<path d="M${x} ${y} Q${x + 14} ${y - t / 2} ${x + 4} ${y - t}" stroke="${LINHA}" stroke-width="2.5" fill="none"/><ellipse cx="${x + 4}" cy="${y - t - 32}" rx="28" ry="34" fill="#e5484d" ${L}/><path d="M${x - 6} ${y - t - 48} q6 -10 14 -8" stroke="#fff" stroke-width="4" fill="none" opacity="0.7"/>`; }
    case 'bandeira': return `<path d="M${x} ${y + 6} V${y - 110}" stroke="${LINHA}" stroke-width="6"/><path d="M${x} ${y - 110} h60 l-12 20 l12 20 h-60 z" fill="#2fa36b" ${L}/><circle cx="${x + 26}" cy="${y - 90}" r="10" fill="#f2c94c"/>`;
    case 'presentes': return `<g transform="translate(${x - 14} ${y + 40})"><path d="M-38 14 q-8 -56 30 -62 h18 q38 6 30 62 q0 20 -38 20 q-40 0 -40 -20 z" fill="#c22a2a" ${L}/><path d="M-12 -48 l12 -12 l12 12" fill="none" stroke="#f2c94c" stroke-width="5"/><rect x="-16" y="-60" width="18" height="16" fill="#2fa36b" ${L}/><rect x="4" y="-66" width="16" height="20" fill="#3d8bfd" ${L}/></g>`;
    case 'chave': return `<g transform="translate(${x} ${y}) rotate(25)"><rect x="-5" y="-58" width="10" height="54" rx="3" fill="#9aa0aa" ${L}/><path d="M-14 -58 a14 14 0 1 1 28 0 l-6 0 l0 -10 l-16 0 l0 10 z" fill="#9aa0aa" ${L}/></g>`;
    case 'pao': return `<g transform="translate(${x} ${y - 10}) rotate(-35)"><rect x="-14" y="-60" width="28" height="100" rx="14" fill="#d9a05a" ${L}/>${[-40, -18, 4, 26].map((t) => `<path d="M-8 ${t} l16 -10" stroke="${LINHA}" stroke-width="2.5" opacity="0.5"/>`).join('')}</g>`;
    case 'sorvete': return `<g transform="translate(${x} ${y - 6})"><path d="M-14 -10 L0 26 L14 -10 z" fill="#d9a05a" ${L}/><circle cy="-20" r="15" fill="#f6b8c8" ${L}/><circle cx="-2" cy="-40" r="13" fill="#7be0c0" ${L}/><circle cx="2" cy="-55" r="6" fill="#e5484d" ${L}/></g>`;
    case 'regador': return `<g transform="translate(${x + 10} ${y + 20})"><rect x="-26" y="-30" width="44" height="40" rx="6" fill="#2fa36b" ${L}/><path d="M18 -20 L46 -40 l6 6 L22 -8 z" fill="#2fa36b" ${L}/><path d="M-14 -30 q8 -20 20 0" fill="none" ${L}/><path d="M54 -30 l8 10 M58 -36 l10 6 M50 -24 l4 12" stroke="#6ab7ff" stroke-width="3"/></g>`;
    case 'vara': return `<path d="M${x} ${y} L${x - 6} ${y - 120}" stroke="${LINHA}" stroke-width="8" stroke-linecap="round"/><path d="M${x} ${y} L${x - 6} ${y - 120}" stroke="#8a5a32" stroke-width="4" stroke-linecap="round"/><path d="M${x - 6} ${y - 120} Q${x - 30} ${y - 70} ${x - 24} ${y - 30}" stroke="${LINHA}" stroke-width="2" fill="none"/><g transform="translate(${x - 24} ${y - 14}) scale(-1 1)"><path d="M-16 0 q16 -16 32 0 q-16 16 -32 0 z M16 0 l10 -9 v18 z" fill="#ff8a2f" ${L}/><circle cx="-8" cy="-2" r="2.5" fill="${LINHA}"/></g>`;
    case 'escova': return `<g transform="translate(${x} ${y}) rotate(20)"><rect x="-6" y="-80" width="12" height="76" rx="5" fill="#3dc4d8" ${L}/><rect x="-10" y="-96" width="20" height="20" rx="3" fill="#fff" ${L}/><path d="M-6 -96 v-8 M0 -96 v-8 M6 -96 v-8" stroke="#3d8bfd" stroke-width="3"/></g>`;
    case 'tesoura': return `<g transform="translate(${x} ${y}) rotate(-20)"><path d="M-4 -10 L10 -64 M4 -10 L-10 -64" stroke="#9aa0aa" stroke-width="7" stroke-linecap="round"/><circle cx="-8" cy="0" r="9" fill="none" stroke="#e5484d" stroke-width="5"/><circle cx="8" cy="0" r="9" fill="none" stroke="#e5484d" stroke-width="5"/></g>`;
    case 'raquete': return `<g transform="translate(${x} ${y}) rotate(25)"><rect x="-5" y="-40" width="10" height="38" rx="4" fill="#1a1a1e" ${L}/><ellipse cy="-70" rx="24" ry="32" fill="#fff" fill-opacity="0.6" stroke="#e5484d" stroke-width="6"/><path d="M-14 -88 v36 M0 -100 v60 M14 -88 v36 M-22 -70 h44 M-18 -84 h36 M-18 -56 h36" stroke="${LINHA}" stroke-width="1.5" opacity="0.5"/></g><circle cx="${x + 46}" cy="${y - 96}" r="10" fill="#d4f24c" ${L}/>`;
    case 'tridente': return `<path d="M${x} ${y + 60} V${y - 100}" stroke="${LINHA}" stroke-width="10" stroke-linecap="round"/><path d="M${x} ${y + 60} V${y - 100}" stroke="#c22a2a" stroke-width="5"/><path d="M${x - 22} ${y - 128} V${y - 104} Q${x} ${y - 90} ${x + 22} ${y - 104} V${y - 128} M${x} ${y - 136} V${y - 100}" stroke="${LINHA}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M${x - 22} ${y - 128} V${y - 104} Q${x} ${y - 90} ${x + 22} ${y - 104} V${y - 128} M${x} ${y - 136} V${y - 100}" stroke="#c22a2a" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    case 'harpa': return `<g transform="translate(${x} ${y - 10})"><path d="M-20 30 Q-26 -40 10 -60 Q30 -30 20 30 z" fill="none" stroke="#f2c94c" stroke-width="7"/><path d="M-12 24 V-40 M-2 26 V-52 M8 26 V-50" stroke="${LINHA}" stroke-width="2"/></g>`;
    default: return '';
  }
};

// ---------- Corpo stick ----------
// k = { pele, cabelo, corCabelo, roupa, calca, sapato?, saia?, chapeu?, corChapeu?, gravata?, colete?, oculos?, bigode?, tipo: 'adulto'|'crianca'|'idoso'|'bebe', braco: 'baixo'|'acena'|'palma'|'cintura'|'continencia'|'colo', rosto, numero?, etiqueta?, bolsa? }
export const stick = (k, w = 360, h = 520) => {
  const kid = k.tipo === 'crianca', baby = k.tipo === 'bebe', old = k.tipo === 'idoso';
  const S = baby ? 0.55 : kid ? 0.78 : 1;
  const cx = w / 2;
  const chao = h - 30;
  const C = k.corpo;
  const perna = (baby ? 0 : kid ? 110 : 150) * (old ? 0.95 : 1) * (C === 'alto' ? 1.13 : C === 'baixo' ? 0.74 : 1) * (k.cadeira ? 0.62 : 1);
  const troncoH = (baby ? 0 : kid ? 95 : 125) * (C === 'alto' ? 1.08 : C === 'gordo' ? 1.06 : C === 'baixo' ? 0.92 : 1);
  const troncoW = (kid ? 84 : 102) * (old ? 1.08 : 1) * (C === 'gordo' ? 1.38 : C === 'magro' ? 0.78 : C === 'baixo' ? 1.1 : 1);
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
  if (k.chapeu === 'veu') out += `<path d="M${cx - r * 0.5} ${cy - r * 0.95} Q${cx - r * 1.6} ${cy + r * 0.5} ${cx - r * 1.3} ${cy + r * 2.6} H${cx + r * 1.3} Q${cx + r * 1.6} ${cy + r * 0.5} ${cx + r * 0.5} ${cy - r * 0.95} z" fill="#ffffff" opacity="0.85" stroke="#cfd4dc" stroke-width="3"/>`;
  if (!baby && k.asas) out += [-1, 1].map((d) => `<path d="M${cx + d * 20} ${ombro + 30} C${cx + d * 120} ${ombro - 90}, ${cx + d * 170} ${ombro + 10}, ${cx + d * 110} ${ombro + 70} C${cx + d * 150} ${ombro + 90}, ${cx + d * 110} ${ombro + 140}, ${cx + d * 20} ${ombro + 70} z" fill="${k.asas}" opacity="0.9" stroke="${LINHA}" stroke-width="4" stroke-linejoin="round"/>`).join('');
  if (!baby && k.cadeira) out += [-1, 1].map((d) => `<circle cx="${cx + d * troncoW * 0.72}" cy="${chao - 62}" r="62" fill="none" stroke="${LINHA}" stroke-width="12"/><circle cx="${cx + d * troncoW * 0.72}" cy="${chao - 62}" r="62" fill="none" stroke="#9aa0aa" stroke-width="6"/><circle cx="${cx + d * troncoW * 0.72}" cy="${chao - 62}" r="9" fill="${LINHA}"/>`).join('') + `<rect x="${cx - troncoW * 0.75}" y="${quadril - 8}" width="${troncoW * 1.5}" height="16" rx="6" fill="${k.cadeira}" stroke="${LINHA}" stroke-width="4"/><rect x="${cx - troncoW * 0.6}" y="${ombro - 6}" width="${troncoW * 1.2}" height="${troncoH * 0.6}" rx="10" fill="${k.cadeira}" stroke="${LINHA}" stroke-width="4"/>`;
  if (!baby && k.capa) out += `<path d="M${cx - troncoW * 0.42} ${ombro + 6} L${cx - troncoW * 0.95} ${chao - 30} Q${cx} ${chao - 6} ${cx + troncoW * 0.95} ${chao - 30} L${cx + troncoW * 0.42} ${ombro + 6} z" fill="${k.capa}" stroke="${LINHA}" stroke-width="5" stroke-linejoin="round"/>`;
  if (!baby && k.mochila) out += `<rect x="${cx - troncoW * 0.62}" y="${ombro + 14}" width="${troncoW * 1.24}" height="${troncoH * 0.8}" rx="18" fill="${k.mochila}" stroke="${LINHA}" stroke-width="5"/>`;
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
    const lx = troncoW * (C === 'gordo' ? 0.2 : 0.22);
    if (k.calca && k.short) {
      out += membro(`M${cx - lx} ${quadril - 4} L${cx - lx - 4} ${chao - 8} M${cx + lx} ${quadril - 4} L${cx + lx + 4} ${chao - 8}`, k.pele);
      out += membro(`M${cx - lx} ${quadril - 4} L${cx - lx - 1.5} ${quadril + perna * 0.36} M${cx + lx} ${quadril - 4} L${cx + lx + 1.5} ${quadril + perna * 0.36}`, k.calca);
    } else if (k.calca && !k.saia) {
      const pl = `M${cx - lx} ${quadril - 4} L${cx - lx - 4} ${chao - 8} M${cx + lx} ${quadril - 4} L${cx + lx + 4} ${chao - 8}`;
      out += membro(pl, k.calca);
    } else {
      const pl = `M${cx - lx} ${quadril - 4} L${cx - lx - 4} ${chao - 8} M${cx + lx} ${quadril - 4} L${cx + lx + 4} ${chao - 8}`;
      out += membro(pl, k.pele);
    }
    out += pe(cx - lx - 8) + pe(cx + lx + 8);
    if (k.tutu) out += `<path d="M${cx - troncoW * 0.5} ${quadril - 14} L${cx - troncoW * 1.15} ${quadril + 18} Q${cx - troncoW * 0.9} ${quadril + 28} ${cx - troncoW * 0.6} ${quadril + 20} Q${cx - troncoW * 0.3} ${quadril + 32} ${cx} ${quadril + 22} Q${cx + troncoW * 0.3} ${quadril + 32} ${cx + troncoW * 0.6} ${quadril + 20} Q${cx + troncoW * 0.9} ${quadril + 28} ${cx + troncoW * 1.15} ${quadril + 18} L${cx + troncoW * 0.5} ${quadril - 14} z" fill="${k.tutu}" stroke="${LINHA}" stroke-width="4" stroke-linejoin="round"/>`;
    if (k.saia) { const fim = k.vestido ? chao - 34 : quadril + 42 * S, abre = k.vestido ? 1.0 : 0.85;
      out += `<path d="M${cx - troncoW * 0.55} ${quadril - 12} L${cx - troncoW * abre} ${fim} Q${cx} ${fim + 10} ${cx + troncoW * abre} ${fim} L${cx + troncoW * 0.55} ${quadril - 12} z" fill="${k.saia}" stroke="${LINHA}" stroke-width="4" stroke-linejoin="round"/>`; }
    // braços (desenhados atrás do tronco nas poses baixas)
    const bracos = {
      baixo: [`M${cx - troncoW / 2 + 6} ${ombro + 14} L${cx - troncoW / 2 - 18} ${ombro + 70} L${cx - troncoW / 2 - 22} ${ombro + 112}`, `M${cx + troncoW / 2 - 6} ${ombro + 14} L${cx + troncoW / 2 + 18} ${ombro + 70} L${cx + troncoW / 2 + 22} ${ombro + 112}`],
      acena: [`M${cx - troncoW / 2 + 6} ${ombro + 14} L${cx - troncoW / 2 - 18} ${ombro + 70} L${cx - troncoW / 2 - 22} ${ombro + 112}`, `M${cx + troncoW / 2 - 6} ${ombro + 14} L${cx + troncoW / 2 + 48} ${ombro - 10} L${cx + troncoW / 2 + 62} ${ombro - 70}`],
      palma: [`M${cx - troncoW / 2 + 6} ${ombro + 14} L${cx - troncoW / 2 - 18} ${ombro + 70} L${cx - troncoW / 2 - 22} ${ombro + 112}`, `M${cx + troncoW / 2 - 6} ${ombro + 14} L${cx + troncoW / 2 + 40} ${ombro + 30} L${cx + troncoW / 2 + 70} ${ombro - 30}`],
      cintura: [`M${cx - troncoW / 2 + 6} ${ombro + 14} L${cx - troncoW / 2 - 34} ${ombro + 55} L${cx - troncoW / 2 + 4} ${ombro + 92}`, `M${cx + troncoW / 2 - 6} ${ombro + 14} L${cx + troncoW / 2 + 34} ${ombro + 55} L${cx + troncoW / 2 - 4} ${ombro + 92}`],
      continencia: [`M${cx - troncoW / 2 + 6} ${ombro + 14} L${cx - troncoW / 2 - 18} ${ombro + 70} L${cx - troncoW / 2 - 22} ${ombro + 112}`, `M${cx + troncoW / 2 - 6} ${ombro + 14} L${cx + troncoW / 2 + 52} ${ombro - 4} L${cx + r * 0.62} ${cy - r * 0.45}`],
      colo: [`M${cx - troncoW / 2 + 6} ${ombro + 14} L${cx - troncoW / 2 - 6} ${ombro + 66} L${cx + 20} ${ombro + 72}`, `M${cx + troncoW / 2 - 6} ${ombro + 14} L${cx + troncoW / 2 + 6} ${ombro + 66} L${cx - 20} ${ombro + 72}`],
    }[k.braco ?? 'baixo'];
    const mao = (d) => { const p = d.trim().split(/[ ML]+/).filter(Boolean); const x = p[p.length - 2], y = p[p.length - 1]; return k.luvas ? `<circle cx="${x}" cy="${y}" r="${GROSSO / 2 + 16}" fill="${k.luvas}" stroke="${LINHA}" stroke-width="4"/><path d="M${x - 10} ${y - 6} q10 -10 20 0" stroke="#fff" stroke-width="3" fill="none" opacity="0.6"/>` : `<circle cx="${x}" cy="${y}" r="${GROSSO / 2 + 6}" fill="${k.pele}" stroke="${LINHA}" stroke-width="4"/>`; };
    const frenteBracos = ['colo', 'cintura'].includes(k.braco);
    const desenhaBracos = bracos.map((d) => membro(d, k.manga ?? k.roupa)).join('') + bracos.map(mao).join('');
    if (!frenteBracos) out += desenhaBracos;
    // tronco (camiseta)
    { const a = troncoW, hh = troncoH, b = quadril + 8 + (k.jaleco ? 34 : 0);
      const tp = `M${cx - 0.36 * a} ${ombro} Q${cx - 0.5 * a} ${ombro} ${cx - 0.5 * a} ${ombro + 0.25 * hh} C${cx - 0.57 * a} ${ombro + 0.7 * hh} ${cx - 0.52 * a} ${b} ${cx - 0.28 * a} ${b} H${cx + 0.28 * a} C${cx + 0.52 * a} ${b} ${cx + 0.57 * a} ${ombro + 0.7 * hh} ${cx + 0.5 * a} ${ombro + 0.25 * hh} Q${cx + 0.5 * a} ${ombro} ${cx + 0.36 * a} ${ombro} z`;
      const id = `t${++UID}`;
      out += `<clipPath id="${id}"><path d="${tp}"/></clipPath>`;
      out += `<path d="${tp}" fill="${k.jaleco ?? k.roupa}"/>`;
      const g = [];
      if (k.jaleco) g.push(`<path d="M${cx - 0.17 * a} ${ombro - 4} L${cx - 0.1 * a} ${quadril + 4} H${cx + 0.1 * a} L${cx + 0.17 * a} ${ombro - 4} z" fill="${k.roupa}" stroke="${LINHA}" stroke-width="3"/><path d="M${cx - 0.17 * a} ${ombro - 4} L${cx - 0.1 * a} ${b} M${cx + 0.17 * a} ${ombro - 4} L${cx + 0.1 * a} ${b}" stroke="${LINHA}" stroke-width="3.5"/><rect x="${cx - 0.42 * a}" y="${ombro + 0.55 * hh}" width="${0.2 * a}" height="${0.18 * hh}" fill="none" stroke="${LINHA}" stroke-width="3" opacity="0.5"/>`);
      if (k.estampa === 'listras') for (let y = ombro + 10; y < b; y += 22) g.push(`<rect x="${cx - a}" y="${y}" width="${2 * a}" height="10" fill="${k.estampaCor}"/>`);
      if (k.estampa === 'xadrez') { for (let y = ombro + 6; y < b; y += 24) g.push(`<rect x="${cx - a}" y="${y}" width="${2 * a}" height="10" fill="${k.estampaCor}" opacity="0.55"/>`); for (let x = cx - a; x < cx + a; x += 24) g.push(`<rect x="${x}" y="${ombro}" width="10" height="${hh + 60}" fill="${k.estampaCor}" opacity="0.55"/>`); }
      if (k.estampa === 'bolinhas') for (let y = ombro + 14, i = 0; y < b; y += 22, i++) for (let x = cx - a + (i % 2) * 11; x < cx + a; x += 22) g.push(`<circle cx="${x}" cy="${y}" r="5" fill="${k.estampaCor}"/>`);
      if (k.estampa === 'florido') for (let y = ombro + 16, i = 0; y < b; y += 30, i++) for (let x = cx - a + (i % 2) * 15; x < cx + a; x += 30) g.push(`<g fill="${k.estampaCor}">${[0, 1, 2, 3, 4].map((j) => `<circle cx="${x + Math.cos(j * 1.256) * 6}" cy="${y + Math.sin(j * 1.256) * 6}" r="4.5"/>`).join('')}</g><circle cx="${x}" cy="${y}" r="3" fill="#ffe27a"/>`);
      if (k.peito === 'estrela') g.push(`<path d="M${cx} ${ombro + 0.3 * hh} l9 19 l20 2 l-15 13 l5 20 l-19 -10 l-19 10 l5 -20 l-15 -13 l20 -2 z" fill="${k.peitoCor ?? '#f2c94c'}" stroke="${LINHA}" stroke-width="3" stroke-linejoin="round"/>`);
      if (k.peito === 'distintivo') g.push(`<path d="M${cx - 0.3 * a} ${ombro + 0.26 * hh} l10 -6 l10 6 v12 q-10 10 -20 0 z" fill="#f2c94c" stroke="${LINHA}" stroke-width="3"/>`);
      if (k.peito && /^\d+$/.test(k.peito)) g.push(`<text x="${cx}" y="${ombro + 0.62 * hh}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${0.4 * hh}" fill="${k.peitoCor ?? '#fff'}" stroke="${LINHA}" stroke-width="2">${k.peito}</text>`);
      if (k.peito === 'coracao') g.push(`<path d="M${cx} ${ombro + 0.62 * hh} l-16 -16 a9 9 0 0 1 16 -12 a9 9 0 0 1 16 12 z" fill="${k.peitoCor ?? '#e5484d'}" stroke="${LINHA}" stroke-width="3"/>`);
      if (k.peito === 'raio') g.push(`<path d="M${cx + 6} ${ombro + 0.18 * hh} l-22 34 h16 l-8 30 l24 -38 h-16 z" fill="${k.peitoCor ?? '#f2c94c'}" stroke="${LINHA}" stroke-width="3" stroke-linejoin="round"/>`);
      if (k.mochila) g.push(`<path d="M${cx - 0.36 * a} ${ombro} L${cx - 0.3 * a} ${ombro + 0.75 * hh} M${cx + 0.36 * a} ${ombro} L${cx + 0.3 * a} ${ombro + 0.75 * hh}" stroke="${k.mochila}" stroke-width="9"/>`);
      if (k.capuz) g.push(`<path d="M${cx - 0.42 * a} ${ombro + 2} Q${cx} ${ombro + 30} ${cx + 0.42 * a} ${ombro + 2}" stroke="${LINHA}" stroke-width="4" fill="${k.capuz}"/><path d="M${cx - 0.25 * a} ${ombro + 0.65 * hh} h${0.5 * a} v${0.25 * hh} h${-0.5 * a} z" fill="none" stroke="${LINHA}" stroke-width="3" opacity="0.5"/><path d="M${cx - 8} ${ombro + 18} v26 M${cx + 8} ${ombro + 18} v26" stroke="#fff" stroke-width="3"/>`);
      out += `<g clip-path="url(#${id})">${g.join('')}</g>`;
      out += `<path d="${tp}" fill="none" stroke="${LINHA}" stroke-width="5"/>`; }
    if (k.cinto) out += `<rect x="${cx - troncoW * 0.52}" y="${quadril - 26}" width="${troncoW * 1.04}" height="16" fill="${k.cinto}" stroke="${LINHA}" stroke-width="3"/><rect x="${cx - 12}" y="${quadril - 30}" width="24" height="24" rx="3" fill="none" stroke="#f2c94c" stroke-width="5"/>`;
    if (k.medalha) out += `<path d="M${cx - 16} ${ombro} L${cx} ${ombro + 50} L${cx + 16} ${ombro}" stroke="#3d8bfd" stroke-width="7" fill="none"/><circle cx="${cx}" cy="${ombro + 58}" r="14" fill="#f2c94c" stroke="${LINHA}" stroke-width="3"/><text x="${cx}" y="${ombro + 64}" text-anchor="middle" font-family="Arial Black, Arial" font-weight="900" font-size="15" fill="${LINHA}">1</text>`;
    if (k.colar) out += `<path d="M${cx - troncoW * 0.28} ${ombro + 2} Q${cx} ${ombro + 50} ${cx + troncoW * 0.28} ${ombro + 2}" stroke="${k.colar}" stroke-width="6" fill="none" stroke-dasharray="7 4"/><circle cx="${cx}" cy="${ombro + 28}" r="9" fill="${k.colar}" stroke="${LINHA}" stroke-width="2.5"/>`;
    if (k.estetoscopio) out += `<path d="M${cx - troncoW * 0.22} ${ombro} Q${cx - troncoW * 0.3} ${ombro + 60} ${cx} ${ombro + 66} Q${cx + troncoW * 0.3} ${ombro + 60} ${cx + troncoW * 0.22} ${ombro}" stroke="#3a3a44" stroke-width="5" fill="none"/><circle cx="${cx}" cy="${ombro + 72}" r="9" fill="#c9ccd4" stroke="${LINHA}" stroke-width="3"/>`;
    if (k.colete) out += `<path d="M${cx - troncoW * 0.47} ${ombro + 30} h${troncoW * 0.94} M${cx - troncoW * 0.5} ${ombro + 70} h${troncoW}" stroke="${k.colete}" stroke-width="10"/>`;
    if (k.gravata) out += `<path d="M${cx} ${ombro + 2} l-9 12 l9 50 l9 -50 z" fill="${k.gravata}" stroke="${LINHA}" stroke-width="3"/><path d="M${cx - 16} ${ombro} l16 14 l16 -14" fill="#fff" stroke="${LINHA}" stroke-width="3"/>`;
    if (k.avental) out += `<rect x="${cx - troncoW * 0.32}" y="${ombro + 30}" width="${troncoW * 0.64}" height="${troncoH - 24}" rx="6" fill="${k.avental}" stroke="${LINHA}" stroke-width="3"/>`;
    if (k.etiqueta) out += `<rect x="${cx + 4}" y="${ombro + 26}" width="24" height="14" rx="3" fill="#fff" stroke="${LINHA}" stroke-width="2"/>`;
    if (frenteBracos) out += desenhaBracos;
    const ponta = (d) => { const p = d.trim().split(/[ ML]+/).filter(Boolean).map(Number); return [p[p.length - 2], p[p.length - 1]]; };
    if (k.item) out += item(k.item, ...ponta(bracos[1]), k);
    if (k.item2) out += item(k.item2, ...ponta(bracos[0]), k, chao);
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
  // fios brancos no cabelo (k.fios = quantidade)
  for (let i = 0; i < (k.fios ?? 0); i++) {
    const ang = -Math.PI / 2 + (i - ((k.fios ?? 1) - 1) / 2) * 0.32 + 0.12;
    const x0 = cx + Math.cos(ang) * r * 0.9, y0 = cy + Math.sin(ang) * r * 0.9;
    const d = `M${x0} ${y0} q${Math.cos(ang) * r * 0.25 + r * 0.12} ${Math.sin(ang) * r * 0.35} ${Math.cos(ang) * r * 0.1 + r * 0.25} ${Math.sin(ang) * r * 0.55}`;
    out += `<path d="${d}" stroke="${LINHA}" stroke-width="${r * 0.11}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#ffffff" stroke-width="${r * 0.06}" fill="none" stroke-linecap="round"/>`;
  }
  if (k.oculos) out += `<circle cx="${cx - r * 0.34}" cy="${cy - r * 0.05}" r="${r * 0.2}" fill="none" stroke="${LINHA}" stroke-width="4"/><circle cx="${cx + r * 0.34}" cy="${cy - r * 0.05}" r="${r * 0.2}" fill="none" stroke="${LINHA}" stroke-width="4"/><path d="M${cx - r * 0.14} ${cy - r * 0.05} h${r * 0.28}" stroke="${LINHA}" stroke-width="4"/>`;
  if (k.mascara) out += `<path d="M${cx - r * 0.98} ${cy - r * 0.28} Q${cx} ${cy - r * 0.4} ${cx + r * 0.98} ${cy - r * 0.28} L${cx + r * 0.95} ${cy + r * 0.12} Q${cx} ${cy} ${cx - r * 0.95} ${cy + r * 0.12} z" fill="${k.mascara}" stroke="${LINHA}" stroke-width="4"/><ellipse cx="${cx - r * 0.34}" cy="${cy - r * 0.07}" rx="${r * 0.17}" ry="${r * 0.12}" fill="#fff"/><ellipse cx="${cx + r * 0.34}" cy="${cy - r * 0.07}" rx="${r * 0.17}" ry="${r * 0.12}" fill="#fff"/>`;
  if (k.barba) out += `<path d="M${cx - r * 0.92} ${cy + r * 0.05} Q${cx - r * 0.85} ${cy + r * 1.15} ${cx} ${cy + r * 1.2} Q${cx + r * 0.85} ${cy + r * 1.15} ${cx + r * 0.92} ${cy + r * 0.05} Q${cx + r * 0.6} ${cy + r * 0.55} ${cx + r * 0.3} ${cy + r * 0.25} Q${cx} ${cy + r * 0.12} ${cx - r * 0.3} ${cy + r * 0.25} Q${cx - r * 0.6} ${cy + r * 0.55} ${cx - r * 0.92} ${cy + r * 0.05} z" fill="${k.corBarba ?? k.corCabelo}" stroke="${LINHA}" stroke-width="4"/>`;
  out += rosto(k.rosto ?? 'neutro', cx, cy, r);
  if (k.ninja) { const id = `h${++UID}`;
    out += `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><g clip-path="url(#${id})"><rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${r * 0.78}" fill="${k.ninja}"/><rect x="${cx - r}" y="${cy + r * 0.14}" width="${2 * r}" height="${r}" fill="${k.ninja}"/></g><path d="M${cx - r} ${cy - r * 0.22} h${2 * r} M${cx - r} ${cy + r * 0.14} h${2 * r}" stroke="${LINHA}" stroke-width="4" clip-path="url(#${id})"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${LINHA}" stroke-width="5"/><path d="M${cx + r * 0.9} ${cy - r * 0.35} q${r * 0.5} ${-r * 0.1} ${r * 0.7} ${r * 0.3} M${cx + r * 0.9} ${cy - r * 0.3} q${r * 0.4} ${r * 0.2} ${r * 0.45} ${r * 0.55}" stroke="${k.ninja}" stroke-width="${r * 0.14}" stroke-linecap="round" fill="none"/>`; }
  if (k.nariz) out += `<circle cx="${cx}" cy="${cy + r * 0.12}" r="${r * 0.16}" fill="${k.nariz}" stroke="${LINHA}" stroke-width="3"/><circle cx="${cx - r * 0.05}" cy="${cy + r * 0.07}" r="${r * 0.04}" fill="#fff" opacity="0.7"/>`;
  if (k.tapaOlho) out += `<path d="M${cx - r * 0.9} ${cy - r * 0.55} L${cx + r * 0.95} ${cy + r * 0.1}" stroke="${LINHA}" stroke-width="4"/><ellipse cx="${cx + r * 0.34}" cy="${cy - r * 0.06}" rx="${r * 0.2}" ry="${r * 0.17}" fill="${LINHA}"/>`;
  if (k.presas) out += `<path d="M${cx - r * 0.13} ${cy + r * 0.36} l${r * 0.05} ${r * 0.14} l${r * 0.05} ${-r * 0.14} z M${cx + r * 0.03} ${cy + r * 0.36} l${r * 0.05} ${r * 0.14} l${r * 0.05} ${-r * 0.14} z" fill="#fff" stroke="${LINHA}" stroke-width="1.5"/>`;
  if (k.curativo) out += `<g transform="rotate(-25 ${cx - r * 0.45} ${cy - r * 0.55})"><rect x="${cx - r * 0.75}" y="${cy - r * 0.64}" width="${r * 0.6}" height="${r * 0.18}" rx="${r * 0.06}" fill="#f2e0c0" stroke="${LINHA}" stroke-width="2.5"/></g>`;
  if (k.chapeu === 'astronauta') out += `<circle cx="${cx}" cy="${cy}" r="${r * 1.28}" fill="#bfe6ff" opacity="0.28"/><circle cx="${cx}" cy="${cy}" r="${r * 1.28}" fill="none" stroke="${LINHA}" stroke-width="5"/><path d="M${cx - r * 0.85} ${cy - r * 0.6} q${r * 0.3} ${-r * 0.45} ${r * 0.8} ${-r * 0.55}" stroke="#fff" stroke-width="${r * 0.1}" fill="none" stroke-linecap="round" opacity="0.8"/><rect x="${cx - r * 0.9}" y="${cy + r * 1.05}" width="${r * 1.8}" height="${r * 0.28}" rx="${r * 0.1}" fill="#c9ccd4" stroke="${LINHA}" stroke-width="4"/>`;
  if (k.aureola) out += `<ellipse cx="${cx}" cy="${cy - r * 1.3}" rx="${r * 0.55}" ry="${r * 0.14}" fill="none" stroke="#f2c94c" stroke-width="${r * 0.12}"/>`;
  if (k.chifres) out += [-1, 1].map((d) => `<path d="M${cx + d * r * 0.45} ${cy - r * 0.82} Q${cx + d * r * 0.75} ${cy - r * 1.25} ${cx + d * r * 0.55} ${cy - r * 1.5} Q${cx + d * r * 0.4} ${cy - r * 1.15} ${cx + d * r * 0.2} ${cy - r * 0.95} z" fill="${k.chifres}" stroke="${LINHA}" stroke-width="3.5"/>`).join('');
  if (k.antenas) out += [-1, 1].map((d) => `<path d="M${cx + d * r * 0.3} ${cy - r * 0.92} L${cx + d * r * 0.55} ${cy - r * 1.55}" stroke="${LINHA}" stroke-width="4"/><circle cx="${cx + d * r * 0.57}" cy="${cy - r * 1.6}" r="${r * 0.13}" fill="${k.antenas}" stroke="${LINHA}" stroke-width="3"/>`).join('');
  if (k.robo) out += `<path d="M${cx} ${cy - r} V${cy - r * 1.45}" stroke="${LINHA}" stroke-width="4"/><circle cx="${cx}" cy="${cy - r * 1.5}" r="${r * 0.12}" fill="#e5484d" stroke="${LINHA}" stroke-width="3"/>${[-1, 1].map((d) => `<rect x="${cx + d * r - (d > 0 ? 0 : r * 0.2)}" y="${cy - r * 0.2}" width="${r * 0.2}" height="${r * 0.4}" rx="${r * 0.05}" fill="#9aa0aa" stroke="${LINHA}" stroke-width="3"/>`).join('')}<circle cx="${cx - r * 0.6}" cy="${cy - r * 0.6}" r="3" fill="${LINHA}" opacity="0.5"/><circle cx="${cx + r * 0.6}" cy="${cy - r * 0.6}" r="3" fill="${LINHA}" opacity="0.5"/>`;
  if (k.mumia) { const id = `m${++UID}`; out += `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><g clip-path="url(#${id})" stroke="${LINHA}" stroke-width="2" opacity="0.55" fill="none">${[-0.75, -0.45, 0.35, 0.65, 0.9].map((d, i) => `<path d="M${cx - r} ${cy + d * r + (i % 2 ? 6 : -6)} L${cx + r} ${cy + d * r + (i % 2 ? -6 : 6)}"/>`).join('')}</g>`; }
  if (k.mascaraCirurgica) out += `<path d="M${cx - r * 0.55} ${cy + r * 0.1} Q${cx} ${cy + r * 0.02} ${cx + r * 0.55} ${cy + r * 0.1} L${cx + r * 0.5} ${cy + r * 0.55} Q${cx} ${cy + r * 0.72} ${cx - r * 0.5} ${cy + r * 0.55} z" fill="${k.mascaraCirurgica}" stroke="${LINHA}" stroke-width="3"/><path d="M${cx - r * 0.55} ${cy + r * 0.15} L${cx - r * 0.95} ${cy - r * 0.05} M${cx + r * 0.55} ${cy + r * 0.15} L${cx + r * 0.95} ${cy - r * 0.05}" stroke="${LINHA}" stroke-width="2.5"/><path d="M${cx - r * 0.4} ${cy + r * 0.3} h${r * 0.8} M${cx - r * 0.42} ${cy + r * 0.42} h${r * 0.84}" stroke="${LINHA}" stroke-width="2" opacity="0.35"/>`;
  if (k.mergulho) out += `<rect x="${cx - r * 0.72}" y="${cy - r * 0.35}" width="${r * 1.44}" height="${r * 0.55}" rx="${r * 0.2}" fill="#bfe6ff" fill-opacity="0.45" stroke="${LINHA}" stroke-width="5"/><path d="M${cx - r * 0.72} ${cy - r * 0.1} L${cx - r} ${cy - r * 0.2} M${cx + r * 0.72} ${cy - r * 0.1} L${cx + r} ${cy - r * 0.2}" stroke="${k.mergulho}" stroke-width="7"/><path d="M${cx + r * 0.8} ${cy + r * 0.3} V${cy - r * 1.1} q0 -10 10 -10" stroke="${LINHA}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${cx + r * 0.8} ${cy + r * 0.3} V${cy - r * 1.1} q0 -10 10 -10" stroke="${k.mergulho}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if (k.oculosEscuros) out += `<rect x="${cx - r * 0.62}" y="${cy - r * 0.22}" width="${r * 0.52}" height="${r * 0.32}" rx="${r * 0.1}" fill="${LINHA}"/><rect x="${cx + r * 0.1}" y="${cy - r * 0.22}" width="${r * 0.52}" height="${r * 0.32}" rx="${r * 0.1}" fill="${LINHA}"/><path d="M${cx - r * 0.1} ${cy - r * 0.12} h${r * 0.2} M${cx - r * 0.62} ${cy - r * 0.15} l${-r * 0.32} ${-r * 0.04} M${cx + r * 0.62} ${cy - r * 0.15} l${r * 0.32} ${-r * 0.04}" stroke="${LINHA}" stroke-width="4"/><path d="M${cx - r * 0.52} ${cy - r * 0.14} l${r * 0.12} 0" stroke="#fff" stroke-width="3" opacity="0.6"/>`;
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

