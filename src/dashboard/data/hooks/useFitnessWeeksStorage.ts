import { useEffect, useMemo, useState } from "react";
import { createStorageLayer, useStorageAdapter } from "../../../storage";
import type { FitnessWeek, FitnessWeeksPayload } from "../../fitnessTypes";

type UseFitnessWeeksStorageResult = {
  weeks: FitnessWeek[];
  setWeeks: React.Dispatch<React.SetStateAction<FitnessWeek[]>>;
  isHydrated: boolean;
};

export function useFitnessWeeksStorage(
  initialWeeks: FitnessWeek[],
): UseFitnessWeeksStorageResult {
  const adapter = useStorageAdapter();
  const storage = useMemo(
    () =>
      createStorageLayer<FitnessWeeksPayload>({
        key: "fitnessWeeks",
        adapter,
      }),
    [adapter],
  );
  const [weeks, setWeeks] = useState<FitnessWeek[]>(initialWeeks);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isActive = true;

    storage
      .load()
      .then((payload) => {
        if (!isActive) {
          return;
        }
        if (Array.isArray(payload?.weeks)) {
          setWeeks(payload.weeks);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsHydrated(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, [storage]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    void storage.save({ weeks });
  }, [isHydrated, storage, weeks]);

  return { weeks, setWeeks, isHydrated };
}
