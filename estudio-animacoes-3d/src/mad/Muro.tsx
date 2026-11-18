// "O Muro de Cem Anos — Episódio 1: A Mão de Barro" com os PERSONAGENS MAD ARTICULADOS + efeitos sonoros (sem narração por enquanto).
import { CSSProperties } from 'react';
import { Svg } from './cenarios';
import { Relampago, Vinheta } from './cenarios-ilha';
import {
  Barco, Canal, CasaDesabada, CidadeMuro, clamp, Cozinha, Fora, ImensoCorpo, MaoBarro, Muralha, NuvemPoeira, PedrasVoando,
  RostoImenso, TorreSino, CeuMuro,
} from './cenarios-muro';
import { Cam, Placa, Pop } from './FiosBrancos';
import { Ator, Mov } from './FiosBrancosArticulado';
import { Cena, FilmeMad, P, Sfx } from './FilmeMad';
import { Pose } from './Rig';
import { TL_MURO as TL } from './timeline-muro';

// ---------- Elenco ----------
const TITO = { tipo: 'crianca', pele: '#e2b48c', roupa: '#8a5a32', calca: '#4a4a3a', cabelo: 'espetado', corCabelo: '#3a2416', sapato: '#5a3a22' };
const LUA = { tipo: 'crianca', pele: '#f6e3d3', roupa: '#f4f0e4', saia: '#5a6a8a', cabelo: 'chanel', corCabelo: '#1a1410', sapato: '#3a2a1a' };
const BENI = { tipo: 'crianca', pele: '#f0c8a0', roupa: '#2f8acf', calca: '#c8b48a', cabelo: 'chanel', corCabelo: '#e8c86a', oculos: true, item: 'livro', sapato: '#5a3a22' };
const ROSA = { tipo: 'adulto', pele: '#e2b48c', roupa: '#a8c8a0', saia: '#6a5a3a', cabelo: 'coque', corCabelo: '#3a2416', avental: '#f4f0e4', sapato: '#3a2a1a' };
const BASILIO = { tipo: 'adulto', corpo: 'gordo', pele: '#b9805a', roupa: '#5a6a4a', calca: '#3a3a3a', cabelo: 'careca', corCabelo: '#2a1a12', barba: true, corBarba: '#2a1a12', colete: '#6b4224', sapato: '#2a2a2a' };
const COMANDANTE = { tipo: 'adulto', pele: '#f0c8a0', roupa: '#3a5a3a', calca: '#c8b48a', colete: '#6b4224', cabelo: 'curto', corCabelo: '#9a9a9a', bigode: true, corBigode: '#9a9a9a', sapato: '#3a2a1a' };
const BATEDOR = (i: number) => ({ tipo: 'adulto', pele: ['#e2b48c', '#7a4b30', '#f6e3d3', '#c98a5a'][i % 4], roupa: '#3a5a3a', calca: '#c8b48a', colete: '#6b4224', cabelo: ['curto', 'rabo', 'crespo', 'chanel'][i % 4], corCabelo: '#2a1a12', sapato: '#3a2a1a' });
const POVO = (i: number) => ({ tipo: i % 4 === 3 ? 'idoso' : 'adulto', pele: ['#e2b48c', '#7a4b30', '#f6e3d3', '#c98a5a', '#b9805a'][i % 5], roupa: ['#c84a4a', '#4a7aa8', '#8a7a4a', '#7a4a8a', '#4a8a5a'][i % 5], calca: '#4a4a3a', saia: i % 2 ? '#6a5a4a' : undefined, cabelo: ['curto', 'coque', 'careca', 'longo', 'crespo'][i % 5], corCabelo: ['#2a1a12', '#6a6a6a', '#3a2416'][i % 3], sapato: '#3a2a1a' });

