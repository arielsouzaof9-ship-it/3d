import { JSX } from 'react';
import { clamp01, seg, track } from './anim';
import { Character, faceAt, Pose, REST } from './Character';
import { ALP_2, ALP_3, ALP_BOTAS, Cairn, Cave, GreenBoots, Mountain, OxygenTank, pop, Snow, SummitFlag, Thermometer, VOCE_ALP } from './historia';
import { Calendar, Gauge, LedCounter, MoneyStack, Sign } from './props';
import { Cam } from './sets';
import { F, W } from './timeline';

// ============================================================================
// GREEN BOOTS — 1 minuto. Tomadas do STORYBOARD.md, tudo ancorado em W(...).
// Tom respeitoso: o alpinista aparece vivo só nas lembranças; depois, só as botas.
// ============================================================================

export type ShotProps = { t: number; t0: number; t1: number };
export type Shot = { from: number; name: string; C: (p: ShotProps) => JSX.Element };

export const SFX: { at: number; file: string; vol: number }[] = [];

const P = (o: Partial<Pose> = {}): Pose => ({ ...REST, ...o });
const HALF_PI = Math.PI / 2;

// Caminhada ao longo de X (de x0, velocidade v) a partir de t0: pé não desliza (walk = distância / 0.24).
const andar = (t: number, t0: number, x0: number, v: number, z = 0, extra: Partial<Pose> = {}): Pose => {
  const x = x0 + v * Math.max(0, t - t0);
  return P({ x, z, ry: v >= 0 ? HALF_PI : -HALF_PI, walk: Math.abs(x - x0) / 0.24, stride: 1, lean: 0.08, ...extra });
};

// Caverna das botas: posição padrão.
const CAVE: [number, number, number] = [0, 0, -0.6];
const CaveBoots = ({ glow = 0 }: { glow?: number }) => (
  <>
    <Cave position={CAVE} />
    <GreenBoots glow={glow} position={[CAVE[0], 0, CAVE[2] - 0.05]} />
  </>
);

// ---------------------------------------------------------------- linha 0
// 1. "No caminho para o topo do *Everest*,"
const S01 = ({ t, t0, t1 }: ShotProps) => {
  const e = W(0, 'everest');
  return (
    <>
      <Mountain />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 6, 16], [0, 4, -20], 32], [t1, [0, 3.2, 10], [0, 2.2, -10], 32]]} />
      <Character pose={andar(t, t0, -1.2, 0.5, -1)} face={faceAt(t, [{ at: t0, f: 'confident' }], 1)} look={VOCE_ALP} />
      <Character pose={andar(t, t0, 0.4, 0.5, -1.6)} face={faceAt(t, [{ at: t0, f: 'neutral' }], 2)} look={ALP_2} />
      <group scale={pop(t, e)}>
        <Sign text={'EVEREST\n8.849 m'} w={1.6} h={0.8} position={[1.6, 1.9, 1.2]} rotation={[0, -0.25, 0]} />
      </group>
      <mesh position={[1.6, 0.75, 1.15]}>
        <cylinderGeometry args={[0.04, 0.05, 1.5, 8]} />
        <meshStandardMaterial color="#5a3a22" />
      </mesh>
    </>
  );
};

// 2. "você passa por um par de botas"
const S02 = ({ t, t0, t1 }: ShotProps) => {
  const b = W(0, 'botas');
  const pose = track(t, andar(t, t0, -1.6, 0.42, 0.6), [{ at: b, v: { hy: -0.7, hp: 0.25 } }]);
  return (
    <>
      <Mountain />
      <CaveBoots />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.9, 1.5, 5.4], [-0.6, 1.0, -0.2], 32], [t1, [-0.4, 1.5, 5.1], [-0.4, 1.0, -0.2], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'tired' }, { at: b, f: 'surprised' }], 3)} look={VOCE_ALP} />
    </>
  );
};

// 3. "verdes."
const S03 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Mountain />
    <CaveBoots glow={seg(t, t0, t0 + 0.4)} />
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.5, 0.75, 1.8], [0, 0.25, -0.6], 32], [t1, [0.2, 0.7, 1.5], [0, 0.25, -0.65], 32]]} />
  </>
);

