import { useMemo } from "react";
import { useFitnessWeeks } from "../FitnessWeeksDataProvider";
import { buildWeekHistoryGridRows } from "../WeekHistoryGridData";
import { buildSeries, buildSummary } from "../WeightHistoryData";

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

export function useWeekHistoryGridRows() {
  const { weeks } = useFitnessWeeks();
  return useMemo(() => buildWeekHistoryGridRows(weeks), [weeks]);
}
