// Cenários de "Depois do Silêncio — Episódio 3": barraca do Leandro por dentro (lampião, rádio, sombra na lona),
// mato à noite, pistas no telhado (algema aberta, chave, pegadas de lama, recado a carvão) e marcas de pneu na lama.
import { L, Svg } from './cenarios';
import { Poeira } from './cenarios-ilha';

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const clamp = (x: number) => Math.min(1, Math.max(0, x));

// ---------- Barraca do Leandro por dentro ----------
export const Barraca = ({ t, radio = 0, sombra = 0 }: { t: number; radio?: number; sombra?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#1a2a3e" />
    {/* lona azul em triângulo, costuras e luz do lampião */}
    <path d="M-100 1700 L540 160 L1180 1700 z" fill="#2f5f8f" stroke={L} strokeWidth={8} />
    <path d="M540 160 L540 1700" stroke="#244a70" strokeWidth={6} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${540 - (i + 1) * 100} ${160 + (i + 1) * 240} L${540 + (i + 1) * 100} ${160 + (i + 1) * 240}`} stroke="#244a70" strokeWidth={3} strokeDasharray="12 10" />)}
    <circle cx={760} cy={1180} r={520} fill="#ffcf7a" opacity={0.18 + 0.03 * Math.sin(t * 9)} />
    {/* sombra do Leandro na lona (vista de fora/porta) */}
    {sombra > 0 && <g opacity={0.55 * sombra} fill="#0a1220">
      <circle cx={420} cy={760} r={110} /><path d="M330 840 Q300 1100 340 1400 H560 Q600 1100 520 840 z" />
      <path d="M500 900 Q600 860 640 780" stroke="#0a1220" strokeWidth={50} strokeLinecap="round" fill="none" />
      <rect x={610} y={700} width={60} height={120} rx={14} /><rect x={640} y={620} width={14} height={80} />
      <path d="M400 640 h80 l-10 -50 h-60 z" />
    </g>}
    {/* chão: colchonete, mochila, caixa de munição, lampião, rádio */}
    <path d="M-100 1700 H1180 V1920 H-100 z" fill="#3a3a30" />
    <rect x={80} y={1560} width={420} height={120} rx={30} fill="#5a7a5a" stroke={L} strokeWidth={5} /><rect x={100} y={1520} width={120} height={60} rx={20} fill="#e8e2d0" stroke={L} strokeWidth={4} />
    <g transform="translate(880 1640)"><path d="M-80 0 q-10 -160 80 -170 q90 10 80 170 z" fill="#4a5a3a" stroke={L} strokeWidth={5} /><rect x={-50} y={-90} width={100} height={50} rx={12} fill="#3a4a2a" stroke={L} strokeWidth={4} /></g>
    <g transform="translate(620 1700)"><rect x={-70} y={-80} width={140} height={80} fill="#4a5a3a" stroke={L} strokeWidth={4} /><text y={-30} textAnchor="middle" fontFamily="Arial Black" fontSize={20} fill="#c9c9a0">POLÍCIA</text></g>
    <g transform="translate(760 1600)"><path d="M-10 0 V-40 M10 0 V-40" stroke="#3a3a3a" strokeWidth={6} /><rect x={-34} y={-130} width={68} height={90} rx={12} fill="#ffcf7a" stroke={L} strokeWidth={5} opacity={0.9} /><path d="M-40 -130 h80 l-10 -20 h-60 z" fill="#3a3a3a" /><path d="M-20 -150 q20 -40 40 0" stroke={L} strokeWidth={5} fill="none" /></g>
    <g transform="translate(330 1500)"><rect x={-90} y={-80} width={180} height={100} rx={12} fill="#2a2e34" stroke={L} strokeWidth={5} /><rect x={-70} y={-62} width={90} height={36} fill={radio ? '#ff5a3a' : '#2a1a14'} opacity={radio ? 0.7 + 0.3 * Math.sin(t * 13) : 1} /><circle cx={50} cy={-44} r={16} fill="#9aa0aa" /><path d="M70 -80 v-90" stroke={L} strokeWidth={6} /></g>
    {radio > 0 && [0, 1, 2].map((i) => { const k = (t * 1.3 + i / 3) % 1; return <path key={i} d={`M${440 + k * 70} ${1420 - k * 30} q24 30 0 60`} stroke="#ff5a3a" strokeWidth={5} fill="none" opacity={1 - k} />; })}
    {/* entrada aberta com a noite lá fora */}
    <path d="M540 160 L380 1700 H700 z" fill="none" stroke="#244a70" strokeWidth={6} />
    <Poeira t={t} n={18} cor="#ffcf7a" op={0.4} area={[500, 900, 500, 700]} />
  </Svg>
);

// ---------- Mato à noite (trilha) ----------
export const Mato = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#0a1020" />
    <circle cx={800} cy={260} r={70} fill="#e8e4d0" /><circle cx={800} cy={260} r={160} fill="#e8e4d0" opacity={0.08} />
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 3) * 600} r={2} fill="#fff" opacity={0.3 + 0.4 * Math.abs(Math.sin(t + i))} />)}
    {[0, 1, 2].map((camada) => Array.from({ length: 9 }, (_, i) => { const x = i * 135 - 40 + camada * 50, y = 1000 + camada * 200, h = (300 + rnd(i + camada * 9) * 260) * (1 + camada * 0.4); const c = ['#0e1a14', '#12241a', '#16301e'][camada]; return <g key={`${camada}-${i}`} transform={`rotate(${1.5 * Math.sin(t * 0.8 + i)} ${x} ${y})`}><rect x={x - 10} y={y - h * 0.4} width={20} height={h * 0.4 + 30} fill="#1a120c" /><ellipse cx={x} cy={y - h * 0.55} rx={h * 0.28} ry={h * 0.3} fill={c} /><ellipse cx={x - h * 0.15} cy={y - h * 0.4} rx={h * 0.2} ry={h * 0.18} fill={c} /></g>; }))}
    <path d="M440 1300 Q560 1500 420 1920 H700 Q760 1500 620 1300 z" fill="#2a2418" />
    {Array.from({ length: 30 }, (_, i) => { const x = rnd(i + 7) * 1080, y = 1350 + rnd(i + 8) * 560, h = 20 + rnd(i) * 30; return <path key={i} d={`M${x - 8} ${y} q4 ${-h} 2 ${-h * 1.2} M${x + 8} ${y} q-4 ${-h} -2 ${-h * 1.1}`} stroke="#1e3a1e" strokeWidth={4} fill="none" />; })}
    {Array.from({ length: 14 }, (_, i) => { const o = Math.max(0, Math.sin(t * 2 + i * 1.7)); return <circle key={i} cx={rnd(i + 11) * 1080 + 40 * Math.sin(t * 0.5 + i)} cy={900 + rnd(i + 23) * 700} r={4} fill="#f4ffb0" opacity={o} />; })}
    <path d="M0 1200 Q540 1150 1080 1220" stroke="#c8d0e8" strokeWidth={80} fill="none" opacity={0.06} />
  </Svg>
);

// ---------- Pistas no telhado (por cima do cenário Telhado) ----------
// algema aberta pendurada no cano (x=500, y≈1170..1400) com a chave ainda na fechadura.
export const AlgemaAberta = ({ t, x = 500, y = 1360, s = 1 }: { t: number; x?: number; y?: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${6 * Math.sin(t * 1.5)}) scale(${s})`}>
    <circle cx={0} cy={0} r={22} fill="none" stroke="#c9ccd4" strokeWidth={9} />
    <path d="M0 22 v24" stroke="#9aa0aa" strokeWidth={6} />
    <path d="M-24 70 a24 24 0 1 1 30 22" fill="none" stroke="#c9ccd4" strokeWidth={9} />
    <g transform="translate(14 86) rotate(30)"><circle r={10} fill="none" stroke="#e8d070" strokeWidth={5} /><path d="M10 0 H40 M30 0 v8" stroke="#e8d070" strokeWidth={5} strokeLinecap="round" /></g>
  </g>
);
export const PegadasLama = ({ t, de, x0, y0, x1, y1, n = 10 }: { t: number; de: number; x0: number; y0: number; x1: number; y1: number; n?: number }) => (
  <Svg>{Array.from({ length: n }, (_, i) => { const k = i / (n - 1), x = x0 + (x1 - x0) * k + (i % 2 ? 22 : -22), y = y0 + (y1 - y0) * k; const o = clamp((t - de - i * 0.15) / 0.3); return <g key={i} opacity={o} transform={`translate(${x} ${y}) rotate(${Math.atan2(y1 - y0, x1 - x0) * 57 + 90})`}><ellipse rx={20} ry={36} fill="#4a3a1a" /><ellipse cy={-30} rx={16} ry={10} fill="#3a2a12" /></g>; })}</Svg>
);
// Escada de incêndio na borda do telhado.
export const EscadaIncendio = ({ x = 1000, y = 1100 }: { x?: number; y?: number }) => (
  <g>{[0, 1].map((s) => <path key={s} d={`M${x + s * 70} ${y - 140} V${y + 300}`} stroke="#3a3a40" strokeWidth={12} />)}{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${x} ${y - 120 + i * 70} H${x + 70}`} stroke="#3a3a40" strokeWidth={8} />)}<path d={`M${x - 20} ${y - 150} q55 -40 110 0`} stroke="#3a3a40" strokeWidth={10} fill="none" /></g>
);
// Recado a carvão na caixa d'água.
export const Recado = ({ k = 1, x = 800, y = 1080 }: { k?: number; x?: number; y?: number }) => (
  <g opacity={k} fontFamily="'Comic Sans MS', 'Segoe Print', cursive" fill="#1a1a1a" textAnchor="middle">
    <text x={x} y={y} fontSize={29} transform={`rotate(-3 ${x} ${y})`}>VOCÊS ME DEIXARAM.</text>
    <text x={x} y={y + 56} fontSize={34} transform={`rotate(2 ${x} ${y + 56})`}>EU VOU ATRÁS.</text>
    <path d={`M${x - 120} ${y + 76} q120 18 240 -6`} stroke="#1a1a1a" strokeWidth={5} fill="none" />
  </g>
);
// Marcas de pneu na lama (em perspectiva, indo para o fundo).
export const MarcasPneu = ({ base = 1180 }: { base?: number }) => (
  <Svg>
    <path d={`M120 1920 Q400 1500 500 ${base}`} stroke="#3a2a14" strokeWidth={70} fill="none" opacity={0.7} />
    <path d={`M600 1920 Q560 1500 580 ${base}`} stroke="#3a2a14" strokeWidth={70} fill="none" opacity={0.7} />
    {Array.from({ length: 24 }, (_, i) => { const k = i / 24, y = 1920 - (1920 - base) * k; const xa = 120 + (500 - 120) * (1 - (1 - k) ** 2), xb = 600 - 20 * k; const w = 30 * (1 - k * 0.7); return <g key={i}><path d={`M${xa - w} ${y} h${w * 2}`} stroke="#5a4a2a" strokeWidth={6} /><path d={`M${xb - w} ${y} h${w * 2}`} stroke="#5a4a2a" strokeWidth={6} /></g>; })}
    {[[260, 1700], [700, 1560], [380, 1400]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={90 - i * 20} ry={24 - i * 5} fill="#5a6a7a" opacity={0.6} />)}
  </Svg>
);
// Lona cobrindo algo na beira do lago.
export const Lona = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-160 0 Q-150 -70 -60 -80 Q20 -100 80 -70 Q150 -60 160 0 z" fill="#4a6a8a" stroke={L} strokeWidth={5} /><path d="M-120 -30 q60 -30 120 -10 M-40 -60 q30 20 80 10" stroke="#3a5a7a" strokeWidth={4} fill="none" /></g>
);