// ---------------------------------------------------------------- linha 1
// 4. "Elas ficam numa pequena *caverna* de pedra,"
const S04 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Mountain />
    <CaveBoots />
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-2.2, 1.4, 3.6], [0, 0.8, -0.6], 32], [W(1, 'caverna'), [-1.0, 1.3, 3.8], [0, 0.85, -0.6], 32], [t1, [0.6, 1.3, 3.8], [0, 0.85, -0.6], 32]]} />
    <Snow t={t} k={0.25} n={60} center={[0, 0, 0]} wind={0.6} />
  </>
);

// 5. "a quase oito mil e *quinhentos* metros."
const S05 = ({ t, t0, t1 }: ShotProps) => {
  const q = W(1, 'quinhentos');
  const pose = track(t, P({ x: -0.55, ry: 0.4, hy: 0.4 }), [{ at: q, v: { lsz: 1.2, lsx: 0.5, lel: 0.2, hy: 0.55, hp: -0.15 } }]);
  return (
    <>
      <Mountain />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.8, 1.7, 5.8], [0.1, 1.4, 0], 32], [t1, [-0.2, 1.6, 5.3], [0.1, 1.45, 0], 32]]} />
      <LedCounter t={t} from={t0} at={q} value={8500} suffix=" m" position={[0.35, 2.75, -0.3]} scale={0.6} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'curious' }, { at: q, f: 'amazed' }], 5)} look={VOCE_ALP} />
    </>
  );
};

// ---------------------------------------------------------------- linha 2
// 6. "E quem está calçando essas botas"
const S06 = ({ t, t0, t1 }: ShotProps) => {
  const pose = P({ x: 0.9, z: 0.9, ry: -0.9, hy: -0.3, hp: 0.3, squash: 0.25 });
  return (
    <>
      <Mountain />
      <CaveBoots />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.4, 1.5, 4.6], [0.4, 0.8, -0.2], 32], [t1, [-1.1, 1.45, 4.2], [0.4, 0.85, -0.2], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'worried' }, { at: W(2, 'botas'), f: 'lookDown' }], 6)} look={VOCE_ALP} />
    </>
  );
};

// 7. "é um *alpinista* que nunca voltou." — lembrança: ele se afasta na névoa
const S07 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Mountain storm={0.35} flags={false} />
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 1.5, 5], [0, 1.3, -2], 32], [t1, [0, 1.6, 4.4], [0, 1.3, -3], 32]]} />
    <Character pose={P({ z: -0.5 - 0.4 * (t - t0), ry: Math.PI, walk: (0.4 * (t - t0)) / 0.24, stride: 1, lean: 0.1 })} face={faceAt(t, [{ at: t0, f: 'neutral' }], 7)} look={ALP_BOTAS} />
    <Snow t={t} k={0.5} n={90} center={[0, 0, -1]} wind={1} />
  </>
);

// ---------------------------------------------------------------- linha 3
// 8. "Os escaladores o chamam de *Green* Boots."
const S08 = ({ t, t0, t1 }: ShotProps) => {
  const g = W(3, 'green');
  const a = track(t, P({ x: -0.9, z: 0.8, ry: -0.5, hy: -0.2 }), [{ at: g, v: { rsx: 1.3, rel: 0.1, rsz: 0.2, hy: -0.35 } }]);
  return (
    <>
      <Mountain />
      <CaveBoots glow={seg(t, g - 0.2, g)} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-2.2, 1.8, 5.4], [-0.4, 1.0, -0.3], 32], [t1, [-1.4, 1.7, 5.0], [-0.4, 1.0, -0.3], 32]]} />
      <Character pose={a} face={faceAt(t, [{ at: t0, f: 'worried' }], 8)} look={ALP_2} />
      <Character pose={P({ x: -1.7, z: 0.3, ry: -0.6, hy: -0.3 })} face={faceAt(t, [{ at: t0, f: 'unsure' }], 9)} look={ALP_3} />
      <group scale={pop(t, g)}>
        <Sign text="GREEN BOOTS" w={1.7} h={0.4} bg="#2c5a2a" position={[0.1, 2.55, -0.5]} />
      </group>
    </>
  );
};

// ---------------------------------------------------------------- linha 4
// 9. "Acredita-se que seja *Tsewang* Paljor," — lembrança, de frente
const S09 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Mountain />
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.4, 1.6, 4.6], [0, 1.35, 0], 32], [t1, [0.2, 1.65, 3.8], [0, 1.45, 0], 32]]} />
    <Character pose={track(t, P({ ry: -0.1 }), [{ at: W(4, 'tsewang'), v: { hr: 0.08, hp: -0.05 } }])} face={faceAt(t, [{ at: t0, f: 'content' }, { at: W(4, 'tsewang'), f: 'smile' }], 10)} look={ALP_BOTAS} />
  </>
);

