import { useState, useEffect } from 'react';
import { syncManager, SyncStatus } from '../utils/syncManager';
import { offlineStorage } from '../utils/offlineStorage';

export function useSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncManager.getStatus());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize offline storage
    offlineStorage.init().then(() => {
      setIsInitialized(true);
    }).catch((error) => {
      console.error('Failed to initialize offline storage:', error);
    });

    // Subscribe to sync status changes
    const unsubscribe = syncManager.addListener(setSyncStatus);
    return unsubscribe;
  }, []);

  const sync = async () => {
    return await syncManager.sync();
  };

  const queueTransaction = async (transaction: any) => {
    await syncManager.queueTransaction(transaction);
  };

  const queueProductUpdate = async (product: any, action: 'create' | 'update' | 'delete') => {
    await syncManager.queueProductUpdate(product, action);
  };

  const queueInventoryUpdate = async (inventory: any) => {
    await syncManager.queueInventoryUpdate(inventory);
  };

  return {
    syncStatus,
    isInitialized,
    sync,
    queueTransaction,
    queueProductUpdate,
    queueInventoryUpdate,
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
