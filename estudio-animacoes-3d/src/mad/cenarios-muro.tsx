// Cenários de "O Muro de Cem Anos": cidade medieval cercada (casas de enxaimel, telhados vermelhos, ruas de pedra,
// varais, poço, feira), a muralha de pedra (ameias, torres, canhões, bandeiras, portão), os campos lá fora, a cozinha
// da casa do Tito, o telhado da torre do sino, os Imensos (gigantes de barro), a casa desabada e o barco no canal.
import { L, Svg } from './cenarios';
import { Poeira } from './cenarios-ilha';

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const clamp = (x: number) => Math.min(1, Math.max(0, x));
export const CHAO_M = 1480;

// ---------- Céu ----------
export const CeuMuro = ({ t, tarde = 0, poeira = 0 }: { t: number; tarde?: number; poeira?: number }) => (
  <>
    <defs><linearGradient id={`ceuM${tarde}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={tarde ? '#4a6ab0' : '#5aa0e0'} /><stop offset="1" stopColor={tarde ? '#f2b07a' : '#cfe8f8'} /></linearGradient></defs>
    <rect width={1080} height={1920} fill={`url(#ceuM${tarde})`} />
    <circle cx={tarde ? 260 : 820} cy={tarde ? 700 : 260} r={90} fill={tarde ? '#ffd8a0' : '#fff6c8'} />
    {[0, 1, 2, 3].map((i) => { const x = ((i * 330 + t * (8 + i * 3)) % 1500) - 200, y = 160 + i * 110; return <g key={i} opacity={0.85}><ellipse cx={x} cy={y} rx={130} ry={34} fill="#fff" /><ellipse cx={x + 60} cy={y - 24} rx={80} ry={30} fill="#fff" /><ellipse cx={x - 60} cy={y - 10} rx={60} ry={24} fill="#fff" /></g>; })}
    {[0, 1, 2].map((i) => { const x = ((t * 40 + i * 300) % 1300) - 100; return <path key={i} d={`M${x} ${300 + i * 40} q10 -10 20 0 q10 -10 20 0`} stroke="#3a3a3a" strokeWidth={3} fill="none" />; })}
    {poeira > 0 && <rect width={1080} height={1920} fill="#c8b08a" opacity={0.35 * poeira} />}
  </>
);

// ---------- Muralha de pedra (de frente), com portão ----------
export const Muralha = ({ y = 1120, h = 620, portao = 1, quebrada = 0, t = 0, cor = '#a89a86' }: { y?: number; h?: number; portao?: number; quebrada?: number; t?: number; cor?: string }) => (
  <g>
    <rect x={-20} y={y - h} width={1120} height={h} fill={cor} stroke={L} strokeWidth={6} />
    {Array.from({ length: Math.floor(h / 46) }, (_, r) => Array.from({ length: 12 }, (_, c) => <rect key={`${r}-${c}`} x={-20 + c * 96 + (r % 2) * 48} y={y - h + r * 46} width={92} height={42} rx={4} fill={['#b4a690', '#a0927e', '#ab9d88'][(r + c) % 3]} stroke="#8a7c68" strokeWidth={2} />))}
    {/* ameias, torres, canhões, bandeiras */}
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-10 + i * 96} y={y - h - 50} width={60} height={56} fill={cor} stroke={L} strokeWidth={4} />)}
    {[140, 940].map((x) => <g key={x}><rect x={x - 70} y={y - h - 160} width={140} height={h + 160} fill="#9a8c78" stroke={L} strokeWidth={6} /><path d={`M${x - 90} ${y - h - 160} L${x} ${y - h - 280} L${x + 90} ${y - h - 160} z`} fill="#8a2a2a" stroke={L} strokeWidth={5} /><rect x={x - 20} y={y - h - 100} width={40} height={60} rx={20} fill="#1a1a1e" /><path d={`M${x} ${y - h - 280} v-90`} stroke={L} strokeWidth={5} /><path d={`M${x} ${y - h - 370} h${70 + 10 * Math.sin(t * 4 + x)} l-10 26 l10 26 h-${70 + 10 * Math.sin(t * 4 + x)} z`} fill="#2f6fb3" stroke={L} strokeWidth={3} /><path d={`M${x + 20} ${y - h - 350} l14 12 l-14 12 l-14 -12 z`} fill="#f2c94c" /></g>)}
    {[330, 560, 750].map((x) => <g key={x} transform={`translate(${x} ${y - h - 20})`}><rect x={-30} y={-20} width={90} height={30} rx={14} fill="#2a2a30" stroke={L} strokeWidth={3} /><circle cx={60} cy={-5} r={10} fill="#0a0a0e" /><circle cx={-10} cy={14} r={16} fill="#6b4224" stroke={L} strokeWidth={3} /></g>)}
    {/* trepadeiras e limo */}
    {[60, 420, 700, 1010].map((x, i) => <path key={i} d={`M${x} ${y - h} q${20 - i * 10} ${120 + i * 30} ${-10} ${220 + i * 40}`} stroke="#4a7a3a" strokeWidth={12} fill="none" opacity={0.8} />)}
    {/* portão em arco */}
    {portao > 0 && <g>
      <path d={`M380 ${y} V${y - 300} Q540 ${y - 450} 700 ${y - 300} V${y} z`} fill="#3a3a40" stroke={L} strokeWidth={6} />
      <path d={`M400 ${y} V${y - 290} Q540 ${y - 420} 680 ${y - 290} V${y} z`} fill="#6b4224" stroke={L} strokeWidth={5} opacity={portao} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${410 + i * 46} ${y - 330 + Math.abs(i - 2.5) * 16} V${y}`} stroke="#4a2a1a" strokeWidth={6} opacity={portao} />)}
      {[y - 260, y - 140, y - 40].map((yy) => <rect key={yy} x={400} y={yy} width={280} height={18} fill="#3a3a40" opacity={portao} />)}
      <path d={`M380 ${y - 300} Q540 ${y - 450} 700 ${y - 300}`} stroke="#8a7c68" strokeWidth={18} fill="none" />
    </g>}
    {quebrada > 0 && <g>
      <path d={`M300 ${y} L330 ${y - 360 * quebrada} L420 ${y - 420 * quebrada} L480 ${y - 330 * quebrada} L560 ${y - 470 * quebrada} L650 ${y - 360 * quebrada} L740 ${y - 400 * quebrada} L780 ${y} z`} fill="#c8b08a" stroke={L} strokeWidth={5} />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${320 + rnd(i) * 440} ${y - rnd(i + 3) * 500} l${30 - rnd(i + 1) * 60} ${-40 - rnd(i + 2) * 60}`} stroke={L} strokeWidth={4} />)}
    </g>}
  </g>
);

