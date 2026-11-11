import { JSX } from 'react';
import * as THREE from 'three';
import { back, clamp01, easeIn, easeOut, rand, seg, V3 } from './anim';
import { Character, faceAt, FaceKey, Look, Pose, REST } from './Character';
import { ELENCO } from './personagens';
import { Puff, Sign } from './props';
import { Box, WarmLights } from './sets';
import { F } from './timeline';
import { labelTex, windowsTex } from './textures';

// ============================================================================
// "O Número da Palma" — elenco, cenários e objetos próprios desta história.
// ============================================================================

const MAO = '#1e1f24';

// ---------- Elenco ----------
export const RAFAEL: Look = { ...ELENCO.henrique.look, hair: '#3a2416' };
export const RAFAEL_KID: Look = { skin: '#f0dccb', jacket: '#1f2228', pants: '#1f2228', shoes: '#111', gloves: MAO, hair: '#3a2416', hairStyle: 'liso', body: 'crianca', shirt: '#ffffff', tie: '#c22a2a' };
export const NINA_KID: Look = { skin: '#a36a45', jacket: '#e8c240', pants: '#2f5fa8', shoes: '#d8352f', gloves: MAO, hair: '#2a1a12', hairStyle: 'rabo', body: 'crianca' };
export const NINA: Look = { skin: '#a36a45', jacket: '#c8452e', pants: '#2b2b30', shoes: '#111', gloves: MAO, hair: '#2a1a12', hairStyle: 'rabo', hat: 'capacete', hatColor: '#e8c240', vest: '#e8c240' };
export const MAE_NINA: Look = ELENCO.paula.look;
export const PAI_RAFAEL: Look = ELENCO.funcionario.look;
export const MAE_RAFAEL: Look = ELENCO.gabi.look;
export const FOTOGRAFO: Look = ELENCO.kaio.look;
export const MAE_BEBE: Look = ELENCO.bruna.look;
export const KIDS: Look[] = [ELENCO.lia.look, ELENCO.pedrinho.look, { ...ELENCO.pedrinho.look, skin: '#6e4329', jacket: '#7b5aa6', hat: undefined, hairStyle: 'crespo', hair: '#120c08' }, { ...ELENCO.lia.look, skin: '#f0dccb', skirt: { color: '#2fa36b' }, jacket: '#2fa36b', hairStyle: 'chanel', hair: '#c8572b' }];
const BABY: Look = { skin: '#f0dccb', jacket: '#f4f0e8', pants: '#f4f0e8', shoes: '#f4f0e8', gloves: '#f0dccb', hair: '#3a2416', hairStyle: 'nenhum', body: 'crianca' };

// ---------- Atalho para personagem ----------
export const P = (o: Partial<Pose> = {}): Pose => ({ ...REST, ...o });
type K = { at: number; v: Partial<Pose>; dur?: number; lead?: number };
export const track2 = (t: number, init: Pose, keys: K[]): Pose => {
  let cur = { ...init };
  for (const k of [...keys].sort((a, b) => a.at - b.at)) {
    const end = k.at - (k.lead ?? 4) * F;
    const p = seg(t, end - (k.dur ?? 5) * F, end);
    if (p <= 0) break;
    const next = { ...cur } as Record<string, number>;
    for (const n in k.v) next[n] = (cur as Record<string, number>)[n] + (((k.v as Record<string, number>)[n]) - (cur as Record<string, number>)[n]) * p;
    cur = next as Pose;
  }
  return cur;
};
export const Ch = ({ t, look, pose, keys = [], faces, seed = 1, right, left }: { t: number; look: Look; pose: Partial<Pose>; keys?: K[]; faces: FaceKey[]; seed?: number; right?: JSX.Element; left?: JSX.Element }) => (
  <Character pose={track2(t, P(pose), keys)} face={faceAt(t, faces, seed)} look={look} right={right} left={left} />
);

