import { JSX } from 'react';
import { back, seg } from './anim';
import { Character, faceAt, Pose, REST } from './Character';
import { Bunting, Island } from './historia';
import { TURMA } from './personagens';
import { Comic, Crate, Hammer, Puff, Sign, Sparkles } from './props';
import { Cam, Stage } from './sets';
import { F, W } from './timeline';

// ============================================================================
// TESTE DE 15 s — "A Turma Fofa". Tudo ancorado em palavras com W(linha, 'palavra').
// ============================================================================

export type ShotProps = { t: number; t0: number; t1: number };
export type Shot = { from: number; name: string; C: (p: ShotProps) => JSX.Element };
export const SFX: { at: number; file: string; vol: number }[] = [];

const P = (o: Partial<Pose> = {}): Pose => ({ ...REST, ...o });
const T = TURMA;

function track2(t: number, init: Pose, keys: { at: number; v: Partial<Pose>; lead?: number; dur?: number }[]): Pose {
  const cur = { ...init } as Record<string, number>;
  for (const k of [...keys].sort((a, b) => a.at - b.at)) {
    const lead = k.lead ?? 4;
    for (const name in k.v) {
      const head = name === 'hy' || name === 'hp' || name === 'hr';
      const end = k.at - (head ? Math.max(0, lead - 2) : lead) * F;
      const start = end - (k.dur ?? 5) * F;
      const p = seg(t, start, end);
      if (p <= 0) continue;
      cur[name] = cur[name] + ((k.v as Record<string, number>)[name] - cur[name]) * p;
    }
  }
  return cur as Pose;
}

// Lâmpada da ideia: acende e salta na palavra.
const Bulb = ({ t, at, position }: { t: number; at: number; position: [number, number, number] }) => {
  const k = seg(t, at - 6 * F, at, back);
  if (k <= 0.01) return null;
  return (
    <group position={position} scale={k * 0.8}>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.2, 24, 16]} />
        <meshStandardMaterial color="#fff3a0" emissive="#ffd23a" emissiveIntensity={1.6} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.14, 16]} />
        <meshStandardMaterial color="#9aa0a8" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

// 1. "Conheça o *Tito*, o menino mais curioso da cidade."
const S01 = ({ t, t0, t1 }: ShotProps) => {
  const tito = W(0, 'tito');
  const cur = W(0, 'curioso');
  const pose = track2(t, P({ x: 0, ry: 0.15 }), [
    { at: tito, v: { rsz: 2.5, rel: 0.6, hp: -0.1, hr: 0.1 } },
    { at: cur, v: { rsz: 0.3, rel: 0.15, hy: 0.5, hr: 0, lean: 0.08 } },
  ]);
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.4, 1.4, 5.0], [0, 1.0, 0], 32], [tito, [0.2, 1.2, 3.6], [0, 1.0, 0], 32], [t1, [-0.4, 1.2, 3.2], [0, 1.05, 0], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'happy' }, { at: tito, f: 'bigSmile' }, { at: cur, f: 'curious' }], 1)} look={T.tito.look} />
      <Sparkles t={t} from={tito} n={8} radius={0.6} center={[0, 1.1, 0.3]} size={0.13} />
    </>
  );
};

// 2. "A irmã dele, a *Nina*, sempre tem uma *ideia*."
const S02 = ({ t, t0, t1 }: ShotProps) => {
  const nina = W(1, 'nina');
  const ideia = W(1, 'ideia');
  const pose = track2(t, P({ x: 0.1, ry: -0.2 }), [
    { at: nina, v: { lsz: 0.4, lsx: 0.9, lel: 1.4, hy: 0.2, hr: -0.12 } },
    { at: ideia, v: { lsx: 2.8, lel: 0.1, lsz: 0.2, hr: 0, hp: -0.15, squash: 0.1 } },
  ]);
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.8, 1.3, 3.8], [0.1, 1.05, 0], 32], [t1, [-0.3, 1.3, 3.3], [0.1, 1.15, 0], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'smile' }, { at: nina, f: 'thinking' }, { at: ideia, f: 'amazed', o: ['sparkle'] }], 2)} look={T.nina.look} />
      <Bulb t={t} at={ideia} position={[0.1, 1.95, 0]} />
      <Sparkles t={t} from={ideia} n={8} radius={0.35} center={[0.1, 2.0, 0]} size={0.1} />
    </>
  );
};

