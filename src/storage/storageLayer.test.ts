import { describe, expect, it, vi } from "vitest";
import { createWebStorageAdapter } from "./adapters";
import { createStorageLayer } from "./storageLayer";
import { createMemoryAdapter } from "./testUtils";

describe("createStorageLayer", () => {
  describe("load", () => {
    it("returns null when the key is missing", async () => {
      const adapter = createMemoryAdapter();
      const storage = createStorageLayer<{ value: number }>({
        key: "missing",
        adapter,
      });

      await expect(storage.load()).resolves.toBeNull();
    });

    it("deserializes stored values", async () => {
      const adapter = createMemoryAdapter({
        fitness: JSON.stringify({ value: 42 }),
      });
      const storage = createStorageLayer<{ value: number }>({
        key: "fitness",
        adapter,
      });

      await expect(storage.load()).resolves.toEqual({ value: 42 });
    });

    it("returns null on deserialize errors when suppression is enabled", async () => {
      const adapter = createMemoryAdapter({ bad: "{not-json" });
      const onError = vi.fn();
      const storage = createStorageLayer<{ value: number }>({
        key: "bad",
        adapter,
        onError,
      });

      await expect(storage.load()).resolves.toBeNull();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.any(SyntaxError),
        "deserialize",
      );
    });

    it("throws on deserialize errors when suppression is disabled", async () => {
      const adapter = createMemoryAdapter({ bad: "{not-json" });
      const storage = createStorageLayer<{ value: number }>({
        key: "bad",
        adapter,
        suppressErrors: false,
      });

      await expect(storage.load()).rejects.toBeInstanceOf(SyntaxError);
    });

    it("handles adapter failures when suppression is enabled", async () => {
      const adapter = {
        getItem: () => {
          throw new Error("boom");
        },
        setItem: () => undefined,
        removeItem: () => undefined,
      };
      const onError = vi.fn();
      const storage = createStorageLayer<{ value: number }>({
        key: "key",
        adapter,
        onError,
      });

      await expect(storage.load()).resolves.toBeNull();
      expect(onError).toHaveBeenCalledWith(expect.any(Error), "get");
    });
  });

  describe("save", () => {
    it("serializes and stores values", async () => {
      const adapter = createMemoryAdapter();
      const storage = createStorageLayer<{ value: number }>({
        key: "fitness",
        adapter,
      });

      await storage.save({ value: 7 });
      await expect(
        Promise.resolve(adapter.getItem("fitness")),
      ).resolves.toBe(JSON.stringify({ value: 7 }));
    });

    it("uses custom serializers", async () => {
      const adapter = createMemoryAdapter();
      const storage = createStorageLayer<{ value: number }>({
        key: "custom",
        adapter,
        serialize: (value) => `value:${value.value}`,
      });

      await storage.save({ value: 3 });
      await expect(
        Promise.resolve(adapter.getItem("custom")),
      ).resolves.toBe("value:3");
    });

    it("reports serialize errors when suppression is enabled", async () => {
      const adapter = createMemoryAdapter();
      const onError = vi.fn();
      const storage = createStorageLayer<{ value: number }>({
        key: "custom",
        adapter,
        serialize: () => {
          throw new Error("serialize-fail");
        },
        onError,
      });

      await storage.save({ value: 3 });
      expect(onError).toHaveBeenCalledWith(expect.any(Error), "serialize");
      await expect(
        Promise.resolve(adapter.getItem("custom")),
      ).resolves.toBeNull();
    });

    it("throws on adapter errors when suppression is disabled", async () => {
      const adapter = {
        getItem: () => null,
        setItem: () => {
          throw new Error("write-fail");
        },
        removeItem: () => undefined,
      };
      const storage = createStorageLayer<{ value: number }>({
        key: "custom",
        adapter,
        suppressErrors: false,
      });

      await expect(storage.save({ value: 3 })).rejects.toBeInstanceOf(Error);
    });
  });

  describe("clear", () => {
    it("removes the stored key", async () => {
      const adapter = createMemoryAdapter({
        fitness: JSON.stringify({ value: 1 }),
      });
      const storage = createStorageLayer<{ value: number }>({
        key: "fitness",
        adapter,
      });

      await storage.clear();
      await expect(
        Promise.resolve(adapter.getItem("fitness")),
      ).resolves.toBeNull();
    });
  });
});

describe("createMemoryAdapter", () => {
  describe("data lifecycle", () => {
    it("stores, reads, and deletes entries", async () => {
      const adapter = createMemoryAdapter();

      await adapter.setItem("alpha", "one");
      await expect(Promise.resolve(adapter.getItem("alpha"))).resolves.toBe(
        "one",
      );

      await adapter.removeItem("alpha");
      await expect(
        Promise.resolve(adapter.getItem("alpha")),
      ).resolves.toBeNull();
    });
  });

  describe("initial values", () => {
    it("seeds entries from initial data", async () => {
      const adapter = createMemoryAdapter({ seeded: "value" });

      await expect(
        Promise.resolve(adapter.getItem("seeded")),
      ).resolves.toBe("value");
    });
  });
});

describe("createWebStorageAdapter", () => {
  describe("delegation", () => {
    class FakeStorage implements Storage {
      private store = new Map<string, string>();

      get length() {
        return this.store.size;
      }

      clear(): void {
        this.store.clear();
      }

      getItem(key: string): string | null {
        return this.store.has(key) ? this.store.get(key) ?? null : null;
      }

      key(index: number): string | null {
        return Array.from(this.store.keys())[index] ?? null;
      }

      removeItem(key: string): void {
        this.store.delete(key);
      }

      setItem(key: string, value: string): void {
        this.store.set(key, value);
      }
    }

    it("wraps the provided Storage implementation", async () => {
      const storage = new FakeStorage();
      const adapter = createWebStorageAdapter(storage);

      await adapter.setItem("week", "payload");
      await expect(Promise.resolve(adapter.getItem("week"))).resolves.toBe(
        "payload",
      );

      await adapter.removeItem("week");
      await expect(
        Promise.resolve(adapter.getItem("week")),
      ).resolves.toBeNull();
    });
  });
});
