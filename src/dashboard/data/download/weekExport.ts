import type { FitnessWeek } from "../../fitnessTypes";
import { buildWeekHistoryGridRows } from "../WeekHistoryGridData";

type ComputedWeekValues = {
  avgWeightKg: number | null;
  avgWeightDeltaKg: number | null;
  avgCalories: number | null;
  avgProteinG: number | null;
};

export type WeekExportPayload = {
  generatedAt: string;
  weeks: Array<FitnessWeek & { computedValues: ComputedWeekValues }>;
};

export function roundToOneDecimal(value: number | null) {
  if (typeof value !== "number") {
    return null;
  }
  return Math.round(value * 10) / 10;
}

export function serializeWeekExport(payload: WeekExportPayload) {
  return JSON.stringify(payload, null, 2);
}

export function getWeekExportFilename(now: Date = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `fitness-dashboard-weeks-${year}-${month}-${day}.json`;
}

export function createWeekExportPayload(
  weeks: FitnessWeek[],
  now: Date = new Date(),
): WeekExportPayload {
  const computedWeeks = buildWeekHistoryGridRows(weeks);
  const computedById = new Map(
    computedWeeks.map((row) => [
      row.id,
      {
        avgWeightKg: roundToOneDecimal(row.avgWeightKg),
        avgWeightDeltaKg: roundToOneDecimal(row.avgWeightDeltaKg),
        avgCalories: roundToOneDecimal(row.avgCalories),
        avgProteinG: roundToOneDecimal(row.avgProteinG),
      },
    ]),
  );

  return {
    generatedAt: now.toISOString(),
    weeks: weeks.map((week) => ({
      ...week,
      computedValues: computedById.get(week.id) ?? {
        avgWeightKg: null,
        avgWeightDeltaKg: null,
        avgCalories: null,
        avgProteinG: null,
      },
    })),
  };
}
