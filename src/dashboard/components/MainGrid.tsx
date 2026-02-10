import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import WeekHistoryDataGrid from "./WeekHistoryDataGrid";
import HighlightedCard from "./HighlightedCard";
import WeightHistoryChart from "./WeightHistoryChart";
import StatCard, { StatCardProps } from "./StatCard";
import Stack from "@mui/material/Stack";
import AddWeekDialog from "./AddWeekDialog";
import {
  useAverageStepsHistoryData,
  useCaloriesHistoryData,
  useProteinHistoryData,
} from "../data/hooks/dataHooks";
import { toChartData, toChartLabels, toTrend } from "./helpers/mainGridHelpers";

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
      data: toChartData(proteinHistory.values, 1),
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
        <Grid size={{ xs: 12, md: 12 }}>
          <WeightHistoryChart />
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
