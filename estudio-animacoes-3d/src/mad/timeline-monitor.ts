// "O Sétimo Monitor": terror de acampamento (~2min30). *palavra* = destaque na legenda.
// Sem narração por enquanto (tempos estimados); com public/voz-monitor.mp3 + PALAVRAS_MONITOR preenchido, tudo segue a fala.
import type { Palavra } from './timeline-base.ts';
import { criarTimeline } from './timeline-base.ts';

export const PALAVRAS_MONITOR: Palavra[] = [];
const LINES = [
  'Sexta-feira, *treze* de junho de mil novecentos e oitenta e *quatro.*',
  'A gente era *sete* monitores, contratados para reabrir o Acampamento Pedra Lisa, na beira de um *lago.*',
  'Fazia *vinte* anos que ele estava fechado.',
  'Na estrada, um velho de bicicleta parou a nossa Kombi e disse: "*Voltem.* O lago ainda está *contando."*',
  'A gente *riu.* Eu fui a única que não riu.',
  'O acampamento estava do jeito que deixaram: as camas arrumadas, ainda *molhadas,* e um *calendário* parado em junho de sessenta e quatro.',
  'Naquela noite, em volta da *fogueira,* o Beto contou a *lenda.*',
  'Em sessenta e quatro, um menino chamado *Tavinho* se afogou no *lago,* enquanto os monitores dançavam no salão.',
  'Ninguém ouviu ele *gritar.*',
  'E, desde então, toda sexta-feira *treze,* ele volta para buscar uma *turma* nova.',
  'O Beto *apagou* a lanterna. E, do escuro do lago, uma voz de criança começou a contar: *um...* *dois...* *três...*',
  'Ninguém *riu.*',
  'À *meia-noite,* a luz do gerador *apagou.*',
  'O Caio foi ligar de novo. E não *voltou.*',
  'A Duda foi atrás dele. A *lanterna* dela voltou *sozinha,* rolando pela escada.',
  'Às duas da manhã, o *telefone* do escritório tocou. Do outro lado, só *água.* E a voz: "*Quatro...* *cinco..."*',
  'Um por um, os chalés foram ficando *vazios.* No chão, *pegadas* pequenas e molhadas, todas indo para o lago.',
  'Às quatro, só restávamos eu e o *Beto.*',
  'A gente correu para a Kombi. Ela não *pegou.* No vidro embaçado, um dedinho tinha escrito: "*seis".*',
  'O Beto disse: "Eu sei onde tem um *barco.* A gente atravessa o *lago."*',
  'No meio da *névoa,* alguma coisa começou a *bater* no fundo do barco. Por *baixo.*',
  'O Beto estava *encharcado.* Da cabeça aos pés. E não estava *chovendo.*',
  'Ele sorriu e falou baixinho: "Ninguém ouviu o Tavinho porque eu estava *dançando.* Eu era o *monitor* dele. Agora eu *ajudo* ele."',
  'Eu *pulei* na água e nadei. Uma mão pequena e gelada segurou o meu *tornozelo.*',
  'Eu chutei, nadei e cheguei na *margem.* Pelo menos, foi o que eu *pensei.*',
  'De manhã, eu entrei na *delegacia* pingando. Ninguém *olhou* para mim.',
  'Na mesa, a *lista* dos mergulhadores: *seis* monitores encontrados no fundo do lago, de mãos dadas, em *roda.*',
  'O último nome da lista era o *meu.*',
  'O *sétimo* lugar da roda é do Beto. Agora a turma do Tavinho está *completa.*',
  'E toda sexta-feira treze, a gente acende uma *lanterna* na beira do lago. Para chamar os *próximos.*',
];
const n = LINES.join(' ').split(/\s+/).length;
const base = criarTimeline(LINES, PALAVRAS_MONITOR, Math.min(170, Math.round(n / 2.55) + 3), { treze: '13', sete: '7', vinte: '20', seis: '6', um: '1', dois: '2', tres: '3', quatro: '4', cinco: '5' });
export const TL_MONITOR = base.COM_VOZ ? { ...base, END: base.WORDS[base.WORDS.length - 1].t1 + 1.8 } : base;
