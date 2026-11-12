import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { easeInOut, seg, track } from './anim';
import { Character, faceAt, Pose, REST } from './Character';
import { ELENCO } from './personagens';
import { Comic, Puff, Sparkles } from './props';
import { Cam, CamKey, Stage } from './sets';
import { useFacesReady } from './textures';

// ============================================================================
// MOVIMENTOS DO MAD — vitrine de 12 s com os gestos do cientista maluco.
// Cada movimento é uma função de t (segundos) e pode ser copiada para qualquer tomada.
// Render: REMOTION_GL=swangle npx remotion render src/index.ts MadMovimentos out/mad.mp4
// ============================================================================

export const MAD_DUR = 12;
const P = (o: Partial<Pose> = {}): Pose => ({ ...REST, ...o });
const osc = (t: number, hz: number) => Math.sin(t * Math.PI * 2 * hz);

// 1. Esfrega as mãos (plano maligno): mãos juntas na frente, vai e vem rápido.
export const esfregaMaos = (t: number, a: number, b: number): Partial<Pose> => {
  const k = seg(t, a, a + 0.2) * (1 - seg(t, b - 0.2, b));
  const r = osc(t, 4) * 0.18 * k;
  return { lsx: 0.95 * k, rsx: 0.95 * k, lsz: (0.12 - 0.4) * k + 0.12 * (1 - k) - r, rsz: (0.12 - 0.4) * k + 0.12 * (1 - k) + r, lel: 0.15 + 0.9 * k, rel: 0.15 + 0.9 * k, hp: 0.12 * k, lean: 0.12 * k };
};

// 2. Risada maluca: joga o corpo para trás, braços abertos, cabeça sacudindo.
export const risadaMaluca = (t: number, a: number, b: number): Partial<Pose> => {
  const k = seg(t, a, a + 0.2) * (1 - seg(t, b - 0.2, b));
  const s = osc(t, 5) * k;
  return { lean: -0.22 * k, hp: -0.3 * k + 0.06 * s, hr: 0.1 * s, lsz: 0.12 + 0.75 * k, rsz: 0.12 + 0.75 * k, lel: 0.15 + 0.6 * k, rel: 0.15 + 0.6 * k, squash: 0.08 * Math.abs(s) };
};

// 3. "Está vivo!": os dois braços para o alto, tremendo de emoção.
export const estaVivo = (t: number, a: number, b: number): Partial<Pose> => {
  const k = seg(t, a, a + 0.25, easeInOut) * (1 - seg(t, b - 0.2, b));
  const tr = osc(t, 9) * 0.05 * k;
  return { lsz: 0.12 + 2.5 * k + tr, rsz: 0.12 + 2.5 * k - tr, lel: 0.15 - 0.1 * k, rel: 0.15 - 0.1 * k, hp: -0.25 * k, lean: -0.08 * k };
};

// 4. Pulinho de alegria (dois pulos): agacha, sobe, cai com amortecimento.
export const pulinhos = (t: number, a: number, n = 2, per = 0.7): Partial<Pose> => {
  const u = (t - a) / per;
  if (u < 0 || u >= n) return {};
  const f = u - Math.floor(u);
  const y = f < 0.2 ? 0 : f < 0.85 ? Math.sin(((f - 0.2) / 0.65) * Math.PI) * 0.45 : 0;
  const sq = f < 0.2 ? Math.sin((f / 0.2) * Math.PI) * 0.45 : f > 0.85 ? Math.sin(((f - 0.85) / 0.15) * Math.PI) * 0.35 : 0;
  const ar = f >= 0.2 && f < 0.85 ? 1 : 0.3;
  return { y, squash: sq, lsz: 0.12 + 1.6 * ar, rsz: 0.12 + 1.6 * ar, lel: 0.4, rel: 0.4 };
};

// 5. Aponta para você (para a câmera) com o braço direito.
export const apontaVoce = (t: number, a: number, b: number): Partial<Pose> => {
  const k = seg(t, a, a + 0.18) * (1 - seg(t, b - 0.2, b));
  return { rsx: 1.6 * k, rsz: 0.12 + 0.3 * k, rel: 0.15 - 0.15 * k, lsz: 0.12 + 0.2 * k, lel: 0.15 + 1.2 * k, hy: -0.05 * k, hp: 0.05 * k, lean: 0.1 * k };
};

