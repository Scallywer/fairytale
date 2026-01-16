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
    echo "[ENTRYPOINT] Copying pre-populated database to volume..."
    DB_SIZE=$(stat -f%z /app/.default-stories.db 2>/dev/null || stat -c%s /app/.default-stories.db 2>/dev/null || echo "unknown")
    echo "[ENTRYPOINT] Default DB size: $DB_SIZE bytes"
    cp /app/.default-stories.db /app/data/stories.db
    # Fix ownership if running as root
    if [ "$(id -u)" = "0" ]; then
      chown nextjs:nodejs /app/data/stories.db
      chmod 644 /app/data/stories.db
    fi
    echo "[ENTRYPOINT] Database copied successfully"
    
    # Verify database has approved stories
    if command -v sqlite3 >/dev/null 2>&1; then
      APPROVED_STORIES=$(sqlite3 /app/data/stories.db "SELECT COUNT(*) FROM stories WHERE isApproved = 1;" 2>/dev/null || echo "error")
      echo "[ENTRYPOINT] Database has $APPROVED_STORIES approved stories"
    fi
  else
    echo "[ENTRYPOINT] ERROR: Pre-populated database not found at /app/.default-stories.db"
    echo "[ENTRYPOINT] Please ensure data/stories.db exists in the repository"
    exit 1
  fi
else
  echo "[ENTRYPOINT] Database already exists in volume, skipping copy"
  EXISTING_DB_SIZE=$(stat -f%z /app/data/stories.db 2>/dev/null || stat -c%s /app/data/stories.db 2>/dev/null || echo "unknown")
  echo "[ENTRYPOINT] Existing DB size: $EXISTING_DB_SIZE bytes"
  
  # Verify database has content by checking story count
  if command -v sqlite3 >/dev/null 2>&1; then
    TOTAL_STORIES=$(sqlite3 /app/data/stories.db "SELECT COUNT(*) FROM stories;" 2>/dev/null || echo "error")
    APPROVED_STORIES=$(sqlite3 /app/data/stories.db "SELECT COUNT(*) FROM stories WHERE isApproved = 1;" 2>/dev/null || echo "error")
    echo "[ENTRYPOINT] Database check: total stories=$TOTAL_STORIES, approved=$APPROVED_STORIES"
    
    # If database is empty or has no approved stories, replace with default
    if [ "$TOTAL_STORIES" = "0" ] || [ "$APPROVED_STORIES" = "0" ]; then
      if [ -f /app/.default-stories.db ]; then
        echo "[ENTRYPOINT] WARNING: Database exists but has no approved stories, replacing with default..."
        cp /app/.default-stories.db /app/data/stories.db
        if [ "$(id -u)" = "0" ]; then
          chown nextjs:nodejs /app/data/stories.db
          chmod 644 /app/data/stories.db
        fi
        echo "[ENTRYPOINT] Database replaced with default"
      fi
    fi
  else
    echo "[ENTRYPOINT] sqlite3 not available, cannot verify database content"
  fi
fi

# Switch to nextjs user before starting server (if we're root)
if [ "$(id -u)" = "0" ]; then
  echo "[ENTRYPOINT] Switching to nextjs user and starting server..."
  exec su-exec nextjs node server.js
else
  # Start the Next.js server as current user
  exec node server.js
fi
