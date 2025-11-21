# AI Investment MRR Tracker - Production Dockerfile
# Multi-stage build for optimized production image

# ================================
# Dependencies Stage
# ================================
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# ================================
# Builder Stage
# ================================
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Type check
RUN npm run type-check

# Build the application
RUN npm run build

# ================================
# Runner Stage (Production)
# ================================
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy additional runtime files
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/scripts ./scripts

# Set runtime environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

# Create necessary directories with proper permissions
RUN mkdir -p /app/.next/cache && chown -R nextjs:nodejs /app/.next/cache
RUN mkdir -p /app/logs && chown nextjs:nodejs /app/logs

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]

# ================================
# Development Stage
# ================================
FROM node:18-alpine AS development
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash \
    postgresql-client

# Create app user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs nextjs

# Copy dependency files
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Set ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Set development environment
ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1

# Expose ports (3000 for Next.js, 9229 for debugging)
EXPOSE 3000
EXPOSE 9229

# Development command
CMD ["npm", "run", "dev"]