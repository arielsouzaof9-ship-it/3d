// Cenários de "O Quarto Nove": ilha na tempestade, hotel de madeira, quarto nove, píer, cozinha, porão.
import { ReactNode, useId } from 'react';
import { L, Svg } from './cenarios';

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const uid = () => useId().replace(/:/g, '');
export const clamp = (x: number) => Math.min(1, Math.max(0, x));

// ---------- Clima ----------
export const Chuva = ({ t, n = 150, op = 0.5, ang = 0.25 }: { t: number; n?: number; op?: number; ang?: number }) => (
  <Svg>
    {Array.from({ length: n }, (_, i) => {
      const sp = 1500 + rnd(i) * 600;
      const y = ((t * sp + rnd(i + 5) * 2400) % 2400) - 300;
      const x = rnd(i + 9) * 1300 - 100 - y * ang;
      return <path key={i} d={`M${x} ${y} l${-ang * 60} 60`} stroke="#c8d6f0" strokeWidth={3} opacity={op * (0.5 + 0.5 * rnd(i + 2))} />;
    })}
  </Svg>
);
// Clarão de relâmpago: flash branco + raio no céu perto dos instantes dados.
export const Relampago = ({ t, vezes, x = 700 }: { t: number; vezes: number[]; x?: number }) => {
  const d = Math.min(...vezes.map((v) => (t >= v ? t - v : 99)));
  if (d > 0.5) return null;
  const k = d < 0.06 ? 1 : d < 0.12 ? 0.3 : d < 0.18 ? 0.8 : Math.max(0, 1 - (d - 0.18) / 0.32);
  return (
    <>
      <Svg>
        <path d={`M${x} 0 l-40 160 l50 10 l-70 200 l40 8 l-60 190`} stroke="#fff" strokeWidth={10} fill="none" strokeLinejoin="bevel" opacity={k} />
        <path d={`M${x} 0 l-40 160 l50 10 l-70 200 l40 8 l-60 190`} stroke="#bcd4ff" strokeWidth={26} fill="none" opacity={k * 0.35} />
      </Svg>
      <div style={{ position: 'absolute', inset: 0, background: '#e8f0ff', opacity: k * 0.55, mixBlendMode: 'screen' }} />
    </>
  );
};
// Relâmpagos "aleatórios" fixos de uma cena (a cada ~4 s).
export const raiosDe = (t0: number, t1: number, seed = 0) => Array.from({ length: Math.ceil((t1 - t0) / 4) + 1 }, (_, i) => t0 + 0.6 + i * 4 + rnd(seed + i) * 1.5);

