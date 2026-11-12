// "Os Espelhos do Casarão": terror de casa assombrada com os PERSONAGENS MAD ARTICULADOS. Só efeitos sonoros (sem narração).
import { CSSProperties, ReactNode } from 'react';
import { Svg } from './cenarios';
import { CasaraoFora, CHAO_C, clamp, CorredorC, Escada, Espelho, FotoFamilia, Igreja, Quarto, Relogio333, Rosas, Sala } from './cenarios-casarao';
import { Vinheta } from './cenarios-ilha';
import { Balao, Cam, Placa, Pop } from './FiosBrancos';
import { Ator, Mov } from './FiosBrancosArticulado';
import { Cena, FilmeMad, P, Sfx } from './FilmeMad';
import { Pose } from './Rig';
import { TL_ESPELHOS as TL } from './timeline-espelhos';

// ---------- Elenco ----------
const DAVI = { tipo: 'crianca', pele: '#f0c8a0', roupa: '#2f5fa8', calca: '#c9a86a', cabelo: 'curto', corCabelo: '#6b3e1f', sardas: true, sapato: '#3a2418' };
const CLARINHA = { tipo: 'crianca', pele: '#f6e3d3', roupa: '#f28fb0', saia: '#f28fb0', cabelo: 'trancas', corCabelo: '#3a2416', sapato: '#d1495b' };
const MAE = { tipo: 'adulto', pele: '#f6e3d3', roupa: '#d8a0d0', saia: '#5a3a6a', cabelo: 'longo', corCabelo: '#3a2416', sapato: '#3a2418' };
const MAE_NOIVA = { ...MAE, pele: '#ece2e2', roupa: '#f4f4f4', saia: '#f4f4f4', chapeu: 'veu', corChapeu: '#ffffff', sapato: '#f4f4f4' };
const PAI = { tipo: 'adulto', pele: '#e8c09a', roupa: '#3a6a5a', calca: '#3a3f4a', cabelo: 'curto', corCabelo: '#2a1a12', bigode: true, sapato: '#1a1a1e' };
const ROSA = { tipo: 'adulto', pele: '#8d5a3b', roupa: '#7a2a5a', saia: '#3a2a4a', cabelo: 'coque', corCabelo: '#120c08', brinco: '#f2c94c', sapato: '#1a1a1e' };
const ARTUR = { tipo: 'adulto', corpo: 'magro', pele: '#e2b48c', roupa: '#e8e2d0', calca: '#5a4a3a', colete: '#5a4a3a', gravata: '#3a2a20', cabelo: 'curto', corCabelo: '#9a9aa6', oculos: true, item2: 'livro', sapato: '#2a1a12' };
const LEONOR = { tipo: 'adulto', pele: '#dfe8ee', roupa: '#f4f4f4', saia: '#f4f4f4', chapeu: 'veu', corChapeu: '#ffffff', cabelo: 'longo', corCabelo: '#2a2a30', iris: '#9ab0c0', sapato: '#f4f4f4' };
const CLARA_ADULTA = { tipo: 'adulto', pele: '#f6e3d3', roupa: '#5a8ac0', calca: '#2c3346', cabelo: 'rabo', corCabelo: '#3a2416', sapato: '#1a1a1e' };

