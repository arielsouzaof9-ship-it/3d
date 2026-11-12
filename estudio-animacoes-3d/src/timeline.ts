// Roteiro e tempos de cada palavra. *palavra* = palavra enfatizada.
// Com voz (voz.ts preenchido e com o mesmo número de palavras), usa os tempos reais.
// Sem voz, estima pelo tamanho das palavras — bom para rascunho, nunca para o render final.
import { VOZ } from './voz.ts';

export const FPS = 30;
export const F = 1 / FPS;

// Roteiro: O Porão (terror, inspirado em casas mal-assombradas dos anos 70).
export const LINES = [
  'Em mil novecentos e setenta e um, a família Moreira comprou uma *casa* no interior.',
  'Era *barata* demais. Ninguém perguntou por quê.',
  'Às três e sete da madrugada, os *grilos* pararam de cantar.',
  'No quarto, a pequena Bia encarava o *armário*.',
  'Luísa, tem *alguém* ali atrás.',
  'Então vieram *três* batidas na madeira.',
  'No corredor, Helena achou os *retratos* virados para a parede.',
  'Na foto da família, havia uma *mulher* de preto. Sem rosto.',
  'Uma *bolinha* desceu sozinha a escada do porão.',
  'Lá de baixo, uma vozinha chamou: *mãe*, desce aqui.',
  'Mas a Bia estava *atrás* dela.',
  'Helena desceu com um *fósforo*.',
  'Na parede, arranhado na madeira: esta casa é *minha*.',
  'O fósforo *apagou*.',
  'E uma voz sussurrou no seu ouvido: *achei* você.',
  'A casa foi vendida mais *quatro* vezes. Ninguém ficou mais de um ano.',
];

// Sem narração (só efeitos): legendas num ritmo lento de suspense.
const RITMO = 1.45;
const PAUSA = 1.0;

export type Word = { text: string; key: string; stressed: boolean; t0: number; t1: number; line: number; i: number };

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

const build = (): Word[] => {
  const out: Word[] = [];
  let t = 0.2;
  let n = 0;
  const real = VOZ.length > 0 && VOZ.length === LINES.join(' ').split(' ').length;
  LINES.forEach((line, li) => {
    line.split(' ').forEach((raw, i) => {
      const stressed = raw.includes('*');
      const text = raw.replace(/\*/g, '');
      if (real) {
        const [t0, t1] = VOZ[n++];
        out.push({ text, key: norm(text), stressed, t0, t1, line: li, i });
        return;
      }
      const d = RITMO * (0.05 + 0.05 * norm(text).length + (stressed ? 0.06 : 0));
      out.push({ text, key: norm(text), stressed, t0: t, t1: t + d, line: li, i });
      t += d + (/[,:]$/.test(text) ? 0.25 : /[.]$/.test(text) ? 0.4 : 0);
    });
    t += real ? 0.3 : PAUSA;
  });
  return out;
};

export const WORDS = build();
export const END = WORDS[WORDS.length - 1].t1 + 1.1;

// Tempo de início de uma palavra: W(linha, índice) ou W(linha, 'texto').
export const W = (line: number, w: number | string = 0): number => {
  const ws = WORDS.filter((x) => x.line === line);
  const hit = typeof w === 'number' ? ws[w] : ws.find((x) => x.key.startsWith(norm(w)));
  if (!hit) throw new Error(`Palavra não encontrada: ${line} ${w}`);
  return hit.t0;
};
