// Cenários de "O Sétimo Monitor": estrada de terra na mata, portão do Acampamento Pedra Lisa, chalés, dormitório,
// fogueira, lago (píer, barco, névoa), gerador, escritório com telefone, salão de dança e a janela com a lanterna.
import { L, Svg } from './cenarios';
import { Poeira } from './cenarios-ilha';

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const clamp = (x: number) => Math.min(1, Math.max(0, x));
export const CHAO_A2 = 1480;

// ---------- Céu e mata ----------
const Ceu = ({ t, noite = 1 }: { t: number; noite?: number }) => (
  <>
    <rect width={1080} height={1920} fill={noite > 0.5 ? '#101830' : '#f2b07a'} />
    {noite > 0.5 && Array.from({ length: 50 }, (_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 3) * 800} r={2} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t + i))} />)}
    {noite > 0.5 ? <circle cx={820} cy={260} r={70} fill="#f4efd8" /> : <circle cx={820} cy={380} r={110} fill="#fff3b0" />}
  </>
);
export const Pinheiros = ({ y = 1100, cor = '#14261c', n = 10, t = 0, s = 1 }: { y?: number; cor?: string; n?: number; t?: number; s?: number }) => (
  <>
    {Array.from({ length: n }, (_, i) => { const x = (i / (n - 1)) * 1160 - 40, h = (260 + rnd(i) * 200) * s; return <g key={i} transform={`rotate(${1.5 * Math.sin(t + i)} ${x} ${y})`}><path d={`M${x} ${y - h} L${x - h * 0.32} ${y} H${x + h * 0.32} z`} fill={cor} /><path d={`M${x} ${y - h * 1.2} L${x - h * 0.24} ${y - h * 0.5} H${x + h * 0.24} z`} fill={cor} /><rect x={x - 8} y={y} width={16} height={40} fill="#2a1a10" /></g>; })}
  </>
);
const Grilos = () => null;
export const Kombi = ({ x, y, s = 1, t, fumaca = 0, rostos = 0 }: { x: number; y: number; s?: number; t: number; fumaca?: number; rostos?: number }) => (
  <g transform={`translate(${x} ${y + 2 * Math.sin(t * 20)}) scale(${s})`}>
    <path d="M-250 -20 V-230 Q-250 -270 -210 -270 H200 Q260 -270 260 -210 V-20 z" fill="#e8e2d0" stroke={L} strokeWidth={6} />
    <path d="M-250 -140 H260 V-20 H-250 z" fill="#3a8ad0" stroke={L} strokeWidth={6} />
    <path d="M190 -260 L250 -180 H190 z" fill="#bfe6ff" stroke={L} strokeWidth={4} />
    {[-200, -110, -20, 70].map((wx, i) => <g key={wx}><rect x={wx} y={-250} width={74} height={90} rx={8} fill="#bfe6ff" stroke={L} strokeWidth={4} />{i < rostos && <><circle cx={wx + 37} cy={-196} r={22} fill={['#e2b48c', '#f0c8a0', '#7a4b30', '#f6e3d3', '#c98a5a', '#e2b48c', '#8d5a3b'][i]} stroke={L} strokeWidth={3} /><path d={`M${wx + 15} ${-212} q22 -16 44 0`} fill="#3a2416" /></>}</g>)}
    <path d="M-10 -140 l20 0 l-10 -24 z" fill="#e8e2d0" stroke={L} strokeWidth={3} />
    {[-160, 170].map((w) => <g key={w}><circle cx={w} cy={-10} r={44} fill="#2a2a30" stroke={L} strokeWidth={5} /><circle cx={w} cy={-10} r={18} fill="#c9ccd4" /></g>)}
    {fumaca > 0 && [0, 1, 2].map((i) => { const k = (t * 1.2 + i / 3) % 1; return <circle key={i} cx={-280 - k * 160} cy={-40 - k * 80} r={30 + k * 50} fill="#6a6a72" opacity={fumaca * 0.6 * (1 - k)} />; })}
  </g>
);
export const Bicicleta = ({ x, y, s = 1, t }: { x: number; y: number; s?: number; t: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={L} strokeWidth={8} fill="none">
    {[-110, 110].map((w) => <g key={w}><circle cx={w} cy={-70} r={70} /><circle cx={w} cy={-70} r={70} stroke="#9aa0aa" strokeWidth={3} strokeDasharray="6 10" transform={`rotate(${t * 100} ${w} -70)`} /></g>)}
    <path d="M-110 -70 L-30 -170 H80 L110 -70 M-30 -170 L0 -70 L80 -170 M70 -190 h40" />
    <path d="M-50 -190 h50" strokeWidth={14} />
  </g>
);

// ---------- Estrada de terra / portão ----------
export const EstradaMata = ({ t, noite = 0 }: { t: number; noite?: number }) => (
  <Svg>
    <Ceu t={t} noite={noite} />
    <Pinheiros y={1000} cor={noite > 0.5 ? '#0e1c14' : '#3a5a3a'} n={12} t={t} s={0.8} />
    <Pinheiros y={1180} cor={noite > 0.5 ? '#14261c' : '#2a4a2a'} n={9} t={t + 2} />
    <rect x={0} y={1180} width={1080} height={740} fill={noite > 0.5 ? '#2a2418' : '#a8804a'} />
    <path d="M380 1180 L700 1180 L1080 1920 H0 z" fill={noite > 0.5 ? '#3a3020' : '#c9a06a'} />
    {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={300 + rnd(i) * 480} cy={1300 + rnd(i + 2) * 600} rx={20} ry={8} fill="#8a6a4a" opacity={0.6} />)}
    <Poeira t={t} n={20} cor={noite > 0.5 ? '#cfd8f0' : '#f2e0b0'} op={0.35} area={[0, 900, 1080, 700]} />
  </Svg>
);
export const Portao = ({ t, noite = 0, abandonado = true }: { t: number; noite?: number; abandonado?: boolean }) => (
  <Svg>
    <Ceu t={t} noite={noite} />
    <Pinheiros y={1180} cor={noite > 0.5 ? '#0e1c14' : '#2a4a2a'} n={10} t={t} />
    <path d="M0 1200 Q540 1120 1080 1200 V1920 H0 z" fill="#5a7a9a" opacity={0.7} />
    <rect x={0} y={1300} width={1080} height={620} fill={noite > 0.5 ? '#2a2418' : '#8a6a4a'} />
    {[180, 900].map((x) => <rect key={x} x={x - 26} y={760} width={52} height={720} fill="#6b4224" stroke={L} strokeWidth={5} />)}
    <g transform={`rotate(${abandonado ? 5 + Math.sin(t * 1.4) * 1.5 : 0} 180 820)`}><rect x={140} y={770} width={800} height={150} rx={10} fill="#8a5a32" stroke={L} strokeWidth={6} /><text x={540} y={836} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={52} fill="#f2e6d0">ACAMPAMENTO</text><text x={540} y={896} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={52} fill="#f2e6d0">PEDRA LISA</text></g>
    {abandonado && <><path d="M160 760 q30 120 0 260 M920 760 q-20 140 10 280" stroke="#3a6a3a" strokeWidth={14} fill="none" /><path d="M300 920 l60 30 M700 900 l-50 40" stroke={L} strokeWidth={3} opacity={0.6} /></>}
    {[0, 1, 2].map((i) => <rect key={i} x={300 + i * 180} y={1380} width={120} height={20} fill="#6a5a3a" transform={`rotate(${(i - 1) * 12} ${360 + i * 180} 1390)`} />)}
  </Svg>
);

