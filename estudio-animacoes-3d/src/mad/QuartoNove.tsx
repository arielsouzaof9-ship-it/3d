// "O Quarto Nove": série de suspense em 3 partes com os PERSONAGENS MAD ARTICULADOS.
// Sem narração por enquanto: com public/voz-q9-N.mp3 + palavras-q9.ts preenchido, tudo sincroniza com a fala.
import { ReactNode } from 'react';
import { Svg } from './cenarios';
import {
  Amanhecer, Barco, CeuTempestade, CHAO_I, CHAO_P, Chuva, clamp, Corredor, Cozinha, Desenho, Fogo, HotelFora, IlhaLonge, Jornal, Lanterna,
  Lembranca, Livro, Mar, Pier, Porao, Quarto9, raiosDe, Recepcao, Relampago,
  BarcoFundo, Goteira, Nevoa, OndaFrente, ParedeTabuas, Poeira, Remo, Vinheta,
} from './cenarios-ilha';
import { Balao, Cam, Placa, Pop } from './FiosBrancos';
import { Ator, Mov } from './FiosBrancosArticulado';
import { Cena, FilmeMad, P, Sfx } from './FilmeMad';
import { Pose } from './Rig';
import { TL1, TL2, TL3 } from './timeline-q9';

// ---------- Elenco ----------
const HELENA = { tipo: 'adulto', pele: '#f6e3d3', roupa: '#e8c240', calca: '#2c3346', cabelo: 'chanel', corCabelo: '#3a2416', distintivo: true, cicatriz: true, sapato: '#3a2a2a' };
const TIAO = { tipo: 'idoso', pele: '#e2b48c', roupa: '#2f4f6f', calca: '#3a3f4a', cabelo: 'curto', corCabelo: '#d6d6d6', chapeu: 'bucket', corChapeu: '#e8c240', bigode: true };
const GERENTE = { tipo: 'idoso', pele: '#f6e3d3', roupa: '#5a3a5a', calca: '#2c3346', gravata: '#1a1a1e', cabelo: 'careca', corCabelo: '#d6d6d6', oculos: true };
const CLARA = { tipo: 'crianca', pele: '#f6e3d3', roupa: '#f6b8c8', saia: '#f6b8c8', cabelo: 'rabo', corCabelo: '#3a2416', sapato: '#d1495b' };
const CLARA_ADULTA = { tipo: 'adulto', pele: '#f6e3d3', roupa: '#7b8a9a', calca: '#2c3346', cabelo: 'coque', corCabelo: '#3a2416', avental: '#fffaf0', bordado: 'C. DUARTE' };

