// "Os Espelhos do Casarão": terror de casa assombrada (~1min55). *palavra* = destaque na legenda.
// Sem narração por enquanto (tempos estimados); com public/voz-espelhos.mp3 + PALAVRAS_ESPELHOS preenchido, tudo segue a fala.
import type { Palavra } from './timeline-base.ts';
import { criarTimeline } from './timeline-base.ts';

export const PALAVRAS_ESPELHOS: Palavra[] = [];
const LINES = [
  'Em mil novecentos e oitenta e *dois,* a gente se mudou para um *casarão* antigo em Ouro Preto.',
  'Todos os *espelhos* estavam cobertos com *lençóis.*',
  'O pai *riu* e tirou *todos.*',
  'Na manhã seguinte, o espelho do corredor amanheceu *embaçado,* escrito por dentro: *saiam.*',
  'A minha irmã caçula, a *Clarinha,* começou a conversar com a *moça* do espelho.',
  'Toda madrugada, às *três* e trinta e três, as *portas* do casarão se abriam sozinhas.',
  'E a casa inteira cheirava a *rosas* murchas.',
  'A mãe começou a se olhar no espelho por *horas.* Sem *piscar.*',
  'Foi aí que a gente chamou o casal *Vilela.*',
  'O Artur descobriu: em mil oitocentos e *noventa,* uma noiva chamada *Leonor* foi abandonada no *altar.*',
  'Ela voltou para o casarão, ainda de vestido, e jurou: nenhuma família vai ser *feliz* aqui.',
  'A Rosa entrou no quarto da mãe e parou na porta. Ela disse: "Ela não está mais *sozinha* aí dentro."',
  'Às três e trinta e três, a mãe desceu a escada de *vestido* de *noiva.*',
  'Ela segurava a Clarinha pela *mão* e caminhava para o *espelho* grande da sala.',
  'No *reflexo,* quem segurava a mão da minha irmã não era a *mãe.*',
  'O pai *gritou* o nome dela. Ela nem *olhou.*',
  'Então eu levantei a nossa *foto* de família na frente do rosto dela.',
  'A Rosa disse: "Helena, essa é a sua *família.* Olha para eles, não para o *espelho."*',
  'A mãe olhou para a foto. E *chorou.*',
  'O espelho grande da sala *rachou* de cima a baixo.',
  'O cheiro de rosas *sumiu,* e as portas se *fecharam* sozinhas.',
  'Hoje, a Clarinha é *adulta* e não lembra de *nada.*',
  'Mas, toda noite, antes de dormir, ela *cobre* todos os espelhos com *lençóis.*',
  'E, quando alguém pergunta por quê, ela só responde: "Para a moça não *voltar."*',
];
const n = LINES.join(' ').split(/\s+/).length;
const base = criarTimeline(LINES, PALAVRAS_ESPELHOS, Math.min(120, Math.round(n / 2.45) + 4), { dois: '82', noventa: '1890' });
export const TL_ESPELHOS = base.COM_VOZ ? { ...base, END: base.WORDS[base.WORDS.length - 1].t1 + 1.5 } : base;
