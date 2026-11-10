import { JSX } from 'react';
import { clamp01, easeOut, seg, track } from './anim';
import { Character, faceAt, Pose, REST } from './Character';
import {
  Bairro, Bau, CapInHand, Caixa, Cartaz, Clock, Cone, FabricaDentro, FabricaFora, Floresta, IceTruck, KIDS, MAQ_X, PAI, RoadSign, SORVETEIRO, VOCE_K,
} from './historia';
import { Calendar, Comic, Gauge, Magnifier, Puff, Sign, Sparkles } from './props';
import { Cam, Stage } from './sets';
import { F, W } from './timeline';

// ============================================================================
// "O Sorveteiro da Segunda-Feira" — tomadas (ver STORYBOARD.md).
// Tudo ancorado em palavras com W(linha, 'palavra').
// ============================================================================

export type ShotProps = { t: number; t0: number; t1: number };
export type Shot = { from: number; name: string; C: (p: ShotProps) => JSX.Element };

export const SFX: { at: number; file: string; vol: number }[] = [];

const P = (o: Partial<Pose> = {}): Pose => ({ ...REST, ...o });
const RUA_Z = -3.2; // pista do caminhão no Bairro

// Caminhão que chega e para em x1 na palavra `arr`.
const truckX = (t: number, t0: number, arr: number, x0: number, x1: number) => x0 + (x1 - x0) * easeOut(clamp01((t - t0) / (arr - t0)));

// ---------------- Linha 0 ----------------
// "Toda *segunda-feira*,"  — calendário pousa em SEGUNDA
const S01 = ({ t, t0, t1 }: ShotProps) => {
  const seg2 = W(0, 'segunda');
  const pose = track(t, P({ x: -0.45, ry: 0.35, hy: 0.35 }), [{ at: seg2, v: { rsz: 1.0, rsx: 0.5, rel: -0.4, hy: 0.6, hp: 0.05 } }]);
  const face = faceAt(t, [{ at: t0, f: 'curious' }, { at: seg2, f: 'worried' }], 1);
  return (
    <>
      <Bairro />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 1.3, 4.2], [0.15, 1.15, 0], 32], [t1, [0.1, 1.2, 3.6], [0.15, 1.15, 0], 32]]} />
      <Character pose={pose} face={face} look={VOCE_K} />
      <Calendar t={t} from={t0} at={seg2} pages={['SEXTA', 'SÁBADO', 'DOMINGO', 'SEGUNDA']} position={[0.75, 1.2, 0.1]} rotation={[0, -0.25, 0]} scale={0.75} />
    </>
  );
};

// "às *três* da tarde," — relógio gira até as 3
const S02 = ({ t, t0, t1 }: ShotProps) => {
  const tres = W(0, 'tres');
  const pose = track(t, P({ x: -0.5, ry: 0.5, hy: 0.4, hp: -0.15 }), [{ at: tres, v: { lsz: 0.9, rsz: 0.9, lel: 0.6, rel: 0.6, squash: 0.1 } }]);
  const face = faceAt(t, [{ at: t0, f: 'thinking' }, { at: tres, f: 'surprised' }], 2);
  return (
    <>
      <Bairro />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.6, 1.4, 3.8], [0.2, 1.4, 0], 32], [t1, [-0.2, 1.45, 3.4], [0.25, 1.45, 0], 32]]} />
      <Character pose={pose} face={face} look={VOCE_K} />
      <Clock t={t} from={t0} at={tres} hour={3} position={[0.75, 1.75, 0.1]} rotation={[0, -0.3, 0]} scale={0.85} />
    </>
  );
};

// "uma coisa estranha acontece no seu *bairro*." — grua revelando a rua
const S03 = ({ t, t0, t1 }: ShotProps) => {
  const est = W(0, 'estranha');
  const pose = track(t, P({ x: 0, ry: -0.2, hy: -0.3 }), [{ at: est, v: { hy: 0.5, hp: -0.1, lean: -0.05 } }]);
  const face = faceAt(t, [{ at: t0, f: 'neutral' }, { at: est, f: 'suspicious' }], 3);
  return (
    <>
      <Bairro />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [1.5, 1.4, 4.0], [0, 1.1, -1], 32], [t1, [3.5, 4.8, 8.5], [0, 1.4, -4], 32]]} />
      <Character pose={pose} face={face} look={VOCE_K} />
    </>
  );
};

