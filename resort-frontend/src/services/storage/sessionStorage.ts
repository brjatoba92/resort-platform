import { BaseStorage, StorageOptions, StorageError } from './types';

class SessionStorageService extends BaseStorage {
  private static instance: SessionStorageService;

  private constructor(options?: StorageOptions) {
    super(options);
  }

  static getInstance(options?: StorageOptions): SessionStorageService {
    if (!SessionStorageService.instance) {
      SessionStorageService.instance = new SessionStorageService(options);
    }
    return SessionStorageService.instance;
  }

  protected getStorage(): Storage {
    if (typeof window === 'undefined') {
      throw new StorageError('sessionStorage is not available in this environment');
    }
    return window.sessionStorage;
  }

  // Session Storage specific methods
  setTemporary<T>(key: string, value: T): void {
    this.set(key, {
      value,
      timestamp: new Date().getTime(),
    });
  }

  getTemporary<T>(key: string, maxAge?: number): T | null {
    const item = this.get<{ value: T; timestamp: number }>(key);
    
    if (!item) {
      return null;
    }

    if (maxAge && new Date().getTime() - item.timestamp > maxAge) {
      this.remove(key);
      return null;
    }

    return item.value;
  }

  setPageState<T>(key: string, state: T): void {
    this.set(`page_state_${key}`, {
      state,
      url: window.location.pathname,
      timestamp: new Date().getTime(),
    });
  }

  getPageState<T>(key: string): T | null {
    const item = this.get<{
      state: T;
      url: string;
      timestamp: number;
    }>(`page_state_${key}`);

    if (!item || item.url !== window.location.pathname) {
      return null;
    }

    return item.state;
  }

  setFormData<T extends object>(formId: string, data: T): void {
    this.set(`form_${formId}`, {
      data,
      timestamp: new Date().getTime(),
    });
  }

  getFormData<T extends object>(formId: string, maxAge?: number): T | null {
    const item = this.get<{
      data: T;
      timestamp: number;
    }>(`form_${formId}`);

    if (!item) {
      return null;
    }

    if (maxAge && new Date().getTime() - item.timestamp > maxAge) {
      this.remove(`form_${formId}`);
      return null;
    }

    return item.data;
  }

  setWizardState<T>(wizardId: string, step: number, data: T): void {
    const wizardData = this.get<Record<number, T>>(`wizard_${wizardId}`) || {};
    wizardData[step] = data;
    this.set(`wizard_${wizardId}`, wizardData);
  }

  getWizardState<T>(wizardId: string, step: number): T | null {
    const wizardData = this.get<Record<number, T>>(`wizard_${wizardId}`);
    return wizardData ? wizardData[step] || null : null;
  }

  clearWizardState(wizardId: string): void {
    this.remove(`wizard_${wizardId}`);
  }

  setNavigationHistory(maxEntries: number = 10): void {
    const history = this.get<string[]>('navigation_history') || [];
    const currentPath = window.location.pathname;

    if (history[0] !== currentPath) {
      history.unshift(currentPath);
      if (history.length > maxEntries) {
        history.pop();
      }
      this.set('navigation_history', history);
    }
  }

  getNavigationHistory(): string[] {
    return this.get<string[]>('navigation_history') || [];
  }

  setTabState(tabId: string, state: unknown): void {
    this.set(`tab_${tabId}`, {
      state,
      timestamp: new Date().getTime(),
    });
  }

  getTabState<T>(tabId: string): T | null {
    const item = this.get<{
      state: T;
      timestamp: number;
    }>(`tab_${tabId}`);

    return item ? item.state : null;
  }

  clearTabState(tabId: string): void {
    this.remove(`tab_${tabId}`);
  }

  getStorageUsage(): {
    itemCount: number;
    totalSize: number;
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

      return {
        itemCount,
        totalSize,
      };
    } catch (error) {
      throw new StorageError(`Failed to get storage usage: ${error}`);
    }
  }
}

export const sessionStorage = SessionStorageService.getInstance();
