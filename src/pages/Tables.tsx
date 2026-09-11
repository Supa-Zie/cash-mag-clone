import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, Users, Clock, DollarSign, Check, X, Plus } from 'lucide-react';

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
      case 'available': return 'bg-emerald-500';
      case 'occupied': return 'bg-red-500';
      case 'reserved': return 'bg-blue-500';
      case 'cleaning': return 'bg-amber-500';
      default: return 'bg-slate-400';
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
      case 'main': return 'Salle';
      case 'bar': return 'Bar';
      case 'private': return 'Privé';
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
    <div className="p-6 space-y-6 overflow-y-auto" style={{ backgroundColor: '#f6f5fa' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('tables')}</h1>
          <p className="text-slate-500 text-sm">Plan de salle et gestion des tables</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><Check size={20} className="text-emerald-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{stats.available}</p><p className="text-xs text-slate-500">Libres</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><Users size={20} className="text-red-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{stats.occupied}</p><p className="text-xs text-slate-500">Occupées</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Clock size={20} className="text-blue-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{stats.reserved}</p><p className="text-xs text-slate-500">Réservées</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><UtensilsCrossed size={20} className="text-amber-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{stats.cleaning}</p><p className="text-xs text-slate-500">Nettoyage</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><DollarSign size={20} className="text-purple-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{stats.totalRevenue.toFixed(0)}</p><p className="text-xs text-slate-500">CHF en cours</p></div>
          </div>
        </div>
      </div>

      {/* Zone Filter */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 w-fit">
        {['all', 'terrace', 'main', 'bar', 'private'].map((zone) => (
          <button key={zone} onClick={() => setZoneFilter(zone)}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              zoneFilter === zone ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {zone === 'all' ? 'Toutes' : getZoneLabel(zone)}
          </button>
        ))}
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredTables.map((table) => (
          <button
            key={table.id}
            onClick={() => setSelectedTable(table)}
            className={`relative rounded-xl p-4 border-2 transition-all hover:shadow-md ${
              table.status === 'available' ? 'border-emerald-200 bg-emerald-50 hover:border-emerald-400' :
              table.status === 'occupied' ? 'border-red-200 bg-red-50 hover:border-red-400' :
              table.status === 'reserved' ? 'border-blue-200 bg-blue-50 hover:border-blue-400' :
              'border-amber-200 bg-amber-50 hover:border-amber-400'
            }`}
          >
            <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${getStatusColor(table.status)}`} />
            <p className="text-2xl font-bold text-slate-800">T{table.number}</p>
            <p className="text-xs text-slate-500 mt-1">{table.seats} places</p>
            <p className="text-xs text-slate-400 mt-0.5">{getZoneLabel(table.zone)}</p>
            {table.customer && <p className="text-xs text-slate-600 mt-2 font-medium truncate">{table.customer}</p>}
            {table.orderTotal && <p className="text-xs font-bold text-slate-800 mt-1">{table.orderTotal.toFixed(2)} CHF</p>}
            {table.since && <p className="text-xs text-slate-400">depuis {table.since}</p>}
          </button>
        ))}
      </div>

      {/* Table Detail Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTable(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Table {selectedTable.number}</h2>
                <button onClick={() => setSelectedTable(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
              </div>
              <p className="text-sm text-slate-500 mt-1">{selectedTable.seats} places · {getZoneLabel(selectedTable.zone)}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Statut actuel</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  selectedTable.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                  selectedTable.status === 'occupied' ? 'bg-red-100 text-red-700' :
                  selectedTable.status === 'reserved' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedTable.status)}`} />
                  {getStatusLabel(selectedTable.status)}
                </span>
              </div>
              {selectedTable.customer && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-slate-800">{selectedTable.customer}</p>
                  {selectedTable.orderTotal && <p className="text-sm text-slate-600 mt-1">Total: {selectedTable.orderTotal.toFixed(2)} CHF</p>}
                  {selectedTable.since && <p className="text-xs text-slate-500 mt-1">Depuis {selectedTable.since}</p>}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => updateTableStatus(selectedTable.id, 'available')}
                  className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200">
                  Libérer
                </button>
                <button onClick={() => updateTableStatus(selectedTable.id, 'occupied')}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">
                  Occuper
                </button>
                <button onClick={() => updateTableStatus(selectedTable.id, 'reserved')}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">
                  Réserver
                </button>
                <button onClick={() => updateTableStatus(selectedTable.id, 'cleaning')}
                  className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200">
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
