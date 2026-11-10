import { JSX } from 'react';
import { track } from './anim';
import { Character, faceAt, Pose, REST } from './Character';
import { Battery, Bottle, Brain, Drop, Glass, WaterTank } from './historia';
import { ELENCO } from './personagens';
import { Calendar, Comic, dropY, Puff, Sparkles } from './props';
import { Cam, Room, Stage, Street } from './sets';
import { F, W } from './timeline';

// ============================================================================
// TESTE DE 30 s — "água no corpo". Tomadas do STORYBOARD.md, tudo ancorado em W(...).
// ============================================================================

export type ShotProps = { t: number; t0: number; t1: number };
export type Shot = { from: number; name: string; C: (p: ShotProps) => JSX.Element };

export const SFX: { at: number; file: string; vol: number }[] = [];

const P = (o: Partial<Pose> = {}): Pose => ({ ...REST, ...o });
const VOCE = ELENCO.voce.look;
const TEO = ELENCO.teo.look;
const RAFA = ELENCO.rafa.look;
const AZUL = '#2a6f97';

// 1. "Você sabia que seu corpo"
const S01 = ({ t, t0, t1 }: ShotProps) => {
  const pose = track(t, P({ ry: 0.1 }), [{ at: W(0, 'corpo'), v: { rsx: 1.2, rel: 1.2, rsz: 0.25, hr: 0.12, hp: 0.05 } }]);
  const face = faceAt(t, [{ at: t0, f: 'curious' }, { at: W(0, 'corpo'), f: 'thinking' }], 1);
  return (
    <>
      <Street placa="BAR DA ÁGUA" parede="#e3eef2" porta="#1f6fb2" bg="#9fd3ef" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 2.8, 8.0], [0, 2.0, -1.5], 32], [t1, [0.2, 1.6, 4.4], [0, 1.35, 0], 32]]} />
      <Character pose={pose} face={face} look={VOCE} />
    </>
  );
};

// 2. "quase *setenta* por cento água?"
const S02 = ({ t, t0, t1 }: ShotProps) => {
  const s = W(0, 'setenta');
  const pose = track(t, P({ x: -0.55, ry: 0.35, hy: 0.4 }), [{ at: s, v: { lsz: 1.3, rsz: 1.3, lel: 0.3, rel: 0.3, hp: -0.12, squash: 0.08 } }]);
  const face = faceAt(t, [{ at: t0, f: 'surprised' }, { at: s, f: 'amazed' }, { at: W(0, 'agua'), f: 'bigSmile' }], 2);
  return (
    <>
      <Stage color={AZUL} pedestal={false} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.8, 1.7, 6.3], [0.05, 1.2, 0], 32], [t1, [-0.3, 1.6, 6.0], [0.05, 1.25, 0], 32]]} />
      <WaterTank t={t} from={t0} at={s} value={0.7} label="70%" position={[0.65, 0, -0.1]} />
      <Character pose={pose} face={face} look={VOCE} />
    </>
  );
};

// Cérebro sobre o balcão do laboratório.
const BRAIN_LAB: [number, number, number] = [0.75, 1.42, 0.05];

// 3. "Até o seu *cérebro* é feito de muita água."
const S03 = ({ t, t0, t1 }: ShotProps) => {
  const c = W(1, 'cerebro');
  const pose = track(t, P({ x: -0.55, y: 0.75, z: -0.85, ry: 0.3, hy: 0.35 }), [
    { at: c, v: { rsz: 0.7, rsx: 0.9, rel: -0.2, hy: 0.55, hp: 0.1 } },
    { at: W(1, 'agua'), v: { lsz: 1.0, lel: 0.4, hy: 0.2, hp: 0 } },
  ]);
  const face = faceAt(t, [{ at: t0, f: 'happy' }, { at: c, f: 'confident' }], 3);
  return (
    <>
      <Room placa="LABORATÓRIO" parede="#2c5f73" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.4, 2.4, 6.0], [0.1, 1.8, 0], 32], [t1, [0.3, 2.2, 4.7], [0.15, 1.75, 0], 32]]} />
      <Character pose={pose} face={face} look={TEO} />
      <Brain position={BRAIN_LAB} rotation={[0, -0.3, 0]} />
      {[0, 1, 2].map((i) => {
        const at = c + i * 4 * F;
        return t >= at - 6 * F && <Drop key={i} position={[BRAIN_LAB[0] - 0.25 + i * 0.25, dropY(t, at, 3.0, 1.85), 0.05]} scale={0.7} />;
      })}
      <Sparkles t={t} from={c} n={8} radius={0.5} center={[BRAIN_LAB[0], 1.6, 0.3]} />
    </>
  );
};

