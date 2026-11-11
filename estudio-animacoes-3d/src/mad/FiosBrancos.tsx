// "Fios Brancos": animação 2D com os PERSONAGENS MAD, sincronizada com a narração (public/voz-fios.mp3).
import { JSX, ReactNode } from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Auditorio, Boneco, CHAO_RUA, CHAO_SALA, Escola, Foto, L, Liso, Rua, Sala, Svg } from './cenarios';
import { END, F, LINES, W, WORDS } from './timeline-fios';

// ---------- Elenco ----------
const PAI = { tipo: 'adulto', pele: '#e2b48c', roupa: '#3d8bfd', calca: '#2c3346', cabelo: 'curto', corCabelo: '#f7f7f7', rosto: 'feliz', braco: 'baixo' };
const MENINO = { tipo: 'crianca', pele: '#f6e3d3', roupa: '#2fa36b', calca: '#2f5fa8', sapato: '#e5484d', cabelo: 'curto', corCabelo: '#2a1a12', rosto: 'neutro', braco: 'baixo' };
const AVO = { tipo: 'idoso', pele: '#e2b48c', roupa: '#7b5aa6', saia: '#5b467e', cabelo: 'coque', corCabelo: '#d6d6d6', oculos: true, rosto: 'feliz', braco: 'baixo' };
const ADULTO = { tipo: 'adulto', pele: '#f6e3d3', roupa: '#2fa36b', calca: '#2f5fa8', cabelo: 'curto', corCabelo: '#f7f7f7', rosto: 'feliz', braco: 'baixo' };
const FILHO = { tipo: 'crianca', pele: '#f6e3d3', roupa: '#f2c94c', calca: '#e5484d', short: true, cabelo: 'franja', corCabelo: '#2a1a12', rosto: 'neutro', braco: 'baixo' };
const VIZINHO = { tipo: 'adulto', corpo: 'gordo', pele: '#b9805a', roupa: '#d1495b', calca: '#4a4f3e', cabelo: 'curto', corCabelo: '#1a120c', bigode: true, rosto: 'neutro', braco: 'baixo' };
const COLEGAS = [
  { tipo: 'crianca', pele: '#7a4b30', roupa: '#7b5aa6', calca: '#2c3346', cabelo: 'crespo', corCabelo: '#120c08', rosto: 'feliz', braco: 'palma' },
  { tipo: 'crianca', pele: '#f6e3d3', roupa: '#e5484d', saia: '#e5484d', cabelo: 'trancas', corCabelo: '#e8c240', rosto: 'feliz', braco: 'cintura' },
  { tipo: 'crianca', pele: '#e2b48c', roupa: '#f2c94c', calca: '#2f5fa8', cabelo: 'curto', corCabelo: '#3a2416', chapeu: 'bone', corChapeu: '#3d8bfd', rosto: 'feliz', braco: 'palma' },
];

// ---------- Utilitários de animação ----------
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const seg = (t: number, a: number, b: number) => ease(clamp((t - a) / (b - a)));
const pop = (t: number, at: number, d = 0.28) => {
  const x = clamp((t - at + 4 * F) / d);
  return x <= 0 ? 0 : 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
};
const resp = (t: number, s = 0) => Math.sin(t * 2.4 + s) * 3; // respiração leve
const face = (t: number, keys: [number, string][]) => keys.filter(([at]) => t >= at - 2 * F).pop()?.[1] ?? keys[0][1];

