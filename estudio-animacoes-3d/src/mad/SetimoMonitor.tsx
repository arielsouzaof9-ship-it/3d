// "O Sétimo Monitor" (terror de acampamento, original) com os PERSONAGENS MAD ARTICULADOS + narração do Will + efeitos sonoros.
import { CSSProperties } from 'react';
import { Svg } from './cenarios';
import {
  Barquinho, BarquinhoFundo, Bicicleta, Chales, clamp, Dormitorio, Escritorio64, EstradaMata, FotoAntiga, Fogueira, Gerador,
  JanelaLanterna, Kombi, Lago, Portao, Salao,
} from './cenarios-acampamento';
import { Lanterna, Nevoa, Vinheta } from './cenarios-ilha';
import { Cam, Placa, Pop } from './FiosBrancos';
import { Ator, Mov } from './FiosBrancosArticulado';
import { Cena, FilmeMad, P, Sfx } from './FilmeMad';
import { Pose } from './Rig';
import { TL_MONITOR as TL } from './timeline-monitor';

// ---------- Elenco ----------
const LIA = { tipo: 'adulto', pele: '#c98a5a', roupa: '#2fa36b', calca: '#2f5fa8', cabelo: 'rabo', corCabelo: '#2a1a12', sapato: '#f2f2f2' };
const BETO = { tipo: 'adulto', pele: '#f0c8a0', roupa: '#f2c94c', calca: '#4a4f3e', cabelo: 'topete', corCabelo: '#7a3a1a', sardas: true, chapeu: 'bone', corChapeu: '#d1495b', sapato: '#1a1a1e' };
const BETO_MOLHADO = { ...BETO, pele: '#c6d4dc', roupa: '#9a8f4a', calca: '#2c3038', corCabelo: '#4a2412' };
const CAIO = { tipo: 'adulto', pele: '#7a4b30', roupa: '#3d5fcf', calca: '#2c3346', cabelo: 'crespo', corCabelo: '#120c08', sapato: '#1a1a1e' };
const DUDA = { tipo: 'adulto', pele: '#f6e3d3', roupa: '#e5484d', calca: '#2c3346', cabelo: 'chanel', corCabelo: '#d9b56a', sapato: '#1a1a1e' };
const OUTROS = [
  { tipo: 'adulto', pele: '#e2b48c', roupa: '#7b5aa6', calca: '#2f5fa8', cabelo: 'curto', corCabelo: '#3a2416', oculos: true, sapato: '#1a1a1e' },
  { tipo: 'adulto', pele: '#8d5a3b', roupa: '#f28fb0', saia: '#5b467e', cabelo: 'longo', corCabelo: '#1a120c', sapato: '#1a1a1e' },
  { tipo: 'adulto', pele: '#f6e3d3', roupa: '#4fb3b6', calca: '#4a4f3e', cabelo: 'espetado', corCabelo: '#c8572b', sapato: '#1a1a1e' },
];
const VELHO = { tipo: 'idoso', pele: '#e2b48c', roupa: '#8a7a5a', calca: '#5a4a3a', cabelo: 'careca', corCabelo: '#d6d6d6', chapeu: 'palha', corChapeu: '#e8c87a', barba: true, corBarba: '#e8e8e8', sapato: '#3a2a1a' };
const DELEGADO = { tipo: 'adulto', pele: '#b9805a', roupa: '#3a4a6a', calca: '#2a3248', cabelo: 'curto', corCabelo: '#1a120c', chapeu: 'quepe', corChapeu: '#2a3248', bigode: true, corBigode: '#1a120c', sapato: '#1a1a1e' };
const TAVINHO = { tipo: 'crianca', pele: '#e8d0b0', roupa: '#a8805a', calca: '#6a5a4a', cabelo: 'franja', corCabelo: '#5a3a22', sapato: '#3a2a1a' };
const SETE = [LIA, BETO, CAIO, DUDA, ...OUTROS];
const FILA = [OUTROS[0], BETO, CAIO, LIA, DUDA, OUTROS[1], OUTROS[2]]; // os 7 lado a lado, Lia no meio
const fx = (i: number, x0 = 90, dx = 150) => x0 + i * dx;

