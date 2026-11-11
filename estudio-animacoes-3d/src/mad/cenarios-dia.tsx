// Cenários de dia detalhados (rua, prefeitura em época de eleição, feira) e pássaros.
import { useId } from 'react';
import { L, Svg } from './cenarios';

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- Céu: degradê, sol com raios girando, nuvens fofas, morros e passarinhos ----------
export const CeuDia = ({ t, horizonte = 1150 }: { t: number; horizonte?: number }) => {
  const id = useId().replace(/:/g, '');
  return (
    <>
      <defs>
        <linearGradient id={`c${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fc3ef" />
          <stop offset="1" stopColor="#ffe3b8" />
        </linearGradient>
      </defs>
      <rect width={1080} height={horizonte + 20} fill={`url(#c${id})`} />
      <g transform={`translate(880 250) rotate(${t * 12})`}>
        {Array.from({ length: 12 }, (_, i) => <path key={i} d="M0 -100 L14 -180 L-14 -180 z" fill="#ffe08a" opacity={0.6} transform={`rotate(${i * 30})`} />)}
      </g>
      <circle cx={880} cy={250} r={80} fill="#ffd166" stroke="#f2a93b" strokeWidth={6} />
      {[0, 1, 2, 3].map((i) => {
        const x = ((i * 330 + t * (10 + i * 5)) % 1400) - 200, y = 170 + (i % 2) * 190 + i * 30, s = 0.8 + 0.25 * (i % 3);
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" stroke="#d6e6f2" strokeWidth={4}>
            <ellipse cx={0} cy={0} rx={110} ry={40} />
            <circle cx={-40} cy={-20} r={44} />
            <circle cx={20} cy={-36} r={56} />
            <circle cx={70} cy={-12} r={40} />
            <ellipse cx={0} cy={6} rx={106} ry={34} stroke="none" />
          </g>
        );
      })}
      <Passaros t={t} />
      <path d={`M0 ${horizonte - 140} Q180 ${horizonte - 230} 360 ${horizonte - 150} T720 ${horizonte - 170} T1080 ${horizonte - 140} V${horizonte} H0 z`} fill="#9fd08a" />
      <path d={`M0 ${horizonte - 90} Q240 ${horizonte - 160} 520 ${horizonte - 90} T1080 ${horizonte - 100} V${horizonte} H0 z`} fill="#7fbf6e" />
    </>
  );
};
// Bando de passarinhos em "v" voando.
export const Passaros = ({ t, n = 5, y = 420 }: { t: number; n?: number; y?: number }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = ((t * 60 + i * 70 + rnd(i) * 200) % 1400) - 150, yy = y + i * 24 + Math.sin(t * 2 + i) * 10, a = 12 * Math.sin(t * 10 + i);
      return <path key={i} d={`M${x - 20} ${yy + a * 0.3} Q${x - 10} ${yy - a} ${x} ${yy} Q${x + 10} ${yy - a} ${x + 20} ${yy + a * 0.3}`} stroke={L} strokeWidth={4} fill="none" strokeLinecap="round" />;
    })}
  </g>
);
// Passarinho pousado (com piscar e bicada).
export const Passarinho = ({ t, x, y, s = 1, cor = '#d1495b' }: { t: number; x: number; y: number; s?: number; cor?: string }) => {
  const bica = Math.max(0, Math.sin(t * 5)) ** 8 * 8;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={0} cy={-22} rx={28} ry={22} fill={cor} stroke={L} strokeWidth={4} />
        <circle cx={18} cy={-44 + bica * 0.3} r={16} fill={cor} stroke={L} strokeWidth={4} />
        <path d={`M32 ${-46 + bica * 0.3} l14 4 l-14 4 z`} fill="#f2a93b" stroke={L} strokeWidth={2} />
        <circle cx={22} cy={-48 + bica * 0.3} r={(t * 0.8) % 3 < 0.1 ? 0.5 : 3.5} fill={L} />
        <path d="M-26 -26 l-22 -4 l6 12 z" fill={cor} stroke={L} strokeWidth={3} />
        <path d="M-6 -2 v8 M6 -2 v8" stroke="#f2a93b" strokeWidth={3} />
      </g>
    </svg>
  );
};

