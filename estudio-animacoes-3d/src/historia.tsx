import * as THREE from 'three';
import { clamp01, easeOut, rand, seg, V3 } from './anim';
import { Look } from './Character';
import { ELENCO } from './personagens';
import { WarmLights } from './sets';
import { F } from './timeline';
import { canvasTex } from './textures';

// ============================================================================
// Cenário, objetos e figurinos do vídeo "Green Boots" (Everest).
// Tudo calculado a partir de t (nada de estado acumulado).
// ============================================================================

type G = { position?: V3; rotation?: V3; scale?: number | V3 };
const MAO = '#1e1f24';
export const VERDE_BOTA = '#3faa3a';

// ---------- Figurinos ----------
const alpinista = (o: Partial<Look>): Look => ({
  skin: '#d9a57c', jacket: '#d8352f', pattern: 'acolchoado', pattern2: '#a82522', pants: '#2a2f45', shoes: '#2a2a2a',
  gloves: MAO, hair: '#1a120c', hat: 'gorro', hatColor: '#f2c14e', backpack: '#3a4a6a', ...o,
});
// Você de alpinista (amarelo).
export const VOCE_ALP = alpinista({ skin: ELENCO.voce.look.skin, hair: ELENCO.voce.look.hair, jacket: '#f0b323', pattern2: '#c98d10', hatColor: '#2f6fd1', scarf: '#2f6fd1' });
// O alpinista das botas verdes (representação genérica, sem retrato).
export const ALP_BOTAS = alpinista({ skin: '#a36a45', jacket: '#d8352f', shoes: VERDE_BOTA, hatColor: '#2b2b2b', pants: '#5a2a2a' });
// Companheiros de equipe.
export const ALP_2 = alpinista({ skin: '#a36a45', jacket: '#2f6fd1', pattern2: '#1f4f9f', hatColor: '#d8352f' });
export const ALP_3 = alpinista({ skin: '#6e4329', jacket: '#7a4fb3', pattern2: '#5a3593', hatColor: '#f2f2f2' });

// ---------- Texturas ----------
const flakeTex = () =>
  canvasTex('flake', 64, 64, (c) => {
    const g = c.createRadialGradient(32, 32, 2, 32, 32, 30);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 64, 64);
  });

// ---------- Pedras ----------
const Rock = ({ p, s, r = [0, 0, 0], c = '#6d6458' }: { p: V3; s: V3; r?: V3; c?: string }) => (
  <mesh position={p} scale={s} rotation={r} castShadow receiveShadow>
    <dodecahedronGeometry args={[1, 0]} />
    <meshStandardMaterial color={c} roughness={0.95} flatShading />
  </mesh>
);

