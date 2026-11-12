// Cenários de "Os Espelhos do Casarão": fachada colonial em Ouro Preto, sala com o espelho grande, corredor, quartos,
// escada, igreja (flashback) e o apartamento de hoje. O Espelho tem reflexo, lençol, embaçado com escrita e rachadura.
import { ReactNode, useId } from 'react';
import { L, Svg } from './cenarios';
import { Poeira } from './cenarios-ilha';

const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const uid = () => useId().replace(/:/g, '');
export const clamp = (x: number) => Math.min(1, Math.max(0, x));
export const CHAO_C = 1480;

// ---------- Espelho ----------
// coberto 0..1 (lençol desce), embacado 0..1, texto escrito no vidro (letras aparecem com `escrita` 0..1),
// rachado 0..1 (rachadura cresce de cima a baixo), reflexo = conteúdo dentro do vidro (coordenadas locais do vidro).
export const Espelho = ({ x, y, w, h, t, coberto = 0, embacado = 0, texto = '', escrita = 1, rachado = 0, reflexo, moldura = '#c9a14a', fundo = '#3a3048' }: {
  x: number; y: number; w: number; h: number; t: number; coberto?: number; embacado?: number; texto?: string; escrita?: number; rachado?: number; reflexo?: ReactNode; moldura?: string; fundo?: string;
}) => {
  const n = Math.floor(texto.length * escrita);
  const lencolH = h * clamp(coberto) + 30;
  const crackPts = Array.from({ length: 9 }, (_, i) => [w * (0.5 + (rnd(i) - 0.5) * 0.25), (h * i) / 8]);
  const vis = Math.max(1, Math.ceil(rachado * 8));
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y, width: w, height: h }}>
      <div style={{ position: 'absolute', left: -28, top: -28, right: -28, bottom: -28, border: `22px solid ${moldura}`, borderRadius: 26, boxShadow: `0 0 0 6px ${L}, inset 0 0 0 6px ${L}` }} />
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: `linear-gradient(160deg, ${fundo}, #1a1622)` }}>
        {reflexo}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 10%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0) 75%)' }} />
        {embacado > 0 && <div style={{ position: 'absolute', inset: 0, background: 'rgba(225,232,240,0.78)', opacity: embacado, filter: 'blur(2px)' }} />}
        {n > 0 && <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.36, textAlign: 'center', fontFamily: '"Comic Sans MS", cursive', fontWeight: 900, fontSize: w * 0.22, color: 'rgba(120,130,150,0.85)', letterSpacing: 8, transform: 'rotate(-6deg)' }}>{texto.slice(0, n)}</div>}
        {rachado > 0 && (
          <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
            <path d={`M${crackPts.slice(0, vis + 1).map((p) => p.join(' ')).join(' L')}`} stroke="#fff" strokeWidth={6} fill="none" />
            <path d={`M${crackPts.slice(0, vis + 1).map((p) => p.join(' ')).join(' L')}`} stroke={L} strokeWidth={2} fill="none" />
            {crackPts.slice(1, vis).map(([cx, cy], i) => <path key={i} d={`M${cx} ${cy} l${(i % 2 ? 1 : -1) * (40 + rnd(i) * 60)} ${30 + rnd(i + 3) * 40}`} stroke="#fff" strokeWidth={3} />)}
          </svg>
        )}
      </div>
      {coberto > 0 && (
        <svg width={w + 80} height={lencolH + 40} style={{ position: 'absolute', left: -40, top: -50, overflow: 'visible' }}>
          <path d={`M10 10 Q${(w + 80) / 2} -10 ${w + 70} 10 L${w + 60 + 6 * Math.sin(t * 2)} ${lencolH} Q${(w + 80) * 0.75} ${lencolH + 24} ${(w + 80) / 2} ${lencolH + 6} Q${(w + 80) * 0.25} ${lencolH + 26} ${20 + 6 * Math.sin(t * 2 + 1)} ${lencolH} z`} fill="#eeeae0" stroke={L} strokeWidth={5} strokeLinejoin="round" />
          {[0.25, 0.5, 0.75].map((k, i) => <path key={i} d={`M${(w + 80) * k} 20 q${10 * Math.sin(t + i)} ${lencolH * 0.5} 0 ${lencolH - 10}`} stroke="#c9c2b0" strokeWidth={4} fill="none" />)}
        </svg>
      )}
    </div>
  );
};

