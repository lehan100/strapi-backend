#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INPUT_FILE="${1:-${ROOT_DIR}/backups/strapi-latest.sql}"

if [[ ! -f "${INPUT_FILE}" ]]; then
  echo "Backup file not found: ${INPUT_FILE}"
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -qx 'strapiDB'; then
  echo "Container strapiDB is not running. Start Docker first with: docker compose up -d"
  exit 1
fi

docker exec -i strapiDB sh -lc 'exec mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' < "${INPUT_FILE}"

echo "Database imported from ${INPUT_FILE}"
