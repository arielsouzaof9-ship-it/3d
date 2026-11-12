// "Quatro Minutos": assalto com reviravolta, com os PERSONAGENS MAD ARTICULADOS (máscaras de pássaro de papel).
// Sem narração por enquanto: com public/voz-quatro.mp3 + PALAVRAS_QUATRO preenchido, cenas e legendas seguem a fala.
import { ReactNode } from 'react';
import { Svg } from './cenarios';
import { Banco, CHAO_A, clamp, Cofre, CofreDentro, Esgoto, JornalQ, Oficina, Ouro, Saguao, SalaCameras, Torre } from './cenarios-assalto';
import { Vinheta } from './cenarios-ilha';
import { Balao, Brilho, Cam, Placa, Pop } from './FiosBrancos';
import { Ator, Mov } from './FiosBrancosArticulado';
import { Cena, FilmeMad, P, Sfx } from './FilmeMad';
import { Pose } from './Rig';
import { TL_QUATRO as TL } from './timeline-quatro';

// ---------- Elenco ----------
const MAC = '#c8302c'; // macacão vermelho da equipe
const RELOJOEIRO = { tipo: 'idoso', pele: '#e2b48c', roupa: '#6b4224', calca: '#3a3f4a', cabelo: 'curto', corCabelo: '#d6d6d6', chapeu: 'fedora', corChapeu: '#3a3a3a', gravata: '#8a2a2a', sapato: '#2a1a12' };
const RELOJOEIRO_PM = { ...RELOJOEIRO, roupa: '#1c3d6e', calca: '#1c3d6e', chapeu: 'quepe', corChapeu: '#1c3d6e', gravata: undefined, distintivo: true };
const ANDORINHA = { tipo: 'adulto', pele: '#f6e3d3', roupa: MAC, calca: MAC, cabelo: 'rabo', corCabelo: '#2a1a12', sapato: '#1a1a1e', mascara: 'bigode' };
const CORUJA = { tipo: 'adulto', pele: '#e8c09a', roupa: MAC, calca: MAC, cabelo: 'coque', corCabelo: '#8a8a8a', sapato: '#1a1a1e', mascara: 'bigode' };
const TUCANO = { tipo: 'adulto', corpo: 'gordo', pele: '#8d5a3b', roupa: MAC, calca: MAC, cabelo: 'careca', corCabelo: '#2a1a12', sapato: '#1a1a1e', mascara: 'bigode' };
const PARDAL = { tipo: 'adulto', corpo: 'magro', pele: '#f0c8a0', roupa: MAC, calca: MAC, cabelo: 'espetado', corCabelo: '#c86a2a', sapato: '#1a1a1e', mascara: 'bigode' };
const GAIVOTA = { tipo: 'adulto', pele: '#c98a5a', roupa: MAC, calca: MAC, cabelo: 'chanel', corCabelo: '#f2d27a', sapato: '#1a1a1e', mascara: 'bigode' };
const EQUIPE = [CORUJA, TUCANO, ANDORINHA, PARDAL, GAIVOTA];
const semMascara = (k: object) => ({ ...k, mascara: undefined });
const limpeza = (k: object) => ({ ...k, roupa: '#9aa0aa', calca: '#9aa0aa', chapeu: 'bone', corChapeu: '#6a727e', mascara: undefined });
const VERA = { tipo: 'adulto', pele: '#f6e3d3', roupa: '#2c3346', calca: '#2c3346', cabelo: 'longo', corCabelo: '#8a2a1a', distintivo: true, sapato: '#1a1a1e' };
const DONO = { tipo: 'adulto', corpo: 'gordo', pele: '#f6e3d3', roupa: '#2a2a2a', calca: '#2a2a2a', gravata: '#e8c240', cabelo: 'careca', corCabelo: '#d6d6d6', chapeu: 'cartola', corChapeu: '#1a1a1e', sapato: '#1a1a1e' };
const POLICIAL = { tipo: 'adulto', pele: '#e2b48c', roupa: '#1c3d6e', calca: '#1c3d6e', chapeu: 'quepe', corChapeu: '#1c3d6e', cabelo: 'curto', corCabelo: '#2a1a12', sapato: '#1a1a1e' };

