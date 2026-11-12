// Cenários de "O Homem de Lata": cidade com a torre da LimaTech, drones, estúdio de TV, estrada, mina abandonada,
// oficina na caverna, coletiva de imprensa, laboratório no porão e o telhado com o letreiro e o gerador.
import { L, Svg } from './cenarios';
import { Poeira } from './cenarios-ilha';

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const clamp = (x: number) => Math.min(1, Math.max(0, x));
export const CHAO_T = 1480;

// ---------- Objetos ----------
export const Drone = ({ x, y, s = 1, t }: { x: number; y: number; s?: number; t: number }) => (
  <g transform={`translate(${x} ${y + 6 * Math.sin(t * 4 + x)}) scale(${s})`}>
    {[-1, 1].map((sd) => <g key={sd}><path d={`M0 0 L${sd * 70} -14`} stroke={L} strokeWidth={8} /><ellipse cx={sd * 70} cy={-20} rx={34} ry={5} fill="#9aa0aa" opacity={0.7} transform={`rotate(${(t * 2000) % 360 > 180 ? 8 : -8} ${sd * 70} -20)`} /></g>)}
    <rect x={-34} y={-14} width={68} height={30} rx={10} fill="#3a3f48" stroke={L} strokeWidth={4} />
    <circle cx={0} cy={22} r={10} fill="#d1283b" stroke={L} strokeWidth={3} />
    <text x={0} y={7} textAnchor="middle" fontFamily="Arial Black" fontSize={14} fill="#f2c94c">LT</text>
  </g>
);
export const Bobina = ({ x, y, r = 60, t, cor = '#5ad8ff', forca = 1 }: { x: number; y: number; r?: number; t: number; cor?: string; forca?: number }) => (
  <g transform={`translate(${x} ${y})`} opacity={forca}>
    <circle r={r * 2} fill={cor} opacity={0.18 + 0.06 * Math.sin(t * 8)} />
    <circle r={r} fill="#f4f4f4" stroke={L} strokeWidth={5} />
    <circle r={r * 0.75} fill={cor} />
    <g transform={`rotate(${t * 300})`}>{Array.from({ length: 10 }, (_, i) => <rect key={i} x={-4} y={-r * 0.95} width={8} height={r * 0.28} fill="#c87a3a" transform={`rotate(${i * 36})`} />)}</g>
    <circle r={r * 0.3} fill="#fff" />
  </g>
);
export const Bateria = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-80} y={-60} width={160} height={110} rx={8} fill="#2a2a30" stroke={L} strokeWidth={5} />
    <rect x={-80} y={-60} width={160} height={26} fill="#d1495b" />
    {[-44, 44].map((d, i) => <rect key={d} x={d - 12} y={-80} width={24} height={20} fill={i ? '#d1495b' : '#3a3a3a'} stroke={L} strokeWidth={3} />)}
    <text x={0} y={20} textAnchor="middle" fontFamily="Arial Black" fontSize={28} fill="#f2c94c">12V</text>
  </g>
);
export const Caixa = ({ x, y, s = 1, logo = true }: { x: number; y: number; s?: number; logo?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-90} y={-70} width={180} height={140} fill="#6a6a52" stroke={L} strokeWidth={5} />
    <path d="M-90 -40 h180 M-90 40 h180" stroke="#4a4a3a" strokeWidth={6} />
    {logo && <><rect x={-60} y={-20} width={120} height={40} fill="#f2c94c" stroke={L} strokeWidth={3} /><text x={0} y={10} textAnchor="middle" fontFamily="Arial Black" fontSize={22} fill={L}>LIMATECH</text></>}
  </g>
);
export const Chamas = ({ x, y, t, s = 1 }: { x: number; y: number; t: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => { const h = 90 + 30 * Math.sin(t * 30 + i * 2); return <path key={i} d={`M${-26 + i * 26} 0 q${-14} ${h * 0.5} 0 ${h} q14 ${-h * 0.5} 0 ${-h}`} fill={i === 1 ? '#fff3a0' : '#ff8a3a'} opacity={0.9} />; })}
    <ellipse rx={50} ry={20} fill="#ffcf6a" opacity={0.5} />
  </g>
);
export const Faiscas = ({ x, y, t, n = 14, cor = '#ffd166' }: { x: number; y: number; t: number; n?: number; cor?: string }) => (
  <>
    {Array.from({ length: n }, (_, i) => { const k = (t * 3 + rnd(i)) % 1, a = rnd(i + 4) * Math.PI * 2; return <path key={i} d={`M${x + Math.cos(a) * k * 200} ${y + Math.sin(a) * k * 200 + k * k * 120} l${Math.cos(a) * 16} ${Math.sin(a) * 16}`} stroke={i % 2 ? cor : '#fff'} strokeWidth={6} strokeLinecap="round" opacity={1 - k} />; })}
  </>
);
export const Explosao = ({ x, y, k, s = 1 }: { x: number; y: number; k: number; s?: number }) => (
  k <= 0 || k >= 1 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s * (0.4 + k)})`} opacity={1 - k}>
      <path d={Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, r = i % 2 ? 120 : 220; return `${i ? 'L' : 'M'}${Math.cos(a) * r} ${Math.sin(a) * r}`; }).join(' ') + 'z'} fill="#ff8a3a" stroke={L} strokeWidth={6} />
      <circle r={110} fill="#ffd166" /><circle r={60} fill="#fff6c8" />
    </g>
  )
);
export const Suv = ({ x, y, s = 1, t }: { x: number; y: number; s?: number; t: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-220 -20 L-200 -110 L-110 -110 L-70 -190 H120 L170 -110 L230 -100 L240 -20 z" fill="#1a1a1e" stroke={L} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-60 -180 L-90 -116 H20 V-180 z M34 -180 V-116 H150 L116 -180 z" fill="#5a6a8a" stroke={L} strokeWidth={3} />
    {[-140, 150].map((w) => <g key={w}><circle cx={w} cy={-10} r={46} fill="#2a2a30" stroke={L} strokeWidth={5} /><circle cx={w} cy={-10} r={18} fill="#9aa0aa" transform={`rotate(${t * 400} ${w} -10)`} /></g>)}
    <rect x={200} y={-90} width={30} height={20} fill="#fff6c8" />
  </g>
);

// ---------- Cidade com a torre da LimaTech ----------
export const Cidade = ({ t, noite = false, drones = 0 }: { t: number; noite?: boolean; drones?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill={noite ? '#141a33' : '#8ac8f0'} />
    {!noite && [0, 1, 2].map((i) => { const x = ((i * 420 + t * 18) % 1500) - 200; return <g key={i} fill="#fff" opacity={0.9}><ellipse cx={x} cy={200 + i * 130} rx={120} ry={40} /><ellipse cx={x + 70} cy={176 + i * 130} rx={80} ry={36} /></g>; })}
    {noite && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 3) * 600} r={2} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t + i))} />)}
    {Array.from({ length: 8 }, (_, i) => { const h = 380 + rnd(i) * 400, x = i * 140 - 20; return <g key={i}><rect x={x} y={1400 - h} width={130} height={h} fill={noite ? '#222a48' : i % 2 ? '#a8b8c8' : '#98a8bc'} stroke={L} strokeWidth={3} />{Array.from({ length: Math.floor(h / 60) * 2 }, (_, j) => <rect key={j} x={x + 18 + (j % 2) * 54} y={1400 - h + 22 + Math.floor(j / 2) * 60} width={38} height={34} fill={noite ? '#ffd166' : '#dff1fb'} opacity={noite ? ((i * 13 + j * 7) % 5 < 2 ? 0.8 : 0.1) : 0.7} />)}</g>; })}
    {/* torre LimaTech */}
    <rect x={360} y={420} width={360} height={1000} fill={noite ? '#2a3a5a' : '#cfe0ec'} stroke={L} strokeWidth={6} />
    {Array.from({ length: 16 }, (_, i) => <rect key={i} x={380} y={460 + i * 58} width={320} height={40} fill={noite ? '#3a5a8a' : '#9ad0f0'} opacity={0.8} />)}
    <rect x={330} y={330} width={420} height={90} rx={10} fill="#1a1a1e" stroke={L} strokeWidth={5} />
    <text x={540} y={392} textAnchor="middle" fontFamily="Arial Black" fontSize={58} fill="#f2c94c" letterSpacing={3}>LIMATECH</text>
    <path d="M540 330 V200" stroke={L} strokeWidth={8} /><circle cx={540} cy={196} r={14} fill="#ff3b3b" opacity={Math.sin(t * 4) > 0 ? 1 : 0.25} />
    <path d="M420 330 L440 290 H640 L660 330 z" fill="#5a6a7a" stroke={L} strokeWidth={4} />
    <g transform="translate(860 860)"><rect x={-110} y={-80} width={220} height={150} fill="#fffaf0" stroke={L} strokeWidth={5} /><text x={0} y={-24} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#d1283b">LIMATECH</text><text x={0} y={22} textAnchor="middle" fontFamily="Arial Black" fontSize={22} fill={L}>O FUTURO VOA</text><Drone x={0} y={50} s={0.5} t={t} />{[-80, 80].map((d) => <path key={d} d={`M${d} 70 v330`} stroke="#3a3a44" strokeWidth={10} />)}</g>
    {!noite && Array.from({ length: 5 }, (_, i) => { const x = ((t * (50 + i * 10) + i * 240) % 1300) - 120, y = 140 + i * 60 + 20 * Math.sin(t * 2 + i), a = 12 * Math.sin(t * 12 + i); return <path key={i} d={`M${x - 20} ${y - a} Q${x - 8} ${y - 4} ${x} ${y} Q${x + 8} ${y - 4} ${x + 20} ${y - a}`} stroke={L} strokeWidth={4} fill="none" />; })}
    <rect x={0} y={1400} width={1080} height={520} fill={noite ? '#2a2a34' : '#6a6a76'} />
    <rect x={0} y={1400} width={1080} height={50} fill={noite ? '#3a3a44' : '#9a9aa6'} stroke={L} strokeWidth={3} />
    {[90, 990].map((x, i) => <g key={x}><rect x={x - 12} y={1300} width={24} height={110} fill="#6b4224" /><circle cx={x} cy={1270} r={70} fill="#4a8a3a" stroke={L} strokeWidth={4} /><circle cx={x + (i ? -30 : 30)} cy={1230} r={44} fill="#5aa04a" stroke={L} strokeWidth={4} /></g>)}
    {[260, 820].map((x) => <g key={x}><rect x={x - 6} y={1180} width={12} height={240} fill="#2a2a30" /><path d={`M${x} 1180 h40`} stroke="#2a2a30" strokeWidth={8} /><circle cx={x + 40} cy={1190} r={12} fill={noite ? '#ffcf6a' : '#fff6c8'} /></g>)}
    {[0, 1].map((i) => { const x = ((t * (260 + i * 120) + i * 600) % 1600) - 300; return <g key={i} transform={`translate(${i ? 1080 - x : x} ${1740 + i * 90}) scale(${i ? -1 : 1} 1)`}><path d="M-110 0 L-100 -50 L-50 -50 L-26 -90 H60 L90 -50 L120 -44 L124 0 z" fill={['#d1495b', '#3a6ad8'][i]} stroke={L} strokeWidth={4} /><path d="M-20 -84 L-40 -54 H10 V-84 z M20 -84 V-54 H76 L56 -84 z" fill="#bfe6ff" />{[-66, 76].map((w) => <circle key={w} cx={w} cy={0} r={22} fill="#1a1a1e" stroke={L} strokeWidth={3} />)}</g>; })}
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 200 + 40} y={1640} width={110} height={16} fill="#e8e2c8" opacity={0.7} />)}
    {Array.from({ length: drones }, (_, i) => <Drone key={i} x={((t * (90 + i * 20) + i * 280) % 1400) - 160} y={560 + i * 170} s={0.9} t={t} />)}
  </Svg>
);

// ---------- Estúdio de TV ----------
export const EstudioTV = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#1a1a2a" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M540 700 L${i * 100 - 50} 0`} stroke="#2a2a44" strokeWidth={40} opacity={0.6} />)}
    <rect x={60} y={320} width={960} height={1100} rx={30} fill="#0a0a12" stroke="#3a3a4a" strokeWidth={20} />
    <rect x={90} y={350} width={900} height={1040} rx={14} fill="#2f5fa8" />
    {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={150 + i * 110} cy={560 + 80 * Math.sin(t + i)} r={50} fill="#5a8ac0" opacity={0.4} />)}
    <rect x={90} y={1220} width={900} height={110} fill="#d1283b" />
    <text x={130} y={1294} fontFamily="Arial Black" fontSize={52} fill="#fff">AO VIVO</text>
    <rect x={430} y={1240} width={540} height={70} fill="#fff" />
    <text x={700} y={1290} textAnchor="middle" fontFamily="Arial Black" fontSize={36} fill="#d1283b">O GÊNIO DOS DRONES</text>
    <circle cx={950} cy={400} r={14} fill="#ff3b3b" opacity={Math.sin(t * 5) > 0 ? 1 : 0.3} />
    <rect x={90} y={1330} width={900} height={50} fill="#1a1a2a" />
    <text x={1000 - ((t * 160) % 1600)} y={1366} fontFamily="Arial Black" fontSize={30} fill="#f2c94c">LIMATECH LANÇA NOVO DRONE • AÇÕES SOBEM 20% • VICENTE LIMA NA CAPA DA REVISTA •</text>
    {[0, 1].map((i) => <g key={i} transform={`translate(${i ? 1000 : 80} 1560) scale(${i ? -1 : 1} 1)`}><rect x={-40} y={-120} width={140} height={90} rx={10} fill="#2a2a30" stroke={L} strokeWidth={4} /><circle cx={110} cy={-75} r={30} fill="#3a3a44" stroke={L} strokeWidth={4} /><circle cx={110} cy={-75} r={14} fill="#5a8ac0" /><path d="M30 -30 l-50 180 M30 -30 l50 180 M30 -30 v180" stroke="#3a3a44" strokeWidth={8} /><circle cx={-20} cy={-110} r={8} fill="#ff3b3b" opacity={Math.sin(t * 5 + i) > 0 ? 1 : 0.3} /></g>)}
    {[180, 540, 900].map((x, i) => <g key={x}><path d={`M${x} 0 v60`} stroke="#3a3a44" strokeWidth={6} /><rect x={x - 36} y={60} width={72} height={50} rx={10} fill="#2a2a30" stroke={L} strokeWidth={3} /><path d={`M${x - 30} 110 L${x - 160 + i * 60} 330 H${x + 160 + i * 20} L${x + 30} 110 z`} fill="#fff6c8" opacity={0.06} /></g>)}
  </Svg>
);

