// Cenários de "Depois do Silêncio": hospital abandonado, corredor, porta pichada do refeitório, cidade parada,
// casa vazia, rua à noite (casa com janelas de tábuas), delegacia, estrada, a capital e o ônibus cercado.
import { L, Svg } from './cenarios';
import { Poeira } from './cenarios-ilha';

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const clamp = (x: number) => Math.min(1, Math.max(0, x));
export const CHAO_S = 1480;

// ---------- Peças reutilizáveis ----------
const Piso = ({ cor = '#9aa4a0', linha = '#7a8480', y = CHAO_S }: { cor?: string; linha?: string; y?: number }) => (
  <>
    <rect x={0} y={y} width={1080} height={1920 - y} fill={cor} />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M0 ${y + 20 + i * 64} H1080`} stroke={linha} strokeWidth={3} />)}
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 100 - 40} ${y} L${i * 120 - 160} 1920`} stroke={linha} strokeWidth={3} />)}
    <rect x={0} y={y - 16} width={1080} height={16} fill={linha} />
  </>
);
const Papeis = ({ y0, y1, n = 14, seed = 0, t = 0 }: { y0: number; y1: number; n?: number; seed?: number; t?: number }) => (
  <>{Array.from({ length: n }, (_, i) => { const x = rnd(i + seed) * 1080, y = y0 + rnd(i + seed + 40) * (y1 - y0), a = rnd(i + seed + 9) * 80 - 40 + 3 * Math.sin(t + i); return <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}><rect x={-34} y={-24} width={68} height={48} fill="#f4f0e4" stroke={L} strokeWidth={2} />{[0, 1, 2].map((k) => <path key={k} d={`M-24 ${-12 + k * 12} h${30 + rnd(i + k) * 18}`} stroke="#8a8a92" strokeWidth={3} />)}</g>; })}</>
);
export const Corvo = ({ x, y, t, s = 1, voa = false }: { x: number; y: number; t: number; s?: number; voa?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {voa ? <path d={`M-40 ${-10 * Math.sin(t * 12)} Q-20 -10 0 0 Q20 -10 40 ${-10 * Math.sin(t * 12)}`} stroke="#14141a" strokeWidth={8} fill="none" /> : <><ellipse rx={22} ry={14} fill="#14141a" /><circle cx={18} cy={-12} r={9} fill="#14141a" /><path d="M26 -12 l10 3 l-10 3 z" fill="#3a3a3a" /><path d="M-6 12 v14 M6 12 v14" stroke="#14141a" strokeWidth={3} /></>}
  </g>
);
// Carro abandonado (porta aberta opcional).
export const Carro = ({ x, y, s = 1, cor = '#c22a2a', porta = false, flip = false }: { x: number; y: number; s?: number; cor?: string; porta?: boolean; flip?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={6} rx={200} ry={18} fill="#000" opacity={0.25} />
    <path d="M-190 -20 V-80 Q-190 -100 -160 -104 L-110 -110 L-60 -170 Q-50 -180 -30 -180 H70 Q90 -180 104 -168 L150 -112 L180 -104 Q196 -96 196 -76 V-20 z" fill={cor} stroke={L} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-50 -166 H40 V-114 H-96 z M54 -166 H76 Q86 -166 94 -158 L132 -114 H54 z" fill="#9ab4c8" stroke={L} strokeWidth={4} />
    <path d="M-60 -160 l40 40 M60 -150 l20 30" stroke="#fff" strokeWidth={4} opacity={0.5} />
    {porta && <path d="M-96 -114 L-140 -150 L-150 -40 L-96 -24 z" fill={cor} stroke={L} strokeWidth={5} />}
    <rect x={180} y={-90} width={18} height={20} rx={4} fill="#ffe8a0" stroke={L} strokeWidth={3} />
    {[-120, 120].map((w) => <g key={w}><circle cx={w} cy={-20} r={40} fill="#2a2a30" stroke={L} strokeWidth={5} /><circle cx={w} cy={-20} r={16} fill="#9aa0aa" /></g>)}
    <path d="M-160 -60 q30 10 60 0" stroke="#000" strokeWidth={3} opacity={0.2} fill="none" />
  </g>
);
// Ônibus urbano visto de lado.
export const Onibus = ({ x, y, s = 1, rot = 0, cor = '#e8a02a', janelas = '#5a6a7a', placa = '' }: { x: number; y: number; s?: number; rot?: number; cor?: string; janelas?: string; placa?: string }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={420} ry={22} fill="#000" opacity={0.25} />
    <rect x={-400} y={-320} width={800} height={300} rx={30} fill={cor} stroke={L} strokeWidth={7} />
    <rect x={-400} y={-120} width={800} height={30} fill="#fff" opacity={0.6} />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-370 + i * 122} y={-290} width={108} height={130} rx={10} fill={janelas} stroke={L} strokeWidth={5} />)}
    <rect x={300} y={-290} width={80} height={250} rx={8} fill="#3a4a5a" stroke={L} strokeWidth={5} />
    <rect x={-380} y={-340} width={300} height={34} rx={6} fill="#1a1a1e" /><text x={-230} y={-314} textAnchor="middle" fontFamily="Arial Black" fontSize={26} fill="#ffb020">{placa || 'FORA DE SERVIÇO'}</text>
    {[-270, 250].map((w) => <g key={w}><circle cx={w} cy={-20} r={54} fill="#2a2a30" stroke={L} strokeWidth={6} /><circle cx={w} cy={-20} r={22} fill="#9aa0aa" /></g>)}
  </g>
);
// Semáforo piscando amarelo.
const Semaforo = ({ x, y, t, s = 1 }: { x: number; y: number; t: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-8} y={-420} width={16} height={420} fill="#3a3a40" />
    <rect x={-34} y={-540} width={68} height={160} rx={12} fill="#1a1a1e" stroke={L} strokeWidth={4} />
    <circle cy={-512} r={18} fill="#4a1a1a" /><circle cy={-460} r={18} fill={Math.sin(t * 5) > 0 ? '#ffc020' : '#4a3a1a'} /><circle cy={-408} r={18} fill="#1a3a1a" />
    {Math.sin(t * 5) > 0 && <circle cy={-460} r={50} fill="#ffc020" opacity={0.2} />}
  </g>
);
// Prédio com janelas (quebradas algumas).
const Predio = ({ x, w, h, base, cor, seed, noite = false }: { x: number; w: number; h: number; base: number; cor: string; seed: number; noite?: boolean }) => (
  <g>
    <rect x={x} y={base - h} width={w} height={h} fill={cor} stroke={L} strokeWidth={4} />
    <rect x={x - 8} y={base - h - 16} width={w + 16} height={18} fill="#3a3a40" />
    {Array.from({ length: Math.floor(h / 70) }, (_, r) => Array.from({ length: Math.floor((w - 20) / 50) }, (_, c) => { const q = rnd(seed + r * 13 + c) > 0.75; return <g key={`${r}-${c}`}><rect x={x + 16 + c * 50} y={base - h + 20 + r * 70} width={32} height={44} fill={noite ? '#0e1420' : '#2a3a4a'} stroke={L} strokeWidth={2} />{q && <path d={`M${x + 16 + c * 50} ${base - h + 20 + r * 70} l14 20 l-6 8 l18 16`} stroke="#c8d4e4" strokeWidth={2} fill="none" />}</g>; }))}
  </g>
);