// ---------- Atalhos ----------
type A = { k: object; t: number; x: number; y: number; h?: number; movs: Mov[]; over?: Partial<Pose> | ((p: Pose) => Partial<Pose>); seed?: number; flip?: boolean; op?: number };
const Pers = ({ op = 1, ...a }: A) => <Ator {...a} style={{ opacity: op }} />;
const W = TL.W;
const ini = (i: number) => (i === 0 ? 0 : W(i, 0));
// Retrato (foto 3×4 presa no quadro): mostra cabeça e ombros do personagem.
const Retrato = ({ k, t, x, y, w = 110, h = 130, rot = 0, op = 1, over }: { k: object; t: number; x: number; y: number; w?: number; h?: number; rot?: number; op?: number; over?: Partial<Pose> }) => (
  <div style={{ position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, background: '#dfe8ee', border: '5px solid #fff', boxShadow: '0 0 0 3px #1a1520', overflow: 'hidden', transform: `rotate(${rot}deg)`, opacity: op }}>
    <Ator k={k} t={t} x={w / 2} y={h * 1.75} h={h * 1.75} movs={[['parado', 0]]} over={{ boca: 'neutra', ...over }} seed={3} />
  </div>
);
const Tacha = ({ x, y }: { x: number; y: number }) => <Svg><circle cx={x} cy={y} r={11} fill="#d1283b" stroke="#1a1520" strokeWidth={3} /></Svg>;
const Dong = ({ t, at, x = 760, y = 300, txt = 'DONG!' }: { t: number; at: number; x?: number; y?: number; txt?: string }) => (
  t > at - 0.05 && t < at + 0.9 ? <Pop t={t} at={at} x={x} y={y}><div style={{ fontFamily: '"Arial Black", Arial', fontSize: 110, color: '#ffd23a', WebkitTextStroke: '10px #1a1520', paintOrder: 'stroke fill', transform: 'rotate(-8deg)', opacity: 1 - clamp((t - at - 0.6) / 0.3) }}>{txt}</div></Pop> : null
);
// Fundo dividido na diagonal (apresentação dos membros).
const Dividido = ({ a, b, t }: { a: string; b: string; t: number }) => (
  <Svg>
    <rect width={1080} height={1920} fill={a} />
    <path d="M620 0 H1080 V1920 H420 z" fill={b} />
    {Array.from({ length: 16 }, (_, i) => { const y = (i * 140 + t * 600) % 1920; return <path key={i} d={`M${700 + (i % 3) * 120} ${y} l-60 220`} stroke="#fff" strokeWidth={6} opacity={0.15} />; })}
    <path d="M620 0 L420 1920" stroke="#1a1520" strokeWidth={12} />
  </Svg>
);
const Sepia = ({ children }: { children: ReactNode }) => <div style={{ position: 'absolute', inset: 0, filter: 'sepia(0.85) contrast(1.05) brightness(0.9)' }}>{children}</div>;
const andando = (t: number, t0: number, x0: number, v: number) => x0 + v * Math.max(0, t - t0);

