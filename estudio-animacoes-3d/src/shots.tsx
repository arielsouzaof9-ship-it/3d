import { JSX } from 'react';
import { easeOut, lerp3, seg, track, V3 } from './anim';
import { Character, faceAt, Pose, REST } from './Character';
import { Asteroide, Ave, CIDADAOS, DINO, DinoPose, DINOSSAUROIDE, Espaco, Jurassico, Pescocudo, pop, Poste, Ratinho, Terra, Toca, TRex } from './dinos';
import { Bairro, VOCE_K } from './historia';
import { Calendar, Comic, LedCounter, Puff, Sign, Sparkles, StampMark, Tag } from './props';
import { Cam, Room, Stage, Street } from './sets';
import { F, W } from './timeline';

// ============================================================================
// "E se o asteroide tivesse errado?" — tomadas (ver STORYBOARD.md).
// ============================================================================

export type ShotProps = { t: number; t0: number; t1: number };
export type Shot = { from: number; name: string; C: (p: ShotProps) => JSX.Element };

export const SFX: { at: number; file: string; vol: number }[] = [];

const P = (o: Partial<Pose> = {}): Pose => ({ ...REST, ...o });
const D = (o: Partial<DinoPose> = {}): DinoPose => ({ ...DINO, ...o });
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

// ---------------- Linha 0: o asteroide passa raspando ----------------
const TERRA: V3 = [0, 0, -32];
const astro = (t: number): V3 => {
  const te = W(0, 'errado');
  return lerp3([-1, 1.2, 22], [8.5, 2.5, -30], t / te); // continua depois de te (extrapola)
};

// "E se o asteroide que acabou com os dinossauros" — câmera persegue o asteroide
const S01 = ({ t, t0, t1 }: ShotProps) => {
  const a = astro(t);
  return (
    <>
      <Espaco />
      <Terra t={t} position={TERRA} />
      <Asteroide t={t} position={a} rotation={[0, 0.17, 0]} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t, add(a, [-2.0, 1.2, 7]), add(a, [0.5, -0.6, -10]), 34]]} />
    </>
  );
};

// "tivesse *errado* a Terra?" — passa ao lado da Terra
const S02 = ({ t, t0, t1 }: ShotProps) => {
  const a = astro(t);
  const e = W(0, 'errado');
  return (
    <>
      <Espaco />
      <Terra t={t} position={TERRA} />
      <Asteroide t={t} position={a} rotation={[0, 0.17, 0]} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-12, 4, -12], [3, 1, -30], 34], [t1, [-11, 3.5, -14], [5, 1.5, -31], 34]]} />
      <Comic t={t} at={e} text="ERROU!" position={add(astro(e), [0, 3, 0])} size={3} hold={1.2} />
    </>
  );
};

// ---------------- Linha 1 ----------------
// "Há sessenta e seis *milhões* de anos," — contador 66.000.000
const S03 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(1, 'milhoes');
  return (
    <>
      <Stage color="#1d2350" />
      <Terra t={t} r={0.6} position={[0, 0.95, 0]} />
      <LedCounter t={t} from={t0} at={m} value={66000000} position={[0, 2.35, 0]} scale={0.6} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 1.9, 4.6], [0, 1.6, 0], 32], [t1, [-0.3, 1.8, 4.0], [0, 1.65, 0], 32]]} />
    </>
  );
};

// "uma rocha de *dez* quilômetros passaria *raspando*." — placa 10 KM, depois sai voando
const S04 = ({ t, t0, t1 }: ShotProps) => {
  const d = W(1, 'dez');
  const r = W(1, 'raspando');
  const x = Math.max(0, t - (r - 0.1)) * 28;
  return (
    <>
      <Espaco />
      <Asteroide t={t} position={[x, 0.2, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.15} trail={t > r - 0.1 ? 1 : 0} />
      <group scale={pop(t, d)} position={[0.15, -1.55, 0.6]}>
        <Sign text="10 KM" w={1.5} h={0.55} bg="#c4161c" fg="#ffffff" />
      </group>
      <Comic t={t} at={r} text="VUUSH!" position={[0.3, 1.7, 0.6]} size={0.7} hold={1} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.4, 0.3, 6.2], [0.1, 0, 0], 32], [t1, [-0.2, 0.2, 5.4], [0.2, 0, 0], 32]]} />
    </>
  );
};

