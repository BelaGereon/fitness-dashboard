import { describe, expect, it } from "vitest";
import { getWeekExportFilename, serializeWeekExport } from "./HighlightedCard";
import { createWeekExportPayload } from "../data/download/download";
import type { FitnessWeek } from "../fitnessTypes";

describe("HighlightedCard export helpers", () => {
  it("creates a payload with computed week rows", () => {
    const weeks: FitnessWeek[] = [
      {
        id: "week-1",
        weekOf: "2026-01-05",
        days: {
          mon: { weightKg: 80, calories: 2600, proteinG: 150 },
          tue: { weightKg: 79.5, calories: 2400, proteinG: 140 },
        },
      },
      {
        id: "week-0",
        weekOf: "2025-12-29",
        days: {
          mon: { weightKg: 81, calories: 2800, proteinG: 170 },
        },
      },
    ];
    const now = new Date("2026-02-04T10:00:00.000Z");

    const payload = createWeekExportPayload(weeks, now);

    expect(payload.generatedAt).toBe("2026-02-04T10:00:00.000Z");
    expect(payload.weeks).toHaveLength(2);
    expect(payload.weeks[0].weekOf).toBe("2026-01-05");
    expect(payload.weeks[0].computedValues.avgWeightKg).toBe(79.8);
    expect(payload.weeks[0].computedValues.avgWeightDeltaKg).toBe(-1.2);
  });

  it("serializes the export payload as formatted JSON", () => {
    const payload = createWeekExportPayload(
      [],
      new Date("2026-02-04T10:00:00Z"),
    );
    const json = serializeWeekExport(payload);

    expect(json).toContain('"generatedAt": "2026-02-04T10:00:00.000Z"');
    expect(json).toContain('"weeks": []');
  });

  it("builds a dated filename", () => {
    const filename = getWeekExportFilename(new Date("2026-02-04T10:00:00Z"));
    expect(filename).toBe("fitness-dashboard-weeks-2026-02-04.json");
  });
});