// Casa de dia: tábuas, telhas, chaminé, janelas com cortina e floreira, porta e degrau.
const Casa = ({ x, y, w = 260, h = 260, cor, telhado, t }: { x: number; y: number; w?: number; h?: number; cor: string; telhado: string; t: number }) => {
  const topo = y - h, pico = topo - w * 0.45;
  return (
    <g>
      <rect x={x + w * 0.68} y={topo - w * 0.36} width={34} height={w * 0.3} fill="#a85a4a" stroke={L} strokeWidth={4} />
      <rect x={x} y={topo} width={w} height={h} fill={cor} stroke={L} strokeWidth={5} />
      {Array.from({ length: Math.floor(h / 26) }, (_, i) => <path key={i} d={`M${x + 4} ${topo + 26 * (i + 1)} h${w - 8}`} stroke={L} strokeWidth={2} opacity={0.13} />)}
      <path d={`M${x - 24} ${topo} L${x + w / 2} ${pico} L${x + w + 24} ${topo} z`} fill={telhado} stroke={L} strokeWidth={5} strokeLinejoin="round" />
      {[0.3, 0.55, 0.8].map((f, i) => <path key={i} d={`M${x + w / 2 - (w / 2 + 24) * f} ${pico + (topo - pico) * f} h${(w + 48) * f}`} stroke={L} strokeWidth={2.5} opacity={0.3} strokeDasharray="14 8" />)}
      {[x + 26, x + w - 92].map((wx) => (
        <g key={wx}>
          <rect x={wx} y={topo + 36} width={66} height={66} fill="#bfe6ff" stroke={L} strokeWidth={4} />
          <path d={`M${wx + 6} ${topo + 44} l18 -0 l-14 20 z`} fill="#fff" opacity={0.7} />
          <path d={`M${wx} ${topo + 36} q16 28 6 66 h-6 z M${wx + 66} ${topo + 36} q-16 28 -6 66 h6 z`} fill="#f4a3a8" opacity={0.9} />
          <path d={`M${wx + 33} ${topo + 36} v66 M${wx} ${topo + 69} h66`} stroke={L} strokeWidth={3} />
          <rect x={wx - 6} y={topo + 100} width={78} height={14} fill="#8a5a32" stroke={L} strokeWidth={3} />
          {[8, 26, 44, 62].map((fx, j) => <circle key={j} cx={wx + fx} cy={topo + 98 + Math.sin(t * 2 + j) * 1.5} r={7} fill={['#f28fb0', '#ffd166', '#b05ad9', '#e5484d'][j]} />)}
        </g>
      ))}
      <rect x={x + w / 2 - 34} y={y - 118} width={68} height={118} rx={6} fill="#6b4a2e" stroke={L} strokeWidth={4} />
      <circle cx={x + w / 2 + 22} cy={y - 58} r={5} fill="#f2c94c" />
      <rect x={x + w / 2 - 48} y={y - 8} width={96} height={14} fill="#c9bfae" stroke={L} strokeWidth={3} />
    </g>
  );
};
const Cerca = ({ x0, x1, y }: { x0: number; x1: number; y: number }) => (
  <g>
    <rect x={x0} y={y - 52} width={x1 - x0} height={10} fill="#efe4cf" stroke={L} strokeWidth={3} />
    {Array.from({ length: Math.floor((x1 - x0) / 26) }, (_, i) => <path key={i} d={`M${x0 + 6 + i * 26} ${y} v-70 l8 -10 l8 10 v70 z`} fill="#fffaf0" stroke={L} strokeWidth={3} />)}
  </g>
);
const Moita = ({ x, y }: { x: number; y: number }) => (
  <g>
    <circle cx={x - 22} cy={y - 18} r={26} fill="#4f9a55" stroke={L} strokeWidth={3} />
    <circle cx={x + 14} cy={y - 26} r={32} fill="#5aab5f" stroke={L} strokeWidth={3} />
    {[[-24, -26], [10, -40], [24, -18]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={y + dy} r={6} fill={['#f28fb0', '#ffd166', '#fff'][i]} />)}
  </g>
);
// Carro de lado (frente para a direita). gira = ângulo das rodas em radianos.
const Carro = ({ x, y, cor = '#3d8bfd', gira = 0 }: { x: number; y: number; cor?: string; gira?: number }) => (
  <g>
    <path d={`M${x} ${y - 30} q0 -40 40 -46 l40 -40 h120 l50 40 q40 6 40 46 v20 h-290 z`} fill={cor} stroke={L} strokeWidth={5} strokeLinejoin="round" />
    <path d={`M${x + 90} ${y - 76} l30 -32 h50 v32 z M${x + 180} ${y - 76} v-32 h30 l36 32 z`} fill="#bfe6ff" stroke={L} strokeWidth={3} />
    <path d={`M${x + 120} ${y - 70} v50 M${x + 196} ${y - 70} h14`} stroke={L} strokeWidth={3} opacity={0.5} />
    {[x + 60, x + 230].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy={y - 10} r={30} fill="#2a2a2e" stroke={L} strokeWidth={4} />
        <circle cx={cx} cy={y - 10} r={14} fill="#c9ccd4" />
        {[0, 1, 2].map((k) => { const a = gira + (k * Math.PI * 2) / 3; return <path key={k} d={`M${cx} ${y - 10} l${Math.cos(a) * 13} ${Math.sin(a) * 13}`} stroke="#6c727f" strokeWidth={4} strokeLinecap="round" />; })}
      </g>
    ))}
    <rect x={x + 276} y={y - 52} width={14} height={12} rx={3} fill="#ffd166" stroke={L} strokeWidth={2} />
    <rect x={x - 2} y={y - 46} width={10} height={12} rx={3} fill="#e5484d" stroke={L} strokeWidth={2} />
  </g>
);
// Calçada + rua com faixa de pedestres (chão da calçada em y = 1330).
// O carro entra pela esquerda a partir de `desde` (segundos), atravessa a cena inteira e sai pela direita.
const ESCALA_CARRO = 1.45;
const Calcada = ({ t, carro = true, desde = 0 }: { t: number; carro?: boolean; desde?: number }) => {
  const x = -300 * ESCALA_CARRO - 20 + (t - desde) * 380;
  const andando = carro && t >= desde && x < 1100;
  return (
    <>
      <rect x={0} y={1150} width={1080} height={180} fill="#e6d9bf" stroke={L} strokeWidth={5} />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 80} 1150 l-20 180`} stroke={L} strokeWidth={2} opacity={0.15} />)}
      <path d="M0 1240 H1080" stroke={L} strokeWidth={2} opacity={0.15} />
      <rect x={0} y={1318} width={1080} height={22} fill="#b5ab98" stroke={L} strokeWidth={3} />
      <rect x={0} y={1340} width={1080} height={580} fill="#5c6370" />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 200 + 30} y={1700} width={120} height={16} rx={6} fill="#f1f1f1" />)}
      {/* faixa de pedestres: listras deitadas cobrindo a rua toda, de um meio-fio ao outro */}
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={770} y={1352 + i * 48} width={270} height={30} rx={3} fill="#f1f1f1" opacity={0.92} />)}
      {andando && (
        <g transform={`translate(${x} ${1640 + 2 * Math.abs(Math.sin(t * 14))}) scale(${ESCALA_CARRO})`}>
          <ellipse cx={145} cy={22} rx={150} ry={10} fill="#000" opacity={0.18} />
          <Carro x={0} y={0} cor="#e5484d" gira={(t - desde) * 380 / (30 * ESCALA_CARRO)} />
          {[0, 1, 2].map((k) => <path key={k} d={`M${-20 - k * 26} ${-40 + k * 16} h${-40 - k * 10}`} stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.6} />)}
        </g>
      )}
    </>
  );
};

// ---------- Rua de dia detalhada ----------
export const RuaDia = ({ t, carro = true, carroDesde = 0.2 }: { t: number; carro?: boolean; carroDesde?: number }) => (
  <Svg>
    <CeuDia t={t} />
    <Casa x={110} y={1150} cor="#f2c94c" telhado="#d1495b" t={t} />
    <Casa x={430} y={1150} w={240} h={300} cor="#b9a3e3" telhado="#c0392b" t={t + 1} />
    <Casa x={790} y={1150} cor="#f4a3a8" telhado="#d1495b" t={t + 2} />
    <Cerca x0={0} x1={100} y={1150} />
    <Cerca x0={680} x1={780} y={1150} />
    {[[60, 1150], [400, 1150], [735, 1150], [1050, 1150]].map(([x, y], i) => <Moita key={i} x={x} y={y} />)}
    <g><rect x={355} y={1205} width={10} height={70} fill="#3a3f4a" /><rect x={335} y={1180} width={50} height={32} rx={14} fill="#3d6ad1" stroke={L} strokeWidth={3} /></g>
    <Calcada t={t} carro={carro} desde={carroDesde} />
  </Svg>
);

// ---------- Prefeitura em época de eleição ----------
export const PrefeituraDia = ({ t }: { t: number }) => (
  <Svg>
    <CeuDia t={t} />
    {/* bandeirinhas */}
    {[0, 1].map((r) => (
      <g key={r}>
        <path d={`M0 ${500 + r * 60} Q540 ${600 + r * 60} 1080 ${500 + r * 60}`} stroke={L} strokeWidth={3} fill="none" />
        {Array.from({ length: 14 }, (_, i) => {
          const x = 40 + i * 75, y = 500 + r * 60 + 100 * (1 - Math.pow((x - 540) / 540, 2)) * 1 + Math.sin(t * 3 + i) * 3;
          return <path key={i} d={`M${x - 18} ${y} h36 l-18 40 z`} fill={['#d1495b', '#2fa36b', '#ffd166', '#3d8bfd'][(i + r) % 4]} stroke={L} strokeWidth={2} />;
        })}
      </g>
    ))}
    <path d="M140 680 L540 520 L940 680 z" fill="#d8c6a6" stroke={L} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={540} cy={630} r={34} fill="#fff" stroke={L} strokeWidth={4} />
    <path d={`M540 630 l0 -22 M540 630 l${16 * Math.cos(t)} ${16 * Math.sin(t)}`} stroke={L} strokeWidth={4} strokeLinecap="round" />
    <rect x={160} y={680} width={760} height={470} fill="#f4ead6" stroke={L} strokeWidth={6} />
    <rect x={300} y={700} width={480} height={64} rx={10} fill="#2f4f8f" stroke={L} strokeWidth={5} />
    <text x={540} y={746} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={44} fill="#fff">PREFEITURA</text>
    {[210, 350, 490, 630, 770, 870].map((x) => <g key={x}><rect x={x} y={780} width={34} height={310} fill="#fffaf0" stroke={L} strokeWidth={4} /><rect x={x - 6} y={772} width={46} height={14} fill="#e6d9bf" stroke={L} strokeWidth={3} /></g>)}
    <rect x={470} y={950} width={140} height={200} rx={8} fill="#6b4a2e" stroke={L} strokeWidth={5} />
    {/* cartazes de campanha */}
    <g transform="rotate(-4 290 960)"><rect x={232} y={900} width={116} height={140} fill="#d1495b" stroke={L} strokeWidth={4} /><text x={290} y={960} textAnchor="middle" fontFamily="Arial Black" fontSize={26} fill="#fff">VOTE</text><text x={290} y={995} textAnchor="middle" fontFamily="Arial Black" fontSize={22} fill="#ffd166">OTÁVIO</text></g>
    <g transform="rotate(5 790 960)"><rect x={732} y={900} width={116} height={140} fill="#2fa36b" stroke={L} strokeWidth={4} /><text x={790} y={960} textAnchor="middle" fontFamily="Arial Black" fontSize={26} fill="#fff">RITA</text><text x={790} y={1000} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#ffd166">13</text></g>
    {[0, 1, 2].map((i) => <rect key={i} x={380 - i * 40} y={1090 + i * 20} width={320 + i * 80} height={20} fill="#d8ccb4" stroke={L} strokeWidth={3} />)}
    <path d="M540 520 V390" stroke={L} strokeWidth={6} />
    <path d={`M540 395 q40 ${-10 + 8 * Math.sin(t * 4)} 80 0 v50 q-40 ${10 + 8 * Math.sin(t * 4 + 1)} -80 0 z`} fill="#2fa36b" stroke={L} strokeWidth={4} />
    {/* chafariz */}
    <ellipse cx={150} cy={1260} rx={110} ry={30} fill="#9aa8b8" stroke={L} strokeWidth={4} />
    <ellipse cx={150} cy={1252} rx={90} ry={20} fill="#7fc8ef" />
    {[-1, 1].map((s) => <path key={s} d={`M150 1200 q${s * 40} -${60 + 6 * Math.sin(t * 8)} ${s * 70} 50`} stroke="#7fc8ef" strokeWidth={6} fill="none" />)}
    <rect x={140} y={1180} width={20} height={70} fill="#9aa8b8" stroke={L} strokeWidth={3} />
    {[1000].map((x) => <g key={x}><rect x={x - 10} y={1060} width={20} height={90} fill="#8a5a32" stroke={L} strokeWidth={4} /><circle cx={x} cy={1010} r={70} fill="#57a773" stroke={L} strokeWidth={5} />{[[-30, -20], [20, -40], [30, 10]].map(([dx, dy], i) => <circle key={i} cx={x + dx} cy={1010 + dy} r={9} fill="#f28fb0" />)}</g>)}
    <Calcada t={t} carro={false} />
    {/* pombos na calçada */}
    {[[420, 1300], [470, 1310], [680, 1296]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y - Math.max(0, Math.sin(t * 6 + i)) ** 6 * 6})`}>
        <ellipse cx={0} cy={-14} rx={20} ry={14} fill="#a0a8b8" stroke={L} strokeWidth={3} />
        <circle cx={14} cy={-28} r={10} fill="#8a92a8" stroke={L} strokeWidth={3} />
        <path d="M23 -28 l8 3 l-8 3 z" fill="#f2a93b" />
      </g>
    ))}
  </Svg>
);

