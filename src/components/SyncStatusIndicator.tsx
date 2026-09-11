import { useSync } from '../hooks/useSync';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function SyncStatusIndicator() {
  const { syncStatus, sync } = useSync();

  const handleClick = async () => {
    if (syncStatus.isOnline && !syncStatus.syncInProgress) {
      await sync();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Online/Offline indicator */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
        syncStatus.isOnline 
          ? 'bg-emerald-50 text-emerald-700' 
          : 'bg-red-50 text-red-700'
      }`}>
        {syncStatus.isOnline ? (
          <>
            <Wifi size={12} />
            <span>En ligne</span>
          </>
        ) : (
          <>
            <WifiOff size={12} />
            <span>Hors ligne</span>
          </>
        )}
      </div>

      {/* Sync button */}
      {syncStatus.isOnline && (
        <button
          onClick={handleClick}
          disabled={syncStatus.syncInProgress}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            syncStatus.syncInProgress
              ? 'bg-blue-50 text-blue-700 cursor-not-allowed'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          title={syncStatus.syncInProgress ? 'Synchronisation en cours...' : 'Synchroniser les données'}
        >
          <RefreshCw size={12} className={syncStatus.syncInProgress ? 'animate-spin' : ''} />
          <span>{syncStatus.syncInProgress ? 'Sync...' : 'Sync'}</span>
        </button>
      )}
    </div>
  );
}
