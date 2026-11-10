import { JSX } from 'react';
import { clamp01, easeInOut, easeOut, seg, V3 } from './anim';
import { Character, faceAt, Pose, REST } from './Character';
import {
  AlarmClock, Ants, BigMark, Bedroom, BreadPile, Bunting, Cake, Clock, Drops, Glass, Island, JOAOZINHO, JULIA, Laser, Loaf,
  MAE_JULIA, MARIA, Puddle, Ruler, Smoke, VOCE_KID,
} from './historia';
import { ELENCO } from './personagens';
import { Box } from './sets';
import { Calendar, Clipboard, Comic, Gauge, LedCounter, Puff, Sign, Sparkles } from './props';
import { Cam, Room, Stage } from './sets';
import { F, W } from './timeline';

// ============================================================================
// "A ILHA DOS PODERES" — tomadas do filme (ver STORYBOARD.md).
// Tudo ancorado em palavras com W(linha, 'palavra').
// ============================================================================

export type ShotProps = { t: number; t0: number; t1: number };
export type Shot = { from: number; name: string; C: (p: ShotProps) => JSX.Element };

export const SFX: { at: number; file: string; vol: number }[] = [];

const P = (o: Partial<Pose> = {}): Pose => ({ ...REST, ...o });

// Olhos de uma criança (corpo 'crianca') em coordenadas do mundo, para o laser da Júlia.
const eyes = (x: number, y: number, z: number, ry: number): [V3, V3] => {
  const ey = y + 1.13;
  const ez = 0.36;
  return [-0.085, 0.085].map((ex) => [x + ex * Math.cos(ry) + ez * Math.sin(ry), ey, z - ex * Math.sin(ry) + ez * Math.cos(ry)] as V3) as [V3, V3];
};

// Prancheta na mão (a condição escrita).
const Prancheta = ({ text = 'CONDIÇÃO:\n...' }: { text?: string }) => <Clipboard text={text} position={[0, -0.16, 0.02]} rotation={[1.7, 0, 0]} scale={1.6} />;
const HOLD = { rsx: 0.5, rel: 1.3, rsz: 0.15 }; // segura a prancheta na frente do peito

// Moradores da ilha (fundo das cenas de grupo).
const CROWD: { look: typeof JOAOZINHO; x: number; z: number }[] = [
  { look: ELENCO.zuza.look, x: -2.3, z: -1.6 },
  { look: ELENCO.tonhao.look, x: -1.0, z: -2.2 },
  { look: ELENCO.nena.look, x: 0.9, z: -2.0 },
  { look: ELENCO.bento.look, x: 2.3, z: -1.5 },
  { look: ELENCO.tiao.look, x: -3.3, z: -2.8 },
  { look: ELENCO.gabi.look, x: 3.4, z: -2.7 },
];

// 01 "Numa ilha *distante*" — a ilha vista de longe, grua descendo.
const S01 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Island />
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 7, 16], [0, 2.4, -6], 34], [t1, [0.6, 3.2, 9], [0, 1.6, -3], 32]]} />
    <Character pose={P({ x: 0, z: 0, ry: 0 })} face={faceAt(t, [{ at: t0, f: 'happy' }], 1)} look={VOCE_KID} />
  </>
);

// 02 "quando você faz *dez* anos, você ganha um *superpoder*."
const S02 = ({ t, t0, t1 }: ShotProps) => {
  const dez = W(0, 'dez');
  const sp = W(0, 'superpoder');
  const pose = track2(t, P({ x: -0.3, ry: 0.25, hy: 0.1 }), [
    { at: dez, v: { lsz: 0.9, lel: -0.4, lsx: 0.5, hy: 0.45 } },
    { at: sp, v: { lsz: 2.6, rsz: 2.6, lel: 0.2, rel: 0.2, lsx: 0, hy: 0, hp: -0.15 } },
  ]);
  const face = faceAt(t, [{ at: t0, f: 'smile' }, { at: dez, f: 'bigSmile' }, { at: sp, f: 'starstruck', o: ['sparkle'] }], 2);
  const k = seg(t, dez - 6 * F, dez, (x) => x);
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 1.3, 4.6], [0.1, 0.95, 0], 32], [sp, [0.3, 1.2, 3.9], [0.1, 1.0, 0], 32], [t1, [0.1, 1.2, 3.6], [0.0, 1.05, 0], 32]]} />
      <Character pose={pose} face={face} look={VOCE_KID} />
      {k > 0 && <Sign text="10 ANOS" w={0.9} h={0.36} bg="#e2557d" fg="#fff" position={[0.75, 1.55, 0]} rotation={[0, -0.2, 0]} scale={Math.min(1, k * 1.2)} />}
      <Sparkles t={t} from={sp} n={10} radius={0.75} center={[-0.3, 1.1, 0.3]} />
    </>
  );
};

// track com chave de cabeça atrasada 2 quadros (a cabeça acompanha depois da mão).
function track2(t: number, init: Pose, keys: { at: number; v: Partial<Pose>; lead?: number; dur?: number }[]): Pose {
  let cur = { ...init };
  for (const k of [...keys].sort((a, b) => a.at - b.at)) {
    const lead = k.lead ?? 4;
    for (const name in k.v) {
      const head = name === 'hy' || name === 'hp' || name === 'hr';
      const end = k.at - (head ? Math.max(0, lead - 2) : lead) * F;
      const start = end - (k.dur ?? 5) * F;
      const p = easeInOut(clamp01((t - start) / (end - start)));
      if (p <= 0) continue;
      (cur as Record<string, number>)[name] = (cur as Record<string, number>)[name] + ((k.v as Record<string, number>)[name] - (cur as Record<string, number>)[name]) * p;
    }
  }
  return cur;
}

