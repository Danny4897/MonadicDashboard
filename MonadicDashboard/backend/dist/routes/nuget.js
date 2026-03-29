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
async function fetchNugetStats() {
    const url = 'https://azuresearch-usnc.nuget.org/query?q=MonadicSharp&prerelease=false&take=50';
    const res = await (0, node_fetch_1.default)(url, { headers: { 'User-Agent': 'MonadicDashboard/1.0' } });
    if (!res.ok)
        throw new Error(`NuGet API error: ${res.status}`);
    const json = (await res.json());
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
router.get('/stats', async (_req, res) => {
    const cached = cache_1.cache.get(CACHE_KEY);
    if (cached) {
        return res.json(cached);
    }
    try {
        const data = await fetchNugetStats();
        cache_1.cache.set(CACHE_KEY, data, NUGET_TTL);
        return res.json(data);
    }
    catch {
        const mock = (0, mock_1.mockNugetStats)();
        res.setHeader('X-Data-Source', 'mock');
        return res.json(mock);
    }
});
exports.default = router;
