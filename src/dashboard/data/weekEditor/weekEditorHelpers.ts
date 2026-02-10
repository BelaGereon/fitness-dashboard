import dayjs, { type Dayjs } from "dayjs";
import type { FitnessDay, FitnessWeek } from "../../fitnessTypes";
import type { WeekDayKey } from "../constants/weekDays";
import { weekDayKeys } from "../constants/weekDays";

export type DayInputs = {
  weightKg: string;
  calories: string;
  proteinG: string;
};

export function getWeekMonday(value: Dayjs) {
  const date = value.toDate();
  const dayOfWeek = date.getDay();
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  date.setDate(date.getDate() + offset);
  return dayjs(date).startOf("day");
}

export function createInitialDayInputs(): Record<WeekDayKey, DayInputs> {
  return weekDayKeys.reduce(
    (acc, dayKey) => {
      acc[dayKey] = {
        weightKg: "",
        calories: "",
        proteinG: "",
      };
      return acc;
    },
    {} as Record<WeekDayKey, DayInputs>,
  );
}

export function createDayInputsFromWeek(
  week?: FitnessWeek,
): Record<WeekDayKey, DayInputs> {
  if (!week) {
    return createInitialDayInputs();
  }

  return weekDayKeys.reduce(
    (acc, dayKey) => {
      const day = week.days?.[dayKey];
      acc[dayKey] = {
        weightKg: typeof day?.weightKg === "number" ? String(day.weightKg) : "",
        calories: typeof day?.calories === "number" ? String(day.calories) : "",
        proteinG: typeof day?.proteinG === "number" ? String(day.proteinG) : "",
      };
      return acc;
    },
    {} as Record<WeekDayKey, DayInputs>,
  );
}

export function getWeekStartFromWeek(week?: FitnessWeek) {
  if (!week?.weekOf) {
    return getWeekMonday(dayjs());
  }
  const parsed = dayjs(week.weekOf);
  return parsed.isValid() ? getWeekMonday(parsed) : getWeekMonday(dayjs());
}

export function parseNumber(value: string) {
  if (!value.trim()) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function buildFitnessDayPayload(inputs: DayInputs): FitnessDay | null {
  const weightKg = parseNumber(inputs.weightKg);
  const calories = parseNumber(inputs.calories);
  const proteinG = parseNumber(inputs.proteinG);

  if (
    typeof weightKg !== "number" &&
    typeof calories !== "number" &&
    typeof proteinG !== "number"
  ) {
    return null;
  }

  return {
    ...(typeof weightKg === "number" ? { weightKg } : {}),
    ...(typeof calories === "number" ? { calories } : {}),
    ...(typeof proteinG === "number" ? { proteinG } : {}),
  };
}
