import { useMemo } from "react";
import Dashboard from "./dashboard/Dashboard";
import {
  StorageAdapterProvider,
  createNoopAdapter,
  createWebStorageAdapter,
} from "./storage";
import AppTheme from "./shared-theme/AppTheme";

export default function App() {
  const adapter = useMemo(() => {
    if (typeof window === "undefined") {
      return createNoopAdapter();
    }
    return createWebStorageAdapter(window.localStorage);
  }, []);

  return (
    <AppTheme>
      <StorageAdapterProvider adapter={adapter}>
        <Dashboard />
      </StorageAdapterProvider>
    </AppTheme>
  );
}
