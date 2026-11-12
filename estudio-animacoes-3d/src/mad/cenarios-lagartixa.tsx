// Cenários de "O Garoto Lagartixa": escola, laboratório, quarto, parede de prédio, ginásio com ringue, escritório,
// feira, hospital, costura, telhado da cidade à noite e rua. Todos 1080×1920, função pura de t.
import { L, Svg } from './cenarios';
import { Poeira } from './cenarios-ilha';

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const clamp = (x: number) => Math.min(1, Math.max(0, x));
export const CHAO_L = 1480;

const Chao = ({ cor = '#8a6a4a', linha = '#6a4a32', y = CHAO_L }: { cor?: string; linha?: string; y?: number }) => (
  <><rect x={0} y={y} width={1080} height={1920 - y} fill={cor} />{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M0 ${y + 24 + i * 58} H1080`} stroke={linha} strokeWidth={3} />)}</>
);

// ---------- Lagartixa experimental (brilho verde) ----------
export const Lagartixa = ({ x, y, s = 1, t, rot = 0, brilho = 1 }: { x: number; y: number; s?: number; t: number; rot?: number; brilho?: number }) => {
  const p = Math.sin(t * 14);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {brilho > 0 && <ellipse rx={110} ry={60} fill="#7aff9a" opacity={0.25 * brilho} />}
      <path d={`M-70 0 Q-110 ${10 * p} -150 ${-6 * p}`} stroke="#3ac06a" strokeWidth={14} fill="none" strokeLinecap="round" />
      {[[-30, -1], [30, 1]].map(([lx, sd], i) => <g key={i}>{[-1, 1].map((v) => <path key={v} d={`M${lx} 0 l${10 * sd} ${v * 34} l${(i ? 12 : -12)} ${v * 6}`} stroke="#3ac06a" strokeWidth={10} fill="none" strokeLinecap="round" transform={`rotate(${v * p * 12} ${lx} 0)`} />)}</g>)}
      <ellipse rx={70} ry={24} fill="#3ac06a" stroke={L} strokeWidth={4} />
      <ellipse cx={78} rx={30} ry={22} fill="#3ac06a" stroke={L} strokeWidth={4} />
      {[-30, 0, 30].map((d) => <circle key={d} cx={d} cy={-6} r={6} fill="#c8ff6a" />)}
      <circle cx={88} cy={-10} r={8} fill="#fff" stroke={L} strokeWidth={2} /><circle cx={90} cy={-10} r={4} fill={L} />
    </g>
  );
};
export const Mosca = ({ x, y, s = 1, t }: { x: number; y: number; s?: number; t: number }) => (
  <g transform={`translate(${x + 6 * Math.sin(t * 3)} ${y + 4 * Math.sin(t * 5)}) scale(${s})`}>
    {[-1, 1].map((sd) => <ellipse key={sd} cx={sd * 16} cy={-14} rx={16} ry={9} fill="#dfefff" opacity={0.7} stroke={L} strokeWidth={2} transform={`rotate(${sd * (20 + 25 * Math.sin(t * 40))} 0 -6)`} />)}
    <ellipse rx={14} ry={10} fill="#2a2a30" /><circle cx={12} cy={-2} r={6} fill="#8a1a1a" />
  </g>
);

// ---------- Escola ----------
export const Escola = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#e8e2d0" />
    <rect x={0} y={260} width={1080} height={60} fill="#5a8ac0" />
    {Array.from({ length: 9 }, (_, i) => (
      <g key={i}>
        <rect x={20 + i * 118} y={760} width={110} height={720} fill={['#d1495b', '#2f5fa8', '#3a8a3a'][i % 3]} stroke={L} strokeWidth={5} />
        {[0, 1, 2].map((k) => <path key={k} d={`M${40 + i * 118} ${800 + k * 22} h70`} stroke={L} strokeWidth={4} opacity={0.4} />)}
        <rect x={102 + i * 118} y={1080} width={10} height={40} rx={4} fill="#c9ccd4" stroke={L} strokeWidth={2} />
      </g>
    ))}
    <rect x={240} y={360} width={600} height={300} rx={8} fill="#c9a06a" stroke="#6b4224" strokeWidth={12} />
    {[[280, 400, '#fffaf0'], [460, 420, '#f2e86a'], [640, 390, '#f2a0c0'], [330, 530, '#bfe6ff'], [560, 540, '#fffaf0']].map(([x, y, c], i) => <g key={i} transform={`rotate(${(i % 2 ? 4 : -5)} ${x} ${y})`}><rect x={x as number} y={y as number} width={140} height={100} fill={c as string} stroke={L} strokeWidth={2} /><path d={`M${(x as number) + 14} ${(y as number) + 30} h100 M${(x as number) + 14} ${(y as number) + 54} h80`} stroke="#6a5a4a" strokeWidth={4} /></g>)}
    <text x={540} y={300} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#fff">ESCOLA ESTADUAL</text>
    {[0, 1].map((i) => <rect key={i} x={160 + i * 600} y={40} width={160} height={24} rx={6} fill="#fffaf0" opacity={0.6 + 0.4 * Math.abs(Math.sin(t * (i ? 7 : 3)))} />)}
    <g transform="translate(940 520)"><circle r={56} fill="#fffaf0" stroke={L} strokeWidth={6} /><path d={`M0 0 l0 -40 M0 0 l${34 * Math.sin(t * 0.4)} ${-34 * Math.cos(t * 0.4)}`} stroke={L} strokeWidth={5} strokeLinecap="round" /></g>
    <g transform="translate(70 380)"><rect width={140} height={220} fill="#c8e0f0" opacity={0.5} stroke="#8a5a32" strokeWidth={8} />{[0, 1, 2].map((i) => <g key={i} transform={`translate(${30 + i * 40} ${180 - i * 30})`}><rect x={-10} y={0} width={20} height={14} fill="#8a5a32" /><path d="M-14 -40 h28 q0 34 -14 40 q-14 -6 -14 -40 z" fill="#e8c240" stroke={L} strokeWidth={2} /></g>)}</g>
    <g transform="translate(900 1330)"><rect x={-40} y={0} width={80} height={150} fill="#c9ccd4" stroke={L} strokeWidth={4} /><rect x={-50} y={-14} width={100} height={20} rx={6} fill="#9aa0aa" stroke={L} strokeWidth={3} /></g>
    {[[120, '#d1495b'], [560, '#3a8a3a'], [780, '#5a3a6a']].map(([x, c], i) => <g key={i} transform={`translate(${x} 1440)`}><rect x={-40} y={-50} width={80} height={60} rx={16} fill={c as string} stroke={L} strokeWidth={4} /><path d="M-24 -50 q24 -30 48 0" stroke={L} strokeWidth={4} fill="none" /></g>)}
    <Chao cor="#c9c2b0" linha="#a8a090" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={(i % 6) * 180} y={CHAO_L + Math.floor(i / 6) * 220} width={180} height={220} fill={(i + Math.floor(i / 6)) % 2 ? '#d8d0bc' : '#c9c2b0'} />)}
  </Svg>
);

// ---------- Laboratório da universidade ----------
export const Laboratorio = ({ t, tuboAberto = 0 }: { t: number; tuboAberto?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#dfe8ee" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 180} y={0} width={176} height={CHAO_L} fill="#e8eef2" stroke="#c8d4dc" strokeWidth={4} />)}
    {/* pôster de DNA */}
    <rect x={60} y={300} width={200} height={300} fill="#fffaf0" stroke={L} strokeWidth={4} />
    {Array.from({ length: 10 }, (_, i) => <g key={i}><circle cx={160 + 50 * Math.sin(i * 0.7 + t)} cy={330 + i * 26} r={8} fill="#2f5fa8" /><circle cx={160 - 50 * Math.sin(i * 0.7 + t)} cy={330 + i * 26} r={8} fill="#d1495b" /></g>)}
    {/* prateleira com potes */}
    <rect x={640} y={360} width={380} height={16} fill="#9aa0aa" stroke={L} strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => <g key={i}><rect x={660 + i * 90} y={270} width={60} height={90} rx={10} fill={['#bfe6ff', '#c8ffda', '#ffe0c8', '#e8d0ff'][i]} stroke={L} strokeWidth={3} opacity={0.85} /><rect x={660 + i * 90} y={262} width={60} height={14} fill="#6a727e" stroke={L} strokeWidth={2} /></g>)}
    {/* bancada */}
    <rect x={40} y={1080} width={1000} height={50} fill="#3a3f48" stroke={L} strokeWidth={5} />
    <rect x={70} y={1130} width={940} height={350} fill="#c9ccd4" stroke={L} strokeWidth={5} />
    {[0, 1, 2].map((i) => <rect key={i} x={110 + i * 310} y={1170} width={260} height={280} fill="none" stroke={L} strokeWidth={4} opacity={0.4} />)}
    {/* béqueres borbulhando */}
    {[[160, '#7aff9a'], [300, '#ff9ad0'], [880, '#9ad0ff']].map(([x, c], i) => (
      <g key={i}>
        <path d={`M${(x as number) - 40} 960 h80 l-6 120 h-68 z`} fill="#fff" opacity={0.5} stroke={L} strokeWidth={4} />
        <path d={`M${(x as number) - 36} 1010 h72 l-4 66 h-64 z`} fill={c as string} opacity={0.85} />
        {[0, 1, 2].map((k) => { const kk = (t * 0.8 + k / 3 + i * 0.2) % 1; return <circle key={k} cx={(x as number) - 12 + k * 12} cy={1010 - kk * 120} r={6 + kk * 6} fill={c as string} opacity={0.6 * (1 - kk)} />; })}
      </g>
    ))}
    {/* tubo EXPERIMENTAL */}
    <g transform="translate(560 1080)">
      <ellipse cx={0} cy={-300} rx={110} ry={24} fill="#9aa0aa" stroke={L} strokeWidth={5} transform={`rotate(${-70 * tuboAberto} -110 -300)`} />
      <rect x={-110} y={-300} width={220} height={300} fill="#c8ffda" opacity={0.55} stroke={L} strokeWidth={5} />
      <circle cx={0} cy={-150} r={150} fill="#7aff9a" opacity={0.12 + 0.06 * Math.sin(t * 4)} />
      <rect x={-90} y={-60} width={180} height={40} rx={6} fill="#f2c94c" stroke={L} strokeWidth={3} />
      <text x={0} y={-32} textAnchor="middle" fontFamily="Arial Black" fontSize={26} fill={L}>EXPERIMENTAL</text>
      <rect x={-130} y={0} width={260} height={20} fill="#6a727e" stroke={L} strokeWidth={4} />
    </g>
    <g transform="translate(860 1080)"><path d="M-30 0 h80 M10 0 v-40 l-30 -70 l18 -10 l30 70" stroke={L} strokeWidth={10} fill="none" /><rect x={-36} y={-130} width={22} height={40} rx={4} fill="#3a3f48" transform="rotate(-25 -25 -110)" /></g>
    <g transform="translate(380 840)"><rect x={-100} y={0} width={200} height={140} rx={8} fill="#2a2a30" stroke={L} strokeWidth={5} /><rect x={-88} y={12} width={176} height={116} fill="#0a2a3a" />{Array.from({ length: 8 }, (_, i) => <g key={i}><circle cx={-60 + i * 17} cy={70 + 30 * Math.sin(i * 0.8 + t * 2)} r={5} fill="#4dff88" /><circle cx={-60 + i * 17} cy={70 - 30 * Math.sin(i * 0.8 + t * 2)} r={5} fill="#3ac0d8" /></g>)}<path d="M0 140 v40" stroke={L} strokeWidth={10} /></g>
    <g transform="translate(940 640)"><path d="M0 -50 L48 30 H-48 z" fill="#f2c94c" stroke={L} strokeWidth={5} strokeLinejoin="round" /><text x={0} y={18} textAnchor="middle" fontFamily="Arial Black" fontSize={44} fill={L}>!</text></g>
    {[0, 1].map((i) => <g key={i} transform={`translate(${740 + i * 150} 960)`}><rect x={-60} y={0} width={120} height={110} fill="none" stroke="#6a727e" strokeWidth={4} />{Array.from({ length: 6 }, (_, j) => <path key={j} d={`M${-60 + j * 24} 0 v110`} stroke="#6a727e" strokeWidth={3} />)}<path d={`M-30 90 q20 ${-10 * Math.sin(t * 5 + i)} 50 0`} stroke="#3ac06a" strokeWidth={10} strokeLinecap="round" fill="none" /></g>)}
    <g transform="translate(60 700)"><path d="M0 0 v20" stroke={L} strokeWidth={6} /><path d="M-40 20 h80 l10 200 h-100 z" fill="#ffffff" stroke={L} strokeWidth={4} /></g>
    <Chao cor="#b8c4cc" linha="#9aa8b0" />
  </Svg>
);

// ---------- Quarto do Téo ----------
export const QuartoTeo = ({ t, manha = true }: { t: number; manha?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill={manha ? '#a8c8e8' : '#2a3a5a'} />
    <rect x={0} y={0} width={1080} height={120} fill={manha ? '#e8e2d0' : '#3a4a6a'} />
    <path d="M0 120 H1080" stroke={L} strokeWidth={6} />
    {/* pôsteres */}
    <g transform="rotate(-4 220 480)"><rect x={120} y={360} width={200} height={260} fill="#1a2a4a" stroke={L} strokeWidth={5} />{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={140 + rnd(i) * 160} cy={380 + rnd(i + 2) * 220} r={3} fill="#fff" />)}<circle cx={250} cy={440} r={30} fill="#f2c94c" /><path d="M150 590 l40 -60 l30 40 l40 -70 l40 90 z" fill="#5a6a8a" /></g>
    <g transform="rotate(5 840 470)"><rect x={760} y={350} width={170} height={230} fill="#f2e86a" stroke={L} strokeWidth={5} /><text x={845} y={440} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#d1495b">ROBÔ</text><rect x={810} y={460} width={70} height={80} rx={8} fill="#9aa0aa" stroke={L} strokeWidth={3} /><circle cx={830} cy={490} r={8} fill="#2f5fa8" /><circle cx={860} cy={490} r={8} fill="#2f5fa8" /></g>
    {/* janela */}
    <rect x={420} y={300} width={240} height={300} fill={manha ? '#fff6c8' : '#1a2040'} stroke="#e8e2d0" strokeWidth={14} />
    <path d="M540 300 v300 M420 450 h240" stroke="#e8e2d0" strokeWidth={8} />
    {manha && <path d="M420 600 L260 1480 H880 L660 600 z" fill="#fff6c8" opacity={0.18} />}
    {/* escrivaninha com computador */}
    <rect x={640} y={1180} width={400} height={30} fill="#8a5a32" stroke={L} strokeWidth={4} />
    <rect x={660} y={1210} width={24} height={270} fill="#6b4224" /><rect x={996} y={1210} width={24} height={270} fill="#6b4224" />
    <rect x={720} y={1000} width={240} height={160} rx={10} fill="#2a2a30" stroke={L} strokeWidth={5} /><rect x={736} y={1016} width={208} height={128} fill={manha ? '#3a6a9a' : '#5a9ad0'} />
    <path d="M840 1160 v20" stroke={L} strokeWidth={10} />
    {/* cama bagunçada */}
    <rect x={30} y={1260} width={480} height={160} rx={20} fill="#3a8a3a" stroke={L} strokeWidth={5} />
    <path d="M60 1260 q120 -40 240 0 q100 30 180 -10" fill="#4aa04a" stroke={L} strokeWidth={4} />
    <rect x={50} y={1220} width={130} height={60} rx={20} fill="#fffaf0" stroke={L} strokeWidth={4} />
    <rect x={80} y={680} width={300} height={16} fill="#8a5a32" stroke={L} strokeWidth={3} />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={90 + i * 26} y={620 - (i % 3) * 8} width={22} height={60 + (i % 3) * 8} fill={['#d1495b', '#2f5fa8', '#f2c94c', '#3a8a3a'][i % 4]} stroke={L} strokeWidth={2} />)}
    <g transform="translate(320 640)"><circle cy={-30} r={14} fill="#9aa0aa" stroke={L} strokeWidth={2} /><rect x={-14} y={-16} width={28} height={40} rx={6} fill="#2f5fa8" stroke={L} strokeWidth={2} /></g>
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={40 + i * 88} cy={170 + 20 * Math.sin(i * 0.9)} r={9} fill={['#ffd166', '#ff8fb0', '#7ad0ff'][i % 3]} opacity={0.6 + 0.4 * Math.sin(t * 3 + i)} />)}
    <path d={`M40 170 ${Array.from({ length: 12 }, (_, i) => `L${40 + i * 88} ${170 + 20 * Math.sin(i * 0.9)}`).join(' ')}`} stroke={L} strokeWidth={2} fill="none" />
    <g transform="translate(980 1180)"><path d="M0 0 v-80 l-50 -30" stroke={L} strokeWidth={6} fill="none" /><path d="M-70 -120 h50 l-10 30 h-30 z" fill="#3ac06a" stroke={L} strokeWidth={3} /></g>
    <g transform="translate(570 1440)"><path d="M0 0 l40 -30 h60 l20 30 z" fill="#d1495b" stroke={L} strokeWidth={3} /><path d="M140 10 q30 -20 60 0 l-10 20 h-40 z" fill="#2f5fa8" stroke={L} strokeWidth={3} /></g>
    <g transform="translate(160 1470) rotate(-8)"><rect x={-90} y={-14} width={180} height={18} rx={9} fill="#5a3a6a" stroke={L} strokeWidth={3} />{[-60, 60].map((d) => <circle key={d} cx={d} cy={10} r={11} fill="#f2c94c" stroke={L} strokeWidth={3} />)}</g>
    <g transform="translate(600 1180)"><path d="M-20 0 L-16 -40 H16 L20 0 z" fill="#c86a4a" stroke={L} strokeWidth={3} />{[-14, 0, 14].map((d, i) => <path key={i} d={`M0 -40 q${d} -40 ${d * 1.4} -70`} stroke="#3a8a3a" strokeWidth={8} fill="none" strokeLinecap="round" />)}</g>
    <Chao />
  </Svg>
);

// ---------- Parede de prédio (escalada) ----------
export const Predio = ({ t, sobe = 0, noite = false }: { t: number; sobe?: number; noite?: boolean }) => {
  const off = (sobe * 900) % 300;
  return (
    <Svg>
      <rect width={1080} height={1920} fill={noite ? '#3a3a52' : '#c8a080'} />
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M0 ${(i * 70 + off) % 2100 - 100} H1080`} stroke={noite ? '#2a2a3a' : '#a8806a'} strokeWidth={3} />)}
      {Array.from({ length: 21 }, (_, i) => {
        const c = i % 3, r = Math.floor(i / 3);
        const x = 90 + c * 340, y = ((r * 300 + off) % 2100) - 200;
        const luz = noite && (i * 7) % 3 === 0;
        return <g key={i}><rect x={x} y={y} width={220} height={180} fill={luz ? '#ffd166' : noite ? '#1a2040' : '#9ad0f0'} stroke="#e8e2d0" strokeWidth={10} opacity={luz ? 0.8 : 1} /><path d={`M${x + 110} ${y} v180`} stroke="#e8e2d0" strokeWidth={6} />{i % 4 === 1 && <rect x={x + 150} y={y + 190} width={90} height={60} fill="#e8e8ee" stroke={L} strokeWidth={4} />}</g>;
      })}
      {Array.from({ length: 4 }, (_, i) => { const y = ((i * 520 + off * 1.7) % 2100) - 100; return <g key={i}><path d={`M${60 + (i % 2) * 520} ${y} q200 30 400 0`} stroke={L} strokeWidth={3} fill="none" />{[0, 1, 2, 3].map((j) => <rect key={j} x={100 + (i % 2) * 520 + j * 80} y={y + 8 + 6 * Math.sin(j)} width={50} height={60} fill={['#d1495b', '#f2c94c', '#5a8ac0', '#fff'][(i + j) % 4]} stroke={L} strokeWidth={2} transform={`rotate(${4 * Math.sin(t * 3 + j)} ${125 + (i % 2) * 520 + j * 80} ${y + 8})`} />)}</g>; })}
      {Array.from({ length: 5 }, (_, i) => { const x = ((t * (80 + i * 20) + i * 300) % 1400) - 160, y = 200 + i * 260 + 30 * Math.sin(t * 2 + i), a = 16 * Math.sin(t * 14 + i); return <path key={i} d={`M${x - 24} ${y - a} Q${x - 10} ${y - 4} ${x} ${y} Q${x + 10} ${y - 4} ${x + 24} ${y - a}`} stroke={L} strokeWidth={4} fill="none" />; })}
    </Svg>
  );
};

