// "Quatro Minutos": roteiro de assalto (~1min55). *palavra* = destaque na legenda.
// Sem narração por enquanto: com public/voz-quatro.mp3 e PALAVRAS_QUATRO preenchido, tudo sincroniza com a fala.
import type { Palavra } from './timeline-base.ts';
import { criarTimeline } from './timeline-base.ts';

export const PALAVRAS_QUATRO: Palavra[] = [];
const LINES = [
  '*Dez* anos. Foi o tempo que o Relojoeiro levou para planejar *quatro* minutos.',
  'Quatro minutos: exatamente o tempo que os *sinos* da torre tocam ao *meio-dia.*',
  'Ele juntou *cinco* pessoas que não tinham mais nada a *perder.*',
  'Cada um ganhou um nome de *pássaro.* O meu era *Andorinha.*',
  'A *Coruja* abria qualquer fechadura. O *Tucano* dirigia qualquer coisa com rodas.',
  'O *Pardal* sabia apagar câmeras. E a *Gaivota* não tinha medo de nada.',
  'O alvo: o cofre da *Casa* do *Ouro,* o banco mais seguro do país.',
  'Regra número um: ninguém se *machuca.* Regra número dois: ninguém se *apaixona.*',
  'No dia marcado, entramos vestidos de equipe de *limpeza.*',
  'Onze e cinquenta e seis. O Pardal *apagou* as câmeras.',
  '*Meio-dia.* O primeiro sino tocou, e a *broca* começou a girar.',
  'Cada *badalada* escondia o barulho do *metal.*',
  'Mas, no terceiro minuto, um *alarme* silencioso disparou.',
  'Lá fora, a Inspetora *Vera* cercou o banco com *vinte* viaturas.',
  'O telefone tocou. Era ela: "Vocês não têm *saída."*',
  'O Relojoeiro respondeu no rádio: "*Calma.* Isso também estava no *plano."*',
  'A porta do cofre se *abriu* no último toque do sino.',
  'E lá dentro... não tinha *nada.* Nem uma barra de *ouro.*',
  'O *dono* do banco já tinha levado tudo, anos atrás, e escondido o *rombo.*',
  'Só sobrou um livro de capa *vermelha:* a *prova* de tudo.',
  'Foi aí que eu entendi. A gente não veio roubar o ouro. Veio roubar a *verdade.*',
  'Às duas da tarde, o livro estava em todos os *jornais.*',
  'O dono do banco saiu *algemado.* E a gente saiu pelo *esgoto,* sem um centavo.',
  'E o Relojoeiro? Saiu pela porta da frente, vestindo farda de *policial.*',
  'A Inspetora Vera abriu caminho para ele e *piscou.*',
  'O plano nunca teve *cinco* pessoas. Sempre teve *seis.*',
];
const n = LINES.join(' ').split(/\s+/).length;
export const TL_QUATRO = criarTimeline(LINES, PALAVRAS_QUATRO, Math.min(120, Math.round(n / 2.45) + 4), { vinte: '20' });
