// "O Sétimo Monitor": terror de acampamento (~2min30). *palavra* = destaque na legenda.
// Sem narração por enquanto (tempos estimados); com public/voz-monitor.mp3 + PALAVRAS_MONITOR preenchido, tudo segue a fala.
import type { Palavra } from './timeline-base.ts';
import { criarTimeline } from './timeline-base.ts';

export const PALAVRAS_MONITOR: Palavra[] = [];
const LINES = [
  'Sexta-feira, *treze* de junho de mil novecentos e oitenta e *quatro.*',
  'A gente era *sete* monitores, contratados para reabrir o Acampamento Pedra Lisa, na beira de um *lago.*',
  'Fazia *vinte* anos que ele estava fechado.',
  'Na estrada, um velho de bicicleta parou a nossa Kombi e disse: "*Voltem.* Esse lugar ainda tem *dono."*',
  'A gente *riu.* Eu fui a única que não riu.',
  'O acampamento estava do jeito que deixaram: as camas arrumadas e um *calendário* parado em junho de *sessenta* e quatro.',
  'Naquela noite, em volta da *fogueira,* o Beto contou a *lenda.*',
  'Em sessenta e quatro, um menino chamado *Tavinho* caiu no *lago,* enquanto os monitores dançavam no salão.',
  'Ninguém ouviu ele *gritar.*',
  'E, desde então, toda sexta-feira *treze,* alguém *some* do acampamento.',
  'O Beto *apagou* a lanterna, e todo mundo pulou de *susto.*',
  'Depois, a gente foi dormir *rindo.*',
  'À *meia-noite,* a luz do gerador *apagou.*',
  'O Caio foi ligar de novo. E não *voltou.*',
  'A Duda foi atrás dele. A *lanterna* dela voltou *sozinha,* rolando pela escada.',
  'Às duas da manhã, o *telefone* do escritório tocou. Do outro lado, só barulho de *água.*',
  'Um por um, os chalés foram ficando *vazios.* Sem grito, sem briga. Só a porta aberta e a cama *molhada.*',
  'Às quatro, só restávamos eu e o *Beto.*',
  'A gente correu para a Kombi. Ela não *pegou.*',
  'O Beto disse: "Eu sei onde tem um *barco.* A gente atravessa o *lago."*',
  'No meio da *névoa,* já dentro do barco, eu percebi uma coisa.',
  'O Beto estava *encharcado.* Da cabeça aos pés. E não estava *chovendo.*',
  'Ele sorriu e falou baixinho: "Sabe por que ninguém ouviu o Tavinho gritar? Eu estava lá. Eu era o *monitor* dele."',
  'Eu *pulei* na água e nadei até a *margem.*',
  'De manhã, a polícia achou os outros *dormindo* no salão de dança. Vivos. Sem lembrar de *nada.*',
  'Eu contei sobre o Beto. O delegado ficou *pálido* e me mostrou uma *foto* de sessenta e quatro.',
  'Lá estava o *Beto.* Com a mesma cara. Ele se *afogou* naquela noite, tentando salvar o Tavinho.',
  'O delegado guardou a foto e disse: "Moça, vocês eram *seis.* Nunca foram *sete."*',
  'Até hoje, toda sexta-feira treze, eu deixo uma *lanterna* acesa na *janela.*',
  'Para o Beto achar o caminho de volta para o *lago.*',
];
const n = LINES.join(' ').split(/\s+/).length;
const base = criarTimeline(LINES, PALAVRAS_MONITOR, Math.min(152, Math.round(n / 2.55) + 3), { treze: '13', sete: '7', vinte: '20', seis: '6' });
export const TL_MONITOR = base.COM_VOZ ? { ...base, END: base.WORDS[base.WORDS.length - 1].t1 + 1.8 } : base;