// ---------- Hospital: quarto ----------
export const QuartoHospital = ({ t, acorda = 1 }: { t: number; acorda?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#b8c8b8" />
    {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M0 ${200 + i * 80} H1080`} stroke="#a8b8a8" strokeWidth={3} />)}
    <rect x={0} y={1060} width={1080} height={420} fill="#9ab09a" /><path d="M0 1060 H1080" stroke="#7a907a" strokeWidth={10} />
    {/* janela com persiana: listras de luz */}
    <rect x={640} y={340} width={340} height={460} fill="#f4e8c8" stroke="#6a7a6a" strokeWidth={12} />
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={646} y={350 + i * 32} width={328} height={18} fill="#8a9a8a" />)}
    <path d="M640 800 L380 1480 H760 L980 800 z" fill="#fff6d8" opacity={0.12 * acorda} />
    {/* trilho da cortina */}
    <path d="M60 220 H600" stroke="#6a6a72" strokeWidth={8} /><path d="M70 230 q20 300 0 640 h120 q-30 -320 -10 -640 z" fill="#8ab0c8" stroke={L} strokeWidth={4} opacity={0.9} />
    {/* relógio parado */}
    <g transform="translate(400 380)"><circle r={86} fill="#fffaf0" stroke={L} strokeWidth={8} />{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${Math.cos((i * Math.PI) / 6) * 66} ${Math.sin((i * Math.PI) / 6) * 66} L${Math.cos((i * Math.PI) / 6) * 76} ${Math.sin((i * Math.PI) / 6) * 76}`} stroke={L} strokeWidth={5} />)}<path d="M0 0 L-30 -40" stroke={L} strokeWidth={9} strokeLinecap="round" /><path d="M0 0 L46 30" stroke={L} strokeWidth={6} strokeLinecap="round" /><circle r={7} fill="#c22a2a" /></g>
    {/* suporte de soro */}
    <g transform="translate(150 1480)"><path d="M0 0 V-760 M-40 -760 h80" stroke="#8a8a92" strokeWidth={10} /><path d="M-60 0 h120" stroke="#5a5a62" strokeWidth={12} /><path d="M-20 -740 h40 v100 q0 30 -20 30 q-20 0 -20 -30 z" fill="#d8ecf4" stroke={L} strokeWidth={4} opacity={0.85} /><path d="M0 -610 q30 200 120 300" stroke="#c8d8e0" strokeWidth={4} fill="none" /></g>
    {/* monitor apagado */}
    <g transform="translate(860 900)"><rect x={-110} y={-90} width={220} height={150} rx={14} fill="#2a2e34" stroke={L} strokeWidth={6} /><rect x={-92} y={-72} width={184} height={110} fill="#0e1a14" /><path d="M-80 -10 H80" stroke="#1e3a2a" strokeWidth={4} /><rect x={-10} y={60} width={20} height={100} fill="#5a5a62" /></g>
    {/* cama hospitalar */}
    <g transform="translate(540 1420)">
      <rect x={-380} y={-170} width={760} height={90} rx={20} fill="#eef2f4" stroke={L} strokeWidth={6} />
      <path d="M-380 -170 q0 -60 60 -70 h120 q20 0 20 20 v50" fill="#fffaf0" stroke={L} strokeWidth={5} />
      <rect x={-140} y={-200} width={500} height={50} rx={18} fill="#8ab0c8" stroke={L} strokeWidth={5} />
      <path d="M-400 -260 V60 M400 -200 V60" stroke="#8a8a92" strokeWidth={14} strokeLinecap="round" />
      <path d="M-300 -110 H300 M-300 -60 H300" stroke="#a8a8b0" strokeWidth={8} />
      {[-300, 300].map((w) => <circle key={w} cx={w} cy={50} r={18} fill="#3a3a40" />)}
    </g>
    {/* mesinha com vaso de flores secas */}
    <g transform="translate(960 1480)"><rect x={-70} y={-200} width={140} height={200} fill="#c8b89a" stroke={L} strokeWidth={5} /><rect x={-60} y={-130} width={120} height={8} fill="#8a7a5a" /><path d="M-26 -200 l-8 -70 h68 l-8 70 z" fill="#9ac0d8" stroke={L} strokeWidth={4} opacity={0.85} />{[-30, -10, 10, 30].map((dx, i) => <g key={dx}><path d={`M${dx / 2} -270 q${dx} -60 ${dx * 1.4} -${90 + i * 10}`} stroke="#6a5a3a" strokeWidth={4} fill="none" /><path d={`M${dx * 1.4 - 12} -${360 + i * 10} q12 -6 24 8 q-12 10 -24 -8 z`} fill="#8a6a4a" stroke={L} strokeWidth={2} transform={`rotate(${50 + i * 15} ${dx * 1.4} -${355 + i * 10})`} /></g>)}<path d="M20 -2 q14 -6 22 4 M-50 -4 q8 -8 18 0" stroke="#8a6a4a" strokeWidth={4} fill="none" /></g>
    <Piso cor="#c8ccc4" linha="#a8aca4" />
    <Poeira t={t} n={36} op={0.5} area={[380, 600, 600, 900]} />
  </Svg>
);

