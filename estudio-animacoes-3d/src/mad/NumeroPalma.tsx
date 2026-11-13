// "O Número da Palma" (história da Nina) refeita com os PERSONAGENS MAD ARTICULADOS (com dedos) + narração do Will.
import { CSSProperties } from 'react';
import { Svg } from './cenarios';
import { Bercario, CidadeRafael, clamp, Contador, Escombros, Palma, Quartel, QuartoEstudo, SalaAula, SalaCasa, Velorio } from './cenarios-palma';
import { Vinheta } from './cenarios-ilha';
import { Coletiva } from './cenarios-lata';
import { Balao, Brilho, Cam, Placa, Pop } from './FiosBrancos';
import { Ator, Mov } from './FiosBrancosArticulado';
import { Cena, FilmeMad, P, Sfx } from './FilmeMad';
import { Pose } from './Rig';
import { TL_PALMA as TL } from './timeline-palma';

// ---------- Elenco (mesmas cores dos personagens mad do catálogo) ----------
const MORENA = '#b9805a', CLARA = '#f6e3d3';
const NINA_BEBE = { tipo: 'crianca', pele: MORENA, roupa: '#f6b8c8', calca: '#f6b8c8', cabelo: 'curto', corCabelo: '#2a1a12', sapato: '#f6b8c8' };
const NINA_KID = { tipo: 'crianca', pele: MORENA, roupa: '#f2c94c', calca: '#2f5fa8', sapato: '#d8352f', cabelo: 'rabo', corCabelo: '#2a1a12' };
const NINA = { tipo: 'adulto', pele: MORENA, roupa: '#c8452e', calca: '#2b2b30', colete: '#f2c94c', cabelo: 'rabo', corCabelo: '#2a1a12', chapeu: 'capacete', corChapeu: '#f2c94c', sapato: '#1a1a1e' };
const RAFA_BEBE = { tipo: 'crianca', pele: CLARA, roupa: '#9cc3e6', calca: '#9cc3e6', cabelo: 'curto', corCabelo: '#3a2416', sapato: '#9cc3e6' };
const RAFA_KID = { tipo: 'crianca', pele: CLARA, roupa: '#26262c', calca: '#26262c', gravata: '#c22a2a', cabelo: 'topete', corCabelo: '#3a2416', sapato: '#1a1a1e' };
const RAFA = { ...RAFA_KID, tipo: 'adulto' };
const MAE_NINA = { tipo: 'adulto', pele: MORENA, roupa: '#2fa36b', calca: '#2c3346', cabelo: 'longo', corCabelo: '#1f140e', sapato: '#1a1a1e' };
const PAI_RAFA = { tipo: 'adulto', pele: CLARA, roupa: '#6d7480', calca: '#4f5560', gravata: '#a3242a', cabelo: 'curto', corCabelo: '#2b2421', oculos: true, sapato: '#1a1a1e' };
const MAE_RAFA = { tipo: 'adulto', pele: CLARA, roupa: '#2f4f8f', saia: '#2f4f8f', cabelo: 'chanel', corCabelo: '#c8572b', sapato: '#2f4f8f' };
const FOTOGRAFO = { tipo: 'adulto', pele: '#7a4b30', roupa: '#3d5fcf', calca: '#2c3346', cabelo: 'crespo', corCabelo: '#1a120c', chapeu: 'bone', corChapeu: '#e5484d', sapato: '#1a1a1e' };
const VO = { tipo: 'idoso', pele: CLARA, roupa: '#7b5aa6', saia: '#5b467e', cabelo: 'coque', corCabelo: '#d6d6d6', oculos: true, item2: 'maleta', sapato: '#5b467e' };
const MAE_BEBE = { tipo: 'adulto', pele: '#e2b48c', roupa: '#4fb3b6', calca: '#4fb3b6', cabelo: 'chanel', corCabelo: '#1a1410', sapato: '#1a1a1e' };
const COLEGAS = [
  { tipo: 'crianca', pele: '#e2b48c', roupa: '#3aa14a', calca: '#2f5fa8', cabelo: 'curto', corCabelo: '#3a2416', chapeu: 'touca', corChapeu: '#2f6fb3', sapato: '#1a1a1e' },
  { tipo: 'crianca', pele: '#7a4b30', roupa: '#7b5aa6', calca: '#2c3346', cabelo: 'crespo', corCabelo: '#120c08', sapato: '#1a1a1e' },
  { tipo: 'crianca', pele: CLARA, roupa: '#e5484d', saia: '#e5484d', cabelo: 'chanel', corCabelo: '#d9b56a', sapato: '#e5484d' },
];