// ---------------- Linha 1 ----------------
// "Um caminhão de *sorvete* aparece do nada," — caminhão chega e para
const S04 = ({ t, t0, t1 }: ShotProps) => {
  const arr = W(1, 'aparece');
  const x = truckX(t, t0 - 0.4, arr, -16, 0.6);
  return (
    <>
      <Bairro />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-3.5, 0.9, 5.5], [-3, 1.6, RUA_Z], 32], [arr, [-1.5, 0.8, 4.8], [0, 1.9, RUA_Z], 32], [t1, [-1.0, 0.8, 4.4], [0, 2.0, RUA_Z], 32]]} />
      <IceTruck position={[x, 0, RUA_Z]} dist={x + 16} />
      <Comic t={t} at={W(1, 'sorvete')} text="PLIM!" position={[x - 0.5, 4.8, RUA_Z + 0.5]} size={0.6} />
    </>
  );
};

// "e *ninguém* sabe de onde ele vem."
const S05 = ({ t, t0, t1 }: ShotProps) => {
  const n = W(1, 'ninguem');
  const kids = [0, 1].map((i) =>
    track(t, P({ x: -0.9 + i * 1.8, ry: Math.PI + (i ? 0.3 : -0.3), hy: 0 }), [{ at: n, v: { hr: i ? 0.25 : -0.25, lsz: 0.7, rsz: 0.7, lel: 0.9, rel: 0.9 } }]),
  );
  const youPose = track(t, P({ x: 0, z: 0.4, ry: Math.PI }), [{ at: n, v: { hr: 0.2, rsx: 1.6, rel: -1.4 } }]);
  return (
    <>
      <Bairro />
      <IceTruck position={[0.6, 0, RUA_Z]} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 2.2, 4.4], [0.2, 1.6, -1.5], 32], [t1, [-0.4, 2.0, 3.8], [0.2, 1.6, -1.5], 32]]} />
      {kids.map((p, i) => (
        <Character key={i} pose={p} face={faceAt(t, [{ at: t0, f: 'confused' }], 4 + i)} look={KIDS[i]} />
      ))}
      <Character pose={youPose} face={faceAt(t, [{ at: t0, f: 'confused' }], 6)} look={VOCE_K} />
      <Comic t={t} at={n} text="???" position={[0.1, 2.3, 0.4]} size={0.45} hold={2} />
    </>
  );
};

// ---------------- Linha 2 ----------------
// "Todas as crianças compram o sabor *azul*." — fila no caminhão, a casquinha azul aparece
const S06 = ({ t, t0, t1 }: ShotProps) => {
  const azul = W(2, 'azul');
  const comp = W(2, 'compram');
  const sv = track(t, P({ x: -0.5, y: 0.45, z: -3.2, ry: 0 }), [{ at: comp, v: { rsx: 1.3, rel: -0.3 } }]);
  return (
    <>
      <Bairro />
      <IceTruck position={[0, 0, RUA_Z]} />
      <Character pose={sv} face={faceAt(t, [{ at: t0, f: 'smug' }], 7)} look={SORVETEIRO} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [2.6, 1.6, 4.0], [-0.4, 1.5, -1.6], 32], [t1, [1.8, 1.5, 3.2], [-0.5, 1.4, -1.6], 32]]} />
      {[0, 1, 2].map((i) => {
        const first = i === 0;
        const pose = track(t, P({ x: -0.5 + i * 1.0, z: -1.4 + i * 0.9, ry: Math.PI - 0.2 - i * 0.2 }), first ? [{ at: azul, v: { ry: 0.3, rsx: 1.2, rel: -0.9, hp: 0.15 } }] : []);
        const face = faceAt(t, [{ at: t0, f: 'happy' }, ...(first ? [{ at: azul, f: 'starstruck' as const, o: ['sparkle' as const] }] : [])], 8 + i);
        return <Character key={i} pose={pose} face={face} look={KIDS[i]} right={first && t >= azul - 4 * F ? <Cone position={[0, -0.12, 0.02]} rotation={[-1.1, 0, 0]} /> : undefined} />;
      })}
      <Sparkles t={t} from={azul} n={6} radius={0.35} center={[-0.3, 1.0, -0.8]} size={0.12} />
    </>
  );
};

