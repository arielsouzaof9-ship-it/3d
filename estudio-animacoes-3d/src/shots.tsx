import { JSX } from 'react';
import { clamp01, seg, V3 } from './anim';
import { Calendar, Comic, LedCounter, MoneyStack, Puff, Sign, Sparkles, UpArrow } from './props';
import { Cam, Stage, Street } from './sets';
import { F, W } from './timeline';
import {
  Baby, Balloons, Berco, Bercario, Book, Camera, Ch, Chair, Cidade, Desk, Escombros, Flores, FOTOGRAFO, Interior, KIDS, Lanterna,
  MAE_BEBE, MAE_NINA, MAE_RAFAEL, NINA, NINA_KID, PAI_RAFAEL, PalmNumber, RAFAEL, RAFAEL_KID, Rain, Retrato, Saco,
} from './historia';
import { ELENCO } from './personagens';

// ============================================================================
// "O Número da Palma" — uma tomada por frase (35), tudo ancorado em palavras.
// ============================================================================

export type ShotProps = { t: number; t0: number; t1: number };
export type Shot = { from: number; name: string; C: (p: ShotProps) => JSX.Element };
export const SFX: { at: number; file: string; vol: number }[] = [];

type CK = [V3, V3];
const cam = (t: number, t0: number, t1: number, a: CK, b: CK, fov = 32) => <Cam t={t} t0={t0} t1={t1} keys={[[t0, a[0], a[1], fov], [t1, b[0], b[1], fov]]} />;

// Mão erguida mostrando a palma (braço direito para frente e para cima).
const PALMA = { rsx: 2.3, rsz: 0.35, rel: -0.2 };

// 0 — Bebê no berço mostra o número na palma.
const S00 = ({ t, t0, t1 }: ShotProps) => {
  const n = W(0, 'numero');
  return (
    <>
      <Bercario />
      {cam(t, t0, t1, [[0, 2.6, 5.5], [0, 1.1, 0]], [[0, 1.6, 2.6], [0, 1.25, 0]])}
      <Berco />
      <Baby t={t} position={[0, 1.1, 0]} face="happy" blanket="#c9b6e4" />
      <PalmNumber t={t} at={n} text="247" position={[0.35, 1.75, 0.2]} w={0.6} />
      <Sparkles t={t} from={n} n={8} radius={0.45} center={[0.35, 1.75, 0.2]} size={0.1} />
    </>
  );
};

// 1 — Quantas vidas você vai mudar: adulto com a palma e pessoas felizes em volta.
const S01 = ({ t, t0, t1 }: ShotProps) => {
  const v = W(1, 'vidas');
  return (
    <>
      <Stage color="#3a5a7a" pedestal={false} />
      {cam(t, t0, t1, [[0, 1.8, 6.5], [0, 1.2, 0]], [[0.4, 1.6, 5.6], [0, 1.3, 0]])}
      <Ch t={t} look={ELENCO.kaio.look} pose={{}} keys={[{ at: v, v: PALMA }]} faces={[{ at: t0, f: 'curious' }, { at: v, f: 'bigSmile' }]} seed={2} />
      <PalmNumber t={t} at={v} text="12.000" position={[-0.4, 2.65, 0.5]} w={0.9} />
      {KIDS.map((k, i) => (
        <Ch key={i} t={t} look={k} pose={{ x: [-1.6, 1.6, -1.1, 1.2][i], z: [0.3, 0.4, -1, -1.1][i], ry: [0.5, -0.5, 0.4, -0.4][i] }} keys={[{ at: v + i * 0.08, v: { lsz: 1.3, rsz: 1.3 } }]} faces={[{ at: t0, f: 'smile' }, { at: v + 0.1, f: 'happy' }]} seed={i + 3} />
      ))}
    </>
  );
};

// 2 — O defeito: o número pisca e fica estranho.
const S02 = ({ t, t0, t1 }: ShotProps) => {
  const d = W(2, 'defeito');
  const glitch = t > d - 3 * F && Math.floor(t * 12) % 3 === 0;
  return (
    <>
      <Stage color="#2a2440" pedestal={false} />
      {cam(t, t0, t1, [[0, 2.2, 3.4], [-0.3, 2.2, 0]], [[0.3, 2.3, 2.6], [-0.3, 2.3, 0]])}
      <Ch t={t} look={ELENCO.kaio.look} pose={PALMA} keys={[{ at: d, v: { hp: -0.25, hy: -0.2 } }]} faces={[{ at: t0, f: 'smile' }, { at: d, f: 'confused' }]} seed={2} />
      <PalmNumber t={t} at={t0} text={glitch ? '?!?' : '12.000'} color={t > d - 3 * F ? '#ff5a4a' : '#ffd23a'} position={[-0.4, 2.65, 0.5]} w={0.9} />
      <Comic t={t} at={d} text="?!" position={[0.5, 2.9, 0.6]} size={0.35} />
    </>
  );
};

