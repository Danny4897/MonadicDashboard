interface GreenScoreGaugeProps {
  value: number;
}

function scoreColor(val: number): string {
  // Interpolate from red (0) through yellow (50) to green (100)
  if (val <= 50) {
    const t = val / 50;
    const r = 239;
    const g = Math.round(68 + (180 - 68) * t);
    const b = 44;
    return `rgb(${r},${g},${b})`;
  } else {
    const t = (val - 50) / 50;
    const r = Math.round(239 - (239 - 0) * t);
    const g = Math.round(180 + (255 - 180) * t);
    const b = Math.round(44 - 44 * t);
    return `rgb(${r},${g},${b})`;
  }
}

export function GreenScoreGauge({ value }: GreenScoreGaugeProps) {
  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  // Use 270° arc (three-quarters circle), starting from bottom-left
  const arcFraction = 0.75;
  const arcLength = circumference * arcFraction;
  const dashOffset = arcLength - (arcLength * Math.min(100, Math.max(0, value))) / 100;

  const color = scoreColor(value);
  // Start angle: 135° (bottom-left), so rotate SVG -225° or use transform
  const startAngle = 135;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#30363d"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${cx} ${cy})`}
        />
        {/* Colored progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${cx} ${cy})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.6s ease' }}
        />
        {/* Center value */}
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontWeight="700"
          fontFamily="'JetBrains Mono', monospace"
          fill={color}
        >
          {Math.round(value)}
        </text>
      </svg>
      <span className="text-xs font-mono mt-1" style={{ color: '#8b949e' }}>
        Green Score
      </span>
    </div>
  );
}
