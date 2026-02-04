import { useCallback, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import dayjs, { type Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFitnessWeeks } from "../data/FitnessWeeksDataProvider";
import type { FitnessDay, FitnessWeek, WeekDayKey } from "../fitnessTypes";

type DayInputs = {
  weightKg: string;
  calories: string;
  proteinG: string;
};

type WeekEditorDrawerProps = {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  initialWeek?: FitnessWeek;
};

type EditWeekDialogProps = {
  open: boolean;
  onClose: () => void;
  week: FitnessWeek | null;
};

const dayKeys: WeekDayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const dayLabels: Record<WeekDayKey, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

function getWeekMonday(value: Dayjs) {
  const date = value.toDate();
  const dayOfWeek = date.getDay();
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  date.setDate(date.getDate() + offset);
  return dayjs(date).startOf("day");
}

function createInitialDayInputs(): Record<WeekDayKey, DayInputs> {
  return dayKeys.reduce(
    (acc, dayKey) => {
      acc[dayKey] = {
        weightKg: "",
        calories: "",
        proteinG: "",
      };
      return acc;
    },
    {} as Record<WeekDayKey, DayInputs>,
  );
}

function createDayInputsFromWeek(
  week?: FitnessWeek,
): Record<WeekDayKey, DayInputs> {
  if (!week) {
    return createInitialDayInputs();
  }

  return dayKeys.reduce(
    (acc, dayKey) => {
      const day = week.days?.[dayKey];
      acc[dayKey] = {
        weightKg: typeof day?.weightKg === "number" ? String(day.weightKg) : "",
        calories: typeof day?.calories === "number" ? String(day.calories) : "",
        proteinG: typeof day?.proteinG === "number" ? String(day.proteinG) : "",
      };
      return acc;
    },
    {} as Record<WeekDayKey, DayInputs>,
  );
}

function getWeekStartFromWeek(week?: FitnessWeek) {
  if (!week?.weekOf) {
    return getWeekMonday(dayjs());
  }
  const parsed = dayjs(week.weekOf);
  return parsed.isValid() ? getWeekMonday(parsed) : getWeekMonday(dayjs());
}

function parseNumber(value: string) {
  if (!value.trim()) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function WeekEditorDrawer({
  open,
  onClose,
  mode,
  initialWeek,
}: WeekEditorDrawerProps) {
  const { weeks, addWeek, updateWeek } = useFitnessWeeks();
  const [weekStart, setWeekStart] = useState(() =>
    getWeekStartFromWeek(initialWeek),
  );
  const [days, setDays] = useState(() => createDayInputsFromWeek(initialWeek));
  const [avgStepsPerDay, setAvgStepsPerDay] = useState("");
  const [trainingDescription, setTrainingDescription] = useState("");
  const [totalSets, setTotalSets] = useState("");
  const [totalVolumeKg, setTotalVolumeKg] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const weekOf = useMemo(() => weekStart.format("YYYY-MM-DD"), [weekStart]);
  const isMissingEditWeek = mode === "edit" && !initialWeek;

  useEffect(() => {
    if (!open) {
      return;
    }

    setWeekStart(getWeekStartFromWeek(initialWeek));
    setDays(createDayInputsFromWeek(initialWeek));
    setAvgStepsPerDay(
      typeof initialWeek?.avgStepsPerDay === "number"
        ? String(initialWeek.avgStepsPerDay)
        : "",
    );
    setTrainingDescription(initialWeek?.trainingSessionsDescription ?? "");
    setTotalSets(
      typeof initialWeek?.totalSets === "number"
        ? String(initialWeek.totalSets)
        : "",
    );
    setTotalVolumeKg(
      typeof initialWeek?.totalVolumeKg === "number"
        ? String(initialWeek.totalVolumeKg)
        : "",
    );
    setNotes(typeof initialWeek?.notes === "string" ? initialWeek.notes : "");
    setError(null);
  }, [open, initialWeek]);

  const handleWeekChange = useCallback((value: Dayjs | null) => {
    if (!value) {
      return;
    }
    setWeekStart(getWeekMonday(value));
    setError(null);
  }, []);

  const handleDayChange = useCallback(
    (dayKey: WeekDayKey, field: keyof DayInputs, value: string) => {
      setDays((prev) => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          [field]: value,
        },
      }));
    },
    [],
  );

  const buildDayPayload = useCallback(
    (inputs: DayInputs): FitnessDay | null => {
      const weightKg = parseNumber(inputs.weightKg);
      const calories = parseNumber(inputs.calories);
      const proteinG = parseNumber(inputs.proteinG);

      if (
        typeof weightKg !== "number" &&
        typeof calories !== "number" &&
        typeof proteinG !== "number"
      ) {
        return null;
      }

      return {
        ...(typeof weightKg === "number" ? { weightKg } : {}),
        ...(typeof calories === "number" ? { calories } : {}),
        ...(typeof proteinG === "number" ? { proteinG } : {}),
      };
    },
    [],
  );

  const handleSave = useCallback(() => {
    if (isMissingEditWeek) {
      return;
    }

    const duplicate = weeks.find(
      (week) =>
        week.weekOf === weekOf &&
        (mode === "add" || week.id !== initialWeek?.id),
    );
    if (duplicate) {
      setError(`Week starting ${weekOf} already exists.`);
      return;
    }

    const dayPayload = dayKeys.reduce(
      (acc, dayKey) => {
        const payload = buildDayPayload(days[dayKey]);
        if (payload) {
          acc[dayKey] = payload;
        }
        return acc;
      },
      {} as FitnessWeek["days"],
    );

    const base: FitnessWeek = {
      id: initialWeek?.id ?? weekOf,
      weekOf,
      avgStepsPerDay: parseNumber(avgStepsPerDay),
      days: dayPayload,
      trainingSessionsDescription: trainingDescription.trim() || undefined,
      totalSets: parseNumber(totalSets),
      totalVolumeKg: parseNumber(totalVolumeKg),
      notes: notes.trim() || undefined,
    };

    if (mode === "add") {
      addWeek(base);
    } else {
      updateWeek(base);
    }

    onClose();
  }, [
    addWeek,
    avgStepsPerDay,
    buildDayPayload,
    days,
    initialWeek?.id,
    isMissingEditWeek,
    mode,
    notes,
    onClose,
    totalSets,
    totalVolumeKg,
    trainingDescription,
    updateWeek,
    weekOf,
    weeks,
  ]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: "100vw", sm: 520 } }}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Typography variant="h6">
            {mode === "add" ? "Add Week" : "Edit Week"}
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Week of (auto-selects Monday)"
              value={weekStart}
              onChange={handleWeekChange}
              format="MMM DD, YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  helperText: `Week starts on ${weekOf}`,
                },
              }}
            />
          </LocalizationProvider>
          {error ? (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          ) : null}
          {isMissingEditWeek ? (
            <Typography color="error" variant="body2">
              Unable to load the selected week. Please close and try again.
            </Typography>
          ) : null}
          <TextField
            label="Average steps per day"
            value={avgStepsPerDay}
            onChange={(event) => setAvgStepsPerDay(event.target.value)}
            size="small"
            type="number"
            inputProps={{ step: 1, min: 0 }}
          />
          <Stack spacing={1}>
            <Typography variant="subtitle2">Daily metrics</Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Box sx={{ width: 70 }} />
              <Typography variant="caption" sx={{ flex: 1 }}>
                Weight (kg)
              </Typography>
              <Typography variant="caption" sx={{ flex: 1 }}>
                Calories
              </Typography>
              <Typography variant="caption" sx={{ flex: 1 }}>
                Protein (g)
              </Typography>
            </Stack>
            {dayKeys.map((dayKey) => {
              const inputs = days[dayKey];
              return (
                <Stack
                  key={dayKey}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ sm: "center" }}
                >
                  <Typography sx={{ width: { sm: 70 } }}>
                    {dayLabels[dayKey]}
                  </Typography>
                  <TextField
                    label="Weight (kg)"
                    value={inputs.weightKg}
                    onChange={(event) =>
                      handleDayChange(dayKey, "weightKg", event.target.value)
                    }
                    size="small"
                    type="number"
                    inputProps={{ step: 0.1, min: 0 }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Calories"
                    value={inputs.calories}
                    onChange={(event) =>
                      handleDayChange(dayKey, "calories", event.target.value)
                    }
                    size="small"
                    type="number"
                    inputProps={{ step: 1, min: 0 }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Protein (g)"
                    value={inputs.proteinG}
                    onChange={(event) =>
                      handleDayChange(dayKey, "proteinG", event.target.value)
                    }
                    size="small"
                    type="number"
                    inputProps={{ step: 1, min: 0 }}
                    sx={{ flex: 1 }}
                  />
                </Stack>
              );
            })}
          </Stack>
          <Divider />
          <Stack spacing={2}>
            <Typography variant="subtitle2">Workout & notes</Typography>
            <TextField
              label="Workout summary"
              value={trainingDescription}
              onChange={(event) => setTrainingDescription(event.target.value)}
              size="small"
              multiline
              minRows={2}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Total sets"
                value={totalSets}
                onChange={(event) => setTotalSets(event.target.value)}
                size="small"
                type="number"
                inputProps={{ step: 1, min: 0 }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Total volume (kg)"
                value={totalVolumeKg}
                onChange={(event) => setTotalVolumeKg(event.target.value)}
                size="small"
                type="number"
                inputProps={{ step: 0.1, min: 0 }}
                sx={{ flex: 1 }}
              />
            </Stack>
            <TextField
              label="General notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              size="small"
              multiline
              minRows={3}
            />
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={isMissingEditWeek}
            >
              {mode === "add" ? "Save week" : "Save changes"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}

export default function AddWeekDialog() {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <Button variant="contained" size="small" onClick={handleOpen}>
        Add Week
      </Button>
      <WeekEditorDrawer open={open} onClose={handleClose} mode="add" />
    </>
  );
}

export function EditWeekDialog({ open, onClose, week }: EditWeekDialogProps) {
  return (
    <WeekEditorDrawer
      open={open}
      onClose={onClose}
      mode="edit"
      initialWeek={week ?? undefined}
    />
  );
}
