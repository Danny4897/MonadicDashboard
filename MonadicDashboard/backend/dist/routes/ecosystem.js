"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const node_fetch_1 = __importDefault(require("node-fetch"));
const cache_1 = require("../cache");
const mock_1 = require("../mock");
const router = (0, express_1.Router)();
const REPOS = [
    'MonadicSharp',
    'MonadicSharp.Framework',
    'MonadicSharp.Azure',
    'MonadicLeaf',
    'monadic-sharp-mcp',
    'MonadicSharp-OpenCode',
];
const GITHUB_TTL = parseInt(process.env.GITHUB_CACHE_TTL ?? '60', 10);
function githubHeaders() {
    const headers = {
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
    const repoResults = await Promise.allSettled(REPOS.map(async (repo) => {
        const [repoRes, eventsRes, actionsRes] = await Promise.allSettled([
            (0, node_fetch_1.default)(`https://api.github.com/repos/Danny4897/${repo}`, { headers: githubHeaders() }),
            (0, node_fetch_1.default)(`https://api.github.com/repos/Danny4897/${repo}/events`, { headers: githubHeaders() }),
            (0, node_fetch_1.default)(`https://api.github.com/repos/Danny4897/${repo}/actions/runs?per_page=1`, { headers: githubHeaders() }),
        ]);
        const repoData = repoRes.status === 'fulfilled' && repoRes.value.ok
            ? (await repoRes.value.json())
            : null;
        const eventsData = eventsRes.status === 'fulfilled' && eventsRes.value.ok
            ? (await eventsRes.value.json())
            : [];
        const actionsData = actionsRes.status === 'fulfilled' && actionsRes.value.ok
            ? (await actionsRes.value.json())
            : null;
        const latestRun = actionsData?.workflow_runs?.[0];
        const ciStatus = latestRun?.conclusion === 'success' ? 'passing' :
            latestRun?.conclusion === 'failure' ? 'failing' : 'pending';
        return {
            name: repo,
            stars: repoData?.stargazers_count ?? 0,
            forks: repoData?.forks_count ?? 0,
            lastRelease: 'n/a',
            lastCommit: repoData?.pushed_at ?? new Date().toISOString(),
            ciStatus,
            nugetVersion: 'n/a',
            nugetDownloads: 0,
            description: repoData?.description ?? '',
            url: `https://github.com/Danny4897/${repo}`,
            events: eventsData.slice(0, 5),
        };
    }));
    const repos = repoResults
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);
    const activities = repos.flatMap((r) => r.events.map((e) => ({
        id: String(e['id'] ?? Math.random()),
        repo: r.name,
        type: String(e['type'] ?? 'PushEvent'),
        actor: String(e['actor']?.['login'] ?? 'Danny4897'),
        description: `${e['type']} on ${r.name}`,
        createdAt: String(e['created_at'] ?? new Date().toISOString()),
    }))).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20);
    return { repos, activities };
}
router.get('/health', async (_req, res) => {
    const cacheKey = 'ecosystem:health';
    const cached = cache_1.cache.get(cacheKey);
    if (cached)
        return res.json(cached);
    if (!hasToken()) {
        const mock = (0, mock_1.mockEcosystemHealth)();
        res.setHeader('X-Data-Source', 'mock');
        return res.json(mock);
    }
    try {
        const data = await fetchEcosystemHealth();
        cache_1.cache.set(cacheKey, data, GITHUB_TTL);
        return res.json(data);
    }
    catch {
        const mock = (0, mock_1.mockEcosystemHealth)();
        res.setHeader('X-Data-Source', 'mock');
        return res.json(mock);
    }
});
router.get('/greenscore', async (_req, res) => {
    const cacheKey = 'ecosystem:greenscore';
    const cached = cache_1.cache.get(cacheKey);
    if (cached)
        return res.json(cached);
    const mock = (0, mock_1.mockGreenScore)();
    res.setHeader('X-Data-Source', 'mock');
    cache_1.cache.set(cacheKey, mock, GITHUB_TTL);
    return res.json(mock);
});
exports.default = router;
