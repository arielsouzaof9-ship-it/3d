import { JSX } from 'react';
import { clamp01, lerp, seg, track } from './anim';
import { Character, faceAt, Pose, REST } from './Character';
import {
  Ball, ballPos, Basement, BIA, Bedroom, Corridor, Farm, Frame, Ghost, HandCandle, HandMatch, HELENA, LUISA, PopSign, StairTop,
} from './historia';
import { Comic, LedCounter } from './props';
import { Cam } from './sets';
import { END, W } from './timeline';

// ============================================================================
// O PORÃO — tomadas. Sem narração: a história vem nas legendas e nos efeitos.
// Elenco: Helena (Paula de vestido), Luísa (Lia), Bia (nova, de pijama) e a mulher de preto.
// ============================================================================

export type ShotProps = { t: number; t0: number; t1: number };
export type Shot = { from: number; name: string; C: (p: ShotProps) => JSX.Element };

const P = (o: Partial<Pose> = {}): Pose => ({ ...REST, ...o });
const RY_BIA = -1.03; // Bia sentada na cama, olhando o armário

// ---------- Efeitos sonoros (public/sfx) ----------
const KNOCK = W(5, 'tres');
const BALL0 = W(8, 0) + 0.3;
const BALL1 = W(8, 'porao');
export const SFX: { at: number; file: string; vol: number; dur?: number }[] = [
  { at: 0, file: 'grilos.wav', vol: 0.35, dur: W(2, 'grilos') },
  { at: W(2, 0), file: 'relogio.wav', vol: 0.6 },
  { at: W(2, 'sete'), file: 'badalada.wav', vol: 0.55 },
  { at: W(4, 0), file: 'coracao.wav', vol: 0.8 },
  ...[0, 0.5, 1.0].map((d) => ({ at: KNOCK + d, file: 'toc.wav', vol: 1 })),
  { at: W(7, 'mulher'), file: 'susto.wav', vol: 0.85 },
  ...Array.from({ length: 8 }, (_, i) => ({ at: BALL0 + ((i + 1) * (BALL1 - BALL0)) / 8, file: 'quique.wav', vol: 0.7 - i * 0.05 })),
  { at: W(9, 'mae'), file: 'sussurro.wav', vol: 0.5 },
  { at: W(10, 'atras'), file: 'susto.wav', vol: 0.9 },
  { at: W(11, 'fosforo') - 0.15, file: 'fosforo.wav', vol: 0.8 },
  { at: W(12, 0), file: 'coracao.wav', vol: 0.7 },
  { at: W(13, 'apagou'), file: 'apagou.wav', vol: 0.9 },
  { at: W(14, 'sussurrou'), file: 'sussurro.wav', vol: 0.9 },
  { at: W(14, 'achei'), file: 'susto.wav', vol: 1 },
  { at: W(15, 'quatro'), file: 'badalada.wav', vol: 0.4 },
];

// 1. "Em mil novecentos e setenta e um, a família Moreira comprou uma *casa* no interior."
const S01 = ({ t, t0, t1 }: ShotProps) => {
  const casa = W(0, 'casa');
  const fH = faceAt(t, [{ at: t0, f: 'happy' }, { at: casa, f: 'bigSmile' }], 1);
  const fL = faceAt(t, [{ at: t0, f: 'smile' }], 2);
  const fB = faceAt(t, [{ at: t0, f: 'happy' }], 3);
  const pH = track(t, P({ x: 0, z: 0.4, ry: 0.15 }), [{ at: casa, v: { rsz: 1.3, rel: 0.2, hy: 0.3 } }]);
  return (
    <>
      <Farm t={t} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 7.5, 15], [0, 4.5, -6], 34], [casa, [0.6, 2.6, 9.5], [0.2, 1.9, -2], 32], [t1, [0.5, 2.3, 8.6], [0.2, 1.6, -1], 32]]} />
      <Character pose={pH} face={fH} look={HELENA} />
      <Character pose={P({ x: -0.95, z: 0.6, ry: 0.2 })} face={fL} look={LUISA} />
      <Character pose={P({ x: 0.9, z: 0.7, ry: -0.2 })} face={fB} look={BIA} />
      <PopSign t={t} at={W(0, 'um')} text="1971" position={[0, 2.8, 0.6]} />
    </>
  );
};

