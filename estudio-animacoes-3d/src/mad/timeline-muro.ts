// "O Muro de Cem Anos — Episódio 1: A Mão de Barro" (~2min25). *palavra* = destaque na legenda.
// Só efeitos sonoros por enquanto (tempos estimados); com public/voz-muro.mp3 + PALAVRAS_MURO, tudo segue a fala.
import type { Palavra } from './timeline-base.ts';
import { criarTimeline } from './timeline-base.ts';

export const PALAVRAS_MURO: Palavra[] = [];
const LINES = [
  'Faz *cem* anos que a minha cidade vive cercada por duas *muralhas* de pedra.',
  'Lá fora, dizem, andam os *Imensos.* Gigantes de barro, sem fala, sem dor, que só procuram uma coisa: *gente.*',
  'Eu me chamo *Tito.* Tenho dez anos. E eu *odeio* a muralha.',
  'O meu amigo Beni guarda um *livro* proibido, com desenhos de um *mar* de água salgada maior que a cidade inteira.',
  'A *Lua,* que mora com a gente desde que perdeu os pais, só diz: "Tito, para de sonhar *alto.* Alguém vai ouvir."',
  'Naquela manhã, os *Batedores* da Aurora voltaram da *expedição* lá fora.',
  'Saíram *cem.* Voltaram *doze.* O comandante só conseguiu dizer: "A gente não descobriu nada."',
  'O povo *vaiou.* Eu não. Eu queria ser um *deles.*',
  'A minha mãe me puxou pela *orelha:* "Nenhum filho meu passa daquela *muralha."*',
  'Eu *gritei* que ela era igual a todo mundo. Que gostava de viver presa. E saí *correndo.*',
  'À tarde, eu, a Lua e o Beni subimos no telhado da *torre* do *sino.*',
  'O céu estava limpo. Até que um *relâmpago* caiu sem nuvem nenhuma, bem atrás da *muralha.*',
  'E uma *mão* de barro, do tamanho de uma casa, segurou o alto da *muralha.*',
  'Depois apareceu o *rosto.* Sem olhos. Sem boca. Mais alto que a muralha de *trinta* metros.',
  'Ele *chutou* o portão. E a muralha que protegia a gente há cem anos abriu como *papel.*',
  '*Pedras* voaram por cima da cidade. Uma delas caiu na minha *rua.*',
  'Eu corri para casa. A nossa casa tinha *desabado.* E a minha mãe estava presa embaixo da *viga.*',
  'Eu e a Lua puxamos a *viga* com toda a força. Ela não se *mexeu.*',
  '"Tito, leva a *Lua* e corre. Eu tô bem. *Corre!"*',
  'O Seu *Basílio,* guarda da muralha, pegou nós dois no *colo* e correu.',
  'Por cima do ombro dele, eu vi a *sombra* de um Imenso cobrir a minha *casa.*',
  'Depois, só *poeira.*',
  'No *barco* que levava a gente para dentro da segunda muralha, ninguém *falava.*',
  'A Lua segurava a *fita* amarela que a minha mãe tinha amarrado no *cabelo* dela.',
  'E eu olhei para a muralha *quebrada* e *prometi:*',
  '"Eu vou entrar para os *Batedores.* E vou fazer cada um deles voltar para o *barro."*',
];
const n = LINES.join(' ').split(/\s+/).length;
const base = criarTimeline(LINES, PALAVRAS_MURO, Math.min(160, Math.round(n / 2.55) + 3), {});
export const TL_MURO = base.COM_VOZ ? { ...base, END: base.WORDS[base.WORDS.length - 1].t1 + 2.5 } : base;
