// Biblioteca de MOVIMENTOS dos personagens mad articulados (Rig.tsx).
// Padrão tirado dos vídeos de referência: nunca totalmente parado (respira, pisca, mexe a cabeça e os olhos),
// gestos com o braço inteiro (mão na boca, nos olhos, no queixo, acenar), reações com o corpo (pulo, tremer, agachar)
// e entradas com "pop".
//
// Uso: pose(t, 'acenar', inicio, duracao)  → Pose pronta para <Rig p={...} />
import { BASE, Pose } from './Rig';

type V = [number, number];
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerpV = (a: V, b: V, k: number): V => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- Parado "vivo": respira, pisca, balança a cabeça, o olhar passeia ----------
export const parado = (t: number, seed = 0): Pose => {
  const per = 2.8 + (seed % 3) * 0.4;
  const ph = (t + seed * 0.7) % per;
  const pisca = ph < 0.05 ? 0.5 : ph < 0.1 ? 0.05 : ph < 0.15 ? 0.5 : 1;
  const olhar = Math.floor((t + seed) / 1.7);
  return {
    ...BASE,
    sq: 1 + 0.012 * Math.sin(t * 2.4 + seed),
    cabRot: 1.6 * Math.sin(t * 1.1 + seed),
    maoE: [-64, -150 + 2 * Math.sin(t * 2.4 + seed)],
    maoD: [64, -150 + 2 * Math.sin(t * 2.4 + seed + 0.5)],
    olho: pisca,
    pupila: [(rnd(olhar + seed) - 0.5) * 0.7, (rnd(olhar + seed + 9) - 0.5) * 0.3],
  };
};

// ---------- Movimentos: (u = segundos desde o início, t = tempo global) → mudanças sobre o parado ----------
type Mov = (u: number, t: number, base: Pose) => Partial<Pose>;
const pulo = (u: number, dur: number, alt: number) => (u < 0 || u > dur ? 0 : -alt * 4 * (u / dur) * (1 - u / dur));