// ---------------- Linha 2 ----------------
// "E os dinossauros continuariam *mandando* no planeta." — T-rex ruge
const S05 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(2, 'mandando');
  const rex = track(t, D({ x: 0.6, z: -1, ry: -0.35, hp: 0.1 }), [{ at: m, v: { jaw: 0.75, hp: -0.45, lean: -0.15 } }]);
  return (
    <>
      <Jurassico t={t} />
      <Pescocudo t={t} position={[-6, 0, -10]} rotation={[0, 0.6, 0]} />
      <TRex p={{ ...rex, tail: Math.sin(t * 2) * 0.15 }} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [3.2, 1.1, 7.5], [0, 2.6, -1.5], 34], [t1, [2.2, 0.9, 6.2], [0, 2.8, -1.5], 34]]} />
      <Comic t={t} at={m} text="ROAR!" position={[-0.6, 4.4, 0.6]} size={0.9} hold={1.2} />
    </>
  );
};

// ---------------- Linha 3 ----------------
// "Os mamíferos, … continuariam *pequenos*, escondidos no escuro." — ratinho na toca, T-rex passa atrás
const S06 = ({ t, t0, t1 }: ShotProps) => {
  const p = W(3, 'pequenos');
  const wx = -7 + (t - t0) * 1.6;
  return (
    <>
      <Jurassico t={t} night />
      <Toca position={[0, 0, 0]} />
      <Ratinho t={t} tremble={t > p - 0.1 ? 1 : 0} position={[0.05, 0, 0.95]} scale={1.5} look={t > p ? [-0.6, 0.3] : [0, 0]} />
      <TRex p={D({ x: wx, z: -4.5, ry: Math.PI / 2, walk: (t - t0) * 1.6 / 0.9, stride: 1 })} />
      <Puff t={t} at={p} position={[wx + 0.4, 0.1, -4.2]} color="#6a5a4a" size={0.5} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.4, 1.1, 5.6], [0, 0.9, -1.5], 32], [t1, [0.8, 0.9, 4.8], [0, 0.9, -1.5], 32]]} />
    </>
  );
};

// ---------------- Linha 4 ----------------
// "Sem espaço para crescer, talvez os macacos *nunca* surgissem," — carimbo NUNCA
const S07 = ({ t, t0, t1 }: ShotProps) => {
  const n = W(4, 'nunca');
  return (
    <>
      <Stage color="#4a3a5a" />
      <Sign text="MACACOS" w={1.6} h={0.6} position={[0, 1.4, 0]} bg="#6b4a2e" fg="#f3cf6b" />
      <group position={[0.25, 1.35, 0.06]} rotation={[0, 0, -0.18]} scale={pop(t, n) * 1.2}>
        <StampMark text="NUNCA" w={1.1} rotation={[0, 0, 0]} />
      </group>
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.2, 1.6, 4.4], [0, 1.35, 0], 32], [t1, [0.05, 1.5, 3.8], [0, 1.35, 0], 32]]} />
    </>
  );
};

// "e nem *você*." — você some numa fumaça
const S08 = ({ t, t0, t1 }: ShotProps) => {
  const v = W(4, 'voce');
  const pose = track(t, P({ y: 0.3 }), [{ at: v, v: { lsz: 0.9, rsz: 0.9, lel: 0.5, rel: 0.5 }, lead: 6 }]);
  return (
    <>
      <Stage color="#4a3a5a" />
      {t < v && <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'smile' }, { at: v - 0.25, f: 'shocked' }], 50)} look={VOCE_K} />}
      <Puff t={t} at={v} position={[0, 1.1, 0]} color="#e8d6f8" size={0.6} n={8} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 1.4, 3.6], [0, 1.15, 0], 32], [t1, [0, 1.35, 3.2], [0, 1.15, 0], 32]]} />
    </>
  );
};