// ---------- Feira detalhada ----------
const Barraca = ({ x, cor, s = 1, frutas }: { x: number; cor: string; s?: number; frutas: string }) => (
  <g transform={`translate(${x} ${1150}) scale(${s}) translate(${-x} ${-1150})`}>
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${x - 160 + i * 80} 760 h80 v70 q-40 30 -80 0 z`} fill={i % 2 ? '#fff' : cor} stroke={L} strokeWidth={4} />)}
    {[x - 150, x + 140].map((px) => <rect key={px} x={px} y={760} width={14} height={390} fill="#8a5a32" stroke={L} strokeWidth={3} />)}
    <rect x={x - 160} y={1030} width={320} height={30} fill="#b07a45" stroke={L} strokeWidth={4} />
    <rect x={x - 140} y={1060} width={280} height={90} fill="#8a5a32" stroke={L} strokeWidth={4} />
    {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={x - 120 + (i % 4) * 75} cy={1010 - Math.floor(i / 4) * 30} r={20} fill={frutas} stroke={L} strokeWidth={3} />)}
  </g>
);
export const FeiraDia = ({ t }: { t: number }) => (
  <Svg>
    <CeuDia t={t} />
    {/* barracas ao fundo */}
    <Barraca x={130} cor="#3d8bfd" s={0.75} frutas="#e5484d" />
    <Barraca x={950} cor="#f2c94c" s={0.75} frutas="#7fbf6e" />
    <rect x={0} y={1150} width={1080} height={180} fill="#e6d9bf" stroke={L} strokeWidth={5} />
    <rect x={0} y={1318} width={1080} height={22} fill="#b5ab98" stroke={L} strokeWidth={3} />
    <rect x={0} y={1340} width={1080} height={580} fill="#5c6370" />
    {/* barraca da Dona Rita */}
    <g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M${120 + i * 105} 620 h105 v90 q-52 40 -105 0 z`} fill={i % 2 ? '#fff' : '#d1495b'} stroke={L} strokeWidth={4} />)}
      {[140, 920].map((x) => <rect key={x} x={x} y={620} width={20} height={530} fill="#8a5a32" stroke={L} strokeWidth={4} />)}
      {/* cacho de bananas e lâmpada pendurados */}
      <path d="M300 700 v40" stroke={L} strokeWidth={4} />
      {[-20, -6, 8, 22].map((d, i) => <path key={i} d={`M${300 + d} 740 q${d * 0.6} 40 ${d * 1.4 + 6} 70`} stroke="#f2c94c" strokeWidth={16} strokeLinecap="round" fill="none" transform={`rotate(${2 * Math.sin(t * 2)} 300 700)`} />)}
      <path d="M780 700 v50" stroke={L} strokeWidth={3} />
      <circle cx={780} cy={765} r={16} fill="#fff6c8" stroke={L} strokeWidth={3} />
      <rect x={130} y={980} width={820} height={40} fill="#b07a45" stroke={L} strokeWidth={5} />
      <rect x={160} y={1020} width={760} height={130} fill="#8a5a32" stroke={L} strokeWidth={5} />
      {[0, 1, 2].map((i) => <rect key={i} x={190 + i * 260} y={1040} width={200} height={90} fill="#c9965a" stroke={L} strokeWidth={3} />)}
      {[220, 330, 440].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={950} rx={60} ry={40} fill="#2e8b3e" stroke={L} strokeWidth={4} />
          {[-30, -10, 10, 30].map((d) => <path key={d} d={`M${x + d} 912 q${d * 0.2} 38 0 76`} stroke="#1b5e28" strokeWidth={5} fill="none" />)}
        </g>
      ))}
      <path d="M560 990 l80 -110 l80 110 z" fill="#e5484d" stroke={L} strokeWidth={4} />
      <path d="M572 975 l68 -90 l68 90 z" fill="#2e8b3e" />
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={770 + (i % 4) * 38 + (i > 3 ? 19 : 0)} cy={960 - (i > 3 ? 30 : 0)} r={20} fill="#ff8a2f" stroke={L} strokeWidth={3} />)}
      {/* plaquinhas de preço e balança */}
      {[[330, 880, 'R$ 5'], [840, 900, 'R$ 2']].map(([x, y, p], i) => <g key={i}><rect x={Number(x) - 44} y={Number(y) - 26} width={88} height={40} rx={6} fill="#fff" stroke={L} strokeWidth={3} /><text x={Number(x)} y={Number(y) + 4} textAnchor="middle" fontFamily="Arial Black" fontSize={24} fill="#d1495b">{p}</text></g>)}
      <g><rect x={640} y={940} width={80} height={40} rx={6} fill="#c9ccd4" stroke={L} strokeWidth={3} /><ellipse cx={680} cy={934} rx={50} ry={10} fill="#e6e8ee" stroke={L} strokeWidth={3} /></g>
      <rect x={380} y={560} width={320} height={70} rx={10} fill="#fff" stroke={L} strokeWidth={5} />
      <text x={540} y={610} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={42} fill="#d1495b">FEIRA DA RITA</text>
    </g>
    {/* engradados no chão */}
    {[[80, 1300], [990, 1300]].map(([x, y], i) => <g key={i}><rect x={x - 50} y={y - 70} width={100} height={70} fill="#c9965a" stroke={L} strokeWidth={4} /><path d={`M${x - 50} ${y - 35} h100`} stroke={L} strokeWidth={3} />{[-25, 0, 25].map((d) => <circle key={d} cx={x + d} cy={y - 78} r={14} fill={i ? '#ffd166' : '#e5484d'} stroke={L} strokeWidth={2} />)}</g>)}
  </Svg>
);