// 3 — Melhor ou pior: seta verde para cima, seta vermelha para baixo.
const S03 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(3, 'melhor');
  const p = W(3, 'pior');
  return (
    <>
      <Stage color="#2a2440" />
      {cam(t, t0, t1, [[0, 1.8, 7.2], [0, 1.5, 0]], [[0, 1.7, 6.4], [0, 1.5, 0]])}
      <Ch t={t} look={ELENCO.kaio.look} pose={{ y: 0.3 }} keys={[{ at: m, v: { lsz: 1.6, hy: -0.5 } }, { at: p, v: { lsz: 0.12, rsz: 1.6, hy: 0.5 } }]} faces={[{ at: t0, f: 'thinking' }, { at: m, f: 'smile' }, { at: p, f: 'worried', o: ['sweat'] }]} seed={2} />
      <UpArrow k={seg(t, m - 6 * F, m)} position={[-1.15, 1.2, 0]} scale={1.1} />
      <UpArrow k={seg(t, p - 6 * F, p)} color="#d23a3a" position={[1.15, 2.3, 0]} rotation={[0, 0, Math.PI]} scale={1.0} />
    </>
  );
};

// 4 — Rafael nasce com um milhão.
const S04 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(4, 'milhao');
  return (
    <>
      <Bercario />
      {cam(t, t0, t1, [[-0.6, 2.0, 4.2], [0, 1.3, 0]], [[0, 1.7, 3.0], [0.1, 1.45, 0]])}
      <Berco />
      <Baby t={t} position={[0, 1.1, 0]} face="happy" blanket="#9cc3e6" seed={4} />
      <PalmNumber t={t} at={m} text="1.000.000" position={[0.3, 1.8, 0.25]} w={0.9} />
      <Sparkles t={t} from={m} n={12} radius={0.7} center={[0.2, 1.7, 0.2]} size={0.13} />
    </>
  );
};

// 5 — Festa e jornal.
const S05 = ({ t, t0, t1 }: ShotProps) => {
  const fe = W(5, 'festa');
  const fo = W(5, 'fotografar');
  const flash = Math.max(0, 1 - Math.abs(t - fo) / 0.12);
  return (
    <>
      <Interior parede="#f3d9a0" placa="É UM MILHÃO!" placaBg="#c8452e" placaFg="#fff" />
      <Balloons t={t} position={[0, 0, -2.4]} />
      {cam(t, t0, t1, [[0, 1.9, 7.2], [0, 1.4, 0]], [[0.6, 1.8, 6.2], [0, 1.4, 0]])}
      <Ch t={t} look={PAI_RAFAEL} pose={{ x: -0.9, ry: 0.25 }} keys={[{ at: fe, v: { lsz: 2.4, rsz: 2.4, rel: 0.2, lel: 0.2 } }]} faces={[{ at: t0, f: 'smile' }, { at: fe, f: 'laugh' }]} seed={5} />
      <Ch t={t} look={MAE_RAFAEL} pose={{ x: 0.1, ry: 0, lsx: 1.1, rsx: 1.1, lel: -0.9, rel: -0.9 }} faces={[{ at: t0, f: 'bigSmile' }, { at: fo, f: 'starstruck' }]} seed={6} />
      <Baby t={t} position={[0.1, 1.25, 0.42]} blanket="#9cc3e6" scale={0.7} seed={4} />
      <Ch t={t} look={FOTOGRAFO} pose={{ x: 1.6, z: 0.6, ry: -0.7, rsx: 1.4, rel: -1.0 }} faces={[{ at: t0, f: 'curious' }, { at: fo, f: 'wink' }]} seed={7} right={<Camera flash={flash} rotation={[0, 0, 0]} />} />
      <Comic t={t} at={fo} text="FLASH!" position={[1.2, 2.7, 0.8]} size={0.4} />
      <Sparkles t={t} from={fe} n={10} radius={1.6} center={[0, 2.4, 0]} size={0.14} />
    </>
  );
};

// 6 — "vai mudar o mundo": Rafael criança com um globo girando acima.
const S06 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(6, 'mudar');
  const g = seg(t, m - 6 * F, m);
  return (
    <>
      <Stage color="#b8862f" />
      {cam(t, t0, t1, [[0, 1.6, 5.2], [0, 1.3, 0]], [[-0.4, 1.4, 4.4], [0, 1.4, 0]])}
      <Ch t={t} look={RAFAEL_KID} pose={{ y: 0.3 }} keys={[{ at: m, v: { lsz: 2.6, rsz: 2.6, lel: 0.2, rel: 0.2, hp: -0.25 } }]} faces={[{ at: t0, f: 'confident' }, { at: m, f: 'starstruck', o: ['sparkle'] }]} seed={8} />
      <group position={[0, 2.55, 0]} scale={g * 0.45} rotation={[0.3, t * 1.2, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial color="#3d8bfd" roughness={0.4} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[Math.cos(i * 1.6) * 0.8, (i - 1.5) * 0.35, Math.sin(i * 1.6) * 0.8]} scale={[0.45, 0.3, 0.35]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color="#4caf50" />
          </mesh>
        ))}
      </group>
      <Ch t={t} look={PAI_RAFAEL} pose={{ x: -1.3, z: -0.6, ry: 0.5, rsx: 1.2, rsz: 0.6 }} faces={[{ at: t0, f: 'confident' }]} seed={5} />
      <Ch t={t} look={MAE_RAFAEL} pose={{ x: 1.3, z: -0.6, ry: -0.5, lsx: 1.2, lsz: 0.6 }} faces={[{ at: t0, f: 'bigSmile' }]} seed={6} />
    </>
  );
};

