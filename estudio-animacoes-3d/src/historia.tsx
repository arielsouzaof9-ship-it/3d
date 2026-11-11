import { useMemo } from 'react';
import * as THREE from 'three';
import { clamp01, easeOut, rand, seg, V3 } from './anim';
import { Look } from './Character';
import { ELENCO } from './personagens';
import { Gauge, Tag } from './props';
import { Box, WarmLights } from './sets';
import { canvasTex, labelTex, starTex } from './textures';

// ============================================================================
// "ADESIVOS" — elenco, cenários e objetos novos desta história.
// ============================================================================

// ---------- Elenco ----------
export const TITA: Look = {
  skin: '#a36a45', jacket: '#f08a2e', pants: '#2c3346', shoes: '#efefef', gloves: '#1e1f24',
  hair: '#2a1a12', hairStyle: 'rabo', hat: 'touca', hatColor: '#f2c230',
};
export const FARMA: Look = {
  skin: '#f0dccb', jacket: '#9fc6d9', pants: '#3b4250', shoes: '#1e1e1e', gloves: '#1e1f24',
  hair: '#2b2421', hairStyle: 'liso', beard: 'bigode', eyewear: 'grau', body: 'magro',
  coat: '#f6f6f4', shirt: '#ffffff', tie: '#2f7a5a',
};
export const CARTEIRO: Look = { ...ELENCO.kaio.look, jacket: '#2f5fa8', hat: 'bone', hatColor: '#e8c240', backpack: '#e8c240' };
export const NOIVA: Look = { ...ELENCO.paula.look, jacket: '#fbfbfb', hairStyle: 'coque', skirt: { color: '#fbfbfb', long: true }, gloves: '#fbfbfb' };
export const VOVO = ELENCO.zuza.look;
export const PADEIRO = ELENCO.nico.look;
export const POVO: Look[] = [ELENCO.bento.look, ELENCO.caio.look, ELENCO.gabi.look, ELENCO.rafa.look, ELENCO.henrique.look, ELENCO.bruna.look, ELENCO.tonhao.look, ELENCO.tiao.look];

// ---------- Adesivo de sorriso ----------
const stickerTex = (flip: boolean) =>
  canvasTex(`adesivo|${flip}`, 256, 160, (c) => {
    if (flip) {
      c.translate(256, 160);
      c.rotate(Math.PI);
    }
    c.fillStyle = '#fff1b8';
    c.strokeStyle = '#e9a92a';
    c.lineWidth = 10;
    c.beginPath();
    c.roundRect(6, 6, 244, 148, 50);
    c.fill();
    c.stroke();
    // boca aberta sorrindo
    c.fillStyle = '#8a2a1a';
    c.beginPath();
    c.moveTo(48, 52);
    c.quadraticCurveTo(128, 70, 208, 52);
    c.quadraticCurveTo(200, 140, 128, 140);
    c.quadraticCurveTo(56, 140, 48, 52);
    c.fill();
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.moveTo(60, 58);
    c.quadraticCurveTo(128, 76, 196, 58);
    c.lineTo(192, 80);
    c.quadraticCurveTo(128, 94, 64, 80);
    c.fill();
    c.fillStyle = '#e8566b';
    c.beginPath();
    c.ellipse(128, 122, 34, 14, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,0.7)';
    c.beginPath();
    c.ellipse(46, 30, 18, 7, -0.4, 0, Math.PI * 2);
    c.fill();
  });

// Vai dentro de <Character head={...}>: gruda na boca (cabeça em 0,0,0; rosto em +Z).
export const Adesivo = ({ rot = 0, s = 1, flip = false }: { rot?: number; s?: number; flip?: boolean }) => (
  <group rotation={[0, 0, rot]}>
    <mesh renderOrder={3}>
      <sphereGeometry args={[0.515, 24, 12, Math.PI / 2 - 0.42 * s, 0.84 * s, Math.PI / 2 + 0.33 - 0.2 * s, 0.4 * s]} />
      <meshStandardMaterial map={stickerTex(flip)} roughness={0.35} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-4} />
    </mesh>
  </group>
);

// Adesivo solto (na mão, na cartela, voando).
export const AdesivoPlano = ({ w = 0.3, flip = false, ...g }: { w?: number; flip?: boolean; position?: V3; rotation?: V3; scale?: number }) => (
  <mesh {...g} castShadow>
    <planeGeometry args={[w, w * 0.625]} />
    <meshStandardMaterial map={stickerTex(flip)} roughness={0.35} side={THREE.DoubleSide} />
  </mesh>
);

