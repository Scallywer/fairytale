#!/bin/sh
set -e

# Debug: Log current state
echo "[ENTRYPOINT] Checking database files..."
echo "[ENTRYPOINT] Default DB exists: $(test -f /app/.default-stories.db && echo 'yes' || echo 'no')"
echo "[ENTRYPOINT] Volume DB exists: $(test -f /app/data/stories.db && echo 'yes' || echo 'no')"
echo "[ENTRYPOINT] Current user: $(id)"
echo "[ENTRYPOINT] Data dir permissions: $(ls -ld /app/data 2>/dev/null || echo 'cannot stat')"

# Fix permissions if we're running as root (will handle volume mount ownership issues)
if [ "$(id -u)" = "0" ]; then
  echo "[ENTRYPOINT] Running as root, fixing data directory permissions..."
  chown -R nextjs:nodejs /app/data 2>/dev/null || true
  chmod 755 /app/data 2>/dev/null || true
fi

# If database doesn't exist in mounted volume, copy from image default
# Note: .default-stories.db must be outside /app/data to survive volume mount
if [ ! -f /app/data/stories.db ]; then
  if [ -f /app/.default-stories.db ]; then
    echo "[ENTRYPOINT] Copying default database to volume..."
    cp /app/.default-stories.db /app/data/stories.db
    # Fix ownership if running as root
    if [ "$(id -u)" = "0" ]; then
      chown nextjs:nodejs /app/data/stories.db
      chmod 644 /app/data/stories.db
    fi
    echo "[ENTRYPOINT] Database copied successfully"
  else
    echo "[ENTRYPOINT] WARNING: Default database not found at /app/.default-stories.db"
  fi
else
  echo "[ENTRYPOINT] Database already exists in volume, skipping copy"
fi

# Switch to nextjs user before starting server (if we're root)
if [ "$(id -u)" = "0" ]; then
  echo "[ENTRYPOINT] Switching to nextjs user and starting server..."
  exec su-exec nextjs node server.js
else
  # Start the Next.js server as current user
  exec node server.js
fi