// 7 — Nina, mesmo dia, número um.
const S07 = ({ t, t0, t1 }: ShotProps) => {
  const u = W(7, 'um');
  return (
    <>
      <Bercario />
      {cam(t, t0, t1, [[1.2, 2.2, 5.0], [0.6, 1.2, 0]], [[1.5, 1.7, 3.1], [1.3, 1.35, 0]])}
      <Berco position={[-1.0, 0, -0.4]} />
      <Baby t={t} position={[-1.0, 1.1, -0.4]} blanket="#9cc3e6" seed={4} />
      <PalmNumber t={t} at={t0} text="1.000.000" position={[-0.7, 1.8, -0.15]} w={0.9} />
      <Berco position={[1.3, 0, 0]} />
      <Baby t={t} position={[1.3, 1.1, 0]} face="curious" blanket="#f2b8c6" seed={9} />
      <PalmNumber t={t} at={u} text="1" color="#e9e3d6" position={[1.6, 1.75, 0.25]} w={0.4} />
    </>
  );
};

// 8 — "Um só." Close no 1, câmera empurra.
const S08 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Bercario />
    {cam(t, t0, t1, [[1.5, 1.6, 2.0], [1.4, 1.5, 0]], [[1.55, 1.7, 1.4], [1.5, 1.6, 0]])}
    <Berco position={[1.3, 0, 0]} />
    <Baby t={t} position={[1.3, 1.1, 0]} face="curious" blanket="#f2b8c6" seed={9} />
    <PalmNumber t={t} at={t0 - 1} text="1" color="#e9e3d6" position={[1.6, 1.75, 0.25]} w={0.4} />
  </>
);

// 9 — A mãe esconde a mãozinha quando chega visita.
const S09 = ({ t, t0, t1 }: ShotProps) => {
  const f = W(9, 'fechava');
  const v = W(9, 'visita');
  const walk = clamp01((t - t0) / (v - t0));
  return (
    <>
      <Interior parede="#c58a5a" piso="#8a6a4a" />
      <Box3 p={[2.4, 1.3, -2.8]} s={[1.2, 2.6, 0.1]} c="#5a3a22" />
      {cam(t, t0, t1, [[-0.6, 1.8, 6.4], [0.4, 1.3, 0]], [[-0.2, 1.7, 5.6], [0.5, 1.3, 0]])}
      <Ch t={t} look={MAE_NINA} pose={{ x: -0.5, ry: 0.4, lsx: 1.1, rsx: 1.1, lel: -0.9, rel: -0.9 }} keys={[{ at: f, v: { ry: -0.3, hp: 0.15 } }]} faces={[{ at: t0, f: 'content' }, { at: f, f: 'worried' }]} seed={10} />
      <Baby t={t} position={[-0.35 + (t > f ? -0.1 : 0), 1.25, 0.4]} blanket="#f2b8c6" scale={0.7} seed={9} />
      {t < f && <PalmNumber t={t} at={t0} text="1" color="#e9e3d6" position={[-0.1, 1.75, 0.6]} w={0.3} />}
      <Ch t={t} look={ELENCO.zuza.look} pose={{ x: 2.6 - walk * 0.9, z: -1.6 + walk * 0.9, ry: -0.9, walk: walk * 6, stride: walk < 1 ? 1 : 0 }} faces={[{ at: t0, f: 'smile' }, { at: v, f: 'curious' }]} seed={11} />
    </>
  );
};
const Box3 = ({ p, s, c }: { p: V3; s: V3; c: string }) => (
  <mesh position={p} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} />
  </mesh>
);