// ---------- Hospital: corredor em perspectiva ----------
export const Corredor = ({ t, pisca = 1 }: { t: number; pisca?: number }) => {
  const on = Math.sin(t * 23) * Math.sin(t * 7) > -0.2 ? 1 : 0.15;
  const vx = 540, vy = 860;
  return (
    <Svg>
      <rect width={1080} height={1920} fill="#7a8a80" />
      <path d={`M0 0 L${vx - 120} ${vy - 160} H${vx + 120} L1080 0 z`} fill="#c8d0c8" />
      <path d={`M0 1920 L${vx - 120} ${vy + 120} H${vx + 120} L1080 1920 z`} fill="#a8b0a8" />
      {Array.from({ length: 9 }, (_, i) => { const k = i / 9; return <path key={i} d={`M${vx - 120 - (540 - 120) * (1 - k) ** 2 * 0 - 120 * 0} 0`} />; })}
      {Array.from({ length: 10 }, (_, i) => { const k = (i + 1) / 11; const y = vy + 120 + (1920 - vy - 120) * k * k; return <path key={i} d={`M${vx - 120 - (vx - 120) * k * k} ${y} H${vx + 120 + (1080 - vx - 120) * k * k}`} stroke="#8a928a" strokeWidth={3} />; })}
      <path d={`M0 0 L${vx - 120} ${vy - 160} V${vy + 120} L0 1920 z`} fill="#9aa89e" />
      <path d={`M1080 0 L${vx + 120} ${vy - 160} V${vy + 120} L1080 1920 z`} fill="#94a298" />
      <rect x={vx - 120} y={vy - 160} width={240} height={280} fill="#1a2420" />
      <rect x={vx - 40} y={vy - 120} width={80} height={36} fill="#2a8a4a" /><text x={vx} y={vy - 94} textAnchor="middle" fontFamily="Arial Black" fontSize={20} fill="#fff">SAÍDA</text>
      {/* portas laterais */}
      {[0.25, 0.55, 0.8].map((k, i) => { const xa = (vx - 120) * k, ya = (vy - 160) * k, yb = 1920 - (1920 - vy - 120) * k; const w = 120 * (1 - k * 0.7); return <g key={i}><path d={`M${xa + 20} ${ya + 180} L${xa + 20 + w} ${ya + 180 + w * 0.6} V${yb - 120 - w * 0.4} L${xa + 20} ${yb - 120} z`} fill="#6a7a8a" stroke={L} strokeWidth={4} /><path d={`M${1080 - xa - 20} ${ya + 180} L${1080 - xa - 20 - w} ${ya + 180 + w * 0.6} V${yb - 120 - w * 0.4} L${1080 - xa - 20} ${yb - 120} z`} fill={i === 1 ? '#1a1a1e' : '#6a7a8a'} stroke={L} strokeWidth={4} /></g>; })}
      <text x={170} y={560} fontFamily="Arial Black" fontSize={40} fill="#3a4a5a" transform="rotate(30 170 560)">UTI</text>
      {/* lâmpadas do teto */}
      {[0.15, 0.4, 0.65].map((k, i) => { const y = (vy - 160) * k + 40, w = 260 * (1 - k * 0.8); const ok = i === 1 ? on * pisca + (1 - pisca) : 1; return <g key={i}><rect x={vx - w / 2} y={y} width={w} height={22 * (1 - k * 0.6)} rx={6} fill={ok > 0.5 ? '#f4f8e8' : '#4a4a40'} />{ok > 0.5 && <path d={`M${vx - w / 2} ${y + 20} L${vx - w * 1.4} ${y + 700 * (1 - k)} H${vx + w * 1.4} L${vx + w / 2} ${y + 20} z`} fill="#f4f8e8" opacity={0.08} />}</g>; })}
      {pisca > 0 && on < 0.5 && <rect width={1080} height={1920} fill="#000" opacity={0.25} />}
      {/* cadeira de rodas tombada e maca */}
      <g transform="translate(250 1500) rotate(-70)"><circle r={90} fill="none" stroke="#3a3a40" strokeWidth={12} /><path d="M0 0 h120 v-120 M60 0 v-60 h80" stroke="#6a6a72" strokeWidth={10} fill="none" /></g>
      <g transform="translate(820 1380)"><rect x={-150} y={-30} width={300} height={40} rx={10} fill="#e8ecee" stroke={L} strokeWidth={5} /><path d="M-130 10 v80 M130 10 v80" stroke="#8a8a92" strokeWidth={8} /><path d="M-150 -40 q80 -30 160 10" fill="#d8e8f0" stroke={L} strokeWidth={4} /></g>
      <Papeis y0={1250} y1={1880} n={18} t={t} />
      <Poeira t={t} n={30} op={0.4} area={[200, 400, 680, 1200]} />
    </Svg>
  );
};