// 4. "Quando falta água, ele fica *lento*"
const S04 = ({ t, t0, t1 }: ShotProps) => {
  const l = W(2, 'lento');
  const dry = Math.min(1, Math.max(0, (t - W(2, 'falta')) / (l - F - W(2, 'falta'))));
  return (
    <>
      <Stage color="#5b6470" pedestal />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 1.25, 2.4], [0, 0.95, 0], 32], [t1, [-0.2, 1.3, 2.8], [0, 0.95, 0], 32]]} />
      <Brain dry={dry} position={[0, 0.85, 0]} rotation={[0, 0.2, 0]} scale={1.3} />
      <Comic t={t} at={l} text="ZZZ" position={[0.35, 1.55, 0.3]} size={0.24} hold={1.2} />
    </>
  );
};

// 5. "a cabeça começa a doer."
const S05 = ({ t, t0, t1 }: ShotProps) => {
  const pose = track(t, P({ ry: -0.1 }), [
    { at: W(2, 'cabeca'), v: { lsz: 2.3, rsz: 2.3, lsx: 0.4, rsx: 0.4, lel: 1.3, rel: 1.3, hp: 0.12 } },
    { at: W(2, 'doer'), v: { hr: 0.15, hp: 0.18, squash: 0.06 } },
  ]);
  const face = faceAt(t, [{ at: t0, f: 'worried' }, { at: W(2, 'doer'), f: 'sick', o: ['stress'] }], 5);
  return (
    <>
      <Street placa="BAR DA ÁGUA" parede="#e3eef2" porta="#1f6fb2" bg="#9fd3ef" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.4, 1.7, 3.6], [0, 1.55, 0], 32], [t1, [0.1, 1.7, 3.2], [0, 1.6, 0], 32]]} />
      <Character pose={pose} face={face} look={VOCE} />
    </>
  );
};

// 6. "Sem beber nada, você"
const S06 = ({ t, t0, t1 }: ShotProps) => {
  const pose = track(t, P({ x: 0.2, ry: -0.2, hp: -0.15 }), [{ at: W(3, 'nada'), v: { lsz: 0.8, rsz: 0.8, lel: 0.5, rel: 0.5, hy: -0.3, pockets: 1 } }]);
  const face = faceAt(t, [{ at: t0, f: 'lookUp' }, { at: W(3, 'nada'), f: 'nervous', o: ['sweat'] }], 6);
  return (
    <>
      <Street placa="BAR DA ÁGUA" parede="#e3eef2" porta="#1f6fb2" bg="#9fd3ef" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.8, 1.3, 4.0], [0.2, 1.4, 0], 32], [t1, [-1.2, 1.5, 5.0], [0.2, 1.35, 0], 32]]} />
      <Character pose={pose} face={face} look={VOCE} />
    </>
  );
};

// 7. "aguenta só uns *três* dias."
const S07 = ({ t, t0, t1 }: ShotProps) => {
  const tr = W(3, 'tres');
  const pose = track(t, P({ x: -0.5, ry: 0.4, hy: 0.45 }), [{ at: tr, v: { lsz: 1.4, rsz: 1.4, lel: 0.2, rel: 0.2, squash: 0.12, hp: -0.05 } }]);
  const face = faceAt(t, [{ at: t0, f: 'anxious' }, { at: tr, f: 'shocked', o: ['sweat3'] }], 7);
  return (
    <>
      <Street placa="BAR DA ÁGUA" parede="#e3eef2" porta="#1f6fb2" bg="#9fd3ef" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 1.6, 5.8], [0, 1.4, 0], 32], [t1, [0.1, 1.6, 5.1], [0, 1.45, 0], 32]]} />
      <Calendar t={t} from={t0} at={tr} pages={['DIA 1', 'DIA 2', '3 DIAS!']} position={[0.6, 1.55, 0]} rotation={[0, -0.2, 0]} scale={0.85} />
      <Character pose={pose} face={face} look={VOCE} />
    </>
  );
};

// 8. "Todo dia, você perde mais de *dois* litros"
const S08 = ({ t, t0, t1 }: ShotProps) => {
  const d = W(4, 'dois');
  const pose = track(t, P({ x: -0.45, ry: 0.35, hy: 0.4 }), [{ at: d, v: { lsz: 1.2, lsx: 0.5, lel: -0.3, hp: 0.15, hy: 0.6 } }]);
  const face = faceAt(t, [{ at: t0, f: 'confident' }, { at: d, f: 'surprised', o: ['sweat'] }], 8);
  return (
    <>
      <Stage color="#d9822b" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.0, 1.7, 6.2], [0.15, 1.15, 0], 32], [t1, [-0.2, 1.6, 5.8], [0.15, 1.15, 0], 32]]} />
      <Character pose={pose} face={face} look={RAFA} />
      <Bottle label="1 L" position={[0.45, dropY(t, d, 4, 0), 0.3]} />
      <Bottle label="1 L" position={[0.85, dropY(t, d + 3 * F, 4, 0), 0.1]} />
    </>
  );
};