// 10 — Escola: a menina do um.
const Escola = () => (
  <>
    <Interior parede="#3f7a5a" piso="#d8c2a0" placa="ESCOLA" />
    <Box3 p={[0, 2.2, -2.8]} s={[4, 1.6, 0.06]} c="#24382e" />
  </>
);
const S10 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(10, 'menina');
  return (
    <>
      <Escola />
      {cam(t, t0, t1, [[0, 1.6, 6.0], [0, 1.0, 0]], [[0.3, 1.4, 5.0], [0, 1.0, 0]])}
      <Desk position={[0, 0, 0.4]} />
      <Ch t={t} look={NINA_KID} pose={{ z: -0.1 }} keys={[{ at: m, v: { rsx: 1.6, rsz: 0.3 } }]} faces={[{ at: t0, f: 'smile' }, { at: m, f: 'unsure' }]} seed={12} />
      <PalmNumber t={t} at={m} text="1" color="#e9e3d6" position={[-0.35, 1.8, 0.6]} w={0.5} />
      {KIDS.slice(0, 3).map((k, i) => (
        <Ch key={i} t={t} look={k} pose={{ x: [-1.5, 1.5, 1.0][i], z: [0.2, 0.3, -1.2][i], ry: [0.6, -0.6, -0.3][i] }} keys={[{ at: m + 0.1 * i, v: i === 0 ? { rsx: 1.4, rsz: -0.2 } : { lsx: 1.4, lsz: -0.2 } }]} faces={[{ at: t0, f: 'curious' }, { at: m + 0.1 * i, f: 'laugh' }]} seed={13 + i} />
      ))}
    </>
  );
};

// 11 — Ninguém sentava com ela.
const S11 = ({ t, t0, t1 }: ShotProps) => {
  const n = W(11, 'ninguem');
  return (
    <>
      <Escola />
      {cam(t, t0, t1, [[2.0, 1.6, 5.4], [0.6, 0.9, 0]], [[2.4, 1.5, 4.6], [0.8, 0.9, 0]])}
      <Desk position={[1.4, 0, 0.4]} />
      <Ch t={t} look={NINA_KID} pose={{ x: 1.4, z: -0.1 }} keys={[{ at: n, v: { hp: 0.3 } }]} faces={[{ at: t0, f: 'unsure' }, { at: n, f: 'lookDown' }]} seed={12} />
      <Desk position={[-1.4, 0, -0.8]} />
      {KIDS.map((k, i) => (
        <Ch key={i} t={t} look={k} pose={{ x: -2.2 + (i % 2) * 1.3, z: -0.4 - Math.floor(i / 2) * 1.0, ry: 0.2 * (i % 2 ? -1 : 1) }} faces={[{ at: t0, f: 'laugh' }]} seed={20 + i} />
      ))}
    </>
  );
};

// 12 — "não ia fazer diferença": risadas, Nina chora.
const S12 = ({ t, t0, t1 }: ShotProps) => {
  const e = W(12, 'estudar');
  const d = W(12, 'diferenca');
  return (
    <>
      <Escola />
      {cam(t, t0, t1, [[0, 1.4, 4.4], [0, 1.1, 0]], [[0, 1.3, 3.4], [0, 1.15, 0]])}
      <Ch t={t} look={NINA_KID} pose={{}} keys={[{ at: d, v: { hp: 0.25, lsx: 0.5, rsx: 0.5, lel: -1.2, rel: -1.2 } }]} faces={[{ at: t0, f: 'unsure' }, { at: e, f: 'worried' }, { at: d, f: 'lookDown', o: ['tears'] }]} seed={12} />
      <Ch t={t} look={KIDS[1]} pose={{ x: -1.1, z: -0.6, ry: 0.4 }} keys={[{ at: e, v: { rsx: 1.4 } }]} faces={[{ at: t0, f: 'smug' }, { at: d, f: 'laugh' }]} seed={14} />
      <Ch t={t} look={KIDS[2]} pose={{ x: 1.1, z: -0.6, ry: -0.4 }} keys={[{ at: d, v: { lsx: 1.4 } }]} faces={[{ at: t0, f: 'grin' }, { at: d, f: 'laugh' }]} seed={15} />
      <Comic t={t} at={d} text="HAHA" position={[-0.9, 2.2, -0.4]} size={0.3} hold={2} />
    </>
  );
};

// 13 — Estudou mesmo assim: anos passando no calendário.
const S13 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(13, 'mesmo');
  return (
    <>
      <Interior parede="#2c3a5a" piso="#6b4a2e" luz={0.8} />
      {cam(t, t0, t1, [[0.6, 1.5, 4.2], [0.2, 1.0, 0]], [[0.9, 1.4, 3.6], [0.3, 1.0, 0]])}
      <Desk position={[0, 0, 0.4]} />
      <Book position={[0, 0.66, 0.45]} />
      <Ch t={t} look={NINA_KID} pose={{ z: -0.1, hp: 0.25, lsx: 0.6, rsx: 0.6, lel: -0.8, rel: -0.8 }} keys={[{ at: m, v: { hp: 0.05 } }]} faces={[{ at: t0, f: 'thinking' }, { at: m, f: 'confident' }]} seed={12} />
      <Calendar t={t} from={t0} at={m} pages={['1º ANO', '3º ANO', '6º ANO', '9º ANO', 'ENSINO MÉDIO', 'FORMADA!']} position={[0.75, 1.75, -0.4]} rotation={[0, -0.3, 0]} scale={0.55} />
    </>
  );
};