// 10. "um policial indiano de *vinte* e oito anos."
const S10 = ({ t, t0, t1 }: ShotProps) => {
  const v = W(4, 'vinte');
  return (
    <>
      <Mountain />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.9, 1.7, 5.0], [0.3, 1.4, 0], 32], [t1, [-0.4, 1.7, 5.4], [0.3, 1.4, 0], 32]]} />
      <Character pose={track(t, P({ x: -0.35, ry: 0.3 }), [{ at: v, v: { lsz: 0.5, lel: 0.4, hy: 0.4 } }])} face={faceAt(t, [{ at: t0, f: 'confident' }, { at: v, f: 'smile' }], 11)} look={ALP_BOTAS} />
      <group scale={pop(t, v)}>
        <Sign text="28 ANOS" w={1.2} h={0.45} bg="#f4efe2" fg="#2a2a2a" border="#d8352f" position={[0.75, 2.3, -0.2]} rotation={[0, -0.2, 0]} />
      </group>
    </>
  );
};

// ---------------------------------------------------------------- linha 5
// 11. "Em maio de mil novecentos e noventa e *seis*,"
const S11 = ({ t, t0, t1 }: ShotProps) => {
  const s = W(5, 'seis');
  return (
    <>
      <Mountain />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 1.6, 5.0], [0.1, 1.3, 0], 32], [t1, [0.1, 1.55, 4.5], [0.1, 1.35, 0], 32]]} />
      <Calendar t={t} from={t0} at={s} pages={['1994', '1995', 'MAIO\n1996']} position={[0.65, 1.5, 0]} rotation={[0, -0.25, 0]} scale={0.85} />
      <Character pose={P({ x: -0.55, ry: 0.4, hy: 0.4 })} face={faceAt(t, [{ at: t0, f: 'confident' }], 12)} look={ALP_BOTAS} />
    </>
  );
};

// 12. "ele subiu a montanha com sua equipe." — a equipe em fila
const S12 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Mountain />
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.0 + 0.4 * (t - t0), 1.6, 7.0], [0.4 * (t - t0) - 1.0, 1.0, 0], 32]]} />
    <Character pose={andar(t, t0, -0.2, 0.4, -0.4)} face={faceAt(t, [{ at: t0, f: 'confident' }], 13)} look={ALP_BOTAS} />
    <Character pose={andar(t, t0, -1.2, 0.4, 0.1)} face={faceAt(t, [{ at: t0, f: 'happy' }], 14)} look={ALP_2} />
    <Character pose={andar(t, t0, -2.2, 0.4, 0.5)} face={faceAt(t, [{ at: t0, f: 'smile' }], 15)} look={ALP_3} />
  </>
);

// ---------------------------------------------------------------- linha 6
// 13. "Perto do cume, uma *tempestade*"
const S13 = ({ t, t0, t1 }: ShotProps) => {
  const k = seg(t, t0 + 0.2, W(6, 'tempestade') - F);
  return (
    <>
      <Mountain storm={k} />
      <SummitFlag t={t} position={[0, 5.2, -8]} scale={1.4} />
      <mesh position={[0, 2.5, -8]}>
        <coneGeometry args={[3, 5.4, 5]} />
        <meshStandardMaterial color="#8a8f99" flatShading />
      </mesh>
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 2.2, 7], [0, 3.6, -8], 32], [t1, [0.4, 2.0, 6], [0, 3.6, -8], 32]]} />
      <Character pose={andar(t, t0, -1.4, 0.25, 1)} face={faceAt(t, [{ at: t0, f: 'confident' }], 16)} look={ALP_BOTAS} />
      <Snow t={t} k={k} n={160} area={8} center={[0, 0, 1]} wind={3} />
    </>
  );
};

// 14. "fechou o céu."
const S14 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Mountain storm={1} />
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 1.65, 3.2], [0, 1.55, 0], 32], [t1, [-0.2, 1.65, 3.5], [0, 1.55, 0], 32]]} />
    <Character pose={P({ ry: 0.2, hy: 0.3, hp: -0.25, lsz: 0.3, rsz: 0.3 })} face={faceAt(t, [{ at: t0, f: 'lookUp' }, { at: W(6, 'ceu'), f: 'scared' }], 17)} look={ALP_BOTAS} />
    <Snow t={t} k={1} n={160} area={5} center={[0, 0, 1]} wind={3} />
  </>
);