// ---------- Atalhos ----------
type A = { k: object; t: number; x: number; y: number; h?: number; movs: Mov[]; over?: Partial<Pose> | ((p: Pose) => Partial<Pose>); seed?: number; flip?: boolean; op?: number };
const Pers = ({ op = 1, ...a }: A) => <Ator {...a} style={{ opacity: op }} />;
const Raios = ({ t, t0, t1, seed = 0, x }: P & { seed?: number; x?: number }) => <Relampago t={t} vezes={raiosDe(t0, t1, seed)} x={x} />;
// Mar na tempestade com a ilha ao fundo.
const MarTempestade = ({ t, ilha = true, forte = 1 }: { t: number; ilha?: boolean; forte?: number }) => (
  <Svg>
    <CeuTempestade t={t} horizonte={1100} />
    {ilha && <IlhaLonge x={760} y={1110} s={0.9} t={t} />}
    <Mar t={t} y0={1110} forte={forte} />
  </Svg>
);
// Barco do Tião no mar (grande): parede interna atrás, os dois sentados (pernas escondidas pelo casco),
// remos girando no tolete, lampião, onda na frente cobrindo o fundo do casco e respingos.
const SB = 1.6;
const BarcoCena = ({ t, tiaoOver, helOver, tiaoMov = 'parado' as string, helMov = 'parado' as string, t0, op = 1 }: { t: number; t0: number; tiaoOver?: Partial<Pose>; helOver?: Partial<Pose>; tiaoMov?: string; helMov?: string; op?: number }) => {
  const by = 1450 + 18 * Math.sin(t * 1.6), rot = 4 * Math.sin(t * 1.3);
  const fase = Math.sin(t * 3), rema = 26 * fase;
  return (
    <>
      <MarTempestade t={t} />
      <Svg><Nevoa t={t} y={1120} op={0.3} /></Svg>
      <div style={{ position: 'absolute', inset: 0, transform: `rotate(${rot}deg)`, transformOrigin: `540px ${by}px` }}>
        <Svg>
          <BarcoFundo x={540} y={by} s={SB} />
        </Svg>
        <Pers k={TIAO} t={t} x={735} y={by + 20} h={560} movs={[[tiaoMov, t0]]} over={{ maoE: [-90, -230 + rema], maoD: [90, -230 - rema], ...tiaoOver }} seed={3} flip op={op} />
        <Pers k={HELENA} t={t} x={350} y={by + 20} h={560} movs={[[helMov, t0]]} over={{ maoE: [-60, -200], maoD: [60, -200], ...helOver }} seed={1} />
        <Svg>
          <Barco x={540} y={by} t={t} s={SB} />
          <Remo px={840} py={by - 70} ang={28 + 14 * fase} s={1.1} />
        </Svg>
      </div>
      <Svg><OndaFrente t={t} y={by + 90} /></Svg>
      <Chuva t={t} />
    </>
  );
};
const Titulo = ({ t, at, texto, cor = '#fff' }: { t: number; at: number; texto: string; cor?: string }) => (
  <Pop t={t} at={at} x={540} y={300}><div style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 64, color: cor, textShadow: '0 4px 0 #000, 0 0 30px #000', letterSpacing: 4, whiteSpace: 'nowrap' }}>{texto}</div></Pop>
);
const Cartaz = ({ t, at }: { t: number; at: number }) => (
  <Pop t={t} at={at} x={540} y={760}>
    <div style={{ width: 520, background: '#f4ecdc', border: '6px solid #2a2230', borderRadius: 8, padding: 24, textAlign: 'center', transform: 'rotate(-3deg)', fontFamily: '"Arial Black", Arial' }}>
      <div style={{ fontSize: 54, color: '#d1495b' }}>DESAPARECIDA</div>
      <div style={{ position: 'relative', width: 300, height: 320, margin: '16px auto', background: '#cfe0f0', border: '4px solid #2a2230', overflow: 'hidden' }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', left: -390, top: -1000 }} />
        <div style={{ position: 'absolute', left: -390, top: -1010, width: 1080, height: 1920 }}><Pers k={CLARA} t={at + 1} x={540} y={1400} h={620} movs={[['parado', 0]]} over={{ boca: 'sorriso' }} seed={7} /></div>
      </div>
      <div style={{ fontSize: 40, color: '#2a2230' }}>CLARA, 9 ANOS</div>
    </div>
  </Pop>
);
// Montagem: Helena andando com lanterna.
const LANTERNA_MAO: Partial<Pose> = { maoD: [110, -250] };

// =====================================================================
// PARTE 1 — O Quarto Nove
// =====================================================================
const W1 = TL1.W;
const P1: Cena[] = [
  // 0 tempestade, Ilha da Névoa
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cx={760} cy={1000}>
      <MarTempestade t={t} />
      <Svg><Nevoa t={t} y={1130} op={0.45} n={8} /><OndaFrente t={t} y={1700} cor="#2a4a86" /></Svg>
      <Chuva t={t} />
      <Raios t={t} t0={t0 - 0.4} t1={t1} x={500} />
      <Titulo t={t} at={W1(0, 'nevoa')} texto="ILHA DA NÉVOA" />
    </Cam>
  ),
  // 1 menina sumida
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={800}>
      <ParedeTabuas t={t} />
      <div style={{ position: 'absolute', inset: 0, transform: `rotate(${1.5 * Math.sin(t * 2.3) + 0.8 * Math.sin(t * 5.1)}deg)`, transformOrigin: '540px 480px' }}><Cartaz t={t} at={W1(1, 'clara') - 0.2} /></div>
      <Svg><circle cx={540} cy={480} r={12} fill="#9aa0aa" stroke="#1a1520" strokeWidth={4} /></Svg>
      <Chuva t={t} op={0.3} />
    </Cam>
  ),
  // 2 barco do Tião
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1300}><BarcoCena t={t} t0={t0} /><Raios t={t} t0={t0} t1={t1} seed={2} /></Cam>,
  // 3 não disse uma palavra
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1.5} z1={1.6} cx={720} cy={1150}><BarcoCena t={t} t0={t0} tiaoOver={{ boca: 'neutra', pupila: [0, 0.5] }} /></Cam>,
  // 4 olhava de canto de olho
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.5} z1={1.6} cx={600} cy={1150}>
      <BarcoCena t={t} t0={t0} tiaoMov="nervoso" tiaoOver={{ pupila: [1, 0.2], boca: 'onda', suor: 1 }} helOver={{ pupila: [0.8, 0] }} />
      <Raios t={t} t0={t0 - 1} t1={t1} seed={4} />
    </Cam>
  ),
  // 5 hotel rangia
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={850}><HotelFora t={t} vulto={clamp((t - W1(5, 'rangia')) / 0.3) * (1 - clamp((t - W1(5, 'vento')) / 0.4))} /><Svg><Nevoa t={t} y={1250} op={0.4} /></Svg><Chuva t={t} /><Raios t={t} t0={t0 - 1.5} t1={t1} seed={5} x={300} /></Cam>,
  // 6 gerente escrevendo
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
      <Recepcao t={t} caneta />
      <Pers k={GERENTE} t={t} x={510} y={1180} h={580} movs={[['parado', t0]]} over={{ pupila: [0, 1], cabRot: 12, maoD: [40, -170], maoE: [-40, -175] }} seed={2} />
      <Svg><rect x={120} y={1080} width={840} height={370} fill="#5a3a22" stroke="#2a2230" strokeWidth={6} /><rect x={100} y={1060} width={880} height={36} fill="#7a4f2c" stroke="#2a2230" strokeWidth={5} /></Svg>
    </Cam>
  ),
  // 7 perguntei pela menina
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.15} cy={1050}>
      <Recepcao t={t} />
      <Pers k={GERENTE} t={t} x={680} y={1180} h={580} movs={[['parado', t0]]} over={{ pupila: [0, 1], cabRot: 12 }} seed={2} />
      <Svg><rect x={120} y={1080} width={840} height={370} fill="#5a3a22" stroke="#2a2230" strokeWidth={6} /><rect x={100} y={1060} width={880} height={36} fill="#7a4f2c" stroke="#2a2230" strokeWidth={5} /></Svg>
      <Pers k={HELENA} t={t} x={300} y={CHAO_I + 120} h={700} movs={[['falar', t0]]} seed={1} />
    </Cam>
  ),
  // 8 "Aqui nunca teve nenhuma Clara" sem levantar os olhos
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.6} z1={1.7} cx={600} cy={900}>
      <Recepcao t={t} />
      <Pers k={GERENTE} t={t} x={600} y={1180} h={580} movs={[['falar', W1(8, 'aqui')]]} over={{ pupila: [0, 1], cabRot: 12, olho: 0.6 }} seed={2} />
      <Svg><rect x={120} y={1080} width={840} height={370} fill="#5a3a22" stroke="#2a2230" strokeWidth={6} /></Svg>
      <Pop t={t} at={W1(8, 'aqui')} x={540} y={560}><Balao texto="Nunca teve Clara." /></Pop>
    </Cam>
  ),
  // 9 página arrancada
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cx={560} cy={900}><Livro t={t} linhas={['Sr. Almeida — 3', 'Família Souza — 5', 'Dna. Lurdes — 7']} /><Svg><Poeira t={t} n={30} op={0.5} /><circle cx={940} cy={420} r={380} fill="#ffcf6a" opacity={0.08 + 0.04 * Math.sin(t * 9)} /></Svg></Cam>,
  // 10 a do quarto nove (quadro de chaves sem a 9)
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.7} z1={1.9} cx={800} cy={680}>
      <Recepcao t={t} />
      <Pop t={t} at={W1(10, 'nove')} x={910} y={790}><div style={{ width: 70, height: 70, border: '6px solid #d1495b', borderRadius: '50%' }} /></Pop>
    </Cam>
  ),
  // 11 trancado por dentro, janela pregada
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <Corredor t={t} />
      <Pers k={HELENA} t={t} x={640} y={CHAO_I + 60} h={660} movs={[['parado', t0], ['apontar', W1(11, 'dentro') - 0.4, 1.4]]} over={{ pupila: [1, 0] }} seed={1} />
      <Pop t={t} at={W1(11, 'dentro')} x={870} y={700}><Placa texto={'TRANCADO\nPOR DENTRO'} bg="#d1495b" fg="#fff" size={36} /></Pop>
    </Cam>
  ),
  // 12 ninguém sai de um quarto assim
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.4} cx={760} cy={700}>
      <Quarto9 t={t} />
      <Pers k={HELENA} t={t} x={420} y={CHAO_I + 80} h={680} movs={[['pensar', t0]]} seed={1} />
    </Cam>
  ),
  // 13 cama, sapatinho vermelho, fumaça
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1150}>
      <Quarto9 t={t} />
      <Pop t={t} at={W1(13, 'vermelho')} x={760} y={1380}><div style={{ width: 160, height: 160, border: '6px solid #ffd166', borderRadius: '50%' }} /></Pop>
    </Cam>
  ),
  // 14 desenho no travesseiro
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1.8} z1={2.2} cx={250} cy={1050}><Quarto9 t={t} /></Cam>,
  // 15 a mulher com distintivo e a menina
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={850}><Desenho t={t} /></Cam>,
  // 16 "Mamãe veio me buscar"
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1.5} z1={1.6} cy={1240}><Desenho t={t} /></Cam>,
  // 17 eu não tenho filhos
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1.7} z1={1.8} cy={800}><Quarto9 t={t} /><Pers k={HELENA} t={t} x={540} y={CHAO_I} h={680} movs={[['nao', t0 + 0.2]]} over={{ boca: 'triste', sobrTriste: true }} seed={1} /></Cam>,
  // 18 cicatriz no desenho
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={900}><Desenho t={t} zoomCicatriz /><Pop t={t} at={W1(18, 'cicatriz')} x={235} y={960}><div style={{ width: 200, height: 200, border: '8px solid #d1495b', borderRadius: '50%' }} /></Pop></Cam>,
  // 19 igual à minha
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={2.2} z1={2.5} cx={500} cy={720}>
      <Quarto9 t={t} />
      <Pers k={HELENA} t={t} x={540} y={CHAO_I} h={680} movs={[['parado', t0], ['susto', W1(19, 'minha') - 0.1, 1.2]]} seed={1} />
    </Cam>
  ),
  // 20 a porta estava aberta
  ({ t, t0, t1 }) => {
    const a = W1(20, 'aberta');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.2} cx={870} cy={1100}>
        <Corredor t={t} aberta={clamp((t - a + 0.4) / 0.6)} escuro={0.45} />
        <Pers k={HELENA} t={t} x={540} y={CHAO_I + 60} h={660} movs={[['parado', t0], ['susto', a]]} over={{ pupila: [1, 0] }} seed={1} />
      </Cam>
    );
  },
  // 21 pegadas pequenas indo para o mar
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1} cy={1400}>
      <Corredor t={t} aberta={1} pegadas={clamp((t - W1(21, 'pequenas') + 0.3) / 2)} escuro={0.5} />
      <Raios t={t} t0={W1(21, 'mar') - 0.5} t1={W1(21, 'mar')} seed={9} />
      {t > TL1.END - 1.2 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp((t - TL1.END + 1.2) / 0.8) }} />}
    </Cam>
  ),
];