// ---------- Bebê enrolado na manta ----------
export const Baby = ({ t, face = 'content', blanket = '#f2b8c6', position = [0, 0, 0] as V3, rotation = [0, 0, 0] as V3, scale = 1, seed = 7 }: { t: number; face?: FaceKey['f']; blanket?: string; position?: V3; rotation?: V3; scale?: number; seed?: number }) => (
  <group position={position} rotation={rotation} scale={scale}>
    <group position={[0, -0.55, 0]} scale={0.62}>
      <Character pose={P({ lsz: 0.2, rsz: 0.2 })} face={faceAt(t, [{ at: 0, f: face }], seed)} look={BABY} />
    </group>
    <mesh position={[0, -0.33, 0]} scale={[0.34, 0.3, 0.3]} castShadow>
      <sphereGeometry args={[1, 24, 18]} />
      <meshStandardMaterial color={blanket} roughness={0.9} />
    </mesh>
  </group>
);

// ---------- Número que brilha na palma ----------
export const PalmNumber = ({ t, at, text, color = '#ffd23a', w = 1.1, position = [0, 0, 0] as V3 }: { t: number; at: number; text: string; color?: string; w?: number; position?: V3 }) => {
  const k = seg(t, at - 8 * F, at, back);
  if (k <= 0.001) return null;
  const pulse = 1 + 0.04 * Math.sin((t - at) * 6);
  return (
    <group position={position} scale={k * pulse}>
      <mesh>
        <planeGeometry args={[w * 1.15, w * 0.48]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[w, w * 0.36]} />
        <meshBasicMaterial map={labelTex(text, { w: 1024, h: 368, bg: '#1b1530', fg: color, border: color, radius: 40 })} toneMapped={false} />
      </mesh>
      <pointLight intensity={2} distance={2.5} color={color} />
    </group>
  );
};