// 03 "Mas tem um *problema*."
const S03 = ({ t, t0, t1 }: ShotProps) => {
  const pr = W(1, 'problema');
  const pose = track2(t, P({ x: 0, ry: 0.1, lsz: 2.6, rsz: 2.6, lel: 0.2, rel: 0.2, hp: -0.15 }), [
    { at: pr, v: { lsz: 0.4, rsz: 0.4, lel: -1.2, rel: -1.2, lsx: 0.8, rsx: 0.8, hp: 0.05, hr: 0.12, squash: 0.1 } },
  ]);
  const face = faceAt(t, [{ at: t0, f: 'starstruck' }, { at: pr, f: 'worried', o: ['sweat'] }], 3);
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.4, 1.3, 3.4], [0, 1.0, 0], 32], [t1, [-0.2, 1.2, 2.9], [0, 1.05, 0], 32]]} />
      <Character pose={pose} face={face} look={VOCE_KID} />
      <Comic t={t} at={pr} text="OPA!" position={[0.5, 1.75, 0.2]} size={0.32} />
    </>
  );
};

// 04 "Quem escolhe a *condição* do seu poder é *outra* pessoa."
const S04 = ({ t, t0, t1 }: ShotProps) => {
  const c = W(2, 'condicao');
  const o = W(2, 'outra');
  const voce = track2(t, P({ x: -0.45, z: 0.4, ry: 0.2, hy: 0 }), [{ at: o, v: { ry: -0.5, hy: -0.5, lean: -0.05 } }]);
  const maria = track2(t, P({ x: 0.55, z: -0.6, ry: -0.3, ...HOLD }), [{ at: c, v: { rsx: 1.1, rel: 1.1 } }, { at: o, v: { lsz: 0.8, lel: -0.6, hy: 0.15 } }]);
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.4, 1.3, 3.8], [-0.2, 1.0, 0], 32], [o, [0.3, 1.25, 4.0], [0.05, 1.0, -0.1], 32], [t1, [0.8, 1.25, 3.6], [0.15, 1.0, -0.2], 32]]} />
      <Character pose={voce} face={faceAt(t, [{ at: t0, f: 'worried' }, { at: o, f: 'surprised' }], 4)} look={VOCE_KID} />
      <Character pose={maria} face={faceAt(t, [{ at: t0, f: 'smug' }, { at: o, f: 'grin' }], 5)} look={MARIA} right={<Prancheta />} />
    </>
  );
};

// 05 "Hoje é o *aniversário* do Joãozinho."
const S05 = ({ t, t0, t1 }: ShotProps) => {
  const a = W(3, 'aniversario');
  const j = W(3, 'joaozinho');
  const joao = track2(t, P({ x: -0.3, z: 0.5, ry: 0.15 }), [{ at: j, v: { lsz: 2.4, rsz: 2.4, rel: 0.2, lel: 0.2, hp: -0.1 } }]);
  return (
    <>
      <Island />
      <Bunting y={2.4} z={-1.2} w={6} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 1.6, 3.8], [0.2, 1.0, 0], 32], [t1, [0.4, 1.9, 5.4], [0.1, 1.0, 0], 32]]} />
      <Box p={[0.75, 0.4, 0.4]} s={[0.9, 0.8, 0.7]} c="#f4f0e6" />
      <Cake t={t} topAt={a} position={[0.75, 0.82, 0.4]} scale={0.55} />
      <Character pose={joao} face={faceAt(t, [{ at: t0, f: 'smile' }, { at: j, f: 'bigSmile' }], 6)} look={JOAOZINHO} />
      {CROWD.slice(0, 4).map((c, i) => (
        <Character key={i} pose={P({ x: c.x, z: c.z, ry: -c.x * 0.15, lsz: 0.5 + i * 0.2, rsz: 0.5 + i * 0.2 })} face={faceAt(t, [{ at: t0, f: i % 2 ? 'laugh' : 'happy' }], 10 + i)} look={c.look} />
      ))}
      <Sparkles t={t} from={a} n={8} radius={0.5} center={[0.75, 1.9, 0.4]} size={0.14} />
    </>
  );
};

