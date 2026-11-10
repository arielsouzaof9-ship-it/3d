// Roteiro e tempos de cada palavra. *palavra* = palavra enfatizada.
// Com voz (voz.ts preenchido e com o mesmo número de palavras), usa os tempos reais.
// Sem voz, estima pelo tamanho das palavras — bom para rascunho, nunca para o render final.
import { VOZ } from './voz.ts';

export const FPS = 30;
export const F = 1 / FPS;

// Roteiro: "O Sorveteiro da Segunda-Feira".
export const LINES = [
  'Toda *segunda-feira*, às três da tarde, uma coisa estranha acontece no seu bairro.',
  'Um caminhão de *sorvete* aparece do nada, e ninguém sabe de onde ele vem.',
  'Todas as crianças compram o sabor *azul*. É o único que ele vende.',
  'Mas naquela mesma noite, as crianças *desaparecem*.',
  'No dia seguinte, elas voltam como se nada tivesse acontecido, *sem* lembrar de nada.',
  'Você nunca tomou aquele sorvete, e decidiu descobrir a *verdade*.',
  'Na segunda seguinte, você se *escondeu* dentro do caminhão.',
  'Ele saiu da cidade, por uma estrada que não aparece em *nenhum* mapa.',
  'Até chegar num portão *gigantesco*, com uma fábrica escondida no meio da floresta.',
  'Lá dentro estavam todas as crianças, e uma máquina roubando os *sonhos* delas.',
  'Então o sorveteiro tirou o *chapéu*.',
  'Era o *seu* pai, que tinha sumido há *dois* anos.',
  'E ele olhou direto pra *você*. Comenta parte dois se quer saber o resto.',
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
