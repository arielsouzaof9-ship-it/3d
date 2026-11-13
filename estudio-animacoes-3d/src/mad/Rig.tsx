// PERSONAGEM MAD ARTICULADO: o mesmo modelo stick (cabeça redonda, contorno escuro, braços e pernas grossos),
import { JSX } from 'react';
// agora em peças com articulações (ombro, cotovelo, quadril, joelho, pescoço), olhos grandes que piscam e olham,
// boca que fala e extras (lágrima, suor, "?"). Os movimentos ficam em ./movimentos.ts.
import { useMemo } from 'react';
// @ts-expect-error módulo JS puro, sem tipos
import { cabelo, chapeu, item, LINHA } from '../../../mad/stick.mjs';

const L = LINHA as string;
type V = [number, number];

// ---------- Pose ----------
// Coordenadas locais: pés em (0,0), para cima = y negativo. Mãos e pés são ALVOS (cinemática inversa).
export type Pose = {
  x: number; y: number; // deslocamento do corpo inteiro (pulo, andar)
  esc: number; // escala geral (entrada "pop")
  sq: number; // estica/achata (1 = normal; >1 estica, <1 achata)
  incl: number; // inclinação do corpo (graus)
  quadril: number; // abaixa o quadril (agachar), em px
  ombro: number; // sobe os ombros (dar de ombros), em px
  cabRot: number; cabX: number; cabY: number; // cabeça: tomba, vira (rosto desloca), acena
  maoE: V; maoD: V; // alvos das mãos (E = lado esquerdo da tela)
  frenteE: boolean; frenteD: boolean; // mão na frente do corpo (boca, olhos, queixo)
  peE: V; peD: V; // alvos dos pés
  // rosto
  olho: number; // abertura (0 fechado, 1 aberto, 1.3 arregalado)
  olhoFeliz: boolean; // olhos fechados em arco (riso)
  pupila: V; // direção do olhar (-1..1)
  sobr: number; // sobrancelha: -1 brava, 0 neutra, 1 surpresa/triste
  sobrTriste: boolean;
  boca: 'neutra' | 'sorriso' | 'riso' | 'aberta' | 'o' | 'triste' | 'dentes' | 'onda';
  fala: number; // 0..1 abertura extra da boca ao falar
  lagrima: number; suor: number; vermelho: number; pergunta: number; // extras (0..1)
  pisca?: number; // piscadela: fecha só o olho da direita da tela (0..1)
  sentado?: number; // 0..1: sentado de frente (coxas para a câmera, joelhos no colo)
  zzz?: number; // 0..1: "Zzz" de quem dorme
  joinha?: number; // polegar para cima: 1 = mão direita da tela, 2 = esquerda, 3 = as duas
};

export const BASE: Pose = {
  x: 0, y: 0, esc: 1, sq: 1, incl: 0, quadril: 0, ombro: 0, cabRot: 0, cabX: 0, cabY: 0,
  maoE: [-64, -150], maoD: [64, -150], frenteE: false, frenteD: false, peE: [-26, 0], peD: [26, 0],
  olho: 1, olhoFeliz: false, pupila: [0, 0], sobr: 0, sobrTriste: false, boca: 'sorriso', fala: 0,
  lagrima: 0, suor: 0, vermelho: 0, pergunta: 0, pisca: 0, sentado: 0, zzz: 0, joinha: 0,
};

// ---------- Cinemática inversa de 2 ossos ----------
const ik = (s: V, t: V, a: number, b: number, fora: number): V => {
  const dx = t[0] - s[0], dy = t[1] - s[1];
  const d = Math.min(Math.hypot(dx, dy), a + b - 0.5);
  const th = Math.atan2(dy, dx);
  const al = Math.acos(Math.max(-1, Math.min(1, (a * a + d * d - b * b) / (2 * a * d))));
  return [s[0] + a * Math.cos(th + fora * al), s[1] + a * Math.sin(th + fora * al)];
};
const fim = (s: V, t: V, a: number, b: number): V => {
  const dx = t[0] - s[0], dy = t[1] - s[1];
  const d = Math.hypot(dx, dy), m = a + b - 0.5;
  return d <= m ? t : [s[0] + (dx / d) * m, s[1] + (dy / d) * m];
};