// ---------------- Linha 5 ----------------
// "Enquanto isso, os dinossauros teriam milhões de anos para *evoluir*." — calendário de milhões de anos
const RAPTOR = { color: '#c98a3a', belly: '#f2dcae', s: 0.5, arms: 0.55, eyes: 0.19 };
const S09 = ({ t, t0, t1 }: ShotProps) => {
  const e = W(5, 'evoluir');
  const rp = track(t, D({ x: -0.55, ry: 0.5, hy: 0.3 }), [{ at: e, v: { hy: -0.2, hp: -0.2, jaw: 0.3 } }]);
  return (
    <>
      <Jurassico t={t} />
      <TRex p={rp} {...RAPTOR} />
      <Calendar t={t} from={t0} at={e} pages={['1 MI', '10 MI', '30 MI', '60 MI\nDE ANOS!']} position={[0.6, 1.3, 0.3]} rotation={[0, -0.3, 0]} scale={0.7} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 1.5, 4.8], [0.2, 1.2, 0], 32], [t1, [0.1, 1.4, 4.2], [0.2, 1.2, 0], 32]]} />
    </>
  );
};

// ---------------- Linha 6 ----------------
// "Um cientista chegou a imaginar um dinossauro *inteligente*," — o raptor vira dinossauroide
const S10 = ({ t, t0, t1 }: ShotProps) => {
  const i = W(6, 'inteligente');
  const rp = D({ x: 0, ry: 0.2, lean: -0.5 * seg(t, t0, i - 0.15), hp: 0.4 * seg(t, t0, i - 0.15) });
  const pose = track(t, P({ ry: 0.1 }), [{ at: i + 0.3, v: { rsz: 1.1, rsx: 0.8, rel: -0.9, hr: 0.15 } }]);
  return (
    <>
      <Jurassico t={t} />
      {t < i ? <TRex p={rp} {...RAPTOR} /> : <Character pose={pose} face={faceAt(t, [{ at: i, f: 'smug' }, { at: i + 0.6, f: 'confident' }], 51)} look={DINOSSAUROIDE} />}
      <Puff t={t} at={i} position={[0, 1.1, 0.3]} color="#fff2c8" size={0.9} n={9} />
      <Sparkles t={t} from={i} n={7} radius={0.9} center={[0, 1.4, 0.2]} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.8, 1.5, 4.8], [0, 1.2, 0], 32], [t1, [0.2, 1.6, 3.9], [0, 1.4, 0], 32]]} />
    </>
  );
};

// "de cabeça grande, andando em duas pernas." — anda para a câmera
const S11 = ({ t, t0 }: ShotProps) => {
  const d = (t - t0) * 0.9;
  const z = -2 + d;
  const face = faceAt(t, [{ at: t0, f: 'curious' }, { at: W(6, 'andando'), f: 'happy' }], 52);
  return (
    <>
      <Jurassico t={t} />
      <Character pose={P({ z, walk: d / 0.24, stride: 1, ry: 0 })} face={face} look={DINOSSAUROIDE} />
      <Cam t={t} t0={t0} t1={t0 + 99} keys={[[t, [0.9, 1.6, z + 3.6], [0, 1.25, z], 32]]} />
    </>
  );
};

