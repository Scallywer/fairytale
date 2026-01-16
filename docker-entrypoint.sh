#!/bin/sh
set -e

# Fix permissions if we're running as root (will handle volume mount ownership issues)
if [ "$(id -u)" = "0" ]; then
  chown -R nextjs:nodejs /app/data 2>/dev/null || true
  chmod 755 /app/data 2>/dev/null || true
fi

# If database doesn't exist in mounted volume, copy from image default
# Note: .default-stories.db must be outside /app/data to survive volume mount
if [ ! -f /app/data/stories.db ]; then
  if [ -f /app/.default-stories.db ]; then
    cp /app/.default-stories.db /app/data/stories.db
    # Fix ownership if running as root
    if [ "$(id -u)" = "0" ]; then
      chown nextjs:nodejs /app/data/stories.db
      chmod 644 /app/data/stories.db
    fi
  else
    echo "ERROR: Pre-populated database not found at /app/.default-stories.db" >&2
    exit 1
  fi
fi

# Switch to nextjs user before starting server (if we're root)
if [ "$(id -u)" = "0" ]; then
  exec su-exec nextjs node server.js
else
  exec node server.js
fi
