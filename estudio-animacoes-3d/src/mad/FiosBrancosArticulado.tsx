// "Fios Brancos" refeito com os PERSONAGENS MAD ARTICULADOS (Rig + movimentos), mesma narração e cenários.
import { CSSProperties, JSX, ReactNode } from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Auditorio, Boneco, CHAO_RUA, CHAO_SALA, Escola, Foto, Liso, Rua, Sala, Svg } from './cenarios';
import { ADULTO, AVO, Balao, Brilho, Cam, clamp, COLEGAS, FADE, FILHO, Legenda, MENINO, Moto, P, PAI, Placa, Pop, VIZINHO } from './FiosBrancos';
import { pose } from './movimentos';
import { Pose, Rig } from './Rig';
import { END, LINES, W } from './timeline-fios';

// Ator: boneco articulado num quadro 1080×1920. h ≈ altura do antigo <Boneco> (para manter os mesmos enquadramentos).
type Mov = [string, number, number?]; // [movimento, início, duração]
const Ator = ({ k, t, x, y, h = 620, movs, over, seed = 0, flip, style }: { k: object; t: number; x: number; y: number; h?: number; movs: Mov[]; over?: Partial<Pose> | ((p: Pose) => Partial<Pose>); seed?: number; flip?: boolean; style?: CSSProperties }) => {
  const atual = [...movs].reverse().find(([, ini]) => t >= ini) ?? movs[0];
  const [m, ini, dur] = atual;
  let p = pose(t, m, ini, dur ?? 999, seed);
  if (over) p = { ...p, ...(typeof over === 'function' ? over(p) : over) };
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style }}>
      <Rig k={k} p={p} x={x} y={y} s={h / 510} flip={flip} />
    </svg>
  );
};
const triste = (p: Pose): Partial<Pose> => ({ boca: p.boca === 'sorriso' ? 'triste' : p.boca, sobrTriste: true });