// ---------- Exterior: casarão colonial ----------
export const CasaraoFora = ({ t, noite = 0, sepia = false }: { t: number; noite?: number; sepia?: boolean }) => {
  const id = uid();
  const ceuA = noite > 0.5 ? '#141a33' : '#f2a35e', ceuB = noite > 0.5 ? '#3a3a5a' : '#ffd9a0';
  return (
    <Svg>
      <defs><linearGradient id={`c${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={ceuA} /><stop offset="1" stopColor={ceuB} /></linearGradient></defs>
      <rect width={1080} height={1920} fill={`url(#c${id})`} />
      {noite > 0.5 && <circle cx={840} cy={240} r={70} fill="#f4efd8" opacity={0.9} />}
      {noite > 0.5 && Array.from({ length: 30 }, (_, i) => <circle key={i} cx={rnd(i) * 1080} cy={rnd(i + 3) * 600} r={2} fill="#fff" opacity={0.3 + 0.4 * Math.sin(t * 2 + i)} />)}
      {/* morros e igreja ao longe */}
      <path d="M0 760 Q200 620 420 700 T860 650 T1080 700 V1000 H0 z" fill={noite > 0.5 ? '#1e2440' : '#9a7a6a'} />
      <g fill={noite > 0.5 ? '#2a3050' : '#c9b8a0'}><rect x={160} y={560} width={120} height={180} /><rect x={180} y={480} width={34} height={90} /><rect x={226} y={480} width={34} height={90} /><path d="M176 480 l21 -30 l21 30 M222 480 l21 -30 l21 30" /></g>
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={360 + i * 120} y={700 - (i % 3) * 30} width={100} height={120} fill={noite > 0.5 ? '#2a3050' : '#e8d8c0'} />)}
      {/* casarão */}
      <rect x={80} y={760} width={920} height={720} fill={noite > 0.5 ? '#c8c4b8' : '#f4efe2'} stroke={L} strokeWidth={6} />
      <path d="M40 770 L540 600 L1040 770 z" fill="#a0442a" stroke={L} strokeWidth={6} strokeLinejoin="round" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${80 + i * 80} 760 l40 -14`} stroke="#7a3020" strokeWidth={4} />)}
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => {
        if (r === 2 && (c === 1 || c === 2)) return null;
        const x = 150 + c * 220, y = 820 + r * 220;
        const acesa = noite > 0.5 && (r + c) % 3 === 0;
        return (
          <g key={`${r}${c}`}>
            <rect x={x} y={y} width={120} height={160} fill={acesa ? '#ffcf6a' : '#2a3a5a'} stroke="#2f5fa8" strokeWidth={14} opacity={acesa ? 0.6 + 0.4 * Math.abs(Math.sin(t * 2 + c)) : 1} />
            <path d={`M${x + 60} ${y} v160 M${x} ${y + 80} h120`} stroke="#2f5fa8" strokeWidth={6} />
            <rect x={x - 14} y={y + 160} width={148} height={14} fill="#e8e2d0" stroke={L} strokeWidth={3} />
          </g>
        );
      }))}
      <rect x={440} y={1260} width={200} height={220} rx={10} fill="#5a3a22" stroke={L} strokeWidth={6} />
      <path d="M440 1260 Q540 1200 640 1260" fill="#2f5fa8" stroke={L} strokeWidth={5} />
      <circle cx={615} cy={1380} r={9} fill="#c9a14a" />
      {/* rua de pedra */}
      <rect x={0} y={1480} width={1080} height={440} fill={noite > 0.5 ? '#3a3a42' : '#9a8a7a'} />
      {Array.from({ length: 60 }, (_, i) => <ellipse key={i} cx={(i % 10) * 112 + (Math.floor(i / 10) % 2) * 56} cy={1510 + Math.floor(i / 10) * 70} rx={48} ry={26} fill={noite > 0.5 ? '#4a4a52' : '#b0a090'} stroke={L} strokeWidth={2} opacity={0.8} />)}
      <g><rect x={980} y={1060} width={14} height={420} fill="#1a1a1e" /><path d="M960 1060 h54 l-10 -50 h-34 z" fill="#1a1a1e" /><circle cx={987} cy={1040} r={14} fill="#ffcf6a" opacity={noite > 0.5 ? 1 : 0.4} />{noite > 0.5 && <circle cx={987} cy={1040} r={90} fill="#ffcf6a" opacity={0.15} />}</g>
      {noite > 0.5 && <><ArvoreSeca x={30} y={1490} s={1.1} t={t} /><ArvoreSeca x={1060} y={1500} s={0.9} t={t + 2} /><Morcegos t={t} /><NevoaChao t={t} y={1560} op={0.3} /></>}
      {sepia && <rect width={1080} height={1920} fill="#7a5a3a" opacity={0.2} />}
    </Svg>
  );
};

// ---------- Interior: paredes, assoalho, janela com lua ----------
const Interior = ({ t, parede = '#5a4a5a', manha = false, children }: { t: number; parede?: string; manha?: boolean; children?: ReactNode }) => (
  <>
    <rect width={1080} height={1920} fill={parede} />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 130 + 60} 0 V${CHAO_C}`} stroke="#000" strokeWidth={34} opacity={0.06} />)}
    {Array.from({ length: 40 }, (_, i) => <path key={i} d={`M${(i % 8) * 140 + 70} ${Math.floor(i / 8) * 280 + 120} q12 -18 24 0 q-12 18 -24 0`} fill="#000" opacity={0.08} />)}
    <rect x={0} y={CHAO_C - 70} width={1080} height={70} fill="#3a2a20" opacity={0.5} />
    <rect x={0} y={CHAO_C} width={1080} height={440} fill="#4a3424" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M0 ${CHAO_C + 20 + i * 58} H1080`} stroke="#3a2618" strokeWidth={3} />)}
    {children}
    <Poeira t={t} n={24} op={manha ? 0.6 : 0.3} cor={manha ? '#fff3c8' : '#cfd8f0'} />
  </>
);
const Candelabro = ({ x, y, t }: { x: number; y: number; t: number }) => (
  <g>
    <rect x={x - 6} y={y} width={12} height={80} fill="#c9a14a" stroke={L} strokeWidth={3} />
    <path d={`M${x - 40} ${y} h80`} stroke="#c9a14a" strokeWidth={8} />
    {[-40, 0, 40].map((d, i) => <g key={d}><rect x={x + d - 7} y={y - 46} width={14} height={46} fill="#f4efe2" stroke={L} strokeWidth={2} /><path d={`M${x + d} ${y - 48} q${-6 + 3 * Math.sin(t * 9 + i)} -14 0 -24 q${6 + 2 * Math.sin(t * 7 + i)} 10 0 24`} fill="#ffcf6a" /><circle cx={x + d} cy={y - 58} r={38} fill="#ffcf6a" opacity={0.12} /></g>)}
  </g>
);
export const Rosas = ({ x, y, t, murcha = 1, petalas = true }: { x: number; y: number; t: number; murcha?: number; petalas?: boolean }) => (
  <g>
    <path d={`M${x - 40} ${y} L${x - 30} ${y - 120} H${x + 30} L${x + 40} ${y} z`} fill="#3a5a7a" stroke={L} strokeWidth={5} />
    {[-30, 0, 30].map((d, i) => {
      const ang = d * 0.6 + murcha * (i - 1) * 25 + murcha * 15;
      return (
        <g key={d} transform={`rotate(${ang} ${x + d * 0.4} ${y - 120})`}>
          <path d={`M${x + d * 0.4} ${y - 120} v-110`} stroke="#4a6a3a" strokeWidth={6} />
          <circle cx={x + d * 0.4} cy={y - 240} r={22 - murcha * 6} fill={murcha > 0.5 ? '#7a2a3a' : '#d1283b'} stroke={L} strokeWidth={3} />
        </g>
      );
    })}
    {petalas && murcha > 0.5 && Array.from({ length: 4 }, (_, i) => { const k = (t * 0.35 + i / 4) % 1; return <ellipse key={i} cx={x - 20 + i * 14 + Math.sin(k * 8 + i) * 30} cy={y - 230 + k * 240} rx={8} ry={5} fill="#7a2a3a" opacity={1 - k} transform={`rotate(${k * 300} ${x} ${y - 230 + k * 240})`} />; })}
  </g>
);

// Sala: escada à esquerda, sofá, candelabro, rosas, quadro e o ESPELHO GRANDE (renderizado à parte, por cima).
export const Sala = ({ t, manha = false }: { t: number; manha?: boolean }) => (
  <Svg>
    <Interior t={t} parede="#5a3a4a" manha={manha}>
      {/* lustre */}
      <g transform={`rotate(${2 * Math.sin(t * 0.7)} 540 0)`}><path d="M540 0 v90" stroke="#c9a14a" strokeWidth={5} /><path d="M440 110 Q540 170 640 110" stroke="#c9a14a" strokeWidth={8} fill="none" />{[440, 490, 540, 590, 640].map((x, i) => <g key={x}><path d={`M${x} ${110 + (i === 2 ? 30 : i % 2 ? 18 : 0)} v-20`} stroke="#c9a14a" strokeWidth={4} /><circle cx={x} cy={84 + (i === 2 ? 30 : i % 2 ? 18 : 0)} r={9} fill="#ffcf6a" /></g>)}</g>
      {/* escada */}
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={0} y={1000 + i * 54} width={200 - i * 8 + 60} height={54} fill="#6b4224" stroke={L} strokeWidth={3} />)}
      <path d="M260 1000 L20 1480" stroke="#3a2418" strokeWidth={14} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${240 - i * 40} ${1040 + i * 80} v-70`} stroke="#3a2418" strokeWidth={6} />)}
      {/* sofá */}
      <rect x={720} y={1300} width={320} height={120} rx={30} fill="#7a2a3a" stroke={L} strokeWidth={5} />
      <rect x={740} y={1250} width={280} height={80} rx={26} fill="#8a3a4a" stroke={L} strokeWidth={5} />
      <Candelabro x={900} y={1180} t={t} />
      <rect x={860} y={1180} width={80} height={10} fill="none" />
      <Rosas x={170} y={980} t={t} />
      <RetratoNoiva x={190} y={330} w={170} t={t} alvoX={Math.sin(t * 0.4)} />
      <Teia x={0} y={0} s={1.2} /><Teia x={1080} y={0} s={1} canto="d" />
      <path d="M700 1180 l20 40 l-14 30 l24 50 M1000 260 l-30 50 l10 40" stroke="#2a1a24" strokeWidth={4} fill="none" opacity={0.6} />
      <ellipse cx={560} cy={1660} rx={430} ry={110} fill="#5a1a2a" stroke={L} strokeWidth={4} opacity={0.9} />
      <ellipse cx={560} cy={1660} rx={370} ry={84} fill="none" stroke="#c9a14a" strokeWidth={6} strokeDasharray="22 12" opacity={0.7} />
      {/* janela com lua */}
      <rect x={830} y={430} width={200} height={300} fill={manha ? '#cfe8ff' : '#1a2040'} stroke="#3a2418" strokeWidth={12} />
      {!manha && <circle cx={930} cy={520} r={34} fill="#f4efd8" />}
      <path d="M930 430 v300 M830 580 h200" stroke="#3a2418" strokeWidth={6} />
      <path d={`M830 430 q${30 + 10 * Math.sin(t)} 150 0 300`} fill="#7a2a3a" opacity={0.85} />
    </Interior>
  </Svg>
);
// Corredor: portas (abertas 0..1, uma de cada vez), quadros, arandelas e o espelho do corredor (à parte).
export const CorredorC = ({ t, abertas = 0, manha = false }: { t: number; abertas?: number; manha?: boolean }) => (
  <Svg>
    <Interior t={t} parede={manha ? '#8a7a8a' : '#4a3a4a'} manha={manha}>
      {[110, 870].map((x, i) => {
        const a = clamp(abertas * 2 - i);
        return (
          <g key={x}>
            <rect x={x - 100} y={880} width={200} height={600} fill="#120c10" stroke={L} strokeWidth={5} />
            <g transform={`translate(${x - 100} 880) scale(${1 - 0.8 * a} 1)`}><rect width={200} height={600} fill="#6b4224" stroke={L} strokeWidth={5} /><rect x={24} y={40} width={152} height={220} fill="none" stroke={L} strokeWidth={4} opacity={0.5} /><rect x={24} y={300} width={152} height={240} fill="none" stroke={L} strokeWidth={4} opacity={0.5} /><circle cx={170} cy={300} r={10} fill="#c9a14a" /></g>
          </g>
        );
      })}
      {[300, 780].map((x) => <g key={x}><rect x={x - 10} y={640} width={20} height={44} fill="#c9a14a" /><circle cx={x} cy={622} r={14} fill="#ffcf6a" opacity={0.6 + 0.3 * Math.sin(t * 9 + x)} /><circle cx={x} cy={622} r={100} fill="#ffcf6a" opacity={0.07} /></g>)}
      <rect x={60} y={420} width={130} height={170} fill="#3a4a3a" stroke="#c9a14a" strokeWidth={8} /><circle cx={125} cy={490} r={30} fill="#d8c0a0" /><path d="M85 590 q40 -60 80 0" fill="#2a2a30" />
      <path d="M0 1700 L360 1480 H720 L1080 1700 V1920 H0 z" fill="#5a1a2a" opacity={0.8} />
      <RetratoNoiva x={920} y={380} w={130} t={t + 1} alvoX={Math.sin(t * 0.5 + 1)} />
      <Teia x={0} y={0} s={1.1} /><Teia x={1080} y={0} s={0.9} canto="d" />
      <path d="M250 300 l14 40 l-10 30 l20 46 M820 1000 l-16 44 l12 30" stroke="#1a1018" strokeWidth={4} fill="none" opacity={0.55} />
    </Interior>
  </Svg>
);
// Quartos: o da mãe (penteadeira) e o da Clarinha (cama pequena, bonecas). O espelho vem à parte.
export const Quarto = ({ t, tipo = 'mae', hoje = false, noite = true }: { t: number; tipo?: 'mae' | 'clara'; hoje?: boolean; noite?: boolean }) => (
  <Svg>
    <Interior t={t} parede={hoje ? (noite ? '#3a4a5a' : '#cfe0e8') : tipo === 'mae' ? '#4a3a5a' : '#5a4a6a'} manha={!noite}>
      {tipo === 'mae' && !hoje && <g><rect x={40} y={520} width={210} height={330} fill="#141a33" stroke="#3a2418" strokeWidth={12} /><circle cx={170} cy={610} r={32} fill="#f4efd8" /><path d="M145 520 v330 M40 690 h210" stroke="#3a2418" strokeWidth={6} /><path d={`M40 520 q${40 + 12 * Math.sin(t)} 160 0 330`} fill="#5a2a4a" /><Teia x={1080} y={0} s={1} canto="d" /><g transform="translate(610 1150)"><rect x={-40} y={-30} width={80} height={34} rx={6} fill="#8a3a5a" stroke={L} strokeWidth={3} /><path d="M-40 -30 l10 -24 h60 l10 24" fill="#a04a6a" stroke={L} strokeWidth={3} /><circle cx={0} cy={-14} r={5} fill="#f2c94c" /></g></g>}
      {tipo === 'mae' && !hoje && <g><rect x={330} y={1180} width={420} height={60} fill="#6b4224" stroke={L} strokeWidth={5} /><rect x={350} y={1240} width={40} height={240} fill="#5a3a22" stroke={L} strokeWidth={4} /><rect x={690} y={1240} width={40} height={240} fill="#5a3a22" stroke={L} strokeWidth={4} /><Rosas x={680} y={1180} t={t} petalas={false} />{[400, 450].map((x) => <rect key={x} x={x} y={1150} width={26} height={30} rx={6} fill="#d8a0d0" stroke={L} strokeWidth={3} />)}</g>}
      {tipo === 'clara' && <g><DesenhosParede x={700} y={520} /><g transform="translate(900 1220)"><circle cx={-24} cy={-60} r={14} fill="#a06a3a" stroke={L} strokeWidth={3} /><circle cx={24} cy={-60} r={14} fill="#a06a3a" stroke={L} strokeWidth={3} /><circle cy={-40} r={34} fill="#a06a3a" stroke={L} strokeWidth={4} /><ellipse cy={10} rx={36} ry={30} fill="#a06a3a" stroke={L} strokeWidth={4} /><circle cx={-12} cy={-44} r={4} fill={L} /><circle cx={12} cy={-44} r={4} fill={L} /></g><g transform="translate(960 1640)"><circle r={44} fill="#e5484d" stroke={L} strokeWidth={5} /><path d="M-44 0 h88" stroke="#fff" strokeWidth={8} /></g><path d={`M1010 640 l12 26 l28 2 l-22 18 l8 28 l-26 -16 l-26 16 l8 -28 l-22 -18 l28 -2 z`} fill="#ffe08a" stroke={L} strokeWidth={3} opacity={0.6 + 0.4 * Math.sin(t * 2)} /><Teia x={0} y={0} s={0.9} /></g>}
      {tipo === 'clara' && <g><rect x={700} y={1260} width={340} height={160} rx={20} fill="#f2a0c0" stroke={L} strokeWidth={5} /><rect x={1000} y={1180} width={30} height={300} fill="#8a5a32" stroke={L} strokeWidth={4} /><rect x={720} y={1230} width={110} height={50} rx={20} fill="#fffaf0" stroke={L} strokeWidth={4} /><g transform="translate(120 1430)"><circle r={30} fill="#f6e3d3" stroke={L} strokeWidth={4} /><rect x={-26} y={26} width={52} height={60} rx={10} fill="#7ad0c0" stroke={L} strokeWidth={4} /><circle cx={-10} cy={-4} r={4} fill={L} /><circle cx={10} cy={-4} r={4} fill={L} /></g></g>}
      {hoje && <g><rect x={560} y={440} width={220} height={300} fill={noite ? '#1a2a4a' : '#bfe6ff'} stroke="#e8e2d0" strokeWidth={12} />{Array.from({ length: 8 }, (_, i) => <rect key={i} x={580 + (i % 4) * 48} y={600 - (i % 3) * 40} width={36} height={160} fill={noite ? '#2a3a5a' : '#9ab8d8'} />)}{noite && Array.from({ length: 10 }, (_, i) => <rect key={i} x={588 + (i % 5) * 38} y={620 + Math.floor(i / 5) * 40} width={8} height={10} fill="#ffd166" opacity={0.7} />)}<g transform="translate(250 1180)"><path d="M-30 0 L-24 -60 H24 L30 0 z" fill="#c86a4a" stroke={L} strokeWidth={4} />{[-30, 0, 30].map((d, i) => <path key={i} d={`M0 -60 q${d} -60 ${d * 1.5} -110`} stroke="#3a8a3a" strokeWidth={14} fill="none" strokeLinecap="round" />)}</g><g transform="translate(940 1280)"><rect x={-44} y={-26} width={88} height={40} rx={8} fill="#1a1a1e" stroke={L} strokeWidth={3} /><text x={0} y={4} textAnchor="middle" fontFamily="'Courier New'" fontWeight={900} fontSize={24} fill="#ff4d4d">03:33</text></g></g>}
      {hoje && <g><rect x={60} y={1260} width={420} height={170} rx={20} fill="#5a8ac0" stroke={L} strokeWidth={5} /><rect x={80} y={1220} width={130} height={60} rx={20} fill="#fffaf0" stroke={L} strokeWidth={4} /><rect x={820} y={1300} width={160} height={180} fill="#e8e2d0" stroke={L} strokeWidth={5} /><rect x={860} y={1230} width={20} height={70} fill="#3a3a3a" /><path d="M830 1230 h80 l-20 -50 h-40 z" fill="#f2c94c" stroke={L} strokeWidth={4} />{noite && <circle cx={870} cy={1210} r={90} fill="#ffe08a" opacity={0.2} />}</g>}
    </Interior>
  </Svg>
);
// Escada vista de frente (a mãe desce pelo meio).
export const Escada = ({ t }: { t: number }) => (
  <Svg>
    <Interior t={t} parede="#3a2a3a">
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={260 - i * 14} y={600 + i * 74} width={560 + i * 28} height={74} fill={i % 2 ? '#6b4224' : '#7a4f2c'} stroke={L} strokeWidth={3} />)}
      <path d="M560 600 L60 1490 M520 600 L1020 1490" stroke="#3a2418" strokeWidth={18} />
      {Array.from({ length: 8 }, (_, i) => <g key={i}><path d={`M${520 - i * 60} ${700 + i * 100} v-80`} stroke="#3a2418" strokeWidth={8} /><path d={`M${560 + i * 60} ${700 + i * 100} v-80`} stroke="#3a2418" strokeWidth={8} /></g>)}
      <rect x={300} y={280} width={480} height={300} fill="#1a1622" stroke="#3a2418" strokeWidth={14} />
      <circle cx={660} cy={380} r={40} fill="#f4efd8" opacity={0.8} />
      <path d={`M540 0 v220`} stroke="#c9a14a" strokeWidth={4} /><circle cx={540} cy={236} r={18} fill="#ffcf6a" opacity={0.5 + 0.3 * Math.sin(t * 11)} />
      <RetratoNoiva x={150} y={360} w={150} t={t} alvoX={Math.sin(t * 0.4)} /><Teia x={1080} y={0} s={1.1} canto="d" />
      {[[330, 820], [740, 820], [250, 1120], [820, 1120]].map(([x, y], i) => <g key={i}><rect x={x - 8} y={y - 40} width={16} height={40} fill="#f4efe2" stroke={L} strokeWidth={2} /><path d={`M${x} ${y - 42} q${-5 + 3 * Math.sin(t * 9 + i)} -12 0 -22 q5 10 0 22`} fill="#ffcf6a" /><circle cx={x} cy={y - 52} r={40} fill="#ffcf6a" opacity={0.14} /></g>)}
      <NevoaChao t={t} y={1420} op={0.25} />
    </Interior>
  </Svg>
);
// Igreja (flashback de 1890): altar, velas, bancos vazios, vitral.
export const Igreja = ({ t }: { t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#5a4a3a" />
    <path d="M340 160 Q540 20 740 160 V700 H340 z" fill="#3a6a9a" stroke="#c9a14a" strokeWidth={14} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${340 + i * 80} 160 V700`} stroke="#c9a14a" strokeWidth={4} opacity={0.6} />)}
    <circle cx={540} cy={330} r={80} fill="#d1495b" opacity={0.7} /><path d="M540 250 v160 M460 330 h160" stroke="#f2c94c" strokeWidth={10} />
    <path d="M540 700 L200 1480 H880 z" fill="#fff3c8" opacity={0.08} />
    <rect x={240} y={1000} width={600} height={120} fill="#e8e2d0" stroke={L} strokeWidth={6} />
    <rect x={220} y={980} width={640} height={30} fill="#c9a14a" stroke={L} strokeWidth={5} />
    {[300, 780].map((x, i) => <g key={x}><rect x={x - 14} y={880} width={28} height={100} fill="#f4efe2" stroke={L} strokeWidth={3} /><path d={`M${x} 878 q${-8 + 4 * Math.sin(t * 8 + i)} -20 0 -34 q${8} 14 0 34`} fill="#ffcf6a" /><circle cx={x} cy={860} r={60} fill="#ffcf6a" opacity={0.15} /></g>)}
    <rect x={0} y={1480} width={1080} height={440} fill="#6a4a32" />
    {[0, 1].map((r) => [0, 1].map((c) => <g key={`${r}${c}`}><rect x={c ? 640 : 40} y={1560 + r * 160} width={400} height={30} fill="#6b4224" stroke={L} strokeWidth={4} /><rect x={c ? 640 : 40} y={1500 + r * 160} width={400} height={20} fill="#7a4f2c" stroke={L} strokeWidth={3} /></g>))}
    <rect x={0} y={1120} width={1080} height={360} fill="#5a4a3a" />
    <path d="M440 1480 h200 l40 440 h-280 z" fill="#8a1a2a" opacity={0.85} />
    {[400, 680].map((x, i) => <g key={x}><path d={`M${x - 30} 980 L${x - 22} 920 H${x + 22} L${x + 30} 980 z`} fill="#c9a14a" stroke={L} strokeWidth={3} />{[-20, 0, 20].map((d, j) => <g key={j} transform={`rotate(${d + 20 * (i ? 1 : -1)} ${x} 920)`}><path d={`M${x} 920 v-60`} stroke="#5a6a3a" strokeWidth={5} /><circle cx={x} cy={856} r={12} fill="#e8e2d8" stroke={L} strokeWidth={2} /></g>)}</g>)}
    {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={470 + rnd(i) * 140 + i * 2} cy={1500 + i * 34} rx={10} ry={6} fill="#f4efe2" opacity={0.8} transform={`rotate(${rnd(i + 3) * 180} ${470 + rnd(i) * 140} ${1500 + i * 34})`} />)}
    <Poeira t={t} n={30} op={0.5} />
  </Svg>
);
// Foto de família num porta-retrato (os 4 da família desenhados simples).
export const FotoFamilia = ({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-130} y={-100} width={260} height={200} rx={10} fill="#c9a14a" stroke={L} strokeWidth={6} />
      <rect x={-110} y={-80} width={220} height={160} fill="#f2e6d0" />
      {[[-70, 10, 26, '#3a2416', '#d1495b'], [-24, 6, 28, '#6b3e1f', '#2f5fa8'], [26, 30, 18, '#3a2416', '#3a8a3a'], [66, 34, 16, '#3a2416', '#f28fb0']].map(([cx, cy, r, cab, rp], i) => (
        <g key={i}><rect x={(cx as number) - (r as number) * 0.8} y={(cy as number) + (r as number) * 0.8} width={(r as number) * 1.6} height={70} rx={10} fill={rp as string} stroke={L} strokeWidth={3} /><circle cx={cx as number} cy={cy as number} r={r as number} fill="#f6e3d3" stroke={L} strokeWidth={3} /><path d={`M${(cx as number) - (r as number)} ${cy} a${r} ${r} 0 0 1 ${(r as number) * 2} 0`} fill={cab as string} /><path d={`M${(cx as number) - 6} ${(cy as number) + 6} q6 6 12 0`} stroke={L} strokeWidth={2} fill="none" /></g>
      ))}
      <rect x={-110} y={-80} width={220} height={160} fill="none" stroke={L} strokeWidth={4} />
    </g>
  </svg>
);
// Relógio de parede antigo marcando 3:33 (close).
export const Relogio333 = ({ t, at }: { t: number; at: number }) => {
  const k = clamp((t - at + 0.6) / 0.6);
  const mM = 30 + 3 * k, mH = 3 + mM / 60;
  return (
    <Svg>
      <circle cx={540} cy={820} r={260} fill="#fffaf0" stroke="#6b4224" strokeWidth={30} />
      {Array.from({ length: 12 }, (_, i) => { const a = (i * 30 * Math.PI) / 180; return <text key={i} x={540 + Math.sin(a) * 200} y={820 - Math.cos(a) * 200 + 18} textAnchor="middle" fontFamily="Georgia" fontSize={50} fill={L}>{['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'][i]}</text>; })}
      <path d={`M540 820 L${540 + Math.sin((mH * 30 * Math.PI) / 180) * 120} ${820 - Math.cos((mH * 30 * Math.PI) / 180) * 120}`} stroke={L} strokeWidth={18} strokeLinecap="round" />
      <path d={`M540 820 L${540 + Math.sin((mM * 6 * Math.PI) / 180) * 190} ${820 - Math.cos((mM * 6 * Math.PI) / 180) * 190}`} stroke={L} strokeWidth={10} strokeLinecap="round" />
      <circle cx={540} cy={820} r={18} fill="#c9a14a" stroke={L} strokeWidth={4} />
    </Svg>
  );
};

// ---------- Detalhes extras (vídeo mais detalhado) ----------
// Teia de aranha num canto (canto: 'e' esquerdo ou 'd' direito, no topo).
export const Teia = ({ x, y, s = 1, canto = 'e' }: { x: number; y: number; s?: number; canto?: 'e' | 'd' }) => (
  <g transform={`translate(${x} ${y}) scale(${canto === 'd' ? -s : s} ${s})`} stroke="#d8d8e0" strokeWidth={2} fill="none" opacity={0.55}>
    {[0, 22, 45, 68, 90].map((a) => <path key={a} d={`M0 0 L${Math.cos((a * Math.PI) / 180) * 160} ${Math.sin((a * Math.PI) / 180) * 160}`} />)}
    {[40, 75, 110, 145].map((r) => <path key={r} d={`M${r} 0 Q${r * 0.8} ${r * 0.3} ${r * 0.92} ${r * 0.38} Q${r * 0.6} ${r * 0.6} ${r * 0.7} ${r * 0.7} Q${r * 0.32} ${r * 0.82} ${r * 0.38} ${r * 0.92} Q${r * 0.2} ${r * 0.9} 0 ${r}`} />)}
  </g>
);
// Retrato antigo da noiva: os olhos seguem `alvoX` (-1..1) e piscam de vez em quando.
export const RetratoNoiva = ({ x, y, w = 200, t, alvoX = 0 }: { x: number; y: number; w?: number; t: number; alvoX?: number }) => {
  const h = w * 1.3, cx = x, cy = y + h * 0.42, r = w * 0.2;
  const pis = (t % 4.3) < 0.12;
  return (
    <g>
      <rect x={x - w / 2 - 16} y={y - 16} width={w + 32} height={h + 32} rx={8} fill="#8a6a2a" stroke={L} strokeWidth={5} />
      <rect x={x - w / 2} y={y} width={w} height={h} fill="#3a3a4a" />
      <path d={`M${x - w / 2} ${y + h} Q${cx} ${cy + r * 1.2} ${x + w / 2} ${y + h} z`} fill="#e8e2d8" />
      <path d={`M${cx - r * 1.5} ${cy + r * 2.2} Q${cx - r * 1.3} ${cy - r * 1.6} ${cx} ${cy - r * 1.4} Q${cx + r * 1.3} ${cy - r * 1.6} ${cx + r * 1.5} ${cy + r * 2.2}`} fill="#f4f4f4" opacity={0.5} />
      <circle cx={cx} cy={cy} r={r} fill="#e8d8c8" stroke={L} strokeWidth={3} />
      <path d={`M${cx - r} ${cy - r * 0.2} Q${cx} ${cy - r * 1.4} ${cx + r} ${cy - r * 0.2}`} fill="#2a2a30" />
      {[-1, 1].map((s) => pis ? <path key={s} d={`M${cx + s * r * 0.4 - r * 0.18} ${cy + r * 0.05} h${r * 0.36}`} stroke={L} strokeWidth={3} /> : <g key={s}><circle cx={cx + s * r * 0.4} cy={cy + r * 0.05} r={r * 0.2} fill="#fff" /><circle cx={cx + s * r * 0.4 + alvoX * r * 0.1} cy={cy + r * 0.05} r={r * 0.1} fill={L} /></g>)}
      <path d={`M${cx - r * 0.25} ${cy + r * 0.5} q${r * 0.25} ${-r * 0.1} ${r * 0.5} 0`} stroke={L} strokeWidth={2.5} fill="none" />
      <rect x={x - w / 2} y={y} width={w} height={h} fill="#7a5a3a" opacity={0.18} />
      <rect x={x - 40} y={y + h + 22} width={80} height={22} rx={4} fill="#c9a14a" stroke={L} strokeWidth={2} />
    </g>
  );
};
// Morcegos voando (só à noite).
export const Morcegos = ({ t, n = 4 }: { t: number; n?: number }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const k = (t * (0.12 + i * 0.03) + i * 0.27) % 1;
      const x = -80 + k * 1240, y = 200 + i * 90 + 40 * Math.sin(t * 2 + i), a = 22 * Math.sin(t * 16 + i);
      return <path key={i} d={`M${x - 34} ${y - a} Q${x - 20} ${y - 6} ${x - 8} ${y} Q${x} ${y - 10} ${x + 8} ${y} Q${x + 20} ${y - 6} ${x + 34} ${y - a} Q${x + 18} ${y + 4} ${x} ${y + 8} Q${x - 18} ${y + 4} ${x - 34} ${y - a} z`} fill="#0a0a14" />;
    })}
  </>
);
// Névoa rasteira (fica no chão).
export const NevoaChao = ({ t, y = 1480, op = 0.35, cor = '#c8d0e8' }: { t: number; y?: number; op?: number; cor?: string }) => (
  <>
    {Array.from({ length: 7 }, (_, i) => {
      const x = ((i * 300 + t * (18 + i * 6)) % 1600) - 260;
      return <ellipse key={i} cx={x} cy={y + (i % 3) * 30} rx={260 + (i % 2) * 80} ry={50} fill={cor} opacity={op * (0.6 + 0.4 * Math.sin(t * 0.8 + i))} />;
    })}
  </>
);
// Árvore seca balançando.
export const ArvoreSeca = ({ x, y, s = 1, t }: { x: number; y: number; s?: number; t: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${2 * Math.sin(t * 1.3)} 0 0)`} stroke="#120e16" strokeLinecap="round" fill="none">
    <path d="M0 0 Q-10 -200 10 -380" strokeWidth={34} />
    {[[-4, -160, -90, -60], [6, -240, 80, -70], [10, -320, -60, -80], [8, -360, 50, -90], [-30, -200, -50, -40]].map(([a, b, dx, dy], i) => <path key={i} d={`M${a} ${b} q${dx / 2} ${dy} ${dx} ${dy - 12 * Math.sin(t * 2 + i)}`} strokeWidth={12} />)}
  </g>
);
// Caminhão de mudança.
export const CaminhaoMudanca = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-260} y={-260} width={340} height={220} rx={10} fill="#e8e2d0" stroke={L} strokeWidth={6} />
    <text x={-90} y={-140} textAnchor="middle" fontFamily="Arial Black" fontSize={40} fill="#2f5fa8">MUDANÇAS</text>
    <path d="M80 -200 h90 l50 80 v80 h-140 z" fill="#2f5fa8" stroke={L} strokeWidth={6} strokeLinejoin="round" />
    <path d="M100 -185 h60 l34 60 h-94 z" fill="#bfe0f0" stroke={L} strokeWidth={4} />
    {[-180, 0, 160].map((w) => <g key={w}><circle cx={w} cy={-30} r={40} fill="#1a1a1e" stroke={L} strokeWidth={4} /><circle cx={w} cy={-30} r={16} fill="#9aa0aa" /></g>)}
    {[[-230, -300], [-170, -290], [-120, -300]].map(([bx, by], i) => <rect key={i} x={bx} y={by} width={50} height={40} fill="#c9a06a" stroke={L} strokeWidth={3} />)}
  </g>
);
// Desenhos de criança presos na parede (um deles é a "moça" de véu).
export const DesenhosParede = ({ x, y }: { x: number; y: number }) => (
  <g>
    <g transform={`translate(${x} ${y}) rotate(-5)`}><rect width={150} height={190} fill="#fffef6" stroke={L} strokeWidth={3} /><circle cx={75} cy={60} r={22} fill="none" stroke="#7a7a8a" strokeWidth={4} /><path d="M45 50 Q75 0 105 50 L115 150 H35 z" fill="none" stroke="#9aa0b0" strokeWidth={4} /><path d="M65 60 h4 M82 60 h4" stroke={L} strokeWidth={4} /><text x={75} y={180} textAnchor="middle" fontFamily="Comic Sans MS" fontSize={18} fill="#d1495b">MOÇA</text></g>
    <g transform={`translate(${x + 170} ${y + 40}) rotate(6)`}><rect width={140} height={120} fill="#fffef6" stroke={L} strokeWidth={3} /><path d="M20 100 L70 40 L120 100 z" fill="none" stroke="#d1495b" strokeWidth={4} /><circle cx={110} cy={25} r={14} fill="#f2c94c" /></g>
    {[[x + 75, y], [x + 240, y + 40]].map(([px, py], i) => <circle key={i} cx={px} cy={py - 4} r={7} fill="#d1495b" stroke={L} strokeWidth={2} />)}
  </g>
);
// Luz de vela tremulando (camada por cima da cena).
export const LuzVela = ({ t, x = 540, y = 900, forca = 0.25 }: { t: number; x?: number; y?: number; forca?: number }) => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen', background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,200,120,${forca * (0.8 + 0.2 * Math.sin(t * 9) * Math.sin(t * 3.7))}) 0%, rgba(255,200,120,0) 55%)` }} />
);
