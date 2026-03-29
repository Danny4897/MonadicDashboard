"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOCK_ACTIVITIES = exports.MOCK_NUGET_PACKAGES = exports.MOCK_REPOS = void 0;
exports.mockNugetStats = mockNugetStats;
exports.mockGithubStars = mockGithubStars;
exports.mockGithubActions = mockGithubActions;
exports.mockEcosystemHealth = mockEcosystemHealth;
exports.mockGreenScore = mockGreenScore;
exports.MOCK_REPOS = [
    {
        name: 'MonadicSharp',
        stars: 42,
        forks: 8,
        lastRelease: 'v1.4.0',
        lastCommit: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        ciStatus: 'passing',
        nugetVersion: '1.4.0',
        nugetDownloads: 1234,
        description: 'Core Railway-Oriented Programming library for C#',
    },
    {
        name: 'MonadicSharp.Framework',
        stars: 28,
        forks: 5,
        lastRelease: 'v1.2.0',
        lastCommit: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        ciStatus: 'passing',
        nugetVersion: '1.2.0',
        nugetDownloads: 876,
        description: 'Meta-package: Agents, Caching, Http, Persistence, Security, Telemetry',
    },
    {
        name: 'MonadicSharp.Azure',
        stars: 19,
        forks: 3,
        lastRelease: 'v0.9.0',
        lastCommit: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        ciStatus: 'passing',
        nugetVersion: '0.9.0',
        nugetDownloads: 543,
        description: '7 Azure integration packages for MonadicSharp',
    },
    {
        name: 'MonadicLeaf',
        stars: 18,
        forks: 2,
        lastRelease: 'v0.3.0',
        lastCommit: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        ciStatus: 'passing',
        nugetVersion: '0.3.0',
        nugetDownloads: 456,
        description: 'CLI dotnet forge + Roslyn analyzer GC001–GC010',
    },
    {
        name: 'monadic-sharp-mcp',
        stars: 14,
        forks: 1,
        lastRelease: 'v0.2.0',
        lastCommit: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        ciStatus: 'pending',
        nugetVersion: 'n/a',
        nugetDownloads: 0,
        description: 'MCP server with 5 resources and 21 tool scenarios',
    },
    {
        name: 'MonadicSharp-OpenCode',
        stars: 11,
        forks: 1,
        lastRelease: 'v0.1.0',
        lastCommit: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        ciStatus: 'passing',
        nugetVersion: 'n/a',
        nugetDownloads: 0,
        description: 'OpenCode integration with agents and skills',
    },
];
exports.MOCK_NUGET_PACKAGES = [
    { id: 'MonadicSharp', version: '1.4.0', totalDownloads: 1234, description: 'Core ROP library' },
    { id: 'MonadicSharp.Agents', version: '1.2.0', totalDownloads: 678, description: 'Agent abstractions' },
    { id: 'MonadicSharp.Caching', version: '1.2.0', totalDownloads: 512, description: 'Caching layer' },
    { id: 'MonadicSharp.Http', version: '1.2.0', totalDownloads: 489, description: 'HTTP client wrappers' },
    { id: 'MonadicSharp.Persistence', version: '1.2.0', totalDownloads: 401, description: 'Persistence adapters' },
    { id: 'MonadicSharp.Security', version: '1.2.0', totalDownloads: 356, description: 'Security utilities' },
    { id: 'MonadicSharp.Telemetry', version: '1.2.0', totalDownloads: 298, description: 'Telemetry integration' },
    { id: 'MonadicForge', version: '0.3.0', totalDownloads: 456, description: 'CLI tool and Roslyn analyzers' },
];
function randomSeries(base, days = 7) {
    const result = [];
    let val = base;
    for (let i = 0; i < days; i++) {
        val += Math.floor(Math.random() * 20) - 5;
        result.push(Math.max(0, val));
    }
    return result;
}
exports.MOCK_ACTIVITIES = [
    { id: '1', repo: 'MonadicSharp', type: 'PushEvent', actor: 'Danny4897', description: 'feat: add WithRetry overload with jitter', createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString() },
    { id: '2', repo: 'MonadicLeaf', type: 'ReleaseEvent', actor: 'Danny4897', description: 'Release v0.3.0 — GC010 analyzer added', createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
    { id: '3', repo: 'MonadicSharp.Framework', type: 'PullRequestEvent', actor: 'Danny4897', description: 'PR #12: CachingAgentWrapper improvements', createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString() },
    { id: '4', repo: 'MonadicSharp', type: 'PushEvent', actor: 'Danny4897', description: 'fix: ValidatedResult boundary null check', createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString() },
    { id: '5', repo: 'MonadicSharp.Azure', type: 'PushEvent', actor: 'Danny4897', description: 'feat: Azure Service Bus adapter', createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString() },
    { id: '6', repo: 'monadic-sharp-mcp', type: 'CreateEvent', actor: 'Danny4897', description: 'branch: feature/tool-6-scenario', createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString() },
    { id: '7', repo: 'MonadicSharp', type: 'PushEvent', actor: 'Danny4897', description: 'docs: update README with green-code rules', createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString() },
    { id: '8', repo: 'MonadicSharp.Framework', type: 'PushEvent', actor: 'Danny4897', description: 'refactor: CircuitBreaker threshold config', createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString() },
    { id: '9', repo: 'MonadicLeaf', type: 'PushEvent', actor: 'Danny4897', description: 'chore: bump NuGet deps', createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString() },
    { id: '10', repo: 'MonadicSharp-OpenCode', type: 'ReleaseEvent', actor: 'Danny4897', description: 'Release v0.1.0 — initial publish', createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString() },
    { id: '11', repo: 'MonadicSharp', type: 'PullRequestEvent', actor: 'Danny4897', description: 'PR #23: Partition batch operator', createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString() },
    { id: '12', repo: 'MonadicSharp.Azure', type: 'PushEvent', actor: 'Danny4897', description: 'feat: Cosmos DB Bind extension', createdAt: new Date(Date.now() - 34 * 3600 * 1000).toISOString() },
    { id: '13', repo: 'monadic-sharp-mcp', type: 'PushEvent', actor: 'Danny4897', description: 'feat: resource scenario-22 stub', createdAt: new Date(Date.now() - 38 * 3600 * 1000).toISOString() },
    { id: '14', repo: 'MonadicSharp', type: 'PushEvent', actor: 'Danny4897', description: 'perf: Option<T> struct layout opt', createdAt: new Date(Date.now() - 42 * 3600 * 1000).toISOString() },
    { id: '15', repo: 'MonadicSharp.Framework', type: 'CreateEvent', actor: 'Danny4897', description: 'branch: feature/telemetry-otel', createdAt: new Date(Date.now() - 46 * 3600 * 1000).toISOString() },
];
function mockNugetStats() {
    const totalDownloads = exports.MOCK_NUGET_PACKAGES.reduce((sum, p) => sum + p.totalDownloads, 0);
    const weekSeries = randomSeries(totalDownloads - 100);
    const yesterday = weekSeries[weekSeries.length - 2] ?? totalDownloads - 10;
    const delta = ((totalDownloads - yesterday) / (yesterday || 1)) * 100;
    return {
        totalDownloads,
        packages: exports.MOCK_NUGET_PACKAGES,
        weekSeries,
        deltaPercent: parseFloat(delta.toFixed(1)),
    };
}
function mockGithubStars() {
    const repos = exports.MOCK_REPOS;
    const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
    const weekSeries = randomSeries(totalStars - 10);
    const yesterday = weekSeries[weekSeries.length - 2] ?? totalStars - 2;
    const delta = ((totalStars - yesterday) / (yesterday || 1)) * 100;
    return {
        totalStars,
        repos: repos.map((r) => ({ name: r.name, stars: r.stars })),
        weekSeries,
        deltaPercent: parseFloat(delta.toFixed(1)),
    };
}
function mockGithubActions() {
    const runs = exports.MOCK_REPOS.map((r) => ({
        repo: r.name,
        status: r.ciStatus,
        conclusion: r.ciStatus === 'passing' ? 'success' : r.ciStatus === 'failing' ? 'failure' : null,
        runNumber: Math.floor(Math.random() * 200) + 1,
        updatedAt: r.lastCommit,
    }));
    const failing = runs.filter((r) => r.status === 'failing').length;
    return {
        runs,
        summary: failing === 0 ? 'All passing' : `${failing} failing`,
        failingCount: failing,
    };
}
function mockEcosystemHealth() {
    return {
        repos: exports.MOCK_REPOS.map((r) => ({
            name: r.name,
            stars: r.stars,
            forks: r.forks,
            lastRelease: r.lastRelease,
            lastCommit: r.lastCommit,
            ciStatus: r.ciStatus,
            nugetVersion: r.nugetVersion,
            nugetDownloads: r.nugetDownloads,
            description: r.description,
            url: `https://github.com/Danny4897/${r.name}`,
        })),
        activities: exports.MOCK_ACTIVITIES,
    };
}
function mockGreenScore() {
    const scores = exports.MOCK_REPOS.map((r) => {
        let score = 60;
        if (r.ciStatus === 'passing')
            score += 20;
        if (r.nugetDownloads > 500)
            score += 10;
        if (r.stars > 20)
            score += 10;
        return { repo: r.name, score: Math.min(100, score) };
    });
    const avg = scores.reduce((s, x) => s + x.score, 0) / scores.length;
    const weekSeries = randomSeries(Math.round(avg) - 5);
    const yesterday = weekSeries[weekSeries.length - 2] ?? avg - 1;
    const delta = ((avg - yesterday) / (yesterday || 1)) * 100;
    return {
        average: parseFloat(avg.toFixed(1)),
        scores,
        weekSeries,
        deltaPercent: parseFloat(delta.toFixed(1)),
    };
}