// ---------- Atalhos ----------
type A = { k: object; t: number; x: number; y: number; h?: number; movs: Mov[]; over?: Partial<Pose> | ((p: Pose) => Partial<Pose>); seed?: number; flip?: boolean; op?: number; style?: CSSProperties };
const Pers = ({ op = 1, style, ...a }: A) => <Ator {...a} style={{ opacity: op, ...style }} />;
const W = TL.W;
const andando = (t: number, t0: number, x0: number, v: number) => x0 + v * Math.max(0, t - t0);
const Flashes = ({ t, n = 5 }: { t: number; n?: number }) => <>{Array.from({ length: n }, (_, i) => { const k = (t * 1.7 + i * 0.37) % 1; return k < 0.06 ? <div key={i} style={{ position: 'absolute', inset: 0, background: '#fff', opacity: 0.35 }} /> : null; })}</>;
const Noite = ({ k = 0.3 }: { k?: number }) => <div style={{ position: 'absolute', inset: 0, background: '#0a0a22', opacity: k, pointerEvents: 'none' }} />;
// Selo com número acima de um personagem.
const Numero = ({ t, at, x, y, n, cor = '#f2c94c' }: { t: number; at: number; x: number; y: number; n: string; cor?: string }) => (
  <Pop t={t} at={at} x={x} y={y}><div style={{ background: '#1a1520', color: cor, fontFamily: '"Courier New", monospace', fontWeight: 900, fontSize: n.length > 6 ? 46 : 64, padding: '8px 22px', borderRadius: 14, border: `5px solid ${cor}` }}>{n}</div></Pop>
);

// Bebê enrolado na mantinha, no colo de quem está em (x, y) com altura h.
const BebeColo = ({ x, y, h, t, olho = false }: { x: number; y: number; h: number; t: number; olho?: boolean }) => {
  const s = h / 700, cy = y - h * 0.44;
  return (
    <Svg><g transform={`translate(${x} ${cy + 3 * Math.sin(t * 2)}) scale(${s}) rotate(-12)`}>
      <ellipse cx={20} cy={20} rx={120} ry={70} fill="#fffaf0" stroke="#1a1520" strokeWidth={6} />
      <path d="M-70 -10 q60 50 170 10" stroke="#9cc3e6" strokeWidth={10} fill="none" />
      <circle cx={-60} cy={-10} r={52} fill="#e2b48c" stroke="#1a1520" strokeWidth={6} />
      <path d="M-100 -30 q40 -50 80 0" fill="#fffaf0" stroke="#1a1520" strokeWidth={5} />
      {olho ? <><circle cx={-76} cy={-6} r={6} fill="#1a1520" /><circle cx={-48} cy={-6} r={6} fill="#1a1520" /></> : <path d="M-84 -6 q8 6 16 0 M-56 -6 q8 6 16 0" stroke="#1a1520" strokeWidth={4} fill="none" />}
      <circle cx={-90} cy={10} r={8} fill="#f2a0b0" opacity={0.6} /><circle cx={-34} cy={10} r={8} fill="#f2a0b0" opacity={0.6} />
      <path d="M-68 18 q8 6 16 0" stroke="#1a1520" strokeWidth={4} fill="none" />
    </g></Svg>
  );
};

