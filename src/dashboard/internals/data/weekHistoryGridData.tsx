import EditOutlined from "@mui/icons-material/EditOutlined";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import {
  GridActionsCellItem,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import type { WeekHistoryRow } from "../../data/WeekHistoryGridData";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weightFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});
const weekStartFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const weekEndFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatWeekOf(value?: string) {
  if (!value) {
    return "--";
  }
  const startDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(startDate.valueOf())) {
    return value;
  }
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  return `${weekStartFormatter.format(startDate)} - ${weekEndFormatter.format(
    endDate,
  )}`;
}

function formatWeight(value?: number | null) {
  if (typeof value !== "number") {
    return "--";
  }
  return weightFormatter.format(value);
}

function formatDelta(value?: number | null) {
  if (typeof value !== "number") {
    return "--";
  }
  const formatted = weightFormatter.format(Math.abs(value));
  if (value > 0) {
    return `+${formatted}`;
  }
  if (value < 0) {
    return `-${formatted}`;
  }
  return "0.0";
}

function renderCaloriesSparkline(
  params: GridRenderCellParams<WeekHistoryRow, number[]>,
) {
  const { value, colDef } = params;

  if (!value || value.every((item) => item === 0)) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 120}
        height={32}
        plotType="bar"
        showHighlight
        showTooltip
        color="hsl(200, 70%, 45%)"
        xAxis={{
          scaleType: "band",
          data: dayLabels,
        }}
      />
    </div>
  );
}

function renderWeightSparkline(
  params: GridRenderCellParams<WeekHistoryRow, Array<number | null>>,
) {
  const { value, colDef } = params;

  if (!value || value.every((item) => typeof item !== "number")) {
    return null;
  }

  const data = value.filter((item) => typeof item === "number") as number[];

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <SparkLineChart
        data={data}
        width={colDef.computedWidth || 120}
        height={32}
        plotType="line"
        showHighlight
        showTooltip
        color="hsl(210, 65%, 40%)"
        xAxis={{
          scaleType: "band",
          data: dayLabels,
        }}
      />
    </div>
  );
}

type WeekHistoryColumnsOptions = {
  onEditWeek?: (row: WeekHistoryRow) => void;
};

export function createWeekHistoryColumns(
  options: WeekHistoryColumnsOptions = {},
): GridColDef<WeekHistoryRow>[] {
  const { onEditWeek } = options;

  return [
    {
      field: "weekOf",
      headerName: "Week from",
      flex: 1.2,
      minWidth: 150,
      valueFormatter: (value) => formatWeekOf(value as string),
    },
    {
      field: "avgWeightKg",
      headerName: "Ø weight (kg)",
      headerAlign: "right",
      align: "right",
      flex: 0.9,
      minWidth: 120,
      valueFormatter: (value) => formatWeight(value as number | null),
    },
    {
      field: "avgWeightDeltaKg",
      headerName: "Δ vs last week",
      headerAlign: "right",
      align: "right",
      flex: 0.9,
      minWidth: 120,
      valueFormatter: (value) => formatDelta(value as number | null),
    },
    {
      field: "dailyWeights",
      headerName: "Daily weight",
      flex: 1.1,
      minWidth: 130,
      renderCell: renderWeightSparkline,
      sortable: false,
      filterable: false,
    },
    {
      field: "avgCalories",
      headerName: "Ø calories",
      headerAlign: "right",
      align: "right",
      flex: 0.9,
      minWidth: 110,
      valueFormatter: (value) =>
        typeof value === "number" ? numberFormatter.format(value) : "--",
    },
    {
      field: "avgProteinG",
      headerName: "Ø protein (g)",
      headerAlign: "right",
      align: "right",
      flex: 0.9,
      minWidth: 120,
      valueFormatter: (value) =>
        typeof value === "number" ? numberFormatter.format(value) : "--",
    },
    {
      field: "dailyCalories",
      headerName: "Daily calories",
      flex: 1.1,
      minWidth: 130,
      renderCell: renderCaloriesSparkline,
      sortable: false,
      filterable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 70,
      getActions: (params) => [
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<EditOutlined fontSize="small" />}
          label="Edit"
          onClick={() => onEditWeek?.(params.row)}
          disabled={!onEditWeek}
          showInMenu={false}
        />,
      ],
    },
  ];
}