// ---------- Ginásio com ringue ----------
export const Ginasio = ({ t, holofote = 1 }: { t: number; holofote?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#1a1622" />
    {/* plateia */}
    {Array.from({ length: 40 }, (_, i) => { const x = (i % 10) * 112 + 40 + (Math.floor(i / 10) % 2) * 50, y = 760 + Math.floor(i / 10) * 70; return <g key={i} transform={`translate(${x} ${y + 6 * Math.abs(Math.sin(t * 6 + i))})`}><circle r={26} fill={['#3a3048', '#4a3a58', '#2a2a40'][i % 3]} /><rect x={-30} y={20} width={60} height={60} rx={20} fill={['#3a3048', '#4a3a58', '#2a2a40'][i % 3]} /></g>; })}
    {/* holofotes */}
    {[200, 880].map((x, i) => <path key={x} d={`M${x} 0 L${540 - 250 + i * 100} 1500 L${540 + 150 + i * 100} 1500 z`} fill="#fff6c8" opacity={0.1 * holofote + 0.04 * Math.sin(t * 3 + i)} />)}
    {/* ringue */}
    <path d="M60 1500 L180 1180 H900 L1020 1500 z" fill="#2f5fa8" stroke={L} strokeWidth={6} />
    <rect x={40} y={1500} width={1000} height={160} fill="#1c3d6e" stroke={L} strokeWidth={6} />
    {[1250, 1330, 1410].map((y, i) => <path key={y} d={`M${150 - i * 30} ${y} H${930 + i * 30}`} stroke={['#d1495b', '#fff', '#d1495b'][i]} strokeWidth={10} />)}
    {[[150, 1180], [930, 1180]].map(([x, y]) => <rect key={x} x={x - 14} y={y} width={28} height={330} fill="#c9ccd4" stroke={L} strokeWidth={4} />)}
    <rect x={0} y={1660} width={1080} height={260} fill="#120e16" />
    {/* placar 3:00 */}
    <rect x={400} y={260} width={280} height={110} rx={10} fill="#0a0a0e" stroke="#c9a14a" strokeWidth={6} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${60 + i * 130} 470 l40 0 l-20 60 z`} fill={['#d1495b', '#f2c94c', '#2f5fa8'][i % 3]} stroke={L} strokeWidth={2} />)}
    <path d="M40 470 H1040" stroke={L} strokeWidth={3} />
    {Array.from({ length: 6 }, (_, i) => { const k = (t * 1.3 + i * 0.37) % 1; return k < 0.08 ? <circle key={i} cx={100 + rnd(i + Math.floor(t * 1.3)) * 880} cy={780 + rnd(i * 3) * 200} r={30} fill="#fff" opacity={0.9} /> : null; })}
    <g transform="translate(980 1180)"><rect x={-40} y={0} width={80} height={60} fill="#6b4224" stroke={L} strokeWidth={3} /><path d="M-30 0 q30 -60 60 0 z" fill="#c9a14a" stroke={L} strokeWidth={3} /></g>
  </Svg>
);
export const Placar = ({ t, t0 }: { t: number; t0: number }) => {
  const s = Math.min(180, Math.max(0, 180 - Math.floor((t - t0) * 6)));
  return <Svg><text x={540} y={345} textAnchor="middle" fontFamily="'Courier New'" fontWeight={900} fontSize={80} fill="#ff4d4d">{`${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`}</text></Svg>;
};

// ---------- Escritório do Seu Arnaldo ----------
export const Escritorio = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#6a5a4a" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 110} 0 V${CHAO_L}`} stroke="#5a4a3a" strokeWidth={8} />)}
    <rect x={720} y={340} width={260} height={320} fill="#c9a06a" stroke={L} strokeWidth={5} />
    <text x={850} y={420} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#d1495b">TORNEIO</text>
    <text x={850} y={480} textAnchor="middle" fontFamily="Arial Black" fontSize={28} fill={L}>3 MIN</text>
    <text x={850} y={560} textAnchor="middle" fontFamily="Arial Black" fontSize={44} fill="#3a8a3a">R$ 1.000</text>
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${130 + i * 90} 420)`}><rect x={-20} y={40} width={40} height={30} fill="#8a5a32" /><path d="M-26 -10 h52 q0 50 -26 50 q-26 0 -26 -50 z" fill="#e8c240" stroke={L} strokeWidth={3} /></g>)}
    <rect x={80} y={480} width={300} height={16} fill="#6b4224" />
    <g transform={`translate(160 300)`}><circle r={60} fill="#c9ccd4" stroke={L} strokeWidth={4} /><g transform={`rotate(${t * 600})`}>{[0, 120, 240].map((a) => <ellipse key={a} cx={0} cy={-30} rx={14} ry={30} fill="#9aa0aa" transform={`rotate(${a})`} />)}</g><circle r={10} fill={L} /></g>
    <rect x={100} y={1120} width={880} height={50} fill="#8a5a32" stroke={L} strokeWidth={5} />
    <rect x={130} y={1170} width={820} height={310} fill="#6b4224" stroke={L} strokeWidth={5} />
    <rect x={200} y={1070} width={140} height={50} fill="#3a8a3a" stroke={L} strokeWidth={3} /><rect x={210} y={1060} width={140} height={50} fill="#4aa04a" stroke={L} strokeWidth={3} />
    <rect x={640} y={1050} width={160} height={70} rx={8} fill="#5a626e" stroke={L} strokeWidth={4} /><circle cx={720} cy={1085} r={10} fill="#c9a14a" />
    <g transform="translate(470 360)"><rect x={-80} y={0} width={160} height={180} fill="#fffaf0" stroke={L} strokeWidth={4} /><rect x={-80} y={0} width={160} height={40} fill="#d1495b" /><text x={0} y={30} textAnchor="middle" fontFamily="Arial Black" fontSize={26} fill="#fff">MAIO</text>{Array.from({ length: 12 }, (_, i) => <rect key={i} x={-66 + (i % 4) * 34} y={56 + Math.floor(i / 4) * 36} width={26} height={26} fill={i === 6 ? '#d1495b' : '#e8e2d0'} />)}</g>
    {[[80, 700], [230, 720]].map(([x, y], i) => <g key={i} transform={`rotate(${i ? 4 : -3} ${x} ${y})`}><rect x={x} y={y} width={120} height={150} fill="#e8e2d0" stroke="#3a2a1a" strokeWidth={6} /><circle cx={x + 60} cy={y + 60} r={26} fill="#c9a06a" /><rect x={x + 30} y={y + 90} width={60} height={50} fill="#d1495b" /></g>)}
    <g transform="translate(990 1220)"><rect x={-70} y={0} width={140} height={260} fill="#7a828e" stroke={L} strokeWidth={4} />{[0, 1, 2].map((i) => <g key={i}><rect x={-60} y={10 + i * 84} width={120} height={74} fill="#8a929e" stroke={L} strokeWidth={3} /><rect x={-20} y={40 + i * 84} width={40} height={10} fill="#3a3f48" /></g>)}</g>
    <text x={540} y={250} textAnchor="middle" fontFamily="Arial Black" fontSize={60} fill="#ff4d8a" opacity={0.6 + 0.4 * (Math.sin(t * 9) > -0.6 ? 1 : 0)} style={{ filter: 'drop-shadow(0 0 12px #ff4d8a)' }}>LUTA!</text>
    <Chao cor="#4a3a2a" linha="#3a2a1a" />
  </Svg>
);

// ---------- Feira (barraca de frutas da Vó Lurdes) ----------
export const Feira = ({ t, caida = 0 }: { t: number; caida?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#9ad0f0" />
    {[0, 1, 2].map((i) => { const x = ((i * 420 + t * 15) % 1500) - 200; return <g key={i} fill="#fff" opacity={0.85}><ellipse cx={x} cy={200 + i * 120} rx={120} ry={40} /><ellipse cx={x + 70} cy={180 + i * 120} rx={80} ry={36} /></g>; })}
    {[[0, 380], [200, 300], [700, 420], [880, 340]].map(([x, h], i) => <rect key={i} x={x} y={1100 - h} width={200} height={h} fill={['#e8c8a0', '#c8d8e8', '#f0d0c0', '#d8e8c8'][i]} stroke={L} strokeWidth={4} />)}
    <rect x={0} y={1100} width={1080} height={380} fill="#c9c2b0" />
    {[[40, '#3a8a3a'], [760, '#2f5fa8']].map(([x, c], i) => <g key={i}><path d={`M${x} 980 h280 l-20 50 h-240 z`} fill={c as string} stroke={L} strokeWidth={4} /><rect x={(x as number) + 20} y={1030} width={240} height={70} fill="#c9a06a" stroke={L} strokeWidth={3} />{Array.from({ length: 6 }, (_, j) => i ? <ellipse key={j} cx={(x as number) + 50 + j * 36} cy={1024} rx={20} ry={14} fill="#3a8a3a" stroke={L} strokeWidth={2} /> : <path key={j} d={`M${(x as number) + 40 + j * 38} 1030 q10 -40 30 -36`} stroke="#f2c94c" strokeWidth={12} fill="none" strokeLinecap="round" />)}</g>)}
    <path d="M0 760 Q540 840 1080 760" stroke={L} strokeWidth={3} fill="none" />
    {Array.from({ length: 12 }, (_, i) => { const x = 40 + i * 90, y = 760 + 80 * 4 * (x / 1080) * (1 - x / 1080) * 0.95; return <path key={i} d={`M${x - 18} ${y} h36 l-18 ${40 + 4 * Math.sin(t * 4 + i)} z`} fill={['#d1495b', '#f2c94c', '#2f5fa8', '#3a8a3a'][i % 4]} stroke={L} strokeWidth={2} />; })}
    {[0, 1, 2].map((i) => { const x = 140 + i * 330 + 20 * Math.sin(t + i); return <g key={i} transform={`translate(${x} 1460)`}><ellipse rx={20} ry={13} fill="#8a8a9a" stroke={L} strokeWidth={3} /><circle cx={16} cy={-12} r={8} fill="#8a8a9a" stroke={L} strokeWidth={3} /></g>; })}
    {/* barraca */}
    <g transform={`translate(540 1480) rotate(${-40 * caida}) translate(-540 -1480)`}>
      <path d="M180 820 H900 L860 900 H220 z" fill="#d1495b" stroke={L} strokeWidth={5} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${240 + i * 120} 820 l-10 80 h60 l10 -80`} fill="#fffaf0" />)}
      {[240, 840].map((x) => <rect key={x} x={x - 8} y={900} width={16} height={580} fill="#6b4224" stroke={L} strokeWidth={3} />)}
      <rect x={220} y={1180} width={640} height={30} fill="#8a5a32" stroke={L} strokeWidth={4} />
      {caida < 0.5 && [0, 1, 2].map((i) => <g key={i}><rect x={250 + i * 200} y={1110} width={180} height={70} fill="#c9a06a" stroke={L} strokeWidth={4} />{Array.from({ length: 5 }, (_, j) => <circle key={j} cx={275 + i * 200 + j * 32} cy={1100} r={18} fill={['#f28c28', '#e5484d', '#f2c94c'][i]} stroke={L} strokeWidth={2} />)}</g>)}
      {caida < 0.5 && ['R$ 3', 'R$ 5', 'R$ 2'].map((p, i) => <g key={i}><rect x={290 + i * 200} y={1188} width={90} height={34} fill="#fffaf0" stroke={L} strokeWidth={3} /><text x={335 + i * 200} y={1214} textAnchor="middle" fontFamily="Arial Black" fontSize={22} fill="#d1495b">{p}</text></g>)}
      <rect x={430} y={950} width={220} height={60} rx={6} fill="#fffaf0" stroke={L} strokeWidth={4} />
      <text x={540} y={992} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#3a8a3a">VÓ LURDES</text>
    </g>
    {caida > 0.3 && Array.from({ length: 16 }, (_, i) => <circle key={i} cx={200 + rnd(i) * 700} cy={1500 + rnd(i + 3) * 200} r={20} fill={['#f28c28', '#e5484d', '#f2c94c'][i % 3]} stroke={L} strokeWidth={2} />)}
    {caida > 0.3 && [0, 1].map((i) => <rect key={i} x={260 + i * 380} y={1560 + i * 60} width={180} height={70} fill="#c9a06a" stroke={L} strokeWidth={4} transform={`rotate(${i ? 20 : -15} ${350 + i * 380} 1600)`} />)}
    <Chao cor="#8a8a92" linha="#6a6a72" />
  </Svg>
);