// ---------- Estrada (viagem de negócios) ----------
export const Estrada = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#f2c08a" />
    <circle cx={820} cy={300} r={90} fill="#fff3b0" />
    <path d="M0 980 Q200 820 420 900 T860 860 T1080 920 V1300 H0 z" fill="#c9965a" />
    <path d="M0 1080 Q300 980 600 1060 T1080 1040 V1400 H0 z" fill="#b5844a" />
    {[[140, 1120], [900, 1100], [700, 1160]].map(([x, y], i) => <g key={i}><path d={`M${x} ${y} v-90`} stroke="#3a6a3a" strokeWidth={18} strokeLinecap="round" /><path d={`M${x} ${y - 50} h-30 v-30 M${x} ${y - 30} h30 v-40`} stroke="#3a6a3a" strokeWidth={14} fill="none" strokeLinecap="round" /></g>)}
    <rect x={0} y={1300} width={1080} height={620} fill="#5a5a62" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={((i * 220 + t * 500) % 1320) - 120} y={1560} width={120} height={18} fill="#f2c94c" />)}
    <path d="M0 880 L160 700 L300 820 L460 640 L640 820 L800 700 L1080 860 V980 H0 z" fill="#d8a878" opacity={0.6} />
    {Array.from({ length: 5 }, (_, i) => { const x = ((i * 300 + t * 300) % 1500) - 200; return <g key={i}><path d={`M${x} 1300 V1040 M${x - 40} 1070 h80`} stroke="#6b4224" strokeWidth={10} /></g>; })}
    <path d={Array.from({ length: 6 }, (_, i) => { const x = ((i * 300 + t * 300) % 1500) - 200; return `M${x - 40} 1070 Q${x + 110} 1110 ${x + 260} 1070`; }).join(' ')} stroke={L} strokeWidth={2} fill="none" opacity={0.6} />
    {[0, 1].map((i) => { const a = (t * 0.4 + i * 3), x = 540 + Math.cos(a) * 250, y = 380 + Math.sin(a) * 60, w = 18 * Math.sin(t * 6 + i); return <path key={i} d={`M${x - 40} ${y - w} Q${x - 16} ${y - 6} ${x} ${y} Q${x + 16} ${y - 6} ${x + 40} ${y - w}`} stroke="#1a1a1e" strokeWidth={6} fill="none" />; })}
    {Array.from({ length: 4 }, (_, i) => { const k = (t * 0.5 + i / 4) % 1; return <circle key={i} cx={760 - k * 400} cy={1470 - k * 100} r={40 + k * 60} fill="#e8c890" opacity={0.4 * (1 - k)} />; })}
    <Poeira t={t} n={20} cor="#f2e0b0" op={0.4} area={[0, 1100, 1080, 600]} />
  </Svg>
);

