// Apresentação do elenco mad articulado: 20 personagens em grade, cada um repetindo o seu movimento característico.
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { ELENCO_ARTICULADO } from './elenco-articulado';
import { Granulado } from './Granulado';
import { pose } from './movimentos';
import { Rig } from './Rig';

export const DURACAO_ELENCO_ART = 12;
const L = '#2a2230';
export const ElencoArticulado = () => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 40%, #fffaf2, #f2d9b8)' }}>
      <div style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontFamily: '"Arial Black", Arial', fontSize: 72, color: L }}>Elenco MAD</div>
      <div style={{ position: 'absolute', top: 160, width: '100%', textAlign: 'center', fontFamily: 'Arial', fontWeight: 700, fontSize: 38, color: '#7a6a5a' }}>20 personagens articulados</div>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {ELENCO_ARTICULADO.map((c, i) => {
          const col = i % 4, lin = Math.floor(i / 4);
          const x = 135 + col * 270, y = 500 + lin * 322;
          const atraso = 0.4 + i * 0.12, ciclo = 3.2;
          const entrou = t >= atraso;
          const u = Math.max(0, t - atraso - 0.6);
          const ini = atraso + 0.6 + Math.floor(u / ciclo) * ciclo;
          const p = !entrou ? { ...pose(0, 'entrar', 1, 1), esc: 0 } : t < atraso + 0.6 ? pose(t, 'entrar', atraso, 0.6, i) : pose(t, c.mov, ini, ciclo - 0.4, i);
          return (
            <g key={c.id}>
              <ellipse cx={x} cy={y + 4} rx={95} ry={14} fill="#000" opacity={0.06} />
              <Rig k={c.k} p={p} x={x} y={y} s={0.6} />
            </g>
          );
        })}
      </svg>
      {ELENCO_ARTICULADO.map((c, i) => {
        const col = i % 4, lin = Math.floor(i / 4);
        return (
          <div key={c.id} style={{ position: 'absolute', left: col * 270, top: 500 + lin * 322 + 16, width: 270, textAlign: 'center', fontFamily: '"Arial Black", Arial', color: L, lineHeight: 1.05, opacity: Math.min(1, Math.max(0, (t - 0.6 - i * 0.12) / 0.3)) }}>
            <div style={{ fontSize: 30 }}>{c.nome}</div>
            <div style={{ fontFamily: 'Arial', fontWeight: 700, fontSize: 22, color: '#7a6a5a' }}>{c.papel}</div>
          </div>
        );
      })}
      <Granulado />
    </AbsoluteFill>
  );
};