// 06 "Ele sopra as velinhas e ganha o poder de *voar*!"
const S06 = ({ t, t0, t1 }: ShotProps) => {
  const sopra = W(4, 'sopra');
  const vel = W(4, 'velinhas');
  const voar = W(4, 'voar');
  const joao = track2(t, P({ x: -0.25, z: 0.5, ry: 0.5, lean: 0.0 }), [
    { at: sopra, v: { lean: 0.25, hp: 0.1 } },
    { at: voar, v: { lean: 0, hp: -0.2, lsz: 2.7, rsz: 2.7, rel: 0.1, lel: 0.1, ry: 0.2 } },
  ]);
  return (
    <>
      <Island />
      <Bunting y={2.4} z={-1.2} w={6} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.4, 1.2, 2.8], [0.25, 0.95, 0.4], 32], [vel, [1.2, 1.2, 2.6], [0.3, 0.95, 0.4], 32], [voar, [0.5, 1.3, 3.8], [0.0, 1.05, 0.4], 32], [t1, [0.3, 1.3, 3.6], [0.0, 1.1, 0.4], 32]]} />
      <Box p={[0.75, 0.4, 0.4]} s={[0.9, 0.8, 0.7]} c="#f4f0e6" />
      <Cake t={t} blowAt={vel} position={[0.75, 0.82, 0.4]} scale={0.55} />
      <Smoke t={t} at={vel} position={[0.75, 1.55, 0.4]} />
      <Character pose={joao} face={faceAt(t, [{ at: t0, f: 'bigSmile' }, { at: sopra, f: 'closedSmile' }, { at: voar, f: 'starstruck', o: ['sparkle'] }], 7)} look={JOAOZINHO} />
      <Sparkles t={t} from={voar} n={10} radius={0.7} center={[-0.25, 1.1, 0.6]} />
      <Comic t={t} at={voar} text="VOAR!" position={[0.2, 1.85, 0.6]} size={0.34} hold={1.2} />
    </>
  );
};

// 07 "Mas quem escolheu a condição foi a *Maria*."
const S07 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(5, 'maria');
  const pose = track2(t, P({ x: 0.1, ry: -0.2, ...HOLD }), [{ at: m, v: { lsz: 0.5, lel: 1.3, lsx: 0.5, hy: 0.25, hr: -0.1 } }]);
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.8, 1.3, 4.2], [0.1, 1.0, 0], 32], [m, [-0.3, 1.2, 3.3], [0.1, 1.05, 0], 32], [t1, [-0.1, 1.2, 3.0], [0.1, 1.05, 0], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'suspicious' }, { at: m, f: 'smug' }], 8)} look={MARIA} right={<Prancheta />} />
      <Sparkles t={t} from={m} n={6} radius={0.6} center={[0.1, 1.2, 0.2]} size={0.12} />
    </>
  );
};

// 08 "E a Maria decidiu:"
const S08 = ({ t, t0, t1 }: ShotProps) => {
  const d = W(6, 'decidiu');
  const pose = track2(t, P({ x: 0.1, ry: 0.3, ...HOLD, hp: 0.25 }), [{ at: d, v: { lsx: 0.6, lel: 1.2, lsz: 0.1, hp: 0.05 } }]);
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.2, 1.35, 2.8], [0.1, 1.05, 0], 32], [t1, [0.9, 1.3, 2.5], [0.1, 1.05, 0], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'thinking' }, { at: d, f: 'grin' }], 9)} look={MARIA} right={<Prancheta text={'CONDIÇÃO:\nSÓ 5 cm!'} />} />
    </>
  );
};

// 09 "ele só voa a *cinco* centímetros do chão." — câmera baixa, régua com etiqueta "5 cm".
const S09 = ({ t, t0, t1 }: ShotProps) => {
  const c = W(6, 'cinco');
  const pose = P({ x: 0, y: 0.05, ry: 0.4, lsz: 1.2, rsz: 1.2, rel: 0.2, lel: 0.2 });
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.8, 0.7, 4.2], [0.1, 0.7, 0], 32], [c, [0.6, 0.35, 3.2], [0.15, 0.6, 0], 32], [t1, [0.5, 0.3, 3.0], [0.15, 0.6, 0], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'confident' }, { at: c, f: 'deadpan' }], 11)} look={JOAOZINHO} />
      <Ruler t={t} at={c} position={[0.35, 0, 0.15]} scale={0.6} />
    </>
  );
};

// 10 "O Joãozinho pega impulso, sobe com toda a força... e para *ali*."
const S10 = ({ t, t0, t1 }: ShotProps) => {
  const imp = W(7, 'impulso');
  const sobe = W(7, 'sobe');
  const ali = W(7, 'ali');
  const pose = track2(t, P({ x: 0, ry: 0.3 }), [
    { at: imp, v: { squash: 0.6, lean: 0.2, lsz: 0.6, rsz: 0.6, lsx: -0.5, rsx: -0.5, hp: 0.1 }, dur: 8 },
    { at: sobe, v: { squash: 0, lean: 0, y: 0.05, lsz: 2.8, rsz: 2.8, lsx: 0, rsx: 0, hp: -0.25 }, lead: 0, dur: 4 },
    { at: ali, v: { lsz: 1.0, rsz: 1.0, hp: 0.15, hy: 0.3 } },
  ]);
  const face = faceAt(t, [{ at: t0, f: 'confident' }, { at: sobe, f: 'starstruck' }, { at: ali, f: 'deadpan' }], 12);
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.2, 0.6, 4.0], [0, 0.7, 0], 32], [sobe, [-0.8, 0.4, 3.6], [0, 0.75, 0], 32], [ali, [-0.5, 0.3, 3.2], [0.1, 0.6, 0], 32], [t1, [-0.4, 0.3, 3.0], [0.1, 0.6, 0], 32]]} />
      <Character pose={pose} face={face} look={JOAOZINHO} />
      <Puff t={t} at={sobe} position={[0, 0.05, 0]} size={0.3} />
      <Ruler t={t} at={ali} position={[0.38, 0, 0.15]} scale={0.6} />
      <Comic t={t} at={sobe} text="FUUU!" position={[-0.5, 1.6, 0.3]} size={0.3} hold={1.0} />
    </>
  );
};