// ---------- Chalés (portas: 0..1 abertas, uma por chalé) ----------
export const Chales = ({ t, noite = 1, portas = [0, 0, 0], luzes = [1, 1, 1] }: { t: number; noite?: number; portas?: number[]; luzes?: number[] }) => (
  <Svg>
    <Ceu t={t} noite={noite} />
    <Pinheiros y={1000} cor="#0e1c14" n={12} t={t} s={0.8} />
    <rect x={0} y={1000} width={1080} height={920} fill="#1e2a1c" />
    {[0, 1, 2].map((i) => {
      const x = 60 + i * 340, y = 860;
      return (
        <g key={i}>
          <path d={`M${x - 20} ${y} L${x + 140} ${y - 130} L${x + 300} ${y} z`} fill="#4a2a1a" stroke={L} strokeWidth={5} />
          <rect x={x} y={y} width={280} height={300} fill="#6b4224" stroke={L} strokeWidth={5} />
          {Array.from({ length: 6 }, (_, j) => <path key={j} d={`M${x} ${y + 40 + j * 46} h280`} stroke="#4a2a1a" strokeWidth={4} />)}
          <rect x={x + 20} y={y + 60} width={80} height={80} fill={luzes[i] > 0.5 ? '#ffd166' : '#1a1a2a'} stroke={L} strokeWidth={4} opacity={luzes[i] > 0.5 ? 0.85 : 1} />
          <rect x={x + 150} y={y + 110} width={100} height={190} fill="#120c08" stroke={L} strokeWidth={4} />
          <g transform={`translate(${x + 150} ${y + 110}) scale(${1 - 0.85 * (portas[i] ?? 0)} 1)`}><rect width={100} height={190} fill="#8a5a32" stroke={L} strokeWidth={4} /><circle cx={84} cy={100} r={7} fill="#c9a14a" /></g>
          <text x={x + 140} y={y - 30} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#f2e6d0">{i + 1}</text>
          {[0, 1].map((k) => <rect key={k} x={x + 140 - k * 30} y={y + 300 + k * 20} width={120} height={20} fill="#5a3a22" />)}
        </g>
      );
    })}
    <Poeira t={t} n={18} cor="#d8f0a0" op={0.6} area={[0, 900, 1080, 700]} />
  </Svg>
);
// Dormitório por dentro: beliches arrumados, calendário de 1964.
export const Dormitorio = ({ t, molhada = 0 }: { t: number; molhada?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#6b5a46" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 95} 0 V${CHAO_A2}`} stroke="#5a4a38" strokeWidth={10} />)}
    {[120, 700].map((x, i) => <g key={x}>
      <rect x={x - 20} y={760} width={30} height={720} fill="#4a3424" stroke={L} strokeWidth={4} /><rect x={x + 270} y={760} width={30} height={720} fill="#4a3424" stroke={L} strokeWidth={4} />
      {[900, 1280].map((y, j) => <g key={y}><rect x={x} y={y} width={280} height={60} rx={10} fill={molhada > 0 && i === 1 && j === 1 ? '#5a7a9a' : '#e8e2d0'} stroke={L} strokeWidth={4} /><rect x={x + 10} y={y - 30} width={90} height={40} rx={14} fill="#fffaf0" stroke={L} strokeWidth={3} /><rect x={x + 110} y={y + 10} width={160} height={30} fill="#7a2a2a" opacity={0.85} /></g>)}
    </g>)}
    {molhada > 0 && Array.from({ length: 4 }, (_, i) => { const k = (t * 0.8 + i / 4) % 1; return <ellipse key={i} cx={760 + i * 60} cy={1340 + k * 140} rx={5} ry={9} fill="#9ad0f0" opacity={molhada * (1 - k)} />; })}
    <g transform="translate(540 420)"><rect x={-110} y={0} width={220} height={260} fill="#fffaf0" stroke={L} strokeWidth={5} /><rect x={-110} y={0} width={220} height={60} fill="#d1495b" /><text x={0} y={44} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#fff">JUNHO</text><text x={0} y={150} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={90} fill={L}>1964</text><text x={0} y={220} textAnchor="middle" fontFamily="Arial" fontSize={26} fill="#7a6a5a">sexta-feira 13</text></g>
    <rect x={0} y={CHAO_A2} width={1080} height={440} fill="#4a3424" />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M0 ${CHAO_A2 + 30 + i * 62} H1080`} stroke="#3a2618" strokeWidth={3} />)}
    <Poeira t={t} n={30} op={0.45} />
  </Svg>
);

// ---------- Fogueira na noite ----------
export const Fogo = ({ x, y, t, s = 1, forca = 1 }: { x: number; y: number; t: number; s?: number; forca?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={260 * forca} fill="#ff9a3a" opacity={0.18 * forca + 0.04 * Math.sin(t * 9)} />
    {[[-80, 20, 30], [80, 20, -30], [0, 30, 90]].map(([dx, dy, a], i) => <rect key={i} x={dx - 90} y={dy - 16} width={180} height={32} rx={14} fill="#5a3a22" stroke={L} strokeWidth={4} transform={`rotate(${a} ${dx} ${dy})`} />)}
    {forca > 0 && [0, 1, 2, 3].map((i) => { const h = (150 + 40 * Math.sin(t * 12 + i * 2)) * forca; return <path key={i} d={`M${-50 + i * 33} 10 q-40 ${-h * 0.5} 10 ${-h} q20 ${h * 0.5} 20 ${h} z`} fill={i % 2 ? '#ffd166' : '#ff7a2a'} opacity={0.9} />; })}
    {forca > 0 && Array.from({ length: 8 }, (_, i) => { const k = (t * 0.9 + i / 8) % 1; return <circle key={i} cx={(rnd(i) - 0.5) * 120 + Math.sin(k * 6 + i) * 30} cy={-80 - k * 400} r={4} fill="#ffd166" opacity={1 - k} />; })}
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * 130} cy={40 + Math.sin(a) * 40} rx={30} ry={18} fill="#6a6a72" stroke={L} strokeWidth={3} />; })}
  </g>
);
export const Fogueira = ({ t, forca = 1 }: { t: number; forca?: number }) => (
  <Svg>
    <Ceu t={t} />
    <Pinheiros y={1100} cor="#0e1c14" n={11} t={t} />
    <rect x={0} y={1100} width={1080} height={820} fill="#1a2418" />
    {[[200, 1600], [880, 1600]].map(([x, y], i) => <rect key={i} x={x - 140} y={y} width={280} height={44} rx={20} fill="#5a3a22" stroke={L} strokeWidth={4} />)}
    <Fogo x={540} y={1540} t={t} forca={forca} />
  </Svg>
);

// ---------- Lago (píer, névoa, salão ao longe) ----------
export const Lago = ({ t, noite = 1, nevoa = 0.4, pier = true, salao = false, manha = false }: { t: number; noite?: number; nevoa?: number; pier?: boolean; salao?: boolean; manha?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill={manha ? '#f2c08a' : '#101830'} />
    {!manha && <circle cx={820} cy={300} r={70} fill="#f4efd8" />}
    {!manha && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 3) * 700} r={2} fill="#fff" opacity={0.4} />)}
    <Pinheiros y={1000} cor={manha ? '#3a4a3a' : '#0e1c14'} n={12} t={t} s={0.8} />
    {salao && <g><rect x={120} y={860} width={300} height={140} fill="#3a2a1a" stroke={L} strokeWidth={4} /><path d="M100 860 L270 780 L440 860 z" fill="#2a1a10" />{[0, 1, 2].map((i) => <rect key={i} x={150 + i * 90} y={900} width={60} height={50} fill="#ffd166" opacity={0.6 + 0.4 * Math.sin(t * 6 + i)} />)}</g>}
    <rect x={0} y={1000} width={1080} height={920} fill={manha ? '#6a8aa8' : '#14244a'} />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${((i * 140 + t * 30) % 1300) - 120} ${1060 + (i % 5) * 160} q40 -10 80 0`} stroke={manha ? '#c8e0f0' : '#3a5a8a'} strokeWidth={4} fill="none" />)}
    <ellipse cx={820} cy={1100} rx={60} ry={160} fill="#f4efd8" opacity={manha ? 0 : 0.12} />
    {pier && <g><rect x={-20} y={1360} width={520} height={40} fill="#6b4224" stroke={L} strokeWidth={5} />{[40, 220, 420].map((x) => <rect key={x} x={x} y={1400} width={24} height={300} fill="#4a2a1a" stroke={L} strokeWidth={3} />)}</g>}
    {Array.from({ length: 7 }, (_, i) => { const x = ((i * 300 + t * (16 + i * 5)) % 1600) - 260; return <ellipse key={i} cx={x} cy={1100 + (i % 3) * 200} rx={300} ry={60} fill="#c8d0e8" opacity={nevoa * (0.5 + 0.3 * Math.sin(t + i))} />; })}
  </Svg>
);
export const Barquinho = ({ x, y, t, s = 1 }: { x: number; y: number; t: number; s?: number }) => (
  <g transform={`translate(${x} ${y + 8 * Math.sin(t * 1.6)}) rotate(${3 * Math.sin(t * 1.3)}) scale(${s})`}>
    <path d="M-300 -50 L300 -50 Q260 50 160 70 L-180 70 Q-270 50 -300 -50 z" fill="#8a5a32" stroke={L} strokeWidth={7} strokeLinejoin="round" />
    <rect x={-305} y={-64} width={610} height={20} rx={8} fill="#a06a3a" stroke={L} strokeWidth={5} />
    {[-10, 25].map((dy) => <path key={dy} d={`M-280 ${dy} L280 ${dy}`} stroke={L} strokeWidth={3} opacity={0.35} />)}
  </g>
);
export const BarquinhoFundo = ({ x, y, t, s = 1 }: { x: number; y: number; t: number; s?: number }) => (
  <g transform={`translate(${x} ${y + 8 * Math.sin(t * 1.6)}) rotate(${3 * Math.sin(t * 1.3)}) scale(${s})`}><path d="M-290 -50 L-282 -90 H282 L290 -50 z" fill="#5a3a22" stroke={L} strokeWidth={5} /></g>
);

