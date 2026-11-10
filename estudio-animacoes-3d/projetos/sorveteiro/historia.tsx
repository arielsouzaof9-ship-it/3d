import { useMemo } from 'react';
import * as THREE from 'three';
import { clamp01, easeInOut, rand, seg, V3 } from './anim';
import { Look, VOCE } from './Character';
import { ELENCO } from './personagens';
import { Sign } from './props';
import { Box, WarmLights } from './sets';
import { canvasTex, FONT, labelTex, windowsTex } from './textures';

// ============================================================================
// "O Sorveteiro da Segunda-Feira" — elenco, cenários e objetos desta história.
// ============================================================================

type G = { position?: V3; rotation?: V3; scale?: number | V3 };

// ---------- Elenco ----------
export const VOCE_K: Look = { ...VOCE, body: 'crianca' }; // Você, criança de boné
export const SORVETEIRO: Look = {
  skin: '#e3b994', jacket: '#f6f3ee', pants: '#3a3f4a', shoes: '#222', gloves: '#1e1f24',
  hair: '#4a2e1c', hairStyle: 'curto', beard: 'bigode', apron: '#ec7fb0', hat: 'marinheiro', hatColor: '#f7f7f7', shirt: '#ec7fb0',
};
export const PAI: Look = { ...SORVETEIRO, hat: undefined }; // sem o chapéu
export const KIDS: Look[] = [ELENCO.lia.look, ELENCO.pedrinho.look, { ...ELENCO.kaio.look, body: 'crianca' }, { ...ELENCO.gabi.look, body: 'crianca' }];

// ---------- Árvore e casa ----------
export const Tree = ({ h = 1, c = '#3f7d3a', ...g }: G & { h?: number; c?: string }) => (
  <group {...g}>
    <mesh position={[0, 0.5 * h, 0]} castShadow>
      <cylinderGeometry args={[0.12 * h, 0.16 * h, 1 * h, 8]} />
      <meshStandardMaterial color="#6b4a2e" />
    </mesh>
    <mesh position={[0, 1.6 * h, 0]} castShadow>
      <coneGeometry args={[0.9 * h, 1.8 * h, 8]} />
      <meshStandardMaterial color={c} roughness={0.9} />
    </mesh>
    <mesh position={[0, 2.4 * h, 0]} castShadow>
      <coneGeometry args={[0.65 * h, 1.3 * h, 8]} />
      <meshStandardMaterial color={c} roughness={0.9} />
    </mesh>
  </group>
);

