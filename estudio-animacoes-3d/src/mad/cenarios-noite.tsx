// Cenários noturnos detalhados e as SOMBRAS (monstros) de "O Farol".
import { useId } from 'react';
import { L, Svg } from './cenarios';

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const uid = () => useId().replace(/:/g, '');

// ---------- Céu noturno: degradê, estrelas que cintilam, lua com crateras e halo, nuvens escuras ----------
export const CeuNoite = ({ t, lua = [840, 330] as [number, number], horizonte = 1150 }: { t: number; lua?: [number, number]; horizonte?: number }) => {
  const id = uid();
  return (
    <>
      <defs>
        <linearGradient id={`c${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#070a1f" />
          <stop offset="0.6" stopColor="#1b2050" />
          <stop offset="1" stopColor="#3b2d5e" />
        </linearGradient>
        <radialGradient id={`h${id}`}><stop offset="0" stopColor="#fff6c8" stopOpacity="0.35" /><stop offset="1" stopColor="#fff6c8" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width={1080} height={horizonte + 20} fill={`url(#c${id})`} />
      {Array.from({ length: 60 }, (_, i) => {
        const x = rnd(i) * 1080, y = rnd(i + 99) * (horizonte - 300);
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * (1 + rnd(i + 7) * 2) + i));
        return <circle key={i} cx={x} cy={y} r={1.5 + rnd(i + 3) * 2.5} fill="#fff" opacity={tw} />;
      })}
      <circle cx={lua[0]} cy={lua[1]} r={190} fill={`url(#h${id})`} />
      <circle cx={lua[0]} cy={lua[1]} r={72} fill="#fff4c4" />
      {[[-22, -14, 13], [18, 10, 9], [-6, 26, 7], [26, -24, 6]].map(([dx, dy, r], i) => <circle key={i} cx={lua[0] + dx} cy={lua[1] + dy} r={r} fill="#e6d99a" />)}
      {[0, 1, 2].map((i) => {
        const x = ((i * 430 + t * (14 + i * 6)) % 1500) - 300, y = 230 + i * 170;
        return (
          <g key={i} fill="#2a2f5c" opacity={0.85}>
            <ellipse cx={x} cy={y} rx={150} ry={34} />
            <ellipse cx={x + 70} cy={y - 22} rx={80} ry={36} />
            <ellipse cx={x - 60} cy={y - 12} rx={60} ry={26} />
          </g>
        );
      })}
    </>
  );
};

// Silhueta da cidade ao fundo, com algumas janelinhas acesas.
const Silhueta = ({ y, acesas = true }: { y: number; acesas?: boolean }) => (
  <g>
    {[[0, 90, 260], [80, 70, 330], [150, 110, 220], [270, 80, 300], [350, 120, 250], [480, 70, 360], [560, 100, 280], [670, 90, 230], [770, 70, 320], [850, 120, 270], [980, 100, 310]].map(([x, w, h], i) => (
      <g key={i}>
        <rect x={x} y={y - h} width={w} height={h} fill="#1c1f3f" />
        {acesas && Array.from({ length: 6 }, (_, j) => rnd(i * 10 + j) > 0.55 && <rect key={j} x={x + 12 + (j % 2) * (w / 2)} y={y - h + 30 + Math.floor(j / 2) * 60} width={12} height={16} fill="#ffcf6a" opacity={0.7} />)}
      </g>
    ))}
  </g>
);

// Árvore seca e retorcida (dá o clima de medo).
const ArvoreSeca = ({ x, y, s = 1, t }: { x: number; y: number; s?: number; t: number }) => {
  const b = 2 * Math.sin(t * 0.8 + x);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#120d1c" strokeLinecap="round" fill="none">
      <path d="M0 0 C-8 -80 10 -160 -4 -260" strokeWidth={26} />
      <path d={`M-2 -170 C-40 -200 -70 -230 ${-110 + b} -300`} strokeWidth={12} />
      <path d={`M-4 -230 C30 -260 50 -300 ${80 + b} -350`} strokeWidth={10} />
      <path d={`M-4 -260 C-10 -300 -30 -330 ${-20 + b} -380`} strokeWidth={8} />
      <path d={`M-70 -235 l-40 -10 M50 -300 l30 -6 M-90 -270 l-12 -36 M60 -320 l-10 -40`} strokeWidth={5} />
    </g>
  );
};

