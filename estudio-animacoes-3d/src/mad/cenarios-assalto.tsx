// Cenários de "Quatro Minutos": torre do relógio, oficina do Relojoeiro, banco Casa do Ouro, saguão, sala de câmeras,
// cofre (porta redonda + broca), cofre vazio, viaturas, jornal e esgoto. Todos 1080×1920, função pura de t.
import { ReactNode, useId } from 'react';
import { L, Svg } from './cenarios';
import { Poeira } from './cenarios-ilha';

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const uid = () => useId().replace(/:/g, '');
export const clamp = (x: number) => Math.min(1, Math.max(0, x));
export const CHAO_A = 1480; // chão dos interiores

// ---------- Céu e cidade ----------
export const CeuCidade = ({ t, tarde = 0, noite = false }: { t: number; tarde?: number; noite?: boolean }) => {
  const id = uid();
  const topo = noite ? '#0d1530' : tarde > 0 ? '#f2a35e' : '#7ec8f2', base = noite ? '#28345a' : tarde > 0 ? '#ffd9a0' : '#d8f0ff';
  return (
    <>
      <defs><linearGradient id={`c${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={topo} /><stop offset="1" stopColor={base} /></linearGradient></defs>
      <rect width={1080} height={1920} fill={`url(#c${id})`} />
      {noite ? Array.from({ length: 40 }, (_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 3) * 700} r={2 + rnd(i + 5) * 2} fill="#fff" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)
        : [0, 1, 2].map((i) => { const x = ((i * 420 + t * (14 + i * 6)) % 1500) - 200, y = 180 + i * 150; return <g key={i} fill="#fff" opacity={0.85}><ellipse cx={x} cy={y} rx={120} ry={40} /><ellipse cx={x + 70} cy={y - 26} rx={80} ry={40} /><ellipse cx={x - 70} cy={y - 10} rx={70} ry={30} /></g>; })}
    </>
  );
};
const Predios = ({ y = 1300, cor = '#8fa6c2', escuro = '#6f86a6' }: { y?: number; cor?: string; escuro?: string }) => (
  <>
    {[[0, 380, 200], [190, 300, 160], [330, 420, 150], [760, 360, 180], [920, 440, 170]].map(([x, h, w], i) => (
      <g key={i}>
        <rect x={x} y={y - h} width={w} height={h} fill={i % 2 ? cor : escuro} stroke={L} strokeWidth={4} />
        {Array.from({ length: Math.floor(h / 70) * 2 }, (_, j) => <rect key={j} x={x + 22 + (j % 2) * (w / 2)} y={y - h + 26 + Math.floor(j / 2) * 70} width={w / 2 - 44} height={36} fill="#dbe8f5" opacity={0.7} />)}
      </g>
    ))}
  </>
);

// ---------- Torre do relógio (praça) ----------
// hora/min em graus de ponteiro calculados de fora; balanco = 0..1 (sino balançando).
export const Torre = ({ t, h = 12, m = 0, balanco = 0, tarde = 0 }: { t: number; h?: number; m?: number; balanco?: number; tarde?: number }) => {
  const ang = 18 * balanco * Math.sin(t * 7);
  const aM = m * 6, aH = (h % 12) * 30 + m * 0.5;
  return (
    <Svg>
      <CeuCidade t={t} tarde={tarde} />
      <Predios y={1500} />
      {/* pássaros voando no céu */}
      {Array.from({ length: 5 }, (_, i) => { const x = ((t * (60 + i * 12) + i * 260) % 1300) - 120, y = 160 + i * 70 + 20 * Math.sin(t * 2 + i), a = 14 * Math.sin(t * 10 + i); return <path key={i} d={`M${x - 22} ${y - a} Q${x - 10} ${y - 6} ${x} ${y} Q${x + 10} ${y - 6} ${x + 22} ${y - a}`} stroke={L} strokeWidth={4} fill="none" />; })}
      {/* árvores atrás dos bancos */}
      {[[110, 1500, 1], [970, 1500, 1.1]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <rect x={-14} y={-200} width={28} height={200} fill="#6b4224" stroke={L} strokeWidth={4} />
          <g transform={`rotate(${2 * Math.sin(t * 1.2 + i)} 0 -200)`}>{[[-60, -250, 80], [50, -260, 85], [0, -330, 95], [-30, -190, 60], [40, -190, 60]].map(([cx, cy, r], j) => <circle key={j} cx={cx} cy={cy} r={r} fill={j % 2 ? '#4a8a3a' : '#5aa04a'} stroke={L} strokeWidth={4} />)}</g>
        </g>
      ))}
      {/* bandeirinhas da torre até as bordas */}
      {[[-1, 380], [1, 700]].map(([s, x0]) => (
        <g key={s}>
          <path d={`M${x0} 1000 Q${x0 + s * 200} 1080 ${x0 + s * 400} 1020`} stroke={L} strokeWidth={3} fill="none" />
          {Array.from({ length: 7 }, (_, i) => { const k = (i + 0.5) / 7, x = x0 + s * 400 * k, y = 1000 + 80 * 4 * k * (1 - k) * 0.95 - 20 * k; return <path key={i} d={`M${x - 16} ${y} L${x + 16} ${y} L${x} ${y + 34 + 4 * Math.sin(t * 5 + i)} z`} fill={['#d1495b', '#e8c240', '#2f5f9a', '#3a8a3a'][i % 4]} stroke={L} strokeWidth={2} />; })}
        </g>
      ))}
      {/* torre */}
      <rect x={380} y={420} width={320} height={1100} fill="#c9a77a" stroke={L} strokeWidth={6} />
      {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M380 ${460 + i * 50} h320`} stroke="#a8875c" strokeWidth={3} />)}
      <rect x={360} y={250} width={360} height={190} fill="#b5916a" stroke={L} strokeWidth={6} />
      <path d="M340 255 L540 60 L740 255 z" fill="#7a3a2a" stroke={L} strokeWidth={6} strokeLinejoin="round" />
      <path d="M540 60 v-50" stroke={L} strokeWidth={6} /><circle cx={540} cy={6} r={10} fill="#e8c240" stroke={L} strokeWidth={4} />
      {/* janela do sino */}
      <path d="M440 430 V320 Q540 250 640 320 V430 z" fill="#2a1e18" stroke={L} strokeWidth={5} />
      <g transform={`rotate(${ang} 540 300)`}>
        <path d="M540 300 v18" stroke={L} strokeWidth={6} />
        <path d="M490 405 Q492 330 540 318 Q588 330 590 405 Q600 418 540 418 Q480 418 490 405 z" fill="#d9a83a" stroke={L} strokeWidth={5} />
        <circle cx={540 - ang * 1.2} cy={420} r={11} fill="#8a6a2a" stroke={L} strokeWidth={3} />
      </g>
      {balanco > 0.2 && [0, 1, 2].map((k) => { const kk = (t * 2 + k / 3) % 1; return <circle key={k} cx={540} cy={370} r={90 + kk * 260} fill="none" stroke="#fff" strokeWidth={8 * (1 - kk)} opacity={0.6 * (1 - kk) * balanco} />; })}
      {/* relógio */}
      <circle cx={540} cy={640} r={140} fill="#fffaf0" stroke={L} strokeWidth={10} />
      <circle cx={540} cy={640} r={124} fill="none" stroke="#c9a14a" strokeWidth={6} />
      {Array.from({ length: 12 }, (_, i) => { const a = (i * 30 * Math.PI) / 180; return <path key={i} d={`M${540 + Math.sin(a) * 104} ${640 - Math.cos(a) * 104} L${540 + Math.sin(a) * (i % 3 ? 114 : 92)} ${640 - Math.cos(a) * (i % 3 ? 114 : 92)}`} stroke={L} strokeWidth={i % 3 ? 5 : 10} />; })}
      <path d={`M540 640 L${540 + Math.sin((aH * Math.PI) / 180) * 64} ${640 - Math.cos((aH * Math.PI) / 180) * 64}`} stroke={L} strokeWidth={14} strokeLinecap="round" />
      <path d={`M540 640 L${540 + Math.sin((aM * Math.PI) / 180) * 104} ${640 - Math.cos((aM * Math.PI) / 180) * 104}`} stroke={L} strokeWidth={8} strokeLinecap="round" />
      <circle cx={540} cy={640} r={12} fill="#c9a14a" stroke={L} strokeWidth={4} />
      <rect x={480} y={1330} width={120} height={190} rx={60} fill="#5a3a22" stroke={L} strokeWidth={5} />
      {/* praça */}
      <rect x={0} y={1500} width={1080} height={420} fill="#bfb3a0" />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={(i % 6) * 190 - (Math.floor(i / 6) % 2) * 95} y={1510 + Math.floor(i / 6) * 84} width={180} height={76} fill="#cfc4b2" stroke="#a89c88" strokeWidth={3} />)}
      {/* postes, bancos e floreiras */}
      {[200, 880].map((x) => <g key={x}><rect x={x - 8} y={1260} width={16} height={260} fill="#2a2a30" stroke={L} strokeWidth={3} /><path d={`M${x - 30} 1260 h60 l-12 -50 h-36 z`} fill="#2a2a30" stroke={L} strokeWidth={3} /><circle cx={x} cy={1236} r={16} fill="#fff6c8" /></g>)}
      {[290, 790].map((x) => <g key={x}><rect x={x - 80} y={1470} width={160} height={14} rx={4} fill="#8a5a32" stroke={L} strokeWidth={3} /><rect x={x - 80} y={1440} width={160} height={14} rx={4} fill="#8a5a32" stroke={L} strokeWidth={3} /><path d={`M${x - 66} 1484 v34 M${x + 66} 1484 v34`} stroke="#2a2a30" strokeWidth={8} /></g>)}
      {[60, 1020].map((x) => <g key={x}><path d={`M${x - 40} 1520 L${x - 30} 1600 H${x + 30} L${x + 40} 1520 z`} fill="#b5642a" stroke={L} strokeWidth={4} />{[-24, 0, 24].map((d, j) => <circle key={j} cx={x + d} cy={1510 - (j % 2) * 14} r={16} fill={['#d1495b', '#f2c94c', '#e86aa0'][j]} stroke={L} strokeWidth={3} />)}</g>)}
      {/* pombos */}
      {[0, 1, 2].map((i) => { const x = 160 + i * 340 + Math.sin(t * 2 + i) * 30; const voa = balanco > 0.2 ? (t * 200 + i * 60) % 900 : 0; return <g key={i} transform={`translate(${x + voa * 0.4} ${1560 + i * 30 - voa})`}><ellipse rx={22} ry={14} fill="#8a8a9a" stroke={L} strokeWidth={3} /><circle cx={18} cy={-12} r={9} fill="#8a8a9a" stroke={L} strokeWidth={3} />{voa > 0 && <path d={`M-8 -6 q-20 ${-24 + 14 * Math.sin(t * 30)} -40 -6`} stroke={L} strokeWidth={4} fill="#9a9aaa" />}</g>; })}
    </Svg>
  );
};

// ---------- Oficina do Relojoeiro ----------
// Parede com relógios de pêndulo, bancada com engrenagens e o quadro de cortiça do plano (fios vermelhos).
export const Oficina = ({ t, quadro = true, fios = 1, lampada = true }: { t: number; quadro?: boolean; fios?: number; lampada?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#3e4a3a" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 96} 0 V${CHAO_A}`} stroke="#35402f" strokeWidth={10} />)}
    {Array.from({ length: 11 * 15 }, (_, i) => <path key={i} d={`M${(i % 11) * 96 + 48} ${Math.floor(i / 11) * 100 + 40} l10 14 l-10 14 l-10 -14 z`} fill="#46523f" />)}
    <rect x={0} y={1200} width={1080} height={CHAO_A - 1200} fill="#4a3424" opacity={0.55} />
    <path d={`M0 1200 H1080`} stroke="#2a1a10" strokeWidth={8} />
    <rect x={0} y={CHAO_A} width={1080} height={440} fill="#4a3424" />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M0 ${CHAO_A + 30 + i * 62} H1080`} stroke="#3a2618" strokeWidth={3} />)}
    {/* tapete */}
    <ellipse cx={540} cy={1720} rx={460} ry={120} fill="#7a2a2a" stroke={L} strokeWidth={5} />
    <ellipse cx={540} cy={1720} rx={400} ry={92} fill="none" stroke="#c9a14a" strokeWidth={8} strokeDasharray="24 14" />
    {/* janela com a cidade */}
    <rect x={20} y={560} width={170} height={300} fill="#1a2440" stroke="#5a3a22" strokeWidth={12} />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={34 + (i % 4) * 38} y={700 + Math.floor(i / 4) * 70 - (i % 3) * 30} width={30} height={170} fill="#2a3456" />)}
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={40 + (i % 5) * 30} y={720 + Math.floor(i / 5) * 60} width={8} height={10} fill="#ffd166" opacity={0.4 + 0.5 * ((i * 7) % 3 === 0 ? 1 : 0)} />)}
    <path d="M105 560 v300 M20 710 h170" stroke="#5a3a22" strokeWidth={8} />
    {/* prateleira alta com potes, livros e um cuco */}
    <rect x={200} y={262} width={680} height={18} fill="#6b4224" stroke={L} strokeWidth={4} />
    {[[220, '#8a2a2a'], [248, '#2f5f9a'], [272, '#c9a14a'], [300, '#3a6a3a']].map(([x, c], i) => <rect key={i} x={x as number} y={182 + i * 6} width={24} height={80 - i * 6} fill={c as string} stroke={L} strokeWidth={3} />)}
    {[0, 1, 2].map((i) => <g key={i}><rect x={620 + i * 60} y={212} width={44} height={50} rx={8} fill="#9fc6c8" opacity={0.7} stroke={L} strokeWidth={3} /><rect x={620 + i * 60} y={204} width={44} height={12} fill="#6b4224" stroke={L} strokeWidth={3} />{Array.from({ length: 4 }, (_, j) => <circle key={j} cx={630 + i * 60 + (j % 2) * 20} cy={232 + Math.floor(j / 2) * 16} r={5} fill="#c9a14a" />)}</g>)}
    <g transform="translate(420 150)">
      <path d="M-50 40 L0 -10 L50 40 z" fill="#5a3a22" stroke={L} strokeWidth={4} />
      <rect x={-42} y={40} width={84} height={72} fill="#7a4f2c" stroke={L} strokeWidth={4} />
      <circle cx={0} cy={80} r={22} fill="#fffaf0" stroke={L} strokeWidth={3} />
      <path d={`M0 80 l${14 * Math.sin(t)} ${-14 * Math.cos(t)}`} stroke={L} strokeWidth={3} />
      <rect x={-10} y={18} width={20} height={20} fill="#1a1a1e" />
      {Math.sin(t * 1.3) > 0.85 && <g><path d="M0 28 h-30" stroke="#5a3a22" strokeWidth={4} /><circle cx={-36} cy={26} r={10} fill="#e8c240" stroke={L} strokeWidth={3} /><path d="M-46 26 l-8 3 l8 2" fill="#f28c28" /></g>}
      <path d={`M-14 112 v${60 + 8 * Math.sin(t)} M14 112 v${50 - 8 * Math.sin(t)}`} stroke="#c9a14a" strokeWidth={3} />
    </g>
    {/* painel de ferramentas */}
    <rect x={250} y={930} width={580} height={240} rx={8} fill="#a8804a" stroke={L} strokeWidth={5} />
    {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={270 + (i % 15) * 38} cy={950 + Math.floor(i / 15) * 56} r={4} fill="#6a4a2a" />)}
    <g stroke={L} strokeWidth={4} strokeLinejoin="round">
      <path d="M300 960 v130" stroke="#5a3a22" strokeWidth={14} /><rect x={276} y={950} width={48} height={26} rx={4} fill="#9aa0aa" />
      <path d="M380 960 v120" stroke="#9aa0aa" strokeWidth={12} /><circle cx={380} cy={958} r={18} fill="none" stroke="#9aa0aa" strokeWidth={10} />
      <path d="M460 1000 v100" stroke="#d1495b" strokeWidth={16} /><path d="M460 960 v40" stroke="#9aa0aa" strokeWidth={6} />
      <path d="M540 960 l-30 120 M540 960 l30 120" stroke="#3a3a3a" strokeWidth={10} />
      <circle cx={640} cy={1030} r={50} fill="none" stroke="#c9a14a" strokeWidth={8} /><path d="M640 980 v-20" stroke="#c9a14a" strokeWidth={6} />
      <path d="M740 960 v120 M720 980 h40" stroke="#2f5f9a" strokeWidth={10} />
    </g>
    {/* relógios na parede */}
    {[[110, 300, 0.9], [970, 340, 1.1], [120, 1020, 0.8], [960, 1060, 1.3]].map(([x, y, sp], i) => (
      <g key={i}>
        <rect x={x - 55} y={y - 70} width={110} height={250} rx={14} fill="#6b4224" stroke={L} strokeWidth={5} />
        <circle cx={x} cy={y} r={42} fill="#fffaf0" stroke={L} strokeWidth={4} />
        <path d={`M${x} ${y} l${26 * Math.sin(t * sp)} ${-26 * Math.cos(t * sp)} M${x} ${y} l0 -32`} stroke={L} strokeWidth={4} strokeLinecap="round" />
        <g transform={`rotate(${20 * Math.sin(t * Math.PI * sp)} ${x} ${y + 52})`}><path d={`M${x} ${y + 52} v90`} stroke="#c9a14a" strokeWidth={4} /><circle cx={x} cy={y + 146} r={14} fill="#c9a14a" stroke={L} strokeWidth={3} /></g>
      </g>
    ))}
    {quadro && (
      <g>
        <rect x={210} y={330} width={660} height={560} rx={10} fill="#c9a06a" stroke="#5a3a22" strokeWidth={16} />
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={230 + rnd(i) * 620} cy={350 + rnd(i + 2) * 520} r={3} fill="#a8804a" />)}
        {/* planta do banco */}
        <rect x={250} y={640} width={260} height={210} fill="#2f5f9a" stroke="#fff" strokeWidth={3} />
        <path d="M270 660 h220 v170 h-220 z M270 740 h120 v90 M390 660 v80 M430 760 a40 40 0 1 0 1 0" stroke="#d8e8ff" strokeWidth={3} fill="none" />
        {/* recortes e fios */}
        <rect x={560} y={660} width={150} height={100} fill="#fffaf0" stroke={L} strokeWidth={3} transform="rotate(4 635 710)" />
        <path d="M575 690 h110 M575 710 h90 M575 730 h100" stroke="#6a5a4a" strokeWidth={4} transform="rotate(4 635 710)" />
        <rect x={730} y={700} width={110} height={130} fill="#fff6c8" stroke={L} strokeWidth={3} transform="rotate(-6 785 765)" />
        <text x={785} y={780} textAnchor="middle" fontFamily="Arial Black" fontSize={44} fill="#d1495b" transform="rotate(-6 785 765)">12:00</text>
        {[[330, 440, 540, 440], [540, 440, 760, 450], [330, 440, 390, 700], [760, 450, 785, 720], [540, 440, 635, 700]].map(([a, b, c, d], i) => {
          const k = clamp(fios * 5 - i);
          return <path key={i} d={`M${a} ${b} L${a + (c - a) * k} ${b + (d - b) * k}`} stroke="#d1283b" strokeWidth={4} />;
        })}
      </g>
    )}
    {/* bancada */}
    <rect x={60} y={1290} width={960} height={44} rx={6} fill="#7a4f2c" stroke={L} strokeWidth={5} />
    <rect x={90} y={1334} width={40} height={150} fill="#5a3a22" stroke={L} strokeWidth={4} /><rect x={950} y={1334} width={40} height={150} fill="#5a3a22" stroke={L} strokeWidth={4} />
    {[[200, 1270, 34], [270, 1278, 22], [840, 1266, 40]].map(([x, y, r], i) => (
      <g key={i} transform={`rotate(${(i % 2 ? -1 : 1) * t * 30} ${x} ${y})`}>
        <circle cx={x} cy={y} r={r} fill="#c9a14a" stroke={L} strokeWidth={4} />
        {Array.from({ length: 8 }, (_, j) => <rect key={j} x={x - 6} y={y - r - 9} width={12} height={12} fill="#c9a14a" stroke={L} strokeWidth={3} transform={`rotate(${j * 45} ${x} ${y})`} />)}
        <circle cx={x} cy={y} r={r * 0.3} fill="#8a6a2a" />
      </g>
    ))}
    {/* bancada: torno, lupa e relógio de bolso aberto */}
    <g><rect x={620} y={1236} width={70} height={54} fill="#5a626e" stroke={L} strokeWidth={4} /><rect x={600} y={1226} width={110} height={16} fill="#7a828e" stroke={L} strokeWidth={4} /></g>
    <g><path d="M430 1290 v-70 l40 -40" stroke="#3a3a3a" strokeWidth={8} fill="none" /><circle cx={490} cy={1160} r={34} fill="#bfe6ff" opacity={0.6} stroke={L} strokeWidth={5} /></g>
    <g><circle cx={360} cy={1278} r={22} fill="#c9a14a" stroke={L} strokeWidth={4} /><circle cx={360} cy={1278} r={15} fill="#fffaf0" /><path d={`M360 1278 l${10 * Math.sin(t * 2)} ${-10 * Math.cos(t * 2)}`} stroke={L} strokeWidth={2} /></g>
    {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={720 + i * 22 + (i % 3) * 6} cy={1284 - (i % 2) * 4} r={4} fill="#9aa0aa" />)}
    {lampada && <g><path d="M540 0 v120" stroke={L} strokeWidth={4} /><path d="M490 120 h100 l-20 40 h-60 z" fill="#2f4f3a" stroke={L} strokeWidth={4} /><path d="M520 160 L180 1300 H900 L560 160 z" fill="#ffe6a0" opacity={0.08 + 0.02 * Math.sin(t * 8)} /><circle cx={540} cy={162} r={14} fill="#fff6c8" /><Poeira t={t} n={30} area={[260, 200, 560, 1100]} op={0.5} /></g>}
  </Svg>
);

// ---------- Banco Casa do Ouro (fachada) ----------
export const Viatura = ({ x, y, t, s = 1, flip = false }: { x: number; y: number; t: number; s?: number; flip?: boolean }) => {
  const pisca = Math.sin(t * 14 + x) > 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-170 -10 L-150 -70 L-80 -70 L-50 -120 L80 -120 L120 -70 L170 -60 L180 -10 z" fill="#f4f4f4" stroke={L} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-170 -40 H180" stroke="#1c3d6e" strokeWidth={16} />
      <path d="M-40 -112 L-60 -76 H20 V-112 z M30 -112 V-76 H105 L76 -112 z" fill="#9fc6e8" stroke={L} strokeWidth={3} />
      <rect x={-34} y={-140} width={34} height={18} rx={4} fill={pisca ? '#ff3b3b' : '#7a1a1a'} stroke={L} strokeWidth={3} />
      <rect x={0} y={-140} width={34} height={18} rx={4} fill={pisca ? '#24308a' : '#3b7bff'} stroke={L} strokeWidth={3} />
      <circle cx={pisca ? -17 : 17} cy={-131} r={70} fill={pisca ? '#ff3b3b' : '#3b7bff'} opacity={0.18} />
      {[-100, 110].map((w) => <g key={w}><circle cx={w} cy={-6} r={34} fill="#1a1a1e" stroke={L} strokeWidth={4} /><circle cx={w} cy={-6} r={14} fill="#9aa0aa" /></g>)}
      <text x={10} y={-48} textAnchor="middle" fontFamily="Arial Black" fontSize={22} fill="#fff">POLÍCIA</text>
    </g>
  );
};
export const Banco = ({ t, viaturas = 0, noite = false, tarde = 0, faixa = false }: { t: number; viaturas?: number; noite?: boolean; tarde?: number; faixa?: boolean }) => (
  <Svg>
    <CeuCidade t={t} noite={noite} tarde={tarde} />
    <Predios y={1250} cor={noite ? '#2a3550' : '#9ab0cc'} escuro={noite ? '#222a44' : '#7a92b2'} />
    <rect x={120} y={520} width={840} height={760} fill={noite ? '#8a8270' : '#efe6d2'} stroke={L} strokeWidth={6} />
    <path d="M90 530 L540 300 L990 530 z" fill={noite ? '#9a9280' : '#f6efde'} stroke={L} strokeWidth={6} strokeLinejoin="round" />
    {[150, 930].map((x, i) => <g key={x}><path d={`M${x} 520 V330`} stroke={L} strokeWidth={6} /><path d={`M${x} 335 q40 ${-10 + 10 * Math.sin(t * 4 + i)} 80 0 q-40 ${10 + 10 * Math.sin(t * 4 + i + 1)} -80 40 z`} fill={i ? '#2f5f9a' : '#3a8a3a'} stroke={L} strokeWidth={4} /><circle cx={x} cy={328} r={7} fill="#e8c240" /></g>)}
    <circle cx={540} cy={450} r={46} fill="#e8c240" stroke={L} strokeWidth={5} /><text x={540} y={468} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={50} fill="#7a5a10">$</text>
    <rect x={150} y={540} width={780} height={70} fill={noite ? '#6a6250' : '#e2d6bc'} stroke={L} strokeWidth={4} />
    <text x={540} y={592} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={52} letterSpacing={6} fill="#7a5a10">CASA DO OURO</text>
    {[190, 330, 470, 610, 750, 890].map((x) => <g key={x}><rect x={x - 30} y={630} width={60} height={560} fill={noite ? '#a29a86' : '#fbf6ea'} stroke={L} strokeWidth={4} />{[0, 1, 2].map((k) => <path key={k} d={`M${x - 14 + k * 14} 640 v540`} stroke="#c9bfa6" strokeWidth={3} />)}</g>)}
    <path d="M440 960 Q540 860 640 960 z" fill="#c9a14a" stroke={L} strokeWidth={5} />
    <rect x={460} y={960} width={160} height={230} rx={8} fill="#5a3a22" stroke={L} strokeWidth={5} />
    <path d="M540 960 v230" stroke={L} strokeWidth={4} />
    <circle cx={525} cy={1080} r={7} fill="#c9a14a" /><circle cx={555} cy={1080} r={7} fill="#c9a14a" />
    {[400, 680].map((x) => <g key={x}><path d={`M${x - 30} 1190 L${x - 22} 1130 H${x + 22} L${x + 30} 1190 z`} fill="#8a8270" stroke={L} strokeWidth={4} /><circle cx={x} cy={1100} r={38} fill="#3a7a3a" stroke={L} strokeWidth={4} /><circle cx={x} cy={1060} r={26} fill="#4a8a3a" stroke={L} strokeWidth={4} /></g>)}
    {[[250, 960], [830, 960]].map(([x, y]) => <g key={x}><rect x={x - 40} y={y} width={80} height={130} fill={noite ? '#ffd166' : '#bfe0f0'} opacity={noite ? 0.6 : 0.7} stroke={L} strokeWidth={4} /><path d={`M${x} ${y} v130 M${x - 40} ${y + 65} h80`} stroke={L} strokeWidth={3} /></g>)}
    {[0, 1, 2].map((k) => <rect key={k} x={90 - k * 30} y={1190 + k * 30} width={900 + k * 60} height={30} fill={noite ? '#7a7464' : '#ddd2bc'} stroke={L} strokeWidth={4} />)}
    {/* leões de pedra e lampiões */}
    {[[70, 1, 1150], [1010, -1, 1150]].map(([x, s, y]) => (
      <g key={x} transform={`translate(${x} ${y}) scale(${s} 1)`}>
        <rect x={-50} y={0} width={100} height={70} fill="#c9bfa6" stroke={L} strokeWidth={4} />
        <path d="M-40 0 Q-40 -60 0 -60 Q30 -60 40 -30 L40 0 z" fill="#d8ccb0" stroke={L} strokeWidth={4} />
        <circle cx={28} cy={-66} r={30} fill="#c9a77a" stroke={L} strokeWidth={4} /><circle cx={34} cy={-66} r={16} fill="#d8ccb0" stroke={L} strokeWidth={3} />
      </g>
    ))}
    {[40, 1040].map((x) => <g key={x}><rect x={x - 6} y={1000} width={12} height={290} fill="#2a2a30" /><rect x={x - 18} y={960} width={36} height={44} rx={6} fill={noite ? '#ffd166' : '#fff6c8'} stroke={L} strokeWidth={3} />{noite && <circle cx={x} cy={982} r={70} fill="#ffd166" opacity={0.2} />}</g>)}
    <rect x={0} y={1280} width={1080} height={640} fill={noite ? '#2e2e36' : '#5a5a66'} />
    <rect x={0} y={1280} width={1080} height={40} fill={noite ? '#4a4a52' : '#8a8a96'} stroke={L} strokeWidth={3} />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 120} 1280 v40`} stroke={L} strokeWidth={2} opacity={0.4} />)}
    <ellipse cx={180} cy={1860} rx={70} ry={20} fill="#3a3a42" stroke={L} strokeWidth={3} /><path d="M130 1860 h100 M150 1852 h60 M150 1868 h60" stroke="#2a2a30" strokeWidth={3} />
    <g><rect x={980} y={1210} width={50} height={70} rx={6} fill="#3a7a5a" stroke={L} strokeWidth={4} /><rect x={974} y={1200} width={62} height={14} rx={4} fill="#2a5a40" stroke={L} strokeWidth={3} /></g>
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 200 + 40} y={1590} width={110} height={16} fill="#e8e2c8" opacity={0.7} />)}
    {faixa && <g><path d="M0 1330 L1080 1300" stroke="#f2c94c" strokeWidth={26} /><path d="M0 1330 L1080 1300" stroke={L} strokeWidth={26} strokeDasharray="40 40" opacity={0.85} /></g>}
    {viaturas > 0 && [[160, 1500, false], [560, 1530, true], [930, 1490, false], [340, 1720, true], [780, 1740, false]].slice(0, Math.ceil(viaturas * 5)).map(([x, y, f], i) => <Viatura key={i} x={x as number} y={y as number} t={t + i} s={0.9} flip={f as boolean} />)}
    {viaturas > 0 && <rect width={1080} height={1920} fill={Math.sin(t * 14) > 0 ? '#ff3b3b' : '#3b7bff'} opacity={0.06} />}
  </Svg>
);