// ---------- Gerador ----------
export const Gerador = ({ t, ligado = 1 }: { t: number; ligado?: number }) => (
  <Svg>
    <Ceu t={t} />
    <Pinheiros y={1100} cor="#0e1c14" n={10} t={t} />
    <rect x={0} y={1100} width={1080} height={820} fill="#1a2418" />
    <rect x={260} y={820} width={560} height={660} fill="#4a4a42" stroke={L} strokeWidth={6} />
    <path d="M230 820 L540 680 L850 820 z" fill="#3a3a34" stroke={L} strokeWidth={5} />
    <rect x={340} y={980} width={400} height={300} rx={20} fill="#6a7a5a" stroke={L} strokeWidth={6} />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={370} y={1010 + i * 42} width={340} height={22} fill="#4a5a3a" />)}
    <circle cx={700} cy={960} r={16} fill={ligado > 0.5 ? (Math.sin(t * 8) > 0 ? '#4dff88' : '#2a8a4a') : '#5a1a1a'} stroke={L} strokeWidth={3} />
    <path d="M540 680 v-60 l80 -40" stroke={L} strokeWidth={6} fill="none" />
    <circle cx={620} cy={580} r={20} fill={ligado > 0.5 ? '#ffd166' : '#2a2a30'} />
    {ligado > 0.5 && <circle cx={620} cy={580} r={160} fill="#ffd166" opacity={0.12} />}
    {ligado > 0.5 && Array.from({ length: 3 }, (_, i) => { const k = (t * 1.5 + i / 3) % 1; return <circle key={i} cx={830 + k * 60} cy={900 - k * 150} r={20 + k * 30} fill="#8a8a92" opacity={0.4 * (1 - k)} />; })}
  </Svg>
);