// Casa detalhada: tábuas, telhas, chaminé com fumaça, janelas com cortina e luz, floreira, degrau, maçaneta.
const CasaNoite = ({ x, y, w = 260, h = 260, cor, telhado, acesa = [true, true], t }: { x: number; y: number; w?: number; h?: number; cor: string; telhado: string; acesa?: boolean[]; t: number }) => {
  const topo = y - h, pico = topo - w * 0.45;
  return (
    <g>
      {/* chaminé e fumaça */}
      <rect x={x + w * 0.68} y={topo - w * 0.36} width={34} height={w * 0.3} fill="#6b3b3b" stroke={L} strokeWidth={4} />
      {[0, 1, 2].map((i) => { const k = (t * 0.25 + i / 3) % 1; return <circle key={i} cx={x + w * 0.68 + 17 + Math.sin(k * 6 + i) * 14} cy={topo - w * 0.4 - k * 160} r={14 + k * 26} fill="#4a4a66" opacity={0.45 * (1 - k)} />; })}
      {/* parede com tábuas */}
      <rect x={x} y={topo} width={w} height={h} fill={cor} stroke={L} strokeWidth={5} />
      {Array.from({ length: Math.floor(h / 26) }, (_, i) => <path key={i} d={`M${x + 4} ${topo + 26 * (i + 1)} h${w - 8}`} stroke={L} strokeWidth={2} opacity={0.18} />)}
      {/* telhado com fileiras de telhas */}
      <path d={`M${x - 24} ${topo} L${x + w / 2} ${pico} L${x + w + 24} ${topo} z`} fill={telhado} stroke={L} strokeWidth={5} strokeLinejoin="round" />
      {[0.3, 0.55, 0.8].map((f, i) => <path key={i} d={`M${x + w / 2 - (w / 2 + 24) * f} ${pico + (topo - pico) * f} h${(w + 48) * f}`} stroke={L} strokeWidth={2.5} opacity={0.35} strokeDasharray="14 8" />)}
      {/* janelas */}
      {[x + 26, x + w - 92].map((wx, i) => (
        <g key={wx}>
          {acesa[i] && <rect x={wx - 30} y={topo + 10} width={126} height={126} fill="#ffcf6a" opacity={0.18} rx={60} />}
          <rect x={wx} y={topo + 36} width={66} height={66} fill={acesa[i] ? '#ffd98a' : '#1a1d3a'} stroke={L} strokeWidth={4} />
          <path d={`M${wx} ${topo + 36} q16 28 6 66 h-6 z M${wx + 66} ${topo + 36} q-16 28 -6 66 h6 z`} fill={acesa[i] ? '#d1495b' : '#3a2440'} opacity={0.9} />
          <path d={`M${wx + 33} ${topo + 36} v66 M${wx} ${topo + 69} h66`} stroke={L} strokeWidth={3} />
          <rect x={wx - 6} y={topo + 100} width={78} height={14} fill="#6b4a2e" stroke={L} strokeWidth={3} />
          {[8, 26, 44, 62].map((fx, j) => <circle key={j} cx={wx + fx} cy={topo + 98} r={7} fill={['#f28fb0', '#ffd166', '#b05ad9', '#f28fb0'][j]} />)}
        </g>
      ))}
      {/* porta, degrau e luz da varanda */}
      <rect x={x + w / 2 - 34} y={y - 118} width={68} height={118} rx={6} fill="#5a3a22" stroke={L} strokeWidth={4} />
      <path d={`M${x + w / 2 - 22} ${y - 104} h44 v40 h-44 z M${x + w / 2 - 22} ${y - 54} h44 v40 h-44 z`} fill="none" stroke={L} strokeWidth={2} opacity={0.4} />
      <circle cx={x + w / 2 + 22} cy={y - 58} r={5} fill="#f2c94c" />
      <rect x={x + w / 2 - 48} y={y - 8} width={96} height={14} fill="#9a8c7a" stroke={L} strokeWidth={3} />
    </g>
  );
};

// Cerca de madeira.
const Cerca = ({ x0, x1, y }: { x0: number; x1: number; y: number }) => (
  <g>
    <rect x={x0} y={y - 52} width={x1 - x0} height={10} fill="#d9cdb6" stroke={L} strokeWidth={3} />
    {Array.from({ length: Math.floor((x1 - x0) / 26) }, (_, i) => <path key={i} d={`M${x0 + 6 + i * 26} ${y} v-70 l8 -10 l8 10 v70 z`} fill="#efe4cf" stroke={L} strokeWidth={3} />)}
  </g>
);