// ---------- Saguão do banco ----------
export const Saguao = ({ t, cameras = 1, alarme = 0, hora = '11:56' }: { t: number; cameras?: number; alarme?: number; hora?: string }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#e9e2d2" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={40 + i * 180} y={0} width={60} height={CHAO_A} fill="#ddd3bd" stroke="#c9bfa6" strokeWidth={3} />)}
    <rect x={0} y={CHAO_A} width={1080} height={440} fill="#d8cfbc" />
    {Array.from({ length: 24 }, (_, i) => <rect key={i} x={(i % 6) * 180} y={CHAO_A + Math.floor(i / 6) * 110} width={180} height={110} fill={(i + Math.floor(i / 6)) % 2 ? '#2a2a30' : '#efe8da'} opacity={0.85} />)}
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${50 + i * 180} ${200 + i * 80} q20 200 -6 400 q-14 200 10 500`} stroke="#c9bfa6" strokeWidth={3} fill="none" opacity={0.7} />)}
    {/* lustre */}
    <g transform={`rotate(${1.5 * Math.sin(t * 0.8)} 540 0)`}>
      <path d="M540 0 v40" stroke="#c9a14a" strokeWidth={6} />
      <path d="M400 70 Q540 150 680 70" stroke="#c9a14a" strokeWidth={8} fill="none" />
      {[400, 470, 540, 610, 680].map((x, i) => <g key={x}><path d={`M${x} ${70 + (i === 2 ? 40 : i % 2 ? 26 : 0)} v-26`} stroke="#c9a14a" strokeWidth={5} /><path d={`M${x} ${44 + (i === 2 ? 40 : i % 2 ? 26 : 0)} q-6 -14 0 -24 q6 10 0 24`} fill="#ffd166" /><circle cx={x} cy={34 + (i === 2 ? 40 : i % 2 ? 26 : 0)} r={24} fill="#fff6c8" opacity={0.3} /></g>)}
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${420 + i * 40} ${90 + Math.sin(i) * 10} l0 20 l-5 8 l5 8 l5 -8 l-5 -8`} stroke="#bfe6ff" strokeWidth={2} fill="#e8f6ff" />)}
    </g>
    {/* quadros na parede */}
    {[[200, 440, '#3a6a8a'], [880, 440, '#8a5a3a']].map(([x, y, c]) => <g key={x as number}><rect x={(x as number) - 70} y={y as number} width={140} height={180} fill={c as string} stroke="#c9a14a" strokeWidth={10} /><path d={`M${(x as number) - 60} ${(y as number) + 170} q60 -100 120 -40`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.5} /><circle cx={(x as number) + 30} cy={(y as number) + 50} r={16} fill="#ffd166" opacity={0.8} /></g>)}
    <rect x={380} y={200} width={320} height={110} rx={12} fill="#1a1a1e" stroke="#c9a14a" strokeWidth={8} />
    <text x={540} y={285} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={900} fontSize={84} fill="#ff4d4d">{hora}</text>
    <rect x={60} y={1060} width={960} height={420} fill="#8a5a32" stroke={L} strokeWidth={6} />
    <rect x={40} y={1030} width={1000} height={40} fill="#c9a14a" stroke={L} strokeWidth={5} />
    {[0, 1, 2].map((i) => <g key={i}><rect x={120 + i * 300} y={760} width={240} height={270} fill="#bfe0f0" opacity={0.45} stroke="#c9a14a" strokeWidth={6} /><path d={`M${150 + i * 300} 800 l60 -30 M${170 + i * 300} 860 l90 -50`} stroke="#fff" strokeWidth={6} opacity={0.5} /><rect x={210 + i * 300} y={990} width={60} height={40} rx={4} fill="#c9a14a" stroke={L} strokeWidth={3} /><text x={240 + i * 300} y={1018} textAnchor="middle" fontFamily="Arial Black" fontSize={22} fill={L}>{i + 1}</text><rect x={180 + i * 300} y={1110} width={120} height={50} rx={6} fill="#5a3a22" /></g>)}
    {[30, 1050].map((x) => <g key={x}><path d={`M${x - 26} 1060 L${x - 20} 1000 H${x + 20} L${x + 26} 1060 z`} fill="#c9a14a" stroke={L} strokeWidth={4} />{[-30, 0, 30].map((d, j) => <path key={j} d={`M${x} 1000 q${d} -60 ${d * 1.6} -110`} stroke="#3a7a3a" strokeWidth={14} fill="none" strokeLinecap="round" />)}</g>)}
    {/* fila com cordão */}
    {[180, 420, 660, 900].map((x) => <g key={x}><rect x={x - 8} y={1520} width={16} height={110} fill="#c9a14a" stroke={L} strokeWidth={3} /><circle cx={x} cy={1516} r={14} fill="#c9a14a" stroke={L} strokeWidth={3} /><ellipse cx={x} cy={1632} rx={30} ry={10} fill="#a8803a" /></g>)}
    {[180, 420, 660].map((x) => <path key={x} d={`M${x} 1530 Q${x + 120} 1590 ${x + 240} 1530`} stroke="#8a1a2a" strokeWidth={10} fill="none" />)}
    {[[90, 380, 1], [990, 380, -1]].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s} 1) rotate(${12 + 10 * Math.sin(t * 0.8 + i)})`}>
        <rect x={-10} y={-20} width={30} height={40} fill="#9aa0aa" stroke={L} strokeWidth={4} />
        <rect x={10} y={-26} width={90} height={52} rx={8} fill="#e8e8ee" stroke={L} strokeWidth={4} />
        <circle cx={100} cy={0} r={16} fill="#2a2a30" stroke={L} strokeWidth={4} />
        <circle cx={30} cy={-12} r={7} fill={cameras > 0.5 ? (Math.sin(t * 6) > 0 ? '#ff3b3b' : '#7a1a1a') : '#3a3a3a'} />
      </g>
    ))}
    {alarme > 0 && <g opacity={alarme}>
      <rect width={1080} height={1920} fill="#ff1a1a" opacity={0.12 + 0.12 * Math.max(0, Math.sin(t * 9))} />
      <g transform="translate(540 120)"><rect x={-40} y={-20} width={80} height={40} rx={10} fill="#ff3b3b" stroke={L} strokeWidth={4} /><path d={`M0 0 L${Math.cos(t * 8) * 900} ${Math.abs(Math.sin(t * 8)) * 300 + 200} L${Math.cos(t * 8 + 0.3) * 900} ${Math.abs(Math.sin(t * 8 + 0.3)) * 300 + 260} z`} fill="#ff6a6a" opacity={0.35} /></g>
    </g>}
  </Svg>
);

// ---------- Sala de câmeras ----------
export const SalaCameras = ({ t, apagadas = 0, hora = '11:56' }: { t: number; apagadas?: number; hora?: string }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#1e2430" />
    <rect x={0} y={CHAO_A} width={1080} height={440} fill="#2a2f3a" />
    <rect x={90} y={300} width={900} height={760} rx={16} fill="#2f3644" stroke={L} strokeWidth={6} />
    {Array.from({ length: 6 }, (_, i) => {
      const x = 130 + (i % 3) * 285, y = 340 + Math.floor(i / 3) * 350;
      const off = clamp(apagadas * 6 - i) > 0.5;
      return (
        <g key={i}>
          <rect x={x} y={y} width={255} height={310} rx={10} fill={off ? '#050608' : '#4a6a7a'} stroke="#111" strokeWidth={6} />
          {!off && <g opacity={0.8}>
            <rect x={x + 20} y={y + 200} width={215} height={90} fill="#6a8a9a" />
            <rect x={x + 30 + ((t * 20 + i * 40) % 160)} y={y + 120} width={30} height={80} rx={10} fill="#2a3a4a" />
            <circle cx={x + 45 + ((t * 20 + i * 40) % 160)} cy={y + 105} r={16} fill="#2a3a4a" />
            {Array.from({ length: 6 }, (_, j) => <path key={j} d={`M${x} ${y + ((t * 300 + j * 52) % 310)} h255`} stroke="#fff" strokeWidth={2} opacity={0.12} />)}
            <circle cx={x + 230} cy={y + 24} r={8} fill="#ff3b3b" opacity={Math.sin(t * 6) > 0 ? 1 : 0.3} />
          </g>}
          {off && <text x={x + 128} y={y + 170} textAnchor="middle" fontFamily="'Courier New'" fontWeight={900} fontSize={36} fill="#3a4050">SEM SINAL</text>}
        </g>
      );
    })}
    <rect x={380} y={1100} width={320} height={110} rx={12} fill="#0a0a0e" stroke="#4a5060" strokeWidth={6} />
    <text x={540} y={1185} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={900} fontSize={84} fill="#4dff88">{hora}</text>
    {/* post-its, rack piscando, cabos e café */}
    {[[120, 300, '#f2e86a'], [930, 300, '#f2a0c0'], [960, 1020, '#9fe6a0']].map(([x, y, c], i) => <g key={i} transform={`rotate(${i % 2 ? 6 : -6} ${x} ${y})`}><rect x={(x as number) - 32} y={(y as number) - 32} width={64} height={64} fill={c as string} stroke={L} strokeWidth={2} /><path d={`M${(x as number) - 22} ${(y as number) - 8} h44 M${(x as number) - 22} ${(y as number) + 8} h30`} stroke="#3a3a3a" strokeWidth={3} /></g>)}
    {[0, 1].map((s) => <g key={s}><rect x={s ? 1010 : 0} y={300} width={70} height={760} fill="#14181f" stroke={L} strokeWidth={4} />{Array.from({ length: 24 }, (_, i) => <circle key={i} cx={(s ? 1030 : 20) + (i % 2) * 24} cy={330 + Math.floor(i / 2) * 60} r={6} fill={Math.sin(t * (3 + (i % 5)) + i + s * 7) > 0.2 ? (i % 3 ? '#4dff88' : '#ffcf4d') : '#20302a'} />)}</g>)}
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${200 + i * 160} 1310 q${-20 + i * 10} 120 ${30 - i * 12} 240`} stroke={['#d1495b', '#2f5f9a', '#e8c240', '#3a8a3a', '#1a1a1e'][i]} strokeWidth={10} fill="none" />)}
    <rect x={60} y={1250} width={960} height={60} rx={8} fill="#3a404e" stroke={L} strokeWidth={5} />
    <g><rect x={880} y={1196} width={56} height={56} rx={8} fill="#fffaf0" stroke={L} strokeWidth={4} /><path d="M936 1210 q24 0 24 18 q0 18 -24 18" stroke={L} strokeWidth={5} fill="none" />{[0, 1].map((k) => { const kk = (t * 0.6 + k * 0.5) % 1; return <path key={k} d={`M${898 + k * 20} ${1190 - kk * 80} q-10 -15 0 -30`} stroke="#e8e8ee" strokeWidth={4} fill="none" opacity={0.6 * (1 - kk)} />; })}</g>
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={110 + i * 64} y={1262} width={44} height={22} rx={4} fill={i % 3 ? '#5a6070' : '#d1495b'} />)}
  </Svg>
);

