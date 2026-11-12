import { useThree } from '@react-three/fiber';
import { useLayoutEffect } from 'react';
import * as THREE from 'three';

// ============================================================================
// ESTILO DESENHO — deixa a cena com cara de animação 2D:
// luz em 2–3 faixas chapadas (sem brilho), contorno escuro em volta dos objetos,
// textura de papel e legendas com a palavra-chave em amarelo (Film.tsx).
// Mude DESENHO para false para voltar ao visual 3D original do estúdio.
// ============================================================================
export const DESENHO = true;

const INK = new THREE.Color('#26232a');
const W = 0.016; // espessura do contorno (unidades do mundo)

// Sombreamento chapado: troca a luz difusa contínua por faixas e remove o brilho especular.
const toonify = (m: THREE.Material) => {
  if (m.userData.toon) return;
  m.userData.toon = true;
  if (!(m instanceof THREE.MeshStandardMaterial)) return;
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace(
      '#include <lights_fragment_end>',
      `#include <lights_fragment_end>
      {
        vec3 base = max(diffuseColor.rgb * RECIPROCAL_PI, vec3(0.0005));
        vec3 irr = reflectedLight.directDiffuse / base;
        float l = dot(irr, vec3(0.299, 0.587, 0.114));
        float q = l < 0.12 ? 0.0 : (l < 0.55 ? 0.55 : 1.0);
        reflectedLight.directDiffuse *= q / max(l, 0.0005);
        reflectedLight.directSpecular = vec3(0.0);
        reflectedLight.indirectSpecular = vec3(0.0);
      }`,
    );
  };
  m.customProgramCacheKey = () => 'toon';
  m.needsUpdate = true;
};

const inkMat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
const box = new THREE.Box3();
const size = new THREE.Vector3();

// Contorno "casca invertida" automático para cada objeto sólido e de tamanho razoável.
const outline = (mesh: THREE.Mesh) => {
  if (mesh.userData.inked) return;
  mesh.userData.inked = true;
  const mat = mesh.material as THREE.Material;
  if (Array.isArray(mesh.material) || mat.transparent || (mat as THREE.MeshBasicMaterial).side === THREE.BackSide) return;
  if (mesh.children.some((c) => (c as THREE.Mesh).material && ((c as THREE.Mesh).material as THREE.Material).side === THREE.BackSide)) return;
  if ((mesh as THREE.InstancedMesh).isInstancedMesh) return;
  const g = mesh.geometry;
  if (!g.boundingBox) g.computeBoundingBox();
  box.copy(g.boundingBox!);
  box.getSize(size);
  const mn = Math.min(size.x, size.y, size.z);
  const mx = Math.max(size.x, size.y, size.z);
  if (mn < 0.01 || mx > 9) return; // planos (chão, paredes finas) e objetos enormes ficam sem contorno
  const c = box.getCenter(new THREE.Vector3());
  const ink = new THREE.Mesh(g, inkMat);
  ink.scale.set(1 + (2 * W) / size.x, 1 + (2 * W) / size.y, 1 + (2 * W) / size.z);
  ink.position.copy(c).multiplyScalar(1).sub(c.clone().multiply(ink.scale));
  ink.userData.inked = true;
  ink.castShadow = false;
  ink.raycast = () => {};
  mesh.add(ink);
};

export const Desenhar = () => {
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    if (!DESENHO) return;
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      if (o.userData.inked && (m.material as THREE.Material) === inkMat) return;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      mats.forEach(toonify);
      outline(m);
    });
  });
  return null;
};

// Grão de papel + vinheta suave por cima do quadro (HTML, não mexe no 3D).
const noise = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.55 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>`;
export const PAPEL = `url("data:image/svg+xml;utf8,${noise}")`;