// ---------------------------------------------------------------- linha 7
// 15. "O vento e o frio ficaram *mortais*."
const S15 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(7, 'mortais');
  const pose = track(t, P({ x: -0.5, ry: 0.35, hy: 0.2 }), [{ at: m, v: { lsx: 1.2, rsx: 1.2, lel: 1.3, rel: 1.3, lsz: 0.4, rsz: 0.4, squash: 0.15, hp: 0.15 } }]);
  return (
    <>
      <Mountain storm={1} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.7, 1.6, 5.0], [0.1, 1.3, 0], 32], [t1, [0.2, 1.55, 4.5], [0.1, 1.35, 0], 32]]} />
      <Thermometer t={t} from={t0} at={m} position={[0.7, 1.6, 0]} rotation={[0, -0.2, 0]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'anxious' }, { at: m, f: 'terrified', o: ['shading'] }], 18)} look={ALP_BOTAS} />
      <Snow t={t} k={1} n={160} area={6} center={[0, 0, 1]} wind={4} />
    </>
  );
};

// ---------------------------------------------------------------- linha 8
// 16. "Ele procurou abrigo na *caverna*"
const S16 = ({ t, t0, t1 }: ShotProps) => {
  const c = W(8, 'caverna');
  const x = Math.min(-0.5, -2.4 + 0.9 * (t - t0));
  return (
    <>
      <Mountain storm={1} />
      <Cave position={CAVE} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-2.4, 1.5, 4.6], [-1.2, 1.0, -0.3], 32], [t1, [-1.2, 1.4, 4.2], [-0.4, 0.9, -0.4], 32]]} />
      <Character pose={P({ x, z: 0.2, ry: HALF_PI - 0.5 * seg(t, c - 0.3, c), walk: (x + 2.4) / 0.24, stride: x < -0.55 ? 1 : 0, lean: 0.25, squash: 0.2 * seg(t, c - 0.3, c) })} face={faceAt(t, [{ at: t0, f: 'tired', o: ['shading'] }], 19)} look={ALP_BOTAS} />
      <Snow t={t} k={1} n={160} area={6} center={[-1, 0, 1]} wind={4} />
    </>
  );
};

// 17. "e nunca mais acordou." — só as botas; a nevasca acalma
const S17 = ({ t, t0, t1 }: ShotProps) => {
  const k = 1 - seg(t, t0, t1);
  return (
    <>
      <Mountain storm={0.6 * k + 0.2} />
      <CaveBoots />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.2, 0.9, 2.2], [0, 0.4, -0.6], 32], [t1, [0.3, 1.4, 3.6], [0, 0.6, -0.6], 32]]} />
      <Snow t={t} k={0.2 + 0.6 * k} n={120} area={5} center={[0, 0, 0.5]} wind={2 * k} />
    </>
  );
};

// ---------------------------------------------------------------- linha 9
// 18. "Seus dois companheiros também *ficaram* na montanha." — dois memoriais
const S18 = ({ t, t0, t1 }: ShotProps) => {
  const d = W(9, 'dois');
  return (
    <>
      <Mountain storm={0.2} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 1.3, 4.2], [0, 0.7, 0], 32], [t1, [0, 1.8, 5.2], [0, 0.8, 0], 32]]} />
      <group scale={pop(t, d)}>
        <Cairn flag="#2f6fd1" position={[-0.55, 0, 0]} />
      </group>
      <group scale={pop(t, d + 4 * F)}>
        <Cairn flag="#7a4fb3" position={[0.55, 0, 0]} />
      </group>
      <Snow t={t} k={0.25} n={60} area={5} center={[0, 0, 0.5]} wind={0.5} />
    </>
  );
};