// ---------- Montanha (cenário) ----------
// storm 0..1 escurece o céu e fecha a névoa.
export const Mountain = ({ storm = 0, flags = true }: { storm?: number; flags?: boolean }) => {
  const bg = new THREE.Color('#f3c79e').lerp(new THREE.Color('#5f6b7d'), storm).getStyle();
  const fogFar = 60 - 42 * storm;
  return (
    <group>
      <WarmLights sun={[-6, 8, 6]} bg={bg} sky="#fff4e6" ground="#9fb3c8" power={2.4 - 1.2 * storm} fill={1.0} fog={[10 - 4 * storm, fogFar]} />
      {/* encosta de neve */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#eef3f8" roughness={0.85} />
      </mesh>
      {/* pedras da crista */}
      <Rock p={[-2.6, 0.3, -1.5]} s={[0.9, 0.6, 0.8]} />
      <Rock p={[2.8, 0.4, -2.2]} s={[1.1, 0.8, 0.9]} r={[0.3, 0.5, 0]} />
      <Rock p={[-1.6, 0.15, 1.6]} s={[0.4, 0.25, 0.35]} c="#7a7064" />
      <Rock p={[1.9, 0.2, 1.2]} s={[0.5, 0.3, 0.4]} r={[0.2, 1, 0]} c="#7a7064" />
      {/* picos ao fundo */}
      {[[-14, -30, 16], [6, -38, 22], [22, -34, 14], [-30, -42, 18], [0, -24, 9]].map(([x, z, h], i) => (
        <group key={i} position={[x, -0.5, z]}>
          <mesh castShadow>
            <coneGeometry args={[h * 0.65, h, 5]} />
            <meshStandardMaterial color="#8a8f99" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0, h * 0.3, 0]}>
            <coneGeometry args={[h * 0.65 * 0.42, h * 0.42, 5]} />
            <meshStandardMaterial color="#ffffff" roughness={0.7} flatShading />
          </mesh>
        </group>
      ))}
      {/* corda fixa da rota */}
      <mesh position={[0.6, 0.35, -3]} rotation={[0, 0, Math.PI / 2 - 0.12]}>
        <cylinderGeometry args={[0.012, 0.012, 14, 6]} />
        <meshStandardMaterial color="#e2412e" />
      </mesh>
      {/* bandeirinhas de oração */}
      {flags &&
        Array.from({ length: 14 }, (_, i) => {
          const x = -4 + i * 0.6;
          const y = 2.7 - Math.sin((i / 13) * Math.PI) * 0.5;
          const cores = ['#2f6fd1', '#f2f2f2', '#d8352f', '#3faa3a', '#f2c14e'];
          return (
            <mesh key={i} position={[x, y, -4]} rotation={[0, 0, Math.sin(i) * 0.1]}>
              <planeGeometry args={[0.36, 0.42]} />
              <meshStandardMaterial color={cores[i % 5]} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
      {flags &&
        [-4.3, 4.3].map((x) => (
          <mesh key={x} position={[x, 1.4, -4]}>
            <cylinderGeometry args={[0.04, 0.05, 2.8, 8]} />
            <meshStandardMaterial color="#5a3a22" />
          </mesh>
        ))}
    </group>
  );
};

// ---------- Caverna de pedra (nicho na rocha) ----------
// Abertura virada para +Z, centro em (0, 0, -0.6). Interior escuro.
export const Cave = (g: G) => (
  <group {...g}>
    <Rock p={[-1.25, 0.8, -0.6]} s={[0.75, 1.1, 1.0]} r={[0, 0.3, 0.1]} />
    <Rock p={[1.25, 0.75, -0.6]} s={[0.75, 1.0, 1.0]} r={[0.2, -0.4, 0]} />
    <Rock p={[0, 1.75, -0.7]} s={[1.9, 0.6, 1.2]} r={[0.1, 0.2, 0.05]} c="#5f574d" />
    <Rock p={[0, 0.9, -1.6]} s={[1.5, 1.2, 0.6]} c="#4a443c" />
    <mesh position={[0, 0.02, -0.7]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.9, 24]} />
      <meshStandardMaterial color="#5a544c" roughness={1} />
    </mesh>
  </group>
);

// Par de botas verdes saindo da caverna (só as botas e a canela, sem mostrar o corpo).
export const GreenBoots = ({ glow = 0, ...g }: G & { glow?: number }) => (
  <group {...g}>
    {[-0.16, 0.16].map((x, i) => (
      <group key={x} position={[x, 0.14, 0]} rotation={[0, i ? -0.15 : 0.12, 0]}>
        <mesh position={[0, 0.02, -0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.08, 0.5, 12]} />
          <meshStandardMaterial color="#5a2a2a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.02]} castShadow>
          <boxGeometry args={[0.2, 0.24, 0.3]} />
          <meshStandardMaterial color={VERDE_BOTA} roughness={0.45} emissive={VERDE_BOTA} emissiveIntensity={0.15 + 0.35 * glow} />
        </mesh>
        <mesh position={[0, -0.04, 0.17]} castShadow>
          <boxGeometry args={[0.18, 0.2, 0.12]} />
          <meshStandardMaterial color={VERDE_BOTA} roughness={0.45} emissive={VERDE_BOTA} emissiveIntensity={0.15 + 0.35 * glow} />
        </mesh>
        <mesh position={[0, -0.13, 0.04]}>
          <boxGeometry args={[0.21, 0.04, 0.46]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    ))}
  </group>
);

// ---------- Neve / nevasca ----------
// k 0..1 = intensidade; vento empurra para +X.
export const Snow = ({ t, k = 1, n = 140, area = 6, center = [0, 0, 0] as V3, wind = 2 }: { t: number; k?: number; n?: number; area?: number; center?: V3; wind?: number }) => {
  const m = Math.round(n * clamp01(k));
  return (
    <>
      {Array.from({ length: m }, (_, i) => {
        const sp = 1.2 + rand(i * 3) * 1.4;
        const ph = rand(i * 7 + 1);
        const fall = (ph + t * sp * 0.25) % 1;
        const x = center[0] + (rand(i * 11 + 2) - 0.5) * area + ((fall * wind * k) % area);
        const y = center[1] + 4.5 * (1 - fall);
        const z = center[2] + (rand(i * 13 + 5) - 0.5) * area * 0.6;
        const s = 0.05 + rand(i * 17) * 0.06;
        return (
          <sprite key={i} position={[x - (wind * k) / 2, y, z]} scale={[s, s, 1]}>
            <spriteMaterial map={flakeTex()} transparent depthWrite={false} />
          </sprite>
        );
      })}
    </>
  );
};

// ---------- Termômetro que despenca até `at` ----------
export const Thermometer = ({ t, from, at, ...g }: G & { t: number; from: number; at: number }) => {
  const k = seg(t, from, at - F, easeOut);
  const lvl = 0.85 - 0.75 * k;
  const cor = new THREE.Color('#e03a2f').lerp(new THREE.Color('#3a8ee0'), k).getStyle();
  return (
    <group {...g}>
      <mesh castShadow>
        <boxGeometry args={[0.42, 1.7, 0.08]} />
        <meshStandardMaterial color="#f4efe2" />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.05, 0.05, 1.3, 12]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, -0.65 + (1.3 * lvl) / 2, 0.06]}>
        <cylinderGeometry args={[0.035, 0.035, 1.3 * lvl, 12]} />
        <meshBasicMaterial color={cor} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.7, 0.06]}>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshBasicMaterial color={cor} toneMapped={false} />
      </mesh>
      {[0.3, 0, -0.3].map((y) => (
        <mesh key={y} position={[0.11, y, 0.045]}>
          <boxGeometry args={[0.08, 0.015, 0.01]} />
          <meshStandardMaterial color="#444" />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Cilindro de oxigênio ----------
export const OxygenTank = (g: G) => (
  <group {...g}>
    <mesh position={[0, 0.45, 0]} castShadow>
      <cylinderGeometry args={[0.16, 0.16, 0.8, 20]} />
      <meshStandardMaterial color="#e8862a" roughness={0.4} metalness={0.3} />
    </mesh>
    <mesh position={[0, 0.88, 0]}>
      <sphereGeometry args={[0.16, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#e8862a" roughness={0.4} metalness={0.3} />
    </mesh>
    <mesh position={[0, 1.0, 0]}>
      <cylinderGeometry args={[0.04, 0.04, 0.12, 10]} />
      <meshStandardMaterial color="#9a9a9a" metalness={0.8} />
    </mesh>
  </group>
);

// Bandeira de cume.
export const SummitFlag = ({ t, ...g }: G & { t: number }) => (
  <group {...g}>
    <mesh position={[0, 0.8, 0]} castShadow>
      <cylinderGeometry args={[0.025, 0.03, 1.6, 8]} />
      <meshStandardMaterial color="#d9d9d9" metalness={0.6} />
    </mesh>
    <mesh position={[0.28, 1.4, 0]} rotation={[0, Math.sin(t * 3) * 0.25, 0]}>
      <planeGeometry args={[0.55, 0.36]} />
      <meshStandardMaterial color="#f2c14e" side={THREE.DoubleSide} />
    </mesh>
  </group>
);

// Escala de 0..1 que "nasce" em `at` com overshoot (para objetos que aparecem na palavra).
export const pop = (t: number, at: number) => Math.max(0.001, seg(t, at - 6 * F, at - F, easeOut));

// Pilha de pedras com bandeirinha (memorial simples).
export const Cairn = ({ flag = '#d8352f', ...g }: G & { flag?: string }) => (
  <group {...g}>
    {[0.32, 0.25, 0.18, 0.11].map((r, i) => (
      <mesh key={i} position={[(i % 2 ? 0.03 : -0.02), 0.08 + i * 0.15, 0]} scale={[r, 0.09, r * 0.85]} rotation={[0, i, 0]} castShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={i % 2 ? '#7a7064' : '#655c51'} roughness={0.95} flatShading />
      </mesh>
    ))}
    <mesh position={[0, 0.9, 0]}>
      <cylinderGeometry args={[0.015, 0.015, 0.7, 6]} />
      <meshStandardMaterial color="#5a3a22" />
    </mesh>
    <mesh position={[0.13, 1.12, 0]}>
      <planeGeometry args={[0.24, 0.16]} />
      <meshStandardMaterial color={flag} side={THREE.DoubleSide} />
    </mesh>
  </group>
);