// ---------- Cenários ----------
// Berçário da maternidade.
export const Bercario = () => (
  <group>
    <WarmLights sun={[-3, 7, 6]} bg="#bcd7e6" sky="#ffffff" ground="#7a8ea0" fill={1.1} fog={[12, 30]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#e6e1d6" roughness={0.6} />
    </mesh>
    <Box p={[0, 3, -3]} s={[16, 6, 0.3]} c="#a9cfe3" r={0.7} />
    <Box p={[0, 0.5, -2.84]} s={[16, 1.0, 0.05]} c="#f4f0e8" />
    <Sign text="MATERNIDADE" w={3.4} h={0.55} position={[0, 3.6, -2.8]} bg="#ffffff" fg="#3a7aa8" />
    <Box p={[-2.6, 2.4, -2.82]} s={[1.6, 1.2, 0.05]} c="#ffffff" />
    <Box p={[-2.6, 2.4, -2.79]} s={[1.4, 1.0, 0.03]} c="#d4ecf7" r={0.1} />
    <Box p={[2.6, 2.4, -2.82]} s={[1.6, 1.2, 0.05]} c="#ffffff" />
    <Box p={[2.6, 2.4, -2.79]} s={[1.4, 1.0, 0.03]} c="#d4ecf7" r={0.1} />
  </group>
);

export const Berco = ({ position = [0, 0, 0] as V3, color = '#f4f0e8' }: { position?: V3; color?: string }) => (
  <group position={position}>
    <Box p={[0, 0.55, 0]} s={[1.0, 0.08, 0.6]} c="#ffffff" />
    {[-1, 1].map((sx) => [-1, 1].map((sz) => <Box key={`${sx}${sz}`} p={[sx * 0.48, 0.45, sz * 0.28]} s={[0.05, 0.9, 0.05]} c={color} />))}
    {Array.from({ length: 9 }, (_, i) => (
      <group key={i}>
        <Box p={[-0.4 + i * 0.1, 0.75, 0.28]} s={[0.025, 0.4, 0.025]} c={color} />
        <Box p={[-0.4 + i * 0.1, 0.75, -0.28]} s={[0.025, 0.4, 0.025]} c={color} />
      </group>
    ))}
    <Box p={[0, 0.95, 0.28]} s={[1.0, 0.05, 0.05]} c={color} />
    <Box p={[0, 0.95, -0.28]} s={[1.0, 0.05, 0.05]} c={color} />
  </group>
);

// Interior genérico (sala, casa, escola, velório) com parede, piso, rodapé e placa.
export const Interior = ({ parede, piso = '#c9a77c', placa, placaBg = '#24382e', placaFg = '#f3cf6b', bg, luz = 1 }: { parede: string; piso?: string; placa?: string; placaBg?: string; placaFg?: string; bg?: string; luz?: number }) => (
  <group>
    <WarmLights sun={[-3, 7, 6]} bg={bg ?? parede} sky="#fff3dd" ground="#4a3a2a" fill={1.0 * luz} power={2.4 * luz} fog={[12, 30]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color={piso} roughness={0.7} />
    </mesh>
    <Box p={[0, 3, -3]} s={[16, 6, 0.3]} c={parede} r={0.7} />
    <Box p={[0, 0.15, -2.84]} s={[16, 0.3, 0.05]} c="#5a3a22" />
    {placa && <Sign text={placa} w={3.2} h={0.55} position={[0, 3.5, -2.8]} bg={placaBg} fg={placaFg} />}
  </group>
);

export const Balloons = ({ t, position = [0, 0, 0] as V3 }: { t: number; position?: V3 }) => (
  <group position={position}>
    {['#e5484d', '#3d8bfd', '#ffd23a', '#2fa36b', '#b05ad9'].map((c, i) => {
      const x = (i - 2) * 0.55;
      const y = 2.9 + Math.sin(t * 1.5 + i) * 0.06 + (i % 2) * 0.3;
      return (
        <group key={i}>
          <mesh position={[x, y, 0]} scale={[0.3, 0.36, 0.3]} castShadow>
            <sphereGeometry args={[1, 20, 16]} />
            <meshStandardMaterial color={c} roughness={0.25} />
          </mesh>
          <mesh position={[x, y / 2, 0]}>
            <cylinderGeometry args={[0.005, 0.005, y, 4]} />
            <meshStandardMaterial color="#ddd" />
          </mesh>
        </group>
      );
    })}
  </group>
);

// Câmera fotográfica (na mão: eixo -Y continua o antebraço).
export const Camera = ({ flash = 0, ...g }: { flash?: number; position?: V3; rotation?: V3 }) => (
  <group {...g}>
    <mesh position={[0, -0.12, 0]} castShadow>
      <boxGeometry args={[0.26, 0.16, 0.14]} />
      <meshStandardMaterial color="#2a2a2e" />
    </mesh>
    <mesh position={[0, -0.12, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 0.06, 20]} />
      <meshStandardMaterial color="#111" metalness={0.6} />
    </mesh>
    {flash > 0 && (
      <mesh position={[0.08, -0.02, 0.08]}>
        <sphereGeometry args={[0.06 + 0.25 * flash, 12, 10]} />
        <meshBasicMaterial color="#fffbe0" transparent opacity={flash} toneMapped={false} />
      </mesh>
    )}
  </group>
);

export const Desk = ({ position = [0, 0, 0] as V3 }: { position?: V3 }) => (
  <group position={position}>
    <Box p={[0, 0.62, 0]} s={[0.9, 0.06, 0.55]} c="#b07a45" />
    {[-0.4, 0.4].map((x) => <Box key={x} p={[x, 0.3, 0]} s={[0.05, 0.6, 0.5]} c="#555" />)}
  </group>
);

export const Book = ({ open = 1, ...g }: { open?: number; position?: V3; rotation?: V3 }) => (
  <group {...g}>
    <mesh position={[-0.11, 0, 0]} rotation={[0, 0, open * 0.25]} castShadow>
      <boxGeometry args={[0.22, 0.02, 0.3]} />
      <meshStandardMaterial color="#f7f3e8" />
    </mesh>
    <mesh position={[0.11, 0, 0]} rotation={[0, 0, -open * 0.25]} castShadow>
      <boxGeometry args={[0.22, 0.02, 0.3]} />
      <meshStandardMaterial color="#f7f3e8" />
    </mesh>
  </group>
);

// Prédio que desaba a partir de `fall` (encolhe, inclina e afunda em poeira).
export const Building = ({ t, fall = Infinity, x, z, w = 2, h = 6, color = '#d98c5f', lit = false }: { t: number; fall?: number; x: number; z: number; w?: number; h?: number; color?: string; lit?: boolean }) => {
  const k = seg(t, fall, fall + 0.7, easeIn);
  const tilt = k * 0.35 * (rand(x) > 0.5 ? 1 : -1);
  const hh = h * (1 - 0.82 * k);
  return (
    <group position={[x, 0, z]}>
      <group rotation={[0, 0, tilt]}>
        <mesh position={[0, hh / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, hh, w * 0.8]} />
          <meshStandardMaterial map={windowsTex(color, Math.max(1, Math.round(h / 1.2)), 3)} emissive={lit ? '#ffcf6a' : '#000'} emissiveIntensity={lit ? 0.08 : 0} roughness={0.8} />
        </mesh>
      </group>
      {t > fall && <Puff t={t} at={fall + 0.35} n={10} position={[0, 0.4, w * 0.45]} color="#9a948a" size={0.9} />}
      {t > fall + 0.4 && <Puff t={t} at={fall + 0.75} n={8} position={[0, 0.6, w * 0.45]} color="#7e7a72" size={1.2} />}
    </group>
  );
};

// Cidade (dia ou noite) com prédios. `falls` = tempos em que cada prédio do centro desaba.
export const Cidade = ({ t, noite = false, falls = [] as number[] }: { t: number; noite?: boolean; falls?: number[] }) => (
  <group>
    <WarmLights sun={noite ? [3, 8, 4] : [-6, 7, 7]} bg={noite ? '#1c2440' : '#f2b97c'} sky={noite ? '#8fa6d9' : '#fff1d8'} ground={noite ? '#1a1a26' : '#8a6040'} power={noite ? 0.9 : 2.4} fill={noite ? 0.55 : 0.9} fog={noite ? [10, 40] : [16, 50]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color={noite ? '#2c2f3a' : '#9a8a72'} roughness={noite ? 0.3 : 0.9} />
    </mesh>
    <Building t={t} x={-3.2} z={-4} h={7} color="#c7765a" fall={falls[1]} lit={noite} />
    <Building t={t} x={0} z={-5} h={9} color="#e8b85a" fall={falls[0]} lit={noite} />
    <Building t={t} x={3.2} z={-4} h={6.5} color="#7aa3c7" fall={falls[2]} lit={noite} />
    <Building t={t} x={-6.5} z={-8} h={10} color="#d7a36b" lit={noite} />
    <Building t={t} x={6.5} z={-8} h={8} color="#b9886a" lit={noite} />
    <Building t={t} x={-1.8} z={-12} h={12} color="#a98a7a" lit={noite} />
    <Building t={t} x={2.6} z={-13} h={11} color="#c99a6a" lit={noite} />
  </group>
);

// Chuva: riscos finos caindo, função pura do tempo.
export const Rain = ({ t, n = 160, area = 9, top = 8, center = [0, 0, 0] as V3 }: { t: number; n?: number; area?: number; top?: number; center?: V3 }) => (
  <group position={center}>
    {Array.from({ length: n }, (_, i) => {
      const y = top - (((t * 9 + rand(i) * top) % top) + top) % top;
      return (
        <mesh key={i} position={[(rand(i + 3) - 0.5) * area, y, (rand(i + 9) - 0.5) * area * 0.6]}>
          <boxGeometry args={[0.012, 0.35, 0.012]} />
          <meshBasicMaterial color="#b8c8ea" transparent opacity={0.55} />
        </mesh>
      );
    })}
  </group>
);

// Escombros à noite com lanterna.
export const Escombros = ({ t }: { t: number }) => (
  <group>
    <WarmLights sun={[3, 8, 4]} bg="#161b30" sky="#8094c8" ground="#14141c" power={0.7} fill={0.45} fog={[8, 26]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#3a3a40" roughness={0.9} />
    </mesh>
    {Array.from({ length: 40 }, (_, i) => {
      const x = (rand(i) - 0.5) * 9;
      const z = -1 - rand(i + 1) * 7;
      const s = 0.3 + rand(i + 2) * 0.9;
      return (
        <mesh key={i} position={[x, s * 0.3, z]} rotation={[rand(i + 4) * 0.8, rand(i + 5) * 3, rand(i + 6) * 0.8]} castShadow receiveShadow>
          <boxGeometry args={[s * 1.4, s * 0.5, s]} />
          <meshStandardMaterial color={i % 3 ? '#8a857c' : '#6f6a62'} roughness={0.95} />
        </mesh>
      );
    })}
    {[-2.2, 1.8, 3.4].map((x, i) => (
      <mesh key={x} position={[x, 0.9, -3 - i]} rotation={[0, 0, 0.5 - i * 0.45]} castShadow>
        <boxGeometry args={[0.12, 2.4, 0.12]} />
        <meshStandardMaterial color="#5b4a3a" />
      </mesh>
    ))}
    <Rain t={t} n={120} area={8} top={7} center={[0, 0, -1]} />
  </group>
);

// Lanterna na mão: feixe de luz para frente.
export const Lanterna = () => (
  <group>
    <mesh position={[0, -0.12, 0]}>
      <cylinderGeometry args={[0.04, 0.05, 0.22, 12]} />
      <meshStandardMaterial color="#e8c240" />
    </mesh>
    <mesh position={[0, -0.24, 0]}>
      <sphereGeometry args={[0.045, 10, 8]} />
      <meshBasicMaterial color="#fff6c8" toneMapped={false} />
    </mesh>
    <spotLight position={[0, -0.24, 0]} intensity={14} distance={9} angle={0.5} penumbra={0.6} color="#fff1c0" />
  </group>
);

// Saco de cimento "econômico".
export const Saco = ({ text = 'CONCRETO\nECONÔMICO', ...g }: { text?: string; position?: V3; rotation?: V3; scale?: number }) => (
  <group {...g}>
    <mesh castShadow>
      <boxGeometry args={[0.9, 1.2, 0.35]} />
      <meshStandardMaterial color="#d8cdb4" roughness={0.95} />
    </mesh>
    <mesh position={[0, 0.05, 0.18]}>
      <planeGeometry args={[0.8, 0.7]} />
      <meshStandardMaterial map={labelTex(text, { w: 512, h: 448, bg: '#d8cdb4', fg: '#b3261e' })} />
    </mesh>
  </group>
);

export const Chair = ({ position = [0, 0, 0] as V3, rotation = [0, 0, 0] as V3 }: { position?: V3; rotation?: V3 }) => (
  <group position={position} rotation={rotation}>
    <Box p={[0, 0.45, 0]} s={[0.5, 0.05, 0.5]} c="#4a3426" />
    <Box p={[0, 0.8, -0.23]} s={[0.5, 0.65, 0.05]} c="#4a3426" />
    {[-1, 1].map((a) => [-1, 1].map((b) => <Box key={`${a}${b}`} p={[a * 0.22, 0.22, b * 0.22]} s={[0.04, 0.45, 0.04]} c="#2e2018" />))}
  </group>
);

export const Flores = ({ position = [0, 0, 0] as V3 }: { position?: V3 }) => (
  <group position={position}>
    <mesh position={[0, 0.3, 0]} castShadow>
      <cylinderGeometry args={[0.2, 0.15, 0.6, 16]} />
      <meshStandardMaterial color="#e9e2d0" />
    </mesh>
    {Array.from({ length: 7 }, (_, i) => (
      <mesh key={i} position={[(rand(i) - 0.5) * 0.4, 0.75 + rand(i + 1) * 0.25, (rand(i + 2) - 0.5) * 0.3]}>
        <sphereGeometry args={[0.09, 10, 8]} />
        <meshStandardMaterial color={['#ffffff', '#f2d16b', '#f4a3b5'][i % 3]} />
      </mesh>
    ))}
  </group>
);

// Retrato emoldurado (no velório).
export const Retrato = ({ text, position = [0, 0, 0] as V3 }: { text: string; position?: V3 }) => (
  <group position={position}>
    <mesh castShadow>
      <boxGeometry args={[1.1, 1.4, 0.08]} />
      <meshStandardMaterial color="#8a6a3a" metalness={0.5} roughness={0.4} />
    </mesh>
    <mesh position={[0, 0, 0.045]}>
      <planeGeometry args={[0.9, 1.2]} />
      <meshStandardMaterial map={labelTex(text, { w: 512, h: 640, bg: '#f4ead8', fg: '#c8452e', border: '#e8c240', radius: 12 })} />
    </mesh>
  </group>
);

// Zoom de câmera "pop" para números.
export const popIn = (t: number, at: number) => clamp01(seg(t, at - 6 * F, at, easeOut));
export { THREE };