// ---------- Atalhos ----------
type A = { k: object; t: number; x: number; y: number; h?: number; movs: Mov[]; over?: Partial<Pose> | ((p: Pose) => Partial<Pose>); seed?: number; flip?: boolean; op?: number; fantasma?: boolean };
const Pers = ({ op = 1, fantasma = false, ...a }: A) => {
  const style: CSSProperties = fantasma ? { opacity: op * 0.72, filter: 'drop-shadow(0 0 18px #bcd4ff) saturate(0.4)' } : { opacity: op };
  return <Ator {...a} style={style} />;
};
const W = TL.W;
const ini = (i: number) => (i === 0 ? 0 : i >= TL.LINES.length ? TL.END : W(i, 0));
const andando = (t: number, t0: number, x0: number, v: number) => x0 + v * Math.max(0, t - t0);
const TRANSE: Partial<Pose> = { olho: 1.2, pupila: [0, 0], boca: 'neutra', sobr: 0 }; // olhar parado, sem piscar
const Sepia = ({ children }: { children: ReactNode }) => <div style={{ position: 'absolute', inset: 0, filter: 'sepia(0.85) contrast(1.05) brightness(0.88)' }}>{children}</div>;
const Escuro = ({ k = 0.35, cor = '#0a0a20' }: { k?: number; cor?: string }) => <div style={{ position: 'absolute', inset: 0, background: cor, opacity: k, pointerEvents: 'none' }} />;
// Relâmpago azul de susto (flash rápido).
const Flash = ({ t, at }: { t: number; at: number }) => { const d = t - at; return d < 0 || d > 0.4 ? null : <div style={{ position: 'absolute', inset: 0, background: '#dfe8ff', opacity: (d < 0.05 ? 0.8 : 0.5) * (1 - d / 0.4) }} />; };
// Espelho grande da sala (sempre no mesmo lugar).
const EG = { x: 620, y: 360, w: 400, h: 760 };
// Banquinho da penteadeira (a mãe senta nele).
const Banquinho = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <Svg><g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-80} y={-96} width={160} height={26} rx={10} fill="#7a2a3a" stroke="#1a1520" strokeWidth={5} /><path d="M-60 -70 L-70 0 M60 -70 L70 0" stroke="#5a3a22" strokeWidth={14} strokeLinecap="round" /></g></Svg>
);