// ---------- Casas de enxaimel ----------
const Casa = ({ x, y, w = 220, h = 260, tel = '#b8442e', par = '#f2e6cc', seed = 0, luz = false }: { x: number; y: number; w?: number; h?: number; tel?: string; par?: string; seed?: number; luz?: boolean }) => (
  <g>
    <rect x={x} y={y - h} width={w} height={h} fill={par} stroke={L} strokeWidth={5} />
    {/* vigas do enxaimel */}
    <path d={`M${x} ${y - h * 0.5} H${x + w} M${x + w * 0.33} ${y - h} V${y} M${x + w * 0.66} ${y - h} V${y} M${x} ${y - h} L${x + w * 0.33} ${y - h * 0.5} M${x + w} ${y - h} L${x + w * 0.66} ${y - h * 0.5}`} stroke="#5a3a22" strokeWidth={10} />
    <path d={`M${x - 24} ${y - h} L${x + w / 2} ${y - h - w * 0.55} L${x + w + 24} ${y - h} z`} fill={tel} stroke={L} strokeWidth={5} />
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${x - 10 + i * 10} ${y - h - i * w * 0.1} H${x + w + 10 - i * 10}`} stroke="#8a2a1a" strokeWidth={3} opacity={0.6} />)}
    <rect x={x + w * 0.7} y={y - h - w * 0.45} width={30} height={70} fill="#8a5a3a" stroke={L} strokeWidth={3} />
    {[0, 1].map((k) => <rect key={k} x={x + 18 + k * w * 0.5} y={y - h * 0.86} width={w * 0.24} height={h * 0.24} fill={luz ? '#ffd166' : '#5a7a9a'} stroke={L} strokeWidth={4} />)}
    {[0, 1].map((k) => <g key={k}><rect x={x + 12 + k * w * 0.5} y={y - h * 0.62 + 6} width={w * 0.3} height={22} fill="#8a5a32" stroke={L} strokeWidth={3} />{[0, 1, 2].map((f) => <circle key={f} cx={x + 24 + k * w * 0.5 + f * 18} cy={y - h * 0.62} r={10} fill={['#e5484d', '#f2c94c', '#f28fb0'][(f + seed) % 3]} />)}</g>)}
    <path d={`M${x + w * 0.38} ${y} V${y - h * 0.38} Q${x + w * 0.5} ${y - h * 0.46} ${x + w * 0.62} ${y - h * 0.38} V${y} z`} fill="#6b4224" stroke={L} strokeWidth={4} />
    <circle cx={x + w * 0.58} cy={y - h * 0.18} r={5} fill="#c9a14a" />
  </g>
);
const Fumaca = ({ x, y, t }: { x: number; y: number; t: number }) => <>{[0, 1, 2].map((i) => { const k = (t * 0.4 + i / 3) % 1; return <circle key={i} cx={x + Math.sin(k * 5) * 20 + k * 30} cy={y - k * 180} r={14 + k * 30} fill="#d8d8d8" opacity={0.6 * (1 - k)} />; })}</>;

// ---------- Cidade (rua de pedra, casas, feira, poço, varal, muralha ao fundo) ----------
export const CidadeMuro = ({ t, tarde = 0, estrago = 0, muralha = true, poeira = 0, multidao = 0 }: { t: number; tarde?: number; estrago?: number; muralha?: boolean; poeira?: number; multidao?: number }) => (
  <Svg>
    <CeuMuro t={t} tarde={tarde} poeira={poeira} />
    {muralha && <g transform="translate(0 -40) scale(1 0.9)"><Muralha y={1180} h={560} portao={1} t={t} quebrada={estrago > 0.5 ? 1 : 0} /></g>}
    {/* casas do fundo */}
    {Array.from({ length: 6 }, (_, i) => <Casa key={`f${i}`} x={-40 + i * 190} y={1160} w={170} h={200} tel={['#b8442e', '#a83a2a', '#c8582e'][i % 3]} par={['#f2e6cc', '#e8dcc0', '#f4ecd8'][i % 3]} seed={i} />)}
    {Array.from({ length: 6 }, (_, i) => <Fumaca key={i} x={-40 + i * 190 + 135} y={880} t={t + i} />)}
    {/* rua de paralelepípedos */}
    <path d="M0 1160 H1080 V1920 H0 z" fill="#8a8478" />
    {Array.from({ length: 14 }, (_, r) => Array.from({ length: 12 }, (_, c) => <rect key={`${r}-${c}`} x={c * 96 + (r % 2) * 48 - 48} y={1170 + r * 54} width={90} height={48} rx={14} fill={['#9a9488', '#8e887c', '#a49e92'][(r * 3 + c) % 3]} stroke="#6a645a" strokeWidth={2} />))}
    {/* casas da frente nas laterais */}
    <Casa x={-60} y={1380} w={250} h={360} tel="#a83a2a" seed={2} />
    <Casa x={890} y={1380} w={250} h={360} tel="#c8582e" par="#e8dcc0" seed={4} />
    {/* varal entre as casas */}
    <path d="M190 1080 Q540 1140 890 1080" stroke="#6a5a4a" strokeWidth={3} fill="none" />
    {[300, 420, 600, 720].map((x, i) => <rect key={x} x={x} y={1100 + Math.sin(i) * 8} width={60} height={80} fill={['#f4f4f4', '#2f8acf', '#e5484d', '#f2c94c'][i]} stroke={L} strokeWidth={2} transform={`rotate(${3 * Math.sin(t + i)} ${x + 30} 1100)`} />)}
    {/* poço, barraca de feira, lampião */}
    <g transform="translate(240 1520)"><ellipse rx={80} ry={24} fill="#5a5a62" /><rect x={-80} y={-60} width={160} height={60} fill="#9a8c78" stroke={L} strokeWidth={4} /><path d="M-70 -60 V-180 M70 -60 V-180 M-90 -180 L0 -230 L90 -180 z" stroke="#5a3a22" strokeWidth={8} fill="#a83a2a" /><path d="M0 -180 v80" stroke="#6a5a4a" strokeWidth={3} /><rect x={-14} y={-110} width={28} height={30} fill="#6b4224" /></g>
    <g transform="translate(760 1560)"><rect x={-130} y={-80} width={260} height={80} fill="#8a5a32" stroke={L} strokeWidth={4} /><path d="M-150 -200 h300 l-20 50 h-260 z" fill="#e8e2d0" stroke={L} strokeWidth={4} />{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-150 + i * 60} -150 h30 v12 h-30 z`} fill="#c22a2a" />)}<path d="M-130 -150 V-80 M130 -150 V-80" stroke="#5a3a22" strokeWidth={8} />{Array.from({ length: 8 }, (_, i) => <circle key={i} cx={-100 + i * 28} cy={-92} r={13} fill={['#e5484d', '#f2c94c', '#3aa14a', '#f28a2a'][i % 4]} stroke={L} strokeWidth={2} />)}</g>
    <g transform="translate(560 1440)"><rect x={-6} y={-260} width={12} height={260} fill="#2a2a30" /><rect x={-24} y={-300} width={48} height={50} rx={6} fill="#ffe8a0" stroke={L} strokeWidth={4} /></g>
    {/* multidão nas laterais (cabeças) */}
    {multidao > 0 && Array.from({ length: 18 }, (_, i) => { const lado = i % 2, x = lado ? 900 + (i % 5) * 34 : 60 + (i % 5) * 34, y = 1300 + Math.floor(i / 2) * 22; return <g key={i}><circle cx={x} cy={y} r={22} fill={['#e2b48c', '#7a4b30', '#f6e3d3', '#c98a5a'][i % 4]} stroke={L} strokeWidth={3} /><rect x={x - 22} y={y + 18} width={44} height={50} rx={14} fill={['#5a6a7a', '#8a5a3a', '#4a6a4a', '#7a4a5a'][i % 4]} stroke={L} strokeWidth={3} /></g>; })}
    {/* estragos: pedras, vigas, fogo */}
    {estrago > 0 && <g>
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${100 + rnd(i) * 880} ${1300 + rnd(i + 5) * 560} l40 -50 l50 10 l20 50 l-40 30 z`} fill="#9a8c78" stroke={L} strokeWidth={4} />)}
      {[[320, 1060], [820, 1020]].map(([x, y], i) => <g key={i}>{[0, 1, 2].map((k) => { const h = 90 + 30 * Math.sin(t * 10 + k + i); return <path key={k} d={`M${x - 30 + k * 30} ${y} q-26 ${-h * 0.5} 6 ${-h} q16 ${h * 0.5} 16 ${h} z`} fill={k % 2 ? '#ffd166' : '#ff7a2a'} />; })}<Fumaca x={x} y={y - 100} t={t * 2 + i} /></g>)}
    </g>}
    <Poeira t={t} n={20} cor="#fff6d8" op={0.4} area={[0, 900, 1080, 900]} />
  </Svg>
);

// ---------- Lá fora: campos, floresta, névoa, Imensos ao longe ----------
export const Fora = ({ t }: { t: number }) => (
  <Svg>
    <CeuMuro t={t} />
    <path d="M0 980 Q300 920 600 970 T1080 950 V1920 H0 z" fill="#8ab06a" />
    {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={i * 72} cy={990 + Math.sin(i) * 10} rx={60} ry={70} fill="#4a7a3a" />)}
    {[0, 1, 2].map((i) => { const x = ((i * 400 + t * 12) % 1400) - 150, h = 420 + i * 120; return <g key={i} opacity={0.5 - i * 0.1} transform={`translate(${x} 1000)`}><ImensoCorpo h={h} t={t + i} cor="#8a6a5a" /></g>; })}
    <path d="M0 1100 H1080 V1920 H0 z" fill="#9ac07a" />
    {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${rnd(i) * 1080} ${1150 + rnd(i + 2) * 700} q6 -26 2 -40`} stroke="#6a9a4a" strokeWidth={4} />)}
    {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={((i * 300 + t * 30) % 1500) - 200} cy={1050 + i * 40} rx={320} ry={50} fill="#fff" opacity={0.35} />)}
  </Svg>
);

