import type { FitnessWeek } from "../fitnessTypes";
import type { WeekDayKey } from "./constants/weekDays";
import { weekDayKeys } from "./constants/weekDays";

export type WeekHistoryRow = {
  id: string;
  weekOf: string;
  avgWeightKg: number | null;
  avgWeightDeltaKg: number | null;
  dailyWeights: Array<number | null>;
  avgCalories: number | null;
  avgProteinG: number | null;
  dailyCalories: number[];
};

function getAverage(
  week: FitnessWeek,
  selector: (day: FitnessWeek["days"][WeekDayKey]) => number | undefined,
): number | null {
  const values: number[] = [];

  weekDayKeys.forEach((dayKey) => {
    const value = selector(week.days?.[dayKey]);
    if (typeof value === "number") {
      values.push(value);
    }
  });

  if (values.length === 0) {
    return null;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function getDailyCalories(week: FitnessWeek): number[] {
  return weekDayKeys.map((dayKey) => {
    const calories = week.days?.[dayKey]?.calories;
    return typeof calories === "number" ? calories : 0;
  });
}

function getDailyWeights(week: FitnessWeek): Array<number | null> {
  return weekDayKeys.map((dayKey) => {
    const weight = week.days?.[dayKey]?.weightKg;
    return typeof weight === "number" ? weight : null;
  });
}

export function buildWeekHistoryGridRows(
  weeks: FitnessWeek[],
): WeekHistoryRow[] {
  const sortedWeeks = [...weeks].sort((a, b) =>
    a.weekOf.localeCompare(b.weekOf),
  );

  let previousAvgWeight: number | null = null;

  const rows = sortedWeeks.map((week) => {
    const avgWeight = getAverage(week, (day) => day?.weightKg);
    const avgWeightDelta =
      typeof avgWeight === "number" && typeof previousAvgWeight === "number"
        ? avgWeight - previousAvgWeight
        : null;

    previousAvgWeight = avgWeight;

    return {
      id: week.id,
      weekOf: week.weekOf,
      avgWeightKg: avgWeight,
      avgWeightDeltaKg: avgWeightDelta,
      dailyWeights: getDailyWeights(week),
      avgCalories: getAverage(week, (day) => day?.calories),
      avgProteinG: getAverage(week, (day) => day?.proteinG),
      dailyCalories: getDailyCalories(week),
    };
  });

  return rows.reverse();
}
