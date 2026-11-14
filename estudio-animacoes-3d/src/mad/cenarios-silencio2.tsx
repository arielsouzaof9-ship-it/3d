// Cenários de "Depois do Silêncio — Episódio 2": túnel do bueiro, mercado fechado com correntes (por dentro e a vitrine),
// telhado com a caixa d'água, rua vista de cima cheia de lentos, caminhão de mudança e o acampamento na pedreira à noite.
import { L, Svg } from './cenarios';
import { Poeira } from './cenarios-ilha';

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const clamp = (x: number) => Math.min(1, Math.max(0, x));
export const CHAO_2 = 1480;

// ---------- Túnel do bueiro ----------
export const Bueiro = ({ t, luzFundo = 0, grade = 1 }: { t: number; luzFundo?: number; grade?: number }) => {
  const vx = 540, vy = 900;
  return (
    <Svg>
      <rect width={1080} height={1920} fill="#14181a" />
      {/* anéis do túnel em perspectiva */}
      {Array.from({ length: 9 }, (_, i) => { const k = 1 - i / 9; const rx = 80 + 520 * k * k, ry = 90 + 620 * k * k; return <ellipse key={i} cx={vx} cy={vy} rx={rx} ry={ry} fill={i === 0 ? '#2a3230' : 'none'} stroke="#3a4440" strokeWidth={6 + 10 * k} />; })}
      {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <path key={i} d={`M${vx + Math.cos(a) * 80} ${vy + Math.sin(a) * 90} L${vx + Math.cos(a) * 640} ${vy + Math.sin(a) * 760}`} stroke="#2a3230" strokeWidth={4} />; })}
      {/* canos e limo */}
      <path d="M0 520 Q300 620 470 860" stroke="#5a6a5a" strokeWidth={40} fill="none" /><path d="M1080 600 Q780 680 610 880" stroke="#6a5a4a" strokeWidth={30} fill="none" />
      {[[120, 560], [960, 640]].map(([x, y], i) => <path key={i} d={`M${x} ${y} v${80 + i * 20}`} stroke="#3a6a3a" strokeWidth={14} strokeLinecap="round" opacity={0.7} />)}
      {/* água no chão com reflexo */}
      <path d={`M0 1920 L${vx - 60} ${vy + 80} H${vx + 60} L1080 1920 z`} fill="#1e3a3a" />
      {Array.from({ length: 8 }, (_, i) => { const k = ((t * 0.2 + i / 8) % 1); const y = vy + 100 + (1920 - vy - 100) * k * k; return <path key={i} d={`M${vx - 60 - 480 * k * k} ${y} q${40 * k} -6 ${80 * k + 20} 0`} stroke="#4a7a7a" strokeWidth={3} fill="none" opacity={0.6} />; })}
      {/* luz entrando pela grade lá em cima, com mãos dos lentos */}
      {grade > 0 && <g>
        <path d="M380 0 L300 1500 H780 L700 0 z" fill="#c8d8b8" opacity={0.08} />
        <rect x={380} y={0} width={320} height={60} fill="#9aa8a0" opacity={0.5} />
        {Array.from({ length: 7 }, (_, i) => <rect key={i} x={390 + i * 46} y={0} width={14} height={60} fill="#1a1a1e" />)}
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${430 + i * 110} ${40 + 6 * Math.sin(t * 6 + i)})`}>{[-10, 0, 10].map((dx) => <rect key={dx} x={dx - 4} y={0} width={8} height={30} rx={4} fill="#9aaa8a" stroke={L} strokeWidth={2} />)}</g>)}
      </g>}
      {/* escada de ferro */}
      <g>{[0, 1].map((s) => <path key={s} d={`M${470 + s * 140} 0 V900`} stroke="#6a5a4a" strokeWidth={14} />)}{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M470 ${40 + i * 90} H610`} stroke="#6a5a4a" strokeWidth={10} />)}</g>
      {/* luz da lanterna no fundo */}
      {luzFundo > 0 && <><circle cx={vx} cy={vy} r={60} fill="#fff3b0" opacity={luzFundo} /><circle cx={vx} cy={vy} r={200} fill="#fff3b0" opacity={luzFundo * 0.25} /></>}
      {/* ratos */}
      {[0, 1].map((i) => { const x = ((t * (90 + i * 40) + i * 500) % 1300) - 100; return <g key={i} transform={`translate(${x} ${1700 + i * 80})`}><ellipse rx={30} ry={14} fill="#3a3a3a" /><circle cx={28} cy={-4} r={10} fill="#3a3a3a" /><path d="M-30 0 q-30 10 -50 -6" stroke="#5a4a4a" strokeWidth={3} fill="none" /></g>; })}
      <Poeira t={t} n={20} cor="#c8d8b8" op={0.3} area={[300, 100, 480, 1300]} />
    </Svg>
  );
};