// =====================================================================
// PARTE 2 — A Página Arrancada
// =====================================================================
const W2 = TL2.W;
const Andando = ({ t, t0, x0, x1, t1, y, h = 640, k = HELENA, over = {} }: { t: number; t0: number; t1: number; x0: number; x1: number; y: number; h?: number; k?: object; over?: Partial<Pose> }) => (
  <Pers k={k} t={t} x={x0 + (x1 - x0) * clamp((t - t0) / (t1 - t0))} y={y} h={h} movs={[['andar', t0]]} over={{ x: 0, ...over }} seed={1} />
);
const P2: Cena[] = [
  // 0 pegadas até o píer
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1200}>
      <Pier t={t} pegadas={clamp((t - t0) / (t1 - t0))} />
      <Andando t={t} t0={t0} t1={t1 + 1} x0={-100} x1={300} y={CHAO_P} over={LANTERNA_MAO} />
      <Chuva t={t} />
      <Lanterna x={300 * clamp((t - t0) / (t1 - t0 + 1)) + 50} y={1200} r={420} forca={0.5} />
    </Cam>
  ),
  // 1 terminavam na beira da água
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.6} z1={1.8} cx={560} cy={1340}>
      <Pier t={t} pegadas={1} />
      <Chuva t={t} />
      <Pop t={t} at={W2(1, 'agua')} x={620} y={1345}><div style={{ width: 140, height: 80, border: '6px solid #ffd166', borderRadius: '50%' }} /></Pop>
    </Cam>
  ),
  // 2 cozinha: a única pessoa que conversou de verdade
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1100}>
      <Cozinha t={t} />
      <Pers k={CLARA_ADULTA} t={t} x={300} y={CHAO_I} h={660} movs={[['parado', t0]]} over={{ pupila: [0.6, 0], boca: 'neutra', sobrTriste: true }} seed={5} />
      <Pers k={HELENA} t={t} x={800} y={CHAO_I + 40} h={680} movs={[['entrar', t0], ['falar', t0 + 0.8]]} seed={1} flip />
    </Cam>
  ),
  // 3 olhos muito tristes
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={2.1} z1={2.3} cx={300} cy={820}><Cozinha t={t} /><Pers k={CLARA_ADULTA} t={t} x={300} y={CHAO_I} h={660} movs={[['parado', t0]]} over={{ pupila: [0.6, 0.2], boca: 'triste', sobrTriste: true }} seed={5} /></Cam>,
  // 4 avental bordado C. Duarte
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={2.6} z1={2.9} cx={300} cy={1150}><Cozinha t={t} /><Pers k={CLARA_ADULTA} t={t} x={300} y={CHAO_I} h={660} movs={[['parado', t0]]} seed={5} /></Cam>,
  // 5 perguntei se viu a menina
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.25} cy={1050}>
      <Cozinha t={t} />
      <Pers k={CLARA_ADULTA} t={t} x={300} y={CHAO_I} h={660} movs={[['parado', t0]]} over={{ sobrTriste: true, boca: 'neutra' }} seed={5} />
      <Pers k={HELENA} t={t} x={780} y={CHAO_I + 40} h={680} movs={[['falar', t0]]} seed={1} flip />
    </Cam>
  ),
  // 6 o prato e "faz muito tempo que você procura"
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1.25} cx={700} cy={1050}>
      <Cozinha t={t} prato={t > W2(6, 'prato') - 0.1} />
      <Pers k={CLARA_ADULTA} t={t} x={560} y={CHAO_I} h={660} movs={[['parado', t0], ['falar', W2(6, 'come')]]} over={{ sobrTriste: true }} seed={5} />
      <Pers k={HELENA} t={t} x={900} y={CHAO_I + 40} h={680} movs={[['parado', t0]]} over={{ pupila: [-1, 0] }} seed={1} flip />
      <Pop t={t} at={W2(6, 'come')} x={560} y={600}><Balao texto="Faz tempo que procura." /></Pop>
    </Cam>
  ),
  // 7 voltei ao píer
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1200}>
      <Pier t={t} barco limo />
      <Andando t={t} t0={t0} t1={t1 + 0.5} x0={-100} x1={420} y={CHAO_P} over={LANTERNA_MAO} />
      <Chuva t={t} />
    </Cam>
  ),
  // 8 barco coberto de limo
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1.6} z1={1.75} cx={760} cy={1440}><Pier t={t} barco limo /><Chuva t={t} /></Cam>,
  // 9 plaquinha
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={900}>
      <Svg><rect width={1080} height={1920} fill="#2e3a2a" />{Array.from({ length: 20 }, (_, i) => <ellipse key={i} cx={(i * 197) % 1080} cy={(i * 331) % 1900} rx={60} ry={24} fill="#4a5a30" opacity={0.6} />)}</Svg>
      <Pop t={t} at={W2(9, 'memoria') - 0.6} x={540} y={880}>
        <div style={{ width: 760, padding: '40px 30px', background: 'linear-gradient(#c9a050,#9a7430)', border: '8px solid #5a4018', borderRadius: 14, textAlign: 'center', fontFamily: 'Georgia, serif', color: '#3a2810', boxShadow: '0 10px 0 #000' }}>
          <div style={{ fontSize: 48, fontWeight: 900 }}>EM MEMÓRIA DE</div>
          <div style={{ fontSize: 70, fontWeight: 900 }}>TIÃO</div>
          <div style={{ fontSize: 44, fontStyle: 'italic' }}>o barqueiro</div>
        </div>
      </Pop>
    </Cam>
  ),
  // 10 morreu numa tempestade, vinte anos atrás
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={900}>
      <MarTempestade t={t} />
      <Chuva t={t} />
      <Raios t={t} t0={t0 - 0.5} t1={t1} seed={11} />
      <Pop t={t} at={W2(10, 'atras') - 0.4} x={540} y={600}><Placa texto="20 ANOS ATRÁS" bg="#1a1a1e" fg="#ffd166" size={60} /></Pop>
    </Cam>
  ),
  // 11 eu atravessei com ele naquela noite (lembrança da parte 1)
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.4} cx={600} cy={1200}><Lembranca><BarcoCena t={t} t0={t0} tiaoOver={{ pupila: [1, 0] }} op={0.7} /></Lembranca></Cam>,
  // 12 porão: achei a página
  ({ t, t0, t1 }) => {
    const lx = 300 + 420 * clamp((t - t0) / (t1 - t0));
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1100}>
        <Porao t={t} />
        <Pers k={HELENA} t={t} x={220} y={CHAO_I + 40} h={680} movs={[['parado', t0]]} over={{ maoD: [140, -240], pupila: [1, 0.3] }} seed={1} />
        <Lanterna x={lx} y={1250} r={260} />
        <Pop t={t} at={W2(12, 'arrancada')} x={720} y={1230}><div style={{ width: 130, height: 170, background: '#efe2c4', border: '4px solid #2a2230', transform: 'rotate(12deg)' }} /></Pop>
      </Cam>
    );
  },
  // 13-14 a página: Helena Duarte e Clara; entrada / saída em branco
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cx={760} cy={800}><Livro t={t} rasgado={false} linhas={['QUARTO 9', 'Helena Duarte', 'e filha Clara, 9 anos']} destaque={t > W2(13, 'duarte') ? 1 : -1} /></Cam>,
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1.12} z1={1.25} cx={760} cy={880}><Livro t={t} rasgado={false} linhas={['QUARTO 9', 'Helena Duarte', 'e filha Clara, 9 anos', 'Entrada: 14 de março', 'Saída: ___________']} destaque={t > W2(14, 'branco') - 0.1 ? 4 : 3} /></Cam>,
  // 15 esse é o meu nome
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={2.2} z1={2.5} cx={540} cy={760}><Porao t={t} /><Pers k={HELENA} t={t} x={540} y={CHAO_I} h={680} movs={[['parado', t0], ['susto', W2(15, 'nome') - 0.1, 1.2]]} seed={1} /><Lanterna x={540} y={700} r={330} /></Cam>,
  // 16 jornal
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={700}><Jornal t={t} /></Cam>,
  // 17-19 a foto: a mulher era eu, com o mesmo rosto
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1} cy={900}><Jornal t={t} zoom={1.4} foto={<FotoAntiga t={t} />} /></Cam>,
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1} cy={900}><Jornal t={t} zoom={1.9} foto={<FotoAntiga t={t} />} /></Cam>,
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={900}>
      <Porao t={t} />
      <Pers k={HELENA} t={t} x={540} y={CHAO_I + 60} h={720} movs={[['nervoso', t0]]} over={{ olho: 1.3, boca: 'o' }} seed={1} />
      <Lanterna x={540} y={900} r={380} />
      <Raios t={t} t0={t0} t1={t1} seed={19} />
    </Cam>
  ),
  // 20 a voz cantou a música
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1000}>
      <Porao t={t} />
      <Pers k={HELENA} t={t} x={700} y={CHAO_I + 40} h={680} movs={[['nervoso', t0]]} over={{ pupila: [-1, 0], maoD: [140, -240] }} seed={1} flip />
      <Lanterna x={700 + 40 * Math.sin(t * 9)} y={1050} r={280} forca={0.92} />
      {[0, 1, 2, 3].map((i) => { const k = (t * 0.45 + i / 4) % 1; return <div key={i} style={{ position: 'absolute', left: 140 + i * 60 + Math.sin(t * 2 + i) * 30, top: 1100 - k * 600, fontSize: 70, color: '#cfd8ff', opacity: (1 - k) * 0.8, fontFamily: 'Arial' }}>♪</div>; })}
    </Cam>
  ),
  // 21 "Mãe?"
  ({ t, t0, t1 }) => {
    const m = W2(21, 'mae');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.5} cx={540} cy={800}>
        <Porao t={t} />
        <Pers k={CLARA_ADULTA} t={t} x={260} y={CHAO_I + 40} h={680} movs={[['parado', t0]]} over={{ boca: 'neutra', sobrTriste: true }} seed={5} op={0.85} />
        <Pers k={HELENA} t={t} x={700} y={CHAO_I + 40} h={700} movs={[['parado', t0], ['susto', m]]} over={{ pupila: [1, 0] }} seed={1} />
        <Lanterna x={700} y={800} r={260} forca={0.94} />
        <Pop t={t} at={m} x={300} y={620}><Balao texto="Mãe?" cor="#cfd8ff" /></Pop>
        {t > TL2.END - 1 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp((t - TL2.END + 1) / 0.7) }} />}
      </Cam>
    );
  },
];
// Foto antiga do jornal: Helena (com o mesmo rosto) de mão dada com a Clara.
const FotoAntiga = ({ t }: { t: number }) => (
  <>
    <HotelFora t={t} dia janela9={false} />
    <Pers k={HELENA} t={t} x={430} y={1250} h={600} movs={[['parado', 0]]} over={{ maoD: [110, -150], boca: 'sorriso' }} seed={1} />
    <Pers k={CLARA} t={t} x={620} y={1250} h={480} movs={[['parado', 0]]} over={{ maoE: [-110, -170], boca: 'riso' }} seed={7} />
  </>
);

