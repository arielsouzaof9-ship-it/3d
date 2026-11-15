// "Depois do Silêncio — Episódio 3: Pegadas de Lama" com os PERSONAGENS MAD ARTICULADOS + efeitos sonoros (sem narração por enquanto).
import { CSSProperties } from 'react';
import { Svg } from './cenarios';
import { Viatura } from './cenarios-assalto';
import { Vinheta } from './cenarios-ilha';
import { CidadeParada, Corredor, EstradaCapital, RadioPortatil } from './cenarios-silencio';
import { Bueiro, Pedreira, Telhado } from './cenarios-silencio2';
import { AlgemaAberta, Barraca, clamp, EscadaIncendio, Lona, MarcasPneu, Mato, PegadasLama, Recado } from './cenarios-silencio3';
import { Cam, Placa, Pop } from './FiosBrancos';
import { Ator, Mov } from './FiosBrancosArticulado';
import { Cena, FilmeMad, P, Sfx } from './FilmeMad';
import { Pose } from './Rig';
import { TL_SILENCIO3 as TL } from './timeline-silencio3';

// ---------- Elenco ----------
const DAVI = { tipo: 'adulto', pele: '#c98a5a', roupa: '#c8b48a', calca: '#2a3a5a', cabelo: 'curto', corCabelo: '#2a1a12', barba: true, corBarba: '#3a2a1a', chapeu: 'quepe', corChapeu: '#2a3a5a', gravata: '#2a3a5a', sapato: '#1a1a1e' };
const MARINA = { tipo: 'adulto', pele: '#e2b48c', roupa: '#2f5fa8', calca: '#3a3a4a', cabelo: 'longo', corCabelo: '#5a3a22', sapato: '#1a1a1e' };
const TOMAS = { tipo: 'crianca', pele: '#d8a070', roupa: '#2f8acf', calca: '#3a3a4a', cabelo: 'curto', corCabelo: '#2a1a12', sapato: '#f2f2f2' };
const LEANDRO = { tipo: 'adulto', pele: '#f0c8a0', roupa: '#c8b48a', calca: '#2a3a5a', cabelo: 'curto', corCabelo: '#1a1a1a', chapeu: 'quepe', corChapeu: '#2a3a5a', gravata: '#2a3a5a', bigode: true, corBigode: '#1a1a1a', sapato: '#1a1a1e' };
const TIAO = { tipo: 'adulto', pele: '#e2b48c', roupa: '#6a5a3a', calca: '#4a4a3a', cabelo: 'longo', corCabelo: '#6a5a4a', barba: true, corBarba: '#6a5a4a', colete: '#4a3a22', sapato: '#3a2a1a' };
const JONAS = { tipo: 'adulto', pele: '#7a4b30', roupa: '#e5484d', calca: '#2c3346', cabelo: 'curto', corCabelo: '#120c08', chapeu: 'bone', corChapeu: '#e5484d', sapato: '#f2f2f2' };
const CIDA = { tipo: 'idoso', pele: '#b9805a', roupa: '#f4f4f4', saia: '#8ab0c8', cabelo: 'coque', corCabelo: '#d6d6d6', oculos: true, sapato: '#f4f4f4' };
const BIA = { tipo: 'crianca', pele: '#f6e3d3', roupa: '#f2c94c', calca: '#2f5fa8', cabelo: 'trancas', corCabelo: '#7a3a1a', sardas: true, sapato: '#e5484d' };