// 14 — Virou bombeira.
const S14 = ({ t, t0, t1 }: ShotProps) => {
  const b = W(14, 'bombeira');
  return (
    <>
      <Street placa="BOMBEIROS" parede="#e8d6c0" porta="#b3261e" />
      {cam(t, t0, t1, [[0, 1.2, 5.6], [0, 1.4, 0]], [[0.5, 1.3, 4.6], [0, 1.4, 0]])}
      <Ch t={t} look={NINA} pose={{}} keys={[{ at: b, v: { rsx: 2.6, rsz: 0.5, rel: -1.6, hp: -0.1 } }]} faces={[{ at: t0, f: 'content' }, { at: b, f: 'confident' }]} seed={16} />
      <Sparkles t={t} from={b} n={8} radius={1.0} center={[0, 1.6, 0.3]} />
    </>
  );
};

// 15 — Rafael, o mais rico do país.
const S15 = ({ t, t0, t1 }: ShotProps) => {
  const r = W(15, 'rico');
  return (
    <>
      <Stage color="#b8862f" />
      {cam(t, t0, t1, [[0.6, 1.8, 5.6], [0, 1.6, 0]], [[-0.4, 1.7, 5.0], [0, 1.6, 0]])}
      <Ch t={t} look={RAFAEL} pose={{ x: -0.4, y: 0.3, ry: 0.3 }} keys={[{ at: r, v: { lsz: 1.0, rsz: 1.0, lel: 1.4, rel: 1.4 } }]} faces={[{ at: t0, f: 'confident' }, { at: r, f: 'smug' }]} seed={17} />
      <LedCounter t={t} from={t0} at={r} value={9000000000} prefix="R$ " position={[0.2, 2.9, -0.4]} scale={0.6} />
      <MoneyStack n={12} symbol="R$" position={[0.75, 0, 0.4]} scale={1.4} />
      <MoneyStack n={8} symbol="R$" position={[1.15, 0, -0.1]} scale={1.4} />
    </>
  );
};

// 16 — Prédios baratos em todas as cidades.
const S16 = ({ t, t0, t1 }: ShotProps) => {
  const p = W(16, 'predios');
  const b = W(16, 'baratos');
  return (
    <>
      <Cidade t={t} />
      {cam(t, t0, t1, [[0, 1.5, 6.5], [0, 1.9, -1]], [[0, 2.2, 8.2], [0, 2.6, -2]])}
      <Ch t={t} look={RAFAEL} pose={{ x: -0.5, z: 1.5, ry: 0.3 }} keys={[{ at: p, v: { lsz: 2.4, lel: 0.2, hy: 0.4 } }, { at: b, v: { lsz: 0.12, rsx: 1.3, rel: -0.4, hy: 0 } }]} faces={[{ at: t0, f: 'confident' }, { at: b, f: 'grin' }]} seed={17} />
      <group position={[0.6, 0, 1.3]} scale={seg(t, b - 6 * F, b)}>
        <Sign text={'MORE BEM,\nPAGUE POUCO!'} w={1.6} h={0.8} position={[0, 1.9, 0]} bg="#c8452e" fg="#fff" />
        <Box3 p={[0, 0.75, -0.05]} s={[0.08, 1.5, 0.08]} c="#5a3a22" />
      </group>
    </>
  );
};

// 17 — Um milhão de pessoas compraram.
const S17 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(17, 'milhao');
  const looks = [ELENCO.paula.look, ELENCO.tonhao.look, ELENCO.nena.look, ELENCO.bento.look, ELENCO.kaio.look, ELENCO.gabi.look, ELENCO.tiao.look];
  return (
    <>
      <Cidade t={t} />
      {cam(t, t0, t1, [[0, 2.6, 8.5], [0, 1.6, 0]], [[0, 2.2, 7.4], [0, 1.6, 0]])}
      <LedCounter t={t} from={t0} at={m} value={1000000} position={[0, 3.3, 0]} scale={0.7} />
      {looks.map((k, i) => (
        <Ch key={i} t={t} look={k} pose={{ x: (i - 3) * 0.95, z: (i % 2) * -0.8, ry: -(i - 3) * 0.1 }} keys={[{ at: m + i * 0.05, v: { lsz: 2.5, rsz: 2.5, lel: 0.2, rel: 0.2 } }]} faces={[{ at: t0, f: 'smile' }, { at: m, f: 'bigSmile' }]} seed={30 + i} />
      ))}
    </>
  );
};

// 18 — Vinte anos depois, noite de chuva.
const S18 = ({ t, t0, t1 }: ShotProps) => {
  const d = W(18, 'depois');
  return (
    <>
      <Cidade t={t} noite />
      <Rain t={t} center={[0, 0, 2]} />
      {cam(t, t0, t1, [[0, 2.0, 9.0], [0, 2.6, -3]], [[0, 1.8, 7.6], [0, 3.0, -3]])}
      <Calendar t={t} from={t0} at={d} pages={['2026', '2030', '2035', '2040', '20 ANOS DEPOIS']} position={[0, 1.6, 3.4]} scale={0.8} />
    </>
  );
};

