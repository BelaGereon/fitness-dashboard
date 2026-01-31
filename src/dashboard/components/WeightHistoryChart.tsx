import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";
import type { FitnessWeek, WeekDayKey } from "../fitnessTypes";

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

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

const dayLabels: Record<WeekDayKey, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
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
      const dateLabel = dayDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      labels.push(`${dateLabel} ${dayLabels[dayKey]}`);
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
              {latestWeight !== null ? latestWeight.toFixed(1) : "--"}
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
              min: Math.min(...definedWeights) - 5,
              max: Math.max(...definedWeights) + 5,
            },
          ]}
          series={[
            {
              id: "weight",
              label: "Weight",
              showMark: false,
              curve: "linear",
              area: true,
              data: weights,
            },
          ]}
          height={250}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-weight": {
              fill: "url('#weight')",
            },
          }}
          hideLegend
        >
          <AreaGradient color={theme.palette.primary.dark} id="weight" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
