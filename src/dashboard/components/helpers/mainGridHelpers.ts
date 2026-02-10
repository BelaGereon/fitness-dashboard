import type { StatCardProps } from "../StatCard";

export function toTrend(changePercent: number | null): StatCardProps["trend"] {
  if (typeof changePercent !== "number") {
    return "neutral";
  }
  if (changePercent > 0) {
    return "up";
  }
  if (changePercent < 0) {
    return "down";
  }
  return "neutral";
}

export function toChartData(
  values: Array<number | null>,
  decimals?: number,
): number[] {
  const factor = typeof decimals === "number" ? 10 ** decimals : null;
  const sanitized = values.map((value) => {
    if (typeof value !== "number") {
      return 0;
    }
    if (factor === null) {
      return value;
    }
    return Math.round(value * factor) / factor;
  });
  return sanitized.length > 0 ? sanitized : [0];
}

export function toChartLabels(
  labels: string[],
  values: Array<number | null>,
): string[] {
  if (labels.length === values.length && labels.length > 0) {
    return labels.map((label) => {
      const parsed = new Date(`${label}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) {
        return label;
      }
      return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });
  }
  return values.map((_value, index) => `#${index + 1}`);
}
