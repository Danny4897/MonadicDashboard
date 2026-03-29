const BASE = '/api';

export interface NugetStats {
  totalDownloads: number;
  packages: Array<{ id: string; version: string; totalDownloads: number; description: string }>;
  weekSeries: number[];
  deltaPercent: number;
}

export interface GithubStars {
  totalStars: number;
  repos: Array<{ name: string; stars: number }>;
  weekSeries: number[];
  deltaPercent: number;
}

export interface CiRun {
  repo: string;
  status: string;
  conclusion: string | null;
  runNumber: number;
  updatedAt: string;
}

export interface GithubActions {
  runs: CiRun[];
  summary: string;
  failingCount: number;
}

export interface RepoHealth {
  name: string;
  stars: number;
  forks: number;
  lastRelease: string;
  lastCommit: string;
  ciStatus: string;
  nugetVersion: string;
  nugetDownloads: number;
  description: string;
  url: string;
}

export interface Activity {
  id: string;
  repo: string;
  type: string;
  actor: string;
  description: string;
  createdAt: string;
}

export interface EcosystemHealth {
  repos: RepoHealth[];
  activities: Activity[];
}

export interface GreenScoreItem {
  repo: string;
  score: number;
}

export interface GreenScore {
  average: number;
  scores: GreenScoreItem[];
  weekSeries: number[];
  deltaPercent: number;
}

export interface DashboardData {
  nuget: NugetStats;
  stars: GithubStars;
  actions: GithubActions;
  ecosystem: EcosystemHealth;
  greenScore: GreenScore;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

export async function fetchAll(): Promise<DashboardData> {
  const [nuget, stars, actions, ecosystem, greenScore] = await Promise.all([
    get<NugetStats>('/nuget/stats'),
    get<GithubStars>('/github/stars'),
    get<GithubActions>('/github/actions'),
    get<EcosystemHealth>('/ecosystem/health'),
    get<GreenScore>('/ecosystem/greenscore'),
  ]);
  return { nuget, stars, actions, ecosystem, greenScore };
}
