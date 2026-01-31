import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";

import type { FitnessWeek, WeekDayKey } from "../fitnessTypes";

const dayKeys: WeekDayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const dayOffsets: Record<WeekDayKey, number> = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
};

function getWeightSeries(weeks: FitnessWeek[]) {
  const labels: string[] = [];
  const weights: Array<number | null> = [];

  weeks.forEach((week) => {
    const weekStart = new Date(`${week.weekOf}T00:00:00`);
    dayKeys.forEach((dayKey) => {
      const day = week.days?.[dayKey];
      if (!day) {
        return;
      }
      const dayDate = new Date(weekStart);
      dayDate.setDate(dayDate.getDate() + dayOffsets[dayKey]);
      const dateLabel = dayDate.toLocaleDateString("en-DE", {
        month: "short",
        day: "numeric",
      });
      labels.push(`${dateLabel}`);
      weights.push(typeof day.weightKg === "number" ? day.weightKg : null);
    });
  });

  return { labels, weights };
}

type WeightHistoryChartProps = {
  weeks: FitnessWeek[];
};

export default function WeightHistoryChart({ weeks }: WeightHistoryChartProps) {
  const theme = useTheme();
  const { labels, weights } = getWeightSeries(weeks);
  const definedWeights = weights.filter(
    (value): value is number => typeof value === "number",
  );
  const latestWeight =
    definedWeights.length > 0
      ? definedWeights[definedWeights.length - 1]
      : null;
  const firstWeight = definedWeights.length > 0 ? definedWeights[0] : null;
  const changePercent =
    latestWeight !== null && firstWeight
      ? ((latestWeight - firstWeight) / firstWeight) * 100
      : null;

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  const yAxisMin =
    definedWeights.length > 0 ? Math.min(...definedWeights) - 5 : undefined;
  const yAxisMax =
    definedWeights.length > 0 ? Math.max(...definedWeights) + 5 : undefined;

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Weight History
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {latestWeight !== null ? latestWeight.toFixed(1) + " kg" : "--"}
            </Typography>
            {changePercent !== null && (
              <Chip
                size="small"
                color={changePercent <= 0 ? "success" : "error"}
                label={`${changePercent > 0 ? "+" : ""}${changePercent.toFixed(
                  1,
                )}%`}
              />
            )}
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Daily Weight in kg
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "point",
              data: labels,
              tickInterval: (_index, i) => (i + 1) % 5 === 0,
              height: 24,
            },
          ]}
          yAxis={[
            {
              width: 50,
              min: yAxisMin,
              max: yAxisMax,
            },
          ]}
          series={[
            {
              id: "weight",
              label: "Weight",
              showMark: false,
              curve: "linear",
              area: true,
              baseline: yAxisMin,
              data: weights,
              connectNulls: true,
            },
          ]}
          height={250}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-weight": {
              fill: "url('#weight')",
              fillOpacity: 1,
            },
          }}
          hideLegend
        >
          <linearGradient id="weight" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop
              offset="0%"
              stopOpacity={0.1}
              stopColor={theme.palette.primary.main}
            />
            <stop
              offset="100%"
              stopOpacity={0.7}
              stopColor={theme.palette.primary.main}
            />
          </linearGradient>
        </LineChart>
      </CardContent>
    </Card>
  );
}
