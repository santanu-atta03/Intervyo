# Frontend Dockerfile (Intervyo)
#
# Goals:
# - Fast local iteration (bind mounts + Vite HMR)
# - Reproducible installs (npm ci)
# - Optional production target (Vite preview)

ARG NODE_VERSION=20

# npm v7+ enforces peer dependency resolution strictly, and this repo currently
# includes at least one dependency with peer constraints not yet updated for
# React 19. For local development containers, we prefer a predictable install
# over failing builds, so we allow opting into legacy peer dependency behavior.
#
# Set to "false" to enforce strict peer deps inside Docker:
#   docker build --build-arg NPM_LEGACY_PEER_DEPS=false ...
ARG NPM_LEGACY_PEER_DEPS=true

FROM node:${NODE_VERSION}-bookworm AS base

# Set the working directory inside the container.
WORKDIR /app

FROM base AS deps

# Re-declare build args inside the stage so they are available to RUN steps.
ARG NPM_LEGACY_PEER_DEPS=true

# Copy package metadata first to enable cached installs.
COPY package*.json ./
# Install frontend dependencies in a reproducible way.
ENV NPM_CONFIG_STRICT_PEER_DEPS=false
RUN if [ "${NPM_LEGACY_PEER_DEPS}" = "true" ]; then \
      npm install --legacy-peer-deps --force --no-audit --no-fund; \
    else \
      npm ci; \
    fi

FROM base AS dev

# Reuse dependencies from the deps stage to avoid reinstalling.
COPY --from=deps /app/node_modules /app/node_modules

# Copy the full source after deps to maximize cache hits.
# Note: when using docker-compose for local dev, a bind mount will overlay /app,
# so this COPY is primarily for standalone `docker build`/`docker run` workflows.
COPY . .

# Expose the Vite dev server port.
EXPOSE 5173

# Bind Vite to all interfaces so Docker can expose it to the host.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# -----------------------------------------------------------------------------
# Optional production build target (useful for CI/CD and preview deployments)
# -----------------------------------------------------------------------------

FROM base AS build

ENV NODE_ENV=production

COPY --from=deps /app/node_modules /app/node_modules
COPY . .

RUN npm run build

FROM base AS prod

# Serve the production build using Vite's preview server (no nginx).
# This keeps the "prod-like" workflow self-contained and simple for contributors.
ENV NODE_ENV=production

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY package*.json ./
COPY vite.config.* ./

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
