import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';
import { cache } from '../cache';
import { mockGithubStars, mockGithubActions } from '../mock';

const router = Router();

const REPOS = [
  'MonadicSharp',
  'MonadicSharp.Framework',
  'MonadicSharp.Azure',
  'MonadicLeaf',
  'monadic-sharp-mcp',
  'MonadicSharp-OpenCode',
];

const GITHUB_TTL = parseInt(process.env.GITHUB_CACHE_TTL ?? '60', 10);

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'User-Agent': 'MonadicDashboard/1.0',
    Accept: 'application/vnd.github+json',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

const hasToken = () => !!process.env.GITHUB_TOKEN;

async function fetchRepoStars() {
  const results = await Promise.allSettled(
    REPOS.map(async (repo) => {
      const res = await fetch(`https://api.github.com/repos/Danny4897/${repo}`, {
        headers: githubHeaders(),
      });
      if (!res.ok) throw new Error(`GitHub API ${res.status} for ${repo}`);
      const data = (await res.json()) as {
        stargazers_count: number;
        forks_count: number;
        pushed_at: string;
        name: string;
      };
      return {
        name: repo,
        stars: data.stargazers_count,
        forks: data.forks_count,
        lastCommit: data.pushed_at,
      };
    })
  );

  const repos = results
    .filter((r): r is PromiseFulfilledResult<{ name: string; stars: number; forks: number; lastCommit: string }> => r.status === 'fulfilled')
    .map((r) => r.value);

  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  return { totalStars, repos, weekSeries: [], deltaPercent: 0 };
}

async function fetchActionsStatus() {
  const results = await Promise.allSettled(
    REPOS.map(async (repo) => {
      const res = await fetch(
        `https://api.github.com/repos/Danny4897/${repo}/actions/runs?per_page=1`,
        { headers: githubHeaders() }
      );
      if (!res.ok) throw new Error(`GitHub Actions API ${res.status} for ${repo}`);
      const data = (await res.json()) as {
        workflow_runs: Array<{ status: string; conclusion: string | null; run_number: number; updated_at: string }>;
      };
      const run = data.workflow_runs[0];
      return {
        repo,
        status: run?.conclusion === 'success' ? 'passing' : run?.conclusion === 'failure' ? 'failing' : 'pending',
        conclusion: run?.conclusion ?? null,
        runNumber: run?.run_number ?? 0,
        updatedAt: run?.updated_at ?? new Date().toISOString(),
      };
    })
  );

  const runs = results
    .filter((r): r is PromiseFulfilledResult<{ repo: string; status: string; conclusion: string | null; runNumber: number; updatedAt: string }> => r.status === 'fulfilled')
    .map((r) => r.value);

  const failing = runs.filter((r) => r.status === 'failing').length;
  return {
    runs,
    summary: failing === 0 ? 'All passing' : `${failing} failing`,
    failingCount: failing,
  };
}

router.get('/stars', async (_req: Request, res: Response) => {
  const cacheKey = 'github:stars';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  if (!hasToken()) {
    const mock = mockGithubStars();
    res.setHeader('X-Data-Source', 'mock');
    return res.json(mock);
  }

  try {
    const data = await fetchRepoStars();
    cache.set(cacheKey, data, GITHUB_TTL);
    return res.json(data);
  } catch {
    const mock = mockGithubStars();
    res.setHeader('X-Data-Source', 'mock');
    return res.json(mock);
  }
});

router.get('/actions', async (_req: Request, res: Response) => {
  const cacheKey = 'github:actions';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  if (!hasToken()) {
    const mock = mockGithubActions();
    res.setHeader('X-Data-Source', 'mock');
    return res.json(mock);
  }

  try {
    const data = await fetchActionsStatus();
    cache.set(cacheKey, data, GITHUB_TTL);
    return res.json(data);
  } catch {
    const mock = mockGithubActions();
    res.setHeader('X-Data-Source', 'mock');
    return res.json(mock);
  }
});

export default router;
