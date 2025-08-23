import { BaseStorage, StorageOptions, StorageError } from './types';

class LocalStorageService extends BaseStorage {
  private static instance: LocalStorageService;

  private constructor(options?: StorageOptions) {
    super(options);
  }

  static getInstance(options?: StorageOptions): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService(options);
    }
    return LocalStorageService.instance;
  }

  protected getStorage(): Storage {
    if (typeof window === 'undefined') {
      throw new StorageError('localStorage is not available in this environment');
    }
    return window.localStorage;
  }

  // Local Storage specific methods
  setWithExpiry<T>(key: string, value: T, ttl: number): void {
    const item = {
      value,
      expiry: new Date().getTime() + ttl,
    };
    this.set(key, item);
  }

  getWithExpiry<T>(key: string): T | null {
    const item = this.get<{ value: T; expiry: number }>(key);
    
    if (!item) {
      return null;
    }

    if (new Date().getTime() > item.expiry) {
      this.remove(key);
      return null;
    }

    return item.value;
  }

  setObject<T extends object>(key: string, value: T): void {
    this.set(key, value);
  }

  getObject<T extends object>(key: string): T | null {
    return this.get<T>(key);
  }

  increment(key: string, amount: number = 1): number {
    const value = this.get<number>(key) || 0;
    const newValue = value + amount;
    this.set(key, newValue);
    return newValue;
  }

  decrement(key: string, amount: number = 1): number {
    return this.increment(key, -amount);
  }

  appendToArray<T>(key: string, item: T): T[] {
    const array = this.get<T[]>(key) || [];
    array.push(item);
    this.set(key, array);
    return array;
  }

  removeFromArray<T>(key: string, predicate: (item: T) => boolean): T[] {
    const array = this.get<T[]>(key) || [];
    const filteredArray = array.filter(item => !predicate(item));
    this.set(key, filteredArray);
    return filteredArray;
  }

  updateInArray<T>(
    key: string,
    predicate: (item: T) => boolean,
    updater: (item: T) => T
  ): T[] {
    const array = this.get<T[]>(key) || [];
    const updatedArray = array.map(item =>
      predicate(item) ? updater(item) : item
    );
    this.set(key, updatedArray);
    return updatedArray;
  }

  setMap<K extends string, V>(key: string, map: Map<K, V>): void {
    this.set(key, Array.from(map.entries()));
  }

  getMap<K extends string, V>(key: string): Map<K, V> {
    const entries = this.get<[K, V][]>(key) || [];
    return new Map(entries);
  }

  setSet<T>(key: string, set: Set<T>): void {
    this.set(key, Array.from(set));
  }

  getSet<T>(key: string): Set<T> {
    const array = this.get<T[]>(key) || [];
    return new Set(array);
  }

  getStorageUsage(): {
    itemCount: number;
    totalSize: number;
    remainingSpace: number;
  } {
    try {
      const storage = this.getStorage();
      let totalSize = 0;
      const itemCount = this.getSize();

      Object.keys(storage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => {
          const item = storage.getItem(key);
          if (item) {
            totalSize += item.length * 2; // UTF-16 characters are 2 bytes each
          }
        });

      // Estimate remaining space (varies by browser)
      const testKey = '__storage_test__';
      let remainingSpace = 0;
      const testString = 'a'.repeat(1024 * 1024); // 1MB string

      try {
        let i = 0;
        while (true) {
          storage.setItem(testKey + i, testString);
          remainingSpace += testString.length * 2;
          i++;
        }
      } catch {
        // No more space
      } finally {
        // Clean up test items
        let i = 0;
        while (storage.getItem(testKey + i)) {
          storage.removeItem(testKey + i);
          i++;
        }
      }

      return {
        itemCount,
        totalSize,
        remainingSpace,
      };
    } catch (error) {
      throw new StorageError(`Failed to get storage usage: ${error}`);
    }
  }
}

export const localStorage = LocalStorageService.getInstance();
