import { JSX } from 'react';
import { seg, track, V3 } from './anim';
import { Character, faceAt, FaceKey, Pose, REST } from './Character';
import {
  Adesivo, Aspirador, Bandeja, CARTEIRO, Cachorro, Cartela, CHAMINES, FARMA, Fechado, MaquinaCafe, Manchas, NOIVA,
  PADEIRO, Pote, poteItem, POVO, RisoChuva, RisoFluxo, Riso, Teia, Telhados, TITA, VOVO, Xicara,
} from './historia';
import { Calendar, CoinBurst, Comic, Magnifier, MoneyStack, Puff, Sign, Sparkles, Tag } from './props';
import { Box, Cam, Room, Stage, Street, Warehouse } from './sets';
import { F, W } from './timeline';
import { useMemo } from 'react';

// ============================================================================
// "ADESIVOS" — tomadas do filme (ver STORYBOARD.md). Tudo ancorado em palavras com W(linha, 'palavra').
// ============================================================================

export type ShotProps = { t: number; t0: number; t1: number };
export type Shot = { from: number; name: string; C: (p: ShotProps) => JSX.Element };

export const SFX: { at: number; file: string; vol: number }[] = [];

const P = (o: Partial<Pose> = {}): Pose => ({ ...REST, ...o });
const fa = (t: number, keys: FaceKey[], seed: number) => faceAt(t, keys, seed);
const FARMACIA = { placa: 'FARMÁCIA', porta: '#2f7a5a' };

// Gente parada de adesivo (rosto sério por baixo).
const Povo = ({ t, list }: { t: number; list: { x: number; z: number; ry: number; i: number; f?: FaceKey['f']; hy?: number }[] }) => (
  <>
    {list.map((p) => (
      <Character key={`${p.i}${p.x}`} pose={P({ x: p.x, z: p.z, ry: p.ry, hy: p.hy ?? 0 })} face={fa(t, [{ at: 0, f: p.f ?? 'neutral' }], p.i + 10)} look={POVO[p.i % POVO.length]} head={<Adesivo rot={(p.i % 3) * 0.08 - 0.08} />} />
    ))}
  </>
);

// 1. "Nesta cidade, ninguém sabe *sorrir*."
const S01 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(0, 'sorrir');
  return (
    <>
      <Street {...FARMACIA} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 4.6, 11], [0, 2.2, -1]], [k, [0, 1.8, 6.6], [0, 1.3, 0]], [t1, [0.3, 1.7, 6.0], [0, 1.3, 0]]]} />
      <Povo t={t} list={[{ x: -1.15, z: 0.3, ry: 0.25, i: 0 }, { x: 0, z: -0.5, ry: 0, i: 2 }, { x: 1.15, z: 0.4, ry: -0.25, i: 3 }]} />
    </>
  );
};

// 2. "Sorriso se compra na *farmácia*, em adesivo."
const S02 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(1, 'farmacia');
  const a = W(1, 'adesivo');
  const pose = track(t, P({ x: -0.35, y: 0.75, z: -0.95, ry: 0.15 }), [{ at: a, v: { lsz: 1.1, lel: 0.2, hy: 0.35 } }]);
  return (
    <>
      <Room placa="FARMÁCIA" parede="#2f6a5a" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 2.3, 5.2], [0.1, 2.0, -0.6]], [k, [0.4, 2.2, 4.4], [0.15, 2.0, -0.6]], [t1, [0.2, 2.1, 4.0], [0.2, 1.9, -0.6]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'smile' }, { at: a, f: 'smug' }], 1)} look={FARMA} />
      <Cartela position={[0.75, 1.48, -0.15]} scale={0.6} />
      <Tag text="R$ 5" position={[0.75, 2.05, -0.1]} scale={1.1} />
    </>
  );
};

// 3. "O carteiro usa um *torto*."
const S03 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(2, 'torto');
  const pose = track(t, P({ ry: -0.15 }), [{ at: k, v: { hr: 0.18 } }]);
  return (
    <>
      <Street placa="CORREIO" parede="#f0d9c0" porta="#2f5fa8" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.8, 1.7, 3.6], [0, 1.45, 0]], [t1, [0.3, 1.65, 3.0], [0, 1.5, 0]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'neutral' }, { at: k, f: 'unsure' }], 2)} look={CARTEIRO} head={<Adesivo rot={0.5} />} />
    </>
  );
};

