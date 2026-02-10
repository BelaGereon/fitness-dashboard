type ChartLinearGradientProps = {
  id: string;
  color: string;
  x1?: string;
  y1?: string;
  x2?: string;
  y2?: string;
  startOpacity?: number;
  endOpacity?: number;
};

export function ChartLinearGradient({
  id,
  color,
  x1 = "0%",
  y1 = "100%",
  x2 = "0%",
  y2 = "0%",
  startOpacity = 0.1,
  endOpacity = 0.7,
}: ChartLinearGradientProps) {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      <stop offset="0%" stopOpacity={startOpacity} stopColor={color} />
      <stop offset="100%" stopOpacity={endOpacity} stopColor={color} />
    </linearGradient>
  );
}
