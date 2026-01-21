# 🐳 Docker Setup Guide — Enterprise-Style Containerized Workflow (Intervyo)

<div align="center">

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5173-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Optional, dev-first Docker workflow** for consistent onboarding, reproducibility, and parity checks.

[Quick Start](#-quick-start) • [Architecture](#-architecture-overview) • [Dev vs Prod](#-dev-vs-production-like-stacks) • [Commands](#-command-reference) • [Troubleshooting](#-troubleshooting)

</div>

---

## 📊 Executive Summary

Intervyo includes an **optional** containerized workflow to run the full stack locally:

- **MongoDB** (`mongo`)
- **Backend API** (`backend`) — hot reload enabled
- **Frontend UI** (`frontend`) — Vite dev server + HMR

This improves local development by making the runtime environment consistent across Windows/macOS/Linux, and by removing the need to install MongoDB and OS-level build tooling on the host.

### Why this matters for Intervyo specifically

Intervyo’s backend includes dependencies that may require native build toolchains (ex: `canvas`). Docker isolates those system-level requirements inside a known Linux environment, reducing OS-specific setup friction.

### Typical outcomes (team-dependent)

| Area | Traditional Local Setup | Docker Workflow | Practical Impact |
|------|--------------------------|----------------|------------------|
| Setup complexity | OS + Node + Mongo + native deps | Docker Desktop + 1 command | Lower onboarding friction |
| Environment drift | Common over time | Reduced (pinned images + Dockerfiles) | Fewer “works on my machine” issues |
| Rebuild repeatability | Variable | More reproducible (`npm ci`, locked versions) | Reliable re-runs |
| Cleanup/reset | Manual uninstalling | `docker compose down -v` | Easy clean slate |

---

## 🎯 What This Implementation Includes

### Dev stack (default)
- `docker-compose.yml` — dev-first compose with:
  - bind mounts for live code editing
  - named volumes for `node_modules` to avoid host OS conflicts
  - healthchecks for deterministic startup ordering
  - explicit network for clear service discovery

### Production-like stack (optional)
- `docker-compose.prod.yml` — parity-focused compose with:
  - `backend` built via Dockerfile `prod` target (non-root user, slim base)
  - `frontend` built via Dockerfile `prod` target (Vite preview serving `dist/`)
  - no bind mounts (closer to deployment behavior)

### Multi-stage Dockerfiles
- `Backend/Dockerfile`
  - `base` → `deps` → `dev` + optional `deps-prod` → `prod`
- `Frontend/Dockerfile`
  - `base` → `deps` → `dev` + optional `build` → `prod`

---

## ✅ Prerequisites

### Required
- Docker Desktop (Windows/macOS) OR Docker Engine (Linux)
- Docker Compose v2 (`docker compose ...`)

### Recommended
- 4+ CPU cores allocated to Docker
- 6–8GB RAM allocated to Docker for smoother HMR with larger projects

Verify:
```bash
docker --version
docker compose version
```

---

## 🚀 Quick Start

### 1) Start the dev stack (recommended)

From the repo root:
```bash
docker compose up --build
```

Open:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Backend health: http://localhost:5000/api/health

Stop:
```bash
docker compose down
```

Reset DB data:
```bash
docker compose down -v
```

---

## 🧩 Dev vs Production-like Stacks

### Dev stack (bind mounts + hot reload)
Best for daily development:
- Fast edits: code changes reflect without rebuilds
- Stable installs: `node_modules` stays in Docker volumes
- Works across OSes without permission headaches

Command:
```bash
docker compose up --build
```

### Production-like stack (parity check)
Best for “does this behave like deployment?” checks:
- No bind mounts
- Frontend serves the production build via `vite preview` (no nginx)
- Backend runs as non-root user in a slim image

Command:
```bash
docker compose -f docker-compose.prod.yml up --build
```

Open:
- Frontend (preview): http://localhost:8080
- Backend: http://localhost:5000

---

## 🏗️ Architecture Overview

### Dev container topology

```
┌──────────────────────────────────────────────────────────────┐
│                        Docker Host (Your OS)                  │
│                                                              │
│  Browser                                                     │
│   │                                                          │
│   ├── http://localhost:5173  →  frontend (Vite dev server)   │
│   ├── http://localhost:5000  →  backend  (Express API)       │
│   └── mongodb://localhost:27017 → mongo (MongoDB)            │
│                                                              │
│  ┌────────────── intervyo-net (bridge network) ────────────┐ │
│  │                                                         │ │
│  │  frontend  ────────→  backend  ────────→  mongo          │ │
│  │     (HMR)              (/api/*)            (db)          │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Key design choices

1) **Named volumes for `node_modules`**  
Bind mounts are great for source code, but `node_modules` on Windows/macOS can create performance and permission issues. Keeping `node_modules` inside Docker avoids this.

2) **Healthchecks + `depends_on: condition: service_healthy`**  
This makes the startup process deterministic: backend waits for MongoDB, frontend waits for backend.

3) **Explicit network**  
`mongo` is reachable from backend via the hostname `mongo` (service discovery inside Docker).

---

## 🧱 Dockerfile Design (Multi-Stage Builds)

### Backend (`Backend/Dockerfile`)

Stages:
- `base`: system libs + tooling required to compile native deps (dev)
- `deps`: `npm ci` for dev dependencies (cached layer)
- `dev`: nodemon runtime with bind mounts
- `deps-prod`: `npm ci --omit=dev` (smaller install set)
- `prod`: slim runtime image + runtime libs only + non-root user

Why this is “enterprise-style”:
- Clean separation between build-time and runtime dependencies
- Faster rebuilds (dependency layer caching)
- Supports both dev and production-like runs from a single Dockerfile

### Frontend (`Frontend/Dockerfile`)

Stages:
- `deps`: installs dependencies once
- `dev`: Vite dev server for HMR
- `build`: produces `dist/`
- `prod`: Vite preview serves static build output

#### Note on npm peer dependencies

The frontend container disables npm's strict peer dependency resolution via
the `NPM_CONFIG_STRICT_PEER_DEPS=false` environment variable. This prevents
install failures when upstream packages have not yet updated peer ranges for
newer React major versions.

Because this behavior is configured globally through the environment, there is
no separate Docker-only `--legacy-peer-deps` command or `NPM_LEGACY_PEER_DEPS`
build argument; installs inside the container use the same non-strict behavior
consistently.

---

## ⚙️ Environment Configuration

### Backend env

Compose loads defaults from:
- `Backend/.env.example`

Then overrides the DB host so containers connect correctly:
- `MONGODB_URI=mongodb://mongo:27017/intervyo`

### Frontend API base URL

The frontend reads:
- `import.meta.env.VITE_API_BASE_URL`

In dev compose, it’s set to:
- `http://localhost:5000/api`

If not set, it falls back to the hosted API URL (so normal workflows stay unchanged).

---

## 🧪 Healthchecks (Readiness)

Healthchecks are implemented in Compose for predictable startup:
- Mongo: `db.adminCommand('ping')`
- Backend: GET `/api/health` using Node’s `http` module
- Frontend: HTTP GET `/` against Vite server (dev)

This improves reliability when developers run the stack on slower machines or fresh installs.

---

## 🎮 Command Reference

### Core operations
```bash
# Start dev stack (foreground)
docker compose up --build

# Start dev stack (background)
docker compose up -d --build

# Stop containers
docker compose down

# Stop + delete volumes (danger: deletes mongo data)
docker compose down -v

# See status
docker compose ps

# Tail logs
docker compose logs -f
```

### Dev operations
```bash
# Open a shell in backend container
docker compose exec backend bash

# Open a shell in frontend container
docker compose exec frontend bash

# Reinstall deps inside container (if package-lock changed)
docker compose exec backend npm ci
docker compose exec frontend npm ci
```

### Production-like operations
```bash
# Build/run the prod-like stack
docker compose -f docker-compose.prod.yml up --build

# Stop prod-like stack
docker compose -f docker-compose.prod.yml down
```

---

## 🐛 Troubleshooting

### Docker engine not running
If you see connection errors, start Docker Desktop and ensure it’s using the expected engine (WSL2 on Windows is recommended).

### Ports already in use
If `5173`, `5000`, or `27017` are occupied, stop the conflicting process or change port mappings in compose.

### File changes not reflected (Windows/macOS)
Frontend uses `CHOKIDAR_USEPOLLING=true` for reliable watching on Docker Desktop file shares.

### Mongo connection issues inside Docker
Inside the Docker network, MongoDB is `mongo` (service name). The dev compose file already forces:
`MONGODB_URI=mongodb://mongo:27017/intervyo`.

---

## 🔒 Security Notes (Dev vs Prod)

Dev containers prioritize iteration speed, so they may run with broader permissions.
The production-like backend target:
- uses a slim base image
- installs runtime libs only
- runs as the non-root `node` user

---

## 🧭 CI/CD Notes (Optional)

This structure is CI-friendly:
- build the backend `prod` target to validate runtime image
- build the frontend `prod` target to validate `dist/` output

Example commands:
```bash
docker build -f Backend/Dockerfile --target prod -t intervyo-backend:prod Backend
docker build -f Frontend/Dockerfile --target prod -t intervyo-frontend:prod Frontend
```

---

## 📦 Files Added/Updated (Implementation Footprint)

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Dev stack orchestration with healthchecks + volumes |
| `docker-compose.prod.yml` | Production-like stack (optional) |
| `Backend/Dockerfile` | Multi-stage dev + prod targets |
| `Frontend/Dockerfile` | Multi-stage dev + build + preview targets |

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-01-18  
**Scope:** Local development tooling only (non-intrusive)