const House = ({ x, z, c, roof, lit }: { x: number; z: number; c: string; roof: string; lit: number }) => (
  <group position={[x, 0, z]}>
    <Box p={[0, 1.4, 0]} s={[4, 2.8, 3.4]} c={c} />
    <mesh position={[0, 3.55, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
      <coneGeometry args={[3.2, 1.6, 4]} />
      <meshStandardMaterial color={roof} roughness={0.8} />
    </mesh>
    <Box p={[0, 0.85, 1.72]} s={[0.8, 1.7, 0.06]} c="#6b4426" />
    {[-1.3, 1.3].map((wx) => (
      <mesh key={wx} position={[wx, 1.7, 1.72]}>
        <planeGeometry args={[0.9, 0.8]} />
        <meshStandardMaterial color={lit > 0 ? '#ffe2a0' : '#9fc4dc'} emissive="#ffc35a" emissiveIntensity={lit * 1.6} />
      </mesh>
    ))}
  </group>
);

// ---------- Bairro (dia ou noite) ----------
// Calçada em z≈0 (onde ficam os personagens), rua em z≈-3, casas em z≈-9.
// lights[i] = 0..1 luz acesa na janela da casa i (à noite).
const HOUSES = [
  { x: -16, c: '#f2d9a6', roof: '#b4553c' }, { x: -10.5, c: '#bfe0e6', roof: '#3f5f8f' }, { x: -5, c: '#f6c7c0', roof: '#7a3a3a' },
  { x: 0.5, c: '#d9e8b8', roof: '#5f6f3a' }, { x: 6, c: '#f4e6c4', roof: '#a8603c' }, { x: 11.5, c: '#c9d2f2', roof: '#45507f' }, { x: 17, c: '#f2c7a2', roof: '#8a4a2e' },
];
export const Bairro = ({ night = false, lights }: { night?: boolean; lights?: number[] }) => (
  <group>
    {night ? (
      <>
        <WarmLights sun={[-6, 9, 4]} bg="#141c38" sky="#5d6fb0" ground="#141420" power={0.55} fill={0.55} fog={[14, 42]} />
        <directionalLight position={[6, 8, 8]} intensity={0.7} color="#8fa8ff" />
        <mesh position={[-7, 11, -30]}>
          <sphereGeometry args={[1.4, 24, 16]} />
          <meshBasicMaterial color="#fff6d8" />
        </mesh>
      </>
    ) : (
      <WarmLights sun={[-6, 8, 7]} bg="#a9d8f2" sky="#fff4dc" ground="#6d8a4a" power={2.3} fog={[18, 50]} />
    )}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[120, 120]} />
      <meshStandardMaterial color={night ? '#2e4a2c' : '#7cbf5a'} roughness={0.95} />
    </mesh>
    <Box p={[0, 0.06, 0]} s={[70, 0.12, 2.4]} c={night ? '#6f7180' : '#ddd6c6'} />
    <Box p={[0, 0.015, -3.2]} s={[70, 0.03, 4]} c={night ? '#24262e' : '#43464d'} r={0.9} />
    {Array.from({ length: 18 }, (_, i) => (
      <Box key={i} p={[-34 + i * 4, 0.035, -3.2]} s={[1.6, 0.01, 0.14]} c="#f3d36a" />
    ))}
    <Box p={[0, 0.06, -6.2]} s={[70, 0.12, 2]} c={night ? '#6f7180' : '#ddd6c6'} />
    {HOUSES.map((h, i) => (
      <House key={h.x} x={h.x} z={-9.6} c={h.c} roof={h.roof} lit={night ? lights?.[i] ?? 1 : 0} />
    ))}
    {[-13.2, -7.7, -2.2, 3.3, 8.8, 14.3].map((x, i) => (
      <Tree key={x} position={[x, 0, -7.2]} h={0.8 + rand(i) * 0.3} c={night ? '#24452a' : '#3f8a3a'} />
    ))}
    {[-4, 4].map((x) => (
      <group key={x}>
        <mesh position={[x, 1.7, -1.0]} castShadow>
          <cylinderGeometry args={[0.05, 0.07, 3.4, 12]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        <mesh position={[x, 3.45, -1.0]}>
          <sphereGeometry args={[0.2, 16, 12]} />
          <meshStandardMaterial color="#ffe7a8" emissive="#ffcf6a" emissiveIntensity={night ? 2.5 : 0.6} />
        </mesh>
        {night && <pointLight position={[x, 3.2, -0.8]} intensity={6} distance={7} color="#ffd38a" />}
      </group>
    ))}
  </group>
);

// ---------- Sorvete (casquinha azul) — objeto de mão ----------
export const Cone = ({ color = '#3aa6ff', ...g }: G & { color?: string }) => (
  <group {...g}>
    <mesh position={[0, -0.12, 0]} rotation={[Math.PI, 0, 0]} castShadow>
      <coneGeometry args={[0.07, 0.2, 12]} />
      <meshStandardMaterial color="#d9a35a" roughness={0.8} />
    </mesh>
    <mesh position={[0, -0.0, 0]} castShadow>
      <sphereGeometry args={[0.08, 16, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.4} />
    </mesh>
  </group>
);

// Chapéu de marinheiro na mão (depois que o sorveteiro tira).
export const CapInHand = (g: G) => (
  <group {...g}>
    <group position={[0, -0.12, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.24, 0.22, 0.14, 24]} />
        <meshStandardMaterial color="#f7f7f7" />
      </mesh>
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.235, 0.235, 0.05, 24]} />
        <meshStandardMaterial color="#1f3b7a" />
      </mesh>
    </group>
  </group>
);

// ---------- Caminhão de sorvete ----------
// Anda no eixo X (frente para +X). dist = quanto já andou (gira as rodas). door = porta de trás 0..1.
export const IceTruck = ({ dist = 0, door = 0, menu = true, ...g }: G & { dist?: number; door?: number; menu?: boolean }) => {
  const pink = '#f48cbf';
  const wheel = -dist / 0.42;
  return (
    <group {...g}>
      {/* baú com janela de atendimento no lado +Z */}
      <Box p={[-0.5, 2.95, 0]} s={[3.4, 0.5, 2.1]} c={pink} />
      <Box p={[-0.5, 0.9, 0]} s={[3.4, 0.9, 2.1]} c={pink} />
      <Box p={[-1.95, 1.95, 0]} s={[0.5, 1.5, 2.1]} c={pink} />
      <Box p={[0.95, 1.95, 0]} s={[0.5, 1.5, 2.1]} c={pink} />
      <Box p={[-0.5, 1.95, -1.0]} s={[2.4, 1.5, 0.1]} c="#5a2a40" />
      <Box p={[-0.5, 1.37, 0.85]} s={[2.4, 0.08, 0.5]} c="#f2f2f2" />
      <mesh position={[-0.5, 2.62, 1.3]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[2.6, 0.06, 0.7]} />
        <meshStandardMaterial map={stripeTex()} />
      </mesh>
      <Sign text="SORVETINHO" w={3.2} h={0.5} position={[-0.5, 3.0, 1.07]} bg="#ffffff" fg="#d63a86" border="#d63a86" />
      {menu && <Sign text={'SABOR:\nAZUL'} w={0.9} h={0.7} position={[-1.55, 1.0, 1.08]} bg="#1d3f7a" fg="#7fd0ff" />}
      {/* cabine */}
      <Box p={[1.9, 1.25, 0]} s={[1.5, 1.6, 2.0]} c="#f7f7f7" />
      <mesh position={[2.66, 1.65, 0]}>
        <planeGeometry args={[1.8, 0.7]} />
        <meshStandardMaterial color="#202a36" />
      </mesh>
      <mesh position={[2.66, 1.65, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.8, 0.7]} />
        <meshStandardMaterial color="#2a3a4a" roughness={0.1} metalness={0.4} />
      </mesh>
      <mesh position={[1.9, 1.65, 1.01]}>
        <planeGeometry args={[1.0, 0.6]} />
        <meshStandardMaterial color="#2a3a4a" roughness={0.1} metalness={0.4} />
      </mesh>
      {[0.6, -0.6].map((z) => (
        <mesh key={z} position={[2.66, 0.75, z]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.13, 16]} />
          <meshStandardMaterial color="#fff6c8" emissive="#ffe28a" emissiveIntensity={1.4} />
        </mesh>
      ))}
      {/* sorvete gigante no teto */}
      <group position={[-0.5, 3.2, 0]}>
        <mesh position={[0, 0.45, 0]} rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[0.42, 0.9, 16]} />
          <meshStandardMaterial color="#d9a35a" />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <sphereGeometry args={[0.5, 24, 16]} />
          <meshStandardMaterial color="#3aa6ff" emissive="#3aa6ff" emissiveIntensity={0.3} />
        </mesh>
      </group>
      {/* porta de trás (dobradiça em z=-1.05) */}
      <group position={[-2.21, 1.95, -1.05]} rotation={[0, -door * 1.8, 0]}>
        <Box p={[0, 0, 1.05]} s={[0.04, 1.5, 2.1]} c="#e6739f" />
      </group>
      {/* rodas */}
      {[-1.3, 1.9].map((x) =>
        [1.0, -1.0].map((z) => (
          <group key={`${x}${z}`} position={[x, 0.42, z]} rotation={[Math.PI / 2, 0, 0]}>
            <group rotation={[0, wheel, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.42, 0.42, 0.3, 20]} />
                <meshStandardMaterial color="#1c1c1f" />
              </mesh>
              <Box p={[0, 0, 0]} s={[0.5, 0.32, 0.1]} c="#c9c9c9" />
            </group>
          </group>
        )),
      )}
    </group>
  );
};

