// Cenários 2D chapados (SVG 1080×1920) e o componente <Boneco> que desenha os personagens mad.
import { CSSProperties, ReactNode, useMemo } from 'react';
// @ts-expect-error módulo JS puro, sem tipos
import { stick, LINHA } from '../../../mad/stick.mjs';

export const L = LINHA as string;
export const W = 1080;
export const H = 1920;

// ---------- Personagem ----------
const cache = new Map<string, string>();
const url = (k: object) => {
  const key = JSON.stringify(k);
  let u = cache.get(key);
  if (!u) {
    u = 'data:image/svg+xml;utf8,' + encodeURIComponent(stick(k) as string);
    cache.set(key, u);
  }
  return u;
};
// x = centro dos pés, y = chão, h = altura do quadro do personagem (520 unidades).
export const Boneco = ({ k, x, y, h = 620, flip = false, dy = 0, rot = 0, style }: { k: object; x: number; y: number; h?: number; flip?: boolean; dy?: number; rot?: number; style?: CSSProperties }) => {
  const w = (h * 360) / 520;
  const src = useMemo(() => url(k), [JSON.stringify(k)]);
  return (
    <img
      src={src}
      style={{ position: 'absolute', left: x - w / 2, top: y - (h * 490) / 520 + dy, width: w, height: h, transform: `${flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg)`, transformOrigin: '50% 94%', ...style }}
    />
  );
};

// ---------- Peças de cenário ----------
export const Svg = ({ children }: { children: ReactNode }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
    {children}
  </svg>
);