// ---------- Cofre ----------
// aberta 0..1 (a porta gira para o lado), broca 0..1 (girando e soltando faíscas).
export const Cofre = ({ t, aberta = 0, broca = 0, luz = 0, alarme = 0 }: { t: number; aberta?: number; broca?: number; luz?: number; alarme?: number }) => {
  const cx = 540, cy = 860, R = 360;
  return (
    <Svg>
      <rect width={1080} height={1920} fill="#5a626e" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M0 ${i * 170} H1080`} stroke="#4a515c" strokeWidth={6} />)}
      {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={(i % 10) * 108 + 54} cy={Math.floor(i / 10) * 170 + 30} r={7} fill="#7a828e" stroke="#3a404a" strokeWidth={2} />)}
      {/* canos no teto e lâmpadas de emergência */}
      <rect x={0} y={60} width={1080} height={36} fill="#8a6a4a" stroke={L} strokeWidth={4} />
      <rect x={0} y={110} width={1080} height={24} fill="#6a727e" stroke={L} strokeWidth={4} />
      {[80, 520, 980].map((x) => <rect key={x} x={x} y={52} width={30} height={90} rx={4} fill="#5a626e" stroke={L} strokeWidth={3} />)}
      {[70, 1010].map((x, i) => <g key={x}><rect x={x - 26} y={160} width={52} height={40} rx={10} fill={alarme > 0 ? '#ff3b3b' : '#e8c240'} stroke={L} strokeWidth={4} /><path d={`M${x} 180 L${x + Math.cos(t * 6 + i * 3) * 300} ${180 + Math.abs(Math.sin(t * 6 + i * 3)) * 200} L${x + Math.cos(t * 6 + i * 3 + 0.3) * 300} ${180 + Math.abs(Math.sin(t * 6 + i * 3 + 0.3)) * 200} z`} fill={alarme > 0 ? '#ff6a6a' : '#ffe08a'} opacity={0.25} /></g>)}
      {/* paredes de gavetas de cofre nas laterais */}
      {[0, 1].map((s) => Array.from({ length: 24 }, (_, i) => { const x = (s ? 960 : 10) + (i % 2) * 56, y = 300 + Math.floor(i / 2) * 92; return <g key={`${s}${i}`}><rect x={x} y={y} width={52} height={86} rx={4} fill="#8a929e" stroke="#3a404a" strokeWidth={3} /><circle cx={x + 26} cy={y + 43} r={6} fill="#3a404a" /><rect x={x + 14} y={y + 8} width={24} height={10} fill="#c9a14a" /></g>; }))}
      <rect x={0} y={CHAO_A} width={1080} height={440} fill="#3a3f48" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 80} ${CHAO_A} l40 0 l-30 40 l-40 0 z`} fill="#e8c240" />)}
      <rect x={0} y={CHAO_A + 40} width={1080} height={6} fill={L} />
      {/* abertura e interior com luz dourada */}
      <circle cx={cx} cy={cy} r={R + 30} fill="#2a2e36" stroke={L} strokeWidth={8} />
      <circle cx={cx} cy={cy} r={R} fill={luz > 0 ? '#ffe6a0' : '#1a1c22'} />
      {luz > 0 && <circle cx={cx} cy={cy} r={R * (1 + luz * 0.6)} fill="#fff3c8" opacity={0.35 * luz} />}
      {/* porta: gira em torno da dobradiça (lado direito) */}
      <g transform={`translate(${cx + R} ${cy}) scale(${1 - 0.86 * aberta} 1) translate(${-cx - R} ${-cy})`}>
        <circle cx={cx} cy={cy} r={R} fill="#9aa2ae" stroke={L} strokeWidth={8} />
        <circle cx={cx} cy={cy} r={R * 0.86} fill="#aab2be" stroke="#6a727e" strokeWidth={6} />
        {Array.from({ length: 12 }, (_, i) => { const a = (i * 30 * Math.PI) / 180; return <circle key={i} cx={cx + Math.cos(a) * R * 0.93} cy={cy + Math.sin(a) * R * 0.93} r={14} fill="#c8ced8" stroke={L} strokeWidth={3} />; })}
        <g transform={`rotate(${aberta * 220 + broca * 0} ${cx} ${cy})`}>
          {[0, 60, 120].map((a) => <rect key={a} x={cx - 160} y={cy - 12} width={320} height={24} rx={12} fill="#7a828e" stroke={L} strokeWidth={4} transform={`rotate(${a} ${cx} ${cy})`} />)}
          <circle cx={cx} cy={cy} r={58} fill="#c9a14a" stroke={L} strokeWidth={6} />
        </g>
        <circle cx={cx - 200} cy={cy - 160} r={40} fill="#3a404a" stroke={L} strokeWidth={4} />
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${cx - 200} ${cy - 160} l${Math.cos(i * 0.63) * 34} ${Math.sin(i * 0.63) * 34}`} stroke="#c8ced8" strokeWidth={3} />)}
      </g>
      {/* dobradiças */}
      {[-180, 180].map((d) => <rect key={d} x={cx + R - 20} y={cy + d - 40} width={60} height={80} rx={10} fill="#6a727e" stroke={L} strokeWidth={5} />)}
      {/* broca no tripé */}
      {broca > 0 && aberta < 0.1 && (
        <g>
          <path d="M150 1480 L300 1000 L450 1480 M300 1000 v480" stroke="#3a3a3a" strokeWidth={14} fill="none" />
          <rect x={200} y={930} width={260} height={120} rx={20} fill="#f2a93b" stroke={L} strokeWidth={6} />
          <rect x={460} y={965} width={60} height={50} fill="#9aa0aa" stroke={L} strokeWidth={4} />
          <g transform={`translate(520 990)`}>
            <rect x={0} y={-12} width={110} height={24} fill="#c8ced8" stroke={L} strokeWidth={4} />
            {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${10 + i * 20 + ((t * 300) % 20)} -12 l10 24`} stroke={L} strokeWidth={4} />)}
          </g>
          {Array.from({ length: 18 }, (_, i) => {
            const k = (t * 3 + rnd(i)) % 1, a = -Math.PI / 2 + (rnd(i + 4) - 0.5) * 2.6;
            return <path key={i} d={`M${640 + Math.cos(a) * k * 220} ${990 + Math.sin(a) * k * 220 + k * k * 160} l${Math.cos(a) * 18} ${Math.sin(a) * 18}`} stroke={i % 2 ? '#ffd166' : '#fff3c8'} strokeWidth={6} strokeLinecap="round" opacity={broca * (1 - k)} />;
          })}
          <circle cx={640} cy={990} r={50 + 10 * Math.sin(t * 40)} fill="#fff3c8" opacity={0.5 * broca} />
        </g>
      )}
      {alarme > 0 && <rect width={1080} height={1920} fill="#ff1a1a" opacity={alarme * (0.1 + 0.14 * Math.max(0, Math.sin(t * 9)))} />}
    </Svg>
  );
};
// Barra de ouro.
export const Ouro = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-60 0 L-44 -34 H44 L60 0 z" fill="#e8c240" stroke={L} strokeWidth={4} strokeLinejoin="round" /><path d="M-40 -28 H30" stroke="#fff6c8" strokeWidth={4} /></g>
);
// Interior do cofre: prateleiras vazias, poeira, pedestal com o livro vermelho brilhando.
export const CofreDentro = ({ t, livro = 1, brilho = 0 }: { t: number; livro?: number; brilho?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#3a3f48" />
    {Array.from({ length: 4 }, (_, i) => (
      <g key={i}>
        <rect x={60} y={300 + i * 260} width={960} height={26} fill="#7a828e" stroke={L} strokeWidth={4} />
        {Array.from({ length: 6 }, (_, j) => <rect key={j} x={110 + j * 155} y={268 + i * 260} width={120} height={32} fill="none" stroke="#5a626e" strokeWidth={3} strokeDasharray="10 8" />)}
      </g>
    ))}
    {[60, 1000].map((x) => <rect key={x} x={x} y={260} width={20} height={1220} fill="#6a727e" stroke={L} strokeWidth={4} />)}
    {/* cintas de dinheiro vazias e gavetas abertas */}
    {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`rotate(${(rnd(i) - 0.5) * 40} ${150 + i * 120} ${292 + (i % 4) * 260})`}><rect x={130 + i * 120} y={284 + (i % 4) * 260} width={46} height={12} rx={3} fill="#e8d6b0" stroke={L} strokeWidth={2} /></g>)}
    {[[220, 820], [760, 560], [880, 1080]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width={90} height={60} fill="#5a626e" stroke={L} strokeWidth={4} /><path d={`M${x} ${y} l-24 -20 h90 l24 20`} fill="#7a828e" stroke={L} strokeWidth={4} /></g>)}
    {[[300, 1400], [760, 1420]].map(([x, y], i) => <rect key={i} x={x} y={y} width={90} height={22} fill="none" stroke="#c9a14a" strokeWidth={3} strokeDasharray="8 6" opacity={0.6} />)}
    <rect x={0} y={CHAO_A} width={1080} height={440} fill="#2a2e36" />
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(rnd(i) * 1080 + t * 8) % 1080} cy={(rnd(i + 5) * 1400 - t * 12 + 1400) % 1400} r={2 + rnd(i + 2) * 3} fill="#e8d6b0" opacity={0.35} />)}
    {/* pedestal com livro */}
    <rect x={430} y={1240} width={220} height={240} fill="#5a626e" stroke={L} strokeWidth={5} />
    <rect x={410} y={1220} width={260} height={30} fill="#7a828e" stroke={L} strokeWidth={5} />
    {livro > 0 && <g opacity={livro}>
      <circle cx={540} cy={1180} r={150 + 20 * Math.sin(t * 3)} fill="#ff6a6a" opacity={0.12 + 0.25 * brilho} />
      <path d="M455 1220 L470 1150 H620 L625 1220 z" fill="#b8232f" stroke={L} strokeWidth={5} strokeLinejoin="round" />
      <path d="M470 1150 L475 1135 H615 L620 1150" fill="#fffaf0" stroke={L} strokeWidth={3} />
      <path d="M520 1175 h50 M515 1195 h60" stroke="#e8c240" strokeWidth={4} />
    </g>}
    <path d="M300 0 L120 1480 H960 L780 0 z" fill="#fff3c8" opacity={0.05} />
  </Svg>
);

