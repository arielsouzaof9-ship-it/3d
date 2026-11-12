# Instruções do projeto

## Personagens MAD
Quando o usuário disser **"use personagens mad"** (ou "personagens mad", "elenco mad"), ele quer os personagens da pasta **`mad/`**:
estilo stick (cabeça redonda, rosto simples, corpo arredondado, braços e pernas grossos com contorno escuro).

- Catálogo completo: `mad/README.md` e `mad/catalogo.json` (88 personagens + expressões da Nina e do Rafael).
- Desenhos prontos: `mad/png/<id>.png` (fundo transparente) e `mad/svg/<id>.svg`.
- Para criar ou mudar personagens, edite `mad/gerar.mjs` (função `stick(k)` e as listas ELENCO, ESTILOS, MAIS, EXTRA3),
  depois rode `node mad/gerar.mjs` e `node mad/exportar-png.cjs`. Personagens novos sempre seguem esse mesmo modelo.
- Em vídeos ou cenas, use esses personagens no lugar dos bonecos 3D de `estudio-animacoes-3d/`, a menos que o usuário peça o contrário.

### Personagens mad ARTICULADOS (com movimentos)
Para animar com o padrão de movimentos dos vídeos de referência, use o boneco articulado:
- `estudio-animacoes-3d/src/mad/Rig.tsx`: `<Rig k={personagemMad} p={pose} x y s />`, o mesmo modelo stick em peças
  (ombro, cotovelo, quadril, joelho, pescoço), olhos grandes que piscam e olham, boca que fala, lágrima, suor e "?".
- `estudio-animacoes-3d/src/mad/movimentos.ts`: `pose(t, 'movimento', inicio, duracao)`. Movimentos: parado (respira e pisca),
  falar, acenar, pensar, rir, gargalhar, chorar, susto, comemorar, andar, esconder, sim, nao, apontar, ombros, bravo, nervoso, entrar,
  sentar, sentarFalar, cochilar (Zzz), deitar, telefone (use item 'celular'), aplaudir, dirigir (desenhe o volante), segurar (papel/placa),
  olharLados, andarNoLugar (cenário passando atrás), correr, aflito (mãos no rosto), espiar, pular.
  Campos extras da pose: `sentado` (0..1), `zzz` (0..1), `pisca` (piscadela). Máscaras: `k.mascara` = 'bigode' ou uma cor (pássaro).
- Elenco articulado pronto (40 personagens com nome, papel e movimento característico): `estudio-animacoes-3d/src/mad/elenco-articulado.ts`
  (`ELENCO_ARTICULADO` e `ELENCO_ARTICULADO_2`), folhas em `mad/elenco-articulado.png` e `mad/elenco-articulado-2.png`,
  apresentações nas composições `ElencoArticulado` e `ElencoArticulado2` (`elenco-articulado.mp4`, `elenco-articulado-2.mp4`).
  Rosto aceita também: `oculos`, `oculosEscuros`, `bigode` (`corBigode`), `barba` (`corBarba`), `sardas`, `brinco` (cor).
- Demonstração: composição `MovimentosMad` (vídeo `movimentos-mad.mp4`). Exemplo de cena 2D completa: `src/mad/FiosBrancos.tsx`.
