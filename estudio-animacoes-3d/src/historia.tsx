import { useMemo } from 'react';
import * as THREE from 'three';
import { back, clamp01, easeOut, rand, seg, V3 } from './anim';
import { Look, VOCE } from './Character';
import { ELENCO } from './personagens';
import { Field, Sign } from './props';
import { Box, WarmLights } from './sets';
import { F } from './timeline';
import { labelTex } from './textures';

// ============================================================================
// "A ILHA DOS PODERES" — elenco, cenários e objetos novos desta história.
// ============================================================================

type G = { position?: V3; rotation?: V3; scale?: number | V3 };

// ---------- Elenco ----------
export const JOAOZINHO: Look = ELENCO.pedrinho.look; // o menino que voa (a 5 cm do chão)
export const MARIA: Look = ELENCO.lia.look; // quem escolheu a condição do Joãozinho
export const JULIA: Look = {
  skin: '#d9a57c', jacket: '#8a4fc4', pants: '#d9a57c', shoes: '#f2f2f2', gloves: '#1e1f24',
  hair: '#4a2a16', hairStyle: 'rabo', body: 'crianca', skirt: { color: '#8a4fc4' }, scarf: '#f2c62e',
};
export const MAE_JULIA: Look = { ...ELENCO.paula.look, hair: '#4a2a16' };
export const VOCE_KID: Look = { ...VOCE, body: 'crianca' };

// ---------- Cenário: a ilha (praia, mar, coqueiros, morro) ----------
const Palm = ({ position, h = 3.2, lean = 0.25, rot = 0 }: { position: V3; h?: number; lean?: number; rot?: number }) => (
  <group position={position} rotation={[0, rot, 0]}>
    {Array.from({ length: 6 }, (_, i) => {
      const k = i / 6;
      return (
        <mesh key={i} position={[lean * k * k * h, (i + 0.5) * (h / 6), 0]} rotation={[0, 0, -lean * k * 1.2]} castShadow>
          <cylinderGeometry args={[0.11 - k * 0.03, 0.13 - k * 0.03, h / 6 + 0.04, 10]} />
          <meshStandardMaterial color={i % 2 ? '#8a5f3a' : '#7a5232'} roughness={0.9} />
        </mesh>
      );
    })}
    <group position={[lean * h, h, 0]}>
      {Array.from({ length: 7 }, (_, i) => (
        <group key={i} rotation={[0, (i / 7) * Math.PI * 2, 0]}>
          <mesh position={[0.65, -0.12, 0]} rotation={[0, 0, -0.45]} scale={[1, 0.08, 0.32]} castShadow>
            <sphereGeometry args={[0.75, 12, 8]} />
            <meshStandardMaterial color={i % 2 ? '#3f8f3a' : '#4fa444'} roughness={0.8} />
          </mesh>
        </group>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.cos(i * 2.1) * 0.13, -0.18, Math.sin(i * 2.1) * 0.13]} castShadow>
          <sphereGeometry args={[0.11, 12, 10]} />
          <meshStandardMaterial color="#6b4a22" />
        </mesh>
      ))}
    </group>
  </group>
);

const Hut = ({ position, color = '#e07a3c', rot = 0 }: { position: V3; color?: string; rot?: number }) => (
  <group position={position} rotation={[0, rot, 0]}>
    <Box p={[0, 0.8, 0]} s={[1.8, 1.6, 1.6]} c={color} />
    <mesh position={[0, 2.0, 0]} castShadow>
      <coneGeometry args={[1.5, 1.0, 4]} />
      <meshStandardMaterial color="#d9b25e" roughness={0.95} />
    </mesh>
    <Box p={[0, 0.55, 0.81]} s={[0.5, 1.0, 0.04]} c="#5a3a22" />
  </group>
);

