import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";

import { useWeightHistoryData } from "../data/hooks/dataHooks";

export default function WeightHistoryChart() {
  const theme = useTheme();
  const { series, summary } = useWeightHistoryData();
  const { labels, weights, avgWeights, yAxisMin, yAxisMax } = series;
  const { latestWeight, changePercent } = summary;

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
            {
              id: "avgWeight",
              label: "Avg Weight",
              showMark: false,
              curve: "monotoneX",
              data: avgWeights,
              connectNulls: true,
              baseline: yAxisMin,
              color: theme.palette.secondary.main,
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
            "& .MuiLineElement-series-avgWeight": {
              strokeDasharray: "5 5",
            },
          }}
          hideLegend
        >
          <VerticalGradient id="weight" color={theme.palette.primary.main} />
        </LineChart>
      </CardContent>
    </Card>
  );
}

function VerticalGradient({ id, color }: { id: string; color: string }) {
  return (
    <linearGradient id={id} x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stopOpacity={0.1} stopColor={color} />
      <stop offset="100%" stopOpacity={0.7} stopColor={color} />
    </linearGradient>
  );
}
