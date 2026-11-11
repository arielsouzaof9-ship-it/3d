// Demonstração dos movimentos dos personagens mad articulados.
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { MOVIMENTOS, pose } from './movimentos';
import { Rig } from './Rig';

export const TITO = { tipo: 'crianca', pele: '#e2b48c', roupa: '#3dc4d8', calca: '#c9a86a', sapato: '#e5484d', cabelo: 'espetado', corCabelo: '#6b3e1f' };
const ELENCO = [
  { tipo: 'adulto', pele: '#b9805a', roupa: '#d1495b', calca: '#2c3346', cabelo: 'curto', corCabelo: '#1a120c' },
  { tipo: 'crianca', pele: '#f6e3d3', roupa: '#f28fb0', saia: '#f28fb0', cabelo: 'trancas', corCabelo: '#e8c240', sapato: '#7b5aa6' },
  TITO,
  { tipo: 'adulto', pele: '#7a4b30', roupa: '#2fa36b', calca: '#2f5fa8', cabelo: 'afro', corCabelo: '#120c08' },
  { tipo: 'adulto', pele: '#f6e3d3', roupa: '#1f2f5c', calca: '#1a2547', gravata: '#c22a2a', cabelo: 'topete', corCabelo: '#3a2416', chapeu: 'fedora', corChapeu: '#6c757d' },
];
export const LISTA = Object.keys(MOVIMENTOS).filter((m) => m !== 'parado');
export const SEG = 2.8;
export const DURACAO_MOV = 1.5 + LISTA.length * SEG + 6;
const CORES = ['#fde2c4', '#d8f0e3', '#e3e0fa', '#fbe0e6', '#dff1fb'];

export const Movimentos = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const i = Math.floor((t - 1.5) / SEG);
  const final = i >= LISTA.length;
  const titulo = t < 1.5 ? 'Personagens MAD' : final ? 'Funciona com qualquer personagem' : MOVIMENTOS[LISTA[i]].nome;
  const sub = t < 1.5 ? 'padrão de movimentos' : final ? '' : `${i + 1}/${LISTA.length}`;
  const bg = CORES[Math.max(0, i) % CORES.length];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #fffaf2, ${final ? '#f5c58c' : bg})` }}>
      <div style={{ position: 'absolute', top: 170, width: '100%', textAlign: 'center', fontFamily: '"Arial Black", Arial', fontSize: 76, color: '#2a2230' }}>{titulo}</div>
      <div style={{ position: 'absolute', top: 270, width: '100%', textAlign: 'center', fontFamily: 'Arial', fontWeight: 700, fontSize: 44, color: '#7a6a5a' }}>{sub}</div>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <rect x={0} y={1420} width={1080} height={500} fill="#000" opacity={0.05} />
        {!final ? (
          <Rig k={TITO} p={t < 1.5 ? pose(t, 'entrar', 0, 1.5) : pose(t, LISTA[i], 1.5 + i * SEG, SEG)} x={540} y={1440} s={2.6} />
        ) : (
          ELENCO.map((k, j) => {
            const movs = ['acenar', 'rir', 'comemorar', 'pensar', 'bravo'];
            const t0 = 1.5 + LISTA.length * SEG + j * 0.15;
            return <Rig key={j} k={k} p={pose(t, t < t0 + 0.6 ? 'entrar' : movs[j], t < t0 + 0.6 ? t0 : t0 + 0.6, 5, j + 1)} x={140 + j * 200} y={1380 + (j % 2) * 60} s={j === 2 ? 1.2 : 1.05} />;
          })
        )}
      </svg>
    </AbsoluteFill>
  );
};
