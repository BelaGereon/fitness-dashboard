import { createContext, useContext, type ReactNode } from "react";
import type { StorageAdapter } from "./storageLayer";

const StorageAdapterContext = createContext<StorageAdapter | null>(null);

type StorageAdapterProviderProps = {
  adapter: StorageAdapter;
  children: ReactNode;
};

export function StorageAdapterProvider({
  adapter,
  children,
}: StorageAdapterProviderProps) {
  return (
    <StorageAdapterContext.Provider value={adapter}>
      {children}
    </StorageAdapterContext.Provider>
  );
}

export function useStorageAdapter() {
  const context = useContext(StorageAdapterContext);
  if (!context) {
    throw new Error(
      "useStorageAdapter must be used within StorageAdapterProvider",
    );
  }
  return context;
}
