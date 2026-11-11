// "O Farol": roteiro e tempos reais da narração (voz-farol.mp3, transcrição em palavras-farol.ts).
import { PALAVRAS } from './palavras-farol.ts';
export const FPS = 30;
export const F = 1 / FPS;
const DURACAO_AUDIO = 65.96;

export const LINES = [
  'Nesta cidade, quando escurece, as *sombras* engolem quem está na *rua.*',
  'Menos *eu.*',
  'Desde pequeno, eu *brilho* no escuro.',
  'As sombras se *afastam* da minha luz.',
  'Hoje eu levo as pessoas pra *casa* à noite.',
  'Quem segura a minha *mão* fica *seguro.*',
  'A minha irmã *Lia* tem *medo* do escuro.',
  'Mas comigo, ela *dança* na calçada.',
  'Um dia, a luz da cidade *apagou* pra sempre.',
  '*Trezentas* pessoas no escuro.',
  'Do outro lado do *rio,* tinha uma cidade *iluminada.*',
  'Fizemos uma *fila:* todos de mãos dadas atrás de mim.',
  'As sombras abriam *caminho* enquanto a gente *cantava.*',
  'Eu achei que tinha nascido pra *salvar* todo mundo.',
  'Mas no meio da *ponte,* a fila ficou mais *curta.*',
  'Olhei pra trás: as sombras *apagavam* o fim da fila.',
  'Elas nunca tiveram *medo* da minha luz.',
  'Elas *seguiam* a minha luz pra *achar* todo mundo.',
  'Só sobrou uma mão na minha. A da *Lia.*',
  '"Não *solta",* eu pedi. "*Nunca",* ela disse.',
  'E pela primeira vez, eu *apaguei* a minha luz.',
];

export type Word = { text: string; key: string; stressed: boolean; t0: number; t1: number; line: number; i: number };
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
// Formas faladas/transcritas diferentes do texto.
const IGUAIS: Record<string, string> = { pra: 'para', trezentas: '300' };
// Tempos reais da narração (public/voz-farol.mp3): cada palavra do roteiro é casada, em ordem, com a transcrição.
const build = (): Word[] => {
  const fal = PALAVRAS.map((w) => ({ k: norm(w.text), t0: w.start, t1: w.end })).filter((w) => w.k);
  const out: Word[] = [];
  let j = 0;
  LINES.forEach((line, li) =>
    line.split(' ').forEach((raw, i) => {
      const text = raw.replace(/\*/g, '');
      const k = norm(text);
      const alvo = IGUAIS[k] ?? k;
      let hit = -1;
      for (let d = 0; d < 4 && j + d < fal.length; d++) if (fal[j + d].k === alvo || fal[j + d].k.startsWith(alvo) || alvo.startsWith(fal[j + d].k)) { hit = j + d; break; }
      const prev = out[out.length - 1];
      const t0 = hit >= 0 ? fal[hit].t0 : prev ? prev.t1 : 0;
      const t1 = hit >= 0 ? fal[hit].t1 : t0 + 0.25;
      if (hit >= 0) j = hit + 1;
      out.push({ text, key: k, stressed: raw.includes('*'), t0, t1, line: li, i });
    }),
  );
  return out;
};
export const WORDS = build();
export const END = Math.max(WORDS[WORDS.length - 1].t1 + 2, DURACAO_AUDIO + 0.6);
export const W = (line: number, w: number | string = 0): number => {
  const ws = WORDS.filter((x) => x.line === line);
  const hit = typeof w === 'number' ? ws[w] : ws.find((x) => x.key.startsWith(norm(w)));
  if (!hit) throw new Error(`Palavra não encontrada: ${line} ${w}`);
  return hit.t0;
};