// ---------- Atalhos ----------
type A = { k: object; t: number; x: number; y: number; h?: number; movs: Mov[]; over?: Partial<Pose> | ((p: Pose) => Partial<Pose>); seed?: number; flip?: boolean; op?: number; style?: CSSProperties };
const Pers = ({ op = 1, style, ...a }: A) => <Ator {...a} style={{ opacity: op, ...style }} />;
const W = TL.W;
const ini = (i: number) => (i === 0 ? 0 : i >= TL.LINES.length ? TL.END : W(i, 0));
const andando = (t: number, t0: number, x0: number, v: number) => x0 + v * Math.max(0, t - t0);
const Escuro = ({ k = 0.35, cor = '#05060c' }: { k?: number; cor?: string }) => <div style={{ position: 'absolute', inset: 0, background: cor, opacity: k, pointerEvents: 'none' }} />;
const Flash = ({ t, at, cor = '#fff', d = 0.35 }: { t: number; at: number; cor?: string; d?: number }) => (t > at && t < at + d ? <div style={{ position: 'absolute', inset: 0, background: cor, opacity: 0.9 * (1 - (t - at) / d) }} /> : null);
const Nome = ({ t, at, x, y, n }: { t: number; at: number; x: number; y: number; n: string }) => (
  <Pop t={t} at={at} x={x} y={y}><div style={{ background: '#f4efe0', color: '#1a1520', fontFamily: 'Georgia', fontWeight: 900, fontSize: 38, padding: '6px 18px', borderRadius: 10, border: '4px solid #1a1520', transform: 'rotate(-3deg)', whiteSpace: 'nowrap' }}>{n}</div></Pop>
);
const Tremor = ({ t, at, d = 1.2, f = 14, children }: { t: number; at: number; d?: number; f?: number; children: React.ReactNode }) => {
  const k = t > at && t < at + d ? (1 - (t - at) / d) * f : 0;
  return <div style={{ position: 'absolute', inset: 0, transform: `translate(${k * Math.sin(t * 70)}px, ${k * Math.cos(t * 55)}px)` }}>{children}</div>;
};
const Fita = ({ x, y, s = 1, t = 0 }: { x: number; y: number; s?: number; t?: number }) => (
  <Svg><g transform={`translate(${x} ${y}) scale(${s}) rotate(${4 * Math.sin(t * 2)})`}><path d="M0 0 C-60 -30 -80 30 -20 10 Z M0 0 C60 -30 80 30 20 10 Z" fill="#f2c94c" stroke="#1a1520" strokeWidth={4} /><path d="M-6 6 Q-30 80 -50 140 M6 6 Q30 80 40 150" stroke="#f2c94c" strokeWidth={16} fill="none" strokeLinecap="round" /><circle r={12} fill="#e8b830" stroke="#1a1520" strokeWidth={3} /></g></Svg>
);
// O Imenso andando pela cidade (atrás das casas), pés em (x, y).
const Imenso = ({ t, x, y, h, op = 1 }: { t: number; x: number; y: number; h: number; op?: number }) => <Svg><g opacity={op} transform={`translate(${x} ${y})`}><ImensoCorpo h={h} t={t} anda={1} /></g></Svg>;