const falls = () => [W(19, 'desabou') - 0.25, W(20, 'segundo') - 0.25, W(21, 'terceiro') - 0.25];
// 19, 20, 21 — Os prédios desabam.
const S19 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Cidade t={t} noite falls={falls()} />
    <Rain t={t} center={[0, 0, 2]} />
    {cam(t, t0, t1, [[0, 3, 11], [0, 3.5, -4]], [[0.5, 2.8, 10], [0, 3.2, -4]])}
    <Comic t={t} at={W(19, 'desabou')} text="CRASH!" position={[0, 4.5, -2]} size={0.9} hold={1.2} />
  </>
);
const S20 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Cidade t={t} noite falls={falls()} />
    <Rain t={t} center={[-2, 0, 2]} />
    {cam(t, t0, t1, [[-1.5, 2.6, 8], [-3, 3.0, -4]], [[-1.8, 2.4, 7.2], [-3, 2.6, -4]])}
  </>
);
const S21 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Cidade t={t} noite falls={falls()} />
    <Rain t={t} center={[2, 0, 2]} />
    {cam(t, t0, t1, [[1.5, 2.6, 8], [3, 3.0, -4]], [[1.8, 2.4, 7.2], [3, 2.6, -4]])}
  </>
);

// 22 — Economizou no concreto.
const S22 = ({ t, t0, t1 }: ShotProps) => {
  const e = W(22, 'economizado');
  return (
    <>
      <Stage color="#4a1f24" pedestal={false} />
      <Rain t={t} n={90} area={6} center={[0, 0, 0]} />
      {cam(t, t0, t1, [[0.2, 1.5, 5.0], [0.2, 1.2, 0]], [[0.2, 1.4, 4.2], [0.2, 1.2, 0]])}
      <Ch t={t} look={RAFAEL} pose={{ x: -0.45, ry: 0.4 }} keys={[{ at: e, v: { lsx: 0.8, rsx: 0.8, lel: -1.6, rel: -1.6, lean: -0.1 } }]} faces={[{ at: t0, f: 'smug' }, { at: e, f: 'nervous', o: ['sweat3'] }]} seed={17} />
      <Saco position={[0.75, 0.6 + (1 - seg(t, e - 6 * F, e)) * 3, 0.1]} rotation={[0, -0.3, 0]} />
      <Puff t={t} at={e} position={[0.75, 0.05, 0.1]} color="#cfc6b4" />
    </>
  );
};

// 23 — Um milhão de vidas mudaram: o número do Rafael fica vermelho.
const S23 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(23, 'mudaram');
  return (
    <>
      <Stage color="#1c2440" pedestal={false} />
      <Rain t={t} n={110} area={7} />
      {cam(t, t0, t1, [[0, 1.8, 5.6], [0, 1.6, 0]], [[0, 1.9, 4.6], [0, 1.8, 0]])}
      <Ch t={t} look={RAFAEL} pose={PALMA} keys={[{ at: m, v: { hp: -0.2 } }]} faces={[{ at: t0, f: 'worried' }, { at: m, f: 'terrified', o: ['stress'] }]} seed={17} />
      <PalmNumber t={t} at={t0} text="1.000.000" color={t > m - 2 * F ? '#ff4a3a' : '#ffd23a'} position={[-0.4, 2.65, 0.5]} w={1.1} />
    </>
  );
};

// 24 — Do jeito errado.
const S24 = ({ t, t0, t1 }: ShotProps) => {
  const e = W(24, 'errado');
  return (
    <>
      <Stage color="#1c2440" pedestal={false} />
      <Rain t={t} n={110} area={7} />
      {cam(t, t0, t1, [[-0.3, 2.6, 3.4], [-0.4, 2.6, 0.5]], [[-0.35, 2.65, 2.9], [-0.4, 2.65, 0.5]])}
      <Ch t={t} look={RAFAEL} pose={{ ...PALMA, hp: -0.2 }} faces={[{ at: t0, f: 'terrified' }]} seed={17} />
      <PalmNumber t={t} at={t0 - 1} text="1.000.000" color="#ff4a3a" position={[-0.4, 2.65, 0.5]} w={1.1} />
      <Comic t={t} at={e} text="ERRADO" fill="#ff5a4a" position={[-0.4, 3.15, 0.7]} size={0.3} hold={1.5} />
    </>
  );
};

// 25 — Nina entra nos escombros com a lanterna.
const S25 = ({ t, t0, t1 }: ShotProps) => {
  const e = W(25, 'escombros');
  const walk = (t - t0) * 0.7;
  return (
    <>
      <Escombros t={t} />
      {cam(t, t0, t1, [[2.2, 2.2, 5.5], [0, 1.0, -walk]], [[1.8, 2.0, 4.6 - (t1 - t0) * 0.7], [0, 1.0, -(t1 - t0) * 0.7]])}
      <Ch t={t} look={NINA} pose={{ z: -walk, ry: Math.PI - 0.3, walk: walk / 0.24, stride: 1, rsx: 1.4, rel: -0.2 }} faces={[{ at: t0, f: 'confident' }, { at: e, f: 'worried' }]} seed={16} right={<Lanterna />} />
    </>
  );
};