// ---------------- Linha 7 ----------------
// "Ele chamou essa criatura de *dinossauroide*." — museu com a plaquinha
const S12 = ({ t, t0, t1 }: ShotProps) => {
  const d = W(7, 'dinossauroide');
  const pose = track(t, P({ y: 0.6, ry: 0.15, lsz: 0.2, rsz: 0.2 }), [{ at: d, v: { rsz: 1.2, rsx: 0.5, rel: -0.6, hy: 0.2 } }]);
  return (
    <>
      <Room placa="MUSEU" parede="#2f4a5a" balcao={false} />
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.6, 1.2]} />
        <meshStandardMaterial color="#e9e2d0" />
      </mesh>
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'neutral' }, { at: d, f: 'bigSmile' }], 53)} look={DINOSSAUROIDE} />
      <group position={[0, 0.32, 0.64]} scale={pop(t, d)}>
        <Sign text="DINOSSAUROIDE" w={1.5} h={0.3} bg="#c9a14a" fg="#2a1a0a" />
      </group>
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 1.3, 3.9], [0, 1.1, 0], 32], [t1, [0.2, 1.25, 3.4], [0, 1.1, 0], 32]]} />
    </>
  );
};

// ---------------- Linha 8 ----------------
// "Talvez hoje existissem cidades construídas por *répteis*." — cidade de dinossauroides
const S13 = ({ t, t0, t1 }: ShotProps) => {
  const r = W(8, 'repteis');
  const walkers = [
    { x0: -2.0, z: 0.4, dir: 1, sp: 0.5 },
    { x0: 2.0, z: 1.3, dir: -1, sp: 0.5 },
  ];
  const waver = track(t, P({ x: 0.2, z: -0.6, ry: 0 }), [{ at: r, v: { rsz: 2.4, rel: 0.3, hr: 0.15 } }]);
  return (
    <>
      <Street placa="REPTILÂNDIA" parede="#cfe3c2" porta="#3a5a32" />
      {walkers.map((w, i) => {
        const d = (t - t0) * w.sp;
        return <Character key={i} pose={P({ x: w.x0 + w.dir * d, z: w.z, ry: (w.dir * Math.PI) / 2, walk: d / 0.24, stride: 1 })} face={faceAt(t, [{ at: t0, f: 'smile' }], 60 + i)} look={CIDADAOS[i]} />;
      })}
      <Character pose={waver} face={faceAt(t, [{ at: t0, f: 'happy' }, { at: r, f: 'bigSmile' }], 62)} look={CIDADAOS[2]} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.4, 2.4, 8.0], [0, 2.0, -1], 32], [t1, [0.1, 1.8, 6.2], [0, 1.5, -0.5], 32]]} />
    </>
  );
};

// ---------------- Linha 9 ----------------
// "Mas tem um detalhe: os dinossauros nunca sumiram de *verdade*." — passarinho pousa
const S14 = ({ t, t0, t1 }: ShotProps) => {
  const v = W(9, 'verdade');
  const by = 1.6 + 2.6 * (1 - seg(t, v - 0.6, v - 2 * F, easeOut));
  const bx = 0.75 + 1.4 * (1 - seg(t, v - 0.6, v - 2 * F, easeOut));
  const you = track(t, P({ x: -0.2, z: 0.3, ry: 0.35, hy: 0.2 }), [{ at: W(9, 'detalhe'), v: { rsx: 1.4, rel: -1.4, hr: 0.15 } }, { at: v, v: { hy: 0.65, hp: -0.25, rsx: 0.2, rel: 0.15 } }]);
  return (
    <>
      <Bairro />
      <Poste position={[0.75, 0, 0]} />
      <Ave body="#4a90d9" comb={false} position={[bx, by, 0]} rotation={[0, -0.6, 0]} scale={0.5} />
      <Character pose={you} face={faceAt(t, [{ at: t0, f: 'thinking' }, { at: v, f: 'amazed' }], 63)} look={VOCE_K} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.5, 1.3, 4.0], [0.25, 1.15, 0], 32], [t1, [0.2, 1.3, 3.5], [0.25, 1.2, 0], 32]]} />
    </>
  );
};