// ---------- Cenas (uma por frase) ----------
const CENAS: Cena[] = [
  // 0 cem anos cercada por duas muralhas
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1} cy={1000}>
      <CidadeMuro t={t} />
      <Pop t={t} at={W(0, 'cem') - 0.1} x={540} y={300}><Placa texto="100 ANOS" bg="#f4efe0" size={70} /></Pop>
    </Cam>
  ),
  // 1 lá fora, os Imensos: gigantes de barro que procuram gente
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1000}>
      <Fora t={t} />
      <Svg><g transform="translate(560 1500)"><ImensoCorpo h={760} t={t} anda={1} /></g></Svg>
      <Pop t={t} at={W(1, 'imensos') - 0.1} x={540} y={420}><Placa texto="OS IMENSOS" bg="#a07a5a" fg="#fff" size={64} /></Pop>
      <Escuro k={0.15} cor="#3a2a1a" />
    </Cam>
  ),
  // 2 eu me chamo Tito, dez anos, odeio a muralha
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1250}>
      <CidadeMuro t={t} />
      <Pers k={TITO} t={t} x={540} y={1760} h={560} movs={[['parado', t0], ['bravo', W(2, 'odeio') - 0.3]]} over={{ pupila: [0, -1], sobr: -0.6 }} seed={1} />
      <Nome t={t} at={W(2, 'tito') - 0.1} x={540} y={1100} n="TITO, 10 ANOS" />
    </Cam>
  ),
  // 3 o Beni e o livro proibido com o mar
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1250}>
      <CidadeMuro t={t} />
      <Pers k={BENI} t={t} x={380} y={1760} h={520} movs={[['segurar', t0]]} over={{ boca: 'riso', olho: 1.2 }} seed={2} />
      <Pers k={TITO} t={t} x={700} y={1760} h={540} movs={[['parado', t0]]} over={{ olho: 1.3, boca: 'o', pupila: [-1, 0] }} seed={1} flip />
      <Pop t={t} at={W(3, 'mar') - 0.4} x={540} y={900}><div style={{ background: '#f4efe0', border: '6px solid #1a1520', borderRadius: 12, padding: 12, transform: 'rotate(-4deg)' }}><svg width={420} height={240}><rect width={420} height={240} fill="#bfe6ff" /><circle cx={340} cy={60} r={30} fill="#fff3b0" />{[0, 1, 2, 3].map((i) => <path key={i} d={`M0 ${120 + i * 30} q50 -20 105 0 t105 0 t105 0 t105 0`} stroke="#2f6fb3" strokeWidth={8} fill="none" />)}<path d="M80 110 l40 -50 l10 50 z" fill="#fff" stroke="#1a1520" strokeWidth={3} /><text x={210} y={232} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={26} fill="#1a1520">O MAR</text></svg></div></Pop>
    </Cam>
  ),
  // 4 a Lua: "para de sonhar alto"
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1250}>
      <CidadeMuro t={t} />
      <Pers k={LUA} t={t} x={360} y={1760} h={520} movs={[['falar', t0], ['apontar', W(4, 'alto') - 0.4, 1]]} over={{ boca: 'neutra' }} seed={3} />
      <Pers k={TITO} t={t} x={720} y={1760} h={540} movs={[['ombros', t0 + 0.6]]} over={{ boca: 'onda' }} seed={1} flip />
      <Nome t={t} at={W(4, 'lua') - 0.1} x={360} y={1120} n="LUA" />
    </Cam>
  ),
  // 5 os Batedores da Aurora voltaram da expedição
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1200}>
      <CidadeMuro t={t} multidao={1} />
      {[0, 1, 2, 3].map((i) => <Pers key={i} k={BATEDOR(i)} t={t * 0.7} x={andando(t, t0, 380 + i * 110, 0)} y={Math.min(1700 + (i % 2) * 40, 1300 + (t - t0) * 140 + i * 30)} h={420 + (t - t0) * 30} movs={[['andar', t0 * 0.7]]} over={{ x: 0, boca: 'triste', sobrTriste: true, sobr: 0.7, olho: 0.7 }} seed={i + 10} />)}
      <Nome t={t} at={W(5, 'batedores') - 0.1} x={540} y={900} n="BATEDORES DA AURORA" />
    </Cam>
  ),
  // 6 saíram cem, voltaram doze; "a gente não descobriu nada"
  ({ t, t0, t1 }) => {
    const doze = W(6, 'doze') - 0.2;
    const v = t < W(6, 'cem') ? 0 : t < doze ? 100 : Math.max(12, Math.round(100 - (t - doze) * 220));
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.35} cy={1250}>
        <CidadeMuro t={t} />
        <Pers k={COMANDANTE} t={t} x={540} y={1760} h={680} movs={[['parado', t0], ['nao', doze + 0.6, 1.5]]} over={{ boca: 'triste', sobrTriste: true, sobr: 0.9, olho: 0.7, lagrima: 1 }} seed={20} />
        {v > 0 && <Pop t={t} at={W(6, 'cem') - 0.1} x={540} y={760}><div style={{ background: '#1a1520', color: v > 50 ? '#3aa14a' : '#e5484d', fontFamily: '"Courier New", monospace', fontWeight: 900, fontSize: 90, padding: '6px 30px', borderRadius: 14, border: '6px solid #f4efe0' }}>{v}</div></Pop>}
      </Cam>
    );
  },
  // 7 o povo vaiou; eu não, eu queria ser um deles
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1250}>
      <CidadeMuro t={t} />
      {[0, 1, 2, 3].map((i) => <Pers key={i} k={POVO(i)} t={t} x={120 + i * 180 + (i > 1 ? 280 : 0)} y={1700 + (i % 2) * 40} h={560} movs={[['bravo', t0 + i * 0.1]]} over={{ boca: 'o', sobr: -0.8 }} seed={i + 30} flip={i > 1} />)}
      <Pers k={TITO} t={t} x={540} y={1800} h={540} movs={[['parado', t0], ['comemorar', W(7, 'deles') - 0.4, 1.2]]} over={{ olho: 1.3, boca: 'sorriso', pupila: [0, -0.6] }} seed={1} />
      <Pop t={t} at={W(7, 'vaiou') - 0.1} x={300} y={1000}><Placa texto="UUUUH!" bg="#fff" size={50} /></Pop>
    </Cam>
  ),
  // 8 a mãe puxa o Tito pela orelha: "nenhum filho meu passa daquela muralha"
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1250}>
      <Cozinha t={t} />
      <Pers k={ROSA} t={t} x={420} y={1760} h={680} movs={[['parado', t0]]} over={{ maoD: [190, -440], frenteD: false, boca: 'aberta', sobr: -0.8, vermelho: 0.6 }} seed={4} />
      <Pers k={TITO} t={t} x={680} y={1780} h={500} movs={[['parado', t0]]} over={{ incl: -10, cabRot: -12, boca: 'aberta', olho: 0.5, sobr: 0.8, sobrTriste: true }} seed={1} flip />
      <Nome t={t} at={W(8, 'mae') - 0.1} x={420} y={980} n="DONA ROSA" />
    </Cam>
  ),
  // 9 eu gritei que ela era igual a todo mundo... e saí correndo
  ({ t, t0, t1 }) => {
    const cor = W(9, 'correndo') - 0.6;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1250}>
        <Cozinha t={t} />
        <Pers k={ROSA} t={t} x={420} y={1760} h={680} movs={[['parado', t0], ['aflito', cor + 0.3]]} over={{ boca: 'triste', sobrTriste: true, sobr: 0.9, lagrima: t > cor ? 1 : 0 }} seed={4} />
        <Pers k={TITO} t={t} x={t < cor ? 680 : andando(t, cor, 680, 600)} y={1780} h={500} movs={[['bravo', t0], ['correr', cor]]} over={{ x: 0, boca: 'aberta', sobr: -1, vermelho: 1 }} seed={1} flip />
      </Cam>
    );
  },
  // 10 à tarde, eu, a Lua e o Beni no telhado da torre do sino
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1} cy={1200}>
      <TorreSino t={t} />
      {[TITO, LUA, BENI].map((k, i) => <Pers key={i} k={k} t={t} x={200 + i * 200} y={1560 - i * 14} h={460} movs={[['sentar', t0]]} over={{ pupila: [0, -0.5] }} seed={i + 1} />)}
    </Cam>
  ),
  // 11 céu limpo... um relâmpago sem nuvem atrás da muralha
  ({ t, t0, t1 }) => {
    const r = W(11, 'relampago') - 0.2;
    return (
      <Tremor t={t} at={r} d={1.4} f={18}>
        <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1200}>
          <TorreSino t={t} sino={t > r ? 1 : 0} />
          {[TITO, LUA, BENI].map((k, i) => <Pers key={i} k={k} t={t} x={200 + i * 200} y={1560 - i * 14} h={460} movs={[['sentar', t0], ['susto', r + 0.1, 1.2]]} over={{ pupila: [0, -0.6], olho: t > r ? 1.3 : 1 }} seed={i + 1} />)}
          <Relampago t={t} vezes={[r]} x={560} />
        </Cam>
      </Tremor>
    );
  },
  // 12 uma mão de barro, do tamanho de uma casa, segura o alto da muralha
  ({ t, t0, t1 }) => (
    <Tremor t={t} at={W(12, 'mao') - 0.1} d={1} f={10}>
      <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.25} cy={900}>
        <Svg><CeuMuro t={t} /><Muralha y={1700} h={1100} portao={0} t={t} /><MaoBarro x={560} y={600} k={clamp((t - W(12, 'mao') + 0.3) / 0.6)} s={1.2} /></Svg>
        <NuvemPoeira t={t} k={clamp((t - W(12, 'mao')) / 1) * 0.4} y={700} />
      </Cam>
    </Tremor>
  ),
  // 13 o rosto: sem olhos, sem boca, mais alto que a muralha de trinta metros
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={900}>
      <Svg><CeuMuro t={t} /><RostoImenso x={540} y={880} k={clamp((t - W(13, 'rosto') + 0.6) / 1.4)} s={1.1} t={t} /><Muralha y={1700} h={820} portao={1} t={t} /><MaoBarro x={860} y={880} s={0.8} /></Svg>
      <Pop t={t} at={W(13, 'trinta') - 0.2} x={180} y={1300}><Placa texto="30 m" bg="#fff" size={60} /></Pop>
      <Escuro k={0.15} />
    </Cam>
  ),
  // 14 ele chutou o portão: a muralha abriu como papel
  ({ t, t0, t1 }) => {
    const ch = W(14, 'chutou') - 0.2;
    return (
      <Tremor t={t} at={ch} d={2} f={26}>
        <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
          <Svg><CeuMuro t={t} poeira={clamp((t - ch) / 1)} /><RostoImenso x={540} y={700} s={1} t={t} /><Muralha y={1500} h={760} portao={t > ch ? 0 : 1} quebrada={t > ch ? clamp((t - ch) / 0.6) : 0} t={t} /></Svg>
          <Svg><PedrasVoando t={t} de={ch} n={8} /></Svg>
          {t > ch && <NuvemPoeira t={t} k={clamp((t - ch) / 0.8)} y={1400} />}
          <Flash t={t} at={ch} d={0.3} cor="#fff6d8" />
        </Cam>
      </Tremor>
    );
  },
  // 15 pedras voaram por cima da cidade; uma caiu na minha rua
  ({ t, t0, t1 }) => {
    const cai = W(15, 'rua') - 0.3;
    return (
      <Tremor t={t} at={cai} d={1.2} f={20}>
        <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1200}>
          <CidadeMuro t={t} estrago={t > cai ? 1 : 0} poeira={0.5} />
          <Svg><PedrasVoando t={t} de={t0} n={7} /></Svg>
          {t > cai - 0.8 && t < cai && <Svg><g transform={`translate(${540} ${400 + (t - cai + 0.8) * 1200}) rotate(${t * 400})`}><path d="M-110 -60 l80 -60 l100 20 l40 80 l-60 80 l-120 0 z" fill="#9a8c78" stroke="#1a1520" strokeWidth={6} /></g></Svg>}
          {t > cai && <NuvemPoeira t={t} k={clamp((t - cai) / 0.6) * 0.8} y={1500} />}
          {[0, 1, 2].map((i) => <Pers key={i} k={POVO(i + 5)} t={t} x={andando(t, t0, 200 + i * 300, i % 2 ? -260 : 260)} y={1780} h={520} movs={[['correr', t0]]} over={{ x: 0, olho: 1.3, boca: 'aberta' }} seed={i + 40} flip={i % 2 === 1} />)}
        </Cam>
      </Tremor>
    );
  },
  // 16 corri para casa: a casa tinha desabado, a mãe presa embaixo da viga
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1300}>
      <CasaDesabada t={t} />
      <Pers k={ROSA} t={t} x={540} y={1660} h={600} movs={[['parado', t0]]} over={{ maoE: [-170, -230], maoD: [170, -240], incl: 6, boca: 'triste', sobrTriste: true, sobr: 0.8 }} seed={4} />
      <Svg><rect x={120} y={1440} width={840} height={110} rx={16} fill="#6b4224" stroke="#1a1520" strokeWidth={8} transform="rotate(-6 540 1495)" /></Svg>
      <Pers k={TITO} t={t} x={Math.min(260, andando(t, t0, -100, 400))} y={1820} h={500} movs={[['correr', t0, 1], ['susto', t0 + 1, 1], ['aflito', t0 + 2]]} over={{ x: 0, olho: 1.3, boca: 'aberta' }} seed={1} />
    </Cam>
  ),
  // 17 eu e a Lua puxamos a viga; ela não se mexeu
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.3} cy={1450}>
      <CasaDesabada t={t} />
      <Pers k={ROSA} t={t} x={540} y={1660} h={600} movs={[['parado', t0]]} over={{ maoE: [-170, -230], maoD: [170, -240], incl: 6, boca: 'triste', sobrTriste: true, sobr: 0.8 }} seed={4} />
      <Svg><g transform={`translate(0 ${2 * Math.sin(t * 30)})`}><rect x={120} y={1440} width={840} height={110} rx={16} fill="#6b4224" stroke="#1a1520" strokeWidth={8} transform="rotate(-6 540 1495)" /></g></Svg>
      <Pers k={TITO} t={t} x={260} y={1820} h={500} movs={[['parado', t0]]} over={{ maoE: [60, -200], maoD: [120, -210], incl: 12, boca: 'dentes', suor: 1, vermelho: 1, sobr: -0.8 }} seed={1} />
      <Pers k={LUA} t={t} x={820} y={1820} h={480} movs={[['parado', t0]]} over={{ maoE: [-120, -210], maoD: [-60, -200], incl: -12, boca: 'dentes', suor: 1, sobr: -0.8 }} seed={3} />
    </Cam>
  ),
  // 18 "Tito, leva a Lua e corre. Eu tô bem. Corre!"
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.7} z1={1.9} cx={540} cy={1340}>
      <CasaDesabada t={t} />
      <Pers k={ROSA} t={t} x={540} y={1660} h={600} movs={[['parado', t0]]} over={{ maoE: [-170, -230], maoD: [170, -240], incl: 6, boca: 'sorriso', lagrima: 1, sobrTriste: true, sobr: 0.7 }} seed={4} />
      <Svg><rect x={120} y={1440} width={840} height={110} rx={16} fill="#6b4224" stroke="#1a1520" strokeWidth={8} transform="rotate(-6 540 1495)" /></Svg>
      <Pop t={t} at={W(18, 'corre') - 0.2} x={540} y={1000}><Placa texto="CORRE!" bg="#e5484d" fg="#fff" size={56} /></Pop>
    </Cam>
  ),
  // 19 o Seu Basílio pegou nós dois no colo e correu
  ({ t, t0, t1 }) => {
    const x = andando(t, t0 + 0.6, 600, -260);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1250}>
        <CidadeMuro t={t} estrago={1} poeira={0.6} />
        <Pers k={BASILIO} t={t} x={x} y={1780} h={720} movs={[['parado', t0], ['correr', t0 + 0.6]]} over={{ x: 0, maoE: [-110, -380], maoD: [110, -380], boca: 'dentes', suor: 1 }} seed={5} flip />
        <Pers k={TITO} t={t} x={x - 110} y={1440} h={360} movs={[['parado', t0]]} over={{ boca: 'aberta', lagrima: 1, maoD: [120, -220] }} seed={1} />
        <Pers k={LUA} t={t} x={x + 110} y={1440} h={350} movs={[['parado', t0]]} over={{ boca: 'triste', lagrima: 1 }} seed={3} flip />
        <Nome t={t} at={W(19, 'basilio') - 0.1} x={540} y={900} n="SEU BASÍLIO" />
      </Cam>
    );
  },
  // 20 por cima do ombro dele, a sombra de um Imenso cobriu a minha casa
  ({ t, t0, t1 }) => {
    const sb = W(20, 'sombra') - 0.3;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1100}>
        <CidadeMuro t={t} estrago={1} poeira={0.4} muralha={false} />
        <Imenso t={t} x={andando(t, t0, 300, 60)} y={1180} h={1100} />
        {t > sb && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 70%, rgba(10,8,6,0.75), transparent 60%)', opacity: clamp((t - sb) / 0.8) }} />}
      </Cam>
    );
  },
  // 21 depois, só poeira
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <CasaDesabada t={t} />
      <NuvemPoeira t={t} k={1} y={1200} />
      <NuvemPoeira t={t + 3} k={0.9} y={900} />
      <Escuro k={0.2} cor="#3a2a1a" />
    </Cam>
  ),
  // 22 no barco para dentro da segunda muralha, ninguém falava
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1250}>
      <Canal t={t} />
      {[0, 1, 2, 3, 4, 5].map((i) => <Pers key={i} k={i === 2 ? TITO : i === 3 ? LUA : i === 1 ? BASILIO : POVO(i + 10)} t={t} x={170 + i * 150} y={1500 + 8 * Math.sin(t * 1.4)} h={i === 2 || i === 3 ? 380 : 480} movs={[['parado', t0]]} over={{ boca: 'triste', sobrTriste: true, sobr: 0.7, olho: 0.8, pupila: [0, 0.6] }} seed={i + 50} />)}
      <Svg><Barco x={540} y={1560} t={t} /></Svg>
    </Cam>
  ),
  // 23 a Lua segura a fita amarela da mãe
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.5} z1={1.7} cx={540} cy={1300}>
      <Canal t={t} />
      <Pers k={LUA} t={t} x={540} y={1760} h={640} movs={[['parado', t0]]} over={{ maoE: [-40, -260], maoD: [40, -260], frenteE: true, frenteD: true, boca: 'triste', lagrima: 1, sobrTriste: true, sobr: 0.8, pupila: [0, 1] }} seed={3} />
      <Fita x={540} y={1460} s={1.1} t={t} />
    </Cam>
  ),
  // 24 olhei para a muralha quebrada e prometi
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1100}>
      <Svg><CeuMuro t={t} tarde={1} poeira={0.5} /><g transform="translate(0 200) scale(1 0.6)"><Muralha y={1300} h={700} portao={0} quebrada={1} t={t} /></g><g transform="translate(260 1000)"><ImensoCorpo h={420} t={t} anda={1} /></g><g transform="translate(820 1000)"><ImensoCorpo h={360} t={t + 2} anda={1} /></g></Svg>
      <NuvemPoeira t={t} k={0.5} y={800} />
      <Svg><rect x={0} y={1100} width={1080} height={820} fill="#3a6a8a" /><Barco x={540} y={1700} t={t} s={1.1} /></Svg>
      <Pers k={TITO} t={t} x={540} y={1640} h={460} movs={[['parado', t0]]} over={{ pupila: [0, -0.6], sobr: -0.8, boca: 'neutra', lagrima: 1 }} seed={1} />
    </Cam>
  ),
  // 25 "Eu vou entrar para os Batedores. E vou fazer cada um deles voltar para o barro."
  ({ t, t0, t1 }) => {
    const ult = TL.WORDS[TL.WORDS.length - 1].t1;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.5} z1={1.9} cy={1250}>
        <Canal t={t} />
        <Pers k={TITO} t={t} x={540} y={1760} h={700} movs={[['parado', t0], ['bravo', W(25, 'barro') - 0.6]]} over={{ sobr: -1, boca: 'dentes', lagrima: 1, olho: 1.1 }} seed={1} />
        <Pop t={t} at={W(25, 'batedores') - 0.2} x={540} y={760}><Placa texto="BATEDORES DA AURORA" bg="#3a5a3a" fg="#f2c94c" size={42} /></Pop>
        {t > ult + 0.8 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp((t - ult - 0.8) / 0.8) }} />}
      </Cam>
    );
  },
];