// 26 — Sai com um bebê nos braços.
const S26 = ({ t, t0, t1 }: ShotProps) => {
  const b = W(26, 'bebe');
  const z = -3.5 + (t - t0) * 0.8;
  return (
    <>
      <Escombros t={t} />
      {cam(t, t0, t1, [[0.6, 1.6, z + 5.2], [0, 1.1, z]], [[0.3, 1.5, z + 4.4], [0, 1.15, z]])}
      <Ch t={t} look={NINA} pose={{ z, walk: (t - t0) * 0.8 / 0.24, stride: 1, lsx: 1.0, rsx: 1.0, lel: -1.1, rel: -1.1, hp: 0.15 }} faces={[{ at: t0, f: 'tired' }, { at: b, f: 'content' }]} seed={16} />
      <Baby t={t} position={[0, 1.15, z + 0.42]} blanket="#e9e3d6" scale={0.62} face="sleepy" seed={40} />
      <Sparkles t={t} from={b} n={6} radius={0.4} center={[0, 1.3, z + 0.5]} size={0.08} />
    </>
  );
};

// 27 — "Só um." O número da Nina brilha.
const S27 = ({ t, t0, t1 }: ShotProps) => {
  const u = W(27, 'um');
  return (
    <>
      <Escombros t={t} />
      {cam(t, t0, t1, [[0.3, 1.6, 3.6], [0.1, 1.5, 0]], [[0.2, 1.6, 3.1], [0.1, 1.5, 0]])}
      <Ch t={t} look={NINA} pose={{ lsx: 1.0, rsx: 1.0, lel: -1.1, rel: -1.1, hp: 0.15 }} faces={[{ at: t0, f: 'content' }, { at: u, f: 'closedSmile' }]} seed={16} />
      <Baby t={t} position={[0, 1.15, 0.42]} blanket="#e9e3d6" scale={0.62} face="sleepy" seed={40} />
      <PalmNumber t={t} at={u} text="1" position={[0.5, 2.05, 0.4]} w={0.4} />
      <Sparkles t={t} from={u} n={10} radius={0.5} center={[0.5, 2.05, 0.4]} size={0.1} />
    </>
  );
};

// 28 — O único resgate: entrega o bebê para a mãe.
const S28 = ({ t, t0, t1 }: ShotProps) => {
  const r = W(28, 'resgate');
  const k = seg(t, r - 8 * F, r);
  return (
    <>
      <Escombros t={t} />
      {cam(t, t0, t1, [[0, 1.6, 5.4], [0, 1.2, 0]], [[0.4, 1.5, 4.6], [0, 1.2, 0]])}
      <Ch t={t} look={NINA} pose={{ x: -0.7, ry: 0.9, lsx: 1.2, rsx: 1.2, lel: -0.6, rel: -0.6 }} faces={[{ at: t0, f: 'content' }, { at: r, f: 'happy' }]} seed={16} />
      <Ch t={t} look={MAE_BEBE} pose={{ x: 0.7, ry: -0.9, lsx: 1.1, rsx: 1.1, lel: -0.8, rel: -0.8 }} faces={[{ at: t0, f: 'worried', o: ['tears'] }, { at: r, f: 'happy', o: ['tears'] }]} seed={41} />
      <Baby t={t} position={[-0.2 + k * 0.6, 1.2, 0.3]} rotation={[0, 0.3, 0]} blanket="#e9e3d6" scale={0.62} face="sleepy" seed={40} />
    </>
  );
};

// 29 — Ela não voltou de lá.
const S29 = ({ t, t0, t1 }: ShotProps) => {
  const v = W(29, 'voltou');
  const walk = (t - t0) * 0.7;
  return (
    <>
      <Escombros t={t} />
      {cam(t, t0, t1, [[0, 1.6, 4.2], [0, 1.3, -1.5]], [[0, 1.8, 5.2], [0, 1.4, -2.5]])}
      {t < v + 0.4 && <Ch t={t} look={NINA} pose={{ z: -1 - walk, ry: Math.PI, walk: walk / 0.24, stride: 1, rsx: 1.4, rel: -0.2 }} faces={[{ at: t0, f: 'confident' }]} seed={16} right={<Lanterna />} />}
      <Puff t={t} at={v} n={14} position={[0, 0.6, -1 - (v - t0) * 0.7]} color="#8a857c" size={1.6} />
      <Puff t={t} at={v + 0.25} n={10} position={[0, 1.2, -1.3 - (v - t0) * 0.7]} color="#6f6a62" size={1.8} />
    </>
  );
};

