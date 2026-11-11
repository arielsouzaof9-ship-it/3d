// Roteiro e tempos de cada palavra. *palavra* = palavra enfatizada.
// Com voz (voz.ts preenchido e com o mesmo número de palavras), usa os tempos reais.
// Sem voz, estima pelo tamanho das palavras — bom para rascunho, nunca para o render final.
import { VOZ } from './voz.ts';

export const FPS = 30;
export const F = 1 / FPS;

// Roteiro: "Adesivos"
export const LINES = [
  'Nesta cidade, ninguém sabe *sorrir*.',
  'Sorriso se compra na *farmácia*, em adesivo.',
  'O carteiro usa um *torto*.',
  'A noiva comprou o tamanho *errado*.',
  'Até o *cachorro* tem um.',
  'A vovó cola o dela de *cabeça* pra baixo, e ninguém nota.',
  'Todo dia, a *fila* da farmácia dá a volta no quarteirão.',
  'Eu sou a *Tita*, e tenho *alergia* a cola.',
  'Um dia, sem adesivo, eu *ri* de verdade.',
  'A rua *parou*. O padeiro derrubou a *bandeja*.',
  'Então comecei a *reparar*.',
  'O farmacêutico era o único *sem* adesivo.',
  'Cada adesivo tinha o *nome* de alguém.',
  'E todo mundo ficava *sério* depois do café da praça.',
  'Naquela *noite*, segui ele até o porão.',
  'Lá dentro, um *aspirador* gigante, ligado na máquina de café.',
  'Milhares de *potes*, cada um com uma risada presa.',
  'Ele roubava os sorrisos de *manhã*, e vendia de volta à *tarde*.',
  'Ele apontou o aspirador pra *mim*.',
  'Eu ri a maior *gargalhada* da minha vida.',
  'O aspirador engoliu, engasgou, e *explodiu*.',
  'As risadas voaram pelas *chaminés*, e cada um pegou a sua.',
  'De manhã, a fila da farmácia estava *vazia*.',
  'O farmacêutico tentou sorrir. Não *conseguiu*.',
  'Teve que comprar um adesivo, e colou de *cabeça* pra baixo.',
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