// ---------- Os Imensos ----------
// Corpo inteiro (pés em (0,0)), altura h.
export const ImensoCorpo = ({ h, t, cor = '#a07a5a', anda = 0 }: { h: number; t: number; cor?: string; anda?: number }) => {
  const s = h / 1000, p = Math.sin(t * 1.5) * anda;
  return (
    <g transform={`scale(${s})`}>
      <path d={`M-120 0 L${-90 + p * 40} -420 H-10 L${-30 - p * 40} 0 z M120 0 L${90 - p * 40} -420 H10 L${30 + p * 40} 0 z`} fill={cor} stroke={L} strokeWidth={10} />
      <path d="M-170 -420 Q-190 -720 -120 -760 H120 Q190 -720 170 -420 z" fill={cor} stroke={L} strokeWidth={10} />
      <path d={`M-160 -720 Q-260 -560 ${-230 + p * 30} -380`} stroke={cor} strokeWidth={80} fill="none" strokeLinecap="round" /><path d={`M160 -720 Q260 -560 ${230 - p * 30} -380`} stroke={cor} strokeWidth={80} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-870} rx={130} ry={150} fill={cor} stroke={L} strokeWidth={10} />
      {[[-60, -600, 50], [40, -500, -30], [-20, -850, 60], [80, -300, 20]].map(([x, y, a], i) => <path key={i} d={`M${x} ${y} l${a} 40 l-20 40`} stroke="#5a3a2a" strokeWidth={8} fill="none" />)}
    </g>
  );
};
// Mão gigante segurando o alto da muralha (dedos por cima), x centro, y = topo da muralha.
export const MaoBarro = ({ x, y, k = 1, s = 1, cor = '#a07a5a' }: { x: number; y: number; k?: number; s?: number; cor?: string }) => (
  <g transform={`translate(${x} ${y + (1 - k) * 200}) scale(${s})`} opacity={clamp(k * 2)}>
    {[-150, -60, 30, 120].map((dx, i) => <g key={i}><rect x={dx - 38} y={-90 + [10, 0, 5, 20][i]} width={76} height={170} rx={38} fill={cor} stroke={L} strokeWidth={8} /><path d={`M${dx - 20} ${-30 + [10, 0, 5, 20][i]} h40`} stroke="#5a3a2a" strokeWidth={5} /></g>)}
    <rect x={-230} y={30} width={60} height={120} rx={30} fill={cor} stroke={L} strokeWidth={8} transform="rotate(-30 -200 90)" />
    {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-120 + i * 50} cy={100 + (i % 2) * 20} r={6 + (i % 3) * 3} fill="#9a8c78" />)}
  </g>
);
// Rosto sem olhos e sem boca subindo por trás da muralha (y = topo da muralha).
export const RostoImenso = ({ x, y, k = 1, s = 1, cor = '#a07a5a', t = 0 }: { x: number; y: number; k?: number; s?: number; cor?: string; t?: number }) => (
  <g transform={`translate(${x} ${y + (1 - k) * 420}) scale(${s})`}>
    <ellipse cx={0} cy={-200} rx={260} ry={300} fill={cor} stroke={L} strokeWidth={10} />
    <ellipse cx={-100} cy={-240} rx={60} ry={30} fill="#000" opacity={0.12} /><ellipse cx={100} cy={-240} rx={60} ry={30} fill="#000" opacity={0.12} />
    <path d="M-30 -160 q30 20 60 0" stroke="#5a3a2a" strokeWidth={6} fill="none" opacity={0.5} />
    {[[-160, -380, 60], [120, -420, -40], [-40, -60, 30], [180, -120, 40]].map(([px, py, a], i) => <path key={i} d={`M${px} ${py} l${a} 50 l-30 50`} stroke="#5a3a2a" strokeWidth={8} fill="none" />)}
    {Array.from({ length: 5 }, (_, i) => { const q = (t * 0.6 + i / 5) % 1; return <circle key={i} cx={-200 + i * 100 + Math.sin(q * 6) * 20} cy={-460 - q * 200} r={20 + q * 40} fill="#f4f0e4" opacity={0.5 * (1 - q)} />; })}
  </g>
);
// Pedras voando em arco (k = 0..1 do voo).
export const PedrasVoando = ({ t, de, n = 6 }: { t: number; de: number; n?: number }) => (
  <>{Array.from({ length: n }, (_, i) => { const k = clamp((t - de - i * 0.15) / 1.2); if (k <= 0 || k >= 1) return null; const x = 200 + rnd(i) * 300 + k * (300 + rnd(i + 3) * 500), y = 700 - Math.sin(k * Math.PI) * 500 + k * 700; return <g key={i} transform={`translate(${x} ${y}) rotate(${k * 600})`}><path d="M-50 -30 l40 -30 l50 10 l20 40 l-30 40 l-60 0 z" fill="#9a8c78" stroke={L} strokeWidth={5} /><path d={`M-60 0 l-${80 * k} -${40 * k}`} stroke="#c8b08a" strokeWidth={14} opacity={0.4} /></g>; })}</>
);
export const NuvemPoeira = ({ t, k = 1, y = 1300 }: { t: number; k?: number; y?: number }) => (
  <>{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={rnd(i) * 1080 + Math.sin(t * 0.5 + i) * 30} cy={y + (rnd(i + 3) - 0.5) * 600 - k * 100} r={(120 + rnd(i + 5) * 160) * k} fill={['#c8b08a', '#b8a080', '#d8c4a0'][i % 3]} opacity={0.75 * k} />)}</>
);

