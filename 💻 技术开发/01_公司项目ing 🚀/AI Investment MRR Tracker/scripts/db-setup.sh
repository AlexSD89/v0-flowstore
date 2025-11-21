#!/bin/bash

# AI Investment MRR Tracker - Database Setup Script
# This script sets up the PostgreSQL database and runs migrations

set -e

echo "🚀 AI Investment MRR Tracker - Database Setup"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found. Please create one from .env.example${NC}"
    exit 1
fi

# Load environment variables
set -a
source .env
set +a

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  Database: ${DATABASE_URL}"
echo "  Node Environment: ${NODE_ENV:-development}"
echo ""

# Check if PostgreSQL is running
echo -e "${YELLOW}🔍 Checking PostgreSQL connection...${NC}"
if command -v psql >/dev/null 2>&1; then
    if psql "${DATABASE_URL}" -c '\l' >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL connection successful${NC}"
    else
        echo -e "${RED}❌ Cannot connect to PostgreSQL. Please check your DATABASE_URL${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  psql command not found. Skipping connection test${NC}"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Generate Prisma client
echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
npx prisma generate

# Check database status
echo -e "${YELLOW}📊 Checking database status...${NC}"
DB_EXISTS=$(npx prisma db execute --stdin <<< "SELECT 1;" 2>/dev/null && echo "true" || echo "false")

if [ "$DB_EXISTS" = "false" ]; then
    echo -e "${YELLOW}🏗️  Database not found. Creating database...${NC}"
    # Create database (this might need manual intervention depending on your setup)
    echo -e "${YELLOW}⚠️  Please ensure your PostgreSQL database exists before continuing${NC}"
fi

# Run database migrations
echo -e "${YELLOW}🔄 Running database migrations...${NC}"
npx prisma migrate deploy

# Check if we should seed the database
SHOULD_SEED=${SEED_DATABASE:-true}
FORCE_SEED=${1:-""}

if [ "$FORCE_SEED" = "--seed" ] || [ "$FORCE_SEED" = "-s" ]; then
    SHOULD_SEED=true
fi

if [ "$SHOULD_SEED" = "true" ]; then
    echo -e "${YELLOW}🌱 Seeding database with sample data...${NC}"
    npx tsx prisma/seed.ts
    echo -e "${GREEN}✅ Database seeded successfully${NC}"
else
    echo -e "${BLUE}ℹ️  Skipping database seeding. Use --seed flag to force seeding${NC}"
fi

# Generate updated Prisma client (in case schema changed)
echo -e "${YELLOW}🔄 Regenerating Prisma client...${NC}"
npx prisma generate

# Verify database setup
echo -e "${YELLOW}🔍 Verifying database setup...${NC}"
TABLES_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | grep -o '[0-9]\+' | tail -1)

if [ "$TABLES_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Database setup completed successfully${NC}"
    echo -e "${BLUE}📊 Found $TABLES_COUNT tables in the database${NC}"
else
    echo -e "${RED}❌ Database setup may have failed. No tables found${NC}"
    exit 1
fi

# Show connection info for development
if [ "${NODE_ENV:-development}" = "development" ]; then
    echo -e "${BLUE}🔧 Development Tools:${NC}"
    echo "  View database: npx prisma studio"
    echo "  Reset database: npx prisma migrate reset"
    echo "  Create migration: npx prisma migrate dev --name <name>"
    echo ""
fi

echo -e "${GREEN}🎉 Database setup complete!${NC}"
echo -e "${BLUE}🚀 You can now start the application${NC}"