// 11 "Agora ele passa voando por cima das *formigas*." — travelling rente ao chão.
const S11 = ({ t, t0, t1 }: ShotProps) => {
  const f = W(8, 'formigas');
  const x = -1.2 + (t - t0) * 0.45;
  const pose = P({ x, y: 0.05, ry: Math.PI / 2, lsz: 1.4, rsz: 1.4, lean: 0.15 });
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t, [x + 0.3, 0.3, 3.4], [x + 0.1, 0.45, 0], 32]]} />
      <group scale={2.2}>
        <Ants t={t - t0} from={[-1.0, 0, 0.12]} n={12} speed={0.08} />
      </group>
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'happy' }, { at: f, f: 'content' }], 13)} look={JOAOZINHO} />
    </>
  );
};

// 12 "Pelo menos ele nunca mais *pisou* numa poça."
const S12 = ({ t, t0, t1 }: ShotProps) => {
  const p = W(9, 'pisou');
  const x = -1.0 + (t - t0) * 0.5;
  const pose = P({ x, y: 0.05, ry: Math.PI / 2, lsz: 1.4, rsz: 1.4, lean: 0.15, hy: -0.4 });
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 1.0, 3.9], [0, 0.6, 0], 32], [t1, [0.3, 0.9, 3.5], [0.2, 0.6, 0], 32]]} />
      <Puddle position={[0.1, 0.01, 0]} scale={[1.6, 1, 1]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'content' }, { at: p, f: 'closedSmile' }], 14)} look={JOAOZINHO} />
      <Comic t={t} at={p} text="SECO!" position={[0.4, 1.45, 0.3]} size={0.3} hold={1.0} />
    </>
  );
};

// ---------- Padaria ----------
const Padaria = () => <Room placa="PADARIA" parede="#b5652f" />;

// 13 "Agora é a vez da *Júlia*."
const S13 = ({ t, t0, t1 }: ShotProps) => {
  const j = W(10, 'julia');
  const pose = track2(t, P({ x: 0, y: 0, z: 1.1, ry: 0 }), [{ at: j, v: { lsz: 2.3, rsz: 2.3, lel: 0.2, rel: 0.2, hp: -0.1 } }]);
  return (
    <>
      <Padaria />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.2, 1.8, 5.5], [0, 1.4, 0], 32], [t1, [0.1, 1.2, 3.8], [0, 1.0, 1.1], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'smile' }, { at: j, f: 'bigSmile' }], 15)} look={JULIA} />
      <Sparkles t={t} from={j} n={8} radius={0.6} center={[0, 1.1, 1.3]} size={0.13} />
    </>
  );
};

// 14 "Ela ganhou um *raio* laser!"
const S14 = ({ t, t0, t1 }: ShotProps) => {
  const r = W(11, 'raio');
  const ry = 0.5;
  const pose = track2(t, P({ x: -0.3, z: 1.1, ry, lsz: 0.3, rsz: 0.3 }), [{ at: r, v: { lsz: 0.9, rsz: 0.9, lel: -0.5, rel: -0.5, lean: -0.08 } }]);
  const k = seg(t, r - 2 * F, r + 3 * F, easeOut);
  const [a, b] = eyes(-0.3, 0, 1.1, ry);
  const target = (e: V3): V3 => [e[0] + 2.6, e[1] + 0.5, e[2] + 0.6];
  return (
    <>
      <Padaria />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.0, 1.3, 4.6], [0.2, 1.1, 1.0], 32], [t1, [-0.6, 1.25, 4.3], [0.4, 1.15, 1.0], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'curious' }, { at: r, f: 'confident' }], 16)} look={JULIA} />
      {t >= r - 2 * F && (
        <>
          <Laser from={a} to={target(a)} k={k} />
          <Laser from={b} to={target(b)} k={k} />
        </>
      )}
      <Comic t={t} at={r} text="ZAP!" position={[0.8, 1.7, 0.9]} size={0.36} hold={1.0} />
    </>
  );
};

// 15 "Mas a mãe dela achou *perigoso* demais."
const S15 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(12, 'mae');
  const p = W(12, 'perigoso');
  const pose = track2(t, P({ x: 0, z: 0.9, ry: -0.2 }), [
    { at: m, v: { hy: 0.2 } },
    { at: p, v: { lsz: 0.5, rsz: 0.5, lsx: 2.6, rsx: 2.6, lel: -1.5, rel: -1.5, hp: -0.1, lean: -0.08 } },
  ]);
  return (
    <>
      <Padaria />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.8, 1.7, 5.2], [0, 1.45, 0.9], 32], [t1, [0.4, 1.6, 4.3], [0, 1.5, 0.9], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'worried' }, { at: p, f: 'shocked', o: ['sweat3'] }], 17)} look={MAE_JULIA} />
      <Comic t={t} at={p} text="PERIGO!" position={[0.0, 2.55, 1.0]} size={0.45} hold={1.2} fill="#ff6a4a" />
    </>
  );
};

