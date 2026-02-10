import { WeekDayKey } from "./data/constants/weekDays";

export type FitnessDay = {
  weightKg?: number;
  calories?: number;
  proteinG?: number;
} & Record<string, unknown>;

export type FitnessWeek = {
  id: string;
  weekOf: string;
  avgStepsPerDay?: number;
  days: Partial<Record<WeekDayKey, FitnessDay>>;
  trainingSessionsDescription?: string;
  totalSets?: number;
  totalVolumeKg?: number;
} & Record<string, unknown>;

export type FitnessWeeksPayload = {
  weeks: FitnessWeek[];
} & Record<string, unknown>;