// ---------- Cenas (uma por frase) ----------
const CENAS: Cena[] = [
  // 0 1982, mudança para o casarão
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1200}>
      <CasaraoFora t={t} />
      {[PAI, MAE, DAVI, CLARINHA].map((k, i) => <Pers key={i} k={{ ...k, item: i === 0 ? 'caixa' : undefined }} t={t} x={andando(t, t0, -60 - i * 150, 120)} y={1640 + (i % 2) * 30} h={i < 2 ? 560 : 440} movs={[['andar', t0]]} over={{ x: 0, pupila: [0.4, -0.6] }} seed={i + 1} />)}
      <Pop t={t} at={W(0, 'dois')} x={540} y={360}><Placa texto="OURO PRETO, 1982" bg="#fffaf0" size={56} /></Pop>
    </Cam>
  ),
  // 1 espelhos cobertos com lençóis
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.2} cx={EG.x} cy={760}>
      <Sala t={t} />
      <Espelho {...EG} t={t} coberto={1} />
      <Escuro k={0.25} />
    </Cam>
  ),
  // 2 o pai ri e tira os lençóis
  ({ t, t0, t1 }) => {
    const tir = W(2, 'tirou');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1100}>
        <Sala t={t} />
        <Espelho {...EG} t={t} coberto={1 - clamp((t - tir) / 0.5)} reflexo={<Pers k={PAI} t={t} x={EG.w / 2} y={EG.h + 40} h={500} movs={[['rir', t0]]} seed={2} flip />} />
        <Pers k={PAI} t={t} x={420} y={1650} h={620} movs={[['rir', t0], ['apontar', tir - 0.2, 1.2], ['rir', tir + 1]]} seed={2} />
        <Pers k={DAVI} t={t} x={220} y={1700} h={440} movs={[['nervoso', t0]]} seed={3} />
        <Escuro k={0.2} />
      </Cam>
    );
  },
  // 3 espelho do corredor embaçado, escrito "SAIAM"
  ({ t, t0, t1 }) => {
    const s = W(3, 'saiam');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.18} cy={760}>
        <CorredorC t={t} manha />
        <Espelho x={540} y={380} w={340} h={520} t={t} embacado={clamp((t - W(3, 'embacado') + 0.3) / 0.8)} texto="SAIAM" escrita={clamp((t - s + 0.6) / 0.8)} fundo="#6a6a7a" />
        <Pers k={DAVI} t={t} x={540} y={1760} h={520} movs={[['parado', t0], ['susto', s + 0.2]]} over={{ pupila: [0, -0.8] }} seed={3} />
      </Cam>
    );
  },
  // 4 Clarinha conversa com a moça do espelho
  ({ t, t0, t1 }) => {
    const m = W(4, 'moca');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cx={520} cy={900}>
        <Quarto t={t} tipo="clara" />
        <Espelho x={480} y={420} w={320} h={560} t={t} reflexo={<>
          <Pers k={CLARINHA} t={t} x={180} y={600} h={300} movs={[['falar', t0]]} seed={4} flip />
          <Pers k={LEONOR} t={t} x={90} y={560} h={460} movs={[['parado', t0], ['acenar', m, 2]]} over={{ boca: 'sorriso', sobrTriste: true }} seed={9} fantasma op={clamp((t - m + 0.8) / 0.8)} />
        </>} />
        <Pers k={CLARINHA} t={t} x={480} y={1640} h={480} movs={[['falar', t0], ['acenar', m + 0.3, 1.5], ['falar', m + 1.8]]} seed={4} />
        <Escuro k={0.3} />
      </Cam>
    );
  },
  // 5 3:33, as portas se abrem sozinhas
  ({ t, t0, t1 }) => {
    const r = W(5, 'tres');
    return t < r + 1.6 ? (
      <Cam t={t} t0={t0} t1={r + 1.6} z0={1.1} z1={1.3} cy={820}><Svg><rect width={1080} height={1920} fill="#2a2030" /></Svg><Relogio333 t={t} at={r + 0.4} /><Escuro k={0.2} /></Cam>
    ) : (
      <Cam t={t} t0={r + 1.6} t1={t1} z0={1} z1={1.08} cy={1100}><CorredorC t={t} abertas={clamp((t - W(5, 'portas') + 0.2) / 1.6)} /><Escuro k={0.4} /></Cam>
    );
  },
  // 6 cheiro de rosas murchas
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={1000}>
      <Sala t={t} />
      <Escuro k={0.45} />
      <Svg><g transform="translate(540 1420) scale(2.6) translate(-170 -980)"><Rosas x={170} y={980} t={t} /></g></Svg>
      <Svg>{Array.from({ length: 4 }, (_, i) => { const k = (t * 0.4 + i / 4) % 1; return <path key={i} d={`M${440 + i * 70} ${780 - k * 400} q30 -30 0 -60 q-30 -30 0 -60`} stroke="#c9a0b0" strokeWidth={8} fill="none" opacity={0.5 * (1 - k)} />; })}</Svg>
      <Escuro k={0.25} />
    </Cam>
  ),
  // 7 a mãe se olha no espelho por horas, sem piscar
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cx={540} cy={900}>
      <Quarto t={t} tipo="mae" />
      <Svg><circle cx={900} cy={360} r={80} fill="#fffaf0" stroke="#6b4224" strokeWidth={12} /><path d={`M900 360 l${50 * Math.sin(t * 6)} ${-50 * Math.cos(t * 6)} M900 360 l${32 * Math.sin(t * 0.5)} ${-32 * Math.cos(t * 0.5)}`} stroke="#1a1520" strokeWidth={8} strokeLinecap="round" /></Svg>
      <Espelho x={540} y={480} w={300} h={420} t={t} reflexo={<Pers k={MAE} t={t} x={150} y={560} h={460} movs={[['parado', t0]]} over={TRANSE} seed={5} flip />} />
      <Banquinho x={540} y={1700} s={1.15} />
      <Pers k={MAE} t={t} x={540} y={1700} h={600} movs={[['sentar', t0]]} over={TRANSE} seed={5} />
      <Escuro k={0.3} />
    </Cam>
  ),
  // 8 chamamos o casal Vilela
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1200}>
      <CasaraoFora t={t} noite={1} />
      <Pers k={ROSA} t={t} x={430} y={1680} h={600} movs={[['entrar', t0 + 0.2, 0.6], ['parado', t0 + 0.8], ['olharLados', t0 + 1.4, 2]]} seed={6} />
      <Pers k={ARTUR} t={t} x={680} y={1690} h={620} movs={[['entrar', t0 + 0.4, 0.6], ['parado', t0 + 1]]} over={{ pupila: [-0.4, -0.6] }} seed={7} flip />
      <Pop t={t} at={W(8, 'vilela')} x={540} y={420}><Placa texto="ROSA E ARTUR VILELA" bg="#2a2030" fg="#f2e6d0" size={52} /></Pop>
    </Cam>
  ),
  // 9 1890: Leonor abandonada no altar (lembrança em sépia)
  ({ t, t0, t1 }) => (
    <Sepia>
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={1100}>
        <Igreja t={t} />
        <Pers k={{ ...LEONOR, pele: '#f6e3d3', iris: '#6c9bd2' }} t={t} x={540} y={1500} h={560} movs={[['olharLados', t0], ['chorar', W(9, 'altar') - 0.2]]} seed={9} />
        <Pop t={t} at={W(9, 'noventa')} x={540} y={130}><Placa texto="1890" bg="#fffaf0" size={70} /></Pop>
        <Pop t={t} at={W(9, 'leonor')} x={540} y={820}><Placa texto="LEONOR" bg="#fffaf0" size={50} /></Pop>
      </Cam>
    </Sepia>
  ),
  // 10 ela volta ao casarão e jura
  ({ t, t0, t1 }) => (
    <Sepia>
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={1250}>
        <CasaraoFora t={t} noite={1} sepia />
        <Pers k={{ ...LEONOR, pele: '#f6e3d3', iris: '#6c9bd2' }} t={t} x={540} y={1560} h={600} movs={[['andar', t0, 1.4], ['bravo', t0 + 1.4]]} over={(p) => ({ x: p.x * 0.3, lagrima: 1 })} seed={9} />
        <Pop t={t} at={W(10, 'jurou')} x={540} y={520}><Placa texto={'"NENHUMA FAMÍLIA\nVAI SER FELIZ AQUI"'} bg="#2a1a1a" fg="#f2e6d0" size={50} /></Pop>
      </Cam>
    </Sepia>
  ),
  // 11 Rosa na porta: "Ela não está mais sozinha aí dentro."
  ({ t, t0, t1 }) => {
    const d = W(11, 'disse');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cx={540} cy={900}>
        <Quarto t={t} tipo="mae" />
        <Espelho x={540} y={480} w={300} h={420} t={t} reflexo={<>
          <Pers k={MAE} t={t} x={150} y={560} h={460} movs={[['parado', t0]]} over={TRANSE} seed={5} flip />
          <Pers k={LEONOR} t={t} x={150} y={560} h={470} movs={[['parado', t0]]} over={{ ...TRANSE, boca: 'sorriso' }} seed={9} fantasma op={clamp((t - d) / 1)} />
        </>} />
        <Banquinho x={430} y={1700} s={1.15} />
        <Pers k={MAE} t={t} x={430} y={1700} h={600} movs={[['sentar', t0]]} over={TRANSE} seed={5} />
        <Pers k={ROSA} t={t} x={860} y={1720} h={640} movs={[['parado', t0], ['susto', d - 0.4], ['falar', d + 0.4]]} over={{ pupila: [-0.8, -0.2] }} seed={6} flip />
        <Pop t={t} at={d + 0.3} x={600} y={330}><Balao texto="Ela não está sozinha." /></Pop>
        <Flash t={t} at={W(11, 'sozinha')} />
        <Escuro k={0.3} />
      </Cam>
    );
  },
  // 12 3:33, a mãe desce a escada de vestido de noiva
  ({ t, t0, t1 }) => {
    const k = clamp((t - t0) / Math.max(1, t1 - t0));
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={1000}>
        <Escada t={t} />
        <Pers k={MAE_NOIVA} t={t} x={540} y={760 + k * 820} h={380 + k * 300} movs={[['andarNoLugar', t0]]} over={{ ...TRANSE, x: 0 }} seed={5} />
        <Pop t={t} at={t0 + 0.2} x={540} y={170}><Placa texto="3:33" bg="#2a1a1a" fg="#ff6a6a" size={80} /></Pop>
        <Escuro k={0.35} />
      </Cam>
    );
  },
  // 13 segura a Clarinha pela mão e vai para o espelho grande
  ({ t, t0, t1 }) => {
    const x = andando(t, t0, 200, 55);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
        <Sala t={t} />
        <Espelho {...EG} t={t} />
        <Pers k={MAE_NOIVA} t={t} x={x} y={1680} h={640} movs={[['andarNoLugar', t0]]} over={{ ...TRANSE, x: 0, maoD: [110, -150] }} seed={5} />
        <Pers k={CLARINHA} t={t} x={x + 190} y={1700} h={430} movs={[['andarNoLugar', t0]]} over={{ x: 0, maoE: [-90, -170], pupila: [-0.6, -0.6], boca: 'neutra' }} seed={4} />
        <Escuro k={0.4} />
      </Cam>
    );
  },
  // 14 no reflexo, quem segura a mão não é a mãe
  ({ t, t0, t1 }) => {
    const m = W(14, 'mae');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.6} cx={EG.x} cy={760}>
        <Sala t={t} />
        <Espelho {...EG} t={t} reflexo={<>
          <Pers k={CLARINHA} t={t} x={120} y={EG.h + 20} h={360} movs={[['parado', t0]]} over={{ maoD: [90, -170], boca: 'neutra' }} seed={4} flip />
          <Pers k={MAE_NOIVA} t={t} x={270} y={EG.h + 60} h={560} movs={[['parado', t0]]} over={TRANSE} seed={5} flip op={1 - clamp((t - m + 1.2) / 0.6)} />
          <Pers k={LEONOR} t={t} x={270} y={EG.h + 60} h={560} movs={[['parado', t0]]} over={{ ...TRANSE, boca: 'dentes', sobr: -1 }} seed={9} fantasma op={clamp((t - m + 1.2) / 0.6)} />
        </>} />
        <Flash t={t} at={m} />
        <Escuro k={0.3} />
      </Cam>
    );
  },
  // 15 o pai grita, ela nem olha
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1100}>
      <Sala t={t} />
      <Espelho {...EG} t={t} />
      <Pers k={PAI} t={t} x={220} y={1660} h={620} movs={[['aflito', t0], ['bravo', W(15, 'gritou') - 0.2, 1.2]]} over={{ boca: 'aberta', fala: 0.8 }} seed={2} />
      <Pers k={MAE_NOIVA} t={t} x={EG.x} y={1700} h={640} movs={[['parado', t0]]} over={TRANSE} seed={5} />
      <Pers k={CLARINHA} t={t} x={EG.x + 200} y={1720} h={430} movs={[['nervoso', t0]]} seed={4} />
      <Pop t={t} at={W(15, 'gritou')} x={330} y={520}><Balao texto="HELENA!" /></Pop>
      <Escuro k={0.4} />
    </Cam>
  ),
  // 16 eu levanto a foto de família na frente do rosto dela
  ({ t, t0, t1 }) => {
    const f = W(16, 'foto');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1000}>
        <Sala t={t} />
        <Pers k={MAE_NOIVA} t={t} x={720} y={1720} h={680} movs={[['parado', t0]]} over={{ ...TRANSE, pupila: [-0.6, 0.2] }} seed={5} />
        <Pers k={DAVI} t={t} x={330} y={1740} h={500} movs={[['parado', t0], ['segurar', f - 0.4]]} over={{ pupila: [0.8, -0.4], boca: 'neutra' }} seed={3} />
        {t > f - 0.2 && <FotoFamilia x={330} y={1440 - 40 * clamp((t - f + 0.2) / 0.4)} s={0.9} rot={-4} />}
        <Escuro k={0.35} />
      </Cam>
    );
  },
  // 17 Rosa: "Helena, essa é a sua família. Olha para eles."
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.2} cy={1000}>
      <Sala t={t} />
      <Pers k={MAE_NOIVA} t={t} x={560} y={1720} h={680} movs={[['parado', t0]]} over={{ ...TRANSE, pupila: [0.2, 0.3] }} seed={5} />
      <Pers k={ROSA} t={t} x={860} y={1720} h={640} movs={[['falar', t0]]} over={{ maoE: [-120, -250], sobrTriste: true }} seed={6} flip />
      <FotoFamilia x={300} y={1260} s={0.9} rot={-4} />
      <Pop t={t} at={W(17, 'familia') - 0.4} x={540} y={420}><Balao texto="Olha para eles!" /></Pop>
      <Escuro k={0.3} />
    </Cam>
  ),
  // 18 a mãe olha para a foto e chora (o véu cai)
  ({ t, t0, t1 }) => {
    const c = W(18, 'chorou');
    const volta = clamp((t - t0 - 0.6) / 0.8);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.45} cx={540} cy={900}>
        <Sala t={t} />
        <Pers k={volta > 0.5 ? { ...MAE_NOIVA, chapeu: undefined, pele: MAE.pele } : MAE_NOIVA} t={t} x={540} y={1560} h={760} movs={[['parado', t0], ['chorar', c - 0.2]]} over={volta < 0.5 ? TRANSE : { pupila: [-0.6, 0.4] }} seed={5} />
        <FotoFamilia x={250} y={1080} s={0.8} rot={-6} />
        <Escuro k={0.25 - 0.1 * volta} />
      </Cam>
    );
  },
  // 19 o espelho racha de cima a baixo
  ({ t, t0, t1 }) => {
    const r = W(19, 'rachou');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.35} cx={EG.x} cy={760}>
        <Sala t={t} />
        <Espelho {...EG} t={t} rachado={clamp((t - r + 0.1) / 0.9)} reflexo={<Pers k={LEONOR} t={t} x={EG.w / 2} y={EG.h + 60} h={560} movs={[['susto', r]]} over={{ boca: 'o' }} seed={9} fantasma op={1 - clamp((t - r - 0.4) / 0.8)} />} />
        <Flash t={t} at={r} />
        <Escuro k={0.3} />
      </Cam>
    );
  },
  // 20 o cheiro de rosas some, as portas se fecham; amanhece
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1} cy={1100}>
      <CorredorC t={t} abertas={1 - clamp((t - W(20, 'fecharam') + 0.2) / 0.8)} manha={t > W(20, 'fecharam') + 0.6} />
      <Escuro k={t > W(20, 'fecharam') + 0.6 ? 0 : 0.35} />
    </Cam>
  ),
  // 21 hoje: Clarinha adulta não lembra de nada
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <Quarto t={t} hoje noite={false} />
      <Pers k={CLARA_ADULTA} t={t} x={560} y={1700} h={680} movs={[['parado', t0], ['ombros', W(21, 'nada') - 0.3, 1.4]]} over={{ boca: 'sorriso' }} seed={8} />
      <Pop t={t} at={t0 + 0.2} x={540} y={300}><Placa texto="HOJE" bg="#fffaf0" size={70} /></Pop>
    </Cam>
  ),
  // 22 toda noite ela cobre os espelhos com lençóis
  ({ t, t0, t1 }) => {
    const c = W(22, 'cobre');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
        <Quarto t={t} hoje />
        <Espelho x={620} y={420} w={300} h={560} t={t} coberto={clamp((t - c) / 0.9)} fundo="#2a3048" reflexo={<Pers k={CLARA_ADULTA} t={t} x={110} y={640} h={420} movs={[['segurar', c - 0.5]]} seed={8} flip />} />
        <Pers k={CLARA_ADULTA} t={t} x={300} y={1700} h={680} movs={[['parado', t0], ['segurar', c - 0.5, 1.6], ['parado', c + 1.2]]} over={{ pupila: [0.8, -0.4], boca: 'neutra' }} seed={8} />
        <Escuro k={0.3} />
      </Cam>
    );
  },
  // 23 "Para a moça não voltar." — e a mão pálida aparece atrás do lençol
  ({ t, t0, t1 }) => {
    const v = W(23, 'voltar');
    const ult = TL.WORDS[TL.WORDS.length - 1].t1;
    const mao = clamp((t - v - 0.3) / 0.5);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cx={620} cy={800}>
        <Quarto t={t} hoje />
        <Espelho x={620} y={420} w={300} h={560} t={t} coberto={1} fundo="#2a3048" />
        {mao > 0 && <Svg><g opacity={mao} transform="translate(640 700)"><path d="M-40 60 L-44 -10 Q-46 -30 -34 -30 Q-24 -30 -24 -10 L-22 -56 Q-22 -74 -10 -74 Q2 -74 0 -56 L2 -64 Q4 -80 16 -78 Q28 -76 26 -60 L26 -48 Q30 -62 42 -58 Q52 -54 48 -38 L40 60 z" fill="#d8dce0" stroke="#9aa0aa" strokeWidth={4} opacity={0.85} /></g></Svg>}
        <Pers k={CLARA_ADULTA} t={t} x={260} y={1720} h={700} movs={[['falar', t0], ['parado', v + 0.3]]} over={t > v + 0.3 ? { pupila: [0.9, -0.3], boca: 'neutra' } : {}} seed={8} />
        <Pop t={t} at={W(23, 'para')} x={420} y={1180}><Balao texto="Para a moça não voltar." cor="#fff6c8" /></Pop>
        <Escuro k={0.35} />
        {t > ult + 0.6 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp((t - ult - 0.6) / 0.4) }} />}
        {t > ult + 0.8 && <div style={{ position: 'absolute', left: 0, right: 0, top: 880, textAlign: 'center', fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 70, color: '#f2e6d0', letterSpacing: 4, opacity: clamp((t - ult - 0.8) / 0.3) }}>OS ESPELHOS<br />DO CASARÃO</div>}
      </Cam>
    );
  },
];

