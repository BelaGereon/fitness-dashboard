import { describe, expect, it, vi } from "vitest";
import { isValidElement } from "react";
import { createWeekHistoryColumns } from "./weekHistoryGridData";

vi.mock("@mui/x-data-grid", () => ({
  GridActionsCellItem: () => null,
}));

describe("createWeekHistoryColumns", () => {
  it("formats the week range as start - end", () => {
    const columns = createWeekHistoryColumns();
    const weekColumn = columns.find((column) => column.field === "weekOf");

    expect(
      weekColumn?.valueFormatter?.(
        "2025-12-29" as never,
        {} as any,
        {} as any,
        {} as any,
      ),
    ).toBe("Dec 29 - Jan 4, 2026");
  });

  it("formats delta values with a sign", () => {
    const columns = createWeekHistoryColumns();
    const deltaColumn = columns.find(
      (column) => column.field === "avgWeightDeltaKg",
    );

    expect(
      deltaColumn?.valueFormatter?.(
        0.6 as never,
        {} as any,
        {} as any,
        {} as any,
      ),
    ).toBe("+0.6");
    expect(
      deltaColumn?.valueFormatter?.(
        -0.4 as never,
        {} as any,
        {} as any,
        {} as any,
      ),
    ).toBe("-0.4");
  });

  it("renders weight sparkline only when data exists", () => {
    const columns = createWeekHistoryColumns();
    const weightColumn = columns.find(
      (column) => column.field === "dailyWeights",
    );

    const emptyRender = weightColumn?.renderCell?.({
      value: [null, null, null, null, null, null, null],
      colDef: { computedWidth: 120 },
    } as any);
    expect(emptyRender).toBeNull();

    const filledRender = weightColumn?.renderCell?.({
      value: [80, null, 80.5, null, 79.8, null, 80.2],
      colDef: { computedWidth: 120 },
    } as any);
    expect(isValidElement(filledRender)).toBe(true);
  });
});