// 4. "A noiva comprou o tamanho *errado*."
const S04 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(3, 'errado');
  const s = seg(t, k - 6 * F, k, (x) => x);
  return (
    <>
      <Street placa="IGREJA" parede="#f3eadf" porta="#7a4a2a" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.7, 1.7, 3.7], [0.1, 1.5, 0]], [t1, [-0.3, 1.65, 3.1], [0.15, 1.55, 0]]]} />
      <Character pose={P({ ry: 0.15 })} face={fa(t, [{ at: t0, f: 'neutral' }, { at: k, f: 'worried', o: ['sweat'] }], 3)} look={NOIVA} head={<Adesivo s={1.9} />} />
      {s > 0 && <Tag text="GG" position={[0.62, 1.9, 0.3]} scale={1.4 * s} />}
    </>
  );
};

// 5. "Até o *cachorro* tem um."
const S05 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Street {...FARMACIA} />
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.9, 1.0, 3.0], [0, 0.8, 0.4]], [t1, [0.4, 0.95, 2.5], [0, 0.8, 0.4]]]} />
    <Cachorro t={t} position={[0, 0, 0.3]} rotation={[0, 0.3, 0]} />
  </>
);

// 6. "A vovó cola o dela de *cabeça* pra baixo, e ninguém nota."
const S06 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(5, 'cabeca');
  const n = W(5, 'ninguem');
  const vo = track(t, P({ x: -0.4, ry: 0.15 }), [{ at: k, v: { rsx: 1.3, rsz: 0.3, rel: -1.3 } }]);
  const be = track(t, P({ x: 0.8, z: -0.2, ry: -0.35, hy: -0.2 }), [{ at: n + 0.3, v: { hp: 0.2 } }, { at: n + 0.6, v: { hp: 0 } }]);
  return (
    <>
      <Street {...FARMACIA} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.3, 1.5, 3.0], [-0.4, 1.4, 0]], [n - 0.1, [-0.3, 1.5, 2.8], [-0.4, 1.4, 0]], [n + 0.5, [0.2, 1.6, 4.9], [0.2, 1.3, 0]], [t1, [0.3, 1.6, 4.6], [0.2, 1.3, 0]]]} />
      <Character pose={vo} face={fa(t, [{ at: t0, f: 'content' }, { at: k, f: 'confident' }], 4)} look={VOVO} head={<Adesivo flip />} />
      <Character pose={be} face={fa(t, [{ at: t0, f: 'neutral' }], 5)} look={POVO[0]} head={<Adesivo />} />
    </>
  );
};

// 7. "Todo dia, a *fila* da farmácia dá a volta no quarteirão."
const S07 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(6, 'fila');
  const fila = useMemo(() => Array.from({ length: 9 }, (_, i) => ({ x: 1.7 + i * 0.85, z: -1.5 + (i % 2) * 0.12, ry: -Math.PI / 2 + 0.15, i, hy: 0 })), []);
  return (
    <>
      <Street {...FARMACIA} />
      <Calendar t={t} from={t0} at={k} pages={['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'TODO\nDIA']} position={[-1.05, 2.3, -3.7]} scale={0.8} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.0, 2.25, -0.9], [-1.05, 2.25, -3.7]], [k, [-0.95, 2.25, -1.3], [-1.05, 2.25, -3.7]], [k + 0.5, [-1.6, 2.3, 4.6], [2.6, 1.2, -1.5]], [t1, [-1.2, 2.2, 4.2], [2.8, 1.2, -1.5]]]} />
      <Povo t={t} list={fila} />
    </>
  );
};

// 8. "Eu sou a *Tita*, e tenho *alergia* a cola."
const S08 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(7, 'tita');
  const a = W(7, 'alergia');
  const pose = track(t, P({ ry: 0.1 }), [{ at: k, v: { lsz: 2.5, lel: 0.5, hr: -0.1 } }, { at: a, v: { lsz: 0.12, lel: 0.15, hr: 0, rsx: 0.6, rel: -1.8, rsz: 0.6, hp: 0.1 } }]);
  return (
    <>
      <Street placa="PADARIA" parede="#f2e1c8" porta="#8a4a2a" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.5, 1.65, 3.6], [0, 1.45, 0]], [a, [0.2, 1.65, 3.2], [0, 1.5, 0]], [t1, [0.1, 1.65, 2.8], [0, 1.55, 0]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'smile' }, { at: k, f: 'bigSmile' }, { at: a, f: 'sick', o: ['blush'] }], 6)} look={TITA} head={t > a - 3 * F ? <Manchas k={seg(t, a - 3 * F, a + 3 * F)} /> : null} />
      <Comic t={t} at={a + 0.1} text="COÇA!" position={[0.55, 2.3, 0.3]} size={0.25} />
    </>
  );
};