// ---------- Atalhos ----------
type A = { k: object; t: number; x: number; y: number; h?: number; movs: Mov[]; over?: Partial<Pose> | ((p: Pose) => Partial<Pose>); seed?: number; flip?: boolean; op?: number; style?: CSSProperties };
const Pers = ({ op = 1, style, ...a }: A) => <Ator {...a} style={{ opacity: op, ...style }} />;
const W = TL.W;
const ini = (i: number) => (i === 0 ? 0 : i >= TL.LINES.length ? TL.END : W(i, 0));
const andando = (t: number, t0: number, x0: number, v: number) => x0 + v * Math.max(0, t - t0);
const Escuro = ({ k = 0.35, cor = '#05060c' }: { k?: number; cor?: string }) => <div style={{ position: 'absolute', inset: 0, background: cor, opacity: k, pointerEvents: 'none' }} />;
const Sepia = ({ k = 0.45 }: { k?: number }) => <div style={{ position: 'absolute', inset: 0, background: '#8a6a3a', mixBlendMode: 'multiply', opacity: k, pointerEvents: 'none' }} />;
const Luz = ({ x, y, r = 360, cor = '#ff9a3a', op = 0.25 }: { x: number; y: number; r?: number; cor?: string; op?: number }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(${cor}, transparent 70%)`, opacity: op, pointerEvents: 'none' }} />
);
const Relogio = ({ texto, cor = '#ff4040' }: { texto: string; cor?: string }) => (
  <div style={{ background: '#101014', color: cor, fontFamily: '"Courier New", monospace', fontWeight: 900, fontSize: 96, padding: '10px 34px', borderRadius: 18, border: '6px solid #3a3a44', textShadow: `0 0 18px ${cor}` }}>{texto}</div>
);
const Gotas = ({ t, x, y, n = 6, w = 120 }: { t: number; x: number; y: number; n?: number; w?: number }) => (
  <Svg>{Array.from({ length: n }, (_, i) => { const k = (t * 1.1 + i / n) % 1; return <ellipse key={i} cx={x - w / 2 + (i / Math.max(1, n - 1)) * w} cy={y + k * 160} rx={6} ry={11} fill="#9ad0f0" opacity={1 - k} />; })}</Svg>
);
const Ondas = ({ t, x, y, at }: { t: number; x: number; y: number; at: number }) => (
  <Svg>{[0, 1, 2].map((i) => { const k = clamp((t - at - i * 0.35) / 1.6); return k > 0 && k < 1 ? <ellipse key={i} cx={x} cy={y} rx={40 + k * 360} ry={10 + k * 90} fill="none" stroke="#9ab8e8" strokeWidth={6} opacity={1 - k} /> : null; })}</Svg>
);
const LanternaMao = ({ x, y, rot = 0, acesa = true }: { x: number; y: number; rot?: number; acesa?: boolean }) => (
  <Svg><g transform={`translate(${x} ${y}) rotate(${rot})`}>
    {acesa && <path d="M30 0 L520 -150 L520 150 z" fill="#fff3b0" opacity={0.18} />}
    <rect x={-40} y={-18} width={70} height={36} rx={8} fill="#3a3a44" stroke="#1a1520" strokeWidth={5} /><rect x={26} y={-24} width={18} height={48} rx={4} fill={acesa ? '#ffe680' : '#6a6a72'} stroke="#1a1520" strokeWidth={4} />
  </g></Svg>
);

const AFOGADO = (k: object) => ({ ...k, pele: '#b8ccd8', corCabelo: '#2a3440' });
const NOMES = ['CAIO', 'DUDA', 'ZECA', 'RITA', 'JUCA', 'LIA'];
// Número que a voz de criança conta, flutuando azul e tremendo sobre o escuro.
const NumeroFantasma = ({ t, at, x, y, n }: { t: number; at: number; x: number; y: number; n: string }) => {
  const k = clamp((t - at + 0.15) / 0.35);
  return k > 0 ? <div style={{ position: 'absolute', left: x - 120 + 6 * Math.sin(t * 23), top: y - 120 - k * 30, width: 240, textAlign: 'center', fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 200, color: '#bcd4ff', opacity: k * (0.75 + 0.25 * Math.sin(t * 17)), textShadow: '0 0 30px #6aa0ff, 0 0 60px #2a5aff', filter: `blur(${(1 - k) * 6}px)` }}>{n}</div> : null;
};
// Pegadas pequenas e molhadas indo até o lago.
const Pegadas = ({ t, de, x0, y0, x1, y1, n = 10 }: { t: number; de: number; x0: number; y0: number; x1: number; y1: number; n?: number }) => (
  <Svg>{Array.from({ length: n }, (_, i) => { const k = i / (n - 1), x = x0 + (x1 - x0) * k + (i % 2 ? 18 : -18), y = y0 + (y1 - y0) * k, s = 1 - k * 0.6, o = clamp((t - de - i * 0.18) / 0.3); return <g key={i} opacity={o * 0.85} transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.atan2(y1 - y0, x1 - x0) * 57 - 90})`}><ellipse rx={13} ry={22} fill="#5a8ab8" /><circle cx={-8} cy={-28} r={5} fill="#5a8ab8" /><circle cx={0} cy={-31} r={5} fill="#5a8ab8" /><circle cx={8} cy={-28} r={5} fill="#5a8ab8" /><ellipse rx={13} ry={22} fill="#9ad0f0" opacity={0.4} /></g>; })}</Svg>
);
// Mãozinha pálida saindo da água.
const Maozinha = ({ x, y, k, t }: { x: number; y: number; k: number; t: number }) => (
  <Svg><g transform={`translate(${x} ${y + (1 - k) * 120}) rotate(${-10 + 6 * Math.sin(t * 6)})`} opacity={k}>
    <rect x={-16} y={0} width={32} height={120} rx={14} fill="#b8ccd8" stroke="#1a1520" strokeWidth={4} />
    <circle cx={0} cy={-4} r={24} fill="#b8ccd8" stroke="#1a1520" strokeWidth={4} />
    {[-16, -6, 4, 14].map((dx) => <rect key={dx} x={dx - 4} y={-46} width={9} height={30} rx={4} fill="#b8ccd8" stroke="#1a1520" strokeWidth={3} />)}
  </g></Svg>
);
// Fundo do lago com luz entrando de cima.
const FundoLago = ({ t }: { t: number }) => (
  <Svg>
    <defs><linearGradient id="fundoLago" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a3a5a" /><stop offset="1" stopColor="#04080f" /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#fundoLago)" />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${100 + i * 180 + 40 * Math.sin(t * 0.4 + i)} 0 L${40 + i * 180} 1500 H${140 + i * 180} z`} fill="#8ab8e8" opacity={0.05 + 0.03 * Math.sin(t + i)} />)}
    <path d="M0 1620 Q540 1560 1080 1620 V1920 H0 z" fill="#1a2418" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${rnd(i) * 1080} 1640 q${10 * Math.sin(t + i)} -80 ${20 * Math.sin(t * 0.7 + i)} -160`} stroke="#1e4a2a" strokeWidth={8} fill="none" />)}
    {Array.from({ length: 18 }, (_, i) => { const k = (t * 0.25 + rnd(i + 3)) % 1; return <circle key={i} cx={rnd(i + 9) * 1080 + 10 * Math.sin(t * 2 + i)} cy={1600 - k * 1600} r={4 + rnd(i) * 8} fill="none" stroke="#bcd4ff" strokeWidth={2} opacity={0.6 * (1 - k)} />; })}
  </Svg>
);
// A roda de afogados de mãos dadas, flutuando (n = quantos; Tavinho no meio se tavinho).
const Roda = ({ t, ks, op = 1, tavinho = false }: { t: number; ks: object[]; op?: number; tavinho?: boolean }) => {
  const n = ks.length;
  return (
    <>
      {ks.map((k, i) => { const a = (i / n) * Math.PI * 2 + t * 0.15, x = 540 + Math.cos(a) * 340, y = 1380 + Math.sin(a) * 120, h = 420 + Math.sin(a) * 60; return { i, k, x, y, h, z: Math.sin(a) }; })
        .sort((a, b) => a.z - b.z)
        .map(({ i, k, x, y, h }) => <Pers key={i} k={AFOGADO(k)} t={t} x={x} y={y + 14 * Math.sin(t * 1.3 + i)} h={h} movs={[['parado', 0]]} over={{ maoE: [-120, -170], maoD: [120, -170], olho: 0.12, boca: 'neutra', pupila: [0, 0.6] }} seed={i + 40} op={op * 0.85} />)}
      {tavinho && <Pers k={AFOGADO(TAVINHO)} t={t} x={540} y={1400 + 10 * Math.sin(t)} h={320} movs={[['parado', 0]]} over={{ olho: 1.2, boca: 'sorriso' }} seed={50} op={op * 0.9} />}
    </>
  );
};
const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- Cenas (uma por frase) ----------
const CENAS: Cena[] = [
  // 0 sexta-feira, 13 de junho de 1984
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={900}>
      <Svg><rect width={1080} height={1920} fill="#1a1820" /></Svg>
      <Svg><g transform="translate(540 900)">
        <rect x={-300} y={-360} width={600} height={720} rx={20} fill="#fffaf0" stroke="#1a1520" strokeWidth={8} />
        <rect x={-300} y={-360} width={600} height={160} rx={20} fill="#d1495b" /><text x={0} y={-255} textAnchor="middle" fontFamily="Arial Black" fontSize={74} fill="#fff">JUNHO</text>
        <text x={0} y={90} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={300} fill="#1a1520" opacity={clamp((t - W(0, 'treze') + 0.3) / 0.3)}>13</text>
        <text x={0} y={200} textAnchor="middle" fontFamily="Arial Black" fontSize={50} fill="#d1495b" opacity={clamp((t - W(0, 'sexta')) / 0.3)}>SEXTA-FEIRA</text>
        <text x={0} y={300} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={80} fill="#3a3a44" opacity={clamp((t - W(0, 'mil') + 0.1) / 0.3)}>1984</text>
      </g></Svg>
      <Luz x={540} y={900} r={700} cor="#ffd166" op={0.12} />
    </Cam>
  ),
  // 1 sete monitores, Kombi chegando ao Pedra Lisa
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <Portao t={t} abandonado />
      <Svg><Kombi x={Math.max(560, 1500 - (t - t0) * 420)} y={1560} s={0.95} t={t} fumaca={1} rostos={4} /></Svg>
      {FILA.map((k, i) => { const at = W(1, 'sete') - 0.3 + i * 0.22; return t > at ? <Pers key={i} k={k} t={t} x={fx(i)} y={1720} h={460} movs={[['entrar', at, 0.5], [i === 3 ? 'parado' : 'acenar', at + 0.5]]} over={i === 3 ? { boca: 'neutra' } : {}} seed={i + 20} flip={i > 3} /> : null; })}
      {FILA.map((_, i) => <Pop key={i} t={t} at={W(1, 'sete') - 0.1 + i * 0.22} x={fx(i)} y={1180}><div style={{ background: '#f2c94c', color: '#1a1520', fontFamily: 'Arial Black', fontSize: 40, width: 62, height: 62, borderRadius: 31, border: '4px solid #1a1520', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div></Pop>)}
      <Pop t={t} at={W(1, 'sete') + 1.5} x={540} y={420}><Placa texto="7 MONITORES" bg="#f2c94c" size={64} /></Pop>
    </Cam>
  ),
  // 2 vinte anos fechado
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1.25} cy={900}>
      <Portao t={t} abandonado />
      <Svg><g transform="translate(540 1250) rotate(-6)"><rect x={-260} y={-70} width={520} height={140} fill="#7a2a2a" stroke="#1a1520" strokeWidth={6} /><text y={22} textAnchor="middle" fontFamily="Arial Black" fontSize={70} fill="#f2e6d0">FECHADO</text></g></Svg>
      <Pop t={t} at={W(2, 'vinte')} x={540} y={420}><Placa texto="20 ANOS" bg="#fff" size={72} /></Pop>
      <Escuro k={0.15} />
    </Cam>
  ),
  // 3 o velho de bicicleta: "Voltem."
  ({ t, t0, t1 }) => {
    const chega = clamp((t - t0) / 1.6);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1150}>
        <EstradaMata t={t} />
        <Svg><Kombi x={830} y={1700} s={0.9} t={0} rostos={4} /></Svg>
        <Svg><Bicicleta x={-200 + 520 * chega} y={1780} s={1.2} t={t * (1 - chega)} /></Svg>
        <Pers k={VELHO} t={t} x={-200 + 520 * chega} y={1640} h={560} movs={[['parado', t0], ['apontar', W(3, 'voltem') - 0.4, 1.6], ['nao', W(3, 'contando') - 0.3, 1.4]]} over={{ sobr: -0.6, boca: 'triste' }} seed={1} />
        <Pop t={t} at={W(3, 'voltem')} x={360} y={700}><Placa texto="VOLTEM." bg="#fffaf0" size={60} /></Pop>
      </Cam>
    );
  },
  // 4 a gente riu; Lia não
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1200}>
      <EstradaMata t={t} />
      {FILA.map((k, i) => i === 3
        ? <Pers key={i} k={LIA} t={t} x={fx(i)} y={1700} h={540} movs={[['parado', t0], ['nervoso', W(4, 'unica') - 0.2]]} over={{ boca: 'neutra', sobr: 0.6, sobrTriste: true, pupila: [-1, 0] }} seed={5} />
        : <Pers key={i} k={k} t={t} x={fx(i)} y={1700} h={520} movs={[[i === 1 ? 'gargalhar' : 'rir', W(4, 'riu') - 0.3 + (i % 3) * 0.1]]} seed={i + 20} flip={i > 3} />)}
    </Cam>
  ),
  // 5 dormitório arrumado, calendário de junho de 1964
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={W(5, 'calendario') < t ? 760 : 1000}>
      <Dormitorio t={t} molhada={clamp((t - W(5, 'molhadas') + 0.3) / 0.4)} />
      <Pers k={LIA} t={t} x={andando(t, t0, 160, 50)} y={1700} h={600} movs={[['andar', t0, 2.5], ['parado', t0 + 2.5]]} over={{ x: 0, pupila: [0.4, -0.8], boca: 'o' }} seed={5} />
      <Escuro k={0.2} />
    </Cam>
  ),
  // 6 fogueira, Beto conta a lenda
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1300}>
      <Fogueira t={t} />
      {[OUTROS[0], OUTROS[1], OUTROS[2]].map((k, i) => <Pers key={i} k={k} t={t} x={[230, 360, 740][i]} y={1490} h={360} movs={[['sentar', t0 + i * 0.2]]} over={{ pupila: [i < 2 ? 1 : -1, 0] }} seed={i + 30} flip={i === 2} />)}
      <Pers k={LIA} t={t} x={140} y={1680} h={520} movs={[['sentar', t0]]} seed={5} />
      <Pers k={CAIO} t={t} x={330} y={1700} h={480} movs={[['sentar', t0]]} seed={3} />
      <Pers k={DUDA} t={t} x={760} y={1700} h={470} movs={[['sentar', t0]]} seed={4} flip />
      <Pers k={{ ...BETO, item: 'lanterna' }} t={t} x={940} y={1700} h={560} movs={[['sentarFalar', t0]]} over={{ maoD: [90, -260] }} seed={2} flip />
      <Luz x={540} y={1500} r={600} op={0.3} />
      <Pop t={t} at={W(6, 'lenda')} x={540} y={600}><Placa texto="A LENDA" bg="#ffd166" size={60} /></Pop>
    </Cam>
  ),
  // 7 1964: Tavinho cai no lago enquanto dançam no salão (sépia)
  ({ t, t0, t1 }) => {
    const cai = W(7, 'lago') - 0.3;
    const yb = t < cai ? 1360 : 1360 + Math.min(400, (t - cai) * 700);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
        <Lago t={t} salao nevoa={0.2} />
        <Pers k={TAVINHO} t={t} x={t < cai ? 440 : 440 + Math.min(130, (t - cai) * 320)} y={yb} h={380} movs={[['parado', t0], ['susto', cai - 0.2]]} seed={8} />
        {t > cai && <Svg><rect x={505} y={1415} width={575} height={505} fill="#14244a" />{[0, 1, 2].map((i) => <path key={i} d={`M${540 + i * 160} ${1460 + i * 90} q40 -10 80 0`} stroke="#3a5a8a" strokeWidth={4} fill="none" />)}</Svg>}
        <Ondas t={t} x={570} y={1430} at={cai + 0.4} />
        <Pop t={t} at={W(7, 'tavinho')} x={720} y={480}><Placa texto="1964" bg="#f4e8d0" size={70} /></Pop>
        <Sepia />
      </Cam>
    );
  },
  // 8 ninguém ouviu ele gritar: só ondas no lago
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.2} cy={1200}>
      <Lago t={t} salao nevoa={0.35} />
      <Ondas t={t} x={570} y={1430} at={t0} />
      <Sepia k={0.35} />
      <Escuro k={0.2} />
    </Cam>
  ),
  // 9 toda sexta-feira 13 ele volta para buscar uma turma nova
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.14} cy={1250}>
      <Fogueira t={t} />
      <Pers k={{ ...BETO, item2: 'lanterna' }} t={t} x={540} y={1760} h={700} movs={[['falar', t0], ['apontar', W(9, 'turma') - 0.4, 1.4]]} over={{ sobr: -0.5, boca: 'dentes' }} seed={2} />
      <Pop t={t} at={W(9, 'treze')} x={540} y={520}><Placa texto="SEXTA-FEIRA 13" bg="#d1495b" fg="#fff" size={62} /></Pop>
      {t > W(9, 'turma') - 0.2 && <Svg>{FILA.map((_, i) => <circle key={i} cx={fx(i)} cy={760} r={34} fill="none" stroke="#bcd4ff" strokeWidth={6} strokeDasharray="8 8" opacity={clamp((t - W(9, 'turma') + 0.2 - i * 0.08) / 0.3) * 0.8} />)}</Svg>}
    </Cam>
  ),
  // 10 Beto apaga a lanterna; do escuro do lago, uma voz de criança conta 1, 2, 3
  ({ t, t0, t1 }) => {
    const ap = W(10, 'apagou');
    const nums: [string, string][] = [['1', 'um'], ['2', 'dois'], ['3', 'tres']];
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1250}>
        <Fogueira t={t} forca={t > ap ? 0.2 : 1} />
        {FILA.map((k, i) => i === 1
          ? <Pers key={i} k={{ ...BETO, item: t > ap ? undefined : 'lanterna' }} t={t} x={fx(i)} y={1690} h={470} movs={[['sentar', t0]]} over={{ boca: 'sorriso', pupila: [0, -0.5] }} seed={2} />
          : <Pers key={i} k={k} t={t} x={fx(i)} y={1690} h={450} movs={[['sentar', t0], ['susto', W(10, 'um') - 0.3 + (i % 2) * 0.05, 1.2], ['nervoso', W(10, 'um') + 0.9]]} over={{ pupila: [0, -1] }} seed={i + 20} flip={i > 3} />)}
        {t > ap && <Escuro k={0.6} />}
        {nums.map(([n, w], i) => <NumeroFantasma key={n} t={t} at={W(10, w)} x={300 + i * 240} y={760} n={n} />)}
      </Cam>
    );
  },
  // 11 Ninguém riu.
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.25} z1={1.4} cy={1300}>
      <Fogueira t={t} forca={0.15} />
      {FILA.map((k, i) => <Pers key={i} k={k} t={t} x={fx(i)} y={1690} h={450} movs={[['sentar', t0]]} over={{ boca: i === 1 ? 'sorriso' : 'neutra', olho: i === 1 ? 0.8 : 1.25, sobr: i === 1 ? -0.5 : 0.8, sobrTriste: i !== 1, suor: i === 1 ? 0 : 1, pupila: [0, -1] }} seed={i + 20} flip={i > 3} />)}
      <Escuro k={0.6} />
      <Luz x={fx(1)} y={1450} r={160} cor="#bcd4ff" op={0.3} />
    </Cam>
  ),
  // 12 meia-noite, a luz do gerador apaga
  ({ t, t0, t1 }) => {
    const off = W(12, 'apagou') - 0.2;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1000}>
        <Gerador t={t} ligado={t < off ? 1 : 0} />
        {t > off && <Escuro k={0.45} />}
        <Pop t={t} at={W(12, 'meia')} x={540} y={420}><Relogio texto="00:00" /></Pop>
      </Cam>
    );
  },
  // 13 Caio vai ligar e não volta
  ({ t, t0, t1 }) => {
    const x = andando(t, t0, 340, 180);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1100}>
        <Chales t={t} luzes={[0, 0, 0]} portas={[1, 0, 0]} />
        <Pers k={{ ...CAIO, item: 'lanterna' }} t={t} x={x} y={1640} h={480} movs={[['andar', t0]]} over={{ x: 0 }} seed={3} op={clamp(1 - (t - W(13, 'voltou') + 1) / 1.2)} />
        <Lanterna x={x + 40} y={1400} r={300} forca={0.8} />
      </Cam>
    );
  },
  // 14 a lanterna da Duda volta sozinha, rolando pela escada
  ({ t, t0, t1 }) => {
    const r = clamp((t - W(14, 'sozinha') + 0.8) / 1.6);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={1350}>
        <Chales t={t} luzes={[0, 0, 0]} portas={[1, 1, 0]} />
        <Pers k={{ ...DUDA, item: 'lanterna' }} t={t} x={andando(t, t0, 300, 200)} y={1600} h={440} movs={[['espiar', t0, 1.2], ['andar', t0 + 1.2]]} over={{ x: 0 }} seed={4} op={clamp(1 - (t - t0 - 1.6) / 0.6)} />
        {r > 0 && <LanternaMao x={460 + r * 160} y={1180 + r * 380 + Math.abs(Math.sin(r * 14)) * -30} rot={r * 720} />}
        <Escuro k={0.25} />
      </Cam>
    );
  },
  // 15 duas da manhã, telefone toca; do outro lado, só água e a voz: "quatro... cinco..."
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={1100}>
      <Escritorio64 t={t} toca={t < W(15, 'outro') ? 1 : 0} />
      {t > W(15, 'outro') - 0.2 && <Pers k={LIA} t={t} x={300} y={1720} h={620} movs={[['telefone', W(15, 'outro') - 0.2], ['aflito', W(15, 'quatro') + 0.2]]} over={{ olho: 1.3, boca: 'o', suor: 1 }} seed={5} />}
      {t > W(15, 'outro') && <Gotas t={t} x={360} y={1150} n={5} w={60} />}
      <Pop t={t} at={W(15, 'duas')} x={540} y={300}><Relogio texto="02:00" /></Pop>
      {t > W(15, 'quatro') - 0.3 && <Escuro k={0.45} cor="#0a1430" />}
      <NumeroFantasma t={t} at={W(15, 'quatro')} x={640} y={760} n="4" />
      <NumeroFantasma t={t} at={W(15, 'cinco')} x={860} y={980} n="5" />
    </Cam>
  ),
  // 16 chalés vazios; pegadas pequenas e molhadas indo para o lago
  ({ t, t0, t1 }) => {
    const p = clamp((t - t0) / 3), pg = W(16, 'pegadas');
    return t < pg - 0.2 ? (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1000}>
        <Chales t={t} luzes={[0, 0, 0]} portas={[1, p > 0.4 ? 1 : 0, p > 0.8 ? 1 : 0]} />
        <Pop t={t} at={W(16, 'vazios')} x={540} y={420}><Placa texto="VAZIOS" bg="#fff" size={64} /></Pop>
        <Escuro k={0.2} />
      </Cam>
    ) : (
      <Cam t={t} t0={pg - 0.2} t1={t1} z0={1.1} z1={1.25} cy={1450}>
        <Chales t={t} luzes={[0, 0, 0]} portas={[1, 1, 1]} />
        <Pegadas t={t} de={pg - 0.2} x0={250} y0={1220} x1={760} y1={1880} n={12} />
        <Pegadas t={t} de={pg} x0={590} y0={1220} x1={820} y1={1880} n={10} />
        <Pegadas t={t} de={pg + 0.3} x0={930} y0={1220} x1={880} y1={1880} n={9} />
        <Escuro k={0.3} cor="#0a1430" />
      </Cam>
    );
  },
  // 17 às quatro, só Lia e Beto
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1200}>
      <Chales t={t} luzes={[0, 0, 0]} portas={[1, 1, 1]} />
      <Pers k={LIA} t={t} x={400} y={1700} h={600} movs={[['aflito', t0]]} seed={5} />
      <Pers k={BETO} t={t} x={680} y={1700} h={640} movs={[['olharLados', t0]]} over={{ boca: 'neutra' }} seed={2} flip />
      <Pop t={t} at={W(17, 'quatro')} x={540} y={420}><Relogio texto="04:00" /></Pop>
      <Escuro k={0.2} />
    </Cam>
  ),
  // 18 a Kombi não pega; no vidro embaçado, um dedinho escreveu "seis"
  ({ t, t0, t1 }) => {
    const vidro = W(18, 'vidro') - 0.3;
    return t < vidro ? (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1300}>
        <Portao t={t} noite={1} />
        <Svg><Kombi x={540} y={1700} s={1.1} t={t > W(18, 'pegou') - 0.6 ? t : 0} fumaca={t > W(18, 'pegou') ? 0.6 : 0} rostos={0} /></Svg>
        <Pers k={LIA} t={t} x={andando(t, t0, -100, 380)} y={1820} h={460} movs={[['correr', t0, 1.4]]} over={{ x: 0 }} seed={5} style={{ opacity: t < t0 + 1.2 ? 1 : 0 }} />
        <Pop t={t} at={W(18, 'pegou')} x={540} y={1180}><Placa texto="NÃO PEGA!" bg="#d1495b" fg="#fff" size={56} /></Pop>
        <Escuro k={0.2} />
      </Cam>
    ) : (
      <Cam t={t} t0={vidro} t1={t1} z0={1} z1={1.1} cy={960}>
        <Svg>
          <rect width={1080} height={1920} fill="#0e1424" />
          <rect x={90} y={560} width={900} height={800} rx={40} fill="#8a98b0" stroke="#e8e2d0" strokeWidth={30} />
          {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={120 + rnd(i) * 840} cy={590 + rnd(i + 5) * 740} r={10 + rnd(i + 2) * 30} fill="#c8d4e4" opacity={0.25} />)}
          {Array.from({ length: 8 }, (_, i) => { const k = clamp((t - vidro - 0.6 - i * 0.1) / 1.5); return <path key={i} d={`M${330 + i * 60} 1020 v${k * 220}`} stroke="#6a7890" strokeWidth={8} strokeLinecap="round" opacity={0.6} />; })}
          <text x={540} y={1020} textAnchor="middle" fontFamily="'Comic Sans MS', cursive" fontSize={250} fill="#3a4a64" opacity={clamp((t - W(18, 'seis') + 0.4) / 0.5)} style={{ letterSpacing: 10 }}>SEIS</text>
          <path d="M240 1250 q20 -40 50 -10 q10 -50 40 -20 q10 -40 40 -5" stroke="#b8ccd8" strokeWidth={14} fill="none" opacity={0.3} strokeLinecap="round" />
        </Svg>
        <Escuro k={0.15} />
      </Cam>
    );
  },
  // 19 Beto: "eu sei onde tem um barco"
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1250}>
      <Lago t={t} nevoa={0.4} />
      <Svg><BarquinhoFundo x={640} y={1510} t={t} s={0.8} /><Barquinho x={640} y={1510} t={t} s={0.8} /></Svg>
      <Pers k={BETO} t={t} x={260} y={1360} h={560} movs={[['falar', t0], ['apontar', W(19, 'barco') - 0.4, 1.6]]} over={{ boca: 'sorriso' }} seed={2} />
      <Pers k={LIA} t={t} x={100} y={1360} h={520} movs={[['nervoso', t0]]} seed={5} />
    </Cam>
  ),
  // 20 no meio da névoa, alguma coisa bate no fundo do barco, por baixo
  ({ t, t0, t1 }) => {
    const bates = [W(20, 'bater') - 0.1, W(20, 'bater') + 0.6, W(20, 'baixo') - 0.1];
    const tr = bates.reduce((a, b) => a + (t > b ? Math.exp(-(t - b) * 9) : 0), 0);
    const dy = 8 * Math.sin(t * 1.6) - 18 * tr;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={1440}>
        <div style={{ position: 'absolute', inset: 0, transform: `translate(${6 * tr * Math.sin(t * 60)}px, 0)` }}>
          <Lago t={t} pier={false} nevoa={0.7} />
          <Svg><BarquinhoFundo x={540} y={1560 - 18 * tr} t={t} /></Svg>
          <Pers k={LIA} t={t} x={380} y={1600 + dy} h={500} movs={[['sentar', t0], ['susto', bates[0] - 0.2, 1], ['sentar', bates[0] + 0.8]]} over={t > bates[0] - 0.25 ? { pupila: [0, 1], sobr: 1, sobrTriste: true, olho: 1.35, boca: 'o', suor: 1 } : { pupila: [1, 0] }} seed={5} />
          <Pers k={BETO} t={t} x={700} y={1600 + dy} h={540} movs={[['sentar', t0]]} over={{ maoD: [90, -200], maoE: [-90, -200], boca: 'sorriso' }} seed={2} flip />
          <Svg><Barquinho x={540} y={1560 - 18 * tr} t={t} /></Svg>
          {bates.map((b, i) => <Ondas key={i} t={t} x={540} y={1640} at={b} />)}
          <Svg><Nevoa t={t} y={1500} op={0.55} n={7} /></Svg>
        </div>
      </Cam>
    );
  },
  // 21 Beto encharcado, sem chuva (Lia e Beto no barco)
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.25} z1={1.4} cx={580} cy={1460}>
      <Lago t={t} pier={false} nevoa={0.6} />
      <Svg><BarquinhoFundo x={540} y={1560} t={t} /></Svg>
      <Pers k={LIA} t={t} x={380} y={1600 + 8 * Math.sin(t * 1.6)} h={500} movs={[['sentar', t0]]} over={{ pupila: [1, 0], sobr: 1, sobrTriste: true, olho: 1.3, boca: 'o', suor: 1 }} seed={5} />
      <Pers k={BETO_MOLHADO} t={t} x={700} y={1600 + 8 * Math.sin(t * 1.6)} h={540} movs={[['sentar', t0]]} over={{ maoD: [90, -200], maoE: [-90, -200], boca: 'neutra', olho: 0.85 }} seed={2} flip />
      <Gotas t={t} x={700} y={1130} n={7} w={180} />
      <Gotas t={t + 0.4} x={700} y={1300} n={5} w={240} />
      <Svg><Barquinho x={540} y={1560} t={t} /></Svg>
      {t > W(21, 'chovendo') - 0.4 && <Pop t={t} at={W(21, 'chovendo') - 0.3} x={600} y={900}><Placa texto="SEM CHUVA" bg="#fff" size={52} /></Pop>}
      <Svg><Nevoa t={t} y={1500} op={0.45} n={7} /></Svg>
    </Cam>
  ),
  // 22 "Eu era o monitor dele." (ainda no barco)
  ({ t, t0, t1 }) => {
    const rev = W(22, 'monitor');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.6} cx={600} cy={1440}>
        <Lago t={t} pier={false} nevoa={0.7} />
        <Svg><BarquinhoFundo x={540} y={1560} t={t} /></Svg>
        <Pers k={LIA} t={t} x={380} y={1600 + 8 * Math.sin(t * 1.6)} h={500} movs={[['sentar', t0]]} over={{ pupila: [1, 0], sobr: 1, sobrTriste: true, olho: 1.35, boca: 'o', suor: 1, lagrima: t > rev ? 1 : 0 }} seed={5} />
        <Pers k={BETO_MOLHADO} t={t} x={700} y={1600 + 8 * Math.sin(t * 1.6)} h={540} movs={[['sentarFalar', t0]]} over={{ boca: t > rev ? 'dentes' : 'sorriso', sobr: -0.4, olho: t > rev ? 1.25 : 0.8, pupila: [-1, 0] }} seed={2} flip />
        <Gotas t={t} x={700} y={1130} n={6} w={180} />
        <Svg><Barquinho x={540} y={1560} t={t} /></Svg>
        {t > rev && <Escuro k={0.25 + 0.15 * Math.sin(t * 8)} cor="#0a2440" />}
        <Svg><Nevoa t={t} y={1600} op={0.5} n={7} /></Svg>
      </Cam>
    );
  },
  // 23 Lia pula do barco e nada; uma mão pequena e gelada segura o tornozelo
  ({ t, t0, t1 }) => {
    const pulo = W(23, 'pulei') - 0.2, tz = W(23, 'tornozelo') - 0.4;
    const puxa = t > tz ? Math.min(1, (t - tz) / 0.4) : 0;
    const nx = Math.max(110, 240 - (t - pulo - 0.6) * 110);
    const kp = clamp((t - pulo) / 0.6);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.15} cx={480} cy={1460}>
        <Lago t={t} pier={false} nevoa={0.5} />
        <Svg><BarquinhoFundo x={600} y={1560} t={t} /></Svg>
        <Pers k={BETO_MOLHADO} t={t} x={760} y={1600 + 8 * Math.sin(t * 1.6)} h={540} movs={[['sentar', t0]]} over={{ maoD: [90, -200], maoE: [-90, -200], boca: 'sorriso', olho: 1.1, pupila: [-1, 0] }} seed={2} flip />
        {t < pulo + 0.6 && <Pers k={LIA} t={t} x={440 - kp * 220} y={t < pulo ? 1600 : 1600 - Math.sin(kp * Math.PI) * 220 + kp * 60} h={500} movs={[['sentar', t0], ['pular', pulo]]} over={{ olho: 1.35, boca: 'o', sobr: 1, sobrTriste: true, suor: 1 }} seed={5} style={{ opacity: kp > 0.85 ? 0 : 1 }} />}
        <Svg><Barquinho x={600} y={1560} t={t} /></Svg>
        {t > pulo + 0.5 && <Svg><g transform={`translate(${nx} ${1640 + puxa * 30 + (t > tz ? 10 * Math.sin(t * 30) : 0)})`}><circle r={34} fill="#c98a5a" stroke="#1a1520" strokeWidth={5} /><path d="M-30 -10 q30 -40 60 0" fill="#2a1a12" /><circle cx={-12} cy={-2} r={puxa ? 9 : 6} fill="#fff" stroke="#1a1520" strokeWidth={2} /><circle cx={12} cy={-2} r={puxa ? 9 : 6} fill="#fff" stroke="#1a1520" strokeWidth={2} /><ellipse cy={18} rx={8} ry={6} fill="#1a1520" /><path d={`M-60 20 q30 ${-20 + 20 * Math.sin(t * 8)} 60 0 q30 ${20 - 20 * Math.sin(t * 8)} 60 0`} stroke="#9ab8e8" strokeWidth={8} fill="none" /></g></Svg>}
        {t > tz && <Maozinha x={nx + 70} y={1680} k={puxa} t={t} />}
        <Ondas t={t} x={230} y={1660} at={pulo + 0.5} />
        {t > tz && <Ondas t={t} x={nx} y={1660} at={tz} />}
        <Svg><Nevoa t={t} y={1500} op={0.4} n={6} /></Svg>
      </Cam>
    );
  },
  // 24 chega na margem... pelo menos, foi o que pensou
  ({ t, t0, t1 }) => {
    const pen = W(24, 'pensei');
    const glitch = t > pen - 0.2 && Math.sin(t * 50) > 0.2;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1300}>
        <Lago t={t} pier nevoa={0.6} />
        <Pers k={t > pen ? AFOGADO(LIA) : LIA} t={t} x={260} y={1360} h={520} movs={[['parado', t0], ['aflito', t0 + 0.6, 1.5], ['parado', t0 + 2.2]]} over={{ suor: 1, olho: t > pen ? 0.15 : 1.1, pupila: [1, 0] }} seed={5} />
        <Gotas t={t} x={260} y={1000} n={6} w={140} />
        {t > pen - 0.2 && <Escuro k={glitch ? 0.6 : 0.3} cor="#0a2440" />}
        {t > pen && <Ondas t={t} x={640} y={1500} at={pen} />}
      </Cam>
    );
  },
  // 25 de manhã, entra na delegacia pingando; ninguém olha
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1200}>
      <Escritorio64 t={t} />
      <Svg><rect x={720} y={420} width={260} height={360} fill="#c8d8e8" opacity={0.5} /></Svg>
      <Pers k={DELEGADO} t={t} x={700} y={1720} h={680} movs={[['parado', t0], ['olharLados', W(25, 'olhou') - 0.2]]} over={{ pupila: [1, 0], boca: 'neutra' }} seed={9} flip />
      <Pers k={AFOGADO(LIA)} t={t} x={andando(t, t0, 80, 60)} y={1740} h={620} movs={[['andar', t0, 2.4], ['parado', t0 + 2.4]]} over={{ x: 0, olho: 0.6, boca: 'triste', sobrTriste: true, sobr: 0.6 }} seed={5} op={0.85} />
      <Gotas t={t} x={andando(t, t0, 80, 60)} y={1180} n={5} w={120} />
      <Pegadas t={t} de={t0} x0={60} y0={1880} x1={andando(t, t0, 80, 60)} y1={1800} n={6} />
    </Cam>
  ),
  // 26 a lista dos mergulhadores; seis monitores no fundo do lago, de mãos dadas, em roda
  ({ t, t0, t1 }) => {
    const roda = W(26, 'seis') + 0.3;
    return t < roda ? (
      <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.2} cy={960}>
        <Svg>
          <rect width={1080} height={1920} fill="#6b4224" />
          <g transform="translate(540 960) rotate(-3)"><rect x={-330} y={-460} width={660} height={920} fill="#f4efe0" stroke="#1a1520" strokeWidth={6} />
            <text y={-370} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={40} fill="#1a1520">MERGULHADORES</text>
            <text y={-320} textAnchor="middle" fontFamily="Georgia" fontSize={30} fill="#5a4a3a">Lago Pedra Lisa · 14/06/1984</text>
            {NOMES.map((nm, i) => <text key={nm} x={-250} y={-200 + i * 100} fontFamily="'Courier New', monospace" fontWeight={900} fontSize={54} fill="#1a1520" opacity={clamp((t - t0 - 0.3 - i * 0.25) / 0.3)}>{i + 1}. {i === 5 ? '______' : nm}</text>)}
          </g>
        </Svg>
      </Cam>
    ) : (
      <Cam t={t} t0={roda} t1={t1} z0={1} z1={1.12} cy={1250}>
        <FundoLago t={t} />
        <Roda t={t} ks={[CAIO, DUDA, ...OUTROS, LIA]} op={clamp((t - roda) / 1)} />
      </Cam>
    );
  },
  // 27 o último nome da lista era o meu
  ({ t, t0, t1 }) => {
    const meu = W(27, 'meu') - 0.3;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.6} cy={1150}>
        <Svg>
          <rect width={1080} height={1920} fill="#6b4224" />
          <g transform="translate(540 960) rotate(-3)"><rect x={-330} y={-460} width={660} height={920} fill="#f4efe0" stroke="#1a1520" strokeWidth={6} />
            {NOMES.map((nm, i) => <text key={nm} x={-250} y={-200 + i * 100} fontFamily="'Courier New', monospace" fontWeight={900} fontSize={54} fill={i === 5 && t > meu ? '#a01a1a' : '#1a1520'}>{i + 1}. {nm}</text>)}
            {t > meu && <ellipse cx={-150} cy={285} rx={170} ry={60} fill="none" stroke="#a01a1a" strokeWidth={8} strokeDasharray={`${clamp((t - meu) / 0.5) * 800} 900`} />}
            {t > meu && Array.from({ length: 4 }, (_, i) => <ellipse key={i} cx={-200 + i * 70} cy={320 + ((t * 40 + i * 30) % 120)} rx={8} ry={14} fill="#5a8ab8" opacity={0.6} />)}
          </g>
        </Svg>
        {t > meu + 0.6 && <Escuro k={0.2 + 0.1 * Math.sin(t * 6)} cor="#0a2440" />}
      </Cam>
    );
  },
  // 28 o sétimo lugar da roda é do Beto; a turma do Tavinho está completa
  ({ t, t0, t1 }) => {
    const set = W(28, 'setimo') - 0.2, comp = W(28, 'completa') - 0.3;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={1250}>
        <FundoLago t={t} />
        <Roda t={t} ks={[CAIO, DUDA, ...OUTROS, LIA, ...(t > set ? [BETO] : [])]} tavinho={t > comp} />
        {t > comp && <Luz x={540} y={1200} r={400} cor="#bcd4ff" op={0.25 * clamp((t - comp) / 0.6)} />}
        <Pop t={t} at={set} x={540} y={600}><Placa texto="7" bg="#0e1830" fg="#bcd4ff" size={120} /></Pop>
      </Cam>
    );
  },
  // 29 toda sexta-feira 13, acendem uma lanterna na beira do lago para chamar os próximos
  ({ t, t0, t1 }) => {
    const ult = TL.WORDS[TL.WORDS.length - 1].t1, prox = W(29, 'proximos') - 0.3;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.25} cy={1350}>
        <Lago t={t} pier nevoa={0.55} />
        <Svg><g transform="translate(470 1355)"><rect x={-24} y={-70} width={48} height={64} rx={10} fill="#ffd166" stroke="#1a1520" strokeWidth={4} /><path d="M-30 -70 h60 l-6 -14 h-48 z" fill="#3a3a3a" /><circle cy={-38} r={180} fill="#ffd166" opacity={0.16 + 0.05 * Math.sin(t * 7)} /></g></Svg>
        {[CAIO, DUDA, LIA, BETO, ...OUTROS].map((k, i) => <Pers key={i} k={AFOGADO(k)} t={t} x={560 + i * 70} y={1520 + (i % 2) * 30} h={300} movs={[['parado', 0]]} over={{ olho: 0.15, boca: 'neutra' }} seed={i + 60} op={0.35 * clamp((t - t0 - 0.5 - i * 0.2) / 0.8)} style={{ clipPath: 'inset(0 0 calc(100% - 1500px) 0)' }} />)}
        {t > prox && <Svg><g opacity={clamp((t - prox) / 0.6)}><Kombi x={1300 - Math.min(400, (t - prox) * 300)} y={1000} s={0.35} t={t} rostos={4} /></g></Svg>}
        {t > ult + 0.8 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp((t - ult - 0.8) / 1) }} />}
      </Cam>
    );
  },
];

const comVinheta = (cs: Cena[]): Cena[] => cs.map((C) => (p: P) => <>{C(p)}<Vinheta forca={0.55} /></>);

// ---------- Efeitos sonoros (biblioteca + sintetizados em public/sfx-monitor) ----------
const sfx = (): Sfx[] => {
  const amb = (f: string, de: number, ate: number, vol: number): Sfx => [f, ini(de), vol, ini(ate + 1) - ini(de) + 0.3, true];
  return [
    ['sfx-eleven/drone.mp3', 0, 0.25, ini(1)],
    ['sfx-casarao/batida.mp3', W(0, 'treze') - 0.1, 0.5, 2],
    // estrada e portão
    ['sfx-monitor/kombi.mp3', ini(1), 0.45, ini(3) - ini(1)],
    amb('sfx-monitor/grilos.mp3', 1, 5, 0.1),
    ['sfx-casarao/porta.mp3', ini(2) + 0.3, 0.35, 3],
    ['sfx-monitor/bicicleta.mp3', ini(3), 0.45, 2],
    ['sfx-eleven/susto.mp3', W(3, 'contando') - 0.1, 0.3],
    ['sfx-flutua/risada.mp3', W(4, 'riu') - 0.1, 0.45, 2.5],
    // dormitório (camas molhadas)
    ['sfx-farol/passos.mp3', ini(5), 0.4, 3],
    ['sfx-monitor/pingos.mp3', W(5, 'molhadas') - 0.2, 0.45, 3],
    // fogueira e a lenda
    amb('sfx-monitor/fogueira.mp3', 6, 9, 0.4),
    amb('sfx-monitor/grilos.mp3', 6, 6, 0.08),
    ['sfx-farol/caixinha.mp3', ini(7), 0.3, ini(9) - ini(7)],
    ['sfx-monitor/splash.mp3', W(7, 'lago') + 0.1, 0.55, 2.5],
    amb('sfx-monitor/lago.mp3', 7, 8, 0.35),
    ['sfx-eleven/coracao.mp3', ini(9), 0.35, ini(10) - ini(9)],
    ['sfx-eleven/susto.mp3', W(9, 'turma') - 0.1, 0.35],
    // a contagem no escuro
    ['sfx-monitor/clique.mp3', W(10, 'apagou') - 0.05, 0.6, 1],
    ['sfx-monitor/fogueira.mp3', W(10, 'apagou'), 0.15, ini(12) - W(10, 'apagou')],
    ['sfx-eleven/drone.mp3', W(10, 'apagou'), 0.35, ini(12) - W(10, 'apagou') + 0.5],
    ['sfx-eleven/susto.mp3', W(10, 'um') - 0.2, 0.45],
    ['sfx-monitor/pingos.mp3', W(10, 'dois') - 0.2, 0.3, 2],
    ['sfx-eleven/coracao.mp3', W(10, 'um'), 0.4, ini(12) - W(10, 'um')],
    // a noite
    amb('sfx-monitor/grilos.mp3', 12, 14, 0.06),
    ['sfx-monitor/gerador.mp3', ini(12), 0.45, W(12, 'apagou') - ini(12)],
    ['sfx-eleven/desliga.mp3', W(12, 'apagou') - 0.2, 0.55],
    ['sfx-farol/passos.mp3', ini(13), 0.4, 3],
    ['sfx-eleven/drone.mp3', W(13, 'voltou') - 0.3, 0.3, ini(15) - W(13, 'voltou')],
    ['sfx-monitor/lanterna-rolando.mp3', W(14, 'sozinha') - 0.8, 0.55, 2.2],
    ['sfx-monitor/telefone.mp3', ini(15), 0.5, W(15, 'outro') - ini(15)],
    ['sfx-monitor/agua-linha.mp3', W(15, 'outro') - 0.1, 0.5, ini(16) - W(15, 'outro') + 0.2],
    ['sfx-eleven/susto.mp3', W(15, 'quatro') - 0.2, 0.4],
    ['sfx-casarao/porta.mp3', ini(16) + 0.2, 0.35, 2.5],
    ['sfx-q9/passos-molhados.mp3', W(16, 'pegadas') - 0.2, 0.45, ini(17) - W(16, 'pegadas') + 0.2],
    ['sfx-eleven/coracao.mp3', ini(17), 0.28, ini(19) - ini(17)],
    ['sfx-q9/passos-molhados.mp3', ini(18), 0.3, 1.6],
    ['sfx-monitor/partida.mp3', W(18, 'pegou') - 1.2, 0.25, 2.2],
    ['sfx-casarao/vidro-risco.mp3', W(18, 'vidro'), 0.3, 2.5],
    ['sfx-eleven/boom.mp3', W(18, 'seis') - 0.1, 0.4],
    // o lago e o barco
    amb('sfx-monitor/lago.mp3', 19, 21, 0.35),
    ['sfx-monitor/remo.mp3', ini(20), 0.35, ini(22) - ini(20), true],
    ['sfx-casarao/batida.mp3', W(20, 'bater') - 0.1, 0.55, 0.8],
    ['sfx-casarao/batida.mp3', W(20, 'bater') + 0.6, 0.5, 0.8],
    ['sfx-casarao/batida.mp3', W(20, 'baixo') - 0.1, 0.42, 1.2],
    ['sfx-monitor/pingos.mp3', ini(21), 0.4, ini(22) - ini(21)],
    ['sfx-eleven/drone.mp3', ini(21), 0.2, ini(23) - ini(21)],
    amb('sfx-monitor/lago.mp3', 22, 22, 0.15),
    ['sfx-monitor/pingos.mp3', ini(22), 0.15, ini(23) - ini(22)],
    ['sfx-eleven/boom.mp3', W(22, 'ajudo') + 0.4, 0.45],
    ['sfx-monitor/splash.mp3', W(23, 'pulei') + 0.2, 0.6, 2.5],
    ['sfx-monitor/nado.mp3', W(23, 'pulei') + 1, 0.45, ini(25) - W(23, 'pulei') - 1],
    ['sfx-eleven/susto.mp3', W(23, 'tornozelo') - 0.4, 0.5],
    ['sfx-monitor/splash.mp3', W(23, 'tornozelo') - 0.3, 0.4, 1.5],
    ['sfx-q9/passos-molhados.mp3', W(24, 'margem'), 0.35, 1.5],
    ['sfx-eleven/drone.mp3', W(24, 'pensei') - 0.2, 0.35, ini(26) - W(24, 'pensei')],
    // a delegacia e o fundo do lago
    ['sfx-q9/passos-molhados.mp3', ini(25), 0.4, 2.6],
    ['sfx-monitor/pingos.mp3', ini(25), 0.35, ini(26) - ini(25)],
    ['sfx-q9/papel.mp3', ini(26), 0.45, 2],
    ['sfx-q9/caneta.mp3', ini(26) + 0.4, 0.35, 1.6],
    amb('sfx-lagartixa/borbulha.mp3', 26, 28, 0.2),
    ['sfx-eleven/coro.mp3', W(26, 'roda') - 0.4, 0.18, ini(28) - W(26, 'roda')],
    ['sfx-casarao/batida.mp3', W(27, 'meu') + 0.3, 0.45, 2.5],
    ['sfx-eleven/drone.mp3', ini(27), 0.22, ini(29) - ini(27)],
    ['sfx-eleven/susto.mp3', W(28, 'setimo') - 0.2, 0.3],
    ['sfx-eleven/boom.mp3', W(28, 'completa') + 0.7, 0.45],
    // final
    ['sfx-monitor/lago.mp3', ini(29), 0.2, TL.END - ini(29)],
    ['sfx-eleven/drone.mp3', ini(29), 0.2, TL.END - ini(29)],
    ['sfx-monitor/kombi.mp3', W(29, 'proximos') - 0.3, 0.2, TL.END - W(29, 'proximos')],
    ['sfx-eleven/boom.mp3', TL.WORDS[TL.WORDS.length - 1].t1 + 0.7, 0.45],
  ];
};

export const SetimoMonitor = () => <FilmeMad tl={TL} cenas={comVinheta(CENAS)} voz={TL.COM_VOZ ? 'voz-monitor.mp3' : undefined} sfx={sfx()} ganhoSfx={TL.COM_VOZ ? 0.62 : 0.5} />;
export const DURACAO_MONITOR = TL.END;
