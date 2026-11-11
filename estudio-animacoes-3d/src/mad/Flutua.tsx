// "Quem Mente Flutua": animação 2D com os PERSONAGENS MAD ARTICULADOS.
// Sem narração por enquanto (só legendas); com public/voz-flutua.mp3 + palavras-flutua.ts ela sincroniza sozinha.
import { JSX, ReactNode } from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Ceu, CHAO_RUA, L, Rua, Svg } from './cenarios';
import { Balao, Brilho, Cam, clamp, FADE, P, Placa, Pop } from './FiosBrancos';
import { Ator, Mov } from './FiosBrancosArticulado';
import { Granulado } from './Granulado';
import { FeiraDia, Passarinho, PrefeituraDia, RuaDia } from './cenarios-dia';
import { COM_VOZ, END, LINES, W, WORDS } from './timeline-flutua';

// ---------- Elenco ----------
const OTAVIO = { tipo: 'adulto', pele: '#f6e3d3', roupa: '#2c3346', calca: '#2c3346', gravata: '#d1495b', cabelo: 'topete', corCabelo: '#1a1410', sapato: '#111' };
const RITA = { tipo: 'adulto', corpo: 'gordo', pele: '#b9805a', roupa: '#f2c94c', saia: '#7b5aa6', cabelo: 'coque', corCabelo: '#2a1a12', sapato: '#b9805a' };
const MEDIADOR = { tipo: 'idoso', pele: '#e2b48c', roupa: '#8a6a4a', calca: '#4a4f3e', gravata: '#2f4f8f', cabelo: 'careca', corCabelo: '#d6d6d6', oculos: true };
const MENINO = { tipo: 'crianca', pele: '#7a4b30', roupa: '#3dc4d8', calca: '#2f5fa8', short: true, cabelo: 'crespo', corCabelo: '#120c08', sapato: '#e5484d' };
const MENINA = { tipo: 'crianca', pele: '#f6e3d3', roupa: '#f28fb0', saia: '#f28fb0', cabelo: 'trancas', corCabelo: '#c8572b', sapato: '#7b5aa6' };
const VIZINHO = { tipo: 'adulto', corpo: 'gordo', pele: '#e2b48c', roupa: '#d1495b', calca: '#4a4f3e', cabelo: 'curto', corCabelo: '#3a2416', bigode: true };

// ---------- Quanto o Seu Otávio já flutua ----------
const PALMO = 100;
const subir = (t: number, at: number, alt: number) => {
  const k = clamp((t - at + 0.05) / 0.4);
  const e = k <= 0 ? 0 : 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2);
  return alt * e;
};
const altura = (t: number) => subir(t, W(10, 'ploc'), PALMO) + subir(t, W(12, 'mais'), PALMO) + subir(t, W(14, 'mais'), PALMO);
// balanço de quem flutua
const boia = (t: number, a = 8) => a * Math.sin(t * 2.2);