// 9. "Um dia, sem adesivo, eu *ri* de verdade."
const S09 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(8, 'ri');
  const pose = track(t, P({ ry: -0.1 }), [{ at: k, v: { lsz: 1.9, rsz: 1.9, lel: 0.4, rel: 0.4, hp: -0.2 } }]);
  return (
    <>
      <Street {...FARMACIA} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.9, 1.5, 3.8], [0, 1.45, 0]], [k, [-0.3, 1.6, 3.4], [0, 1.5, 0]], [t1, [0, 1.6, 3.0], [0, 1.55, 0]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'curious' }, { at: k, f: 'laugh', o: ['sparkle'] }], 7)} look={TITA} />
      <Sparkles t={t} from={k} n={10} radius={0.85} center={[0, 1.7, 0.2]} />
      <Comic t={t} at={k} text="HAHA!" position={[0.45, 2.45, 0.3]} size={0.3} hold={1.2} />
    </>
  );
};

// 10. "A rua *parou*."
const S10 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(9, 'parou');
  const turn = seg(t, k - 9 * F, k - 4 * F);
  const ring = [
    { x: -1.6, z: -1.0, ry: 0.9 }, { x: 1.6, z: -1.0, ry: -0.9 }, { x: -1.9, z: 1.0, ry: 2.0 }, { x: 1.9, z: 0.9, ry: -2.0 }, { x: 0, z: -2.0, ry: 0 },
  ];
  return (
    <>
      <Street {...FARMACIA} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 5.0, 7.0], [0, 1.0, 0]], [t1, [0.5, 4.2, 6.2], [0, 1.0, 0]]]} />
      <Character pose={P({ ry: 0.2, lsz: 1.9, rsz: 1.9, lel: 0.4, rel: 0.4 })} face={fa(t, [{ at: t0, f: 'laugh' }], 8)} look={TITA} />
      {ring.map((r, i) => (
        <Character key={i} pose={P({ x: r.x, z: r.z, ry: r.ry * turn + (1 - turn) * (r.ry + 1.4) })} face={fa(t, [{ at: t0, f: 'neutral' }, { at: k, f: 'shocked' }], 20 + i)} look={POVO[(i + 2) % POVO.length]} head={<Adesivo />} />
      ))}
    </>
  );
};

// 11. "O padeiro derrubou a *bandeja*."
const S11 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(9, 'bandeja');
  const pose = track(t, P({ lsx: 1.15, rsx: 1.15, lsz: 0.25, rsz: 0.25, lel: -0.25, rel: -0.25 }), [{ at: k, v: { lsx: 0, rsx: 0, lsz: 1.3, rsz: 1.3, lel: 0.3, rel: 0.3, hp: 0.15 }, lead: 0 }]);
  return (
    <>
      <Street placa="PADARIA" parede="#f2e1c8" porta="#8a4a2a" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 1.7, 4.4], [0, 1.25, 0.3]], [t1, [0.2, 1.5, 3.8], [0, 1.1, 0.3]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'surprised' }, { at: k, f: 'shocked', o: ['sweat'] }], 9)} look={PADEIRO} head={<Adesivo rot={-0.15} />} />
      <Bandeja t={t} drop={k} y0={1.06} position={[0, 0, 0.62]} />
      <Comic t={t} at={k + 0.25} text="PLOFT!" position={[0.4, 0.7, 1.0]} size={0.3} />
    </>
  );
};