// =====================================================================
// PARTE 3 — Mamãe Veio Me Buscar
// =====================================================================
const W3 = TL3.W;
const fantasma = (t: number, a: number, b = 0.55) => 1 - (1 - b) * clamp((t - a) / 1.5);
const P3: Cena[] = [
  // 0 era a cozinheira
  ({ t, t0, t1 }) => {
    const v = W3(0, 'cozinheira');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
        <Porao t={t} />
        <Pers k={CLARA_ADULTA} t={t} x={300} y={CHAO_I + 40} h={680} movs={[['parado', t0]]} over={{ boca: 'neutra', sobrTriste: true }} seed={5} />
        <Pers k={HELENA} t={t} x={760} y={CHAO_I + 40} h={700} movs={[['parado', t0], ['susto', v - 0.1, 1.2]]} over={{ maoD: [140, -240], pupila: [-1, 0] }} seed={1} flip />
        <Lanterna x={760 - 460 * clamp((t - t0) / (v - t0))} y={1000} r={300} forca={0.9} />
      </Cam>
    );
  },
  // 1 "Você ainda não lembrou, né?"
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.4} cx={420} cy={900}>
      <Porao t={t} />
      <Pers k={CLARA_ADULTA} t={t} x={360} y={CHAO_I} h={680} movs={[['falar', t0]]} over={{ sobrTriste: true, boca: 'sorriso' }} seed={5} />
      <Lanterna x={360} y={900} r={360} forca={0.85} />
      <Pop t={t} at={W3(1, 'lembrou') - 0.3} x={440} y={560}><Balao texto="Ainda não lembrou?" /></Pop>
    </Cam>
  ),
  // 2 e eu lembrei (clarão)
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={2.2} z1={2.6} cx={540} cy={760}>
      <Porao t={t} />
      <Pers k={HELENA} t={t} x={540} y={CHAO_I} h={680} movs={[['parado', t0]]} over={{ olho: 0.05, olhoFeliz: false, boca: 'o' }} seed={1} />
      <div style={{ position: 'absolute', inset: 0, background: '#fff6e0', opacity: clamp((t - W3(2, 'lembrei')) / 0.5) }} />
    </Cam>
  ),
  // 3 lembrança: férias na ilha
  ({ t, t0, t1 }) => (
    <Lembranca>
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1000}>
        <HotelFora t={t} dia janela9={false} />
        <Pers k={HELENA} t={t} x={400} y={1330} h={620} movs={[['acenar', t0 + 0.3]]} over={{ maoE: [-110, -150] }} seed={1} />
        <Pers k={CLARA} t={t} x={240} y={1330} h={500} movs={[['comemorar', t0 + 0.2]]} seed={7} />
      </Cam>
    </Lembranca>
  ),
  // 4 a cozinha pegou fogo
  ({ t, t0, t1 }) => (
    <Lembranca>
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1000}>
        <Cozinha t={t} fogo={0.6 + 0.8 * clamp((t - W3(4, 'fogo') + 0.5) / 1)} />
        <Svg><Fogo t={t} x={800} y={1450} s={clamp((t - W3(4, 'fogo')) / 1.2) * 1.4} /></Svg>
        <div style={{ position: 'absolute', inset: 0, background: '#ff6a2a', opacity: 0.18 + 0.06 * Math.sin(t * 12), mixBlendMode: 'screen' }} />
      </Cam>
    </Lembranca>
  ),
  // 5 Clara no colo, correndo pro barco
  ({ t, t0, t1 }) => {
    const k = clamp((t - t0) / (t1 - t0 + 0.3));
    const x = -60 + k * 640;
    return (
      <Lembranca>
        <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1200}>
          <Pier t={t} barco />
          <Svg><Fogo t={t} x={80} y={1330} s={0.8} /></Svg>
          <Pers k={CLARA} t={t} x={x + 40} y={CHAO_P - 200} h={420} movs={[['chorar', t0]]} seed={7} />
          <Pers k={HELENA} t={t} x={x} y={CHAO_P} h={640} movs={[['andar', t0]]} over={{ x: 0, maoE: [-30, -230], maoD: [50, -230], frenteE: true, frenteD: true }} seed={1} />
          <Chuva t={t} />
        </Cam>
      </Lembranca>
    );
  },
  // 6 a onda virou o barco
  ({ t, t0, t1 }) => {
    const v = W3(6, 'virou');
    const r = 150 * clamp((t - v + 0.3) / 0.8);
    return (
      <Lembranca>
        <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1300}>
          <MarTempestade t={t} forte={1.6} ilha={false} />
          <Svg><path d={`M-100 1600 Q${200 + 300 * clamp((t - v + 0.6) / 1)} ${1100 - 200 * clamp((t - v + 0.6) / 1)} 1200 1250 V1920 H-100 z`} fill="#1b3460" opacity={0.85} /><path d={`M-100 1600 Q${200 + 300 * clamp((t - v + 0.6) / 1)} ${1100 - 200 * clamp((t - v + 0.6) / 1)} 1200 1250`} stroke="#dfeaff" strokeWidth={14} fill="none" opacity={0.7} /></Svg>
          <div style={{ position: 'absolute', inset: 0, transform: `rotate(${r}deg)`, transformOrigin: '540px 1300px' }}>
            <Svg><Barco x={540} y={1300 + 20 * Math.sin(t * 2)} t={t} /></Svg>
          </div>
          <Chuva t={t} />
          <Raios t={t} t0={v - 0.6} t1={v} seed={36} />
        </Cam>
      </Lembranca>
    );
  },
  // 7 empurrei a Clara até a boia
  ({ t, t0, t1 }) => (
    <Lembranca>
      <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.3} cy={1250}>
        <MarTempestade t={t} ilha={false} />
        <Svg><g transform={`translate(640 ${1320 + 14 * Math.sin(t * 2)})`}><ellipse rx={120} ry={46} fill="none" stroke="#d1495b" strokeWidth={36} /><ellipse rx={120} ry={46} fill="none" stroke="#fff" strokeWidth={36} strokeDasharray="60 60" /></g></Svg>
        <Pers k={CLARA} t={t} x={640} y={1420 + 14 * Math.sin(t * 2)} h={460} movs={[['chorar', t0]]} seed={7} />
        <Pers k={HELENA} t={t} x={380} y={1560 + 20 * Math.sin(t * 2.4)} h={620} movs={[['parado', t0]]} over={{ maoD: [170, -260], maoE: [-90, -300], boca: 'dentes' }} seed={1} />
        <Svg><Mar t={t} y0={1440} cor={['#1b3460']} forte={0.6} /></Svg>
        <Chuva t={t} />
      </Cam>
    </Lembranca>
  ),
  // 8 e não consegui subir (afunda e some)
  ({ t, t0, t1 }) => {
    const k = clamp((t - t0) / (t1 - t0));
    return (
      <Lembranca>
        <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
          <Svg><rect width={1080} height={1920} fill="#0e2240" />{Array.from({ length: 14 }, (_, i) => { const kk = (t * 0.4 + i / 14) % 1; return <circle key={i} cx={420 + Math.sin(i * 3 + t) * 80} cy={1300 - kk * 1100} r={8 + (i % 3) * 6} fill="none" stroke="#9ac0e8" strokeWidth={3} opacity={1 - kk} />; })}<path d="M0 260 Q540 220 1080 260" stroke="#9ac0e8" strokeWidth={6} fill="none" opacity={0.5} /></Svg>
          <Pers k={HELENA} t={t} x={540} y={900 + k * 600} h={640} movs={[['parado', t0]]} over={{ maoE: [-80, -440], maoD: [80, -440], olho: 0.3, boca: 'o' }} seed={1} op={1 - k * 0.9} />
        </Cam>
      </Lembranca>
    );
  },
  // 9 a desaparecida era eu (fantasma)
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.35} cy={900}>
      <Porao t={t} />
      <Lanterna x={540} y={900} r={420} forca={0.8} />
      <Pers k={HELENA} t={t} x={540} y={CHAO_I + 60} h={720} movs={[['parado', t0]]} over={{ boca: 'triste', sobrTriste: true, pupila: [0, 0.6] }} seed={1} op={fantasma(t, W3(9, 'eu') - 0.5)} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, rgba(170,200,255,0.25), rgba(0,0,0,0) 45%)', opacity: clamp((t - W3(9, 'eu') + 0.5) / 1) }} />
    </Cam>
  ),
  // 10 o balcão sempre esteve vazio
  ({ t, t0, t1 }) => {
    const n = W3(10, 'ninguem');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.12} cy={1000}>
        <Recepcao t={t} vazio={t > n + 0.6} />
        <Pers k={GERENTE} t={t} x={510} y={1180} h={580} movs={[['parado', t0]]} over={{ pupila: [0, 1], cabRot: 12 }} seed={2} op={1 - clamp((t - n + 0.2) / 0.8)} />
        <Svg><rect x={120} y={1080} width={840} height={370} fill="#5a3a22" stroke="#2a2230" strokeWidth={6} /><rect x={100} y={1060} width={880} height={36} fill="#7a4f2c" stroke="#2a2230" strokeWidth={5} /></Svg>
      </Cam>
    );
  },
  // 11 o Tião também estava preso naquela noite
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.5} cx={720} cy={1150}>
      <BarcoCena t={t} t0={t0} tiaoMov="parado" tiaoOver={{ boca: 'triste', sobrTriste: true, pupila: [-0.5, 0.4] }} op={0.6} />
      <div style={{ position: 'absolute', inset: 0, background: '#9ab0e0', opacity: 0.12, mixBlendMode: 'screen' }} />
    </Cam>
  ),
  // 12 toda tempestade, eu volto (anos passando)
  ({ t, t0, t1 }) => {
    const ano = 2007 + Math.floor(19 * clamp((t - t0) / (t1 - t0 - 0.3)));
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
        <Pier t={t} />
        <Andando t={t} t0={t0} t1={t1} x0={-60} x1={420} y={CHAO_P} over={LANTERNA_MAO} />
        <Chuva t={t} />
        <Raios t={t} t0={t0} t1={t1} seed={40} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 110, color: '#ffd166', textShadow: '0 6px 0 #000' }}>{ano}</div>
      </Cam>
    );
  },
  // 13 achando que quem sumiu foi ela
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={800}>
      <Svg><rect width={1080} height={1920} fill="#2a2420" /></Svg>
      <div style={{ opacity: 1 - clamp((t - W3(13, 'ela') + 0.2) / 1) }}><Cartaz t={t} at={t0 - 1} /></div>
    </Cam>
  ),
  // 14 o sapatinho vermelho
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.5} cx={420} cy={950}>
      <Porao t={t} />
      <Pers k={CLARA_ADULTA} t={t} x={420} y={CHAO_I} h={680} movs={[['parado', t0]]} over={{ maoD: [70, -260], frenteD: true, sobrTriste: true, boca: 'sorriso' }} seed={5} />
      <Lanterna x={420} y={950} r={420} forca={0.8} />
      <Pop t={t} at={W3(14, 'vermelho') - 0.2} x={560} y={1010}><svg width={150} height={90} viewBox="-60 -50 120 70"><path d="M-50 0 q0 -34 30 -34 h30 q30 4 40 34 z" fill="#d1495b" stroke="#2a2230" strokeWidth={4} /><path d="M-20 -30 l24 18" stroke="#fff" strokeWidth={4} /></svg></Pop>
    </Cam>
  ),
  // 15 "Eu fiquei, mãe. Eu cresci." (a menina vira a mulher)
  ({ t, t0, t1 }) => {
    const c = clamp((t - W3(15, 'cresci') + 0.4) / 1);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.3} cx={540} cy={950}>
        <Porao t={t} />
        <Lanterna x={540} y={950} r={460} forca={0.75} />
        <Pers k={CLARA} t={t} x={540} y={CHAO_I} h={520} movs={[['parado', t0]]} over={{ boca: 'sorriso' }} seed={7} op={1 - c} />
        <Pers k={CLARA_ADULTA} t={t} x={540} y={CHAO_I} h={680} movs={[['falar', t0]]} over={{ boca: 'sorriso', sobrTriste: true, lagrima: 1 }} seed={5} op={c} />
      </Cam>
    );
  },
  // 16 sou eu que deixo o desenho todo ano
  ({ t, t0, t1 }) => (
    <Lembranca>
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
        <Quarto9 t={t} fumaca={false} desenho={t > W3(16, 'desenho')} />
        <Pers k={CLARA_ADULTA} t={t} x={420} y={CHAO_I} h={680} movs={[['parado', t0]]} over={{ maoE: [-120, -180], boca: 'sorriso', sobrTriste: true }} seed={5} flip />
      </Cam>
    </Lembranca>
  ),
  // 17 C. Duarte. Clara Duarte.
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={900}>
      <Svg><rect width={1080} height={1920} fill="#fffaf0" /></Svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: '"Arial Black", Arial', fontSize: 120, color: '#d1495b', letterSpacing: 6 }}>
        {t < W3(17, 'clara') - 0.1 ? 'C. DUARTE' : 'CLARA DUARTE'}
      </div>
    </Cam>
  ),
  // 18 segurou a minha mão
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1.3} cy={1000}>
      <Porao t={t} />
      <Lanterna x={540} y={950} r={520} forca={0.7} />
      <Pers k={CLARA_ADULTA} t={t} x={380} y={CHAO_I + 40} h={680} movs={[['parado', t0]]} over={{ maoD: [120, -175], boca: 'sorriso', lagrima: 1 }} seed={5} />
      <Pers k={HELENA} t={t} x={690} y={CHAO_I + 40} h={700} movs={[['parado', t0]]} over={{ maoE: [-120, -175], boca: 'sorriso', lagrima: 1 }} seed={1} op={0.7} />
      <div style={{ position: 'absolute', left: 535 - 120, top: 1180, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,240,200,0.8), rgba(255,240,200,0) 70%)', opacity: clamp((t - W3(18, 'tocou') + 0.3) / 0.6) }} />
    </Cam>
  ),
  // 19 "Pode ir, mãe. Eu tô bem."
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.6} z1={1.7} cx={380} cy={850}>
      <Porao t={t} />
      <Lanterna x={380} y={850} r={420} forca={0.75} />
      <Pers k={CLARA_ADULTA} t={t} x={380} y={CHAO_I + 40} h={680} movs={[['falar', t0]]} over={{ boca: 'sorriso', lagrima: 1 }} seed={5} />
      <Pop t={t} at={W3(19, 'bem') - 0.5} x={420} y={560}><Balao texto="Pode ir, mãe." /></Pop>
    </Cam>
  ),
  // 20 a tempestade parou, o sol nasceu
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
      <Amanhecer t={t} k={clamp((t - W3(20, 'parou')) / 3)} />
      <Pers k={HELENA} t={t} x={540} y={1250} h={560} movs={[['acenar', W3(20, 'parou')]]} over={{ boca: 'sorriso', olhoFeliz: true }} seed={1} op={0.6 * (1 - clamp((t - W3(20, 'parou') - 1) / 2))} />
    </Cam>
  ),
  // 21 o quarto nove não tem mais tranca
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1000}><Quarto9 t={t} dia fumaca={false} sapato={false} desenho={false} janelaAberta /></Cam>,
  // 22-23 o desenho na parede ganha a frase nova
  ({ t, t0, t1 }) => <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={900}><Desenho t={t} frase2={clamp((t - W3(22, 'adulta')) / 1.2)} /></Cam>,
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.45} cy={1280}>
      <Desenho t={t} frase2={clamp((t - t0) / 2.2)} />
      {t > TL3.END - 1.5 && <div style={{ position: 'absolute', inset: 0, background: '#fffaf0', opacity: clamp((t - TL3.END + 1.5) / 1.2) }} />}
    </Cam>
  ),
];

