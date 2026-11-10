// Roteiro e tempos de cada palavra. *palavra* = palavra enfatizada.
// Com voz (voz.ts preenchido e com o mesmo número de palavras), usa os tempos reais.
// Sem voz, estima pelo tamanho das palavras — bom para rascunho, nunca para o render final.
import { VOZ } from './voz.ts';

export const FPS = 30;
export const F = 1 / FPS;

// Roteiro: "A Ilha dos Poderes" (~1min30).
export const LINES = [
  'Numa ilha *distante*, quando você faz *dez* anos, você ganha um *superpoder*.',
  'Mas tem um *problema*.',
  'Quem escolhe a *condição* do seu poder é *outra* pessoa.',
  'Hoje é o *aniversário* do Joãozinho.',
  'Ele sopra as velinhas e ganha o poder de *voar*!',
  'Mas quem escolheu a condição foi a *Maria*.',
  'E a Maria decidiu: ele só voa a *cinco* centímetros do chão.',
  'O Joãozinho pega impulso, sobe com toda a força... e para *ali*.',
  'Agora ele passa voando por cima das *formigas*.',
  'Pelo menos ele nunca mais *pisou* numa poça.',
  'Agora é a vez da *Júlia*.',
  'Ela ganhou um *raio* laser!',
  'Mas a mãe dela achou *perigoso* demais.',
  'Então a condição ficou assim: o laser só serve para *fatiar* pão.',
  'Num dia só, ela fatiou *trezentos* pães.',
  'Virou a padeira mais *rápida* da ilha.',
  'E aí, a ilha inteira olha para *você*.',
  'Faltam *sete* dias para o seu aniversário.',
  'Você já sabe o que quer: parar o *tempo*.',
  'Dá para pegar o copo antes de ele *cair*.',
  'Dá para dormir mais *cinco* minutinhos.',
  'Mas alguém escolhe a *condição*.',
  'E a condição é: você só pode parar o tempo quando *ninguém* estiver olhando.',
  'Então você para o tempo, *sozinho*, no seu quarto.',
  'E ninguém nunca vai *saber*.',
  'E você? Que *poder* escolheria?',
  'E quem ia *estragar* a sua condição?',
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
