import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import WeekHistoryDataGrid from "./WeekHistoryDataGrid";
import HighlightedCard from "./HighlightedCard";
import PageViewsBarChart from "./PageViewsBarChart";
import WeightHistoryChart from "./WeightHistoryChart";
import StatCard, { StatCardProps } from "./StatCard";
import Stack from "@mui/material/Stack";
import AddWeekDialog from "./AddWeekDialog";
import {
  useAverageStepsHistoryData,
  useCaloriesHistoryData,
  useProteinHistoryData,
} from "../data/hooks/dataHooks";

function toTrend(changePercent: number | null): StatCardProps["trend"] {
  if (typeof changePercent !== "number") {
    return "neutral";
  }
  if (changePercent > 0) {
    return "up";
  }
  if (changePercent < 0) {
    return "down";
  }
  return "neutral";
}

function toChartData(values: Array<number | null>): number[] {
  const sanitized = values.map((value) => (typeof value === "number" ? value : 0));
  return sanitized.length > 0 ? sanitized : [0];
}

function toRoundedChartData(values: Array<number | null>, decimals: number): number[] {
  const factor = 10 ** decimals;
  const sanitized = values.map((value) => {
    if (typeof value !== "number") {
      return 0;
    }
    return Math.round(value * factor) / factor;
  });
  return sanitized.length > 0 ? sanitized : [0];
}

function toChartLabels(labels: string[], values: Array<number | null>): string[] {
  if (labels.length === values.length && labels.length > 0) {
    return labels.map((label) => {
      const parsed = new Date(`${label}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) {
        return label;
      }
      return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });
  }
  return values.map((_value, index) => `#${index + 1}`);
}

export default function MainGrid() {
  const caloriesHistory = useCaloriesHistoryData();
  const proteinHistory = useProteinHistoryData();
  const averageStepsHistory = useAverageStepsHistoryData();

  const cards: StatCardProps[] = [
    {
      title: "Avg Calories",
      value:
        caloriesHistory.latestValue !== null
          ? `${Math.round(caloriesHistory.latestValue)} kcal`
          : "--",
      interval: "Per week average",
      trend: toTrend(caloriesHistory.changePercent),
      data: toChartData(caloriesHistory.values),
      labels: toChartLabels(caloriesHistory.labels, caloriesHistory.values),
    },
    {
      title: "Avg Protein",
      value:
        proteinHistory.latestValue !== null
          ? `${Math.round(proteinHistory.latestValue)} g`
          : "--",
      interval: "Per week average",
      trend: toTrend(proteinHistory.changePercent),
      data: toRoundedChartData(proteinHistory.values, 1),
      labels: toChartLabels(proteinHistory.labels, proteinHistory.values),
    },
    {
      title: "Avg Steps / Day",
      value:
        averageStepsHistory.latestValue !== null
          ? `${Math.round(averageStepsHistory.latestValue).toLocaleString()}`
          : "--",
      interval: "Weekly average steps per day",
      trend: toTrend(averageStepsHistory.changePercent),
      data: toChartData(averageStepsHistory.values),
      labels: toChartLabels(
        averageStepsHistory.labels,
        averageStepsHistory.values,
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {cards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <WeightHistoryChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Week Data
        </Typography>
        <AddWeekDialog />
      </Stack>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <WeekHistoryDataGrid />
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
