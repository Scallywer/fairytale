#!/bin/sh
# Hot-backup the SQLite database without taking the app down.
#
# Uses sqlite3's `.backup` command so concurrent writers don't corrupt
# the copy (rsync of the raw file is unsafe under WAL).
#
# Usage:
#   ./scripts/backup-db.sh                    # backs up to ./data/backups/
#   BACKUP_DIR=/mnt/backups ./scripts/backup-db.sh
#   docker exec fairytale-app /app/scripts/backup-db.sh
#
# Cron example (host-side, daily at 03:00):
#   0 3 * * * docker exec fairytale-app /app/scripts/backup-db.sh

set -eu

DB_PATH="${DB_PATH:-/app/data/stories.db}"
BACKUP_DIR="${BACKUP_DIR:-/app/data/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

if [ ! -f "$DB_PATH" ]; then
  echo "ERROR: database not found at $DB_PATH" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"

STAMP=$(date -u +%Y%m%dT%H%M%SZ)
DEST="$BACKUP_DIR/stories-$STAMP.db"

sqlite3 "$DB_PATH" ".backup '$DEST'"
echo "backup written: $DEST"

# Prune older than retention window.
find "$BACKUP_DIR" -maxdepth 1 -name 'stories-*.db' -mtime "+$RETENTION_DAYS" -delete
echo "pruned backups older than $RETENTION_DAYS days"
