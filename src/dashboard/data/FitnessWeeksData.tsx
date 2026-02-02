import { createContext, useContext, type ReactNode } from "react";
import type { FitnessWeek } from "../fitnessTypes";

type FitnessWeeksContextValue = {
  weeks: FitnessWeek[];
};

const FitnessWeeksContext = createContext<FitnessWeeksContextValue | null>(null);

type FitnessWeeksDataProviderProps = {
  weeks: FitnessWeek[];
  children: ReactNode;
};

export function FitnessWeeksDataProvider({
  weeks,
  children,
}: FitnessWeeksDataProviderProps) {
  return (
    <FitnessWeeksContext.Provider value={{ weeks }}>
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
  return context.weeks;
}
