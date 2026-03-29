import { RepoHealth } from '../api';
import { StatusDot } from './StatusDot';

interface RepoTableProps {
  repos: RepoHealth[];
  ciRuns: Array<{ repo: string; status: string }>;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function RepoTable({ repos, ciRuns }: RepoTableProps) {
  const ciMap = Object.fromEntries(ciRuns.map((r) => [r.repo, r.status]));

  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-sm font-mono border-collapse">
        <thead>
          <tr style={{ borderBottom: '1px solid #30363d' }}>
            {['Repo', 'Stars', 'Last Commit', 'CI', 'NuGet Version', 'Downloads'].map((col) => (
              <th
                key={col}
                className="text-left px-3 py-2 text-xs uppercase tracking-wider"
                style={{ color: '#8b949e', whiteSpace: 'nowrap' }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {repos.map((repo) => {
            const ci = ciMap[repo.name] ?? repo.ciStatus;
            return (
              <tr
                key={repo.name}
                className="group transition-colors"
                style={{
                  borderBottom: '1px solid #30363d',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.borderColor = '#00ff88';
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'rgba(0,255,136,0.04)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.borderColor = '#30363d';
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
                }}
              >
                <td className="px-3 py-2">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline"
                    style={{ color: '#00ff88' }}
                  >
                    {repo.name}
                  </a>
                </td>
                <td className="px-3 py-2" style={{ color: '#f0b429' }}>
                  ★ {repo.stars}
                </td>
                <td className="px-3 py-2 text-xs" style={{ color: '#8b949e', whiteSpace: 'nowrap' }}>
                  {relativeTime(repo.lastCommit)}
                </td>
                <td className="px-3 py-2">
                  <StatusDot status={ci} />
                </td>
                <td className="px-3 py-2" style={{ color: '#e6edf3' }}>
                  {repo.nugetVersion !== 'n/a' ? (
                    <span className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(0,255,136,0.1)', color: '#00ff88' }}>
                      {repo.nugetVersion}
                    </span>
                  ) : (
                    <span style={{ color: '#8b949e' }}>—</span>
                  )}
                </td>
                <td className="px-3 py-2" style={{ color: '#e6edf3' }}>
                  {repo.nugetDownloads > 0 ? repo.nugetDownloads.toLocaleString() : <span style={{ color: '#8b949e' }}>—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