// 2. "Era *barata* demais. Ninguém perguntou por quê."
const S02 = ({ t, t0, t1 }: ShotProps) => {
  const b = W(1, 'barata');
  const n = W(1, 'ninguem');
  const fH = faceAt(t, [{ at: t0, f: 'happy' }, { at: b, f: 'laugh' }, { at: n, f: 'unsure' }], 4);
  const pH = track(t, P({ x: -0.3, z: 0.4, ry: 0.35 }), [{ at: b, v: { lsz: 1.0, rsz: 1.0, lel: 0.5, rel: 0.5 } }, { at: n, v: { lsz: 0.12, rsz: 0.12, lel: 0.15, rel: 0.15, hy: -0.6, hp: -0.3 } }]);
  const ghost = 0.75 * seg(t, W(1, 'perguntou'), W(1, 'que') + 0.3);
  return (
    <>
      <Farm t={t} windowGhost={ghost} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.8, 1.9, 6.0], [0.4, 1.4, 0], 32], [n, [1.4, 2.0, 6.0], [0.3, 1.6, 0], 32], [t1, [0.3, 2.8, 5.5], [0, 4.6, -4.4], 24]]} />
      <Character pose={pH} face={fH} look={HELENA} />
      <PopSign t={t} at={b} text={'VENDE-SE\nBARATO'} w={1.3} h={0.75} position={[0.9, 1.5, 0.3]} rotation={[0, -0.3, 0]} />
    </>
  );
};

// 3. "Às três e sete da madrugada, os *grilos* pararam de cantar."
const S03 = ({ t, t0, t1 }: ShotProps) => {
  const g = W(2, 'grilos');
  return (
    <>
      <Bedroom t={t} clockFrom={t0} clockAt={W(2, 'sete')} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.0, 3.1, -0.4], [-0.1, 3.2, -2.85], 34], [g, [0.2, 3.0, -0.2], [-0.1, 3.1, -2.85], 34], [t1, [3.0, 2.6, 2.4], [1.8, 2.2, -2.8], 32]]} />
      <Character pose={P({ x: 1.1, y: 0.3, z: -1.6, ry: RY_BIA })} face={faceAt(t, [{ at: t0, f: 'sleepy' }], 5)} look={BIA} />
    </>
  );
};

// Luísa dormindo deitada na cama da esquerda (rosto para cima).
const LuisaDeitada = ({ t, f }: { t: number; f: ReturnType<typeof faceAt> }) => (
  <group position={[-1.3, 0.78, -1.25]} rotation={[-Math.PI / 2, 0, 0]}>
    <Character pose={P({ lsz: 0.2, rsz: 0.2 })} face={f} look={LUISA} />
  </group>
);

// 4. "No quarto, a pequena Bia encarava o *armário*."
const S04 = ({ t, t0, t1 }: ShotProps) => {
  const a = W(3, 'armario');
  const fB = faceAt(t, [{ at: t0, f: 'worried' }, { at: a, f: 'scared', o: ['sweat'] }], 6);
  const pB = track(t, P({ x: 1.1, y: 0.3, z: -1.6, ry: RY_BIA }), [{ at: a, v: { lsx: 0.9, lel: -0.6, rsx: 0.9, rel: -0.6, hp: -0.1 } }]);
  return (
    <>
      <Bedroom t={t} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.2, 2.0, 4.2], [0.4, 1.0, -1.4], 34], [a, [-1.6, 1.8, 3.6], [0.2, 1.0, -1.0], 34], [t1, [-1.7, 1.8, 3.4], [0.1, 1.0, -0.9], 34]]} />
      <Character pose={pB} face={fB} look={BIA} />
      <LuisaDeitada t={t} f={faceAt(t, [{ at: t0, f: 'sleepy' }], 7)} />
    </>
  );
};

// 5. "Luísa, tem *alguém* ali atrás."
const S05 = ({ t, t0, t1 }: ShotProps) => {
  const al = W(4, 'alguem');
  const fB = faceAt(t, [{ at: t0, f: 'scared' }, { at: al, f: 'terrified', o: ['sweat'] }], 8);
  const pB = track(t, P({ x: 1.1, y: 0.3, z: -1.6, ry: RY_BIA, hy: 0.9 }), [{ at: al, v: { hy: 0.0, rsx: 1.2, rel: 0, rsz: 0.3 } }]);
  const fL = faceAt(t, [{ at: t0, f: 'sleepy' }, { at: W(4, 'ali'), f: 'worried' }], 9);
  return (
    <>
      <Bedroom t={t} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.4, 1.7, 1.4], [0.6, 1.0, -1.6], 32], [t1, [-1.2, 1.6, 1.1], [0.7, 1.0, -1.6], 30]]} />
      <Character pose={pB} face={fB} look={BIA} />
      <LuisaDeitada t={t} f={fL} />
    </>
  );
};