// ---------- Hospital ----------
export const Hospital = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#cfe0dc" />
    <rect x={640} y={300} width={300} height={360} fill="#1a2040" stroke="#e8e8ee" strokeWidth={14} />
    <circle cx={850} cy={390} r={36} fill="#f4efd8" />
    <path d="M790 300 v360 M640 480 h300" stroke="#e8e8ee" strokeWidth={8} />
    {/* monitor cardíaco */}
    <g transform="translate(160 640)">
      <rect x={-20} y={0} width={240} height={170} rx={12} fill="#2a2a30" stroke={L} strokeWidth={5} />
      <path d={`M0 90 ${Array.from({ length: 20 }, (_, i) => { const x = i * 10; const ph = ((x / 200 + t * 0.8) % 1); return `L${x} ${ph > 0.45 && ph < 0.5 ? 30 : ph > 0.5 && ph < 0.55 ? 140 : 90}`; }).join(' ')}`} stroke="#4dff88" strokeWidth={5} fill="none" />
      <path d="M100 170 v330" stroke="#9aa0aa" strokeWidth={10} />
    </g>
    {/* soro */}
    <g><path d="M560 300 v900" stroke="#9aa0aa" strokeWidth={10} /><path d="M520 300 h80" stroke="#9aa0aa" strokeWidth={8} /><rect x={530} y={310} width={60} height={110} rx={14} fill="#dff1fb" stroke={L} strokeWidth={3} /></g>
    {/* cama */}
    <rect x={120} y={1180} width={840} height={60} rx={14} fill="#fffaf0" stroke={L} strokeWidth={5} />
    <rect x={120} y={1240} width={840} height={120} fill="#9fc6c8" stroke={L} strokeWidth={5} />
    <rect x={100} y={1040} width={40} height={440} rx={10} fill="#c9ccd4" stroke={L} strokeWidth={4} />
    <rect x={940} y={1120} width={40} height={360} rx={10} fill="#c9ccd4" stroke={L} strokeWidth={4} />
    <path d={`M960 260 v900 q-40 -20 -60 0 v-900 z`} fill="#9fc6c8" opacity={0.6} />
    {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={930 + (i % 2) * 20} cy={270 + i * 6} r={6} fill="#9aa0aa" />)}
    <g transform="translate(860 1100)"><rect x={-50} y={0} width={100} height={80} fill="#e8e2d0" stroke={L} strokeWidth={4} /><path d="M-24 0 L-18 -60 H18 L24 0 z" fill="#bfe6ff" opacity={0.7} stroke={L} strokeWidth={3} />{[-16, 0, 16].map((d, i) => <g key={i}><path d={`M0 -60 q${d} -40 ${d * 1.5} -70`} stroke="#3a8a3a" strokeWidth={4} fill="none" /><circle cx={d * 1.5} cy={-130} r={12} fill={['#f2c94c', '#e86aa0', '#d1495b'][i]} stroke={L} strokeWidth={2} /></g>)}<g transform="translate(-10 20) rotate(-8)"><rect x={-30} y={-20} width={60} height={40} fill="#f2a0c0" stroke={L} strokeWidth={2} /><path d="M-6 0 q6 -8 12 0 q-6 8 -12 0" fill="#d1495b" /></g></g>
    <g transform="translate(130 1290) rotate(-6)"><rect x={-40} y={-60} width={80} height={110} fill="#fffaf0" stroke={L} strokeWidth={3} /><rect x={-16} y={-68} width={32} height={14} fill="#9aa0aa" /><path d="M-26 -30 h52 M-26 -10 h40 M-26 10 h48" stroke="#6a5a4a" strokeWidth={3} /></g>
    <Chao cor="#a8b8b4" linha="#8a9a96" />
  </Svg>
);