// 16 "Então a condição ficou assim:"
const S16 = ({ t, t0, t1 }: ShotProps) => {
  const c = W(13, 'condicao');
  const pose = track2(t, P({ x: 0.2, z: 0.9, ry: -0.3, ...HOLD }), [{ at: c, v: { lsz: 0.5, lel: 1.3, lsx: 0.5, hy: 0.2 } }]);
  return (
    <>
      <Padaria />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.9, 1.6, 4.4], [0.2, 1.35, 0.9], 32], [t1, [-0.6, 1.55, 3.7], [0.2, 1.4, 0.9], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'thinking' }, { at: c, f: 'confident' }], 18)} look={MAE_JULIA} right={<Prancheta text={'CONDIÇÃO:\nSÓ PÃO!'} />} />
    </>
  );
};

// 17 "o laser só serve para *fatiar* pão." — Júlia atrás do balcão fatiando com o laser.
const S17 = ({ t, t0, t1 }: ShotProps) => {
  const f = W(13, 'fatiar');
  const end = W(13, 'pao') + 0.6;
  const ry = 0;
  const pose = P({ x: 0, y: 0.75, z: -0.8, ry, hp: 0.35 });
  const cut = seg(t, f - 3 * F, end, (x) => x);
  const [a, b] = eyes(0, 0.75, -0.8, ry);
  const loafX = -0.45 + cut * 0.9;
  const tgt: V3 = [loafX, 1.2, 0.05];
  return (
    <>
      <Padaria />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.9, 1.75, 2.9], [0, 1.35, -0.3], 32], [f, [0.5, 1.65, 2.5], [0, 1.3, -0.2], 32], [t1, [0.3, 1.6, 2.3], [0, 1.3, -0.2], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'curious' }, { at: f, f: 'happy' }], 19)} look={JULIA} />
      <Loaf cut={cut} position={[0, 1.07, 0.05]} />
      {t >= f - 3 * F && t < end && (
        <>
          <Laser from={a} to={tgt} width={0.012} />
          <Laser from={b} to={tgt} width={0.012} />
        </>
      )}
    </>
  );
};

// 18 "Num dia só, ela fatiou *trezentos* pães." — montanha de pães e contador.
const S18 = ({ t, t0, t1 }: ShotProps) => {
  const tz = W(14, 'trezentos');
  const pose = track2(t, P({ x: -0.9, z: 0.9, ry: 0.5 }), [{ at: tz, v: { lsz: 2.4, rsz: 2.4, rel: 0.2, lel: 0.2, hp: -0.15 } }]);
  return (
    <>
      <Stage color="#b5652f" pedestal={false} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.5, 1.4, 5.2], [0, 1.0, 0], 32], [t1, [0.2, 2.0, 5.6], [0, 1.2, 0], 32]]} />
      <BreadPile t={t} from={t0} at={tz} position={[0.4, 0, -0.4]} />
      <LedCounter t={t} from={t0} at={tz} value={300} suffix=" PÃES" position={[0.2, 2.35, -0.6]} scale={0.55} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'happy' }, { at: tz, f: 'amazed' }], 20)} look={JULIA} />
    </>
  );
};

// 19 "Virou a padeira mais *rápida* da ilha." — velocímetro no máximo.
const S19 = ({ t, t0, t1 }: ShotProps) => {
  const r = W(15, 'rapida');
  const pose = track2(t, P({ x: -0.35, z: 0.3, ry: 0.35 }), [{ at: r, v: { lsz: 0.4, lsx: 0.4, lel: -2.0, rsz: 0.4, rsx: 0.4, rel: -2.0, hp: -0.15 } }]);
  return (
    <>
      <Stage color="#b5652f" pedestal={false} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.8, 1.3, 3.8], [0.1, 1.05, 0], 32], [t1, [0.4, 1.25, 3.5], [0.15, 1.05, 0], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'smile' }, { at: r, f: 'confident', o: ['sparkle'] }], 21)} look={JULIA} />
      <Gauge t={t} from={t0} at={r} value={1} label="VELOCIDADE" position={[0.45, 1.0, -0.2]} rotation={[0, -0.25, 0]} scale={0.55} />
      <Comic t={t} at={r} text="VUPT!" position={[-0.25, 1.85, 0.3]} size={0.3} hold={0.9} />
    </>
  );
};

// 20 "E aí, a ilha inteira olha" — os moradores viram para a câmera.
const S20 = ({ t, t0, t1 }: ShotProps) => {
  const ilha = W(16, 'ilha');
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 1.6, 4.0], [0, 1.0, -1.5], 32], [t1, [0, 1.9, 5.2], [0, 1.1, -1.5], 32]]} />
      {[...CROWD, { look: MARIA, x: -0.4, z: -0.6 }, { look: JOAOZINHO, x: 0.5, z: -0.5 }, { look: JULIA, x: 1.4, z: -0.9 }].map((c, i) => {
        const turn = seg(t, ilha + i * 0.06 - 9 * F, ilha + i * 0.06 - 4 * F);
        const pose = P({ x: c.x, z: c.z, ry: (i % 2 ? 1 : -1) * 2.4 * (1 - turn) - c.x * 0.08, hy: (i % 2 ? 1 : -1) * 0.4 * (1 - turn) });
        return <Character key={i} pose={pose} face={faceAt(t, [{ at: t0, f: 'neutral' }, { at: ilha + i * 0.06, f: 'curious' }], 30 + i)} look={c.look} />;
      })}
    </>
  );
};