// ---------- Porta do refeitório (pichada, com correntes) ----------
export const PortaRefeitorio = ({ t, dedos = 0, bate = 0, texto = 1 }: { t: number; dedos?: number; bate?: number; texto?: number }) => {
  const sh = bate ? 6 * Math.sin(t * 40) * (Math.sin(t * 3) > 0 ? 1 : 0.2) : 0;
  return (
    <Svg>
      <rect width={1080} height={1920} fill="#8a9a90" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M0 ${200 + i * 90} H1080`} stroke="#7a8a80" strokeWidth={3} />)}
      <rect x={120} y={320} width={840} height={1180} fill="#3a3a40" />
      <g transform={`translate(${sh} 0)`}>
        {[0, 1].map((i) => <g key={i}><rect x={140 + i * 410} y={340} width={390} height={1150} fill="#5a7a8a" stroke={L} strokeWidth={6} /><rect x={200 + i * 410} y={420} width={270} height={240} fill="#1a2a24" stroke={L} strokeWidth={5} />{bate > 0 && i === 0 && <g opacity={0.6 + 0.4 * Math.sin(t * 6)}><circle cx={330} cy={560} r={46} fill="#7a8a7a" /><circle cx={316} cy={550} r={6} fill="#e8f0e0" /><circle cx={344} cy={550} r={6} fill="#e8f0e0" /></g>}<rect x={300 + i * 410} y={880} width={40} height={140} rx={10} fill="#c9ccd4" stroke={L} strokeWidth={4} /></g>)}
        <rect x={130} y={900} width={820} height={40} rx={10} fill="#8a5a32" stroke={L} strokeWidth={5} transform="rotate(-4 540 920)" />
        {Array.from({ length: 13 }, (_, i) => <ellipse key={i} cx={330 + i * 36} cy={980 + Math.sin(i * 0.9) * 10} rx={22} ry={12} fill="none" stroke="#9aa0aa" strokeWidth={8} />)}
        <rect x={500} y={990} width={70} height={80} rx={10} fill="#c9a14a" stroke={L} strokeWidth={5} />
      </g>
      {texto > 0 && <g opacity={texto} fontFamily="Impact, 'Arial Black'" fill="#c22a2a" style={{ letterSpacing: 4 }}>
        <text x={540} y={760} textAnchor="middle" fontSize={120} transform="rotate(-4 540 760)">NÃO ABRA</text>
        <text x={540} y={1180} textAnchor="middle" fontSize={78} transform="rotate(3 540 1180)">OS MORTOS ESTÃO</text>
        <text x={540} y={1280} textAnchor="middle" fontSize={78} transform="rotate(3 540 1280)">AQUI DENTRO</text>
        {[[380, 790], [700, 800], [480, 1300]].map(([x, y], i) => <path key={i} d={`M${x} ${y} v${40 + i * 20}`} stroke="#c22a2a" strokeWidth={8} />)}
      </g>}
      {/* fresta embaixo com dedos */}
      <rect x={140} y={1490} width={800} height={14} fill="#05060a" />
      {dedos > 0 && Array.from({ length: 7 }, (_, i) => { const x = 220 + i * 100 + (i % 2) * 20, d = dedos * (30 + 20 * Math.sin(t * 6 + i * 1.7)); return <g key={i}>{[0, 1, 2, 3].map((k) => <rect key={k} x={x + k * 16} y={1494} width={13} height={d * (k === 1 || k === 2 ? 1 : 0.8)} rx={6} fill="#9aaa8a" stroke={L} strokeWidth={2} />)}</g>; })}
      <Piso cor="#a8b0a8" linha="#8a928a" y={1500} />
      <Papeis y0={1560} y1={1880} n={8} seed={5} t={t} />
    </Svg>
  );
};

// ---------- Cidade parada (avenida em perspectiva). grande = capital ----------
export const CidadeParada = ({ t, grande = false, noite = false, onibus = true, fumaca = 1, placaEstadio = false }: { t: number; grande?: boolean; noite?: boolean; onibus?: boolean; fumaca?: number; placaEstadio?: boolean }) => {
  const base = 1180;
  return (
    <Svg>
      <defs><linearGradient id={`ceuCid${noite ? 'n' : 'd'}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={noite ? '#0e1424' : '#8a96a8'} /><stop offset="1" stopColor={noite ? '#2a2a3a' : '#e8c8a0'} /></linearGradient></defs>
      <rect width={1080} height={1920} fill={`url(#ceuCid${noite ? 'n' : 'd'})`} />
      {fumaca > 0 && Array.from({ length: 8 }, (_, i) => { const k = (t * 0.08 + i / 8) % 1; return <circle key={i} cx={820 + Math.sin(k * 6 + i) * 40 + k * 120} cy={900 - k * 800} r={50 + k * 140} fill="#4a4a52" opacity={0.35 * (1 - k) * fumaca} />; })}
      {Array.from({ length: grande ? 9 : 6 }, (_, i) => <Predio key={`f${i}`} x={i * (grande ? 125 : 190) - 20} w={grande ? 120 : 170} h={(grande ? 520 : 280) + rnd(i + 30) * (grande ? 360 : 160)} base={base - 60} cor={['#6a7080', '#7a6a6a', '#5a6a6a', '#807a6a'][i % 4]} seed={i * 7 + 100} noite={noite} />)}
      <Predio x={-40} w={300} h={grande ? 1000 : 700} base={base + 220} cor="#8a7a6a" seed={3} noite={noite} />
      <Predio x={820} w={300} h={grande ? 1050 : 760} base={base + 220} cor="#6a7a8a" seed={9} noite={noite} />
      <g transform="translate(130 640)"><rect x={-110} y={-40} width={220} height={80} fill="#c22a2a" stroke={L} strokeWidth={4} /><text y={14} textAnchor="middle" fontFamily="Arial Black" fontSize={36} fill="#fff">FARMÁCIA</text></g>
      <g transform="translate(950 700)"><rect x={-110} y={-40} width={220} height={80} fill="#2f5fa8" stroke={L} strokeWidth={4} /><text y={14} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#fff">PADARIA</text></g>
      {/* avenida */}
      <path d={`M0 1920 L420 ${base} H660 L1080 1920 z`} fill={noite ? '#22222a' : '#4a4a52'} />
      <path d={`M0 1920 L0 1500 L420 ${base} L300 ${base} L0 ${base + 200} z M1080 1920 L1080 1500 L660 ${base} L780 ${base} L1080 ${base + 200} z`} fill={noite ? '#3a3a40' : '#8a8a8a'} />
      {Array.from({ length: 6 }, (_, i) => { const k = (i + 0.5) / 6; return <rect key={i} x={540 - 4 - k * 8} y={base + (1920 - base) * k * k} width={8 + k * 16} height={30 + k * 80} fill="#e8d870" />; })}
      <Semaforo x={300} y={base + 150} t={t} s={0.8} />
      {/* lixeiras tombadas, papéis, corvos */}
      <g transform="translate(860 1640) rotate(80)"><rect x={-50} y={-70} width={100} height={140} rx={10} fill="#3a7a4a" stroke={L} strokeWidth={5} /></g>
      <Papeis y0={1300} y1={1900} n={16} seed={21} t={t} />
      {onibus && <Onibus x={560} y={base + 180} s={0.62} rot={-8} />}
      <Carro x={200} y={1560} s={0.9} cor="#3a6ab0" porta />
      <Carro x={880} y={1460} s={0.75} cor="#e8e2d0" flip />
      <Carro x={720} y={1800} s={1.1} cor="#7a2a2a" porta flip />
      {[[300, 1300, false], [760, 1290, false], [600, 500, true], [700, 420, true]].map(([x, y, v], i) => <Corvo key={i} x={(x as number) + (v ? Math.sin(t * 0.6 + i) * 120 : 0)} y={y as number} t={t + i} s={1} voa={v as boolean} />)}
      {placaEstadio && <g transform="translate(860 1100)"><rect x={-8} y={0} width={16} height={260} fill="#5a5a62" /><rect x={-170} y={-70} width={340} height={80} fill="#1e6a3a" stroke="#fff" strokeWidth={4} /><text y={-18} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#fff">ESTÁDIO CENTRAL →</text></g>}
      <Poeira t={t} n={24} cor={noite ? '#c8d0e8' : '#f4e0c0'} op={0.4} area={[0, 800, 1080, 1000]} />
    </Svg>
  );
};

// ---------- Casa vazia (sala) ----------
export const CasaVazia = ({ t, destaqueAlbum = 0, noite = false }: { t: number; destaqueAlbum?: number; noite?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill={noite ? '#4a4038' : '#c8b494'} />
    {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${i * 50} 0 V${CHAO_S}`} stroke={noite ? '#3e352e' : '#b8a484'} strokeWidth={14} />)}
    {/* marcas de quadros que sumiram */}
    {[[160, 400, 160, 200], [380, 360, 120, 150], [380, 540, 120, 110]].map(([x, y, w, h], i) => <g key={i}><rect x={x} y={y} width={w} height={h} fill={noite ? '#5a4e44' : '#e0d0b0'} /><circle cx={x + w / 2} cy={y - 10} r={5} fill="#3a2a1a" /></g>)}
    <g transform="translate(270 640) rotate(-12)"><rect x={-60} y={-40} width={120} height={80} fill="#fff" stroke="#5a3a22" strokeWidth={8} /><text y={8} textAnchor="middle" fontFamily="Arial" fontSize={18} fill="#8a8a8a">vazio</text></g>
    {/* janela com cortina rasgada */}
    <rect x={720} y={360} width={260} height={360} fill={noite ? '#101828' : '#dfe8f0'} stroke="#f4f0e4" strokeWidth={14} /><path d="M850 360 v360 M720 540 h260" stroke="#f4f0e4" strokeWidth={8} />
    <path d="M700 340 q40 200 10 420 h60 q20 -200 -10 -420 z M1000 340 q-20 140 10 260 l-30 30 l-20 -60 q-10 -120 0 -230 z" fill="#a83a3a" stroke={L} strokeWidth={4} />
    {/* estante com buracos dos álbuns */}
    <g transform="translate(260 1480)">
      <rect x={-200} y={-720} width={400} height={720} fill="#6b4224" stroke={L} strokeWidth={6} />
      {[0, 1, 2, 3].map((r) => <rect key={r} x={-188} y={-700 + r * 175} width={376} height={150} fill="#3a2414" />)}
      {[0, 1, 2, 3].map((r) => Array.from({ length: 7 }, (_, c) => { const vazio = r === 1 && c >= 1 && c <= 5; return vazio ? null : <rect key={`${r}${c}`} x={-180 + c * 52} y={-690 + r * 175 + (c % 3) * 6} width={40} height={136 - (c % 3) * 6} fill={['#c22a2a', '#2f5fa8', '#3aa14a', '#f2c94c', '#7b5aa6'][(r + c) % 5]} stroke={L} strokeWidth={2} transform={r === 3 && c === 6 ? `rotate(-20 ${-160 + c * 52} ${-560 + r * 175})` : ''} />; }))}
      {destaqueAlbum > 0 && <rect x={-136} y={-530} width={272} height={150} fill="none" stroke="#f2c94c" strokeWidth={8} strokeDasharray="20 12" opacity={destaqueAlbum} />}
      {destaqueAlbum > 0 && Array.from({ length: 5 }, (_, i) => <rect key={i} x={-128 + i * 52} y={-470} width={40} height={4} fill="#a89a80" opacity={destaqueAlbum} />)}
    </g>
    {/* sofá, mesinha, gaveta aberta, bola do Tomás */}
    <g transform="translate(700 1480)"><rect x={-260} y={-240} width={520} height={130} rx={30} fill="#5a7a5a" stroke={L} strokeWidth={6} /><rect x={-290} y={-140} width={580} height={140} rx={30} fill="#4a6a4a" stroke={L} strokeWidth={6} /><rect x={-200} y={-220} width={110} height={80} rx={20} fill="#c8a85a" stroke={L} strokeWidth={4} transform="rotate(-14 -150 -180)" /></g>
    <g transform="translate(560 1640)"><rect x={-160} y={-40} width={320} height={30} rx={8} fill="#8a5a32" stroke={L} strokeWidth={5} /><path d="M-140 -10 v90 M140 -10 v90" stroke="#5a3a22" strokeWidth={12} /><rect x={-60} y={-80} width={60} height={40} rx={6} fill="#fff" stroke={L} strokeWidth={3} /><circle cx={80} cy={-60} r={20} fill="#c8a06a" stroke={L} strokeWidth={3} /></g>
    <g transform="translate(150 1760)"><circle r={50} fill="#2f8acf" stroke={L} strokeWidth={5} /><path d="M-50 0 q50 -30 100 0 M0 -50 q-24 50 0 100" stroke="#fff" strokeWidth={6} fill="none" /></g>
    <g transform="translate(980 1640)"><rect x={-80} y={-150} width={160} height={150} fill="#7a5a3a" stroke={L} strokeWidth={5} /><rect x={-74} y={-70} width={148} height={60} fill="#6a4a2a" stroke={L} strokeWidth={4} transform="translate(0 30)" /><path d="M-60 -36 q30 -20 60 6 q20 -16 40 0" stroke="#e8e2d0" strokeWidth={8} fill="none" /></g>
    <rect x={0} y={CHAO_S} width={1080} height={440} fill={noite ? '#3a2a1e' : '#8a6a4a'} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M0 ${CHAO_S + 20 + i * 56} H1080`} stroke={noite ? '#2a1e14' : '#6a4a32'} strokeWidth={3} />)}
    <Papeis y0={1560} y1={1900} n={7} seed={40} t={t} />
    <Poeira t={t} n={30} op={0.5} area={[650, 360, 400, 900]} />
  </Svg>
);

