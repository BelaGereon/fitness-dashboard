import { useMemo } from "react";
import { useFitnessWeeks } from "../FitnessWeeksDataProvider";
import { buildWeekHistoryGridRows } from "../WeekHistoryGridData";
import { buildSeries, buildSummary } from "../WeightHistoryData";
import type { FitnessWeek } from "../../fitnessTypes";

export type WeeklyMetricHistory = {
  labels: string[];
  values: Array<number | null>;
  latestValue: number | null;
  changePercent: number | null;
};

function buildMetricSummary(values: Array<number | null>) {
  const definedValues = values.filter(
    (value): value is number => typeof value === "number",
  );
  const latestValue =
    definedValues.length > 0 ? definedValues[definedValues.length - 1] : null;
  const firstValue = definedValues.length > 0 ? definedValues[0] : null;
  const changePercent =
    latestValue !== null && firstValue !== null && firstValue !== 0
      ? ((latestValue - firstValue) / firstValue) * 100
      : null;

  return { latestValue, changePercent };
}

function buildWeeklyMetricFromWeeks(
  weeks: FitnessWeek[],
  selector: (week: FitnessWeek) => number | undefined,
): WeeklyMetricHistory {
  const sortedWeeks = [...weeks].sort((a, b) => a.weekOf.localeCompare(b.weekOf));
  const labels = sortedWeeks.map((week) => week.weekOf);
  const values = sortedWeeks.map((week) => {
    const value = selector(week);
    return typeof value === "number" ? value : null;
  });
  const { latestValue, changePercent } = buildMetricSummary(values);

  return { labels, values, latestValue, changePercent };
}

function buildWeeklyMetricFromGridRows(
  weeks: FitnessWeek[],
  selector: (row: ReturnType<typeof buildWeekHistoryGridRows>[number]) => number | null,
): WeeklyMetricHistory {
  const rows = [...buildWeekHistoryGridRows(weeks)].reverse();
  const labels = rows.map((row) => row.weekOf);
  const values = rows.map((row) => selector(row));
  const { latestValue, changePercent } = buildMetricSummary(values);

  return { labels, values, latestValue, changePercent };
}

export function useWeightHistoryData() {
  const { weeks } = useFitnessWeeks();
  const series = useMemo(() => buildSeries(weeks), [weeks]);
  const summary = useMemo(() => buildSummary(series.weights), [series]);
  return { series, summary };
}

export function useWeekHistoryGridRows() {
  const { weeks } = useFitnessWeeks();
  return useMemo(() => buildWeekHistoryGridRows(weeks), [weeks]);
}

export function useCaloriesHistoryData() {
  const { weeks } = useFitnessWeeks();
  return useMemo(
    () => buildWeeklyMetricFromGridRows(weeks, (row) => row.avgCalories),
    [weeks],
  );
}

export function useProteinHistoryData() {
  const { weeks } = useFitnessWeeks();
  return useMemo(
    () => buildWeeklyMetricFromGridRows(weeks, (row) => row.avgProteinG),
    [weeks],
  );
}

export function useAverageStepsHistoryData() {
  const { weeks } = useFitnessWeeks();
  return useMemo(
    () => buildWeeklyMetricFromWeeks(weeks, (week) => week.avgStepsPerDay),
    [weeks],
  );
}

export function useTotalSetsHistoryData() {
  const { weeks } = useFitnessWeeks();
  return useMemo(
    () => buildWeeklyMetricFromWeeks(weeks, (week) => week.totalSets),
    [weeks],
  );
}

export function useTotalVolumeHistoryData() {
  const { weeks } = useFitnessWeeks();
  return useMemo(
    () => buildWeeklyMetricFromWeeks(weeks, (week) => week.totalVolumeKg),
    [weeks],
  );
}
