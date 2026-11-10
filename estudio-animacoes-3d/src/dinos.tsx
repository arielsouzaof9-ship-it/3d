import { useMemo } from 'react';
import * as THREE from 'three';
import { back, rand, seg, V3 } from './anim';
import { Look } from './Character';
import { Box, WarmLights } from './sets';
import { canvasTex } from './textures';
import { F } from './timeline';

// ============================================================================
// "E se o asteroide tivesse errado?" — dinossauros, bichos e cenários.
// Todos olham para +Z (como os personagens) e são função pura do tempo.
// ============================================================================

type G = { position?: V3; rotation?: V3; scale?: number | V3 };
const M = ({ c, r = 0.7, e, ei = 0 }: { c: string; r?: number; e?: string; ei?: number }) => (
  <meshStandardMaterial color={c} roughness={r} emissive={e ?? '#000'} emissiveIntensity={ei} />
);

// Olho de desenho: branco + pupila (olhando para +Z local).
const Eye = ({ p, r = 0.12, look = [0, 0] as [number, number] }: { p: V3; r?: number; look?: [number, number] }) => (
  <group position={p}>
    <mesh>
      <sphereGeometry args={[r, 16, 12]} />
      <meshStandardMaterial color="#ffffff" roughness={0.3} />
    </mesh>
    <mesh position={[look[0] * r * 0.4, look[1] * r * 0.4, r * 0.62]}>
      <sphereGeometry args={[r * 0.5, 12, 10]} />
      <meshStandardMaterial color="#111" roughness={0.2} />
    </mesh>
  </group>
);

// Aparece com salto (escala 0 → 1) terminando na palavra.
export const pop = (t: number, at: number) => Math.max(0, seg(t, at - 6 * F, at, back));

// ---------- Terópode (T-rex; com s menor e outra cor vira o pequeno "raptor") ----------
export type DinoPose = { x: number; y: number; z: number; ry: number; walk: number; stride: number; jaw: number; hp: number; hy: number; tail: number; lean: number };
export const DINO: DinoPose = { x: 0, y: 0, z: 0, ry: 0, walk: 0, stride: 0, jaw: 0, hp: 0, hy: 0, tail: 0, lean: 0 };

