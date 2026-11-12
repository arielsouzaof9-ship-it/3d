// "O Garoto Lagartixa": origem de super-herói com os PERSONAGENS MAD ARTICULADOS. Só efeitos sonoros (sem narração).
import { CSSProperties, ReactNode } from 'react';
import { Svg } from './cenarios';
import { Vinheta } from './cenarios-ilha';
import { clamp, Costura, Escola, Escritorio, Feira, Ginasio, Hospital, Laboratorio, Lagartixa as Bicho, Mosca, Placar, Predio, QuartoTeo, RuaNoite, Telhado } from './cenarios-lagartixa';
import { Balao, Brilho, Cam, Moto, Placa, Pop } from './FiosBrancos';
import { Ator, Mov } from './FiosBrancosArticulado';
import { Cena, FilmeMad, P, Sfx } from './FilmeMad';
import { Pose } from './Rig';
import { TL_LAGARTIXA as TL } from './timeline-lagartixa';

// ---------- Elenco ----------
const TEO = { tipo: 'adulto', corpo: 'magro', pele: '#e8c09a', roupa: '#f2c94c', calca: '#2f5fa8', cabelo: 'topete', corCabelo: '#3a2416', oculos: true, sapato: '#d1495b' };
const TEO_SEM = { ...TEO, oculos: false };
const TEO_LUTA = { ...TEO_SEM, roupa: '#d1495b', calca: '#1a1a1e', mascara: 'heroi', corMascara: '#d1495b', detalheMascara: '#8a1a2a' };
const TEO_HEROI = { ...TEO_SEM, roupa: '#3ac06a', calca: '#1a6a3a', mascara: 'heroi', corMascara: '#3ac06a', detalheMascara: '#1a6a3a', sapato: '#1a6a3a', peito: 'L' };
const VO = { tipo: 'idoso', pele: '#c98a5a', roupa: '#e8a0b8', saia: '#5a8ac0', cabelo: 'coque', corCabelo: '#e8e8e8', oculos: true, brinco: '#f2c94c', sapato: '#6b4224' };
const ARNALDO = { tipo: 'adulto', corpo: 'gordo', pele: '#f6e3d3', roupa: '#fffaf0', calca: '#5a5a66', cabelo: 'careca', corCabelo: '#9a9aa6', bigode: true, corBigode: '#3a2a20', sapato: '#1a1a1e' };
const LADRAO = { tipo: 'adulto', pele: '#c98a5a', roupa: '#2a2a30', calca: '#3a3f4a', chapeu: 'capacete', corChapeu: '#d1283b', cabelo: 'curto', corCabelo: '#1a1a1e', oculosEscuros: true, sapato: '#1a1a1e' };
const BRUTAO = { tipo: 'adulto', corpo: 'gordo', pele: '#8d5a3b', roupa: '#5a3a6a', calca: '#5a3a6a', short: true, mascara: 'heroi', corMascara: '#5a3a6a', detalheMascara: '#f2c94c', sapato: '#f2c94c' };
const BIA = { tipo: 'adulto', pele: '#7a4b30', roupa: '#7ad0c0', saia: '#7ad0c0', cabelo: 'afro', corCabelo: '#120c08', brinco: '#fff', item: 'livro', sapato: '#2f5fa8' };
const ALUNOS = [
  { tipo: 'adulto', pele: '#f6e3d3', roupa: '#d1495b', calca: '#3a3f4a', cabelo: 'espetado', corCabelo: '#c86a2a', sapato: '#1a1a1e' },
  { tipo: 'adulto', pele: '#8d5a3b', roupa: '#5a8ac0', calca: '#c9a86a', cabelo: 'curto', corCabelo: '#120c08', sapato: '#fff' },
  { tipo: 'adulto', pele: '#f0c8a0', roupa: '#f28fb0', saia: '#3a3f4a', cabelo: 'rabo', corCabelo: '#e8c240', sapato: '#d1495b' },
];

