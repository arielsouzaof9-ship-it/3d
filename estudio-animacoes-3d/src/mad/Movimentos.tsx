// Demonstração dos movimentos dos personagens mad articulados.
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { MOVIMENTOS, pose } from './movimentos';
import { Rig } from './Rig';
import { Granulado } from './Granulado';

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

const L = '#2a2230';
// Objetos de apoio da demonstração: poltrona (sentar), volante (dirigir), placa (segurar), rua passando (andar no lugar).
const Apoio = ({ mov, t, fundo = false }: { mov: string; t: number; fundo?: boolean }) => {
  const sentado = ['sentar', 'sentarFalar', 'cochilar', 'dirigir'].includes(mov);
  if (fundo) {
    if (mov === 'andarNoLugar') return (
      <g>
        {Array.from({ length: 6 }, (_, j) => { const x = ((j * 260 - t * 240) % 1560 + 1560) % 1560 - 260; return <g key={j}><rect x={x} y={760} width={220} height={660} fill={['#f2b8a0', '#a8d8b8', '#b8c8f0', '#f2e0a0'][j % 4]} stroke={L} strokeWidth={6} /><path d={`M${x - 10} 770 L${x + 110} 640 L${x + 230} 770 z`} fill="#c86a4a" stroke={L} strokeWidth={6} />{[0, 1].map((w) => <rect key={w} x={x + 34 + w * 90} y={860} width={60} height={70} fill="#dff1fb" stroke={L} strokeWidth={4} />)}</g>; })}
        {Array.from({ length: 6 }, (_, j) => { const x = ((j * 300 - t * 520) % 1800 + 1800) % 1800 - 300; return <rect key={j} x={x} y={1500} width={140} height={18} fill="#fff" opacity={0.7} />; })}
      </g>
    );
    if (sentado && mov !== 'dirigir') return (
      <g>
        <rect x={290} y={820} width={500} height={480} rx={60} fill="#5aa070" stroke={L} strokeWidth={8} />
        <rect x={250} y={1180} width={580} height={200} rx={40} fill="#4a8a5e" stroke={L} strokeWidth={8} />
        {[230, 770].map((x) => <rect key={x} x={x} y={1060} width={80} height={300} rx={36} fill="#5aa070" stroke={L} strokeWidth={8} />)}
        {[290, 790].map((x) => <rect key={x} x={x - 14} y={1380} width={28} height={60} fill="#6b4224" stroke={L} strokeWidth={5} />)}
      </g>
    );
    if (mov === 'dirigir') return <g><rect x={330} y={900} width={420} height={420} rx={40} fill="#3a7a8a" stroke={L} strokeWidth={8} /><rect x={300} y={1240} width={480} height={140} rx={30} fill="#2f6070" stroke={L} strokeWidth={8} /></g>;
    return null;
  }
  if (mov === 'dirigir') { const a = 0.45 * Math.sin((t % 2.8) * 2.2) * 57.3; return <g transform={`translate(540 1170) rotate(${a})`}><circle r={130} fill="none" stroke={L} strokeWidth={46} /><circle r={130} fill="none" stroke="#3a3a3a" strokeWidth={32} /><path d="M-120 0 H120 M0 0 V120" stroke="#3a3a3a" strokeWidth={30} /><circle r={36} fill="#e5484d" stroke={L} strokeWidth={6} /></g>; }
  if (mov === 'segurar') return <g transform={`translate(540 ${1075 - 8 * Math.abs(Math.sin(t * 3))})`}><rect x={-230} y={-120} width={460} height={240} rx={10} fill="#fffaf0" stroke={L} strokeWidth={8} /><text x={0} y={30} textAnchor="middle" fontFamily="Arial Black" fontSize={84} fill="#e5484d">OBA!</text></g>;
  return null;
};

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
        {!final && <Apoio mov={LISTA[i] ?? ''} t={t} fundo />}
        {!final ? (
          <Rig k={LISTA[i] === 'telefone' ? { ...TITO, item: 'celular' } : TITO} p={t < 1.5 ? pose(t, 'entrar', 0, 1.5) : pose(t, LISTA[i], 1.5 + i * SEG, SEG)} x={540} y={1440} s={2.6} />
        ) : (
          ELENCO.map((k, j) => {
            const movs = ['acenar', 'rir', 'comemorar', 'pensar', 'bravo'];
            const t0 = 1.5 + LISTA.length * SEG + j * 0.15;
            return <Rig key={j} k={k} p={pose(t, t < t0 + 0.6 ? 'entrar' : movs[j], t < t0 + 0.6 ? t0 : t0 + 0.6, 5, j + 1)} x={140 + j * 200} y={1380 + (j % 2) * 60} s={j === 2 ? 1.2 : 1.05} />;
          })
        )}
        {!final && <Apoio mov={LISTA[i] ?? ''} t={t} />}
      </svg>
      <Granulado />
    </AbsoluteFill>
  );
};
