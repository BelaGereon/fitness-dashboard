import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useCallback } from "react";
import { useFitnessWeeks } from "../data/FitnessWeeksDataProvider";
import { buildWeekHistoryGridRows } from "../data/WeekHistoryGridData";
import type { FitnessWeek } from "../fitnessTypes";

type WeekExportPayload = {
  generatedAt: string;
  weeks: Array<FitnessWeek & { computedValues: ComputedWeekValues }>;
};

type ComputedWeekValues = {
  avgWeightKg: number | null;
  avgWeightDeltaKg: number | null;
  avgCalories: number | null;
  avgProteinG: number | null;
};

function roundToOneDecimal(value: number | null) {
  if (typeof value !== "number") {
    return null;
  }
  return Math.round(value * 10) / 10;
}

export function createWeekExportPayload(
  weeks: FitnessWeek[],
  now: Date = new Date(),
): WeekExportPayload {
  const computedWeeks = buildWeekHistoryGridRows(weeks);
  const computedById = new Map(
    computedWeeks.map((row) => [
      row.id,
      {
        avgWeightKg: roundToOneDecimal(row.avgWeightKg),
        avgWeightDeltaKg: roundToOneDecimal(row.avgWeightDeltaKg),
        avgCalories: roundToOneDecimal(row.avgCalories),
        avgProteinG: roundToOneDecimal(row.avgProteinG),
      },
    ]),
  );

  return {
    generatedAt: now.toISOString(),
    weeks: weeks.map((week) => ({
      ...week,
      computedValues: computedById.get(week.id) ?? {
        avgWeightKg: null,
        avgWeightDeltaKg: null,
        avgCalories: null,
        avgProteinG: null,
      },
    })),
  };
}

export function serializeWeekExport(payload: WeekExportPayload) {
  return JSON.stringify(payload, null, 2);
}

export function getWeekExportFilename(now: Date = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `fitness-dashboard-weeks-${year}-${month}-${day}.json`;
}

function downloadWeekExport(weeks: FitnessWeek[]) {
  const payload = createWeekExportPayload(weeks);
  const data = serializeWeekExport(payload);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getWeekExportFilename();
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function HighlightedCard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { weeks } = useFitnessWeeks();

  const handleDownload = useCallback(() => {
    downloadWeekExport(weeks);
  }, [weeks]);

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <InsightsRoundedIcon />
        <Typography
          component="h2"
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: "600" }}
        >
          Download your data
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: "8px" }}>
          Export your data in JSON format for further analysis with the click of
          a button.
        </Typography>
        <Button
          variant="contained"
          size="small"
          color="primary"
          endIcon={<ChevronRightRoundedIcon />}
          fullWidth={isSmallScreen}
          onClick={handleDownload}
        >
          Download data
        </Button>
      </CardContent>
    </Card>
  );
}
