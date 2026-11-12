// "O Garoto Lagartixa": origem de super-herói (~1min55). *palavra* = destaque na legenda.
// Sem narração por enquanto (tempos estimados); com public/voz-lagartixa.mp3 + PALAVRAS_LAGARTIXA preenchido, tudo segue a fala.
import type { Palavra } from './timeline-base.ts';
import { criarTimeline } from './timeline-base.ts';

export const PALAVRAS_LAGARTIXA: Palavra[] = [];
const LINES = [
  'Meu nome é *Téo.* Tenho dezesseis anos, uso óculos fundo de garrafa e ninguém na escola sabe que eu existo.',
  'Bom... ninguém *sabia.*',
  'Na excursão para o laboratório da universidade, uma *lagartixa* fugiu de um tubo escrito: *experimental.*',
  'E me *mordeu* a mão.',
  'Na manhã seguinte, eu acordei *grudado* no *teto* do meu quarto.',
  'Meus *óculos* não serviam mais. Eu via cada *mosca* na parede.',
  'Eu subia em *prédios.* E sentia o *perigo* antes de ele acontecer.',
  'A primeira coisa que eu fiz com isso? Ganhar *dinheiro.*',
  'Entrei num torneio de *luta-livre* de mascarado: quem aguentasse três minutos no ringue, levava *mil* reais.',
  'Eu aguentei *trinta* segundos. O outro lutador é que não *aguentou.*',
  'Mas o Seu Arnaldo, o dono do ginásio, só me pagou *cem.* "Reclama com o *bispo,* moleque."',
  'Quando eu saí, um ladrão de *capacete* *vermelho* passou correndo com o caixa do Seu Arnaldo.',
  'Eu podia ter parado ele com uma mão. Mas eu abri a porta. E deixei ele *passar.*',
  '"Não é *problema* meu."',
  'Meia hora depois, cheguei na feira. A barraca da Vó Lurdes estava no *chão.*',
  'Um motoqueiro de capacete *vermelho* tinha passado em cima dela, fugindo da polícia.',
  'A minha avó estava na calçada, com o braço *machucado.*',
  'Era o *mesmo* *ladrão.* Aquele que eu deixei passar.',
  'Naquela noite, no *hospital,* a Vó Lurdes segurou a minha mão e disse:',
  '"Quem pode *ajudar* e não ajuda, também *escolhe,* meu filho."',
  'Eu costurei uma *máscara* *verde* com a máquina dela.',
  'Subi no prédio mais *alto* do bairro. E *esperei.*',
  'Quando o capacete vermelho apareceu de novo, eu estava *esperando.*',
  'Hoje, na escola, eu ainda sou o Téo *invisível.*',
  'Mas, lá em cima, a cidade inteira tem um *nome* *novo* para mim.',
  'E, quando alguém grita por *socorro...* eu escuto *primeiro.*',
];
const n = LINES.join(' ').split(/\s+/).length;
const base = criarTimeline(LINES, PALAVRAS_LAGARTIXA, Math.min(120, Math.round(n / 2.5) + 4), { dezesseis: '16', tres: '3', mil: '1000', cem: '100', trinta: '30' });
export const TL_LAGARTIXA = base.COM_VOZ ? { ...base, END: base.WORDS[base.WORDS.length - 1].t1 + 1.5 } : base;