// Manchas vermelhas de alergia (dentro de head).
export const Manchas = ({ k = 1 }: { k?: number }) => (
  <>
    {[
      [-0.55, 0.2], [-0.42, 0.32], [-0.62, 0.38], [0.55, 0.2], [0.44, 0.33], [0.6, 0.4], [-0.2, -0.28], [0.25, -0.3],
    ].map(([ph, th], i) => {
      const phi = Math.PI / 2 + ph;
      const theta = Math.PI / 2 + th;
      const r = 0.505;
      return (
        <mesh key={i} position={[-r * Math.cos(phi) * Math.sin(theta), r * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta)]} scale={[k, k, k * 0.35]} renderOrder={3}>
          <sphereGeometry args={[0.035 + (i % 3) * 0.008, 10, 8]} />
          <meshStandardMaterial color="#e0413c" roughness={0.6} />
        </mesh>
      );
    })}
  </>
);

// ---------- Risada (bolinha dourada brilhante) ----------
export const Riso = ({ position, s = 1 }: { position: V3; s?: number }) => (
  <group position={position} scale={s}>
    <mesh>
      <sphereGeometry args={[0.08, 16, 12]} />
      <meshStandardMaterial color="#fff2a8" emissive="#ffc21a" emissiveIntensity={2.2} toneMapped={false} />
    </mesh>
    <sprite scale={[0.42, 0.42, 1]}>
      <spriteMaterial map={starTex()} transparent depthWrite={false} opacity={0.9} color="#ffd75a" />
    </sprite>
  </group>
);

// Risadas viajando de `from` até `to` (uma atrás da outra), entre a e b.
export const RisoFluxo = ({ t, a, b, from, to, n = 10, arc = 0.4 }: { t: number; a: number; b: number; from: V3; to: V3; n?: number; arc?: number }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const start = a + ((b - a) * i) / n;
      const k = clamp01((t - start) / 0.6);
      if (k <= 0 || k >= 1) return null;
      const y = from[1] + (to[1] - from[1]) * k + Math.sin(k * Math.PI) * arc + Math.sin(i * 2.3 + k * 9) * 0.05;
      return <Riso key={i} position={[from[0] + (to[0] - from[0]) * k, y, from[2] + (to[2] - from[2]) * k]} s={0.7 + rand(i) * 0.5} />;
    })}
  </>
);

// Explosão de risadas que sobem a partir de `at`.
export const RisoChuva = ({ t, at, n = 30, center = [0, 1, 0] as V3, spread = 3, up = 5 }: { t: number; at: number; n?: number; center?: V3; spread?: number; up?: number }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const tau = t - at - rand(i + 3) * 0.3;
      if (tau < 0) return null;
      const ang = rand(i) * Math.PI * 2;
      const r = spread * (0.3 + rand(i + 9) * 0.7) * easeOut(clamp01(tau / 1.2));
      return <Riso key={i} position={[center[0] + Math.cos(ang) * r, center[1] + up * easeOut(clamp01(tau / 1.6)) * (0.5 + rand(i + 5) * 0.5) + Math.sin(tau * 5 + i) * 0.1, center[2] + Math.sin(ang) * r * 0.6]} s={0.8 + rand(i + 1) * 0.6} />;
    })}
  </>
);

// ---------- Cachorro ----------
export const Cachorro = ({ t, adesivo = true, ...g }: { t: number; adesivo?: boolean; position?: V3; rotation?: V3; scale?: number }) => {
  const cor = '#c98a4b';
  const wag = Math.sin(t * 16) * 0.6;
  return (
    <group {...g}>
      <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.5, 6, 14]} />
        <meshStandardMaterial color={cor} />
      </mesh>
      {[[-0.13, 0.25], [0.13, 0.25], [-0.13, -0.25], [0.13, -0.25]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]} castShadow>
          <cylinderGeometry args={[0.055, 0.06, 0.42, 10]} />
          <meshStandardMaterial color={cor} />
        </mesh>
      ))}
      <group position={[0, 0.62, -0.42]} rotation={[-0.7, wag, 0]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <capsuleGeometry args={[0.04, 0.26, 4, 8]} />
          <meshStandardMaterial color={cor} />
        </mesh>
      </group>
      <mesh position={[0, 0.86, 0.42]} castShadow>
        <sphereGeometry args={[0.27, 24, 18]} />
        <meshStandardMaterial color={cor} />
      </mesh>
      <mesh position={[0, 0.78, 0.64]} castShadow>
        <boxGeometry args={[0.24, 0.17, 0.2]} />
        <meshStandardMaterial color="#e2b07a" />
      </mesh>
      <mesh position={[0, 0.85, 0.75]}>
        <sphereGeometry args={[0.045, 10, 8]} />
        <meshStandardMaterial color="#1b1410" />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.1, 0.95, 0.64]}>
            <sphereGeometry args={[0.035, 10, 8]} />
            <meshStandardMaterial color="#1b1410" />
          </mesh>
          <mesh position={[s * 0.22, 1.0, 0.36]} rotation={[0.2, 0, s * 0.5]} castShadow>
            <boxGeometry args={[0.1, 0.24, 0.16]} />
            <meshStandardMaterial color="#8a5a2e" />
          </mesh>
        </group>
      ))}
      {adesivo && <AdesivoPlano w={0.3} position={[0, 0.74, 0.745]} />}
    </group>
  );
};