// 9. "suando e respirando."
const S09 = ({ t, t0, t1 }: ShotProps) => {
  const r = W(4, 'respirando');
  const pose = track(t, P({ ry: 0.1, lean: 0.15 }), [{ at: r, v: { lean: 0.3, squash: 0.15, hp: -0.15, lsz: 0.5, rsz: 0.5 } }]);
  const face = faceAt(t, [{ at: t0, f: 'tired', o: ['sweat3'] }, { at: r, f: 'dizzy', o: ['sweat3'] }], 9);
  return (
    <>
      <Stage color="#d9822b" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.5, 1.6, 4.4], [0, 1.3, 0], 32], [t1, [0.1, 1.6, 4.0], [0, 1.35, 0], 32]]} />
      <Character pose={pose} face={face} look={RAFA} />
      <Puff t={t} at={r} n={7} position={[0.1, 1.45, 0.7]} color="#ffffff" size={0.2} />
    </>
  );
};

// 10. "Por isso, muitas vezes o *cansaço*"
const S10 = ({ t, t0, t1 }: ShotProps) => {
  const c = W(5, 'cansaco');
  const pose = track(t, P({ x: -0.45, y: 0.75, z: -0.85, ry: 0.25 }), [{ at: c, v: { lsz: 0.15, rsz: 0.15, lel: 0.1, rel: 0.1, hp: 0.25, hr: 0.15, lean: 0.12 } }]);
  const face = faceAt(t, [{ at: t0, f: 'neutral' }, { at: c, f: 'tired' }], 10);
  return (
    <>
      <Room placa="ESCRITÓRIO" parede="#4a5a3a" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 2.3, 5.8], [0.15, 1.85, 0], 32], [t1, [0.2, 2.2, 4.8], [0.2, 1.85, 0], 32]]} />
      <Character pose={pose} face={face} look={VOCE} />
      <Battery t={t} from={t0 + 0.2} at={c} position={[0.8, 1.42, 0.1]} rotation={[0, -0.25, 0]} scale={0.55} />
    </>
  );
};

// 11. "chega antes da sede."
const S11 = ({ t, t0, t1 }: ShotProps) => {
  const pose = track(t, P({ y: 0.75, z: -0.85, ry: 0.1, hp: 0.25, hr: 0.15, lean: 0.12 }), [{ at: W(5, 'sede'), v: { hr: 0.3, hp: 0.35 } }]);
  const face = faceAt(t, [{ at: t0, f: 'sleepy' }], 11);
  return (
    <>
      <Room placa="ESCRITÓRIO" parede="#4a5a3a" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.4, 2.45, 3.5], [0, 2.3, -0.85], 32], [t1, [-0.2, 2.4, 3.1], [0, 2.3, -0.85], 32]]} />
      <Character pose={pose} face={face} look={VOCE} />
    </>
  );
};

// 12. "E aquela fome no meio da tarde"
const S12 = ({ t, t0, t1 }: ShotProps) => {
  const f = W(6, 'fome');
  const pose = track(t, P({ x: 0.1, ry: Math.PI * 0.85, hy: 0.2 }), [{ at: f, v: { rsx: 1.2, rel: -0.1, rsz: 0.3, hy: 0.35 } }, { at: W(6, 'tarde'), v: { lsx: 0.6, lel: 0.9, rsx: 0, rel: 0.15, rsz: 0.12, ry: Math.PI * 0.3, hy: 0 } }]);
  const face = faceAt(t, [{ at: t0, f: 'curious' }, { at: W(6, 'tarde'), f: 'inLove' }], 12);
  return (
    <>
      <Street placa="PADARIA" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.6, 1.6, 5.2], [0, 1.6, -1], 32], [t1, [-0.6, 1.6, 5.0], [0.1, 1.5, -0.5], 32]]} />
      <Character pose={pose} face={face} look={VOCE} />
    </>
  );
};