// "É o *único* que ele vende." — close no cardápio
const S07 = ({ t, t0, t1 }: ShotProps) => {
  const u = W(2, 'unico');
  const sv = track(t, P({ x: -0.5, y: 0.45, z: -3.2, ry: 0.2, hp: 0.1 }), [{ at: u, v: { hy: 0.4 } }]);
  return (
    <>
      <Bairro />
      <IceTruck position={[0, 0, RUA_Z]} />
      <Character pose={sv} face={faceAt(t, [{ at: t0, f: 'smug' }, { at: u, f: 'sideEye' }], 11)} look={SORVETEIRO} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-1.4, 1.5, 3.0], [-1.1, 1.6, RUA_Z + 1], 32], [u, [-1.1, 1.6, 2.2], [-1.0, 1.65, RUA_Z + 1], 32], [t1, [-0.9, 1.65, 2.0], [-0.9, 1.7, RUA_Z + 1], 32]]} />
      <Comic t={t} at={u} text="SÓ AZUL!" position={[-0.75, 0.75, RUA_Z + 1.6]} size={0.36} hold={1.5} />
    </>
  );
};

// ---------------- Linha 3 ----------------
// "Mas naquela mesma noite, as crianças *desaparecem*." — luzes apagam, crianças somem
const S08 = ({ t, t0, t1 }: ShotProps) => {
  const d = W(3, 'desaparecem');
  const a = W(3, 'naquela');
  const lights = Array.from({ length: 7 }, (_, i) => (t < a + i * ((d - a) / 7) ? 1 : 0));
  return (
    <>
      <Bairro night lights={lights} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0, 3.2, 9.5], [0, 1.6, -3], 32], [t1, [0, 1.6, 4.4], [0, 1.0, 0], 32]]} />
      {[0, 1, 2].map((i) =>
        t < d ? (
          <Character
            key={i}
            pose={P({ x: -1.4 + i * 1.4, ry: 0, hy: (i - 1) * 0.2 })}
            face={faceAt(t, [{ at: t0, f: 'sleepy' }], 12 + i)}
            look={KIDS[i]}
            right={<Cone position={[0, -0.12, 0.02]} rotation={[-1.1, 0, 0]} />}
          />
        ) : null,
      )}
      {[0, 1, 2].map((i) => (
        <Puff key={i} t={t} at={d} position={[-1.4 + i * 1.4, 0.8, 0]} color="#5ab4ff" size={0.7} n={8} />
      ))}
    </>
  );
};

// ---------------- Linha 4 ----------------
// "No dia seguinte, elas voltam como se nada tivesse acontecido, *sem* lembrar de nada."
const S09 = ({ t, t0, t1 }: ShotProps) => {
  const s = W(4, 'sem');
  return (
    <>
      <Bairro />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 1.3, 2.6], [0, 1.0, -2], 32], [t1, [0.3, 1.2, 4.6], [0, 1.0, 0], 32]]} />
      {[0, 1, 2].map((i) => {
        const d = (t - t0) * 0.55;
        const z = -3 + d - i * 1.1;
        const pose = P({ x: -0.9 + i * 0.9, z, ry: 0, walk: d / 0.24 + i * 0.5, stride: 1, lsz: 0.05, rsz: 0.05, hp: 0.12 });
        return <Character key={i} pose={pose} face={faceAt(t, [{ at: t0, f: 'deadpan' }, { at: s, f: 'sleepy' }], 15 + i)} look={KIDS[i]} />;
      })}
      <Comic t={t} at={s} text="???" position={[0, 2.0, -0.5]} size={0.45} hold={1.5} />
    </>
  );
};

