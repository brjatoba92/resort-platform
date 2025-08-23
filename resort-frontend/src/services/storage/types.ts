export interface StorageOptions {
  prefix?: string;
  serialize?: <T>(value: T) => string;
  deserialize?: <T>(value: string) => T;
}

export interface IStorage {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
  getAll<T>(): Record<string, T>;
  clearExcept(keys: string[]): void;
  getKeys(): string[];
  getSize(): number;
}

export class StorageError extends Error {
  constructor(
    message: string,
    public readonly key?: string,
    public readonly operation?: 'get' | 'set' | 'remove' | 'clear'
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export abstract class BaseStorage implements IStorage {
  protected prefix: string;
  protected serialize: <T>(value: T) => string;
  protected deserialize: <T>(value: string) => T;

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix || 'resort_';
    this.serialize = options.serialize || JSON.stringify;
    this.deserialize = options.deserialize || JSON.parse;
  }

  protected abstract getStorage(): Storage;

  protected getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  protected removePrefix(key: string): string {
    return key.startsWith(this.prefix) ? key.slice(this.prefix.length) : key;
  }

  get<T>(key: string): T | null {
    try {
      const value = this.getStorage().getItem(this.getKey(key));
      return value ? this.deserialize<T>(value) : null;
    } catch (error) {
      throw new StorageError(
        `Failed to get item with key "${key}": ${error}`,
        key,
        'get'
      );
    }
  }

  set<T>(key: string, value: T): void {
    try {
      const serializedValue = this.serialize(value);
      this.getStorage().setItem(this.getKey(key), serializedValue);
    } catch (error) {
      throw new StorageError(
        `Failed to set item with key "${key}": ${error}`,
        key,
        'set'
      );
    }
  }

  remove(key: string): void {
    try {
      this.getStorage().removeItem(this.getKey(key));
    } catch (error) {
      throw new StorageError(
        `Failed to remove item with key "${key}": ${error}`,
        key,
        'remove'
      );
    }
  }

  clear(): void {
    try {
      const storage = this.getStorage();
      const keys = Object.keys(storage).filter(key => key.startsWith(this.prefix));
      keys.forEach(key => storage.removeItem(key));
    } catch (error) {
      throw new StorageError(
        `Failed to clear storage: ${error}`,
        undefined,
        'clear'
      );
    }
  }

  has(key: string): boolean {
    return this.getStorage().getItem(this.getKey(key)) !== null;
  }

  getAll<T>(): Record<string, T> {
    try {
      const storage = this.getStorage();
      const result: Record<string, T> = {};

      Object.keys(storage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => {
          const value = storage.getItem(key);
          if (value !== null) {
            result[this.removePrefix(key)] = this.deserialize<T>(value);
          }
        });

      return result;
    } catch (error) {
      throw new StorageError(`Failed to get all items: ${error}`);
    }
  }

  clearExcept(keys: string[]): void {
    try {
      const storage = this.getStorage();
      const prefixedKeys = keys.map(key => this.getKey(key));

      Object.keys(storage)
        .filter(key => key.startsWith(this.prefix) && !prefixedKeys.includes(key))
        .forEach(key => storage.removeItem(key));
    } catch (error) {
      throw new StorageError(`Failed to clear storage except keys: ${error}`);
    }
  }

  getKeys(): string[] {
    try {
      const storage = this.getStorage();
      return Object.keys(storage)
        .filter(key => key.startsWith(this.prefix))
        .map(key => this.removePrefix(key));
    } catch (error) {
      throw new StorageError(`Failed to get storage keys: ${error}`);
    }
  }

  getSize(): number {
    return this.getKeys().length;
  }
}