// ---------------- Linha 10 ----------------
// "As *aves* são dinossauros." — galinha no pedestal
const S15 = ({ t, t0, t1 }: ShotProps) => {
  const a = W(10, 'aves');
  return (
    <>
      <Stage color="#3a6a4a" />
      <Ave position={[0, 0.3, 0]} rotation={[0, 0.35, 0]} scale={1.5} peck={Math.max(0, Math.sin((t - t0) * 6)) * 0.3 * (t > a ? 1 : 0)} />
      <Sparkles t={t} from={a} n={8} radius={1.0} center={[0, 1.4, 0]} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 1.5, 4.2], [0, 1.15, 0], 32], [t1, [0.1, 1.4, 3.6], [0, 1.15, 0], 32]]} />
    </>
  );
};

// "A galinha do seu almoço é parente do *T-rex*." — galinha + T-rex, etiqueta PARENTES
const S16 = ({ t, t0, t1 }: ShotProps) => {
  const r = W(10, 'trex');
  const rex = track(t, D({ x: 1.1, z: -1.0, ry: -0.5, hy: 0 }), [{ at: r, v: { hy: -0.4, hp: 0.25, jaw: 0.3 } }]);
  return (
    <>
      <Stage color="#3a6a4a" pedestal={false} />
      <Ave position={[-1.25, 0, 0.8]} rotation={[0, 0.5, 0]} scale={1.3} />
      <TRex p={rex} s={0.75} />
      <group position={[-0.2, 2.6, 0.6]} scale={pop(t, r) * 2.6}>
        <Tag text="PARENTES!" />
      </group>
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.2, 2.0, 8.6], [0, 1.5, 0], 32], [t1, [-0.2, 1.9, 7.6], [0, 1.6, 0], 32]]} />
    </>
  );
};

// ---------------- Linha 11 ----------------
// "Comenta qual dinossauro você queria ver vivo *hoje*." — T-rex encara, placa cai
const S17 = ({ t, t0, t1 }: ShotProps) => {
  const h = W(11, 'hoje');
  const rex = track(t, D({ x: 0, z: 0, ry: 0.5, hy: 0.4 }), [{ at: W(11, 'dinossauro'), v: { ry: 0, hy: 0, hp: 0.1 } }, { at: h, v: { jaw: 0.6, hp: -0.25 } }]);
  const y = 4.7 + 4 * (1 - seg(t, h - 6 * F, h, (x) => x * x * x));
  return (
    <>
      <Jurassico t={t} />
      <TRex p={{ ...rex, tail: Math.sin(t * 2) * 0.12 }} />
      <Sign text={'QUAL VOCÊ\nQUERIA?'} w={2.4} h={1.1} position={[0, y, 1.2]} bg="#ffd23a" fg="#3a1424" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.8, 3.0, 9.5], [0, 3.1, 0.8], 32], [t1, [0.3, 3.0, 8.4], [0, 3.2, 0.8], 32]]} />
    </>
  );
};

export const SHOTS: Shot[] = [
  { from: 0, name: '01 asteroide', C: S01 },
  { from: W(0, 'tivesse'), name: '02 errou', C: S02 },
  { from: W(1, 0), name: '03 milhoes', C: S03 },
  { from: W(1, 'uma'), name: '04 dez km', C: S04 },
  { from: W(2, 0), name: '05 trex', C: S05 },
  { from: W(3, 0), name: '06 ratinho', C: S06 },
  { from: W(4, 0), name: '07 macacos', C: S07 },
  { from: W(4, 'surgissem'), name: '08 voce', C: S08 },
  { from: W(5, 0), name: '09 evoluir', C: S09 },
  { from: W(6, 0), name: '10 inteligente', C: S10 },
  { from: W(6, 'de'), name: '11 andando', C: S11 },
  { from: W(7, 0), name: '12 museu', C: S12 },
  { from: W(8, 0), name: '13 cidade', C: S13 },
  { from: W(9, 0), name: '14 passarinho', C: S14 },
  { from: W(10, 0), name: '15 aves', C: S15 },
  { from: W(10, 4), name: '16 parentes', C: S16 },
  { from: W(11, 0), name: '17 hoje', C: S17 },
];