// ---------- Cenas (uma por frase) ----------
const CENAS: Cena[] = [
  // 0 todo bebê nasce com um número na palma
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1250}><Bercario t={t} numeros={['3', '27', '150', '8', '1.200', '42']} /></Cam>,
  // 1 diz quantas vidas você vai mudar
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={900}>
      <Svg><rect width={1080} height={1920} fill="#2a2440" /><Palma x={540} y={1000} s={1.6} pele="#e2b48c" numero="27" t={t} brilho={1} /></Svg>
      <Svg>{Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 + t * 0.4, k = clamp((t - W(1, 'vidas') - i * 0.06) / 0.4); return <g key={i} opacity={k} transform={`translate(${540 + Math.cos(a) * 430} ${1000 + Math.sin(a) * 520})`}><circle r={30} fill="#f6e3d3" stroke="#1a1520" strokeWidth={4} /><rect x={-26} y={28} width={52} height={50} rx={16} fill={['#e5484d', '#2f5fa8', '#3aa14a', '#f2c94c'][i % 4]} stroke="#1a1520" strokeWidth={4} /></g>; })}</Svg>
    </Cam>
  ),
  // 2 o número tem um defeito
  ({ t, t0, t1 }) => {
    const g = t > W(2, 'defeito') - 0.1 && Math.sin(t * 40) > 0.3;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.2} cy={1000}>
        <Svg><rect width={1080} height={1920} fill="#2a2440" /><g transform={g ? 'translate(10 -6)' : ''}><Palma x={540} y={1000} s={1.6} pele="#e2b48c" numero={g ? '2?7' : '27'} t={t} /></g></Svg>
        <Pop t={t} at={W(2, 'defeito')} x={540} y={420}><Placa texto="DEFEITO" bg="#e5484d" fg="#fff" size={80} /></Pop>
      </Cam>
    );
  },
  // 3 não diz se é pra melhor ou pra pior
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={960}>
      <Svg><rect width={540} height={1920} fill="#3aa14a" /><rect x={540} width={540} height={1920} fill="#c8452e" /><path d="M270 700 l-120 160 h80 v240 h80 v-240 h80 z" fill="#fff" stroke="#1a1520" strokeWidth={6} /><path d="M810 1100 l-120 -160 h80 v-240 h80 v240 h80 z" fill="#fff" stroke="#1a1520" strokeWidth={6} /></Svg>
      <Pop t={t} at={W(3, 'melhor')} x={270} y={1300}><Placa texto="MELHOR?" bg="#fff" size={58} /></Pop>
      <Pop t={t} at={W(3, 'pior')} x={810} y={1300}><Placa texto="PIOR?" bg="#fff" size={58} /></Pop>
    </Cam>
  ),
  // 4 o Rafael nasceu com um milhão
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1150}>
      <Bercario t={t} />
      <Pers k={PAI_RAFA} t={t} x={220} y={1720} h={680} movs={[['comemorar', W(4, 'milhao') - 0.2]]} seed={2} />
      <Pers k={MAE_RAFA} t={t} x={860} y={1720} h={660} movs={[['aplaudir', W(4, 'milhao') - 0.2]]} seed={3} flip />
      <Pers k={RAFA_BEBE} t={t} x={540} y={1560} h={360} movs={[['parado', t0]]} over={{ maoD: [110, -330], olhoFeliz: true, boca: 'riso' }} seed={4} />
      <Numero t={t} at={W(4, 'milhao')} x={640} y={1060} n="1.000.000" />
    </Cam>
  ),
  // 5 os pais deram festa, o jornal veio fotografar
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1150}>
      <SalaCasa t={t} festa />
      <Pers k={PAI_RAFA} t={t} x={230} y={1700} h={660} movs={[['rir', t0]]} seed={2} />
      <Pers k={MAE_RAFA} t={t} x={430} y={1700} h={640} movs={[['comemorar', t0]]} seed={3} />
      <Pers k={{ ...FOTOGRAFO, item: 'celular' }} t={t} x={860} y={1720} h={660} movs={[['parado', t0]]} over={{ maoD: [70, -330], maoE: [-30, -330], frenteE: true, pupila: [-1, 0] }} seed={5} flip />
      {t > W(5, 'fotografar') - 0.3 && <Flashes t={t} />}
    </Cam>
  ),
  // 6 desde pequeno ouvia que ia mudar o mundo
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1150}>
      <SalaCasa t={t} />
      <Pers k={RAFA_KID} t={t} x={540} y={1720} h={560} movs={[['comemorar', t0]]} seed={4} />
      <Pers k={PAI_RAFA} t={t} x={200} y={1700} h={660} movs={[['apontar', t0 + 0.4]]} seed={2} />
      <Pers k={MAE_RAFA} t={t} x={880} y={1700} h={640} movs={[['aplaudir', t0 + 0.6]]} seed={3} flip />
      <Pop t={t} at={W(6, 'mudar')} x={540} y={760}><Placa texto="VAI MUDAR O MUNDO!" bg="#f2c94c" size={50} /></Pop>
    </Cam>
  ),
  // 7 a Nina, no mesmo dia, tinha o número um
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1150}>
      <Bercario t={t} />
      <Pers k={MAE_NINA} t={t} x={800} y={1720} h={680} movs={[['parado', t0]]} over={{ sobrTriste: true, boca: 'triste', pupila: [-0.8, 0.4] }} seed={6} flip />
      <Pers k={NINA_BEBE} t={t} x={420} y={1560} h={360} movs={[['parado', t0]]} over={{ maoD: [110, -330], olho: 0.05 }} seed={7} />
      <Numero t={t} at={W(7, 'um')} x={520} y={1060} n="1" cor="#e9e3d6" />
    </Cam>
  ),
  // 8 um só
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.35} cy={980}>
      <Svg><rect width={1080} height={1920} fill="#2a2440" /><Palma x={540} y={1000} s={1.3} pele={MORENA} numero="1" t={t} dedos={0.75} /></Svg>
    </Cam>
  ),
  // 9 a mãe fechava a mãozinha da filha quando chegava visita
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1150}>
      <SalaCasa t={t} />
      <Pers k={VO} t={t} x={andando(t, t0, 1100, -150)} y={1700} h={620} movs={[['andar', t0, 1.6], ['acenar', t0 + 1.6]]} over={(p) => ({ x: 0 })} seed={8} flip />
      <Pers k={MAE_NINA} t={t} x={320} y={1700} h={680} movs={[['parado', t0], ['nervoso', W(9, 'fechava') - 0.2]]} seed={6} />
      <Pers k={NINA_KID} t={t} x={480} y={1720} h={420} movs={[['parado', t0]]} over={{ maoE: [-60, -170], sobrTriste: true, pupila: [0.6, -0.4] }} seed={7} />
    </Cam>
  ),
  // 10 na escola, a Nina era a menina do um
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1150}>
      <SalaAula t={t} />
      {COLEGAS.map((k, i) => <Pers key={i} k={k} t={t} x={620 + i * 150} y={1720 + (i % 2) * 30} h={480} movs={[['apontar', t0 + i * 0.2]]} over={{ boca: 'riso' }} seed={10 + i} flip />)}
      <Pers k={NINA_KID} t={t} x={220} y={1720} h={500} movs={[['parado', t0]]} over={{ sobrTriste: true, boca: 'triste' }} seed={7} />
      <Pop t={t} at={W(10, 'menina')} x={300} y={900}><Placa texto="A MENINA DO 1" bg="#fffaf0" size={50} /></Pop>
    </Cam>
  ),
  // 11 ninguém sentava com ela
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1150}>
      <SalaAula t={t} />
      <Pers k={NINA_KID} t={t} x={230} y={1560} h={460} movs={[['sentar', t0]]} over={{ sobrTriste: true, boca: 'triste', pupila: [0.8, 0.2] }} seed={7} />
      {COLEGAS.map((k, i) => <Pers key={i} k={k} t={t} x={720 + i * 120} y={1560 + (i % 2) * 20} h={440} movs={[['sentarFalar', t0 + i * 0.3]]} seed={10 + i} flip={i > 0} />)}
    </Cam>
  ),
  // 12 diziam que nem precisava estudar
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1150}>
      <SalaAula t={t} />
      {COLEGAS.map((k, i) => <Pers key={i} k={k} t={t} x={620 + i * 150} y={1720 + (i % 2) * 30} h={480} movs={[['gargalhar', t0 + i * 0.15]]} seed={10 + i} flip />)}
      <Pers k={NINA_KID} t={t} x={230} y={1720} h={500} movs={[['parado', t0], ['chorar', W(12, 'diferenca') - 0.3]]} seed={7} />
      <Pop t={t} at={W(12, 'estudar')} x={700} y={800}><Balao texto="Pra quê estudar?" /></Pop>
    </Cam>
  ),
  // 13 ela estudou mesmo assim
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1150}>
      <QuartoEstudo t={t} />
      <Pers k={NINA_KID} t={t} x={540} y={1470} h={780} movs={[['sentar', t0]]} over={{ maoE: [-40, -230], maoD: [50, -225], pupila: [0, 0.8], boca: 'neutra', sobr: -0.3 }} seed={7} />
      <Svg><rect x={180} y={1330} width={720} height={36} fill="#8a5a32" stroke="#1a1520" strokeWidth={5} /><rect x={200} y={1366} width={680} height={180} fill="#6b4224" stroke="#1a1520" strokeWidth={5} /><g transform="translate(540 1330)"><rect x={-110} y={-24} width={220} height={26} fill="#fffaf0" stroke="#1a1520" strokeWidth={3} /><path d="M0 -24 v26" stroke="#1a1520" strokeWidth={2} />{Array.from({ length: 4 }, (_, i) => <path key={i} d={`M${-100} ${-18 + i * 5} h88 M${12} ${-18 + i * 5} h88`} stroke="#9a8a6a" strokeWidth={1.5} />)}</g>{[[300, '#e5484d'], [340, '#2f5fa8'], [780, '#3aa14a']].map(([x, c], i) => <rect key={i} x={(x as number) - 40} y={1300 - i * 8} width={80} height={30} fill={c as string} stroke="#1a1520" strokeWidth={3} />)}</Svg>
    </Cam>
  ),
  // 14 virou bombeira
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1150}>
      <Quartel t={t} />
      <Pers k={NINA} t={t} x={540} y={1760} h={760} movs={[['entrar', W(14, 'bombeira') - 0.3, 0.6], ['joinha', W(14, 'bombeira') + 0.3]]} seed={7} />
      <Brilho t={t} at={W(14, 'bombeira')} x={540} y={1300} r={200} n={12} />
    </Cam>
  ),
  // 15 o Rafael virou o empresário mais rico do país
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <Coletiva t={t} logo="RAFAEL" />
      <Pers k={RAFA} t={t} x={540} y={1500} h={760} movs={[['acenar', t0], ['joinha', W(15, 'rico')]]} seed={4} />
      {Array.from({ length: 6 }, (_, i) => { const k = ((t - t0) * 0.6 + i / 6) % 1; return <Svg key={i}><g transform={`translate(${120 + i * 170} ${200 + k * 1100}) rotate(${k * 300})`}><rect x={-46} y={-24} width={92} height={48} rx={6} fill="#7ad08a" stroke="#1a1520" strokeWidth={3} /><text x={0} y={9} textAnchor="middle" fontFamily="Arial Black" fontSize={24} fill="#1a6a3a">R$</text></g></Svg>; })}
      <Flashes t={t} />
    </Cam>
  ),
  // 16 construiu prédios em todas as cidades, mais baratos
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1050}>
      <CidadeRafael t={t} subindo={0.3 + 0.7 * clamp((t - t0) / 2)} />
      <Pop t={t} at={W(16, 'baratos')} x={540} y={300}><Placa texto="MAIS BARATO!" bg="#e5484d" fg="#fff" size={70} /></Pop>
    </Cam>
  ),
  // 17 um milhão de pessoas compraram
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1050}>
      <CidadeRafael t={t} />
      <Contador t={t} at={W(17, 'milhao') - 0.3} valor={1000000} y={420} />
      {Array.from({ length: 7 }, (_, i) => <Pers key={i} k={[...COLEGAS, MAE_BEBE, PAI_RAFA, MAE_NINA, FOTOGRAFO][i]} t={t} x={100 + i * 145} y={1720 + (i % 2) * 40} h={i < 3 ? 380 : 480} movs={[['comemorar', t0 + i * 0.12]]} seed={20 + i} />)}
    </Cam>
  ),
  // 18 vinte anos depois, numa noite de chuva
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1} cy={1000}>
      <CidadeRafael t={t} noite chuva />
      <Pop t={t} at={W(18, 'vinte')} x={540} y={300}><Placa texto="20 ANOS DEPOIS" bg="#1a1520" fg="#fff" size={60} /></Pop>
    </Cam>
  ),
  // 19 o primeiro prédio desabou
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.04} cy={1000}>
      <CidadeRafael t={t} noite chuva desaba={[clamp((t - W(19, 'desabou') + 0.3) / 1.2), 0, 0]} />
    </Cam>
  ),
  // 20 depois o segundo
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.04} cy={1000}><CidadeRafael t={t} noite chuva desaba={[1, clamp((t - W(20, 'segundo') + 0.2) / 1.1), 0]} /></Cam>,
  // 21 depois o terceiro
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.04} cy={1000}><CidadeRafael t={t} noite chuva desaba={[1, 1, clamp((t - W(21, 'terceiro') + 0.2) / 1.1)]} /></Cam>,
  // 22 o Rafael tinha economizado no concreto
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <Coletiva t={t} logo="RAFAEL" />
      <Noite k={0.35} />
      <Pers k={RAFA} t={t} x={380} y={1720} h={720} movs={[['nervoso', t0]]} seed={4} />
      <Svg><g transform="translate(800 1560)"><path d="M-110 -160 h220 l20 160 h-260 z" fill="#c9c2b0" stroke="#1a1520" strokeWidth={5} /><text x={0} y={-90} textAnchor="middle" fontFamily="Arial Black" fontSize={34} fill="#1a1520">CIMENTO</text><text x={0} y={-40} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#e5484d">50% AREIA</text></g></Svg>
      <Pop t={t} at={W(22, 'economizado')} x={760} y={1180}><Placa texto="ECONOMIA" bg="#e5484d" fg="#fff" size={48} /></Pop>
    </Cam>
  ),
  // 23 um milhão de vidas mudaram
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1050}>
      <CidadeRafael t={t} noite chuva desaba={[1, 1, 1]} />
      <Contador t={t} at={t0} valor={1000000} cor="#e5484d" y={420} />
      {Array.from({ length: 5 }, (_, i) => <Pers key={i} k={[MAE_BEBE, PAI_RAFA, MAE_NINA, FOTOGRAFO, VO][i]} t={t} x={120 + i * 210} y={1740} h={500} movs={[['chorar', t0 + i * 0.15]]} seed={30 + i} />)}
    </Cam>
  ),
  // 24 do jeito errado
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.45} cy={1000}>
      <Coletiva t={t} logo="RAFAEL" />
      <Noite k={0.4} />
      <Pers k={RAFA} t={t} x={540} y={1760} h={860} movs={[['aflito', t0]]} seed={4} />
      <Svg><path d="M300 520 L780 1000 M780 520 L300 1000" stroke="#e5484d" strokeWidth={40} strokeLinecap="round" opacity={clamp((t - W(24, 'errado')) / 0.3) * 0.8} /></Svg>
    </Cam>
  ),
  // 25 a Nina entra nos escombros sozinha
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1150}>
      <Escombros t={t} />
      <Pers k={NINA} t={t} x={andando(t, t0, 200, 90)} y={1640} h={640} movs={[['andarNoLugar', t0]]} over={{ x: 0, maoD: [100, -240], pupila: [1, 0.3], sobr: -0.3, boca: 'neutra' }} seed={7} />
      <Svg><path d={`M${andando(t, t0, 200, 90) + 120} ${1640 - 640 * 0.47} L1100 ${1200} L1100 ${1500} z`} fill="#fff6c8" opacity={0.18} /></Svg>
    </Cam>
  ),
  // 26 e saiu com um bebê nos braços
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1150}>
      <Escombros t={t} />
      <Pers k={NINA} t={t} x={540} y={1680} h={720} movs={[['parado', t0]]} over={{ maoD: [60, -230], maoE: [-50, -220], pupila: [0.3, 0.6], boca: 'sorriso' }} seed={7} />
      <BebeColo x={560} y={1680} h={720} t={t} />
      <Brilho t={t} at={W(26, 'bebe')} x={600} y={1300} r={140} />
    </Cam>
  ),
  // 27 só um
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.6} cy={1080}>
      <Escombros t={t} />
      <Pers k={NINA} t={t} x={540} y={1680} h={720} movs={[['parado', t0]]} over={{ maoD: [60, -230], maoE: [-50, -220], pupila: [0.3, 0.6], boca: 'sorriso' }} seed={7} />
      <BebeColo x={560} y={1680} h={720} t={t} />
      <Numero t={t} at={W(27, 'um')} x={540} y={720} n="1" cor="#e9e3d6" />
    </Cam>
  ),
  // 28 o único resgate da vida dela
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1150}>
      <Escombros t={t} />
      <Pers k={NINA} t={t} x={360} y={1680} h={700} movs={[['parado', t0]]} over={{ maoD: [120, -200], boca: 'sorriso', olhoFeliz: true }} seed={7} />
      <Pers k={MAE_BEBE} t={t} x={760} y={1700} h={680} movs={[['parado', t0]]} over={{ maoD: [60, -230], maoE: [-50, -220], boca: 'triste', lagrima: 1 }} seed={9} flip />
      <BebeColo x={740} y={1700} h={680} t={t} />
    </Cam>
  ),
  // 29 porque ela não voltou de lá
  ({ t, t0, t1 }) => {
    const v = W(29, 'voltou');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1200}>
        <Escombros t={t} poeira={clamp((t - v + 0.4) / 0.6) * (1 - clamp((t - v - 0.8) / 0.8))} />
        {t > v + 0.6 && <Svg><g transform="translate(540 1520) rotate(-12)"><path d="M-90 30 C-90 -80 90 -80 90 30 z" fill="#f2c94c" stroke="#1a1520" strokeWidth={5} /><rect x={-120} y={24} width={240} height={20} rx={8} fill="#f2c94c" stroke="#1a1520" strokeWidth={4} /></g><path d="M600 1540 L1000 1400 L1000 1520 z" fill="#fff6c8" opacity={0.15} /></Svg>}
      </Cam>
    );
  },
  // 30 no velório, quase ninguém apareceu
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1150}>
      <Velorio t={t} />
      <Pers k={MAE_NINA} t={t} x={230} y={1700} h={640} movs={[['chorar', t0]]} seed={6} />
    </Cam>
  ),
  // 31 a mãe do bebê abriu a mãozinha do filho para todo mundo ver
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1150}>
      <Velorio t={t} />
      <Pers k={MAE_NINA} t={t} x={200} y={1700} h={620} movs={[['parado', t0]]} over={{ lagrima: 1, sobrTriste: true, boca: 'triste', pupila: [0.8, 0] }} seed={6} />
      <Pers k={MAE_BEBE} t={t} x={760} y={1700} h={680} movs={[['parado', t0]]} over={{ maoD: [60, -230], maoE: [-50, -220], sobrTriste: true, boca: 'sorriso' }} seed={9} flip />
      <BebeColo x={740} y={1700} h={680} t={t} olho />
      {t > W(31, 'maozinha') - 0.2 && <Svg><g transform={`translate(640 ${1700 - 680 * 0.56})`}><circle r={22} fill="#e2b48c" stroke="#1a1520" strokeWidth={4} />{[-14, -5, 5, 14].map((d) => <rect key={d} x={d - 4} y={-46} width={8} height={26} rx={4} fill="#e2b48c" stroke="#1a1520" strokeWidth={3} />)}</g></Svg>}
      <Pop t={t} at={W(31, 'maozinha')} x={640} y={820}><Placa texto="?" bg="#f2c94c" size={70} /></Pop>
    </Cam>
  ),
  // 32 o número dele era maior que o do Rafael
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={960}>
      <Svg><rect width={1080} height={1920} fill="#2a2440" /><Palma x={540} y={1000} s={1.5} pele="#e2b48c" numero="1.000.001" t={t} brilho={clamp((t - W(32, 'maior')) / 0.4)} dedos={0.75} /></Svg>
      <Pop t={t} at={W(32, 'rafael')} x={540} y={420}><Placa texto="1.000.000 + 1" bg="#f2c94c" size={60} /></Pop>
    </Cam>
  ),
  // 33 o número nunca errou
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.35} cy={980}>
      <Svg><rect width={1080} height={1920} fill="#2a2440" /><Palma x={540} y={1000} s={1.3} pele={MORENA} numero="1" t={t} brilho={1} dedos={0.75} /></Svg>
    </Cam>
  ),
  // 34 ele só nunca disse como
  ({ t, t0, t1 }) => {
    const ult = TL.WORDS[TL.WORDS.length - 1].t1;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1150}>
        <Quartel t={t} />
        <Noite k={0.25} />
        <Pers k={NINA} t={t} x={540} y={1760} h={760} movs={[['parado', t0]]} over={{ boca: 'sorriso', pupila: [0, -0.2] }} seed={7} op={0.85} />
        {t > ult + 0.6 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp((t - ult - 0.6) / 0.6) }} />}
      </Cam>
    );
  },
];