// 12. "Então comecei a *reparar*."
const S12 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(10, 'reparar');
  const pose = track(t, P({ ry: 0.2 }), [{ at: k, v: { rsx: 1.25, rsz: 0.35, rel: -1.0, hy: -0.1 } }]);
  return (
    <>
      <Street {...FARMACIA} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.6, 1.65, 3.4], [0, 1.5, 0]], [t1, [-0.3, 1.65, 2.8], [0, 1.55, 0]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'thinking' }, { at: k, f: 'suspicious' }], 11)} look={TITA} right={<Magnifier rotation={[0, 0, 0]} />} />
    </>
  );
};

// 13. "O farmacêutico era o único *sem* adesivo."
const S13 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(11, 'sem');
  const pose = track(t, P({ x: -0.1, y: 0.75, z: -0.95 }), [{ at: k, v: { hy: 0.25, hr: 0.08 } }]);
  return (
    <>
      <Room placa="FARMÁCIA" parede="#2f6a5a" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 2.4, 5.4], [0, 2.1, -0.9]], [t1, [0.1, 2.3, 3.6], [0, 2.15, -0.9]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'neutral' }, { at: k, f: 'smug' }], 12)} look={FARMA} />
      <Cartela position={[0.95, 1.48, -0.15]} scale={0.6} />
      <Comic t={t} at={k} text="?!" position={[0.65, 2.7, -0.5]} size={0.3} hold={1.0} />
    </>
  );
};

// 14. "Cada adesivo tinha o *nome* de alguém."
const S14 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(12, 'nome');
  return (
    <>
      <Room placa="FARMÁCIA" parede="#2f6a5a" balcao={false} />
      <Cartela position={[0, 1.9, -2.78]} scale={1} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.2, 1.9, 0.0], [0, 1.9, -2.78]], [k - 0.1, [0.1, 1.9, -0.6], [0, 1.9, -2.78]], [k + 0.4, [-0.42, 1.92, -1.75], [-0.48, 1.92, -2.78]], [t1, [-0.45, 1.92, -1.9], [-0.48, 1.92, -2.78]]]} />
    </>
  );
};

// 15. "E todo mundo ficava *sério* depois do café da praça."
const S15 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(13, 'serio');
  const pose = track(t, P({ x: -0.45, ry: 0.35, rsx: 0.9, rel: -1.1, rsz: 0.2 }), [{ at: k, v: { rsx: 0.3, rel: -0.4 } }]);
  return (
    <>
      <Street {...FARMACIA} />
      <MaquinaCafe position={[0.85, 0, -0.7]} rotation={[0, -0.35, 0]} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.2, 1.7, 4.4], [0.2, 1.3, -0.2]], [t1, [0.4, 1.6, 3.9], [0.2, 1.3, -0.2]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'happy' }, { at: k, f: 'deadpan' }], 13)} look={CARTEIRO} right={<Xicara position={[0, -0.12, 0.04]} />} />
      <RisoFluxo t={t} a={k - 0.45} b={k + 0.1} from={[-0.35, 1.45, 0.45]} to={[0.85, 1.95, -0.9]} n={5} arc={0.5} />
    </>
  );
};

// 16. "Naquela *noite*, segui ele até o porão."
const S16 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(14, 'noite');
  const x = -2.2 + 3.2 * seg(t, t0, t1, (v) => v);
  const pose = P({ x, z: 0.3, ry: Math.PI / 2, walk: (x + 2.2) / 0.24, stride: 1 });
  const ti = P({ x: -2.9 + 1.2 * seg(t, t0 + 0.6, t1, (v) => v), z: -0.9, ry: Math.PI / 2 - 0.3, walk: (1.2 * seg(t, t0 + 0.6, t1, (v) => v)) / 0.24, stride: t > t0 + 0.6 ? 1 : 0 });
  return (
    <>
      <Street {...FARMACIA} noite />
      <Box p={[1.7, 0.02, 0.5]} s={[1.0, 0.04, 0.8]} c="#1a1410" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.6, 1.8, 5.6], [-1.4, 1.2, 0]], [k, [-1.0, 1.8, 5.6], [-0.9, 1.2, 0]], [t1, [0.6, 1.8, 5.6], [0.4, 1.2, 0]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'sideEye' }], 14)} look={FARMA} />
      <Character pose={ti} face={fa(t, [{ at: t0, f: 'suspicious', o: ['sweat'] }], 15)} look={TITA} />
    </>
  );
};