// ---------------- Linha 5 ----------------
// "Você nunca tomou aquele sorvete, e decidiu descobrir a *verdade*." — lupa na mão
const S10 = ({ t, t0, t1 }: ShotProps) => {
  const nunca = W(5, 'nunca');
  const dec = W(5, 'decidiu');
  const v = W(5, 'verdade');
  const pose = track(t, P({ ry: 0.1 }), [
    { at: nunca, v: { lsz: 0.6, lel: 0.2, hr: 0.15, hy: -0.2 } },
    { at: dec, v: { rsx: 1.5, rel: -1.2, rsz: 0.3, hy: 0.15, hr: 0 } },
    { at: v, v: { rsx: 1.7, rel: -0.6, lean: 0.12, hp: 0.05 } },
  ]);
  const face = faceAt(t, [{ at: t0, f: 'smug' }, { at: nunca, f: 'disgusted' }, { at: dec, f: 'suspicious' }, { at: v, f: 'confident' }], 18);
  return (
    <>
      <Bairro />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.8, 1.3, 3.6], [0, 1.15, 0], 32], [v, [0.2, 1.2, 2.9], [0.05, 1.15, 0], 32], [t1, [0.1, 1.2, 2.7], [0.05, 1.15, 0], 32]]} />
      <Character pose={pose} face={face} look={VOCE_K} right={t >= dec - 6 * F ? <Magnifier /> : undefined} />
      <Comic t={t} at={v} text="!" position={[0.55, 1.95, 0.2]} size={0.35} />
    </>
  );
};

// ---------------- Linha 6 ----------------
// "Na segunda seguinte, você se" — anda até a porta de trás aberta
const S11 = ({ t, t0, t1 }: ShotProps) => {
  const d = Math.min(3.0, (t - t0) * 1.8);
  const pose = P({ x: -6 + d, z: -0.3, ry: Math.PI / 2 + 0.3, walk: d / 0.24, stride: d < 3 ? 1 : 0, squash: 0.15, lean: 0.15 });
  return (
    <>
      <Bairro />
      <IceTruck position={[0, 0, RUA_Z]} door={1} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-7.5, 1.4, 2.6], [-5.0, 1.0, -1.6], 34], [t1, [-6.0, 1.5, 2.4], [-3.4, 1.3, -2.0], 34]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'nervous', o: ['sweat'] }], 20)} look={VOCE_K} />
    </>
  );
};

// "*escondeu* dentro do caminhão." — dentro do baú, atrás da caixa
const S12 = ({ t, t0, t1 }: ShotProps) => {
  const e = W(6, 'escondeu');
  const pose = track(t, P({ x: 0.2, z: 0.2, ry: 0.2, squash: 0.2 }), [{ at: e, v: { squash: 0.55, lsx: 1.4, rsx: 1.4, lel: -1.6, rel: -1.6, hp: 0.15 }, lead: 2 }]);
  return (
    <>
      <Bau />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.9, 1.4, 3.6], [0.1, 0.8, 0], 32], [t1, [0.6, 1.2, 3.0], [0.1, 0.75, 0], 32]]} />
      <Character pose={pose} face={faceAt(t, [{ at: t0, f: 'nervous' }, { at: e, f: 'scared', o: ['sweat3'] }], 21)} look={VOCE_K} />
      <Caixa position={[-0.3, 0, 1.0]} size={0.7} />
      <Caixa position={[0.75, 0, 0.9]} size={0.55} rotation={[0, -0.3, 0]} />
    </>
  );
};

// ---------------- Linha 7 ----------------
// "Ele saiu da cidade," — estrada na floresta, vista do alto
const S13 = ({ t, t0, t1 }: ShotProps) => {
  const x = (t - t0) * 7;
  return (
    <>
      <Floresta />
      <IceTruck position={[x, 0, -0.9]} dist={x} menu={false} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t, [x - 6, 7.5, 9], [x + 1, 1, 0], 34]]} />
    </>
  );
};

