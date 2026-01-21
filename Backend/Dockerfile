# Backend Dockerfile (Intervyo)
#
# Goals:
# - Fast local iteration (bind mounts + nodemon)
# - Reproducible installs (npm ci)
# - Clear separation of concerns (multi-stage)
# - Optional production target for CI/CD parity

# Keep the Node version configurable (useful for CI matrices).
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-bookworm AS base

# Set the working directory inside the container.
WORKDIR /app

# Install build tools and native libraries required by "canvas" and similar deps.
# Keeping these in a single layer improves caching and keeps the image tidy.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*

# Provide sensible defaults. Compose can override these as needed.
ENV NODE_ENV=development \
    PORT=5000

FROM base AS deps

# Copy package metadata first to leverage Docker layer caching for deps.
COPY package*.json ./
# Install dependencies.
# Prefer `npm ci` for reproducibility, but fall back to `npm install` when the
# lockfile is out of sync (common in fast-moving repos).
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

FROM base AS deps-prod

# Install only production dependencies for a smaller runtime image.
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund

FROM base AS dev

# Reuse dependencies from the deps stage to avoid reinstalling.
COPY --from=deps /app/node_modules /app/node_modules

# Copy the full source after deps to maximize cache hits.
COPY . .

# Expose the API port used by the backend server.
EXPOSE 5000

# Start the backend in dev mode (nodemon).
CMD ["npm", "run", "dev"]

# -----------------------------------------------------------------------------
# Optional production runtime target (for CI/CD and parity testing)
# -----------------------------------------------------------------------------

FROM node:${NODE_VERSION}-bookworm-slim AS prod

WORKDIR /app

# Runtime-only libraries for canvas (no compilers / headers).
RUN apt-get update && apt-get install -y --no-install-recommends \
    libcairo2 libpango-1.0-0 libjpeg62-turbo libgif7 librsvg2-2 \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    PORT=5000

COPY --from=deps-prod /app/node_modules /app/node_modules
COPY . .

# Drop privileges for production containers.
USER node

EXPOSE 5000

CMD ["node", "index.js"]
