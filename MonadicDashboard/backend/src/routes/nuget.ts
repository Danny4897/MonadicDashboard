import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';
import { cache } from '../cache';
import { mockNugetStats } from '../mock';

const router = Router();

const NUGET_PACKAGES = [
  'MonadicSharp',
  'MonadicSharp.Agents',
  'MonadicSharp.Caching',
  'MonadicSharp.Http',
  'MonadicSharp.Persistence',
  'MonadicSharp.Security',
  'MonadicSharp.Telemetry',
  'MonadicForge',
];

const NUGET_TTL = parseInt(process.env.NUGET_CACHE_TTL ?? '300', 10);
const CACHE_KEY = 'nuget:stats';

interface NugetSearchResult {
  data: Array<{
    id: string;
    version: string;
    description: string;
    totalDownloads: number;
  }>;
}

async function fetchNugetStats() {
  const url = 'https://azuresearch-usnc.nuget.org/query?q=MonadicSharp&prerelease=false&take=50';
  const res = await fetch(url, { headers: { 'User-Agent': 'MonadicDashboard/1.0' } });
  if (!res.ok) throw new Error(`NuGet API error: ${res.status}`);
  const json = (await res.json()) as NugetSearchResult;

  const packages = NUGET_PACKAGES.map((pkg) => {
    const found = json.data?.find((d) => d.id.toLowerCase() === pkg.toLowerCase());
    return {
      id: pkg,
      version: found?.version ?? 'unknown',
      totalDownloads: found?.totalDownloads ?? 0,
      description: found?.description ?? '',
    };
  });

  const totalDownloads = packages.reduce((sum, p) => sum + p.totalDownloads, 0);
  return { totalDownloads, packages, weekSeries: [], deltaPercent: 0 };
}

router.get('/stats', async (_req: Request, res: Response) => {
  const cached = cache.get<ReturnType<typeof mockNugetStats>>(CACHE_KEY);
  if (cached) {
    return res.json(cached);
  }

  try {
    const data = await fetchNugetStats();
    cache.set(CACHE_KEY, data, NUGET_TTL);
    return res.json(data);
  } catch {
    const mock = mockNugetStats();
    res.setHeader('X-Data-Source', 'mock');
    return res.json(mock);
  }
});

export default router;
