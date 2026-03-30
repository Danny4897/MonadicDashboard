interface StatusDotProps {
  status: string;
}

export function StatusDot({ status }: StatusDotProps) {
  const color =
    status === 'passing' || status === 'success'
      ? '#00ff88'
      : status === 'failing' || status === 'failure'
      ? '#ef4444'
      : '#f97316';

  const label =
    status === 'passing' || status === 'success'
      ? 'passing'
      : status === 'failing' || status === 'failure'
      ? 'failing'
      : 'pending';

  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block rounded-full w-2 h-2 flex-shrink-0"
        style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}` }}
      />
      <span style={{ color }} className="text-xs font-mono">
        {label}
      </span>
    </span>
  );
}
