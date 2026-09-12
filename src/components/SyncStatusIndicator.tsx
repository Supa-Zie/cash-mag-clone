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
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
        syncStatus.isOnline 
          ? 'bg-[#EAF7ED] text-[#1E7E34] dark:bg-[#1A3320] dark:text-[#4ADE80]' 
          : 'bg-[#FEECEC] text-[#DC2626] dark:bg-[#381B1B] dark:text-[#F87171]'
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            syncStatus.syncInProgress
              ? 'bg-[#FEF3E7] text-[#B45309] dark:bg-[#3D2616] dark:text-[#F59E0B] cursor-not-allowed'
              : 'bg-[#F0EAE1] text-[#6B635B] hover:bg-[#E5DDD2] dark:bg-[#2A241E] dark:text-[#C5BCB2] dark:hover:bg-[#352D25]'
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