// 6. "Então vieram *três* batidas na madeira."
const S06 = ({ t, t0, t1 }: ShotProps) => {
  const ks = [KNOCK, KNOCK + 0.5, KNOCK + 1.0];
  const knock = ks.reduce((acc, k) => acc + Math.max(0, 1 - Math.abs(t - k) / 0.08) * (t >= k - 0.02 ? 1 : 0), 0);
  return (
    <>
      <Bedroom t={t} knock={knock} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 1.7, 1.3], [-3.3, 1.4, 1.2], 36], [t1, [-0.2, 1.6, 1.2], [-3.3, 1.4, 1.2], 34]]} />
      {ks.map((k, i) => (
        <Comic key={i} t={t} at={k} text="TOC!" fill="#e8e2d0" size={0.45} hold={0.35} position={[-2.6, 2.3 - i * 0.5, 1.2 + (i - 1) * 0.25]} />
      ))}
    </>
  );
};

// 7. "No corredor, Helena achou os *retratos* virados para a parede."
const S07 = ({ t, t0, t1 }: ShotProps) => {
  const r = W(6, 'retratos');
  const zh = lerp(0.6, -1.6, seg(t, t0, r - 0.1, (x) => x));
  const stride = 1 - seg(t, r - 0.25, r - 0.05);
  const pose = track(t, P({ z: zh, ry: Math.PI, rsx: 1.1, rel: -0.8, walk: (0.6 - zh) / 0.24, stride }), [{ at: r, v: { hy: 0.8, hp: -0.1 } }]);
  const f = faceAt(t, [{ at: t0, f: 'worried' }, { at: r, f: 'shocked' }], 10);
  return (
    <>
      <Corridor t={t} photoGhost={0} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t, [0.5, 2.1, zh - 5.2], [0, 1.4, zh], 32]]} />
      <Character pose={pose} face={f} look={HELENA} right={<HandCandle t={t} />} />
    </>
  );
};

// 8. "Na foto da família, havia uma *mulher* de preto." — a foto (a única desvirada)
const S08 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(7, 'mulher');
  return (
    <>
      <Corridor t={t} photoGhost={t >= m - 0.03 ? 1 : 0} />
      <Character pose={P({ x: 0.3, z: -2.5, ry: Math.PI / 2 + 0.2, rsx: 1.2, rel: -0.8 })} face={faceAt(t, [{ at: t0, f: 'worried' }], 11)} look={HELENA} right={<HandCandle t={t} />} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.4, 2.1, -3.0], [1.52, 2.15, -3.2], 30], [m, [0.2, 2.15, -3.15], [1.52, 2.15, -3.2], 26], [t1, [0.5, 2.15, -3.2], [1.52, 2.15, -3.2], 24]]} />
    </>
  );
};

// 9. "Sem rosto." — reação da Helena
const S09 = ({ t, t0, t1 }: ShotProps) => {
  const f = faceAt(t, [{ at: t0, f: 'terrified', o: ['sweat'] }], 12);
  const pose = P({ x: 0.3, z: -2.5, ry: Math.PI / 2 + 0.2, rsx: 1.2, rel: -0.8, hp: 0.05 });
  return (
    <>
      <Corridor t={t} photoGhost={1} />
      <Character pose={pose} face={f} look={HELENA} right={<HandCandle t={t} />} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.35, 1.7, -2.0], [0.3, 1.6, -2.5], 32], [t1, [1.25, 1.7, -2.15], [0.3, 1.6, -2.5], 30]]} />
    </>
  );
};

// 10. "Uma *bolinha* desceu sozinha a escada do porão."
const S10 = ({ t, t0, t1 }: ShotProps) => {
  const p = ballPos(t, BALL0, BALL1);
  return (
    <>
      <StairTop t={t} />
      <Ball position={p} rotation={[-(t - BALL0) * 8, 0, 0]} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.7, 1.4, 2.4], [0, -0.4, -0.8], 34], [t1, [0.6, 1.0, 1.8], [0, -1.5, -2.2], 34]]} />
    </>
  );
};

