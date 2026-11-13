// Imagem: o Cientista maluco (personagem mad) fazendo joinha, no laboratório ou com fundo transparente.
import { AbsoluteFill } from 'remotion';
import { Brilho } from './FiosBrancos';
import { Laboratorio } from './cenarios-lagartixa';
import { pose } from './movimentos';
import { Rig } from './Rig';

// Mesmo visual do "Cientista maluco" do catálogo mad: cabelo branco espetado, óculos redondos, jaleco e tubo de ensaio.
export const CIENTISTA = { tipo: 'adulto', pele: '#f6e3d3', roupa: '#ffffff', manga: '#ffffff', gravata: '#8fb6dc', calca: '#3a4250', cabelo: 'espetado', corCabelo: '#ececec', oculos: true, item2: 'tubo', sapato: '#2a2230' };

export const Joinha = ({ fundo = true }: { fundo?: boolean }) => {
  const t = 1.6; // fora da piscada de rotina (fica só a piscadela do joinha)
  const p = { ...pose(t, 'joinha', 0, 5, 3), pisca: 1, olho: 1 };
  return (
    <AbsoluteFill style={{ background: fundo ? '#dfe8ee' : 'transparent' }}>
      {fundo && <Laboratorio t={2} tuboAberto={0} />}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <Rig k={CIENTISTA} p={p} x={520} y={1700} s={1050 / 510} />
      </svg>
      {fundo && <Brilho t={0.25} at={0} x={800} y={1060} r={120} n={10} />}
    </AbsoluteFill>
  );
};
export const JoinhaFundo = () => <Joinha fundo />;
export const JoinhaTransparente = () => <Joinha fundo={false} />;