// ---------- Cenas (uma por frase) ----------
const CENAS: Cena[] = [
  // 0 dez anos planejando quatro minutos
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={900}>
      <Oficina t={t} fios={clamp((t - t0) / 3)} />
      {EQUIPE.map((k, i) => <Retrato key={i} k={semMascara(k)} t={t} x={300 + i * 120} y={440} w={96} h={112} rot={(i % 2 ? 4 : -4)} />)}
      {[300, 420, 540, 660, 780].map((x) => <Tacha key={x} x={x} y={392} />)}
      <Pers k={RELOJOEIRO} t={t} x={760} y={1600} h={680} movs={[['pensar', t0], ['apontar', W(0, 'quatro') - 0.4, 1.6]]} flip seed={2} />
      <Pop t={t} at={W(0, 'dez')} x={270} y={1100}><Placa texto="10 ANOS" bg="#fffaf0" size={60} /></Pop>
      <Pop t={t} at={W(0, 'quatro')} x={300} y={1260}><Placa texto="4 MIN" bg="#d1495b" fg="#fff" size={84} /></Pop>
    </Cam>
  ),
  // 1 sinos da torre ao meio-dia
  ({ t, t0, t1 }) => {
    const k = clamp((t - t0) / Math.max(0.5, W(1, 'meio') - t0));
    const tocando = t > W(1, 'sinos') - 0.2 ? 1 : 0;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.25} cy={560}>
        <Torre t={t} h={11} m={56 + 4 * k} balanco={tocando} />
        <Dong t={t} at={W(1, 'sinos')} />
        <Dong t={t} at={W(1, 'meio')} x={300} y={420} />
      </Cam>
    );
  },
  // 2 cinco pessoas que não tinham nada a perder
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1200}>
      <Oficina t={t} />
      {EQUIPE.map((k, i) => <Pers key={i} k={semMascara(k)} t={t} x={190 + i * 175} y={1610 + (i % 2) * 30} h={540} movs={[['parado', t0], ['entrar', W(2, 'cinco') - 0.6 + i * 0.35, 0.8], ['parado', W(2, 'cinco') + 0.3 + i * 0.35]]} over={{ boca: i === 3 ? 'neutra' : 'sorriso', sobrTriste: i % 2 === 0 }} seed={i + 4} flip={i > 2} />)}
      <Pop t={t} at={W(2, 'cinco')} x={540} y={720}><Placa texto="5" bg="#e8c240" size={120} /></Pop>
    </Cam>
  ),
  // 3 nome de pássaro, o meu era Andorinha
  ({ t, t0, t1 }) => {
    const m = t > W(3, 'andorinha') - 0.25;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
        <Oficina t={t} quadro={false} />
        <Pers k={m ? ANDORINHA : semMascara(ANDORINHA)} t={t} x={540} y={1980} h={1100} movs={[['parado', t0], ['sim', W(3, 'andorinha'), 1]]} over={m ? { boca: 'sorriso' } : { pupila: [0, -0.3] }} seed={1} />
        <Brilho t={t} at={W(3, 'andorinha') - 0.2} x={540} y={760} r={180} n={10} />
        <Pop t={t} at={W(3, 'andorinha')} x={540} y={300}><Placa texto="ANDORINHA" bg="#26355e" fg="#fff" size={70} /></Pop>
        {[0, 1, 2, 3, 4, 5].map((i) => { const k = (t * 0.4 + i / 6) % 1; return <Svg key={i}><path d={`M${150 + i * 150} ${-60 + k * 2000} q30 -20 60 0 q-30 10 -60 0`} fill="#f4f4f4" stroke="#1a1520" strokeWidth={3} transform={`rotate(${k * 360} ${180 + i * 150} ${-60 + k * 2000})`} opacity={t > t0 + 0.2 ? 0.8 : 0} /></Svg>; })}
      </Cam>
    );
  },
  // 4 Coruja (fechaduras) e Tucano (volante)
  ({ t, t0, t1 }) => {
    const ab = clamp((t - W(4, 'coruja') - 0.6) / 0.3);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1000}>
        <Dividido a="#5a3a6a" b="#d2742c" t={t} />
        <Svg>
          <g transform="translate(270 820)"><path d={`M-50 0 V${-60 - ab * 40} a50 50 0 0 1 100 0 V${-ab * 40}`} stroke="#9aa0aa" strokeWidth={22} fill="none" /><rect x={-80} y={0} width={160} height={130} rx={16} fill="#e8c240" stroke="#1a1520" strokeWidth={6} /><circle cx={0} cy={55} r={16} fill="#1a1520" /></g>
          <g transform={`translate(800 1060) rotate(${30 * Math.sin(t * 3)})`}><circle r={120} fill="none" stroke="#1a1520" strokeWidth={30} /><circle r={120} fill="none" stroke="#3a3a3a" strokeWidth={20} /><path d="M-110 0 H110 M0 0 V110" stroke="#3a3a3a" strokeWidth={22} /><circle r={26} fill="#d1495b" stroke="#1a1520" strokeWidth={5} /></g>
        </Svg>
        <Pers k={CORUJA} t={t} x={270} y={1650} h={620} movs={[['parado', t0], ['apontar', W(4, 'coruja'), 1.2]]} over={{ boca: 'sorriso' }} seed={4} />
        <Pers k={TUCANO} t={t} x={820} y={1690} h={640} movs={[['parado', t0], ['comemorar', W(4, 'tucano'), 1.2]]} seed={5} flip />
        <Pop t={t} at={W(4, 'coruja')} x={270} y={420}><Placa texto="CORUJA" bg="#fffaf0" size={64} /></Pop>
        <Pop t={t} at={W(4, 'tucano')} x={800} y={600}><Placa texto="TUCANO" bg="#fffaf0" size={64} /></Pop>
        <Brilho t={t} at={W(4, 'coruja') + 0.6} x={270} y={760} />
      </Cam>
    );
  },
  // 5 Pardal (câmeras) e Gaivota (sem medo)
  ({ t, t0, t1 }) => {
    const off = t > W(5, 'pardal') + 0.8;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1000}>
        <Dividido a="#3a5a3a" b="#2f5f9a" t={t} />
        <Svg>
          <g transform="translate(260 840)"><rect x={-130} y={-100} width={260} height={190} rx={14} fill={off ? '#050608' : '#6a9aaa'} stroke="#1a1520" strokeWidth={8} />{!off && <circle cx={0} cy={-6} r={40} fill="#2a3a4a" />}<path d="M-30 90 l-20 60 h100 l-20 -60" fill="#3a3a3a" stroke="#1a1520" strokeWidth={5} />{!off && <circle cx={100} cy={-76} r={12} fill="#ff3b3b" />}</g>
        </Svg>
        <Pers k={PARDAL} t={t} x={270} y={1650} h={620} movs={[['parado', t0], ['apontar', W(5, 'pardal') + 0.2, 1]]} over={{ boca: 'sorriso' }} seed={6} />
        <Pers k={GAIVOTA} t={t} x={810} y={1660} h={620} movs={[['parado', t0], ['bravo', W(5, 'gaivota'), 2]]} over={{ boca: 'sorriso' }} seed={7} flip />
        <Pop t={t} at={W(5, 'pardal')} x={270} y={420}><Placa texto="PARDAL" bg="#fffaf0" size={64} /></Pop>
        <Pop t={t} at={W(5, 'gaivota')} x={800} y={600}><Placa texto="GAIVOTA" bg="#fffaf0" size={64} /></Pop>
        <Pop t={t} at={W(5, 'medo')} x={800} y={760}><Placa texto="MEDO: 0" bg="#d1495b" fg="#fff" size={52} /></Pop>
      </Cam>
    );
  },
  // 6 o alvo: Casa do Ouro
  ({ t, t0, t1 }) => {
    const a = clamp((t - W(6, 'casa') + 0.2) / 0.6);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={900}>
        <Banco t={t} />
        <Svg><g opacity={a} transform={`translate(540 760) scale(${2 - a})`}><circle r={200} fill="none" stroke="#d1283b" strokeWidth={14} /><circle r={110} fill="none" stroke="#d1283b" strokeWidth={10} /><path d="M-260 0 H-60 M60 0 H260 M0 -260 V-60 M0 60 V260" stroke="#d1283b" strokeWidth={10} /></g></Svg>
        <Pop t={t} at={W(6, 'pais')} x={540} y={1400}><Placa texto="O MAIS SEGURO DO PAÍS" bg="#1a1520" fg="#ffd23a" size={50} /></Pop>
      </Cam>
    );
  },
  // 7 as duas regras
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1000}>
      <Oficina t={t} quadro={false} />
      <Pers k={RELOJOEIRO} t={t} x={780} y={1640} h={700} movs={[['falar', t0], ['apontar', W(7, 'um') - 0.3, 1.2], ['falar', W(7, 'um') + 1], ['apontar', W(7, 'dois') - 0.3, 1.2], ['falar', W(7, 'dois') + 1]]} flip seed={2} />
      <Pop t={t} at={W(7, 'machuca') - 0.3} x={360} y={520}><Placa texto={'REGRA 1\nNINGUÉM SE\nMACHUCA'} bg="#fffaf0" size={50} /></Pop>
      <Pop t={t} at={W(7, 'apaixona') - 0.3} x={360} y={900}><Placa texto={'REGRA 2\nNINGUÉM SE\nAPAIXONA'} bg="#d1495b" fg="#fff" size={50} /></Pop>
    </Cam>
  ),
  // 8 disfarçados de equipe de limpeza
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1100}>
      <Saguao t={t} hora="11:52" />
      {EQUIPE.map((k, i) => {
        const x = andando(t, t0, -120 - i * 190, 150);
        return <Pers key={i} k={{ ...limpeza(k), item: i % 2 ? 'vassoura' : 'escova' }} t={t} x={x} y={1620 + (i % 2) * 30} h={560} movs={[['andar', t0]]} over={{ x: 0, boca: 'neutra', pupila: [0.6, 0] }} seed={i + 2} />;
      })}
      <Pop t={t} at={W(8, 'limpeza')} x={540} y={560}><Placa texto="LIMPEZA" bg="#e8e8ee" size={72} /></Pop>
    </Cam>
  ),
  // 9 11:56, Pardal apaga as câmeras
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={900}>
      <SalaCameras t={t} apagadas={clamp((t - W(9, 'apagou') + 0.1) / 0.9)} />
      <Pers k={PARDAL} t={t} x={540} y={1960} h={820} movs={[['parado', t0], ['sim', W(9, 'apagou') + 0.6, 1]]} over={{ maoE: [-80, -260], maoD: [80, -260], pupila: [0, -0.6], boca: 'sorriso' }} seed={6} />
    </Cam>
  ),
  // 10 meio-dia, primeiro sino, a broca gira
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1000}>
      <Cofre t={t} broca={t > W(10, 'broca') - 0.3 ? 1 : 0} />
      <Pers k={CORUJA} t={t} x={860} y={1720} h={600} movs={[['parado', t0], ['nervoso', W(10, 'broca')]]} seed={4} flip />
      <Pers k={GAIVOTA} t={t} x={180} y={1760} h={600} movs={[['parado', t0]]} over={{ pupila: [0.6, -0.3] }} seed={7} />
      <Dong t={t} at={W(10, 'meio')} x={760} y={280} />
      <Dong t={t} at={W(10, 'sino')} x={300} y={300} />
    </Cam>
  ),
  // 11 cada badalada escondia o barulho do metal
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1.3} cy={520}>
      <Torre t={t} h={12} m={1} balanco={1} />
      <Dong t={t} at={W(11, 'badalada')} />
      <Dong t={t} at={W(11, 'barulho')} x={400} y={430} />
      <Dong t={t} at={W(11, 'metal')} x={760} y={900} />
    </Cam>
  ),
  // 12 terceiro minuto: alarme silencioso
  ({ t, t0, t1 }) => {
    const a = W(12, 'alarme');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={1000}>
        <Saguao t={t} cameras={0} alarme={clamp((t - a) / 0.3)} hora="12:03" />
        <Pers k={ANDORINHA} t={t} x={320} y={1640} h={640} movs={[['parado', t0], ['susto', a + 0.1]]} seed={1} />
        <Pers k={TUCANO} t={t} x={760} y={1660} h={640} movs={[['parado', t0], ['susto', a + 0.2]]} seed={5} flip />
        <Pop t={t} at={a} x={540} y={540}><Placa texto="ALARME SILENCIOSO" bg="#d1283b" fg="#fff" size={52} /></Pop>
      </Cam>
    );
  },
  // 13 Inspetora Vera e vinte viaturas
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <Banco t={t} viaturas={clamp((t - t0 + 0.2) / (W(13, 'vinte') - t0 + 0.2))} faixa />
      <Pers k={VERA} t={t} x={540} y={1890} h={680} movs={[['entrar', t0, 0.8], ['parado', t0 + 0.8], ['apontar', W(13, 'banco') - 0.2, 1.3]]} over={{ boca: 'neutra', sobr: -0.6 }} seed={8} />
      <Pop t={t} at={W(13, 'vera')} x={540} y={300}><Placa texto="INSPETORA VERA" bg="#2c3346" fg="#fff" size={56} /></Pop>
      <Pop t={t} at={W(13, 'vinte')} x={820} y={1130}><Placa texto="20" bg="#1c3d6e" fg="#fff" size={90} /></Pop>
    </Cam>
  ),
  // 14 "Vocês não têm saída."
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.25} z1={1.35} cy={1000}>
      <Banco t={t} viaturas={1} faixa />
      <Pers k={{ ...VERA, item: 'celular' }} t={t} x={540} y={1800} h={820} movs={[['parado', t0], ['falar', W(14, 'era')]]} over={{ maoD: [70, -330], sobr: -0.5, boca: 'neutra' }} seed={8} />
      <Pop t={t} at={W(14, 'voces')} x={540} y={620}><Balao texto="Vocês não têm saída." /></Pop>
    </Cam>
  ),
  // 15 "Calma. Isso também estava no plano."
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.3} cy={1050}>
      <Oficina t={t} />
      <Pers k={{ ...RELOJOEIRO, item: 'microfone' }} t={t} x={540} y={1720} h={760} movs={[['parado', t0], ['falar', W(15, 'calma') - 0.1]]} over={{ boca: 'sorriso', maoD: [60, -300] }} seed={2} />
      <Pop t={t} at={W(15, 'calma')} x={540} y={560}><Balao texto="Calma..." /></Pop>
      <Pop t={t} at={W(15, 'plano') - 0.4} x={540} y={740}><Balao texto="Estava no plano." cor="#fff6c8" /></Pop>
    </Cam>
  ),
  // 16 a porta do cofre se abre no último sino
  ({ t, t0, t1 }) => {
    const a = clamp((t - W(16, 'abriu') + 0.3) / 1.3);
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cy={900}>
        <Cofre t={t} aberta={a} luz={a} />
        <Pers k={ANDORINHA} t={t} x={200} y={1760} h={600} movs={[['parado', t0], ['comemorar', W(16, 'abriu') + 0.3]]} seed={1} />
        <Pers k={TUCANO} t={t} x={880} y={1780} h={620} movs={[['parado', t0], ['comemorar', W(16, 'abriu') + 0.4]]} seed={5} flip />
        <Dong t={t} at={W(16, 'sino')} x={540} y={300} />
      </Cam>
    );
  },
  // 17 lá dentro não tinha nada
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
      <CofreDentro t={t} livro={0} />
      <Pers k={ANDORINHA} t={t} x={300} y={1680} h={640} movs={[['parado', t0], ['susto', W(17, 'nada') - 0.1]]} seed={1} />
      <Pers k={TUCANO} t={t} x={780} y={1700} h={660} movs={[['parado', t0], ['nao', W(17, 'ouro') - 0.2]]} over={{ boca: 'triste' }} seed={5} flip />
      <Pop t={t} at={W(17, 'nada')} x={540} y={520}><Placa texto="VAZIO" bg="#1a1520" fg="#fff" size={110} /></Pop>
    </Cam>
  ),
  // 18 o dono do banco levou tudo anos atrás (lembrança em sépia)
  ({ t, t0, t1 }) => (
    <Sepia>
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1200}>
        <Banco t={t} noite />
        <Svg>{Array.from({ length: 6 }, (_, i) => <Ouro key={i} x={andando(t, t0, 640, -110) + 70 + (i % 3) * 50} y={1560 - Math.floor(i / 3) * 34} s={0.9} />)}</Svg>
        <Pers k={{ ...DONO, item: 'saco' }} t={t} x={andando(t, t0, 640, -110)} y={1640} h={660} movs={[['andar', t0]]} over={{ x: 0, boca: 'dentes', pupila: [-0.7, 0], sobr: -0.6 }} seed={9} flip />
        <Pop t={t} at={W(18, 'anos')} x={540} y={300}><Placa texto="ANOS ATRÁS" bg="#fffaf0" size={60} /></Pop>
        <Pop t={t} at={W(18, 'rombo')} x={760} y={980}><Placa texto="ROMBO" bg="#d1283b" fg="#fff" size={64} /></Pop>
      </Cam>
    </Sepia>
  ),
  // 19 só sobrou um livro vermelho
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.8} cy={1180}>
      <CofreDentro t={t} livro={1} brilho={clamp((t - W(19, 'vermelha')) / 0.6)} />
      <Brilho t={t} at={W(19, 'prova')} x={540} y={1180} r={120} n={10} />
    </Cam>
  ),
  // 20 não viemos roubar o ouro, viemos roubar a verdade
  ({ t, t0, t1 }) => {
    const v = W(20, 'verdade');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1000}>
        <CofreDentro t={t} livro={0} />
        <Pers k={{ ...ANDORINHA, item: 'livro' }} t={t} x={540} y={1960} h={1050} movs={[['pensar', t0], ['parado', W(20, 'gente')], ['sim', v, 1]]} over={t > v - 0.2 ? { boca: 'sorriso', olhoFeliz: t < v + 0.8 } : { pupila: [0.4, -0.5] }} seed={1} />
        <Brilho t={t} at={v} x={600} y={1300} r={160} n={10} />
        <Pop t={t} at={v} x={540} y={330}><Placa texto="A VERDADE" bg="#d1283b" fg="#fff" size={80} /></Pop>
      </Cam>
    );
  },
  // 21 o livro em todos os jornais
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1} cy={900}>
      <JornalQ t={t} manchete="DONO DA CASA DO OURO ESVAZIOU O PRÓPRIO COFRE" sub="Livro vermelho revela o rombo"
        foto={<Ator k={DONO} t={t} x={280} y={760} h={760} movs={[['parado', 0]]} over={{ boca: 'o', olho: 1.3, suor: 1 }} seed={9} />} />
    </Cam>
  ),
  // 22 o dono sai algemado; a gente sai pelo esgoto
  ({ t, t0, t1 }) => {
    const g = W(22, 'gente') - 0.15;
    if (t < g) {
      const x = andando(t, t0, 540, 40);
      return (
        <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1200}>
          <Banco t={t} viaturas={1} faixa />
          <Pers k={POLICIAL} t={t} x={x - 210} y={1700} h={620} movs={[['andar', t0]]} over={{ x: 0, boca: 'neutra' }} seed={11} />
          <Pers k={DONO} t={t} x={x} y={1710} h={640} movs={[['andar', t0]]} over={{ x: 0, maoE: [-30, -110], maoD: [30, -110], boca: 'triste', sobrTriste: true, lagrima: 1 }} seed={9} />
          <Pers k={POLICIAL} t={t} x={x + 210} y={1700} h={620} movs={[['andar', t0]]} over={{ x: 0, boca: 'neutra' }} seed={12} />
          <Svg><circle cx={x} cy={1710 - 640 * 0.24} r={20} fill="none" stroke="#c8ced8" strokeWidth={8} /></Svg>
          <Pop t={t} at={W(22, 'algemado')} x={540} y={420}><Placa texto="ALGEMADO" bg="#1c3d6e" fg="#fff" size={64} /></Pop>
        </Cam>
      );
    }
    return (
      <Cam t={t} t0={g} t1={t1} z0={1} z1={1.06} cy={1200}>
        <Esgoto t={t} />
        {EQUIPE.map((k, i) => <Pers key={i} k={k} t={t} x={andando(t, g, -100 - i * 170, 170)} y={1530} h={460} movs={[['andar', g]]} over={{ x: 0, boca: 'sorriso' }} seed={i + 2} />)}
        <Pop t={t} at={W(22, 'centavo')} x={540} y={520}><Placa texto="R$ 0,00" bg="#fffaf0" size={70} /></Pop>
      </Cam>
    );
  },
  // 23 o Relojoeiro sai pela porta da frente, de farda
  ({ t, t0, t1 }) => (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.12} cx={600} cy={1200}>
      <Banco t={t} viaturas={1} />
      <Pers k={RELOJOEIRO_PM} t={t} x={andando(t, W(23, 'saiu'), 540, 70)} y={1300} h={500} movs={[['parado', t0], ['andar', W(23, 'saiu')]]} over={{ x: 0, boca: 'sorriso' }} seed={2} />
      <Pop t={t} at={W(23, 'policial')} x={760} y={760}><Placa texto="?!" bg="#e8c240" size={90} /></Pop>
    </Cam>
  ),
  // 24 Vera abre caminho e pisca
  ({ t, t0, t1 }) => {
    const p = W(24, 'piscou');
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cy={900}>
        <Banco t={t} viaturas={1} />
        <Pers k={RELOJOEIRO_PM} t={t} x={andando(t, t0, 900, 90)} y={1500} h={520} movs={[['andar', t0]]} over={{ x: 0 }} seed={2} flip />
        <Pers k={VERA} t={t} x={420} y={2050} h={1100} movs={[['parado', t0]]} over={{ boca: 'sorriso', pupila: [0.8, 0], pisca: t > p - 0.1 && t < p + 0.8 ? 1 : 0 }} seed={8} />
      </Cam>
    );
  },
  // 25 o plano sempre teve seis pessoas
  ({ t, t0, t1 }) => {
    const s = W(25, 'seis');
    const fim = TL.END, ult = TL.WORDS[TL.WORDS.length - 1].t1;
    return (
      <Cam t={t} t0={t0} t1={t1} z0={1.5} z1={1.75} cy={520}>
        <Oficina t={t} />
        {EQUIPE.map((k, i) => <Retrato key={i} k={semMascara(k)} t={t} x={300 + i * 120} y={440} w={96} h={112} rot={(i % 2 ? 4 : -4)} />)}
        {[300, 420, 540, 660, 780].map((x) => <Tacha key={x} x={x} y={392} />)}
        <Retrato k={VERA} t={t} x={540} y={600} w={110} h={130} rot={-3} op={clamp((t - s + 0.3) / 0.3)} over={{ boca: 'sorriso', pisca: 1 }} />
        <Svg><path d={`M300 440 L540 600 L780 440`} stroke="#d1283b" strokeWidth={4} fill="none" opacity={clamp((t - s) / 0.3)} /><circle cx={540} cy={600} r={90} fill="none" stroke="#d1283b" strokeWidth={8} opacity={clamp((t - s) / 0.3)} /></Svg>
        <Tacha x={540} y={540} />
        <Pop t={t} at={W(25, 'cinco')} x={330} y={720}><Placa texto="5" bg="#fffaf0" size={50} /></Pop>
        <Pop t={t} at={s} x={750} y={720}><Placa texto="6" bg="#d1283b" fg="#fff" size={50} /></Pop>
        {t > ult + 0.5 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: clamp((t - ult - 0.5) / 0.5) }} />}
        {t > ult + 0.8 && <div style={{ position: 'absolute', left: 0, right: 0, top: 455, textAlign: 'center', fontFamily: '"Arial Black", Arial', fontSize: 64, color: '#ffd23a', letterSpacing: 6, opacity: clamp((t - ult - 0.8) / 0.4) * (1 - clamp((t - fim + 0.4) / 0.4)) }}>QUATRO MINUTOS</div>}
      </Cam>
    );
  },
];

