import type { ReactNode } from "react";
import { StorageAdapterProvider } from "../../../storage/StorageAdapterProvider";
import { createMemoryAdapter } from "../../../storage/testUtils";
import { FitnessWeeksDataProvider } from "../FitnessWeeksDataProvider";
import type { FitnessWeek } from "../../fitnessTypes";

export function createFitnessWeeksHookWrapper(weeks: FitnessWeek[]) {
  const adapter = createMemoryAdapter();

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <StorageAdapterProvider adapter={adapter}>
        <FitnessWeeksDataProvider initialWeeks={weeks}>
          {children}
        </FitnessWeeksDataProvider>
      </StorageAdapterProvider>
    );
  };
}