export const Island = ({ bg = '#8fd3ee', extras = true }: { bg?: string; extras?: boolean }) => (
  <group>
    <WarmLights sun={[-6, 8, 7]} bg={bg} sky="#fff6e0" ground="#c9a46a" power={2.5} fill={1.0} fog={[18, 60]} />
    {/* areia */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#f0d49a" roughness={1} />
    </mesh>
    {/* mar ao fundo */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -22]}>
      <planeGeometry args={[120, 30]} />
      <meshStandardMaterial color="#2f9fc6" roughness={0.25} metalness={0.1} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, -7.4]}>
      <planeGeometry args={[120, 0.5]} />
      <meshStandardMaterial color="#f8fbff" roughness={0.6} />
    </mesh>
    {/* ilha distante com morro */}
    <mesh position={[9, 0, -30]} castShadow>
      <coneGeometry args={[7, 6, 24]} />
      <meshStandardMaterial color="#4f9a4a" roughness={0.9} />
    </mesh>
    <mesh position={[-12, 0, -34]}>
      <coneGeometry args={[6, 4, 24]} />
      <meshStandardMaterial color="#5aa653" roughness={0.9} />
    </mesh>
    {extras && (
      <>
        <Palm position={[-3.6, 0, -3.2]} lean={0.35} rot={0.3} />
        <Palm position={[3.8, 0, -4.2]} h={3.8} lean={0.3} rot={2.6} />
        <Palm position={[-6.5, 0, -6]} h={4.2} lean={0.2} rot={0.9} />
        <Palm position={[6.8, 0, -2.5]} h={3.4} lean={0.4} rot={3.4} />
        <Hut position={[-2.2, 0, -6.5]} color="#e07a3c" rot={0.25} />
        <Hut position={[2.4, 0, -7]} color="#3c9ae0" rot={-0.3} />
        {[[-1.4, -1.6], [1.8, -2.4], [-4.6, 0.5], [4.5, 0.8]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.08, z]} scale={[1, 0.6, 1]} castShadow>
            <sphereGeometry args={[0.18 + rand(i) * 0.1, 12, 8]} />
            <meshStandardMaterial color="#b8a58a" roughness={0.9} />
          </mesh>
        ))}
      </>
    )}
  </group>
);

// ---------- Cenário: quarto (para a parte do tempo parado) ----------
export const Bedroom = ({ parede = '#4f6fb8', frozen = 0 }: { parede?: string; frozen?: number }) => {
  const wall = new THREE.Color(parede).lerp(new THREE.Color('#7a8aa8'), frozen * 0.6).getStyle();
  return (
    <group>
      <WarmLights sun={[-3, 7, 6]} bg={wall} sky={frozen > 0.5 ? '#dfe8ff' : '#fff3dd'} ground="#4a3a2a" fill={1.0} fog={[14, 40]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#b98a5a" roughness={0.7} />
      </mesh>
      {Array.from({ length: 14 }, (_, i) => (
        <Box key={i} p={[-6.5 + i, 0.003, 0]} s={[0.02, 0.006, 40]} c="#9b7046" />
      ))}
      <Box p={[0, 3, -3]} s={[16, 6, 0.3]} c={wall} r={0.8} />
      {/* janela */}
      <Box p={[-2.2, 3.0, -2.84]} s={[1.6, 1.4, 0.05]} c="#bfe6ff" r={0.2} />
      <Box p={[-2.2, 3.0, -2.8]} s={[1.7, 0.08, 0.06]} c="#f4efe2" />
      <Box p={[-2.2, 3.0, -2.8]} s={[0.08, 1.5, 0.06]} c="#f4efe2" />
      {/* cama */}
      <group position={[2.0, 0, -1.6]}>
        <Box p={[0, 0.3, 0]} s={[1.6, 0.6, 2.6]} c="#7a4a26" />
        <Box p={[0, 0.66, 0.1]} s={[1.5, 0.14, 2.3]} c="#f4f0e6" />
        <Box p={[0, 0.72, 0.45]} s={[1.52, 0.16, 1.6]} c="#d8352f" />
        <Box p={[0, 0.8, -0.95]} s={[1.0, 0.18, 0.45]} c="#ffffff" />
        <Box p={[0, 0.9, -1.28]} s={[1.6, 1.2, 0.12]} c="#6a3e20" />
      </group>
      {/* criado-mudo */}
      <Box p={[0.75, 0.35, -2.4]} s={[0.6, 0.7, 0.5]} c="#8a5a32" />
    </group>
  );
};

// ---------- Objetos ----------
// Bolo com velinhas: a chama apaga em `blowAt`; o topo "10" salta em `topAt`.
export const Cake = ({ t, blowAt = 9999, topAt = -1, ...g }: G & { t: number; blowAt?: number; topAt?: number }) => {
  const off = t >= blowAt;
  const top = topAt < 0 ? 1 : seg(t, topAt - 4 * F, topAt, back);
  return (
    <group {...g}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.7, 40]} />
        <meshStandardMaterial color="#fbe3ec" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <torusGeometry args={[0.58, 0.05, 8, 40]} />
        <meshStandardMaterial color="#e2557d" />
      </mesh>
      <mesh position={[0, 0.94, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.45, 40]} />
        <meshStandardMaterial color="#8a4a2a" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.75, 0.75, 0.04, 40]} />
        <meshStandardMaterial color="#f4f4f4" metalness={0.3} roughness={0.3} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const x = Math.cos(a) * 0.3;
        const z = Math.sin(a) * 0.3;
        return (
          <group key={i} position={[x, 1.25, z]}>
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
              <meshStandardMaterial color={i % 2 ? '#3c9ae0' : '#f2c62e'} />
            </mesh>
            {!off && (
              <mesh position={[0, 0.15, 0]} scale={[1, 1.6 + 0.2 * Math.sin(t * 20 + i), 1]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial color="#ffd36a" emissive="#ff9a2a" emissiveIntensity={2.5} />
              </mesh>
            )}
          </group>
        );
      })}
      {top > 0.01 && <Sign text="10" w={0.5} h={0.34} bg="#e2557d" fg="#ffffff" position={[0, 1.6, 0]} scale={top} />}
    </group>
  );
};