const membro = (pts: V[], cor: string, w: number) => {
  const d = `M${pts.map((p) => p.join(' ')).join(' L')}`;
  return (
    <>
      <path d={d} stroke={L} strokeWidth={w + 8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={d} stroke={cor} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  );
};

// ---------- Rosto de olhos grandes ----------
// Máscara de rosto inteiro (bege) com cabelo penteado, sobrancelhas arqueadas, nariz e bigode longo de pontas viradas.
// Os olhos têm furos: o olhar e a piscada do personagem continuam visíveis.
const MascaraBigode = ({ r, p }: { r: number; p: Pose }) => {
  const ex = r * 0.37, rx = r * 0.3, ry = r * 0.33, dx = p.cabX * 0.6, dy = p.cabY * 0.3;
  const furo = (s: number) => `M${s * ex + dx - rx} ${dy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0 z`;
  const rosto = `M${dx} ${-r * 1.02 + dy} C${r * 0.78 + dx} ${-r * 1.02 + dy}, ${r * 1.02 + dx} ${-r * 0.5 + dy}, ${r * 0.98 + dx} ${r * 0.1 + dy} C${r * 0.95 + dx} ${r * 0.7 + dy}, ${r * 0.55 + dx} ${r * 1.06 + dy}, ${dx} ${r * 1.08 + dy} C${-r * 0.55 + dx} ${r * 1.06 + dy}, ${-r * 0.95 + dx} ${r * 0.7 + dy}, ${-r * 0.98 + dx} ${r * 0.1 + dy} C${-r * 1.02 + dx} ${-r * 0.5 + dy}, ${-r * 0.78 + dx} ${-r * 1.02 + dy}, ${dx} ${-r * 1.02 + dy} z`;
  return (
    <g>
      <path d={`${rosto} ${furo(-1)} ${furo(1)}`} fill="#eecfa8" fillRule="evenodd" stroke={L} strokeWidth={5} />
      {[-1, 1].map((s) => <ellipse key={s} cx={s * ex + dx} cy={dy} rx={rx} ry={ry} fill="none" stroke="#c9a47a" strokeWidth={r * 0.06} />)}
      {/* cabelo preto penteado para trás */}
      <path d={`M${-r * 0.8 + dx} ${-r * 0.62 + dy} C${-r * 0.7 + dx} ${-r * 1.1 + dy}, ${r * 0.7 + dx} ${-r * 1.1 + dy}, ${r * 0.8 + dx} ${-r * 0.62 + dy} C${r * 0.4 + dx} ${-r * 0.82 + dy}, ${-r * 0.4 + dx} ${-r * 0.82 + dy}, ${-r * 0.8 + dx} ${-r * 0.62 + dy} z`} fill="#1a1a1e" stroke={L} strokeWidth={4} />
      {/* sobrancelhas grossas e arqueadas */}
      {[-1, 1].map((s) => <path key={s} d={`M${s * r * 0.12 + dx} ${-r * 0.36 + dy} Q${s * r * 0.4 + dx} ${-r * 0.62 + dy} ${s * r * 0.72 + dx} ${-r * 0.36 + dy}`} stroke="#1a1a1e" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />)}
      {/* nariz */}
      <path d={`M${-r * 0.06 + dx} ${-r * 0.2 + dy} Q${-r * 0.1 + dx} ${r * 0.2 + dy} ${-r * 0.18 + dx} ${r * 0.32 + dy} Q${dx} ${r * 0.44 + dy} ${r * 0.18 + dx} ${r * 0.32 + dy} Q${r * 0.1 + dx} ${r * 0.2 + dy} ${r * 0.06 + dx} ${-r * 0.2 + dy}`} stroke="#b88a5c" strokeWidth={r * 0.04} fill="none" />
      {/* bigode longo com as pontas viradas para cima */}
      {[-1, 1].map((s) => <path key={s} d={`M${dx} ${r * 0.48 + dy} Q${s * r * 0.3 + dx} ${r * 0.42 + dy} ${s * r * 0.48 + dx} ${r * 0.5 + dy} Q${s * r * 0.62 + dx} ${r * 0.48 + dy} ${s * r * 0.58 + dx} ${r * 0.02 + dy} Q${s * r * 0.56 + dx} ${-r * 0.06 + dy} ${s * r * 0.64 + dx} ${-r * 0.1 + dy}`} stroke="#1a1a1e" strokeWidth={r * 0.07} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      {/* boca fechada da máscara */}
      <path d={`M${-r * 0.16 + dx} ${r * 0.68 + dy} Q${dx} ${r * 0.74 + dy} ${r * 0.16 + dx} ${r * 0.68 + dy}`} stroke="#b88a5c" strokeWidth={r * 0.04} fill="none" strokeLinecap="round" />
    </g>
  );
};

// Máscara de herói: capuz que cobre a cabeça toda, com dois olhos grandes de borda branca (o olhar continua aparecendo).
const MascaraHeroi = ({ r, p, cor, detalhe }: { r: number; p: Pose; cor: string; detalhe: string }) => {
  const dx = p.cabX * 0.6, dy = p.cabY * 0.3, ex = r * 0.37, rx = r * 0.33, ry = r * 0.36;
  const furo = (s: number) => `M${s * ex + dx - rx} ${dy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0 z`;
  const cabeca = `M${-r * 1.04} 0 a${r * 1.04} ${r * 1.04} 0 1 0 ${r * 2.08} 0 a${r * 1.04} ${r * 1.04} 0 1 0 ${-r * 2.08} 0 z`;
  return (
    <g>
      <path d={`${cabeca} ${furo(-1)} ${furo(1)}`} fill={cor} fillRule="evenodd" stroke={L} strokeWidth={5} />
      {[-1, 1].map((s) => <ellipse key={s} cx={s * ex + dx} cy={dy} rx={rx} ry={ry} fill="none" stroke="#fff" strokeWidth={r * 0.09} />)}
      {[-1, 1].map((s) => <ellipse key={`l${s}`} cx={s * ex + dx} cy={dy} rx={rx + r * 0.05} ry={ry + r * 0.05} fill="none" stroke={L} strokeWidth={3} />)}
      <path d={`M${-r * 0.6} ${-r * 0.75} Q0 ${-r * 1.05} ${r * 0.6} ${-r * 0.75} M0 ${-r * 1.04} V${-r * 0.52} M${-r * 0.3} ${r * 0.55} Q0 ${r * 0.7} ${r * 0.3} ${r * 0.55}`} stroke={detalhe} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
      {[[-0.75, 0.45], [0.75, 0.45], [-0.5, -0.6], [0.5, -0.6], [0, 0.85]].map(([fx, fy], i) => <circle key={i} cx={r * fx + dx * 0.3} cy={r * fy} r={r * 0.07} fill={detalhe} />)}
    </g>
  );
};

const Rosto = ({ p, r, pele, iris = '#6c9bd2', corSobr = L, cicatriz = false }: { p: Pose; r: number; pele: string; iris?: string; corSobr?: string; cicatriz?: boolean }) => {
  const ex = r * 0.37, ey = r * 0.0, rx = r * 0.27, ry = r * 0.31 * Math.max(0.05, p.olho);
  const px = p.pupila[0] * rx * 0.45, py = p.pupila[1] * ry * 0.4;
  const sb = p.sobr;
  const olhos = p.olhoFeliz
    ? [-1, 1].map((s) => <path key={s} d={`M${s * ex - rx} ${ey + 4} q${rx} ${-ry * 1.4} ${rx * 2} 0`} stroke={L} strokeWidth={r * 0.07} fill="none" strokeLinecap="round" />)
    : [-1, 1].map((s) => (s === 1 && (p.pisca ?? 0) > 0.5 ? (
        <path key={s} d={`M${s * ex - rx} ${ey + 2} q${rx} ${ry * 0.5} ${rx * 2} 0`} stroke={L} strokeWidth={r * 0.08} fill="none" strokeLinecap="round" />
      ) : (
        <g key={s}>
          <ellipse cx={s * ex} cy={ey} rx={rx} ry={ry} fill="#fff" stroke={L} strokeWidth={r * 0.04} />
          <path d={`M${s * ex - rx} ${ey} a${rx} ${ry} 0 0 1 ${rx * 2} 0`} stroke={L} strokeWidth={r * 0.07} fill="none" />
          {p.olho > 0.25 && (
            <>
              <circle cx={s * ex + px} cy={ey + py} r={Math.min(rx, ry) * 0.66} fill={iris} stroke={L} strokeWidth={r * 0.025} />
              <circle cx={s * ex + px} cy={ey + py} r={Math.min(rx, ry) * 0.36} fill={L} />
              <circle cx={s * ex + px + rx * 0.24} cy={ey + py - ry * 0.26} r={rx * 0.2} fill="#fff" />
              <circle cx={s * ex + px - rx * 0.2} cy={ey + py + ry * 0.22} r={rx * 0.09} fill="#fff" />
            </>
          )}
        </g>
      )));
  const sobr = [-1, 1].map((s) => {
    const y = ey - r * 0.32 - (p.olho > 1 ? r * 0.06 : 0) - sb * r * 0.06;
    const inc = p.sobrTriste ? -s * r * 0.08 : sb < 0 ? s * r * 0.1 : 0;
    return <path key={s} stroke={corSobr} d={`M${s * ex - rx * 0.9} ${y + (s < 0 ? inc : -inc) * 0.5} L${s * ex + rx * 0.9} ${y - (s < 0 ? inc : -inc) * 0.5}`} strokeWidth={r * 0.1} strokeLinecap="round" />;
  });
  const my = r * 0.42, mw = r * 0.24, ab = p.fala;
  const bocas: Record<Pose['boca'], JSX.Element> = {
    neutra: <path d={`M${-mw * 0.6} ${my} h${mw * 1.2}`} stroke={L} strokeWidth={r * 0.06} strokeLinecap="round" />,
    sorriso: <path d={`M${-mw} ${my - 4} q${mw} ${mw * 0.8} ${mw * 2} 0`} stroke={L} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />,
    riso: <path d={`M${-mw * 1.1} ${my - 8} q${mw * 1.1} ${mw * (1.5 + ab)} ${mw * 2.2} 0 z`} fill={L} />,
    aberta: <ellipse cx={0} cy={my + 4} rx={mw * 0.7} ry={mw * (0.35 + ab * 0.5)} fill={L} />,
    o: <ellipse cx={0} cy={my + 4} rx={mw * 0.42} ry={mw * 0.6} fill={L} />,
    triste: <path d={`M${-mw * 0.8} ${my + 8} q${mw * 0.8} ${-mw * 0.8} ${mw * 1.6} 0`} stroke={L} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />,
    dentes: <g><rect x={-mw} y={my - 8} width={mw * 2} height={mw * 0.7} rx={6} fill="#fff" stroke={L} strokeWidth={4} /><path d={`M${-mw} ${my - 8 + mw * 0.35} h${mw * 2}`} stroke={L} strokeWidth={3} /></g>,
    onda: <path d={`M${-mw} ${my} l${mw * 0.4} ${-6} l${mw * 0.4} 6 l${mw * 0.4} -6 l${mw * 0.4} 6 l${mw * 0.4} -6`} stroke={L} strokeWidth={r * 0.05} fill="none" strokeLinejoin="round" />,
  };
  const boca = ab > 0.05 && (p.boca === 'sorriso' || p.boca === 'neutra') ? <ellipse cx={0} cy={my + 2} rx={mw * 0.6} ry={mw * 0.15 + ab * mw * 0.45} fill={L} /> : bocas[p.boca];
  return (
    <g>
      {[-1, 1].map((s) => <circle key={s} cx={s * r * 0.62} cy={r * 0.3} r={r * 0.17} fill="#f29aa3" opacity={0.42 + p.vermelho * 0.4} />)}
      {olhos}
      {sobr}
      {cicatriz && <path d={`M${-r * 0.42} ${-r * 0.48} l${r * 0.1} ${r * 0.2} M${-r * 0.36} ${-r * 0.5} l${r * 0.1} ${r * 0.2}`} stroke="#b5524f" strokeWidth={r * 0.035} strokeLinecap="round" />}
      {boca}
      {p.lagrima > 0 && [-1, 1].map((s) => <path key={s} d={`M${s * ex} ${ey + ry * 0.6} q${-6} ${r * 0.5 * p.lagrima} 0 ${r * 0.62 * p.lagrima} q${6} ${-r * 0.12} 0 ${-r * 0.62 * p.lagrima}`} fill="#6ab7ff" stroke="#3d8bfd" strokeWidth={2} opacity={0.9} />)}
      {p.suor > 0 && <path d={`M${r * 0.78} ${-r * 0.55 + p.suor * 8} q${-r * 0.13} ${r * 0.22} 0 ${r * 0.3} q${r * 0.13} ${-r * 0.08} 0 ${-r * 0.3}`} fill="#9fd4ff" stroke={L} strokeWidth={2.5} opacity={Math.min(1, p.suor * 2)} />}
      <circle r={0} fill={pele} />
    </g>
  );
};

// ---------- Boneco articulado ----------
// k = mesmo formato dos personagens mad (pele, roupa, calca, cabelo, corCabelo, chapeu, saia, short...).
export const Rig = ({ k, p, x, y, s = 1, flip = false }: { k: Record<string, any>; p: Pose; x: number; y: number; s?: number; flip?: boolean }) => {
  const kid = k.tipo === 'crianca';
  const G = kid ? 0.8 : 1; // proporção do corpo
  const perna = 128 * G, troncoH = 112 * G, troncoW = (kid ? 98 : 116) * (k.corpo === 'gordo' ? 1.3 : k.corpo === 'magro' ? 0.82 : 1);
  const r = kid ? 78 : 76;
  const LW = (kid ? 28 : 30);
  const sent = p.sentado ?? 0;
  const quadY = -perna + p.quadril + perna * 0.42 * sent;
  const ombY = quadY - troncoH - p.ombro;
  const pesc: V = [0, quadY - troncoH];
  const cab: V = [p.cabX, pesc[1] - r * 0.78 + p.cabY + p.ombro * 0.4];
  // braços
  const sE: V = [-troncoW * 0.4, ombY + 14], sD: V = [troncoW * 0.4, ombY + 14];
  const ua = 56 * G, fa = 52 * G;
  // Os alvos dos movimentos foram escritos para o esqueleto antigo (quadril -150, ombro -275, centro da cabeça -326);
  // aqui são levados para as proporções atuais (cabeça maior, corpo mais curto).
  const cabY0 = quadY - troncoH - r * 0.78;
  const mapY = (y: number) => {
    const A: V[] = [[0, 0], [-150, quadY / G], [-275, (quadY - troncoH) / G], [-326, cabY0 / G], [-450, (cabY0 - 130) / G]];
    for (let i = 1; i < A.length; i++) if (y >= A[i][0]) { const [a0, b0] = A[i - 1], [a1, b1] = A[i]; return b0 + ((y - a0) / (a1 - a0)) * (b1 - b0); }
    const [a0, b0] = A[A.length - 2], [a1, b1] = A[A.length - 1]; return b0 + ((y - a0) / (a1 - a0)) * (b1 - b0);
  };
  const T = (v: V): V => [v[0] * G * (troncoW / ((kid ? 88 : 104) * G)) ** 0.5, mapY(v[1]) * G];
  const mE = fim(sE, T(p.maoE), ua, fa), mD = fim(sD, T(p.maoD), ua, fa);
  const cE = ik(sE, mE, ua, fa, 1), cD = ik(sD, mD, ua, fa, -1);
  // pernas
  const hE: V = [-troncoW * 0.22, quadY], hD: V = [troncoW * 0.22, quadY];
  const th = perna / 2;
  const pE = fim(hE, T(p.peE), th, th), pD = fim(hD, T(p.peD), th, th);
  let jE = ik(hE, pE, th, th, 1), jD = ik(hD, pD, th, th, -1);
  if (sent > 0) {
    // sentado de frente: joelhos logo abaixo do quadril (coxa encurtada), canela até o chão
    const jSE: V = [hE[0] * 1.35, quadY + 22], jSD: V = [hD[0] * 1.35, quadY + 22];
    const lv = (a: V, b: V): V => [a[0] + (b[0] - a[0]) * sent, a[1] + (b[1] - a[1]) * sent];
    jE = lv(jE, jSE); jD = lv(jD, jSD);
    pE[0] += (hE[0] * 1.3 - pE[0]) * sent; pD[0] += (hD[0] * 1.3 - pD[0]) * sent;
  }
  const pele = k.pele, manga = k.manga ?? k.roupa;
  const hair = useMemo(() => cabelo(k.cabelo, k.corCabelo, 0, 0, r) as { atras?: string; frente?: string }, [k.cabelo, k.corCabelo, r]);
  const hat = useMemo(() => (k.chapeu ? (chapeu(k.chapeu, k.corChapeu, 0, 0, r) as string) : ''), [k.chapeu, k.corChapeu, r]);
  const polegar = (m: V) => {
    const rr = LW / 2 + 5;
    return (
      <g>
        <rect x={m[0] - rr * 0.32} y={m[1] - rr * 2.05} width={rr * 0.72} height={rr * 1.45} rx={rr * 0.36} fill={pele} stroke={L} strokeWidth={4.5} />
        <path d={`M${m[0] - rr * 0.55} ${m[1] - rr * 0.1} h${rr * 1.1} M${m[0] - rr * 0.6} ${m[1] + rr * 0.35} h${rr * 1.15}`} stroke={L} strokeWidth={3} opacity={0.55} />
      </g>
    );
  };
  // Dedos: 4 dedos + polegar na direção do antebraço (o polegar vira para o corpo). Mesmo desenho dos personagens fixos.
  const dedos = (el: V, m: V) => {
    const rr = LW / 2 + 5, l = Math.hypot(m[0] - el[0], m[1] - el[1]) || 1, ux = (m[0] - el[0]) / l, uy = (m[1] - el[1]) / l;
    const rot = (a: number): V => [ux * Math.cos(a) - uy * Math.sin(a), ux * Math.sin(a) + uy * Math.cos(a)];
    const dentro = m[0] < 0 ? 1 : -1, fw = rr * 0.44;
    const pa = rot(1.15), pb = rot(-1.15), pol = pa[0] * dentro > pb[0] * dentro ? 1.15 : -1.15;
    const um = (a: number, base: number, ponta: number, w: number, key: string) => {
      const [dx, dy] = rot(a); const d = `M${m[0] + dx * rr * base} ${m[1] + dy * rr * base} L${m[0] + dx * rr * ponta} ${m[1] + dy * rr * ponta}`;
      return <g key={key}><path d={d} stroke={L} strokeWidth={w + 9} strokeLinecap="round" /><path d={d} stroke={pele} strokeWidth={w} strokeLinecap="round" /></g>;
    };
    return <g>{[-0.5, -0.17, 0.17, 0.5].map((a, i) => um(a, 0.5, i === 0 || i === 3 ? 1.72 : 1.95, fw, `d${i}`))}{um(pol, 0.4, 1.55, fw * 1.1, 'p')}</g>;
  };
  const braco = (sh: V, el: V, m: V, lado: 'E' | 'D') => (
    <g>
      {membro([sh, el, m], manga, LW)}
      {(p.joinha ?? 0) & (lado === 'D' ? 1 : 2) ? null : dedos(el, m)}
      <path d={`M${sh[0] + (el[0] - sh[0]) * 0.2} ${sh[1] + (el[1] - sh[1]) * 0.2} L${sh[0] + (el[0] - sh[0]) * 0.7} ${sh[1] + (el[1] - sh[1]) * 0.7}`} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.35} transform={`translate(${-LW * 0.2} 0)`} />
      <circle cx={m[0]} cy={m[1]} r={LW / 2 + 5} fill={pele} stroke={L} strokeWidth={4.5} />
      {(p.joinha ?? 0) & (lado === 'D' ? 1 : 2) ? polegar(m) : null}
    </g>
  );
  const a = troncoW, hh = troncoH, b = quadY + 8, o = ombY;
  const tronco = `M${-0.36 * a} ${o} Q${-0.5 * a} ${o} ${-0.5 * a} ${o + 0.25 * hh} C${-0.57 * a} ${o + 0.7 * hh} ${-0.52 * a} ${b} ${-0.28 * a} ${b} H${0.28 * a} C${0.52 * a} ${b} ${0.57 * a} ${o + 0.7 * hh} ${0.5 * a} ${o + 0.25 * hh} Q${0.5 * a} ${o} ${0.36 * a} ${o} z`;
  const corPerna = k.calca && !k.short && !k.saia ? k.calca : pele;
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s}) translate(${p.x} ${p.y}) rotate(${p.incl} 0 ${quadY}) scale(${p.esc * (2 - p.sq)} ${p.esc * p.sq})`}>
      <ellipse cx={0} cy={6} rx={70} ry={9} fill="#000" opacity={0.12 * Math.max(0, 1 - Math.abs(p.incl) / 40)} transform={`translate(${-p.x} ${-p.y})`} />
      {/* pernas e pés */}
      {membro([hE, jE, pE], corPerna, LW)}
      {membro([hD, jD, pD], corPerna, LW)}
      {k.short && k.calca && <>{membro([hE, [hE[0] + (jE[0] - hE[0]) * 0.7, hE[1] + (jE[1] - hE[1]) * 0.7]], k.calca, LW)}{membro([hD, [hD[0] + (jD[0] - hD[0]) * 0.7, hD[1] + (jD[1] - hD[1]) * 0.7]], k.calca, LW)}</>}
      {[pE, pD].map((f, i) => <ellipse key={i} cx={f[0] + (i ? 8 : -8)} cy={f[1]} rx={17} ry={9} fill={k.sapato ?? L} stroke={L} strokeWidth={3} />)}
      {sent > 0.3 && [jE, jD].map((j, i) => <circle key={`j${i}`} cx={j[0]} cy={j[1] - 4} r={LW * 0.62} fill={corPerna} stroke={L} strokeWidth={4} opacity={Math.min(1, (sent - 0.3) * 3)} />)}
      {k.saia && <path d={`M${-a * 0.55} ${quadY - 12} L${-a * 0.85} ${quadY + 40} H${a * 0.85} L${a * 0.55} ${quadY - 12} z`} fill={k.saia} stroke={L} strokeWidth={4} strokeLinejoin="round" />}
      {/* braços atrás */}
      {!p.frenteE && braco(sE, cE, mE, 'E')}
      {!p.frenteD && braco(sD, cD, mD, 'D')}
      {/* tronco */}
      <path d={tronco} fill={k.roupa} stroke={L} strokeWidth={5} />
      <path d={`M${-0.3 * a} ${o + 0.22 * hh} q${-0.06 * a} ${0.2 * hh} ${-0.02 * a} ${0.42 * hh}`} stroke="#fff" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.35} />
      {k.colete && <path d={`M${-a * 0.5} ${o + 30} h${a} M${-a * 0.52} ${o + 70} h${a * 1.04}`} stroke={k.colete} strokeWidth={10} />}
      {k.avental && <g><path d={`M${-a * 0.3} ${o + 0.2 * hh} h${a * 0.6} l${a * 0.04} ${hh * 0.95} h${-a * 0.68} z`} fill={k.avental} stroke={L} strokeWidth={3.5} />{k.bordado && <text x={0} y={o + 0.5 * hh} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={hh * 0.13} fill="#d1495b">{k.bordado}</text>}</g>}
      {k.distintivo && <path d={`M${a * 0.18} ${o + 0.28 * hh} l9 -6 l9 6 v12 q-9 9 -18 0 z`} fill="#f2c94c" stroke={L} strokeWidth={3} />}
      {k.bobina && (
        // bobina de cobre brilhando no peito (cor = k.bobina; k.bobinaForca 0..1 apaga)
        <g transform={`translate(0 ${o + hh * 0.36})`} opacity={k.bobinaForca ?? 1}>
          <circle r={34} fill={k.bobina} opacity={0.25} />
          <circle r={20} fill="#f4f4f4" stroke={L} strokeWidth={4} />
          <circle r={14} fill={k.bobina} />
          <circle r={14} fill="none" stroke="#c87a3a" strokeWidth={4} strokeDasharray="5 4" />
          <circle r={6} fill="#ffffff" />
        </g>
      )}
      {k.peito && <text x={0} y={o + hh * 0.62} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={hh * 0.42} fill="#fff" stroke={L} strokeWidth={2}>{k.peito}</text>}
      {k.gravata && <path d={`M0 ${o + 2} l-9 12 l9 50 l9 -50 z`} fill={k.gravata} stroke={L} strokeWidth={3} />}
      {/* cabeça */}
      <g transform={`translate(${cab[0]} ${cab[1]}) rotate(${p.cabRot} 0 ${r * 0.8})`}>
        {hair.atras && k.mascara !== 'heroi' && <g dangerouslySetInnerHTML={{ __html: hair.atras }} />}
        {k.brinco && [-1, 1].map((s2) => <circle key={`b${s2}`} cx={s2 * r * 1.0} cy={r * 0.34} r={r * 0.09} fill={k.brinco} stroke={L} strokeWidth={3} />)}
        {k.mascara !== 'heroi' && [-1, 1].map((s2) => <g key={s2}><circle cx={s2 * r * 0.98} cy={r * 0.08} r={r * 0.2} fill={pele} stroke={L} strokeWidth={4.5} /><path d={`M${s2 * r * 1.02} ${r * 0.0} q${s2 * r * 0.06} ${r * 0.08} 0 ${r * 0.16}`} stroke={L} strokeWidth={3} fill="none" opacity={0.5} /></g>)}
        <circle r={r} fill={pele} stroke={L} strokeWidth={5} />
        <g transform={`translate(${p.cabX * 0.6} ${p.cabY * 0.3})`}>
          {k.mascara && k.mascara !== 'bigode' && k.mascara !== 'heroi' && (
            // máscara de pássaro de papel: faixa nos olhos com penas nas pontas (o bico vem depois do rosto)
            <g>
              {[-1, 1].map((s2) => <path key={s2} d={`M${s2 * r * 0.8} ${-r * 0.22} q${s2 * r * 0.34} ${-r * 0.12} ${s2 * r * 0.62} ${-r * 0.3} q${-s2 * r * 0.06} ${r * 0.3} ${-s2 * r * 0.3} ${r * 0.52} z`} fill={k.mascara2 ?? k.mascara} stroke={L} strokeWidth={4} strokeLinejoin="round" />)}
              <path d={`M${-r * 0.86} ${-r * 0.3} Q0 ${-r * 0.52} ${r * 0.86} ${-r * 0.3} L${r * 0.8} ${r * 0.22} Q${r * 0.4} ${r * 0.34} ${r * 0.08} ${r * 0.16} L0 ${r * 0.1} L${-r * 0.08} ${r * 0.16} Q${-r * 0.4} ${r * 0.34} ${-r * 0.8} ${r * 0.22} z`} fill={k.mascara} stroke={L} strokeWidth={5} strokeLinejoin="round" />
              <path d={`M${-r * 0.7} ${-r * 0.28} Q0 ${-r * 0.44} ${r * 0.7} ${-r * 0.28}`} stroke="#fff" strokeWidth={r * 0.04} fill="none" opacity={0.45} />
            </g>
          )}
          {k.barba && <path d={`M${-r * 0.97} ${-r * 0.05} Q${-r * 0.9} ${r * 1.05} 0 ${r * 1.18} Q${r * 0.9} ${r * 1.05} ${r * 0.97} ${-r * 0.05} Q${r * 0.7} ${r * 0.5} ${r * 0.36} ${r * 0.3} Q0 ${r * 0.2} ${-r * 0.36} ${r * 0.3} Q${-r * 0.7} ${r * 0.5} ${-r * 0.97} ${-r * 0.05} z`} fill={k.corBarba ?? k.corCabelo} stroke={L} strokeWidth={4.5} strokeLinejoin="round" />}
          {k.sardas && [-1, 1].map((s2) => [[0.5, 0.28], [0.62, 0.22], [0.58, 0.36], [0.44, 0.38]].map(([fx, fy], i) => <circle key={`${s2}${i}`} cx={s2 * r * fx} cy={r * fy} r={r * 0.035} fill="#b0703a" opacity={0.75} />))}
          <Rosto p={p} r={r} pele={pele} cicatriz={!!k.cicatriz} iris={k.iris ?? '#6c9bd2'} corSobr={k.corSobr ?? (k.corCabelo === '#f7f7f7' || k.corCabelo === '#d6d6d6' ? '#9a9aa6' : k.corCabelo ?? L)} />
          {k.bigode && <path d={`M0 ${r * 0.24} Q${-r * 0.16} ${r * 0.14} ${-r * 0.34} ${r * 0.24} Q${-r * 0.46} ${r * 0.32} ${-r * 0.4} ${r * 0.38} Q${-r * 0.2} ${r * 0.3} 0 ${r * 0.33} Q${r * 0.2} ${r * 0.3} ${r * 0.4} ${r * 0.38} Q${r * 0.46} ${r * 0.32} ${r * 0.34} ${r * 0.24} Q${r * 0.16} ${r * 0.14} 0 ${r * 0.24} z`} fill={k.corBigode ?? k.corCabelo} stroke={L} strokeWidth={3.5} strokeLinejoin="round" />}
          {k.oculos && <g fill="none" stroke={k.corOculos ?? L} strokeWidth={r * 0.06}>{[-1, 1].map((s2) => <circle key={s2} cx={s2 * r * 0.37} cy={0} r={r * 0.34} fill="#dff1fb" fillOpacity={0.18} />)}<path d={`M${-r * 0.05} ${-r * 0.04} q${r * 0.05} ${-r * 0.06} ${r * 0.1} 0 M${-r * 0.7} ${-r * 0.06} l${-r * 0.24} ${-r * 0.06} M${r * 0.7} ${-r * 0.06} l${r * 0.24} ${-r * 0.06}`} /></g>}
          {k.oculosEscuros && <g>{[-1, 1].map((s2) => <rect key={s2} x={s2 * r * 0.37 - r * 0.32} y={-r * 0.24} width={r * 0.64} height={r * 0.42} rx={r * 0.14} fill="#1a1a1e" stroke={L} strokeWidth={4} />)}<path d={`M${-r * 0.05} ${-r * 0.1} h${r * 0.1} M${-r * 0.69} ${-r * 0.12} l${-r * 0.26} ${-r * 0.04} M${r * 0.69} ${-r * 0.12} l${r * 0.26} ${-r * 0.04}`} stroke={L} strokeWidth={5} /><path d={`M${-r * 0.6} ${-r * 0.12} l${r * 0.14} 0`} stroke="#fff" strokeWidth={4} opacity={0.55} /></g>}
          {k.mascara && k.mascara !== 'bigode' && k.mascara !== 'heroi' && <path d={`M${-r * 0.13} ${r * 0.1} L${r * 0.13} ${r * 0.1} L0 ${r * 0.34} z`} fill={k.bico ?? '#f2a93b'} stroke={L} strokeWidth={4} strokeLinejoin="round" />}
        </g>
        {k.mascara === 'bigode' && <MascaraBigode r={r} p={p} />}
        {k.mascara === 'heroi' && <MascaraHeroi r={r} p={p} cor={k.corMascara ?? '#3ac06a'} detalhe={k.detalheMascara ?? '#1a6a3a'} />}
        {hair.frente && k.mascara !== 'bigode' && k.mascara !== 'heroi' && <g dangerouslySetInnerHTML={{ __html: hair.frente }} />}
        {hat && <g dangerouslySetInnerHTML={{ __html: hat }} />}
        {Array.from({ length: k.fios ?? 0 }, (_, i) => {
          const ang = -Math.PI / 2 + (i - ((k.fios ?? 1) - 1) / 2) * 0.32 + 0.12;
          const x0 = Math.cos(ang) * r * 0.9, y0 = Math.sin(ang) * r * 0.9;
          const d = `M${x0} ${y0} q${Math.cos(ang) * r * 0.25 + r * 0.12} ${Math.sin(ang) * r * 0.35} ${Math.cos(ang) * r * 0.1 + r * 0.25} ${Math.sin(ang) * r * 0.55}`;
          return <g key={i}><path d={d} stroke={L} strokeWidth={r * 0.11} fill="none" strokeLinecap="round" /><path d={d} stroke="#fff" strokeWidth={r * 0.06} fill="none" strokeLinecap="round" /></g>;
        })}
        {(p.zzz ?? 0) > 0 && [0, 1, 2].map((i) => (
          <text key={`z${i}`} x={r * (0.9 + i * 0.35)} y={-r * (1.0 + i * 0.45)} fontFamily="Arial Black, Arial" fontWeight={900} fontSize={r * (0.4 + i * 0.14)} fill="#fff" stroke={L} strokeWidth={5} paintOrder="stroke" opacity={p.zzz}>Z</text>
        ))}
        {p.pergunta > 0 && (
          <text x={r * 0.9} y={-r * 1.1} fontFamily="Arial Black, Arial" fontWeight={900} fontSize={r * 0.9 * p.pergunta} fill="#fff" stroke={L} strokeWidth={6} paintOrder="stroke">?</text>
        )}
      </g>
      {/* braços na frente (boca, olhos, queixo) */}
      {p.frenteE && braco(sE, cE, mE, 'E')}
      {p.frenteD && braco(sD, cD, mD, 'D')}
      {k.item && <g dangerouslySetInnerHTML={{ __html: item(k.item, mD[0], mD[1], k, 0) as string }} />}
      {k.item2 && <g dangerouslySetInnerHTML={{ __html: item(k.item2, mE[0], mE[1], k, 0) as string }} />}
    </g>
  );
};

export const ALTURA_CABECA = (kid: boolean) => -(150 * (kid ? 0.8 : 1)) - 125 * (kid ? 0.8 : 1) - (kid ? 64 : 66) * 0.78;
