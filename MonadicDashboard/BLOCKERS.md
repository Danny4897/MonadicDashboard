# BLOCKERS.md — MonadicDashboard

> Auto-generated during build. Updated on each run.

## Status: CLEAR

No active blockers.

---

## Resolved

| # | Issue | Resolution |
|---|-------|-----------|
| 1 | `GITHUB_TOKEN` absent at build time | Backend falls back to mock data; header `X-Data-Source: mock` added |
| 2 | NuGet API may return partial results | Packages not found default to `totalDownloads: 0`; no crash |
| 3 | GitHub Actions endpoint returns empty `workflow_runs` | Status defaults to `pending`; UI shows orange dot |