// "por uma estrada que não aparece em *nenhum* mapa." — passa pela placa FIM DO MAPA
const S14 = ({ t, t0, t1 }: ShotProps) => {
  const n = W(7, 'nenhum');
  const x = 30 + (t - n) * 7;
  return (
    <>
      <Floresta />
      <IceTruck position={[x, 0, -0.9]} dist={x} menu={false} />
      <RoadSign text={'FIM DO\nMAPA'} bg="#c4161c" fg="#ffffff" position={[31.5, 0, 2.6]} rotation={[0, -0.35, 0]} w={1.6} h={1.1} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [33.8, 1.6, 7.6], [31.0, 1.9, 1.5], 32], [t1, [33.2, 1.7, 6.4], [31.0, 2.0, 1.5], 32]]} />
      <Comic t={t} at={n} text="?!" position={[31.5, 3.6, 2.6]} size={0.35} hold={1.5} />
    </>
  );
};

// ---------------- Linha 8 ----------------
// "Até chegar num portão *gigantesco*," — portão abre
const S15 = ({ t, t0, t1 }: ShotProps) => {
  const g = W(8, 'gigantesco');
  const z = 10 - 6 * easeOut(clamp01((t - t0) / (g - t0)));
  const open = seg(t, g - 0.2, g + 1.2);
  return (
    <>
      <FabricaFora t={t} open={open} />
      <group rotation={[0, -Math.PI / 2, 0]} position={[0, 0, z]}>
        <IceTruck dist={-z} menu={false} />
      </group>
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [3.5, 0.8, 16], [0, 4, 0], 34], [t1, [2.5, 0.6, 14], [0, 5.5, -4], 34]]} />
    </>
  );
};

// "com uma *fábrica* escondida no meio da floresta." — grua sobre o portão
const S16 = ({ t, t0, t1 }: ShotProps) => {
  const z = 4 - (t - t0) * 2.6;
  return (
    <>
      <FabricaFora t={t} open={1} />
      <group rotation={[0, -Math.PI / 2, 0]} position={[0, 0, z]}>
        <IceTruck dist={-z} menu={false} />
      </group>
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [6, 4, 14], [0, 5, -12], 34], [t1, [3, 12, 10], [0, 7, -20], 34]]} />
    </>
  );
};

// ---------------- Linha 9 ----------------
// "Lá dentro estavam todas as *crianças*," — crianças dormindo nas plataformas
const S17 = ({ t, t0, t1 }: ShotProps) => {
  const you = track(t, P({ x: 4.2, z: 1.6, ry: -0.9, lean: 0.1 }), [{ at: W(9, 'criancas'), v: { lsx: 1.4, rsx: 1.4, lel: -1.8, rel: -1.8, squash: 0.2 } }]);
  return (
    <>
      <FabricaDentro t={t} level={0.3 + 0.1 * clamp01((t - t0) / 3)} />
      {MAQ_X.map((x, i) => (
        <Character key={x} pose={P({ x, y: 0.55, hp: 0.15, lsz: 0.02, rsz: 0.02 })} face={faceAt(t, [{ at: t0, f: 'sleepy' }], 30 + i)} look={KIDS[i]} />
      ))}
      <Character pose={you} face={faceAt(t, [{ at: t0, f: 'shocked' }, { at: W(9, 'criancas'), f: 'terrified', o: ['sweat'] }], 22)} look={VOCE_K} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [6.0, 2.0, 6.5], [0.5, 1.6, -0.8], 34], [t1, [5.0, 1.8, 5.2], [0.8, 1.6, -0.5], 34]]} />
    </>
  );
};

