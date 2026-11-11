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
};

export const BASE: Pose = {
  x: 0, y: 0, esc: 1, sq: 1, incl: 0, quadril: 0, ombro: 0, cabRot: 0, cabX: 0, cabY: 0,
  maoE: [-64, -150], maoD: [64, -150], frenteE: false, frenteD: false, peE: [-26, 0], peD: [26, 0],
  olho: 1, olhoFeliz: false, pupila: [0, 0], sobr: 0, sobrTriste: false, boca: 'sorriso', fala: 0,
  lagrima: 0, suor: 0, vermelho: 0, pergunta: 0,
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
const Rosto = ({ p, r, pele }: { p: Pose; r: number; pele: string }) => {
  const ex = r * 0.36, ey = -r * 0.05, rx = r * 0.2, ry = r * 0.25 * Math.max(0.05, p.olho);
  const px = p.pupila[0] * rx * 0.45, py = p.pupila[1] * ry * 0.4;
  const sb = p.sobr;
  const olhos = p.olhoFeliz
    ? [-1, 1].map((s) => <path key={s} d={`M${s * ex - rx} ${ey + 4} q${rx} ${-ry * 1.4} ${rx * 2} 0`} stroke={L} strokeWidth={r * 0.07} fill="none" strokeLinecap="round" />)
    : [-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={s * ex} cy={ey} rx={rx} ry={ry} fill="#fff" stroke={L} strokeWidth={r * 0.05} />
          {p.olho > 0.25 && (
            <>
              <circle cx={s * ex + px} cy={ey + py} r={Math.min(rx, ry) * 0.62} fill={L} />
              <circle cx={s * ex + px + rx * 0.22} cy={ey + py - ry * 0.25} r={rx * 0.18} fill="#fff" />
            </>
          )}
        </g>
      ));
  const sobr = [-1, 1].map((s) => {
    const y = ey - r * 0.32 - (p.olho > 1 ? r * 0.06 : 0) - sb * r * 0.06;
    const inc = p.sobrTriste ? -s * r * 0.08 : sb < 0 ? s * r * 0.1 : 0;
    return <path key={s} d={`M${s * ex - rx * 0.9} ${y + (s < 0 ? inc : -inc) * 0.5} L${s * ex + rx * 0.9} ${y - (s < 0 ? inc : -inc) * 0.5}`} stroke={L} strokeWidth={r * 0.07} strokeLinecap="round" />;
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
      {[-1, 1].map((s) => <ellipse key={s} cx={s * r * 0.6} cy={r * 0.25} rx={r * 0.14} ry={r * 0.08} fill="#f2a0a8" opacity={0.55 + p.vermelho * 0.45} />)}
      {olhos}
      {sobr}
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
  const perna = 150 * G, troncoH = 125 * G, troncoW = (kid ? 88 : 104) * (k.corpo === 'gordo' ? 1.3 : k.corpo === 'magro' ? 0.8 : 1);
  const r = kid ? 64 : 66;
  const LW = (kid ? 20 : 22);
  const quadY = -perna + p.quadril;
  const ombY = quadY - troncoH - p.ombro;
  const pesc: V = [0, quadY - troncoH];
  const cab: V = [p.cabX, pesc[1] - r * 0.78 + p.cabY + p.ombro * 0.4];
  // braços
  const sE: V = [-troncoW * 0.4, ombY + 14], sD: V = [troncoW * 0.4, ombY + 14];
  const ua = 64 * G, fa = 60 * G;
  const T = (v: V): V => [v[0] * G, v[1] * G]; // alvos são definidos para adulto e escalam com o corpo
  const mE = fim(sE, T(p.maoE), ua, fa), mD = fim(sD, T(p.maoD), ua, fa);
  const cE = ik(sE, mE, ua, fa, 1), cD = ik(sD, mD, ua, fa, -1);
  // pernas
  const hE: V = [-troncoW * 0.22, quadY], hD: V = [troncoW * 0.22, quadY];
  const th = perna / 2;
  const pE = fim(hE, T(p.peE), th, th), pD = fim(hD, T(p.peD), th, th);
  const jE = ik(hE, pE, th, th, 1), jD = ik(hD, pD, th, th, -1);
  const pele = k.pele, manga = k.manga ?? k.roupa;
  const hair = useMemo(() => cabelo(k.cabelo, k.corCabelo, 0, 0, r) as { atras?: string; frente?: string }, [k.cabelo, k.corCabelo, r]);
  const hat = useMemo(() => (k.chapeu ? (chapeu(k.chapeu, k.corChapeu, 0, 0, r) as string) : ''), [k.chapeu, k.corChapeu, r]);
  const braco = (sh: V, el: V, m: V) => (
    <g>
      {membro([sh, el, m], manga, LW)}
      <circle cx={m[0]} cy={m[1]} r={LW / 2 + 7} fill={pele} stroke={L} strokeWidth={4} />
    </g>
  );
  const a = troncoW, hh = troncoH, b = quadY + 8, o = ombY;
  const tronco = `M${-0.36 * a} ${o} Q${-0.5 * a} ${o} ${-0.5 * a} ${o + 0.25 * hh} C${-0.57 * a} ${o + 0.7 * hh} ${-0.52 * a} ${b} ${-0.28 * a} ${b} H${0.28 * a} C${0.52 * a} ${b} ${0.57 * a} ${o + 0.7 * hh} ${0.5 * a} ${o + 0.25 * hh} Q${0.5 * a} ${o} ${0.36 * a} ${o} z`;
  const corPerna = k.calca && !k.short && !k.saia ? k.calca : pele;
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s}) translate(${p.x} ${p.y}) rotate(${p.incl} 0 ${quadY}) scale(${p.esc * (2 - p.sq)} ${p.esc * p.sq})`}>
      <ellipse cx={0} cy={6} rx={70} ry={9} fill="#000" opacity={0.12} transform={`translate(${-p.x} ${-p.y})`} />
      {/* pernas e pés */}
      {membro([hE, jE, pE], corPerna, LW)}
      {membro([hD, jD, pD], corPerna, LW)}
      {k.short && k.calca && <>{membro([hE, [hE[0] + (jE[0] - hE[0]) * 0.7, hE[1] + (jE[1] - hE[1]) * 0.7]], k.calca, LW)}{membro([hD, [hD[0] + (jD[0] - hD[0]) * 0.7, hD[1] + (jD[1] - hD[1]) * 0.7]], k.calca, LW)}</>}
      {[pE, pD].map((f, i) => <ellipse key={i} cx={f[0] + (i ? 8 : -8)} cy={f[1]} rx={17} ry={9} fill={k.sapato ?? L} stroke={L} strokeWidth={3} />)}
      {k.saia && <path d={`M${-a * 0.55} ${quadY - 12} L${-a * 0.85} ${quadY + 40} H${a * 0.85} L${a * 0.55} ${quadY - 12} z`} fill={k.saia} stroke={L} strokeWidth={4} strokeLinejoin="round" />}
      {/* braços atrás */}
      {!p.frenteE && braco(sE, cE, mE)}
      {!p.frenteD && braco(sD, cD, mD)}
      {/* tronco */}
      <path d={tronco} fill={k.roupa} stroke={L} strokeWidth={5} />
      {k.colete && <path d={`M${-a * 0.5} ${o + 30} h${a} M${-a * 0.52} ${o + 70} h${a * 1.04}`} stroke={k.colete} strokeWidth={10} />}
      {k.peito && <text x={0} y={o + hh * 0.62} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={hh * 0.42} fill="#fff" stroke={L} strokeWidth={2}>{k.peito}</text>}
      {k.gravata && <path d={`M0 ${o + 2} l-9 12 l9 50 l9 -50 z`} fill={k.gravata} stroke={L} strokeWidth={3} />}
      {/* cabeça */}
      <g transform={`translate(${cab[0]} ${cab[1]}) rotate(${p.cabRot} 0 ${r * 0.8})`}>
        {hair.atras && <g dangerouslySetInnerHTML={{ __html: hair.atras }} />}
        <circle r={r} fill={pele} stroke={L} strokeWidth={5} />
        <g transform={`translate(${p.cabX * 0.6} ${p.cabY * 0.3})`}>
          <Rosto p={p} r={r} pele={pele} />
        </g>
        {hair.frente && <g dangerouslySetInnerHTML={{ __html: hair.frente }} />}
        {hat && <g dangerouslySetInnerHTML={{ __html: hat }} />}
        {Array.from({ length: k.fios ?? 0 }, (_, i) => {
          const ang = -Math.PI / 2 + (i - ((k.fios ?? 1) - 1) / 2) * 0.32 + 0.12;
          const x0 = Math.cos(ang) * r * 0.9, y0 = Math.sin(ang) * r * 0.9;
          const d = `M${x0} ${y0} q${Math.cos(ang) * r * 0.25 + r * 0.12} ${Math.sin(ang) * r * 0.35} ${Math.cos(ang) * r * 0.1 + r * 0.25} ${Math.sin(ang) * r * 0.55}`;
          return <g key={i}><path d={d} stroke={L} strokeWidth={r * 0.11} fill="none" strokeLinecap="round" /><path d={d} stroke="#fff" strokeWidth={r * 0.06} fill="none" strokeLinecap="round" /></g>;
        })}
        {p.pergunta > 0 && (
          <text x={r * 0.9} y={-r * 1.1} fontFamily="Arial Black, Arial" fontWeight={900} fontSize={r * 0.9 * p.pergunta} fill="#fff" stroke={L} strokeWidth={6} paintOrder="stroke">?</text>
        )}
      </g>
      {/* braços na frente (boca, olhos, queixo) */}
      {p.frenteE && braco(sE, cE, mE)}
      {p.frenteD && braco(sD, cD, mD)}
      {k.item && <g dangerouslySetInnerHTML={{ __html: item(k.item, mD[0], mD[1], k, 0) as string }} />}
      {k.item2 && <g dangerouslySetInnerHTML={{ __html: item(k.item2, mE[0], mE[1], k, 0) as string }} />}
    </g>
  );
};

export const ALTURA_CABECA = (kid: boolean) => -(150 * (kid ? 0.8 : 1)) - 125 * (kid ? 0.8 : 1) - (kid ? 64 : 66) * 0.78;
