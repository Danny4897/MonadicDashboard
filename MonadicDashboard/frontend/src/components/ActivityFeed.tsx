import { Activity } from '../api';

interface ActivityFeedProps {
  activities: Activity[];
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function eventIcon(type: string): string {
  if (type === 'ReleaseEvent') return '🚀';
  if (type === 'PullRequestEvent') return '📎';
  if (type === 'CreateEvent') return '✨';
  return '🔀';
}

function eventColor(type: string): string {
  if (type === 'ReleaseEvent') return '#f97316';
  if (type === 'PullRequestEvent') return '#8b949e';
  if (type === 'CreateEvent') return '#f0b429';
  return '#00ff88';
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const sorted = [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  return (
    <div className="overflow-auto h-full pr-1">
      <ul className="space-y-1">
        {sorted.map((event) => (
          <li
            key={event.id}
            className="flex items-start gap-2 px-2 py-1.5 rounded text-xs font-mono transition-colors"
            style={{ borderLeft: `2px solid ${eventColor(event.type)}` }}
          >
            <span className="flex-shrink-0 leading-tight">{eventIcon(event.type)}</span>
            <span className="font-semibold flex-shrink-0" style={{ color: '#00ff88', minWidth: '14ch' }}>
              {event.repo}
            </span>
            <span className="flex-1 truncate" style={{ color: '#e6edf3' }}>
              {event.description}
            </span>
            <span className="flex-shrink-0" style={{ color: '#8b949e' }}>
              {relativeTime(event.createdAt)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
