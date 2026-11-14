// "Depois do Silêncio": sobrevivência/terror original (~2min20). *palavra* = destaque na legenda.
// Sem narração: tempos estimados; com public/voz-silencio.mp3 + PALAVRAS_SILENCIO preenchido, tudo segue a fala.
import type { Palavra } from './timeline-base.ts';
import { criarTimeline } from './timeline-base.ts';

export const PALAVRAS_SILENCIO: Palavra[] = [];
const LINES = [
  'Eu levei um *tiro* numa blitz, numa sexta-feira de *manhã.*',
  'Quando eu acordei no *hospital,* o mundo tinha *acabado.* E ninguém veio me avisar.',
  'As *flores* do meu quarto estavam secas. O *relógio* da parede, parado.',
  'O *corredor* estava vazio. Só papéis no chão e uma luz *piscando.*',
  'Na porta do refeitório, alguém tinha *pichado:* "Não abra. Os *mortos* estão aqui dentro."',
  'Por baixo da porta, *dedos* tentavam passar. E alguma coisa *batia* do outro lado.',
  'Lá fora, a cidade estava *parada.* Carros abandonados, um *ônibus* atravessado na avenida.',
  'Eu corri para *casa.* A porta estava aberta. A casa, *vazia.*',
  'Mas os *álbuns* de foto tinham sumido. A Marina levou as fotos. Ela e o Tomás estavam *vivos.*',
  'Foi aí que eu levei uma *pancada* na cabeça. Um menino, com uma *pá.*',
  'O nome dele era *Kauã.* O pai, Seu *Aurélio,* meu vizinho.',
  'Naquela *noite,* eles me explicaram tudo, falando *baixinho.*',
  'Os mortos andam *devagar.* Mas não param *nunca.* E seguem qualquer *barulho.*',
  'Quem é *mordido* fica com febre, dorme... e acorda *lento.*',
  'Na rua, uma mulher de vestido *florido* andava de um lado pro outro, olhando para a nossa *janela.*',
  'Era a Dona *Lurdes,* a esposa do Seu Aurélio. Toda noite ela voltava. Toda noite ele *chorava.*',
  'Na *delegacia,* eu peguei o meu *uniforme* e um rádio.',
  'No *rádio,* uma gravação repetia: "Abrigo seguro no Estádio *Central* da capital."',
  'Eu deixei um rádio com o Seu Aurélio e *prometi:* "Todo dia, ao *amanhecer,* eu chamo vocês."',
  'A viatura ficou sem *gasolina* na estrada. Eu segui de *bicicleta.*',
  'A capital estava em *silêncio.* Até que a corrente da bicicleta *estalou.*',
  'E, de todas as ruas ao mesmo *tempo,* eles começaram a *vir.*',
  '*Centenas.* Devagar. Arrastando os *pés.*',
  'Eu me tranquei dentro de um *ônibus.* E eles *cercaram* tudo, batendo nos vidros.',
  'Foi aí que o rádio do ônibus *chiou.* E uma voz de *menina* falou:',
  '"Moço do ônibus. Não abre a *porta.* Faz exatamente o que eu *disser."*',
  '"Qual é o seu *nome?",* ela perguntou. Eu respondi: "*Davi."*',
  'O rádio ficou *mudo* por um segundo. Depois, a menina falou:',
  '"Davi? A minha mãe fala de um *Davi.* Ela se chama *Marina."*',
];
const n = LINES.join(' ').split(/\s+/).length;
const base = criarTimeline(LINES, PALAVRAS_SILENCIO, Math.min(160, Math.round(n / 2.55) + 3), {});
export const TL_SILENCIO = base.COM_VOZ ? { ...base, END: base.WORDS[base.WORDS.length - 1].t1 + 2.5 } : base;