// ---------- Rua à noite, vista da casa do Seu Aurélio (janela com tábuas) ----------
export const RuaNoite = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#0c1220" />
    <circle cx={820} cy={240} r={80} fill="#e8e4d0" /><circle cx={820} cy={240} r={170} fill="#e8e4d0" opacity={0.08} />
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 4) * 700} r={2} fill="#fff" opacity={0.4} />)}
    {/* casas do outro lado */}
    {[0, 1, 2].map((i) => { const x = 40 + i * 350; return <g key={i}><path d={`M${x - 20} 900 L${x + 150} 780 L${x + 320} 900 z`} fill="#2a2a34" stroke={L} strokeWidth={4} /><rect x={x} y={900} width={300} height={300} fill={['#3a3e4a', '#4a3e3a', '#3a4a44'][i]} stroke={L} strokeWidth={4} /><rect x={x + 30} y={960} width={80} height={80} fill="#0a0e18" stroke={L} strokeWidth={3} /><rect x={x + 180} y={1010} width={80} height={190} fill="#1a1a20" stroke={L} strokeWidth={3} />{i === 1 && <path d={`M${x + 180} 1010 l80 190 M${x + 260} 1010 l-80 190`} stroke="#8a2a2a" strokeWidth={6} />}</g>; })}
    <rect x={0} y={1200} width={1080} height={60} fill="#5a5a62" />
    <rect x={0} y={1260} width={1080} height={660} fill="#26262e" />
    {Array.from({ length: 5 }, (_, i) => <rect key={i} x={60 + i * 220} y={1560} width={120} height={14} fill="#c8c070" opacity={0.6} />)}
    {/* poste apagado e carro abandonado */}
    <g transform="translate(960 1260)"><rect x={-8} y={-560} width={16} height={560} fill="#3a3a40" /><path d="M0 -540 h-90 v20" stroke="#3a3a40" strokeWidth={10} fill="none" /><path d="M-110 -520 h44 l-8 20 h-28 z" fill="#2a2a30" /></g>
    <Carro x={760} y={1380} s={0.8} cor="#4a4a6a" porta />
    <Corvo x={950} y={704} t={t} s={0.9} />
  </Svg>
);
// Moldura da janela com tábuas (vista de dentro da casa), por cima da rua e dos personagens.
export const MolduraTabuas = ({ t }: { t: number }) => (
  <Svg>
      <path d="M0 0 H1080 V1920 H0 z M120 360 V1560 H960 V360 z" fill="#2a1e16" fillRule="evenodd" />
      {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M${i * 60} 0 V1920`} stroke="#22180f" strokeWidth={10} opacity={0.6} />)}
      <rect x={100} y={340} width={880} height={1240} fill="none" stroke="#6b4224" strokeWidth={40} />
      {[[480, -6], [820, 4], [1150, -3], [1400, 5]].map(([y, a], i) => <rect key={i} x={70} y={y as number} width={940} height={110} fill="#8a6a4a" stroke={L} strokeWidth={6} transform={`rotate(${a} 540 ${(y as number) + 55})`} />)}
      {[[480, -6], [820, 4], [1150, -3], [1400, 5]].map(([y], i) => [150, 930].map((x) => <circle key={`${i}${x}`} cx={x} cy={(y as number) + 55} r={9} fill="#3a3a3a" />))}
      <g transform="translate(900 1720)"><rect x={-20} y={-90} width={40} height={90} fill="#f4efe0" stroke={L} strokeWidth={4} /><path d="M0 -90 q-10 -24 0 -40 q10 16 0 40" fill="#ffd166" /><circle cy={-110} r={120} fill="#ffd166" opacity={0.1 + 0.03 * Math.sin(t * 9)} /></g>
  </Svg>
);
// Interior da casa do Seu Aurélio à noite (vela, mesa, tábuas).
export const SalaVela = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#2a1e16" />
    {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M${i * 60} 0 V${CHAO_S}`} stroke="#22180f" strokeWidth={12} />)}
    <rect x={640} y={380} width={320} height={420} fill="#0c1220" stroke="#6b4224" strokeWidth={20} />
    {[440, 560, 680].map((y, i) => <rect key={y} x={620} y={y} width={360} height={70} fill="#8a6a4a" stroke={L} strokeWidth={5} transform={`rotate(${(i - 1) * 5} 800 ${y + 35})`} />)}
    <g transform="translate(240 760)"><rect x={-100} y={-120} width={200} height={150} fill="#c8b48a" stroke="#5a3a22" strokeWidth={10} />{[-40, 0, 40].map((dx) => <circle key={dx} cx={dx} cy={-50} r={22} fill="#e8d0b0" stroke="#5a4a3a" strokeWidth={3} />)}<text y={10} textAnchor="middle" fontFamily="Georgia" fontSize={20} fill="#5a3a22">Lurdes, Aurélio e Kauã</text></g>
    <g transform="translate(540 1480)"><rect x={-320} y={-260} width={640} height={30} fill="#6b4224" stroke={L} strokeWidth={5} /><path d="M-290 -230 V0 M290 -230 V0" stroke="#4a2a1a" strokeWidth={18} />
      <g transform="translate(-60 -260)"><rect x={-16} y={-70} width={32} height={70} fill="#f4efe0" stroke={L} strokeWidth={3} /><path d={`M0 -70 q${-8 + 3 * Math.sin(t * 9)} -20 0 -36 q8 16 0 36`} fill="#ffd166" /></g>
      <rect x={60} y={-300} width={70} height={40} rx={6} fill="#3a3a3a" stroke={L} strokeWidth={3} /><rect x={150} y={-310} width={40} height={50} rx={8} fill="#c8a06a" stroke={L} strokeWidth={3} /></g>
    <circle cx={480} cy={1150} r={460} fill="#ffb84a" opacity={0.12 + 0.03 * Math.sin(t * 9)} />
    <rect x={0} y={CHAO_S} width={1080} height={440} fill="#1e140c" />
  </Svg>
);