// ---------- Cozinha da casa do Tito ----------
export const Cozinha = ({ t, desabada = 0 }: { t: number; desabada?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#d8c4a0" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M0 ${120 + i * 130} H1080`} stroke="#c8b48e" strokeWidth={4} />)}
    <path d="M0 260 H1080" stroke="#5a3a22" strokeWidth={34} /><path d="M200 0 V260 M600 0 V260 M960 0 V260" stroke="#5a3a22" strokeWidth={24} />
    {/* lareira de pedra com caldeirão */}
    <g transform="translate(260 1480)"><rect x={-200} y={-560} width={400} height={560} fill="#9a8c78" stroke={L} strokeWidth={6} />{Array.from({ length: 10 }, (_, r) => Array.from({ length: 4 }, (_, c) => <rect key={`${r}${c}`} x={-196 + c * 100 + (r % 2) * 50} y={-556 + r * 56} width={96} height={52} rx={6} fill={['#a89a86', '#948672'][(r + c) % 2]} stroke="#7a6c58" strokeWidth={2} />))}<path d="M-130 0 V-240 Q0 -330 130 -240 V0 z" fill="#2a1a12" /><path d="M-60 -200 h120 v60 q0 50 -60 50 q-60 0 -60 -50 z" fill="#3a3a40" stroke={L} strokeWidth={5} />{[0, 1, 2].map((k) => { const h = 80 + 20 * Math.sin(t * 11 + k); return <path key={k} d={`M${-40 + k * 40} -10 q-20 ${-h * 0.5} 6 ${-h} q10 ${h * 0.5} 10 ${h} z`} fill={k % 2 ? '#ffd166' : '#ff7a2a'} />; })}<Fumaca x={0} y={-240} t={t} /></g>
    {/* janela com vista da muralha */}
    <g transform="translate(760 460)"><rect x={-180} y={0} width={360} height={300} fill="#8ac0e8" stroke="#5a3a22" strokeWidth={16} /><rect x={-170} y={140} width={340} height={150} fill="#a89a86" />{Array.from({ length: 7 }, (_, i) => <rect key={i} x={-170 + i * 50} y={120} width={30} height={26} fill="#a89a86" />)}<path d="M0 0 V300 M-180 150 H180" stroke="#5a3a22" strokeWidth={10} /><path d="M-200 -10 q60 160 0 330 M200 -10 q-60 160 0 330" stroke="#c84a4a" strokeWidth={24} fill="none" /></g>
    {/* prateleira com potes, ervas secando */}
    <g transform="translate(760 880)"><rect x={-200} y={0} width={400} height={20} fill="#6b4224" stroke={L} strokeWidth={3} />{[-160, -90, -20, 60, 140].map((x, i) => <g key={x}><rect x={x - 26} y={-70} width={52} height={70} rx={10} fill={['#c8a06a', '#e8e2d0', '#6a8aa8', '#c84a4a', '#3a7a4a'][i]} stroke={L} strokeWidth={3} /><rect x={x - 28} y={-80} width={56} height={14} rx={4} fill="#5a3a22" /></g>)}</g>
    {[480, 540, 600].map((x, i) => <g key={x}><path d={`M${x} 260 v60`} stroke="#6a5a4a" strokeWidth={3} /><path d={`M${x - 20} 320 l20 60 l20 -60 z`} fill={['#6a9a4a', '#8aaa5a', '#5a8a3a'][i]} /></g>)}
    {/* mesa com pão e jarra, vassoura */}
    <g transform="translate(700 1480)"><rect x={-260} y={-280} width={520} height={34} fill="#8a5a32" stroke={L} strokeWidth={5} /><path d="M-230 -246 V0 M230 -246 V0" stroke="#6b4224" strokeWidth={24} /><ellipse cx={-120} cy={-300} rx={70} ry={30} fill="#d8a060" stroke={L} strokeWidth={4} /><path d="M-160 -310 q40 -20 80 0" stroke="#a87040" strokeWidth={4} fill="none" /><path d="M60 -280 v-80 q0 -20 30 -20 h20 q30 0 30 20 v80 z" fill="#e8e2d0" stroke={L} strokeWidth={4} /></g>
    <g transform="translate(1010 1480) rotate(8)"><path d="M0 0 V-400" stroke="#8a5a32" strokeWidth={10} /><path d="M-30 0 L0 -100 L30 0 z" fill="#e8c87a" stroke={L} strokeWidth={3} /></g>
    <rect x={0} y={CHAO_M} width={1080} height={440} fill="#8a6a4a" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${i * 140} ${CHAO_M} V1920`} stroke="#6a4a32" strokeWidth={4} />)}
    {desabada > 0 && <rect width={1080} height={1920} fill="#c8b08a" opacity={0.4 * desabada} />}
    <Poeira t={t} n={24} op={0.5} cor="#fff6d8" area={[580, 460, 400, 700]} />
  </Svg>
);

// ---------- Telhado da torre do sino ----------
export const TorreSino = ({ t, sino = 0 }: { t: number; sino?: number }) => (
  <Svg>
    <CeuMuro t={t} tarde={1} />
    <g transform="translate(0 260) scale(1 0.55)"><Muralha y={1300} h={520} portao={1} t={t} /></g>
    {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(0 ${-60})`}><Casa x={-60 + i * 170} y={1080 + (i % 2) * 30} w={150} h={150} tel={['#b8442e', '#a83a2a', '#c8582e'][i % 3]} seed={i} /></g>)}
    {/* telhado inclinado de telhas onde as crianças estão */}
    <path d="M0 1300 L1080 1220 V1920 H0 z" fill="#b8442e" stroke={L} strokeWidth={6} />
    {Array.from({ length: 12 }, (_, r) => <path key={r} d={`M0 ${1330 + r * 52} L1080 ${1250 + r * 52}`} stroke="#8a2a1a" strokeWidth={5} />)}
    {Array.from({ length: 20 }, (_, c) => <path key={c} d={`M${c * 60} ${1300 - c * 4.4} V1920`} stroke="#9a3a22" strokeWidth={3} opacity={0.5} />)}
    {/* o sino na armação */}
    <g transform={`translate(900 1100) rotate(${sino * 18 * Math.sin(t * 6)})`}><path d="M-120 0 V-260 H120 V0" stroke="#5a3a22" strokeWidth={22} fill="none" /><path d="M-130 -270 L0 -360 L130 -270 z" fill="#8a2a1a" stroke={L} strokeWidth={5} /><path d="M-70 -40 Q-70 -200 0 -210 Q70 -200 70 -40 h20 v20 h-180 v-20 z" fill="#c9a14a" stroke={L} strokeWidth={6} /><circle cx={0} cy={-10} r={16} fill="#8a6a2a" /></g>
  </Svg>
);