// Porão: aspirador à esquerda, farmacêutico e Tita frente a frente.
const ASP: V3 = [-2.2, 0, 0.4];
const NOZ: V3 = [1.766, 1.1, 1.453];
const NROT: V3 = [0, -0.77, Math.PI / 2];
const NOZ_W: V3 = [ASP[0] + NOZ[0], NOZ[1], ASP[2] + NOZ[2]];
const Porao = () => {
  const item = useMemo(() => poteItem(), []);
  return <Warehouse levels={9} item={item} />;
};

// 17. "Lá dentro, um *aspirador* gigante, ligado na máquina de café."
const S17 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(15, 'aspirador');
  const m = W(15, 'maquina');
  return (
    <>
      <Porao />
      <Aspirador t={t} from={999} at={1000} position={[0, 0, 0.6]} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 0.7, 5.6], [0, 1.4, 0.6]], [k, [0.6, 1.0, 5.4], [0, 1.6, 0.6]], [m, [1.3, 2.4, 6.4], [-0.1, 2.6, 0.4]], [t1, [1.0, 2.6, 6.0], [-0.2, 2.9, 0.4]]]} />
    </>
  );
};

// 18. "Milhares de *potes*, cada um com uma risada presa."
const S18 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Porao />
    <Box p={[0, 0.88, 0.3]} s={[2.0, 0.06, 0.55]} c="#9a6b3e" />
    <Box p={[0, 0.43, 0.3]} s={[1.9, 0.84, 0.5]} c="#6b4426" />
    {['TITA', 'VOVÓ', 'NOIVA', 'PADEIRO', 'CARTEIRO'].map((n, i) => (
      <Pote key={n} t={t} seed={i} nome={n} position={[-0.72 + i * 0.36, 0.91, 0.3 + (i % 2) * 0.05]} scale={0.95} />
    ))}
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.9, 1.6, 2.6], [0, 1.1, 0.3]], [t1, [-0.5, 1.45, 2.2], [-0.1, 1.1, 0.3]]]} />
  </>
);

// 19. "Ele roubava os sorrisos de *manhã*, e vendia de volta à *tarde*."
const S19 = ({ t, t0, t1 }: ShotProps) => {
  const m = W(17, 'manha');
  const ta = W(17, 'tarde');
  const pose = track(t, P({ x: -1.15, ry: 0.45 }), [{ at: m, v: { lsz: 1.1, lel: 0.2, hy: 0.35 } }, { at: ta, v: { lsz: 2.4, rsz: 2.4, lel: 0.4, rel: 0.4, hy: 0 } }]);
  return (
    <>
      <Stage color="#4a3a66" />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 2.0, 5.6], [-0.4, 1.5, 0]], [t1, [-0.1, 1.9, 5.0], [-0.4, 1.55, 0]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'smug' }, { at: m, f: 'sideEye' }, { at: ta, f: 'grin' }], 16)} look={FARMA} />
      {t < ta - 2 * F && <Pote t={t} seed={3} position={[0, 0.3, 0]} scale={1.8} />}
      {t >= ta - 2 * F && <MoneyStack n={8} symbol="R$" position={[0, 0.3, 0]} scale={1.8} />}
      <CoinBurst t={t} at={ta} n={8} position={[0, 0.8, 0.2]} />
      <Sign text={t < ta - 2 * F ? 'MANHÃ: ROUBA' : 'TARDE: VENDE'} w={1.9} h={0.45} position={[-0.4, 2.85, -0.6]} bg={t < ta - 2 * F ? '#2f5fa8' : '#d2702d'} fg="#ffffff" />
    </>
  );
};