// Poste com luz (cone amarelo) ou apagado.
const Poste = ({ x, y, aceso, t }: { x: number; y: number; aceso: boolean; t: number }) => (
  <g>
    {aceso && <path d={`M${x + 64} ${y - 322} L${x - 40} ${y} L${x + 180} ${y} z`} fill="#ffd98a" opacity={0.13 + 0.02 * Math.sin(t * 9)} />}
    <rect x={x - 7} y={y - 330} width={14} height={330} fill="#3a3f4a" stroke={L} strokeWidth={3} />
    <rect x={x - 16} y={y - 20} width={32} height={20} fill="#3a3f4a" stroke={L} strokeWidth={3} />
    <path d={`M${x} ${y - 330} q34 -24 64 0`} stroke="#3a3f4a" strokeWidth={10} fill="none" />
    <path d={`M${x + 46} ${y - 330} h36 l-6 18 h-24 z`} fill={aceso ? '#ffe8a3' : '#2a2d3a'} stroke={L} strokeWidth={3} />
    {aceso && <circle cx={x + 64} cy={y - 316} r={40} fill="#ffe8a3" opacity={0.25} />}
  </g>
);

// Névoa rasteira que passa devagar.
export const Nevoa = ({ t, y, op = 0.35 }: { t: number; y: number; op?: number }) => (
  <Svg>
    {Array.from({ length: 7 }, (_, i) => (
      <ellipse key={i} cx={((i * 240 + t * (18 + i * 4)) % 1500) - 200} cy={y + (i % 3) * 26} rx={230} ry={38} fill="#9aa6d6" opacity={op * (0.5 + 0.5 * rnd(i))} />
    ))}
  </Svg>
);