// ---------- Atalhos ----------
type A = { k: object; t: number; x: number; y: number; h?: number; movs: Mov[]; over?: Partial<Pose> | ((p: Pose) => Partial<Pose>); seed?: number; flip?: boolean; op?: number; style?: CSSProperties };
const Pers = ({ op = 1, style, ...a }: A) => <Ator {...a} style={{ opacity: op, ...style }} />;
const W = TL.W;
const ini = (i: number) => (i === 0 ? 0 : i >= TL.LINES.length ? TL.END : W(i, 0));
const andando = (t: number, t0: number, x0: number, v: number) => x0 + v * Math.max(0, t - t0);
// "Sentido de perigo": ondas verdes saindo da cabeça.
const Sentido = ({ t, x, y, forca = 1 }: { t: number; x: number; y: number; forca?: number }) => (
  <Svg>{[0, 1, 2].map((i) => { const k = (t * 1.6 + i / 3) % 1; return <g key={i} opacity={forca * (1 - k)}>{[-1, 1].map((s) => <path key={s} d={`M${x + s * (70 + k * 120)} ${y - 60} q${s * 30} 60 0 120`} stroke="#3ac06a" strokeWidth={10} fill="none" strokeLinecap="round" />)}</g>; })}</Svg>
);
const Onoma = ({ t, at, x, y, txt, cor = '#ffd23a', size = 110 }: { t: number; at: number; x: number; y: number; txt: string; cor?: string; size?: number }) => (
  t > at - 0.05 && t < at + 1 ? <Pop t={t} at={at} x={x} y={y}><div style={{ fontFamily: '"Arial Black", Arial', fontSize: size, color: cor, WebkitTextStroke: '10px #1a1520', paintOrder: 'stroke fill', transform: 'rotate(-8deg)', opacity: 1 - clamp((t - at - 0.7) / 0.3) }}>{txt}</div></Pop> : null
);
const DeCabeca = ({ children }: { children: ReactNode }) => <div style={{ position: 'absolute', inset: 0, transform: 'scaleY(-1)' }}>{children}</div>;
const Noite = ({ k = 0.3 }: { k?: number }) => <div style={{ position: 'absolute', inset: 0, background: '#0a0a22', opacity: k, pointerEvents: 'none' }} />;

