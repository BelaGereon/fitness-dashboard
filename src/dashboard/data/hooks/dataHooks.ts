import { useMemo } from "react";
import { useFitnessWeeks } from "../FitnessWeeksDataProvider";
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
