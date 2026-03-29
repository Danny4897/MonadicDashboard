import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';
import { cache } from '../cache';
import { mockEcosystemHealth, mockGreenScore } from '../mock';

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

async function fetchEcosystemHealth() {
  const repoResults = await Promise.allSettled(
    REPOS.map(async (repo) => {
      const [repoRes, eventsRes, actionsRes] = await Promise.allSettled([
        fetch(`https://api.github.com/repos/Danny4897/${repo}`, { headers: githubHeaders() }),
        fetch(`https://api.github.com/repos/Danny4897/${repo}/events`, { headers: githubHeaders() }),
        fetch(`https://api.github.com/repos/Danny4897/${repo}/actions/runs?per_page=1`, { headers: githubHeaders() }),
      ]);

      const repoData = repoRes.status === 'fulfilled' && repoRes.value.ok
        ? (await repoRes.value.json()) as Record<string, unknown>
        : null;

      const eventsData = eventsRes.status === 'fulfilled' && eventsRes.value.ok
        ? (await eventsRes.value.json()) as Array<Record<string, unknown>>
        : [];

      const actionsData = actionsRes.status === 'fulfilled' && actionsRes.value.ok
        ? (await actionsRes.value.json()) as { workflow_runs: Array<{ conclusion: string | null }> }
        : null;

      const latestRun = actionsData?.workflow_runs?.[0];
      const ciStatus =
        latestRun?.conclusion === 'success' ? 'passing' :
        latestRun?.conclusion === 'failure' ? 'failing' : 'pending';

      return {
        name: repo,
        stars: (repoData?.stargazers_count as number) ?? 0,
        forks: (repoData?.forks_count as number) ?? 0,
        lastRelease: 'n/a',
        lastCommit: (repoData?.pushed_at as string) ?? new Date().toISOString(),
        ciStatus,
        nugetVersion: 'n/a',
        nugetDownloads: 0,
        description: (repoData?.description as string) ?? '',
        url: `https://github.com/Danny4897/${repo}`,
        events: eventsData.slice(0, 5),
      };
    })
  );

  const repos = repoResults
    .filter((r): r is PromiseFulfilledResult<ReturnType<typeof Object.assign>> => r.status === 'fulfilled')
    .map((r) => r.value);

  const activities = repos.flatMap((r) =>
    (r.events as Array<Record<string, unknown>>).map((e) => ({
      id: String(e['id'] ?? Math.random()),
      repo: r.name,
      type: String(e['type'] ?? 'PushEvent'),
      actor: String((e['actor'] as Record<string, unknown>)?.['login'] ?? 'Danny4897'),
      description: `${e['type']} on ${r.name}`,
      createdAt: String(e['created_at'] ?? new Date().toISOString()),
    }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20);

  return { repos, activities };
}

router.get('/health', async (_req: Request, res: Response) => {
  const cacheKey = 'ecosystem:health';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  if (!hasToken()) {
    const mock = mockEcosystemHealth();
    res.setHeader('X-Data-Source', 'mock');
    return res.json(mock);
  }

  try {
    const data = await fetchEcosystemHealth();
    cache.set(cacheKey, data, GITHUB_TTL);
    return res.json(data);
  } catch {
    const mock = mockEcosystemHealth();
    res.setHeader('X-Data-Source', 'mock');
    return res.json(mock);
  }
});

router.get('/greenscore', async (_req: Request, res: Response) => {
  const cacheKey = 'ecosystem:greenscore';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  const mock = mockGreenScore();
  res.setHeader('X-Data-Source', 'mock');
  cache.set(cacheKey, mock, GITHUB_TTL);
  return res.json(mock);
});

export default router;
