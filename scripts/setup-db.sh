#!/bin/bash

# Create database
createdb milemaven

# Create tables
psql -d milemaven -f scripts/database-schema.sql

# Insert sample data
psql -d milemaven -f scripts/seed-data.sql

echo "Database setup complete! 🎉" 