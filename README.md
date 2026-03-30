# MonadicDashboard

**Tool 1 of 4 — MonadicWorkspace Control Plane**

Real-time dashboard aggregating GitHub and NuGet metrics for the entire MonadicSharp ecosystem.

## Quick Start

```bash
# Backend (port 3001)
cd backend
npm install
cp ../.env.example .env   # optional: add GITHUB_TOKEN
npm run dev

# Frontend (port 5173)
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `GITHUB_TOKEN` | — | GitHub PAT (read:repo). Without it, mock data is served. |
| `PORT` | `3001` | Backend port |
| `NUGET_CACHE_TTL` | `300` | NuGet cache TTL in seconds |
| `GITHUB_CACHE_TTL` | `60` | GitHub cache TTL in seconds |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/nuget/stats` | Download counts for all 8 NuGet packages |
| GET | `/api/github/stars` | Star counts for all 6 repos |
| GET | `/api/github/actions` | Latest CI run status per repo |
| GET | `/api/ecosystem/health` | Full repo metadata + activity events |
| GET | `/api/ecosystem/greenscore` | Green Score per repo + average |
| GET | `/api/health` | Backend liveness check |

## Mock Data

When `GITHUB_TOKEN` is not set, all endpoints return realistic mock data.
Mock responses include the header `X-Data-Source: mock`.

## Architecture

```
frontend (Vite + React 18 + Tailwind)
    → proxy /api → backend (Express + TypeScript)
                       → NuGet API  (TTL 300s)
                       → GitHub API (TTL 60s)
                       → mock.ts    (fallback)
```

## Monitored Resources

**Repos:** MonadicSharp · MonadicSharp.Framework · MonadicSharp.Azure · MonadicLeaf · monadic-sharp-mcp · MonadicSharp-OpenCode

**NuGet packages:** MonadicSharp · MonadicSharp.Agents · MonadicSharp.Caching · MonadicSharp.Http · MonadicSharp.Persistence · MonadicSharp.Security · MonadicSharp.Telemetry · MonadicForge
