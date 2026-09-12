import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, Users, Clock, DollarSign, Check, X } from 'lucide-react';

interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  customer?: string;
  orderTotal?: number;
  since?: string;
  zone: 'terrace' | 'main' | 'bar' | 'private';
}

export default function Tables() {
  const { t } = useApp();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 1, seats: 2, status: 'available', zone: 'terrace' },
    { id: '2', number: 2, seats: 2, status: 'occupied', customer: 'M. Dupont', orderTotal: 45.50, since: '12:30', zone: 'terrace' },
    { id: '3', number: 3, seats: 4, status: 'occupied', customer: 'Mme. Blanc', orderTotal: 78.20, since: '12:15', zone: 'terrace' },
    { id: '4', number: 4, seats: 4, status: 'reserved', customer: 'Famille Rochat', zone: 'main' },
    { id: '5', number: 5, seats: 6, status: 'available', zone: 'main' },
    { id: '6', number: 6, seats: 4, status: 'occupied', customer: 'M. Martin', orderTotal: 32.80, since: '13:00', zone: 'main' },
    { id: '7', number: 7, seats: 2, status: 'cleaning', zone: 'main' },
    { id: '8', number: 8, seats: 8, status: 'available', zone: 'private' },
    { id: '9', number: 9, seats: 4, status: 'occupied', customer: 'Mme. Favre', orderTotal: 56.00, since: '12:45', zone: 'main' },
    { id: '10', number: 10, seats: 2, status: 'available', zone: 'bar' },
    { id: '11', number: 11, seats: 2, status: 'occupied', customer: 'M. Weber', orderTotal: 18.50, since: '13:15', zone: 'bar' },
    { id: '12', number: 12, seats: 6, status: 'reserved', customer: 'Anniv. Moreau', zone: 'private' },
  ]);

  const filteredTables = zoneFilter === 'all' ? tables : tables.filter(t => t.zone === zoneFilter);

  const stats = {
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    cleaning: tables.filter(t => t.status === 'cleaning').length,
    totalRevenue: tables.reduce((sum, t) => sum + (t.orderTotal || 0), 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-[#10B981]';
      case 'occupied': return 'bg-[#A87B43]';
      case 'reserved': return 'bg-[#2563EB]';
      case 'cleaning': return 'bg-[#B45309]';
      default: return 'bg-[#9C9388]';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Libre';
      case 'occupied': return 'Occupée';
      case 'reserved': return 'Réservée';
      case 'cleaning': return 'Nettoyage';
      default: return status;
    }
  };

  const getZoneLabel = (zone: string) => {
    switch (zone) {
      case 'terrace': return 'Terrasse';
      case 'main': return 'Salle principale';
      case 'bar': return 'Bar';
      case 'private': return 'Salon privé';
      default: return zone;
    }
  };

  const updateTableStatus = (tableId: string, newStatus: Table['status']) => {
    setTables(prev => prev.map(t =>
      t.id === tableId
        ? { ...t, status: newStatus, customer: undefined, orderTotal: undefined, since: undefined }
        : t
    ));
    setSelectedTable(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-full bg-[#F8F6F0] dark:bg-[#181512] text-[#1A1816] dark:text-[#F8F6F0]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl font-black text-[#A87B43] dark:text-[#E3B36C] tracking-tight">
            CashMag
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">
            {t('tables')}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95] mt-1">
          Plan de salle, état des tables et gestion des consommations en cours
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EAF7ED] dark:bg-[#1A3320] text-[#1E7E34] dark:text-[#4ADE80] rounded-xl flex items-center justify-center flex-shrink-0">
              <Check size={18} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{stats.available}</p>
              <p className="text-[11px] font-semibold text-[#6B635B] dark:text-[#A89F95]">Libres</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F5EBE1] dark:bg-[#33271D] text-[#A87B43] dark:text-[#E3B36C] rounded-xl flex items-center justify-center flex-shrink-0">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#A87B43] dark:text-[#E3B36C]">{stats.occupied}</p>
              <p className="text-[11px] font-semibold text-[#6B635B] dark:text-[#A89F95]">Occupées</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EAF2FD] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{stats.reserved}</p>
              <p className="text-[11px] font-semibold text-[#6B635B] dark:text-[#A89F95]">Réservées</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FEF3E7] dark:bg-[#3D2616] text-[#B45309] dark:text-[#F59E0B] rounded-xl flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed size={18} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{stats.cleaning}</p>
              <p className="text-[11px] font-semibold text-[#6B635B] dark:text-[#A89F95]">Nettoyage</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 border border-[#EFECE6] dark:border-[#342D26] shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF8F3] dark:bg-[#2C2620] text-[#A87B43] rounded-xl flex items-center justify-center border border-[#EFECE6]/60 dark:border-[#342D26] flex-shrink-0">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#A87B43]">{stats.totalRevenue.toFixed(0)} <span className="text-xs text-[#9C9388]">CHF</span></p>
              <p className="text-[11px] font-semibold text-[#6B635B] dark:text-[#A89F95]">En cours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Filter */}
      <div className="flex items-center gap-1.5 bg-[#F0EAE1] dark:bg-[#25201A] p-1 rounded-xl w-fit overflow-x-auto shadow-2xs">
        {['all', 'terrace', 'main', 'bar', 'private'].map((zone) => (
          <button 
            key={zone} 
            onClick={() => setZoneFilter(zone)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              zoneFilter === zone 
                ? 'bg-[#A87B43] text-white shadow-xs' 
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816] dark:hover:text-[#F8F6F0]'
            }`}
          >
            {zone === 'all' ? 'Toutes les zones' : getZoneLabel(zone)}
          </button>
        ))}
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {filteredTables.map((table) => {
          const isOcc = table.status === 'occupied';
          return (
            <button
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={`warm-card relative rounded-2xl p-4 border text-left transition-all hover:scale-[1.02] flex flex-col justify-between ${
                isOcc
                  ? 'border-[#A87B43] bg-[#F5EBE1]/40 dark:bg-[#2C241D] shadow-xs'
                  : 'border-[#EFECE6] dark:border-[#342D26] bg-white dark:bg-[#221E1A] hover:border-[#A87B43]/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xl sm:text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">T{table.number}</p>
                  <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(table.status)}`} />
                </div>
                <p className="text-xs text-[#9C9388] mt-0.5">{table.seats} places · {getZoneLabel(table.zone)}</p>
                {table.customer && (
                  <p className="text-xs font-bold text-[#1A1816] dark:text-[#F8F6F0] mt-2 truncate">
                    {table.customer}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-[#EFECE6]/70 dark:border-[#342D26]">
                {table.orderTotal ? (
                  <p className="text-xs sm:text-sm font-extrabold text-[#A87B43]">
                    {table.orderTotal.toFixed(2)} CHF
                  </p>
                ) : (
                  <span className="text-[11px] font-semibold text-[#9C9388]">
                    {getStatusLabel(table.status)}
                  </span>
                )}
                {table.since && <p className="text-[10px] text-[#9C9388]">Depuis {table.since}</p>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Table Detail Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in" onClick={() => setSelectedTable(null)}>
          <div className="bg-white dark:bg-[#221E1A] rounded-2xl w-full max-w-sm border border-[#EFECE6] dark:border-[#342D26] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#EFECE6] dark:border-[#342D26]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1A1816] dark:text-[#F8F6F0]">Table {selectedTable.number}</h2>
                <button onClick={() => setSelectedTable(null)} className="p-1.5 text-[#9C9388] hover:text-[#1A1816] dark:hover:text-[#F8F6F0] rounded-lg"><X size={18} /></button>
              </div>
              <p className="text-xs text-[#9C9388] mt-0.5">{selectedTable.seats} places · {getZoneLabel(selectedTable.zone)}</p>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#6B635B] dark:text-[#A89F95]">Statut</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F0EAE1] dark:bg-[#2C2620] text-[#1A1816] dark:text-[#F8F6F0]">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedTable.status)}`} />
                  {getStatusLabel(selectedTable.status)}
                </span>
              </div>
              {selectedTable.customer && (
                <div className="bg-[#FAF8F3] dark:bg-[#28221B] rounded-xl p-3 border border-[#EFECE6] dark:border-[#342D26]">
                  <p className="font-bold text-[#1A1816] dark:text-[#F8F6F0]">{selectedTable.customer}</p>
                  {selectedTable.orderTotal && <p className="text-[#A87B43] font-bold mt-1">Total: {selectedTable.orderTotal.toFixed(2)} CHF</p>}
                  {selectedTable.since && <p className="text-[11px] text-[#9C9388] mt-0.5">Depuis {selectedTable.since}</p>}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => updateTableStatus(selectedTable.id, 'available')}
                  className="px-3 py-2 bg-[#EAF7ED] text-[#1E7E34] dark:bg-[#1A3320] dark:text-[#4ADE80] rounded-xl font-bold hover:bg-[#DCF2E2] transition-colors"
                >
                  Libérer
                </button>
                <button 
                  onClick={() => updateTableStatus(selectedTable.id, 'occupied')}
                  className="px-3 py-2 bg-[#F5EBE1] text-[#A87B43] dark:bg-[#33271D] dark:text-[#E3B36C] rounded-xl font-bold hover:bg-[#EAE0D4] transition-colors"
                >
                  Occuper
                </button>
                <button 
                  onClick={() => updateTableStatus(selectedTable.id, 'reserved')}
                  className="px-3 py-2 bg-[#EAF2FD] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA] rounded-xl font-bold hover:bg-[#DBEAFE] transition-colors"
                >
                  Réserver
                </button>
                <button 
                  onClick={() => updateTableStatus(selectedTable.id, 'cleaning')}
                  className="px-3 py-2 bg-[#FEF3E7] text-[#B45309] dark:bg-[#3D2616] dark:text-[#F59E0B] rounded-xl font-bold hover:bg-[#FDE7D2] transition-colors"
                >
                  Nettoyage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
