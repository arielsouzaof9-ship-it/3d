# Instruções do projeto

## Personagens MAD
Quando o usuário disser **"use personagens mad"** (ou "personagens mad", "elenco mad"), ele quer os personagens da pasta **`mad/`**:
estilo stick (cabeça redonda, rosto simples, corpo arredondado, braços e pernas grossos com contorno escuro).

- Catálogo completo: `mad/README.md` e `mad/catalogo.json` (88 personagens + expressões da Nina e do Rafael).
- Desenhos prontos: `mad/png/<id>.png` (fundo transparente) e `mad/svg/<id>.svg`.
- Para criar ou mudar personagens, edite `mad/gerar.mjs` (função `stick(k)` e as listas ELENCO, ESTILOS, MAIS, EXTRA3),
  depois rode `node mad/gerar.mjs` e `node mad/exportar-png.cjs`. Personagens novos sempre seguem esse mesmo modelo.
- Em vídeos ou cenas, use esses personagens no lugar dos bonecos 3D de `estudio-animacoes-3d/`, a menos que o usuário peça o contrário.