export const Ceu = ({ a = '#f7c59f', b = '#8ecae6', sol = true, t = 0 }: { a?: string; b?: string; sol?: boolean; t?: number }) => (
  <>
    <defs>
      <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={b} />
        <stop offset="1" stopColor={a} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#ceu)" />
    {sol && <circle cx={860} cy={360} r={80} fill="#ffd166" />}
    {[[120, 260, 1], [620, 180, 0.8], [900, 520, 0.9], [330, 520, 0.7]].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${((x + t * 12 * (i + 1)) % 1300) - 120} ${y}) scale(${s})`} fill="#ffffff" opacity={0.95}>
        <circle cx={0} cy={0} r={50} />
        <circle cx={55} cy={-20} r={62} />
        <circle cx={115} cy={0} r={48} />
        <rect x={0} y={0} width={115} height={48} />
      </g>
    ))}
  </>
);

export const Casa = ({ x, y, w = 260, h = 260, cor = '#f2c94c', telhado = '#d1495b', porta = '#6b4a2e' }: { x: number; y: number; w?: number; h?: number; cor?: string; telhado?: string; porta?: string }) => (
  <g>
    <rect x={x} y={y - h} width={w} height={h} fill={cor} stroke={L} strokeWidth={5} />
    <path d={`M${x - 20} ${y - h} L${x + w / 2} ${y - h - w * 0.45} L${x + w + 20} ${y - h} z`} fill={telhado} stroke={L} strokeWidth={5} strokeLinejoin="round" />
    <rect x={x + w / 2 - 32} y={y - 110} width={64} height={110} fill={porta} stroke={L} strokeWidth={4} />
    <circle cx={x + w / 2 + 20} cy={y - 55} r={5} fill="#f2c94c" />
    {[x + 30, x + w - 90].map((wx) => (
      <g key={wx}>
        <rect x={wx} y={y - h + 40} width={60} height={60} fill="#bfe6ff" stroke={L} strokeWidth={4} />
        <path d={`M${wx + 30} ${y - h + 40} v60 M${wx} ${y - h + 70} h60`} stroke={L} strokeWidth={3} />
      </g>
    ))}
  </g>
);

export const Arvore = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-10} y={-90} width={20} height={90} fill="#8a5a32" stroke={L} strokeWidth={4} />
    <circle cx={0} cy={-130} r={62} fill="#57a773" stroke={L} strokeWidth={5} />
    <circle cx={-40} cy={-100} r={40} fill="#57a773" stroke={L} strokeWidth={5} />
    <circle cx={40} cy={-100} r={40} fill="#57a773" stroke={L} strokeWidth={5} />
  </g>
);

const Poste = ({ x, y }: { x: number; y: number }) => (
  <g>
    <rect x={x - 6} y={y - 330} width={12} height={330} fill="#6c757d" stroke={L} strokeWidth={3} />
    <path d={`M${x} ${y - 330} q30 -20 60 0`} stroke="#6c757d" strokeWidth={10} fill="none" />
    <rect x={x + 48} y={y - 336} width={34} height={16} rx={4} fill="#ffe8a3" stroke={L} strokeWidth={3} />
  </g>
);

// Rua com casinhas: chão da calçada em y = 1330.
export const CHAO_RUA = 1330;
export const Rua = ({ t = 0, ceu = ['#f7c59f', '#8ecae6'] as [string, string], sol = true }: { t?: number; ceu?: [string, string]; sol?: boolean }) => (
  <>
    <Ceu a={ceu[0]} b={ceu[1]} sol={sol} t={t} />
    <Arvore x={60} y={1150} s={1.1} />
    <Casa x={110} y={1150} cor="#f2c94c" />
    <Casa x={430} y={1150} w={240} h={300} cor="#b9a3e3" telhado="#c0392b" />
    <Arvore x={720} y={1150} />
    <Casa x={790} y={1150} cor="#f4a3a8" telhado="#d1495b" />
    <Poste x={400} y={1170} />
    <rect x={0} y={1150} width={W} height={180} fill="#e9dcc3" stroke={L} strokeWidth={5} />
    <rect x={0} y={1330} width={W} height={590} fill="#5c6370" />
    {Array.from({ length: 7 }, (_, i) => (
      <rect key={i} x={i * 180 + 20} y={1600} width={110} height={18} rx={6} fill="#f1f1f1" />
    ))}
  </>
);

// Escola: prédio grande com relógio.
export const Escola = ({ t = 0 }: { t?: number }) => (
  <>
    <Ceu t={t} />
    <rect x={90} y={620} width={900} height={530} fill="#f2c94c" stroke={L} strokeWidth={6} />
    <path d={`M60 620 L540 400 L1020 620 z`} fill="#d1495b" stroke={L} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={540} cy={530} r={52} fill="#fff" stroke={L} strokeWidth={5} />
    <path d="M540 530 v-34 M540 530 h24" stroke={L} strokeWidth={5} strokeLinecap="round" />
    {[150, 330, 690, 870].map((x) => [700, 880].map((y) => <rect key={`${x}${y}`} x={x} y={y} width={90} height={110} fill="#bfe6ff" stroke={L} strokeWidth={4} />))}
    <rect x={470} y={950} width={140} height={200} fill="#6b4a2e" stroke={L} strokeWidth={5} />
    <rect x={380} y={640} width={320} height={60} rx={10} fill="#fff" stroke={L} strokeWidth={4} />
    <text x={540} y={684} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={40} fill={L}>
      ESCOLA
    </text>
    <rect x={0} y={1150} width={W} height={770} fill="#e9dcc3" stroke={L} strokeWidth={5} />
  </>
);

// Interior (sala): chão em y = 1400.
export const CHAO_SALA = 1400;
export const Sala = ({ parede = '#f6e7c8', noite = false, sofa = true, porta = false }: { parede?: string; noite?: boolean; sofa?: boolean; porta?: boolean }) => (
  <>
    <rect width={W} height={H} fill={noite ? '#2b3a67' : parede} />
    <rect x={0} y={1400} width={W} height={520} fill={noite ? '#4a3f5c' : '#c9a77c'} />
    <rect x={0} y={1380} width={W} height={24} fill={noite ? '#3a3050' : '#8a6a4a'} stroke={L} strokeWidth={4} />
    <g>
      <rect x={720} y={560} width={250} height={300} fill={noite ? '#1b2340' : '#bfe6ff'} stroke={L} strokeWidth={6} />
      <path d="M845 560 v300 M720 710 h250" stroke={L} strokeWidth={5} />
      {noite && <circle cx={900} cy={630} r={34} fill="#fff6c8" />}
      {noite && [[760, 610], [800, 680], [930, 760], [770, 800]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="#fff" />)}
    </g>
    <rect x={130} y={620} width={200} height={150} fill="#fff" stroke={L} strokeWidth={6} />
    <path d="M150 750 l50 -60 l40 40 l30 -30 l40 50 z" fill="#57a773" />
    <circle cx={290} cy={665} r={16} fill="#ffd166" />
    {porta && <rect x={80} y={900} width={230} height={500} fill="#8a5a32" stroke={L} strokeWidth={6} />}
    {sofa && (
      <g>
        <rect x={250} y={1130} width={580} height={150} rx={30} fill="#7fb3d5" stroke={L} strokeWidth={6} />
        <rect x={250} y={1240} width={580} height={110} rx={20} fill="#6a9fc2" stroke={L} strokeWidth={6} />
        <rect x={200} y={1170} width={90} height={190} rx={30} fill="#7fb3d5" stroke={L} strokeWidth={6} />
        <rect x={790} y={1170} width={90} height={190} rx={30} fill="#7fb3d5" stroke={L} strokeWidth={6} />
        <rect x={280} y={1350} width={18} height={40} fill={L} />
        <rect x={782} y={1350} width={18} height={40} fill={L} />
      </g>
    )}
    <g>
      <rect x={950} y={1050} width={12} height={340} fill={L} />
      <path d="M900 1050 h112 l-26 -90 h-60 z" fill={noite ? '#ffe8a3' : '#f2c94c'} stroke={L} strokeWidth={5} strokeLinejoin="round" />
    </g>
  </>
);

// Auditório com cortinas e plateia: palco em y = 1060, primeira fila em y ~ 1500.
export const Auditorio = ({ cabecas = true }: { cabecas?: boolean }) => (
  <>
    <rect width={W} height={H} fill="#3b1f2b" />
    <rect x={0} y={0} width={W} height={120} fill="#8e1b2e" stroke={L} strokeWidth={5} />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <path key={i} d={`M${i * 135} 120 q30 40 0 80 q-30 40 0 80`} stroke="#6e1424" strokeWidth={6} fill="none" opacity={0.4} />
    ))}
    <path d="M0 0 h170 q-40 500 30 1060 h-200 z" fill="#b0243a" stroke={L} strokeWidth={5} />
    <path d="M1080 0 h-170 q40 500 -30 1060 h200 z" fill="#b0243a" stroke={L} strokeWidth={5} />
    <rect x={0} y={1060} width={W} height={70} fill="#a0703c" stroke={L} strokeWidth={5} />
    <rect x={0} y={1130} width={W} height={790} fill="#2a1520" />
    {cabecas &&
      [1300, 1500, 1720].map((y, r) =>
        Array.from({ length: 7 }, (_, i) => {
          const x = 90 + i * 150 + (r % 2) * 70;
          const pele = ['#f6e3d3', '#e2b48c', '#b9805a', '#7a4b30'][(i + r) % 4];
          const cab = ['#2a1a12', '#c8572b', '#e8c240', '#120c08', '#d6d6d6'][(i * 2 + r) % 5];
          return (
            <g key={`${r}${i}`}>
              <rect x={x - 70} y={y + 40} width={140} height={120} rx={20} fill="#5b2236" stroke={L} strokeWidth={4} />
              <circle cx={x} cy={y} r={48} fill={pele} stroke={L} strokeWidth={4} />
              <path d={`M${x - 48} ${y - 4} a48 48 0 0 1 96 0 q-48 -26 -96 0 z`} fill={cab} stroke={L} strokeWidth={4} />
            </g>
          );
        }),
      )}
  </>
);

// Fundo liso com vinheta, para closes e fotos.
export const Liso = ({ a = '#f6e7c8', b = '#e8cfa0' }: { a?: string; b?: string }) => (
  <>
    <defs>
      <radialGradient id="liso" cx="50%" cy="45%" r="70%">
        <stop offset="0" stopColor={a} />
        <stop offset="1" stopColor={b} />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#liso)" />
  </>
);

// Foto de álbum (polaroid) com conteúdo dentro.
export const Foto = ({ x, y, w = 760, h = 820, rot = -3, children, legenda }: { x: number; y: number; w?: number; h?: number; rot?: number; children: ReactNode; legenda?: string }) => (
  <div style={{ position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`, background: '#fffdf6', border: `6px solid ${L}`, borderRadius: 10, boxShadow: '0 18px 0 rgba(0,0,0,0.18)' }}>
    <div style={{ position: 'absolute', left: 34, top: 34, width: w - 80, height: h - 200, overflow: 'hidden', border: `5px solid ${L}`, background: '#bfe6ff' }}>{children}</div>
    {legenda && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 44, textAlign: 'center', fontFamily: '"Comic Sans MS", "Arial", sans-serif', fontSize: 50, color: '#5a4a3a' }}>{legenda}</div>}
  </div>
);