const comVinheta = (cs: Cena[], forca = 0.55): Cena[] => cs.map((C) => (p) => <>{C(p)}<Vinheta forca={forca} /></>);

// ---------- Efeitos sonoros (reaproveitados de public/sfx-eleven quando servirem) ----------
const sfx1 = (): Sfx[] => [['sfx-eleven/rio.mp3', 0, 0.14, TL1.W(5, 0)], ['sfx-eleven/drone.mp3', TL1.W(11, 0), 0.14, TL1.END - TL1.W(11, 0)], ['sfx-eleven/boom.mp3', TL1.W(19, 'minha'), 0.4], ['sfx-eleven/susto.mp3', TL1.W(20, 'aberta'), 0.4], ['sfx-eleven/coracao.mp3', TL1.W(21, 0), 0.3]];
const sfx2 = (): Sfx[] => [['sfx-eleven/rio.mp3', 0, 0.14, TL2.W(2, 0)], ['sfx-eleven/drone.mp3', TL2.W(12, 0), 0.14, TL2.END - TL2.W(12, 0)], ['sfx-eleven/boom.mp3', TL2.W(15, 'nome'), 0.4], ['sfx-eleven/coracao.mp3', TL2.W(18, 0), 0.3, 6], ['sfx-eleven/susto.mp3', TL2.W(21, 'mae'), 0.45]];
const sfx3 = (): Sfx[] => [['sfx-eleven/drone.mp3', 0, 0.12, TL3.W(3, 0)], ['sfx-eleven/whoosh.mp3', TL3.W(2, 'lembrei'), 0.4], ['sfx-eleven/boom.mp3', TL3.W(6, 'virou'), 0.4], ['sfx-eleven/rio.mp3', TL3.W(6, 0), 0.16, TL3.W(9, 0) - TL3.W(6, 0)], ['sfx-eleven/brilho.mp3', TL3.W(18, 'tocou'), 0.35], ['sfx-eleven/desliga.mp3', TL3.W(20, 'parou'), 0.3]];

export const QuartoNove1 = () => <FilmeMad tl={TL1} cenas={comVinheta(P1)} voz="voz-q9-1.mp3" sfx={sfx1()} />;
export const QuartoNove2 = () => <FilmeMad tl={TL2} cenas={P2} voz="voz-q9-2.mp3" sfx={sfx2()} />;
export const QuartoNove3 = () => <FilmeMad tl={TL3} cenas={P3} voz="voz-q9-3.mp3" sfx={sfx3()} />;
export const DUR_Q9 = { 1: TL1.END, 2: TL2.END, 3: TL3.END };
export type { ReactNode };
