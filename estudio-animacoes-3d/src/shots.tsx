import { JSX } from 'react';
import { track } from './anim';
import { Character, faceAt, Pose, REST } from './Character';
import { ELENCO } from './personagens';
import { Comic, LedCounter, Sign, Sparkles } from './props';
import { Cam, Room, Stage, Street } from './sets';
import { W } from './timeline';

// ============================================================================
// TESTE DE 10 s — "piscadas". Tomadas do STORYBOARD.md, tudo ancorado em W(...).
// ============================================================================

export type ShotProps = { t: number; t0: number; t1: number };
export type Shot = { from: number; name: string; C: (p: ShotProps) => JSX.Element };

export const SFX: { at: number; file: string; vol: number }[] = [];

const P = (o: Partial<Pose> = {}): Pose => ({ ...REST, ...o });
const VOCE = ELENCO.voce.look;
const BRUNA = ELENCO.bruna.look;

// 1. "Você sabe quantas vezes *pisca* por dia?"
const S01 = ({ t, t0, t1 }: ShotProps) => {
  const q = W(0, 'quantas');
  const p = W(0, 'pisca');
  const pose = track(t, P({ x: -0.2, ry: 0.15, hy: 0.1 }), [
    { at: q, v: { lsz: 0.5, rsz: 0.5, lel: 0.6, rel: 0.6, hr: 0.08 } },
    { at: p, v: { rsx: 1.2, rel: -1.4, rsz: 0.3, lsz: 0.2, lel: 0.2, hr: -0.1, hp: -0.05 } },
  ]);
  const face = faceAt(t, [{ at: t0, f: 'curious' }, { at: p, f: 'wink' }], 1);
  return (
    <>
      <Street placa="ÓTICA" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.5, 2.8, 8.5], [0, 2.2, -2], 32], [p, [0.2, 1.65, 4.4], [-0.15, 1.4, 0], 32], [t1, [0.3, 1.6, 3.8], [-0.15, 1.45, 0], 32]]} />
      <Character pose={pose} face={face} look={VOCE} />
      <Comic t={t} at={p} text="PISC!" position={[0.55, 2.35, 0.3]} size={0.3} />
    </>
  );
};

// 2. "São mais de *quinze* mil piscadas!"
const S02 = ({ t, t0, t1 }: ShotProps) => {
  const q = W(1, 'quinze');
  const pose = track(t, P({ x: -0.25, z: 0.35, ry: 0.3, hy: 0.3 }), [
    { at: W(1, 'mais'), v: { lsz: 1.4, lel: -0.2, lsx: 0.5, hy: 0.5, hp: -0.1 } },
    { at: q, v: { rsz: 2.4, lsz: 2.4, rel: 0.3, lel: 0.3, hp: -0.15, squash: 0.1 } },
  ]);
  const face = faceAt(t, [{ at: t0, f: 'amazed' }, { at: q, f: 'starstruck', o: ['sparkle'] }], 2);
  return (
    <>
      <Stage color="#2a5466" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.7, 1.8, 5.6], [0.05, 1.55, 0], 32], [t1, [-0.3, 1.7, 5.3], [0.05, 1.6, 0], 32]]} />
      <LedCounter t={t} from={t0} at={q} value={15000} suffix="+" position={[0.35, 2.95, -0.3]} scale={0.6} />
      <Character pose={pose} face={face} look={VOCE} />
      <Sparkles t={t} from={q} n={9} radius={0.9} center={[-0.4, 1.6, 0.6]} />
    </>
  );
};

// 3. "E cada uma *limpa*"
const S03 = ({ t, t0, t1 }: ShotProps) => {
  const l = W(2, 'limpa');
  const pose = track(t, P({ y: 0.75, ry: 0.05 }), [
    { at: W(2, 'cada'), v: { rsz: 0.6, rel: 0.5, hr: 0.08 } },
    { at: l, v: { rsz: 2.6, rel: 0.25, rsx: 0.2, hp: -0.1, hr: -0.05 } },
  ]);
  const face = faceAt(t, [{ at: t0, f: 'smile' }, { at: l, f: 'happy' }], 3);
  return (
    <>
      <Room placa="CLÍNICA" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 2.3, 6.2], [0, 2.1, 0], 32], [t1, [0.1, 2.3, 4.9], [0, 2.15, 0], 32]]} />
      <Character pose={pose} face={face} look={BRUNA} />
      <Sparkles t={t} from={l} n={10} radius={0.7} center={[0.5, 2.6, 0.6]} />
    </>
  );
};

// 4. "e protege seus olhos."
const S04 = ({ t, t0, t1 }: ShotProps) => {
  const o = W(2, 'olhos');
  const pose = track(t, P({ ry: -0.1, hy: -0.05 }), [
    { at: t0 + 0.2, v: { lsx: 0.9, rsx: 0.9, lel: -1.6, rel: -1.6, lsz: 0.35, rsz: 0.35, hp: 0.05 } },
    { at: o, v: { hp: -0.08, hr: 0.1 } },
  ]);
  const face = faceAt(t, [{ at: t0, f: 'confident' }, { at: o, f: 'content', o: ['blush'] }], 4);
  return (
    <>
      <Street placa="ÓTICA" />
      <Sign text="OLHOS PROTEGIDOS" w={2.2} h={0.45} position={[0.9, 2.55, -1.2]} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.3, 1.65, 3.3], [0.1, 1.75, 0], 32], [t1, [-0.6, 1.75, 3.9], [0.15, 1.85, 0], 32]]} />
      <Character pose={pose} face={face} look={VOCE} />
    </>
  );
};

export const SHOTS: Shot[] = [
  { from: 0, name: '01 pisca', C: S01 },
  { from: W(1, 0), name: '02 quinze', C: S02 },
  { from: W(2, 0), name: '03 limpa', C: S03 },
  { from: W(2, 'protege'), name: '04 olhos', C: S04 },
];