// ---------- Mercado por dentro ----------
export const Mercado = ({ t, porta = 1, rachado = 0, lentos = 0, lama = 0 }: { t: number; porta?: number; rachado?: number; lentos?: number; lama?: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#d8d4c4" />
    {/* placas do teto e lâmpadas */}
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M0 ${80 + i * 70} H1080`} stroke="#c8c4b4" strokeWidth={3} />)}
    {[200, 540, 880].map((x, i) => <g key={x}><rect x={x - 120} y={160} width={240} height={24} rx={6} fill={i === 1 && Math.sin(t * 19) > 0.6 ? '#6a6a60' : '#f8f8e8'} stroke={L} strokeWidth={3} /><path d={`M${x - 120} 184 L${x - 220} 700 H${x + 220} L${x + 120} 184 z`} fill="#f8f8e8" opacity={0.06} /></g>)}
    <rect x={260} y={240} width={560} height={90} rx={10} fill="#c22a2a" stroke={L} strokeWidth={5} />
    <text x={540} y={302} textAnchor="middle" fontFamily="Arial Black" fontSize={52} fill="#fff">MERCADO BOM PREÇO</text>
    {/* vitrine da frente ao fundo, com porta de enrolar e correntes */}
    <rect x={60} y={420} width={960} height={520} fill="#6a7a8a" stroke={L} strokeWidth={8} />
    {[0, 1, 2].map((i) => <rect key={i} x={80 + i * 316} y={440} width={296} height={480} fill="#8a9aaa" stroke={L} strokeWidth={4} />)}
    {lentos > 0 && Array.from({ length: Math.round(9 * lentos) }, (_, k) => { const x = 120 + (k % 5) * 190 + (rnd(k) - 0.5) * 40, y = 520 + Math.floor(k / 5) * 160 + 8 * Math.sin(t * 2 + k); return <g key={k} opacity={0.75}><circle cx={x} cy={y} r={52} fill="#7a8a6a" stroke={L} strokeWidth={3} /><circle cx={x - 16} cy={y - 6} r={7} fill="#e8f0d8" /><circle cx={x + 16} cy={y - 6} r={7} fill="#e8f0d8" /><ellipse cx={x} cy={y + 24} rx={14} ry={9} fill="#2a2a20" />{[-1, 1].map((h) => <rect key={h} x={x + h * 70 - 20} y={y + 50 + 6 * Math.sin(t * 7 + k + h)} width={40} height={50} rx={14} fill="#9aaa8a" stroke={L} strokeWidth={3} />)}</g>; })}
    <rect x={60} y={420} width={960} height={520} fill="#c8d8e8" opacity={0.2} />
    {rachado > 0 && <g stroke="#f4f8ff" strokeWidth={4} fill="none" opacity={0.9}>{Array.from({ length: Math.round(10 * rachado) }, (_, i) => { const a = (i / 10) * Math.PI * 2, r = 120 + rnd(i) * 220 * rachado; return <path key={i} d={`M540 680 l${Math.cos(a) * r * 0.5} ${Math.sin(a) * r * 0.5} l${Math.cos(a + 0.3) * r * 0.5} ${Math.sin(a + 0.3) * r * 0.5}`} />; })}<circle cx={540} cy={680} r={30 * rachado} /></g>}
    {porta > 0 && <g>{Array.from({ length: Math.round(12 * porta) }, (_, i) => <rect key={i} x={60} y={420 + i * 22} width={960} height={20} fill="#9aa0aa" stroke={L} strokeWidth={2} opacity={0.85} />)}</g>}
    {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={240 + i * 40} cy={960 + Math.sin(i * 0.8) * 12} rx={24} ry={13} fill="none" stroke="#7a7a82" strokeWidth={9} />)}
    <rect x={500} y={960} width={80} height={90} rx={10} fill="#c9a14a" stroke={L} strokeWidth={5} />
    {/* prateleiras laterais com produtos */}
    {[0, 1].map((s) => <g key={s}>
      <path d={s ? 'M1080 960 L860 1010 V1480 L1080 1560 z' : 'M0 960 L220 1010 V1480 L0 1560 z'} fill="#8a8a92" stroke={L} strokeWidth={5} />
      {[0, 1, 2, 3].map((r) => Array.from({ length: 6 }, (_, c) => { const x = s ? 880 + c * 34 : 10 + c * 34, y = 1030 + r * 110 + c * (s ? 3 : -3); const caido = rnd(r * 9 + c + s * 50) > 0.8; return caido ? null : <rect key={`${r}${c}`} x={x} y={y} width={28} height={60} rx={4} fill={['#e5484d', '#f2c94c', '#2f8acf', '#3aa14a', '#f28fb0', '#fff'][(r + c + s) % 6]} stroke={L} strokeWidth={2} />; }))}
    </g>)}
    {/* caixa registradora e carrinho */}
    <g transform="translate(300 1480)"><rect x={-140} y={-200} width={280} height={200} fill="#5a5a62" stroke={L} strokeWidth={5} /><rect x={-150} y={-220} width={300} height={30} fill="#3a3a40" /><rect x={-60} y={-300} width={120} height={80} rx={8} fill="#2a2a2e" stroke={L} strokeWidth={4} /><rect x={-46} y={-288} width={92} height={30} fill="#1a3a2a" /></g>
    <g transform="translate(800 1600) rotate(8)"><path d="M-120 -160 H120 L100 0 H-100 z" fill="none" stroke="#9aa0aa" strokeWidth={8} />{[-80, -40, 0, 40, 80].map((x) => <path key={x} d={`M${x} -160 L${x * 0.85} 0`} stroke="#9aa0aa" strokeWidth={4} />)}<path d="M120 -160 l40 -40" stroke="#9aa0aa" strokeWidth={10} />{[-80, 80].map((x) => <circle key={x} cx={x} cy={20} r={16} fill="#3a3a40" />)}{lama > 0 && <rect x={-60} y={-120} width={110} height={110} rx={14} fill="#5a4a2a" stroke={L} strokeWidth={4} />}</g>
    {/* chão */}
    <rect x={0} y={CHAO_2} width={1080} height={440} fill="#e8e4d4" />
    {Array.from({ length: 16 }, (_, i) => <rect key={i} x={(i % 8) * 135} y={CHAO_2 + Math.floor(i / 8) * 220} width={135} height={220} fill={(i + Math.floor(i / 8)) % 2 ? '#d8d4c4' : '#ecebe0'} />)}
    {[[160, 1700], [620, 1820], [920, 1560]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${i * 40})`}><rect x={-20} y={-30} width={40} height={60} rx={6} fill={['#e5484d', '#2f8acf', '#f2c94c'][i]} stroke={L} strokeWidth={3} /></g>)}
    {lama > 0 && <g><ellipse cx={560} cy={1700} rx={180} ry={40} fill="#4a3a1a" opacity={0.8} /><path d="M440 1690 q60 -30 120 0 q60 30 120 -10" stroke="#3a2a12" strokeWidth={6} fill="none" /></g>}
    <Poeira t={t} n={24} op={0.3} />
  </Svg>
);