type P = { t: number; t0: number; t1: number };
// Câmera: aproxima devagar e centraliza em (cx, cy).
const Cam = ({ t, t0, t1, z0 = 1, z1 = 1.08, cx = 540, cy = 1000, children }: P & { z0?: number; z1?: number; cx?: number; cy?: number; children: ReactNode }) => {
  const z = z0 + (z1 - z0) * clamp((t - t0) / Math.max(0.1, t1 - t0));
  return <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${cx}px ${cy}px` }}>{children}</AbsoluteFill>;
};
const Pop = ({ t, at, x, y, children, d }: { t: number; at: number; x: number; y: number; children: ReactNode; d?: number }) => {
  const s = pop(t, at, d);
  if (s <= 0.001) return null;
  return <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})` }}>{children}</div>;
};
const Brilho = ({ t, at, x, y, n = 8, r = 90 }: { t: number; at: number; x: number; y: number; n?: number; r?: number }) => {
  const k = clamp((t - at) / 0.6);
  if (k <= 0 || k >= 1) return null;
  return (
    <Svg>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const rr = r * (0.4 + k);
        return <path key={i} d={`M${x + Math.cos(a) * rr} ${y + Math.sin(a) * rr} l${Math.cos(a) * 26} ${Math.sin(a) * 26}`} stroke="#ffd166" strokeWidth={10} strokeLinecap="round" opacity={1 - k} />;
      })}
    </Svg>
  );
};
const Balao = ({ texto, cor = '#fff' }: { texto: string; cor?: string }) => (
  <div style={{ background: cor, border: `6px solid ${L}`, borderRadius: 40, padding: '18px 34px', fontFamily: '"Arial Black", Arial', fontSize: 64, color: L, whiteSpace: 'nowrap' }}>{texto}</div>
);
const Placa = ({ texto, bg = '#fff', fg = L, size = 52 }: { texto: string; bg?: string; fg?: string; size?: number }) => (
  <div style={{ background: bg, border: `6px solid ${L}`, borderRadius: 16, padding: '14px 28px', fontFamily: '"Arial Black", Arial', fontSize: size, color: fg, whiteSpace: 'pre', textAlign: 'center', lineHeight: 1.1 }}>{texto}</div>
);

