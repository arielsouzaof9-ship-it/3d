// "O Homem de Lata": origem de herói de armadura com os PERSONAGENS MAD ARTICULADOS. Sem áudio (só legendas).
import { CSSProperties } from 'react';
import { Svg } from './cenarios';
import { Bateria, Bobina, Caixa, Chamas, Cidade, clamp, Coletiva, Estrada, Podio, EstudioTV, Explosao, Faiscas, JornalLT, Mina, Porao, Suv, TelhadoLT } from './cenarios-lata';
import { Vinheta } from './cenarios-ilha';
import { Balao, Brilho, Cam, Placa, Pop } from './FiosBrancos';
import { Ator, Mov } from './FiosBrancosArticulado';
import { Cena, FilmeMad, P } from './FilmeMad';
import { Pose } from './Rig';
import { TL_LATA as TL } from './timeline-lata';

// ---------- Elenco ----------
const VICENTE = { tipo: 'adulto', pele: '#e8c09a', roupa: '#2a2a30', calca: '#2a2a30', gravata: '#d1283b', cabelo: 'topete', corCabelo: '#1a120c', sapato: '#1a1a1e' };
const PRESO = { ...VICENTE, roupa: '#e8e2d0', calca: '#5a5a66', gravata: undefined, bobina: '#5ad8ff', sapato: '#3a2418' };
const LATA = { tipo: 'adulto', corpo: 'gordo', pele: '#9aa0aa', roupa: '#9aa0aa', calca: '#7a828e', mascara: 'heroi', corMascara: '#a8b0b8', detalheMascara: '#6a727e', bobina: '#5ad8ff', sapato: '#5a626e' };
const NOVA = { tipo: 'adulto', pele: '#8a929e', roupa: '#c8302c', calca: '#c8302c', manga: '#c8302c', mascara: 'heroi', corMascara: '#c8302c', detalheMascara: '#e8b830', bobina: '#5ad8ff', sapato: '#e8b830', colete: '#e8b830' }; // vermelha, dourada e cinza
const OTACILIO = { tipo: 'idoso', pele: '#c98a5a', roupa: '#8a7a5a', calca: '#5a5a66', cabelo: 'careca', corCabelo: '#d6d6d6', oculos: true, barba: true, corBarba: '#d6d6d6', sapato: '#3a2418' };
const CLARA = { tipo: 'adulto', pele: '#f6e3d3', roupa: '#5a8ac0', saia: '#2c3346', cabelo: 'chanel', corCabelo: '#6b3e1f', brinco: '#f2c94c', sapato: '#2c3346' };
const MOREIRA = { tipo: 'adulto', corpo: 'gordo', pele: '#f6e3d3', roupa: '#3a3a44', calca: '#3a3a44', gravata: '#c9a14a', cabelo: 'careca', corCabelo: '#d6d6d6', barba: true, corBarba: '#9a9aa6', sapato: '#1a1a1e' };
const MOREIRA_ARM = { tipo: 'adulto', corpo: 'gordo', pele: '#4a4a52', roupa: '#4a4a52', calca: '#3a3a40', mascara: 'heroi', corMascara: '#4a4a52', detalheMascara: '#d1283b', bobina: '#ff4d4d', sapato: '#2a2a30' };
const LOBO = { tipo: 'adulto', corpo: 'gordo', pele: '#c98a5a', roupa: '#5a5a3a', calca: '#3a3a2a', chapeu: 'boina', corChapeu: '#2a2a20', cabelo: 'curto', corCabelo: '#1a1a1e', barba: true, corBarba: '#1a1a1e', oculosEscuros: true, sapato: '#1a1a1e' };
const GUARDA = { tipo: 'adulto', pele: '#8d5a3b', roupa: '#5a5a3a', calca: '#3a3a2a', chapeu: 'bone', corChapeu: '#3a3a2a', cabelo: 'curto', corCabelo: '#1a1a1e', sapato: '#1a1a1e' };

