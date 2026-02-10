import {
  serializeWeekExport,
  getWeekExportFilename,
  roundToOneDecimal,
  WeekExportPayload,
} from "../../components/HighlightedCard";
import type { FitnessWeek } from "../../fitnessTypes";
import { buildWeekHistoryGridRows } from "../WeekHistoryGridData";

export function downloadWeekExport(weeks: FitnessWeek[]) {
  const payload = createWeekExportPayload(weeks);
  const data = serializeWeekExport(payload);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getWeekExportFilename();
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