// ---------- Jornal ----------
export const JornalQ = ({ t, manchete, sub, foto }: { t: number; manchete: string; sub: string; foto?: ReactNode }) => (
  <>
    <Svg><rect width={1080} height={1920} fill="#2a2a30" /></Svg>
    <div style={{ position: 'absolute', left: 90, top: 330, width: 900, height: 1180, background: '#f4efe2', border: '6px solid #1a1520', transform: `rotate(${-3 + Math.sin(t * 0.6)}deg)`, padding: 36, boxSizing: 'border-box', fontFamily: 'Georgia, serif', color: '#1a1520' }}>
      <div style={{ fontSize: 76, fontWeight: 900, textAlign: 'center', borderBottom: '6px double #1a1520', paddingBottom: 10 }}>DIÁRIO DA CIDADE</div>
      <div style={{ fontSize: 30, textAlign: 'center', margin: '8px 0 20px' }}>Edição extra · 14h</div>
      <div style={{ fontSize: 70, fontWeight: 900, lineHeight: 1.05, textAlign: 'center' }}>{manchete}</div>
      <div style={{ position: 'relative', margin: '26px auto', width: 560, height: 420, background: '#cfc8b8', border: '4px solid #1a1520', overflow: 'hidden' }}>{foto}</div>
      <div style={{ fontSize: 34, textAlign: 'center', fontStyle: 'italic' }}>{sub}</div>
      {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ height: 14, background: '#bdb6a6', margin: '14px 0', width: `${90 - i * 7}%` }} />)}
    </div>
  </>
);

