import { useMemo, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useWeekHistoryGridRows } from "../data/hooks/dataHooks";
import { createWeekHistoryColumns } from "../internals/data/weekHistoryGridData";
import type { WeekHistoryRow } from "../data/WeekHistoryGridData";

export default function WeekHistoryDataGrid() {
  const rows = useWeekHistoryGridRows();

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
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
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