// 21 "olha para *você*." — Você surpreso, empurra rápido.
const S21 = ({ t, t0, t1 }: ShotProps) => {
  const v = W(16, 'voce');
  const pose = track2(t, P({ x: 0, ry: 0 }), [{ at: v, v: { lsz: 0.7, rsz: 0.7, lel: -0.4, rel: -0.4, lsx: 0.6, rsx: 0.6, lean: -0.1, hp: -0.05 } }]);
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 1.2, 4.2], [0, 1.0, 0], 32], [v, [0.15, 1.15, 3.0], [0, 1.05, 0], 32], [t1, [0.1, 1.15, 2.8], [0, 1.05, 0], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'neutral' }, { at: v, f: 'surprised', o: ['sweat'] }], 22)} look={VOCE_KID} />
    </>
  );
};

// 22 "Faltam *sete* dias para o seu aniversário." — calendário vira até "7 DIAS!".
const S22 = ({ t, t0, t1 }: ShotProps) => {
  const s = W(17, 'sete');
  const an = W(17, 'aniversario');
  const pose = track2(t, P({ x: -0.45, ry: 0.4, hy: 0.4 }), [{ at: s, v: { lsz: 1.2, lel: -0.3, lsx: 0.5, hy: 0.5 } }, { at: an, v: { lsz: 0.2, lsx: 0, hy: 0.1, hp: -0.1 } }]);
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.3, 1.2, 4.2], [0.2, 1.0, 0], 32], [t1, [0.2, 1.2, 3.8], [0.25, 1.05, 0], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'thinking' }, { at: s, f: 'curious' }, { at: an, f: 'bigSmile' }], 23)} look={VOCE_KID} />
      <Calendar t={t} from={t0} at={s} pages={['1', '2', '3', '4', '5', '6', '7 DIAS!']} position={[0.6, 1.15, 0]} rotation={[0, -0.25, 0]} scale={0.7} />
    </>
  );
};

// 23 "Você já sabe o que quer: parar o *tempo*." — o relógio para e o palco fica azul.
const S23 = ({ t, t0, t1 }: ShotProps) => {
  const tp = W(18, 'tempo');
  const frozen = t >= tp - 2 * F;
  const pose = track2(t, P({ x: -0.4, z: 0.4, ry: 0.3, hy: 0.3 }), [{ at: tp, v: { rsz: 0.3, rsx: 1.5, rel: 0, hy: 0.4, lean: 0.05 } }]);
  return (
    <>
      <Stage color={frozen ? '#3a5f9a' : '#7a5aa6'} pedestal={false} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.2, 1.4, 4.4], [0.15, 1.2, 0], 32], [t1, [0.1, 1.35, 3.7], [0.2, 1.2, 0], 32]]} />
      <Clock t={t * 4} stopAt={tp * 4} position={[0.65, 1.55, -0.2]} scale={0.8} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'confident' }, { at: tp, f: 'smug' }], 24)} look={VOCE_KID} />
      <Comic t={t} at={tp} text="PAUSE!" position={[0.6, 2.3, 0]} size={0.32} hold={0.9} fill="#7fd0ff" />
    </>
  );
};

// 24 "Dá para pegar o copo antes de ele *cair*." — copo parado no ar.
const S24 = ({ t, t0, t1 }: ShotProps) => {
  const copo = W(19, 'copo');
  const cair = W(19, 'cair');
  const fall = seg(t, t0, copo, (x) => x * x);
  const grab = t >= cair;
  const gy = grab ? 0.85 + seg(t, cair, cair + 0.4) * 0.15 : 0.95 - fall * 0.3;
  const pose = track2(t, P({ x: -0.45, z: 0.6, ry: 0.6, hp: 0.2 }), [{ at: cair, v: { rsx: 1.0, rsz: 0.25, rel: -0.2, lean: 0.12, hp: 0.3 }, lead: 0 }]);
  return (
    <>
      <Bedroom frozen={1} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.2, 1.3, 4.0], [0.0, 0.85, 0.6], 32], [t1, [1.0, 1.2, 3.5], [0.0, 0.85, 0.6], 32]]} />
      <Box p={[0.45, 0.35, 0.3]} s={[0.6, 0.7, 0.6]} c="#8a5a32" />
      <Glass position={[0.2, gy, 0.75]} rotation={[0, 0, grab ? 0 : 0.6 * fall]} />
      {!grab && <Drops position={[0.15, gy + 0.05, 0.75]} spread={0.3} />}
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'curious' }, { at: cair, f: 'happy' }], 25)} look={VOCE_KID} />
      <Sparkles t={t} from={cair} n={6} radius={0.35} center={[0.2, 1.0, 0.75]} size={0.1} />
    </>
  );
};

// 25 "Dá para dormir mais *cinco* minutinhos." — na cama, despertador com "+5 MIN".
const S25 = ({ t, t0, t1 }: ShotProps) => {
  const c = W(20, 'cinco');
  return (
    <>
      <Bedroom />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.6, 1.9, 2.4], [1.6, 0.9, -1.8], 32], [t1, [-0.3, 1.8, 1.9], [1.5, 0.9, -1.8], 32]]} />
      <group position={[2.0, 0.95, -1.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <Character pose={P({ hy: -0.3, lsz: 0.3, rsz: 0.3 })} face={faceAt(t, [{ at: t0, f: 'tired' }, { at: c, f: 'sleepy' }], 26)} look={VOCE_KID} />
      </group>
      <AlarmClock t={t} at={c} position={[0.75, 0.7, -2.3]} scale={0.9} />
      <Comic t={t} at={c} text="ZZZ" position={[1.4, 1.6, -1.8]} size={0.3} hold={1.4} fill="#bfe6ff" />
    </>
  );
};