// Velório.
const Velorio = () => (
  <>
    <Interior parede="#4a3a5a" piso="#3a2e2a" luz={0.75} />
    <Retrato text={'NINA\n♥\n1'} position={[0, 2.3, -2.7]} />
    <Flores position={[-1.0, 0, -2.4]} />
    <Flores position={[1.0, 0, -2.4]} />
    {Array.from({ length: 12 }, (_, i) => (
      <Chair key={i} position={[-1.65 + (i % 4) * 1.1, 0, 0.2 + Math.floor(i / 4) * 1.1]} rotation={[0, Math.PI, 0]} />
    ))}
  </>
);

// 30 — Quase ninguém apareceu.
const S30 = ({ t, t0, t1 }: ShotProps) => {
  const n = W(30, 'ninguem');
  return (
    <>
      <Velorio />
      {cam(t, t0, t1, [[0, 2.8, 8.0], [0, 1.2, -0.5]], [[0, 2.4, 6.8], [0, 1.3, -0.5]])}
      <Ch t={t} look={MAE_NINA} pose={{ x: -1.65, z: 1.1, ry: Math.PI, hp: 0.25 }} faces={[{ at: t0, f: 'worried', o: ['tears'] }]} seed={10} />
      <Ch t={t} look={ELENCO.zuza.look} pose={{ x: 1.65, z: 2.2, ry: Math.PI, hp: 0.2 }} keys={[{ at: n, v: { hy: 0.3 } }]} faces={[{ at: t0, f: 'tired' }]} seed={11} />
    </>
  );
};

// 31 — A mãe do bebê mostra a mãozinha.
const S31 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(31, 'maozinha');
  return (
    <>
      <Velorio />
      {cam(t, t0, t1, [[0.2, 1.7, 5.4], [0, 1.4, 0.8]], [[0.1, 1.7, 4.6], [0, 1.45, 0.8]])}
      <Ch t={t} look={MAE_BEBE} pose={{ z: 0.8, lsx: 1.1, rsx: 1.1, lel: -0.8, rel: -0.8 }} keys={[{ at: m, v: { rsx: 1.6, rel: -0.3 } }]} faces={[{ at: t0, f: 'worried' }, { at: m, f: 'content', o: ['tears'] }]} seed={41} />
      <Baby t={t} position={[0, 1.0, 1.3]} blanket="#e9e3d6" scale={0.62} face="happy" seed={40} />
      <PalmNumber t={t} at={m} text="?" position={[0.55, 1.15, 1.6]} w={0.35} />
    </>
  );
};

// 32 — O número dele era maior que o do Rafael.
const S32 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(32, 'maior');
  return (
    <>
      <Stage color="#2a2440" />
      {cam(t, t0, t1, [[0, 1.8, 5.6], [0, 1.8, 0]], [[0, 2.0, 4.8], [0, 2.0, 0]])}
      <Baby t={t} position={[0, 0.88, 0]} blanket="#e9e3d6" face="happy" seed={40} />
      <LedCounter t={t} from={t0} at={m} value={10000000} suffix="+" position={[0, 2.5, 0]} scale={0.6} />
      <Sign text="RAFAEL: 1.000.000" w={1.4} h={0.3} position={[0, 1.95, 0.1]} bg="#3a2e2a" fg="#ff8a7a" />
      <Sparkles t={t} from={m} n={14} radius={1.2} center={[0, 2.4, 0.2]} />
    </>
  );
};

// 33 — O número nunca errou: retrato da Nina e o 1 brilhando.
const S33 = ({ t, t0, t1 }: ShotProps) => {
  const e = W(33, 'errou');
  return (
    <>
      <Velorio />
      {cam(t, t0, t1, [[0, 2.3, 2.6], [0, 2.3, -2.7]], [[0, 2.3, 1.8], [0, 2.3, -2.7]])}
      <PalmNumber t={t} at={e} text="1" position={[0.85, 2.9, -2.4]} w={0.4} />
      <Sparkles t={t} from={e} n={10} radius={0.9} center={[0, 2.3, -2.4]} size={0.12} />
    </>
  );
};

// 34 — Ele só nunca disse como. Volta ao berçário (loop).
const S34 = ({ t, t0, t1 }: ShotProps) => {
  const c = W(34, 'como');
  return (
    <>
      <Bercario />
      {cam(t, t0, t1, [[0, 1.6, 2.6], [0, 1.25, 0]], [[0, 2.6, 5.5], [0, 1.1, 0]])}
      <Berco />
      <Baby t={t} position={[0, 1.1, 0]} face="happy" blanket="#c9b6e4" />
      <PalmNumber t={t} at={c} text="?" position={[0.35, 1.75, 0.2]} w={0.6} />
    </>
  );
};

const LIST = [S00, S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28, S29, S30, S31, S32, S33, S34];
export const SHOTS: Shot[] = LIST.map((C, i) => ({ from: i === 0 ? 0 : W(i, 0), name: `${String(i).padStart(2, '0')}`, C }));
