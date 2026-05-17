#!/bin/sh
# Strip everything we don't want shipped inside a public Docker image
# from data/stories.db before `docker build` reads it.
#
# - Drops unapproved stories
# - Drops unapproved comments
# - Drops all ratings (per-device, not meaningful to ship)
# - Drops all analytics events
# - VACUUMs so the file shrinks
#
# Run before building the image:
#   ./scripts/scrub-seed-db.sh        # rewrites data/stories.db in place
#
# CI is expected to run this in the docker-build job so the published
# :latest image never contains private moderation state.

set -eu

DB="${1:-data/stories.db}"

if [ ! -f "$DB" ]; then
  echo "ERROR: $DB not found" >&2
  exit 1
fi

echo "scrubbing $DB ..."

sqlite3 "$DB" <<'SQL'
PRAGMA foreign_keys = OFF;
DELETE FROM comments WHERE isApproved = 0;
DELETE FROM stories WHERE isApproved = 0;
DELETE FROM ratings;
DELETE FROM analytics;
PRAGMA foreign_keys = ON;
VACUUM;
SQL

echo "done. New size: $(wc -c < "$DB") bytes"
