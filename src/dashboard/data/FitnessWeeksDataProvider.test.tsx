import { act, renderHook, waitFor } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ReactNode } from "react";
import { StorageAdapterProvider } from "../../storage/StorageAdapterProvider";
import { createMemoryAdapter } from "../../storage/testUtils";
import { FitnessWeeksDataProvider, useFitnessWeeks } from "./FitnessWeeksDataProvider";
import type { FitnessWeek } from "../fitnessTypes";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

const initialWeeks: FitnessWeek[] = [
  {
    id: "week-1",
    weekOf: "2026-01-05",
    days: {},
  },
];

function createWrapper(weeks: FitnessWeek[]) {
  const adapter = createMemoryAdapter();

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <StorageAdapterProvider adapter={adapter}>
        <FitnessWeeksDataProvider initialWeeks={weeks}>
          {children}
        </FitnessWeeksDataProvider>
      </StorageAdapterProvider>
    );
  };
}

describe("FitnessWeeksDataProvider", () => {
  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  });

  it("updates an existing week by id", async () => {
    const wrapper = createWrapper(initialWeeks);
    const { result } = renderHook(() => useFitnessWeeks(), { wrapper });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });

    act(() => {
      result.current.updateWeek({
        id: "week-1",
        weekOf: "2026-01-05",
        avgStepsPerDay: 9000,
        days: {},
      });
    });

    await waitFor(() => {
      expect(result.current.weeks[0]?.avgStepsPerDay).toBe(9000);
    });
  });

  it("adds a new week when the id does not exist", async () => {
    const wrapper = createWrapper(initialWeeks);
    const { result } = renderHook(() => useFitnessWeeks(), { wrapper });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });

    act(() => {
      result.current.updateWeek({
        id: "week-2",
        weekOf: "2026-01-12",
        days: {},
      });
    });

    await waitFor(() => {
      expect(result.current.weeks.length).toBe(2);
    });

    expect(result.current.weeks.some((week) => week.id === "week-2")).toBe(
      true,
    );
  });
});