// Fumacinha das velas apagadas.
export const Smoke = ({ t, at, position = [0, 0, 0] as V3 }: { t: number; at: number; position?: V3 }) => {
  const a = clamp01((t - at) / 1.4);
  if (t < at || a >= 1) return null;
  return (
    <group position={position}>
      {Array.from({ length: 10 }, (_, i) => {
        const ang = (i / 10) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(ang) * 0.3 + Math.sin(a * 6 + i) * 0.05, a * 0.9, Math.sin(ang) * 0.3]} scale={0.05 + a * 0.08}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#d8d8d8" transparent opacity={0.6 * (1 - a)} />
          </mesh>
        );
      })}
    </group>
  );
};

// Régua em pé que mede o vão entre o pé e o chão. A etiqueta "5 cm" salta em `at`.
export const Ruler = ({ t, at, ...g }: G & { t: number; at: number }) => {
  const tex = useMemo(
    () =>
      labelTex('', { w: 64, h: 512, bg: '#f2c62e' }),
    [],
  );
  const k = seg(t, at - 6 * F, at, back);
  return (
    <group {...g}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 1.0, 0.02]} />
        <meshStandardMaterial color="#f2c62e" map={tex} />
      </mesh>
      {Array.from({ length: 21 }, (_, i) => (
        <mesh key={i} position={[-0.03 + (i % 5 === 0 ? 0.01 : 0), 0.0 + i * 0.05, 0.012]}>
          <planeGeometry args={[i % 5 === 0 ? 0.05 : 0.03, 0.006]} />
          <meshBasicMaterial color="#2a2a2a" />
        </mesh>
      ))}
      {k > 0.01 && <Sign text="5 cm" w={0.42} h={0.2} bg="#d22d2d" fg="#ffffff" position={[0.32, 0.12, 0.05]} scale={k} />}
    </group>
  );
};

// Fila de formigas andando (passo calculado por t).
export const Ants = ({ t, n = 9, from = [-1.5, 0, 0.4] as V3, dir = 1, speed = 0.25 }: { t: number; n?: number; from?: V3; dir?: number; speed?: number }) => (
  <group position={from}>
    {Array.from({ length: n }, (_, i) => {
      const x = dir * (i * 0.32 + t * speed);
      const bob = Math.abs(Math.sin(t * 18 + i)) * 0.006;
      return (
        <group key={i} position={[x, 0.025 + bob, Math.sin(i * 1.3) * 0.03]} rotation={[0, dir > 0 ? 0 : Math.PI, 0]}>
          {[-0.05, 0, 0.055].map((dx, j) => (
            <mesh key={j} position={[dx, 0.012, 0]} castShadow>
              <sphereGeometry args={[j === 1 ? 0.022 : 0.03, 10, 8]} />
              <meshStandardMaterial color="#1a1412" roughness={0.4} />
            </mesh>
          ))}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0, 0.0, s * 0.03]} rotation={[s * 0.6, 0, Math.sin(t * 18 + i) * 0.4]}>
              <boxGeometry args={[0.07, 0.004, 0.004]} />
              <meshStandardMaterial color="#1a1412" />
            </mesh>
          ))}
        </group>
      );
    })}
  </group>
);

