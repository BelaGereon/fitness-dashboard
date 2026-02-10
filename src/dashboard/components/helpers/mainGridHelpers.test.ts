import { describe, expect, it } from "vitest";
import { toChartData, toChartLabels, toTrend } from "./mainGridHelpers";

describe("mainGridHelpers", () => {
  describe("toTrend", () => {
    it("maps null and zero to neutral", () => {
      expect(toTrend(null)).toBe("neutral");
      expect(toTrend(0)).toBe("neutral");
    });

    it("maps positive and negative values", () => {
      expect(toTrend(1.5)).toBe("up");
      expect(toTrend(-0.5)).toBe("down");
    });
  });

  describe("toChartData", () => {
    it("replaces null values with 0", () => {
      expect(toChartData([10, null, 20])).toEqual([10, 0, 20]);
    });

    it("rounds numeric values when decimals are provided", () => {
      expect(toChartData([145.14, 149.99, null], 1)).toEqual([145.1, 150, 0]);
    });

    it("returns a fallback data point for empty arrays", () => {
      expect(toChartData([])).toEqual([0]);
    });
  });

  describe("toChartLabels", () => {
    it("formats ISO week labels when lengths match", () => {
      expect(toChartLabels(["2026-02-02", "2026-02-09"], [1, 2])).toEqual([
        "Feb 2",
        "Feb 9",
      ]);
    });

    it("returns original label when it is not parseable as a date", () => {
      expect(toChartLabels(["Week A"], [1])).toEqual(["Week A"]);
    });

    it("returns indexed fallback labels when lengths do not match", () => {
      expect(toChartLabels(["2026-02-02"], [1, 2, 3])).toEqual([
        "#1",
        "#2",
        "#3",
      ]);
    });
  });
});
