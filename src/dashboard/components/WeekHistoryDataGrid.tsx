import { useMemo, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useWeekHistoryGridRows } from "../data/hooks/dataHooks";
import { createWeekHistoryColumns } from "../internals/data/weekHistoryGridData";
import type { WeekHistoryRow } from "../data/WeekHistoryGridData";

export default function WeekHistoryDataGrid() {
  const rows = useWeekHistoryGridRows();
  const pageSize = 12;
  const shouldAutoHeight = rows.length > 0 && rows.length < pageSize;

  const handleEditWeek = useCallback((row: WeekHistoryRow) => {
    console.info("Edit week", row);
  }, []);

  const columns = useMemo(
    () => createWeekHistoryColumns({ onEditWeek: handleEditWeek }),
    [handleEditWeek],
  );

  return (
    <DataGrid
      checkboxSelection
      rows={rows}
      columns={columns}
      sx={{
        width: "100%",
        height: shouldAutoHeight ? "auto" : 520,
      }}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize } },
      }}
      pageSizeOptions={[4, 8, 12, 24, 52]}
      autoHeight={shouldAutoHeight}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
}