// ---------- Costura (máquina de costura da avó) ----------
export const Costura = ({ t, pronta = 0 }: { t: number; pronta?: number }) => {
  const ag = 14 * Math.abs(Math.sin(t * 22));
  return (
    <Svg>
      <rect width={1080} height={1920} fill="#5a4a6a" />
      <path d="M540 0 v240" stroke={L} strokeWidth={4} /><path d="M470 240 h140 l-30 50 h-80 z" fill="#f2c94c" stroke={L} strokeWidth={4} />
      <path d="M500 290 L200 1180 H880 L580 290 z" fill="#fff6c8" opacity={0.15} />
      <rect x={60} y={1180} width={960} height={40} fill="#8a5a32" stroke={L} strokeWidth={5} />
      <rect x={90} y={1220} width={30} height={260} fill="#6b4224" /><rect x={960} y={1220} width={30} height={260} fill="#6b4224" />
      {/* máquina */}
      <g transform="translate(560 1180)">
        <rect x={-260} y={-50} width={520} height={50} rx={10} fill="#1a1a1e" stroke={L} strokeWidth={5} />
        <path d="M-220 -50 V-300 H180 Q240 -300 240 -240 V-120 H140 V-200 H-120 V-50 z" fill="#2a2a30" stroke={L} strokeWidth={5} />
        <text x={-40} y={-240} textAnchor="middle" fontFamily="Georgia" fontStyle="italic" fontSize={36} fill="#c9a14a">Lurdes</text>
        <path d={`M190 -120 v${40 + ag}`} stroke="#c9ccd4" strokeWidth={6} />
        <circle cx={-180} cy={-200} r={50} fill="#c9a14a" stroke={L} strokeWidth={5} transform={`rotate(${t * 400} -180 -200)`} />
        <path d={`M-180 -200 l${40 * Math.cos(t * 7)} ${40 * Math.sin(t * 7)}`} stroke={L} strokeWidth={6} />
      </g>
      {/* tecido verde virando máscara */}
      <g transform="translate(700 1150)">
        <path d={`M-200 0 Q-100 ${-30 - 40 * pronta} 0 -20 Q100 ${-40 - 20 * pronta} 200 0 L180 30 H-180 z`} fill="#3ac06a" stroke={L} strokeWidth={4} />
        {pronta > 0.5 && [-50, 50].map((d) => <ellipse key={d} cx={d - 60} cy={-10} rx={26} ry={18} fill="#fff" stroke={L} strokeWidth={3} />)}
        <path d="M-180 10 h360" stroke="#1a6a3a" strokeWidth={3} strokeDasharray={`12 10`} strokeDashoffset={-t * 60} />
      </g>
      <rect x={60} y={420} width={260} height={300} fill="#8a5a32" stroke={L} strokeWidth={4} />
      {Array.from({ length: 15 }, (_, i) => <g key={i} transform={`translate(${90 + (i % 5) * 50} ${460 + Math.floor(i / 5) * 90})`}><rect x={-14} y={-26} width={28} height={8} fill="#6b4224" /><rect x={-11} y={-18} width={22} height={34} fill={['#d1495b', '#3ac06a', '#2f5fa8', '#f2c94c', '#f28fb0'][i % 5]} stroke={L} strokeWidth={2} /><rect x={-14} y={16} width={28} height={8} fill="#6b4224" /></g>)}
      {[0, 1, 2].map((i) => <rect key={i} x={760 + i * 80} y={400 + i * 10} width={60} height={320} rx={28} fill={['#3ac06a', '#5a8ac0', '#e8a0b8'][i]} stroke={L} strokeWidth={4} />)}
      <g transform="translate(860 860) rotate(-4)"><rect x={-70} y={-55} width={140} height={110} fill="#c9a14a" stroke={L} strokeWidth={4} /><rect x={-58} y={-43} width={116} height={86} fill="#f2e6d0" /><circle cx={-24} cy={-6} r={16} fill="#c98a5a" /><circle cx={24} cy={0} r={14} fill="#e8c09a" /><path d="M-40 43 q16 -30 32 0 M8 43 q16 -26 32 0" fill="#e8a0b8" /></g>
      <path d={`M120 1180 q80 ${20 + 6 * Math.sin(t)} 160 0 q80 -20 160 10`} stroke="#f2c94c" strokeWidth={14} fill="none" />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${130 + i * 40} 1176 v10`} stroke={L} strokeWidth={2} />)}
      <Chao cor="#4a3a3a" linha="#3a2a2a" />
    </Svg>
  );
};

// ---------- Telhado da cidade à noite ----------
export const Telhado = ({ t, grafite = false }: { t: number; grafite?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#141a33" />
    {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 3) * 700} r={2} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t + i))} />)}
    <circle cx={830} cy={260} r={90} fill="#f4efd8" /><circle cx={860} cy={240} r={90} fill="#141a33" opacity={0.25} />
    {/* prédios ao fundo */}
    {Array.from({ length: 9 }, (_, i) => { const h = 400 + rnd(i) * 500, x = i * 125 - 20; return <g key={i}><rect x={x} y={1300 - h} width={120} height={h} fill={i % 2 ? '#222a48' : '#2a3254'} />{Array.from({ length: Math.floor(h / 60) * 2 }, (_, j) => <rect key={j} x={x + 18 + (j % 2) * 50} y={1300 - h + 20 + Math.floor(j / 2) * 60} width={30} height={30} fill="#ffd166" opacity={(i * 13 + j * 7) % 5 < 2 ? 0.75 : 0.08} />)}</g>; })}
    {/* telhado em primeiro plano */}
    <rect x={0} y={1300} width={1080} height={620} fill="#3a3a48" />
    <rect x={0} y={1290} width={1080} height={30} fill="#5a5a68" stroke={L} strokeWidth={4} />
    <g transform="translate(860 1300)"><rect x={-90} y={-260} width={180} height={200} rx={20} fill="#6a6a78" stroke={L} strokeWidth={5} /><path d="M-70 -60 v60 M70 -60 v60" stroke="#4a4a58" strokeWidth={12} /></g>
    <path d="M160 1300 V980 M120 1020 h80 M130 1060 h60" stroke="#6a6a78" strokeWidth={8} />
    <circle cx={160} cy={976} r={8} fill="#ff3b3b" opacity={Math.sin(t * 4) > 0 ? 1 : 0.2} />
    {grafite && <text x={540} y={1560} textAnchor="middle" fontFamily="Arial Black" fontSize={110} fill="#3ac06a" opacity={0.85} transform="rotate(-6 540 1560)">LAGARTIXA</text>}
    {[0, 1].map((i) => { const x = ((t * 20 + i * 600) % 1500) - 300; return <g key={i} fill="#2a3058" opacity={0.85}><ellipse cx={x} cy={300 + i * 80} rx={160} ry={40} /><ellipse cx={x + 90} cy={280 + i * 80} rx={100} ry={36} /></g>; })}
    <g transform="translate(400 1300)"><path d="M0 0 v-120" stroke="#6a6a78" strokeWidth={10} /><ellipse cx={0} cy={-150} rx={70} ry={40} fill="#c9ccd4" stroke={L} strokeWidth={5} transform="rotate(-25 0 -150)" /><path d="M0 -150 l40 -30" stroke={L} strokeWidth={4} /></g>
    <g transform="translate(620 840)"><rect x={-150} y={0} width={300} height={150} fill="#f2c94c" stroke={L} strokeWidth={6} /><text x={0} y={70} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#d1495b">SUCO DA</text><text x={0} y={120} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#d1495b">VÓ LURDES</text>{[-100, 100].map((d) => <path key={d} d={`M${d} 150 v160`} stroke="#3a3a48" strokeWidth={10} />)}</g>
    <path d="M560 1290 q120 40 240 0" stroke={L} strokeWidth={3} fill="none" />
    {[0, 1, 2].map((i) => <rect key={i} x={590 + i * 70} y={1298 + (i === 1 ? 8 : 0)} width={46} height={56} fill={['#3ac06a', '#fffaf0', '#d1495b'][i]} stroke={L} strokeWidth={2} transform={`rotate(${4 * Math.sin(t * 2 + i)} ${613 + i * 70} 1300)`} />)}
    <Poeira t={t} n={20} cor="#cfd8f0" op={0.3} />
  </Svg>
);

// ---------- Rua à noite ----------
export const RuaNoite = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#1a1e33" />
    {Array.from({ length: 5 }, (_, i) => <g key={i}><rect x={i * 220 - 20} y={600 - (i % 2) * 120} width={210} height={900} fill={i % 2 ? '#2a2f48' : '#323858'} stroke={L} strokeWidth={4} />{Array.from({ length: 8 }, (_, j) => <rect key={j} x={i * 220 + 10 + (j % 2) * 90} y={650 - (i % 2) * 120 + Math.floor(j / 2) * 160} width={60} height={90} fill="#ffd166" opacity={(i + j) % 3 === 0 ? 0.7 : 0.1} />)}</g>)}
    {[[120, 980, 'PADARIA', '#ffcf6a'], [560, 900, 'FARMÁCIA', '#4dff88'], [880, 1000, 'BAR', '#ff4d8a']].map(([x, y, txt, c], i) => <g key={i}><rect x={(x as number) - 110} y={y as number} width={220} height={60} rx={8} fill="#1a1a1e" stroke={L} strokeWidth={4} /><text x={x as number} y={(y as number) + 42} textAnchor="middle" fontFamily="Arial Black" fontSize={32} fill={c as string} opacity={0.7 + 0.3 * (Math.sin(t * 7 + i * 2) > -0.7 ? 1 : 0)} style={{ filter: `drop-shadow(0 0 10px ${c})` }}>{txt}</text></g>)}
    <g transform="translate(1000 1440)"><rect x={-40} y={-80} width={80} height={90} fill="#3a6a5a" stroke={L} strokeWidth={4} /><rect x={-46} y={-90} width={92} height={16} rx={4} fill="#2a5a4a" stroke={L} strokeWidth={3} /></g>
    <g transform={`translate(${760 + 8 * Math.sin(t)} 1150)`}><ellipse rx={30} ry={18} fill="#1a1a1e" /><circle cx={26} cy={-14} r={14} fill="#1a1a1e" /><path d="M18 -26 l4 -10 l6 10 M30 -26 l4 -10 l6 10" fill="#1a1a1e" /><circle cx={24} cy={-15} r={3} fill="#f2e86a" /><circle cx={32} cy={-15} r={3} fill="#f2e86a" /><path d={`M-30 0 q-20 ${-20 + 8 * Math.sin(t * 3)} -10 -40`} stroke="#1a1a1e" strokeWidth={6} fill="none" /></g>
    <rect x={0} y={1480} width={1080} height={440} fill="#2e2e36" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={((i * 200 - t * 300) % 1200 + 1200) % 1200 - 100} y={1680} width={110} height={16} fill="#e8e2c8" opacity={0.7} />)}
    {[[240, 1800], [760, 1580]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={110} ry={20} fill="#4a5a8a" opacity={0.4 + 0.1 * Math.sin(t * 2 + i)} />)}
    {[150, 930].map((x) => <g key={x}><rect x={x - 7} y={1080} width={14} height={400} fill="#1a1a1e" /><path d={`M${x - 26} 1080 h52 l-10 -40 h-32 z`} fill="#1a1a1e" /><circle cx={x} cy={1060} r={14} fill="#ffcf6a" /><path d={`M${x - 26} 1080 L${x - 140} 1480 H${x + 140} L${x + 26} 1080 z`} fill="#ffcf6a" opacity={0.1} /></g>)}
  </Svg>
);