const comVinheta = (cs: Cena[]): Cena[] => cs.map((C) => (p: P) => <>{C(p)}<Vinheta forca={0.4} /></>);
// ---------- Efeitos sonoros (biblioteca do projeto + sintetizados em public/sfx-palma) ----------
const ini = (i: number) => (i === 0 ? 0 : i >= TL.LINES.length ? TL.END : W(i, 0));
const sfx = (): Sfx[] => {
  const amb = (f: string, de: number, ate: number, vol: number): Sfx => [f, ini(de), vol, ini(ate + 1) - ini(de) + 0.3, true];
  return [
    // berçário e a palma
    ['sfx-farol/caixinha.mp3', 0, 0.35, ini(4)],
    ['sfx-eleven/brilho.mp3', W(1, 'vidas'), 0.45],
    ['sfx-eleven/desliga.mp3', W(2, 'defeito') - 0.1, 0.5],
    ['sfx-eleven/whoosh.mp3', W(3, 'melhor') - 0.1, 0.4],
    ['sfx-eleven/whoosh.mp3', W(3, 'pior') - 0.1, 0.4],
    // Rafael: o milhão, a festa, o fotógrafo
    ['sfx-q4/revelacao.mp3', W(4, 'milhao') - 0.3, 0.5, 3],
    amb('sfx-flutua/torcida.mp3', 5, 6, 0.3),
    ['sfx-palma/cameras.mp3', W(5, 'fotografar') - 0.3, 0.55, 3],
    ['sfx-farol/sino.mp3', W(6, 'mudar'), 0.35, 2.5],
    // Nina: o um, a visita, a escola
    ['sfx-farol/caixinha.mp3', ini(7), 0.3, ini(9) - ini(7)],
    ['sfx-casarao/batida.mp3', ini(9) + 0.1, 0.45, 2],
    amb('sfx-flutua/murmurio.mp3', 10, 12, 0.25),
    ['sfx-flutua/risada.mp3', W(10, 'menina'), 0.4, 2.5],
    ['sfx-flutua/risada.mp3', W(12, 'estudar'), 0.5, 3],
    // estudando à noite
    ['sfx-q9/relogio.mp3', ini(13), 0.45, ini(14) - ini(13), true],
    ['sfx-q9/caneta.mp3', ini(13) + 0.2, 0.5, 2],
    // bombeira
    ['sfx-q4/sirenes.mp3', W(14, 'bombeira') - 0.4, 0.4, 2.2],
    ['sfx-eleven/brilho.mp3', W(14, 'bombeira'), 0.4],
    // Rafael rico, prédios, um milhão de compradores
    ['sfx-palma/kaching.mp3', W(15, 'rico') - 0.1, 0.55, 1.2],
    ['sfx-palma/cameras.mp3', ini(15) + 0.4, 0.4, 3],
    ['sfx-q4/broca.mp3', ini(16), 0.25, ini(17) - ini(16), true],
    ['sfx-palma/contador.mp3', W(17, 'milhao') - 0.3, 0.55, 1.6],
    ['sfx-flutua/torcida.mp3', W(17, 'milhao') + 1, 0.3, 2],
    // vinte anos depois: chuva, prédios caindo
    amb('sfx-q9/chuva-mar.mp3', 18, 21, 0.45),
    ['sfx-q9/trovao.mp3', ini(18) + 0.3, 0.45, 4],
    ...[[19, 'desabou'], [20, 'segundo'], [21, 'terceiro']].map(([l, w]): Sfx[] => [
      ['sfx-palma/racha.mp3', W(l as number, w as string) - 0.5, 0.55, 2],
      ['sfx-eleven/boom.mp3', W(l as number, w as string) + 0.2, 0.55],
    ]).reduce((a, b) => a.concat(b), [] as Sfx[]),
    // o concreto e o milhão de vidas
    ['sfx-eleven/drone.mp3', ini(22), 0.25, ini(25) - ini(22)],
    ['sfx-q4/sirenes.mp3', ini(23), 0.35, ini(24) - ini(23)],
    ['sfx-eleven/susto.mp3', W(24, 'errado'), 0.45],
    // a Nina nos escombros
    amb('sfx-q9/chuva-mar.mp3', 25, 29, 0.35),
    ['sfx-q9/passos-molhados.mp3', ini(25) + 0.3, 0.5, 3],
    ['sfx-eleven/coracao.mp3', ini(25), 0.35, ini(27) - ini(25)],
    ['sfx-eleven/brilho.mp3', W(26, 'bebe'), 0.45],
    ['sfx-farol/caixinha.mp3', ini(27), 0.3, ini(29) - ini(27)],
    ['sfx-palma/racha.mp3', W(29, 'voltou') - 0.6, 0.5, 2],
    ['sfx-eleven/boom.mp3', W(29, 'voltou') - 0.1, 0.55],
    // velório e o número final
    amb('sfx-farol/coro.mp3', 30, 31, 0.25),
    ['sfx-farol/sino.mp3', ini(30) + 0.2, 0.35, 3],
    ['sfx-palma/contador.mp3', W(32, 'maior') - 0.6, 0.5, 1.6],
    ['sfx-q4/revelacao.mp3', W(32, 'rafael') - 0.4, 0.5, 3],
    ['sfx-eleven/brilho.mp3', ini(33), 0.5],
    ['sfx-farol/caixinha.mp3', ini(34), 0.35, TL.END - ini(34)],
  ];
};
export const NumeroPalma = () => <FilmeMad tl={TL} cenas={comVinheta(CENAS)} voz="voz.mp3" sfx={sfx()} ganhoSfx={0.33} />;
export const DURACAO_PALMA = TL.END;