const stripeTex = () =>
  canvasTex('toldo', 256, 64, (c) => {
    for (let i = 0; i < 8; i++) {
      c.fillStyle = i % 2 ? '#ffffff' : '#ff5fa8';
      c.fillRect(i * 32, 0, 32, 64);
    }
  });

// ---------- Relógio que gira até a hora na palavra ----------
const clockTex = () =>
  canvasTex('relogio', 512, 512, (c) => {
    c.fillStyle = '#fffdf6';
    c.beginPath();
    c.arc(256, 256, 250, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#2c2c2c';
    c.font = `900 70px ${FONT}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    [12, 3, 6, 9].forEach((n, i) => {
      const a = (i * Math.PI) / 2;
      c.fillText(String(n), 256 + Math.sin(a) * 185, 256 - Math.cos(a) * 185);
    });
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      c.beginPath();
      c.arc(256 + Math.sin(a) * 225, 256 - Math.cos(a) * 225, 8, 0, Math.PI * 2);
      c.fill();
    }
  });
export const Clock = ({ t, from, at, hour = 3, ...g }: G & { t: number; from: number; at: number; hour?: number }) => {
  const k = seg(t, from, at, (x) => 1 - Math.pow(1 - x, 3));
  const hh = hour * k; // horas desde 12:00
  const hit = t >= at ? 1 + 0.12 * Math.max(0, 1 - (t - at) / 0.2) : 1;
  return (
    <group {...g}>
      <group scale={hit}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.62, 0.62, 0.12, 48]} />
          <meshStandardMaterial color="#d6402f" />
        </mesh>
        <mesh position={[0, 0, 0.065]}>
          <circleGeometry args={[0.55, 48]} />
          <meshStandardMaterial map={clockTex()} />
        </mesh>
        <group position={[0, 0, 0.09]} rotation={[0, 0, -hh * Math.PI * 2]}>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.03, 0.42, 0.02]} />
            <meshStandardMaterial color="#d6402f" />
          </mesh>
        </group>
        <group position={[0, 0, 0.08]} rotation={[0, 0, -hh * (Math.PI / 6)]}>
          <mesh position={[0, 0.13, 0]}>
            <boxGeometry args={[0.06, 0.28, 0.02]} />
            <meshStandardMaterial color="#1c1c1c" />
          </mesh>
        </group>
        <mesh position={[0, 0, 0.1]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#1c1c1c" />
        </mesh>
      </group>
    </group>
  );
};

// ---------- Estrada na floresta (anda no eixo X, em z = 0) ----------
export const Floresta = () => {
  const trees = useMemo(() => {
    const out: { p: V3; h: number }[] = [];
    for (let i = 0; i < 70; i++) {
      const side = i % 2 ? 1 : -1;
      out.push({ p: [-20 + (i / 70) * 120 + rand(i) * 2, 0, side * (3.6 + rand(i + 9) * 9)], h: 0.9 + rand(i + 4) * 0.7 });
    }
    return out;
  }, []);
  return (
    <group>
      <WarmLights sun={[-8, 7, 5]} bg="#e89a6a" sky="#ffd9b0" ground="#3b4a2a" power={1.9} fog={[14, 46]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#4f7a3a" roughness={0.95} />
      </mesh>
      <Box p={[40, 0.015, 0]} s={[140, 0.03, 4]} c="#4a4038" r={0.95} />
      {trees.map((tr, i) => (
        <Tree key={i} position={tr.p} h={tr.h} c={i % 3 ? '#2f6a35' : '#3b7d3a'} />
      ))}
    </group>
  );
};

// Placa de estrada num poste.
export const RoadSign = ({ text, bg = '#f2c62e', fg = '#1c1c1c', w = 1.8, h = 0.9, ...g }: G & { text: string; bg?: string; fg?: string; w?: number; h?: number }) => (
  <group {...g}>
    <mesh position={[0, 1.1, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 2.2, 10]} />
      <meshStandardMaterial color="#6a6a6a" metalness={0.5} />
    </mesh>
    <Sign text={text} w={w} h={h} position={[0, 2.2, 0.06]} bg={bg} fg={fg} border={fg} />
  </group>
);

// ---------- Portão gigante + fábrica escondida ----------
const Gate = ({ open }: { open: number }) => (
  <group>
    {[-1, 1].map((s) => (
      <group key={s} position={[s * 4, 0, 0]} rotation={[0, s * open * 1.2, 0]}>
        <group position={[-s * 2, 0, 0]}>
          {Array.from({ length: 9 }, (_, i) => (
            <mesh key={i} position={[-1.8 + i * 0.45, 4, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 8, 8]} />
              <meshStandardMaterial color="#2b2d33" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
          {[1, 4, 7].map((y) => (
            <Box key={y} p={[0, y, 0]} s={[4, 0.18, 0.12]} c="#2b2d33" />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <mesh key={`p${i}`} position={[-1.8 + i * 0.45, 8.15, 0]}>
              <coneGeometry args={[0.1, 0.3, 6]} />
              <meshStandardMaterial color="#2b2d33" />
            </mesh>
          ))}
        </group>
      </group>
    ))}
    {[-4.3, 4.3].map((x) => (
      <Box key={x} p={[x, 4.6, 0]} s={[0.7, 9.2, 0.7]} c="#4a4d55" />
    ))}
    <Box p={[-12, 2, 0]} s={[15, 4, 0.5]} c="#3d4048" />
    <Box p={[12, 2, 0]} s={[15, 4, 0.5]} c="#3d4048" />
    <Box p={[0, 9.4, 0]} s={[9.4, 0.5, 0.6]} c="#4a4d55" />
    <Sign text="SORVETINHO S.A." w={6} h={0.9} position={[0, 10.2, 0]} bg="#1c1c22" fg="#7fd0ff" border="#7fd0ff" />
  </group>
);

export const Smoke = ({ t, position }: { t: number; position: V3 }) => (
  <>
    {Array.from({ length: 7 }, (_, i) => {
      const k = (t * 0.25 + i / 7) % 1;
      return (
        <mesh key={i} position={[position[0] + Math.sin(i * 2 + k * 3) * 0.6 * k, position[1] + k * 6, position[2]]} scale={0.6 + k * 1.6}>
          <sphereGeometry args={[0.6, 12, 10]} />
          <meshStandardMaterial color="#7fc8ff" emissive="#3a8cff" emissiveIntensity={0.6} transparent opacity={0.75 * (1 - k)} depthWrite={false} />
        </mesh>
      );
    })}
  </>
);

export const FabricaFora = ({ t, open }: { t: number; open: number }) => (
  <group>
    <WarmLights sun={[-8, 9, 6]} bg="#3d3566" sky="#b8a8ff" ground="#1c2a1c" power={1.1} fill={0.7} fog={[16, 60]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#2f4a2c" roughness={0.95} />
    </mesh>
    <Box p={[0, 0.015, 0]} s={[4, 0.03, 60]} c="#4a4038" r={0.95} />
    <group position={[0, 0, -4]}>
      <Gate open={open} />
    </group>
    <group position={[0, 0, -22]}>
      <Box p={[0, 4.5, 0]} s={[20, 9, 8]} map={windowsTex('#5a5f6b', 4, 8)} />
      <Box p={[0, 9.3, 0]} s={[20.4, 0.6, 8.4]} c="#3a3d45" />
      {[-6, 0, 6].map((x) => (
        <group key={x}>
          <mesh position={[x, 12, -1]} castShadow>
            <cylinderGeometry args={[0.8, 1.0, 6, 20]} />
            <meshStandardMaterial color="#6a5a55" />
          </mesh>
          <Smoke t={t + x} position={[x, 15, -1]} />
        </group>
      ))}
    </group>
    {Array.from({ length: 30 }, (_, i) => (
      <Tree key={i} position={[(i % 2 ? 1 : -1) * (6 + rand(i) * 18), 0, -2 + rand(i + 3) * 18 - (i % 3) * 14]} h={1.3 + rand(i + 5) * 0.8} c="#24452a" />
    ))}
  </group>
);

// ---------- Dentro da fábrica: máquina de sonhos ----------
// Crianças em fila sobre plataformas em z=0, x = -2.4..2.4. Tanque grande atrás em z=-3.5.
export const MAQ_X = [-2.4, -0.8, 0.8, 2.4];
export const FabricaDentro = ({ t, level = 0.3 }: { t: number; level?: number }) => (
  <group>
    <WarmLights sun={[-3, 8, 6]} bg="#121a2e" sky="#9fb8ff" ground="#141420" power={1.0} fill={0.75} fog={[10, 34]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#3a3e48" roughness={0.6} />
    </mesh>
    <Box p={[0, 4, -6]} s={[24, 8, 0.4]} c="#2b3040" />
    {[-7, -4, 4, 7].map((x) => (
      <mesh key={x} position={[x, 4, -5.6]}>
        <cylinderGeometry args={[0.18, 0.18, 8, 12]} />
        <meshStandardMaterial color="#6f7a8c" metalness={0.6} roughness={0.35} />
      </mesh>
    ))}
    {/* esteira */}
    <Box p={[0, 0.25, 0]} s={[7, 0.5, 1.4]} c="#23252b" />
    <Box p={[0, 0.52, 0]} s={[7.1, 0.05, 1.3]} c="#4b4f5a" />
    {/* tanque de sonhos */}
    <group position={[0, 0, -3.6]}>
      <mesh position={[0, 3.3, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 5, 32, 1, true]} />
        <meshStandardMaterial color="#bfe6ff" transparent opacity={0.25} side={THREE.DoubleSide} roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.8 + (5 * level) / 2, 0]}>
        <cylinderGeometry args={[1.22, 1.22, 5 * level, 32]} />
        <meshStandardMaterial color="#3aa6ff" emissive="#2a7fff" emissiveIntensity={1.4} transparent opacity={0.85} />
      </mesh>
      <Box p={[0, 0.4, 0]} s={[3, 0.8, 3]} c="#4a4f5c" />
      <Box p={[0, 6.0, 0]} s={[3, 0.5, 3]} c="#4a4f5c" />
      <pointLight position={[0, 3, 1.8]} intensity={18} distance={10} color="#4aa8ff" />
    </group>
    {/* capacetes e tubos sobre cada criança */}
    {MAQ_X.map((x, i) => (
      <group key={x}>
        <mesh position={[x, 2.12, 0]}>
          <sphereGeometry args={[0.4, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#9aa3b3" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[x * 0.5, 4.5, -1.8]} rotation={[0.85, 0, -x * 0.12]}>
          <cylinderGeometry args={[0.08, 0.08, 4.6, 10]} />
          <meshStandardMaterial color="#5a6170" metalness={0.5} />
        </mesh>
        {/* bolinhas de sonho subindo pelo tubo */}
        {Array.from({ length: 3 }, (_, j) => {
          const k = (t * 0.6 + j / 3 + i * 0.17) % 1;
          return (
            <mesh key={j} position={[x * (1 - k * 0.5), 2.5 + k * 3.6, -k * 3.6]}>
              <sphereGeometry args={[0.1, 12, 10]} />
              <meshBasicMaterial color="#8fd6ff" />
            </mesh>
          );
        })}
      </group>
    ))}
  </group>
);

// ---------- Baú do caminhão por dentro ----------
export const Bau = () => (
  <group>
    <WarmLights sun={[2, 6, 3]} bg="#1c1418" sky="#ffd9b8" ground="#2a1c18" power={0.9} fill={0.6} fog={[6, 20]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#5a4a42" roughness={0.8} />
    </mesh>
    <Box p={[0, 1.6, -1.6]} s={[6, 3.2, 0.1]} c="#7a3a58" />
    <Box p={[-2.6, 1.6, 0]} s={[0.1, 3.2, 6]} c="#6a3250" />
    <Box p={[2.6, 1.6, 0]} s={[0.1, 3.2, 6]} c="#6a3250" />
    <Box p={[0, 3.2, 0]} s={[6, 0.1, 6]} c="#4a2238" />
    <mesh position={[0, 2.9, 0.5]}>
      <sphereGeometry args={[0.12, 12, 10]} />
      <meshStandardMaterial color="#fff2c8" emissive="#ffd88a" emissiveIntensity={2.2} />
    </mesh>
    <pointLight position={[0, 2.7, 0.8]} intensity={9} distance={7} color="#ffd59a" castShadow />
    {/* freezers */}
    {[-1.4, 0.2].map((x) => (
      <group key={x}>
        <Box p={[x, 0.55, -1.0]} s={[1.4, 1.1, 1]} c="#f2f4f7" r={0.3} />
        <mesh position={[x, 0.75, -0.49]}>
          <planeGeometry args={[0.9, 0.35]} />
          <meshStandardMaterial map={labelTex('AZUL', { w: 512, h: 196, bg: '#1d3f7a', fg: '#7fd0ff', radius: 16 })} />
        </mesh>
      </group>
    ))}
  </group>
);

// Caixa de papelão rosa onde você se esconde.
export const Caixa = ({ size = 0.9, ...g }: G & { size?: number }) => (
  <group {...g}>
    <mesh position={[0, size / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[size * 1.2, size, size]} />
      <meshStandardMaterial color="#c8925a" roughness={0.9} />
    </mesh>
    <mesh position={[0, size / 2, size / 2 + 0.005]}>
      <planeGeometry args={[size * 0.8, size * 0.35]} />
      <meshStandardMaterial map={labelTex('CASQUINHAS', { w: 512, h: 196, fg: '#6a3a1a' })} transparent />
    </mesh>
  </group>
);

// Cartaz de desaparecido (para "sumido há dois anos").
export const Cartaz = (g: G) => (
  <group {...g}>
    <mesh castShadow>
      <boxGeometry args={[1.2, 1.5, 0.02]} />
      <meshStandardMaterial color="#f4ecd6" />
    </mesh>
    <mesh position={[0, 0.5, 0.012]}>
      <planeGeometry args={[1.1, 0.3]} />
      <meshStandardMaterial map={labelTex('DESAPARECIDO', { w: 1024, h: 280, fg: '#b8221c' })} transparent />
    </mesh>
    <mesh position={[0, -0.05, 0.012]}>
      <planeGeometry args={[0.7, 0.7]} />
      <meshStandardMaterial map={labelTex('PAI', { w: 512, h: 512, bg: '#c9b48a', fg: '#4a3a2a', radius: 6 })} />
    </mesh>
  </group>
);

export const fade01 = (t: number, a: number, b: number) => easeInOut(clamp01((t - a) / (b - a)));