// "e uma máquina roubando os *sonhos* delas." — tanque enchendo + medidor SONHOS
const S18 = ({ t, t0, t1 }: ShotProps) => {
  const s = W(9, 'sonhos');
  return (
    <>
      <FabricaDentro t={t} level={0.4 + 0.45 * seg(t, t0, s)} />
      {MAQ_X.map((x, i) => (
        <Character key={x} pose={P({ x, y: 0.55, hp: 0.15 })} face={faceAt(t, [{ at: t0, f: 'sleepy' }], 34 + i)} look={KIDS[i]} />
      ))}
      <Gauge t={t} from={t0} at={s} value={0.95} label="SONHOS" position={[1.9, 3.2, -2.2]} scale={0.9} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.6, 4.6, 4.6], [0.8, 3.6, -2.5], 32], [t1, [1.3, 4.5, 3.6], [1.3, 3.7, -2.5], 32]]} />
    </>
  );
};

// ---------------- Linha 10 ----------------
// "Então o sorveteiro tirou o *chapéu*." — de costas, tira o chapéu
const S19 = ({ t, t0, t1 }: ShotProps) => {
  const c = W(10, 'chapeu');
  const tirou = t >= c - 2 * F;
  const sv = track(t, P({ x: 0, z: 2.4, ry: Math.PI }), [
    { at: W(10, 'tirou'), v: { rsx: 2.4, rel: -1.2, rsz: 0.3 }, dur: 6 },
    { at: c, v: { rsx: 1.0, rel: -0.3, rsz: 0.6 }, lead: 0, dur: 6 },
  ]);
  const you = P({ x: 1.0, z: 4.3, ry: Math.PI - 0.3, hy: 0.2 });
  return (
    <>
      <FabricaDentro t={t} level={0.85} />
      <Character pose={sv} face={faceAt(t, [{ at: t0, f: 'neutral' }], 40)} look={tirou ? PAI : SORVETEIRO} right={tirou ? <CapInHand /> : undefined} />
      <Character pose={you} face={faceAt(t, [{ at: t0, f: 'scared' }], 41)} look={VOCE_K} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.6, 1.9, 8.4], [0.3, 1.5, 3.0], 32], [t1, [-0.4, 1.9, 7.6], [0.3, 1.6, 3.0], 32]]} />
    </>
  );
};

// ---------------- Linha 11 ----------------
// "Era o *seu* pai," — ele se vira: é o pai
const S20 = ({ t, t0, t1 }: ShotProps) => {
  const s = W(11, 'seu');
  const pai = track(t, P({ x: 0, z: 2.4, ry: Math.PI, rsx: 1.0, rel: -0.3, rsz: 0.6 }), [{ at: s, v: { ry: 0.15, hp: 0.05 }, dur: 8 }]);
  return (
    <>
      <FabricaDentro t={t} level={0.85} />
      <Character pose={pai} face={faceAt(t, [{ at: t0, f: 'neutral' }, { at: s, f: 'unsure', o: ['shading'] }], 42)} look={PAI} right={<CapInHand />} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 1.8, 6.0], [0, 1.65, 2.4], 32], [t1, [0.2, 1.75, 5.2], [0, 1.65, 2.4], 32]]} />
    </>
  );
};

// "que tinha sumido há *dois* anos." — você chorando + cartaz + calendário 2 ANOS
const S21 = ({ t, t0, t1 }: ShotProps) => {
  const d = W(11, 'dois');
  const you = track(t, P({ x: -0.45, ry: 0.25 }), [{ at: d, v: { lsx: 1.5, rsx: 1.5, lel: -1.9, rel: -1.9, hp: 0.1 } }]);
  return (
    <>
      <FabricaDentro t={t} level={0.85} />
      <Character pose={you} face={faceAt(t, [{ at: t0, f: 'shocked' }, { at: d, f: 'shocked', o: ['tears'] }], 43)} look={VOCE_K} />
      <Cartaz position={[0.95, 1.6, -0.6]} rotation={[0, -0.2, 0]} scale={0.7} />
      <Calendar t={t} from={t0} at={d} pages={['1 MÊS', '6 MESES', '1 ANO', '2 ANOS!']} position={[0.85, 0.7, -0.1]} rotation={[0, -0.25, 0]} scale={0.55} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [-0.2, 1.3, 3.8], [0.2, 1.15, 0], 32], [t1, [0.1, 1.25, 3.3], [0.2, 1.15, 0], 32]]} />
    </>
  );
};