// ---------- Telhado com a caixa d'água ----------
export const Telhado = ({ t, chuva = 0, noite = 0 }: { t: number; chuva?: number; noite?: number }) => (
  <Svg>
    <defs><linearGradient id="ceuTel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={chuva ? '#4a5260' : '#8a9aaa'} /><stop offset="1" stopColor={chuva ? '#7a8290' : '#e8c8a0'} /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#ceuTel)" />
    {/* skyline */}
    {Array.from({ length: 10 }, (_, i) => { const h = 300 + rnd(i + 2) * 420, x = i * 115 - 20; return <g key={i}><rect x={x} y={1100 - h} width={110} height={h} fill={['#5a6070', '#6a6060', '#5a6a6a'][i % 3]} stroke={L} strokeWidth={3} />{Array.from({ length: Math.floor(h / 60) }, (_, r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={x + 16 + c * 46} y={1100 - h + 20 + r * 60} width={30} height={36} fill="#2a3440" />))}</g>; })}
    {[0, 1].map((i) => { const k = (t * 0.07 + i / 2) % 1; return <circle key={i} cx={240 + i * 500 + k * 80} cy={700 - k * 600} r={60 + k * 160} fill="#4a4a52" opacity={0.3 * (1 - k)} />; })}
    {/* piso do telhado */}
    <path d="M0 1100 H1080 V1920 H0 z" fill="#8a8580" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M0 ${1130 + i * 80} H1080`} stroke="#7a7570" strokeWidth={4} />)}
    <rect x={0} y={1080} width={1080} height={40} fill="#6a6560" stroke={L} strokeWidth={4} />
    {/* caixa d'água sobre pilares com o cano */}
    <g transform="translate(800 1400)">
      {[-120, 120].map((x) => <rect key={x} x={x - 14} y={-200} width={28} height={200} fill="#5a5a62" stroke={L} strokeWidth={4} />)}
      <rect x={-170} y={-440} width={340} height={250} rx={20} fill="#3a7ab0" stroke={L} strokeWidth={6} />
      <ellipse cx={0} cy={-440} rx={170} ry={30} fill="#2a5a8a" stroke={L} strokeWidth={5} />
      <text x={0} y={-300} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#bcd8f0">10.000 L</text>
      <path d="M-170 -230 H-300 V0" stroke="#9aa0aa" strokeWidth={22} fill="none" /><path d="M-170 -230 H-300 V0" stroke="#c9ccd4" strokeWidth={8} fill="none" />
    </g>
    {/* ar-condicionados, antena, porta da escada */}
    {[[160, 1300], [360, 1340]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><rect x={-80} y={-70} width={160} height={110} rx={8} fill="#c8c8c0" stroke={L} strokeWidth={4} /><circle cx={0} cy={-14} r={36} fill="#5a5a62" stroke={L} strokeWidth={3} /><path d={`M0 -14 l${30 * Math.cos(t * 8 + i)} ${30 * Math.sin(t * 8 + i)}`} stroke="#9aa0aa" strokeWidth={6} /></g>)}
    <g transform="translate(560 1160)"><path d="M0 0 V-260 M-60 -220 h120 M-40 -180 h80 M-80 -140 h160" stroke="#3a3a40" strokeWidth={6} /></g>
    <g transform="translate(110 1250)"><rect x={-90} y={-200} width={180} height={200} fill="#9a9590" stroke={L} strokeWidth={5} /><rect x={-50} y={-150} width={100} height={150} fill="#5a4a3a" stroke={L} strokeWidth={4} /></g>
    {noite > 0 && <rect width={1080} height={1920} fill="#0a0e1a" opacity={0.5 * noite} />}
  </Svg>
);
// Rua vista de cima do telhado: lentos (cabeças) enchendo a rua, n = 0..1.
export const RuaDeCima = ({ t, n = 0.3, chuva = false }: { t: number; n?: number; chuva?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill={chuva ? '#3a3e44' : '#4a4a52'} />
    <rect x={0} y={0} width={180} height={1920} fill="#8a8a8a" /><rect x={900} y={0} width={180} height={1920} fill="#8a8a8a" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={530} y={i * 170} width={20} height={90} fill="#e8d870" />)}
    {[[320, 400, '#3a6ab0'], [700, 1100, '#e8e2d0'], [360, 1500, '#7a2a2a']].map(([x, y, c], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${i * 20 - 10})`}><rect x={-80} y={-170} width={160} height={340} rx={40} fill={c as string} stroke={L} strokeWidth={5} /><rect x={-60} y={-100} width={120} height={120} rx={14} fill="#5a6a7a" /></g>)}
    {Array.from({ length: Math.round(120 * n) }, (_, i) => { const x = 40 + rnd(i) * 1000 + 10 * Math.sin(t * 0.6 + i), y = rnd(i + 50) * 1900 + ((t * 8 + i * 3) % 40); return <g key={i}><circle cx={x} cy={y} r={30} fill="#7a8a6a" stroke={L} strokeWidth={3} /><circle cx={x} cy={y - 6} r={18} fill={['#3a3a3a', '#5a4a3a', '#6a6a6a'][i % 3]} /><path d={`M${x - 30} ${y + 10} h-22 M${x + 30} ${y + 10} h22`} stroke="#9aaa8a" strokeWidth={12} strokeLinecap="round" /></g>; })}
    <rect x={0} y={0} width={1080} height={160} fill="#6a6560" stroke={L} strokeWidth={4} />
  </Svg>
);