// ---------- Atalhos ----------
type A = { k: object; t: number; x: number; y: number; h?: number; movs: Mov[]; over?: Partial<Pose> | ((p: Pose) => Partial<Pose>); seed?: number; flip?: boolean; op?: number; style?: CSSProperties };
const Pers = ({ op = 1, style, ...a }: A) => <Ator {...a} style={{ opacity: op, ...style }} />;
const W = TL.W;
const ini = (i: number) => (i === 0 ? 0 : i >= TL.LINES.length ? TL.END : W(i, 0));
const andando = (t: number, t0: number, x0: number, v: number) => x0 + v * Math.max(0, t - t0);
const Escuro = ({ k = 0.35, cor = '#05060c' }: { k?: number; cor?: string }) => <div style={{ position: 'absolute', inset: 0, background: cor, opacity: k, pointerEvents: 'none' }} />;
const Sepia = ({ k = 0.5 }: { k?: number }) => <div style={{ position: 'absolute', inset: 0, background: '#8a6a3a', mixBlendMode: 'multiply', opacity: k, pointerEvents: 'none' }} />;
const Luz = ({ x, y, r = 360, cor = '#ffb84a', op = 0.25 }: { x: number; y: number; r?: number; cor?: string; op?: number }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(${cor}, transparent 70%)`, opacity: op, pointerEvents: 'none' }} />
);
const Nome = ({ t, at, x, y, n }: { t: number; at: number; x: number; y: number; n: string }) => (
  <Pop t={t} at={at} x={x} y={y}><div style={{ background: '#f4efe0', color: '#1a1520', fontFamily: 'Arial Black', fontSize: 36, padding: '6px 18px', borderRadius: 10, border: '4px solid #1a1520', transform: 'rotate(-3deg)', whiteSpace: 'nowrap' }}>{n}</div></Pop>
);
const Amanhecer = ({ k = 1 }: { k?: number }) => <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#f2a86a, transparent 60%)', opacity: 0.45 * k, mixBlendMode: 'screen', pointerEvents: 'none' }} />;
// Arco nas costas do Tião (x, y = ombro).
const Arco = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <Svg><g transform={`translate(${x} ${y}) rotate(20) scale(${s})`}><path d="M0 -200 Q-90 0 0 200" stroke="#6b4224" strokeWidth={14} fill="none" strokeLinecap="round" /><path d="M0 -200 V200" stroke="#e8e2d0" strokeWidth={3} /><rect x={30} y={-160} width={36} height={200} rx={10} fill="#5a3a22" stroke="#1a1520" strokeWidth={4} />{[40, 52].map((dx) => <path key={dx} d={`M${dx} -160 v-50 l-6 -10 l6 -6 l6 6 l-6 10`} stroke="#c8452e" strokeWidth={4} fill="none" />)}</g></Svg>
);
const PortaAberta = () => <Svg><rect x={60} y={1100} width={100} height={150} fill="#0a0a0e" /><path d="M160 1100 l50 -20 v190 l-50 -20" fill="#7a6a5a" stroke="#1a1520" strokeWidth={4} /></Svg>;

// ---------- Cenas (uma por frase) ----------
const CENAS: Cena[] = [
  // 0 naquela noite, na pedreira, ninguém dormiu
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1} cy={1300}>
      <Pedreira t={t} />
      {[[DAVI, 300], [MARINA, 470], [CIDA, 640], [JONAS, 800], [BIA, 940]].map(([k, x], i) => <Pers key={i} k={k as object} t={t} x={x as number} y={1780 + (i % 2) * 30} h={i === 4 ? 400 : 520} movs={[['sentar', t0]]} over={{ olho: 1, pupila: [0, -0.3], sobr: 0.4 }} seed={i + 1} flip={i > 2} />)}
      <Pers k={LEANDRO} t={t} x={160} y={1620} h={520} movs={[['parado', t0]]} over={{ pupila: [1, 0], boca: 'neutra' }} seed={8} style={{ filter: 'brightness(0.55)' }} />
    </Cam>
  ),
  // 1 o Tomás dormiu no colo, segurando a camisa, com medo de eu sumir
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.6} cx={500} cy={1350}>
      <Pedreira t={t} />
      <Pers k={DAVI} t={t} x={520} y={1760} h={640} movs={[['sentar', t0]]} over={{ maoE: [-40, -230], maoD: [60, -260], frenteE: true, boca: 'sorriso', sobrTriste: true, sobr: 0.5, pupila: [0, 1] }} seed={1} />
      <Pers k={TOMAS} t={t} x={540} y={1770} h={380} movs={[['cochilar', t0]]} over={{ maoD: [-30, -250], frenteD: true }} seed={7} />
      <Luz x={540} y={1500} r={300} cor="#ff9a3a" op={0.25} />
    </Cam>
  ),
  // 2 a Marina contou: o Leandro tirou os dois da cidade
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1300}>
      <Pedreira t={t} />
      <Pers k={MARINA} t={t} x={340} y={1760} h={620} movs={[['sentarFalar', t0]]} seed={6} />
      <Pers k={DAVI} t={t} x={720} y={1760} h={640} movs={[['sentar', t0]]} over={{ pupila: [-1, 0] }} seed={1} flip />
      <Pers k={LEANDRO} t={t} x={540} y={1560} h={460} movs={[['parado', t0]]} over={{ pupila: [0, 0], boca: 'neutra' }} seed={8} op={clamp((t - W(2, 'leandro') + 0.4) / 0.5)} style={{ filter: 'brightness(0.6)' }} />
    </Cam>
  ),
  // 3 "ele disse que foi ao hospital, que viu você..." (lembrança em sépia)
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1150}>
      <Corredor t={t} pisca={0} />
      <Pers k={LEANDRO} t={t} x={andando(t, t0, 560, -40)} y={1700} h={640} movs={[['andar', t0, 2], ['parado', t0 + 2], ['nao', W(3, 'fazer') - 0.6, 1.2]]} over={{ x: 0, boca: 'neutra', sobr: -0.4, pupila: [-1, 0] }} seed={8} />
      <Sepia />
    </Cam>
  ),
  // 4 ao amanhecer, chamei o Seu Aurélio no rádio: só chiado
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.35} cy={1350}>
      <Pedreira t={t} />
      <Amanhecer />
      <Pers k={{ ...DAVI, item: 'celular' }} t={t} x={540} y={1760} h={680} movs={[['telefone', t0]]} over={{ sobrTriste: true, sobr: 0.6, boca: 'neutra' }} seed={1} />
      <Pop t={t} at={W(4, 'chiado') - 0.2} x={540} y={1000}><Placa texto="...chhhh..." bg="#fff6c8" size={46} /></Pop>
    </Cam>
  ),
  // 5 um homem com um arco nas costas: o Tião, irmão do Rui
  ({ t, t0, t1 }) => {
    const x = Math.min(660, andando(t, t0, 1180, -260));
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1300}>
        <Pedreira t={t} />
        <Amanhecer />
        <Arco x={x + 50} y={1320} s={1.1} />
        <Pers k={TIAO} t={t} x={x} y={1760} h={680} movs={[['andar', t0, 2], ['parado', t0 + 2]]} over={{ x: 0, boca: 'neutra', sobr: -0.6 }} seed={9} flip />
        {[[DAVI, 200], [JONAS, 360]].map(([k, xx], i) => <Pers key={i} k={k as object} t={t} x={xx as number} y={1780} h={600} movs={[['parado', t0]]} over={{ pupila: [1, 0], olho: 1.15 }} seed={i + 1} />)}
        <Nome t={t} at={W(5, 'tiao') - 0.1} x={660} y={980} n="TIÃO, IRMÃO DO RUI" />
      </Cam>
    );
  },
  // 6 "Cadê o meu irmão?" ninguém respondeu; ele entendeu sozinho
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.6} cx={600} cy={1250}>
      <Pedreira t={t} />
      <Amanhecer />
      <Arco x={650} y={1320} s={1.1} />
      <Pers k={TIAO} t={t} x={600} y={1760} h={700} movs={[['bravo', t0], ['parado', W(6, 'sozinho') - 0.6]]} over={t > W(6, 'sozinho') - 0.6 ? { boca: 'triste', sobrTriste: true, sobr: 0.8, pupila: [0, 1] } : { boca: 'aberta', sobr: -0.8 }} seed={9} />
      <Pop t={t} at={W(6, 'irmao') - 0.3} x={600} y={850}><Placa texto="CADÊ O MEU IRMÃO?" bg="#fff" size={40} /></Pop>
    </Cam>
  ),
  // 7 vou voltar para buscar o Rui; o Tião e o Jonas vão junto
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1300}>
      <Pedreira t={t} />
      <Amanhecer />
      <Pers k={DAVI} t={t} x={300} y={1760} h={660} movs={[['parado', t0], ['apontar', W(7, 'voltar') - 0.4, 1.2]]} over={{ sobr: -0.4 }} seed={1} />
      <Arco x={600} y={1330} />
      <Pers k={TIAO} t={t} x={560} y={1760} h={640} movs={[['parado', t0], ['sim', W(7, 'tiao') - 0.2, 1]]} seed={9} flip />
      <Pers k={JONAS} t={t} x={820} y={1760} h={620} movs={[['parado', t0], ['joinha', W(7, 'jonas') - 0.3]]} over={{ boca: 'sorriso' }} seed={3} flip />
    </Cam>
  ),
  // 8 o Leandro me segura pelo braço
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.35} cy={1300}>
      <Pedreira t={t} />
      <Amanhecer k={0.6} />
      <Pers k={DAVI} t={t} x={360} y={1760} h={680} movs={[['parado', t0]]} over={{ pupila: [1, 0], sobr: -0.3 }} seed={1} />
      <Pers k={LEANDRO} t={t} x={720} y={1760} h={680} movs={[['parado', t0]]} over={{ maoE: [-200, -300], boca: 'aberta', sobr: 0.6, sobrTriste: true, suor: 1 }} seed={8} flip />
    </Cam>
  ),
  // 9 eu tinha deixado um homem algemado num telhado; precisava voltar
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={1250}>
      <Telhado t={t} chuva={1} />
      <Sepia k={0.45} />
      <Svg><circle cx={500} cy={1340} r={16} fill="none" stroke="#c9ccd4" strokeWidth={8} /></Svg>
      <Pop t={t} at={W(9, 'algemado') - 0.3} x={500} y={1240}><Placa texto="RUI" bg="#fff" size={44} /></Pop>
      <Pers k={DAVI} t={t} x={540} y={1840} h={760} movs={[['parado', t0]]} over={{ sobr: -0.5, boca: 'neutra', pupila: [0, -0.5] }} seed={1} op={0.95} />
    </Cam>
  ),
  // 10 entramos pelo bueiro e subimos a escada do mercado em silêncio
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={1150}>
      <Bueiro t={t} grade={0} luzFundo={0.3} />
      {[[DAVI, 0], [TIAO, 1], [JONAS, 2]].map(([k, i]) => <Pers key={i as number} k={{ ...(k as object), item: i === 0 ? 'lanterna' : undefined }} t={t} x={andando(t, t0, 200 + (i as number) * 190, 40)} y={1740 + ((i as number) % 2) * 30} h={560} movs={[['andar', t0]]} over={{ x: 0, boca: 'neutra' }} seed={(i as number) + 1} />)}
      <Pop t={t} at={W(10, 'silencio') - 0.3} x={540} y={700}><Placa texto="shhh..." bg="#f4efe0" size={44} /></Pop>
    </Cam>
  ),
  // 11 lá em cima, a porta do telhado estava aberta
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1250}>
      <Telhado t={t} />
      <PortaAberta />
      <Svg><EscadaIncendio /></Svg>
      {[[DAVI, 0], [TIAO, 1], [JONAS, 2]].map(([k, i]) => <Pers key={i as number} k={k as object} t={t} x={andando(t, t0 + (i as number) * 0.4, 110, 120)} y={1560 + (i as number) * 70} h={520} movs={[['andar', t0]]} over={{ x: 0, olho: 1.15 }} seed={(i as number) + 1} op={clamp((t - t0 - (i as number) * 0.4) / 0.4)} />)}
    </Cam>
  ),
  // 12 a algema pendurada no cano, aberta, com a chave no buraco
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={2.2} z1={2.6} cx={520} cy={1300}>
      <Telhado t={t} />
      <Svg><AlgemaAberta t={t} x={500} y={1280} s={1.2} /></Svg>
      <Pop t={t} at={W(12, 'chave') - 0.2} x={560} y={1450}><Placa texto="ABERTA" bg="#fff" size={26} /></Pop>
    </Cam>
  ),
  // 13 ele tinha conseguido pegar a chave
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1250}>
      <Telhado t={t} />
      <PortaAberta />
      <Svg><AlgemaAberta t={t} x={500} y={1280} /><EscadaIncendio /></Svg>
      <Pers k={DAVI} t={t} x={300} y={1760} h={660} movs={[['parado', t0]]} over={{ boca: 'sorriso', lagrima: 0.6, sobrTriste: true, sobr: 0.5 }} seed={1} />
      <Pers k={JONAS} t={t} x={760} y={1760} h={620} movs={[['parado', t0], ['ombros', t0 + 0.5]]} over={{ boca: 'o' }} seed={3} flip />
    </Cam>
  ),
  // 14 pegadas de lama até a escada de incêndio
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.25} cx={680} cy={1350}>
      <Telhado t={t} />
      <Svg><AlgemaAberta t={t} x={500} y={1280} /><EscadaIncendio /></Svg>
      <PegadasLama t={t} de={W(14, 'pegadas') - 0.4} x0={520} y0={1520} x1={1010} y1={1300} n={9} />
    </Cam>
  ),
  // 15 na caixa d'água, escrito com carvão: "Vocês me deixaram. Eu vou atrás."
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={2} z1={2.3} cx={800} cy={1090}>
      <Telhado t={t} />
      <Svg><Recado k={clamp((t - W(15, 'carvao') + 0.3) / 1.2)} x={800} y={1060} /></Svg>
    </Cam>
  ),
  // 16 o Tião passou a mão nas letras e sorriu: "esse é o meu irmão"
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.35} cx={700} cy={1250}>
      <Telhado t={t} />
      <Svg><Recado x={800} y={1060} /></Svg>
      <Arco x={590} y={1330} />
      <Pers k={TIAO} t={t} x={560} y={1760} h={680} movs={[['parado', t0]]} over={{ maoD: [230, -560], boca: t > W(16, 'irmao') - 0.6 ? 'sorriso' : 'neutra', pupila: [1, -0.6] }} seed={9} />
    </Cam>
  ),
  // 17 na rua, o caminhão de mudança tinha sumido
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1300}>
      <CidadeParada t={t} grande onibus={false} />
      <Svg><rect x={380} y={1360} width={340} height={200} fill="none" stroke="#f2c94c" strokeWidth={6} strokeDasharray="20 14" /></Svg>
      {[[DAVI, 260], [TIAO, 540], [JONAS, 800]].map(([k, x], i) => <Pers key={i} k={k as object} t={t} x={x as number} y={1800} h={600} movs={[['parado', t0], ['olharLados', W(17, 'sumido') - 0.4]]} over={{ olho: 1.25, boca: 'o' }} seed={i + 1} />)}
      <Pop t={t} at={W(17, 'sumido') - 0.2} x={550} y={1240}><Placa texto="?" bg="#fff" size={80} /></Pop>
    </Cam>
  ),
  // 18 só marcas de pneu na lama, indo para a pedreira
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={1350}>
      <CidadeParada t={t} grande onibus={false} />
      <MarcasPneu />
      <Pop t={t} at={W(18, 'pedreira') - 0.3} x={560} y={1050}><Placa texto="→ PEDREIRA" bg="#1e6a3a" fg="#fff" size={48} /></Pop>
    </Cam>
  ),
  // 19 voltamos a pé, a noite inteira, pelo mato
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1300}>
      <Mato t={t} />
      {[[DAVI, 0], [TIAO, 1], [JONAS, 2]].map(([k, i]) => <Pers key={i as number} k={{ ...(k as object), item: i === 0 ? 'lanterna' : undefined }} t={t} x={andando(t, t0, 300 + (i as number) * 200, 30)} y={1640 + (i as number) * 70} h={420 + (i as number) * 40} movs={[['andar', t0]]} over={{ x: 0, sobrTriste: true, sobr: 0.4 }} seed={(i as number) + 1} />)}
    </Cam>
  ),
  // 20 no acampamento, todos acordados; um lento tinha aparecido na beira do lago
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1250}>
      <Pedreira t={t} />
      <Svg><Lona x={860} y={1100} s={0.55} /></Svg>
      {[[MARINA, 300], [CIDA, 480], [BIA, 640], [TOMAS, 760]].map(([k, x], i) => <Pers key={i} k={k as object} t={t} x={x as number} y={1780} h={i >= 2 ? 400 : 560} movs={[['parado', t0]]} over={{ pupila: [1, -0.5], olho: 1.2, boca: 'o' }} seed={i + 5} />)}
      <Pop t={t} at={W(20, 'lago') - 0.3} x={860} y={950}><Placa texto="BEIRA DO LAGO" bg="#5a6a4a" fg="#e8f0d8" size={34} /></Pop>
    </Cam>
  ),
  // 21 o Leandro resolveu, sozinho, sem fazer barulho
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.6} z1={1.8} cx={820} cy={1150}>
      <Pedreira t={t} />
      <Svg><Lona x={860} y={1100} s={0.55} /></Svg>
      <Pers k={LEANDRO} t={t} x={760} y={1300} h={440} movs={[['parado', t0]]} over={{ maoD: [40, -200], maoE: [-40, -200], frenteD: true, frenteE: true, boca: 'neutra', pupila: [1, 0.5] }} seed={8} />
    </Cam>
  ),
  // 22 mais tarde, fui buscar o rádio na barraca dele
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cx={620} cy={1300}>
      <Pedreira t={t} />
      <Pers k={DAVI} t={t} x={andando(t, t0, 300, 120)} y={1780} h={600} movs={[['andar', t0]]} over={{ x: 0 }} seed={1} />
      <Luz x={900} y={1320} r={140} cor="#ffcf7a" op={0.5} />
    </Cam>
  ),
  // 23 ele estava de costas, falando baixinho no aparelho (sombra na lona)
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <Barraca t={t} radio={1} sombra={1} />
      <Pop t={t} at={W(23, 'baixinho') - 0.2} x={760} y={600}><Placa texto="psss..." bg="#f4efe0" size={40} /></Pop>
    </Cam>
  ),
  // 24 "Ele voltou. Ninguém sabe que fui eu na blitz." (lampejo da blitz)
  ({ t, t0, t1 }) => {
    const bl = W(24, 'blitz') - 0.3;
    return t > bl && t < bl + 1.2 ? (
      <Cam t={t} t0={bl} t1={bl + 1.2} z0={1.2} z1={1.3} cy={1300}>
        <EstradaCapital t={t} />
        <Svg><Viatura x={760} y={1560} t={t} s={1.1} flip /></Svg>
        <Pers k={LEANDRO} t={t} x={600} y={1760} h={640} movs={[['parado', bl]]} over={{ maoD: [120, -360], boca: 'dentes', sobr: -1 }} seed={8} />
        <Sepia k={0.6} />
        <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: clamp(1 - (t - bl) / 0.3) * 0.8 }} />
      </Cam>
    ) : (
      <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.5} cy={1300}>
        <Barraca t={t} radio={1} />
        <Pers k={{ ...LEANDRO, item: 'celular' }} t={t} x={540} y={1760} h={720} movs={[['telefone', t0]]} over={{ boca: 'neutra', suor: 1, sobr: -0.5, pupila: [-1, 0] }} seed={8} />
      </Cam>
    );
  },
  // 25 eu fiquei parado na porta da barraca, sem respirar
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.7} cy={1250}>
      <Pedreira t={t} />
      <Escuro k={0.3} />
      <Pers k={DAVI} t={t} x={540} y={1760} h={720} movs={[['parado', t0]]} over={{ olho: 1.35, boca: 'neutra', suor: 1, sobr: 0.8, pupila: [0, 0] }} seed={1} />
      <Luz x={540} y={1200} r={360} cor="#ffcf7a" op={0.2} />
    </Cam>
  ),
  // 26 a voz no rádio: "Então resolve isso, Leandro. Antes que ele lembre."
  ({ t, t0, t1 }) => {
    const ult = TL.WORDS[TL.WORDS.length - 1].t1;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.25} cy={960}>
        <Barraca t={t} radio={1} />
        <Escuro k={0.55} />
        <Svg><RadioPortatil x={540} y={980} s={2} t={t} fala={1} /></Svg>
        <Svg><rect x={300} y={1100} width={480} height={0} /></Svg>
        <Pop t={t} at={W(26, 'resolve') - 0.3} x={540} y={420}><Placa texto="ANTES QUE ELE LEMBRE" bg="#c22a2a" fg="#fff" size={44} /></Pop>
        {t > ult + 0.8 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp((t - ult - 0.8) / 0.8) }} />}
      </Cam>
    );
  },
];

const comVinheta = (cs: Cena[]): Cena[] => cs.map((C) => (p: P) => <>{C(p)}<Vinheta forca={0.5} /></>);

// ---------- Efeitos sonoros ----------
const sfx = (): Sfx[] => {
  const amb = (f: string, de: number, ate: number, vol: number): Sfx => [f, ini(de), vol, ini(ate + 1) - ini(de) + 0.3, true];
  return [
    // a noite na pedreira
    amb('sfx-monitor/fogueira.mp3', 0, 2, 0.3),
    amb('sfx-monitor/grilos.mp3', 0, 2, 0.08),
    ['sfx-farol/caixinha.mp3', ini(1), 0.2, ini(3) - ini(1)],
    ['sfx-silencio/luz.mp3', ini(3), 0.15, ini(4) - ini(3)],
    ['sfx-farol/passos.mp3', ini(3), 0.3, 2],
    // amanhecer e o rádio
    ['sfx-flutua/passarinho.mp3', ini(4), 0.3, ini(9) - ini(4), true],
    ['sfx-silencio/bipe.mp3', ini(4) + 0.3, 0.4],
    ['sfx-silencio/estatica.mp3', ini(4) + 0.6, 0.35, ini(5) - ini(4)],
    ['sfx-farol/passos.mp3', ini(5), 0.45, 2.2],
    ['sfx-eleven/susto.mp3', W(6, 'irmao') - 0.2, 0.3],
    ['sfx-eleven/coracao.mp3', ini(8), 0.25, ini(10) - ini(8)],
    ['sfx-q4/algemas.mp3', W(9, 'algemado') - 0.3, 0.4, 1.2],
    // bueiro, mercado, telhado
    ['sfx-monitor/pingos.mp3', ini(10), 0.4, ini(11) - ini(10), true],
    ['sfx-lagartixa/borbulha.mp3', ini(10), 0.2, ini(11) - ini(10), true],
    ['sfx-farol/passos.mp3', ini(10) + 0.5, 0.35, 3],
    amb('sfx-silencio/vento.mp3', 11, 16, 0.3),
    ['sfx-casarao/porta.mp3', ini(11), 0.45, 2.5],
    ['sfx-eleven/drone.mp3', ini(11), 0.3, ini(14) - ini(11)],
    ['sfx-q4/algemas.mp3', W(12, 'algema') - 0.2, 0.5, 1.2],
    ['sfx-eleven/brilho.mp3', W(12, 'chave') - 0.1, 0.35],
    ['sfx-q9/passos-molhados.mp3', W(14, 'pegadas') - 0.4, 0.45, 2.5],
    ['sfx-q9/caneta.mp3', W(15, 'carvao') - 0.3, 0.5, 2],
    ['sfx-eleven/susto.mp3', W(15, 'atras') - 0.2, 0.4],
    ['sfx-silencio/corvos.mp3', ini(16), 0.3, 3],
    // a rua e o caminhão sumido
    amb('sfx-silencio/vento.mp3', 17, 18, 0.35),
    ['sfx-eleven/boom.mp3', W(17, 'sumido') - 0.1, 0.4],
    ['sfx-silencio/gemidos.mp3', ini(18) + 0.5, 0.25, 2],
    // o mato à noite
    amb('sfx-monitor/grilos.mp3', 19, 19, 0.14),
    ['sfx-farol/passos.mp3', ini(19), 0.4, ini(20) - ini(19), true],
    // de volta ao acampamento
    amb('sfx-monitor/fogueira.mp3', 20, 23, 0.25),
    amb('sfx-monitor/lago.mp3', 20, 22, 0.25),
    ['sfx-flutua/murmurio.mp3', ini(20), 0.2, ini(21) - ini(20)],
    ['sfx-eleven/coracao.mp3', ini(21), 0.25, ini(22) - ini(21)],
    ['sfx-farol/passos.mp3', ini(22), 0.35, 2.5],
    // a barraca e o rádio
    ['sfx-silencio/estatica.mp3', ini(23), 0.3, TL.END - ini(23), true],
    ['sfx-eleven/drone.mp3', ini(23), 0.3, TL.END - ini(23)],
    ['sfx-silencio/tiro.mp3', W(24, 'blitz') - 0.25, 0.45, 1.5],
    ['sfx-silencio/zumbido.mp3', W(24, 'blitz'), 0.25, 1.5],
    ['sfx-eleven/coracao.mp3', ini(25), 0.4, TL.END - ini(25)],
    ['sfx-silencio/bipe.mp3', ini(26) - 0.2, 0.45],
    ['sfx-eleven/boom.mp3', TL.WORDS[TL.WORDS.length - 1].t1 + 0.3, 0.55],
  ];
};

export const DepoisDoSilencio3 = () => <FilmeMad tl={TL} cenas={comVinheta(CENAS)} voz={TL.COM_VOZ ? 'voz-silencio3.mp3' : undefined} sfx={sfx()} ganhoSfx={TL.COM_VOZ ? 0.65 : 0.5} />;
export const DURACAO_SILENCIO3 = TL.END;
