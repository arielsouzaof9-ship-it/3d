// Fábrica de timeline para os vídeos mad: com narração (lista de palavras com tempo) usa os tempos reais;
// sem narração, estima pelo tamanho das palavras e estica para `duracao` segundos.
export type Word = { text: string; key: string; stressed: boolean; t0: number; t1: number; line: number; i: number };
export type Palavra = { text: string; start: number; end: number };
export type Timeline = { LINES: string[]; WORDS: Word[]; END: number; COM_VOZ: boolean; W: (line: number, w?: number | string) => number };
export const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

export const criarTimeline = (LINES: string[], PALAVRAS: Palavra[], duracao: number, iguais: Record<string, string> = {}): Timeline => {
  const IG: Record<string, string> = { pra: 'para', ...iguais };
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
    const k = (duracao - 1.6) / out[out.length - 1].t1;
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
        if (!k) return;
        const alvo = IG[k] ?? k;
        let hit = -1;
        for (let d = 0; d < 4 && j + d < fal.length; d++) if ([alvo, k].some((a) => fal[j + d].k === a || fal[j + d].k.startsWith(a) || a.startsWith(fal[j + d].k))) { hit = j + d; break; }
        const prev = out[out.length - 1];
        const t0 = hit >= 0 ? fal[hit].t0 : prev ? prev.t1 : 0;
        if (hit >= 0) j = hit + 1;
        out.push({ text, key: k, stressed: raw.includes('*'), t0, t1: hit >= 0 ? fal[hit].t1 : t0 + 0.25, line: li, i });
      }),
    );
    return out;
  };
  const COM_VOZ = PALAVRAS.length > 0;
  const WORDS = COM_VOZ ? real() : estimado();
  const END = COM_VOZ ? WORDS[WORDS.length - 1].t1 + 2 : duracao;
  const W = (line: number, w: number | string = 0): number => {
    const ws = WORDS.filter((x) => x.line === line);
    const hit = typeof w === 'number' ? ws[w] : ws.find((x) => x.key.startsWith(norm(w)));
    if (!hit) throw new Error(`Palavra não encontrada: ${line} ${w}`);
    return hit.t0;
  };
  return { LINES, WORDS, END, COM_VOZ, W };
};
