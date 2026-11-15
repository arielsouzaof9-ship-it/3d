// "Depois do Silêncio — Episódio 3: Pegadas de Lama" (~2min15). *palavra* = destaque na legenda.
// Só efeitos sonoros por enquanto (tempos estimados); com public/voz-silencio3.mp3 + PALAVRAS_SILENCIO3, tudo segue a fala.
import type { Palavra } from './timeline-base.ts';
import { criarTimeline } from './timeline-base.ts';

export const PALAVRAS_SILENCIO3: Palavra[] = [];
const LINES = [
  'Naquela noite, na *pedreira,* ninguém *dormiu.*',
  'O Tomás dormiu no meu *colo,* segurando a minha camisa, com medo de eu *sumir* de novo.',
  'A Marina me contou que o *Leandro* tirou os dois da *cidade* no primeiro dia.',
  '"Ele disse que foi ao *hospital.* Que viu você... e que não tinha mais nada a *fazer."*',
  'Ao amanhecer, eu liguei o *rádio* e chamei o Seu Aurélio, como eu tinha prometido. Só *chiado.*',
  'Foi aí que um homem com um *arco* nas costas entrou no acampamento. Era o *Tião.* Irmão do Rui.',
  '"Cadê o meu *irmão?"* Ninguém respondeu. E ele entendeu *sozinho.*',
  'Eu disse que ia *voltar* para buscar o Rui. O Tião foi junto. O *Jonas* também.',
  'O Leandro me segurou pelo *braço:* "Você acabou de voltar. Não faz isso com eles de *novo."*',
  'Mas eu tinha deixado um homem *algemado* num telhado. Eu precisava *voltar.*',
  'A gente entrou na cidade pelo *bueiro.* E subiu a escada do mercado em *silêncio.*',
  'Lá em cima, a porta do telhado estava *aberta.*',
  "A *algema* estava pendurada no cano da caixa d'água. Aberta. Com a *chave* ainda no buraco.",
  'Ele tinha conseguido pegar a *chave.*',
  'No chão, *pegadas* de lama iam até a escada de *incêndio.*',
  'E, na caixa d\'água, escrito com *carvão:* "Vocês me deixaram. Eu vou *atrás."*',
  'O Tião passou a mão nas *letras* e sorriu: "Esse é o meu *irmão."*',
  'Quando a gente voltou para a rua, o caminhão de mudança tinha *sumido.*',
  'Só ficaram as marcas dos *pneus* na lama. Indo na direção da *pedreira.*',
  'A gente voltou a *pé,* a noite inteira, pelo *mato.*',
  'No acampamento, todo mundo estava acordado em volta da *fogueira.* Um lento tinha aparecido na beira do *lago.*',
  'O Leandro tinha *resolvido.* Sozinho. Sem fazer *barulho.*',
  'Mais tarde, eu fui buscar o *rádio* na *barraca* dele.',
  'Ele estava de *costas,* falando *baixinho* no aparelho.',
  '"Ele *voltou.* Não, ninguém sabe. Ninguém sabe que fui eu na *blitz."*',
  'Eu fiquei *parado* na porta da barraca. Sem *respirar.*',
  'E, do outro lado do rádio, uma voz respondeu: "Então *resolve* isso, Leandro. Antes que ele *lembre."*',
];
const n = LINES.join(' ').split(/\s+/).length;
const base = criarTimeline(LINES, PALAVRAS_SILENCIO3, Math.min(160, Math.round(n / 2.55) + 3), {});
export const TL_SILENCIO3 = base.COM_VOZ ? { ...base, END: base.WORDS[base.WORDS.length - 1].t1 + 2.5 } : base;
