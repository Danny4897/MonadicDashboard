import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nugetRouter from './routes/nuget';
import githubRouter from './routes/github';
import ecosystemRouter from './routes/ecosystem';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/nuget', nugetRouter);
app.use('/api/github', githubRouter);
app.use('/api/ecosystem', ecosystemRouter);

// greenscore is served from ecosystem router, expose at /api/greenscore too
app.get('/api/greenscore/summary', async (req, res) => {
  req.url = '/greenscore';
  ecosystemRouter(req, res, () => {
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
