import { Composition } from 'remotion';
import { Elenco } from './Elenco';
import { Film } from './Film';
import { DURACAO_FIOS, FiosBrancos } from './mad/FiosBrancos';
import { DURACAO_MOV, Movimentos } from './mad/Movimentos';
import { FiosBrancosArticulado } from './mad/FiosBrancosArticulado';
import { DURACAO_FAROL, Farol } from './mad/Farol';
import { DURACAO_FLUTUA, Flutua } from './mad/Flutua';
import { DUR_Q9, QuartoNove1, QuartoNove2, QuartoNove3 } from './mad/QuartoNove';
import { END, FPS } from './timeline';
import { VOZ } from './voz';

export const Root = () => (
  <>
    <Composition
      id="Filme"
      component={Film}
      durationInFrames={Math.round(END * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{ legendas: true, voz: VOZ.length > 0, musica: false }}
    />
    {/* "Fios Brancos" com os personagens mad (2D) */}
    <Composition id="FiosBrancos" component={FiosBrancos} durationInFrames={Math.round(DURACAO_FIOS * FPS)} fps={FPS} width={1080} height={1920} />
    {/* "Fios Brancos" com os personagens mad ARTICULADOS */}
    <Composition id="FiosBrancosArticulado" component={FiosBrancosArticulado} durationInFrames={Math.round(DURACAO_FIOS * FPS)} fps={FPS} width={1080} height={1920} />
    {/* "O Farol" (personagens mad articulados, sem áudio) */}
    <Composition id="Farol" component={Farol} durationInFrames={Math.round(DURACAO_FAROL * FPS)} fps={FPS} width={1080} height={1920} />
    {/* "Quem Mente Flutua" (personagens mad articulados) */}
    <Composition id="Flutua" component={Flutua} durationInFrames={Math.round(DURACAO_FLUTUA * FPS)} fps={FPS} width={1080} height={1920} />
    {/* "O Quarto Nove" — série de suspense em 3 partes */}
    <Composition id="QuartoNove1" component={QuartoNove1} durationInFrames={Math.round(DUR_Q9[1] * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="QuartoNove2" component={QuartoNove2} durationInFrames={Math.round(DUR_Q9[2] * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="QuartoNove3" component={QuartoNove3} durationInFrames={Math.round(DUR_Q9[3] * FPS)} fps={FPS} width={1080} height={1920} />
    {/* Demonstração dos movimentos dos personagens mad articulados */}
    <Composition id="MovimentosMad" component={Movimentos} durationInFrames={Math.round(DURACAO_MOV * FPS)} fps={FPS} width={1080} height={1920} />
    {/* Folha com todo o elenco disponível (node tools/elenco.mjs) */}
    <Composition id="Elenco" component={Elenco} durationInFrames={1} fps={FPS} width={1920} height={1760} />
  </>
);