// ---------- Esgoto ----------
export const Esgoto = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#1c2420" />
    <path d="M-40 1600 V700 Q540 120 1120 700 V1600 z" fill="#3a463e" stroke={L} strokeWidth={8} />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M-40 ${760 + i * 100} H1120`} stroke="#2e3832" strokeWidth={5} opacity={0.7} />)}
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${100 + i * 180} 600 v1000`} stroke="#2e3832" strokeWidth={4} opacity={0.5} />)}
    <path d="M-40 1600 V700 Q540 380 1120 700 V1600" fill="none" stroke="#56645a" strokeWidth={14} opacity={0.5} />
    {/* grade no teto com feixes de luz, escada, pichações e ratos */}
    <g><rect x={440} y={330} width={200} height={40} fill="#2a2e2a" stroke={L} strokeWidth={4} />{Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${455 + i * 28} 330 v40`} stroke="#4a564e" strokeWidth={6} />)}
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${455 + i * 32} 370 L${380 + i * 70} 1480 L${410 + i * 70} 1480 L${470 + i * 32} 370 z`} fill="#fff3c8" opacity={0.06 + 0.02 * Math.sin(t * 2 + i)} />)}</g>
    <g>{[180, 240].map((x) => <path key={x} d={`M${x} 520 V1480`} stroke="#8a6a4a" strokeWidth={10} />)}{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M180 ${560 + i * 76} h60`} stroke="#8a6a4a" strokeWidth={8} />)}</g>
    <text x={820} y={1220} textAnchor="middle" fontFamily="'Arial Black'" fontSize={70} fill="#c84a8a" opacity={0.55} transform="rotate(-8 820 1220)">4 MIN</text>
    <path d="M700 1330 q40 -60 80 0 t80 0" stroke="#4ac0d0" strokeWidth={10} fill="none" opacity={0.5} />
    {[0, 1].map((i) => { const x = ((t * 160 + i * 600) % 1400) - 160; return <g key={i} transform={`translate(${x} ${1470 - i * 4})`}><ellipse rx={30} ry={14} fill="#5a5048" stroke={L} strokeWidth={3} /><circle cx={30} cy={-4} r={11} fill="#5a5048" stroke={L} strokeWidth={3} /><circle cx={34} cy={-8} r={2} fill="#fff" /><path d={`M-30 0 q-30 ${10 * Math.sin(t * 12)} -50 -6`} stroke="#8a6a6a" strokeWidth={3} fill="none" /></g>; })}
    {/* canos */}
    <rect x={-20} y={820} width={260} height={60} rx={30} fill="#6a6a5a" stroke={L} strokeWidth={5} />
    <rect x={860} y={760} width={240} height={50} rx={25} fill="#6a6a5a" stroke={L} strokeWidth={5} />
    {[240, 860].map((x, i) => { const k = (t * 1.2 + i * 0.5) % 1; return <ellipse key={x} cx={x + (i ? 0 : 0)} cy={i ? 810 + k * 700 : 880 + k * 640} rx={6} ry={12} fill="#7ab07a" opacity={0.8 * (1 - k)} />; })}
    {/* canal de água */}
    <rect x={-40} y={1600} width={1160} height={320} fill="#2c4a3a" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${((i * 140 + t * 120) % 1300) - 120} ${1650 + (i % 3) * 80} q30 -12 60 0 q30 12 60 0`} stroke="#6aa08a" strokeWidth={5} fill="none" opacity={0.6} />)}
    <rect x={-40} y={1480} width={1160} height={120} fill="#4a564e" stroke={L} strokeWidth={5} />
    {/* luz no fim do túnel */}
    <ellipse cx={540} cy={1000} rx={160} ry={200} fill="#fff3c8" opacity={0.18 + 0.05 * Math.sin(t * 2)} />
  </Svg>
);
