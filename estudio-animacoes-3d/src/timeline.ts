// Roteiro e tempos de cada palavra. *palavra* = palavra enfatizada.
// Com voz (voz.ts preenchido e com o mesmo número de palavras), usa os tempos reais.
// Sem voz, estima pelo tamanho das palavras — bom para rascunho, nunca para o render final.
import { VOZ } from './voz.ts';

export const FPS = 30;
export const F = 1 / FPS;

// Roteiro: "E se o asteroide tivesse errado?"
export const LINES = [
  'E se o asteroide que acabou com os dinossauros tivesse *errado* a Terra?',
  'Há sessenta e seis *milhões* de anos, uma rocha de *dez* quilômetros passaria *raspando*.',
  'E os dinossauros continuariam *mandando* no planeta.',
  'Os mamíferos, como os nossos ancestrais, continuariam *pequenos*, escondidos no escuro.',
  'Sem espaço para crescer, talvez os macacos *nunca* surgissem, e nem *você*.',
  'Enquanto isso, os dinossauros teriam milhões de anos para *evoluir*.',
  'Um cientista chegou a imaginar um dinossauro *inteligente*, de cabeça grande, andando em duas pernas.',
  'Ele chamou essa criatura de *dinossauroide*.',
  'Talvez hoje existissem cidades construídas por *répteis*.',
  'Mas tem um detalhe: os dinossauros nunca sumiram de *verdade*.',
  'As *aves* são dinossauros. A galinha do seu almoço é parente do *T-rex*.',
  'Comenta qual dinossauro você queria ver vivo *hoje*.',
];

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
      const d = 0.05 + 0.05 * norm(text).length + (stressed ? 0.06 : 0);
      out.push({ text, key: norm(text), stressed, t0: t, t1: t + d, line: li, i });
      t += d + (/[,]$/.test(text) ? 0.14 : 0);
    });
    t += 0.3;
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