export const MOVIMENTOS: Record<string, { nome: string; f: Mov }> = {
  parado: { nome: 'Parado (respira e pisca)', f: () => ({}) },
  falar: {
    nome: 'Falar',
    f: (u) => ({ fala: clamp(0.5 + 0.6 * Math.sin(u * 15) * Math.sin(u * 3.7)), cabY: 2 * Math.sin(u * 7), cabRot: 2.5 * Math.sin(u * 2.3), boca: 'sorriso' }),
  },
  acenar: {
    nome: 'Acenar',
    f: (u) => ({ maoD: [100 + 26 * Math.sin(u * 11), -385], boca: 'riso', fala: 0.2, sobr: 0.5, cabRot: -5, pupila: [0, 0] }),
  },
  pensar: {
    nome: 'Pensar (mão no queixo)',
    f: (u) => ({ maoD: [16, -288], frenteD: true, pupila: [0.7, -0.9], cabRot: 8, boca: 'neutra', sobr: 0.6, pergunta: ease(clamp((u - 0.35) / 0.25)) }),
  },
  rir: {
    nome: 'Segurar o riso',
    f: (u) => ({ maoE: [-18, -296], maoD: [18, -296], frenteE: true, frenteD: true, olhoFeliz: true, y: -7 * Math.abs(Math.sin(u * 15)), cabRot: 3 * Math.sin(u * 15), vermelho: 1, boca: 'riso' }),
  },
  gargalhar: {
    nome: 'Gargalhar',
    f: (u) => ({ maoE: [-70, -200], maoD: [70, -200], olhoFeliz: true, boca: 'riso', fala: 0.6 + 0.4 * Math.abs(Math.sin(u * 16)), y: -10 * Math.abs(Math.sin(u * 16)), incl: 4 * Math.sin(u * 8), cabRot: -8 }),
  },
  chorar: {
    nome: 'Chorar',
    f: (u) => ({ maoE: [-36, -320], maoD: [36, -320], frenteE: true, frenteD: true, olho: 0.35, sobrTriste: true, boca: 'triste', lagrima: clamp(u / 0.6), x: 2.5 * Math.sin(u * 32), y: -3 * Math.abs(Math.sin(u * 9)) }),
  },
  susto: {
    nome: 'Susto (pulo)',
    f: (u) => {
      const j = pulo(u - 0.05, 0.45, 70);
      return { y: j, sq: u < 0.05 ? 0.9 : j < -5 ? 1.08 : u < 0.6 ? 0.92 : 1, maoE: [-118, -385], maoD: [118, -385], olho: 1.35, pupila: [0, 0], boca: 'o', sobr: 1, suor: clamp((u - 0.3) / 0.3) };
    },
  },
  comemorar: {
    nome: 'Comemorar',
    f: (u) => ({ y: pulo(u % 0.6, 0.5, 60), maoE: [-80 + 10 * Math.sin(u * 10), -440], maoD: [80 - 10 * Math.sin(u * 10), -440], olhoFeliz: true, boca: 'riso', fala: 0.5 }),
  },
  andar: {
    nome: 'Andar',
    f: (u) => {
      const w = u * 8.5;
      return {
        x: (u - 1.2) * 120,
        y: -7 * Math.abs(Math.sin(w)),
        peE: [-26, -26 * Math.max(0, Math.sin(w))],
        peD: [26, -26 * Math.max(0, -Math.sin(w))],
        maoE: [-64, -150 + 16 * Math.sin(w)],
        maoD: [64, -150 - 16 * Math.sin(w)],
        incl: 2.5 * Math.sin(w),
        boca: 'sorriso',
      };
    },
  },
  esconder: {
    nome: 'Agachar e espiar',
    f: (u) => ({ quadril: 80, peE: [-56, 0], peD: [56, 0], maoE: [-70, -120], maoD: [70, -120], pupila: [Math.sign(Math.sin(u * 3)) * 0.9, 0], cabX: Math.sign(Math.sin(u * 3)) * 6, boca: 'onda', suor: 1, sobr: 0.6 }),
  },
  sim: {
    nome: 'Fazer que sim',
    f: (u) => ({ cabY: u < 1.4 ? 10 * Math.abs(Math.sin(u * 8)) : 0, pupila: [0, 0.3], boca: 'sorriso' }),
  },
  nao: {
    nome: 'Fazer que não',
    f: (u) => { const s = u < 1.5 ? Math.sin(u * 11) : 0; return { cabX: 14 * s, cabRot: -5 * s, pupila: [s * 0.6, 0], boca: 'neutra', sobr: -0.4 }; },
  },
  apontar: {
    nome: 'Apontar',
    f: (u) => ({ maoD: [165, -282], pupila: [1, 0], cabX: 8, cabRot: -4, boca: 'aberta', fala: 0.3 + 0.3 * Math.abs(Math.sin(u * 12)), sobr: 0.4 }),
  },
  ombros: {
    nome: 'Dar de ombros',
    f: () => ({ ombro: 18, maoE: [-122, -232], maoD: [122, -232], cabRot: 9, sobr: 1, boca: 'onda', pupila: [0, -0.4] }),
  },
  bravo: {
    nome: 'Bravo (mãos na cintura)',
    f: (u) => ({ maoE: [-46, -168], maoD: [46, -168], sobr: -1, boca: 'dentes', vermelho: 1, peD: [26, -12 * Math.max(0, Math.sin(u * 12))], incl: -3 }),
  },
  nervoso: {
    nome: 'Nervoso',
    f: (u) => ({ maoE: [-14, -205], maoD: [14, -205], frenteE: true, frenteD: true, pupila: [Math.sin(u * 7) > 0 ? 0.9 : -0.9, 0], suor: 1, boca: 'onda', sobr: 0.8, sobrTriste: true, x: 1.5 * Math.sin(u * 40) }),
  },
  // ---------- Movimentos novos (2ª análise dos vídeos de referência) ----------
  sentar: {
    nome: 'Sentar (poltrona, banco)',
    f: (u) => ({ sentado: 1, maoE: [-62, -132], maoD: [62, -132], cabRot: 1.5 * Math.sin(u * 1.3), boca: 'sorriso' }),
  },
  sentarFalar: {
    nome: 'Sentado conversando',
    f: (u) => ({ sentado: 1, maoE: [-62, -132], maoD: [80 + 12 * Math.sin(u * 5), -215 + 10 * Math.sin(u * 3)], fala: clamp(0.5 + 0.6 * Math.sin(u * 15) * Math.sin(u * 3.7)), cabY: 2 * Math.sin(u * 7), cabRot: 3 * Math.sin(u * 2.3), boca: 'sorriso' }),
  },
  cochilar: {
    nome: 'Cochilar (Zzz)',
    f: (u) => ({ sentado: 1, maoE: [-40, -140], maoD: [40, -140], olho: 0.04, cabRot: 14, cabY: 4 + 4 * Math.sin(u * 2.2), sq: 1 + 0.025 * Math.sin(u * 2.2), boca: 'o', zzz: 0.6 + 0.4 * Math.sin(u * 2.2) }),
  },
  deitar: {
    nome: 'Cair e ficar deitado',
    f: (u) => { const k = ease(clamp(u / 0.35)); return { incl: -88 * k, y: 104 * k, x: 70 * k, olho: u > 0.35 ? 0.05 : 1.3, boca: u > 0.35 ? 'onda' : 'o', maoE: [-110, -200], maoD: [110, -200], peE: [-40, -10], peD: [40, -20] }; },
  },
  telefone: {
    nome: 'Falar ao telefone',
    f: (u) => ({ maoD: [62, -335], frenteD: false, cabRot: -9, cabX: 4, pupila: [-0.5, -0.2], fala: clamp(0.5 + 0.6 * Math.sin(u * 14) * Math.sin(u * 3.1)), maoE: [-40, -170], boca: 'sorriso', sobr: 0.3 }),
  },
  aplaudir: {
    nome: 'Aplaudir',
    f: (u) => { const k = Math.abs(Math.sin(u * 13)); return { maoE: [-14 - 34 * k, -235], maoD: [14 + 34 * k, -235], frenteE: true, frenteD: true, olhoFeliz: true, boca: 'riso', fala: 0.4, y: -4 * Math.abs(Math.sin(u * 6.5)) }; },
  },
  dirigir: {
    nome: 'Dirigir (volante)',
    f: (u) => { const a = 0.45 * Math.sin(u * 2.2); return { sentado: 1, maoE: [-62 * Math.cos(a), -205 - 62 * Math.sin(a)], maoD: [62 * Math.cos(a), -205 + 62 * Math.sin(a)], frenteE: true, frenteD: true, cabRot: 6 * a, pupila: [a, -0.2], boca: 'sorriso' }; },
  },
  segurar: {
    nome: 'Mostrar papel ou placa',
    f: (u) => ({ maoE: [-56, -228], maoD: [56, -228], frenteE: true, frenteD: true, pupila: [0, 0.2], y: -3 * Math.abs(Math.sin(u * 3)), boca: 'riso', sobr: 0.5 }),
  },
  olharLados: {
    nome: 'Olhar para os lados',
    f: (u) => { const s = Math.sin(u * 2.6) > 0 ? 1 : -1; return { pupila: [s, 0], cabX: 9 * s, cabRot: -3 * s, boca: 'neutra', sobr: 0.5, maoE: [-58, -150], maoD: [58, -150] }; },
  },
  andarNoLugar: {
    nome: 'Andar no lugar (cenário passa)',
    f: (u) => { const w = u * 8.5; return { y: -7 * Math.abs(Math.sin(w)), peE: [-26, -26 * Math.max(0, Math.sin(w))], peD: [26, -26 * Math.max(0, -Math.sin(w))], maoE: [-64, -150 + 16 * Math.sin(w)], maoD: [64, -150 - 16 * Math.sin(w)], incl: 2 * Math.sin(w), cabRot: 2 * Math.sin(w), boca: 'sorriso' }; },
  },
  correr: {
    nome: 'Correr',
    f: (u) => { const w = u * 15; return { x: (u - 1.4) * 230, y: -16 * Math.abs(Math.sin(w)), peE: [-30, -44 * Math.max(0, Math.sin(w))], peD: [30, -44 * Math.max(0, -Math.sin(w))], maoE: [-80, -250 + 50 * Math.sin(w)], maoD: [80, -250 - 50 * Math.sin(w)], incl: 9, boca: 'aberta', fala: 0.4, sobr: 0.6, suor: 1 }; },
  },
  aflito: {
    nome: 'Aflito (mãos no rosto)',
    f: (u) => ({ maoE: [-62, -318], maoD: [62, -318], frenteE: true, frenteD: true, olho: 1.25, sobrTriste: true, sobr: 1, boca: 'o', suor: 1, x: 1.8 * Math.sin(u * 36) }),
  },
  espiar: {
    nome: 'Espiar (inclinar e olhar)',
    f: (u) => ({ incl: -16, cabX: -10, cabRot: -10, pupila: [-1, 0.1], maoE: [-30, -170], maoD: [40, -150], boca: 'neutra', sobr: 0.8, y: -2 * Math.sin(u * 4) }),
  },
  pular: {
    nome: 'Pular de alegria',
    f: (u) => { const ph = u % 0.7, j = pulo(ph - 0.08, 0.55, 95); return { y: j, sq: ph < 0.08 ? 0.86 : j < -8 ? 1.1 : 0.94, maoE: [-175, -385], maoD: [175, -385], peE: [-30, j < -8 ? -20 : 0], peD: [30, j < -8 ? -20 : 0], olhoFeliz: true, boca: 'riso', fala: 0.5 }; },
  },
  entrar: {
    nome: 'Entrar com "pop"',
    f: (u) => { const k = clamp(u / 0.35); const e = k <= 0 ? 0 : 1 + 2.4 * Math.pow(k - 1, 3) + 1.4 * Math.pow(k - 1, 2); return { esc: e, sq: u < 0.35 ? 1.12 : u < 0.5 ? 0.9 : 1, boca: 'riso', olhoFeliz: u > 0.4 && u < 1.2 }; },
  },
};

// Mistura o movimento com o parado: entra e sai em ~0,2 s (nada "teleporta").
export const pose = (t: number, mov: string, inicio: number, dur: number, seed = 0): Pose => {
  const b = parado(t, seed);
  const u = t - inicio;
  const m = MOVIMENTOS[mov]?.f(u, t, b) ?? {};
  const kin = mov === 'entrar' ? 1 : ease(clamp(u / 0.22)) * ease(clamp((dur - u) / 0.22));
  const out = { ...b } as Pose & Record<string, unknown>;
  for (const [key, val] of Object.entries(m)) {
    const cur = (b as Record<string, unknown>)[key];
    if (typeof val === 'number' && typeof cur === 'number') (out as Record<string, unknown>)[key] = lerp(cur, val, kin);
    else if (Array.isArray(val) && Array.isArray(cur)) (out as Record<string, unknown>)[key] = lerpV(cur as V, val as V, kin);
    else (out as Record<string, unknown>)[key] = kin > 0.5 ? val : cur;
  }
  // a piscada de rotina continua por cima de qualquer movimento
  if (b.olho < 1) out.olho = (typeof m.olho === 'number' ? lerp(1, m.olho, kin) : 1) * b.olho;
  return out;
};
