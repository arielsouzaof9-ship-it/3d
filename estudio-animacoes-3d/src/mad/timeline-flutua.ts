// "Quem Mente Flutua": roteiro e tempos. Com narração (palavras-flutua.ts preenchido) usa os tempos reais;
// sem narração, estima pelo tamanho das palavras e estica para DURACAO segundos.
import { PALAVRAS } from './palavras-flutua.ts';
export const FPS = 30;
export const F = 1 / FPS;
const DURACAO = 92;

export const LINES = [
  'Nessa cidade, ninguém *mente.*',
  'Não por honestidade, mas porque quem mente *flutua.*',
  'Um *palmo* do chão por mentira.',
  'Naquele ano, a cidade ia escolher o *prefeito.*',
  'De um lado, Seu *Otávio,* o favorito.',
  'Terno brilhante, dente *branquíssimo* e os dois pés firmes no *chão.*',
  'Do outro, Dona *Rita,* a feirante, de chinelo e cheiro de coentro.',
  'O *debate* foi na quadra da escola, ao vivo.',
  '"Seu Otávio, o senhor já usou dinheiro da prefeitura pra reformar sua *piscina?"*',
  '"*Nunca."*',
  '*Ploc.* Subiu um palmo.',
  '"O senhor lê os projetos que *assina?"*',
  '"*Todos."* Mais um palmo.',
  '"O senhor gosta de *criança?"*',
  '"*Amo."* Mais um palmo.',
  'Ele tinha acabado de *pisar* no pé de uma.',
  'Chegou a vez da Dona *Rita.*',
  '"A senhora tem *experiência* em política?"',
  '"*Nenhuma.* Mas eu divido uma *melancia* em vinte pedaços e ninguém reclama."',
  'A plateia *gargalhou.* E ela continuou no *chão.*',
  'Desesperado, Seu Otávio agarrou o *microfone:*',
  '"Vou construir cem escolas, mil hospitais e uma ponte até a *lua!"*',
  'Ele *disparou* pra cima e ficou preso no *ventilador* do teto, girando.',
  '"O senhor está *bem?",* perguntou o mediador.',
  '"*Ótimo!",* ele gritou. E *subiu* mais um pouco.',
  'No domingo, Dona Rita *ganhou* com quase todos os votos.',
  'E Seu Otávio foi amarrado num *poste* na frente da prefeitura, igual a um *balão.*',
  'Toda vez que alguém pergunta se ele aceitou a *derrota,* ele diz que *sim.*',
  'E sobe mais um *pouco.*',
];

export type Word = { text: string; key: string; stressed: boolean; t0: number; t1: number; line: number; i: number };
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const IGUAIS: Record<string, string> = { pra: 'para', cem: '100', vinte: '20', ploc: 'poc' };

const estimado = (): Word[] => {
  const out: Word[] = [];
  let t = 0.3;
  LINES.forEach((line, li) => {
    line.split(' ').forEach((raw, i) => {
      const text = raw.replace(/\*/g, '');
      const d = 0.12 + 0.055 * norm(text).length + (raw.includes('*') ? 0.08 : 0);
      out.push({ text, key: norm(text), stressed: raw.includes('*'), t0: t, t1: t + d, line: li, i });
      t += d + (/[,.:!?"]$/.test(text) ? 0.25 : 0.04);
    });
    t += 0.5;
  });
  const k = (DURACAO - 1.6) / out[out.length - 1].t1;
  for (const w of out) { w.t0 *= k; w.t1 *= k; }
  return out;
};
const real = (): Word[] => {
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
      if (hit >= 0) j = hit + 1;
      out.push({ text, key: k, stressed: raw.includes('*'), t0, t1: hit >= 0 ? fal[hit].t1 : t0 + 0.25, line: li, i });
    }),
  );
  return out;
};
export const COM_VOZ = PALAVRAS.length > 0;
export const WORDS = COM_VOZ ? real() : estimado();
export const END = COM_VOZ ? WORDS[WORDS.length - 1].t1 + 2 : DURACAO;
export const W = (line: number, w: number | string = 0): number => {
  const ws = WORDS.filter((x) => x.line === line);
  const hit = typeof w === 'number' ? ws[w] : ws.find((x) => x.key.startsWith(norm(w)));
  if (!hit) throw new Error(`Palavra não encontrada: ${line} ${w}`);
  return hit.t0;
};