// 13. "pode ser só *sede* disfarçada."
const S13 = ({ t, t0, t1 }: ShotProps) => {
  const s = W(6, 'sede');
  const pose = track(t, P({ x: -0.45, ry: 0.4, hy: 0.4 }), [{ at: s, v: { lsz: 1.1, lsx: 0.6, lel: -0.2, hy: 0.55, hp: -0.05 } }]);
  const face = faceAt(t, [{ at: t0, f: 'suspicious' }, { at: s, f: 'surprised' }], 13);
  const k = Math.min(1, Math.max(0, (t - (s - 8 * F)) / (8 * F)));
  return (
    <>
      <Stage color={AZUL} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 1.5, 6.0], [0.1, 1.3, 0], 32], [t1, [0.2, 1.5, 5.3], [0.1, 1.35, 0], 32]]} />
      <Drop position={[0.6, 0.3 + 1.0 * k, 0]} scale={0.2 + 3.8 * k} />
      <Character pose={pose} face={face} look={VOCE} />
      <Comic t={t} at={s} text="SEDE!" position={[0.65, 2.35, 0.4]} size={0.3} hold={1.0} />
    </>
  );
};

// 14. "Então pegue um *copo* e beba agora mesmo."
const S14 = ({ t, t0, t1 }: ShotProps) => {
  const c = W(7, 'copo');
  const b = W(7, 'beba');
  const pose = track(t, P({ ry: 0.15 }), [
    { at: c, v: { rsx: 1.2, rel: 0.3, rsz: 0.2, hy: 0.15, hp: 0.1 } },
    { at: b, v: { rsx: 1.6, rel: 0.5, rsz: 0.3, hp: -0.3, hy: 0 }, dur: 6 },
  ]);
  const face = faceAt(t, [{ at: t0, f: 'smile' }, { at: c, f: 'grin' }, { at: b, f: 'closedSmile' }], 14);
  return (
    <>
      <Street placa="BAR DA ÁGUA" parede="#e3eef2" porta="#1f6fb2" bg="#9fd3ef" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 1.6, 4.0], [0, 1.4, 0], 32], [t1, [0.3, 1.65, 3.5], [0, 1.45, 0], 32]]} />
      <Character pose={pose} face={face} look={VOCE} right={t >= c - 8 * F ? <Glass fill={t < b + 0.3 ? 0.85 : 0.35} /> : undefined} />
    </>
  );
};

// 15. "Seu corpo e sua cabeça vão *agradecer*!" — volta ao palco do plano 2 (loop)
const S15 = ({ t, t0, t1 }: ShotProps) => {
  const a = W(8, 'agradecer');
  const pose = track(t, P({ x: -0.55, ry: 0.35, hy: 0.3 }), [
    { at: W(8, 'cabeca'), v: { rsz: 2.4, rel: 0.6, hr: 0.1 } },
    { at: a, v: { lsz: 2.5, rsz: 2.5, lel: 0.3, rel: 0.3, hp: -0.15, hr: 0, squash: 0.1 } },
  ]);
  const face = faceAt(t, [{ at: t0, f: 'happy' }, { at: a, f: 'bigSmile', o: ['sparkle'] }], 15);
  return (
    <>
      <Stage color={AZUL} pedestal={false} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.3, 1.6, 5.4], [0.05, 1.3, 0], 32], [t1, [0.8, 1.7, 6.3], [0.05, 1.2, 0], 32]]} />
      <WaterTank t={t} from={t0} at={a} value={0.95} label="CHEIO!" position={[0.65, 0, -0.1]} />
      <Character pose={pose} face={face} look={VOCE} />
      <Sparkles t={t} from={a} n={10} radius={1.0} center={[-0.4, 1.6, 0.6]} />
    </>
  );
};

export const SHOTS: Shot[] = [
  { from: 0, name: '01 corpo', C: S01 },
  { from: W(0, 'quase'), name: '02 setenta', C: S02 },
  { from: W(1, 0), name: '03 cerebro', C: S03 },
  { from: W(2, 0), name: '04 lento', C: S04 },
  { from: W(2, 'cabeca'), name: '05 doer', C: S05 },
  { from: W(3, 0), name: '06 sem beber', C: S06 },
  { from: W(3, 'aguenta'), name: '07 tres dias', C: S07 },
  { from: W(4, 0), name: '08 dois litros', C: S08 },
  { from: W(4, 'suando'), name: '09 suando', C: S09 },
  { from: W(5, 0), name: '10 cansaco', C: S10 },
  { from: W(5, 'antes'), name: '11 sono', C: S11 },
  { from: W(6, 0), name: '12 fome', C: S12 },
  { from: W(6, 'so'), name: '13 sede', C: S13 },
  { from: W(7, 0), name: '14 copo', C: S14 },
  { from: W(8, 0), name: '15 agradecer', C: S15 },
];
