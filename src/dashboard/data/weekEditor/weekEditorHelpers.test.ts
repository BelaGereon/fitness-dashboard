import { describe, expect, it, vi } from "vitest";
import dayjs from "dayjs";
import type { FitnessWeek } from "../../fitnessTypes";
import {
  buildFitnessDayPayload,
  createDayInputsFromWeek,
  createInitialDayInputs,
  getWeekMonday,
  getWeekStartFromWeek,
  parseNumber,
} from "./weekEditorHelpers";

describe("weekEditorHelpers", () => {
  describe("getWeekMonday", () => {
    it("returns the Monday for a mid-week date", () => {
      const result = getWeekMonday(dayjs("2026-01-07"));
      expect(result.format("YYYY-MM-DD")).toBe("2026-01-05");
    });

    it("returns the same day when already Monday", () => {
      const result = getWeekMonday(dayjs("2026-01-05"));
      expect(result.format("YYYY-MM-DD")).toBe("2026-01-05");
    });

    it("returns the Monday for a Sunday date", () => {
      const result = getWeekMonday(dayjs("2026-01-11"));
      expect(result.format("YYYY-MM-DD")).toBe("2026-01-05");
    });
  });

  describe("createInitialDayInputs", () => {
    it("creates empty inputs for all days", () => {
      const inputs = createInitialDayInputs();

      expect(Object.keys(inputs)).toHaveLength(7);
      expect(inputs.mon).toEqual({ weightKg: "", calories: "", proteinG: "" });
      expect(inputs.sun).toEqual({ weightKg: "", calories: "", proteinG: "" });
    });
  });

  describe("createDayInputsFromWeek", () => {
    it("maps numeric day values to strings", () => {
      const week: FitnessWeek = {
        id: "week-1",
        weekOf: "2026-01-05",
        days: {
          mon: { weightKg: 80.5, calories: 2700, proteinG: 160 },
        },
      };

      const inputs = createDayInputsFromWeek(week);

      expect(inputs.mon).toEqual({
        weightKg: "80.5",
        calories: "2700",
        proteinG: "160",
      });
      expect(inputs.tue).toEqual({
        weightKg: "",
        calories: "",
        proteinG: "",
      });
    });
  });

  describe("getWeekStartFromWeek", () => {
    it("normalizes weekOf to Monday", () => {
      const week: FitnessWeek = {
        id: "week-2",
        weekOf: "2026-01-14",
        days: {},
      };

      expect(getWeekStartFromWeek(week).format("YYYY-MM-DD")).toBe(
        "2026-01-12",
      );
    });

    it("falls back to the current week when weekOf is invalid", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-02-04T10:00:00"));

      const week: FitnessWeek = {
        id: "week-3",
        weekOf: "not-a-date",
        days: {},
      };

      expect(getWeekStartFromWeek(week).format("YYYY-MM-DD")).toBe(
        "2026-02-02",
      );

      vi.useRealTimers();
    });
  });

  describe("parseNumber", () => {
    it("returns undefined for empty or invalid input", () => {
      expect(parseNumber("")).toBeUndefined();
      expect(parseNumber("   ")).toBeUndefined();
      expect(parseNumber("nope")).toBeUndefined();
    });

    it("returns numeric values for valid input", () => {
      expect(parseNumber("0")).toBe(0);
      expect(parseNumber("12.5")).toBe(12.5);
    });
  });

  describe("buildFitnessDayPayload", () => {
    it("returns null when no valid numeric fields are present", () => {
      expect(
        buildFitnessDayPayload({ weightKg: "", calories: "", proteinG: "" }),
      ).toBeNull();
    });

    it("returns only parsed numeric fields", () => {
      expect(
        buildFitnessDayPayload({
          weightKg: "80.1",
          calories: "not-a-number",
          proteinG: "140",
        }),
      ).toEqual({
        weightKg: 80.1,
        proteinG: 140,
      });
    });
  });
});
