import * as THREE from 'three';
import { clamp01, easeOut, seg, V3 } from './anim';
import { F } from './timeline';
import { labelTex } from './textures';

// Objetos novos do vídeo "água no corpo". Tudo calculado a partir de t.
type G = { position?: V3; rotation?: V3; scale?: number | V3 };
const AGUA = '#3fa9e0';

// Tanque de vidro que enche e pousa no nível `value` (0..1) exatamente na palavra `at`.
export const WaterTank = ({ t, from, at, value, label, ...g }: G & { t: number; from: number; at: number; value: number; label: string }) => {
  const k = seg(t, from, at - F, easeOut);
  const lvl = Math.max(0.001, value * k);
  const h = 1.8;
  const show = t >= at - F;
  return (
    <group {...g}>
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.66, 0.12, 40]} />
        <meshStandardMaterial color="#2a3440" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.12 + (h * lvl) / 2, 0]}>
        <cylinderGeometry args={[0.5, 0.5, h * lvl, 40]} />
        <meshStandardMaterial color={AGUA} roughness={0.2} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.12 + h / 2, 0]}>
        <cylinderGeometry args={[0.55, 0.55, h, 40, 1, true]} />
        <meshStandardMaterial color="#dff3ff" roughness={0.05} transparent opacity={0.28} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.12 + h * value, 0.56]}>
        <boxGeometry args={[0.3, 0.025, 0.02]} />
        <meshStandardMaterial color="#d22d2d" />
      </mesh>
      {show && (
        <mesh position={[0, 0.12 + h * 0.4, 0.57]} scale={1 + 0.15 * Math.max(0, 1 - (t - at) / 0.2)}>
          <planeGeometry args={[0.85, 0.36]} />
          <meshBasicMaterial map={labelTex(label, { w: 512, h: 216, bg: '#ffffff', fg: '#1d5f8a', radius: 30 })} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

// Cérebro cartunesco; `dry` 0..1 deixa ele cinza e murcho (falta de água).
export const Brain = ({ dry = 0, ...g }: G & { dry?: number }) => {
  const c = new THREE.Color('#f29bb0').lerp(new THREE.Color('#b9a8a8'), dry);
  const s = 1 - 0.15 * dry;
  const folds: V3[] = [[-0.22, 0.12, 0.2], [0.2, 0.15, 0.22], [0, 0.28, 0.12], [-0.3, -0.05, 0.12], [0.3, -0.03, 0.14], [0.05, 0.0, 0.32]];
  return (
    <group {...g} scale={s}>
      <mesh scale={[1, 0.78, 0.85]} castShadow>
        <sphereGeometry args={[0.45, 32, 24]} />
        <meshStandardMaterial color={c} roughness={0.55} />
      </mesh>
      {folds.map((p, i) => (
        <mesh key={i} position={p} rotation={[0.4 * i, 0.7 * i, 0.3]}>
          <torusGeometry args={[0.12, 0.025, 8, 20, Math.PI * 1.3]} />
          <meshStandardMaterial color={c.clone().multiplyScalar(0.85)} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, -0.36, 0]}>
        <cylinderGeometry args={[0.07, 0.05, 0.22, 12]} />
        <meshStandardMaterial color={c} roughness={0.6} />
      </mesh>
    </group>
  );
};

// Gota d'água.
export const Drop = ({ color = AGUA, ...g }: G & { color?: string }) => (
  <group {...g}>
    <mesh castShadow>
      <sphereGeometry args={[0.12, 20, 16]} />
      <meshStandardMaterial color={color} roughness={0.15} />
    </mesh>
    <mesh position={[0, 0.12, 0]}>
      <coneGeometry args={[0.105, 0.17, 20]} />
      <meshStandardMaterial color={color} roughness={0.15} />
    </mesh>
  </group>
);

// Garrafa de água com rótulo.
export const Bottle = ({ label = '1 L', ...g }: G & { label?: string }) => (
  <group {...g}>
    <mesh position={[0, 0.35, 0]} castShadow>
      <cylinderGeometry args={[0.16, 0.16, 0.7, 24]} />
      <meshStandardMaterial color="#9fd6f5" roughness={0.1} transparent opacity={0.85} />
    </mesh>
    <mesh position={[0, 0.76, 0]}>
      <cylinderGeometry args={[0.06, 0.16, 0.14, 24]} />
      <meshStandardMaterial color="#9fd6f5" roughness={0.1} transparent opacity={0.85} />
    </mesh>
    <mesh position={[0, 0.86, 0]}>
      <cylinderGeometry args={[0.065, 0.065, 0.07, 16]} />
      <meshStandardMaterial color="#1f6fb2" />
    </mesh>
    <mesh position={[0, 0.38, 0.162]}>
      <planeGeometry args={[0.28, 0.2]} />
      <meshStandardMaterial map={labelTex(label, { w: 256, h: 184, bg: '#ffffff', fg: '#1f6fb2', radius: 16 })} />
    </mesh>
  </group>
);

// Bateria que descarrega de `from` até ficar vermelha em `at`.
export const Battery = ({ t, from, at, ...g }: G & { t: number; from: number; at: number }) => {
  const k = seg(t, from, at - F, easeOut);
  const lvl = 1 - 0.85 * k;
  const cor = new THREE.Color('#3cc35a').lerp(new THREE.Color('#e03a2f'), clamp01(k * 1.2));
  return (
    <group {...g}>
      <mesh castShadow>
        <boxGeometry args={[1.3, 0.62, 0.22]} />
        <meshStandardMaterial color="#2a2d33" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0.72, 0, 0]}>
        <boxGeometry args={[0.12, 0.26, 0.16]} />
        <meshStandardMaterial color="#2a2d33" />
      </mesh>
      <mesh position={[-0.56 + (1.12 * lvl) / 2, 0, 0.115]}>
        <planeGeometry args={[1.12 * lvl, 0.46]} />
        <meshBasicMaterial color={cor} toneMapped={false} />
      </mesh>
    </group>
  );
};

// Copo d'água (objeto de mão: o eixo -Y continua o antebraço, então o copo fica "abaixo" da mão).
export const Glass = ({ fill = 0.8, ...g }: G & { fill?: number }) => (
  <group {...g}>
    <group position={[0, -0.1, 0.1]} rotation={[Math.PI, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.11, 0.09, 0.26, 24, 1, true]} />
        <meshStandardMaterial color="#e8f6ff" transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.13 + (0.26 * fill) / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.085, 0.26 * fill, 24]} />
        <meshStandardMaterial color={AGUA} roughness={0.15} transparent opacity={0.9} />
      </mesh>
    </group>
  </group>
);