// ---------- Atalhos ----------
type A = { k: object; t: number; x: number; y: number; h?: number; movs: Mov[]; over?: Partial<Pose> | ((p: Pose) => Partial<Pose>); seed?: number; flip?: boolean; op?: number; style?: CSSProperties };
const Pers = ({ op = 1, style, ...a }: A) => <Ator {...a} style={{ opacity: op, ...style }} />;
const W = TL.W;
const andando = (t: number, t0: number, x0: number, v: number) => x0 + v * Math.max(0, t - t0);
const Onoma = ({ t, at, x, y, txt, cor = '#ffd23a', size = 110 }: { t: number; at: number; x: number; y: number; txt: string; cor?: string; size?: number }) => (
  t > at - 0.05 && t < at + 1 ? <Pop t={t} at={at} x={x} y={y}><div style={{ fontFamily: '"Arial Black", Arial', fontSize: size, color: cor, WebkitTextStroke: '10px #1a1520', paintOrder: 'stroke fill', transform: 'rotate(-8deg)', opacity: 1 - clamp((t - at - 0.7) / 0.3) }}>{txt}</div></Pop> : null
);
const Flash = ({ t, at, cor = '#ffffff' }: { t: number; at: number; cor?: string }) => { const d = t - at; return d < 0 || d > 0.4 ? null : <div style={{ position: 'absolute', inset: 0, background: cor, opacity: 0.7 * (1 - d / 0.4) }} />; };
const Noite = ({ k = 0.25 }: { k?: number }) => <div style={{ position: 'absolute', inset: 0, background: '#0a0a22', opacity: k, pointerEvents: 'none' }} />;

