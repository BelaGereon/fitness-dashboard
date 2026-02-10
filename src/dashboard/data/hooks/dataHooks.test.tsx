import { renderHook, waitFor } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FitnessWeek } from "../../fitnessTypes";
import { useWeekHistoryGridRows } from "./dataHooks";
import { createFitnessWeeksHookWrapper } from "./testUtils";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

const initialWeeks: FitnessWeek[] = [
  {
    id: "week-1",
    weekOf: "2025-12-08",
    days: {
      mon: { weightKg: 79.2, calories: 2600, proteinG: 150 },
    },
  },
  {
    id: "week-0",
    weekOf: "2025-12-01",
    days: {
      mon: { weightKg: 80.2, calories: 2500, proteinG: 160 },
    },
  },
];

describe("useWeekHistoryGridRows", () => {
  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  });

  it("returns rows derived from the fitness weeks provider", async () => {
    const wrapper = createFitnessWeeksHookWrapper(initialWeeks);
    const { result } = renderHook(() => useWeekHistoryGridRows(), { wrapper });

    await waitFor(() => {
      expect(result.current.length).toBe(2);
    });

    expect(result.current[0].weekOf).toBe("2025-12-08");
    expect(result.current[1].weekOf).toBe("2025-12-01");
    expect(result.current[0].avgWeightDeltaKg).toBeCloseTo(-1.0, 2);
  });
});