// 11. "Lá de baixo, uma vozinha chamou: *mãe*, desce aqui."
const S11 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(9, 'mae');
  const f = faceAt(t, [{ at: t0, f: 'worried' }, { at: m, f: 'scared' }], 13);
  const pose = track(t, P({ z: 0.7, ry: Math.PI, rsx: 1.0, rel: -0.8, hp: 0.35 }), [{ at: m, v: { hp: 0.5, squash: 0.15 } }]);
  const eyes = seg(t, m - 0.1, m + 0.2) * (1 - seg(t, t1 - 0.4, t1));
  return (
    <>
      <StairTop t={t} eyes={eyes} />
      <Ball position={ballPos(t1, BALL0, BALL1)} />
      <Character pose={pose} face={f} look={HELENA} right={<HandCandle t={t} />} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.1, 3.3, 4.4], [0, -0.4, -2.4], 34], [t1, [0.9, 3.0, 4.0], [0, -0.9, -2.8], 34]]} />
    </>
  );
};

// 12. "Mas a Bia estava *atrás* dela."
const S12 = ({ t, t0, t1 }: ShotProps) => {
  const a = W(10, 'atras');
  const f = faceAt(t, [{ at: t0, f: 'scared' }, { at: a, f: 'terrified', o: ['sweat'] }], 14);
  const pose = track(t, P({ z: 0.7, ry: Math.PI, rsx: 1.0, rel: -0.8, hp: 0.3 }), [{ at: a, v: { hy: 1.2, hp: 0, rsx: 0.6 }, lead: 2 }]);
  return (
    <>
      <StairTop t={t} />
      <Character pose={pose} face={f} look={HELENA} right={<HandCandle t={t} />} />
      {t >= a - 0.4 && <Character pose={P({ x: -1.1, z: 1.8, ry: Math.PI + 0.4 })} face={faceAt(t, [{ at: t0, f: 'deadpan' }], 15)} look={BIA} />}
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.3, 1.8, -2.6], [-0.2, 1.2, 1.2], 34], [a, [1.2, 1.7, -2.4], [-0.3, 1.2, 1.4], 34], [t1, [1.2, 1.7, -2.3], [-0.3, 1.2, 1.4], 34]]} />
    </>
  );
};

// 13. "Helena desceu com um *fósforo*."
const S13 = ({ t, t0, t1 }: ShotProps) => {
  const fo = W(11, 'fosforo');
  const lit = t >= fo - 0.1;
  const pose = track(t, P({ z: 0.4, ry: 0.5, rsx: 0.3, rel: -0.2 }), [{ at: fo, v: { rsx: 1.3, rel: -1.0, hp: 0.1 } }]);
  const f = faceAt(t, [{ at: t0, f: 'anxious' }, { at: fo, f: 'worried' }], 16);
  return (
    <>
      <Basement t={t} dim={lit ? 0.3 : 0.8} />
      <Character pose={pose} face={f} look={HELENA} right={lit ? <HandMatch t={t} /> : undefined} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.9, 1.8, 4.8], [0, 1.2, 0], 34], [t1, [1.6, 1.7, 4.3], [0.1, 1.3, 0], 34]]} />
    </>
  );
};

// 14. "Na parede, arranhado na madeira: esta casa é *minha*."
const S14 = ({ t, t0, t1 }: ShotProps) => {
  const mi = W(12, 'minha');
  const scratch = seg(t, t0 + 0.3, mi);
  const pose = P({ x: -0.7, z: 0.3, ry: Math.PI - 0.3, rsx: 1.4, rel: -0.6, rsz: 0.3 });
  return (
    <>
      <Basement t={t} dim={0.3} scratch={scratch} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'scared' }], 17)} look={HELENA} right={<HandMatch t={t} />} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.2, 2.0, 4.6], [0, 1.6, -2.1], 36], [mi, [0.8, 2.0, 3.8], [0, 1.7, -2.1], 36], [t1, [0.7, 2.0, 3.6], [0, 1.7, -2.1], 36]]} />
    </>
  );
};

