#!/bin/sh
# Gera o APK do Cara ou Coroa sem Gradle.
# Requer: JDK 17+, Android SDK com "platforms;android-34" e "build-tools;34.0.0".
#   ANDROID_SDK=/caminho/do/sdk ./build-apk.sh
# Saída: release/cara-ou-coroa.apk
set -e
cd "$(dirname "$0")"
SDK="${ANDROID_SDK:-$ANDROID_HOME}"
[ -n "$SDK" ] || { echo "Defina ANDROID_SDK com o caminho do Android SDK"; exit 1; }
BT="$SDK/build-tools/34.0.0"; JAR="$SDK/platforms/android-34/android.jar"
KS="${KEYSTORE:-$HOME/.android/cara-ou-coroa.jks}"
OUT=build; rm -rf "$OUT"; mkdir -p "$OUT/gen" "$OUT/classes" "$OUT/dex" release

# 1. página do jogo com three.js e fontes locais (funciona offline)
python3 - <<'PY'
import re
src = open('../jogo/src/cara-ou-coroa.html', encoding='utf-8').read()
src = re.sub(r'<link rel="preconnect"[^>]*>\n', '', src)
src = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^"]*">', '<link rel="stylesheet" href="fonts.css">', src)
src = src.replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'three.min.js')
assert 'googleapis' not in src and 'cdnjs' not in src
head = ('<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">\n'
        '</head>\n<body>\n')
open('app/assets/index.html', 'w', encoding='utf-8').write(head + src + '\n</body>\n</html>\n')
PY

# 2. recursos e manifesto
"$BT/aapt2" compile --dir app/res -o "$OUT/res.zip"
"$BT/aapt2" link -o "$OUT/base.apk" -I "$JAR" --manifest app/AndroidManifest.xml \
  -A app/assets --java "$OUT/gen" "$OUT/res.zip" \
  --min-sdk-version 24 --target-sdk-version 34 --version-code 1 --version-name 1.0

# 3. código Java -> dex
javac --release 8 -nowarn -classpath "$JAR" -d "$OUT/classes" $(find app/src "$OUT/gen" -name '*.java') 2>&1 | grep -v "^warning\|^Note\|obsolete" || true
"$BT/d8" --min-api 24 --lib "$JAR" --output "$OUT/dex" $(find "$OUT/classes" -name '*.class')
(cd "$OUT/dex" && zip -q ../base.apk classes.dex)

# 4. alinhar e assinar
"$BT/zipalign" -f -p 4 "$OUT/base.apk" "$OUT/aligned.apk"
if [ ! -f "$KS" ]; then
  mkdir -p "$(dirname "$KS")"
  keytool -genkeypair -keystore "$KS" -alias jogo -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass caraoucoroa -keypass caraoucoroa -dname "CN=Cara ou Coroa" >/dev/null 2>&1
fi
"$BT/apksigner" sign --ks "$KS" --ks-key-alias jogo --ks-pass pass:caraoucoroa --key-pass pass:caraoucoroa \
  --out release/cara-ou-coroa.apk "$OUT/aligned.apk"
"$BT/apksigner" verify release/cara-ou-coroa.apk
echo "APK pronto: $(pwd)/release/cara-ou-coroa.apk"
