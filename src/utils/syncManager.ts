import { offlineStorage, SyncQueueItem } from './offlineStorage';

export class SyncManager {
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;
  private listeners: Array<(status: SyncStatus) => void> = [];

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
      this.sync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
    });
  }

  getStatus(): SyncStatus {
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
    };
  }

  addListener(callback: (status: SyncStatus) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(): void {
    const status = this.getStatus();
    this.listeners.forEach(listener => listener(status));
  }

  async sync(): Promise<SyncResult> {
    if (!this.isOnline || this.syncInProgress) {
      return { success: false, message: 'Cannot sync while offline or sync in progress' };
    }

    this.syncInProgress = true;
    this.notifyListeners();

    try {
      const unsyncedItems = await offlineStorage.getUnsyncedItems();
      
      if (unsyncedItems.length === 0) {
        this.syncInProgress = false;
        this.notifyListeners();
        return { success: true, message: 'No items to sync', syncedCount: 0 };
      }

      // Sort by timestamp to maintain order
      const sortedItems = unsyncedItems.sort((a, b) => a.timestamp - b.timestamp);

      let syncedCount = 0;
      const errors: string[] = [];

      for (const item of sortedItems) {
        try {
          await this.syncItem(item);
          await offlineStorage.markAsSynced(item.id);
          syncedCount++;
        } catch (error) {
          errors.push(`Failed to sync ${item.type} ${item.id}: ${error}`);
        }
      }

      // Clean up old synced items
      await offlineStorage.clearSyncedItems();

      this.syncInProgress = false;
      this.notifyListeners();

      return {
        success: errors.length === 0,
        message: errors.length === 0 ? 'Sync completed successfully' : `Sync completed with ${errors.length} errors`,
        syncedCount,
        errors,
      };
    } catch (error) {
      this.syncInProgress = false;
      this.notifyListeners();
      return { success: false, message: `Sync failed: ${error}` };
    }
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    // Simulate API call - in production, this would call your backend API
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // In a real implementation, you would:
    // 1. Make HTTP request to your backend
    // 2. Handle authentication
    // 3. Process response
    // 4. Handle conflicts

    console.log(`Syncing ${item.action} ${item.type}:`, item.data);

    // Simulate occasional failures for demo
    if (Math.random() < 0.05) {
      throw new Error('Network error');
    }
  }

  async queueTransaction(transaction: any): Promise<void> {
    await offlineStorage.addToSyncQueue({
      type: 'transaction',
      action: 'create',
      data: transaction,
    });

    // Auto-sync if online
    if (this.isOnline && !this.syncInProgress) {
      this.sync();
    }
  }

  async queueProductUpdate(product: any, action: 'create' | 'update' | 'delete'): Promise<void> {
    await offlineStorage.addToSyncQueue({
      type: 'product',
      action,
      data: product,
    });

    if (this.isOnline && !this.syncInProgress) {
      this.sync();
    }
  }

  async queueInventoryUpdate(inventory: any): Promise<void> {
    await offlineStorage.addToSyncQueue({
      type: 'inventory',
      action: 'update',
      data: inventory,
    });

    if (this.isOnline && !this.syncInProgress) {
      this.sync();
    }
  }
}

export interface SyncStatus {
  isOnline: boolean;
  syncInProgress: boolean;
}

export interface SyncResult {
  success: boolean;
  message: string;
  syncedCount?: number;
  errors?: string[];
}

export const syncManager = new SyncManager();