// 15. "O fósforo *apagou*." + 16. "E uma voz sussurrou no seu ouvido: *achei* você."
const S15 = ({ t, t0, t1 }: ShotProps) => {
  const ap = W(13, 'apagou');
  const out = seg(t, ap - 0.15, ap);
  const f = faceAt(t, [{ at: t0, f: 'scared' }, { at: ap, f: 'terrified' }], 18);
  const pose = P({ z: 0.3, ry: Math.PI, rsx: 1.1, rel: -0.9 });
  return (
    <>
      <Basement t={t} dim={lerp(0.3, 0.9, out)} />
      <Character pose={pose} face={f} look={HELENA} right={<HandMatch t={t} out={out} />} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [2.4, 1.9, -1.4], [0, 1.5, 0.4], 32], [t1, [2.1, 1.85, -1.2], [0, 1.5, 0.4], 30]]} />
    </>
  );
};

const S16 = ({ t, t0, t1 }: ShotProps) => {
  const ac = W(14, 'achei');
  const s = W(14, 'sussurrou');
  const f = faceAt(t, [{ at: t0, f: 'terrified' }, { at: s, f: 'panic', o: ['sweat3'] }], 19);
  const pose = track(t, P({ z: 0.9, ry: Math.PI, hy: 0 }), [{ at: s, v: { hy: -0.35, hr: 0.1 } }]);
  const show = seg(t, t0 + 0.2, s);
  const reach = seg(t, ac - 0.3, ac);
  return (
    <>
      <Basement t={t} dim={0.9} />
      <pointLight position={[0.6, 2.6, 0.8]} intensity={2.2 * show} distance={5} color="#8aa0d8" />
      <Character pose={pose} face={f} look={HELENA} />
      <Ghost t={t} opacity={Math.max(0.05, show)} reach={reach} position={[0.38, 0, 1.6]} rotation={[0, Math.PI - 0.15, 0]} scale={1.15} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.6, 2.0, -1.9], [0.2, 1.5, 1.2], 34], [ac, [1.3, 2.0, -1.6], [0.2, 1.6, 1.2], 34], [t1, [1.2, 2.0, -1.5], [0.2, 1.6, 1.2], 34]]} />
    </>
  );
};

// 17. "A casa foi vendida mais *quatro* vezes. Ninguém ficou mais de um ano."
const S17 = ({ t, t0, t1 }: ShotProps) => {
  const q = W(15, 'quatro');
  const fade = clamp01((END - t) / 1.2);
  return (
    <>
      <Farm t={t} windowGhost={0.8 * seg(t, W(15, 'ninguem'), W(15, 'ano'))} />
      <PopSign t={t} at={W(15, 'vendida')} text="VENDE-SE" w={1.4} h={0.55} position={[-1.2, 1.4, 0.2]} rotation={[0, 0.2, 0]} />
      <LedCounter t={t} from={W(15, 'vendida')} at={q} value={4} suffix="x" position={[1.0, 1.4, 0.2]} scale={0.5} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 1.8, 5.0], [0, 1.5, 0], 32], [q, [0, 2.6, 7.5], [0, 2.4, -2], 32], [t1, [0, 4.0, 11 + (1 - fade) * 2], [0, 4.4, -4.4], 30]]} />
    </>
  );
};

export const SHOTS: Shot[] = [
  { from: 0, name: '01 casa', C: S01 },
  { from: W(1, 0), name: '02 barata', C: S02 },
  { from: W(2, 0), name: '03 relogio', C: S03 },
  { from: W(3, 0), name: '04 armario', C: S04 },
  { from: W(4, 0), name: '05 alguem', C: S05 },
  { from: W(5, 0), name: '06 batidas', C: S06 },
  { from: W(6, 0), name: '07 corredor', C: S07 },
  { from: W(7, 0), name: '08 foto', C: S08 },
  { from: W(7, 'sem'), name: '09 sem rosto', C: S09 },
  { from: W(8, 0), name: '10 bolinha', C: S10 },
  { from: W(9, 0), name: '11 mae', C: S11 },
  { from: W(10, 0), name: '12 atras', C: S12 },
  { from: W(11, 0), name: '13 fosforo', C: S13 },
  { from: W(12, 0), name: '14 parede', C: S14 },
  { from: W(13, 0), name: '15 apagou', C: S15 },
  { from: W(14, 0), name: '16 achei', C: S16 },
  { from: W(15, 0), name: '17 vendida', C: S17 },
];
