import type { StorageAdapter } from "./storageLayer";

export function createMemoryAdapter(
  initial?: Record<string, string>,
): StorageAdapter {
  const store = new Map<string, string>(Object.entries(initial ?? {}));

  return {
    getItem: (key) => (store.has(key) ? store.get(key) ?? null : null),
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
}
