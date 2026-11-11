// "O Farol": roteiro e tempos ESTIMADOS (sem narração), esticados para durar DURACAO segundos.
export const FPS = 30;
export const F = 1 / FPS;
const DURACAO = 62;

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
const build = (): Word[] => {
  const out: Word[] = [];
  let t = 0.3;
  LINES.forEach((line, li) => {
    line.split(' ').forEach((raw, i) => {
      const text = raw.replace(/\*/g, '');
      const d = 0.12 + 0.055 * norm(text).length + (raw.includes('*') ? 0.08 : 0);
      out.push({ text, key: norm(text), stressed: raw.includes('*'), t0: t, t1: t + d, line: li, i });
      t += d + (/[,.:!?"]$/.test(text) ? 0.25 : 0.04);
    });
    t += 0.55;
  });
  const k = (DURACAO - 1.6) / out[out.length - 1].t1;
  for (const w of out) { w.t0 *= k; w.t1 *= k; }
  return out;
};
export const WORDS = build();
export const END = DURACAO;
export const W = (line: number, w: number | string = 0): number => {
  const ws = WORDS.filter((x) => x.line === line);
  const hit = typeof w === 'number' ? ws[w] : ws.find((x) => x.key.startsWith(norm(w)));
  if (!hit) throw new Error(`Palavra não encontrada: ${line} ${w}`);
  return hit.t0;
};