// 26 "Mas alguém escolhe a *condição*." — Maria e a mãe da Júlia com pranchetas.
const S26 = ({ t, t0, t1 }: ShotProps) => {
  const al = W(21, 'alguem');
  const c = W(21, 'condicao');
  const m = track2(t, P({ x: -0.5, z: 0.3, ry: 0.3, ...HOLD }), [{ at: c, v: { rsx: 1.4, rel: 1.0 } }]);
  const mae = track2(t, P({ x: 0.55, z: -0.2, ry: -0.3, ...HOLD }), [{ at: c, v: { rsx: 1.4, rel: 1.0 } }]);
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 1.6, 3.6], [0, 1.2, 0], 32], [al, [0, 1.6, 3.8], [0, 1.2, 0], 32], [t1, [0.2, 1.7, 4.8], [0, 1.25, 0], 32]]} />
      <Character pose={m} face={faceAt(t, [{ at: t0, f: 'smug' }, { at: c, f: 'grin' }], 27)} look={MARIA} right={<Prancheta />} />
      <Character pose={mae} face={faceAt(t, [{ at: t0, f: 'suspicious' }, { at: c, f: 'grin' }], 28)} look={MAE_JULIA} right={<Prancheta />} />
      <Comic t={t} at={c} text="HEHE!" position={[0.0, 2.45, 0.3]} size={0.38} hold={0.9} />
    </>
  );
};

// 27 "você só pode parar o tempo quando *ninguém* estiver olhando." — todos encarando Você.
const S27 = ({ t, t0, t1 }: ShotProps) => {
  const n = W(22, 'ninguem');
  const pose = track2(t, P({ x: 0, z: 0.8, ry: Math.PI }), [{ at: n, v: { lsz: 0.4, rsz: 0.4, lsx: 0.5, rsx: 0.5, lel: -1.0, rel: -1.0, squash: 0.1 } }]);
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.6, 1.8, 3.4], [0, 1.2, -0.8], 32], [n, [-0.5, 1.8, 4.0], [0, 1.35, -0.8], 32], [t1, [0.6, 1.8, 3.8], [0, 1.35, -0.8], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'nervous', o: ['sweat'] }, { at: n, f: 'anxious', o: ['sweat3'] }], 29)} look={VOCE_KID} />
      {[...CROWD, { look: MARIA, x: -0.5, z: -0.8 }, { look: JOAOZINHO, x: 0.6, z: -0.9 }].map((c, i) => (
        <Character key={i} pose={P({ x: c.x, z: c.z, ry: -c.x * 0.2, hy: -c.x * 0.1, lean: 0.08 })} face={faceAt(t, [{ at: t0, f: i % 3 === 0 ? 'suspicious' : 'curious' }], 40 + i)} look={c.look} />
      ))}
      {t >= n - 6 * F && <Sign text={'NINGUÉM\nOLHANDO?'} w={1.3} h={0.6} bg="#d22d2d" fg="#fff" position={[0, 2.2, -0.4]} scale={seg(t, n - 6 * F, n, (x) => x)} />}
    </>
  );
};

// 28 "Então você para o tempo, *sozinho*, no seu quarto." — quarto azulado, tudo parado.
const S28 = ({ t, t0, t1 }: ShotProps) => {
  const p = W(23, 'para');
  const s = W(23, 'sozinho');
  const pose = track2(t, P({ x: -0.3, z: 0.4, ry: 0.2 }), [
    { at: p, v: { rsz: 0.3, rsx: 1.5, rel: 0, hy: 0.2 } },
    { at: s, v: { rsx: 0, rsz: 2.4, lsz: 2.4, rel: 0.2, lel: 0.2, hy: 0, hp: -0.1 } },
  ]);
  const fr = seg(t, p - 4 * F, p, (x) => x);
  return (
    <>
      <Bedroom frozen={fr} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.2, 2.6, 5.4], [0.2, 1.0, -0.6], 32], [s, [0.1, 1.8, 4.4], [0.2, 1.1, -0.6], 32], [t1, [-0.1, 1.6, 4.0], [0.1, 1.1, -0.6], 32]]} />
      <Clock t={t * 4} stopAt={p * 4} position={[0.4, 3.4, -2.8]} scale={0.8} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'confident' }, { at: s, f: 'content' }], 31)} look={VOCE_KID} />
      {t >= p && <Drops n={12} spread={1.6} position={[-0.2, 1.4, -0.4]} />}
      <Comic t={t} at={p} text="PAROU!" position={[1.0, 2.2, 0]} size={0.36} hold={0.8} fill="#7fd0ff" />
    </>
  );
};

// 29 "E ninguém nunca vai *saber*." — Você pisca.
const S29 = ({ t, t0, t1 }: ShotProps) => {
  const sb = W(24, 'saber');
  const pose = track2(t, P({ x: 0, z: 0.4, ry: -0.15 }), [{ at: sb, v: { rsz: 0.05, rsx: 0.8, rel: 2.0, hr: 0.12 } }]);
  return (
    <>
      <Bedroom frozen={1} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.4, 1.25, 3.0], [0, 1.1, 0.4], 32], [t1, [0.2, 1.2, 2.6], [0, 1.1, 0.4], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'smug' }, { at: sb, f: 'wink' }], 32)} look={VOCE_KID} />
      <Comic t={t} at={sb} text="SHHH!" position={[0.12, 1.72, 0.6]} size={0.26} hold={1.0} />
    </>
  );
};