// ---------- Cenas (uma por frase) ----------
const CENAS: Cena[] = [
  // 0 Téo, 16 anos, invisível na escola
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1150}>
      <Escola t={t} />
      {ALUNOS.map((k, i) => <Pers key={i} k={k} t={t} x={andando(t, t0, 1200 + i * 260, -170)} y={1700 + (i % 2) * 30} h={620} movs={[['andar', t0]]} over={{ x: 0, pupila: [-0.8, 0] }} seed={i + 10} flip />)}
      <Pers k={{ ...TEO, item: 'livro' }} t={t} x={300} y={1720} h={640} movs={[['parado', t0], ['acenar', t0 + 2.4, 1.4], ['ombros', t0 + 4]]} over={{ boca: 'sorriso' }} seed={1} />
      <Pop t={t} at={W(0, 'teo')} x={300} y={980}><Placa texto="TÉO, 16" bg="#fffaf0" size={56} /></Pop>
      <Pop t={t} at={W(0, 'existo')} x={760} y={620}><Placa texto="INVISÍVEL" bg="#9aa0aa" fg="#fff" size={52} /></Pop>
    </Cam>
  ),
  // 1 "Bom... ninguém sabia."
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.5} z1={1.65} cy={900}>
      <Escola t={t} />
      <Pers k={TEO} t={t} x={540} y={1800} h={900} movs={[['parado', t0]]} over={{ boca: 'sorriso', pisca: t > W(1, 'sabia') - 0.1 ? 1 : 0, pupila: [0.4, 0] }} seed={1} />
    </Cam>
  ),
  // 2 laboratório: a lagartixa foge do tubo EXPERIMENTAL
  ({ t, t0, t1 }) => {
    const f = W(2, 'lagartixa');
    const k = clamp((t - f) / 2.2);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
        <Laboratorio t={t} tuboAberto={clamp((t - f + 0.5) / 0.4)} />
        <Svg><Bicho x={560 + k * 160} y={810 + k * 260} s={0.9} rot={60 * k} t={t} /></Svg>
        {ALUNOS.slice(0, 2).map((a, i) => <Pers key={i} k={a} t={t} x={140 + i * 780} y={1700} h={600} movs={[['parado', t0], ['susto', f + 0.2 + i * 0.1]]} seed={i + 10} flip={i === 1} />)}
        <Pers k={TEO} t={t} x={540} y={1760} h={640} movs={[['parado', t0], ['olharLados', f + 0.6]]} over={{ pupila: [0.6, -0.3] }} seed={1} />
        <Pop t={t} at={W(2, 'experimental')} x={560} y={560}><Placa texto="EXPERIMENTAL" bg="#f2c94c" size={50} /></Pop>
      </Cam>
    );
  },
  // 3 e me mordeu a mão
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.5} cx={640} cy={1000}>
      <Laboratorio t={t} tuboAberto={1} />
      <Pers k={TEO} t={t} x={540} y={1700} h={760} movs={[['parado', t0], ['susto', W(3, 'mordeu')]]} over={(p) => (t > W(3, 'mordeu') ? { maoD: [150, -260], boca: 'o' } : { maoD: [150, -200] })} seed={1} />
      <Svg><Bicho x={790} y={t > W(3, 'mordeu') ? 1030 : 1150} s={0.7} rot={-80} t={t} /></Svg>
      <Onoma t={t} at={W(3, 'mordeu')} x={760} y={760} txt="NHAC!" />
    </Cam>
  ),
  // 4 acordou grudado no teto
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={800}>
      <QuartoTeo t={t} />
      <DeCabeca><Pers k={{ ...TEO, oculos: true }} t={t} x={540} y={1790} h={640} movs={[['cochilar', t0], ['susto', W(4, 'teto') - 0.2]]} over={{ sentado: 0 }} seed={1} /></DeCabeca>
      <Pop t={t} at={W(4, 'grudado')} x={540} y={980}><Placa texto="?!" bg="#f2c94c" size={90} /></Pop>
      <Svg><g transform="translate(860 1160)"><rect x={-56} y={-40} width={112} height={70} rx={10} fill="#d1495b" stroke="#1a1520" strokeWidth={4} /><text x={0} y={8} textAnchor="middle" fontFamily="'Courier New'" fontWeight={900} fontSize={34} fill="#fff">07:00</text></g></Svg>
    </Cam>
  ),
  // 5 os óculos não servem; vê cada mosca
  ({ t, t0, t1 }) => {
    const o = W(5, 'oculos');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1.3} cy={900}>
        <QuartoTeo t={t} />
        <Pers k={t > o + 0.8 ? TEO_SEM : TEO} t={t} x={360} y={1760} h={720} movs={[['parado', t0], ['nao', o, 1.2], ['espiar', W(5, 'mosca') - 0.3]]} over={{ pupila: [1, -0.5] }} seed={1} />
        <Svg><Mosca x={820} y={760} s={2.4} t={t} /><circle cx={820} cy={760} r={130} fill="none" stroke="#3ac06a" strokeWidth={8} opacity={clamp((t - W(5, 'mosca') + 0.2) / 0.3)} /></Svg>
        <Brilho t={t} at={o + 0.8} x={360} y={1060} />
      </Cam>
    );
  },
  // 6 sobe em prédios; sente o perigo
  ({ t, t0, t1 }) => {
    const u = t - t0;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1000}>
        <Predio t={t} sobe={u * 0.6} />
        <Pers k={TEO_SEM} t={t} x={540} y={1300} h={680} movs={[['parado', t0]]} over={{ maoE: [-90 + 20 * Math.sin(u * 8), -400 + 40 * Math.sin(u * 8)], maoD: [90 - 20 * Math.sin(u * 8), -400 - 40 * Math.sin(u * 8)], peE: [-40, -30 * Math.max(0, Math.sin(u * 8))], peD: [40, -30 * Math.max(0, -Math.sin(u * 8))], pupila: [0, -1], boca: 'riso' }} seed={1} />
        {t > W(6, 'perigo') - 0.2 && <Sentido t={t} x={540} y={1300 - 680 * 0.63} />}
        <Pop t={t} at={W(6, 'perigo')} x={540} y={300}><Placa texto="PERIGO!" bg="#3ac06a" fg="#fff" size={64} /></Pop>
      </Cam>
    );
  },
  // 7 a primeira coisa: ganhar dinheiro
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.4} cy={900}>
      <QuartoTeo t={t} manha={false} />
      <Pers k={TEO_SEM} t={t} x={540} y={1760} h={760} movs={[['pensar', t0], ['gargalhar', W(7, 'dinheiro') - 0.2]]} seed={1} />
      {t > W(7, 'dinheiro') && [0, 1, 2, 3, 4].map((i) => { const k = ((t - W(7, 'dinheiro')) * 0.8 + i / 5) % 1; return <Svg key={i}><g transform={`translate(${200 + i * 170} ${300 + k * 900}) rotate(${k * 200})`}><rect x={-50} y={-26} width={100} height={52} rx={6} fill="#7ad08a" stroke="#1a1520" strokeWidth={3} /><text x={0} y={10} textAnchor="middle" fontFamily="Arial Black" fontSize={26} fill="#1a6a3a">R$</text></g></Svg>; })}
    </Cam>
  ),
  // 8 torneio de luta-livre: 3 minutos, mil reais
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1000}>
      <Ginasio t={t} />
      <Placar t={t} t0={t1 + 10} />
      <Pers k={TEO_LUTA} t={t} x={540} y={1500} h={640} movs={[['entrar', t0 + 0.3, 0.6], ['bravo', t0 + 1]]} seed={1} />
      <Pop t={t} at={W(8, 'tres')} x={540} y={560}><Placa texto={'AGUENTE 3 MINUTOS\nGANHE R$ 1.000'} bg="#d1495b" fg="#fff" size={52} /></Pop>
    </Cam>
  ),
  // 9 aguentou 30 segundos; o outro é que não aguentou
  ({ t, t0, t1 }) => {
    const n = W(9, 'aguentou');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
        <Ginasio t={t} />
        <Placar t={t} t0={t0} />
        <Pers k={BRUTAO} t={t} x={700} y={1500} h={720} movs={[['bravo', t0], ['deitar', n - 0.4]]} seed={4} flip />
        <Pers k={TEO_LUTA} t={t} x={360} y={1510} h={620} movs={[['parado', t0], ['correr', t0 + 1.2, 0.6], ['pular', n]]} over={(p) => ({ x: Math.min(p.x, 60) })} seed={1} />
        <Onoma t={t} at={n - 0.4} x={760} y={900} txt="POW!" />
      </Cam>
    );
  },
  // 10 Seu Arnaldo paga só cem
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1100}>
      <Escritorio t={t} />
      <Pers k={ARNALDO} t={t} x={680} y={1640} h={680} movs={[['parado', t0], ['segurar', W(10, 'cem') - 0.4, 1.2], ['gargalhar', W(10, 'bispo') - 0.3]]} seed={5} flip />
      <Pers k={{ ...TEO_SEM, roupa: '#d1495b' }} t={t} x={300} y={1680} h={620} movs={[['parado', t0], ['bravo', W(10, 'cem')]]} seed={1} />
      <Pop t={t} at={W(10, 'cem')} x={520} y={960}><Placa texto="R$ 100" bg="#7ad08a" size={60} /></Pop>
      <Pop t={t} at={W(10, 'reclama')} x={600} y={560}><Balao texto="Reclama com o bispo!" /></Pop>
    </Cam>
  ),
  // 11 o ladrão de capacete vermelho passa com o caixa
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1100}>
      <Escritorio t={t} />
      <Pers k={{ ...LADRAO, item: 'maleta' }} t={t} x={andando(t, W(11, 'ladrao') - 0.3, -150, 420)} y={1700} h={660} movs={[['correr', t0]]} over={{ x: 0 }} seed={6} />
      <Pers k={ARNALDO} t={t} x={860} y={1640} h={680} movs={[['parado', t0], ['aflito', W(11, 'ladrao') + 0.4]]} seed={5} flip />
      <Pop t={t} at={W(11, 'capacete')} x={400} y={700}><Placa texto="CAPACETE VERMELHO" bg="#d1283b" fg="#fff" size={44} /></Pop>
    </Cam>
  ),
  // 12 podia ter parado; abriu a porta e deixou passar
  ({ t, t0, t1 }) => {
    const p = W(12, 'abri');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1100}>
        <RuaNoite t={t} />
        <Svg><rect x={420} y={1040} width={240} height={440} fill="#1a1a1e" stroke="#1a1520" strokeWidth={6} /><g transform={`translate(420 1040) scale(${1 - 0.8 * clamp((t - p) / 0.4)} 1)`}><rect width={240} height={440} fill="#8a5a32" stroke="#1a1520" strokeWidth={6} /></g></Svg>
        <Sentido t={t} x={300} y={1700 - 640 * 0.63} forca={t < p ? 1 : 0.3} />
        <Pers k={TEO_SEM} t={t} x={300} y={1700} h={640} movs={[['parado', t0], ['ombros', p + 0.2]]} over={{ pupila: [1, 0] }} seed={1} />
        <Pers k={{ ...LADRAO, item: 'maleta' }} t={t} x={andando(t, p + 0.5, 1200, -480)} y={1720} h={660} movs={[['correr', t0]]} over={{ x: 0 }} seed={6} flip />
      </Cam>
    );
  },
  // 13 "Não é problema meu."
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.5} cy={900}>
      <RuaNoite t={t} />
      <Pers k={TEO_SEM} t={t} x={540} y={1760} h={860} movs={[['ombros', t0]]} seed={1} />
      <Pop t={t} at={t0 + 0.1} x={540} y={520}><Balao texto="Não é problema meu." /></Pop>
    </Cam>
  ),
  // 14 a barraca da Vó Lurdes no chão
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1200}>
      <Feira t={t} caida={1} />
      <Pers k={TEO_SEM} t={t} x={andando(t, t0, 1100, -200)} y={1720} h={620} movs={[['correr', t0, 1.2], ['aflito', t0 + 1.2]]} over={(p) => (t < t0 + 1.2 ? { x: 0 } : {})} seed={1} flip />
    </Cam>
  ),
  // 15 o motoqueiro de capacete vermelho passou em cima, fugindo da polícia
  ({ t, t0, t1 }) => {
    const x = andando(t, t0, -500, 520);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1200}>
        <Feira t={t} caida={clamp((t - t0 - 1.4) / 0.4)} />
        <div style={{ position: 'absolute', left: x, top: 1440, transform: 'scale(1.2)' }}><Moto /></div>
        <Pers k={LADRAO} t={t} x={x + 230} y={1660} h={600} movs={[['parado', t0]]} over={{ sentado: 1, maoE: [-30, -210], maoD: [80, -210] }} seed={6} />
        <Pop t={t} at={W(15, 'vermelho')} x={540} y={480}><Placa texto="POLÍCIA!" bg="#1c3d6e" fg="#fff" size={56} /></Pop>
        {t > t0 + 1.4 && <div style={{ position: 'absolute', inset: 0, background: Math.sin(t * 14) > 0 ? '#ff3b3b' : '#3b7bff', opacity: 0.1 }} />}
      </Cam>
    );
  },
  // 16 a avó na calçada, com o braço machucado
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.25} cy={1150}>
      <Feira t={t} caida={1} />
      <Pers k={VO} t={t} x={420} y={1700} h={600} movs={[['sentar', t0]]} over={{ maoD: [40, -220], frenteD: true, sobrTriste: true, boca: 'triste' }} seed={7} />
      <Svg><path d="M420 1430 q60 40 120 0" stroke="#fffaf0" strokeWidth={28} fill="none" /></Svg>
      <Pers k={TEO_SEM} t={t} x={760} y={1720} h={640} movs={[['aflito', t0]]} seed={1} flip />
    </Cam>
  ),
  // 17 era o mesmo ladrão
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.6} cy={900}>
      <Feira t={t} caida={1} />
      <Pers k={TEO_SEM} t={t} x={540} y={1780} h={880} movs={[['parado', t0], ['chorar', W(17, 'deixei')]]} over={{ olho: 1.2, sobrTriste: true }} seed={1} />
      <Pop t={t} at={W(17, 'mesmo')} x={540} y={420}><div style={{ width: 200, height: 160, borderRadius: '100px 100px 30px 30px', background: '#d1283b', border: '8px solid #1a1520' }} /></Pop>
    </Cam>
  ),
  // 18 no hospital, a avó segura a mão dele
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1100}>
      <Hospital t={t} />
      <Pers k={VO} t={t} x={420} y={1360} h={560} movs={[['parado', t0]]} over={{ sentado: 1, maoD: [140, -150], boca: 'sorriso', sobrTriste: true }} seed={7} />
      <Pers k={TEO_SEM} t={t} x={740} y={1720} h={640} movs={[['parado', t0]]} over={{ maoE: [-150, -200], sobrTriste: true, boca: 'triste' }} seed={1} flip />
    </Cam>
  ),
  // 19 "Quem pode ajudar e não ajuda, também escolhe."
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.45} cx={480} cy={1000}>
      <Hospital t={t} />
      <Pers k={VO} t={t} x={420} y={1360} h={560} movs={[['sentarFalar', t0]]} over={{ sobrTriste: true }} seed={7} />
      <Pop t={t} at={W(19, 'ajudar')} x={500} y={620}><Placa texto={'"QUEM PODE AJUDAR\nE NÃO AJUDA,\nTAMBÉM ESCOLHE."'} bg="#fff6c8" size={44} /></Pop>
    </Cam>
  ),
  // 20 costura a máscara verde na máquina da avó
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={1050}>
      <Costura t={t} pronta={clamp((t - W(20, 'verde')) / 0.8)} />
      <Pers k={TEO_SEM} t={t} x={300} y={1700} h={640} movs={[['sentar', t0]]} over={{ maoE: [-30, -230], maoD: [90, -230], pupila: [0.8, 0.4], boca: 'neutra', sobr: -0.4 }} seed={1} />
    </Cam>
  ),
  // 21 sobe no prédio mais alto e espera
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1} cy={1000}>
      <Telhado t={t} />
      <Pers k={TEO_HEROI} t={t} x={540} y={1300} h={620} movs={[['entrar', W(21, 'subi'), 0.6], ['olharLados', W(21, 'subi') + 0.6]]} seed={1} />
      <Brilho t={t} at={W(21, 'subi')} x={540} y={1000} r={140} n={10} />
    </Cam>
  ),
  // 22 o capacete vermelho aparece de novo — ele já estava esperando
  ({ t, t0, t1 }) => {
    const e = W(22, 'esperando');
    const x = andando(t, t0, -500, 400);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1150}>
        <RuaNoite t={t} />
        {t < e && <><div style={{ position: 'absolute', left: x, top: 1440, transform: 'scale(1.2)' }}><Moto /></div><Pers k={LADRAO} t={t} x={x + 230} y={1660} h={600} movs={[['parado', t0]]} over={{ sentado: 1, maoE: [-30, -210], maoD: [80, -210] }} seed={6} /></>}
        {t >= e && <Pers k={LADRAO} t={t} x={720} y={1720} h={640} movs={[['susto', e]]} seed={6} flip />}
        <Pers k={TEO_HEROI} t={t} x={360} y={1720 - Math.max(0, 900 * (1 - clamp((t - e + 0.4) / 0.4)))} h={660} movs={[['parado', t0], ['bravo', e + 0.1]]} seed={1} />
        <Onoma t={t} at={e} x={540} y={800} txt="PEGO!" cor="#3ac06a" />
      </Cam>
    );
  },
  // 23 na escola, ainda o Téo invisível
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1150}>
      <Escola t={t} />
      {ALUNOS.slice(0, 2).map((k, i) => <Pers key={i} k={k} t={t} x={andando(t, t0, 1200 + i * 280, -170)} y={1700} h={620} movs={[['andar', t0]]} over={{ x: 0 }} seed={i + 10} flip />)}
      <Pers k={BIA} t={t} x={760} y={1720} h={620} movs={[['parado', t0]]} over={{ pupila: [-0.8, 0] }} seed={8} flip />
      <Pers k={{ ...TEO, item: 'livro' }} t={t} x={300} y={1720} h={640} movs={[['parado', t0]]} over={{ boca: 'sorriso', pisca: t > W(23, 'invisivel') ? 1 : 0, pupila: [0.4, 0] }} seed={1} />
    </Cam>
  ),
  // 24 lá em cima, a cidade tem um nome novo para ele
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <Telhado t={t} grafite={t > W(24, 'nome') - 0.2} />
      <Pers k={TEO_HEROI} t={t} x={540} y={1300} h={600} movs={[['parado', t0], ['comemorar', W(24, 'novo'), 1.4]]} seed={1} />
      <Brilho t={t} at={W(24, 'nome')} x={540} y={1520} r={200} n={12} />
    </Cam>
  ),
  // 25 quando alguém grita por socorro, ele escuta primeiro
  ({ t, t0, t1 }) => {
    const s = W(25, 'socorro');
    const ult = TL.WORDS[TL.WORDS.length - 1].t1;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.5} cy={900}>
        <Telhado t={t} />
        <Pers k={TEO_HEROI} t={t} x={540} y={1700} h={860} movs={[['parado', t0], ['olharLados', s - 0.3, 1.2], ['susto', W(25, 'primeiro') - 0.2]]} seed={1} />
        {t > s && <Sentido t={t} x={540} y={1700 - 860 * 0.63} />}
        <Pop t={t} at={s} x={540} y={420}><Placa texto="SOCORRO!" bg="#fffaf0" fg="#d1283b" size={60} /></Pop>
        {t > ult + 0.5 && <div style={{ position: 'absolute', inset: 0, background: '#0a1a10', opacity: clamp((t - ult - 0.5) / 0.4) }} />}
        {t > ult + 0.7 && <div style={{ position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', fontFamily: '"Arial Black", Arial', fontSize: 84, color: '#3ac06a', WebkitTextStroke: '8px #0a1a10', paintOrder: 'stroke fill', opacity: clamp((t - ult - 0.7) / 0.3) }}>O GAROTO<br />LAGARTIXA</div>}
      </Cam>
    );
  },
];

