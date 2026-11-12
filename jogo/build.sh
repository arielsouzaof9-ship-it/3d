#!/bin/sh
# Gera páginas completas (abrem direto no navegador) a partir de src/:
#   src/bip-corre.html     -> index.html
#   src/ultima-quadra.html -> zumbi.html
cd "$(dirname "$0")"
wrap() {
  {
    printf '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
    printf '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">\n'
    printf '<meta name="apple-mobile-web-app-capable" content="yes">\n</head>\n<body>\n'
    cat "$1"
    printf '\n</body>\n</html>\n'
  } > "$2"
}
wrap src/bip-corre.html index.html
wrap src/ultima-quadra.html zumbi.html
