import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { FitnessWeek, FitnessWeeksPayload } from "../fitnessTypes";
import { createStorageLayer, useStorageAdapter } from "../../storage";

type FitnessWeeksContextValue = {
  weeks: FitnessWeek[];
  addWeek: (week: FitnessWeek) => void;
  setWeeks: Dispatch<SetStateAction<FitnessWeek[]>>;
  isHydrated: boolean;
};

const FitnessWeeksContext = createContext<FitnessWeeksContextValue | null>(null);

type FitnessWeeksDataProviderProps = {
  initialWeeks: FitnessWeek[];
  children: ReactNode;
};

export function FitnessWeeksDataProvider({
  initialWeeks,
  children,
}: FitnessWeeksDataProviderProps) {
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
        if (payload?.weeks?.length) {
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

  const addWeek = useCallback((week: FitnessWeek) => {
    setWeeks((prevWeeks) => [...prevWeeks, week]);
  }, []);

  return (
    <FitnessWeeksContext.Provider
      value={{ weeks, addWeek, setWeeks, isHydrated }}
    >
      {children}
    </FitnessWeeksContext.Provider>
  );
}

export function useFitnessWeeks() {
  const context = useContext(FitnessWeeksContext);
  if (!context) {
    throw new Error(
      "useFitnessWeeks must be used within FitnessWeeksDataProvider",
    );
  }
  return context;
}
