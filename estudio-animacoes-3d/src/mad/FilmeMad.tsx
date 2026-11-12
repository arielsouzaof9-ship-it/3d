// Montagem genérica dos vídeos mad: uma cena por frase (com dissolve), granulado, legenda, narração e efeitos.
import { JSX } from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Granulado } from './Granulado';
import type { Timeline } from './timeline-base';

export type P = { t: number; t0: number; t1: number };
export type Cena = (p: P) => JSX.Element;
export type Sfx = [string, number, number, number?, boolean?]; // arquivo (em public/), início, volume, duração máx., repetir em loop.
const FADE = 6;

const Legenda = ({ tl, topo = 1560 }: { tl: Timeline; topo?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const W = tl.WORDS;
  const idx = W.findIndex((w, i) => t >= w.t0 - 0.05 && (i === W.length - 1 || t < W[i + 1].t0 - 0.05));
  if (idx < 0 || t > W[W.length - 1].t1 + 0.6) return null;
  const cur = W[idx];
  const start = Math.floor(cur.i / 3) * 3;
  const chunk = W.filter((w) => w.line === cur.line).slice(start, start + 3);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: topo }}>
      <div style={{ textAlign: 'center', maxWidth: 980, fontFamily: '"Arial Black", Arial, sans-serif', fontSize: 80, lineHeight: 1.1 }}>
        {chunk.map((w) => (
          <span key={w.i} style={{ color: w.stressed ? '#ffd23a' : '#fff', WebkitTextStroke: '16px #1a1520', paintOrder: 'stroke fill', margin: '0 18px', display: 'inline-block', transform: w === cur ? 'scale(1.1)' : 'none' }}>{w.text}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
const CenaSeq = ({ C, t0, t1, fade }: { C: Cena; t0: number; t1: number; fade: boolean }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity: fade ? Math.min(1, frame / FADE) : 1, overflow: 'hidden' }}>
      <C t={t0 + frame / fps} t0={t0} t1={t1} />
    </AbsoluteFill>
  );
};
export const FilmeMad = ({ tl, cenas, voz, sfx = [], ganhoSfx = 0.6, granulado = 0.1 }: { tl: Timeline; cenas: Cena[]; voz?: string; sfx?: Sfx[]; ganhoSfx?: number; granulado?: number }) => {
  const { fps } = useVideoConfig();
  const inicio = tl.LINES.map((_, i) => (i === 0 ? 0 : tl.W(i, 0)));
  const g = tl.COM_VOZ ? ganhoSfx : ganhoSfx * 2;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {cenas.map((C, i) => {
        const t0 = inicio[i];
        const t1 = i + 1 < cenas.length ? inicio[i + 1] : tl.END;
        const from = Math.round(t0 * fps);
        const dur = Math.round(t1 * fps) - from + (i + 1 < cenas.length ? FADE : 0);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`cena ${i}`}>
            <CenaSeq C={C} t0={from / fps} t1={t1} fade={i > 0} />
          </Sequence>
        );
      })}
      <Granulado forca={granulado} />
      <Legenda tl={tl} />
      {tl.COM_VOZ && voz && <Audio src={staticFile(voz)} />}
      {sfx.map(([f, at, vol, max, loop], i) => {
        const from = Math.max(0, Math.round(at * fps));
        const dur = Math.max(1, Math.round((max ?? 8) * fps));
        const fade = Math.round(0.4 * fps);
        return (
          <Sequence key={`s${i}`} from={from} durationInFrames={dur} layout="none" name={`sfx ${f}`}>
            <Audio src={staticFile(f)} loop={loop} volume={(fr) => g * vol * Math.min(1, (fr + 1) / 6, max ? (dur - fr) / fade : 1)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
