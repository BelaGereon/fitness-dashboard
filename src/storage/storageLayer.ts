export type MaybePromise<T> = T | Promise<T>;

export type StorageAdapter = {
  getItem: (key: string) => MaybePromise<string | null>;
  setItem: (key: string, value: string) => MaybePromise<void>;
  removeItem: (key: string) => MaybePromise<void>;
};

export type StorageErrorStage =
  | "get"
  | "set"
  | "remove"
  | "serialize"
  | "deserialize";

export type StorageLayerOptions<T> = {
  key: string;
  adapter: StorageAdapter;
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
  suppressErrors?: boolean;
  onError?: (error: unknown, stage: StorageErrorStage) => void;
};

export type StorageLayer<T> = {
  load: () => Promise<T | null>;
  save: (value: T) => Promise<void>;
  clear: () => Promise<void>;
};

const defaultSerialize = <T>(value: T) => JSON.stringify(value);
const defaultDeserialize = <T>(raw: string) => JSON.parse(raw) as T;

function handleError(
  error: unknown,
  stage: StorageErrorStage,
  options: Pick<StorageLayerOptions<unknown>, "onError" | "suppressErrors">,
) {
  options.onError?.(error, stage);
  if (!options.suppressErrors) {
    throw error;
  }
}

export function createStorageLayer<T>(
  options: StorageLayerOptions<T>,
): StorageLayer<T> {
  const serialize = options.serialize ?? defaultSerialize;
  const deserialize = options.deserialize ?? defaultDeserialize;
  const suppressErrors = options.suppressErrors ?? true;

  return {
    async load() {
      let raw: string | null;
      try {
        raw = await options.adapter.getItem(options.key);
      } catch (error) {
        handleError(error, "get", { onError: options.onError, suppressErrors });
        return null;
      }

      if (raw === null) {
        return null;
      }

      try {
        return deserialize(raw);
      } catch (error) {
        handleError(error, "deserialize", {
          onError: options.onError,
          suppressErrors,
        });
        return null;
      }
    },

    async save(value: T) {
      let raw: string;
      try {
        raw = serialize(value);
      } catch (error) {
        handleError(error, "serialize", {
          onError: options.onError,
          suppressErrors,
        });
        return;
      }

      try {
        await options.adapter.setItem(options.key, raw);
      } catch (error) {
        handleError(error, "set", { onError: options.onError, suppressErrors });
      }
    },

    async clear() {
      try {
        await options.adapter.removeItem(options.key);
      } catch (error) {
        handleError(error, "remove", {
          onError: options.onError,
          suppressErrors,
        });
      }
    },
  };
}
