import { Sparkline } from './Sparkline';

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: number;
  series?: number[];
  accentColor?: string;
  children?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  delta,
  series,
  accentColor = '#00ff88',
  children,
}: MetricCardProps) {
  const deltaPositive = (delta ?? 0) >= 0;
  const deltaDisplay = delta !== undefined
    ? `${deltaPositive ? '+' : ''}${delta.toFixed(1)}%`
    : null;

  return (
    <div
      className="flex flex-col justify-between p-4 rounded-lg"
      style={{
        backgroundColor: '#161b22',
        border: '1px solid #30363d',
        minWidth: 0,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#8b949e' }}>
          {title}
        </span>
        {deltaDisplay && (
          <span
            className="text-xs font-mono px-1.5 py-0.5 rounded"
            style={{
              color: deltaPositive ? '#00ff88' : '#ef4444',
              backgroundColor: deltaPositive ? 'rgba(0,255,136,0.1)' : 'rgba(239,68,68,0.1)',
            }}
          >
            {deltaDisplay}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <div>
          {children ? (
            children
          ) : (
            <span
              className="text-2xl font-bold font-mono leading-none"
              style={{ color: accentColor }}
            >
              {value}
            </span>
          )}
        </div>
        {series && series.length > 1 && (
          <div className="flex-shrink-0">
            <Sparkline data={series} color={accentColor} />
          </div>
        )}
      </div>
    </div>
  );
}