// ---------- Mina abandonada (cela e oficina) ----------
export const Mina = ({ t, oficina = false, noite = false }: { t: number; oficina?: boolean; noite?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#3a2e26" />
    <path d="M-40 1600 V500 Q540 60 1120 500 V1600 z" fill="#5a4636" stroke={L} strokeWidth={8} />
    {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${rnd(i) * 1080} ${300 + rnd(i + 2) * 1100} l${30 + rnd(i + 5) * 40} ${10 + rnd(i + 7) * 30}`} stroke="#3a2e26" strokeWidth={6} />)}
    {/* vigas de madeira */}
    {[100, 980].map((x) => <rect key={x} x={x - 26} y={500} width={52} height={1000} fill="#6b4224" stroke={L} strokeWidth={5} />)}
    <rect x={60} y={480} width={960} height={50} fill="#6b4224" stroke={L} strokeWidth={5} />
    {/* lampiões */}
    {[260, 820].map((x, i) => <g key={x}><path d={`M${x} 530 v50`} stroke={L} strokeWidth={4} /><rect x={x - 16} y={580} width={32} height={44} rx={6} fill="#ffcf6a" stroke={L} strokeWidth={3} /><circle cx={x} cy={600} r={140} fill="#ffcf6a" opacity={(noite ? 0.08 : 0.14) + 0.04 * Math.sin(t * 9 + i)} /></g>)}
    {/* trilhos e vagonete */}
    <rect x={0} y={CHAO_T} width={1080} height={440} fill="#4a3a2e" />
    {[1560, 1640].map((y) => <path key={y} d={`M0 ${y} H1080`} stroke="#8a8a92" strokeWidth={10} />)}
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 120} y={1540} width={40} height={120} fill="#5a3a22" />)}
    <g transform="translate(860 1500)"><path d="M-110 -110 h220 l-30 100 h-160 z" fill="#6a6a72" stroke={L} strokeWidth={5} />{[-60, 60].map((w) => <circle key={w} cx={w} cy={6} r={22} fill="#2a2a30" stroke={L} strokeWidth={4} />)}{[-50, 0, 50].map((d) => <circle key={d} cx={d} cy={-120} r={26} fill="#3a3a3a" />)}</g>
    {oficina && (
      <g>
        <rect x={160} y={1180} width={560} height={40} fill="#6b4224" stroke={L} strokeWidth={5} />
        <rect x={180} y={1220} width={30} height={260} fill="#5a3a22" /><rect x={670} y={1220} width={30} height={260} fill="#5a3a22" />
        <circle cx={260} cy={1150} r={36} fill="#9aa0aa" stroke={L} strokeWidth={4} />
        <rect x={340} y={1120} width={120} height={60} rx={6} fill="#c9ccd4" stroke={L} strokeWidth={4} />
        <path d="M520 1180 l60 -80 l40 20" stroke="#6a727e" strokeWidth={12} fill="none" />
        {/* desenho da armadura na parede */}
        <rect x={300} y={660} width={360} height={420} fill="#e8dcc0" stroke={L} strokeWidth={4} transform="rotate(-3 480 870)" />
        <g stroke="#2f5fa8" strokeWidth={5} fill="none" transform="rotate(-3 480 870)"><circle cx={480} cy={740} r={46} /><rect x={420} y={790} width={120} height={140} rx={20} /><path d="M420 810 l-50 90 M540 810 l50 90 M450 930 v110 M510 930 v110" /><circle cx={480} cy={850} r={16} /></g>
      </g>
    )}
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${150 + i * 95} ${360 + (i % 3) * 30} l14 ${50 + (i % 2) * 40} l14 ${-50 - (i % 2) * 40} z`} fill="#4a3a2e" />)}
    {[0, 1].map((i) => { const k = (t * 0.7 + i * 0.5) % 1; return <ellipse key={i} cx={420 + i * 300} cy={440 + k * 1000} rx={5} ry={9} fill="#9ad0f0" opacity={0.7 * (1 - k)} />; })}
    <g transform="translate(70 900) rotate(-20)"><path d="M0 0 v200" stroke="#8a5a32" strokeWidth={14} /><path d="M-60 10 Q0 -30 60 10" stroke="#9aa0aa" strokeWidth={18} fill="none" /></g>
    <g transform="translate(1000 960) rotate(15)"><path d="M0 0 v180" stroke="#8a5a32" strokeWidth={12} /><rect x={-24} y={-10} width={48} height={40} fill="#9aa0aa" stroke={L} strokeWidth={3} /></g>
    {[[150, 1440], [240, 1450]].map(([x, y], i) => <g key={i}><rect x={x - 40} y={y - 110} width={80} height={110} rx={8} fill={i ? '#5a3a2a' : '#3a5a3a'} stroke={L} strokeWidth={4} />{[0.3, 0.7].map((f) => <path key={f} d={`M${x - 40} ${y - 110 * f} h80`} stroke={L} strokeWidth={3} />)}</g>)}
    <path d="M60 520 Q300 600 540 540 T1020 520" stroke="#1a1a1e" strokeWidth={5} fill="none" />
    <Poeira t={t} n={26} cor="#e8d6b0" op={0.35} />
  </Svg>
);

