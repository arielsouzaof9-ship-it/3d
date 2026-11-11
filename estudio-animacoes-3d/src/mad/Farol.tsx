// "O Farol": animação 2D com os PERSONAGENS MAD ARTICULADOS, sem áudio (só legendas).
import { JSX, ReactNode, useId } from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { CHAO_RUA, L, Rua, Svg } from './cenarios';
import { Balao, Brilho, Cam, clamp, FADE, P, Placa, Pop } from './FiosBrancos';
import { Ator } from './FiosBrancosArticulado';
import { Granulado } from './Granulado';
import { RioNoite, RuaNoite, Sombra } from './cenarios-noite';
import { END, LINES, W, WORDS } from './timeline-farol';

// ---------- Elenco ----------
const TEO = { tipo: 'crianca', pele: '#e2b48c', roupa: '#f2c94c', calca: '#2f5fa8', sapato: '#e5484d', cabelo: 'topete', corCabelo: '#3a2416' };
const LIA = { tipo: 'crianca', pele: '#e2b48c', roupa: '#f28fb0', saia: '#f28fb0', cabelo: 'trancas', corCabelo: '#3a2416', sapato: '#7b5aa6' };
const POVO = [
  { tipo: 'idoso', pele: '#f6e3d3', roupa: '#8a6a4a', calca: '#4a4f3e', cabelo: 'careca', corCabelo: '#d6d6d6', oculos: true, item2: 'bengala' },
  { tipo: 'adulto', pele: '#b9805a', roupa: '#2fa36b', calca: '#2c3346', cabelo: 'longo', corCabelo: '#1f140e' },
  { tipo: 'adulto', pele: '#f6e3d3', roupa: '#d1495b', calca: '#2c3346', cabelo: 'curto', corCabelo: '#c8572b' },
  { tipo: 'adulto', pele: '#7a4b30', roupa: '#7b5aa6', calca: '#2f5fa8', cabelo: 'afro', corCabelo: '#120c08' },
  { tipo: 'adulto', pele: '#e2b48c', roupa: '#3d8bfd', calca: '#4a4f3e', cabelo: 'coque', corCabelo: '#d6d6d6' },
  { tipo: 'adulto', corpo: 'gordo', pele: '#f6e3d3', roupa: '#ff8a2f', calca: '#2c3346', cabelo: 'curto', corCabelo: '#3a2416', bigode: true },
];

// ---------- Noite, luz e sombras ----------
// Escuridão com "buracos" de luz (luzes: x, y, raio).
const Escuro = ({ luzes = [], forca = 0.8, cor = '#070a1c' }: { luzes?: [number, number, number][]; forca?: number; cor?: string }) => {
  const id = useId().replace(/:/g, '');
  return (
  <Svg>
    <defs>
      <radialGradient id={`b${id}`}>
        <stop offset="0.35" stopColor="#000" />
        <stop offset="1" stopColor="#fff" />
      </radialGradient>
      <mask id={`m${id}`}>
        <rect width={1080} height={1920} fill="#fff" />
        {luzes.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={`url(#b${id})`} />)}
      </mask>
    </defs>
    <rect width={1080} height={1920} fill={cor} opacity={forca} mask={`url(#m${id})`} />
    {luzes.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r * 0.75} fill="#ffd166" opacity={0.12} />)}
  </Svg>
  );
};
// Aura dourada em volta de quem brilha.
const Aura = ({ x, y, r = 260, t, k = 1 }: { x: number; y: number; r?: number; t: number; k?: number }) => (
  <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,102,0.55) 0%, rgba(255,214,102,0.18) 45%, rgba(255,214,102,0) 70%)', transform: `scale(${(1 + 0.04 * Math.sin(t * 4)) * k})`, mixBlendMode: 'screen' }} />
);
const Notas = ({ t, x, y }: { t: number; x: number; y: number }) => (
  <>
    {[0, 1, 2, 3].map((i) => {
      const k = ((t * 0.6 + i * 0.25) % 1);
      return <div key={i} style={{ position: 'absolute', left: x + i * 70 + Math.sin(t * 3 + i) * 20, top: y - k * 220, fontSize: 64, opacity: 1 - k, color: '#ffd166', fontFamily: 'Arial' }}>♪</div>;
    })}
  </>
);