const comVinheta = (cs: Cena[]): Cena[] => cs.map((C) => (p: P) => <>{C(p)}<Vinheta forca={0.35} /></>);
// Efeitos: ElevenLabs (public/sfx-q4) + biblioteca do projeto. Ambientes em loop por cena e efeitos pontuais na palavra.
const sfx = (): Sfx[] => {
  const cena = (i: number) => [ini(i), ini(i + 1) - ini(i) + 0.3] as const;
  const amb = (f: string, de: number, ate: number, vol: number): Sfx => [f, ini(de), vol, ini(ate + 1) - ini(de) + 0.3, true];
  return [
    // ambientes
    amb('sfx-q4/relogios.mp3', 0, 0, 0.35),
    amb('sfx-q4/praca.mp3', 1, 1, 0.35),
    amb('sfx-q4/relogios.mp3', 2, 3, 0.3),
    amb('sfx-q4/praca.mp3', 6, 6, 0.3),
    amb('sfx-q4/relogios.mp3', 7, 7, 0.3),
    ['sfx-q4/saguao.mp3', ini(8), 0.45, cena(8)[1]],
    ['sfx-q4/broca.mp3', W(10, 'broca') - 0.2, 0.4, ini(12) - W(10, 'broca') + 0.4, true],
    amb('sfx-q4/praca.mp3', 11, 11, 0.25),
    ['sfx-q4/alarme.mp3', W(12, 'alarme'), 0.35, ini(13) - W(12, 'alarme') + 0.3, true],
    ['sfx-q4/esgoto.mp3', W(22, 'gente') - 0.15, 0.4, ini(23) - W(22, 'gente') + 0.4, true],
    amb('sfx-q4/relogios.mp3', 25, 25, 0.3),
    // sinos em cada "DONG"
    ...[W(1, 'sinos'), W(1, 'meio'), W(10, 'meio'), W(10, 'sino'), W(11, 'badalada'), W(11, 'barulho'), W(11, 'metal'), W(16, 'sino')].map((at): Sfx => ['sfx-q4/sino.mp3', at - 0.05, 0.55, 3.5]),
    // pontuais
    ['sfx-eleven/whoosh.mp3', W(3, 'andorinha') - 0.2, 0.5],
    ['sfx-flutua/crac.mp3', W(4, 'coruja') + 0.6, 0.5],
    ['sfx-q4/teclado.mp3', W(9, 'apagou') - 1.2, 0.5, 3],
    ['sfx-eleven/susto.mp3', W(12, 'alarme'), 0.4],
    ['sfx-q4/sirenes.mp3', ini(13), 0.45, cena(13)[1]],
    ['sfx-eleven/coracao.mp3', ini(14), 0.3, ini(16) - ini(14)],
    ['sfx-q4/telefone.mp3', ini(14), 0.5, 3],
    ['sfx-q4/radio.mp3', W(15, 'radio') - 0.1, 0.5, 1.5],
    ['sfx-q4/radio.mp3', W(15, 'plano') + 0.4, 0.4, 1.5],
    ['sfx-q4/cofre.mp3', W(16, 'abriu') - 0.6, 0.55, 5],
    ['sfx-eleven/boom.mp3', W(17, 'nada'), 0.5],
    ['sfx-eleven/brilho.mp3', W(19, 'prova'), 0.4],
    ['sfx-eleven/brilho.mp3', W(20, 'verdade'), 0.4],
    ['sfx-q4/algemas.mp3', W(22, 'algemado') - 0.1, 0.6, 1.5],
    ['sfx-q4/revelacao.mp3', W(25, 'seis') - 1.2, 0.6, 3.5],
  ];
};
export const QuatroMinutos = () => <FilmeMad tl={TL} cenas={comVinheta(CENAS)} voz="voz-quatro.mp3" sfx={sfx()} ganhoSfx={0.5} />;
export const DURACAO_QUATRO = TL.END;

