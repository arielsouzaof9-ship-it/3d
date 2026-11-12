import { useThree } from '@react-three/fiber';
import { useLayoutEffect } from 'react';
import * as THREE from 'three';
import { back, clamp01, rand, seg, V3 } from './anim';
import { Look } from './Character';
import { ELENCO } from './personagens';
import { Box } from './sets';
import { canvasTex, FONT, plasterTex } from './textures';
import { F } from './timeline';

// ============================================================================
// O PORÃO — elenco, cenários e objetos novos desta história (noite, luz de vela).
// ============================================================================

type G = { position?: V3; rotation?: V3; scale?: number | V3 };

// ---------- Elenco ----------
export const HELENA: Look = { ...ELENCO.paula.look, skirt: { color: '#2a6a4f', long: true } };
export const LUISA: Look = ELENCO.lia.look;
export const BIA: Look = {
  skin: '#f0dccb', jacket: '#e6b8d8', pants: '#e6b8d8', shoes: '#f2f2f2', gloves: '#1e1f24',
  hair: '#6a3a1e', hairStyle: 'rabo', body: 'crianca', pattern: 'listras', pattern2: '#f7eef4', patternH: true,
};

// ---------- Luz da noite ----------
const Sky = ({ bg, near, far }: { bg: string; near: number; far: number }) => {
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    scene.background = new THREE.Color(bg);
    scene.fog = new THREE.Fog(bg, near, far);
  }, [scene, bg, near, far]);
  return null;
};

// Lua fria + ambiente azul. `dim` (0..1) apaga quase tudo (fósforo apagou).
export const NightLights = ({ bg = '#0d1424', fog = [8, 26] as [number, number], moon = [6, 8, 4] as V3, power = 0.9, fill = 0.35, dim = 0 }) => {
  const k = 1 - dim * 0.85;
  power *= 1.6;
  fill = fill * 2 + 0.25;
  return (
    <>
      <Sky bg={bg} near={fog[0]} far={fog[1]} />
      <hemisphereLight args={['#6f86c4', '#1a1410', fill * k]} />
      <directionalLight
        position={moon}
        intensity={power * k}
        color="#a9bff0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
    </>
  );
};

// Chama tremendo (vela ou fósforo). Tremor determinístico por quadro.
export const Flame = ({ t, size = 1, power = 6, out = 0, ...g }: G & { t: number; size?: number; power?: number; out?: number }) => {
  const fl = 0.85 + 0.15 * rand(Math.floor(t * 15) + 3);
  const k = 1 - clamp01(out);
  if (k <= 0) return null;
  return (
    <group {...g}>
      <mesh position={[0, 0.05 * size, 0]} scale={[0.035 * size * k, 0.08 * size * fl * k, 0.035 * size * k]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshBasicMaterial color="#ffd27a" toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.1, 0.05]} intensity={power * fl * k} distance={7} decay={1.6} color="#ffa94d" castShadow={false} />
    </group>
  );
};