// Cena de rua à noite. Recebe camadas: atras (corpos das sombras e personagens), luzes e frente (olhos).
const Noite = ({ t, atras, luzes, frente, forca = 0.8 }: { t: number; atras: ReactNode; luzes: [number, number, number][]; frente?: ReactNode; forca?: number }) => (
  <>
    <RuaNoite t={t} />
    {atras}
    <Escuro luzes={luzes} forca={forca} />
    {frente}
  </>
);

// ---------- Cenas ----------
// 0 — As sombras engolem quem está na rua.
const C00 = ({ t, t0, t1 }: P) => {
  const s = W(0, 'sombras');
  const xs = [150, 420, 930];
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1000}>
      <Noite t={t} luzes={[]} forca={0.55 + 0.25 * clamp((t - t0) / 1.5)}
        atras={xs.map((x, i) => t > s + i * 0.25 - 0.3 && <Sombra key={i} t={t} x={x} y={1240 + (i % 2) * 20} h={620 + i * 40} seed={i} op={clamp((t - s - i * 0.25 + 0.3) / 0.4)} />)}
        frente={xs.map((x, i) => t > s + i * 0.25 && <Sombra key={i} t={t} x={x} y={1240 + (i % 2) * 20} h={620 + i * 40} seed={i} olhos op={clamp((t - s - i * 0.25) / 0.3)} />)} />
    </Cam>
  );
};
// 1 — Menos eu: o Téo entra brilhando.
const C01 = ({ t, t0, t1 }: P) => {
  const x = 540;
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.2} cy={1000}>
      <Noite t={t} luzes={[[x, 1050, 360]]}
        atras={<><Sombra t={t} x={180} y={1250} h={680} seed={1} /><Sombra t={t} x={920} y={1250} h={700} seed={2} /><Ator k={TEO} t={t} x={x} y={CHAO_RUA} h={620} movs={[['entrar', t0], ['acenar', t0 + 0.6]]} seed={1} /></>}
        frente={<><Aura x={x} y={1050} t={t} /><Sombra t={t} x={180} y={1250} h={680} seed={1} olhos /><Sombra t={t} x={920} y={1250} h={700} seed={2} olhos /></>} />
    </Cam>
  );
};
// 2 — Desde pequeno, eu brilho no escuro.
const C02 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1.5} z1={1.65} cy={900}>
    <Noite t={t} luzes={[[540, 900, 420]]} atras={<Ator k={TEO} t={t} x={540} y={CHAO_RUA} h={620} movs={[['comemorar', t0 + 0.2]]} seed={1} />} frente={<><Aura x={540} y={950} r={320} t={t} /><Brilho t={t} at={W(2, 'brilho')} x={540} y={900} n={12} r={180} /></>} />
  </Cam>
);
// 3 — As sombras se afastam da luz.
const C03 = ({ t, t0, t1 }: P) => {
  const k = clamp((t - W(3, 'afastam') + 0.2) / 1.2);
  const xs = [330 - k * 180, 750 + k * 180];
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1000}>
      <Noite t={t} luzes={[[540, 1050, 380]]}
        atras={<>{xs.map((x, i) => <Sombra key={i} t={t} x={x} y={1260} h={680} seed={i + 3} />)}<Ator k={TEO} t={t} x={540} y={CHAO_RUA} h={620} movs={[['parado', t0], ['bravo', t0 + 0.4]]} seed={1} /></>}
        frente={<><Aura x={540} y={1050} t={t} />{xs.map((x, i) => <Sombra key={i} t={t} x={x} y={1260} h={680} seed={i + 3} olhos />)}</>} />
    </Cam>
  );
};
// 4 — Leva as pessoas pra casa à noite (andando de mãos dadas com o senhor).
const C04 = ({ t, t0, t1 }: P) => {
  const x = 120 + clamp((t - t0) / (t1 - t0 + 0.3)) * 560;
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1000}>
      <Noite t={t} luzes={[[x + 120, 1050, 400]]}
        atras={<><Sombra t={t} x={960} y={1250} h={700} seed={5} /><Ator k={POVO[0]} t={t} x={x} y={CHAO_RUA} h={640} movs={[['andar', t0]]} over={{ x: 0, maoD: [110, -170], boca: 'sorriso' }} seed={3} /><Ator k={TEO} t={t} x={x + 230} y={CHAO_RUA} h={600} movs={[['andar', t0 + 0.1]]} over={{ x: 0, maoE: [-110, -170] }} seed={1} /></>}
        frente={<><Aura x={x + 230} y={1050} t={t} /><Sombra t={t} x={960} y={1250} h={700} seed={5} olhos /></>} />
    </Cam>
  );
};
// 5 — Quem segura a minha mão fica seguro.
const C05 = ({ t, t0, t1 }: P) => {
  const m = W(5, 'mao');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1.25} cy={1050}>
      <Noite t={t} luzes={[[540, 1050, 420]]}
        atras={<><Sombra t={t} x={100} y={1260} h={700} seed={6} /><Ator k={POVO[1]} t={t} x={400} y={CHAO_RUA} h={640} movs={[['nervoso', t0], ['parado', m]]} over={t >= m ? { maoD: [120, -175], boca: 'sorriso' } : {}} seed={4} /><Ator k={TEO} t={t} x={660} y={CHAO_RUA} h={600} movs={[['parado', t0]]} over={t >= m ? { maoE: [-120, -175], boca: 'riso' } : {}} seed={1} /></>}
        frente={<><Aura x={560} y={1050} t={t} /><Sombra t={t} x={100} y={1260} h={700} seed={6} olhos /><Pop t={t} at={W(5, 'seguro')} x={540} y={600}><Placa texto="SEGURO" bg="#7be07b" size={56} /></Pop></>} />
    </Cam>
  );
};
// 6 — A irmã Lia tem medo do escuro.
const C06 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.35} cy={950}>
    <Noite t={t} luzes={[[540, 1000, 200]]} forca={0.7}
      atras={<><Sombra t={t} x={900} y={1250} h={650} seed={7} /><Ator k={LIA} t={t} x={520} y={CHAO_RUA} h={540} movs={[['nervoso', t0]]} seed={2} /></>}
      frente={<><Sombra t={t} x={900} y={1250} h={650} seed={7} olhos /><Pop t={t} at={W(6, 'lia')} x={300} y={640}><Placa texto="LIA, 6 ANOS" bg="#f28fb0" size={48} /></Pop></>} />
  </Cam>
);
// 7 — Mas comigo, ela dança na calçada.
const C07 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.12} cy={1000}>
    <Noite t={t} luzes={[[540, 1050, 440]]}
      atras={<><Ator k={TEO} t={t} x={680} y={CHAO_RUA} h={600} movs={[['falar', t0], ['gargalhar', W(7, 'danca')]]} seed={1} /><Ator k={LIA} t={t} x={400} y={CHAO_RUA} h={540} movs={[['comemorar', W(7, 'danca') - 0.3]]} over={{ incl: 8 * Math.sin(t * 5) }} seed={2} /></>}
      frente={<><Aura x={680} y={1050} t={t} /><Notas t={t} x={300} y={760} /></>} />
  </Cam>
);
// 8 — A luz da cidade apagou: as janelas e os postes se apagam um a um.
const C08 = ({ t, t0, t1 }: P) => {
  const a = W(8, 'apagou');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
      <RuaNoite t={t} acesa={(i) => t < a + i * 0.14} postes={t < a + 0.9} />
      <Escuro forca={0.2 + 0.55 * clamp((t - a) / 1.2)} luzes={[]} />
    </Cam>
  );
};
// 9 — Trezentas pessoas no escuro: olhinhos nas janelas e na rua.
const C09 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1000}>
    <RuaNoite t={t} acesa={() => false} postes={false} />
    <Escuro forca={0.8} luzes={[]} />
    <Svg>
      {Array.from({ length: 46 }, (_, i) => {
        const h1 = Math.sin(i * 12.9898) * 43758.5453, h2 = Math.sin(i * 78.233) * 12345.678; const x = 60 + (h1 - Math.floor(h1)) * 940, y = 820 + (h2 - Math.floor(h2)) * 700;
        const on = t > t0 + (i % 12) * 0.08;
        const pis = (t * 0.9 + i * 0.37) % 2.6 < 0.1 ? 0.2 : 1;
        return on && <g key={i}><ellipse cx={x} cy={y} rx={9} ry={12 * pis} fill="#fff" /><ellipse cx={x + 26} cy={y} rx={9} ry={12 * pis} fill="#fff" /></g>;
      })}
    </Svg>
    <Pop t={t} at={W(9, 'trezentas')} x={540} y={560}><Placa texto="300 PESSOAS" bg="#ffd166" size={60} /></Pop>
  </Cam>
);
// 10 — Do outro lado do rio, uma cidade iluminada.
const C10 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.15} cx={820} cy={800}>
    <RioNoite t={t} />
    <Pop t={t} at={W(10, 'iluminada')} x={820} y={420}><Placa texto="CIDADE ILUMINADA" bg="#ffd166" size={44} /></Pop>
  </Cam>
);
// Fila de mãos dadas atrás do Téo (andando para a direita).
const Fila = ({ t, t0, x0, n, y, h = 440, some = 0, cantar = false }: { t: number; t0: number; x0: number; n: number; y: number; h?: number; some?: number; cantar?: boolean }) => {
  const passo = h * 0.44;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const k = POVO[i % POVO.length];
        const x = x0 - (i + 1) * passo;
        const op = i >= n - some ? 0 : 1;
        if (!op) return null;
        return <Ator key={i} k={k} t={t} x={x} y={y} h={h} movs={[['andar', t0 + i * 0.07]]} over={{ x: 0, maoD: [130, -170], maoE: [-130, -170], boca: cantar ? 'aberta' : 'sorriso', fala: cantar ? 0.5 + 0.5 * Math.sin(t * 6 + i) : 0 }} seed={i + 10} />;
      })}
    </>
  );
};
// 11 — Fizemos uma fila de mãos dadas.
const C11 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1000}>
    <Noite t={t} luzes={[[840, 1080, 440]]}
      atras={<><Fila t={t} t0={t0} x0={840} n={5} y={CHAO_RUA} /><Ator k={TEO} t={t} x={840} y={CHAO_RUA} h={460} movs={[['andar', t0]]} over={{ x: 0, maoE: [-130, -170], boca: 'riso' }} seed={1} /></>}
      frente={<><Aura x={840} y={1080} t={t} /><Pop t={t} at={W(11, 'fila')} x={540} y={620}><Placa texto="TODOS DE MÃOS DADAS" bg="#fff" size={46} /></Pop></>} />
  </Cam>
);
// 12 — As sombras abriam caminho enquanto a gente cantava.
const C12 = ({ t, t0, t1 }: P) => {
  const k = clamp((t - t0) / 1.4);
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.12} cy={1000}>
      <Noite t={t} luzes={[[820, 1080, 440]]}
        atras={<><Sombra t={t} x={960 + k * 150} y={1250} h={700} seed={8} /><Sombra t={t} x={120 - k * 140} y={1250} h={680} seed={9} /><Fila t={t} t0={t0} x0={820} n={4} y={CHAO_RUA} cantar /><Ator k={TEO} t={t} x={820} y={CHAO_RUA} h={460} movs={[['andar', t0]]} over={{ x: 0, maoE: [-130, -170], boca: 'aberta', fala: 0.5 + 0.5 * Math.sin(t * 6) }} seed={1} /></>}
        frente={<><Aura x={820} y={1080} t={t} /><Sombra t={t} x={960 + k * 150} y={1250} h={700} seed={8} olhos /><Sombra t={t} x={120 - k * 140} y={1250} h={680} seed={9} olhos /><Notas t={t} x={340} y={780} /></>} />
    </Cam>
  );
};
// 13 — Achei que tinha nascido pra salvar todo mundo.
const C13 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1.5} z1={1.65} cy={900}>
    <Noite t={t} luzes={[[540, 900, 420]]} atras={<Ator k={TEO} t={t} x={540} y={CHAO_RUA} h={620} movs={[['parado', t0], ['comemorar', W(13, 'salvar') - 0.2]]} over={{ boca: 'riso' }} seed={1} />} frente={<><Aura x={540} y={950} r={320} t={t} /><Brilho t={t} at={W(13, 'salvar')} x={540} y={850} n={12} r={200} /></>} />
  </Cam>
);
// 14 — No meio da ponte, a fila ficou mais curta.
const C14 = ({ t, t0, t1 }: P) => {
  const c = W(14, 'curta');
  const some = t > c - 0.3 ? Math.min(3, 1 + Math.floor((t - c + 0.3) / 0.35)) : 0;
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1100}>
      <RioNoite t={t} ponte />
      <Escuro luzes={[[860, 1150, 420]]} forca={0.55} />
      <Fila t={t} t0={t0} x0={860} n={5} y={1300} h={420} some={some} cantar={!some} />
      <Ator k={TEO} t={t} x={860} y={1300} h={440} movs={[['andar', t0]]} over={{ x: 0, maoE: [-130, -170] }} seed={1} />
      <Aura x={860} y={1150} t={t} />
    </Cam>
  );
};
// 15 — Olhei pra trás: as sombras apagavam o fim da fila.
const C15 = ({ t, t0, t1 }: P) => {
  const a = W(15, 'apagavam');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.2} cx={300} cy={1100}>
      <RioNoite t={t} ponte />
      <Sombra t={t} x={120} y={1310} h={760} seed={10} />
      <Sombra t={t} x={330} y={1310} h={700} seed={11} alcanca={clamp((t - a + 0.6) / 0.6)} />
      <Fila t={t} t0={t0} x0={860} n={3} y={1300} h={420} />
      {t < a + 0.4 && <div style={{ opacity: 1 - clamp((t - a) / 0.4) }}><Fila t={t} t0={t0} x0={860 - 3 * 185} n={1} y={1300} h={420} /></div>}
      <Escuro luzes={[[860, 1150, 400]]} forca={0.6} />
      <Sombra t={t} x={120} y={1310} h={760} seed={10} olhos />
      <Sombra t={t} x={330} y={1310} h={700} seed={11} olhos sorriso={clamp((t - a) / 0.5)} />
    </Cam>
  );
};
// 16 — Elas nunca tiveram medo da minha luz (o Téo leva um susto; as sombras sorriem).
const C16 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.2} cy={1000}>
    <Noite t={t} luzes={[[540, 1050, 380]]}
      atras={<><Sombra t={t} x={250} y={1260} h={760} seed={12} alcanca={0.15 + 0.5 * clamp((t - t0) / 1.5)} lado={1} /><Sombra t={t} x={830} y={1260} h={760} seed={13} alcanca={0.15 + 0.5 * clamp((t - t0) / 1.5)} lado={-1} /><Ator k={TEO} t={t} x={540} y={CHAO_RUA} h={620} movs={[['parado', t0], ['susto', W(16, 'medo') - 0.2, 1.3], ['nervoso', W(16, 'medo') + 1.1]]} seed={1} /></>}
      frente={<><Aura x={540} y={1050} t={t} /><Sombra t={t} x={250} y={1260} h={760} seed={12} olhos sorriso={1} /><Sombra t={t} x={830} y={1260} h={760} seed={13} olhos sorriso={1} /></>} />
  </Cam>
);
// 17 — Elas seguiam a minha luz pra achar todo mundo.
const C17 = ({ t, t0, t1 }: P) => {
  const k = clamp((t - t0) / (t1 - t0));
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={1000}>
      <Noite t={t} luzes={[[760, 1050, 380]]}
        atras={<>{[0, 1, 2, 3].map((i) => <Sombra key={i} t={t} x={-80 + i * 170 + k * 120} y={1250} h={640 + i * 30} seed={14 + i} alcanca={i === 3 ? 0.6 : 0} />)}<Ator k={TEO} t={t} x={760} y={CHAO_RUA} h={600} movs={[['andar', t0]]} over={{ x: 0, sobrTriste: true, boca: 'onda', pupila: [-1, 0] }} seed={1} /></>}
        frente={<><Aura x={760} y={1050} t={t} />{[0, 1, 2, 3].map((i) => <Sombra key={i} t={t} x={-80 + i * 170 + k * 120} y={1250} h={640 + i * 30} seed={14 + i} olhos sorriso={0.8} />)}<Pop t={t} at={W(17, 'achar')} x={420} y={600}><Balao texto="ACHAMOS!" cor="#d1d5ff" /></Pop></>} />
    </Cam>
  );
};
// 18 — Só sobrou uma mão na minha: a da Lia.
const C18 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.35} cy={1050}>
    <RioNoite t={t} ponte />
    <Escuro luzes={[[620, 1150, 360]]} forca={0.75} />
    <Ator k={LIA} t={t} x={430} y={1300} h={500} movs={[['chorar', t0], ['parado', W(18, 'lia') - 0.3]]} over={t >= W(18, 'lia') - 0.3 ? { maoD: [130, -175], sobrTriste: true, boca: 'triste', lagrima: 1 } : {}} seed={2} />
    <Ator k={TEO} t={t} x={680} y={1300} h={540} movs={[['parado', t0]]} over={{ maoE: [-130, -175], sobrTriste: true, boca: 'triste', pupila: [-0.8, 0.3] }} seed={1} />
    <Aura x={680} y={1150} t={t} />
  </Cam>
);
// 19 — "Não solta." "Nunca."
const C19 = ({ t, t0, t1 }: P) => {
  const s = W(19, 'solta'), n = W(19, 'nunca');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.45} cy={1000}>
      <RioNoite t={t} ponte />
      <Escuro luzes={[[600, 1150, 380]]} forca={0.8} />
      <Ator k={LIA} t={t} x={450} y={1300} h={500} movs={[['parado', t0], ['sim', n]]} over={{ maoD: [130, -175], boca: t >= n ? 'sorriso' : 'triste', lagrima: 1 }} seed={2} />
      <Ator k={TEO} t={t} x={700} y={1300} h={540} movs={[['falar', s - 0.2, 1.2], ['parado', s + 1]]} over={{ maoE: [-130, -175], pupila: [-1, 0.4], sobrTriste: true }} seed={1} />
      <Aura x={700} y={1150} t={t} />
      <Pop t={t} at={s} x={760} y={760}><Balao texto="Não solta." /></Pop>
      <Pop t={t} at={n} x={330} y={860}><Balao texto="Nunca." cor="#f6b8c8" /></Pop>
    </Cam>
  );
};
// 20 — E pela primeira vez, eu apaguei a minha luz.
const C20 = ({ t, t0, t1 }: P) => {
  const a = W(20, 'apaguei');
  const k = clamp((t - a) / 1.2);
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.3} z1={1.5} cy={1050}>
      <RioNoite t={t} ponte />
      <Ator k={LIA} t={t} x={450} y={1300} h={500} movs={[['parado', t0]]} over={{ maoD: [130, -175], olho: 0, olhoFeliz: true, boca: 'sorriso' }} seed={2} />
      <Ator k={TEO} t={t} x={700} y={1300} h={540} movs={[['parado', t0]]} over={{ maoE: [-130, -175], olho: 0, olhoFeliz: true, boca: 'sorriso' }} seed={1} />
      <Escuro luzes={[[600, 1150, 380 * (1 - k) + 1]]} forca={0.8 + 0.2 * k} />
      <Aura x={700} y={1150} t={t} k={1 - k} />
      {k >= 1 && <Svg>{[[300, 900], [760, 820]].map(([x, y], i) => <g key={i} opacity={clamp((t - a - 1.4) / 0.6)}><ellipse cx={x} cy={y} rx={14} ry={18} fill="#fdfbe0" /><ellipse cx={x + 50} cy={y} rx={14} ry={18} fill="#fdfbe0" /></g>)}</Svg>}
    </Cam>
  );
};