const comVinheta = (cs: Cena[]): Cena[] => cs.map((C) => (p: P) => <>{C(p)}<Vinheta forca={0.4} /></>);

// ---------- Efeitos sonoros ----------
const sfx = (): Sfx[] => {
  const amb = (f: string, de: number, ate: number, vol: number): Sfx => [f, ini(de), vol, ini(ate + 1) - ini(de) + 0.3, true];
  const passos = (de: number, ate: number, vol: number): Sfx[] => Array.from({ length: Math.max(1, Math.floor((ini(ate + 1) - ini(de)) / 1.6)) }, (_, i): Sfx => ['sfx-muro/passo-gigante.mp3', ini(de) + 0.3 + i * 1.6, vol, 2]);
  return [
    // a cidade em paz
    ['sfx-farol/sino.mp3', 0.3, 0.35, 3],
    amb('sfx-flutua/passarinho.mp3', 0, 0, 0.35),
    amb('sfx-flutua/murmurio.mp3', 2, 4, 0.2),
    amb('sfx-silencio/vento.mp3', 1, 1, 0.3),
    ...passos(1, 1, 0.2),
    ['sfx-q9/papel.mp3', W(3, 'livro') - 0.2, 0.4, 1.5],
    ['sfx-eleven/brilho.mp3', W(3, 'mar') - 0.3, 0.35],
    // os Batedores voltam
    ['sfx-farol/sino.mp3', ini(5), 0.22, 3],
    ['sfx-farol/passos.mp3', ini(5), 0.4, ini(7) - ini(5), true],
    ['sfx-flutua/murmurio.mp3', ini(5), 0.3, ini(7) - ini(5)],
    ['sfx-palma/contador.mp3', W(6, 'doze') - 0.4, 0.45, 1.6],
    ['sfx-muro/vaia.mp3', W(7, 'vaiou') - 0.2, 0.5, 3.5],
    // a casa
    amb('sfx-monitor/fogueira.mp3', 8, 9, 0.2),
    ['sfx-eleven/whoosh.mp3', W(8, 'orelha') - 0.3, 0.35],
    ['sfx-casarao/porta-bate.mp3', W(9, 'correndo') - 0.2, 0.5, 1.5],
    ['sfx-farol/passos.mp3', W(9, 'correndo') - 0.5, 0.45, 1.5],
    // o telhado e o relâmpago
    amb('sfx-flutua/passarinho.mp3', 10, 10, 0.3),
    amb('sfx-silencio/vento.mp3', 10, 11, 0.2),
    ['sfx-q9/trovao.mp3', W(11, 'relampago') - 0.25, 0.65, 4],
    ['sfx-farol/sino.mp3', W(11, 'relampago') + 0.2, 0.4, 3],
    ['sfx-eleven/coracao.mp3', ini(12), 0.35, ini(15) - ini(12)],
    ['sfx-palma/racha.mp3', W(12, 'mao') - 0.2, 0.5, 2],
    ['sfx-muro/passo-gigante.mp3', W(12, 'mao') - 0.1, 0.5, 2],
    ['sfx-eleven/drone.mp3', ini(13), 0.4, ini(14) - ini(13)],
    ['sfx-silencio/vento.mp3', ini(13), 0.3, ini(14) - ini(13)],
    // a muralha cai
    ['sfx-muro/muralha.mp3', W(14, 'chutou') - 0.25, 0.42, 5],
    ['sfx-eleven/boom.mp3', W(14, 'chutou') - 0.2, 0.45],
    ['sfx-muro/pedras.mp3', ini(15), 0.6, 3],
    ['sfx-eleven/boom.mp3', W(15, 'rua') - 0.3, 0.55],
    ['sfx-flutua/torcida.mp3', ini(15), 0.25, ini(17) - ini(15)],
    ['sfx-farol/sino.mp3', ini(15) + 0.5, 0.12, ini(17) - ini(15), true],
    // a casa desabada
    ['sfx-farol/passos.mp3', ini(16), 0.28, 1.4],
    ['sfx-monitor/fogueira.mp3', ini(16), 0.15, ini(19) - ini(16), true],
    ['sfx-palma/racha.mp3', ini(17), 0.3, 2],
    ['sfx-eleven/coracao.mp3', ini(16), 0.2, ini(20) - ini(16)],
    ['sfx-farol/caixinha.mp3', ini(18), 0.25, ini(20) - ini(18)],
    // a fuga e o Imenso
    ['sfx-farol/passos.mp3', ini(19), 0.5, ini(20) - ini(19), true],
    ...passos(19, 20, 0.3),
    ['sfx-eleven/boom.mp3', W(20, 'casa') + 0.35, 0.35],
    ['sfx-muro/muralha.mp3', W(20, 'casa') + 0.35, 0.18, 2.5],
    amb('sfx-silencio/vento.mp3', 21, 21, 0.18),
    // o barco e a promessa
    amb('sfx-monitor/lago.mp3', 22, 25, 0.2),
    ['sfx-monitor/remo.mp3', ini(22), 0.3, TL.END - ini(22), true],
    ['sfx-farol/caixinha.mp3', ini(22), 0.18, ini(25) - ini(22)],
    ...passos(24, 24, 0.25),
    ['sfx-farol/coro.mp3', ini(25), 0.15, TL.END - ini(25)],
    ['sfx-eleven/boom.mp3', TL.WORDS[TL.WORDS.length - 1].t1 + 0.3, 0.55],
  ];
};

export const MuroCemAnos = () => <FilmeMad tl={TL} cenas={comVinheta(CENAS)} voz={TL.COM_VOZ ? 'voz-muro.mp3' : undefined} sfx={sfx()} ganhoSfx={TL.COM_VOZ ? 0.65 : 0.5} />;
export const DURACAO_MURO = TL.END;