// 20. "Ele apontou o aspirador pra mim." — farmacêutico com a mangueira
const HOLD = { lsx: 1.45, rsx: 1.45, lsz: 0.3, rsz: 0.3, lel: 0.05, rel: 0.05 };
const FARMA_P = { x: -0.9, z: 1.4, ry: 0.8 };
const TITA_P = { x: 0.9, z: 1.4, ry: -0.8 };
const S20 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(18, 'apontou');
  const pose = track(t, P({ ...FARMA_P }), [{ at: k, v: { ...HOLD, hp: -0.05 } }]);
  return (
    <>
      <Porao />
      <Aspirador t={t} from={999} at={1000} position={ASP} nozzle={NOZ} nozzleRot={NROT} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.9, 2.2, 3.3], [-0.7, 1.85, 1.5]], [t1, [1.6, 2.15, 3.0], [-0.7, 1.85, 1.5]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'confident' }, { at: k, f: 'furious' }], 17)} look={FARMA} />
    </>
  );
};

// 21. "...pra *mim*." — Tita apavorada
const S21 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Porao />
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.3, 1.75, 4.0], [0.85, 1.55, 1.5]], [t1, [-1.0, 1.75, 3.6], [0.85, 1.6, 1.5]]]} />
    <Character pose={P({ ...TITA_P, lsz: 0.7, rsz: 0.7, lel: 1.2, rel: 1.2, squash: 0.1 })} face={fa(t, [{ at: t0, f: 'terrified', o: ['sweat3'] }], 18)} look={TITA} />
  </>
);

// 22. "Eu ri a maior *gargalhada* da minha vida."
const S22 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(19, 'gargalhada');
  const ti = track(t, P({ ...TITA_P, lsz: 0.7, rsz: 0.7, lel: 1.2, rel: 1.2 }), [{ at: k, v: { lsz: 2.1, rsz: 2.1, lel: 0.3, rel: 0.3, hp: -0.25 } }]);
  return (
    <>
      <Porao />
      <Aspirador t={t} from={999} at={1000} position={ASP} nozzle={NOZ} nozzleRot={NROT} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 1.8, 6.4], [0, 1.35, 1.4]], [t1, [0, 1.8, 5.6], [0, 1.4, 1.4]]]} />
      <Character pose={P({ ...FARMA_P, ...HOLD })} face={fa(t, [{ at: t0, f: 'furious' }, { at: k + 0.4, f: 'surprised' }], 19)} look={FARMA} />
      <Character pose={ti} face={fa(t, [{ at: t0, f: 'nervous' }, { at: k, f: 'laugh', o: ['sparkle'] }], 20)} look={TITA} />
      <RisoFluxo t={t} a={k - 0.1} b={t1 + 1} from={[0.55, 1.5, 1.75]} to={NOZ_W} n={14} arc={0.25} />
      <Comic t={t} at={k} text="HAHAHA!" position={[1.0, 2.6, 1.6]} size={0.32} hold={1.5} />
    </>
  );
};

