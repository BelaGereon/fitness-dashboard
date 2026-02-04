import { useMemo, useCallback, useState } from "react";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { useWeekHistoryGridRows } from "../data/hooks/dataHooks";
import { createWeekHistoryColumns } from "../internals/data/weekHistoryGridData";
import type { WeekHistoryRow } from "../data/WeekHistoryGridData";
import AddWeekDialog, { EditWeekDialog } from "./AddWeekDialog";
import { useFitnessWeeks } from "../data/FitnessWeeksDataProvider";

function WeekHistoryToolbar() {
  return (
    <GridToolbarContainer sx={{ justifyContent: "flex-end", p: 1 }}>
      <AddWeekDialog />
    </GridToolbarContainer>
  );
}

export default function WeekHistoryDataGrid() {
  const { weeks } = useFitnessWeeks();
  const rows = useWeekHistoryGridRows();
  const pageSize = 12;
  const shouldAutoHeight = rows.length > 0 && rows.length < pageSize;
  const [editingWeekId, setEditingWeekId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const editingWeek = useMemo(
    () => weeks.find((week) => week.id === editingWeekId) ?? null,
    [editingWeekId, weeks],
  );

  const handleEditWeek = useCallback((row: WeekHistoryRow) => {
    setEditingWeekId(row.id);
    setIsEditOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditOpen(false);
    setEditingWeekId(null);
  }, []);

  const columns = useMemo(
    () => createWeekHistoryColumns({ onEditWeek: handleEditWeek }),
    [handleEditWeek],
  );

  return (
    <>
      <DataGrid
        checkboxSelection
        rows={rows}
        columns={columns}
        slots={{ toolbar: WeekHistoryToolbar }}
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
      <EditWeekDialog
        open={isEditOpen}
        onClose={handleCloseEdit}
        week={editingWeek}
      />
    </>
  );
}