export const Candle = ({ t, ...g }: G & { t: number }) => (
  <group {...g}>
    <mesh position={[0, 0.1, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
      <meshStandardMaterial color="#f2ead2" />
    </mesh>
    <mesh position={[0, 0.005, 0]}>
      <cylinderGeometry args={[0.11, 0.11, 0.02, 20]} />
      <meshStandardMaterial color="#8a7a5a" metalness={0.6} roughness={0.4} />
    </mesh>
    <Flame t={t} position={[0, 0.22, 0]} size={1} power={5} />
  </group>
);

// Vela na mão: o eixo -Y local continua o antebraço, então a vela fica "em pé" virada.
export const HandCandle = ({ t }: { t: number }) => (
  <group position={[0, -0.12, 0.02]} rotation={[Math.PI, 0, 0]}>
    <Candle t={t} scale={0.9} />
  </group>
);

export const HandMatch = ({ t, out = 0 }: { t: number; out?: number }) => (
  <group position={[0, -0.08, 0.02]} rotation={[Math.PI, 0, 0]}>
    <mesh position={[0, 0.06, 0]}>
      <cylinderGeometry args={[0.008, 0.008, 0.14, 6]} />
      <meshStandardMaterial color="#e2c58f" />
    </mesh>
    <Flame t={t} position={[0, 0.13, 0]} size={0.7} power={7} out={out} />
  </group>
);

// ---------- A mulher de preto (sem rosto) ----------
export const Ghost = ({ t, opacity = 1, reach = 0, ...g }: G & { t: number; opacity?: number; reach?: number }) => {
  const sway = Math.sin(t * 1.3) * 0.02;
  const tr = opacity < 1;
  const m = (c: string) => <meshStandardMaterial color={c} roughness={0.9} transparent={tr} opacity={opacity} />;
  return (
    <group {...g}>
      <group rotation={[0, 0, sway]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <coneGeometry args={[0.42, 1.2, 32, 1, true]} />
          {m('#0c0b10')}
        </mesh>
        <mesh position={[0, 1.15, 0]} scale={[0.85, 1.2, 0.75]} castShadow>
          <sphereGeometry args={[0.3, 24, 16]} />
          {m('#16141c')}
        </mesh>
        {/* cabeça lisa, pálida, sem rosto */}
        <mesh position={[0, 1.72, 0]} castShadow>
          <sphereGeometry args={[0.42, 32, 24]} />
          {m('#c9ccd1')}
        </mesh>
        {/* cabelo comprido e escuro caindo pelas costas */}
        <mesh position={[0, 1.66, -0.06]} scale={[1.05, 1.35, 1.05]}>
          <sphereGeometry args={[0.43, 32, 16, Math.PI * 0.75, Math.PI * 1.5]} />
          <meshStandardMaterial color="#050507" roughness={1} side={THREE.DoubleSide} transparent={tr} opacity={opacity} />
        </mesh>
        {/* braços finos; o direito se estende (reach 0..1) */}
        {[-1, 1].map((s) => (
          <group key={s} position={[0.26 * s, 1.32, 0]} rotation={[s > 0 ? -1.3 * reach : 0, 0, 0.18 * s]}>
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.64, 8]} />
              {m('#c9ccd1')}
            </mesh>
            <mesh position={[0, -0.66, 0]}>
              <sphereGeometry args={[0.05, 10, 8]} />
              {m('#c9ccd1')}
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

// ---------- Placa que salta (informação como objeto) ----------
export const PopSign = ({ t, at, text, w = 1.4, h = 0.6, bg = '#3a2616', fg = '#f1d79a', ...g }: G & { t: number; at: number; text: string; w?: number; h?: number; bg?: string; fg?: string }) => {
  const k = seg(t, at - 6 * F, at, back);
  if (k <= 0.001) return null;
  return (
    <group {...g}>
      <group scale={k}>
        <mesh castShadow>
          <boxGeometry args={[w, h, 0.06]} />
          <meshStandardMaterial color={bg} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[w * 0.96, h * 0.92]} />
          <meshStandardMaterial map={rusticTex(text, bg, fg)} roughness={0.7} emissive="#ffffff" emissiveIntensity={0.12} emissiveMap={rusticTex(text, bg, fg)} />
        </mesh>
      </group>
    </group>
  );
};

const rusticTex = (text: string, bg: string, fg: string) =>
  canvasTex(`rustic|${text}|${bg}|${fg}`, 1024, 440, (c) => {
    c.fillStyle = bg;
    c.fillRect(0, 0, 1024, 440);
    c.strokeStyle = 'rgba(0,0,0,0.25)';
    c.lineWidth = 4;
    for (let y = 30; y < 440; y += 52) {
      c.beginPath();
      c.moveTo(0, y);
      c.bezierCurveTo(300, y + 8, 700, y - 8, 1024, y + 4);
      c.stroke();
    }
    const lines = text.split('\n');
    let size = 300 / lines.length;
    c.font = `900 ${size}px ${FONT}`;
    const wd = Math.max(...lines.map((l) => c.measureText(l).width));
    if (wd > 900) size *= 900 / wd;
    c.font = `900 ${size}px ${FONT}`;
    c.fillStyle = fg;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    lines.forEach((l, i) => c.fillText(l, 512, 220 + (i - (lines.length - 1) / 2) * size * 1.08));
  });

// ---------- Relógio de parede: ponteiros giram e param em 3:07 na palavra ----------
export const WallClock = ({ t, from, at, ...g }: G & { t: number; from: number; at: number }) => {
  const k = seg(t, from, at - F, (x) => 1 - Math.pow(1 - x, 3));
  const minutes = 60 * 2 + 7 * k + (1 - k) * 0 + k * 60; // de 2:00 até 3:07
  const total = 120 + k * 67;
  void minutes;
  const mAng = -((total % 60) / 60) * Math.PI * 2;
  const hAng = -((total / 60) % 12 / 12) * Math.PI * 2;
  const tick = t >= at - F ? 1 + 0.08 * Math.max(0, 1 - (t - at) / 0.25) : 1;
  return (
    <group {...g}>
      <group scale={tick}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.55, 0.08, 48]} />
          <meshStandardMaterial color="#5a3a22" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <circleGeometry args={[0.48, 48]} />
          <meshStandardMaterial map={clockFace()} emissive="#fff4d8" emissiveIntensity={0.25} emissiveMap={clockFace()} />
        </mesh>
        <mesh position={[0, 0, 0.06]} rotation={[0, 0, hAng]}>
          <mesh position={[0, 0.13, 0]}>
            <boxGeometry args={[0.045, 0.26, 0.01]} />
            <meshStandardMaterial color="#1a1208" />
          </mesh>
        </mesh>
        <mesh position={[0, 0, 0.07]} rotation={[0, 0, mAng]}>
          <mesh position={[0, 0.19, 0]}>
            <boxGeometry args={[0.03, 0.38, 0.01]} />
            <meshStandardMaterial color="#1a1208" />
          </mesh>
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <circleGeometry args={[0.03, 16]} />
          <meshStandardMaterial color="#b3332e" />
        </mesh>
      </group>
    </group>
  );
};

const clockFace = () =>
  canvasTex('clockface', 512, 512, (c) => {
    c.fillStyle = '#efe4c8';
    c.beginPath();
    c.arc(256, 256, 256, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#2a1a0e';
    c.font = `900 64px ${FONT}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      c.fillText(String(i), 256 + Math.sin(a) * 190, 256 - Math.cos(a) * 190);
    }
  });

// ---------- Fazenda à noite ----------
const Roof = ({ p, w, d, h, c }: { p: V3; w: number; d: number; h: number; c: string }) => (
  <mesh position={p} rotation={[0, 0, 0]} castShadow>
    <cylinderGeometry args={[h, h, d, 3, 1]} />
    <meshStandardMaterial color={c} roughness={0.9} />
  </mesh>
);

export const Farm = ({ t, windowGhost = 0 }: { t: number; windowGhost?: number }) => (
  <group>
    <NightLights bg="#0f1830" fog={[10, 34]} power={1.0} fill={0.45} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#1f2e1c" roughness={1} />
    </mesh>
    {/* lua */}
    <mesh position={[-6, 11, -22]}>
      <sphereGeometry args={[1.6, 32, 24]} />
      <meshBasicMaterial color="#e8eefc" toneMapped={false} />
    </mesh>
    {/* casa */}
    <group position={[0, 0, -6]}>
      <Box p={[0, 1.8, 0]} s={[7, 3.6, 4]} c="#c9bfa8" map={plasterTex('#b8ae96')} />
      <Box p={[0, 4.6, 0]} s={[4, 2, 3.2]} c="#b8ae96" map={plasterTex('#a89e86')} />
      <group rotation={[0, Math.PI / 2, 0]}>
        <group rotation={[0, 0, Math.PI / 2]}>
          <Roof p={[3.6 + 0.0, 0, 0]} w={7} d={7.6} h={0} c="#3a2a24" />
        </group>
      </group>
      <mesh position={[0, 4.3, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} scale={[1, 1, 1]} castShadow>
        <cylinderGeometry args={[2.6, 2.6, 7.6, 3, 1]} />
        <meshStandardMaterial color="#3a2a24" roughness={0.9} />
      </mesh>
      {/* porta e janelas */}
      <Box p={[0, 1.1, 2.03]} s={[1.0, 2.2, 0.08]} c="#3b2416" />
      {[-2.3, 2.3].map((x) => (
        <group key={x}>
          <Box p={[x, 2.0, 2.03]} s={[1.1, 1.2, 0.06]} c={x < 0 ? '#ffcf7a' : '#1a1f2a'} />
          {x < 0 && <pointLight position={[x, 2, 2.6]} intensity={2.5} distance={4} color="#ffb85a" />}
        </group>
      ))}
      {/* janela do sótão: às vezes alguém olha */}
      <Box p={[0, 4.7, 1.62]} s={[0.9, 0.9, 0.06]} c="#2a3550" />
      {windowGhost > 0 && (
        <mesh position={[0, 4.75, 1.66]}>
          <circleGeometry args={[0.22, 24]} />
          <meshBasicMaterial color="#c9ccd1" transparent opacity={windowGhost} />
        </mesh>
      )}
      {/* varanda */}
      <Box p={[0, 0.12, 2.8]} s={[7.4, 0.24, 1.6]} c="#4a3626" />
      {[-3.4, -1.2, 1.2, 3.4].map((x) => (
        <Box key={x} p={[x, 1.6, 3.45]} s={[0.12, 3.0, 0.12]} c="#4a3626" />
      ))}
      <Box p={[0, 3.15, 2.9]} s={[7.6, 0.12, 1.8]} c="#3a2a24" />
    </group>
    {/* cerca e árvores secas */}
    {Array.from({ length: 13 }, (_, i) => -9 + i * 1.5).map((x) => (
      <group key={x}>
        <Box p={[x, 0.5, -1.2]} s={[0.1, 1.0, 0.1]} c="#3a2a1c" />
      </group>
    ))}
    <Box p={[-5.5, 0.75, -1.2]} s={[7, 0.08, 0.06]} c="#3a2a1c" />
    <Box p={[5.5, 0.75, -1.2]} s={[7, 0.08, 0.06]} c="#3a2a1c" />
    {[[-7, -9], [8, -11], [-11, -14]].map(([x, z], i) => (
      <group key={i} position={[x, 0, z]}>
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.25, 4, 8]} />
          <meshStandardMaterial color="#1a140f" />
        </mesh>
        {[0.7, -0.6, 0.4].map((a, j) => (
          <mesh key={j} position={[a, 3.4 + j * 0.3, 0]} rotation={[0, 0, -a * 1.2]}>
            <cylinderGeometry args={[0.04, 0.07, 1.6, 6]} />
            <meshStandardMaterial color="#1a140f" />
          </mesh>
        ))}
      </group>
    ))}
    {/* névoa baixa */}
    {Array.from({ length: 10 }, (_, i) => (
      <mesh key={i} position={[(rand(i) - 0.5) * 18 + Math.sin(t * 0.2 + i) * 0.5, 0.25, -2 - rand(i + 9) * 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5 + rand(i + 4) * 2, 24]} />
        <meshBasicMaterial color="#8090b0" transparent opacity={0.08} depthWrite={false} />
      </mesh>
    ))}
  </group>
);

// ---------- Quarto das meninas ----------
export const Bed = ({ blanket = '#7a3a5a', ...g }: G & { blanket?: string }) => (
  <group {...g}>
    <Box p={[0, 0.25, 0]} s={[1.1, 0.5, 2.1]} c="#5a3a22" />
    <Box p={[0, 0.55, 0]} s={[1.0, 0.12, 2.0]} c="#efe8dc" />
    <Box p={[0, 0.66, -0.75]} s={[0.7, 0.14, 0.38]} c="#f6f2ea" />
    <Box p={[0, 0.66, 0.35]} s={[1.06, 0.14, 1.3]} c={blanket} />
    <Box p={[0, 0.75, -1.03]} s={[1.1, 1.5, 0.08]} c="#4a2e1a" />
  </group>
);

// Armário com porta entreaberta. knock = deslocamento curto da porta.
export const Wardrobe = ({ open = 0.25, knock = 0, ...g }: G & { open?: number; knock?: number }) => (
  <group {...g}>
    <Box p={[0, 1.4, 0]} s={[1.6, 2.8, 0.8]} c="#4a2e1a" />
    <Box p={[0, 1.4, 0.41]} s={[1.45, 2.6, 0.02]} c="#050407" />
    <group position={[-0.72, 1.4, 0.42]} rotation={[0, -open - knock * 0.06, 0]}>
      <Box p={[0.36, 0, 0]} s={[0.72, 2.6, 0.05]} c="#5c3a22" />
      <Box p={[0.62, 0, 0.04]} s={[0.04, 0.2, 0.04]} c="#c9a14a" />
    </group>
    <group position={[0.72, 1.4, 0.42]} rotation={[0, knock * 0.05, 0]}>
      <Box p={[-0.36, 0, 0]} s={[0.72, 2.6, 0.05]} c="#5c3a22" />
      <Box p={[-0.62, 0, 0.04]} s={[0.04, 0.2, 0.04]} c="#c9a14a" />
    </group>
  </group>
);

export const Bedroom = ({ t, knock = 0, clockFrom = 0, clockAt = 0 }: { t: number; knock?: number; clockFrom?: number; clockAt?: number }) => (
  <group>
    <NightLights bg="#0b1020" fog={[9, 22]} moon={[5, 6, 5]} power={0.7} fill={0.4} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial map={plankTex()} roughness={0.85} />
    </mesh>
    <Box p={[0, 2.5, -3]} s={[12, 5, 0.2]} c="#2c3654" map={wallpaperTex()} />
    <Box p={[-4.2, 2.5, 0]} s={[0.2, 5, 8]} c="#2c3654" map={wallpaperTex()} />
    {/* janela com luar */}
    <group position={[2.6, 2.6, -2.88]}>
      <Box p={[0, 0, 0]} s={[1.4, 1.6, 0.05]} c="#9fb6e8" />
      <Box p={[0, 0, 0.03]} s={[0.06, 1.6, 0.04]} c="#3a2a1c" />
      <Box p={[0, 0, 0.03]} s={[1.4, 0.06, 0.04]} c="#3a2a1c" />
      <pointLight position={[0, 0, 1.2]} intensity={2} distance={5} color="#9fb6ff" />
    </group>
    <Bed position={[-1.3, 0, -1.6]} blanket="#7a3a5a" />
    <Bed position={[1.1, 0, -1.6]} blanket="#3a5a7a" />
    {/* criado-mudo com vela */}
    <Box p={[-0.1, 0.35, -2.3]} s={[0.6, 0.7, 0.5]} c="#4a2e1a" />
    <Candle t={t} position={[-0.1, 0.7, -2.3]} />
    <Wardrobe position={[-3.4, 0, 1.2]} rotation={[0, Math.PI / 2, 0]} knock={knock} />
    <WallClock t={t} from={clockFrom} at={clockAt} position={[-0.1, 3.2, -2.85]} />
  </group>
);

const plankTex = () =>
  canvasTex('plank', 512, 512, (c) => {
    for (let i = 0; i < 8; i++) {
      c.fillStyle = i % 2 ? '#4a3220' : '#55392a';
      c.fillRect(0, i * 64, 512, 64);
      c.fillStyle = '#2a1a10';
      c.fillRect(0, i * 64, 512, 3);
    }
  }, [6, 6]);

const wallpaperTex = () =>
  canvasTex('wallpaper', 256, 256, (c) => {
    c.fillStyle = '#3a4466';
    c.fillRect(0, 0, 256, 256);
    c.fillStyle = '#4a5478';
    for (let x = 0; x < 256; x += 64) c.fillRect(x, 0, 18, 256);
    c.fillStyle = '#5c6690';
    for (let y = 32; y < 256; y += 64) for (let x = 41; x < 256; x += 64) {
      c.beginPath();
      c.arc(x, y, 6, 0, Math.PI * 2);
      c.fill();
    }
  }, [6, 3]);

// ---------- Corredor com retratos ----------
// flipped = quadros virados para a parede (mostra o verso). photo = a foto da família com a mulher.
export const Frame = ({ flipped = true, photo = false, ghost = 1, w = 0.7, h = 0.9, ...g }: G & { flipped?: boolean; photo?: boolean; ghost?: number; w?: number; h?: number }) => (
  <group {...g}>
    <Box p={[0, 0, 0]} s={[w, h, 0.05]} c={flipped ? '#8a6a44' : '#c9a14a'} />
    {flipped ? (
      <>
        <Box p={[0, 0, 0.03]} s={[w * 0.05, h * 0.9, 0.01]} c="#5a4228" />
        <Box p={[0, 0, 0.03]} s={[w * 0.9, h * 0.05, 0.01]} c="#5a4228" />
      </>
    ) : (
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[w * 0.86, h * 0.86]} />
        <meshStandardMaterial map={photo ? familyPhoto(ghost > 0.5) : canvasTex('blankphoto', 64, 64, (c) => { c.fillStyle = '#7a7466'; c.fillRect(0, 0, 64, 64); })} emissive="#ffffff" emissiveIntensity={0.15} emissiveMap={photo ? familyPhoto(ghost > 0.5) : undefined} />
      </mesh>
    )}
  </group>
);

// Foto antiga em sépia: mãe e duas filhas — e, atrás, uma mulher de preto sem rosto.
const familyPhoto = (withGhost: boolean) =>
  canvasTex(`familyphoto|${withGhost}`, 512, 640, (c) => {
    const grd = c.createLinearGradient(0, 0, 0, 640);
    grd.addColorStop(0, '#cbb48c');
    grd.addColorStop(1, '#9a8260');
    c.fillStyle = grd;
    c.fillRect(0, 0, 512, 640);
    const person = (x: number, y: number, s: number, body: string, head: string, face: boolean) => {
      c.fillStyle = body;
      c.beginPath();
      c.ellipse(x, y + 120 * s, 60 * s, 90 * s, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = head;
      c.beginPath();
      c.arc(x, y, 58 * s, 0, Math.PI * 2);
      c.fill();
      if (face) {
        c.fillStyle = '#3a2a18';
        c.beginPath();
        c.arc(x - 20 * s, y - 4 * s, 6 * s, 0, Math.PI * 2);
        c.arc(x + 20 * s, y - 4 * s, 6 * s, 0, Math.PI * 2);
        c.fill();
        c.lineWidth = 4 * s;
        c.strokeStyle = '#3a2a18';
        c.beginPath();
        c.arc(x, y + 14 * s, 16 * s, 0.2, Math.PI - 0.2);
        c.stroke();
      }
    };
    if (withGhost) {
      c.fillStyle = '#1a1612';
      c.beginPath();
      c.ellipse(256, 340, 90, 260, 0, 0, Math.PI * 2);
      c.fill();
      person(256, 130, 1.05, '#1a1612', '#e2dccd', false);
      c.fillStyle = '#1a1612';
      c.beginPath();
      c.ellipse(256, 150, 70, 100, 0, Math.PI, Math.PI * 2);
      c.fill();
    }
    person(256, 300, 1.0, '#6a7a5a', '#b48a62', true);
    person(140, 400, 0.75, '#8a4a3a', '#8a5a3a', true);
    person(372, 410, 0.7, '#b89aac', '#d8c0a8', true);
    c.strokeStyle = 'rgba(60,40,20,0.35)';
    c.lineWidth = 18;
    c.strokeRect(9, 9, 494, 622);
  });

export const Corridor = ({ t, photoGhost = 1 }: { t: number; photoGhost?: number }) => (
  <group>
    <NightLights bg="#080b14" fog={[7, 20]} power={0.6} fill={0.35} />
    <pointLight position={[0, 3.6, -1.5]} intensity={3} distance={6} color="#9aa8d8" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, -6]}>
      <planeGeometry args={[4, 30]} />
      <meshStandardMaterial map={plankTex()} roughness={0.85} />
    </mesh>
    {[-1.6, 1.6].map((x) => (
      <group key={x}>
        <Box p={[x, 2, -6]} s={[0.1, 4, 30]} c="#3a3048" map={wallpaperTex()} />
        {[-1, -3.2, -5.4, -7.6, -9.8].map((z, i) => (
          <Frame key={z} flipped={!(x > 0 && i === 1)} photo={x > 0 && i === 1} ghost={photoGhost} position={[x - Math.sign(x) * 0.08, 2.0 + (i % 2) * 0.15, z]} rotation={[0, -Math.sign(x) * Math.PI / 2, 0]} />
        ))}
      </group>
    ))}
    <Box p={[0, 4, -6]} s={[3.4, 0.1, 30]} c="#1a1620" />
  </group>
);

// ---------- Escada do porão e porão ----------
export const Stairs = ({ t, n = 9 }: { t: number; n?: number }) => (
  <group>
    {Array.from({ length: n }, (_, i) => (
      <Box key={i} p={[0, -0.12 - i * 0.25, -i * 0.3]} s={[1.6, 0.25, 0.32]} c={i % 2 ? '#4a3020' : '#553826'} />
    ))}
    {[-0.85, 0.85].map((x) => (
      <Box key={x} p={[x, -1.1, -1.3]} s={[0.1, 3.4, 3.4]} c="#2a2230" />
    ))}
  </group>
);

export const StairTop = ({ t, eyes = 0 }: { t: number; eyes?: number }) => (
  <group>
    <NightLights bg="#05060a" fog={[6, 16]} power={0.6} fill={0.35} />
    <pointLight position={[0, 1.5, -1.8]} intensity={9} distance={7} color="#8f9fd0" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 3]}>
      <planeGeometry args={[8, 6]} />
      <meshStandardMaterial map={plankTex()} roughness={0.85} />
    </mesh>
    <Box p={[-2.4, 2, 0]} s={[3.2, 4, 0.2]} c="#3a3048" map={wallpaperTex()} />
    <Box p={[2.4, 2, 0]} s={[3.2, 4, 0.2]} c="#3a3048" map={wallpaperTex()} />
    <Box p={[0, 3.3, 0]} s={[1.6, 1.4, 0.2]} c="#3a3048" />
    <Box p={[0, -2.8, -5]} s={[3, 0.1, 6]} c="#0a0a0c" />
    <Stairs t={t} />
    {/* olhos no escuro, lá embaixo */}
    {eyes > 0 &&
      [-0.09, 0.09].map((x) => (
        <mesh key={x} position={[x, -1.7, -3.4]}>
          <sphereGeometry args={[0.03, 10, 8]} />
          <meshBasicMaterial color="#f2f2e8" transparent opacity={eyes} toneMapped={false} />
        </mesh>
      ))}
  </group>
);

// Bolinha descendo os degraus: um quique por degrau, parando em `at`.
export const ballPos = (t: number, from: number, at: number, n = 8): V3 => {
  const k = clamp01((t - from) / (at - from));
  const s = k * n;
  const i = Math.min(n - 1, Math.floor(s));
  const f = s - i;
  const hop = Math.sin(f * Math.PI) * 0.22;
  const y = -i * 0.25 - f * 0.25 + 0.1 + hop;
  const z = -i * 0.3 - f * 0.3 + 0.0;
  return k >= 1 ? [0.1, -n * 0.25 + 0.1, -n * 0.3] : [0.1, y, z];
};

export const Ball = ({ color = '#d23a3a', ...g }: G & { color?: string }) => (
  <group {...g}>
    <mesh castShadow>
      <sphereGeometry args={[0.1, 20, 16]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.1, 0.012, 6, 24]} />
      <meshStandardMaterial color="#f2e2a0" />
    </mesh>
  </group>
);

export const Basement = ({ t, dim = 0, scratch = 0 }: { t: number; dim?: number; scratch?: number }) => (
  <group>
    <NightLights bg="#030305" fog={[6, 16]} power={0.35} fill={0.25} dim={dim} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#2a2622" roughness={1} />
    </mesh>
    <Box p={[0, 2, -2.2]} s={[10, 4, 0.2]} c="#4a3a2c" map={boardTex()} />
    {/* arranhões na madeira: aparecem com a luz (scratch 0..1) */}
    <mesh position={[0, 1.9, -2.08]}>
      <planeGeometry args={[3.0, 1.2]} />
      <meshStandardMaterial map={scratchTex()} transparent opacity={scratch} roughness={0.9} />
    </mesh>
    {[[-2.6, -1.4], [2.8, -1.2], [-3.2, 0.6]].map(([x, z], i) => (
      <Box key={i} p={[x, 0.35, z]} s={[0.7, 0.7, 0.7]} c="#3a2a1c" />
    ))}
    <Box p={[3.4, 1.2, -1.6]} s={[0.8, 2.4, 0.5]} c="#2a1f16" />
  </group>
);

const boardTex = () =>
  canvasTex('boards', 512, 256, (c) => {
    for (let i = 0; i < 8; i++) {
      c.fillStyle = i % 2 ? '#463626' : '#4e3c2a';
      c.fillRect(i * 64, 0, 64, 256);
      c.fillStyle = '#1c140c';
      c.fillRect(i * 64, 0, 3, 256);
    }
  }, [3, 2]);

const scratchTex = () =>
  canvasTex('scratch', 1024, 410, (c) => {
    c.clearRect(0, 0, 1024, 410);
    c.font = `900 110px ${FONT}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.lineJoin = 'round';
    c.strokeStyle = '#d8c4a4';
    c.lineWidth = 5;
    // várias passadas tortas imitam unhas arranhando
    for (let k = 0; k < 4; k++) {
      c.save();
      c.translate((rand(k) - 0.5) * 8, (rand(k + 5) - 0.5) * 8);
      c.rotate((rand(k + 2) - 0.5) * 0.03);
      c.strokeText('ESTA CASA', 512, 130);
      c.strokeText('É MINHA', 512, 280);
      c.restore();
    }
    c.strokeStyle = 'rgba(216,196,164,0.6)';
    c.lineWidth = 3;
    for (let i = 0; i < 40; i++) {
      const x = rand(i + 20) * 1024;
      const y = rand(i + 60) * 410;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + 30 + rand(i) * 60, y + 40 + rand(i + 1) * 40);
      c.stroke();
    }
  });