// ---------- Cenas (uma por frase) ----------
const CENAS: Cena[] = [
  // 0 Vicente Lima, 30 anos, o mais rico do país
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1150}>
      <Cidade t={t} />
      <Pers k={VICENTE} t={t} x={540} y={1720} h={720} movs={[['entrar', t0 + 0.2, 0.6], ['acenar', t0 + 0.8, 1.6], ['parado', t0 + 2.4]]} over={{ boca: 'riso', sobr: 0.5 }} seed={1} />
      {Array.from({ length: 6 }, (_, i) => { const k = ((t - t0) * 0.6 + i / 6) % 1; return <Svg key={i}><g transform={`translate(${120 + i * 170} ${300 + k * 1100}) rotate(${k * 300})`}><rect x={-46} y={-24} width={92} height={48} rx={6} fill="#7ad08a" stroke="#1a1520" strokeWidth={3} /><text x={0} y={9} textAnchor="middle" fontFamily="Arial Black" fontSize={24} fill="#1a6a3a">R$</text></g></Svg>; })}
      <Pop t={t} at={W(0, 'vicente')} x={540} y={900}><Placa texto="VICENTE LIMA, 30" bg="#1a1a1e" fg="#f2c94c" size={54} /></Pop>
    </Cam>
  ),
  // 1 LimaTech fabrica drones
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={700}>
      <Cidade t={t} drones={4} />
      <Pop t={t} at={W(1, 'drones')} x={540} y={1250}><Placa texto="OS DRONES MAIS PERIGOSOS" bg="#d1283b" fg="#fff" size={46} /></Pop>
    </Cam>
  ),
  // 2 adorava aparecer na televisão
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={900}>
      <EstudioTV t={t} />
      <Pers k={VICENTE} t={t} x={540} y={1240} h={760} movs={[['falar', t0], ['rir', t0 + 1.4]]} over={{ pisca: Math.sin(t * 2) > 0.95 ? 1 : 0 }} seed={1} />
    </Cam>
  ),
  // 3 o carro foi atacado
  ({ t, t0, t1 }) => {
    const b = W(3, 'atacado');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1250}>
        <Estrada t={t} />
        <Svg><Suv x={540 + 8 * Math.sin(t * 20) * (t > b ? 1 : 0)} y={1500} t={t} /><Explosao x={640} y={1360} k={(t - b) / 0.9} s={1.4} /></Svg>
        <Onoma t={t} at={b} x={540} y={900} txt="BUM!" />
        <Flash t={t} at={b} cor="#fff3c8" />
      </Cam>
    );
  },
  // 4 acorda preso na mina, metal perto do coração
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={1200}>
      <Mina t={t} />
      <Pers k={{ ...PRESO, bobina: undefined }} t={t} x={540} y={1620} h={680} movs={[['deitar', t0 - 1], ['susto', W(4, 'coracao') - 0.3]]} seed={1} />
      <Pop t={t} at={W(4, 'coracao')} x={540} y={800}><Placa texto="METAL PERTO DO CORAÇÃO" bg="#d1283b" fg="#fff" size={44} /></Pop>
    </Cam>
  ),
  // 5 o Doutor Otacílio salva
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1150}>
      <Mina t={t} />
      <Pers k={{ ...PRESO, bobina: undefined }} t={t} x={330} y={1700} h={640} movs={[['sentar', t0]]} over={{ pupila: [0.8, -0.3], sobrTriste: true }} seed={1} />
      <Pers k={OTACILIO} t={t} x={760} y={1700} h={620} movs={[['entrar', W(5, 'otacilio') - 0.3, 0.6], ['acenar', W(5, 'otacilio') + 0.3, 1.4], ['falar', W(5, 'otacilio') + 1.7]]} seed={3} flip />
      <Pop t={t} at={W(5, 'otacilio')} x={760} y={900}><Placa texto="DOUTOR OTACÍLIO" bg="#fffaf0" size={48} /></Pop>
    </Cam>
  ),
  // 6 bobina de cobre ligada numa bateria de carro
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.25} cy={1150}>
      <Mina t={t} oficina />
      <Svg><Bateria x={760} y={1560} s={1.1} /><path d={`M712 1478 C640 1300 600 1260 ${540} ${1700 - 660 * 0.48}`} stroke="#d1283b" strokeWidth={8} fill="none" /><path d={`M808 1478 C760 1280 640 1250 ${560} ${1700 - 660 * 0.48}`} stroke="#1a1a1e" strokeWidth={8} fill="none" /></Svg>
      <Pers k={{ ...PRESO, bobina: t > W(6, 'bobina') ? '#5ad8ff' : undefined }} t={t} x={540} y={1700} h={660} movs={[['sentar', t0]]} over={{ pupila: [0, 0.8] }} seed={1} />
      <Brilho t={t} at={W(6, 'bobina')} x={540} y={1700 - 660 * 0.48} r={110} n={10} />
      <Pop t={t} at={W(6, 'bateria')} x={760} y={1300}><Placa texto="12V" bg="#f2c94c" size={44} /></Pop>
    </Cam>
  ),
  // 7 enquanto ela girasse, o metal não chegava no coração
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={960}>
      <Svg><rect width={1080} height={1920} fill="#0e1a2a" /></Svg>
      <Svg><Bobina x={540} y={900} r={200} t={t} /><g transform={`translate(${540 + 340 - 30 * Math.abs(Math.sin(t * 2))} 900) rotate(20)`}><path d="M0 -30 L60 0 L0 30 L-20 0 z" fill="#6a727e" stroke="#1a1520" strokeWidth={5} /></g></Svg>
      <Pop t={t} at={W(7, 'girasse')} x={540} y={1360}><Placa texto="GIRANDO = VIVO" bg="#5ad8ff" size={52} /></Pop>
    </Cam>
  ),
  // 8 o Lobo quer um drone em 15 dias
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1150}>
      <Mina t={t} />
      <Pers k={LOBO} t={t} x={560} y={1700} h={700} movs={[['bravo', t0], ['apontar', W(8, 'quinze') - 0.3, 1.4]]} seed={4} />
      <Pers k={GUARDA} t={t} x={190} y={1680} h={600} movs={[['parado', t0]]} over={{ sobr: -0.6, boca: 'neutra' }} seed={5} />
      <Pers k={GUARDA} t={t} x={900} y={1680} h={600} movs={[['parado', t0]]} over={{ sobr: -0.6, boca: 'neutra' }} seed={6} flip />
      <Pop t={t} at={W(8, 'quinze')} x={540} y={800}><Placa texto="15 DIAS" bg="#d1283b" fg="#fff" size={80} /></Pop>
    </Cam>
  ),
  // 9 as armas deles tinham a logomarca da LimaTech
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={1200}>
      <Mina t={t} />
      <Svg>{[[260, 1400], [470, 1420], [680, 1400], [370, 1260], [580, 1260]].map(([x, y], i) => <Caixa key={i} x={x} y={y} s={0.95} />)}</Svg>
      <Pers k={PRESO} t={t} x={880} y={1720} h={640} movs={[['parado', t0], ['aflito', W(9, 'logomarca') - 0.2]]} over={{ pupila: [-1, 0.2] }} seed={1} flip />
      <Brilho t={t} at={W(9, 'logomarca')} x={470} y={1420} r={130} />
    </Cam>
  ),
  // 10 em vez de um drone, outra coisa
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1050}>
      <Mina t={t} oficina />
      <Svg><Faiscas x={600} y={1110} t={t} /></Svg>
      <Pers k={PRESO} t={t} x={300} y={1720} h={640} movs={[['pensar', t0], ['apontar', W(10, 'outra') - 0.3]]} seed={1} />
      <Pers k={OTACILIO} t={t} x={800} y={1720} h={600} movs={[['sim', t0 + 0.5]]} over={{ boca: 'sorriso' }} seed={3} flip />
      <Pop t={t} at={W(10, 'outra')} x={480} y={600}><Placa texto="?" bg="#f2c94c" size={90} /></Pop>
    </Cam>
  ),
  // 11 uma armadura de caixa d'água, porta de geladeira e peça de carro
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1100}>
      <Mina t={t} oficina />
      <Pers k={LATA} t={t} x={540} y={1720} h={800} movs={[['entrar', W(11, 'armadura') - 0.2, 0.6], ['bravo', W(11, 'armadura') + 0.4]]} seed={1} />
      <Brilho t={t} at={W(11, 'armadura')} x={540} y={1300} r={200} n={12} />
      <Pop t={t} at={W(11, 'dagua')} x={240} y={760}><Placa texto="CAIXA D'ÁGUA" bg="#fffaf0" size={40} /></Pop>
      <Pop t={t} at={W(11, 'geladeira')} x={830} y={900}><Placa texto="GELADEIRA" bg="#fffaf0" size={40} /></Pop>
      <Pop t={t} at={W(11, 'carro')} x={260} y={1060}><Placa texto="PEÇA DE CARRO" bg="#fffaf0" size={40} /></Pop>
    </Cam>
  ),
  // 12 na noite da fuga, os guardas desconfiaram
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1150}>
      <Mina t={t} noite />
      <Noite k={0.45} />
      {[260, 820].map((x, i) => <Pers key={i} k={GUARDA} t={t} x={x} y={1700} h={640} movs={[['olharLados', t0 + i * 0.4]]} over={{ sobr: -0.5, boca: 'neutra' }} seed={5 + i} flip={i === 1} />)}
      <Svg>{[260, 820].map((x, i) => { const a = Math.sin(t * 1.8 + i * 2) * 0.5; return <path key={i} d={`M${x + (i ? -60 : 60)} 1440 L${x + (i ? -60 : 60) + Math.cos(a + (i ? Math.PI : 0)) * 700} ${1440 + Math.sin(a) * 200 - 100} L${x + (i ? -60 : 60) + Math.cos(a + (i ? Math.PI : 0)) * 700} ${1440 + Math.sin(a) * 200 + 100} z`} fill="#fff6c8" opacity={0.18} />; })}</Svg>
      <Pop t={t} at={W(12, 'desconfiaram')} x={540} y={800}><Placa texto="!" bg="#d1283b" fg="#fff" size={90} /></Pop>
    </Cam>
  ),
  // 13 Otacílio fica para trás segurando a porta
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={1150}>
      <Mina t={t} noite />
      <Noite k={0.35} />
      <Svg><rect x={560} y={980} width={300} height={500} fill="#4a4a52" stroke="#1a1520" strokeWidth={8} />{Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${560 + i * 60} 980 v500`} stroke="#2a2a30" strokeWidth={10} />)}</Svg>
      <Pers k={OTACILIO} t={t} x={700} y={1700} h={620} movs={[['parado', t0]]} over={{ maoE: [-90, -290], maoD: [90, -290], sobrTriste: true, boca: 'sorriso' }} seed={3} />
      <Pers k={LATA} t={t} x={240} y={1720} h={700} movs={[['nervoso', t0]]} seed={1} />
      <Pop t={t} at={W(13, 'vida') - 0.8} x={560} y={620}><Placa texto={'"NÃO DESPERDIÇA\nA SUA VIDA, GAROTO."'} bg="#fff6c8" size={44} /></Pop>
    </Cam>
  ),
  // 14 sai com fogo nas botas, voa e cai no mato
  ({ t, t0, t1 }) => {
    const u = t - t0, dur = t1 - t0;
    const k = clamp(u / (dur * 0.7));
    const y = 1700 - 1500 * Math.sin(Math.PI * k);
    const x = 300 + 500 * k;
    const caiu = k >= 1;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1} cy={1000}>
        <Svg><rect width={1080} height={1920} fill="#141a33" /><circle cx={820} cy={300} r={70} fill="#f4efd8" />{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 137) % 1080} cy={(i * 251) % 800} r={2} fill="#fff" opacity={0.5} />)}<path d="M0 1480 Q300 1380 540 1440 T1080 1420 V1920 H0 z" fill="#1e3a24" />{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={i * 120 + 40} cy={1470 - (i % 3) * 20} r={70} fill="#2a5a32" />)}<path d="M80 1500 Q200 1300 320 1500 z" fill="#3a2e26" /></Svg>
        {!caiu && <Svg><Chamas x={x - 30} y={y + 10} t={t} /><Chamas x={x + 30} y={y + 10} t={t} /></Svg>}
        <Pers k={LATA} t={t} x={x} y={caiu ? 1560 : y} h={560} movs={caiu ? [['deitar', t0 + dur * 0.7]] : [['comemorar', t0]]} seed={1} />
        <Onoma t={t} at={t0 + dur * 0.7} x={760} y={1200} txt="CRASH!" />
      </Cam>
    );
  },
  // 15 anuncia: a LimaTech não fabrica mais armas
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <Coletiva t={t} />
      <Pers k={{ ...VICENTE, bobina: '#5ad8ff' }} t={t} x={540} y={1500} h={760} movs={[['falar', t0], ['nao', W(15, 'armas') - 0.2, 1.2]]} seed={1} />
      <Podio />
      <Pop t={t} at={W(15, 'armas')} x={540} y={380}><Placa texto="SEM ARMAS" bg="#d1283b" fg="#fff" size={80} /></Pop>
    </Cam>
  ),
  // 16 o Moreira sorri para as câmeras e não fala nada
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.35} cy={900}>
      <Coletiva t={t} />
      <Pers k={MOREIRA} t={t} x={540} y={1560} h={900} movs={[['parado', t0]]} over={(p) => ({ boca: 'sorriso', pupila: [t > W(16, 'nada') - 0.2 ? -1 : 0, 0], sobr: t > W(16, 'nada') - 0.2 ? -0.8 : 0 })} seed={7} />
      <Pop t={t} at={W(16, 'moreira')} x={540} y={420}><Placa texto="SEU MOREIRA, SÓCIO" bg="#1a1a1e" fg="#c9a14a" size={46} /></Pop>
    </Cam>
  ),
  // 17 no porão, a armadura nova, prateada e azul
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <Porao t={t} />
      <Pers k={NOVA} t={t} x={540} y={1330} h={680} movs={[['parado', t0]]} over={{ olho: 0.05, maoE: [-110, -150], maoD: [110, -150] }} seed={2} op={clamp((t - W(17, 'nova') + 0.3) / 0.6)} />
      <Pers k={{ ...VICENTE, roupa: '#e8e2d0', gravata: undefined, bobina: '#5ad8ff' }} t={t} x={200} y={1720} h={620} movs={[['parado', t0], ['comemorar', W(17, 'azul') - 0.2, 1.4]]} seed={1} />
      <Pers k={CLARA} t={t} x={880} y={1720} h={600} movs={[['aplaudir', W(17, 'azul') - 0.2, 1.6], ['parado', W(17, 'azul') + 1.4]]} seed={8} flip />
      <Svg><Faiscas x={420} y={1000} t={t} n={10} cor="#5ad8ff" /></Svg>
    </Cam>
  ),
  // 18 a Clara acha o recibo: o Moreira vendia armas para o Lobo
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1050}>
      <Porao t={t} />
      <Pers k={{ ...CLARA, item: 'carta' }} t={t} x={420} y={1720} h={680} movs={[['segurar', t0], ['susto', W(18, 'moreira') - 0.2]]} seed={8} />
      <Pers k={{ ...VICENTE, roupa: '#e8e2d0', gravata: undefined, bobina: '#5ad8ff' }} t={t} x={820} y={1720} h={640} movs={[['parado', t0], ['bravo', W(18, 'moreira')]]} seed={1} flip />
      <Pop t={t} at={W(18, 'recibo')} x={540} y={640}><Placa texto={'RECIBO\nMOREIRA → LOBO'} bg="#fffaf0" fg="#d1283b" size={56} /></Pop>
    </Cam>
  ),
  // 19 ele rouba a bobina e constrói uma armadura duas vezes maior
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1} cy={1100}>
      <TelhadoLT t={t} />
      <Pers k={MOREIRA_ARM} t={t} x={680} y={1720} h={1150} movs={[['entrar', W(19, 'maior') - 0.6, 0.6], ['bravo', W(19, 'maior')]]} seed={7} flip />
      <Pers k={NOVA} t={t} x={230} y={1720} h={580} movs={[['parado', t0], ['susto', W(19, 'maior')]]} seed={1} />
      <Pop t={t} at={W(19, 'bobina')} x={540} y={330}><Placa texto="BOBINA ROUBADA" bg="#d1283b" fg="#fff" size={52} /></Pop>
    </Cam>
  ),
  // 20 a luta no telhado
  ({ t, t0, t1 }) => {
    const ph = (t - t0) % 1.4;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1150}>
        <TelhadoLT t={t} />
        <Pers k={MOREIRA_ARM} t={t} x={720} y={1720} h={1100} movs={[['bravo', t0]]} over={{ maoD: [-170 + 60 * Math.sin(t * 5), -300] }} seed={7} flip />
        <Pers k={NOVA} t={t} x={300 + 60 * Math.sin((t - t0) * 4)} y={1720 - (ph < 0.6 ? 200 * Math.sin((ph / 0.6) * Math.PI) : 0)} h={580} movs={[['parado', t0]]} over={{ maoD: [150, -330], maoE: [-80, -200], sobr: -0.8, boca: 'dentes' }} seed={1} />
        <Onoma t={t} at={t0 + 0.6} x={540} y={900} txt="POW!" />
        <Onoma t={t} at={t0 + 2} x={500} y={700} txt="CLANG!" cor="#5ad8ff" />
        <Svg><Faiscas x={560} y={1200} t={t} n={10} /></Svg>
      </Cam>
    );
  },
  // 21 sem energia, arranca a placa do letreiro e joga
  ({ t, t0, t1 }) => {
    const j = W(21, 'placa');
    const voo = clamp((t - j - 0.4) / 0.6);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1100}>
        <TelhadoLT t={t} semLetra={t > j ? 0 : -1} />
        <Pers k={{ ...NOVA, bobinaForca: 0.2 + 0.2 * Math.abs(Math.sin(t * 15)) }} t={t} x={260} y={1720} h={600} movs={[['aflito', t0], ['apontar', j + 0.2, 1.2]]} seed={1} />
        <Pers k={MOREIRA_ARM} t={t} x={760} y={1720} h={1100} movs={[['bravo', t0], ['susto', j + 0.9]]} seed={7} flip />
        {t > j && <Svg><g transform={`translate(${120 + 640 * voo} ${620 + 380 * voo}) rotate(${voo * 400})`}><rect x={-50} y={-65} width={100} height={130} fill="#1a1a1e" stroke="#1a1520" strokeWidth={4} /><text x={0} y={40} textAnchor="middle" fontFamily="Arial Black" fontSize={100} fill="#f2c94c">L</text></g></Svg>}
        <Pop t={t} at={W(21, 'energia')} x={260} y={900}><Placa texto="BATERIA 2%" bg="#d1283b" fg="#fff" size={44} /></Pop>
        <Onoma t={t} at={j + 1} x={760} y={900} txt="CRASH!" />
      </Cam>
    );
  },
  // 22 o Moreira cai dentro do próprio gerador
  ({ t, t0, t1 }) => {
    const g = W(22, 'gerador');
    const k = clamp((t - t0) / Math.max(0.5, g - t0));
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.2} cx={760} cy={1100}>
        <TelhadoLT t={t} semLetra={0} gerador={t > g ? 0.2 : 1} />
        {t < g + 0.2 && <Pers k={MOREIRA_ARM} t={t} x={700 + 160 * k} y={1720 - 300 * k} h={900 * (1 - 0.4 * k)} movs={[['deitar', t0]]} seed={7} />}
        {t > g && <Svg><Faiscas x={860} y={1100} t={t} n={20} cor="#5ad8ff" /></Svg>}
        <Flash t={t} at={g} cor="#bfefff" />
        <Onoma t={t} at={g} x={760} y={760} txt="ZZZT!" cor="#5ad8ff" />
      </Cam>
    );
  },
  // 23 no dia seguinte: quem é o homem de lata?
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1} cy={900}>
      <JornalLT t={t} manchete="QUEM É O HOMEM DE LATA?" />
    </Cam>
  ),
  // 24 discurso pronto, jogado fora
  ({ t, t0, t1 }) => {
    const f = W(24, 'fora');
    const k = clamp((t - f) / 0.8);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
        <Coletiva t={t} />
        <Pers k={{ ...VICENTE, bobina: '#5ad8ff', item: t < f ? 'carta' : undefined }} t={t} x={540} y={1500} h={760} movs={[['segurar', t0], ['ombros', f]]} seed={1} />
        <Podio />
        {t > f && <Svg><g transform={`translate(${600 + 300 * k} ${880 - 300 * k + 500 * k * k}) rotate(${k * 500})`}><rect x={-40} y={-30} width={80} height={60} fill="#fffaf0" stroke="#1a1520" strokeWidth={3} /><path d="M-28 -12 h56 M-28 4 h44" stroke="#6a5a4a" strokeWidth={3} /></g></Svg>}
        <Pop t={t} at={W(24, 'discurso')} x={540} y={420}><Placa texto="DISCURSO PRONTO" bg="#fffaf0" size={50} /></Pop>
      </Cam>
    );
  },
  // 25 "O homem de lata sou eu."
  ({ t, t0, t1 }) => {
    const ult = TL.WORDS[TL.WORDS.length - 1].t1;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.4} z1={1.65} cy={900}>
        <Coletiva t={t} />
        <Pers k={{ ...VICENTE, bobina: '#5ad8ff' }} t={t} x={540} y={1500} h={760} movs={[['falar', t0], ['parado', ult]]} over={t > ult ? { boca: 'sorriso', pisca: 1 } : {}} seed={1} />
        <Podio />
        <Pop t={t} at={W(25, 'eu')} x={540} y={420}><Balao texto="Sou eu." /></Pop>
        {t > ult + 0.5 && <div style={{ position: 'absolute', inset: 0, background: '#0a0e1a', opacity: clamp((t - ult - 0.5) / 0.4) }} />}
      </Cam>
    );
  },
];

const comVinheta = (cs: Cena[]): Cena[] => cs.map((C) => (p: P) => <>{C(p)}<Vinheta forca={0.4} /></>);
// Sem áudio: nenhum efeito sonoro e nenhuma narração (até existir public/voz-lata.mp3 + PALAVRAS_LATA).
export const HomemDeLata = () => <FilmeMad tl={TL} cenas={comVinheta(CENAS)} voz="voz-lata.mp3" sfx={[]} />;
export const DURACAO_LATA = TL.END;

