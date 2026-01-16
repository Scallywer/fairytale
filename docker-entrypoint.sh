#!/bin/sh
set -e

# If database doesn't exist in mounted volume, copy from image default
if [ ! -f /app/data/stories.db ] && [ -f /app/data/.default-stories.db ]; then
  echo "Copying default database to volume..."
  cp /app/data/.default-stories.db /app/data/stories.db
  chmod 644 /app/data/stories.db
fi

# Start the Next.js server
exec node server.js
