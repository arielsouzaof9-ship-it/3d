// Cenários de "O Número da Palma" (história da Nina) para os personagens mad articulados.
import { ReactNode } from 'react';
import { L, Svg } from './cenarios';
import { Poeira } from './cenarios-ilha';

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const clamp = (x: number) => Math.min(1, Math.max(0, x));
export const CHAO_N = 1480;
const Chao = ({ cor = '#8a6a4a', linha = '#6a4a32' }: { cor?: string; linha?: string }) => (
  <><rect x={0} y={CHAO_N} width={1080} height={440} fill={cor} />{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M0 ${CHAO_N + 24 + i * 58} H1080`} stroke={linha} strokeWidth={3} />)}</>
);

// ---------- Palma com número (close) ----------
export const Palma = ({ x, y, s = 1, pele, numero, brilho = 0, t, dedos = 1 }: { x: number; y: number; s?: number; pele: string; numero: string; brilho?: number; t: number; dedos?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {brilho > 0 && <circle r={260} fill="#ffe08a" opacity={0.25 * brilho * (0.8 + 0.2 * Math.sin(t * 5))} />}
    <path d="M-60 200 L-80 340 H80 L60 200 z" fill={pele} stroke={L} strokeWidth={8} />
    {[-96, -34, 30, 92].map((dx, i) => { const h = [150, 190, 180, 140][i] * dedos; return <rect key={i} x={dx - 28} y={-90 - h} width={56} height={h + 60} rx={28} fill={pele} stroke={L} strokeWidth={8} />; })}
    <rect x={-176} y={-10} width={56} height={150} rx={28} fill={pele} stroke={L} strokeWidth={8} transform="rotate(-38 -150 60)" />
    <rect x={-130} y={-110} width={260} height={320} rx={110} fill={pele} stroke={L} strokeWidth={8} />
    <path d="M-80 60 q60 30 120 -10 M-70 120 q50 20 110 0" stroke={L} strokeWidth={4} fill="none" opacity={0.3} />
    <rect x={-110} y={-36} width={220} height={90} rx={16} fill="#1a1520" />
    <text x={0} y={30} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={900} fontSize={numero.length > 6 ? 40 : 66} fill="#f2c94c">{numero}</text>
  </g>
);

// ---------- Berçário da maternidade ----------
export const Bercario = ({ t, numeros = [] as string[] }: { t: number; numeros?: string[] }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#dff1fb" />
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={(i % 4) * 280 + 140} cy={Math.floor(i / 4) * 260 + 220} r={36} fill="#fff" opacity={0.6} />)}
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${(i % 4) * 280 + 140} ${Math.floor(i / 4) * 260 + 170} l10 30 l30 0 l-24 18 l10 30 l-26 -18 l-26 18 l10 -30 l-24 -18 l30 0 z`} fill="#f2e86a" opacity={0.6} />)}
    <rect x={0} y={900} width={1080} height={20} fill="#9ad0e8" />
    <rect x={160} y={360} width={760} height={300} rx={20} fill="#fff" stroke={L} strokeWidth={6} />
    <text x={540} y={450} textAnchor="middle" fontFamily="Arial Black" fontSize={56} fill="#5a8ac0">BERÇÁRIO</text>
    <text x={540} y={540} textAnchor="middle" fontFamily="Arial" fontWeight={700} fontSize={36} fill="#7a8a9a">silêncio, bebês dormindo</text>
    {numeros.map((n, i) => {
      const x = 180 + (i % 3) * 360, y = 1180 + Math.floor(i / 3) * 360;
      return (
        <g key={i}>
          <rect x={x - 150} y={y} width={300} height={160} rx={24} fill="#f4f4f4" stroke={L} strokeWidth={5} />
          {Array.from({ length: 6 }, (_, j) => <path key={j} d={`M${x - 120 + j * 48} ${y} v-60`} stroke="#c9ccd4" strokeWidth={8} />)}
          <path d={`M${x - 150} ${y - 60} h300`} stroke="#c9ccd4" strokeWidth={10} />
          <circle cx={x} cy={y + 30} r={46} fill={['#f6e3d3', '#b9805a', '#e2b48c', '#7a4b30', '#f6e3d3', '#e2b48c'][i % 6]} stroke={L} strokeWidth={4} />
          <path d={`M${x - 16} ${y + 26} q8 6 16 0 M${x + 4} ${y + 26} q8 6 16 0`} stroke={L} strokeWidth={3} fill="none" />
          <g transform={`translate(${x} ${y - 110 + 6 * Math.sin(t * 2 + i)})`}><rect x={-80} y={-28} width={160} height={52} rx={12} fill="#1a1520" /><text x={0} y={12} textAnchor="middle" fontFamily="'Courier New'" fontWeight={900} fontSize={n.length > 6 ? 26 : 36} fill="#f2c94c">{n}</text></g>
        </g>
      );
    })}
  </Svg>
);