// ---------- Bandeja de pães ----------
export const Bandeja = ({ t, drop, y0 = 1.2, ...g }: { t: number; drop: number; y0?: number; position?: V3 }) => {
  const tau = Math.max(0, t - drop);
  const fall = (h: number, vy: number) => Math.max(0.04, y0 + h + vy * tau - 5 * tau * tau);
  return (
    <group {...g}>
      <group position={[0, fall(0, 0.5), 0]} rotation={[Math.min(1.2, tau * 4), 0, Math.min(0.4, tau * 2)]}>
        <Box p={[0, 0, 0]} s={[0.75, 0.04, 0.45]} c="#9a6b3e" />
      </group>
      {Array.from({ length: 6 }, (_, i) => {
        const x0 = (i % 3) * 0.22 - 0.22;
        const z0 = Math.floor(i / 3) * 0.2 - 0.1;
        const vx = (rand(i) - 0.5) * 2.2;
        const vz = rand(i + 4) * 1.2;
        const y = tau > 0 ? fall(0.08, 2.2 + rand(i + 2) * 1.5) : y0 + 0.08;
        return (
          <mesh key={i} position={[x0 + vx * Math.min(tau, 0.7), y, z0 + vz * Math.min(tau, 0.7)]} rotation={[tau * 6 * rand(i + 1), i, Math.PI / 2 + tau * 5]} castShadow>
            <capsuleGeometry args={[0.07, 0.14, 4, 10]} />
            <meshStandardMaterial color="#d99a4a" roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- Máquina de café da praça ----------
export const MaquinaCafe = (g: { position?: V3; rotation?: V3 }) => (
  <group {...g}>
    <Box p={[0, 0.9, 0]} s={[1.0, 1.8, 0.7]} c="#b8322c" r={0.4} />
    <mesh position={[0, 1.35, 0.36]}>
      <planeGeometry args={[0.86, 0.5]} />
      <meshStandardMaterial map={labelTex('CAFÉ\nGRÁTIS', { w: 512, h: 300, bg: '#fff3dc', fg: '#7a2a1a', radius: 20 })} />
    </mesh>
    <Box p={[0, 0.72, 0.3]} s={[0.6, 0.45, 0.2]} c="#2a1e1a" />
    <mesh position={[0, 0.88, 0.36]}>
      <cylinderGeometry args={[0.03, 0.05, 0.12, 10]} />
      <meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.3} />
    </mesh>
    <Xicara position={[0, 0.56, 0.32]} />
    <mesh position={[0, 1.95, -0.2]}>
      <cylinderGeometry args={[0.08, 0.08, 0.3, 12]} />
      <meshStandardMaterial color="#6d6d6d" metalness={0.6} />
    </mesh>
    <mesh position={[0, 0.05, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 0.3, 12]} />
      <meshStandardMaterial color="#6d6d6d" metalness={0.6} />
    </mesh>
  </group>
);

export const Xicara = (g: { position?: V3; rotation?: V3; scale?: number }) => (
  <group {...g}>
    <mesh castShadow>
      <cylinderGeometry args={[0.07, 0.055, 0.12, 16]} />
      <meshStandardMaterial color="#fbfbf6" />
    </mesh>
    <mesh position={[0, 0.055, 0]}>
      <cylinderGeometry args={[0.062, 0.062, 0.01, 16]} />
      <meshStandardMaterial color="#4a2a16" />
    </mesh>
    <mesh position={[0.08, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.035, 0.012, 8, 16]} />
      <meshStandardMaterial color="#fbfbf6" />
    </mesh>
  </group>
);

// ---------- Potes de risada ----------
export const Pote = ({ t, seed = 0, nome, ...g }: { t: number; seed?: number; nome?: string; position?: V3; scale?: number }) => (
  <group {...g}>
    <mesh position={[0, 0.2, 0]}>
      <cylinderGeometry args={[0.17, 0.17, 0.4, 24]} />
      <meshStandardMaterial color="#d8eeff" transparent opacity={0.3} roughness={0.05} depthWrite={false} />
    </mesh>
    <mesh position={[0, 0.42, 0]} castShadow>
      <cylinderGeometry args={[0.18, 0.18, 0.06, 24]} />
      <meshStandardMaterial color="#b5852f" metalness={0.5} roughness={0.4} />
    </mesh>
    <Riso position={[Math.sin(t * 5 + seed) * 0.06, 0.18 + Math.abs(Math.sin(t * 7 + seed * 2)) * 0.1, 0]} s={0.9} />
    {nome && <Tag text={nome} position={[0, 0.2, 0.19]} scale={0.6} />}
  </group>
);

export const poteItem = () => ({
  geometry: new THREE.CylinderGeometry(0.17, 0.17, 0.36, 14),
  material: new THREE.MeshStandardMaterial({ color: '#fff0a8', emissive: '#ffb81a', emissiveIntensity: 0.9, roughness: 0.2 }),
  h: 0.36,
});

// ---------- Aspirador gigante ----------
// inflate 0..1 (engole), shake 0..1 (engasga), gone (explodiu), nozzle = ponta da mangueira (coordenadas locais).
export const Aspirador = ({ t, from, at, inflate = 0, shake = 0, gone = false, nozzle = [1.6, 1.2, 1.2] as V3, nozzleRot = [-Math.PI / 2, 0, 0] as V3, ...g }: { t: number; from: number; at: number; inflate?: number; shake?: number; gone?: boolean; nozzle?: V3; nozzleRot?: V3; position?: V3; rotation?: V3 }) => {
  const hose = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0.7, 0.9, 0.3), new THREE.Vector3(1.1, 0.35, 0.9), new THREE.Vector3(nozzle[0] - 0.3, nozzle[1] - 0.55, nozzle[2] - 0.15), new THREE.Vector3(...nozzle)]);
    return new THREE.TubeGeometry(curve, 40, 0.09, 12, false);
  }, [nozzle[0], nozzle[1], nozzle[2]]); // eslint-disable-line react-hooks/exhaustive-deps
  if (gone) return null;
  const sx = 1 + inflate * 0.35 + Math.sin(t * 40) * 0.04 * shake;
  const jit = Math.sin(t * 53) * 0.05 * shake;
  return (
    <group {...g}>
      <group position={[jit, 0, 0]} scale={[sx, 1 + inflate * 0.25, sx]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.75, 0.8, 1.6, 40]} />
          <meshStandardMaterial color="#56707a" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.8, 0]} castShadow>
          <sphereGeometry args={[0.75, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#6d8a94" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.15, 0.78]}>
          <planeGeometry args={[0.95, 0.42]} />
          <meshStandardMaterial map={labelTex('SUGA\nSORRISO', { w: 512, h: 228, bg: '#ffd23a', fg: '#2a1708', radius: 18 })} />
        </mesh>
        <Gauge t={t} from={from} at={at} value={1} position={[0, 0.6, 0.82]} scale={0.32} />
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, 0.18, 0.45]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 20]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        ))}
        {/* cano que sobe até a praça */}
        <mesh position={[-0.3, 4.8, -0.2]}>
          <cylinderGeometry args={[0.12, 0.12, 6, 14]} />
          <meshStandardMaterial color="#8a8a8a" metalness={0.6} roughness={0.4} />
        </mesh>
        <Tag text="CAFÉ" position={[-0.3, 2.9, 0.0]} scale={1.3} />
      </group>
      <mesh geometry={hose} castShadow>
        <meshStandardMaterial color="#2c2c30" roughness={0.6} />
      </mesh>
      <mesh position={nozzle} rotation={nozzleRot}>
        <coneGeometry args={[0.2, 0.3, 20, 1, true]} />
        <meshStandardMaterial color="#c9a14a" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// ---------- Cartela de adesivos com nomes ----------
