#!/bin/sh
set -e

# Debug: Log current state
echo "[ENTRYPOINT] Checking database files..."
echo "[ENTRYPOINT] Default DB exists: $(test -f /app/.default-stories.db && echo 'yes' || echo 'no')"
echo "[ENTRYPOINT] Volume DB exists: $(test -f /app/data/stories.db && echo 'yes' || echo 'no')"
echo "[ENTRYPOINT] Data dir contents: $(ls -la /app/data/ 2>/dev/null | head -5 || echo 'cannot list')"

# If database doesn't exist in mounted volume, copy from image default
# Note: .default-stories.db must be outside /app/data to survive volume mount
if [ ! -f /app/data/stories.db ]; then
  if [ -f /app/.default-stories.db ]; then
    echo "[ENTRYPOINT] Copying default database to volume..."
    cp /app/.default-stories.db /app/data/stories.db
    chmod 644 /app/data/stories.db
    echo "[ENTRYPOINT] Database copied successfully"
  else
    echo "[ENTRYPOINT] WARNING: Default database not found at /app/.default-stories.db"
  fi
else
  echo "[ENTRYPOINT] Database already exists in volume, skipping copy"
fi

# Start the Next.js server
exec node server.js