// ---------------------------------------------------------------- linha 10
// 19. "Acima de oito mil metros fica a *zona* da morte."
const S19 = ({ t, t0, t1 }: ShotProps) => {
  const z = W(10, 'zona');
  return (
    <>
      <Mountain />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.7, 1.7, 5.6], [0.1, 1.45, 0], 32], [t1, [-0.2, 1.65, 5.0], [0.1, 1.5, 0], 32]]} />
      <LedCounter t={t} from={t0} at={W(10, 'metros')} value={8000} suffix=" m" position={[0.35, 2.75, -0.3]} scale={0.6} />
      <group scale={pop(t, z)}>
        <Sign text="ZONA DA MORTE" w={1.5} h={0.42} bg="#e8b923" fg="#1a1a1a" border="#1a1a1a" position={[0.75, 1.3, 0.1]} rotation={[0, -0.25, 0]} />
      </group>
      <mesh position={[0.75, 0.55, 0.05]}>
        <cylinderGeometry args={[0.035, 0.04, 1.1, 8]} />
        <meshStandardMaterial color="#5a3a22" />
      </mesh>
      <Character pose={P({ x: -0.55, ry: 0.4, hy: 0.4 })} face={faceAt(t, [{ at: t0, f: 'curious' }, { at: z, f: 'worried' }], 20)} look={VOCE_ALP} />
    </>
  );
};

// ---------------------------------------------------------------- linha 11
// 20. "Lá, o ar tem só um *terço* do oxigênio."
const S20 = ({ t, t0, t1 }: ShotProps) => {
  const tc = W(11, 'terco');
  return (
    <>
      <Mountain />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.6, 1.6, 4.8], [0.1, 1.25, 0], 32], [t1, [0.2, 1.6, 4.4], [0.1, 1.3, 0], 32]]} />
      <Gauge t={t} from={t0} at={tc} value={0.33} label="O2" position={[0.7, 2.2, -0.2]} scale={0.9} />
      <OxygenTank position={[0.75, 0, 0.2]} />
      <Character pose={track(t, P({ x: -0.45, ry: 0.35, lean: 0.2, squash: 0.1 }), [{ at: tc, v: { hp: 0.25, hr: 0.1, lsz: 0.2, rsz: 0.2 } }])} face={faceAt(t, [{ at: t0, f: 'tired' }, { at: tc, f: 'dizzy', o: ['sweat'] }], 21)} look={VOCE_ALP} />
    </>
  );
};

// ---------------------------------------------------------------- linha 12
// 21. "Por isso, resgatar um corpo é *perigoso*"
const S21 = ({ t, t0, t1 }: ShotProps) => {
  const p = W(12, 'perigoso');
  return (
    <>
      <Mountain />
      <CaveBoots />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-2.0, 1.9, 5.6], [-0.6, 1.0, -0.3], 32], [t1, [-1.5, 1.8, 5.0], [-0.6, 1.0, -0.3], 32]]} />
      <Character pose={P({ x: -1.0, z: 0.8, ry: -0.5, hy: -0.2 })} face={faceAt(t, [{ at: t0, f: 'worried' }, { at: p, f: 'scared' }], 22)} look={VOCE_ALP} />
      <Character pose={P({ x: -1.9, z: 0.4, ry: -0.6, hy: -0.2 })} face={faceAt(t, [{ at: t0, f: 'unsure' }, { at: p, f: 'nervous' }], 23)} look={ALP_2} />
      <group scale={pop(t, p)}>
        <Sign text="PERIGO" w={1.2} h={0.42} bg="#e8b923" fg="#1a1a1a" border="#1a1a1a" position={[-1.4, 2.6, -0.4]} />
      </group>
    </>
  );
};

// 22. "e custa uma *fortuna*."
const S22 = ({ t, t0, t1 }: ShotProps) => {
  const f = W(12, 'fortuna');
  const n = Math.round(2 + 14 * seg(t, t0, f - F));
  return (
    <>
      <Mountain />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 1.4, 4.4], [0.2, 0.9, 0], 32], [t1, [-0.2, 1.4, 4.1], [0.2, 0.9, 0], 32]]} />
      <MoneyStack n={n} symbol="$" position={[0.55, 0, 0.2]} scale={1.3} />
      <MoneyStack n={Math.max(1, n - 4)} symbol="$" position={[0.95, 0, -0.2]} scale={1.3} />
      <Character pose={P({ x: -0.3, ry: 0.45, hy: 0.4, hp: 0.15 })} face={faceAt(t, [{ at: t0, f: 'surprised' }, { at: f, f: 'shocked' }], 24)} look={VOCE_ALP} />
    </>
  );
};

