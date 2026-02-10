import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { StorageAdapterProvider } from "../../../storage/StorageAdapterProvider";
import { createMemoryAdapter } from "../../../storage/testUtils";
import type { FitnessWeek } from "../../fitnessTypes";
import { useFitnessWeeksStorage } from "./useFitnessWeeksStorage";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

const initialWeeks: FitnessWeek[] = [
  {
    id: "initial",
    weekOf: "2026-01-01",
    days: {},
  },
];

const persistedWeeks: FitnessWeek[] = [
  {
    id: "persisted",
    weekOf: "2026-01-08",
    days: {},
  },
];

function createWrapper(adapter: ReturnType<typeof createMemoryAdapter>) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <StorageAdapterProvider adapter={adapter}>
        {children}
      </StorageAdapterProvider>
    );
  };
}

describe("useFitnessWeeksStorage", () => {
  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  });

  it("returns initial weeks when storage is empty", async () => {
    const adapter = createMemoryAdapter();
    const wrapper = createWrapper(adapter);

    const { result } = renderHook(() => useFitnessWeeksStorage(initialWeeks), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });
    expect(result.current.weeks).toEqual(initialWeeks);
  });

  it("loads persisted weeks when storage has data", async () => {
    const adapter = createMemoryAdapter({
      fitnessWeeks: JSON.stringify({ weeks: persistedWeeks }),
    });
    const wrapper = createWrapper(adapter);

    const { result } = renderHook(() => useFitnessWeeksStorage(initialWeeks), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });
    expect(result.current.weeks).toEqual(persistedWeeks);
  });

  it("keeps stored empty weeks instead of falling back to initial", async () => {
    const adapter = createMemoryAdapter({
      fitnessWeeks: JSON.stringify({ weeks: [] }),
    });
    const wrapper = createWrapper(adapter);

    const { result } = renderHook(() => useFitnessWeeksStorage(initialWeeks), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });
    expect(result.current.weeks).toEqual([]);
  });

  it("falls back to initial weeks when stored payload is invalid", async () => {
    const adapter = createMemoryAdapter({
      fitnessWeeks: "{not-json",
    });
    const wrapper = createWrapper(adapter);

    const { result } = renderHook(() => useFitnessWeeksStorage(initialWeeks), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });
    expect(result.current.weeks).toEqual(initialWeeks);
  });

  it("persists updates after hydration", async () => {
    const adapter = createMemoryAdapter();
    const wrapper = createWrapper(adapter);

    const { result } = renderHook(() => useFitnessWeeksStorage(initialWeeks), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });

    act(() => {
      result.current.setWeeks(persistedWeeks);
    });

    await waitFor(async () => {
      const stored = await adapter.getItem("fitnessWeeks");
      expect(stored).toBe(JSON.stringify({ weeks: persistedWeeks }));
    });
  });
});