// 23. "O aspirador engoliu, engasgou, e *explodiu*."
const S23 = ({ t, t0, t1 }: ShotProps) => {
  const en = W(20, 'engoliu');
  const eg = W(20, 'engasgou');
  const ex = W(20, 'explodiu');
  const gone = t >= ex;
  const fp = track(t, P({ ...FARMA_P, ...HOLD }), [{ at: ex, v: { lean: -0.35, lsx: 0, rsx: 0, lsz: 1.6, rsz: 1.6, z: 2.0 }, lead: 0, dur: 4 }]);
  return (
    <>
      <Porao />
      <Aspirador t={t} from={t0} at={ex} position={ASP} nozzle={NOZ} nozzleRot={NROT} inflate={seg(t, en, eg)} shake={seg(t, eg - 0.1, eg + 0.1)} gone={gone} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.4, 2.3, 7.6], [-1.0, 1.5, 0.6]], [ex, [0.2, 2.4, 8.4], [-1.0, 1.7, 0.6]], [t1, [0.2, 2.6, 9.0], [-1.0, 2.0, 0.6]]]} />
      <Character pose={fp} face={fa(t, [{ at: t0, f: 'surprised' }, { at: eg, f: 'panic' }, { at: ex, f: 'dizzy' }], 21)} look={FARMA} />
      <Character pose={P({ ...TITA_P, lsz: 2.1, rsz: 2.1, lel: 0.3, rel: 0.3 })} face={fa(t, [{ at: t0, f: 'laugh' }, { at: ex, f: 'shocked' }], 22)} look={TITA} />
      {!gone && <RisoFluxo t={t} a={t0 - 0.5} b={en + 0.2} from={[0.55, 1.5, 1.75]} to={NOZ_W} n={6} arc={0.25} />}
      <Puff t={t} at={ex} n={14} position={[ASP[0], 1.2, ASP[2]]} size={1.4} color="#e8e1d0" />
      <RisoChuva t={t} at={ex} n={40} center={[ASP[0], 1.4, ASP[2]]} spread={3.2} up={4} />
      <Comic t={t} at={ex} text="BUM!" position={[-1.6, 3.2, 1.0]} size={0.6} hold={1.4} />
    </>
  );
};

// 24. "As risadas voaram pelas *chaminés*,"
const S24 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(21, 'chamines');
  return (
    <>
      <Telhados />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 2.6, 11], [0, 3.6, -3]], [t1, [0, 4.0, 9.5], [0, 5.2, -3.5]]]} />
      {CHAMINES.map((c, i) => (
        <RisoChuva key={i} t={t} at={t0 + 0.1 + i * 0.12} n={9} center={c} spread={1.4} up={5} />
      ))}
      <Sparkles t={t} from={k} n={12} radius={4} center={[0, 6, -3]} size={0.3} />
    </>
  );
};

// 25. "e cada um pegou a *sua*." — a vovó pega a dela
const S25 = ({ t, t0, t1 }: ShotProps) => {
  const c = W(21, 'cada');
  const pg = W(21, 'pegou');
  const got = t >= pg;
  const k = seg(t, c - 0.2, pg, (v) => v);
  const pose = track(t, P({ ry: 0.1, hp: -0.15 }), [{ at: pg, v: { lsz: 1.8, rsz: 1.8, lel: 0.4, rel: 0.4, hp: -0.1 } }]);
  return (
    <>
      <Street {...FARMACIA} noite />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.4, 1.6, 3.4], [0, 1.6, 0]], [t1, [0.2, 1.55, 3.0], [0, 1.5, 0]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'lookUp' }, { at: pg, f: 'laugh', o: ['tears'] }], 23)} look={VOVO} head={got ? null : <Adesivo flip />} />
      {!got && <Riso position={[0.1 * (1 - k), 3.2 - 1.75 * k, 0.2 + 0.25 * k]} s={1.3} />}
      <Sparkles t={t} from={pg} n={10} radius={0.7} center={[0, 1.55, 0.2]} />
    </>
  );
};

// 26. "De manhã, a fila da farmácia estava *vazia*."
const S26 = ({ t, t0, t1 }: ShotProps) => (
  <>
    <Street {...FARMACIA} />
    <Fechado position={[0, 1.95, -4.6]} rotation={[0, 0, 0.06]} />
    <Teia position={[1.6, 3.7, -4.05]} s={0.45} />
    <Teia position={[-1.6, 3.7, -4.05]} s={0.35} />
    <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 2.4, 8.5], [0, 2.1, -4]], [t1, [0, 2.2, 5.8], [0, 2.0, -4]]]} />
  </>
);

// 27. "O farmacêutico tentou sorrir. Não *conseguiu*."
const S27 = ({ t, t0, t1 }: ShotProps) => {
  const s = W(23, 'sorrir');
  const k = W(23, 'conseguiu');
  const pose = track(t, P({}), [{ at: s, v: { squash: 0.12, lsz: 0.6, rsz: 0.6 } }, { at: k, v: { squash: 0, lsz: 0.12, rsz: 0.12, hp: 0.2 } }]);
  return (
    <>
      <Street {...FARMACIA} />
      <Fechado position={[0, 1.95, -4.6]} rotation={[0, 0, 0.06]} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.4, 1.8, 3.4], [0, 1.65, 0]], [t1, [0.15, 1.75, 2.8], [0, 1.65, 0]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'neutral' }, { at: s, f: 'grin', o: ['stress', 'sweat3'] }, { at: k, f: 'frustrated', o: ['tears'] }], 24)} look={FARMA} />
    </>
  );
};