// 3. "O Vô Zeca inventa *tudo* que eles imaginam." — martelada, fumaça e invenções surgindo.
const S03 = ({ t, t0, t1 }: ShotProps) => {
  const tudo = W(2, 'tudo');
  const im = W(2, 'imaginam');
  const pose = track2(t, P({ x: -0.3, z: 0.2, ry: 0.5, rsz: 0.2, rsx: 0.3, rel: 1.4 }), [
    { at: tudo, v: { rsx: 1.6, rel: 0.1 }, lead: 0, dur: 4 },
    { at: im, v: { rsx: 0.2, rel: 0.2, lsz: 2.3, rsz: 2.3, hp: -0.1 } },
  ]);
  const pop = (i: number) => seg(t, tudo + i * 0.12, tudo + i * 0.12 + 6 * F, back);
  return (
    <>
      <Stage color="#4f6fb8" pedestal={false} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.7, 1.5, 5.2], [0.2, 1.0, 0], 32], [t1, [0.2, 1.6, 5.6], [0.2, 1.05, 0], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'thinking' }, { at: tudo, f: 'laugh' }, { at: im, f: 'content' }], 3)} look={T.zeca.look} right={<Hammer />} />
      <Puff t={t} at={tudo} position={[0.35, 0.3, 0.4]} size={0.4} color="#f4efe2" />
      {pop(0) > 0.01 && <Crate label="ROBÔ" size={0.45} position={[0.5, 0.23 * pop(0), 0.3]} scale={pop(0)} />}
      {pop(1) > 0.01 && <Crate label="FOGUETE" size={0.4} position={[0.85, 0.2 * pop(1), -0.3]} scale={pop(1)} />}
      {pop(2) > 0.01 && <Crate label="?" size={0.35} position={[0.5, 0.62, 0.3]} scale={pop(2)} />}
      <Comic t={t} at={tudo} text="TCHARAN!" position={[0.3, 2.15, 0.2]} size={0.36} hold={1.1} />
    </>
  );
};

// 4. "Juntos, eles são a *Turma* Fofa!" — todo mundo pula; placa "TURMA FOFA" sobe.
const S04 = ({ t, t0, t1 }: ShotProps) => {
  const tu = W(3, 'turma');
  const turma = Object.values(T);
  const xs = [-0.4, 0.4, -1.1, 1.1, -1.75, 1.75, -0.75, 0.75];
  const zs = [0.6, 0.6, 0.0, 0.0, -0.5, -0.5, -0.9, -0.9];
  const k = seg(t, tu - 6 * F, tu, back);
  return (
    <>
      <Island />
      <Bunting y={3.0} z={-1.6} w={6} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 1.6, 4.4], [0, 1.1, -0.2], 32], [tu, [0, 2.0, 8.6], [0, 1.25, -0.3], 32], [t1, [0, 2.1, 9.2], [0, 1.3, -0.3], 32]]} />
      {turma.map((m, i) => {
        const jump = Math.max(0, Math.sin(Math.max(0, t - tu + 3 * F - i * 0.04) * 9)) * 0.25 * (t > tu - 3 * F + i * 0.04 ? 1 : 0);
        const pose = track2(t, P({ x: xs[i], z: zs[i], ry: -xs[i] * 0.12 }), [{ at: tu, v: { lsz: 2.6, rsz: 2.6, lel: 0.2, rel: 0.2, hp: -0.12 } }]);
        return <Character key={m.nome} pose={{ ...pose, y: jump }} face={faceAt(t, [{ at: t0, f: 'smile' }, { at: tu, f: i % 2 ? 'laugh' : 'bigSmile' }], 10 + i)} look={m.look} />;
      })}
      {k > 0.01 && <Sign text="TURMA FOFA" w={2.4} h={0.6} bg="#e2557d" fg="#ffffff" position={[0, 2.75, -1.2]} scale={k} />}
      <Sparkles t={t} from={tu} n={12} radius={1.6} center={[0, 1.6, 0]} size={0.16} />
    </>
  );
};

export const SHOTS: Shot[] = [
  { from: 0, name: '01 tito', C: S01 },
  { from: W(1, 0), name: '02 nina', C: S02 },
  { from: W(2, 0), name: '03 ze ca', C: S03 },
  { from: W(3, 0), name: '04 turma', C: S04 },
];
