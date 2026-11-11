// Roteiro e tempos de cada palavra. *palavra* = palavra enfatizada.
// Com voz (voz.ts preenchido e com o mesmo número de palavras), usa os tempos reais.
// Sem voz, estima pelo tamanho das palavras — bom para rascunho, nunca para o render final.
import { VOZ } from './voz.ts';

export const FPS = 30;
export const F = 1 / FPS;

// "O Número da Palma" — 1min30, sem narração (só legendas).
export const LINES = [
  'Nesse mundo, todo bebê nasce com um *número* na palma da mão.',
  'Ele diz quantas *vidas* você vai mudar.',
  'Só que o número tem um *defeito.*',
  'Ele não diz se é pra *melhor* ou pra *pior.*',
  'O Rafael nasceu com um *milhão.*',
  'Os pais deram *festa,* o jornal veio *fotografar,*',
  'e desde pequeno ele ouvia que ia *mudar* o mundo.',
  'A Nina, que nasceu no mesmo dia, tinha o número *um.*',
  'Um *só.*',
  'A mãe dela *fechava* a mãozinha da filha quando chegava visita.',
  'Na escola, a Nina era a *menina* do um.',
  '*Ninguém* sentava com ela.',
  'Diziam que ela nem precisava *estudar,* que não ia fazer *diferença* pra ninguém.',
  'Ela estudou *mesmo* assim.',
  'Virou *bombeira.*',
  'O Rafael virou o empresário mais *rico* do país.',
  'Construiu *prédios* em todas as cidades, mais *baratos* que qualquer outro.',
  'Um *milhão* de pessoas compraram um apartamento dele.',
  '*Vinte* anos depois, numa noite de *chuva,*',
  'o primeiro prédio *desabou.*',
  'Depois o *segundo.*',
  'Depois o *terceiro.*',
  'O Rafael tinha *economizado* no concreto.',
  'Um milhão de vidas *mudaram.*',
  'Do jeito *errado.*',
  'Naquela noite, a Nina entrou nos *escombros* sozinha',
  'e saiu com um *bebê* nos braços.',
  'Só *um.*',
  'Foi o único *resgate* da vida dela,',
  'porque ela não *voltou* de lá.',
  'No velório, quase *ninguém* apareceu.',
  'Mas a mãe do bebê abriu a *mãozinha* do filho para todo mundo ver.',
  'O número dele era *maior* que o do Rafael.',
  'O número nunca *errou.*',
  'Ele só nunca disse *como.*',
];

// Sem voz: os tempos estimados são esticados para o filme durar exatamente DURACAO segundos.
const DURACAO = 90;

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
  if (!real) {
    const k = (DURACAO - 1.4) / out[out.length - 1].t1;
    for (const w of out) { w.t0 *= k; w.t1 *= k; }
  }
  return out;
};

export const WORDS = build();
export const END = WORDS[WORDS.length - 1].t1 + 1.4;

// Tempo de início de uma palavra: W(linha, índice) ou W(linha, 'texto').
export const W = (line: number, w: number | string = 0): number => {
  const ws = WORDS.filter((x) => x.line === line);
  const hit = typeof w === 'number' ? ws[w] : ws.find((x) => x.key.startsWith(norm(w)));
  if (!hit) throw new Error(`Palavra não encontrada: ${line} ${w}`);
  return hit.t0;
};