// ---------- Sala de casa (visitas, festa) ----------
export const SalaCasa = ({ t, festa = false, noite = false }: { t: number; festa?: boolean; noite?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill={noite ? '#4a4a6a' : '#f2e2c8'} />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 130 + 60} 0 V${CHAO_N}`} stroke="#000" strokeWidth={30} opacity={0.04} />)}
    <rect x={700} y={420} width={260} height={320} fill={noite ? '#1a2040' : '#bfe6ff'} stroke="#fffaf0" strokeWidth={14} />
    <path d="M830 420 v320 M700 580 h260" stroke="#fffaf0" strokeWidth={8} />
    <path d={`M700 420 q${30 + 8 * Math.sin(t)} 160 0 320`} fill="#e5484d" opacity={0.85} />
    {[[150, 420], [330, 460]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width={140} height={110} fill="#fffaf0" stroke="#8a5a32" strokeWidth={8} /><circle cx={x + 50} cy={y + 50} r={18} fill="#c98a5a" /><circle cx={x + 90} cy={y + 56} r={14} fill="#f6e3d3" /></g>)}
    <rect x={60} y={1260} width={460} height={140} rx={30} fill="#5a8ac0" stroke={L} strokeWidth={5} />
    <rect x={80} y={1200} width={420} height={90} rx={30} fill="#6a9ad0" stroke={L} strokeWidth={5} />
    <g transform="translate(900 1300)"><rect x={-60} y={0} width={120} height={180} fill="#8a5a32" stroke={L} strokeWidth={4} /><path d="M-30 0 L-20 -60 H20 L30 0 z" fill="#3a8a3a" stroke={L} strokeWidth={3} /></g>
    {festa && <g>
      <path d="M0 260 Q540 360 1080 260" stroke={L} strokeWidth={3} fill="none" />
      {Array.from({ length: 12 }, (_, i) => { const x = 40 + i * 90, y = 260 + 100 * 4 * (x / 1080) * (1 - x / 1080) * 0.9; return <path key={i} d={`M${x - 20} ${y} h40 l-20 ${46 + 4 * Math.sin(t * 4 + i)} z`} fill={['#e5484d', '#f2c94c', '#2f5fa8', '#3aa14a'][i % 4]} stroke={L} strokeWidth={2} />; })}
      {[[120, 700, '#e5484d'], [960, 820, '#2f5fa8'], [560, 760, '#f2c94c']].map(([x, y, c], i) => <g key={i}><path d={`M${x} ${(y as number) + 70} q10 80 -6 160`} stroke={L} strokeWidth={3} fill="none" /><ellipse cx={x as number} cy={(y as number) + 6 * Math.sin(t * 2 + i)} rx={46} ry={58} fill={c as string} stroke={L} strokeWidth={4} /></g>)}
      <rect x={300} y={600} width={480} height={90} rx={12} fill="#fffaf0" stroke={L} strokeWidth={5} />
      <text x={540} y={662} textAnchor="middle" fontFamily="Arial Black" fontSize={46} fill="#e5484d">1.000.000!</text>
    </g>}
    <Chao />
  </Svg>
);

// ---------- Sala de aula ----------
export const SalaAula = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#f4ecd8" />
    <rect x={120} y={300} width={840} height={420} rx={14} fill="#2f5a3a" stroke="#8a5a32" strokeWidth={18} />
    <text x={540} y={430} textAnchor="middle" fontFamily="'Comic Sans MS', cursive" fontSize={60} fill="#f4f4f4">1 + 1 = 2</text>
    <text x={540} y={540} textAnchor="middle" fontFamily="'Comic Sans MS', cursive" fontSize={44} fill="#f4f4f4" opacity={0.8}>a, e, i, o, u</text>
    <path d="M300 640 l60 -40 l20 30" stroke="#f4f4f4" strokeWidth={6} fill="none" opacity={0.6} />
    <rect x={120} y={720} width={840} height={20} fill="#8a5a32" />
    <g transform="translate(980 220)"><circle r={50} fill="#fffaf0" stroke={L} strokeWidth={5} /><path d={`M0 0 l0 -34 M0 0 l${26 * Math.sin(t * 0.3)} ${-26 * Math.cos(t * 0.3)}`} stroke={L} strokeWidth={5} strokeLinecap="round" /></g>
    {[[0, 'A'], [1, 'B'], [2, 'C']].map(([i, c]) => <g key={i as number}><rect x={60 + (i as number) * 70} y={140} width={60} height={70} fill={['#e5484d', '#f2c94c', '#2f5fa8'][i as number]} stroke={L} strokeWidth={3} /><text x={90 + (i as number) * 70} y={192} textAnchor="middle" fontFamily="Arial Black" fontSize={44} fill="#fff">{c}</text></g>)}
    {[[230, 1260], [850, 1260]].map(([x, y], i) => <g key={i}><rect x={x - 150} y={y} width={300} height={30} fill="#c9965a" stroke={L} strokeWidth={4} /><path d={`M${x - 130} ${y + 30} v190 M${x + 130} ${y + 30} v190`} stroke="#6b4224" strokeWidth={14} /><rect x={x - 70} y={y - 30} width={80} height={30} fill={i ? '#e5484d' : '#3aa14a'} stroke={L} strokeWidth={2} /></g>)}
    <Chao cor="#c9a06a" linha="#a8804a" />
  </Svg>
);

// ---------- Quarto de estudo à noite ----------
export const QuartoEstudo = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#3a3a5a" />
    <rect x={640} y={360} width={300} height={360} fill="#141a33" stroke="#e8e2d0" strokeWidth={14} />
    <circle cx={850} cy={450} r={40} fill="#f4efd8" />
    {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={660 + rnd(i) * 260} cy={380 + rnd(i + 2) * 320} r={2} fill="#fff" opacity={0.6} />)}
    <path d="M790 360 v360 M640 540 h300" stroke="#e8e2d0" strokeWidth={8} />
    <rect x={80} y={560} width={360} height={14} fill="#8a5a32" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={90 + i * 38} y={460 - (i % 3) * 10} width={32} height={100 + (i % 3) * 10} fill={['#e5484d', '#2f5fa8', '#3aa14a', '#f2c94c'][i % 4]} stroke={L} strokeWidth={2} />)}
    <rect x={200} y={1180} width={700} height={30} fill="#8a5a32" stroke={L} strokeWidth={4} />
    <path d="M230 1210 v270 M870 1210 v270" stroke="#6b4224" strokeWidth={16} />
    <g transform="translate(780 1180)"><path d="M0 0 v-110 l-60 -40" stroke={L} strokeWidth={8} fill="none" /><path d="M-90 -170 h70 l-14 40 h-42 z" fill="#f2c94c" stroke={L} strokeWidth={4} /><path d="M-56 -130 L-200 0 H90 z" fill="#ffe08a" opacity={0.25 + 0.03 * Math.sin(t * 9)} /></g>
    {[[300, 1150], [420, 1160]].map(([x, y], i) => <g key={i} transform={`rotate(${i ? 6 : -4} ${x} ${y})`}><rect x={x - 60} y={y - 20} width={120} height={24} fill={i ? '#2f5fa8' : '#e5484d'} stroke={L} strokeWidth={3} /></g>)}
    <g transform="translate(560 1150)"><rect x={-90} y={-20} width={180} height={24} fill="#fffaf0" stroke={L} strokeWidth={3} /><path d="M0 -20 v24" stroke={L} strokeWidth={2} />{Array.from({ length: 4 }, (_, i) => <path key={i} d={`M${-80} ${-12 + i * 5} h70 M${10} ${-12 + i * 5} h70`} stroke="#9a8a6a" strokeWidth={1.5} />)}</g>
    <Chao cor="#4a3424" linha="#3a2618" />
  </Svg>
);

// ---------- Quartel dos bombeiros ----------
export const Quartel = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#9ad0f0" />
    <rect x={60} y={500} width={960} height={980} fill="#c8452e" stroke={L} strokeWidth={6} />
    {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M60 ${540 + i * 48} H1020`} stroke="#a8352a" strokeWidth={3} />)}
    <rect x={200} y={540} width={680} height={110} rx={10} fill="#fffaf0" stroke={L} strokeWidth={5} />
    <text x={540} y={620} textAnchor="middle" fontFamily="Arial Black" fontSize={64} fill="#c8452e">BOMBEIROS</text>
    <rect x={150} y={760} width={780} height={720} fill="#2a2a30" stroke={L} strokeWidth={6} />
    {/* caminhão */}
    <g transform="translate(540 1440)">
      <rect x={-380} y={-300} width={600} height={240} rx={14} fill="#e5484d" stroke={L} strokeWidth={6} />
      <path d="M220 -300 h120 l60 100 v140 h-180 z" fill="#e5484d" stroke={L} strokeWidth={6} strokeLinejoin="round" />
      <path d="M240 -280 h90 l44 74 h-134 z" fill="#bfe6ff" stroke={L} strokeWidth={4} />
      <path d="M-380 -330 h560" stroke="#c9ccd4" strokeWidth={14} />{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-360 + i * 56} -340 v20`} stroke="#c9ccd4" strokeWidth={8} />)}
      <rect x={-360} y={-200} width={560} height={30} fill="#f2c94c" />
      {[-260, 120, 300].map((w) => <g key={w}><circle cx={w} cy={-40} r={50} fill="#1a1a1e" stroke={L} strokeWidth={5} /><circle cx={w} cy={-40} r={20} fill="#9aa0aa" /></g>)}
      <rect x={300} y={-340} width={60} height={30} rx={8} fill={Math.sin(t * 10) > 0 ? '#ff3b3b' : '#3b7bff'} stroke={L} strokeWidth={3} />
    </g>
    <rect x={0} y={CHAO_N} width={1080} height={440} fill="#9a9aa6" />
  </Svg>
);

// ---------- Cidade com os prédios do Rafael (desaba = 0..1 para cada prédio) ----------
export const CidadeRafael = ({ t, noite = false, desaba = [0, 0, 0], subindo = 1, chuva = false }: { t: number; noite?: boolean; desaba?: number[]; subindo?: number; chuva?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill={noite ? '#141a33' : '#8ac8f0'} />
    {noite && Array.from({ length: 30 }, (_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 3) * 600} r={2} fill="#fff" opacity={0.3} />)}
    {Array.from({ length: 8 }, (_, i) => { const h = 300 + rnd(i) * 300, x = i * 140 - 20; return <rect key={i} x={x} y={1300 - h} width={130} height={h} fill={noite ? '#1c2440' : '#a8b8c8'} opacity={0.7} />; })}
    {[0, 1, 2].map((i) => {
      const x = 140 + i * 330, h = (760 + i * 60) * subindo, d = desaba[i] ?? 0;
      const top = 1400 - h;
      return (
        <g key={i} transform={`translate(${x + 100} 1400) rotate(${d * (i % 2 ? -14 : 12)}) translate(${-x - 100} ${-1400 + d * h * 0.85})`} opacity={1 - d * 0.6}>
          <rect x={x} y={top} width={200} height={h} fill={noite ? '#3a4a6a' : '#e8e2d0'} stroke={L} strokeWidth={5} />
          {Array.from({ length: Math.floor(h / 70) * 3 }, (_, j) => <rect key={j} x={x + 18 + (j % 3) * 60} y={top + 20 + Math.floor(j / 3) * 70} width={42} height={42} fill={noite ? ((j + i) % 3 ? '#ffd166' : '#2a3050') : '#9ad0f0'} opacity={noite ? 0.8 : 1} />)}
          <rect x={x - 10} y={top - 50} width={220} height={50} fill="#1a1a1e" stroke={L} strokeWidth={4} />
          <text x={x + 100} y={top - 14} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#f2c94c">RAFAEL</text>
        </g>
      );
    })}
    {desaba.map((d, i) => d > 0 && d < 1 ? <g key={i}>{Array.from({ length: 10 }, (_, j) => <circle key={j} cx={240 + i * 330 + (rnd(j + i * 9) - 0.5) * 300} cy={1380 - rnd(j + 2) * 300 * d} r={40 + 80 * d * rnd(j + 5)} fill="#9a9aa6" opacity={0.5 * (1 - d)} />)}</g> : null)}
    <rect x={0} y={1400} width={1080} height={520} fill={noite ? '#2a2a34' : '#6a6a76'} />
    {chuva && Array.from({ length: 160 }, (_, i) => { const sp = 1500 + rnd(i) * 600, y = ((t * sp + rnd(i + 5) * 2400) % 2400) - 300, x = rnd(i + 9) * 1300 - 100 - y * 0.2; return <path key={i} d={`M${x} ${y} l-12 60`} stroke="#c8d6f0" strokeWidth={3} opacity={0.5} />; })}
  </Svg>
);

// ---------- Escombros na chuva (noite) ----------
export const Escombros = ({ t, poeira = 0 }: { t: number; poeira?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#141a2a" />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${rnd(i) * 1080 - 100} ${900 + rnd(i + 3) * 500} l${150 + rnd(i + 5) * 200} ${-60 + rnd(i + 7) * 120} l${-20} ${80} z`} fill={['#4a4a52', '#5a5a62', '#3a3a42'][i % 3]} stroke={L} strokeWidth={4} />)}
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${100 + i * 170} 1300 l${-30 + rnd(i) * 60} -${200 + rnd(i + 2) * 200}`} stroke="#8a6a4a" strokeWidth={8} />)}
    <path d="M0 1350 Q200 1250 400 1320 T800 1300 T1080 1340 V1920 H0 z" fill="#3a3a42" />
    {Array.from({ length: 20 }, (_, i) => <rect key={i} x={rnd(i) * 1080} y={1400 + rnd(i + 2) * 400} width={40 + rnd(i + 4) * 80} height={30 + rnd(i + 6) * 40} fill="#5a5a62" stroke={L} strokeWidth={3} transform={`rotate(${rnd(i + 8) * 60 - 30} ${rnd(i) * 1080} ${1400 + rnd(i + 2) * 400})`} />)}
    {Array.from({ length: 140 }, (_, i) => { const sp = 1500 + rnd(i) * 600, y = ((t * sp + rnd(i + 5) * 2400) % 2400) - 300, x = rnd(i + 9) * 1300 - 100 - y * 0.2; return <path key={i} d={`M${x} ${y} l-12 60`} stroke="#c8d6f0" strokeWidth={3} opacity={0.4} />; })}
    {poeira > 0 && <rect width={1080} height={1920} fill="#9a9aa6" opacity={0.6 * poeira} />}
    <rect width={1080} height={1920} fill={Math.sin(t * 9) > 0 ? '#ff3b3b' : '#3b7bff'} opacity={0.06} />
  </Svg>
);

// ---------- Velório (capela simples) ----------
export const Velorio = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#4a4a5a" />
    <path d="M380 260 Q540 120 700 260 V680 H380 z" fill="#7a9ac0" stroke="#c9a14a" strokeWidth={12} />
    <path d="M540 280 v320 M440 400 h200" stroke="#f2e6d0" strokeWidth={14} />
    {[220, 860].map((x, i) => <g key={x}><rect x={x - 12} y={900} width={24} height={110} fill="#f4efe2" stroke={L} strokeWidth={3} /><path d={`M${x} 896 q${-6 + 3 * Math.sin(t * 8 + i)} -18 0 -30 q6 12 0 30`} fill="#ffcf6a" /><circle cx={x} cy={880} r={60} fill="#ffcf6a" opacity={0.15} /><rect x={x - 30} y={1010} width={60} height={470} fill="#8a6a4a" stroke={L} strokeWidth={4} /></g>)}
    {/* caixão com o capacete em cima */}
    <g transform="translate(540 1180)">
      <path d="M-300 0 L-260 -90 H260 L300 0 L260 90 H-260 z" fill="#6b4224" stroke={L} strokeWidth={6} />
      <path d="M-260 -90 H260" stroke="#c9a14a" strokeWidth={6} />
      <g transform="translate(0 -112)"><path d="M-90 30 C-90 -80 90 -80 90 30 z" fill="#f2c94c" stroke={L} strokeWidth={5} /><rect x={-120} y={24} width={240} height={20} rx={8} fill="#f2c94c" stroke={L} strokeWidth={4} /></g>
      {[-220, 220].map((d) => <g key={d}>{[-30, 0, 30].map((e, j) => <circle key={j} cx={d + e} cy={-110 - (j % 2) * 20} r={22} fill={['#ffffff', '#f2e86a', '#ffffff'][j]} stroke={L} strokeWidth={3} />)}</g>)}
    </g>
    <rect x={0} y={CHAO_N} width={1080} height={440} fill="#3a3a44" />
    {[[200, 1600], [880, 1600]].map(([x, y], i) => <rect key={i} x={x - 120} y={y} width={240} height={26} fill="#6b4224" stroke={L} strokeWidth={4} />)}
    <Poeira t={t} n={20} op={0.3} />
  </Svg>
);
// Contador grande (números rolando até o valor final).
export const Contador = ({ t, at, valor, cor = '#f2c94c', y = 900 }: { t: number; at: number; valor: number; cor?: string; y?: number }) => {
  const k = clamp((t - at) / 1.2);
  const v = Math.round(valor * (1 - Math.pow(1 - k, 3)));
  return (
    <Svg>
      <rect x={140} y={y - 90} width={800} height={160} rx={20} fill="#1a1520" stroke={cor} strokeWidth={8} />
      <text x={540} y={y + 30} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={900} fontSize={110} fill={cor}>{v.toLocaleString('pt-BR')}</text>
    </Svg>
  );
};
export type { ReactNode };