// ---------- Casa desabada (viga) ----------
export const CasaDesabada = ({ t }: { t: number }) => (
  <Svg>
    <CeuMuro t={t} poeira={1} />
    <Casa x={-60} y={1160} w={250} h={300} tel="#a83a2a" seed={1} />
    <Casa x={890} y={1160} w={250} h={300} tel="#c8582e" par="#e8dcc0" seed={3} />
    {/* paredes quebradas e telhas no chão */}
    <path d="M200 1160 L230 820 L330 900 L400 760 L470 880 L560 700 L650 860 L740 780 L820 900 L880 1160 z" fill="#f2e6cc" stroke={L} strokeWidth={6} />
    <path d="M240 900 V1160 M560 760 V1160" stroke="#5a3a22" strokeWidth={12} />
    <path d="M0 1160 H1080 V1920 H0 z" fill="#8a8478" />
    {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${rnd(i) * 1080} ${1180 + rnd(i + 3) * 740} l30 -20 l40 6 l10 30 l-30 20 z`} fill={i % 3 ? '#9a8c78' : '#b8442e'} stroke={L} strokeWidth={3} />)}
    {/* a viga grande atravessada */}
    <rect x={120} y={1440} width={840} height={110} rx={16} fill="#6b4224" stroke={L} strokeWidth={8} transform="rotate(-6 540 1495)" />
    {[0, 1, 2].map((i) => <path key={i} d={`M${200 + i * 260} ${1470 - i * 26} h120`} stroke="#4a2a1a" strokeWidth={6} transform="rotate(-6 540 1495)" />)}
    {[[300, 1000], [860, 980]].map(([x, y], i) => <g key={i}>{[0, 1, 2].map((k) => { const h = 70 + 20 * Math.sin(t * 10 + k + i); return <path key={k} d={`M${x - 24 + k * 24} ${y} q-20 ${-h * 0.5} 5 ${-h} q12 ${h * 0.5} 12 ${h} z`} fill={k % 2 ? '#ffd166' : '#ff7a2a'} />; })}<Fumaca x={x} y={y - 80} t={t * 2 + i} /></g>)}
    <Poeira t={t} n={40} cor="#e8d8b8" op={0.6} />
  </Svg>
);

// ---------- Canal com o barco lotado e a segunda muralha ----------
export const Canal = ({ t }: { t: number }) => (
  <Svg>
    <CeuMuro t={t} tarde={1} />
    {/* segunda muralha à frente (ao fundo do quadro) */}
    <g transform="translate(0 120) scale(1 0.62)"><Muralha y={1360} h={520} portao={1} t={t} cor="#9a9aa6" /></g>
    {Array.from({ length: 6 }, (_, i) => { const k = (t * 0.08 + i / 6) % 1; return <circle key={i} cx={100 + i * 160 + k * 60} cy={700 - k * 500} r={60 + k * 140} fill="#5a5a62" opacity={0.3 * (1 - k)} />; })}
    {/* água */}
    <rect x={0} y={1050} width={1080} height={870} fill="#3a6a8a" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${((i * 140 + t * 40) % 1300) - 120} ${1090 + (i % 6) * 130} q40 -12 80 0`} stroke="#8ab0c8" strokeWidth={4} fill="none" />)}
    {/* margens de pedra */}
    <path d="M0 1050 L160 1050 L60 1920 H0 z M1080 1050 L920 1050 L1020 1920 H1080 z" fill="#9a8c78" stroke={L} strokeWidth={5} />
  </Svg>
);
export const Barco = ({ x, y, t, s = 1 }: { x: number; y: number; t: number; s?: number }) => (
  <g transform={`translate(${x} ${y + 8 * Math.sin(t * 1.4)}) rotate(${2 * Math.sin(t)}) scale(${s})`}>
    <path d="M-460 -70 L460 -70 Q420 60 300 80 L-320 80 Q-430 60 -460 -70 z" fill="#8a5a32" stroke={L} strokeWidth={8} />
    <rect x={-470} y={-86} width={940} height={22} rx={8} fill="#a06a3a" stroke={L} strokeWidth={5} />
    {[-20, 20].map((dy) => <path key={dy} d={`M-420 ${dy} H420`} stroke={L} strokeWidth={3} opacity={0.35} />)}
    <path d="M380 -80 l100 -160" stroke="#5a3a22" strokeWidth={10} />
  </g>
);