// ---------------------------------------------------------------- linha 13
// 23. "Hoje, mais de *duzentas* pessoas"
const S23 = ({ t, t0, t1 }: ShotProps) => {
  const d = W(13, 'duzentas');
  return (
    <>
      <Mountain />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 1.8, 5.6], [0.1, 1.6, 0], 32], [t1, [-0.2, 1.75, 5.2], [0.1, 1.65, 0], 32]]} />
      <LedCounter t={t} from={t0} at={d} value={200} prefix="+" position={[0.25, 2.75, -0.3]} scale={0.6} />
      {[-1.6, -0.6, 0.4, 1.4].map((x, i) => (
        <group key={x} scale={pop(t, d + i * 2 * F)}>
          <Cairn flag={['#d8352f', '#2f6fd1', '#3faa3a', '#f2c14e'][i]} position={[x, 0, -1.4 - (i % 2) * 0.6]} />
        </group>
      ))}
    </>
  );
};

// 24. "continuam no Everest." — panorama solene
const S24 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Mountain />
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 3.5, 12], [0, 5, -24], 32], [t1, [0, 4.5, 11], [0, 6, -24], 32]]} />
    {[-3, -1.2, 0.6, 2.4, 4].map((x, i) => (
      <Cairn key={x} flag={['#d8352f', '#2f6fd1', '#3faa3a', '#f2c14e', '#f2f2f2'][i]} position={[x, 0, -2 - i * 1.3]} />
    ))}
  </>
);

// ---------------------------------------------------------------- linha 14
// 25. "Por quase vinte anos, as botas verdes"
const S25 = ({ t, t0, t1 }: ShotProps) => {
  const b = W(14, 'botas');
  return (
    <>
      <Mountain />
      <CaveBoots />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.4, 1.6, 5.0], [0.5, 1.0, -0.3], 32], [t1, [1.0, 1.5, 4.6], [0.5, 1.0, -0.3], 32]]} />
      <Calendar t={t} from={t0} at={b} pages={['1996', '2000', '2005', '2010', '2014']} position={[1.05, 1.2, 0.3]} rotation={[0, -0.3, 0]} scale={0.7} />
    </>
  );
};

// 26. "viraram um *marco* da subida." — quem passa, aponta
const S26 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(14, 'marco');
  const x = -1.5 + 0.45 * (t - t0);
  return (
    <>
      <Mountain />
      <CaveBoots glow={seg(t, m - 0.2, m)} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.1, 1.7, 5.6], [-0.8, 1.0, -0.2], 32], [t1, [-0.3, 1.7, 5.4], [-0.3, 1.0, -0.2], 32]]} />
      <Character pose={track(t, P({ x, z: 0.9, ry: HALF_PI, walk: (x + 1.5) / 0.24, stride: 1, lean: 0.08 }), [{ at: m, v: { lsx: 1.2, lel: 0.1, hy: 1.0 } }])} face={faceAt(t, [{ at: t0, f: 'tired' }, { at: m, f: 'lookDown' }], 25)} look={ALP_3} />
    </>
  );
};

// ---------------------------------------------------------------- linha 15
// 27. "Quem passava por elas sabia que faltava"
const S27 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Mountain />
    <CaveBoots />
    <Cam t={t} t0={t0} t1={t1} keys={[[t, [andar(t, t0, -1.6, 0.45, 0.9).x + 0.3, 1.5, 4.4], [andar(t, t0, -1.6, 0.45, 0.9).x + 0.3, 1.2, 0], 32]]} />
    <Character pose={track(t, andar(t, t0, -1.6, 0.45, 0.9), [{ at: W(15, 'sabia'), v: { hy: -0.9, hp: 0.2 } }])} face={faceAt(t, [{ at: t0, f: 'tired' }, { at: W(15, 'sabia'), f: 'worried' }], 26)} look={VOCE_ALP} />
  </>
);

// 28. "*pouco* para o cume."
const S28 = ({ t, t0, t1 }: ShotProps) => {
  const p = W(15, 'pouco');
  return (
    <>
      <Mountain />
      <mesh position={[0, 1.1, -4]}>
        <coneGeometry args={[1.6, 2.4, 5]} />
        <meshStandardMaterial color="#f4f7fb" flatShading />
      </mesh>
      <SummitFlag t={t} position={[0, 2.3, -4]} />
      <LedCounter t={t} from={t0 - 0.6} at={p} value={8849} suffix=" m" position={[0, 4.4, -4]} scale={0.6} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.4, 2.2, 3], [0, 3.0, -4], 32], [t1, [0.1, 2.6, 2.4], [0, 3.2, -4], 32]]} />
    </>
  );
};