// ---------------- Linha 12 ----------------
// "E ele olhou direto pra *você*." — encara a câmera
const S22 = ({ t, t0, t1 }: ShotProps) => {
  const v = W(12, 'voce');
  const pai = track(t, P({ x: 0, z: 0, ry: 0.5, hy: 0.4 }), [{ at: W(12, 'olhou'), v: { ry: 0, hy: 0, hp: 0.08 } }]);
  return (
    <>
      <FabricaDentro t={t} level={0.9} />
      <Character pose={pai} face={faceAt(t, [{ at: t0, f: 'neutral' }, { at: W(12, 'olhou'), f: 'deadpan', o: ['shading'] }, { at: v, f: 'smug', o: ['shading'] }], 44)} look={PAI} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.2, 1.65, 4.0], [0, 1.6, 0], 32], [v, [0.05, 1.62, 2.9], [0, 1.6, 0], 30], [t1, [0, 1.62, 2.6], [0, 1.6, 0], 30]]} />
    </>
  );
};

// "Comenta *parte* dois se quer saber o resto." — placa PARTE 2?
const S23 = ({ t, t0, t1 }: ShotProps) => {
  const p = W(12, 'parte');
  const y = 2.4 + 3 * (1 - seg(t, p - 6 * F, p, (x) => x * x * x));
  const you = track(t, P({ x: -0.55, ry: 0.35, hy: 0.3 }), [{ at: p, v: { rsz: 1.2, rsx: 0.6, rel: -0.3, hy: 0.55 } }]);
  return (
    <>
      <Stage color="#5a2440" />
      <Character pose={you} face={faceAt(t, [{ at: t0, f: 'curious' }, { at: p, f: 'bigSmile' }], 45)} look={VOCE_K} />
      <Sign text="PARTE 2?" w={1.6} h={0.65} position={[0.15, y, -0.2]} bg="#ffd23a" fg="#3a1424" />
      <Sparkles t={t} from={p} n={8} radius={1.0} center={[0.35, 2.4, -0.2]} />
      <Cam t={t} t0={t0} t1={t1} keys={[[t0, [0.3, 1.6, 4.4], [0.0, 1.5, 0], 32], [t1, [0.1, 1.55, 3.9], [0.0, 1.5, 0], 32]]} />
    </>
  );
};

export const SHOTS: Shot[] = [
  { from: 0, name: '01 segunda', C: S01 },
  { from: W(0, 'as'), name: '02 tres', C: S02 },
  { from: W(0, 'uma'), name: '03 bairro', C: S03 },
  { from: W(1, 0), name: '04 caminhao', C: S04 },
  { from: W(1, 'ninguem'), name: '05 ninguem', C: S05 },
  { from: W(2, 0), name: '06 azul', C: S06 },
  { from: W(2, 'e'), name: '07 unico', C: S07 },
  { from: W(3, 0), name: '08 noite', C: S08 },
  { from: W(4, 0), name: '09 voltam', C: S09 },
  { from: W(5, 0), name: '10 verdade', C: S10 },
  { from: W(6, 0), name: '11 porta', C: S11 },
  { from: W(6, 'escondeu'), name: '12 bau', C: S12 },
  { from: W(7, 0), name: '13 estrada', C: S13 },
  { from: W(7, 'por'), name: '14 mapa', C: S14 },
  { from: W(8, 0), name: '15 portao', C: S15 },
  { from: W(8, 'com'), name: '16 fabrica', C: S16 },
  { from: W(9, 0), name: '17 criancas', C: S17 },
  { from: W(9, 'uma'), name: '18 sonhos', C: S18 },
  { from: W(10, 0), name: '19 chapeu', C: S19 },
  { from: W(11, 0), name: '20 pai', C: S20 },
  { from: W(11, 'que'), name: '21 dois anos', C: S21 },
  { from: W(12, 0), name: '22 olhou', C: S22 },
  { from: W(12, 'comenta'), name: '23 parte 2', C: S23 },
];
