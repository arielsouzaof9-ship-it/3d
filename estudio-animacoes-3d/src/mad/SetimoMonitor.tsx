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
        <text x={0} y={300} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={80} fill="#3a3a44" opacity={clamp((t - W(0, 'quatro') + 0.4) / 0.3)}>1984</text>
      </g></Svg>
      <Luz x={540} y={900} r={700} cor="#ffd166" op={0.12} />
    </Cam>
  ),
  // 1 sete monitores, Kombi chegando ao Pedra Lisa
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <Portao t={t} abandonado />
      <Svg><Kombi x={Math.max(560, 1500 - (t - t0) * 420)} y={1640} s={1.05} t={t} fumaca={1} rostos={7} /></Svg>
      <Pop t={t} at={W(1, 'sete')} x={540} y={420}><Placa texto="7 MONITORES" bg="#f2c94c" size={64} /></Pop>
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
        <Pers k={VELHO} t={t} x={-200 + 520 * chega} y={1640} h={560} movs={[['parado', t0], ['apontar', W(3, 'voltem') - 0.4, 1.6], ['nao', W(3, 'dono') - 0.3, 1.4]]} over={{ sobr: -0.6, boca: 'triste' }} seed={1} />
        <Pop t={t} at={W(3, 'voltem')} x={360} y={700}><Placa texto="VOLTEM." bg="#fffaf0" size={60} /></Pop>
      </Cam>
    );
  },
  // 4 a gente riu; Lia não
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1200}>
      <EstradaMata t={t} />
      <Pers k={BETO} t={t} x={200} y={1760} h={620} movs={[['gargalhar', W(4, 'riu') - 0.3]]} seed={2} />
      <Pers k={CAIO} t={t} x={420} y={1760} h={640} movs={[['rir', W(4, 'riu') - 0.2]]} seed={3} />
      <Pers k={DUDA} t={t} x={880} y={1760} h={600} movs={[['rir', W(4, 'riu') - 0.1]]} seed={4} flip />
      <Pers k={LIA} t={t} x={650} y={1760} h={620} movs={[['parado', t0], ['nervoso', W(4, 'unica') - 0.2]]} over={{ boca: 'neutra', sobr: 0.6, sobrTriste: true, pupila: [-1, 0] }} seed={5} />
    </Cam>
  ),
  // 5 dormitório arrumado, calendário de junho de 1964
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={W(5, 'calendario') < t ? 760 : 1000}>
      <Dormitorio t={t} />
      <Pers k={LIA} t={t} x={andando(t, t0, 160, 50)} y={1700} h={600} movs={[['andar', t0, 2.5], ['parado', t0 + 2.5]]} over={{ x: 0, pupila: [0.4, -0.8], boca: 'o' }} seed={5} />
      <Escuro k={0.2} />
    </Cam>
  ),
  // 6 fogueira, Beto conta a lenda
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1300}>
      <Fogueira t={t} />
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
  // 9 toda sexta-feira 13 alguém some
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1300}>
      <Fogueira t={t} />
      <Pers k={{ ...BETO, item2: 'lanterna' }} t={t} x={540} y={1760} h={700} movs={[['falar', t0], ['apontar', W(9, 'some') - 0.4, 1.4]]} over={{ sobr: -0.5, boca: 'dentes' }} seed={2} />
      <Pop t={t} at={W(9, 'treze')} x={540} y={520}><Placa texto="SEXTA-FEIRA 13" bg="#d1495b" fg="#fff" size={62} /></Pop>
    </Cam>
  ),
  // 10 Beto apaga a lanterna, todo mundo pula de susto
  ({ t, t0, t1 }) => {
    const ap = W(10, 'apagou');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.04} cy={1300}>
        <Fogueira t={t} forca={t > ap ? 0.35 : 1} />
        {[LIA, CAIO, DUDA, OUTROS[0]].map((k, i) => <Pers key={i} k={k} t={t} x={140 + i * 260} y={1760} h={520} movs={[['sentar', t0], ['susto', W(10, 'susto') - 0.35, 1.2], ['sentar', W(10, 'susto') + 0.9]]} seed={i + 3} flip={i > 1} />)}
        {t > ap && t < W(10, 'susto') - 0.3 && <Escuro k={0.75} />}
        {t > ap && <Escuro k={0.3} />}
      </Cam>
    );
  },
  // 11 a gente foi dormir rindo
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1100}>
      <Chales t={t} portas={[0.6, 0.6, 0]} />
      <Pers k={CAIO} t={t} x={260} y={1600} h={460} movs={[['rir', t0]]} seed={3} />
      <Pers k={DUDA} t={t} x={600} y={1600} h={440} movs={[['rir', t0 + 0.2]]} seed={4} flip />
      <Pers k={BETO} t={t} x={880} y={1620} h={480} movs={[['acenar', t0 + 0.3]]} seed={2} flip />
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
  // 15 duas da manhã, telefone toca, só barulho de água
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={1100}>
      <Escritorio64 t={t} toca={t < W(15, 'outro') ? 1 : 0} />
      {t > W(15, 'outro') - 0.2 && <Pers k={LIA} t={t} x={300} y={1720} h={620} movs={[['telefone', W(15, 'outro') - 0.2]]} over={{ olho: 1.3, boca: 'o' }} seed={5} />}
      {t > W(15, 'outro') && <Gotas t={t} x={360} y={1150} n={5} w={60} />}
      <Pop t={t} at={W(15, 'duas')} x={540} y={300}><Relogio texto="02:00" /></Pop>
      <Escuro k={0.25} />
    </Cam>
  ),
  // 16 chalés vazios: porta aberta, cama molhada
  ({ t, t0, t1 }) => {
    const p = clamp((t - t0) / 3);
    return W(16, 'porta') > t ? (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1000}>
        <Chales t={t} luzes={[0, 0, 0]} portas={[1, p > 0.4 ? 1 : 0, p > 0.8 ? 1 : 0]} />
        <Pop t={t} at={W(16, 'vazios')} x={540} y={420}><Placa texto="VAZIOS" bg="#fff" size={64} /></Pop>
      </Cam>
    ) : (
      <Cam t={t} t0={W(16, 'porta')} t1={t1} z0={1.15} z1={1.25} cx={800} cy={1250}>
        <Dormitorio t={t} molhada={1} />
        <Escuro k={0.4} cor="#0a1430" />
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
  // 18 a Kombi não pega
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1300}>
      <Portao t={t} noite={1} />
      <Svg><Kombi x={540} y={1700} s={1.1} t={t > W(18, 'pegou') - 0.6 ? t : 0} fumaca={t > W(18, 'pegou') ? 0.6 : 0} rostos={2} /></Svg>
      <Pers k={LIA} t={t} x={andando(t, t0, -100, 380)} y={1820} h={460} movs={[['correr', t0, 1.4], ['bravo', W(18, 'pegou')]]} over={{ x: 0 }} seed={5} style={{ opacity: t < t0 + 1.2 ? 1 : 0 }} />
      <Pop t={t} at={W(18, 'pegou')} x={540} y={1180}><Placa texto="NÃO PEGA!" bg="#d1495b" fg="#fff" size={56} /></Pop>
      <Escuro k={0.2} />
    </Cam>
  ),
  // 19 Beto: "eu sei onde tem um barco"
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1250}>
      <Lago t={t} nevoa={0.4} />
      <Svg><BarquinhoFundo x={640} y={1510} t={t} s={0.8} /><Barquinho x={640} y={1510} t={t} s={0.8} /></Svg>
      <Pers k={BETO} t={t} x={260} y={1360} h={560} movs={[['falar', t0], ['apontar', W(19, 'barco') - 0.4, 1.6]]} over={{ boca: 'sorriso' }} seed={2} />
      <Pers k={LIA} t={t} x={100} y={1360} h={520} movs={[['nervoso', t0]]} seed={5} />
    </Cam>
  ),
  // 20 no meio da névoa, dentro do barco
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1300}>
      <Lago t={t} pier={false} nevoa={0.7} />
      <Svg><BarquinhoFundo x={540} y={1560} t={t} /></Svg>
      <Pers k={LIA} t={t} x={380} y={1600 + 8 * Math.sin(t * 1.6)} h={500} movs={[['sentar', t0]]} over={{ pupila: [1, 0], sobr: 0.5 }} seed={5} />
      <Pers k={BETO} t={t} x={700} y={1600 + 8 * Math.sin(t * 1.6)} h={540} movs={[['sentar', t0]]} over={{ maoD: [90, -200], maoE: [-90, -200] }} seed={2} flip />
      <Svg><Barquinho x={540} y={1560} t={t} /></Svg>
      <Svg><Nevoa t={t} y={1500} op={0.55} n={7} /></Svg>
    </Cam>
  ),
  // 21 Beto encharcado, sem chuva
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.45} cx={600} cy={1200}>
      <Lago t={t} pier={false} nevoa={0.6} />
      <Pers k={BETO_MOLHADO} t={t} x={620} y={1600} h={600} movs={[['sentar', t0]]} over={{ boca: 'neutra', olho: 0.85 }} seed={2} flip />
      <Gotas t={t} x={620} y={1080} n={7} w={200} />
      <Gotas t={t + 0.4} x={620} y={1280} n={5} w={260} />
      <Svg><Barquinho x={540} y={1560} t={t} /></Svg>
      {t > W(21, 'chovendo') - 0.4 && <Pop t={t} at={W(21, 'chovendo') - 0.3} x={620} y={760}><Placa texto="SEM CHUVA" bg="#fff" size={52} /></Pop>}
    </Cam>
  ),
  // 22 "Eu era o monitor dele."
  ({ t, t0, t1 }) => {
    const rev = W(22, 'monitor');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.7} cx={560} cy={1080}>
        <Lago t={t} pier={false} nevoa={0.7} />
        <Pers k={BETO_MOLHADO} t={t} x={560} y={1640} h={700} movs={[['sentarFalar', t0]]} over={{ boca: t > rev ? 'dentes' : 'sorriso', sobr: -0.4, olho: t > rev ? 1.25 : 0.8 }} seed={2} />
        <Gotas t={t} x={560} y={1050} n={6} w={220} />
        {t > rev && <Escuro k={0.25 + 0.15 * Math.sin(t * 8)} cor="#0a2440" />}
        <Svg><Nevoa t={t} y={1600} op={0.5} n={7} /></Svg>
      </Cam>
    );
  },
  // 23 Lia pula na água e nada até a margem
  ({ t, t0, t1 }) => {
    const pulo = W(23, 'pulei') - 0.2;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1250}>
        <Lago t={t} pier nevoa={0.5} />
        <Svg><Barquinho x={760} y={1500} t={t} s={0.7} /></Svg>
        {t < pulo + 0.5 ? (
          <Pers k={LIA} t={t} x={760 - clamp((t - pulo) / 0.5) * 120} y={1460 - Math.sin(clamp((t - pulo) / 0.5) * Math.PI) * 200} h={460} movs={[['pular', pulo]]} seed={5} />
        ) : (
          <Svg><g transform={`translate(${Math.max(240, 640 - (t - pulo - 0.5) * 200)} 1470)`}><circle r={34} fill="#c98a5a" stroke="#1a1520" strokeWidth={5} /><path d="M-30 -10 q30 -40 60 0" fill="#2a1a12" /><path d={`M-60 20 q30 ${-20 + 20 * Math.sin(t * 8)} 60 0 q30 ${20 - 20 * Math.sin(t * 8)} 60 0`} stroke="#9ab8e8" strokeWidth={8} fill="none" /></g></Svg>
        )}
        <Ondas t={t} x={640} y={1500} at={pulo + 0.45} />
      </Cam>
    );
  },
  // 24 de manhã, todos dormindo no salão de dança
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1350}>
      <Salao t={t} manha />
      {[CAIO, DUDA, ...OUTROS].map((k, i) => <Pers key={i} k={k} t={t} x={140 + i * 200} y={1720 + (i % 2) * 60} h={420} movs={[['cochilar', t0]]} seed={i + 3} flip={i % 2 === 1} />)}
      <Pers k={DELEGADO} t={t} x={960} y={1700} h={620} movs={[['parado', t0], ['olharLados', t0 + 0.8]]} seed={9} flip />
      <Pop t={t} at={W(24, 'vivos')} x={540} y={760}><Placa texto="VIVOS" bg="#3aa14a" fg="#fff" size={60} /></Pop>
    </Cam>
  ),
  // 25 delegado pálido mostra a foto
  ({ t, t0, t1 }) => {
    const pal = W(25, 'palido');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1250}>
        <Salao t={t} manha />
        <Pers k={LIA} t={t} x={260} y={1720} h={620} movs={[['falar', t0], ['parado', pal]]} over={{ boca: t > pal ? 'o' : 'aberta' }} seed={5} />
        <Pers k={t > pal ? { ...DELEGADO, pele: '#d8c8b8' } : DELEGADO} t={t} x={780} y={1720} h={660} movs={[['parado', t0], ['segurar', W(25, 'foto') - 0.4]]} over={{ olho: t > pal ? 1.25 : 1, boca: t > pal ? 'o' : 'neutra', suor: t > pal ? 1 : 0 }} seed={9} flip />
        {t > W(25, 'foto') - 0.1 && <FotoAntiga x={600} y={1240} s={0.55} rot={-6} />}
      </Cam>
    );
  },
  // 26 a foto de 1964: lá estava o Beto
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={960}>
      <Svg><rect width={1080} height={1920} fill="#3a2a1a" /></Svg>
      <FotoAntiga x={540} y={960} s={2.3} rot={-2} />
      <Svg>{t > W(26, 'beto') - 0.2 && <circle cx={540 + 40 * 2.3} cy={960 - 40 * 2.3} r={110} fill="none" stroke="#d1495b" strokeWidth={10} strokeDasharray={`${clamp((t - W(26, 'beto') + 0.2) / 0.5) * 700} 900`} />}</Svg>
      <Svg>{t > W(26, 'beto') - 0.2 && <g transform={`translate(${540 + 40 * 2.3} ${960 - 40 * 2.3})`}><circle r={28 * 2.3 * 0.95} fill="#e8d0b0" opacity={0.0} /></g>}</Svg>
      {t > W(26, 'afogou') - 0.2 && <Ondas t={t} x={540} y={1500} at={W(26, 'afogou') - 0.2} />}
      <Escuro k={0.15} />
    </Cam>
  ),
  // 27 "vocês eram seis. Nunca foram sete."
  ({ t, t0, t1 }) => {
    const seis = W(27, 'seis');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1250}>
        <Salao t={t} manha />
        <Pers k={DELEGADO} t={t} x={540} y={1720} h={720} movs={[['falar', t0], ['nao', W(27, 'sete') - 0.4, 1.2]]} over={{ sobr: 0.5, sobrTriste: true, boca: 'triste' }} seed={9} />
        <Svg>{SETE.map((k, i) => { const some = i === 1 && t > W(27, 'sete') - 0.2; return <g key={i} opacity={t > seis - 0.3 ? (some ? clamp(1 - (t - W(27, 'sete') + 0.2) / 0.5) : 1) : 0}><circle cx={240 + i * 100} cy={560} r={36} fill={(k as { pele: string }).pele} stroke="#1a1520" strokeWidth={5} /><rect x={210 + i * 100} y={600} width={60} height={70} rx={14} fill={(k as { roupa: string }).roupa} stroke="#1a1520" strokeWidth={5} /></g>; })}</Svg>
        <Pop t={t} at={seis} x={540} y={400}><Placa texto={t > W(27, 'sete') - 0.2 ? '6 MONITORES' : '7 → 6'} bg="#fffaf0" size={56} /></Pop>
      </Cam>
    );
  },
  // 28 hoje: lanterna acesa na janela
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1000}>
      <JanelaLanterna t={t} />
      <Pop t={t} at={W(28, 'treze') - 0.2} x={540} y={250}><Placa texto="SEXTA-FEIRA 13" bg="#d1495b" fg="#fff" size={56} /></Pop>
    </Cam>
  ),
  // 29 para o Beto achar o caminho de volta para o lago
  ({ t, t0, t1 }) => {
    const ult = TL.WORDS[TL.WORDS.length - 1].t1;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.3} cx={620} cy={1000}>
        <JanelaLanterna t={t} vulto={clamp((t - W(29, 'beto')) / 1.2)} />
        {t > ult + 0.5 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp((t - ult - 0.5) / 0.8) }} />}
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
    ['sfx-eleven/susto.mp3', W(3, 'voltem') - 0.1, 0.3],
    ['sfx-flutua/risada.mp3', W(4, 'riu') - 0.1, 0.45, 2.5],
    // dormitório
    ['sfx-farol/passos.mp3', ini(5), 0.4, 3],
    ['sfx-casarao/porta.mp3', ini(5) + 0.1, 0.3, 2.5],
    // fogueira e a lenda
    amb('sfx-monitor/fogueira.mp3', 6, 6, 0.45),
    amb('sfx-monitor/fogueira.mp3', 9, 10, 0.45),
    amb('sfx-monitor/grilos.mp3', 6, 6, 0.08),
    ['sfx-farol/caixinha.mp3', ini(7), 0.3, ini(9) - ini(7)],
    ['sfx-monitor/splash.mp3', W(7, 'lago') + 0.1, 0.55, 2.5],
    amb('sfx-monitor/lago.mp3', 7, 8, 0.35),
    ['sfx-eleven/coracao.mp3', ini(9), 0.35, ini(10) - ini(9)],
    ['sfx-monitor/clique.mp3', W(10, 'apagou') - 0.05, 0.6, 1],
    ['sfx-eleven/susto.mp3', W(10, 'susto') - 0.35, 0.5],
    ['sfx-flutua/risada.mp3', ini(11), 0.4, 3],
    // a noite
    amb('sfx-monitor/grilos.mp3', 11, 14, 0.08),
    ['sfx-monitor/gerador.mp3', ini(12), 0.45, W(12, 'apagou') - ini(12)],
    ['sfx-eleven/desliga.mp3', W(12, 'apagou') - 0.2, 0.55],
    ['sfx-farol/passos.mp3', ini(13), 0.4, 3],
    ['sfx-eleven/drone.mp3', W(13, 'voltou') - 0.3, 0.3, ini(15) - W(13, 'voltou')],
    ['sfx-monitor/lanterna-rolando.mp3', W(14, 'sozinha') - 0.8, 0.55, 2.2],
    ['sfx-monitor/telefone.mp3', ini(15), 0.5, W(15, 'outro') - ini(15)],
    ['sfx-monitor/agua-linha.mp3', W(15, 'outro') - 0.1, 0.5, ini(16) - W(15, 'outro') + 0.2],
    ['sfx-casarao/porta.mp3', ini(16) + 0.2, 0.35, 2.5],
    ['sfx-casarao/porta.mp3', W(16, 'grito') - 0.2, 0.3, 2.5],
    ['sfx-monitor/pingos.mp3', W(16, 'porta') - 0.1, 0.5, ini(17) - W(16, 'porta')],
    ['sfx-eleven/coracao.mp3', ini(17), 0.4, ini(19) - ini(17)],
    ['sfx-q9/passos-molhados.mp3', ini(18), 0.35, 1.6],
    ['sfx-monitor/partida.mp3', W(18, 'pegou') - 1.2, 0.4, 2.2],
    // o lago e o barco
    amb('sfx-monitor/lago.mp3', 19, 21, 0.35), amb('sfx-monitor/lago.mp3', 22, 23, 0.15),
    ['sfx-monitor/remo.mp3', ini(20), 0.4, ini(22) - ini(20), true],
    ['sfx-monitor/pingos.mp3', ini(21), 0.4, ini(22) - ini(21)], ['sfx-monitor/pingos.mp3', ini(22), 0.15, ini(23) - ini(22)],
    ['sfx-eleven/drone.mp3', ini(21), 0.2, ini(23) - ini(21)],
    ['sfx-eleven/boom.mp3', W(22, 'monitor') + 0.5, 0.45],
    ['sfx-monitor/splash.mp3', W(23, 'pulei') + 0.2, 0.6, 2.5],
    ['sfx-monitor/nado.mp3', W(23, 'pulei') + 1, 0.45, ini(24) - W(23, 'pulei') - 0.8],
    // a manhã e a revelação
    amb('sfx-monitor/passaros.mp3', 24, 27, 0.25),
    ['sfx-q4/sirenes.mp3', ini(24), 0.2, 2.5],
    ['sfx-farol/caixinha.mp3', ini(25), 0.3, ini(27) - ini(25)],
    ['sfx-eleven/susto.mp3', W(26, 'beto') - 0.2, 0.45],
    ['sfx-casarao/batida.mp3', W(27, 'sete') - 0.1, 0.55, 2.5],
    ['sfx-eleven/drone.mp3', ini(28), 0.18, TL.END - ini(28)],
    amb('sfx-monitor/grilos.mp3', 28, 29, 0.05),
    ['sfx-monitor/lago.mp3', ini(29), 0.18, TL.END - ini(29)],
  ];
};

export const SetimoMonitor = () => <FilmeMad tl={TL} cenas={comVinheta(CENAS)} voz={TL.COM_VOZ ? 'voz-monitor.mp3' : undefined} sfx={sfx()} ganhoSfx={TL.COM_VOZ ? 0.62 : 0.5} />;
export const DURACAO_MONITOR = TL.END;