export const Puddle = (g: G) => (
  <mesh {...g} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <circleGeometry args={[0.5, 32]} />
    <meshStandardMaterial color="#5fb6e0" roughness={0.05} metalness={0.2} />
  </mesh>
);

// Feixe de laser entre dois pontos (k = 0..1 do comprimento).
export const Laser = ({ from, to, k = 1, width = 0.025 }: { from: V3; to: V3; k?: number; width?: number }) => {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const end = a.clone().lerp(b, clamp01(k));
  const len = a.distanceTo(end);
  if (len < 0.01) return null;
  const mid = a.clone().add(end).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(a).normalize());
  return (
    <group>
      <mesh position={mid.toArray() as V3} quaternion={q}>
        <cylinderGeometry args={[width, width, len, 10]} />
        <meshBasicMaterial color="#ff2a2a" toneMapped={false} />
      </mesh>
      <mesh position={mid.toArray() as V3} quaternion={q}>
        <cylinderGeometry args={[width * 2.6, width * 2.6, len, 10]} />
        <meshBasicMaterial color="#ff6a6a" transparent opacity={0.35} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh position={end.toArray() as V3}>
        <sphereGeometry args={[width * 3, 10, 8]} />
        <meshBasicMaterial color="#fff2c0" toneMapped={false} />
      </mesh>
    </group>
  );
};

// Pão francês / filão. `cut` (0..1) = quanto já foi fatiado da esquerda para a direita.
export const Loaf = ({ cut = 0, slices = 7, ...g }: G & { cut?: number; slices?: number }) => {
  const L = 0.9;
  const w = L / slices;
  return (
    <group {...g}>
      {Array.from({ length: slices }, (_, i) => {
        const done = cut * slices > i + 0.5;
        const x = -L / 2 + w * (i + 0.5) + (done ? (i - slices / 2) * 0.035 : 0);
        const edge = i === 0 || i === slices - 1 ? 0.8 : 1;
        return (
          <mesh key={i} position={[x, 0.13, 0]} rotation={[0, 0, done ? (i - slices / 2) * 0.03 : 0]} scale={[1, edge, edge]} castShadow>
            <boxGeometry args={[w * (done ? 0.86 : 1.001), 0.24, 0.3]} />
            <meshStandardMaterial attach="material-0" color="#f4e2b8" />
            <meshStandardMaterial attach="material-1" color="#f4e2b8" />
            <meshStandardMaterial attach="material-2" color="#c27a35" roughness={0.7} />
            <meshStandardMaterial attach="material-3" color="#a8662a" />
            <meshStandardMaterial attach="material-4" color="#c27a35" roughness={0.7} />
            <meshStandardMaterial attach="material-5" color="#c27a35" roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
};

// Montanha de pães que cresce até `at` (muitos pães numa malha só).
export const BreadPile = ({ t, from, at, ...g }: G & { t: number; from: number; at: number }) => {
  const geo = useMemo(() => new THREE.CapsuleGeometry(0.11, 0.26, 6, 12).rotateZ(Math.PI / 2), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c8843c', roughness: 0.7 }), []);
  const all = useMemo(() => {
    const out: V3[] = [];
    for (let i = 0; i < 160; i++) {
      const layer = Math.floor(Math.sqrt(i / 3));
      const r = Math.max(0.1, 1.5 - layer * 0.22) * Math.sqrt(rand(i + 1));
      const a = rand(i + 9) * Math.PI * 2;
      out.push([Math.cos(a) * r, 0.11 + layer * 0.17, Math.sin(a) * r * 0.7]);
    }
    return out.sort((p, q) => p[1] - q[1]);
  }, []);
  const n = Math.max(1, Math.round(all.length * seg(t, from, at - F, easeOut)));
  const items = useMemo(() => all.slice(0, n), [all, n]);
  return (
    <group {...g}>
      <Field key={n} items={items} geometry={geo} material={mat} />
    </group>
  );
};

// Copo d'água; `tilt` inclina; a água vira gotinhas paradas no ar.
export const Glass = ({ water = true, ...g }: G & { water?: boolean }) => (
  <group {...g}>
    <mesh castShadow>
      <cylinderGeometry args={[0.13, 0.1, 0.34, 24, 1, true]} />
      <meshStandardMaterial color="#dff3ff" transparent opacity={0.45} roughness={0.05} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, -0.17, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 0.02, 24]} />
      <meshStandardMaterial color="#dff3ff" transparent opacity={0.6} />
    </mesh>
    {water && (
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.22, 24]} />
        <meshStandardMaterial color="#4fb3e8" transparent opacity={0.75} roughness={0.1} />
      </mesh>
    )}
  </group>
);

export const Drops = ({ n = 7, spread = 0.35, ...g }: G & { n?: number; spread?: number }) => (
  <group {...g}>
    {Array.from({ length: n }, (_, i) => (
      <mesh key={i} position={[(rand(i) - 0.5) * spread, rand(i + 3) * spread * 0.8, (rand(i + 5) - 0.5) * spread * 0.5]} scale={[1, 1.3, 1]}>
        <sphereGeometry args={[0.03 + rand(i + 8) * 0.025, 10, 8]} />
        <meshStandardMaterial color="#4fb3e8" transparent opacity={0.85} roughness={0.05} />
      </mesh>
    ))}
  </group>
);

// Relógio de parede: os ponteiros andam até `stopAt` e congelam.
export const Clock = ({ t, stopAt = 9999, speed = 1.5, ...g }: G & { t: number; stopAt?: number; speed?: number }) => {
  const tt = Math.min(t, stopAt);
  return (
    <group {...g}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 40]} />
        <meshStandardMaterial color="#fffaf0" />
      </mesh>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.45, 0.05, 10, 40]} />
        <meshStandardMaterial color="#d22d2d" />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[Math.sin((i / 12) * Math.PI * 2) * 0.36, Math.cos((i / 12) * Math.PI * 2) * 0.36, 0.045]}>
          <circleGeometry args={[i % 3 === 0 ? 0.035 : 0.018, 12]} />
          <meshBasicMaterial color="#2a2a2a" />
        </mesh>
      ))}
      <group position={[0, 0, 0.05]} rotation={[0, 0, -tt * speed]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.02, 0.3, 0.01]} />
          <meshStandardMaterial color="#d22d2d" />
        </mesh>
      </group>
      <group position={[0, 0, 0.055]} rotation={[0, 0, -tt * speed * 0.08 - 1]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.04, 0.2, 0.01]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>
    </group>
  );
};

