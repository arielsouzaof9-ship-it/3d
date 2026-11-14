// "Depois do Silêncio" (sobrevivência/terror original) com os PERSONAGENS MAD ARTICULADOS + narração do Will + efeitos sonoros.
import { CSSProperties } from 'react';
import { Svg } from './cenarios';
import { Viatura } from './cenarios-assalto';
import { Bicicleta } from './cenarios-acampamento';
import { Vinheta } from './cenarios-ilha';
import {
  CasaVazia, CidadeParada, clamp, Corredor, Delegacia, EstradaCapital, Gasolina, MolduraTabuas, OnibusDentro, Onibus,
  PortaRefeitorio, QuartoHospital, RadioPortatil, RuaNoite, SalaVela,
} from './cenarios-silencio';
import { Cam, Placa, Pop } from './FiosBrancos';
import { Ator, Mov } from './FiosBrancosArticulado';
import { Cena, FilmeMad, P, Sfx } from './FilmeMad';
import { Pose } from './Rig';
import { TL_SILENCIO as TL } from './timeline-silencio';

// ---------- Elenco ----------
const PELE_DAVI = '#c98a5a';
const DAVI_PACIENTE = { tipo: 'adulto', pele: PELE_DAVI, roupa: '#bcd8e8', calca: '#bcd8e8', cabelo: 'curto', corCabelo: '#2a1a12', barba: true, corBarba: '#3a2a1a', sapato: '#e8e8e8' };
const DAVI = { tipo: 'adulto', pele: PELE_DAVI, roupa: '#c8b48a', calca: '#2a3a5a', cabelo: 'curto', corCabelo: '#2a1a12', barba: true, corBarba: '#3a2a1a', chapeu: 'quepe', corChapeu: '#2a3a5a', gravata: '#2a3a5a', sapato: '#1a1a1e' };
const KAUA = { tipo: 'crianca', pele: '#7a4b30', roupa: '#e5484d', calca: '#2f5fa8', cabelo: 'crespo', corCabelo: '#120c08', sapato: '#f2f2f2' };
const AURELIO = { tipo: 'adulto', pele: '#7a4b30', roupa: '#8a7a5a', calca: '#4a4f3e', cabelo: 'careca', corCabelo: '#9a9a9a', bigode: true, corBigode: '#cfcfcf', oculos: true, sapato: '#3a2a1a' };
const LENTO_PELE = '#9aaa8a';
const LURDES = { tipo: 'adulto', pele: LENTO_PELE, roupa: '#e88aa8', saia: '#e8a0b8', cabelo: 'coque', corCabelo: '#6a6a6a', sapato: '#5a4a3a' };
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
const Flash = ({ t, at, cor = '#fff', d = 0.35 }: { t: number; at: number; cor?: string; d?: number }) => (t > at && t < at + d ? <div style={{ position: 'absolute', inset: 0, background: cor, opacity: 1 - (t - at) / d }} /> : null);
const Luz = ({ x, y, r = 360, cor = '#ffb84a', op = 0.25 }: { x: number; y: number; r?: number; cor?: string; op?: number }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(${cor}, transparent 70%)`, opacity: op, pointerEvents: 'none' }} />
);
const Nome = ({ t, at, x, y, n }: { t: number; at: number; x: number; y: number; n: string }) => (
  <Pop t={t} at={at} x={x} y={y}><div style={{ background: '#f4efe0', color: '#1a1520', fontFamily: 'Arial Black', fontSize: 40, padding: '6px 20px', borderRadius: 10, border: '4px solid #1a1520', transform: 'rotate(-3deg)' }}>{n}</div></Pop>
);
// Lento andando (lento mesmo) de x0 com velocidade v.
const Lento = ({ t, i, x, y, h = 560, t0, flip = false, op = 1 }: { t: number; i: number; x: number; y: number; h?: number; t0: number; flip?: boolean; op?: number }) => (
  <Pers k={lento(i)} t={t * 0.55} x={x} y={y} h={h} movs={[['andar', t0 * 0.55]]} over={{ x: 0, ...POSE_LENTO(t, i) }} seed={i + 70} flip={flip} op={op} />
);
const Pa = ({ x, y, rot = -30, s = 1 }: { x: number; y: number; rot?: number; s?: number }) => (
  <Svg><g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><rect x={-8} y={-260} width={16} height={260} fill="#8a5a32" stroke="#1a1520" strokeWidth={4} /><rect x={-26} y={-280} width={52} height={22} rx={6} fill="#5a3a22" stroke="#1a1520" strokeWidth={4} /><path d="M-50 0 h100 v40 q0 60 -50 80 q-50 -20 -50 -80 z" fill="#9aa0aa" stroke="#1a1520" strokeWidth={5} /></g></Svg>
);
const Estrelas = ({ t, x, y }: { t: number; x: number; y: number }) => (
  <Svg>{[0, 1, 2, 3].map((i) => { const a = t * 4 + (i * Math.PI) / 2; return <path key={i} transform={`translate(${x + Math.cos(a) * 90} ${y + Math.sin(a) * 30})`} d="M0 -18 l5 12 l13 1 l-10 8 l3 13 l-11 -7 l-11 7 l3 -13 l-10 -8 l13 -1 z" fill="#f2c94c" stroke="#1a1520" strokeWidth={2} />; })}</Svg>
);

// ---------- Cenas (uma por frase) ----------
const CENAS: Cena[] = [
  // 0 levei um tiro numa blitz, sexta de manhã
  ({ t, t0, t1 }) => {
    const tiro = W(0, 'tiro') - 0.05;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1250}>
        <EstradaCapital t={t} />
        <Svg><Viatura x={760} y={1560} t={t} s={1.1} flip /></Svg>
        <Svg>{[260, 420, 580].map((x, i) => <g key={x} transform={`translate(${x} ${1700 + i * 20})`}><path d="M-30 0 L0 -90 L30 0 z" fill="#ff7a2a" stroke="#1a1520" strokeWidth={4} /><path d="M-18 -36 h36" stroke="#fff" strokeWidth={8} /></g>)}</Svg>
        <Pers k={{ ...DAVI, item: 'prancheta' }} t={t} x={420} y={1740} h={680} movs={[['parado', t0], ['apontar', t0 + 0.5, 1.2], ['susto', tiro, 0.5], ['deitar', tiro + 0.45]]} seed={1} />
        <Flash t={t} at={tiro} d={0.5} />
        {t > tiro + 0.6 && <Escuro k={clamp((t - tiro - 0.6) / 1.2) * 0.85} />}
      </Cam>
    );
  },
  // 1 acordei no hospital, o mundo tinha acabado
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1150}>
      <QuartoHospital t={t} acorda={clamp((t - t0) / 1.5)} />
      <Pers k={DAVI_PACIENTE} t={t} x={540} y={1360} h={600} movs={[['sentar', t0], ['olharLados', W(1, 'acabado') - 0.3]]} over={{ olho: t < t0 + 0.8 ? 0.15 : 1.1, boca: 'o' }} seed={1} />
      <Escuro k={0.5 * (1 - clamp((t - t0) / 1.2))} />
    </Cam>
  ),
  // 2 flores secas, relógio parado
  ({ t, t0, t1 }) => {
    const rel = W(2, 'relogio') - 0.3;
    return t < rel ? (
      <Cam t={t} t0={t0} t1={rel} z0={1.8} z1={2} cx={940} cy={1180}><QuartoHospital t={t} /></Cam>
    ) : (
      <Cam t={t} t0={rel} t1={t1} z0={2.2} z1={2.5} cx={400} cy={420}><QuartoHospital t={t} /></Cam>
    );
  },
  // 3 corredor vazio, papéis no chão, luz piscando
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1150}>
      <Corredor t={t} />
      <Pers k={DAVI_PACIENTE} t={t} x={andando(t, t0, 380, 30)} y={1760} h={640} movs={[['andar', t0, 2.5], ['olharLados', t0 + 2.5]]} over={{ x: 0, boca: 'o', sobr: 0.6 }} seed={1} />
    </Cam>
  ),
  // 4 porta pichada: "Não abra. Os mortos estão aqui dentro."
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
      <PortaRefeitorio t={t} texto={clamp((t - W(4, 'pichado') + 0.3) / 0.6)} />
      <Pers k={DAVI_PACIENTE} t={t} x={110} y={1820} h={560} movs={[['parado', t0], ['susto', W(4, 'mortos') - 0.3, 1]]} over={{ olho: 1.2, pupila: [1, -0.5] }} seed={1} />
    </Cam>
  ),
  // 5 dedos por baixo da porta; algo batia do outro lado
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.5} z1={1.7} cy={1380}>
      <PortaRefeitorio t={t} dedos={clamp((t - W(5, 'dedos') + 0.4) / 0.5)} bate={t > W(5, 'batia') - 0.3 ? 1 : 0} />
      <Escuro k={0.2} />
    </Cam>
  ),
  // 6 a cidade parada: carros abandonados, ônibus atravessado
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1} cy={1150}>
      <CidadeParada t={t} />
      <Pers k={DAVI_PACIENTE} t={t} x={540} y={1800} h={620} movs={[['parado', t0], ['olharLados', t0 + 0.6]]} over={{ boca: 'o', sobr: 0.7, sobrTriste: true }} seed={1} />
    </Cam>
  ),
  // 7 corri para casa; a porta aberta; a casa vazia
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1150}>
      <CasaVazia t={t} />
      <Pers k={DAVI_PACIENTE} t={t} x={Math.min(560, andando(t, t0, -100, 500))} y={1760} h={640} movs={[['correr', t0, 1.3], ['parado', t0 + 1.3], ['aflito', W(7, 'vazia') - 0.3]]} over={{ x: 0, olho: 1.2 }} seed={1} />
    </Cam>
  ),
  // 8 os álbuns sumiram: estão vivos
  ({ t, t0, t1 }) => {
    const vivos = W(8, 'vivos') - 0.3;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.5} cx={420} cy={1100}>
        <CasaVazia t={t} destaqueAlbum={clamp((t - W(8, 'albuns') + 0.3) / 0.4)} />
        <Pers k={DAVI_PACIENTE} t={t} x={600} y={1760} h={640} movs={[['pensar', t0], ['comemorar', vivos, 1.2], ['parado', vivos + 1.2]]} over={t > vivos ? { lagrima: 1, boca: 'sorriso' } : { pupila: [-1, -0.6] }} seed={1} flip />
        <Pop t={t} at={vivos} x={420} y={760}><Placa texto="ESTÃO VIVOS!" bg="#3aa14a" fg="#fff" size={56} /></Pop>
      </Cam>
    );
  },
  // 9 pancada na cabeça: um menino com uma pá
  ({ t, t0, t1 }) => {
    const pan = W(9, 'pancada') - 0.15;
    const ga = t < pan - 0.4 ? 0 : t < pan ? -120 * ((t - pan + 0.4) / 0.4) : -120 + 150 * clamp((t - pan) / 0.15);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1150}>
        <CasaVazia t={t} />
        <Pers k={DAVI_PACIENTE} t={t} x={600} y={1760} h={640} movs={[['parado', t0], ['deitar', pan + 0.05]]} over={t > pan ? { olho: 0, boca: 'onda' } : {}} seed={1} flip />
        <Pers k={KAUA} t={t} x={260} y={1760} h={460} movs={[['parado', t0], ['bravo', pan - 0.4]]} over={{ maoD: [70, -300], maoE: [40, -300], frenteE: true }} seed={2} />
        <Pa x={330} y={1440} rot={30 + ga} s={0.9} />
        {t > pan && <Estrelas t={t} x={640} y={1500} />}
        <Flash t={t} at={pan} d={0.25} />
        {t > W(9, 'menino') - 0.2 && t < W(9, 'pa') + 0.2 && <Pop t={t} at={W(9, 'menino') - 0.1} x={260} y={1150}><Placa texto="?!" bg="#fff" size={60} /></Pop>}
      </Cam>
    );
  },
  // 10 Kauã e o pai, Seu Aurélio, meu vizinho
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1200}>
      <SalaVela t={t} />
      <Pers k={DAVI_PACIENTE} t={t} x={800} y={1720} h={560} movs={[['sentar', t0]]} over={{ maoE: [-30, -360], frenteE: true, boca: 'o', pergunta: 1 }} seed={1} flip />
      <Pers k={KAUA} t={t} x={180} y={1760} h={460} movs={[['parado', t0], ['ombros', W(10, 'kaua') - 0.2]]} seed={2} />
      <Pa x={110} y={1480} rot={-8} s={0.8} />
      <Pers k={AURELIO} t={t} x={430} y={1760} h={660} movs={[['parado', t0], ['acenar', W(10, 'aurelio') - 0.3, 1.4]]} over={{ boca: 'sorriso' }} seed={3} />
      <Nome t={t} at={W(10, 'kaua') - 0.1} x={180} y={1150} n="KAUÃ" />
      <Nome t={t} at={W(10, 'aurelio') - 0.1} x={430} y={960} n="SEU AURÉLIO" />
    </Cam>
  ),
  // 11 naquela noite, explicaram tudo falando baixinho
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.2} cy={1250}>
      <SalaVela t={t} />
      <Pers k={AURELIO} t={t} x={300} y={1720} h={600} movs={[['sentarFalar', t0]]} over={{ maoD: [40, -300], frenteD: true, boca: 'o' }} seed={3} />
      <Pers k={KAUA} t={t} x={520} y={1740} h={440} movs={[['sentar', t0]]} over={{ pupila: [-1, 0] }} seed={2} />
      <Pers k={DAVI_PACIENTE} t={t} x={800} y={1720} h={580} movs={[['sentar', t0]]} over={{ pupila: [-1, 0], sobr: 0.6 }} seed={1} flip />
      <Pop t={t} at={W(11, 'baixinho') - 0.2} x={300} y={980}><Placa texto="psss..." bg="#f4efe0" size={44} /></Pop>
    </Cam>
  ),
  // 12 andam devagar, não param nunca, seguem qualquer barulho
  ({ t, t0, t1 }) => {
    const bar = W(12, 'barulho') - 0.3;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1300}>
        <RuaNoite t={t} />
        {[0, 1, 2, 3].map((i) => <Lento key={i} t={t} i={i} x={andando(t, t0, [-60, 1150, 200, 900][i], [40, -35, 25, -30][i] * (t > bar ? 1.5 : 1))} y={1420 + i * 90} h={440 + i * 40} t0={t0} flip={i % 2 === 1} />)}
        {t > bar && <Svg><g transform={`translate(${540 + (t - bar) * 60} ${1780}) rotate(${(t - bar) * 300})`}><rect x={-20} y={-30} width={40} height={60} rx={8} fill="#c9ccd4" stroke="#1a1520" strokeWidth={4} /></g></Svg>}
        <Pop t={t} at={bar} x={540} y={1600}><Placa texto="CLANG!" bg="#f2c94c" size={50} /></Pop>
        <Escuro k={0.15} />
      </Cam>
    );
  },
  // 13 quem é mordido: febre, dorme... e acorda lento
  ({ t, t0, t1 }) => {
    const ac = W(13, 'lento') - 0.3;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.5} cy={1000}>
        <Svg><rect width={1080} height={1920} fill="#0c1220" /></Svg>
        <Pers k={t > ac ? lento(6) : { ...lento(6), pele: '#e2b48c' }} t={t} x={540} y={1800} h={900} movs={[['parado', t0]]} over={t > ac ? { olho: 1.25, boca: 'aberta', sobr: -0.3, pupila: [0, 0.6] } : { olho: t > W(13, 'dorme') - 0.2 ? 0 : 0.6, suor: 1, vermelho: 1, boca: 'onda', zzz: t > W(13, 'dorme') - 0.2 ? 1 : 0 }} seed={77} />
        <Pop t={t} at={W(13, 'febre') - 0.1} x={380} y={560}><Placa texto="FEBRE" bg="#e5484d" fg="#fff" size={50} /></Pop>
        <Pop t={t} at={W(13, 'dorme') - 0.1} x={540} y={460}><Placa texto="SONO" bg="#2f5fa8" fg="#fff" size={50} /></Pop>
        <Pop t={t} at={ac} x={700} y={560}><Placa texto="LENTO" bg="#5a6a4a" fg="#e8f0d8" size={50} /></Pop>
        <Flash t={t} at={ac} cor="#9aaa8a" />
      </Cam>
    );
  },
  // 14 a mulher de vestido florido, andando de um lado pro outro, olhando a janela
  ({ t, t0, t1 }) => {
    const x = 540 + 260 * Math.sin((t - t0) * 0.35);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
        <RuaNoite t={t} />
        <Pers k={LURDES} t={t * 0.55} x={x} y={1450} h={560} movs={[['andar', t0 * 0.55]]} over={{ x: 0, ...POSE_LENTO(t, 2), pupila: [0, -0.2] }} seed={80} flip={Math.cos((t - t0) * 0.35) < 0} />
        <MolduraTabuas t={t} />
        <Escuro k={0.1} />
      </Cam>
    );
  },
  // 15 era a Dona Lurdes; toda noite ele chorava
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={1150}>
      <SalaVela t={t} />
      <Pers k={AURELIO} t={t} x={360} y={1720} h={620} movs={[['sentar', t0], ['chorar', W(15, 'chorava') - 0.6]]} over={{ lagrima: 1, sobrTriste: true, sobr: 0.8, boca: 'triste' }} seed={3} />
      <Pers k={KAUA} t={t} x={560} y={1760} h={460} movs={[['parado', t0]]} over={{ maoE: [-120, -220], sobrTriste: true, sobr: 0.7, boca: 'triste' }} seed={2} flip />
      <Pers k={DAVI_PACIENTE} t={t} x={860} y={1740} h={600} movs={[['parado', t0]]} over={{ sobrTriste: true, sobr: 0.6, boca: 'triste', pupila: [-1, 0] }} seed={1} flip />
      <Luz x={240} y={700} r={200} cor="#ffd166" op={0.3} />
      <Nome t={t} at={W(15, 'lurdes') - 0.1} x={240} y={500} n="DONA LURDES" />
    </Cam>
  ),
  // 16 na delegacia: uniforme e rádio
  ({ t, t0, t1 }) => {
    const un = W(16, 'uniforme') - 0.2;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1150}>
        <Delegacia t={t} />
        <Pers k={t > un ? { ...DAVI, item: 'celular' } : DAVI_PACIENTE} t={t} x={420} y={1760} h={680} movs={[['parado', t0], ['comemorar', un, 0.8], ['parado', un + 0.8]]} over={t > un ? { boca: 'sorriso', joinha: t > un + 0.9 ? 2 : 0 } : { pupila: [-1, 0] }} seed={1} />
        <Flash t={t} at={un} d={0.3} />
      </Cam>
    );
  },
  // 17 no rádio, uma gravação: abrigo no Estádio Central
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.6} cx={720} cy={1150}>
      <Delegacia t={t} radio={1} />
      <Pers k={{ ...DAVI, item: 'celular' }} t={t} x={430} y={1760} h={680} movs={[['telefone', t0]]} over={{ olho: 1.2, pupila: [1, 0] }} seed={1} />
      <Pop t={t} at={W(17, 'central') - 0.2} x={700} y={820}><Placa texto="ESTÁDIO CENTRAL" bg="#1e6a3a" fg="#fff" size={34} /></Pop>
    </Cam>
  ),
  // 18 deixa um rádio com o Seu Aurélio; promete chamar ao amanhecer
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1200}>
      <SalaVela t={t} />
      <Pers k={{ ...DAVI, item: t < W(18, 'aurelio') ? 'celular' : undefined }} t={t} x={720} y={1760} h={680} movs={[['parado', t0], ['apontar', W(18, 'prometi') - 0.3, 1.4]]} over={{ boca: 'sorriso' }} seed={1} flip />
      <Pers k={{ ...AURELIO, item: t > W(18, 'aurelio') ? 'celular' : undefined }} t={t} x={340} y={1760} h={640} movs={[['parado', t0], ['sim', W(18, 'amanhecer'), 1.4]]} over={{ boca: 'sorriso', lagrima: 1 }} seed={3} />
      <Pers k={KAUA} t={t} x={150} y={1780} h={440} movs={[['parado', t0], ['acenar', W(18, 'amanhecer') + 0.3]]} seed={2} />
      {t > W(18, 'amanhecer') - 0.3 && <Luz x={800} y={600} r={600} cor="#ffb86a" op={0.35 * clamp((t - W(18, 'amanhecer') + 0.3) / 0.8)} />}
    </Cam>
  ),
  // 19 a viatura ficou sem gasolina; segue de bicicleta
  ({ t, t0, t1 }) => {
    const gas = W(19, 'gasolina') - 0.3, bic = W(19, 'bicicleta') - 0.3;
    const vx = t < gas ? 1200 - (t - t0) * 400 : 1200 - (gas - t0) * 400 - Math.min(80, (t - gas) * 60);
    return t < bic ? (
      <Cam t={t} t0={t0} t1={bic} z0={1} z1={1.06} cy={1250}>
        <EstradaCapital t={t} />
        <Svg><Viatura x={Math.max(420, vx)} y={1620} t={t} s={1.1} /></Svg>
        <Svg><Gasolina x={820} y={600} s={0.9} nivel={t < gas ? 0.2 : Math.max(0, 0.2 - (t - gas) * 0.3)} /></Svg>
      </Cam>
    ) : (
      <Cam t={t} t0={bic} t1={t1} z0={1} z1={1.06} cy={1250}>
        <EstradaCapital t={t} />
        <Svg><Viatura x={260} y={1620} t={0} s={1.1} /></Svg>
        <Svg><Bicicleta x={andando(t, bic, 600, 90)} y={1800} s={1.1} t={t} /></Svg>
        <Pers k={DAVI} t={t} x={andando(t, bic, 600, 90)} y={1700} h={560} movs={[['parado', bic]]} over={{ sentado: 1, maoE: [-60, -200], maoD: [60, -200], boca: 'sorriso' }} seed={1} />
      </Cam>
    );
  },
  // 20 a capital em silêncio... até a corrente estalar
  ({ t, t0, t1 }) => {
    const est = W(20, 'estalou') - 0.25;
    const x = t < est ? andando(t, t0, 300, 70) : andando(est, t0, 300, 70);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1250}>
        <CidadeParada t={t} grande placaEstadio onibus={false} />
        <Svg><Bicicleta x={x} y={1840} s={1.05} t={t < est ? t : est} /></Svg>
        <Pers k={DAVI} t={t} x={x} y={1745} h={540} movs={[['parado', t0], ['susto', est, 1]]} over={{ sentado: 1, maoE: [-60, -200], maoD: [60, -200], olho: t > est ? 1.3 : 1, boca: t > est ? 'o' : 'neutra' }} seed={1} />
        <Pop t={t} at={est} x={x + 120} y={1600}><Placa texto="CLEC!" bg="#fff" size={44} /></Pop>
      </Cam>
    );
  },
  // 21 de todas as ruas ao mesmo tempo, eles começaram a vir
  ({ t, t0, t1 }) => {
    const vir = W(21, 'tempo') - 0.4;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={1300}>
        <CidadeParada t={t} grande placaEstadio onibus={false} />
        {Array.from({ length: 8 }, (_, i) => { const lado = i % 2 ? 1 : -1; const x0 = lado > 0 ? 1000 + (i >> 1) * 30 : 80 - (i >> 1) * 30; return <Lento key={i} t={t} i={i} x={andando(t, vir + (i >> 1) * 0.3, x0, -lado * 55)} y={1330 + (i >> 1) * 90} h={380 + (i >> 1) * 50} t0={vir} flip={lado > 0} op={clamp((t - vir - (i >> 1) * 0.3) / 0.5)} />; })}
        <Pers k={DAVI} t={t} x={540} y={1800} h={600} movs={[['parado', t0], ['olharLados', vir]]} over={{ olho: 1.3, boca: 'o', suor: 1 }} seed={1} />
      </Cam>
    );
  },
  // 22 centenas, devagar, arrastando os pés
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1} cy={1300}>
      <CidadeParada t={t} grande onibus={false} />
      {Array.from({ length: 22 }, (_, i) => { const fila = Math.floor(i / 6), col = i % 6; const h = 260 + fila * 90; return <Lento key={i} t={t} i={i + 10} x={90 + col * 180 + (fila % 2) * 90 + 20 * Math.sin(t * 0.3 + i)} y={1240 + fila * 150 + Math.min(80, (t - t0) * 12)} h={h} t0={t0 - i * 0.3} flip={col % 2 === 1} />; })}
      <Escuro k={0.25} />
      <Pop t={t} at={W(22, 'centenas') - 0.1} x={540} y={520}><Placa texto="CENTENAS" bg="#5a6a4a" fg="#e8f0d8" size={60} /></Pop>
    </Cam>
  ),
  // 23 tranca-se dentro de um ônibus; eles cercam tudo, batendo nos vidros
  ({ t, t0, t1 }) => {
    const cer = W(23, 'cercaram') - 0.3;
    return t < cer ? (
      <Cam t={t} t0={t0} t1={cer} z0={1} z1={1.08} cy={1300}>
        <CidadeParada t={t} grande onibus={false} />
        <Svg><Onibus x={600} y={1560} s={1} cor="#e8a02a" placa="CENTRO" /></Svg>
        <Pers k={DAVI} t={t} x={andando(t, t0, 80, 380)} y={1780} h={520} movs={[['correr', t0]]} over={{ x: 0, olho: 1.3, boca: 'o' }} seed={1} style={{ opacity: andando(t, t0, 80, 380) > 860 ? 0 : 1 }} />
        {[0, 1, 2, 3].map((i) => <Lento key={i} t={t} i={i + 40} x={andando(t, t0, -120 - i * 140, 70)} y={1720 + (i % 2) * 40} h={500} t0={t0} />)}
      </Cam>
    ) : (
      <Cam t={t} t0={cer} t1={t1} z0={1} z1={1.08} cy={1100}>
        <OnibusDentro t={t} cerco={clamp((t - cer) / 1.2)} />
        <Pers k={DAVI} t={t} x={540} y={1640} h={640} movs={[['aflito', cer]]} over={{ suor: 1 }} seed={1} />
      </Cam>
    );
  },
  // 24 o rádio do ônibus chiou; uma voz de menina falou
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={1150}>
      <OnibusDentro t={t} radio={t > W(24, 'chiou') - 0.3 ? 1 : 0} />
      <Pers k={DAVI} t={t} x={300} y={1640} h={620} movs={[['aflito', t0], ['susto', W(24, 'chiou') - 0.3, 1], ['parado', W(24, 'chiou') + 0.7]]} over={{ pupila: [1, 0.5], olho: 1.25, boca: 'o', suor: 1 }} seed={1} />
      <Pop t={t} at={W(24, 'menina') - 0.1} x={700} y={1020}><Placa texto="♪ voz de menina" bg="#fff6c8" size={36} /></Pop>
    </Cam>
  ),
  // 25 "Moço do ônibus. Não abre a porta. Faz exatamente o que eu disser."
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={960}>
      <OnibusDentro t={t} />
      <Escuro k={0.55} />
      <Svg><RadioPortatil x={540} y={980} s={2} t={t} fala={1} /></Svg>
      <Pop t={t} at={W(25, 'porta') - 0.2} x={540} y={420}><Placa texto="NÃO ABRE A PORTA" bg="#c22a2a" fg="#fff" size={52} /></Pop>
    </Cam>
  ),
  // 26 "Qual é o seu nome?" "Davi."
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.6} cy={1420}>
      <OnibusDentro t={t} radio={1} />
      <Pers k={{ ...DAVI, item: 'celular' }} t={t} x={540} y={1760} h={700} movs={[['telefone', t0]]} over={{ boca: t > W(26, 'davi') - 0.2 ? 'aberta' : 'neutra', olho: 1.1, suor: 1 }} seed={1} />
      <Pop t={t} at={W(26, 'nome') - 0.2} x={540} y={1050}><Placa texto="QUAL É O SEU NOME?" bg="#fff6c8" size={40} /></Pop>
    </Cam>
  ),
  // 27 o rádio ficou mudo por um segundo
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.25} cy={960}>
      <OnibusDentro t={t} cerco={1} />
      <Escuro k={0.6} />
      <Svg><RadioPortatil x={540} y={980} s={2} t={t} fala={t > W(27, 'depois') - 0.2 ? 1 : 0} /></Svg>
      <Svg>{t < W(27, 'depois') - 0.2 && Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${200 + ((t * 300 + i * 160) % 700)} ${700 + i * 120} h${60 + i * 10}`} stroke="#9aa0aa" strokeWidth={3} opacity={0.4} />)}</Svg>
    </Cam>
  ),
  // 28 "Davi? A minha mãe fala de um Davi. Ela se chama Marina."
  ({ t, t0, t1 }) => {
    const mar = W(28, 'marina') - 0.2, ult = TL.WORDS[TL.WORDS.length - 1].t1;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.8} cy={1300}>
        <OnibusDentro t={t} radio={1} cerco={1} />
        <Pers k={{ ...DAVI, item: 'celular' }} t={t} x={540} y={1760} h={700} movs={[['telefone', t0]]} over={t > mar ? { olho: 1.35, boca: 'o', lagrima: 1, sobr: 1, sobrTriste: true } : { olho: 1.15, sobr: 0.6 }} seed={1} />
        {t > mar && <Svg><g opacity={clamp((t - mar) / 0.6) * 0.85} transform="translate(540 1000) rotate(-4)"><rect x={-150} y={-110} width={300} height={220} fill="#f4efe0" stroke="#1a1520" strokeWidth={6} /><rect x={-130} y={-90} width={260} height={150} fill="#c8d8e8" />{[[-70, '#c98a5a', 26], [10, '#e2b48c', 26], [80, '#c98a5a', 18]].map(([x, c, r], i) => <g key={i}><circle cx={x as number} cy={-30} r={r as number} fill={c as string} stroke="#1a1520" strokeWidth={3} /><rect x={(x as number) - (r as number)} y={-6} width={(r as number) * 2} height={50} rx={10} fill={['#2a3a5a', '#d1495b', '#2f8acf'][i]} stroke="#1a1520" strokeWidth={3} /></g>)}<text y={92} textAnchor="middle" fontFamily="Georgia" fontSize={22} fill="#5a4a3a">Davi, Marina e Tomás</text></g></Svg>}
        {t > ult + 0.8 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp((t - ult - 0.8) / 0.8) }} />}
      </Cam>
    );
  },
];