// ---------- Coletiva de imprensa ----------
export const Coletiva = ({ t, logo = 'LIMATECH' }: { t: number; logo?: string }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#1c2a44" />
    {Array.from({ length: 20 }, (_, i) => <text key={i} x={(i % 4) * 280 + 140} y={300 + Math.floor(i / 4) * 200} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#2a3a5a">{logo}</text>)}
    {[0, 1].map((i) => <path key={i} d={i ? 'M1080 0 V1480 H960 Q1000 740 940 0 z' : 'M0 0 V1480 H120 Q80 740 140 0 z'} fill="#6a1a2a" stroke={L} strokeWidth={4} />)}
    {[0, 1].map((i) => <g key={i} transform={`translate(${i ? 880 : 200} 980)`}><path d="M0 0 V-420" stroke="#c9a14a" strokeWidth={8} /><path d={`M0 -420 q60 ${-10 + 8 * Math.sin(t * 3 + i)} 120 0 v80 q-60 ${10 + 8 * Math.sin(t * 3 + i + 1)} -120 0 z`} fill={i ? '#3a6ad8' : '#f2c94c'} stroke={L} strokeWidth={3} /></g>)}
    {[200, 540, 880].map((x, i) => <path key={x} d={`M${x} 0 L${x - 200 + i * 60} 1480 H${x + 200 - i * 60} z`} fill="#fff6c8" opacity={0.05 + 0.02 * Math.sin(t * 2 + i)} />)}
    <rect x={0} y={CHAO_T} width={1080} height={440} fill="#14202f" />
    {Array.from({ length: 8 }, (_, i) => { const k = (t * 1.6 + i * 0.29) % 1; return k < 0.07 ? <circle key={i} cx={80 + rnd(i + Math.floor(t * 1.6)) * 920} cy={1560 + rnd(i * 3) * 300} r={50} fill="#fff" opacity={0.9} /> : null; })}
    {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${80 + i * 150} 1780)`}><circle r={44} fill="#0e1622" /><rect x={-50} y={36} width={100} height={120} rx={30} fill="#0e1622" /><rect x={10} y={-30} width={60} height={40} rx={6} fill="#2a2a30" /></g>)}
  </Svg>
);

// ---------- Laboratório no porão ----------
export const Porao = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#2a3038" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M0 ${200 + i * 160} H1080`} stroke="#323a44" strokeWidth={6} />)}
    {/* telas */}
    {[0, 1, 2].map((i) => <g key={i}><rect x={80 + i * 320} y={360} width={280} height={190} rx={10} fill="#0a1422" stroke="#5a6a7a" strokeWidth={8} />{Array.from({ length: 5 }, (_, j) => <rect key={j} x={100 + i * 320} y={390 + j * 30} width={60 + 160 * Math.abs(Math.sin(t * 0.8 + i + j))} height={14} fill="#3ac0d8" opacity={0.7} />)}</g>)}
    {/* suporte com a armadura nova (prateada e azul) */}
    <path d="M540 640 v700" stroke="#5a6a7a" strokeWidth={14} />
    <rect x={400} y={1330} width={280} height={30} fill="#5a6a7a" stroke={L} strokeWidth={4} />
    {/* bancada e ferramentas */}
    <rect x={20} y={1260} width={320} height={30} fill="#6a727e" stroke={L} strokeWidth={4} />
    <rect x={740} y={1260} width={320} height={30} fill="#6a727e" stroke={L} strokeWidth={4} />
    {[60, 120, 180].map((x, i) => <path key={x} d={`M${x} 1260 v-70`} stroke={['#d1495b', '#9aa0aa', '#f2c94c'][i]} strokeWidth={14} strokeLinecap="round" />)}
    <g transform="translate(900 1220)"><rect x={-60} y={-30} width={120} height={70} rx={8} fill="#3a3f48" stroke={L} strokeWidth={4} /><circle cx={0} cy={4} r={20} fill="#5ad8ff" opacity={0.6 + 0.3 * Math.sin(t * 6)} /></g>
    <rect x={60} y={720} width={300} height={16} fill="#5a6a7a" stroke={L} strokeWidth={3} />
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${110 + i * 100} 680)`}><circle r={36} fill={['#a8b0b8', '#c8d0d8', '#9aa0aa'][i]} stroke={L} strokeWidth={4} />{[-1, 1].map((s2) => <ellipse key={s2} cx={s2 * 13} cy={0} rx={10} ry={12} fill="#fff" stroke={L} strokeWidth={2} />)}</g>)}
    <g transform={`translate(800 1260) rotate(${-20 + 15 * Math.sin(t * 1.5)})`}><rect x={-20} y={-20} width={40} height={40} fill="#f2c94c" stroke={L} strokeWidth={4} /><path d="M0 0 L0 -160" stroke="#f2c94c" strokeWidth={26} strokeLinecap="round" /><g transform={`translate(0 -160) rotate(${50 + 30 * Math.sin(t * 2)})`}><path d="M0 0 L0 -120" stroke="#f2c94c" strokeWidth={20} strokeLinecap="round" /><path d="M-16 -120 l-10 -30 M16 -120 l10 -30" stroke="#3a3f48" strokeWidth={8} /></g></g>
    {Array.from({ length: 4 }, (_, i) => <path key={i} d={`M${100 + i * 260} 0 q${60} ${120 + i * 20} ${160} 0`} stroke={['#d1495b', '#3a6ad8', '#f2c94c', '#3a8a3a'][i]} strokeWidth={8} fill="none" />)}
    {Array.from({ length: 5 }, (_, i) => <rect key={i} x={760 + (i % 3) * 90} y={600 + Math.floor(i / 3) * 70} width={70} height={50} fill="#5ad8ff" opacity={0.1 + 0.15 * Math.abs(Math.sin(t * 3 + i))} stroke="#5ad8ff" strokeWidth={2} />)}
    <rect x={0} y={CHAO_T} width={1080} height={440} fill="#20262e" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={(i % 4) * 270} y={CHAO_T + Math.floor(i / 4) * 220} width={268} height={218} fill="none" stroke="#2a323c" strokeWidth={4} />)}
  </Svg>
);

// ---------- Telhado da LimaTech à noite (luta final) ----------
export const TelhadoLT = ({ t, letras = 'LIMATECH', semLetra = -1, gerador = 1 }: { t: number; letras?: string; semLetra?: number; gerador?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#0e1428" />
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 3) * 700} r={2} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t + i))} />)}
    {Array.from({ length: 8 }, (_, i) => { const h = 300 + rnd(i) * 400, x = i * 140 - 20; return <g key={i}><rect x={x} y={1100 - h} width={130} height={h} fill="#1c2440" />{Array.from({ length: Math.floor(h / 60) * 2 }, (_, j) => <rect key={j} x={x + 18 + (j % 2) * 54} y={1100 - h + 22 + Math.floor(j / 2) * 60} width={38} height={34} fill="#ffd166" opacity={(i * 13 + j * 7) % 5 < 2 ? 0.7 : 0.08} />)}</g>; })}
    {/* letreiro */}
    <g>{letras.split('').map((c, i) => i === semLetra ? null : <g key={i}><rect x={70 + i * 120} y={560} width={100} height={130} fill="#1a1a1e" stroke={L} strokeWidth={4} /><text x={120 + i * 120} y={665} textAnchor="middle" fontFamily="Arial Black" fontSize={100} fill="#f2c94c" opacity={0.8 + 0.2 * Math.sin(t * 6 + i)}>{c}</text></g>)}<path d="M60 690 H1020" stroke="#3a3a44" strokeWidth={12} /></g>
    {/* gerador */}
    <g transform="translate(860 1300)"><rect x={-150} y={-260} width={300} height={260} rx={14} fill="#3a4a3a" stroke={L} strokeWidth={6} />{[0, 1, 2, 3].map((i) => <rect key={i} x={-120} y={-230 + i * 50} width={240} height={30} fill="#2a3a2a" />)}<path d={`M-40 -260 l20 -40 l-14 0 l24 -50`} stroke="#5ad8ff" strokeWidth={6} fill="none" opacity={gerador * (Math.sin(t * 20) > 0 ? 1 : 0.3)} /><text x={0} y={-20} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#f2c94c">PERIGO</text></g>
    <rect x={0} y={1300} width={1080} height={620} fill="#2a2e3a" />
    <rect x={0} y={1290} width={1080} height={20} fill="#4a4e5a" stroke={L} strokeWidth={4} />
    <g transform="translate(160 1300)"><rect x={-90} y={-220} width={180} height={160} rx={16} fill="#5a5a68" stroke={L} strokeWidth={5} /><path d="M-70 -60 v60 M70 -60 v60" stroke="#4a4a58" strokeWidth={12} /><text x={0} y={-130} textAnchor="middle" fontFamily="Arial Black" fontSize={28} fill="#c9ccd4">ÁGUA</text></g>
    {[460, 600].map((x) => <g key={x}><rect x={x - 50} y={1220} width={100} height={70} fill="#9aa0aa" stroke={L} strokeWidth={4} /><circle cx={x} cy={1255} r={24} fill="#6a727e" stroke={L} strokeWidth={3} /><g transform={`translate(${x} 1255) rotate(${t * 500})`}><path d="M-20 0 h40 M0 -20 v40" stroke="#c9ccd4" strokeWidth={6} /></g></g>)}
    {(() => { const a = Math.sin(t * 0.7) * 0.35; return <g><path d={`M940 120 L${540 + Math.sin(a) * 900} 1300 L${700 + Math.sin(a) * 900} 1300 z`} fill="#fff6c8" opacity={0.1} /><g transform="translate(940 110)"><ellipse rx={70} ry={26} fill="#2a2a30" stroke={L} strokeWidth={3} /><path d="M-90 -30 h180" stroke="#5a5a68" strokeWidth={6} opacity={0.7} /><circle cx={50} cy={10} r={8} fill="#ff3b3b" opacity={Math.sin(t * 6) > 0 ? 1 : 0.2} /></g></g>; })()}
    <circle cx={260} cy={1600} r={160} fill="none" stroke="#f2c94c" strokeWidth={10} opacity={0.5} />
    <text x={260} y={1640} textAnchor="middle" fontFamily="Arial Black" fontSize={110} fill="#f2c94c" opacity={0.5}>H</text>
  </Svg>
);
// Jornal com a manchete.
export const JornalLT = ({ t, manchete }: { t: number; manchete: string }) => (
  <>
    <Svg><rect width={1080} height={1920} fill="#2a2a30" /></Svg>
    <div style={{ position: 'absolute', left: 90, top: 380, width: 900, height: 1080, background: '#f4efe2', border: '6px solid #1a1520', transform: `rotate(${-3 + Math.sin(t * 0.6)}deg)`, padding: 36, boxSizing: 'border-box', fontFamily: 'Georgia, serif', color: '#1a1520' }}>
      <div style={{ fontSize: 76, fontWeight: 900, textAlign: 'center', borderBottom: '6px double #1a1520', paddingBottom: 10 }}>FOLHA DA CIDADE</div>
      <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.05, textAlign: 'center', marginTop: 30 }}>{manchete}</div>
      <div style={{ margin: '30px auto', width: 520, height: 380, background: '#0e1428', border: '4px solid #1a1520', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 200, top: 60, width: 120, height: 120, borderRadius: '50%', background: '#c8d0d8', border: '6px solid #1a1520' }} />
        <div style={{ position: 'absolute', left: 190, top: 170, width: 140, height: 180, borderRadius: 30, background: '#c8d0d8', border: '6px solid #1a1520' }} />
        <div style={{ position: 'absolute', left: 240, top: 220, width: 40, height: 40, borderRadius: '50%', background: '#5ad8ff', boxShadow: '0 0 30px #5ad8ff' }} />
      </div>
    </div>
  </>
);

// Púlpito com microfones (desenhado NA FRENTE de quem fala; topo na altura da cintura).
export const Podio = ({ logo = 'LIMATECH' }: { logo?: string }) => (
  <Svg>
    {[-70, -24, 24, 70].map((d, i) => <g key={d}><path d={`M${540 + d * 0.6} 1330 L${540 + d} 1230`} stroke={L} strokeWidth={6} /><rect x={540 + d - 16} y={1190} width={32} height={48} rx={14} fill={['#d1283b', '#2f5fa8', '#3a8a3a', '#f2c94c'][i]} stroke={L} strokeWidth={3} /></g>)}
    <rect x={330} y={1330} width={420} height={170} fill="#e8e2d0" stroke={L} strokeWidth={6} />
    <rect x={370} y={1360} width={340} height={70} fill="#f2c94c" stroke={L} strokeWidth={3} />
    <text x={540} y={1410} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill={L}>{logo}</text>
  </Svg>
);
