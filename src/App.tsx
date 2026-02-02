import { useMemo } from "react";
import Dashboard from "./dashboard/Dashboard";
import { StorageAdapterProvider, createWebStorageAdapter } from "./storage";
import AppTheme from "./shared-theme/AppTheme";

export default function App() {
  const adapter = useMemo(
    () => createWebStorageAdapter(window.localStorage),
    [],
  );

  return (
    <AppTheme>
      <StorageAdapterProvider adapter={adapter}>
        <Dashboard />
      </StorageAdapterProvider>
    </AppTheme>
  );
}