// 0 — A regra: nasce um fio branco no cabelo do vizinho (ele leva um susto).
const C00 = ({ t, t0, t1 }: P) => {
  const fio = W(0, 'branco');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.25} cy={880}>
      <Svg><Rua t={t} /></Svg>
      <Ator k={{ ...VIZINHO, fios: t >= fio - 0.07 ? 1 : 0 }} t={t} x={540} y={CHAO_RUA} movs={[['falar', t0, fio - t0 - 0.1], ['susto', fio, 1.2], ['pensar', fio + 1.2]]} seed={1} />
      <Brilho t={t} at={fio} x={560} y={690} />
    </Cam>
  );
};
// 1 — Tenta pintar o fio, depois arrancar: "AI!".
const C01 = ({ t, t0, t1 }: P) => {
  const arr = W(1, 'arrancar');
  const puxa = t >= arr - 0.1;
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1.25} cy={880}>
      <Svg><Rua t={t} /></Svg>
      <Ator k={{ ...VIZINHO, fios: 1, item: puxa ? undefined : 'pincel' }} t={t} x={540} y={CHAO_RUA} seed={1}
        movs={[['pensar', t0], ['susto', arr, 1.2]]}
        over={puxa ? undefined : { maoD: [40, -420], frenteD: false, pergunta: 0, pupila: [0.3, -1], boca: 'dentes' }} />
      {puxa && <Pop t={t} at={arr} x={720} y={640}><Balao texto="AI!" cor="#ffd166" /></Pop>}
    </Cam>
  );
};
// 2 — O pai, 30 anos, cabeça branca: entra acenando.
const C02 = ({ t, t0, t1 }: P) => {
  const tri = W(2, 'trinta');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.15} cy={900}>
      <Svg><Rua t={t} /></Svg>
      <Ator k={PAI} t={t} x={440} y={CHAO_RUA} movs={[['entrar', t0], ['acenar', t0 + 0.6, 2.4], ['falar', t0 + 3]]} seed={2} />
      <Pop t={t} at={tri} x={790} y={1010}>
        <svg width={250} height={260} viewBox="0 0 250 260">
          <rect x={20} y={110} width={210} height={120} rx={14} fill="#f6b8c8" stroke="#2a2230" strokeWidth={6} />
          <path d="M20 150 q26 22 52 0 q26 22 52 0 q26 22 52 0 q26 22 54 0" fill="#fff" stroke="#2a2230" strokeWidth={4} />
          <text x={125} y={212} textAnchor="middle" fontFamily="Arial Black" fontSize={58} fill="#2a2230">30</text>
          {[80, 125, 170].map((x) => (
            <g key={x}>
              <rect x={x - 7} y={60} width={14} height={50} fill="#3d8bfd" stroke="#2a2230" strokeWidth={3} />
              <path d={`M${x} 30 q12 16 0 28 q-12 -12 0 -28 z`} fill="#ffd166" stroke="#2a2230" strokeWidth={3} />
            </g>
          ))}
        </svg>
      </Pop>
    </Cam>
  );
};
// 3 — "Filho do desistente": colegas apontam e gargalham, o menino fica nervoso.
const C03 = ({ t, t0, t1 }: P) => {
  const d = W(3, 'desistente');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <Svg><Escola t={t} /></Svg>
      <Ator k={COLEGAS[0]} t={t} x={170} y={1420} h={560} movs={[['apontar', t0, d - t0], ['gargalhar', d]]} seed={3} />
      <Ator k={COLEGAS[1]} t={t} x={360} y={1440} h={560} movs={[['parado', t0], ['rir', d - 0.2]]} seed={4} />
      <Ator k={MENINO} t={t} x={640} y={1430} h={580} movs={[['parado', t0], ['nervoso', d - 0.3]]} over={triste} seed={5} />
      <Ator k={COLEGAS[2]} t={t} x={890} y={1420} h={560} flip movs={[['apontar', t0, d - t0 + 0.3], ['gargalhar', d + 0.3]]} seed={6} />
      <Pop t={t} at={d} x={300} y={760}><Balao texto="HAHAHA" /></Pop>
    </Cam>
  );
};
// 4 — Pede pro pai não ir na apresentação.
const C04 = ({ t, t0, t1 }: P) => {
  const a = W(4, 'apresentacao');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.15} cy={1000}>
      <Svg><Sala porta sofa={false} /></Svg>
      <Pop t={t} at={t0 + 0.2} x={540} y={520}><Placa texto={'APRESENTAÇÃO\nDE FIM DE ANO'} bg="#ffd166" size={48} /></Pop>
      <Ator k={PAI} t={t} x={690} y={CHAO_SALA} movs={[['parado', t0], ['ombros', a + 0.2, 1.4]]} over={(p) => (t >= a ? triste(p) : {})} seed={2} flip />
      <Ator k={MENINO} t={t} x={360} y={CHAO_SALA} h={600} movs={[['falar', t0]]} over={(p) => ({ ...triste(p), pupila: [0.5, 0.6] })} seed={5} />
      <Pop t={t} at={a} x={330} y={760}><Balao texto="Não vai, tá?" /></Pop>
    </Cam>
  );
};
// 5 — O pai faz que sim com a cabeça (triste).
const C05 = ({ t, t0, t1 }: P) => {
  const s = W(5, 'sim');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.6} z1={1.75} cx={540} cy={820}>
      <Svg><Sala porta sofa={false} /></Svg>
      <Ator k={PAI} t={t} x={540} y={CHAO_SALA} movs={[['parado', t0], ['sim', s - 0.25]]} over={(p) => ({ ...triste(p), pupila: [0, 0.7] })} seed={2} />
    </Cam>
  );
};
// 6 — No espelho, nasce o primeiro fio branco: susto.
const C06 = ({ t, t0, t1 }: P) => {
  const pr = W(6, 'primeiro');
  const k = { ...MENINO, fios: t >= pr - 0.07 ? 1 : 0 };
  const movs: Mov[] = [['parado', t0], ['susto', pr, 1.1], ['nervoso', pr + 1.1]];
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.3} cy={900}>
      <Svg>
        <Sala noite sofa={false} />
        <rect x={500} y={520} width={420} height={760} rx={200} fill="#9fb8d8" stroke="#8a6a4a" strokeWidth={22} />
      </Svg>
      <div style={{ position: 'absolute', left: 500, top: 520, width: 420, height: 760, borderRadius: 200, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: -500, top: -520, width: 1080, height: 1920 }}>
          <Ator k={k} t={t} x={710} y={1500} h={760} movs={movs} over={triste} seed={5} flip />
        </div>
      </div>
      <Ator k={k} t={t} x={300} y={CHAO_SALA} h={640} movs={movs} over={triste} seed={5} />
      <Brilho t={t} at={pr} x={700} y={800} />
    </Cam>
  );
};
// 7 — "Eu tinha desistido do meu pai": chora com as mãos no rosto.
const C07 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1.5} z1={1.7} cy={860}>
    <Svg><Sala noite sofa={false} /></Svg>
    <Ator k={{ ...MENINO, fios: 1 }} t={t} x={540} y={CHAO_SALA} h={640} movs={[['chorar', t0 - 0.3]]} seed={5} />
  </Cam>
);
// 8 — A avó mostra as fotos.
const C08 = ({ t, t0, t1 }: P) => {
  const f = W(8, 'fotos');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1150}>
      <Svg><Sala /></Svg>
      <Ator k={{ ...AVO, item: 'livro' }} t={t} x={430} y={1330} h={600} movs={[['falar', t0]]} over={{ maoD: [90, -250] }} seed={7} />
      <Ator k={{ ...MENINO, fios: 1 }} t={t} x={700} y={1330} h={600} flip movs={[['parado', t0], ['pensar', f]]} over={triste} seed={5} />
    </Cam>
  );
};
const FotoCena = ({ t, t0, t1, legenda, children, rot = -3 }: P & { legenda: string; children: ReactNode; rot?: number }) => {
  const s = Math.max(0, Math.min(1.08, (t - t0 + 0.13) / 0.3)) * (t - t0 > 0.35 ? 1 / 1.08 : 1);
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={900}>
      <Svg><Liso a="#c9a77c" b="#8a6a4a" /></Svg>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${s})`, transformOrigin: '540px 860px' }}>
        <Foto x={540} y={860} rot={rot} legenda={legenda}>{children}</Foto>
      </div>
    </Cam>
  );
};
// 9 — Largou o futebol pra trabalhar.
const C09 = ({ t, t0, t1 }: P) => {
  const virou = t >= W(9, 'trabalhar') - 0.1;
  return (
    <FotoCena t={t} t0={t0} t1={t1} legenda={virou ? 'primeiro emprego' : 'o craque do bairro'}>
      <Svg><rect width={1080} height={1920} fill={virou ? '#e9dcc3' : '#7cc47f'} /></Svg>
      {virou ? (
        <Ator k={{ ...PAI, corCabelo: '#2a1a12', fios: 6, roupa: '#ff8a2f', colete: '#f2c94c', chapeu: 'capacete', corChapeu: '#ff8a2f', item: 'martelo' }} t={t} x={340} y={600} h={560} movs={[['parado', t0]]} over={{ maoD: [90, -300], boca: 'neutra' }} seed={2} />
      ) : (
        <Ator k={{ ...PAI, corCabelo: '#2a1a12', roupa: '#2fa36b', peito: '10', calca: '#ffffff', short: true }} t={t} x={340} y={600} h={560} movs={[['comemorar', t0]]} seed={2} />
      )}
    </FotoCena>
  );
};
// 10 — Vendeu a moto pra pagar a escola.
const C10 = ({ t, t0, t1 }: P) => (
  <FotoCena t={t} t0={t0} t1={t1} rot={3} legenda="vendida!">
    <Svg><rect width={1080} height={1920} fill="#f7d9a8" /></Svg>
    <Ator k={PAI} t={t} x={170} y={600} h={500} movs={[['apontar', t0 + 0.3]]} seed={2} />
    <Pop t={t} at={W(10, 'moto')} x={460} y={480}><Moto /></Pop>
    <Pop t={t} at={W(10, 'escola')} x={500} y={160}><Placa texto="R$ → ESCOLA" bg="#7be07b" size={44} /></Pop>
  </FotoCena>
);
// 11 — Noites sem dormir quando você ficava doente.
const C11 = ({ t, t0, t1 }: P) => {
  const d = W(11, 'dormir');
  return (
    <FotoCena t={t} t0={t0} t1={t1} rot={-2} legenda="3 da manhã">
      <Svg>
        <rect width={1080} height={1920} fill="#2b3a67" />
        <circle cx={560} cy={110} r={44} fill="#fff6c8" />
        <rect x={330} y={440} width={330} height={170} rx={12} fill="#f4f0e8" stroke="#2a2230" strokeWidth={6} />
        {[360, 410, 460, 510, 560, 610].map((x) => <rect key={x} x={x} y={380} width={10} height={70} fill="#f4f0e8" stroke="#2a2230" strokeWidth={3} />)}
      </Svg>
      <Boneco k={{ tipo: 'bebe', pele: '#f6e3d3', roupa: '#f2c94c', cabelo: 'bebe', corCabelo: '#2a1a12', rosto: 'chorando' }} x={500} y={470} h={300} />
      <Ator k={PAI} t={t} x={180} y={620} h={520} movs={[['nervoso', t0]]} over={(p) => (t >= d ? { olho: 0.35, boca: 'onda', sobrTriste: true } : {})} seed={2} />
    </FotoCena>
  );
};
// 12 — Cada fio é um sonho trocado por você: o pai cochila e os sonhos sobem.
const C12 = ({ t, t0, t1 }: P) => {
  const s = W(12, 'sonho');
  const icones = ['⚽', '🏍️', '🌙', '✈️'];
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.15} cy={1000}>
      <Svg><Sala /></Svg>
      <Ator k={PAI} t={t} x={540} y={1330} h={600} movs={[['parado', t0]]} over={{ olho: 0, olhoFeliz: true, boca: 'sorriso', cabRot: 10 + 2 * Math.sin(t * 1.5), sq: 1 + 0.025 * Math.sin(t * 1.6) }} seed={2} />
      {icones.map((ic, i) => {
        const k = clamp((t - s - i * 0.25) / 2.2);
        if (k <= 0) return null;
        return <div key={i} style={{ position: 'absolute', left: 540 + (i - 1.5) * 150 * k, top: 760 - k * 380, fontSize: 90, opacity: k < 0.85 ? 1 : (1 - k) / 0.15, transform: `scale(${0.4 + k * 0.8})` }}>{ic}</div>;
      })}
      <Pop t={t} at={W(12, 'voce')} x={540} y={520}><div style={{ fontSize: 150 }}>💛</div></Pop>
    </Cam>
  );
};
// 13 — Leva o pai até a primeira fila (andando juntos).
const C13 = ({ t, t0, t1 }: P) => {
  const x = -120 + clamp((t - t0) / (t1 + 0.2 - t0)) * 640;
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1200}>
      <Svg><Auditorio /></Svg>
      <Ator k={PAI} t={t} x={x + 110} y={1640} h={640} movs={[['andar', t0]]} over={{ x: 0, boca: 'o', olho: 1.2 }} seed={2} />
      <Ator k={{ ...MENINO, fios: 1 }} t={t} x={x + 330} y={1650} h={600} movs={[['andar', t0 + 0.12]]} over={{ x: 0, maoE: [-110, -160], boca: 'sorriso' }} seed={5} />
      <Pop t={t} at={W(13, 'primeira')} x={760} y={1250}><Placa texto="1ª FILA" bg="#ffd166" size={44} /></Pop>
    </Cam>
  );
};
// 14 — "Esse é o meu pai!": o menino aponta no palco, o pai se emociona.
const C14 = ({ t, t0, t1 }: P) => {
  const p = W(14, 'pai');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
      <Svg><Auditorio /></Svg>
      <Ator k={{ ...MENINO, fios: 1 }} t={t} x={540} y={1080} h={600} movs={[['falar', t0], ['apontar', p - 0.6, 1.2], ['comemorar', p + 0.6]]} over={(q) => (t < p + 0.6 ? { maoD: [150, -200] } : {})} seed={5} />
      <Ator k={PAI} t={t} x={760} y={1780} h={620} movs={[['parado', t0], ['chorar', p + 0.1]]} seed={2} />
      <Pop t={t} at={p} x={540} y={560}><Balao texto="ESSE É O MEU PAI!" cor="#ffd166" /></Pop>
      <Brilho t={t} at={p} x={760} y={1300} n={10} r={140} />
    </Cam>
  );
};
// 15 — Anos depois: o narrador de cabelo branco entra.
const C15 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.2} cy={900}>
    <Svg><Rua t={t} ceu={['#f9d29d', '#f5a46b']} sol /></Svg>
    <Pop t={t} at={t0 + 0.1} x={540} y={520}><Placa texto="ANOS DEPOIS" bg="#fff" size={48} /></Pop>
    <Ator k={ADULTO} t={t} x={540} y={CHAO_RUA} movs={[['entrar', t0], ['falar', t0 + 0.8]]} seed={8} />
    <Brilho t={t} at={W(15, 'branco')} x={540} y={720} />
  </Cam>
);
// 16 — O filho acha que ele desistiu de muita coisa (pensa, com "?").
const C16 = ({ t, t0, t1 }: P) => {
  const d = W(16, 'desisti');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.15} cy={1000}>
      <Svg><Rua t={t} ceu={['#f9d29d', '#f5a46b']} /></Svg>
      <Ator k={ADULTO} t={t} x={420} y={CHAO_RUA} movs={[['parado', t0]]} over={{ pupila: [0.8, 0.4] }} seed={8} />
      <Ator k={FILHO} t={t} x={700} y={CHAO_RUA} h={580} flip movs={[['parado', t0], ['pensar', d - 0.2]]} seed={9} />
    </Cam>
  );
};
// 17 — "Eu só sorrio": close, olhos fechados de felicidade.
const C17 = ({ t, t0, t1 }: P) => {
  const s = W(17, 'sorrio');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.7} z1={1.85} cy={760}>
      <Svg><Rua t={t} ceu={['#f9d29d', '#f5a46b']} /></Svg>
      <Ator k={ADULTO} t={t} x={540} y={CHAO_RUA} movs={[['parado', t0]]} over={t >= s - 0.07 ? { olhoFeliz: true, boca: 'riso', vermelho: 1, cabRot: -6 } : { boca: 'neutra' }} seed={8} />
    </Cam>
  );
};
// 18 — Igualzinho ao meu pai: a foto do pai e o narrador acenando com o mesmo sorriso.
const C18 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={900}>
    <Svg><Liso a="#fff3dd" b="#f5c58c" /></Svg>
    <Foto x={540} y={700} w={600} h={680} rot={-4} legenda="meu pai">
      <Svg><rect width={1080} height={1920} fill="#bfe6ff" /></Svg>
      <Ator k={{ ...PAI, tipo: 'idoso', oculos: true }} t={t} x={260} y={480} h={460} movs={[['acenar', t0 + 0.3]]} seed={2} />
    </Foto>
    <Ator k={ADULTO} t={t} x={540} y={1650} h={620} movs={[['acenar', t0 + 0.5]]} seed={8} />
    <Brilho t={t} at={W(18, 'pai')} x={540} y={700} n={12} r={260} />
  </Cam>
);

const CENAS: ((p: P) => JSX.Element)[] = [C00, C01, C02, C03, C04, C05, C06, C07, C08, C09, C10, C11, C12, C13, C14, C15, C16, C17, C18];

const Cena = ({ C, t0, t1, fade }: { C: (p: P) => JSX.Element; t0: number; t1: number; fade: boolean }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity: fade ? Math.min(1, frame / FADE) : 1, overflow: 'hidden' }}>
      <C t={t0 + frame / fps} t0={t0} t1={t1} />
    </AbsoluteFill>
  );
};
export const FiosBrancosArticulado = () => {
  const { fps } = useVideoConfig();
  const inicio = LINES.map((_, i) => (i === 0 ? 0 : W(i, 0)));
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {CENAS.map((C, i) => {
        const t0 = inicio[i];
        const t1 = i + 1 < CENAS.length ? inicio[i + 1] : END;
        const from = Math.round(t0 * fps);
        const dur = Math.round(t1 * fps) - from + (i + 1 < CENAS.length ? FADE : 0);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`cena ${i}`}>
            <Cena C={C} t0={from / fps} t1={t1} fade={i > 0} />
          </Sequence>
        );
      })}
      <Legenda />
      <Audio src={staticFile('voz-fios.mp3')} />
    </AbsoluteFill>
  );
};
