// "Fios Brancos": roteiro + tempos reais da narração (voz-fios.mp3, transcrição em palavras-fios.json).
import { PALAVRAS as palavras } from './palavras-fios.ts';

export const FPS = 30;
export const F = 1 / FPS;

// *palavra* = destaque amarelo na legenda.
export const LINES = [
  'Nesta cidade, toda vez que alguém *desiste* de algo, nasce um *fio* *branco* no cabelo.',
  'Não dá pra *pintar,* nem *arrancar.*',
  'O meu *pai* tinha *trinta* anos e a cabeça toda *branca.*',
  'Me chamavam de filho do *desistente.*',
  'Pedi pra ele não ir na minha *apresentação.*',
  'Ele só fez que *sim* com a cabeça.',
  'Naquela noite, nasceu o meu *primeiro* fio branco.',
  'Eu tinha *desistido* do meu pai.',
  'A minha *avó* me mostrou as *fotos.*',
  'Esse fio foi quando ele largou o *futebol* pra *trabalhar.*',
  'Esse, quando vendeu a *moto* pra pagar sua *escola.*',
  'E esses, as noites sem *dormir* quando você ficava *doente.*',
  'Cada fio dele é um *sonho* que ele trocou por *você.*',
  'No dia seguinte, levei ele até a *primeira* *fila.*',
  'E falei alto: esse é o meu *pai!*',
  'Hoje, o meu cabelo também é todo *branco.*',
  'Meu filho acha que eu *desisti* de muita coisa.',
  'Eu só *sorrio.*',
  '*Igualzinho* ao meu pai.',
];

export type Word = { text: string; key: string; stressed: boolean; t0: number; t1: number; line: number; i: number };
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const IGUAIS: Record<string, string> = { pra: 'para', trinta: '30', sorrio: 'sorriu' };

const build = (): Word[] => {
  const fal = (palavras as { text: string; start: number; end: number }[]).map((w) => ({ k: norm(w.text), t0: w.start, t1: w.end })).filter((w) => w.k);
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
      const t1 = hit >= 0 ? fal[hit].t1 : t0 + 0.2;
      if (hit >= 0) j = hit + 1;
      out.push({ text, key: k, stressed: raw.includes('*'), t0, t1, line: li, i });
    }),
  );
  return out;
};

export const WORDS = build();
export const END = WORDS[WORDS.length - 1].t1 + 1.3;
export const W = (line: number, w: number | string = 0): number => {
  const ws = WORDS.filter((x) => x.line === line);
  const hit = typeof w === 'number' ? ws[w] : ws.find((x) => x.key.startsWith(norm(w)));
  if (!hit) throw new Error(`Palavra não encontrada: ${line} ${w}`);
  return hit.t0;
};