// ---------- Cenários ----------
const Prefeitura = ({ t }: { t: number }) => (
  <Svg>
    <Ceu t={t} />
    <rect x={0} y={1150} width={1080} height={180} fill="#e9dcc3" stroke={L} strokeWidth={5} />
    <rect x={0} y={1330} width={1080} height={590} fill="#5c6370" />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={i * 180 + 20} y={1600} width={110} height={18} rx={6} fill="#f1f1f1" />)}
    <g>
      <path d="M140 640 L540 470 L940 640 z" fill="#c9b79a" stroke={L} strokeWidth={6} strokeLinejoin="round" />
      <rect x={160} y={640} width={760} height={510} fill="#efe4cf" stroke={L} strokeWidth={6} />
      <rect x={300} y={670} width={480} height={70} rx={10} fill="#2f4f8f" stroke={L} strokeWidth={5} />
      <text x={540} y={720} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={46} fill="#fff">PREFEITURA</text>
      {[210, 350, 490, 630, 770, 870].map((x) => <rect key={x} x={x} y={760} width={34} height={330} fill="#fbf6ea" stroke={L} strokeWidth={4} />)}
      <rect x={470} y={950} width={140} height={200} rx={8} fill="#6b4a2e" stroke={L} strokeWidth={5} />
      {[0, 1, 2].map((i) => <rect key={i} x={380 - i * 40} y={1090 + i * 20} width={320 + i * 80} height={20} fill="#d8ccb4" stroke={L} strokeWidth={3} />)}
      <path d="M540 470 V340" stroke={L} strokeWidth={6} />
      <path d={`M540 345 q40 ${-10 + 8 * Math.sin(t * 4)} 80 0 v50 q-40 ${10 + 8 * Math.sin(t * 4 + 1)} -80 0 z`} fill="#2fa36b" stroke={L} strokeWidth={4} />
    </g>
    {[60, 1020].map((x) => (
      <g key={x}>
        <rect x={x - 10} y={1060} width={20} height={90} fill="#8a5a32" stroke={L} strokeWidth={4} />
        <circle cx={x} cy={1010} r={70} fill="#57a773" stroke={L} strokeWidth={5} />
      </g>
    ))}
  </Svg>
);
// Barraca de feira com melancias, laranjas e toldo listrado.
const Feira = ({ t }: { t: number }) => (
  <Svg>
    <Ceu t={t} />
    <rect x={0} y={1150} width={1080} height={180} fill="#e9dcc3" stroke={L} strokeWidth={5} />
    <rect x={0} y={1330} width={1080} height={590} fill="#5c6370" />
    <g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M${120 + i * 105} 620 h105 v90 q-52 40 -105 0 z`} fill={i % 2 ? '#fff' : '#d1495b'} stroke={L} strokeWidth={4} />)}
      {[140, 920].map((x) => <rect key={x} x={x} y={620} width={20} height={530} fill="#8a5a32" stroke={L} strokeWidth={4} />)}
      <rect x={130} y={980} width={820} height={40} fill="#b07a45" stroke={L} strokeWidth={5} />
      <rect x={160} y={1020} width={760} height={130} fill="#8a5a32" stroke={L} strokeWidth={5} />
      {[220, 330, 440].map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy={950} rx={60} ry={40} fill="#2e8b3e" stroke={L} strokeWidth={4} />
          {[-30, -10, 10, 30].map((d) => <path key={d} d={`M${x + d} 912 q${d * 0.2} 38 0 76`} stroke="#1b5e28" strokeWidth={5} fill="none" />)}
        </g>
      ))}
      <path d="M560 990 l80 -110 l80 110 z" fill="#e5484d" stroke={L} strokeWidth={4} />
      <path d="M572 975 l68 -90 l68 90 z" fill="#2e8b3e" />
      {[600, 625, 650, 675].map((x) => <circle key={x} cx={x} cy={960} r={4} fill="#1a1a1a" />)}
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={770 + (i % 4) * 38 + (i > 3 ? 19 : 0)} cy={960 - (i > 3 ? 30 : 0)} r={20} fill="#ff8a2f" stroke={L} strokeWidth={3} />)}
      <rect x={380} y={560} width={320} height={70} rx={10} fill="#fff" stroke={L} strokeWidth={5} />
      <text x={540} y={610} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={44} fill="#d1495b">FEIRA</text>
    </g>
  </Svg>
);
// Quadra da escola: arquibancada com plateia, faixa, lâmpada e ventilador no teto. Chão da quadra: y = 1450.
const CHAO_Q = 1450;
const Quadra = ({ t, ventilador = 1, lampada = true, rir = false }: { t: number; ventilador?: number; lampada?: boolean; rir?: boolean }) => (
  <Svg>
    <rect width={1080} height={1920} fill="#d9c9a8" />
    <rect x={0} y={0} width={1080} height={120} fill="#8a6a4a" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={i * 240 - 20} y={0} width={30} height={130} fill="#6b4a2e" stroke={L} strokeWidth={3} />)}
    {/* ventilador de teto */}
    <g transform={`translate(780 150) rotate(${t * 400 * ventilador})`}>
      {[0, 120, 240].map((a) => <rect key={a} x={-12} y={-150} width={24} height={150} rx={10} fill="#b07a45" stroke={L} strokeWidth={4} transform={`rotate(${a})`} />)}
      <circle r={26} fill="#4a4f5a" stroke={L} strokeWidth={4} />
    </g>
    <rect x={776} y={100} width={8} height={30} fill={L} />
    {/* lâmpada */}
    <path d="M300 120 V200" stroke={L} strokeWidth={5} />
    {lampada ? (
      <g><circle cx={300} cy={225} r={28} fill="#fff6c8" stroke={L} strokeWidth={4} /><circle cx={300} cy={225} r={70} fill="#fff6c8" opacity={0.25} /></g>
    ) : (
      <g><path d="M280 210 l10 18 l-8 10 l14 12 M320 210 l-12 20 l10 8" stroke={L} strokeWidth={4} fill="none" /></g>
    )}
    {/* janelas altas com feixes de luz */}
    {[60, 880].map((x) => <g key={x}><rect x={x} y={150} width={140} height={110} fill="#bfe6ff" stroke={L} strokeWidth={5} /><path d={`M${x + 70} 150 v110 M${x} 205 h140`} stroke={L} strokeWidth={3} /><path d={`M${x} 260 L${x - 80} 760 H${x + 260} L${x + 140} 260 z`} fill="#fff6c8" opacity={0.18} /></g>)}
    {/* tabelas de basquete */}
    {[[40, 1], [1040, -1]].map(([x, d]) => <g key={x}><rect x={x - 40} y={450} width={80} height={110} fill="#fff" stroke={L} strokeWidth={4} /><rect x={x - 20} y={500} width={40} height={36} fill="none" stroke="#d1495b" strokeWidth={4} /><ellipse cx={x + d * 40} cy={560} rx={34} ry={8} fill="none" stroke="#ff8a2f" strokeWidth={6} />{[-24, -8, 8, 24].map((k) => <path key={k} d={`M${x + d * 40 + k} 562 l${-k * 0.3} 50`} stroke="#fff" strokeWidth={2} />)}</g>)}
    {/* placar */}
    <g><rect x={400} y={440} width={280} height={110} rx={10} fill="#1a1a1e" stroke={L} strokeWidth={5} /><rect x={470} y={410} width={140} height={32} rx={6} fill="#ffd166" stroke={L} strokeWidth={3} /><text x={470} y={482} textAnchor="middle" fontFamily="Arial Black" fontSize={22} fill="#ff8a7a">OTÁVIO</text><text x={610} y={482} textAnchor="middle" fontFamily="Arial Black" fontSize={22} fill="#7be07b">RITA</text><text x={470} y={530} textAnchor="middle" fontFamily="Courier New, monospace" fontWeight={900} fontSize={40} fill="#ffd166">{String(mentiras(t)).padStart(2, '0')}</text><text x={540} y={432} textAnchor="middle" fontFamily="Arial Black" fontSize={22} fill={L}>MENTIRAS</text><text x={610} y={530} textAnchor="middle" fontFamily="Courier New, monospace" fontWeight={900} fontSize={40} fill="#ffd166">00</text><text x={540} y={530} textAnchor="middle" fontFamily="Arial Black" fontSize={30} fill="#fff">x</text></g>
    {/* refletores */}
    {[180, 900].map((x, i) => <g key={x}><path d={`M${x} 130 L${x - 110 + i * 40} 1150 H${x + 70 + i * 40} z`} fill="#fffbe0" opacity={0.08 + 0.02 * Math.sin(t * 3 + i)} /><rect x={x - 26} y={118} width={52} height={36} rx={8} fill="#3a3f4a" stroke={L} strokeWidth={3} /></g>)}
    {/* faixa */}
    <rect x={190} y={300} width={700} height={100} rx={12} fill="#2f4f8f" stroke={L} strokeWidth={5} />
    <text x={540} y={368} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={54} fill="#ffd166">DEBATE AO VIVO</text>
    {/* arquibancada com plateia */}
    {[0, 1, 2].map((r) => (
      <g key={r}>
        <rect x={0} y={760 + r * 130} width={1080} height={130} fill={['#a0703c', '#8a5a32', '#7a4f2c'][r]} stroke={L} strokeWidth={4} />
        {Array.from({ length: 9 }, (_, i) => {
          const x = 70 + i * 118 + (r % 2) * 50, y = 740 + r * 130 - (rir ? Math.abs(Math.sin(t * 12 + i + r)) * 14 : 0);
          const pele = ['#f6e3d3', '#e2b48c', '#b9805a', '#7a4b30'][(i + r) % 4];
          const cab = ['#2a1a12', '#c8572b', '#e8c240', '#120c08', '#d6d6d6'][(i * 2 + r) % 5];
          return (
            <g key={i}>
              <rect x={x - 42} y={y + 28} width={84} height={70} rx={16} fill={['#d1495b', '#3d8bfd', '#2fa36b', '#f2c94c', '#7b5aa6'][(i + r * 2) % 5]} stroke={L} strokeWidth={3} />
              <circle cx={x} cy={y} r={34} fill={pele} stroke={L} strokeWidth={3} />
              <path d={`M${x - 34} ${y - 2} a34 34 0 0 1 68 0 q-34 -18 -68 0 z`} fill={cab} stroke={L} strokeWidth={3} />
              {rir ? <path d={`M${x - 12} ${y + 8} q12 16 24 0 z`} fill={L} /> : <circle cx={x} cy={y + 12} r={3} fill={L} />}
              <circle cx={x - 11} cy={y - 2} r={3.5} fill={L} /><circle cx={x + 11} cy={y - 2} r={3.5} fill={L} />
            </g>
          );
        })}
      </g>
    ))}
    {/* cartazes na plateia */}
    {[[220, 720, 'RITA ♥', '#2fa36b', -6], [700, 850, 'OTÁVIO ★', '#d1495b', 5], [980, 720, 'FORA MENTIRA!', '#ffd166', -4]].map(([x, y, txt, cor, r], i) => (
      <g key={i} transform={`translate(${x} ${Number(y) - (rir ? Math.abs(Math.sin(t * 9 + i)) * 16 : Math.abs(Math.sin(t * 2 + i)) * 6)}) rotate(${r})`}>
        <rect x={-6} y={0} width={12} height={90} fill="#8a5a32" />
        <rect x={-90} y={-60} width={180} height={70} rx={8} fill={cor as string} stroke={L} strokeWidth={4} />
        <text x={0} y={-14} textAnchor="middle" fontFamily="Arial Black" fontSize={26} fill={cor === '#ffd166' ? L : '#fff'}>{txt}</text>
      </g>
    ))}
    {/* piso da quadra */}
    <rect x={0} y={1150} width={1080} height={770} fill="#d9a066" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M0 ${1180 + i * 62} H1080`} stroke="#b9824a" strokeWidth={3} />)}
    <path d="M0 1500 H1080 M540 1150 V1920" stroke="#fff" strokeWidth={8} opacity={0.8} />
    <ellipse cx={540} cy={1500} rx={170} ry={60} fill="none" stroke="#fff" strokeWidth={8} opacity={0.8} />
    {[[180, 1300], [700, 1700]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={160} ry={18} fill="#fff" opacity={0.12} />)}
    {/* câmera de TV ao vivo */}
    <g transform="translate(1010 1700)">
      <path d="M0 0 L-60 220 M0 0 L60 220 M0 0 V220" stroke="#3a3f4a" strokeWidth={8} />
      <rect x={-90} y={-90} width={150} height={90} rx={10} fill="#2a2d3a" stroke={L} strokeWidth={4} />
      <rect x={-140} y={-70} width={60} height={50} rx={6} fill="#3a3f4a" stroke={L} strokeWidth={4} />
      <circle cx={40} cy={-70} r={9} fill="#ff3b3b" opacity={(t * 2) % 1 < 0.5 ? 1 : 0.25} />
    </g>
  </Svg>
);
// Púlpito (desenhado NA FRENTE do personagem).
const Pulpito = ({ x, y = CHAO_Q, nome, cor = '#2f4f8f' }: { x: number; y?: number; nome: string; cor?: string }) => (
  <Svg>
    <path d={`M${x - 120} ${y - 250} h240 l-20 250 h-200 z`} fill={cor} stroke={L} strokeWidth={5} strokeLinejoin="round" />
    <rect x={x - 140} y={y - 270} width={280} height={30} rx={8} fill="#6b4a2e" stroke={L} strokeWidth={4} />
    <text x={x} y={y - 120} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={42} fill="#fff">{nome}</text>
    <path d={`M${x + 60} ${y - 270} q30 -40 10 -90`} stroke={L} strokeWidth={6} fill="none" />
    <rect x={x + 58} y={y - 390} width={22} height={40} rx={10} fill="#3a3a44" stroke={L} strokeWidth={3} />
  </Svg>
);
// Placar de mentiras do Seu Otávio.
const mentiras = (t: number) => [W(9, 'nunca'), W(12, 'todos'), W(14, 'amo'), W(21, 'lua'), W(24, 'otimo')].filter((a) => t >= a).length;
// Nuvenzinha de poeira no púlpito a cada palmo que ele sobe.
const Poeira = ({ t, x, y }: { t: number; x: number; y: number }) => {
  const ats = [W(10, 'ploc'), W(12, 'mais'), W(14, 'mais')];
  const at = ats.filter((a) => t >= a - 0.05 && t < a + 0.7).pop();
  if (at === undefined) return null;
  const k = clamp((t - at) / 0.7);
  return <Svg>{[-1, -0.4, 0.4, 1].map((d, i) => <circle key={i} cx={x + d * (60 + k * 90)} cy={y - k * 30 - (i % 2) * 14} r={20 + k * 26} fill="#efe4cf" opacity={0.85 * (1 - k)} />)}</Svg>;
};
// Medida em palmos ao lado de quem flutua.
const Regua = ({ x, y, h }: { x: number; y: number; h: number }) =>
  h > 5 ? (
    <Svg>
      <path d={`M${x} ${y} V${y - h}`} stroke="#d1495b" strokeWidth={6} strokeDasharray="14 10" />
      <path d={`M${x - 20} ${y} h40 M${x - 20} ${y - h} h40`} stroke="#d1495b" strokeWidth={6} />
      <text x={x + 30} y={y - h / 2 + 14} fontFamily="Arial Black, Arial" fontWeight={900} fontSize={40} fill="#d1495b" stroke="#fff" strokeWidth={8} paintOrder="stroke">{Math.round(h / PALMO)} PALMO{Math.round(h / PALMO) > 1 ? 'S' : ''}</text>
    </Svg>
  ) : null;