export const CeuTempestade = ({ t, horizonte = 1100 }: { t: number; horizonte?: number }) => {
  const id = uid();
  return (
    <>
      <defs>
        <linearGradient id={`c${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b0f22" /><stop offset="1" stopColor="#2b3150" /></linearGradient>
      </defs>
      <rect width={1080} height={horizonte + 30} fill={`url(#c${id})`} />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = ((i * 300 + t * (20 + i * 8)) % 1500) - 250, y = 120 + i * 120;
        return <g key={i} fill={i % 2 ? '#222842' : '#2a3150'} opacity={0.95}><ellipse cx={x} cy={y} rx={220} ry={60} /><ellipse cx={x + 120} cy={y - 34} rx={130} ry={60} /><ellipse cx={x - 110} cy={y - 18} rx={110} ry={44} /></g>;
      })}
    </>
  );
};
// Mar agitado em camadas.
export const Mar = ({ t, y0 = 1100, cor = ['#14274a', '#1b3460', '#24427a'], forte = 1 }: { t: number; y0?: number; cor?: string[]; forte?: number }) => (
  <>
    {cor.map((c, k) => {
      const yy = y0 + k * 140, a = (30 + k * 10) * forte, f = 0.008 - k * 0.001, sp = 2 + k * 0.6;
      const pts = Array.from({ length: 28 }, (_, i) => { const x = -40 + i * 42; return `${x} ${yy + Math.sin(x * f + t * sp + k) * a}`; }).join(' L');
      return (
        <g key={k}>
          <path d={`M${pts} L1120 1920 L-40 1920 z`} fill={c} />
          {Array.from({ length: 8 }, (_, i) => { const x = ((i * 160 + t * 40 * (k + 1)) % 1200) - 60; return <path key={i} d={`M${x} ${yy + Math.sin(x * f + t * sp + k) * a - 6} q20 -14 40 0`} stroke="#bcd4ff" strokeWidth={5} fill="none" opacity={0.5} />; })}
        </g>
      );
    })}
  </>
);
// Ilha ao longe com o hotel e a janela do quarto nove acesa.
export const IlhaLonge = ({ x = 700, y = 1110, s = 1, t }: { x?: number; y?: number; s?: number; t: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-260 0 Q-200 -120 -80 -150 Q40 -200 140 -140 Q240 -90 280 0 z" fill="#0d1226" />
    <rect x={-60} y={-260} width={150} height={110} fill="#131a33" />
    <path d="M-75 -260 L15 -320 L105 -260 z" fill="#131a33" />
    {[[-40, -235], [20, -235], [-40, -195], [50, -195]].map(([wx, wy], i) => <rect key={i} x={wx} y={wy} width={22} height={22} fill={i === 3 ? '#ffcf6a' : '#3a4060'} opacity={i === 3 ? 0.6 + 0.4 * Math.abs(Math.sin(t * 3)) : 1} />)}
  </g>
);
// Barquinho de madeira (de lado). limo = coberto de limo; placa = plaquinha na proa.
export const Barco = ({ x, y, rot = 0, s = 1, limo = false, placa = false, lampiao = true, t = 0 }: { x: number; y: number; rot?: number; s?: number; limo?: boolean; placa?: boolean; lampiao?: boolean; t?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-230 -40 L230 -40 Q200 50 120 60 L-140 60 Q-210 50 -230 -40 z" fill={limo ? '#4a5a3a' : '#7a4f2c'} stroke={L} strokeWidth={6} strokeLinejoin="round" />
    {[-10, 20].map((dy) => <path key={dy} d={`M-220 ${dy} L220 ${dy}`} stroke={L} strokeWidth={3} opacity={0.35} />)}
    <rect x={-235} y={-52} width={470} height={16} rx={6} fill={limo ? '#5a6a40' : '#8a5a32'} stroke={L} strokeWidth={4} />
    {limo && Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={-200 + i * 36 + rnd(i) * 10} cy={30 + rnd(i + 3) * 26} rx={18} ry={8} fill="#6b8a3a" opacity={0.8} />)}
    {placa && <g><rect x={150} y={-20} width={60} height={34} rx={4} fill="#b5893a" stroke={L} strokeWidth={3} /><path d="M158 -8 h44 M158 2 h34" stroke={L} strokeWidth={2} opacity={0.6} /></g>}
    {lampiao && <g><path d="M200 -52 V-120" stroke={L} strokeWidth={5} /><rect x={188} y={-150} width={24} height={30} rx={4} fill="#ffcf6a" stroke={L} strokeWidth={3} /><circle cx={200} cy={-135} r={50} fill="#ffcf6a" opacity={0.18 + 0.05 * Math.sin(t * 9)} /></g>}
  </g>
);

// ---------- Hotel ----------
export const HotelFora = ({ t, janela9 = true, dia = false, vulto = 0 }: { t: number; janela9?: boolean; dia?: boolean; vulto?: number }) => (
  <Svg>
    {dia ? <rect width={1080} height={1200} fill="#f5d9a8" /> : <CeuTempestade t={t} horizonte={1200} />}
    <path d="M0 1200 Q200 1080 420 1120 T1080 1100 V1920 H0 z" fill={dia ? '#8a7a5a' : '#1a1e30'} />
    {!dia && <g transform={`rotate(${-5 + 4 * Math.sin(t * 1.7) + 2 * Math.sin(t * 4.1)} 70 1180)`}>
      <path d="M70 1180 Q60 900 90 640" stroke="#120e16" strokeWidth={34} fill="none" strokeLinecap="round" />
      {[[90, 700, -60, -80], [84, 820, 70, -70], [76, 940, -80, -40], [88, 760, 40, -110]].map(([x, y, dx, dy], i) => <path key={i} d={`M${x} ${y} q${dx / 2} ${dy} ${dx} ${dy - 10 * Math.sin(t * 3 + i)}`} stroke="#120e16" strokeWidth={14} fill="none" strokeLinecap="round" />)}
    </g>}
    <g>
      <rect x={180} y={620} width={720} height={540} fill={dia ? '#c99a6a' : '#5a3e2a'} stroke={L} strokeWidth={6} />
      {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M184 ${646 + i * 26} h712`} stroke={L} strokeWidth={2} opacity={0.3} />)}
      <path d="M150 620 L540 400 L930 620 z" fill={dia ? '#8a3a2a' : '#3a2018'} stroke={L} strokeWidth={6} strokeLinejoin="round" />
      <rect x={700} y={430} width={50} height={110} fill="#4a2a1e" stroke={L} strokeWidth={4} />
      {[[250, 700], [420, 700], [590, 700], [760, 700, 9], [250, 880], [760, 880]].map(([x, y, n], i) => (
        <g key={i}>
          <rect x={x} y={y} width={90} height={110} fill={n === 9 ? (janela9 ? '#ffcf6a' : '#2a2f45') : dia ? '#bfe6ff' : i % 2 ? '#3a4060' : '#e8b860'} stroke={L} strokeWidth={4} opacity={n === 9 && janela9 ? 0.7 + 0.3 * Math.abs(Math.sin(t * 2.3)) : 1} />
          <path d={`M${x + 45} ${y} v110 M${x} ${y + 55} h90`} stroke={L} strokeWidth={3} />
          {n === 9 && vulto > 0 && <g opacity={vulto}><circle cx={x + 45} cy={y + 50} r={17} fill="#140c08" /><path d={`M${x + 22} ${y + 110} q4 -42 23 -42 q19 0 23 42 z`} fill="#140c08" /><path d={`M${x + 30} ${y + 40} q-14 10 -8 30 M${x + 60} ${y + 40} q14 10 8 30`} stroke="#140c08" strokeWidth={6} fill="none" /></g>}
          {n === 9 && [0, 1, 2].map((k) => <path key={k} d={`M${x - 6} ${y + 20 + k * 36} l102 ${8 - k * 6}`} stroke="#6b4a2e" strokeWidth={10} />)}
        </g>
      ))}
      <rect x={470} y={960} width={140} height={200} rx={8} fill="#3a2418" stroke={L} strokeWidth={5} />
      {!dia && <rect x={480} y={970} width={120} height={14} fill="#ffcf6a" opacity={0.35 + 0.25 * Math.sin(t * 11) * Math.sin(t * 3)} />}
      <path d="M150 1160 h780" stroke={L} strokeWidth={6} />
      {[200, 300, 400, 680, 780, 880].map((x) => <path key={x} d={`M${x} 1160 v-60`} stroke="#4a2e1e" strokeWidth={8} />)}
      <path d="M180 1100 h720" stroke="#4a2e1e" strokeWidth={8} />
      <g transform={`rotate(${dia ? 0 : 6 * Math.sin(t * 2.4)} 540 905)`}>
        <path d="M480 905 V925 M600 905 V925" stroke={L} strokeWidth={4} />
        <rect x={430} y={925} width={220} height={56} rx={6} fill="#c9a86a" stroke={L} strokeWidth={4} />
        <text x={540} y={963} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={900} fontSize={34} fill="#3a2418">HOTEL MARÉ</text>
      </g>
    </g>
  </Svg>
);
// Recepção: madeira, balcão, quadro de chaves (gancho 9 vazio), relógio, luminária.
export const CHAO_I = 1450;
export const Recepcao = ({ t, vazio = false, caneta = false }: { t: number; vazio?: boolean; caneta?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#4a3426" />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 80} 0 V1450`} stroke="#3a2618" strokeWidth={4} />)}
    <rect x={0} y={1450} width={1080} height={470} fill="#2e2018" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M0 ${1480 + i * 60} H1080`} stroke="#1e140e" strokeWidth={3} />)}
    {/* quadro de chaves */}
    <rect x={640} y={520} width={320} height={300} rx={10} fill="#6b4a2e" stroke={L} strokeWidth={5} />
    {Array.from({ length: 9 }, (_, i) => {
      const cx = 690 + (i % 3) * 110, cy = 580 + Math.floor(i / 3) * 90;
      return <g key={i}><circle cx={cx} cy={cy} r={6} fill="#c9a14a" /><text x={cx} y={cy - 14} textAnchor="middle" fontFamily="Georgia" fontSize={22} fill="#e8d6b0">{i + 1}</text>{i !== 8 && <path d={`M${cx} ${cy} v30`} stroke="#c9a14a" strokeWidth={6} />}</g>;
    })}
    {/* relógio */}
    <circle cx={260} cy={560} r={70} fill="#e8d6b0" stroke={L} strokeWidth={6} />
    <path d={`M260 560 l0 -46 M260 560 l${34 * Math.cos(t * 0.5)} ${34 * Math.sin(t * 0.5)}`} stroke={L} strokeWidth={6} strokeLinecap="round" />
    <rect x={225} y={630} width={70} height={70} fill="#3a2418" stroke={L} strokeWidth={4} />
    <g transform={`rotate(${18 * Math.sin(t * Math.PI)} 260 632)`}><path d="M260 632 v52" stroke="#c9a14a" strokeWidth={4} /><circle cx={260} cy={688} r={10} fill="#c9a14a" stroke={L} strokeWidth={3} /></g>
    {/* quadro na parede */}
    <rect x={160} y={720} width={200} height={150} fill="#2a3a4a" stroke="#c9a14a" strokeWidth={8} />
    <path d="M170 850 Q230 760 300 830 T350 820 V860 H170 z" fill="#3a5a6a" />
    {/* balcão com livro e luminária */}
    <rect x={120} y={1080} width={840} height={370} fill="#5a3a22" stroke={L} strokeWidth={6} />
    <rect x={100} y={1060} width={880} height={36} fill="#7a4f2c" stroke={L} strokeWidth={5} />
    {[0, 1, 2].map((i) => <rect key={i} x={160 + i * 270} y={1130} width={220} height={270} fill="none" stroke={L} strokeWidth={4} opacity={0.4} />)}
    {!vazio && <g><rect x={430} y={1028} width={160} height={36} rx={4} fill="#1a1a1e" stroke={L} strokeWidth={3} /><path d="M510 1030 v32" stroke="#e8d6b0" strokeWidth={3} /></g>}
    {caneta && <g transform={`translate(${550 + 18 * Math.sin(t * 2.2)} ${1030 + 3 * Math.sin(t * 17)}) rotate(${30 + 8 * Math.sin(t * 13)})`}><path d="M0 0 L-10 -70" stroke="#1a1a1e" strokeWidth={8} strokeLinecap="round" /><path d="M0 0 l-3 -12" stroke="#c9a14a" strokeWidth={4} /></g>}
    <rect x={200} y={1000} width={50} height={60} rx={6} fill="#e8d6b0" stroke={L} strokeWidth={4} />
    <path d={`M225 1000 q${-6 + 4 * Math.sin(t * 9)} -20 0 -34 q${6 + 3 * Math.sin(t * 7)} 14 0 34`} fill="#ffcf6a" />
    <circle cx={225} cy={975} r={70} fill="#ffcf6a" opacity={0.12 + 0.05 * Math.sin(t * 9)} />
    <path d="M820 1060 v-140" stroke={L} strokeWidth={6} />
    <path d="M770 920 h100 l-20 -60 h-60 z" fill="#2f6b4a" stroke={L} strokeWidth={4} />
    <circle cx={820} cy={940} r={vazio ? 0 : 160} fill="#ffcf6a" opacity={0.12 + 0.06 * Math.abs(Math.sin(t * 13) * Math.sin(t * 2.1))} />
    {!vazio && <Poeira t={t} n={18} area={[640, 760, 360, 400]} op={0.6} />}
    {vazio && Array.from({ length: 30 }, (_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 4) * 1400} r={2 + rnd(i + 8) * 3} fill="#e8d6b0" opacity={0.2 + 0.2 * Math.sin(t * 2 + i)} />)}
  </Svg>
);
// Livro de hóspedes aberto (close), com página arrancada à direita.
export const Livro = ({ t, linhas = [] as string[], rasgado = true, destaque = -1 }: { t: number; linhas?: string[]; rasgado?: boolean; destaque?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#2a1c14" />
    <g transform={`rotate(${-3 + Math.sin(t * 0.5)} 540 900)`}>
      <rect x={90} y={460} width={900} height={900} rx={14} fill="#1a1a1e" stroke={L} strokeWidth={6} />
      <rect x={120} y={490} width={420} height={840} fill="#efe2c4" stroke={L} strokeWidth={4} />
      {rasgado ? (
        <path d={`M540 490 h${30} l-14 40 l18 30 l-20 36 l16 40 l-18 30 l14 44 l-16 38 l12 40 l-14 30 l16 50 l-20 40 l14 44 l-12 38 l18 46 l-16 40 l14 50 l-18 40 l16 50 l-14 40 l-6 80 h-30 z`} fill="#efe2c4" stroke={L} strokeWidth={3} />
      ) : (
        <rect x={540} y={490} width={420} height={840} fill="#efe2c4" stroke={L} strokeWidth={4} />
      )}
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M150 ${560 + i * 48} h360`} stroke="#9a8a6a" strokeWidth={2} />)}
      {linhas.map((l, i) => (
        <g key={i}>
          {i === destaque && <rect x={rasgado ? 140 : 560} y={545 + i * 96} width={380} height={70} fill="#ffd166" opacity={0.45} />}
          <text x={rasgado ? 150 : 570} y={590 + i * 96} fontFamily="'Brush Script MT', 'Comic Sans MS', cursive" fontSize={34} fill="#2a2440">{l}</text>
        </g>
      ))}
    </g>
  </Svg>
);
// Corredor com as portas 7, 8 e 9; pegadas molhadas aparecendo (pegadas = 0..1).
export const Corredor = ({ t, aberta = 0, pegadas = 0, escuro = 0.3 }: { t: number; aberta?: number; pegadas?: number; escuro?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#5a4a5a" />
    {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${(i % 6) * 190 + 40} ${Math.floor(i / 6) * 260 + 100} l20 30 l-20 30 l-20 -30 z`} fill="#4a3a4a" />)}
    <rect x={0} y={1350} width={1080} height={570} fill="#3a2618" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M0 ${1380 + i * 56} H1080`} stroke="#2a1a10" strokeWidth={3} />)}
    {[[90, 7], [420, 8], [750, 9]].map(([x, n]) => (
      <g key={n}>
        <rect x={x - 10} y={830} width={260} height={530} fill="#2a1a10" stroke={L} strokeWidth={5} />
        <g transform={`translate(${x} 840) scale(${n === 9 ? 1 - 0.85 * aberta : 1} 1)`}>
          <rect x={0} y={0} width={240} height={510} fill="#6b4a2e" stroke={L} strokeWidth={5} />
          <rect x={30} y={40} width={180} height={190} fill="none" stroke={L} strokeWidth={4} opacity={0.5} />
          <rect x={30} y={270} width={180} height={200} fill="none" stroke={L} strokeWidth={4} opacity={0.5} />
          <circle cx={205} cy={270} r={12} fill="#c9a14a" stroke={L} strokeWidth={3} />
        </g>
        <rect x={x + 80} y={760} width={80} height={56} rx={6} fill="#c9a14a" stroke={L} strokeWidth={4} />
        <text x={x + 120} y={804} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={42} fill="#3a2418">{n}</text>
      </g>
    ))}
    {/* arandelas */}
    {[300, 640].map((x) => <g key={x}><rect x={x - 12} y={620} width={24} height={50} fill="#c9a14a" /><circle cx={x} cy={600} r={16} fill="#ffcf6a" opacity={0.6 + 0.3 * Math.sin(t * 7 + x)} /><circle cx={x} cy={600} r={110} fill="#ffcf6a" opacity={0.08} /></g>)}
    {/* pegadas pequenas molhadas indo da porta 9 para a esquerda (escada / mar) */}
    {Array.from({ length: 10 }, (_, i) => {
      const k = clamp(pegadas * 10 - i);
      if (k <= 0) return null;
      const x = 840 - i * 85, y = 1500 + (i % 2) * 50;
      return <g key={i} opacity={0.85 * k}><ellipse cx={x} cy={y} rx={18} ry={30} fill="#7fa6d8" /><circle cx={x - 10} cy={y - 34} r={6} fill="#7fa6d8" /><circle cx={x + 2} cy={y - 38} r={6} fill="#7fa6d8" /><circle cx={x + 13} cy={y - 34} r={5} fill="#7fa6d8" /><ellipse cx={x - 4} cy={y - 8} rx={5} ry={9} fill="#e8f2ff" opacity={0.8} /></g>;
    })}
    {pegadas > 0.3 && <Goteira t={t} x={900} y0={850} y1={1480} />}
    <Poeira t={t} n={22} op={0.35} area={[150, 450, 800, 700]} />
    <rect width={1080} height={1920} fill="#000" opacity={escuro} />
  </Svg>
);
// Quarto nove: cama de criança, travesseiro com desenho, sapatinho vermelho, janela pregada, fumaça.
export const Quarto9 = ({ t, desenho = true, sapato = true, fumaca = true, dia = false, janelaAberta = false }: { t: number; desenho?: boolean; sapato?: boolean; fumaca?: boolean; dia?: boolean; janelaAberta?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill={dia ? '#e8d0d6' : '#3a2e44'} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 100 + 50} 0 V1400`} stroke={dia ? '#f2dde2' : '#46385a'} strokeWidth={30} opacity={0.5} />)}
    <rect x={0} y={1400} width={1080} height={520} fill={dia ? '#b08a5a' : '#2e2018'} />
    {/* janela pregada */}
    <rect x={620} y={420} width={300} height={320} fill={dia || janelaAberta ? '#bfe6ff' : '#0f1428'} stroke={L} strokeWidth={8} />
    {!janelaAberta && [0, 1, 2].map((k) => <g key={k}><path d={`M600 ${470 + k * 110} L940 ${500 + k * 100}`} stroke="#6b4a2e" strokeWidth={32} /><circle cx={618} cy={471 + k * 110} r={6} fill="#9aa0aa" /><circle cx={922} cy={498 + k * 100} r={6} fill="#9aa0aa" /></g>)}
    {dia && <path d="M620 740 L380 1400 H900 L920 740 z" fill="#fff6c8" opacity={0.25} />}
    {!dia && !janelaAberta && [0, 1].map((k) => <path key={k} d={`M630 ${520 + k * 105} L910 ${535 + k * 100} L${860 - k * 80} 1420 L${320 - k * 60} 1420 z`} fill="#9fb6e8" opacity={0.07 + 0.03 * Math.sin(t * 0.8 + k)} />)}
    {!dia && <Poeira t={t} n={30} cor="#cfe0ff" op={0.45} area={[300, 500, 650, 900]} />}
    {/* cama */}
    <rect x={120} y={1060} width={520} height={240} rx={20} fill={dia ? '#f6b8c8' : '#7a4a6a'} stroke={L} strokeWidth={6} />
    <rect x={100} y={940} width={40} height={460} rx={10} fill="#6b4a2e" stroke={L} strokeWidth={5} />
    <rect x={620} y={1040} width={40} height={360} rx={10} fill="#6b4a2e" stroke={L} strokeWidth={5} />
    <rect x={150} y={1010} width={200} height={90} rx={30} fill="#f4ecdc" stroke={L} strokeWidth={5} />
    {desenho && <g transform="rotate(-8 250 1040)"><rect x={190} y={1000} width={130} height={90} fill="#fffef6" stroke={L} strokeWidth={3} /><circle cx={235} cy={1030} r={10} fill="#e8c240" /><path d="M235 1040 v25 M270 1040 v25" stroke="#d1495b" strokeWidth={5} /><circle cx={270} cy={1035} r={8} fill="#f6b8c8" /></g>}
    {/* sapatinho */}
    {sapato && <g transform="translate(760 1460) rotate(-12)"><path d="M-50 0 q0 -34 30 -34 h30 q30 4 40 34 z" fill="#d1495b" stroke={L} strokeWidth={4} /><path d="M-20 -30 l24 18" stroke="#fff" strokeWidth={4} /></g>}
    {/* fumaça subindo */}
    {fumaca && Array.from({ length: 6 }, (_, i) => { const k = (t * 0.2 + i / 6) % 1; return <circle key={i} cx={300 + i * 80 + Math.sin(k * 6 + i) * 40} cy={1300 - k * 900} r={40 + k * 60} fill="#8a8aa0" opacity={0.18 * (1 - k)} />; })}
  </Svg>
);
// Desenho de criança (close): mulher de capa de chuva com distintivo e cicatriz, de mão dada com a menina.
export const Desenho = ({ t, frase2 = 0, zoomCicatriz = false }: { t: number; frase2?: number; zoomCicatriz?: boolean }) => {
  const s = 'E finalmente me encontrou.';
  const n = Math.floor(frase2 * s.length);
  return (
    <Svg>
      <rect width={1080} height={1920} fill="#2a1c22" />
      <g transform={zoomCicatriz ? 'translate(-700 -500) scale(2.4)' : `rotate(${-2 + Math.sin(t * 0.4)} 540 900)`}>
        <rect x={110} y={430} width={860} height={940} fill="#fffef6" stroke={L} strokeWidth={5} />
        <g stroke="#2a2a2a" strokeWidth={6} fill="none" strokeLinecap="round">
          {/* mulher */}
          <circle cx={420} cy={640} r={70} fill="#f6e3d3" />
          <path d="M360 610 q60 -70 120 0" stroke="#3a2416" strokeWidth={22} />
          <path d="M395 620 l14 0 M440 620 l14 0 M405 680 q20 14 40 0" />
          <path d="M378 598 l14 22" stroke="#d1495b" strokeWidth={8} />
          <path d="M340 720 L500 720 L540 1000 L300 1000 z" fill="#e8c240" />
          <path d="M455 760 l18 -10 l18 10 v22 q-18 14 -36 0 z" fill="#ffd166" strokeWidth={4} />
          <path d="M370 1000 v130 M470 1000 v130 M520 800 l90 80" />
          {/* menina */}
          <circle cx={680} cy={800} r={56} fill="#f6e3d3" />
          <path d="M630 780 q50 -60 100 0 M720 770 q30 10 20 50" stroke="#3a2416" strokeWidth={16} />
          <path d="M660 800 l8 0 M694 800 l8 0 M665 830 q16 10 32 0" />
          <path d="M630 860 L730 860 L760 1030 L600 1030 z" fill="#f6b8c8" />
          <path d="M650 1030 v90 M710 1030 v90" />
          <path d="M630 1125 h30 M700 1125 h30" stroke="#d1495b" strokeWidth={16} />
          {/* sol e casinha */}
          <circle cx={880} cy={530} r={40} fill="#ffd166" />
        </g>
        <text x={540} y={1240} textAnchor="middle" fontFamily="'Comic Sans MS', cursive" fontSize={58} fill="#3d6ad1" transform="rotate(-3 540 1240)">Mamãe veio me buscar</text>
        {n > 0 && <text x={540} y={1330} textAnchor="middle" fontFamily="'Brush Script MT', Georgia, cursive" fontStyle="italic" fontSize={56} fill="#2a2a2a">{s.slice(0, n)}</text>}
      </g>
    </Svg>
  );
};
// Píer de madeira à noite (pegadas = 0..1 aparecendo até a beira).
export const CHAO_P = 1360;
export const Pier = ({ t, pegadas = 0, barco = false, limo = false }: { t: number; pegadas?: number; barco?: boolean; limo?: boolean }) => (
  <>
    <Svg>
      <CeuTempestade t={t} horizonte={1100} />
      <IlhaLonge x={180} y={1110} s={0.5} t={t} />
      <Mar t={t} y0={1120} forte={0.8} />
      {barco && <Barco x={760} y={1500} t={t} limo={limo} placa={limo} lampiao={!limo} rot={3 * Math.sin(t * 1.5)} s={0.9} />}
      {/* píer */}
      <path d="M-20 1330 L620 1330 L620 1380 L-20 1380 z" fill="#6b4a2e" stroke={L} strokeWidth={5} />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 54} 1330 v50`} stroke={L} strokeWidth={3} opacity={0.5} />)}
      {[40, 300, 580].map((x) => <rect key={x} x={x} y={1380} width={30} height={540} fill="#4a3020" stroke={L} strokeWidth={4} />)}
      {[40, 580].map((x) => <g key={x}><rect x={x} y={1230} width={30} height={100} fill="#4a3020" stroke={L} strokeWidth={4} /><circle cx={x + 15} cy={1225} r={10} fill="#4a3020" /></g>)}
      {Array.from({ length: 8 }, (_, i) => {
        const k = clamp(pegadas * 8 - i);
        if (k <= 0) return null;
        const x = 60 + i * 70, y = 1345 + (i % 2) * 14;
        return <g key={i} opacity={0.85 * k}><ellipse cx={x} cy={y} rx={14} ry={6} fill="#7fa6d8" /><ellipse cx={x - 3} cy={y - 1} rx={5} ry={2} fill="#e8f2ff" /></g>;
      })}
    </Svg>
  </>
);
// Cozinha: azulejos, fogão com panela fumegando, panelas penduradas, mesa, janela com chuva.
export const Cozinha = ({ t, prato = false, fogo = 0 }: { t: number; prato?: boolean; fogo?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#d8d2c0" />
    {Array.from({ length: 13 * 18 }, (_, i) => <rect key={i} x={(i % 13) * 84} y={Math.floor(i / 13) * 84} width={82} height={82} fill={(i + Math.floor(i / 13)) % 2 ? '#e8e2d0' : '#cfe0d8'} opacity={0.6} />)}
    <rect x={0} y={1450} width={1080} height={470} fill="#6a5a4a" />
    <rect x={680} y={420} width={260} height={280} fill="#0f1428" stroke={L} strokeWidth={8} />
    <path d="M810 420 v280 M680 560 h260" stroke={L} strokeWidth={5} />
    {[0, 1, 2].map((i) => <g key={i}><path d={`M${160 + i * 110} 380 v60`} stroke={L} strokeWidth={4} /><circle cx={160 + i * 110} cy={480} r={40} fill="#9aa0aa" stroke={L} strokeWidth={4} /><rect x={150 + i * 110} y={510} width={20} height={60} fill="#3a2418" /></g>)}
    {/* fogão e panela */}
    <rect x={80} y={1040} width={420} height={410} fill="#3a3f4a" stroke={L} strokeWidth={6} />
    <rect x={80} y={1020} width={420} height={30} fill="#2a2d3a" stroke={L} strokeWidth={4} />
    {[180, 400].map((x) => <circle key={x} cx={x} cy={1200} r={16} fill="#9aa0aa" stroke={L} strokeWidth={3} />)}
    <rect x={150} y={940} width={180} height={90} rx={10} fill="#b5524f" stroke={L} strokeWidth={5} />
    {Array.from({ length: 4 }, (_, i) => { const k = (t * 0.4 + i / 4) % 1; return <circle key={i} cx={240 + Math.sin(k * 7 + i) * 26} cy={930 - k * 260} r={18 + k * 30} fill="#fff" opacity={0.35 * (1 - k)} />; })}
    {/* mesa */}
    <rect x={600} y={1180} width={420} height={30} fill="#8a5a32" stroke={L} strokeWidth={5} />
    {[630, 990].map((x) => <rect key={x} x={x - 10} y={1210} width={20} height={240} fill="#6b4a2e" stroke={L} strokeWidth={4} />)}
    {prato && <g><ellipse cx={810} cy={1172} rx={90} ry={22} fill="#fff" stroke={L} strokeWidth={4} /><ellipse cx={810} cy={1162} rx={50} ry={14} fill="#e8a040" /></g>}
    {fogo > 0 && <Fogo t={t} x={240} y={1030} s={fogo} />}
  </Svg>
);
// Chamas animadas.
export const Fogo = ({ t, x, y, s = 1 }: { t: number; x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[['#d1495b', 1], ['#ff8a2f', 0.75], ['#ffd166', 0.45]].map(([c, k], j) => (
      <path key={j} d={Array.from({ length: 5 }, (_, i) => { const xx = (i - 2) * 70 * Number(k), h = (260 + 60 * Math.sin(t * 9 + i * 2 + j)) * Number(k); return `M${xx - 50 * Number(k)} 0 Q${xx - 30} ${-h * 0.5} ${xx + 10 * Math.sin(t * 7 + i)} ${-h} Q${xx + 30} ${-h * 0.5} ${xx + 50 * Number(k)} 0 z`; }).join(' ')} fill={c as string} opacity={0.9} />
    ))}
  </g>
);
// Porão escuro com caixas; a lanterna é aplicada por cima com <Lanterna/>.
export const Porao = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#3a3530" />
    {Array.from({ length: 40 }, (_, i) => <rect key={i} x={(i % 8) * 140 + (Math.floor(i / 8) % 2) * 70 - 40} y={Math.floor(i / 8) * 80 + 200} width={130} height={70} fill="#4a4038" stroke="#2a2420" strokeWidth={4} />)}
    <rect x={0} y={1450} width={1080} height={470} fill="#2a2420" />
    <path d="M0 300 H1080 M0 340 H1080" stroke="#5a5048" strokeWidth={16} />
    {[[120, 1250, 220, 200], [330, 1300, 180, 150], [760, 1220, 260, 230], [880, 1080, 160, 140], [170, 1110, 160, 140]].map(([x, y, w, h], i) => (
      <g key={i}><rect x={x} y={y} width={w} height={h} fill="#8a6a42" stroke={L} strokeWidth={5} /><path d={`M${x} ${y + h / 2} h${w} M${x + w / 2} ${y} v${h}`} stroke={L} strokeWidth={3} opacity={0.4} /></g>
    ))}
    {Array.from({ length: 6 }, (_, i) => { const k = (t * 0.7 + i / 6) % 1; return <ellipse key={i} cx={200 + i * 150} cy={1460 + k * 30} rx={20 + k * 30} ry={4 + k * 6} fill="none" stroke="#6a7a9a" strokeWidth={2} opacity={0.5 * (1 - k)} />; })}
  </Svg>
);
// Escuridão com o foco da lanterna.
export const Lanterna = ({ x, y, r = 280, forca = 0.88 }: { x: number; y: number; r?: number; forca?: number }) => {
  const id = uid();
  return (
    <Svg>
      <defs>
        <radialGradient id={`g${id}`}><stop offset="0.45" stopColor="#000" /><stop offset="1" stopColor="#fff" /></radialGradient>
        <mask id={`m${id}`}><rect width={1080} height={1920} fill="#fff" /><circle cx={x} cy={y} r={r} fill={`url(#g${id})`} /></mask>
      </defs>
      <rect width={1080} height={1920} fill="#05060c" opacity={forca} mask={`url(#m${id})`} />
      <circle cx={x} cy={y} r={r * 0.8} fill="#fff3c0" opacity={0.08} />
    </Svg>
  );
};
// Jornal velho (close) com manchete e uma foto (conteúdo da foto vem em `foto`).
export const Jornal = ({ t, foto, zoom = 1 }: { t: number; foto?: ReactNode; zoom?: number }) => (
  <>
    <Svg>
      <rect width={1080} height={1920} fill="#1e1814" />
      <g transform={`translate(540 900) scale(${zoom}) rotate(${2 + 0.5 * Math.sin(t * 0.5)}) translate(-540 -900)`}>
        <rect x={100} y={380} width={880} height={1060} fill="#e8dcb8" stroke={L} strokeWidth={5} />
        <text x={540} y={470} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={900} fontSize={60} fill="#2a2420">O ILHÉU</text>
        <path d="M140 500 H940" stroke="#2a2420" strokeWidth={4} />
        <text x={540} y={580} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={900} fontSize={44} fill="#2a2420">BARCO VIRA PERTO DA</text>
        <text x={540} y={636} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={900} fontSize={44} fill="#2a2420">ILHA DA NÉVOA</text>
        <text x={540} y={690} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={34} fill="#5a4a3a">Mãe e filha desaparecidas</text>
        <rect x={240} y={720} width={600} height={460} fill="#cfc4a4" stroke="#2a2420" strokeWidth={4} />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M160 ${1220 + i * 34} H920`} stroke="#8a7a5a" strokeWidth={3} />)}
      </g>
    </Svg>
    {foto && (
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(540px, 900px) scale(${zoom}) rotate(${2 + 0.5 * Math.sin(t * 0.5)}deg) translate(-540px, -900px)` }}>
        <div style={{ position: 'absolute', left: 244, top: 724, width: 592, height: 452, overflow: 'hidden', filter: 'grayscale(1) sepia(0.4) contrast(1.1)' }}>
          <div style={{ position: 'absolute', left: -244, top: -724, width: 1080, height: 1920 }}>{foto}</div>
        </div>
      </div>
    )}
  </>
);
// Amanhecer no mar.
export const Amanhecer = ({ t, k = 1 }: { t: number; k?: number }) => {
  const id = uid();
  return (
    <Svg>
      <defs><linearGradient id={`a${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a7ab8" /><stop offset="0.6" stopColor="#f7b07a" /><stop offset="1" stopColor="#ffd9a0" /></linearGradient></defs>
      <rect width={1080} height={1150} fill={`url(#a${id})`} />
      <circle cx={540} cy={1150 - 160 * k} r={130} fill="#ffe08a" />
      <circle cx={540} cy={1150 - 160 * k} r={260} fill="#ffe08a" opacity={0.25} />
      <IlhaLonge x={860} y={1150} s={0.6} t={t} />
      <rect x={0} y={1140} width={1080} height={780} fill="#3a6aa0" />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={540 - 120 + (i % 3) * 60 + Math.sin(t * 2 + i) * 20} y={1170 + i * 50} width={120 - i * 8} height={10} rx={5} fill="#ffe08a" opacity={0.6} />)}
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${((i * 160 + t * 30) % 1200) - 60} ${1250 + (i % 4) * 160} q30 -12 60 0`} stroke="#9ac0e8" strokeWidth={4} fill="none" />)}
    </Svg>
  );
};
// Tom de lembrança (sépia) para flashbacks.
export const Lembranca = ({ children }: { children: ReactNode }) => (
  <div style={{ position: 'absolute', inset: 0, filter: 'sepia(0.75) contrast(1.05) saturate(0.9)' }}>
    {children}
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 55%, rgba(60,30,10,0.55) 100%)' }} />
  </div>
);

// ---------- Detalhes extras (Parte 1 mais detalhada) ----------
// Parede interna do barco (atrás de quem está sentado) e bancos: dá profundidade e esconde as pernas.
export const BarcoFundo = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-222 -40 L-215 -72 L215 -72 L222 -40 z" fill="#4a2e1a" stroke={L} strokeWidth={5} strokeLinejoin="round" />
    {[-150, 110].map((bx) => <rect key={bx} x={bx - 50} y={-62} width={100} height={14} rx={4} fill="#6b4224" stroke={L} strokeWidth={3} />)}
  </g>
);
// Remo que gira no tolete (px, py): cabo para dentro do barco, pá na água.
export const Remo = ({ px, py, ang, s = 1 }: { px: number; py: number; ang: number; s?: number }) => (
  <g transform={`translate(${px} ${py}) rotate(${ang}) scale(${s})`}>
    <path d="M-150 0 L260 0" stroke="#8a5a32" strokeWidth={14} strokeLinecap="round" />
    <path d="M-150 0 L260 0" stroke={L} strokeWidth={18} strokeLinecap="round" opacity={0.35} />
    <path d="M-150 0 L-100 0" stroke="#5a3a22" strokeWidth={18} strokeLinecap="round" />
    <path d="M230 -6 Q300 -26 340 -4 Q300 22 230 8 z" fill="#a06a3a" stroke={L} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={0} cy={0} r={9} fill="#9aa0aa" stroke={L} strokeWidth={3} />
  </g>
);
// Onda em primeiro plano (cobre o fundo do casco) com espuma e respingos.
export const OndaFrente = ({ t, y, cor = '#24427a' }: { t: number; y: number; cor?: string }) => {
  const pts = Array.from({ length: 30 }, (_, i) => { const x = -40 + i * 40; return `${x} ${y + Math.sin(x * 0.012 + t * 2.6) * 22 + Math.sin(x * 0.03 - t * 4) * 6}`; }).join(' L');
  return (
    <g>
      <path d={`M${pts} L1120 1920 L-40 1920 z`} fill={cor} />
      <path d={`M${pts}`} stroke="#d8e6ff" strokeWidth={7} fill="none" opacity={0.55} strokeDasharray="60 30" strokeDashoffset={-t * 80} />
      {Array.from({ length: 14 }, (_, i) => {
        const k = (t * 0.9 + rnd(i) ) % 1;
        const x = 120 + rnd(i + 2) * 840, yy = y - 10 - Math.sin(k * Math.PI) * (60 + rnd(i + 7) * 70);
        return <circle key={i} cx={x + k * 40} cy={yy} r={4 + rnd(i + 5) * 6} fill="#e8f2ff" opacity={0.7 * (1 - k)} />;
      })}
    </g>
  );
};
// Faixas de névoa passando devagar.
export const Nevoa = ({ t, y = 1100, op = 0.35, cor = '#aab6d8', n = 6, faixa = 260 }: { t: number; y?: number; op?: number; cor?: string; n?: number; faixa?: number }) => {
  const id = uid();
  return (
    <>
      <defs><radialGradient id={`n${id}`}><stop offset="0" stopColor={cor} stopOpacity={1} /><stop offset="1" stopColor={cor} stopOpacity={0} /></radialGradient></defs>
      {Array.from({ length: n }, (_, i) => {
        const x = ((i * 420 + t * (25 + i * 9)) % 1800) - 360;
        return <ellipse key={i} cx={x} cy={y + (rnd(i) - 0.5) * faixa} rx={360 + rnd(i + 1) * 200} ry={70 + rnd(i + 3) * 50} fill={`url(#n${id})`} opacity={op * (0.6 + 0.4 * Math.sin(t * 0.7 + i))} />;
      })}
    </>
  );
};
// Poeira flutuando na luz.
export const Poeira = ({ t, n = 40, cor = '#f4e3b8', op = 0.5, area = [0, 0, 1080, 1500] as number[] }: { t: number; n?: number; cor?: string; op?: number; area?: number[] }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const x = area[0] + ((rnd(i) * area[2] + Math.sin(t * 0.4 + i) * 40 + t * 6) % area[2]);
      const y = area[1] + ((rnd(i + 9) * area[3] - t * (8 + rnd(i + 4) * 14) + area[3] * 4) % area[3]);
      return <circle key={i} cx={x} cy={y} r={2 + rnd(i + 2) * 3.5} fill={cor} opacity={op * (0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + i)))} />;
    })}
  </>
);
// Pingos caindo de um ponto (goteira) com anel na poça.
export const Goteira = ({ t, x, y0, y1, fase = 0 }: { t: number; x: number; y0: number; y1: number; fase?: number }) => {
  const k = (t * 0.8 + fase) % 1;
  const cai = clamp(k / 0.5), anel = clamp((k - 0.5) / 0.5);
  return (
    <g>
      {k < 0.5 && <ellipse cx={x} cy={y0 + (y1 - y0) * cai * cai} rx={5} ry={9} fill="#9cc0ee" opacity={0.85} />}
      {k >= 0.5 && <ellipse cx={x} cy={y1} rx={10 + anel * 50} ry={3 + anel * 12} fill="none" stroke="#9cc0ee" strokeWidth={3} opacity={0.8 * (1 - anel)} />}
      <ellipse cx={x} cy={y1} rx={70} ry={14} fill="#7fa6d8" opacity={0.25} />
    </g>
  );
};
// Escurece as bordas do quadro.
export const Vinheta = ({ forca = 0.6 }: { forca?: number }) => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${forca}) 100%)` }} />
);
// Parede de tábuas molhada (para o cartaz), com prego, pingos escorrendo e papéis velhos.
export const ParedeTabuas = ({ t, seca = false }: { t: number; seca?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#3a2a20" />
    {Array.from({ length: 9 }, (_, i) => <g key={i}><rect x={i * 124} y={0} width={120} height={1920} fill={i % 2 ? '#43301f' : '#3b2a1c'} /><path d={`M${i * 124 + 60} ${200 + rnd(i) * 900} q10 30 0 60`} stroke="#2a1c12" strokeWidth={4} fill="none" /><circle cx={i * 124 + 20} cy={300 + rnd(i + 3) * 1200} r={6} fill="#2a1c12" /></g>)}
    <g transform="rotate(8 200 500)" opacity={0.55}><rect x={90} y={380} width={240} height={300} fill="#c9bfa6" /><path d="M110 420 h200 M110 460 h170 M110 500 h190" stroke="#6a5a4a" strokeWidth={6} /></g>
    <g transform="rotate(-10 880 1260)" opacity={0.5}><rect x={760} y={1120} width={240} height={280} fill="#b9b096" /><path d="M780 1170 h190 M780 1210 h150" stroke="#6a5a4a" strokeWidth={6} /></g>
    {!seca && Array.from({ length: 10 }, (_, i) => { const x = 60 + i * 110 + rnd(i) * 40, k = (t * (0.15 + rnd(i + 1) * 0.1) + rnd(i + 2)) % 1; return <path key={i} d={`M${x} 0 V${k * 1920}`} stroke="#6a7a9a" strokeWidth={3 + rnd(i + 3) * 3} opacity={0.35} />; })}
  </Svg>
);
