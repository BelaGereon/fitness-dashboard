import { renderHook, waitFor } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FitnessWeek } from "../../fitnessTypes";
import {
  useAverageStepsHistoryData,
  useCaloriesHistoryData,
  useProteinHistoryData,
  useTotalSetsHistoryData,
  useTotalVolumeHistoryData,
  useWeightHistoryData,
} from "./dataHooks";
import { createFitnessWeeksHookWrapper } from "./testUtils";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

const initialWeeks: FitnessWeek[] = [
  {
    id: "week-0",
    weekOf: "2025-12-01",
    avgStepsPerDay: 8000,
    totalSets: 20,
    totalVolumeKg: 0,
    days: {
      mon: { weightKg: 80.2, calories: 2500, proteinG: 160 },
    },
  },
  {
    id: "week-1",
    weekOf: "2025-12-08",
    avgStepsPerDay: 9000,
    totalSets: 24,
    totalVolumeKg: 11000,
    days: {
      mon: { weightKg: 79.2, calories: 2600, proteinG: 150 },
      tue: { weightKg: 79.0, calories: 2400, proteinG: 140 },
    },
  },
];

describe("metric hooks", () => {
  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  });

  it("returns weight series and summary data", async () => {
    const wrapper = createFitnessWeeksHookWrapper(initialWeeks);
    const { result } = renderHook(() => useWeightHistoryData(), { wrapper });

    await waitFor(() => {
      expect(result.current.series.labels.length).toBeGreaterThan(0);
    });

    expect(result.current.series.labels).toHaveLength(14);
    expect(result.current.summary.latestWeight).toBe(79.0);
    expect(result.current.summary.changePercent).toBeCloseTo(-1.5, 2);
  });

  it("returns weekly average calories history", async () => {
    const wrapper = createFitnessWeeksHookWrapper(initialWeeks);
    const { result } = renderHook(() => useCaloriesHistoryData(), { wrapper });

    await waitFor(() => {
      expect(result.current.values.length).toBe(2);
    });

    expect(result.current.labels).toEqual(["2025-12-01", "2025-12-08"]);
    expect(result.current.values).toEqual([2500, 2500]);
    expect(result.current.latestValue).toBe(2500);
    expect(result.current.changePercent).toBe(0);
  });

  it("returns weekly average protein history", async () => {
    const wrapper = createFitnessWeeksHookWrapper(initialWeeks);
    const { result } = renderHook(() => useProteinHistoryData(), { wrapper });

    await waitFor(() => {
      expect(result.current.values.length).toBe(2);
    });

    expect(result.current.labels).toEqual(["2025-12-01", "2025-12-08"]);
    expect(result.current.values).toEqual([160, 145]);
    expect(result.current.latestValue).toBe(145);
    expect(result.current.changePercent).toBeCloseTo(-9.375, 3);
  });

  it("returns average steps history", async () => {
    const wrapper = createFitnessWeeksHookWrapper(initialWeeks);
    const { result } = renderHook(() => useAverageStepsHistoryData(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.values.length).toBe(2);
    });

    expect(result.current.labels).toEqual(["2025-12-01", "2025-12-08"]);
    expect(result.current.values).toEqual([8000, 9000]);
    expect(result.current.latestValue).toBe(9000);
    expect(result.current.changePercent).toBeCloseTo(12.5, 2);
  });

  it("returns total sets history", async () => {
    const wrapper = createFitnessWeeksHookWrapper(initialWeeks);
    const { result } = renderHook(() => useTotalSetsHistoryData(), { wrapper });

    await waitFor(() => {
      expect(result.current.values.length).toBe(2);
    });

    expect(result.current.labels).toEqual(["2025-12-01", "2025-12-08"]);
    expect(result.current.values).toEqual([20, 24]);
    expect(result.current.latestValue).toBe(24);
    expect(result.current.changePercent).toBeCloseTo(20, 2);
  });

  it("returns total volume history and guards zero-baseline percent change", async () => {
    const wrapper = createFitnessWeeksHookWrapper(initialWeeks);
    const { result } = renderHook(() => useTotalVolumeHistoryData(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.values.length).toBe(2);
    });

    expect(result.current.labels).toEqual(["2025-12-01", "2025-12-08"]);
    expect(result.current.values).toEqual([0, 11000]);
    expect(result.current.latestValue).toBe(11000);
    expect(result.current.changePercent).toBeNull();
  });
});