export const Cartela = ({ nomes = ['TITA', 'VOVÓ', 'NOIVA', 'PADEIRO', 'CARTEIRO', 'CACHORRO'], ...g }: { nomes?: string[]; position?: V3; rotation?: V3; scale?: number }) => (
  <group {...g}>
    <Box p={[0, 0, -0.03]} s={[1.5, 1.2, 0.05]} c="#f7f2e6" r={0.6} />
    {nomes.map((n, i) => {
      const x = (i % 3) * 0.48 - 0.48;
      const y = i < 3 ? 0.28 : -0.3;
      return (
        <group key={n} position={[x, y, 0]}>
          <AdesivoPlano w={0.38} position={[0, 0.05, 0.002]} />
          <mesh position={[0, -0.2, 0.002]}>
            <planeGeometry args={[0.42, 0.11]} />
            <meshStandardMaterial map={labelTex(n, { w: 512, h: 134, bg: i === 0 ? '#d22d2d' : '#2f5fa8', fg: '#fff', radius: 16 })} />
          </mesh>
        </group>
      );
    })}
  </group>
);

// ---------- Telhados à noite (chaminés) ----------
export const Telhados = () => (
  <group>
    <WarmLights sun={[-4, 8, 6]} bg="#1a2142" sky="#9bb0ff" ground="#202030" fill={0.55} power={0.8} fog={[14, 40]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#2c3350" />
    </mesh>
    {[-6, -3, 0, 3, 6].map((x, i) => {
      const h = 2.6 + (i % 2) * 0.8;
      const cor = ['#d98c5f', '#e8b85a', '#c7765a', '#7fa36b', '#d7a36b'][i];
      return (
        <group key={x} position={[x, 0, -3 - (i % 2) * 1.5]}>
          <Box p={[0, h / 2, 0]} s={[2.6, h, 2.4]} c={cor} />
          <mesh position={[0, h + 0.55, 0]} rotation={[0, 0, 0]} scale={[1.9, 1, 1.25]} castShadow>
            <cylinderGeometry args={[0, 1, 1.1, 4, 1]} />
            <meshStandardMaterial color="#8a3a2a" />
          </mesh>
          <Box p={[0.6, h + 0.9, 0]} s={[0.4, 1.0, 0.4]} c="#7a4a3a" />
          {[-0.6, 0.6].map((wx) => (
            <mesh key={wx} position={[wx, h * 0.55, 1.21]}>
              <planeGeometry args={[0.5, 0.6]} />
              <meshStandardMaterial color="#ffd98a" emissive="#ffc04a" emissiveIntensity={1.2} />
            </mesh>
          ))}
        </group>
      );
    })}
    <mesh position={[4, 9, -18]}>
      <sphereGeometry args={[1.2, 24, 16]} />
      <meshStandardMaterial color="#fff6d8" emissive="#fff0c0" emissiveIntensity={1.4} toneMapped={false} />
    </mesh>
  </group>
);

// Topo de cada chaminé dos Telhados (para as risadas saírem dali).
export const CHAMINES: V3[] = [-6, -3, 0, 3, 6].map((x, i) => [x + 0.6, 2.6 + (i % 2) * 0.8 + 1.4, -3 - (i % 2) * 1.5]);

// Placa "FECHADO" pendurada.
export const Fechado = (g: { position?: V3; rotation?: V3; scale?: number }) => (
  <group {...g}>
    <mesh>
      <planeGeometry args={[1.0, 0.4]} />
      <meshStandardMaterial map={labelTex('FECHADO', { w: 512, h: 205, bg: '#d22d2d', fg: '#fff', radius: 16 })} />
    </mesh>
  </group>
);

// Teia de aranha simples (linhas brancas).
export const Teia = ({ s = 1, ...g }: { s?: number; position?: V3; rotation?: V3 }) => {
  const geo = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      pts.push(0, 0, 0, Math.cos(a), Math.sin(a), 0);
    }
    for (let r = 0.25; r <= 1; r += 0.25)
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const b = ((i + 1) / 8) * Math.PI * 2;
        pts.push(Math.cos(a) * r, Math.sin(a) * r, 0, Math.cos(b) * r, Math.sin(b) * r, 0);
      }
    const gg = new THREE.BufferGeometry();
    gg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return gg;
  }, []);
  return (
    <lineSegments geometry={geo} scale={s} {...g}>
      <lineBasicMaterial color="#f4f4f4" />
    </lineSegments>
  );
};

export const flash = (t: number, at: number) => seg(t, at - 0.05, at + 0.05) * (1 - seg(t, at + 0.1, at + 0.5));