// ---------- Delegacia ----------
export const Delegacia = ({ t, radio = 0 }: { t: number; radio?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#a8a490" />
    <rect x={0} y={1000} width={1080} height={480} fill="#5a6a7a" /><path d="M0 1000 H1080" stroke="#3a4a5a" strokeWidth={10} />
    {/* armários */}
    {[0, 1, 2, 3].map((i) => <g key={i}><rect x={40 + i * 130} y={560} width={120} height={920} fill="#6a7a8a" stroke={L} strokeWidth={5} />{[0, 1, 2].map((k) => <path key={k} d={`M${60 + i * 130} ${620 + k * 14} h80`} stroke={L} strokeWidth={3} />)}<rect x={140 + i * 130} y={980} width={10} height={60} fill="#c9ccd4" />{i === 1 && <path d={`M${40 + i * 130} 560 l-60 30 v900 l60 -110`} fill="#5a6a7a" stroke={L} strokeWidth={4} />}</g>)}
    {/* quadro de avisos e cartazes */}
    <rect x={620} y={360} width={380} height={300} fill="#b88a5a" stroke={L} strokeWidth={6} />
    {[[650, 390, '#fff'], [800, 400, '#f4e8a0'], [900, 380, '#fff'], [680, 520, '#f4c8c8'], [850, 530, '#fff']].map(([x, y, c], i) => <g key={i}><rect x={x as number} y={y as number} width={90} height={110} fill={c as string} stroke={L} strokeWidth={2} transform={`rotate(${(i % 3 - 1) * 5} ${(x as number) + 45} ${y as number})`} /><circle cx={(x as number) + 45} cy={(y as number) + 6} r={6} fill="#c22a2a" /></g>)}
    <text x={810} y={340} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#2a3a5a">POLÍCIA RODOVIÁRIA</text>
    {/* grades da cela ao fundo */}
    <g>{Array.from({ length: 8 }, (_, i) => <rect key={i} x={620 + i * 50} y={700} width={10} height={300} fill="#5a5a62" />)}<rect x={610} y={690} width={400} height={16} fill="#5a5a62" /></g>
    {/* mesa com rádio base */}
    <g transform="translate(780 1480)"><rect x={-280} y={-300} width={560} height={40} fill="#6b4224" stroke={L} strokeWidth={5} /><rect x={-260} y={-260} width={520} height={260} fill="#5a3a22" stroke={L} strokeWidth={5} />
      <g transform="translate(-60 -300)"><rect x={-120} y={-110} width={240} height={110} rx={10} fill="#2a2e34" stroke={L} strokeWidth={5} /><rect x={-100} y={-90} width={110} height={40} fill={radio ? '#4dff88' : '#1a3a2a'} opacity={radio ? 0.6 + 0.4 * Math.sin(t * 12) : 1} /><circle cx={60} cy={-60} r={20} fill="#9aa0aa" stroke={L} strokeWidth={3} /><circle cx={-60} cy={-24} r={10} fill="#c22a2a" /><path d="M100 -110 v-80" stroke={L} strokeWidth={6} /></g>
      <g transform="translate(160 -300)"><rect x={-26} y={-60} width={52} height={60} rx={8} fill="#fff" stroke={L} strokeWidth={3} /><path d="M26 -46 q22 4 0 26" stroke={L} strokeWidth={4} fill="none" /></g>
    </g>
    {radio > 0 && [0, 1, 2].map((i) => { const k = (t * 1.2 + i / 3) % 1; return <path key={i} d={`M${820 + k * 60} ${1060 - k * 40} q20 30 0 60`} stroke="#4dff88" strokeWidth={5} fill="none" opacity={1 - k} />; })}
    <Piso cor="#8a8a80" linha="#6a6a62" />
    <Poeira t={t} n={24} op={0.4} />
  </Svg>
);

// ---------- Estrada com placa da capital ----------
export const EstradaCapital = ({ t, amanhecer = 1 }: { t: number; amanhecer?: number }) => (
  <Svg>
    <defs><linearGradient id="ceuEst" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a5a8a" /><stop offset="1" stopColor="#f2a86a" /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#ceuEst)" />
    <circle cx={300} cy={1020} r={120} fill="#ffd8a0" opacity={amanhecer} />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 120 - 20} 1080 L${i * 120 + 40} ${960 - rnd(i) * 80} L${i * 120 + 100} 1080 z`} fill="#4a5a6a" opacity={0.7} />)}
    <rect x={0} y={1080} width={1080} height={840} fill="#8a9a5a" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M0 ${1120 + i * 90} Q540 ${1100 + i * 90} 1080 ${1120 + i * 90}`} stroke="#7a8a4a" strokeWidth={6} fill="none" />)}
    <path d="M440 1080 H640 L1000 1920 H80 z" fill="#4a4a52" />
    {Array.from({ length: 6 }, (_, i) => { const k = (i + 0.5) / 6; return <rect key={i} x={540 - 3 - k * 6} y={1080 + 840 * k * k} width={6 + k * 12} height={20 + k * 60} fill="#f4f0e4" />; })}
    {/* caminhão tombado ao longe */}
    <g transform="translate(760 1140) rotate(-80) scale(0.5)"><rect x={-120} y={-60} width={240} height={120} fill="#e8e2d0" stroke={L} strokeWidth={6} /><rect x={120} y={-50} width={80} height={100} fill="#c22a2a" stroke={L} strokeWidth={6} /></g>
    {/* placa verde */}
    <g transform="translate(860 1440)"><rect x={-10} y={-40} width={20} height={300} fill="#5a5a62" /><rect x={-170} y={-230} width={340} height={190} rx={10} fill="#1e6a3a" stroke="#fff" strokeWidth={6} /><text y={-160} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#fff">CAPITAL</text><text y={-90} textAnchor="middle" fontFamily="Arial Black" fontSize={56} fill="#fff">48 km</text></g>
    {[[200, 400], [260, 440], [320, 410]].map(([x, y], i) => <Corvo key={i} x={x + Math.sin(t * 0.5 + i) * 80} y={y} t={t + i} voa />)}
  </Svg>
);
// Marcador de gasolina (close) — nivel 0..1.
export const Gasolina = ({ x, y, nivel, s = 1 }: { x: number; y: number; nivel: number; s?: number }) => {
  const a = -150 + 120 * nivel;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={200} fill="#1a1a1e" stroke="#5a5a62" strokeWidth={16} />
      <path d="M-150 30 A170 170 0 0 1 150 30" stroke="#f4f0e4" strokeWidth={6} fill="none" transform="rotate(0)" />
      <text x={-150} y={80} fontFamily="Arial Black" fontSize={44} fill="#e5484d">E</text><text x={120} y={80} fontFamily="Arial Black" fontSize={44} fill="#f4f0e4">F</text>
      <path d={`M0 20 L${Math.cos((a * Math.PI) / 180) * 150} ${20 + Math.sin((a * Math.PI) / 180) * 150}`} stroke="#ff6a2a" strokeWidth={10} strokeLinecap="round" />
      <circle cy={20} r={18} fill="#5a5a62" />
      <rect x={-30} y={80} width={60} height={70} rx={8} fill={nivel < 0.1 ? '#ff9a2a' : '#3a3a40'} />
    </g>
  );
};