// ---------- Caminhão de mudança ----------
export const Caminhao = ({ x, y, s = 1, t, ligado = 0, farol = 0 }: { x: number; y: number; s?: number; t: number; ligado?: number; farol?: number }) => (
  <g transform={`translate(${x} ${y + (ligado ? 3 * Math.sin(t * 40) : 0)}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={430} ry={24} fill="#000" opacity={0.25} />
    <rect x={-420} y={-420} width={560} height={390} rx={14} fill="#f4f0e4" stroke={L} strokeWidth={7} />
    <rect x={-400} y={-330} width={520} height={130} fill="#2f5fa8" />
    <text x={-140} y={-250} textAnchor="middle" fontFamily="Arial Black" fontSize={54} fill="#fff">MUDANÇAS</text>
    <text x={-140} y={-210} textAnchor="middle" fontFamily="Arial Black" fontSize={32} fill="#f2c94c">RÁPIDO &amp; SEGURO</text>
    <path d="M140 -300 H300 Q360 -300 380 -230 L410 -120 V-30 H140 z" fill="#c22a2a" stroke={L} strokeWidth={7} />
    <path d="M170 -280 H290 Q330 -280 345 -230 L360 -170 H170 z" fill="#9ab4c8" stroke={L} strokeWidth={5} />
    <rect x={380} y={-110} width={34} height={30} rx={6} fill={farol ? '#fff6c8' : '#e8e2c0'} stroke={L} strokeWidth={3} />
    {farol > 0 && <path d="M414 -95 L900 -220 L900 40 z" fill="#fff6c8" opacity={0.25 * farol} />}
    {[-300, -120, 280].map((w) => <g key={w}><circle cx={w} cy={-20} r={56} fill="#2a2a30" stroke={L} strokeWidth={6} /><circle cx={w} cy={-20} r={22} fill="#9aa0aa" /></g>)}
    {ligado > 0 && [0, 1, 2].map((i) => { const k = (t * 1.5 + i / 3) % 1; return <circle key={i} cx={-440 - k * 140} cy={-30 - k * 60} r={24 + k * 40} fill="#6a6a72" opacity={0.5 * (1 - k)} />; })}
  </g>
);

// ---------- Acampamento na pedreira (noite) ----------
export const Pedreira = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#0c1220" />
    {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 4) * 500} r={2} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t + i))} />)}
    <circle cx={180} cy={220} r={60} fill="#e8e4d0" />
    {/* paredões de pedra em degraus */}
    <path d="M0 520 L160 500 L200 640 L420 620 L460 760 L620 740 L660 880 L1080 860 V1920 H0 z" fill="#5a5048" />
    <path d="M0 700 L220 690 L240 820 L520 810 L540 960 L1080 940 V1920 H0 z" fill="#6a5e54" />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${rnd(i) * 1080} ${560 + rnd(i + 3) * 400} l${40 + rnd(i) * 80} ${10 + rnd(i + 1) * 30}`} stroke="#4a4038" strokeWidth={4} />)}
    <path d="M0 1080 H1080 V1920 H0 z" fill="#4a4238" />
    {/* lago verde no fundo da pedreira */}
    <ellipse cx={860} cy={1060} rx={260} ry={50} fill="#1e4a4a" /><ellipse cx={860} cy={1060} rx={200} ry={30} fill="#2a6a6a" opacity={0.6} />
    {/* trailer, varal, caixa d'água, barracas */}
    <g transform="translate(220 1230)"><rect x={-180} y={-170} width={360} height={170} rx={30} fill="#e8e2d0" stroke={L} strokeWidth={6} /><rect x={-150} y={-140} width={90} height={60} rx={8} fill="#ffd166" opacity={0.85} /><rect x={20} y={-140} width={90} height={60} rx={8} fill="#ffd166" opacity={0.85} /><path d="M-180 -40 H180" stroke="#2f8acf" strokeWidth={14} /><circle cx={-100} cy={0} r={34} fill="#2a2a30" stroke={L} strokeWidth={5} /><circle cx={100} cy={0} r={34} fill="#2a2a30" stroke={L} strokeWidth={5} /><path d="M180 -80 h40" stroke="#5a5a62" strokeWidth={10} /></g>
    <g><path d="M420 1120 L1000 1110" stroke="#c8c8c8" strokeWidth={3} />{[460, 560, 700, 840].map((x, i) => <rect key={x} x={x} y={1112} width={70} height={80} fill={['#d1495b', '#f2c94c', '#3aa14a', '#2f8acf'][i]} opacity={0.85} transform={`rotate(${2 * Math.sin(t + i)} ${x + 35} 1112)`} />)}<path d="M420 1120 V1260 M1000 1110 V1260" stroke="#5a3a22" strokeWidth={10} /></g>
    {[[560, 1340, '#a83a3a', 1], [900, 1330, '#2f6fb3', 0.9], [120, 1420, '#3a8a4a', 0.8], [1000, 1460, '#c9a14a', 0.85]].map(([x, y, c, s], i) => <g key={i} transform={`translate(${x} ${y}) scale(${s})`}><path d="M-130 0 L0 -150 L130 0 z" fill={c as string} stroke={L} strokeWidth={5} /><path d="M0 -150 L-40 0 H40 z" fill="#1a1010" opacity={0.7} /><circle cx={0} cy={-60} r={30} fill="#ffd166" opacity={0.25} /></g>)}
    {/* fogueiras */}
    {[[360, 1580], [780, 1620]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><circle r={220} fill="#ff9a3a" opacity={0.12 + 0.03 * Math.sin(t * 9 + i)} />{[[-50, 10, 30], [50, 10, -30]].map(([dx, dy, a], k) => <rect key={k} x={dx - 60} y={dy - 12} width={120} height={24} rx={10} fill="#5a3a22" stroke={L} strokeWidth={3} transform={`rotate(${a} ${dx} ${dy})`} />)}{[0, 1, 2].map((k) => { const h = 100 + 30 * Math.sin(t * 12 + k * 2 + i); return <path key={k} d={`M${-30 + k * 30} 6 q-26 ${-h * 0.5} 6 ${-h} q14 ${h * 0.5} 14 ${h} z`} fill={k % 2 ? '#ffd166' : '#ff7a2a'} />; })}{Array.from({ length: 5 }, (_, k) => { const q = (t * 0.9 + k / 5 + i * 0.3) % 1; return <circle key={k} cx={Math.sin(q * 6 + k) * 30} cy={-60 - q * 260} r={4} fill="#ffd166" opacity={1 - q} />; })}{Array.from({ length: 8 }, (_, k) => { const a = (k / 8) * Math.PI * 2; return <ellipse key={k} cx={Math.cos(a) * 90} cy={24 + Math.sin(a) * 28} rx={22} ry={13} fill="#6a6a72" stroke={L} strokeWidth={2} />; })}</g>)}
    {/* panela no tripé e bancos de tronco */}
    <g transform="translate(780 1620)"><path d="M-70 0 L0 -170 L70 0" stroke="#3a3a3a" strokeWidth={8} fill="none" /><path d="M0 -170 v40" stroke="#3a3a3a" strokeWidth={4} /><path d="M-40 -130 h80 v40 q0 26 -40 26 q-40 0 -40 -26 z" fill="#3a3a40" stroke={L} strokeWidth={4} /></g>
    <rect x={200} y={1760} width={300} height={44} rx={20} fill="#5a3a22" stroke={L} strokeWidth={4} />
    <rect x={640} y={1790} width={300} height={44} rx={20} fill="#5a3a22" stroke={L} strokeWidth={4} />
    {/* vaga-lumes */}
    {Array.from({ length: 12 }, (_, i) => { const o = Math.max(0, Math.sin(t * 2 + i * 1.7)); return <circle key={i} cx={rnd(i + 11) * 1080 + 30 * Math.sin(t * 0.5 + i)} cy={1000 + rnd(i + 23) * 400} r={4} fill="#f4ffb0" opacity={o} />; })}
  </Svg>
);
// Alçapão no chão do ônibus (abre de 0 a 1).
export const Alcapao = ({ x, y, k, s = 1 }: { x: number; y: number; k: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-130} y={-50} width={260} height={100} fill="#05060a" stroke={L} strokeWidth={5} />
    <g transform={`scale(1 ${1 - 0.9 * k}) translate(0 ${-50 * k})`}><rect x={-130} y={-50} width={260} height={100} fill="#4a4e54" stroke={L} strokeWidth={5} />{[-80, 0, 80].map((dx) => <path key={dx} d={`M${dx - 30} -30 v60 M${dx} -30 v60 M${dx + 30} -30 v60`} stroke="#3a3e44" strokeWidth={4} />)}<rect x={-20} y={30} width={40} height={14} rx={6} fill="#c9ccd4" /></g>
  </g>
);
// Chave da algema (voando).
export const Chave = ({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><circle r={20} fill="none" stroke="#e8d070" strokeWidth={9} /><path d="M20 0 H80 M60 0 v16 M74 0 v12" stroke="#e8d070" strokeWidth={9} strokeLinecap="round" /><circle r={46} fill="#fff6c8" opacity={0.2} /></g>
);