// ---------------------------------------------------------------- linha 16
// 29. "Então, quando você olhar para o topo do mundo,"
const S29 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Mountain />
    <SummitFlag t={t} position={[0, 5.2, -8]} scale={1.4} />
    <mesh position={[0, 2.5, -8]}>
      <coneGeometry args={[3, 5.4, 5]} />
      <meshStandardMaterial color="#8a8f99" flatShading />
    </mesh>
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.4, 1.5, 4.6], [0, 2.4, -8], 32], [t1, [0.6, 2.4, 6.0], [0, 3.2, -8], 32]]} />
    <Character pose={track(t, P({ ry: Math.PI, hp: -0.1 }), [{ at: W(16, 'olhar'), v: { hp: -0.35 } }])} face={faceAt(t, [{ at: t0, f: 'lookUp' }], 27)} look={VOCE_ALP} />
  </>
);

// 30. "*lembre*:"
const S30 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Mountain />
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.2, 1.65, 3.0], [0, 1.6, 0], 32], [t1, [0, 1.65, 2.8], [0, 1.6, 0], 32]]} />
    <Character pose={track(t, P({ ry: 0.1, hp: 0.05 }), [{ at: W(16, 'lembre'), v: { hp: 0.2, hr: 0.05 } }])} face={faceAt(t, [{ at: t0, f: 'worried' }, { at: W(16, 'lembre'), f: 'closedSmile' }], 28)} look={VOCE_ALP} />
  </>
);

// 31. "a montanha sempre cobra o seu preço." — volta às botas (loop)
const S31 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Mountain />
    <CaveBoots glow={0.3} />
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.2, 1.4, 4.0], [0, 0.8, -0.6], 32], [t1, [0.5, 0.75, 1.8], [0, 0.25, -0.6], 32]]} />
    <Snow t={t} k={0.25 * clamp01(1)} n={60} area={5} center={[0, 0, 0.5]} wind={0.5} />
  </>
);

export const SHOTS: Shot[] = [
  { from: 0, name: '01 everest', C: S01 },
  { from: W(0, 'voce'), name: '02 passa', C: S02 },
  { from: W(0, 'verdes'), name: '03 botas', C: S03 },
  { from: W(1, 0), name: '04 caverna', C: S04 },
  { from: W(1, 'quase'), name: '05 altitude', C: S05 },
  { from: W(2, 0), name: '06 calcando', C: S06 },
  { from: W(2, 'um'), name: '07 alpinista', C: S07 },
  { from: W(3, 0), name: '08 green boots', C: S08 },
  { from: W(4, 0), name: '09 tsewang', C: S09 },
  { from: W(4, 'um'), name: '10 28 anos', C: S10 },
  { from: W(5, 0), name: '11 1996', C: S11 },
  { from: W(5, 'ele'), name: '12 equipe', C: S12 },
  { from: W(6, 0), name: '13 tempestade', C: S13 },
  { from: W(6, 'fechou'), name: '14 ceu', C: S14 },
  { from: W(7, 0), name: '15 mortais', C: S15 },
  { from: W(8, 0), name: '16 abrigo', C: S16 },
  { from: W(8, 'nunca'), name: '17 nunca', C: S17 },
  { from: W(9, 0), name: '18 companheiros', C: S18 },
  { from: W(10, 0), name: '19 zona', C: S19 },
  { from: W(11, 0), name: '20 oxigenio', C: S20 },
  { from: W(12, 0), name: '21 perigoso', C: S21 },
  { from: W(12, 'custa'), name: '22 fortuna', C: S22 },
  { from: W(13, 0), name: '23 duzentas', C: S23 },
  { from: W(13, 'continuam'), name: '24 everest', C: S24 },
  { from: W(14, 0), name: '25 vinte anos', C: S25 },
  { from: W(14, 'viraram'), name: '26 marco', C: S26 },
  { from: W(15, 0), name: '27 passava', C: S27 },
  { from: W(15, 'pouco'), name: '28 cume', C: S28 },
  { from: W(16, 0), name: '29 topo', C: S29 },
  { from: W(16, 'lembre'), name: '30 lembre', C: S30 },
  { from: W(16, 'montanha'), name: '31 preco', C: S31 },
];
