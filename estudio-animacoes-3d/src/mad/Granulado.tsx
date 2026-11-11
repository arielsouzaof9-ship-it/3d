// Textura de granulado + vinheta suave por cima do quadro (como nos vídeos de referência).
import { AbsoluteFill, useCurrentFrame } from 'remotion';
export const Granulado = ({ forca = 0.1 }: { forca?: number }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: forca }}>
        <filter id={`gr${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1080} height={1920} filter={`url(#gr${seed})`} />
      </svg>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 60%, rgba(40,20,10,0.18) 100%)' }} />
    </AbsoluteFill>
  );
};