// 28. "Teve que comprar um adesivo, e colou de *cabeça* pra baixo." — volta à praça (loop)
const S28 = ({ t, t0, t1 }: ShotProps) => {
  const k = W(24, 'cabeca');
  const pose = track(t, P({}), [{ at: k - 0.3, v: { rsx: 1.6, rsz: 0.2, rel: -1.6 } }, { at: k + 0.25, v: { rsx: 0, rsz: 0.12, rel: 0.15 } }]);
  const gente = [
    { x: -1.3, z: -1.2, ry: 0.3, look: VOVO }, { x: 1.3, z: -1.2, ry: -0.3, look: CARTEIRO }, { x: -2.3, z: -0.4, ry: 0.5, look: NOIVA }, { x: 2.3, z: -0.4, ry: -0.5, look: PADEIRO },
  ];
  return (
    <>
      <Street {...FARMACIA} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 1.8, 3.2], [0, 1.65, 0]], [k + 0.3, [0.1, 1.75, 2.9], [0, 1.65, 0]], [k + 1.2, [0, 2.4, 8.0], [0, 1.4, -0.4]], [t1, [0, 2.6, 9.0], [0, 1.4, -0.4]]]} />
      <Character pose={pose} face={fa(t, [{ at: t0, f: 'annoyed' }, { at: k, f: 'deadpan' }], 25)} look={FARMA} head={t >= k - 2 * F ? <Adesivo flip /> : null} />
      {gente.map((g, i) => (
        <Character key={i} pose={P({ x: g.x, z: g.z, ry: g.ry, lsz: 1.4, rsz: 1.4, lel: 0.4, rel: 0.4 })} face={fa(t, [{ at: t0, f: 'laugh' }], 30 + i)} look={g.look} />
      ))}
    </>
  );
};

export const SHOTS: Shot[] = [
  { from: 0, name: '01 cidade', C: S01 },
  { from: W(1, 0), name: '02 farmacia', C: S02 },
  { from: W(2, 0), name: '03 carteiro', C: S03 },
  { from: W(3, 0), name: '04 noiva', C: S04 },
  { from: W(4, 0), name: '05 cachorro', C: S05 },
  { from: W(5, 0), name: '06 vovo', C: S06 },
  { from: W(6, 0), name: '07 fila', C: S07 },
  { from: W(7, 0), name: '08 tita', C: S08 },
  { from: W(8, 0), name: '09 ri', C: S09 },
  { from: W(9, 0), name: '10 parou', C: S10 },
  { from: W(9, 3), name: '11 bandeja', C: S11 },
  { from: W(10, 0), name: '12 reparar', C: S12 },
  { from: W(11, 0), name: '13 sem', C: S13 },
  { from: W(12, 0), name: '14 nome', C: S14 },
  { from: W(13, 0), name: '15 cafe', C: S15 },
  { from: W(14, 0), name: '16 noite', C: S16 },
  { from: W(15, 0), name: '17 aspirador', C: S17 },
  { from: W(16, 0), name: '18 potes', C: S18 },
  { from: W(17, 0), name: '19 manha tarde', C: S19 },
  { from: W(18, 0), name: '20 apontou', C: S20 },
  { from: W(18, 'mim'), name: '21 mim', C: S21 },
  { from: W(19, 0), name: '22 gargalhada', C: S22 },
  { from: W(20, 0), name: '23 explodiu', C: S23 },
  { from: W(21, 0), name: '24 chamines', C: S24 },
  { from: W(21, 'cada'), name: '25 vovo pega', C: S25 },
  { from: W(22, 0), name: '26 vazia', C: S26 },
  { from: W(23, 0), name: '27 conseguiu', C: S27 },
  { from: W(24, 0), name: '28 cabeca', C: S28 },
];