// Despertador no criado-mudo com etiqueta (+5 MIN).
export const AlarmClock = ({ t, at, ...g }: G & { t: number; at: number }) => {
  const k = seg(t, at - 6 * F, at, back);
  const ring = t < at - 6 * F ? Math.sin(t * 60) * 0.08 : 0;
  return (
    <group {...g}>
      <group rotation={[0, 0, ring]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.1, 32]} />
          <meshStandardMaterial color="#d22d2d" />
        </mesh>
        <mesh position={[0, 0.2, 0.051]}>
          <circleGeometry args={[0.14, 24]} />
          <meshBasicMaterial color="#fffaf0" />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.12, 0.38, 0]}>
            <sphereGeometry args={[0.06, 12, 8]} />
            <meshStandardMaterial color="#f2c62e" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
      </group>
      {k > 0.01 && <Sign text="+5 MIN" w={0.6} h={0.24} bg="#2f6fb3" fg="#ffffff" position={[0, 0.65, 0.05]} scale={k} />}
    </group>
  );
};

// Ponto de interrogação / exclamação em 3D (sprite de texto num cartão).
export const BigMark = ({ t, at, text = '?', color = '#ffd23a', ...g }: G & { t: number; at: number; text?: string; color?: string }) => {
  const k = seg(t, at - 6 * F, at, back);
  if (k <= 0.01) return null;
  const s = typeof g.scale === 'number' ? g.scale : 1;
  return (
    <sprite position={g.position} scale={[0.9 * k * s, 0.9 * k * s, 1]}>
      <spriteMaterial map={labelTex(text, { w: 256, h: 256, fg: color, size: 220 })} transparent depthTest={false} />
    </sprite>
  );
};

// Faixa de festa com bandeirinhas.
export const Bunting = ({ y = 3, z = -2.2, w = 7 }: { y?: number; z?: number; w?: number }) => {
  const cols = ['#e2557d', '#f2c62e', '#3c9ae0', '#4fa444', '#e07a3c'];
  const n = 14;
  return (
    <group position={[0, y, z]}>
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + (i + 0.5) * (w / n);
        const sag = -0.35 * (1 - Math.pow((2 * x) / w, 2));
        return (
          <mesh key={i} position={[x, sag - 0.12, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.16, 0.3, 3]} />
            <meshStandardMaterial color={cols[i % cols.length]} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
};
