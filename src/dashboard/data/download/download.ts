import type { FitnessWeek } from "../../fitnessTypes";
import {
  createWeekExportPayload,
  getWeekExportFilename,
  serializeWeekExport,
} from "./weekExport";

export function downloadWeekExport(weeks: FitnessWeek[]) {
  const payload = createWeekExportPayload(weeks);
  const data = serializeWeekExport(payload);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getWeekExportFilename();
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