export const TRex = ({ p, color = '#4f9a4a', belly = '#e2cf8a', s = 1, arms = 0.35, eyes = 0.14 }: { p: DinoPose; color?: string; belly?: string; s?: number; arms?: number; eyes?: number }) => {
  const ph = p.walk * Math.PI;
  const swing = Math.sin(ph) * 0.5 * p.stride;
  const bob = Math.abs(Math.sin(ph)) * 0.08 * p.stride;
  return (
    <group position={[p.x, p.y + bob * s, p.z]} rotation={[0, p.ry, 0]} scale={s}>
      {/* pernas */}
      {[1, -1].map((side) => (
        <group key={side} position={[side * 0.5, 1.6, -0.1]} rotation={[side * swing, 0, 0]}>
          <mesh position={[0, -0.3, 0.05]} scale={[0.42, 0.7, 0.6]} castShadow>
            <sphereGeometry args={[1, 20, 14]} />
            <M c={color} />
          </mesh>
          <mesh position={[0, -1.0, -0.05]} castShadow>
            <cylinderGeometry args={[0.15, 0.19, 1.0, 12]} />
            <M c={color} />
          </mesh>
          <mesh position={[0, -1.52, 0.18]} castShadow>
            <boxGeometry args={[0.4, 0.16, 0.7]} />
            <M c="#3a5a32" />
          </mesh>
        </group>
      ))}
      <group position={[0, 1.95, 0]} rotation={[p.lean - 0.12, 0, 0]}>
        {/* corpo e barriga */}
        <mesh scale={[0.8, 0.78, 1.25]} castShadow>
          <sphereGeometry args={[1, 28, 20]} />
          <M c={color} />
        </mesh>
        <mesh position={[0, -0.18, 0.38]} scale={[0.6, 0.55, 0.85]}>
          <sphereGeometry args={[1, 24, 16]} />
          <M c={belly} />
        </mesh>
        {/* espinhos nas costas */}
        {[-0.6, -0.15, 0.3].map((z, i) => (
          <mesh key={z} position={[0, 0.74 - i * 0.02, z]} rotation={[-0.3, 0, 0]}>
            <coneGeometry args={[0.12, 0.3, 6]} />
            <M c="#2f6a33" />
          </mesh>
        ))}
        {/* cauda */}
        <group position={[0, 0.0, -1.0]} rotation={[0.12, p.tail, 0]}>
          <mesh position={[0, 0, -1.2]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
            <coneGeometry args={[0.55, 2.6, 18]} />
            <M c={color} />
          </mesh>
        </group>
        {/* bracinhos */}
        {[1, -1].map((side) => (
          <group key={side} position={[side * 0.55, -0.1, 0.85]} rotation={[0.9, 0, side * 0.3]}>
            <mesh position={[0, -arms / 2, 0]}>
              <cylinderGeometry args={[0.06, 0.05, arms, 8]} />
              <M c={color} />
            </mesh>
          </group>
        ))}
        {/* pescoço + cabeça */}
        <mesh position={[0, 0.45, 0.95]} rotation={[0.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.5, 0.9, 16]} />
          <M c={color} />
        </mesh>
        <group position={[0, 0.85, 1.2]} rotation={[p.hp + 0.12 - p.lean, p.hy, 0]}>
          {/* crânio + focinho */}
          <mesh position={[0, 0.2, 0.3]} scale={[0.5, 0.46, 0.62]} castShadow>
            <sphereGeometry args={[1, 24, 18]} />
            <M c={color} />
          </mesh>
          <mesh position={[0, 0.08, 0.82]} scale={[0.4, 0.27, 0.55]} castShadow>
            <sphereGeometry args={[1, 24, 16]} />
            <M c={color} />
          </mesh>
          <mesh position={[0.13, 0.2, 1.3]}>
            <sphereGeometry args={[0.035, 8, 6]} />
            <M c="#1c2a1a" />
          </mesh>
          <mesh position={[-0.13, 0.2, 1.3]}>
            <sphereGeometry args={[0.035, 8, 6]} />
            <M c="#1c2a1a" />
          </mesh>
          {/* boca por dentro */}
          <mesh position={[0, -0.12, 0.72]} scale={[0.34, 0.1, 0.5]}>
            <sphereGeometry args={[1, 16, 10]} />
            <meshStandardMaterial color="#8a1f2a" />
          </mesh>
          {/* dentes de cima */}
          {[-0.27, -0.12, 0.12, 0.27].map((x) =>
            [0.75, 1.05].map((z) => (
              <mesh key={`${x}${z}`} position={[x * (z > 0.9 ? 0.7 : 1), -0.17, z]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.04, 0.12, 6]} />
                <meshStandardMaterial color="#fffbe8" />
              </mesh>
            )),
          )}
          {/* mandíbula */}
          <group position={[0, -0.08, 0.2]} rotation={[p.jaw, 0, 0]}>
            <mesh position={[0, -0.1, 0.5]} scale={[0.36, 0.13, 0.62]} castShadow>
              <sphereGeometry args={[1, 20, 12]} />
              <M c={color} />
            </mesh>
          </group>
          <Eye p={[0.3, 0.45, 0.5]} r={eyes} />
          <Eye p={[-0.3, 0.45, 0.5]} r={eyes} />
          {[1, -1].map((side) => (
            <mesh key={side} position={[side * 0.3, 0.63, 0.52]} rotation={[0, 0, side * -0.3]}>
              <boxGeometry args={[0.26, 0.06, 0.08]} />
              <M c="#2a4a28" />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

// ---------- Pescoçudo (saurópode) ----------
export const Pescocudo = ({ t, color = '#b8875a', ...g }: G & { t: number; color?: string }) => {
  const sway = Math.sin(t * 0.9) * 0.12;
  const neck = Array.from({ length: 18 }, (_, i) => {
    const k = i / 17;
    return { p: [Math.sin(k * 2) * sway * 4, 3.0 + k * 3.4, 1.6 + Math.sin(k * 1.4) * 2.2] as V3, r: 0.55 - k * 0.25 };
  });
  const head = neck[neck.length - 1].p;
  return (
    <group {...g}>
      <mesh position={[0, 2.7, 0]} scale={[1.4, 1.15, 2.1]} castShadow>
        <sphereGeometry args={[1, 28, 20]} />
        <M c={color} />
      </mesh>
      {[1, -1].map((sx) =>
        [1.2, -1.2].map((z) => (
          <mesh key={`${sx}${z}`} position={[sx * 0.8, 1.0, z]} castShadow>
            <cylinderGeometry args={[0.32, 0.36, 2.1, 14]} />
            <M c={color} />
          </mesh>
        )),
      )}
      {neck.map((n, i) => (
        <mesh key={i} position={n.p} castShadow>
          <sphereGeometry args={[n.r, 16, 12]} />
          <M c={color} />
        </mesh>
      ))}
      <group position={head}>
        <mesh position={[0, 0.05, 0.25]} scale={[0.38, 0.32, 0.55]} castShadow>
          <sphereGeometry args={[1, 18, 14]} />
          <M c={color} />
        </mesh>
        <Eye p={[0.26, 0.18, 0.35]} r={0.1} />
        <Eye p={[-0.26, 0.18, 0.35]} r={0.1} />
      </group>
      {Array.from({ length: 7 }, (_, i) => {
        const k = i / 6;
        return (
          <mesh key={i} position={[Math.sin(t * 0.8 + k * 2) * 0.3 * k, 2.8 - k * 1.8, -2.0 - k * 3]} castShadow>
            <sphereGeometry args={[0.55 - k * 0.4, 14, 10]} />
            <M c={color} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- Mamífero pequenino (nosso ancestral) ----------
export const Ratinho = ({ t, tremble = 0, look = [0, 0] as [number, number], ...g }: G & { t: number; tremble?: number; look?: [number, number] }) => (
  <group {...g}>
    <group position={[Math.sin(t * 70) * 0.012 * tremble, 0, 0]}>
      <mesh position={[0, 0.17, 0]} scale={[0.17, 0.15, 0.24]} castShadow>
        <sphereGeometry args={[1, 18, 14]} />
        <M c="#8a6a4a" />
      </mesh>
      <mesh position={[0, 0.28, 0.2]} castShadow>
        <sphereGeometry args={[0.13, 18, 14]} />
        <M c="#9a7a58" />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} position={[s * 0.1, 0.41, 0.17]} scale={[1, 1, 0.4]}>
          <sphereGeometry args={[0.065, 12, 10]} />
          <M c="#e7a3a3" />
        </mesh>
      ))}
      <mesh position={[0, 0.25, 0.33]}>
        <sphereGeometry args={[0.025, 10, 8]} />
        <M c="#e86a8a" />
      </mesh>
      <Eye p={[0.055, 0.31, 0.29]} r={0.042} look={look} />
      <Eye p={[-0.055, 0.31, 0.29]} r={0.042} look={look} />
      <mesh position={[0, 0.1, -0.35]} rotation={[0.9, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.02, 0.35, 6]} />
        <M c="#c98a8a" />
      </mesh>
    </group>
  </group>
);

// ---------- Ave (galinha ou passarinho) ----------
export const Ave = ({ body = '#fbfaf5', comb = true, peck = 0, ...g }: G & { body?: string; comb?: boolean; peck?: number }) => (
  <group {...g}>
    {[1, -1].map((s) => (
      <group key={s} position={[s * 0.1, 0, 0]}>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.34, 6]} />
          <M c="#e6a72a" />
        </mesh>
        <mesh position={[0, 0.01, 0.05]}>
          <boxGeometry args={[0.1, 0.02, 0.14]} />
          <M c="#e6a72a" />
        </mesh>
      </group>
    ))}
    <mesh position={[0, 0.52, 0]} scale={[0.3, 0.28, 0.36]} castShadow>
      <sphereGeometry args={[1, 20, 16]} />
      <M c={body} />
    </mesh>
    <mesh position={[0, 0.62, -0.36]} rotation={[0.8, 0, 0]} castShadow>
      <coneGeometry args={[0.16, 0.3, 10]} />
      <M c={body} />
    </mesh>
    {[1, -1].map((s) => (
      <mesh key={s} position={[s * 0.27, 0.53, -0.02]} scale={[0.06, 0.18, 0.26]}>
        <sphereGeometry args={[1, 12, 10]} />
        <M c={body} />
      </mesh>
    ))}
    <group position={[0, 0.82, 0.2]} rotation={[peck, 0, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.16, 18, 14]} />
        <M c={body} />
      </mesh>
      <mesh position={[0, -0.02, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.05, 0.12, 8]} />
        <M c="#f2b12e" />
      </mesh>
      {comb && (
        <>
          {[-0.05, 0.02, 0.09].map((z) => (
            <mesh key={z} position={[0, 0.15, z]}>
              <sphereGeometry args={[0.045, 10, 8]} />
              <M c="#d6302e" />
            </mesh>
          ))}
          <mesh position={[0, -0.12, 0.13]}>
            <sphereGeometry args={[0.04, 10, 8]} />
            <M c="#d6302e" />
          </mesh>
        </>
      )}
      <Eye p={[0.1, 0.04, 0.1]} r={0.05} />
      <Eye p={[-0.1, 0.04, 0.1]} r={0.05} />
    </group>
  </group>
);

// ---------- Dinossauroide (usa o corpo padrão dos personagens) ----------
export const DINOSSAUROIDE: Look = {
  skin: '#86b86b', jacket: '#86b86b', pants: '#76a85b', shoes: '#3f5f33', gloves: '#3f5f33', hair: '#86b86b', hairStyle: 'nenhum', body: 'magro',
};
export const CIDADAOS: Look[] = [
  { ...DINOSSAUROIDE, jacket: '#2f4f8f', shirt: '#ffffff', tie: '#c22a2a', pants: '#1f2a44' },
  { ...DINOSSAUROIDE, skin: '#c9a24a', gloves: '#6a5020', shoes: '#4a3a1a', jacket: '#d8352f', pants: '#2c3346' },
  { ...DINOSSAUROIDE, skin: '#5aa0a0', gloves: '#2a5a5a', shoes: '#2a3a3a', jacket: '#f2c62e', pants: '#3b3a36', hat: 'bone', hatColor: '#2a2a2a' },
];

// ---------- Espaço: estrelas, Terra e asteroide ----------
const Estrelas = () => {
  const geo = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 900; i++) {
      const u = rand(i) * 2 - 1;
      const a = rand(i + 1000) * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      pts.push(Math.cos(a) * r * 120, u * 120, Math.sin(a) * r * 120);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <points geometry={geo}>
      <pointsMaterial color="#ffffff" size={0.5} sizeAttenuation fog={false} />
    </points>
  );
};

const terraTex = () =>
  canvasTex('terra', 1024, 512, (c) => {
    c.fillStyle = '#2f7fd0';
    c.fillRect(0, 0, 1024, 512);
    const blob = (x: number, y: number, r: number, col: string, seed: number) => {
      c.fillStyle = col;
      for (let i = 0; i < 14; i++) {
        c.beginPath();
        c.arc(x + (rand(seed + i) - 0.5) * r * 1.6, y + (rand(seed + i + 50) - 0.5) * r, r * (0.35 + rand(seed + i + 90) * 0.4), 0, Math.PI * 2);
        c.fill();
      }
    };
    [[180, 180, 110], [330, 330, 90], [560, 160, 130], [600, 300, 80], [820, 230, 120], [900, 380, 60]].forEach(([x, y, r], i) => blob(x, y, r, '#4f9a4a', i * 31));
    [[560, 200, 50], [820, 250, 40]].forEach(([x, y, r], i) => blob(x, y, r, '#c9a35a', i * 17 + 400));
    c.fillStyle = '#f4f8ff';
    c.fillRect(0, 0, 1024, 30);
    c.fillRect(0, 482, 1024, 30);
    c.globalAlpha = 0.55;
    for (let i = 0; i < 30; i++) {
      c.beginPath();
      c.ellipse(rand(i + 7) * 1024, 60 + rand(i + 77) * 390, 40 + rand(i + 3) * 70, 10 + rand(i + 5) * 12, 0, 0, Math.PI * 2);
      c.fill();
    }
  });

export const Terra = ({ t, r = 6, ...g }: G & { t: number; r?: number }) => (
  <group {...g}>
    <mesh rotation={[0.35, t * 0.12, 0]}>
      <sphereGeometry args={[r, 64, 48]} />
      <meshStandardMaterial map={terraTex()} roughness={0.8} />
    </mesh>
    <mesh>
      <sphereGeometry args={[r * 1.04, 48, 32]} />
      <meshStandardMaterial color="#8fd0ff" transparent opacity={0.18} emissive="#4aa0ff" emissiveIntensity={0.4} depthWrite={false} />
    </mesh>
  </group>
);

export const Asteroide = ({ t, trail = 1, ...g }: G & { t: number; trail?: number }) => {
  const craters = useMemo(() => Array.from({ length: 9 }, (_, i) => new THREE.Vector3(rand(i) - 0.5, rand(i + 20) - 0.5, rand(i + 40) - 0.5).normalize()), []);
  return (
    <group {...g}>
      <group rotation={[t * 0.7, t * 0.4, 0]}>
        <mesh castShadow>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#6d5f55" roughness={1} flatShading />
        </mesh>
        {craters.map((v, i) => (
          <mesh key={i} position={[v.x * 0.92, v.y * 0.92, v.z * 0.92]} scale={0.12 + rand(i + 9) * 0.12}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#3e352f" roughness={1} />
          </mesh>
        ))}
      </group>
      {trail > 0 && (
        <>
          <mesh position={[0, 0, 2.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.95, 3.6, 24, 1, true]} />
            <meshBasicMaterial color="#ff8a3a" transparent opacity={0.45 * trail} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 1.3]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.75, 1.8, 24, 1, true]} />
            <meshBasicMaterial color="#ffd36a" transparent opacity={0.6 * trail} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
    </group>
  );
};

export const Espaco = () => (
  <group>
    <WarmLights sun={[-12, 6, 8]} bg="#04050d" sky="#9fb4ff" ground="#05060a" power={2.6} fill={0.35} fog={[300, 500]} />
    <Estrelas />
  </group>
);

// ---------- Floresta pré-histórica ----------
const Palmeira = ({ h = 5, ...g }: G & { h?: number }) => (
  <group {...g}>
    <mesh position={[0, h / 2, 0]} castShadow>
      <cylinderGeometry args={[0.16, 0.28, h, 10]} />
      <M c="#8a6038" />
    </mesh>
    {Array.from({ length: 7 }, (_, i) => (
      <group key={i} position={[0, h, 0]} rotation={[0, (i / 7) * Math.PI * 2, 0]}>
        <mesh position={[0, -0.25, 1.1]} rotation={[0.45, 0, 0]} castShadow>
          <boxGeometry args={[0.55, 0.05, 2.3]} />
          <M c={i % 2 ? '#3f8a3a' : '#4f9a40'} />
        </mesh>
      </group>
    ))}
  </group>
);
const Samambaia = (g: G) => (
  <group {...g}>
    {Array.from({ length: 5 }, (_, i) => (
      <mesh key={i} position={[0, 0.3, 0]} rotation={[0.7, (i / 5) * Math.PI * 2, 0]} castShadow>
        <coneGeometry args={[0.18, 1.0, 6]} />
        <M c="#4a8a3a" />
      </mesh>
    ))}
  </group>
);

export const Jurassico = ({ t, night = false }: { t: number; night?: boolean }) => {
  const plants = useMemo(() => {
    const out: { p: V3; k: 'p' | 's'; h: number }[] = [];
    for (let i = 0; i < 46; i++) {
      const a = rand(i) * Math.PI * 2;
      const r = 6 + rand(i + 300) * 22;
      out.push({ p: [Math.cos(a) * r, 0, Math.sin(a) * r - 4], k: rand(i + 600) > 0.45 ? 'p' : 's', h: 4 + rand(i + 900) * 3 });
    }
    return out;
  }, []);
  return (
    <group>
      {night ? (
        <>
          <WarmLights sun={[-6, 9, 4]} bg="#121a36" sky="#5d6fb0" ground="#141420" power={0.6} fill={0.55} fog={[10, 36]} />
          <directionalLight position={[6, 8, 8]} intensity={0.6} color="#8fa8ff" />
          <mesh position={[8, 12, -30]}>
            <sphereGeometry args={[1.6, 24, 16]} />
            <meshBasicMaterial color="#fff6d8" />
          </mesh>
        </>
      ) : (
        <WarmLights sun={[-7, 8, 6]} bg="#f6b67c" sky="#fff0d0" ground="#5a6a2a" power={2.3} fog={[18, 60]} />
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={night ? '#2e3d22' : '#8a9a42'} roughness={0.95} />
      </mesh>
      {plants.map((pl, i) => (pl.k === 'p' ? <Palmeira key={i} position={pl.p} h={pl.h} /> : <Samambaia key={i} position={pl.p} scale={1 + rand(i) * 0.8} />))}
      {[-3.5, 3.8, -5.2, 5.5].map((x, i) => (
        <Samambaia key={`n${x}`} position={[x, 0, -2.5 - i * 0.6]} scale={1.3} />
      ))}
      <group position={[-16, 0, -42]}>
        <mesh position={[0, 4.5, 0]}>
          <coneGeometry args={[9, 9, 24, 1, true]} />
          <M c="#6a4a3a" />
        </mesh>
        <mesh position={[0, 8.7, 0]}>
          <cylinderGeometry args={[1.6, 1.8, 0.4, 20]} />
          <meshStandardMaterial color="#ff6a2a" emissive="#ff4a1a" emissiveIntensity={1.5} />
        </mesh>
        {Array.from({ length: 6 }, (_, i) => {
          const k = (t * 0.12 + i / 6) % 1;
          return (
            <mesh key={i} position={[k * 3, 9 + k * 9, 0]} scale={1 + k * 3}>
              <sphereGeometry args={[1, 12, 10]} />
              <meshStandardMaterial color="#8a8079" transparent opacity={0.6 * (1 - k)} depthWrite={false} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

// Toca do ratinho (montinho de terra com buraco).
export const Toca = (g: G) => (
  <group {...g}>
    <mesh position={[0, 0, 0]} scale={[1.1, 0.6, 0.9]} castShadow receiveShadow>
      <sphereGeometry args={[1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <M c="#5a4030" r={1} />
    </mesh>
    <mesh position={[0, 0.22, 0.82]} rotation={[-0.35, 0, 0]}>
      <circleGeometry args={[0.32, 24]} />
      <meshBasicMaterial color="#0d0806" />
    </mesh>
  </group>
);

// Poste de cerca simples (para o passarinho pousar).
export const Poste = (g: G) => (
  <group {...g}>
    <Box p={[0, 0.8, 0]} s={[0.22, 1.6, 0.22]} c="#8a6038" />
  </group>
);
