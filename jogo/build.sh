#!/bin/sh
# Gera jogo/index.html (página completa, abre direto no navegador) a partir de src/bip-corre.html
cd "$(dirname "$0")"
{
  printf '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
  printf '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">\n'
  printf '<meta name="apple-mobile-web-app-capable" content="yes">\n</head>\n<body>\n'
  cat src/bip-corre.html
  printf '\n</body>\n</html>\n'
} > index.html
