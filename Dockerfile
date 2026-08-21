# ============================================================================
# ExecuTrain CMS - Dockerfile
# React (Vite) build -> static served by nginx
# ============================================================================

# ---------- Build stage ----------
FROM node:24-slim AS build

# VITE_API_URL di-pass dari docker-compose (build arg)
ARG VITE_API_URL=/api/v2
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

# Cache layer: install dependencies dulu
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Build produksi (tsc + vite build -> dist/)
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine AS runtime

# Nginx config: SPA fallback + proxy /api ke service API
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build ke root html nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