// ---------- Rua à noite detalhada (chão da calçada em y = 1330, como a Rua de dia) ----------
// acesa(i) diz se a janela i (0..5) está acesa; postes = postes acesos.
export const RuaNoite = ({ t, acesa = () => true, postes = true, nevoa = true }: { t: number; acesa?: (i: number) => boolean; postes?: boolean; nevoa?: boolean }) => (
  <>
    <Svg>
      <CeuNoite t={t} />
      <Silhueta y={1020} acesas={postes} />
      <path d="M0 1060 Q200 1000 420 1050 T860 1030 T1080 1050 V1160 H0 z" fill="#141834" />
      <ArvoreSeca x={40} y={1150} s={1.15} t={t} />
      <ArvoreSeca x={1030} y={1150} s={1.05} t={t} />
      <CasaNoite x={110} y={1150} cor="#c9a24a" telhado="#8e2f3c" acesa={[acesa(0), acesa(1)]} t={t} />
      <CasaNoite x={430} y={1150} w={240} h={300} cor="#8a77b8" telhado="#7a2230" acesa={[acesa(2), acesa(3)]} t={t + 1} />
      <CasaNoite x={790} y={1150} cor="#c27f86" telhado="#8e2f3c" acesa={[acesa(4), acesa(5)]} t={t + 2} />
      <Cerca x0={0} x1={100} y={1150} />
      <Cerca x0={380} x1={420} y={1150} />
      <Cerca x0={680} x1={780} y={1150} />
      {[[70, 1150], [395, 1150], [735, 1150], [1060, 1150]].map(([bx, by], i) => <g key={i}><circle cx={bx - 20} cy={by - 18} r={26} fill="#1f4a3a" stroke={L} strokeWidth={3} /><circle cx={bx + 14} cy={by - 24} r={30} fill="#255a46" stroke={L} strokeWidth={3} /></g>)}
      {/* calçada de ladrilhos */}
      <rect x={0} y={1150} width={1080} height={180} fill="#8f8775" stroke={L} strokeWidth={5} />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 80} 1150 l-20 180`} stroke={L} strokeWidth={2} opacity={0.25} />)}
      <path d="M0 1240 H1080" stroke={L} strokeWidth={2} opacity={0.25} />
      {/* caixa de correio */}
      <g><rect x={355} y={1205} width={10} height={70} fill="#3a3f4a" /><rect x={335} y={1180} width={50} height={32} rx={14} fill="#3d6ad1" stroke={L} strokeWidth={3} /></g>
      <Poste x={400} y={1170} aceso={postes} t={t} />
      <Poste x={960} y={1170} aceso={postes} t={t + 3} />
      {/* meio-fio, asfalto, faixa, poça com reflexo da lua e folhas */}
      <rect x={0} y={1318} width={1080} height={22} fill="#6f6a60" stroke={L} strokeWidth={3} />
      <rect x={0} y={1340} width={1080} height={580} fill="#272a35" />
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={i * 180 + 20} y={1600} width={110} height={16} rx={6} fill="#cfcfcf" opacity={0.6} />)}
      <ellipse cx={760} cy={1470} rx={130} ry={26} fill="#3b4570" />
      <ellipse cx={780} cy={1468} rx={26} ry={9} fill="#fff4c4" opacity={0.7} />
      {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={rnd(i + 40) * 1080} cy={1380 + rnd(i + 50) * 480} rx={12} ry={6} transform={`rotate(${rnd(i) * 180} ${rnd(i + 40) * 1080} ${1380 + rnd(i + 50) * 480})`} fill={['#8a4b2a', '#a8632e', '#6b3b20'][i % 3]} />)}
    </Svg>
    {nevoa && <Nevoa t={t} y={1290} />}
  </>
);

// ---------- Rio com ponte detalhada, montanhas, reflexos e vaga-lumes ----------
export const RioNoite = ({ t, ponte = false }: { t: number; ponte?: boolean }) => (
  <>
    <Svg>
      <CeuNoite t={t} lua={[200, 300]} horizonte={900} />
      <path d="M0 760 L160 560 L300 700 L470 520 L640 720 L780 600 L940 740 L1080 640 V900 H0 z" fill="#161a3a" />
      <path d="M0 820 L220 700 L380 800 L560 690 L760 820 L1080 760 V900 H0 z" fill="#1d2248" />
      {/* cidade iluminada ao longe */}
      {[[620, 110, 300], [740, 90, 380], [840, 120, 260], [970, 110, 330]].map(([x, w, h], i) => (
        <g key={i}>
          <rect x={x} y={900 - h} width={w} height={h} fill="#3a3f6a" stroke={L} strokeWidth={4} />
          <rect x={x + w / 2 - 4} y={900 - h - 40} width={8} height={40} fill="#3a3f6a" />
          <circle cx={x + w / 2} cy={900 - h - 42} r={6} fill="#ff6b6b" opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />
          {Array.from({ length: 15 }, (_, j) => <rect key={j} x={x + 14 + (j % 3) * (w / 3.4)} y={900 - h + 20 + Math.floor(j / 3) * 56} width={18} height={24} fill="#ffd166" opacity={0.55 + 0.45 * Math.sin(t * 2 + j + i)} />)}
        </g>
      ))}
      <ellipse cx={820} cy={880} rx={320} ry={130} fill="#ffd166" opacity={0.16} />
      {/* água com reflexos */}
      <rect x={0} y={900} width={1080} height={1020} fill="#152e5a" />
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={640 + (i % 8) * 50 + Math.sin(t * 2 + i) * 6} y={920 + Math.floor(i / 8) * 70 + (i % 3) * 18} width={22 + rnd(i) * 20} height={6} rx={3} fill="#ffd166" opacity={0.35 + 0.25 * Math.sin(t * 3 + i)} />)}
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${((i * 140 + t * 40) % 1200) - 100} ${1040 + (i % 5) * 150} q30 -14 60 0 t60 0`} stroke="#4d74b8" strokeWidth={5} fill="none" opacity={0.55} />)}
      <ellipse cx={200} cy={960} rx={40} ry={8} fill="#fff4c4" opacity={0.5} />
      {/* juncos e pedras na margem */}
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${20 + i * 22} 1920 q${-10 + Math.sin(t + i) * 6} -120 ${-4 + i % 3 * 6} -${170 + (i % 3) * 40}`} stroke="#1f3a2a" strokeWidth={8} fill="none" strokeLinecap="round" />)}
      <ellipse cx={140} cy={1890} rx={120} ry={50} fill="#2a2d3a" stroke={L} strokeWidth={4} />
      {ponte && (
        <g>
          {[160, 520, 880].map((x) => <rect key={x} x={x} y={1360} width={34} height={560} fill="#4a3020" stroke={L} strokeWidth={4} />)}
          <rect x={-20} y={1300} width={1120} height={60} fill="#7a4f2c" stroke={L} strokeWidth={6} />
          {Array.from({ length: 28 }, (_, i) => <path key={i} d={`M${i * 40} 1302 v56`} stroke={L} strokeWidth={2} opacity={0.35} />)}
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 95} y={1170} width={16} height={134} fill="#5a3a22" stroke={L} strokeWidth={4} />)}
          <path d="M-20 1182 Q47 1208 95 1182 T285 1182 T475 1182 T665 1182 T855 1182 T1100 1182" stroke="#c9a86a" strokeWidth={8} fill="none" />
          <path d="M-20 1240 Q47 1262 95 1240 T285 1240 T475 1240 T665 1240 T855 1240 T1100 1240" stroke="#c9a86a" strokeWidth={6} fill="none" />
        </g>
      )}
    </Svg>
    {/* vaga-lumes */}
    <Svg>
      {Array.from({ length: 12 }, (_, i) => {
        const x = (rnd(i + 70) * 1080 + Math.sin(t * 0.8 + i) * 40) % 1080, y = 1000 + rnd(i + 80) * 700 + Math.cos(t * 0.9 + i) * 30;
        return <circle key={i} cx={x} cy={y} r={5} fill="#e8ff8a" opacity={0.3 + 0.7 * Math.abs(Math.sin(t * 2 + i))} />;
      })}
    </Svg>
    <Nevoa t={t} y={1120} op={0.25} />
  </>
);

// ---------- SOMBRA (monstro) ----------
// Corpo de fumaça escura com contorno espinhoso, ombros curvados, braços longos com garras,
// fiapos subindo; olhos amarelos inclinados (bravos) com pupila de fenda e boca com dentes afiados.
// Desenhe duas vezes: sem `olhos` (corpo, atrás da escuridão) e com `olhos` (brilho, por cima).
export const Sombra = ({ t, x, y, h = 700, olhos = false, sorriso = 0, seed = 0, op = 1, alcanca = 0, lado = 1 }: { t: number; x: number; y: number; h?: number; olhos?: boolean; sorriso?: number; seed?: number; op?: number; alcanca?: number; lado?: number }) => {
  const id = uid();
  const w = h * 0.5;
  const cyB = y - h * 0.5;
  // contorno: semicírculo deformado com espinhos animados
  const pts: string[] = [];
  const N = 46;
  for (let i = 0; i <= N; i++) {
    const a = Math.PI + (i / N) * Math.PI; // da base esquerda, por cima, até a base direita
    const esp = Math.pow(Math.max(0, Math.sin(i * 1.9 + seed * 3)), 6) * 0.22;
    const ond = 0.05 * Math.sin(i * 0.8 + t * 3 + seed);
    const corc = Math.sin(a) < -0.85 ? 0.1 : 0; // corcunda/cabeça
    const rr = 1 + esp + ond + corc;
    pts.push(`${x + Math.cos(a) * (w / 2) * rr * (1.05 - 0.15 * Math.abs(Math.sin(a)))} ${cyB + Math.sin(a) * (h / 2) * rr}`);
  }
  // base com tentáculos de fumaça
  const base = Array.from({ length: 7 }, (_, i) => {
    const xa = x + w / 2 - (i + 1) * (w / 7);
    return `Q${xa + w / 14} ${y + 40 + 18 * Math.sin(t * 4 + i + seed)} ${xa} ${y}`;
  }).join(' ');
  const corpo = `M${pts.join(' L')} ${base} z`;
  // braços com garras
  const braco = (s: number) => {
    const ox = x + s * w * 0.44, oy = y - h * 0.62;
    const al = s === lado ? alcanca : 0;
    const balanco = 10 * Math.sin(t * 1.6 + seed + s);
    const hx = ox + s * (w * 0.18 + al * w * 0.9) + balanco, hy = y - h * 0.12 - al * h * 0.35;
    const garras = [-0.5, -0.15, 0.2, 0.55].map((g) => `M${hx} ${hy} q${s * 20 + g * 30} ${30} ${s * (8 + al * 30) + g * 60} ${70 - al * 20}`).join(' ');
    return (
      <g>
        <path d={`M${ox} ${oy} Q${ox + s * 40} ${(oy + hy) / 2} ${hx} ${hy}`} stroke="#06060d" strokeWidth={h * 0.045} strokeLinecap="round" fill="none" />
        <path d={garras} stroke="#06060d" strokeWidth={h * 0.014} strokeLinecap="round" fill="none" />
      </g>
    );
  };
  // fiapos de fumaça subindo
  const fiapos = Array.from({ length: 5 }, (_, i) => {
    const k = (t * 0.35 + i / 5 + seed * 0.13) % 1;
    return <circle key={i} cx={x + (rnd(i + seed) - 0.5) * w * 0.8 + Math.sin(k * 6 + i) * 18} cy={y - h - k * h * 0.35} r={h * (0.025 + k * 0.035)} fill="#0a0814" opacity={0.75 * (1 - k)} />;
  });
  const ey = y - h * 0.8, ex = w * 0.17, pisca = (t * 0.6 + seed) % 3.7 < 0.1 ? 0.12 : 1;
  const olho = (s: number) => {
    const cx = x + s * ex, rx = w * 0.12, ry = w * 0.07 * pisca;
    return `M${cx - rx} ${ey + s * ry * 0.6} Q${cx} ${ey - ry * 1.6} ${cx + rx} ${ey - s * ry * 0.6} Q${cx} ${ey + ry * 1.4} ${cx - rx} ${ey + s * ry * 0.6} z`;
  };
  const bw = w * (0.22 + 0.12 * sorriso), by = ey + w * 0.2, bh = w * (0.04 + 0.14 * sorriso);
  const dentes = Array.from({ length: 9 }, (_, i) => {
    const xa = x - bw + (i * 2 * bw) / 9, xb = xa + bw / 9, xc = xa + (2 * bw) / 9;
    return `M${xa} ${by} L${xb} ${by + bh * 0.75} L${xc} ${by}`;
  }).join(' ');
  return (
    <Svg>
      <defs>
        <filter id={`g${id}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={10} /></filter>
        <radialGradient id={`a${id}`}><stop offset="0" stopColor="#3a1d5c" stopOpacity="0.55" /><stop offset="1" stopColor="#3a1d5c" stopOpacity="0" /></radialGradient>
      </defs>
      {!olhos ? (
        <g opacity={op}>
          <ellipse cx={x} cy={cyB} rx={w * 1.1} ry={h * 0.7} fill={`url(#a${id})`} />
          {fiapos}
          {braco(-1)}
          {braco(1)}
          <path d={corpo} fill="#07060f" stroke="#2c1846" strokeWidth={5} strokeLinejoin="round" />
        </g>
      ) : (
        <g opacity={op}>
          <path d={corpo} fill="none" stroke="#7a5cc0" strokeWidth={5} opacity={0.4} strokeLinejoin="round" />
          <g filter={`url(#g${id})`}>{[-1, 1].map((s) => <path key={s} d={olho(s)} fill="#ffb21a" />)}</g>
          {[-1, 1].map((s) => <path key={s} d={olho(s)} fill="#ffe066" />)}
          {pisca > 0.5 && [-1, 1].map((s) => <ellipse key={s} cx={x + s * ex} cy={ey} rx={w * 0.018} ry={w * 0.06} fill="#1a0a00" />)}
          {[-1, 1].map((s) => <path key={s} d={`M${x + s * ex - w * 0.13} ${ey - w * 0.1 + (s > 0 ? -w * 0.04 : w * 0.04) * -1} L${x + s * ex + w * 0.13} ${ey - w * 0.1 + (s > 0 ? -w * 0.04 : w * 0.04)}`} stroke="#07060f" strokeWidth={w * 0.05} strokeLinecap="round" />)}
          {/* boca: fresta sempre; abre num sorriso de dentes afiados */}
          <path d={`M${x - bw} ${by} Q${x} ${by + bh * 2.2} ${x + bw} ${by} Q${x} ${by + bh * 0.4} ${x - bw} ${by} z`} fill="#3a0a10" opacity={0.6 + 0.4 * sorriso} />
          <path d={dentes} fill="#f4efd8" stroke="#07060f" strokeWidth={2} opacity={0.35 + 0.65 * sorriso} />
          {sorriso > 0 && <g filter={`url(#g${id})`} opacity={0.5 * sorriso}><path d={dentes} fill="#ffe066" /></g>}
        </g>
      )}
    </Svg>
  );
};