const comVinheta = (cs: Cena[]): Cena[] => cs.map((C) => (p: P) => <>{C(p)}<Vinheta forca={0.5} /></>);

// ---------- Efeitos sonoros (biblioteca + sintetizados em public/sfx-silencio) ----------
const sfx = (): Sfx[] => {
  const amb = (f: string, de: number, ate: number, vol: number): Sfx => [f, ini(de), vol, ini(ate + 1) - ini(de) + 0.3, true];
  return [
    // a blitz e o tiro
    ['sfx-q4/sirenes.mp3', 0, 0.2, W(0, 'tiro')],
    ['sfx-silencio/tiro.mp3', W(0, 'tiro') - 0.05, 0.6, 2.5],
    ['sfx-silencio/zumbido.mp3', W(0, 'tiro') + 0.4, 0.4, 2.5],
    ['sfx-eleven/coracao.mp3', W(0, 'manha'), 0.35, ini(1) - W(0, 'manha') + 0.6],
    // hospital
    amb('sfx-silencio/vento.mp3', 1, 2, 0.15),
    ['sfx-q9/relogio.mp3', W(2, 'relogio') - 0.3, 0.35, 0.9],
    ['sfx-farol/passos.mp3', ini(3), 0.35, 3],
    ['sfx-silencio/luz.mp3', ini(3), 0.4, ini(4) - ini(3)],
    ['sfx-q9/papel.mp3', ini(3) + 0.8, 0.3, 1.5],
    ['sfx-eleven/susto.mp3', W(4, 'mortos') - 0.2, 0.4],
    ['sfx-silencio/arranhao.mp3', W(5, 'dedos') - 0.3, 0.5, 3.5],
    ['sfx-casarao/batida.mp3', W(5, 'batia') - 0.2, 0.55, 2],
    ['sfx-silencio/gemidos.mp3', W(5, 'batia') + 0.3, 0.35, 2.5],
    // cidade e casa
    amb('sfx-silencio/vento.mp3', 6, 8, 0.35),
    ['sfx-silencio/corvos.mp3', ini(6) + 0.4, 0.4, 4],
    ['sfx-farol/passos.mp3', ini(7), 0.45, 1.4],
    ['sfx-casarao/porta.mp3', W(7, 'porta') - 0.2, 0.4, 2.5],
    ['sfx-eleven/brilho.mp3', W(8, 'vivos') - 0.2, 0.4],
    ['sfx-silencio/pancada.mp3', W(9, 'pancada') - 0.15, 0.6, 1.5],
    ['sfx-silencio/zumbido.mp3', W(9, 'pancada'), 0.3, 2],
    // a casa do Seu Aurélio, a noite
    amb('sfx-monitor/grilos.mp3', 10, 11, 0.06),
    ['sfx-monitor/fogueira.mp3', ini(10), 0.12, ini(12) - ini(10), true],
    ['sfx-silencio/arrasto.mp3', ini(12), 0.4, ini(13) - ini(12), true],
    ['sfx-silencio/gemidos.mp3', ini(12) + 0.3, 0.35, ini(13) - ini(12)],
    ['sfx-flutua/crac.mp3', W(12, 'barulho') - 0.35, 0.5, 1.5],
    ['sfx-eleven/coracao.mp3', ini(13), 0.3, ini(14) - ini(13)],
    ['sfx-eleven/boom.mp3', W(13, 'lento') - 0.3, 0.45],
    ['sfx-silencio/gemidos.mp3', W(13, 'lento'), 0.4, 1.8],
    ['sfx-silencio/arrasto.mp3', ini(14), 0.3, ini(15) - ini(14), true],
    ['sfx-silencio/gemidos.mp3', ini(14) + 1, 0.22, 2.2],
    ['sfx-farol/caixinha.mp3', ini(15), 0.25, ini(16) - ini(15)],
    // delegacia e rádio
    ['sfx-casarao/porta.mp3', ini(16), 0.3, 2],
    ['sfx-q4/algemas.mp3', W(16, 'uniforme') - 0.1, 0.35, 1.2],
    ['sfx-silencio/bipe.mp3', W(16, 'radio') - 0.1, 0.45],
    ['sfx-silencio/estatica.mp3', ini(17), 0.35, ini(18) - ini(17), true],
    ['sfx-farol/sino.mp3', W(18, 'amanhecer') - 0.2, 0.25, 2.5],
    ['sfx-flutua/passarinho.mp3', W(18, 'amanhecer'), 0.3, ini(19) - W(18, 'amanhecer') + 0.5],
    // estrada e capital
    ['sfx-monitor/kombi.mp3', ini(19), 0.35, W(19, 'gasolina') - ini(19)],
    ['sfx-silencio/motor-morre.mp3', W(19, 'gasolina') - 0.4, 0.5, 3],
    ['sfx-monitor/bicicleta.mp3', W(19, 'bicicleta'), 0.4, 2],
    amb('sfx-silencio/vento.mp3', 20, 20, 0.3),
    ['sfx-monitor/bicicleta.mp3', ini(20), 0.3, W(20, 'estalou') - ini(20)],
    ['sfx-silencio/corrente.mp3', W(20, 'estalou') - 0.25, 0.6, 1.2],
    ['sfx-eleven/drone.mp3', W(20, 'estalou'), 0.3, ini(23) - W(20, 'estalou')],
    // a multidão
    ['sfx-silencio/multidao.mp3', W(21, 'tempo') - 0.4, 0.35, ini(22) - W(21, 'tempo') + 0.4, true],
    ['sfx-silencio/multidao.mp3', ini(22), 0.5, ini(24) - ini(22), true],
    ['sfx-silencio/arrasto.mp3', ini(21), 0.4, ini(24) - ini(21), true],
    ['sfx-eleven/coracao.mp3', ini(21), 0.35, ini(25) - ini(21)],
    ['sfx-farol/passos.mp3', ini(23), 0.5, 1.5],
    ['sfx-casarao/porta-bate.mp3', W(23, 'cercaram') - 0.5, 0.5, 1.5],
    ['sfx-silencio/vidros.mp3', W(23, 'cercaram') - 0.2, 0.5, TL.END - W(23, 'cercaram'), true],
    ['sfx-silencio/multidao.mp3', ini(24), 0.25, TL.END - ini(24), true],
    // o rádio do ônibus
    ['sfx-silencio/estatica.mp3', W(24, 'chiou') - 0.4, 0.45, 1.8],
    ['sfx-eleven/susto.mp3', W(24, 'chiou') - 0.3, 0.3],
    ['sfx-silencio/bipe.mp3', ini(25) - 0.2, 0.4],
    ['sfx-silencio/estatica.mp3', ini(25), 0.12, ini(27) - ini(25), true],
    ['sfx-silencio/bipe.mp3', W(26, 'davi') - 0.4, 0.4],
    ['sfx-eleven/coracao.mp3', ini(27), 0.4, TL.END - ini(27)],
    ['sfx-silencio/bipe.mp3', W(27, 'depois') - 0.3, 0.4],
    ['sfx-eleven/boom.mp3', W(28, 'marina') + 0.4, 0.5],
    ['sfx-farol/coro.mp3', W(28, 'marina') + 0.2, 0.2, TL.END - W(28, 'marina')],
  ];
};

export const DepoisDoSilencio = () => <FilmeMad tl={TL} cenas={comVinheta(CENAS)} voz={TL.COM_VOZ ? 'voz-silencio.mp3' : undefined} sfx={sfx()} ganhoSfx={TL.COM_VOZ ? 0.6 : 0.5} />;
export const DURACAO_SILENCIO = TL.END;
