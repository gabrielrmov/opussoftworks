#!/usr/bin/env bash
# Sobe o WA-AKG no seu Mac, sem Google Cloud e sem cartão: http://localhost:3000
# Antes: instale e abra o Docker Desktop (https://www.docker.com/products/docker-desktop/, "Apple chip").
# Uso:   bash iniciar.sh            (primeira vez e para religar depois)
set -euo pipefail

DIR="$HOME/wa-akg-local"
HERE="$(cd "$(dirname "$0")" && pwd)"

# O comando `docker` só entra no PATH depois do primeiro uso do Docker Desktop; procura direto no app.
export PATH="$PATH:/Applications/Docker.app/Contents/Resources/bin:/usr/local/bin"
command -v docker >/dev/null || { echo "Docker não encontrado. Instale o Docker Desktop (arraste para Aplicativos) e rode de novo."; exit 1; }
command -v git >/dev/null || { echo "git não encontrado."; exit 1; }

if ! docker info >/dev/null 2>&1; then
  echo "Abrindo o Docker Desktop e esperando ele ficar pronto (até 3 minutos)..."
  echo "(Na primeira vez ele pede para aceitar os termos e a senha do Mac: faça isso na janela dele.)"
  open -a Docker
  for i in $(seq 1 36); do
    docker info >/dev/null 2>&1 && break
    sleep 5
  done
  docker info >/dev/null 2>&1 || { echo "O Docker não ficou pronto. Termine a configuração na janela dele e rode o script de novo."; exit 1; }
fi

mkdir -p "$DIR"
cp "$HERE/docker-compose.yml" "$DIR/"

echo "[1/4] Código do WA-AKG"
if [ -d "$DIR/src/.git" ]; then
  git -C "$DIR/src" checkout -- Dockerfile   # tira a correção abaixo para o pull não conflitar
  git -C "$DIR/src" pull --ff-only
else git clone --depth 1 https://github.com/mrifqidaffaaditya/WA-AKG.git "$DIR/src"; fi

# Correções no Dockerfile do WA-AKG, que instala tudo em modo produção (sem as devDependencies):
#  1. o build do Next.js precisa de tailwindcss/@tailwindcss/postcss/typescript, que são devDependencies;
#  2. `npx prisma ...` sem o CLI instalado baixa a versão mais recente (8, sem `generate`) e quebra o
#     build e o start. Fixamos o Prisma na versão que o próprio projeto pede;
#  3. o passo que "limpa" as devDependencies (npm prune + npm install --no-save) apaga tsx, typescript e
#     prisma da imagem, e o servidor precisa dos três para iniciar. Trocamos por um passo vazio.
PRISMA_V="$(grep -m1 '"prisma":' "$DIR/src/package.json" | sed -E 's/.*"[\^~]?([0-9]+\.[0-9]+\.[0-9]+)".*/\1/')"
case "$PRISMA_V" in [0-9]*.[0-9]*.[0-9]*) ;; *) PRISMA_V=5.22.0 ;; esac
echo "  Prisma fixado em $PRISMA_V"
sed -i.bak \
  -e "s#npm ci --legacy-peer-deps#npm ci --legacy-peer-deps --include=dev#" \
  -e "s#RUN npx prisma generate && npm run build#RUN npx prisma@$PRISMA_V generate \&\& npm run build#" \
  -e "s#RUN npm prune --omit=dev && npm install --no-save tsx typescript#RUN true#" \
  "$DIR/src/Dockerfile" && rm -f "$DIR/src/Dockerfile.bak"
grep -q "include=dev" "$DIR/src/Dockerfile" && grep -q "prisma@$PRISMA_V generate" "$DIR/src/Dockerfile" && grep -q "^RUN true" "$DIR/src/Dockerfile" || { echo "Não consegui aplicar a correção no Dockerfile do WA-AKG."; exit 1; }

echo "[2/4] Senhas (geradas uma vez e guardadas em $DIR/.env)"
if [ ! -f "$DIR/.env" ]; then
  rand() { head -c 48 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | head -c "$1"; }
  ADMIN_PASSWORD="$(rand 20)"
  cat > "$DIR/.env" <<ENV
DB_PASSWORD=$(rand 32)
AUTH_SECRET=$(rand 48)
ADMIN_EMAIL=admin@opus.local
ADMIN_PASSWORD=$ADMIN_PASSWORD
ENV
  chmod 600 "$DIR/.env"
  echo "  Login do painel: admin@opus.local  /  $ADMIN_PASSWORD"
else
  echo "  $DIR/.env já existe, mantido."
fi

echo "[3/4] Build e start (o primeiro build leva de 5 a 15 minutos)"
cd "$DIR"
docker compose up -d --build

# O Dockerfile do WA-AKG não cria o admin sozinho; criamos aqui (e promovemos se já existir).
echo "[4/4] Usuário admin"
set -a; . "$DIR/.env"; set +a
for i in $(seq 1 30); do
  if docker compose exec -T app node scripts/setup-admin.js "$ADMIN_EMAIL" "$ADMIN_PASSWORD" 2>/dev/null | grep -qi "success\|promoted"; then
    echo "  Admin pronto."; break
  fi
  sleep 10
done

echo
echo "Pronto: abra http://localhost:3000 (login e senha em $DIR/.env)."
echo "Na extensão, o endereço do servidor é: http://localhost:3000"
echo "Dica: durante os envios, mantenha o Mac acordado:  caffeinate -dimsu"
echo "Logs: cd $DIR && docker compose logs -f app   |   Parar: docker compose stop"
