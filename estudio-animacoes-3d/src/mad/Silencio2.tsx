// "Depois do Silêncio — Episódio 2: A Chuva" com os PERSONAGENS MAD ARTICULADOS + narração do Will + efeitos sonoros.
import { CSSProperties } from 'react';
import { Svg } from './cenarios';
import { Chuva, Relampago, Vinheta } from './cenarios-ilha';
import { CidadeParada, OnibusDentro } from './cenarios-silencio';
import { Alcapao, Bueiro, Caminhao, Chave, clamp, Mercado, Pedreira, RuaDeCima, Telhado } from './cenarios-silencio2';
import { Cam, Placa, Pop } from './FiosBrancos';
import { Ator, Mov } from './FiosBrancosArticulado';
import { Cena, FilmeMad, P, Sfx } from './FilmeMad';
import { Pose } from './Rig';
import { TL_SILENCIO2 as TL } from './timeline-silencio2';

// ---------- Elenco ----------
const DAVI = { tipo: 'adulto', pele: '#c98a5a', roupa: '#c8b48a', calca: '#2a3a5a', cabelo: 'curto', corCabelo: '#2a1a12', barba: true, corBarba: '#3a2a1a', chapeu: 'quepe', corChapeu: '#2a3a5a', gravata: '#2a3a5a', sapato: '#1a1a1e' };
const BIA = { tipo: 'crianca', pele: '#f6e3d3', roupa: '#f2c94c', calca: '#2f5fa8', cabelo: 'trancas', corCabelo: '#7a3a1a', sardas: true, sapato: '#e5484d' };
const JONAS = { tipo: 'adulto', pele: '#7a4b30', roupa: '#e5484d', calca: '#2c3346', cabelo: 'curto', corCabelo: '#120c08', chapeu: 'bone', corChapeu: '#e5484d', sapato: '#f2f2f2' };
const CIDA = { tipo: 'idoso', pele: '#b9805a', roupa: '#f4f4f4', saia: '#8ab0c8', cabelo: 'coque', corCabelo: '#d6d6d6', oculos: true, sapato: '#f4f4f4' };
const RUI = { tipo: 'adulto', pele: '#e2b48c', roupa: '#4a5a3a', calca: '#3a3a3a', cabelo: 'careca', corCabelo: '#6a5a4a', barba: true, corBarba: '#6a5a4a', oculosEscuros: true, sapato: '#2a2a2a' };
const MARINA = { tipo: 'adulto', pele: '#e2b48c', roupa: '#2f5fa8', calca: '#3a3a4a', cabelo: 'longo', corCabelo: '#5a3a22', sapato: '#1a1a1e' };
const TOMAS = { tipo: 'crianca', pele: '#d8a070', roupa: '#2f8acf', calca: '#3a3a4a', cabelo: 'curto', corCabelo: '#2a1a12', sapato: '#f2f2f2' };
const LEANDRO = { tipo: 'adulto', pele: '#f0c8a0', roupa: '#c8b48a', calca: '#2a3a5a', cabelo: 'curto', corCabelo: '#1a1a1a', chapeu: 'quepe', corChapeu: '#2a3a5a', gravata: '#2a3a5a', bigode: true, corBigode: '#1a1a1a', sapato: '#1a1a1e' };
const LAMA = (k: object, q = 1) => (q < 0.5 ? k : { ...k, pele: '#6a5a3a', roupa: '#5a4a2a', calca: '#4a3a22', saia: '#4a3a22', corCabelo: '#3a2a12', corChapeu: '#4a3a22', sapato: '#3a2a12' });
const LENTO_PELE = '#9aaa8a';
const ROUPAS = ['#5a6a7a', '#7a5a4a', '#4a5a4a', '#6a4a5a', '#8a7a5a', '#4a4a5a', '#7a6a4a', '#5a4a6a'];
const CABELOS = ['curto', 'longo', 'careca', 'crespo', 'chanel', 'espetado', 'rabo', 'curto'];
const lento = (i: number) => ({ tipo: i % 5 === 4 ? 'idoso' : 'adulto', pele: LENTO_PELE, roupa: ROUPAS[i % 8], calca: ROUPAS[(i + 3) % 8], cabelo: CABELOS[i % 8], corCabelo: ['#3a3a3a', '#5a4a3a', '#6a6a6a'][i % 3], sapato: '#2a2a2a' });
const POSE_LENTO = (t: number, i: number): Partial<Pose> => ({ maoE: [-60, -290 + 10 * Math.sin(t * 1.3 + i)], maoD: [60, -300 + 10 * Math.sin(t * 1.1 + i)], frenteE: true, frenteD: true, olho: 0.55, boca: 'aberta', sobr: 0.3, pupila: [0, 0.4], cabRot: 8 * Math.sin(t * 0.8 + i) });

