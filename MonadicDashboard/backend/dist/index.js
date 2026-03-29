"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const nuget_1 = __importDefault(require("./routes/nuget"));
const github_1 = __importDefault(require("./routes/github"));
const ecosystem_1 = __importDefault(require("./routes/ecosystem"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT ?? '3001', 10);
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
app.use('/api/nuget', nuget_1.default);
app.use('/api/github', github_1.default);
app.use('/api/ecosystem', ecosystem_1.default);
// greenscore is served from ecosystem router, expose at /api/greenscore too
app.get('/api/greenscore/summary', async (req, res) => {
    req.url = '/greenscore';
    (0, ecosystem_1.default)(req, res, () => {
        res.status(404).json({ error: 'not found' });
    });
});
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});
app.listen(PORT, () => {
    const tokenStatus = process.env.GITHUB_TOKEN ? 'present (live data)' : 'absent (mock data)';
    console.log(`MonadicDashboard backend running on port ${PORT}`);
    console.log(`GitHub token: ${tokenStatus}`);
});