const Icone = ({ t, at, x, y, c }: { t: number; at: number; x: number; y: number; c: string }) => <Pop t={t} at={at} x={x} y={y}><div style={{ fontSize: 120 }}>{c}</div></Pop>;

// ---------- Cenas ----------
// 0 — Nessa cidade, ninguém mente.
const C00 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
    <RuaDia t={t} />
    <Ator k={MENINA} t={t} x={230} y={CHAO_RUA} h={560} movs={[['acenar', t0 + 0.3]]} seed={1} />
    <Ator k={VIZINHO} t={t} x={540} y={CHAO_RUA} movs={[['falar', t0]]} seed={2} />
    <Ator k={MEDIADOR} t={t} x={850} y={CHAO_RUA} movs={[['sim', t0 + 0.4]]} seed={3} flip />
  </Cam>
);
// 1 — Quem mente flutua: o vizinho conta uma mentirinha e sobe.
const C01 = ({ t, t0, t1 }: P) => {
  const f = W(1, 'flutua');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.15} cy={950}>
      <RuaDia t={t} />
      <div style={{ transform: `translateY(${-subir(t, f, PALMO) + (t > f ? boia(t) : 0)}px)` }}>
        <Ator k={VIZINHO} t={t} x={540} y={CHAO_RUA} movs={[['falar', t0], ['susto', f, 1.2], ['nervoso', f + 1.2]]} seed={2} />
      </div>
      <Pop t={t} at={f} x={760} y={620}><Balao texto="PLOC!" cor="#ffd166" /></Pop>
    </Cam>
  );
};
// 2 — Um palmo do chão por mentira.
const C02 = ({ t, t0, t1 }: P) => {
  const h = PALMO;
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.3} cy={1050}>
      <RuaDia t={t} />
      <div style={{ transform: `translateY(${-h + boia(t)}px)` }}><Ator k={VIZINHO} t={t} x={540} y={CHAO_RUA} movs={[['nervoso', t0]]} seed={2} /></div>
      <Regua x={700} y={CHAO_RUA} h={h} />
      <Pop t={t} at={W(2, 'palmo')} x={540} y={560}><Placa texto={'1 MENTIRA\n= 1 PALMO'} bg="#ffd166" size={50} /></Pop>
    </Cam>
  );
};
// 3 — A cidade ia escolher o prefeito.
const C03 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={900}>
    <PrefeituraDia t={t} />
    <Pop t={t} at={W(3, 'prefeito')} x={540} y={1250}><Placa texto="ELEIÇÃO NO DOMINGO" bg="#fff" size={46} /></Pop>
  </Cam>
);
// 4 — Seu Otávio, o favorito.
const C04 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.15} cy={950}>
    <PrefeituraDia t={t} />
    <Ator k={OTAVIO} t={t} x={540} y={CHAO_RUA} movs={[['entrar', t0], ['acenar', t0 + 0.7]]} seed={4} />
    <Pop t={t} at={W(4, 'favorito')} x={540} y={420}><Placa texto="VOTE OTÁVIO ★" bg="#d1495b" fg="#fff" size={52} /></Pop>
  </Cam>
);
// 5 — Dente branquíssimo e os pés firmes no chão.
const C05 = ({ t, t0, t1 }: P) => {
  const d = W(5, 'branquissimo');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.5} z1={1.6} cy={880}>
      <PrefeituraDia t={t} />
      <Ator k={OTAVIO} t={t} x={540} y={CHAO_RUA} movs={[['parado', t0]]} over={{ boca: 'riso', olhoFeliz: t > d, cabRot: -5 }} seed={4} />
      <Brilho t={t} at={d} x={560} y={760} n={10} r={60} />
      <Pop t={t} at={d} x={700} y={700}><div style={{ fontSize: 90 }}>✨</div></Pop>
    </Cam>
  );
};
// 6 — Dona Rita, a feirante.
const C06 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.12} cy={1000}>
    <FeiraDia t={t} />
    <Ator k={RITA} t={t} x={540} y={CHAO_RUA} movs={[['entrar', t0], ['acenar', t0 + 0.7]]} seed={5} />
    <Pop t={t} at={W(6, 'rita')} x={540} y={470}><Placa texto="DONA RITA" bg="#2fa36b" fg="#fff" size={52} /></Pop>
  </Cam>
);
// Debate: mediador ao centro, Otávio e Rita nos púlpitos.
const Debate = ({ t, otMov, ritaMov, medMov, h = altura(t), rir = false, z = [1, 1.06] as [number, number], cx = 540, cy = 1000, t0, t1, extra, otOver, lampada = true }: { t: number; otMov: Mov[]; ritaMov: Mov[]; medMov: Mov[]; h?: number; rir?: boolean; z?: [number, number]; cx?: number; cy?: number; t0: number; t1: number; extra?: ReactNode; otOver?: object; lampada?: boolean }) => (
  <Cam t={t} t0={t0} t1={t1} z0={z[0]} z1={z[1]} cx={cx} cy={cy}>
    <Quadra t={t} rir={rir} lampada={lampada} />
    <Ator k={MEDIADOR} t={t} x={540} y={CHAO_Q - 40} h={560} movs={medMov} seed={3} />
    <div style={{ transform: `translateY(${-h + (h > 5 ? boia(t) : 0)}px)` }}><Ator k={OTAVIO} t={t} x={230} y={CHAO_Q} movs={otMov} over={otOver} seed={4} /></div>
    <Ator k={RITA} t={t} x={850} y={CHAO_Q} movs={ritaMov} seed={5} flip />
    <Pulpito x={230} nome="OTÁVIO" cor="#d1495b" />
    <Pulpito x={850} nome="RITA" cor="#2fa36b" />
    <Regua x={60} y={CHAO_Q - 270} h={h} />
    <Poeira t={t} x={230} y={CHAO_Q - 270} />
    {extra}
  </Cam>
);
// 7 — O debate foi na quadra, ao vivo.
const C07 = ({ t, t0, t1 }: P) => (
  <Debate t={t} t0={t0} t1={t1} otMov={[['acenar', t0]]} ritaMov={[['parado', t0]]} medMov={[['falar', t0]]} extra={<Pop t={t} at={W(7, 'debate')} x={880} y={520}><Placa texto="● AO VIVO" bg="#d1495b" fg="#fff" size={40} /></Pop>} />
);
// 8 — Pergunta da piscina.
const C08 = ({ t, t0, t1 }: P) => (
  <Debate t={t} t0={t0} t1={t1} z={[1.3, 1.4]} cx={380} cy={1050} otMov={[['parado', t0], ['nervoso', W(8, 'piscina')]]} ritaMov={[['parado', t0]]} medMov={[['falar', t0], ['apontar', W(8, 'piscina') - 0.3]]} extra={<Icone t={t} at={W(8, 'piscina')} x={360} y={540} c="🏊" />} />
);
// 9 — "Nunca."
const C09 = ({ t, t0, t1 }: P) => (
  <Debate t={t} t0={t0} t1={t1} z={[1.6, 1.7]} cx={230} cy={1000} otMov={[['nao', t0]]} ritaMov={[['parado', t0]]} medMov={[['parado', t0]]} otOver={{ boca: 'sorriso' }} extra={<Pop t={t} at={W(9, 'nunca')} x={420} y={640}><Balao texto="Nunca." /></Pop>} />
);
// 10 — Ploc. Subiu um palmo.
const C10 = ({ t, t0, t1 }: P) => (
  <Debate t={t} t0={t0} t1={t1} z={[1.3, 1.35]} cx={300} cy={1000} otMov={[['parado', t0], ['susto', W(10, 'ploc'), 1]]} ritaMov={[['parado', t0]]} medMov={[['parado', t0]]} extra={<Pop t={t} at={W(10, 'ploc')} x={480} y={560}><Balao texto="PLOC!" cor="#ffd166" /></Pop>} />
);
// 11 — Lê os projetos?
const C11 = ({ t, t0, t1 }: P) => (
  <Debate t={t} t0={t0} t1={t1} z={[1.1, 1.15]} otMov={[['nervoso', t0]]} ritaMov={[['parado', t0]]} medMov={[['falar', t0]]} extra={<Icone t={t} at={W(11, 'assina')} x={540} y={560} c="📄" />} />
);
// 12 — "Todos." Mais um palmo.
const C12 = ({ t, t0, t1 }: P) => (
  <Debate t={t} t0={t0} t1={t1} z={[1.3, 1.35]} cx={300} cy={950} otMov={[['sim', t0], ['susto', W(12, 'mais'), 1]]} ritaMov={[['parado', t0]]} medMov={[['parado', t0]]} extra={<><Pop t={t} at={W(12, 'todos')} x={460} y={560}><Balao texto="Todos." /></Pop><Pop t={t} at={W(12, 'mais')} x={160} y={420}><Balao texto="PLOC!" cor="#ffd166" /></Pop></>} />
);
// 13 — Gosta de criança?
const C13 = ({ t, t0, t1 }: P) => (
  <Debate t={t} t0={t0} t1={t1} z={[1.1, 1.15]} otMov={[['nervoso', t0]]} ritaMov={[['parado', t0]]} medMov={[['falar', t0]]} extra={<Icone t={t} at={W(13, 'crianca')} x={540} y={560} c="🧒" />} />
);
// 14 — "Amo." Mais um palmo.
const C14 = ({ t, t0, t1 }: P) => (
  <Debate t={t} t0={t0} t1={t1} z={[1.3, 1.35]} cx={300} cy={900} otMov={[['acenar', t0], ['susto', W(14, 'mais'), 1]]} ritaMov={[['ombros', t0 + 0.3]]} medMov={[['parado', t0]]} extra={<><Pop t={t} at={W(14, 'amo')} x={460} y={520}><Balao texto="Amo! ❤" /></Pop><Pop t={t} at={W(14, 'mais')} x={160} y={340}><Balao texto="PLOC!" cor="#ffd166" /></Pop></>} />
);
// 15 — Tinha acabado de pisar no pé de uma criança (flashback na entrada da quadra).
const C15 = ({ t, t0, t1 }: P) => {
  const p = W(15, 'pisar');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.15} z1={1.25} cy={1050}>
      <RuaDia t={t} carro={false} />
      <Ator k={OTAVIO} t={t} x={430} y={CHAO_RUA} movs={[['andar', t0]]} over={{ x: 0, boca: 'riso', pupila: [0, -1] }} seed={4} />
      <Ator k={MENINO} t={t} x={650} y={CHAO_RUA} h={540} movs={[['parado', t0], ['chorar', p]]} seed={6} flip />
      <Pop t={t} at={p} x={620} y={760}><Balao texto="AI!" cor="#ffd166" /></Pop>
      <div style={{ position: 'absolute', left: 300, top: 230, fontFamily: '"Arial Black"', fontSize: 44, color: '#fff', background: '#2a2230', padding: '8px 22px', borderRadius: 12 }}>MINUTOS ANTES...</div>
    </Cam>
  );
};
// 16 — Chegou a vez da Dona Rita.
const C16 = ({ t, t0, t1 }: P) => (
  <Debate t={t} t0={t0} t1={t1} z={[1.3, 1.4]} cx={800} cy={1050} otMov={[['bravo', t0]]} ritaMov={[['parado', t0], ['sim', t0 + 0.3]]} medMov={[['apontar', t0]]} />
);
// 17 — Experiência em política?
const C17 = ({ t, t0, t1 }: P) => (
  <Debate t={t} t0={t0} t1={t1} z={[1.15, 1.2]} cx={700} otMov={[['parado', t0]]} ritaMov={[['pensar', t0 + 0.3]]} medMov={[['falar', t0]]} />
);
// 18 — "Nenhuma. Mas eu divido uma melancia em vinte pedaços..."
const C18 = ({ t, t0, t1 }: P) => {
  const m = W(18, 'melancia');
  const k = clamp((t - m - 0.4) / 0.8);
  return (
    <Debate t={t} t0={t0} t1={t1} z={[1.5, 1.6]} cx={850} cy={950} otMov={[['parado', t0]]} ritaMov={[['falar', t0]]} medMov={[['parado', t0]]}
      extra={<><Pop t={t} at={W(18, 'nenhuma')} x={620} y={520}><Balao texto="Nenhuma." /></Pop>
        <Pop t={t} at={m} x={600} y={800}>
          <svg width={300} height={180} viewBox="0 0 300 180">
            {Array.from({ length: 6 }, (_, i) => {
              const a0 = Math.PI + (i / 6) * Math.PI, a1 = Math.PI + ((i + 1) / 6) * Math.PI, am = (a0 + a1) / 2, off = k * 18;
              const cx = 150 + Math.cos(am) * off, cy = 160 + Math.sin(am) * off;
              return <path key={i} d={`M${cx} ${cy} L${cx + Math.cos(a0) * 130} ${cy + Math.sin(a0) * 130} A130 130 0 0 1 ${cx + Math.cos(a1) * 130} ${cy + Math.sin(a1) * 130} z`} fill="#e5484d" stroke="#2e8b3e" strokeWidth={10} />;
            })}
          </svg>
        </Pop>
        <Pop t={t} at={W(18, 'vinte')} x={900} y={650}><Placa texto="20 PEDAÇOS" bg="#ffd166" size={40} /></Pop></>} />
  );
};
// 19 — A plateia gargalhou. E ela continuou no chão.
const C19 = ({ t, t0, t1 }: P) => (
  <Debate t={t} t0={t0} t1={t1} rir={t > W(19, 'gargalhou') - 0.1} z={[1, 1.05]} otMov={[['bravo', t0]]} ritaMov={[['parado', t0], ['comemorar', W(19, 'chao')]]} medMov={[['gargalhar', W(19, 'gargalhou')]]}
    extra={<Pop t={t} at={W(19, 'chao')} x={850} y={1560}><Placa texto="NO CHÃO ✓" bg="#7be07b" size={40} /></Pop>} />
);
// 20 — Desesperado, agarrou o microfone.
const C20 = ({ t, t0, t1 }: P) => (
  <Debate t={t} t0={t0} t1={t1} z={[1.4, 1.5]} cx={250} cy={950} otMov={[['nervoso', t0], ['apontar', W(20, 'microfone') - 0.1]]} otOver={t > W(20, 'microfone') - 0.1 ? { boca: 'aberta', fala: 0.8 } : undefined} ritaMov={[['parado', t0]]} medMov={[['susto', W(20, 'microfone')]]} />
);
// 21 — Cem escolas, mil hospitais e uma ponte até a lua!
const C21 = ({ t, t0, t1 }: P) => (
  <Debate t={t} t0={t0} t1={t1} z={[1.2, 1.3]} cx={300} cy={950} otMov={[['comemorar', t0]]} otOver={{ boca: 'riso', fala: 0.6 }} ritaMov={[['ombros', t0 + 0.5]]} medMov={[['parado', t0]]}
    extra={<><Icone t={t} at={W(21, 'escolas')} x={420} y={520} c="🏫" /><Icone t={t} at={W(21, 'hospitais')} x={620} y={460} c="🏥" /><Icone t={t} at={W(21, 'lua')} x={820} y={400} c="🌕" /></>} />
);
// 22 — Disparou pra cima e ficou preso no ventilador, girando.
const C22 = ({ t, t0, t1 }: P) => {
  const d = W(22, 'disparou');
  const v = W(22, 'ventilador');
  const voo = clamp((t - d) / (v - d));
  const preso = t >= v;
  const gira = preso ? (t - v) * 220 : 0;
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1} cy={900}>
      <Quadra t={t} lampada={t < d + 0.25} />
      <Ator k={MEDIADOR} t={t} x={540} y={CHAO_Q - 40} h={560} movs={[['susto', d]]} seed={3} />
      <Ator k={RITA} t={t} x={850} y={CHAO_Q} movs={[['parado', t0]]} over={{ pupila: [-0.6, -1], boca: 'o' }} seed={5} flip />
      <Pulpito x={850} nome="RITA" cor="#2fa36b" />
      {!preso && t > d && (
        <Svg>{[-60, -20, 20, 60].map((dx, i) => <path key={i} d={`M${230 + voo * 550 + dx} ${CHAO_Q - 200 - altura(t) - voo * 1150 + 120 + i * 30} v${180 + i * 30}`} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.8} />)}</Svg>
      )}
      {!preso ? (
        <div style={{ transform: `translate(${voo * 550}px, ${-altura(t) - voo * 1150}px)` }}><Ator k={OTAVIO} t={t} x={230} y={CHAO_Q} movs={[['susto', d]]} seed={4} /></div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, transform: `rotate(${gira}deg)`, transformOrigin: '780px 330px' }}>
          <Ator k={OTAVIO} t={t} x={780} y={560} h={520} movs={[['nervoso', v]]} over={{ maoE: [-60, -420], maoD: [60, -420], boca: 'o' }} seed={4} />
        </div>
      )}
      <Pulpito x={230} nome="OTÁVIO" cor="#d1495b" />
      <Pop t={t} at={d + 0.2} x={300} y={300}><Balao texto="POW!" cor="#ffd166" /></Pop>
    </Cam>
  );
};
// 23 — "O senhor está bem?"
const C23 = ({ t, t0, t1 }: P) => {
  const g = (t - W(22, 'ventilador')) * 220;
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.05} cy={1000}>
      <Quadra t={t} lampada={false} />
      <div style={{ position: 'absolute', inset: 0, transform: `rotate(${g}deg)`, transformOrigin: '780px 330px' }}>
        <Ator k={OTAVIO} t={t} x={780} y={560} h={520} movs={[['nervoso', t0]]} over={{ maoE: [-60, -420], maoD: [60, -420] }} seed={4} />
      </div>
      <Ator k={MEDIADOR} t={t} x={540} y={CHAO_Q - 40} h={600} movs={[['falar', t0]]} over={{ pupila: [0.6, -1], cabRot: 8 }} seed={3} />
      <Pop t={t} at={W(23, 'bem')} x={420} y={1000}><Balao texto="Está bem?" /></Pop>
    </Cam>
  );
};
// 24 — "Ótimo!", e subiu mais um pouco (arrancando o ventilador do teto).
const C24 = ({ t, t0, t1 }: P) => {
  const s = W(24, 'subiu');
  const up = subir(t, s, 260);
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.2} z1={1.3} cx={780} cy={500}>
      <Quadra t={t} lampada={false} ventilador={0.5} />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-up}px)` }}>
        <Ator k={OTAVIO} t={t} x={780} y={560} h={520} movs={[['acenar', t0]]} over={{ boca: 'riso', maoE: [-60, -420] }} seed={4} />
      </div>
      <Pop t={t} at={W(24, 'otimo')} x={460} y={520}><Balao texto="ÓTIMO!" cor="#ffd166" /></Pop>
      <Pop t={t} at={s} x={780} y={120}><Balao texto="CRAC!" /></Pop>
    </Cam>
  );
};
// 25 — Dona Rita ganhou.
const C25 = ({ t, t0, t1 }: P) => {
  const g = W(25, 'ganhou');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.05} z1={1.12} cy={950}>
      <PrefeituraDia t={t} />
      <Ator k={RITA} t={t} x={540} y={CHAO_RUA} movs={[['parado', t0], ['comemorar', g]]} seed={5} />
      <Ator k={MENINA} t={t} x={260} y={CHAO_RUA} h={540} movs={[['comemorar', g + 0.2]]} seed={1} />
      <Ator k={VIZINHO} t={t} x={830} y={CHAO_RUA} movs={[['acenar', g + 0.1]]} seed={2} flip />
      <Pop t={t} at={g} x={540} y={430}><Placa texto="DONA RITA, PREFEITA!" bg="#2fa36b" fg="#fff" size={50} /></Pop>
      <Svg>{t > g && Array.from({ length: 40 }, (_, i) => { const k = ((t - g) * 0.5 + i * 0.07) % 1; return <rect key={i} x={(i * 97) % 1080} y={k * 1500} width={16} height={26} fill={['#d1495b', '#ffd166', '#3d8bfd', '#2fa36b'][i % 4]} transform={`rotate(${(t * 200 + i * 40) % 360} ${(i * 97) % 1080} ${k * 1500})`} />; })}</Svg>
    </Cam>
  );
};
// Seu Otávio amarrado no poste como um balão.
const Balaozinho = ({ t, t0, alt = 0, extra, movs, over }: { t: number; t0: number; alt?: number; extra?: ReactNode; movs: Mov[]; over?: object }) => {
  const bx = 640 + 30 * Math.sin(t * 1.3), by = 760 - alt + 20 * Math.sin(t * 1.7);
  return (
    <>
      <PrefeituraDia t={t} />
      <Svg>
        <rect x={232} y={760} width={18} height={570} fill="#3a3f4a" stroke={L} strokeWidth={4} />
        <path d={`M241 760 q20 -30 60 -10`} stroke="#3a3f4a" strokeWidth={10} fill="none" />
        <path d={`M245 900 Q${(245 + bx) / 2} ${(900 + by) / 2 + 120} ${bx} ${by - 160}`} stroke="#8a5a32" strokeWidth={6} fill="none" />
      </Svg>
      <Ator k={OTAVIO} t={t} x={bx} y={by} h={560} movs={movs} over={{ peE: [-20, -10], peD: [20, -10], ...over }} seed={4} />
      {t > W(26, 'balao') + 0.4 && <Passarinho t={t} x={bx + 8} y={by - 400 + 10 * Math.sin(t * 1.7)} s={1.1} />}
      {extra}
    </>
  );
};
// 26 — Amarrado num poste, igual a um balão.
const C26 = ({ t, t0, t1 }: P) => (
  <Cam t={t} t0={t0} t1={t1} z0={1} z1={1.08} cy={1000}>
    <Balaozinho t={t} t0={t0} movs={[['nervoso', t0]]} extra={<>
      <Ator k={MENINO} t={t} x={420} y={CHAO_RUA} h={540} movs={[['gargalhar', t0 + 0.4]]} seed={6} />
      <Ator k={MENINA} t={t} x={860} y={CHAO_RUA} h={540} movs={[['apontar', t0 + 0.2]]} seed={1} flip />
      <Pop t={t} at={W(26, 'balao')} x={640} y={300}><div style={{ fontSize: 120 }}>🎈</div></Pop></>} />
  </Cam>
);
// 27 — Aceitou a derrota? Ele diz que sim.
const C27 = ({ t, t0, t1 }: P) => {
  const s = W(27, 'sim');
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1.15} cy={1000}>
      <Balaozinho t={t} t0={t0} movs={[['parado', t0], ['sim', s]]} over={{ boca: t >= s ? 'riso' : 'neutra' }} extra={<>
        <Ator k={MENINA} t={t} x={860} y={CHAO_RUA} h={540} movs={[['falar', t0]]} over={{ pupila: [-0.6, -1] }} seed={1} flip />
        <Pop t={t} at={W(27, 'derrota')} x={760} y={1000}><Balao texto="Aceitou?" /></Pop>
        <Pop t={t} at={s} x={420} y={460}><Balao texto="Sim!" cor="#ffd166" /></Pop></>} />
    </Cam>
  );
};
// 28 — E sobe mais um pouco.
const C28 = ({ t, t0, t1 }: P) => {
  const up = subir(t, W(28, 'pouco') - 0.3, 220);
  return (
    <Cam t={t} t0={t0} t1={t1} z0={1.1} z1={1} cy={900}>
      <Balaozinho t={t} t0={t0} alt={up} movs={[['susto', W(28, 'pouco') - 0.3]]} extra={<Pop t={t} at={W(28, 'pouco')} x={820} y={360}><Balao texto="PLOC!" cor="#ffd166" /></Pop>} />
    </Cam>
  );
};

const CENAS: ((p: P) => JSX.Element)[] = [C00, C01, C02, C03, C04, C05, C06, C07, C08, C09, C10, C11, C12, C13, C14, C15, C16, C17, C18, C19, C20, C21, C22, C23, C24, C25, C26, C27, C28];

const Legenda = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = WORDS.findIndex((w, i) => t >= w.t0 - 0.05 && (i === WORDS.length - 1 || t < WORDS[i + 1].t0 - 0.05));
  if (idx < 0 || t > WORDS[WORDS.length - 1].t1 + 0.6) return null;
  const cur = WORDS[idx];
  const start = Math.floor(cur.i / 3) * 3;
  const chunk = WORDS.filter((w) => w.line === cur.line).slice(start, start + 3);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1560 }}>
      <div style={{ textAlign: 'center', maxWidth: 980, fontFamily: '"Arial Black", Arial, sans-serif', fontSize: 82, lineHeight: 1.1 }}>
        {chunk.map((w) => (
          <span key={w.i} style={{ color: w.stressed ? '#ffd23a' : '#fff', WebkitTextStroke: '16px #2a2230', paintOrder: 'stroke fill', margin: '0 18px', display: 'inline-block', transform: w === cur ? 'scale(1.1)' : 'none' }}>{w.text}</span>
        ))}
      </div>
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
export const Flutua = () => {
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
      <Granulado />
      <Legenda />
      {COM_VOZ && <Audio src={staticFile('voz-flutua.mp3')} />}
    </AbsoluteFill>
  );
};
export const DURACAO_FLUTUA = END;