const MadCena = ({ t }: { t: number }) => {
  const madLook = ELENCO.mad.look;
  const base = P({ ry: 0.15 });
  // Cada movimento vale só na sua janela de tempo (fora dela, pose de descanso).
  const MOVES: [number, number, (t: number) => Partial<Pose>][] = [
    [0.3, 2.4, (x) => esfregaMaos(x, 0.3, 2.4)],
    [2.6, 4.8, (x) => risadaMaluca(x, 2.6, 4.8)],
    [5.0, 7.2, (x) => estaVivo(x, 5.0, 7.2)],
    [7.4, 9.0, (x) => pulinhos(x, 7.4, 2, 0.75)],
    [9.2, 11.6, (x) => apontaVoce(x, 9.2, 11.6)],
  ];
  const ativo = MOVES.find(([a, b]) => t >= a && t < b);
  const pose = { ...base, ...(ativo ? ativo[2](t) : {}) } as Pose;
  // gira de frente para a câmera quando aponta
  pose.ry = 0.15 - 0.15 * seg(t, 9.0, 9.3);
  const face = faceAt(
    t,
    [
      { at: 0.1, f: 'smug' },
      { at: 0.9, f: 'sideEye' },
      { at: 2.6, f: 'laugh', o: ['stress'] },
      { at: 5.0, f: 'starstruck', o: ['sparkle'] },
      { at: 7.4, f: 'bigSmile' },
      { at: 9.2, f: 'wink' },
      { at: 10.4, f: 'grin' },
    ],
    7,
  );
  // Uma tomada de câmera por movimento (a Cam avança devagar dentro de cada uma).
  const CAMS: { t0: number; t1: number; keys: CamKey[] }[] = [
    { t0: 0, t1: 2.5, keys: [[0, [0.7, 1.8, 4.6], [0, 1.35, 0], 32], [2.5, [0.3, 1.6, 4.2], [0, 1.4, 0], 32]] },
    { t0: 2.5, t1: 4.9, keys: [[2.5, [-0.4, 1.3, 4.8], [0, 1.5, 0], 32], [4.9, [-0.2, 1.4, 4.4], [0, 1.5, 0], 32]] },
    { t0: 4.9, t1: 7.3, keys: [[4.9, [0, 0.9, 5.8], [0, 1.8, 0], 32], [7.3, [0.3, 1.0, 5.4], [0, 1.8, 0], 32]] },
    { t0: 7.3, t1: 9.1, keys: [[7.3, [0.8, 1.4, 6.0], [0, 1.4, 0], 32], [9.1, [0.5, 1.4, 5.6], [0, 1.4, 0], 32]] },
    { t0: 9.1, t1: MAD_DUR, keys: [[9.1, [1.4, 1.6, 4.8], [-0.2, 1.4, 0], 32], [MAD_DUR, [1.1, 1.6, 4.3], [-0.2, 1.45, 0], 32]] },
  ];
  const cam = CAMS.find((c) => t < c.t1) ?? CAMS[CAMS.length - 1];
  return (
    <>
      <Stage color="#3b2f5c" pedestal={false} />
      <Cam t={t} t0={cam.t0} t1={cam.t1} keys={cam.keys} />
      <Character pose={pose} face={face} look={madLook} />
      <Comic t={t} at={2.75} text="HA HA HA!" position={[0, 2.75, 0.3]} size={0.7} hold={1.6} />
      <Sparkles t={t} from={5.2} n={10} radius={1.1} center={[0, 2.3, 0]} size={0.16} />
      <Comic t={t} at={5.3} text="ESTÁ VIVO!" position={[0, 3.25, 0.3]} size={0.75} hold={1.6} />
      <Puff t={t} at={7.45 + 0.75 * 0.85} position={[0, 0.05, 0.2]} />
      <Puff t={t} at={7.45 + 0.75 * 1.85} position={[0, 0.05, 0.2]} />
      <Comic t={t} at={9.4} text="VOCÊ!" position={[0.1, 2.8, 0.5]} size={0.6} hold={1.8} />
    </>
  );
};

export const MadMovimentos = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const ready = useFacesReady();
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {ready && (
        <ThreeCanvas width={width} height={height} shadows gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05, antialias: true }} camera={{ fov: 32, near: 0.05, far: 200, position: [0, 2, 5] }}>
          <MadCena t={frame / fps} />
        </ThreeCanvas>
      )}
    </AbsoluteFill>
  );
};
