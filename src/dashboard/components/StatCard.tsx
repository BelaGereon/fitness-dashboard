import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';
import { ChartLinearGradient } from './charts/ChartLinearGradient';

export type StatCardProps = {
  title: string;
  value: string;
  interval: string;
  trend: 'up' | 'down' | 'neutral';
  data: number[];
  labels?: string[];
};

export default function StatCard({
  title,
  value,
  interval,
  trend,
  data,
  labels,
}: StatCardProps) {
  const theme = useTheme();
  const xAxisLabels =
    labels && labels.length === data.length
      ? labels
      : data.map((_value, index) => `${index + 1}`);

  const labelColors = {
    up: 'success' as const,
    down: 'error' as const,
    neutral: 'default' as const,
  };

  const color = labelColors[trend];
  const chartColor = theme.palette.primary.main;
  const trendValues = { up: '+25%', down: '-25%', neutral: '+5%' };
  const gradientId = `area-gradient-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
        >
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="h4" component="p">
                {value}
              </Typography>
              <Chip size="small" color={color} label={trendValues[trend]} />
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {interval}
            </Typography>
          </Stack>
          <Box sx={{ width: '100%', height: 50 }}>
            <SparkLineChart
              color={chartColor}
              data={data}
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: 'band',
                data: xAxisLabels,
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#${gradientId})`,
                },
              }}
            >
              <defs>
                <ChartLinearGradient
                  id={gradientId}
                  color={chartColor}
                  x1="50%"
                  y1="0%"
                  x2="50%"
                  y2="100%"
                  startOpacity={0.3}
                  endOpacity={0}
                />
              </defs>
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