// ---------- Escritório com telefone antigo ----------
export const Escritorio64 = ({ t, toca = 0 }: { t: number; toca?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#5a4a3a" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 95} 0 V${CHAO_A2}`} stroke="#4a3a2a" strokeWidth={10} />)}
    <rect x={640} y={420} width={300} height={360} fill="#101830" stroke="#3a2418" strokeWidth={14} /><circle cx={820} cy={520} r={36} fill="#f4efd8" />
    <rect x={120} y={430} width={300} height={220} fill="#c9a06a" stroke={L} strokeWidth={4} /><text x={270} y={500} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={30} fill="#3a2418">REGRAS</text>{[0, 1, 2, 3].map((i) => <path key={i} d={`M150 ${540 + i * 26} h240`} stroke="#6a5a4a" strokeWidth={4} />)}
    <rect x={100} y={1160} width={880} height={40} fill="#8a5a32" stroke={L} strokeWidth={5} />
    <rect x={130} y={1200} width={820} height={280} fill="#6b4224" stroke={L} strokeWidth={5} />
    <g transform={`translate(540 ${1110 + (toca ? 4 * Math.sin(t * 60) : 0)}) rotate(${toca ? 3 * Math.sin(t * 50) : 0})`}>
      <path d="M-120 50 L-90 -20 H90 L120 50 z" fill="#1a1a1e" stroke={L} strokeWidth={5} />
      <circle cx={0} cy={14} r={34} fill="#c9ccd4" stroke={L} strokeWidth={4} />{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={Math.cos(i * 0.63) * 22} cy={14 + Math.sin(i * 0.63) * 22} r={4} fill={L} />)}
      <path d="M-130 -30 Q-130 -70 -90 -70 H90 Q130 -70 130 -30" stroke="#1a1a1e" strokeWidth={30} fill="none" strokeLinecap="round" />
    </g>
    {toca > 0 && Array.from({ length: 5 }, (_, i) => { const k = (t * 0.9 + i / 5) % 1; return <ellipse key={i} cx={420 + i * 6} cy={1080 + k * 120} rx={6} ry={11} fill="#9ad0f0" opacity={1 - k} />; })}
    {toca > 0 && [0, 1].map((s) => <path key={s} d={`M${540 + (s ? 170 : -170)} 1040 q${s ? 30 : -30} 40 0 80`} stroke="#ffd166" strokeWidth={8} fill="none" opacity={Math.sin(t * 20) > 0 ? 1 : 0} />)}
    <rect x={0} y={CHAO_A2} width={1080} height={440} fill="#3a2a1a" />
  </Svg>
);

