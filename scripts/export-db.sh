#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${ROOT_DIR}/backups"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
OUTPUT_FILE="${1:-${BACKUP_DIR}/strapi-${TIMESTAMP}.sql}"

mkdir -p "${BACKUP_DIR}"

if ! docker ps --format '{{.Names}}' | grep -qx 'strapiDB'; then
  echo "Container strapiDB is not running. Start Docker first with: docker compose up -d"
  exit 1
fi

docker exec strapiDB sh -lc 'exec mysqldump --single-transaction --no-tablespaces -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' > "${OUTPUT_FILE}"

echo "Database exported to ${OUTPUT_FILE}"
