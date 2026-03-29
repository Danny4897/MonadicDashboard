import { useAutoRefresh } from './hooks/useAutoRefresh';
import { MetricCard } from './components/MetricCard';
import { GreenScoreGauge } from './components/GreenScoreGauge';
import { RepoTable } from './components/RepoTable';
import { ActivityFeed } from './components/ActivityFeed';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ display: 'inline-block' }}
    >
      <circle cx="7" cy="7" r="5" stroke="#30363d" strokeWidth="2" />
      <path d="M7 2 A5 5 0 0 1 12 7" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function App() {
  const { data, loading, error, lastUpdated, refreshing } = useAutoRefresh(60_000);

  const ciSummary = data?.actions.summary ?? '—';
  const ciColor = data?.actions.failingCount === 0 ? '#00ff88' : '#ef4444';

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ backgroundColor: '#0d1117', color: '#e6edf3' }}
    >
      {/* HEADER */}
      <header
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid #30363d', backgroundColor: '#161b22' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-base font-bold font-mono" style={{ color: '#00ff88' }}>
            ◆ MonadicDashboard
          </span>
          <span className="text-xs font-mono" style={{ color: '#8b949e' }}>
            Control Plane · MonadicSharp Ecosystem
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono" style={{ color: '#8b949e' }}>
          {refreshing && (
            <span className="flex items-center gap-1.5">
              <Spinner />
              <span>Refreshing…</span>
            </span>
          )}
          {lastUpdated && !refreshing && (
            <span>Updated {formatTime(lastUpdated)}</span>
          )}
          {error && (
            <span style={{ color: '#ef4444' }}>⚠ {error}</span>
          )}
        </div>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner />
            <span className="text-sm font-mono" style={{ color: '#8b949e' }}>
              Loading ecosystem data…
            </span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4" style={{ minHeight: 0 }}>

          {/* TOP — 4 MetricCards */}
          <div className="grid grid-cols-4 gap-4 flex-shrink-0">
            <MetricCard
              title="Total NuGet Downloads"
              value={(data?.nuget.totalDownloads ?? 0).toLocaleString()}
              delta={data?.nuget.deltaPercent}
              series={data?.nuget.weekSeries}
              accentColor="#00ff88"
            />

            <MetricCard
              title="Total GitHub Stars"
              value={(data?.stars.totalStars ?? 0).toLocaleString()}
              delta={data?.stars.deltaPercent}
              series={data?.stars.weekSeries}
              accentColor="#f0b429"
            />

            <MetricCard
              title="Green Score Medio"
              value={data?.greenScore.average ?? 0}
              delta={data?.greenScore.deltaPercent}
              series={data?.greenScore.weekSeries}
              accentColor="#00ff88"
            >
              <GreenScoreGauge value={data?.greenScore.average ?? 0} />
            </MetricCard>

            <MetricCard
              title="CI/CD Status"
              value={ciSummary}
              accentColor={ciColor}
            >
              <span className="text-xl font-bold font-mono" style={{ color: ciColor }}>
                {ciSummary}
              </span>
            </MetricCard>
          </div>

          {/* MIDDLE + BOTTOM — repo table + activity feed */}
          <div className="flex-1 grid grid-cols-5 gap-4 overflow-hidden" style={{ minHeight: 0 }}>
            {/* RepoTable — 3/5 width */}
            <div
              className="col-span-3 flex flex-col overflow-hidden rounded-lg"
              style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
            >
              <div
                className="px-4 py-2 flex-shrink-0 text-xs font-mono uppercase tracking-wider"
                style={{ color: '#8b949e', borderBottom: '1px solid #30363d' }}
              >
                Repositories
              </div>
              <div className="flex-1 overflow-hidden">
                <RepoTable
                  repos={data?.ecosystem.repos ?? []}
                  ciRuns={data?.actions.runs ?? []}
                />
              </div>
            </div>

            {/* ActivityFeed — 2/5 width */}
            <div
              className="col-span-2 flex flex-col overflow-hidden rounded-lg"
              style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
            >
              <div
                className="px-4 py-2 flex-shrink-0 text-xs font-mono uppercase tracking-wider"
                style={{ color: '#8b949e', borderBottom: '1px solid #30363d' }}
              >
                Activity Feed
              </div>
              <div className="flex-1 overflow-hidden p-2">
                <ActivityFeed activities={data?.ecosystem.activities ?? []} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