// ---------- Cenas (uma por frase) ----------
// 0 — A regra: nasce um fio branco no cabelo do vizinho.
const C00 = ({ t, t0, t1 }: P) => {
  const fio = W(0, 'branco');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.25} cy={880}>
      <Svg><Rua t={t} /></Svg>
      <Boneco k={{ ...VIZINHO, rosto: face(t, [[t0, 'neutro'], [fio, 'surpreso']]), fios: t >= fio - 2 * F ? 1 : 0 }} x={540} y={CHAO_RUA} dy={resp(t)} />
      <Brilho t={t} at={fio} x={560} y={690} />
    </Cam>
  );
};
// 1 — Não dá pra pintar, nem arrancar.
const C01 = ({ t, t0, t1 }: P) => {
  const pin = W(1, 'pintar');
  const arr = W(1, 'arrancar');
  const puxa = t >= arr - 3 * F;
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1.25} cy={880}>
      <Svg><Rua t={t} /></Svg>
      <Boneco k={{ ...VIZINHO, fios: 1, rosto: puxa ? 'assustado' : t >= pin ? 'confiante' : 'neutro', braco: puxa ? 'continencia' : 'palma', item: puxa ? undefined : 'pincel' }} x={540} y={CHAO_RUA} dy={puxa ? -10 * Math.abs(Math.sin((t - arr) * 14)) : resp(t)} />
      {puxa && <Pop t={t} at={arr} x={720} y={640}><Balao texto="AI!" cor="#ffd166" /></Pop>}
    </Cam>
  );
};
// 2 — O pai: trinta anos e cabeça toda branca.
const C02 = ({ t, t0, t1 }: P) => {
  const tri = W(2, 'trinta');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.15} cy={900}>
      <Svg><Rua t={t} /></Svg>
      <Boneco k={{ ...PAI, braco: 'acena' }} x={460} y={CHAO_RUA} dy={resp(t)} />
      <Pop t={t} at={tri} x={790} y={1010}>
        <svg width={250} height={260} viewBox="0 0 250 260">
          <rect x={20} y={110} width={210} height={120} rx={14} fill="#f6b8c8" stroke={L} strokeWidth={6} />
          <path d="M20 150 q26 22 52 0 q26 22 52 0 q26 22 52 0 q26 22 54 0" fill="#fff" stroke={L} strokeWidth={4} />
          <text x={125} y={212} textAnchor="middle" fontFamily="Arial Black" fontSize={58} fill={L}>30</text>
          {[80, 125, 170].map((x) => (
            <g key={x}>
              <rect x={x - 7} y={60} width={14} height={50} fill="#3d8bfd" stroke={L} strokeWidth={3} />
              <path d={`M${x} 30 q12 16 0 28 q-12 -12 0 -28 z`} fill="#ffd166" stroke={L} strokeWidth={3} />
            </g>
          ))}
        </svg>
      </Pop>
    </Cam>
  );
};
// 3 — Filho do desistente: colegas riem na escola.
const C03 = ({ t, t0, t1 }: P) => {
  const d = W(3, 'desistente');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1100}>
      <Svg><Escola t={t} /></Svg>
      <Boneco k={COLEGAS[0]} x={180} y={1420} h={560} dy={t > d ? -8 * Math.abs(Math.sin(t * 9)) : 0} />
      <Boneco k={COLEGAS[1]} x={360} y={1440} h={560} dy={t > d ? -8 * Math.abs(Math.sin(t * 9 + 1)) : 0} />
      <Boneco k={{ ...MENINO, rosto: face(t, [[t0, 'neutro'], [d, 'triste']]) }} x={640} y={1430} h={580} />
      <Boneco k={COLEGAS[2]} x={890} y={1420} h={560} flip dy={t > d ? -8 * Math.abs(Math.sin(t * 9 + 2)) : 0} />
      <Pop t={t} at={d} x={300} y={760}><Balao texto="HAHAHA" /></Pop>
    </Cam>
  );
};
// 4 — Pede pro pai não ir na apresentação.
const C04 = ({ t, t0, t1 }: P) => {
  const a = W(4, 'apresentacao');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.15} cy={1000}>
      <Svg><Sala porta sofa={false} /></Svg>
      <Pop t={t} at={t0 + 0.2} x={540} y={520}><Placa texto={'APRESENTAÇÃO\nDE FIM DE ANO'} bg="#ffd166" size={48} /></Pop>
      <Boneco k={{ ...PAI, rosto: face(t, [[t0, 'feliz'], [a, 'triste']]) }} x={680} y={CHAO_SALA} dy={resp(t)} />
      <Boneco k={{ ...MENINO, braco: 'palma', rosto: 'triste' }} x={360} y={CHAO_SALA} h={600} />
      <Pop t={t} at={a} x={330} y={760}><Balao texto="Não vai, tá?" /></Pop>
    </Cam>
  );
};
// 5 — O pai faz que sim com a cabeça.
const C05 = ({ t, t0, t1 }: P) => {
  const s = W(5, 'sim');
  const nod = t > s - 4 * F && t < s + 1.1 ? 14 * Math.abs(Math.sin((t - s + 4 * F) * 6)) : 0;
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.6} z1={1.75} cx={540} cy={820}>
      <Svg><Sala porta sofa={false} /></Svg>
      <Boneco k={{ ...PAI, rosto: 'triste' }} x={540} y={CHAO_SALA} dy={nod} />
    </Cam>
  );
};
// 6 — Naquela noite, o primeiro fio branco (no espelho).
const C06 = ({ t, t0, t1 }: P) => {
  const p = W(6, 'primeiro');
  const k = { ...MENINO, fios: t >= p - 2 * F ? 1 : 0, rosto: face(t, [[t0, 'triste'], [p, 'surpreso']]) };
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.3} cy={900}>
      <Svg>
        <Sala noite sofa={false} />
        <rect x={500} y={520} width={420} height={760} rx={200} fill="#9fb8d8" stroke="#8a6a4a" strokeWidth={22} />
      </Svg>
      <div style={{ position: 'absolute', left: 500, top: 520, width: 420, height: 760, borderRadius: 200, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: -500, top: -520, width: 1080, height: 1920 }}>
          <Boneco k={k} x={710} y={1500} h={760} flip />
        </div>
      </div>
      <Boneco k={k} x={300} y={CHAO_SALA} h={640} />
      <Brilho t={t} at={p} x={706} y={760} />
    </Cam>
  );
};
// 7 — Eu tinha desistido do meu pai.
const C07 = ({ t, t0, t1 }: P) => {
  const d = W(7, 'desistido');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.5} z1={1.7} cy={860}>
      <Svg><Sala noite sofa={false} /></Svg>
      <Boneco k={{ ...MENINO, fios: 1, rosto: face(t, [[t0, 'triste'], [d, 'chorando']]) }} x={540} y={CHAO_SALA} h={640} />
    </Cam>
  );
};
// 8 — A avó mostra as fotos.
const C08 = ({ t, t0, t1 }: P) => {
  const f = W(8, 'fotos');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.1} cy={1150}>
      <Svg><Sala /></Svg>
      <Boneco k={{ ...AVO, braco: 'palma', item: 'livro', rosto: face(t, [[t0, 'feliz'], [f, 'confiante']]) }} x={430} y={1330} h={600} />
      <Boneco k={{ ...MENINO, fios: 1, rosto: 'triste' }} x={700} y={1330} h={600} flip />
    </Cam>
  );
};
// Fotos do álbum.
const FotoCena = ({ t, t0, t1, at, legenda, children, rot = -3 }: P & { at: number; legenda: string; children: ReactNode; rot?: number }) => {
  const s = pop(t, at - 0.15, 0.35);
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={900}>
      <Svg><Liso a="#c9a77c" b="#8a6a4a" /></Svg>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${s})`, transformOrigin: '540px 860px' }}>
        <Foto x={540} y={860} rot={rot} legenda={legenda}>{children}</Foto>
      </div>
    </Cam>
  );
};
// 9 — Largou o futebol pra trabalhar.
const C09 = ({ t, t0, t1 }: P) => {
  const tr = W(9, 'trabalhar');
  const virou = t >= tr - 3 * F;
  return (
    <FotoCena t={t} t0={t0} t1={t1} at={t0} legenda={virou ? 'primeiro emprego' : 'o craque do bairro'}>
      <Svg><rect width={1080} height={1920} fill={virou ? '#e9dcc3' : '#7cc47f'} />{!virou && <path d="M0 520 H700" stroke="#fff" strokeWidth={8} />}</Svg>
      <Boneco k={virou ? { ...PAI, corCabelo: '#2a1a12', fios: 6, roupa: '#ff8a2f', colete: '#f2c94c', chapeu: 'capacete', corChapeu: '#ff8a2f', braco: 'palma', item: 'martelo', rosto: 'confiante' } : { ...PAI, corCabelo: '#2a1a12', roupa: '#2fa36b', peito: '10', calca: '#ffffff', short: true, braco: 'palma', item: 'bola', rosto: 'feliz' }} x={340} y={600} h={560} />
    </FotoCena>
  );
};
// 10 — Vendeu a moto pra pagar a escola.
const Moto = () => (
  <svg width={420} height={260} viewBox="0 0 420 260">
    <circle cx={80} cy={190} r={60} fill="#3a3a44" stroke={L} strokeWidth={8} /><circle cx={80} cy={190} r={22} fill="#c9ccd4" />
    <circle cx={330} cy={190} r={60} fill="#3a3a44" stroke={L} strokeWidth={8} /><circle cx={330} cy={190} r={22} fill="#c9ccd4" />
    <path d="M80 190 L170 110 H280 L330 190 M250 110 l30 -50 h40" stroke={L} strokeWidth={10} fill="none" strokeLinejoin="round" />
    <path d="M150 120 h140 q10 -40 -30 -46 h-80 q-34 6 -30 46 z" fill="#d1495b" stroke={L} strokeWidth={6} />
  </svg>
);
const C10 = ({ t, t0, t1 }: P) => {
  const m = W(10, 'moto');
  const e = W(10, 'escola');
  return (
    <FotoCena t={t} t0={t0} t1={t1} at={t0} rot={3} legenda="vendida!">
      <Svg><rect width={1080} height={1920} fill="#f7d9a8" /></Svg>
      <Boneco k={{ ...PAI, corCabelo: '#f7f7f7', braco: 'palma', rosto: 'feliz' }} x={170} y={600} h={500} />
      <Pop t={t} at={m} x={460} y={480}><Moto /></Pop>
      <Pop t={t} at={e} x={500} y={160}><Placa texto="R$ → ESCOLA" bg="#7be07b" size={44} /></Pop>
    </FotoCena>
  );
};
// 11 — Noites sem dormir quando você ficava doente.
const C11 = ({ t, t0, t1 }: P) => {
  const d = W(11, 'dormir');
  return (
    <FotoCena t={t} t0={t0} t1={t1} at={t0} rot={-2} legenda="3 da manhã">
      <Svg>
        <rect width={1080} height={1920} fill="#2b3a67" />
        <circle cx={560} cy={110} r={44} fill="#fff6c8" />
        <rect x={330} y={440} width={330} height={170} rx={12} fill="#f4f0e8" stroke={L} strokeWidth={6} />
        {[360, 410, 460, 510, 560, 610].map((x) => <rect key={x} x={x} y={380} width={10} height={70} fill="#f4f0e8" stroke={L} strokeWidth={3} />)}
      </Svg>
      <Boneco k={{ tipo: 'bebe', pele: '#f6e3d3', roupa: '#f2c94c', cabelo: 'bebe', corCabelo: '#2a1a12', rosto: 'chorando' }} x={500} y={470} h={300} />
      <Boneco k={{ ...PAI, rosto: face(t, [[t0, 'triste'], [d, 'dormindo']]), braco: 'colo' }} x={180} y={620} h={520} />
    </FotoCena>
  );
};
// 12 — Cada fio é um sonho trocado por você: sonhos saem do cabelo do pai.
const C12 = ({ t, t0, t1 }: P) => {
  const s = W(12, 'sonho');
  const v = W(12, 'voce');
  const sobe = (i: number) => clamp((t - s - i * 0.25) / 2.2);
  const icones = ['⚽', '🏍️', '🌙', '✈️'];
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.15} cy={1000}>
      <Svg><Sala /></Svg>
      <Boneco k={{ ...PAI, rosto: 'dormindo', braco: 'baixo' }} x={540} y={1330} h={600} />
      {icones.map((ic, i) => {
        const k = sobe(i);
        if (k <= 0) return null;
        return <div key={i} style={{ position: 'absolute', left: 540 + (i - 1.5) * 150 * k, top: 760 - k * 380, fontSize: 90, opacity: k < 0.85 ? 1 : (1 - k) / 0.15, transform: `scale(${0.4 + k * 0.8})` }}>{ic}</div>;
      })}
      <Pop t={t} at={v} x={540} y={520}><div style={{ fontSize: 150 }}>💛</div></Pop>
    </Cam>
  );
};
// 13 — Leva o pai pela mão até a primeira fila.
const C13 = ({ t, t0, t1 }: P) => {
  const k = seg(t, t0, t1 + 0.2);
  const x = -120 + k * 640;
  const bob = (o: number) => -10 * Math.abs(Math.sin((t - t0) * 7 + o));
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1200}>
      <Svg><Auditorio /></Svg>
      <Boneco k={{ ...PAI, rosto: 'surpreso', braco: 'baixo' }} x={x + 110} y={1640} h={640} dy={bob(1)} rot={Math.sin((t - t0) * 7) * 2} />
      <Boneco k={{ ...MENINO, fios: 1, rosto: 'confiante', braco: 'palma' }} x={x + 330} y={1650} h={600} dy={bob(0)} rot={Math.sin((t - t0) * 7 + 1) * 2} />
      <Pop t={t} at={W(13, 'primeira')} x={760} y={1250}><Placa texto="1ª FILA" bg="#ffd166" size={44} /></Pop>
    </Cam>
  );
};
// 14 — "Esse é o meu pai!" no palco.
const C14 = ({ t, t0, t1 }: P) => {
  const p = W(14, 'pai');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
      <Svg><Auditorio /></Svg>
      <Boneco k={{ ...MENINO, fios: 1, rosto: face(t, [[t0, 'confiante'], [p, 'feliz']]), braco: t >= p - 4 * F ? 'acena' : 'palma' }} x={540} y={1080} h={600} />
      <Boneco k={{ ...PAI, rosto: face(t, [[t0, 'surpreso'], [p, 'chorando']]) }} x={760} y={1780} h={620} />
      <Pop t={t} at={p} x={540} y={560}><Balao texto="ESSE É O MEU PAI!" cor="#ffd166" /></Pop>
      <Brilho t={t} at={p} x={760} y={1300} n={10} r={140} />
    </Cam>
  );
};
// 15 — Hoje, o cabelo do narrador também é todo branco.
const C15 = ({ t, t0, t1 }: P) => {
  const b = W(15, 'branco');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.2} cy={900}>
      <Svg><Rua t={t} ceu={['#f9d29d', '#f5a46b']} sol /></Svg>
      <Pop t={t} at={t0 + 0.1} x={540} y={520}><Placa texto="ANOS DEPOIS" bg="#fff" size={48} /></Pop>
      <Boneco k={{ ...ADULTO, rosto: 'feliz' }} x={540} y={CHAO_RUA} dy={resp(t)} />
      <Brilho t={t} at={b} x={540} y={720} />
    </Cam>
  );
};
// 16 — O filho acha que ele desistiu de muita coisa.
const C16 = ({ t, t0, t1 }: P) => {
  const d = W(16, 'desisti');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.15} cy={1000}>
      <Svg><Rua t={t} ceu={['#f9d29d', '#f5a46b']} /></Svg>
      <Boneco k={{ ...ADULTO, rosto: 'neutro' }} x={420} y={CHAO_RUA} dy={resp(t)} />
      <Boneco k={{ ...FILHO, rosto: face(t, [[t0, 'neutro'], [d, 'surpreso']]), braco: 'palma' }} x={700} y={CHAO_RUA} h={580} flip />
      <Pop t={t} at={d} x={760} y={720}><Balao texto="?" /></Pop>
    </Cam>
  );
};
// 17 — Eu só sorrio.
const C17 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1.7} z1={1.85} cy={760}>
    <Svg><Rua t={t} ceu={['#f9d29d', '#f5a46b']} /></Svg>
    <Boneco k={{ ...ADULTO, rosto: face(t, [[t0, 'neutro'], [W(17, 'sorrio'), 'feliz']]) }} x={540} y={CHAO_RUA} />
  </Cam>
);
// 18 — Igualzinho ao meu pai: os dois sorrisos lado a lado.
const C18 = ({ t, t0, t1 }: P) => {
  const p = W(18, 'pai');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.06} cy={900}>
      <Svg><Liso a="#fff3dd" b="#f5c58c" /></Svg>
      <Foto x={540} y={700} w={600} h={680} rot={-4} legenda="meu pai">
        <Svg><rect width={1080} height={1920} fill="#bfe6ff" /></Svg>
        <Boneco k={{ ...PAI, tipo: 'idoso', rosto: 'feliz', oculos: true }} x={260} y={480} h={460} />
      </Foto>
      <Boneco k={{ ...ADULTO, rosto: 'feliz', braco: 'palma' }} x={540} y={1650} h={620} dy={resp(t)} />
      <Brilho t={t} at={p} x={540} y={700} n={12} r={260} />
    </Cam>
  );
};

const CENAS: ((p: P) => JSX.Element)[] = [C00, C01, C02, C03, C04, C05, C06, C07, C08, C09, C10, C11, C12, C13, C14, C15, C16, C17, C18];

// ---------- Legenda: até 3 palavras, destaque amarelo ----------
const Legenda = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = WORDS.findIndex((w, i) => t >= w.t0 - 0.05 && (i === WORDS.length - 1 || t < WORDS[i + 1].t0 - 0.05));
  if (idx < 0 || t > WORDS[WORDS.length - 1].t1 + 0.5) return null;
  const cur = WORDS[idx];
  const start = Math.floor(cur.i / 3) * 3;
  const chunk = WORDS.filter((w) => w.line === cur.line).slice(start, start + 3);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1470 }}>
      <div style={{ textAlign: 'center', maxWidth: 980, fontFamily: '"Arial Black", Arial, sans-serif', fontSize: 82, lineHeight: 1.1 }}>
        {chunk.map((w) => (
          <span key={w.i} style={{ color: w.stressed ? '#ffd23a' : '#fff', WebkitTextStroke: '16px #2a2230', paintOrder: 'stroke fill', margin: '0 18px', display: 'inline-block', transform: w === cur ? 'scale(1.1)' : 'none' }}>
            {w.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const FADE = 6;
export const FiosBrancos = () => {
  const { fps } = useVideoConfig();
  const inicio = LINES.map((_, i) => (i === 0 ? 0 : W(i, 0)));
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {CENAS.map((C, i) => {
        const t0 = inicio[i];
        const t1 = i + 1 < CENAS.length ? inicio[i + 1] : END;
        const from = Math.round(t0 * fps);
        const dur = Math.round(t1 * fps) - from + (i + 1 < CENAS.length ? FADE : 0);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`cena ${i}`}>
            <Cena C={C} t0={from / fps} t1={t1} fade={i > 0} />
          </Sequence>
        );
      })}
      <Legenda />
      <Audio src={staticFile('voz-fios.mp3')} />
    </AbsoluteFill>
  );
};
const Cena = ({ C, t0, t1, fade }: { C: (p: P) => JSX.Element; t0: number; t1: number; fade: boolean }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity: fade ? Math.min(1, frame / FADE) : 1, overflow: 'hidden' }}>
      <C t={t0 + frame / fps} t0={t0} t1={t1} />
    </AbsoluteFill>
  );
};
export const DURACAO_FIOS = END;