// ---------- Interior do ônibus cercado ----------
export const OnibusDentro = ({ t, cerco = 1, radio = 0 }: { t: number; cerco?: number; radio?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#3a3e44" />
    {/* janelas laterais com rostos e mãos pressionados */}
    {[0, 1].map((i) => (
      <g key={i}>
        <rect x={60 + i * 500} y={360} width={460} height={520} rx={20} fill="#6a7a8a" stroke="#1a1a1e" strokeWidth={16} />
        {Array.from({ length: Math.round(5 * cerco) }, (_, k) => { const x = 110 + i * 500 + (k % 3) * 140 + (rnd(k + i * 7) - 0.5) * 30, y = 440 + Math.floor(k / 3) * 220 + 10 * Math.sin(t * 2 + k); return <g key={k} opacity={0.85}><circle cx={x + 40} cy={y + 60} r={56} fill="#8a9a7a" stroke="#1a1a1e" strokeWidth={4} /><circle cx={x + 22} cy={y + 52} r={8} fill="#e8f0d8" /><circle cx={x + 58} cy={y + 52} r={8} fill="#e8f0d8" /><ellipse cx={x + 40} cy={y + 90} rx={16} ry={10} fill="#2a2a20" />{[0, 1].map((h) => <g key={h} transform={`translate(${x - 10 + h * 110} ${y + 150 + 8 * Math.sin(t * 7 + k + h)})`}><rect x={-22} y={-26} width={44} height={50} rx={14} fill="#9aaa8a" stroke="#1a1a1e" strokeWidth={3} />{[-14, -4, 6, 16].map((dx) => <rect key={dx} x={dx - 4} y={-52} width={8} height={30} rx={4} fill="#9aaa8a" stroke="#1a1a1e" strokeWidth={2} />)}</g>)}</g>; })}
        <rect x={60 + i * 500} y={360} width={460} height={520} rx={20} fill="#c8d8e8" opacity={0.15} />
        <path d={`M${100 + i * 500} 400 l120 100 M${300 + i * 500} 380 l60 60`} stroke="#fff" strokeWidth={4} opacity={0.4} />
      </g>
    ))}
    <rect x={0} y={260} width={1080} height={40} fill="#5a5e64" />
    {/* barras de apoio e bancos */}
    <path d="M0 320 H1080" stroke="#c9ccd4" strokeWidth={16} strokeLinecap="round" />
    {[140, 940].map((x) => <path key={x} d={`M${x} 320 V1480`} stroke="#e8c020" strokeWidth={18} />)}
    {[0, 1].map((i) => <g key={i} transform={`translate(${160 + i * 760} 1300)`}><rect x={-120} y={-260} width={240} height={200} rx={30} fill="#2f5fa8" stroke={L} strokeWidth={6} /><rect x={-130} y={-80} width={260} height={90} rx={20} fill="#2a4f90" stroke={L} strokeWidth={6} /></g>)}
    {/* painel do motorista com rádio */}
    <g transform="translate(540 1240)"><rect x={-220} y={-80} width={440} height={140} rx={20} fill="#1e2226" stroke={L} strokeWidth={6} />
      <rect x={-80} y={-60} width={160} height={70} rx={8} fill="#0e1210" stroke={L} strokeWidth={4} />
      <rect x={-64} y={-46} width={90} height={30} fill={radio ? '#ffb020' : '#2a2014'} opacity={radio ? 0.7 + 0.3 * Math.sin(t * 15) : 1} />
      <circle cx={50} cy={-26} r={14} fill="#9aa0aa" />
      <path d="M-200 60 q-40 -120 40 -180" stroke="#1a1a1e" strokeWidth={14} fill="none" /><circle cx={-170} cy={-110} r={60} fill="none" stroke="#1a1a1e" strokeWidth={16} /></g>
    {radio > 0 && [0, 1, 2].map((i) => { const k = (t * 1.4 + i / 3) % 1; return <path key={i} d={`M${640 + k * 80} ${1190 - k * 30} q24 30 0 60`} stroke="#ffb020" strokeWidth={5} fill="none" opacity={1 - k} />; })}
    <rect x={0} y={CHAO_S} width={1080} height={440} fill="#2a2a30" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 120} ${CHAO_S} V1920`} stroke="#1e1e24" strokeWidth={8} />)}
    <rect width={1080} height={1920} fill="#000" opacity={0.15 + 0.05 * Math.sin(t * 2)} />
  </Svg>
);
// Rádio portátil (close).
export const RadioPortatil = ({ x, y, s = 1, t, fala = 0 }: { x: number; y: number; s?: number; t: number; fala?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={30} y={-300} width={26} height={160} rx={10} fill="#1a1a1e" />
    <rect x={-110} y={-170} width={220} height={380} rx={30} fill="#2a2e34" stroke={L} strokeWidth={8} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M-80 ${-120 + i * 26} H80`} stroke="#1a1a1e" strokeWidth={10} strokeLinecap="round" />)}
    <rect x={-80} y={50} width={160} height={70} rx={8} fill={fala ? '#7aff9a' : '#1a3a2a'} opacity={fala ? 0.7 + 0.3 * Math.sin(t * 14) : 1} />
    <text x={0} y={100} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={900} fontSize={34} fill="#0e1a10">CH 7</text>
    <circle cx={-60} cy={170} r={18} fill="#c22a2a" /><circle cx={60} cy={170} r={18} fill="#9aa0aa" />
    {fala > 0 && [0, 1, 2].map((i) => { const k = (t * 1.3 + i / 3) % 1; return <path key={i} d={`M${130 + k * 90} ${-60 - k * 20} q30 50 0 100`} stroke="#7aff9a" strokeWidth={8} fill="none" opacity={1 - k} />; })}
  </g>
);