// ---------- Atalhos ----------
type A = { k: object; t: number; x: number; y: number; h?: number; movs: Mov[]; over?: Partial<Pose> | ((p: Pose) => Partial<Pose>); seed?: number; flip?: boolean; op?: number; style?: CSSProperties };
const Pers = ({ op = 1, style, ...a }: A) => <Ator {...a} style={{ opacity: op, ...style }} />;
const W = TL.W;
const ini = (i: number) => (i === 0 ? 0 : i >= TL.LINES.length ? TL.END : W(i, 0));
const andando = (t: number, t0: number, x0: number, v: number) => x0 + v * Math.max(0, t - t0);
const Escuro = ({ k = 0.35, cor = '#05060c' }: { k?: number; cor?: string }) => <div style={{ position: 'absolute', inset: 0, background: cor, opacity: k, pointerEvents: 'none' }} />;
const Flash = ({ t, at, cor = '#fff', d = 0.3 }: { t: number; at: number; cor?: string; d?: number }) => (t > at && t < at + d ? <div style={{ position: 'absolute', inset: 0, background: cor, opacity: 0.8 * (1 - (t - at) / d) }} /> : null);
const Luz = ({ x, y, r = 360, cor = '#ffb84a', op = 0.25 }: { x: number; y: number; r?: number; cor?: string; op?: number }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(${cor}, transparent 70%)`, opacity: op, pointerEvents: 'none' }} />
);
const Nome = ({ t, at, x, y, n }: { t: number; at: number; x: number; y: number; n: string }) => (
  <Pop t={t} at={at} x={x} y={y}><div style={{ background: '#f4efe0', color: '#1a1520', fontFamily: 'Arial Black', fontSize: 36, padding: '6px 18px', borderRadius: 10, border: '4px solid #1a1520', transform: 'rotate(-3deg)', whiteSpace: 'nowrap' }}>{n}</div></Pop>
);
const Lento = ({ t, i, x, y, h = 560, t0, flip = false, op = 1, over = {} }: { t: number; i: number; x: number; y: number; h?: number; t0: number; flip?: boolean; op?: number; over?: Partial<Pose> }) => (
  <Pers k={lento(i)} t={t * 0.55} x={x} y={y} h={h} movs={[['andar', t0 * 0.55]]} over={{ x: 0, ...POSE_LENTO(t, i), ...over }} seed={i + 70} flip={flip} op={op} />
);
// Espingarda na mão (x, y = mão), apontando para cima/frente.
const Espingarda = ({ x, y, rot = -30, s = 1, tiro = 0 }: { x: number; y: number; rot?: number; s?: number; tiro?: number }) => (
  <Svg><g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-40} y={-10} width={90} height={26} rx={8} fill="#6b4224" stroke="#1a1520" strokeWidth={4} />
    <rect x={40} y={-8} width={200} height={14} fill="#3a3a40" stroke="#1a1520" strokeWidth={3} /><rect x={60} y={6} width={150} height={10} fill="#4a3424" stroke="#1a1520" strokeWidth={2} />
    {tiro > 0 && <g opacity={tiro}><path d="M240 0 l60 -30 l-20 30 l60 0 l-60 20 l30 30 z" fill="#ffd166" stroke="#ff7a2a" strokeWidth={4} /><circle cx={260} cy={0} r={60} fill="#fff6c8" opacity={0.4} /></g>}
  </g></Svg>
);
const tiroEm = (t: number, ts: number[]) => ts.reduce((a, b) => a + (t > b && t < b + 0.15 ? 1 - (t - b) / 0.15 : 0), 0);
const Gotas = ({ t, x, y, n = 6, w = 120, cor = '#6a5a3a' }: { t: number; x: number; y: number; n?: number; w?: number; cor?: string }) => (
  <Svg>{Array.from({ length: n }, (_, i) => { const k = (t * 1.1 + i / n) % 1; return <ellipse key={i} cx={x - w / 2 + (i / Math.max(1, n - 1)) * w} cy={y + k * 160} rx={7} ry={12} fill={cor} opacity={1 - k} />; })}</Svg>
);

// ---------- Cenas (uma por frase) ----------
const CENAS: Cena[] = [
  // 0 "Davi, olha para baixo. Tem uma tampa no chão do ônibus."
  ({ t, t0, t1 }) => {
    const ab = clamp((t - W(0, 'desce') + 0.3) / 0.6);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={1350}>
        <OnibusDentro t={t} radio={1} cerco={1} />
        <Svg><Alcapao x={760} y={1700} k={ab} s={1.2} /></Svg>
        <Pers k={{ ...DAVI, item: 'celular' }} t={t} x={430} y={1640} h={640} movs={[['telefone', t0]]} over={{ pupila: t > W(0, 'baixo') - 0.2 ? [0.6, 1] : [0, 0], olho: 1.2 }} seed={1} />
        {t > W(0, 'tampa') - 0.2 && <Svg><circle cx={760} cy={1700} r={170} fill="none" stroke="#f2c94c" strokeWidth={8} strokeDasharray="20 14" opacity={0.8} /></Svg>}
      </Cam>
    );
  },
  // 1 desci para o bueiro, no escuro; em cima, os lentos batendo
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1} cy={900}>
      <Bueiro t={t} />
      <Pers k={DAVI} t={t} x={540} y={Math.min(1700, 900 + (t - t0) * 400)} h={600} movs={[['parado', t0]]} over={{ maoE: [-70, -560], maoD: [70, -520], olho: 1.1, pupila: [0, -1] }} seed={1} />
      <Escuro k={0.3} />
    </Cam>
  ),
  // 2 uma lanterna piscou três vezes: a Bia, doze anos, com um rádio
  ({ t, t0, t1 }) => {
    const pis = W(2, 'tres') - 0.6, bia = W(2, 'bia') - 0.3;
    const on = t > pis && t < bia ? (Math.floor((t - pis) / 0.22) % 2 === 0 ? 1 : 0) : t >= bia ? 1 : 0;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={1150}>
        <Bueiro t={t} grade={0} luzFundo={t < bia ? on : 0} />
        {t > bia && <Pers k={{ ...BIA, item: 'celular' }} t={t} x={Math.max(700, andando(t, bia, 560, 80))} y={1720} h={480} movs={[['entrar', bia, 0.5], ['parado', bia + 0.5]]} over={{ boca: 'sorriso', maoE: [-70, -260] }} seed={2} flip />}
        {t > bia && <Luz x={720} y={1400} r={260} cor="#fff3b0" op={0.3} />}
        <Pers k={DAVI} t={t} x={260} y={1760} h={620} movs={[['parado', t0], ['susto', pis + 0.2, 0.8]]} over={{ olho: 1.2, pupila: [1, 0] }} seed={1} />
        <Nome t={t} at={W(2, 'doze') - 0.1} x={720} y={1100} n="BIA, 12 ANOS" />
      </Cam>
    );
  },
  // 3 um mercado fechado com correntes; lá dentro, mais três pessoas
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1} cy={1100}>
      <Mercado t={t} />
      <Pers k={DAVI} t={t} x={andando(t, t0, 120, 60)} y={1760} h={620} movs={[['andar', t0, 2], ['parado', t0 + 2]]} over={{ x: 0 }} seed={1} />
      <Pers k={BIA} t={t} x={andando(t, t0, 280, 60)} y={1780} h={460} movs={[['andar', t0, 2], ['parado', t0 + 2]]} over={{ x: 0 }} seed={2} />
      {[JONAS, CIDA, RUI].map((k, i) => <Pers key={i} k={k} t={t} x={700 + i * 120} y={1700 + i * 20} h={560} movs={[['parado', t0]]} op={clamp((t - W(3, 'tres') + 0.2) / 0.4)} style={{ filter: 'brightness(0.25)' }} seed={i + 3} flip />)}
    </Cam>
  ),
  // 4 Jonas, Dona Cida e Rui, com uma espingarda
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1200}>
      <Mercado t={t} />
      <Pers k={JONAS} t={t} x={190} y={1760} h={620} movs={[['parado', t0], ['acenar', W(4, 'jonas') - 0.3, 1.4]]} over={{ boca: 'sorriso' }} seed={3} />
      <Pers k={CIDA} t={t} x={520} y={1760} h={560} movs={[['parado', t0], ['sim', W(4, 'cida') - 0.2, 1.2]]} over={{ boca: 'sorriso' }} seed={4} />
      <Pers k={RUI} t={t} x={860} y={1760} h={660} movs={[['parado', t0], ['bravo', W(4, 'rui') - 0.2]]} over={{ maoD: [70, -300], maoE: [-30, -300], frenteE: true }} seed={5} flip />
      <Espingarda x={820} y={1460} rot={-150} s={1.1} />
      <Nome t={t} at={W(4, 'jonas') - 0.1} x={190} y={1040} n="JONAS" />
      <Nome t={t} at={W(4, 'cida') - 0.1} x={520} y={1100} n="DONA CIDA" />
      <Nome t={t} at={W(4, 'rui') - 0.1} x={860} y={1000} n="RUI" />
    </Cam>
  ),
  // 5 Bia conta: a Marina me achou; ela e o Tomás estão na pedreira
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1200}>
      <Mercado t={t} />
      <Pers k={BIA} t={t} x={360} y={1780} h={500} movs={[['falar', t0]]} over={{ boca: 'sorriso' }} seed={2} />
      <Pers k={DAVI} t={t} x={760} y={1760} h={640} movs={[['parado', t0]]} over={{ olho: 1.25, boca: 'o', pupila: [-1, 0.2] }} seed={1} flip />
      <Pop t={t} at={W(5, 'pedreira') - 0.3} x={540} y={760}><div style={{ background: '#f4efe0', border: '6px solid #1a1520', borderRadius: 14, padding: 16, transform: 'rotate(-4deg)' }}><svg width={380} height={240}><rect width={380} height={240} fill="#e8dcc0" /><path d="M20 200 Q120 120 200 160 T360 60" stroke="#5a5a62" strokeWidth={10} fill="none" strokeDasharray="20 10" /><path d="M300 40 l40 40 m0 -40 l-40 40" stroke="#c22a2a" strokeWidth={10} /><text x={190} y={230} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#1a1520">PEDREIRA</text><circle cx={40} cy={200} r={12} fill="#2f5fa8" /></svg></div></Pop>
    </Cam>
  ),
  // 6 o Tomás estava vivo; tive que sentar no chão
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.35} cy={1250}>
      <Mercado t={t} />
      <Pers k={DAVI} t={t} x={540} y={1760} h={620} movs={[['parado', t0], ['sentar', W(6, 'sentar') - 0.4]]} over={{ lagrima: 1, boca: 'sorriso', olhoFeliz: t > W(6, 'vivo'), sobrTriste: true }} seed={1} />
      <Pers k={BIA} t={t} x={260} y={1780} h={460} movs={[['parado', t0]]} over={{ boca: 'sorriso', maoD: [80, -200] }} seed={2} />
    </Cam>
  ),
  // 7 o Rui sobe no telhado e atira nos lentos, só por raiva
  ({ t, t0, t1 }) => {
    const ts = [W(7, 'atirar') - 0.1, W(7, 'atirar') + 0.9, W(7, 'raiva') - 0.1, W(7, 'raiva') + 0.8];
    const fl = tiroEm(t, ts);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1250}>
        <Telhado t={t} />
        <Pers k={RUI} t={t} x={420} y={1640} h={680} movs={[['bravo', t0]]} over={{ maoD: [110, -330], maoE: [40, -320], frenteE: true, boca: 'dentes', sobr: -1, vermelho: 1 }} seed={5} />
        <Espingarda x={520} y={1310} rot={-25 - 12 * fl} s={1.3} tiro={fl} />
        {fl > 0.5 && <Flash t={t} at={t - 0.01} cor="#fff6c8" d={0.1} />}
      </Cam>
    );
  },
  // 8 cada tiro chamava mais deles; a rua inteira cheia
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={960}>
      <RuaDeCima t={t} n={0.15 + 0.85 * clamp((t - t0) / Math.max(1, t1 - t0 - 0.5))} />
      <Pop t={t} at={W(8, 'cheia') - 0.2} x={540} y={420}><Placa texto="A RUA INTEIRA" bg="#5a6a4a" fg="#e8f0d8" size={54} /></Pop>
    </Cam>
  ),
  // 9 tiro a espingarda e prendo o Rui com a algema no cano da caixa d'água
  ({ t, t0, t1 }) => {
    const alg = W(9, 'algema') - 0.3;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1250}>
        <Telhado t={t} />
        <Pers k={RUI} t={t} x={t > alg ? 560 : 420} y={1640} h={660} movs={[['bravo', t0]]} over={t > alg ? { maoD: [70, -260], boca: 'dentes', sobr: -1, vermelho: 1 } : { maoD: [110, -330], boca: 'dentes', sobr: -1 }} seed={5} />
        {t > alg && <Svg><circle cx={520 + 0} cy={1400} r={16} fill="none" stroke="#c9ccd4" strokeWidth={8} /><path d="M520 1400 L500 1400" stroke="#c9ccd4" strokeWidth={6} /></Svg>}
        <Pers k={DAVI} t={t} x={260} y={1660} h={660} movs={[['parado', t0], ['apontar', W(9, 'tirei') - 0.2, 1]]} over={{ sobr: -0.6, boca: 'neutra' }} seed={1} />
        <Espingarda x={t > W(9, 'tirei') + 0.3 ? 220 : 520} y={t > W(9, 'tirei') + 0.3 ? 1440 : 1310} rot={t > W(9, 'tirei') + 0.3 ? 100 : -25} s={1.2} />
        <Pop t={t} at={alg + 0.2} x={540} y={1240}><Placa texto="CLIC!" bg="#fff" size={44} /></Pop>
      </Cam>
    );
  },
  // 10 o vidro da frente do mercado começou a rachar
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.45} cy={900}>
      <Mercado t={t} porta={0} lentos={1} rachado={clamp((t - W(10, 'rachar') + 0.6) / 1.4)} />
      <Escuro k={0.15} />
    </Cam>
  ),
  // 11 Dona Cida: não enxergam direito; reconhecem o cheiro de gente viva
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1200}>
      <Mercado t={t} porta={0} lentos={1} rachado={0.6} />
      <Pers k={CIDA} t={t} x={300} y={1760} h={580} movs={[['falar', t0], ['apontar', W(11, 'cheiro') - 0.3, 1.2]]} over={{ maoD: t > W(11, 'cheiro') - 0.3 ? [40, -340] : [64, -150], frenteD: true }} seed={4} />
      {[DAVI, JONAS, BIA].map((k, i) => <Pers key={i} k={k} t={t} x={600 + i * 170} y={1760 + (i === 2 ? 20 : 0)} h={i === 2 ? 460 : 600} movs={[['parado', t0]]} over={{ pupila: [-1, 0], sobr: 0.4 }} seed={i + 1} flip />)}
      <Pop t={t} at={W(11, 'enxergam') - 0.2} x={300} y={980}><Placa texto="👁 ✗" bg="#fff" size={48} /></Pop>
      <Pop t={t} at={W(11, 'cheiro') - 0.2} x={540} y={760}><Placa texto="CHEIRO DE GENTE VIVA" bg="#f2c94c" size={40} /></Pop>
    </Cam>
  ),
  // 12 a coisa mais nojenta da minha vida
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1.3} cy={1300}>
      <Mercado t={t} porta={0} lentos={1} rachado={0.7} lama={1} />
      {[DAVI, JONAS, CIDA, BIA].map((k, i) => <Pers key={i} k={k} t={t} x={200 + i * 230} y={1760} h={i === 3 ? 460 : 580} movs={[['parado', t0]]} over={{ boca: 'onda', olho: 0.7, sobr: 0.7, sobrTriste: true, pupila: [0, 1] }} seed={i + 1} flip={i > 1} />)}
    </Cam>
  ),
  // 13 lama do esgoto no corpo inteiro: cabelo, mãos, rosto
  ({ t, t0, t1 }) => {
    const fases = [W(13, 'lama'), W(13, 'cabelo'), W(13, 'maos'), W(13, 'rosto')];
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1250}>
        <Mercado t={t} porta={0} lentos={1} rachado={0.75} lama={1} />
        {[DAVI, JONAS, CIDA, BIA].map((k, i) => <Pers key={i} k={LAMA(k, t > fases[i] - 0.2 ? 1 : 0)} t={t} x={200 + i * 230} y={1760} h={i === 3 ? 460 : 580} movs={[['parado', t0]]} over={{ boca: 'onda', olho: 0.6, maoE: [-40, -340], maoD: [40, -340], frenteE: true, frenteD: true }} seed={i + 1} flip={i > 1} />)}
        {[0, 1, 2, 3].map((i) => t > fases[i] - 0.2 && <Gotas key={i} t={t + i} x={200 + i * 230} y={1300} n={4} w={90} />)}
      </Cam>
    );
  },
  // 14 saímos pela porta da frente, andando devagar no meio deles
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1300}>
      <CidadeParada t={t} grande onibus={false} />
      {Array.from({ length: 8 }, (_, i) => <Lento key={i} t={t} i={i + 20} x={80 + (i % 4) * 300 + (i >> 2) * 140} y={1300 + (i >> 2) * 120} h={380 + (i >> 2) * 50} t0={t0 - i} flip={i % 2 === 1} />)}
      {[DAVI, JONAS, CIDA, BIA].map((k, i) => <Pers key={i} k={LAMA(k)} t={t * 0.55} x={andando(t, t0, 220 + i * 190, 25)} y={1720 + (i % 2) * 40} h={i === 3 ? 440 : 560} movs={[['andar', t0 * 0.55]]} over={{ x: 0, ...POSE_LENTO(t, i), olho: 1.1, boca: 'neutra', suor: 1 }} seed={i + 1} />)}
      {Array.from({ length: 4 }, (_, i) => <Lento key={`f${i}`} t={t} i={i + 30} x={andando(t, t0, [40, 1040, 380, 720][i], [20, -20, 15, -15][i])} y={1880} h={640} t0={t0} flip={i % 2 === 1} />)}
    </Cam>
  ),
  // 15 um lento parou do meu lado, cheirou meu ombro e seguiu
  ({ t, t0, t1 }) => {
    const par = W(15, 'parou') - 0.3, che = W(15, 'cheirou') - 0.2, seg = W(15, 'frente') - 0.4;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.6} cy={1200}>
        <CidadeParada t={t} grande onibus={false} />
        <Pers k={LAMA(DAVI)} t={t} x={420} y={1760} h={700} movs={[['parado', t0]]} over={{ ...POSE_LENTO(t, 1), olho: 1.3, boca: 'neutra', suor: 1, pupila: [1, 0] }} seed={1} />
        <Pers k={lento(44)} t={t * 0.55} x={t < par ? andando(t, t0, 900, -80) : t < seg ? Math.max(680, 900 - (par - t0) * 80) : Math.max(680, 900 - (par - t0) * 80) - (t - seg) * 80} y={1760} h={720} movs={[['parado', 0]]} over={{ ...POSE_LENTO(t, 3), cabRot: t > che && t < seg ? -20 : 8 * Math.sin(t), incl: t > che && t < seg ? -8 : 0, pupila: [-1, 0] }} seed={74} flip />
        {t > che && t < seg && <Svg>{[0, 1, 2].map((i) => { const k = (t * 2 + i / 3) % 1; return <path key={i} d={`M${620 - k * 60} ${1260 - i * 20} q-10 -10 -20 0`} stroke="#9aaa8a" strokeWidth={5} fill="none" opacity={1 - k} />; })}</Svg>}
      </Cam>
    );
  },
  // 16 faltavam só duas quadras até o caminhão de mudança
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={1200}>
      <CidadeParada t={t} grande onibus={false} />
      <Svg><Caminhao x={560} y={1300} s={0.4} t={t} /></Svg>
      {[DAVI, JONAS, CIDA, BIA].map((k, i) => <Pers key={i} k={LAMA(k)} t={t * 0.55} x={240 + i * 200} y={1780} h={i === 3 ? 440 : 560} movs={[['andar', 0]]} over={{ x: 0, ...POSE_LENTO(t, i), olho: 1, boca: 'neutra' }} seed={i + 1} />)}
      <Pop t={t} at={W(16, 'duas') - 0.2} x={560} y={900}><Placa texto="2 QUADRAS" bg="#f2c94c" size={54} /></Pop>
    </Cam>
  ),
  // 17 foi aí que começou a chover
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1200}>
      <CidadeParada t={t} grande onibus={false} fumaca={0} />
      <Escuro k={0.3} cor="#1a2030" />
      {[DAVI, JONAS, CIDA, BIA].map((k, i) => <Pers key={i} k={LAMA(k)} t={t} x={240 + i * 200} y={1780} h={i === 3 ? 440 : 560} movs={[['parado', t0]]} over={{ pupila: [0, -1], olho: 1.3, boca: 'o' }} seed={i + 1} />)}
      {t > W(17, 'chover') - 0.4 && <Chuva t={t} n={Math.round(60 + 160 * clamp((t - W(17, 'chover') + 0.4) / 1))} op={0.6} />}
      <Relampago t={t} vezes={[W(17, 'chover') - 0.2]} />
    </Cam>
  ),
  // 18 a chuva lava a lama; os lentos viram a cabeça para a gente
  ({ t, t0, t1 }) => {
    const lav = W(18, 'lavando'), vir = W(18, 'virar') - 0.3;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1300}>
        <CidadeParada t={t} grande onibus={false} fumaca={0} />
        <Escuro k={0.3} cor="#1a2030" />
        {Array.from({ length: 6 }, (_, i) => <Lento key={i} t={t} i={i + 20} x={80 + i * 190} y={1380 + (i % 2) * 80} h={420} t0={t0} flip={i > 2} over={t > vir + i * 0.25 ? { pupila: [i > 2 ? -1 : 1, 0.6], cabRot: i > 2 ? -14 : 14, olho: 1.1 } : {}} />)}
        {[DAVI, JONAS, CIDA, BIA].map((k, i) => <Pers key={i} k={LAMA(k, t > lav + i * 0.4 ? 0 : 1)} t={t} x={240 + i * 200} y={1780} h={i === 3 ? 440 : 560} movs={[['parado', t0]]} over={{ olho: 1.3, boca: 'o', suor: 1 }} seed={i + 1} />)}
        <Chuva t={t} n={220} op={0.6} />
        <Relampago t={t} vezes={[vir + 0.2]} />
      </Cam>
    );
  },
  // 19 "Corre!", gritou o Jonas
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.1} cy={1300}>
      <CidadeParada t={t} grande onibus={false} fumaca={0} />
      <Escuro k={0.3} cor="#1a2030" />
      <Pers k={JONAS} t={t} x={540} y={1760} h={700} movs={[['bravo', t0]]} over={{ boca: 'aberta', olho: 1.3, maoD: [90, -360], maoE: [-90, -360] }} seed={3} />
      <Pop t={t} at={W(19, 'corre') - 0.1} x={540} y={760}><Placa texto="CORRE!" bg="#e5484d" fg="#fff" size={90} /></Pop>
      <Chuva t={t} n={220} op={0.6} />
    </Cam>
  ),
  // 20 corremos; o Jonas faz o caminhão pegar na primeira tentativa
  ({ t, t0, t1 }) => {
    const pega = W(20, 'tentativa') - 0.4;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1250}>
        <CidadeParada t={t} grande onibus={false} fumaca={0} />
        <Escuro k={0.3} cor="#1a2030" />
        <Svg><Caminhao x={t > pega ? andando(t, pega + 0.6, 560, 220) : 560} y={1600} s={1} t={t} ligado={t > pega ? 1 : 0} farol={t > pega ? 1 : 0} /></Svg>
        {t < W(20, 'jonas') && [DAVI, CIDA, BIA].map((k, i) => <Pers key={i} k={k} t={t} x={andando(t, t0, -60 - i * 120, 420)} y={1800} h={i === 2 ? 440 : 560} movs={[['correr', t0]]} over={{ x: 0 }} seed={i + 1} />)}
        {Array.from({ length: 5 }, (_, i) => <Lento key={i} t={t} i={i + 50} x={andando(t, t0, -200 - i * 120, 60)} y={1720 + (i % 2) * 60} h={520} t0={t0} />)}
        <Pop t={t} at={pega} x={760} y={1000}><Placa texto="VRUUM!" bg="#f2c94c" size={50} /></Pop>
        <Chuva t={t} n={220} op={0.6} />
      </Cam>
    );
  },
  // 21 do telhado, o Rui gritava pela chave da algema
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.4} cy={1250}>
      <Telhado t={t} chuva={1} />
      <Pers k={RUI} t={t} x={560} y={1640} h={680} movs={[['bravo', t0]]} over={{ maoD: [70, -260], maoE: [-110, -380], boca: 'aberta', olho: 1.3, sobr: 1, sobrTriste: true, suor: 1 }} seed={5} />
      <Svg><circle cx={520} cy={1400} r={16} fill="none" stroke="#c9ccd4" strokeWidth={8} /></Svg>
      <Pop t={t} at={W(21, 'chave') - 0.2} x={760} y={900}><Placa texto="A CHAVE!" bg="#fff" size={56} /></Pop>
      <Chuva t={t} n={200} op={0.55} />
    </Cam>
  ),
  // 22 eu voltei; joguei a chave pela fresta do telhado; não sei se ele pegou
  ({ t, t0, t1 }) => {
    const jo = W(22, 'joguei') - 0.1;
    const k = clamp((t - jo) / 0.9);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1250}>
        <Telhado t={t} chuva={1} />
        <Pers k={RUI} t={t} x={760} y={1640} h={620} movs={[['parado', t0]]} over={{ maoD: [-90, -260], maoE: [-150, -340], boca: 'o', olho: 1.3, pupila: [-1, -0.5] }} seed={5} flip />
        <Pers k={DAVI} t={t} x={200} y={1700} h={600} movs={[['parado', t0], ['apontar', jo - 0.3, 0.8], ['ombros', W(22, 'pegar') - 0.6]]} over={{ sobrTriste: true, sobr: 0.6 }} seed={1} />
        {t > jo && <Svg><Chave x={260 + k * 420} y={1200 - Math.sin(k * Math.PI) * 300 + k * 160} rot={k * 900} s={1.2} /></Svg>}
        {t > W(22, 'pegar') - 0.4 && <Pop t={t} at={W(22, 'pegar') - 0.4} x={540} y={800}><Placa texto="?" bg="#fff" size={90} /></Pop>}
        <Chuva t={t} n={200} op={0.55} />
      </Cam>
    );
  },
  // 23 de noite, a pedreira: fogueiras, barracas, gente de verdade
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1} cy={1250}>
      <Pedreira t={t} />
      <Svg><Caminhao x={andando(t, t0, -300, 200) > 160 ? 160 : andando(t, t0, -300, 200)} y={1560} s={0.6} t={t} farol={1} ligado={1} /></Svg>
      {[0, 1, 2].map((i) => <Pers key={i} k={{ tipo: 'adulto', pele: ['#e2b48c', '#7a4b30', '#f6e3d3'][i], roupa: ['#7b5aa6', '#3aa14a', '#c8452e'][i], calca: '#2c3346', cabelo: ['chanel', 'crespo', 'curto'][i], corCabelo: '#2a1a12', sapato: '#1a1a1e' }} t={t} x={[500, 680, 920][i]} y={1740 + (i % 2) * 40} h={420} movs={[['acenar', t0 + 0.5 + i * 0.3]]} seed={i + 20} flip={i === 2} />)}
      <Pop t={t} at={W(23, 'fogueiras') - 0.1} x={360} y={1300}><Placa texto="🔥" bg="#fff6c8" size={40} /></Pop>
    </Cam>
  ),
  // 24 a Marina larga a panela; o Tomás pula no meu colo
  ({ t, t0, t1 }) => {
    const pan = W(24, 'panela') - 0.3, pulo = W(24, 'colo') - 0.6;
    const kp = clamp((t - pulo) / 0.6);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1250}>
        <Pedreira t={t} />
        <Pers k={MARINA} t={t} x={740} y={1740} h={640} movs={[['parado', t0], ['susto', pan, 0.8], ['aflito', pan + 0.8]]} over={{ lagrima: 1, olho: 1.3, boca: 'o' }} seed={6} flip />
        {t > pan && <Svg><g transform={`translate(${780 + (t - pan) * 40} ${Math.min(1720, 1380 + (t - pan) * 900)}) rotate(${Math.min(90, (t - pan) * 300)})`}><path d="M-50 -30 h100 v40 q0 26 -50 26 q-50 0 -50 -26 z" fill="#3a3a40" stroke="#1a1520" strokeWidth={4} /><path d="M50 -20 h30" stroke="#3a3a40" strokeWidth={8} /></g></Svg>}
        <Pers k={DAVI} t={t} x={300} y={1740} h={660} movs={[['parado', t0], ['comemorar', pulo + 0.3, 1]]} over={{ lagrima: 1, boca: 'sorriso', olhoFeliz: t > pulo + 0.4 }} seed={1} />
        <Pers k={TOMAS} t={t} x={540 - kp * 220} y={1760 - Math.sin(kp * Math.PI) * 260 - kp * 120} h={420} movs={[['correr', t0, pulo - t0], ['pular', pulo]]} over={{ boca: 'riso', lagrima: 1 }} seed={7} flip />
      </Cam>
    );
  },
  // 25 atrás deles, parado, o Sargento Leandro, meu parceiro na blitz
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cx={600} cy={1200}>
      <Pedreira t={t} />
      <Pers k={LEANDRO} t={t} x={700} y={1560} h={560} movs={[['parado', t0]]} over={{ boca: 'neutra', olho: 1.15, sobr: -0.3 }} seed={8} op={clamp((t - t0) / 0.6)} />
      <Pers k={MARINA} t={t} x={300} y={1760} h={640} movs={[['parado', t0]]} over={{ boca: 'sorriso', lagrima: 1 }} seed={6} />
      <Pers k={TOMAS} t={t} x={480} y={1780} h={420} movs={[['parado', t0]]} over={{ boca: 'riso' }} seed={7} />
      <Nome t={t} at={W(25, 'leandro') - 0.1} x={700} y={900} n="SARGENTO LEANDRO" />
    </Cam>
  ),
  // 26 ele contou para todo mundo que me viu morrer
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.65} cx={600} cy={1150}>
      <Pedreira t={t} />
      <Pers k={LEANDRO} t={t} x={600} y={1760} h={760} movs={[['parado', t0]]} over={{ boca: 'neutra', olho: 0.8, sobr: -0.6, pupila: [-1, 0] }} seed={8} />
      {t > W(26, 'morrer') - 0.4 && <><div style={{ position: 'absolute', inset: 0, background: '#8a6a3a', mixBlendMode: 'multiply', opacity: 0.5 }} /><Pop t={t} at={W(26, 'morrer') - 0.4} x={600} y={700}><Placa texto="'ELE MORREU.'" bg="#f4e8d0" size={50} /></Pop></>}
    </Cam>
  ),
  // 27 e, pela cara dele, preferia que fosse verdade
  ({ t, t0, t1 }) => {
    const ult = TL.WORDS[TL.WORDS.length - 1].t1;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.6} z1={2} cx={600} cy={1150}>
        <Pedreira t={t} />
        <Pers k={LEANDRO} t={t} x={600} y={1760} h={760} movs={[['parado', t0]]} over={{ boca: 'triste', olho: 0.7, sobr: -1, pupila: [-1, 0], vermelho: 0.4 }} seed={8} />
        <Luz x={600} y={1300} r={500} cor="#ff7a2a" op={0.25 + 0.05 * Math.sin(t * 9)} />
        {t > ult + 0.6 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp((t - ult - 0.6) / 1) }} />}
      </Cam>
    );
  },
];

const comVinheta = (cs: Cena[]): Cena[] => cs.map((C) => (p: P) => <>{C(p)}<Vinheta forca={0.5} /></>);

// ---------- Efeitos sonoros (bibliotecas do projeto) ----------
const sfx = (): Sfx[] => {
  const amb = (f: string, de: number, ate: number, vol: number): Sfx => [f, ini(de), vol, ini(ate + 1) - ini(de) + 0.3, true];
  const tiros = [W(7, 'atirar') - 0.1, W(7, 'atirar') + 0.9, W(7, 'raiva') - 0.1, W(7, 'raiva') + 0.8];
  return [
    // ônibus e bueiro
    ['sfx-silencio/vidros.mp3', 0, 0.3, ini(1) + 1.5, true],
    ['sfx-silencio/estatica.mp3', 0, 0.15, W(0, 'desce')],
    ['sfx-casarao/porta.mp3', W(0, 'desce') - 0.3, 0.45, 2],
    ['sfx-lagartixa/borbulha.mp3', ini(1), 0.25, ini(3) - ini(1), true],
    ['sfx-monitor/pingos.mp3', ini(1), 0.4, ini(3) - ini(1), true],
    ['sfx-farol/passos.mp3', ini(1) + 0.5, 0.3, 2],
    ...[0, 0.44, 0.88].map((d): Sfx => ['sfx-monitor/clique.mp3', W(2, 'tres') - 0.6 + d, 0.5, 0.5]),
    ['sfx-eleven/brilho.mp3', W(2, 'bia') - 0.2, 0.35],
    // mercado
    ['sfx-q4/algemas.mp3', W(3, 'correntes') - 0.2, 0.35, 1.5],
    ['sfx-silencio/luz.mp3', ini(3), 0.15, ini(7) - ini(3), true],
    ['sfx-farol/caixinha.mp3', ini(5), 0.25, ini(7) - ini(5)],
    ['sfx-eleven/brilho.mp3', W(6, 'vivo') - 0.1, 0.35],
    // telhado e os tiros
    amb('sfx-silencio/vento.mp3', 7, 9, 0.2),
    ...tiros.map((at): Sfx => ['sfx-silencio/tiro.mp3', at, 0.45, 1.5]),
    ['sfx-silencio/multidao.mp3', ini(8), 0.3, ini(10) - ini(8), true],
    ['sfx-silencio/arrasto.mp3', ini(8), 0.25, ini(10) - ini(8), true],
    ['sfx-q4/algemas.mp3', W(9, 'algema') - 0.3, 0.5, 1.2],
    // vidro rachando e o plano
    ['sfx-silencio/vidros.mp3', ini(10), 0.35, ini(14) - ini(10), true],
    ['sfx-casarao/vidro-risco.mp3', W(10, 'rachar') - 0.5, 0.45, 2.5],
    ['sfx-palma/racha.mp3', W(10, 'rachar'), 0.35, 1.5],
    ['sfx-eleven/coracao.mp3', ini(11), 0.25, ini(14) - ini(11)],
    ['sfx-lagartixa/borbulha.mp3', W(13, 'lama') - 0.2, 0.4, 3],
    ['sfx-q9/passos-molhados.mp3', W(13, 'cabelo'), 0.35, 2],
    // no meio deles
    ['sfx-silencio/multidao.mp3', ini(14), 0.25, ini(17) - ini(14), true],
    ['sfx-silencio/arrasto.mp3', ini(14), 0.35, ini(17) - ini(14), true],
    ['sfx-eleven/coracao.mp3', ini(14), 0.35, ini(17) - ini(14)],
    ['sfx-silencio/gemidos.mp3', W(15, 'cheirou') - 0.3, 0.35, 2],
    // a chuva
    ['sfx-q9/trovao.mp3', W(17, 'chover') - 0.3, 0.5, 4],
    ['sfx-q9/chuva-mar.mp3', W(17, 'chover') - 0.2, 0.45, ini(23) - W(17, 'chover'), true],
    ['sfx-silencio/gemidos.mp3', W(18, 'virar') - 0.2, 0.4, 2.5],
    ['sfx-eleven/susto.mp3', W(18, 'virar') - 0.2, 0.35],
    ['sfx-silencio/multidao.mp3', ini(18), 0.25, ini(21) - ini(18), true],
    ['sfx-farol/passos.mp3', ini(20), 0.5, 1.6],
    ['sfx-monitor/partida.mp3', W(20, 'tentativa') - 1.2, 0.35, 1.0],
    ['sfx-monitor/kombi.mp3', W(20, 'tentativa') - 0.3, 0.45, ini(21) - W(20, 'tentativa') + 0.6],
    ['sfx-q9/trovao.mp3', ini(21), 0.35, 3],
    ['sfx-q4/algemas.mp3', ini(21) + 0.4, 0.35, 1.2],
    ['sfx-eleven/whoosh.mp3', W(22, 'joguei') - 0.1, 0.4],
    ['sfx-q4/algemas.mp3', W(22, 'joguei') + 0.9, 0.3, 0.8],
    // a pedreira
    amb('sfx-monitor/fogueira.mp3', 23, 27, 0.25),
    amb('sfx-monitor/grilos.mp3', 23, 27, 0.06),
    ['sfx-flutua/murmurio.mp3', ini(23), 0.2, ini(25) - ini(23)],
    ['sfx-flutua/crac.mp3', W(24, 'panela') - 0.1, 0.4, 1.2],
    ['sfx-eleven/brilho.mp3', W(24, 'colo') - 0.2, 0.35],
    ['sfx-eleven/drone.mp3', ini(25), 0.3, TL.END - ini(25)],
    ['sfx-eleven/coracao.mp3', ini(26), 0.25, TL.END - ini(26)],
    ['sfx-eleven/boom.mp3', TL.WORDS[TL.WORDS.length - 1].t1 + 0.3, 0.5],
  ];
};

export const DepoisDoSilencio2 = () => <FilmeMad tl={TL} cenas={comVinheta(CENAS)} voz={TL.COM_VOZ ? 'voz-silencio2.mp3' : undefined} sfx={sfx()} ganhoSfx={TL.COM_VOZ ? 0.65 : 0.5} />;
export const DURACAO_SILENCIO2 = TL.END;
