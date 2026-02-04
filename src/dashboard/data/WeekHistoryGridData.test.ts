import { describe, expect, it } from "vitest";
import type { FitnessWeek } from "../fitnessTypes";
import { buildWeekHistoryGridRows } from "./WeekHistoryGridData";

const weeks: FitnessWeek[] = [
  {
    id: "week-b",
    weekOf: "2025-12-08",
    days: {
      mon: { weightKg: 79.2, calories: 2600, proteinG: 150 },
      tue: { weightKg: 79.4 },
      thu: { calories: 2800, proteinG: 170 },
      sun: { weightKg: 79.0, calories: 2550, proteinG: 140 },
    },
  },
  {
    id: "week-a",
    weekOf: "2025-12-01",
    days: {
      mon: { weightKg: 80.0, calories: 2500, proteinG: 160 },
      wed: { weightKg: 81.0 },
      fri: { calories: 2300, proteinG: 150 },
      sat: { weightKg: 80.5, calories: 2400, proteinG: 155 },
    },
  },
];

describe("buildWeekHistoryGridRows", () => {
  it("sorts weeks by weekOf and computes averages", () => {
    const rows = buildWeekHistoryGridRows(weeks);

    expect(rows[0].weekOf).toBe("2025-12-08");
    expect(rows[1].weekOf).toBe("2025-12-01");

    expect(rows[1].avgWeightKg).toBeCloseTo(80.5, 3);
    expect(rows[1].avgCalories).toBeCloseTo(2400, 3);
    expect(rows[1].avgProteinG).toBeCloseTo(155, 3);

    expect(rows[0].avgWeightKg).toBeCloseTo(79.2, 3);
    expect(rows[0].avgCalories).toBeCloseTo(2650, 3);
    expect(rows[0].avgProteinG).toBeCloseTo(153.333, 2);
  });

  it("computes delta based on previous week average weight", () => {
    const rows = buildWeekHistoryGridRows(weeks);

    expect(rows[1].avgWeightDeltaKg).toBeNull();
    expect(rows[0].avgWeightDeltaKg).toBeCloseTo(-1.3, 3);
  });

  it("fills daily arrays with nulls/zeros for missing days", () => {
    const rows = buildWeekHistoryGridRows(weeks);

    expect(rows[1].dailyWeights).toHaveLength(7);
    expect(rows[1].dailyWeights).toEqual([
      80.0,
      null,
      81.0,
      null,
      null,
      80.5,
      null,
    ]);

    expect(rows[1].dailyCalories).toEqual([2500, 0, 0, 0, 2300, 2400, 0]);
  });
});
