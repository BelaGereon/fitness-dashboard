import { useMemo } from "react";
import type { FitnessWeek, WeekDayKey } from "../fitnessTypes";
import { useFitnessWeeks } from "./FitnessWeeksData";

const dayKeys: WeekDayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const dayOffsets: Record<WeekDayKey, number> = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
};

type WeightHistorySeries = {
  labels: string[];
  weights: Array<number | null>;
  avgWeights: Array<number | null>;
  yAxisMin?: number;
  yAxisMax?: number;
};

type WeightHistorySummary = {
  latestWeight: number | null;
  changePercent: number | null;
};

function getAvgWeightForWeek(week: FitnessWeek): number | null {
  const dayWeights: number[] = [];
  dayKeys.forEach((dayKey) => {
    const day = week.days?.[dayKey];
    if (day && typeof day.weightKg === "number") {
      dayWeights.push(day.weightKg);
    }
  });
  if (dayWeights.length === 0) {
    return null;
  }
  const total = dayWeights.reduce((sum, weight) => sum + weight, 0);
  return total / dayWeights.length;
}

function getLastLoggedDayKey(week: FitnessWeek): WeekDayKey | null {
  for (let i = dayKeys.length - 1; i >= 0; i -= 1) {
    const dayKey = dayKeys[i];
    const day = week.days?.[dayKey];
    if (day && typeof day.weightKg === "number") {
      return dayKey;
    }
  }
  return null;
}

function buildSeries(weeks: FitnessWeek[]): WeightHistorySeries {
  const labels: string[] = [];
  const weights: Array<number | null> = [];
  const avgWeights: Array<number | null> = [];

  weeks.forEach((week, weekIndex) => {
    const weekStart = new Date(`${week.weekOf}T00:00:00`);
    const weekAvg = getAvgWeightForWeek(week);
    const isLastWeek = weekIndex === weeks.length - 1;
    const lastLoggedDayKey = isLastWeek ? getLastLoggedDayKey(week) : null;
    const avgDayKey = isLastWeek ? lastLoggedDayKey : "mon";

    dayKeys.forEach((dayKey) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(dayDate.getDate() + dayOffsets[dayKey]);
      const dateLabel = dayDate.toLocaleDateString("en-DE", {
        month: "short",
        day: "numeric",
      });

      labels.push(`${dateLabel}`);

      const day = week.days?.[dayKey];
      weights.push(typeof day?.weightKg === "number" ? day.weightKg : null);

      avgWeights.push(
        weekAvg !== null && avgDayKey === dayKey ? weekAvg : null,
      );
    });
  });

  const definedWeights = weights.filter(
    (value): value is number => typeof value === "number",
  );
  const yAxisMin =
    definedWeights.length > 0 ? Math.min(...definedWeights) - 5 : undefined;
  const yAxisMax =
    definedWeights.length > 0 ? Math.max(...definedWeights) + 5 : undefined;

  return { labels, weights, avgWeights, yAxisMin, yAxisMax };
}

function buildSummary(weights: Array<number | null>): WeightHistorySummary {
  const definedWeights = weights.filter(
    (value): value is number => typeof value === "number",
  );
  const latestWeight =
    definedWeights.length > 0
      ? definedWeights[definedWeights.length - 1]
      : null;
  const firstWeight = definedWeights.length > 0 ? definedWeights[0] : null;
  const changePercent =
    latestWeight !== null && firstWeight
      ? ((latestWeight - firstWeight) / firstWeight) * 100
      : null;

  return { latestWeight, changePercent };
}

export function useWeightHistoryData() {
  const { weeks } = useFitnessWeeks();
  const series = useMemo(() => buildSeries(weeks), [weeks]);
  const summary = useMemo(() => buildSummary(series.weights), [series]);
  return { series, summary };
}

export function useWeightHistorySeries() {
  return useWeightHistoryData().series;
}

export function useWeightHistorySummary() {
  return useWeightHistoryData().summary;
}