// 30 "E você? Que *poder* escolheria?" — interrogação gigante.
const S30 = ({ t, t0, t1 }: ShotProps) => {
  const v = W(25, 'voce');
  const p = W(25, 'poder');
  const pose = track2(t, P({ x: -0.3, z: 0.5, ry: 0.25 }), [
    { at: v, v: { rsz: 0.2, rsx: 1.4, rel: -0.2, hy: -0.1 } },
    { at: p, v: { rsx: 0, rsz: 0.9, lsz: 0.9, rel: -0.6, lel: -0.6, hr: 0.15 } },
  ]);
  return (
    <>
      <Stage color="#2a5466" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 1.5, 4.0], [0, 1.15, 0.3], 32], [t1, [0.1, 1.4, 3.4], [0.05, 1.2, 0.3], 32]]} />
      <Character pose={P({ ...pose, y: pose.y + 0.3 })} face={faceAt(t, [{ at: t0, f: 'happy' }, { at: p, f: 'curious' }], 33)} look={VOCE_KID} />
      <BigMark t={t} at={p} text="?" position={[0.55, 1.9, 0.3]} scale={1} />
      <Sparkles t={t} from={p} n={8} radius={0.7} center={[-0.3, 1.4, 0.6]} size={0.13} />
    </>
  );
};

// 31 "E quem ia *estragar* a sua condição?" — Maria e a mãe da Júlia rindo; recua até a ilha (loop).
const S31 = ({ t, t0, t1 }: ShotProps) => {
  const e = W(26, 'estragar');
  const m = track2(t, P({ x: -0.5, z: 0.3, ry: 0.3, ...HOLD }), [{ at: e, v: { lsz: 0.3, lel: 1.0, lsx: 0.4, hr: -0.1 } }]);
  const mae = track2(t, P({ x: 0.55, z: -0.2, ry: -0.3, ...HOLD }), [{ at: e, v: { lsz: 0.3, lel: 1.0, lsx: 0.4, hr: 0.1 } }]);
  return (
    <>
      <Island />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 1.5, 3.8], [0, 1.2, 0], 32], [e, [0, 1.7, 4.4], [0, 1.2, 0], 32], [t1, [0, 5.0, 13], [0, 2.0, -4], 34]]} />
      <Character pose={m} face={faceAt(t, [{ at: t0, f: 'grin' }, { at: e, f: 'laugh' }], 34)} look={MARIA} right={<Prancheta />} />
      <Character pose={mae} face={faceAt(t, [{ at: t0, f: 'smug' }, { at: e, f: 'laugh' }], 35)} look={MAE_JULIA} right={<Prancheta />} />
      <Comic t={t} at={e} text="HAHA!" position={[0.0, 2.45, 0.3]} size={0.38} hold={1.0} />
    </>
  );
};

export const SHOTS: Shot[] = [
  { from: 0, name: '01 ilha', C: S01 },
  { from: W(0, 'quando'), name: '02 dez anos', C: S02 },
  { from: W(1, 0), name: '03 problema', C: S03 },
  { from: W(2, 0), name: '04 condicao', C: S04 },
  { from: W(3, 0), name: '05 aniversario', C: S05 },
  { from: W(4, 0), name: '06 voar', C: S06 },
  { from: W(5, 0), name: '07 maria', C: S07 },
  { from: W(6, 0), name: '08 decidiu', C: S08 },
  { from: W(6, 'ele'), name: '09 cinco cm', C: S09 },
  { from: W(7, 0), name: '10 impulso', C: S10 },
  { from: W(8, 0), name: '11 formigas', C: S11 },
  { from: W(9, 0), name: '12 poca', C: S12 },
  { from: W(10, 0), name: '13 julia', C: S13 },
  { from: W(11, 0), name: '14 laser', C: S14 },
  { from: W(12, 0), name: '15 perigoso', C: S15 },
  { from: W(13, 0), name: '16 condicao', C: S16 },
  { from: W(13, 'o'), name: '17 fatiar', C: S17 },
  { from: W(14, 0), name: '18 trezentos', C: S18 },
  { from: W(15, 0), name: '19 rapida', C: S19 },
  { from: W(16, 0), name: '20 ilha olha', C: S20 },
  { from: W(16, 'olha'), name: '21 voce', C: S21 },
  { from: W(17, 0), name: '22 sete dias', C: S22 },
  { from: W(18, 0), name: '23 tempo', C: S23 },
  { from: W(19, 0), name: '24 copo', C: S24 },
  { from: W(20, 0), name: '25 cinco min', C: S25 },
  { from: W(21, 0), name: '26 alguem', C: S26 },
  { from: W(22, 0), name: '27 ninguem', C: S27 },
  { from: W(23, 0), name: '28 sozinho', C: S28 },
  { from: W(24, 0), name: '29 saber', C: S29 },
  { from: W(25, 0), name: '30 poder', C: S30 },
  { from: W(26, 0), name: '31 estragar', C: S31 },
];