const CENAS: ((p: P) => JSX.Element)[] = [C00, C01, C02, C03, C04, C05, C06, C07, C08, C09, C10, C11, C12, C13, C14, C15, C16, C17, C18, C19, C20];

const Legenda = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = WORDS.findIndex((w, i) => t >= w.t0 - 0.05 && (i === WORDS.length - 1 || t < WORDS[i + 1].t0 - 0.05));
  if (idx < 0 || t > WORDS[WORDS.length - 1].t1 + 0.6) return null;
  const cur = WORDS[idx];
  const start = Math.floor(cur.i / 3) * 3;
  const chunk = WORDS.filter((w) => w.line === cur.line).slice(start, start + 3);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1500 }}>
      <div style={{ textAlign: 'center', maxWidth: 980, fontFamily: '"Arial Black", Arial, sans-serif', fontSize: 82, lineHeight: 1.1 }}>
        {chunk.map((w) => (
          <span key={w.i} style={{ color: w.stressed ? '#ffd23a' : '#fff', WebkitTextStroke: '16px #2a2230', paintOrder: 'stroke fill', margin: '0 18px', display: 'inline-block', transform: w === cur ? 'scale(1.1)' : 'none' }}>{w.text}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
const Cena = ({ C, t0, t1, fade }: { C: (p: P) => JSX.Element; t0: number; t1: number; fade: boolean }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity: fade ? Math.min(1, frame / FADE) : 1, overflow: 'hidden' }}>
      <C t={t0 + frame / fps} t0={t0} t1={t1} />
    </AbsoluteFill>
  );
};
export const Farol = () => {
  const { fps } = useVideoConfig();
  const inicio = LINES.map((_, i) => (i === 0 ? 0 : W(i, 0)));
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {CENAS.map((C, i) => {
        const t0 = inicio[i];
        const t1 = i + 1 < CENAS.length ? inicio[i + 1] : END;
        const from = Math.round(t0 * fps);
        const dur = Math.round(t1 * fps) - from + (i + 1 < CENAS.length ? FADE : 0);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`cena ${i}`}>
            <Cena C={C} t0={from / fps} t1={t1} fade={i > 0} />
          </Sequence>
        );
      })}
      <Granulado />
      <Legenda />
    </AbsoluteFill>
  );
};
export const DURACAO_FAROL = END;