// ---------- Efeitos sonoros (biblioteca do projeto + sintetizados em public/sfx-lagartixa) ----------
const sfx = (): Sfx[] => {
  const amb = (f: string, de: number, ate: number, vol: number): Sfx => [f, ini(de), vol, ini(ate + 1) - ini(de) + 0.3, true];
  return [
    amb('sfx-flutua/murmurio.mp3', 0, 1, 0.3),
    ['sfx-lagartixa/borbulha.mp3', ini(2), 0.4, ini(4) - ini(2), true],
    ['sfx-lagartixa/vidro-tampa.mp3', W(2, 'lagartixa') - 0.4, 0.5, 1.5],
    ['sfx-eleven/susto.mp3', W(2, 'lagartixa') + 0.2, 0.4],
    ['sfx-lagartixa/mordida.mp3', W(3, 'mordeu') - 0.05, 0.7, 1],
    ['sfx-q4/relogios.mp3', ini(4), 0.25, ini(5) - ini(4)],
    ['sfx-lagartixa/despertador.mp3', W(4, 'grudado') - 0.6, 0.45, 2],
    ['sfx-eleven/whoosh.mp3', W(4, 'teto') - 0.2, 0.5],
    ['sfx-lagartixa/mosca.mp3', W(5, 'mosca') - 0.5, 0.45, 3],
    amb('sfx-flutua/rua.mp3', 6, 6, 0.3),
    ['sfx-lagartixa/sentido.mp3', W(6, 'perigo') - 0.2, 0.55, 2],
    ['sfx-eleven/brilho.mp3', W(7, 'dinheiro'), 0.4],
    amb('sfx-flutua/torcida.mp3', 8, 9, 0.35),
    ['sfx-farol/sino.mp3', W(8, 'tres'), 0.45, 2],
    ['sfx-lagartixa/soco.mp3', W(9, 'aguentou') - 0.45, 0.7, 1],
    ['sfx-flutua/pisao.mp3', W(9, 'aguentou') - 0.1, 0.6, 1.5],
    ['sfx-q4/relogios.mp3', ini(10), 0.2, ini(11) - ini(10)],
    ['sfx-flutua/risada.mp3', W(10, 'bispo') - 0.2, 0.4, 2],
    ['sfx-eleven/whoosh.mp3', W(11, 'ladrao') - 0.1, 0.5],
    ['sfx-farol/passos.mp3', W(11, 'ladrao') - 0.2, 0.45, 2],
    amb('sfx-farol/noite-rua.mp3', 12, 13, 0.3),
    ['sfx-lagartixa/sentido.mp3', ini(12), 0.45, 2],
    ['sfx-q4/cofre.mp3', W(12, 'abri') - 0.1, 0.3, 1.5],
    ['sfx-farol/passos.mp3', W(12, 'abri') + 0.4, 0.45, 2],
    amb('sfx-flutua/rua.mp3', 14, 17, 0.25),
    ['sfx-lagartixa/moto.mp3', ini(15), 0.55, 3],
    ['sfx-q4/sirenes.mp3', ini(15) + 0.6, 0.35, 4],
    ['sfx-flutua/crac.mp3', ini(15) + 1.4, 0.6, 1.5],
    ['sfx-eleven/coracao.mp3', ini(17), 0.35, ini(18) - ini(17)],
    ['sfx-lagartixa/monitor.mp3', ini(18), 0.3, ini(20) - ini(18), true],
    ['sfx-lagartixa/costura.mp3', ini(20), 0.45, ini(21) - ini(20), true],
    amb('sfx-farol/noite-rua.mp3', 21, 22, 0.35),
    ['sfx-eleven/brilho.mp3', W(21, 'subi'), 0.4],
    ['sfx-lagartixa/moto.mp3', ini(22), 0.5, 3],
    ['sfx-eleven/boom.mp3', W(22, 'esperando'), 0.55],
    amb('sfx-flutua/murmurio.mp3', 23, 23, 0.25),
    amb('sfx-farol/noite-rua.mp3', 24, 25, 0.3),
    ['sfx-eleven/brilho.mp3', W(24, 'nome'), 0.45],
    ['sfx-lagartixa/sentido.mp3', W(25, 'socorro') - 0.1, 0.55, 2],
    ['sfx-eleven/whoosh.mp3', W(25, 'primeiro'), 0.5],
    ['sfx-eleven/boom.mp3', TL.WORDS[TL.WORDS.length - 1].t1 + 0.6, 0.5],
  ];
};

const comVinheta = (cs: Cena[]): Cena[] => cs.map((C, i) => (p: P) => <>{C(p)}{[12, 13, 21, 22, 24, 25].indexOf(i) >= 0 && <Noite k={0.15} />}<Vinheta forca={0.4} /></>);
export const GarotoLagartixa = () => <FilmeMad tl={TL} cenas={comVinheta(CENAS)} voz="voz-lagartixa.mp3" sfx={sfx()} ganhoSfx={TL.COM_VOZ ? 0.42 : 1.12} />; // sem voz os efeitos sobem
export const DURACAO_LAGARTIXA = TL.END;
