#!/bin/sh
set -e

# Try to seed database if empty (only on first run)
if [ ! -f /app/data/stories.db ]; then
  echo "Database doesn't exist. Seeding database..."
  npm run seed 2>&1 || echo "Note: Database seeding attempted"
elif [ ! -s /app/data/stories.db ]; then
  echo "Database is empty. Seeding database..."
  npm run seed 2>&1 || echo "Note: Database seeding attempted"
fi

# Start the Next.js server
exec node server.js
