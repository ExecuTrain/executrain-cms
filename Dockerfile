# ---- Stage 1: Build the Vite SPA ----
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies.
# NOTE: npm install (not npm ci) because this project depends on
# platform-specific optional packages (rolldown/tailwindcss native bindings,
# @emnapi/*) that differ between the Windows host where the lockfile is
# committed and the Alpine build container. npm install resolves the correct
# Alpine/linux variants, while npm ci would fail on the missing entries.
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

# Copy source and build.
# VITE_API_URL is baked into the bundle at build time.
# Vite auto-loads .env, so it works out of the box.
# Override it with a Docker build arg if your production API URL differs.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# Install lightweight static file server (runtime dependency)
RUN npm install serve@14

# ---- Stage 2: Runtime ----
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy built assets and the serve binary
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# serve handles SPA fallback automatically (rewrites unknown routes to index.html)
CMD ["npx", "serve", "dist", "-s", "-l", "3000"]
