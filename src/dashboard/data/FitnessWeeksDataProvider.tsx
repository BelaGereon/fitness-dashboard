import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { FitnessWeek } from "../fitnessTypes";
import { useFitnessWeeksStorage } from "./useFitnessWeeksStorage";

type FitnessWeeksContextValue = {
  weeks: FitnessWeek[];
  addWeek: (week: FitnessWeek) => void;
  updateWeek: (week: FitnessWeek) => void;
  setWeeks: Dispatch<SetStateAction<FitnessWeek[]>>;
  isHydrated: boolean;
};

const FitnessWeeksContext = createContext<FitnessWeeksContextValue | null>(
  null,
);

type FitnessWeeksDataProviderProps = {
  initialWeeks: FitnessWeek[];
  children: ReactNode;
};

export function FitnessWeeksDataProvider({
  initialWeeks,
  children,
}: FitnessWeeksDataProviderProps) {
  const { weeks, setWeeks, isHydrated } = useFitnessWeeksStorage(initialWeeks);

  const addWeek = useCallback((week: FitnessWeek) => {
    setWeeks((prevWeeks) => [...prevWeeks, week]);
  }, []);

  const updateWeek = useCallback((updatedWeek: FitnessWeek) => {
    setWeeks((prevWeeks) => {
      const index = prevWeeks.findIndex((week) => week.id === updatedWeek.id);
      if (index === -1) {
        return [...prevWeeks, updatedWeek];
      }
      return prevWeeks.map((week) =>
        week.id === updatedWeek.id ? updatedWeek : week,
      );
    });
  }, []);

  return (
    <FitnessWeeksContext.Provider
      value={{ weeks, addWeek, updateWeek, setWeeks, isHydrated }}
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
