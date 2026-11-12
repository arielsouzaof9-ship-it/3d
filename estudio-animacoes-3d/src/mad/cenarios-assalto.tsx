// Cenários de "Quatro Minutos": torre do relógio, oficina do Relojoeiro, banco Casa do Ouro, saguão, sala de câmeras,
// cofre (porta redonda + broca), cofre vazio, viaturas, jornal e esgoto. Todos 1080×1920, função pura de t.
import { ReactNode, useId } from 'react';
import { L, Svg } from './cenarios';

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
    <rect x={0} y={CHAO_A} width={1080} height={440} fill="#4a3424" />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M0 ${CHAO_A + 30 + i * 62} H1080`} stroke="#3a2618" strokeWidth={3} />)}
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
    {lampada && <g><path d="M540 0 v120" stroke={L} strokeWidth={4} /><path d="M490 120 h100 l-20 40 h-60 z" fill="#2f4f3a" stroke={L} strokeWidth={4} /><path d="M520 160 L180 1300 H900 L560 160 z" fill="#ffe6a0" opacity={0.08 + 0.02 * Math.sin(t * 8)} /></g>}
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
    <circle cx={540} cy={450} r={46} fill="#e8c240" stroke={L} strokeWidth={5} /><text x={540} y={468} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={50} fill="#7a5a10">$</text>
    <rect x={150} y={540} width={780} height={70} fill={noite ? '#6a6250' : '#e2d6bc'} stroke={L} strokeWidth={4} />
    <text x={540} y={592} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={52} letterSpacing={6} fill="#7a5a10">CASA DO OURO</text>
    {[190, 330, 470, 610, 750, 890].map((x) => <g key={x}><rect x={x - 30} y={630} width={60} height={560} fill={noite ? '#a29a86' : '#fbf6ea'} stroke={L} strokeWidth={4} />{[0, 1, 2].map((k) => <path key={k} d={`M${x - 14 + k * 14} 640 v540`} stroke="#c9bfa6" strokeWidth={3} />)}</g>)}
    <rect x={460} y={960} width={160} height={230} rx={8} fill="#5a3a22" stroke={L} strokeWidth={5} />
    <path d="M540 960 v230" stroke={L} strokeWidth={4} />
    {[0, 1, 2].map((k) => <rect key={k} x={90 - k * 30} y={1190 + k * 30} width={900 + k * 60} height={30} fill={noite ? '#7a7464' : '#ddd2bc'} stroke={L} strokeWidth={4} />)}
    <rect x={0} y={1280} width={1080} height={640} fill={noite ? '#2e2e36' : '#5a5a66'} />
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
    <rect x={380} y={200} width={320} height={110} rx={12} fill="#1a1a1e" stroke="#c9a14a" strokeWidth={8} />
    <text x={540} y={285} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={900} fontSize={84} fill="#ff4d4d">{hora}</text>
    <rect x={60} y={1060} width={960} height={420} fill="#8a5a32" stroke={L} strokeWidth={6} />
    <rect x={40} y={1030} width={1000} height={40} fill="#c9a14a" stroke={L} strokeWidth={5} />
    {[0, 1, 2].map((i) => <g key={i}><rect x={120 + i * 300} y={760} width={240} height={270} fill="#bfe0f0" opacity={0.45} stroke="#c9a14a" strokeWidth={6} /><rect x={180 + i * 300} y={1110} width={120} height={50} rx={6} fill="#5a3a22" /></g>)}
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
    <rect x={60} y={1250} width={960} height={60} rx={8} fill="#3a404e" stroke={L} strokeWidth={5} />
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
      <rect x={0} y={CHAO_A} width={1080} height={440} fill="#3a3f48" />
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
