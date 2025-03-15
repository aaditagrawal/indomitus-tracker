#!/bin/sh
set -e

# Check if database exists and is empty or not present
if [ ! -f "/app/data/indomitus.db" ] || [ ! -s "/app/data/indomitus.db" ]; then
    echo "Database not found or empty. Initializing with superadmin account..."

    # Create the database directory if it doesn't exist
    mkdir -p /app/data

    # Copy the schema to a temporary file
    echo "Creating database schema..."

    # Run the initialization script
    echo "Creating superadmin account..."
    bun run src/scripts/init-db.ts

    echo "Database initialization complete!"
fi

# Start the application
echo "Starting Indomitus Tracker..."
exec "$@"