// ---------- Efeitos sonoros (biblioteca do projeto + sintetizados em public/sfx-casarao) ----------
const sfx = (): Sfx[] => {
  const amb = (f: string, de: number, ate: number, vol: number): Sfx => [f, ini(de), vol, ini(ate + 1) - ini(de) + 0.3, true];
  return [
    amb('sfx-farol/noite-rua.mp3', 0, 0, 0.35),
    ['sfx-farol/passos.mp3', ini(0) + 0.5, 0.4, 3.5],
    amb('sfx-q4/relogios.mp3', 1, 2, 0.25),
    ['sfx-eleven/whoosh.mp3', W(2, 'tirou') - 0.1, 0.6],
    amb('sfx-eleven/drone.mp3', 3, 7, 0.22),
    ['sfx-casarao/vidro-risco.mp3', W(3, 'saiam') - 0.6, 0.5, 1.6],
    ['sfx-eleven/susto.mp3', W(3, 'saiam') + 0.2, 0.5],
    ['sfx-farol/caixinha.mp3', ini(4), 0.45, ini(5) - ini(4)],
    ['sfx-farol/sino.mp3', W(5, 'tres') + 0.4, 0.5, 3],
    ['sfx-casarao/porta.mp3', W(5, 'portas'), 0.6, 3],
    ['sfx-casarao/porta.mp3', W(5, 'portas') + 0.8, 0.5, 3],
    ['sfx-q9/relogio.mp3', ini(7), 0.4, ini(8) - ini(7), true],
    amb('sfx-farol/noite-rua.mp3', 8, 8, 0.3),
    ['sfx-casarao/batida.mp3', ini(8) + 0.1, 0.6, 2],
    amb('sfx-farol/coro.mp3', 9, 10, 0.3),
    ['sfx-farol/sino.mp3', W(9, 'altar'), 0.4, 3],
    ['sfx-eleven/coracao.mp3', ini(11), 0.4, ini(12) - ini(11)],
    ['sfx-eleven/susto.mp3', W(11, 'sozinha'), 0.5],
    ['sfx-farol/sino.mp3', ini(12), 0.5, 3],
    ['sfx-farol/passos.mp3', ini(12) + 0.6, 0.35, 3.8],
    amb('sfx-eleven/drone.mp3', 12, 18, 0.25),
    ['sfx-eleven/coracao.mp3', ini(13), 0.35, ini(15) - ini(13)],
    ['sfx-eleven/boom.mp3', W(14, 'mae'), 0.6],
    ['sfx-eleven/whoosh.mp3', W(15, 'gritou') - 0.1, 0.4],
    ['sfx-eleven/brilho.mp3', W(16, 'foto'), 0.45],
    ['sfx-farol/caixinha.mp3', ini(17), 0.3, ini(19) - ini(17)],
    ['sfx-casarao/vidro.mp3', W(19, 'rachou') - 0.05, 0.7, 3],
    ['sfx-eleven/boom.mp3', W(19, 'rachou'), 0.45],
    ['sfx-casarao/porta-bate.mp3', W(20, 'fecharam') - 0.1, 0.6, 2],
    ['sfx-casarao/porta-bate.mp3', W(20, 'fecharam') + 0.35, 0.5, 2],
    ['sfx-flutua/passarinho.mp3', W(20, 'fecharam') + 0.7, 0.4, ini(22) - W(20, 'fecharam') - 0.7],
    ['sfx-eleven/whoosh.mp3', W(22, 'cobre'), 0.5],
    amb('sfx-eleven/drone.mp3', 22, 23, 0.2),
    ['sfx-farol/caixinha.mp3', W(23, 'voltar') + 0.2, 0.45, 2.5],
    ['sfx-eleven/boom.mp3', W(23, 'voltar') + 0.3, 0.5],
  ];
};

const comVinheta = (cs: Cena[]): Cena[] => cs.map((C) => (p: P) => <>{C(p)}<Vinheta forca={0.55} /></>);
export const OsEspelhos = () => <FilmeMad tl={TL} cenas={comVinheta(CENAS)} voz="voz-espelhos.mp3" sfx={sfx()} ganhoSfx={0.5} />;
export const DURACAO_ESPELHOS = TL.END;