// ---------- Salão de dança (1964, enfeitado) ----------
export const Salao = ({ t, manha = false }: { t: number; manha?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill={manha ? '#c8a878' : '#3a2a3a'} />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 110} 0 V${CHAO_A2}`} stroke="#000" strokeWidth={20} opacity={0.08} />)}
    <path d="M0 300 Q540 420 1080 300" stroke={L} strokeWidth={3} fill="none" />
    {Array.from({ length: 12 }, (_, i) => { const x = 40 + i * 90, y = 300 + 120 * 4 * (x / 1080) * (1 - x / 1080) * 0.9; return <path key={i} d={`M${x - 20} ${y} h40 l-20 46 z`} fill={['#d1495b', '#f2c94c', '#2f5fa8', '#3aa14a'][i % 4]} stroke={L} strokeWidth={2} opacity={0.8} />; })}
    <rect x={300} y={500} width={480} height={110} rx={12} fill="#f4efd8" stroke={L} strokeWidth={5} opacity={0.9} />
    <text x={540} y={574} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={52} fill="#7a2a2a">BAILE 1964</text>
    <rect x={760} y={1180} width={220} height={300} fill="#6b4224" stroke={L} strokeWidth={5} />
    <circle cx={870} cy={1290} r={70} fill="#2a2a30" stroke={L} strokeWidth={5} /><circle cx={870} cy={1290} r={14} fill="#d1495b" />
    <path d="M870 1290 l80 -90" stroke="#c9ccd4" strokeWidth={8} />
    {manha && <path d="M80 300 L40 1480 H500 L320 300 z" fill="#fff6c8" opacity={0.18} />}
    <rect x={0} y={CHAO_A2} width={1080} height={440} fill="#7a5a3a" />
    {Array.from({ length: 16 }, (_, i) => <rect key={i} x={(i % 8) * 135} y={CHAO_A2 + Math.floor(i / 8) * 220} width={135} height={220} fill={(i + Math.floor(i / 8)) % 2 ? '#6a4a2a' : '#8a6a4a'} />)}
    <Poeira t={t} n={30} op={0.5} cor={manha ? '#fff3c8' : '#cfd8f0'} />
  </Svg>
);

// ---------- Janela com a lanterna (hoje) ----------
export const JanelaLanterna = ({ t, vulto = 0 }: { t: number; vulto?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#2a2a3a" />
    <rect x={190} y={380} width={700} height={900} fill="#101830" stroke="#e8e2d0" strokeWidth={20} />
    <path d="M540 380 v900 M190 830 h700" stroke="#e8e2d0" strokeWidth={14} />
    {Array.from({ length: 20 }, (_, i) => <circle key={i} cx={210 + rnd(i) * 660} cy={400 + rnd(i + 2) * 400} r={2} fill="#fff" opacity={0.5} />)}
    <rect x={210} y={1000} width={660} height={260} fill="#14244a" />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${230 + ((i * 120 + t * 20) % 620)} ${1060 + (i % 3) * 60} q30 -8 60 0`} stroke="#3a5a8a" strokeWidth={3} fill="none" />)}
    {vulto > 0 && <g opacity={vulto * (0.5 + 0.2 * Math.sin(t * 2))}><circle cx={680} cy={990} r={18} fill="#bcd4ff" /><path d="M664 1000 L660 1060 H700 L696 1000 z" fill="#bcd4ff" /></g>}
    <rect x={150} y={1280} width={780} height={40} fill="#8a5a32" stroke={L} strokeWidth={5} />
    <g transform="translate(540 1280)"><rect x={-40} y={-120} width={80} height={110} rx={14} fill="#ffd166" stroke={L} strokeWidth={5} /><path d="M-50 -120 h100 l-10 -20 h-80 z" fill="#3a3a3a" stroke={L} strokeWidth={4} /><path d="M-30 -140 q30 -50 60 0" stroke={L} strokeWidth={5} fill="none" /><circle cx={0} cy={-64} r={200} fill="#ffd166" opacity={0.18 + 0.04 * Math.sin(t * 6)} /></g>
    <rect x={0} y={1320} width={1080} height={600} fill="#3a2a2a" />
  </Svg>
);
// Foto antiga de 1964 (sépia) com os monitores e o Tavinho.
export const FotoAntiga = ({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-200} y={-150} width={400} height={300} fill="#f4e8d0" stroke={L} strokeWidth={6} />
      <rect x={-180} y={-130} width={360} height={220} fill="#c9a87a" />
      {[-120, -40, 40, 120].map((cx, i) => <g key={i}><circle cx={cx} cy={-40} r={i === 3 ? 22 : 28} fill="#e8d0b0" stroke="#5a4a3a" strokeWidth={3} /><rect x={cx - 26} y={-12} width={52} height={i === 3 ? 60 : 90} rx={12} fill="#a8805a" stroke="#5a4a3a" strokeWidth={3} /><path d={`M${cx - 24} ${-56} q24 -22 48 0`} fill="#5a3a22" /></g>)}
      <text x={0} y={130} textAnchor="middle" fontFamily="Georgia" fontSize={28} fill="#5a4a3a">Pedra Lisa — junho de 1964</text>
      <rect x={-200} y={-150} width={400} height={300} fill="#7a5a3a" opacity={0.15} />
    </g>
  </svg>
);
export { Grilos };
