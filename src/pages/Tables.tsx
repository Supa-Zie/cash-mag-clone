import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, Users, Clock, DollarSign, Check, X, Edit2, Plus, Minus, ChefHat } from 'lucide-react';

export default function Tables() {
  const { t, tables, setTables } = useApp();
  const [zoneFilter, setZoneFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'occupied' | 'reserved' | 'bill-requested'>('all');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const zones = [...new Set(tables.map(t => t.zone))];

  const filteredTables = tables.filter(table => {
    const matchesZone = zoneFilter === 'all' || table.zone === zoneFilter;
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
    return matchesZone && matchesStatus;
  });

  const availableCount = tables.filter(t => t.status === 'available').length;
  const occupiedCount = tables.filter(t => t.status === 'occupied').length;
  const reservedCount = tables.filter(t => t.status === 'reserved').length;
  const billCount = tables.filter(t => t.status === 'bill-requested').length;
  const totalRevenue = tables.filter(t => t.currentOrder).reduce((sum, t) => sum + (t.currentOrder?.total || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-50 border-emerald-200 hover:border-emerald-400';
      case 'occupied': return 'bg-blue-50 border-blue-200 hover:border-blue-400';
      case 'reserved': return 'bg-amber-50 border-amber-200 hover:border-amber-400';
      case 'bill-requested': return 'bg-red-50 border-red-200 hover:border-red-400';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-500';
      case 'occupied': return 'bg-blue-500';
      case 'reserved': return 'bg-amber-500';
      case 'bill-requested': return 'bg-red-500 animate-pulse';
      default: return 'bg-slate-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Occupée';
      case 'reserved': return 'Réservée';
      case 'bill-requested': return 'Addition demandée';
      default: return status;
    }
  };

  const updateTableStatus = (tableId: string, newStatus: 'available' | 'occupied' | 'reserved' | 'bill-requested') => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        if (newStatus === 'available') {
          return { ...t, status: newStatus, currentOrder: undefined };
        }
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const selectedTableData = selectedTable ? tables.find(t => t.id === selectedTable) : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <UtensilsCrossed className="text-emerald-600" />
            {t('tables')}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gestion des tables — Restaurant</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span className="text-sm font-medium text-emerald-700">{availableCount} tables libres</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500">Disponibles</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{availableCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-slate-500">Occupées</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{occupiedCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-500">Réservées</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{reservedCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-slate-500">Additions</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{billCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-emerald-600" />
            <span className="text-xs text-slate-500">CA en cours</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{totalRevenue.toFixed(0)} CHF</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setZoneFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${zoneFilter === 'all' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Toutes les zones
            </button>
            {zones.map(zone => (
              <button
                key={zone}
                onClick={() => setZoneFilter(zone)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${zoneFilter === zone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {zone}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            {(['all', 'available', 'occupied', 'reserved', 'bill-requested'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === status ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {status === 'all' ? 'Tout' : getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floor Plan */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredTables.map((table) => (
          <button
            key={table.id}
            onClick={() => setSelectedTable(table.id)}
            className={`relative rounded-xl p-4 border-2 transition-all ${getStatusColor(table.status)} ${selectedTable === table.id ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
          >
            {/* Status indicator */}
            <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${getStatusDot(table.status)}`} />

            {/* Table number */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-white/80 rounded-full flex items-center justify-center mb-2 shadow-sm">
                <span className="text-xl font-bold text-slate-800">{table.number}</span>
              </div>
              <p className="text-xs font-medium text-slate-600">{table.zone}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Users size={12} className="text-slate-400" />
                <span className="text-xs text-slate-500">{table.seats} places</span>
              </div>
            </div>

            {/* Order info */}
            {table.currentOrder && (
              <div className="mt-2 pt-2 border-t border-slate-200/50">
                <p className="text-xs font-medium text-slate-700">{table.currentOrder.total.toFixed(2)} CHF</p>
                <p className="text-xs text-slate-500 truncate">{table.currentOrder.server}</p>
              </div>
            )}

            {/* Bill requested badge */}
            {table.status === 'bill-requested' && (
              <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                🔔
              </div>
            )}
          </button>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-12">
          <UtensilsCrossed size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Aucune table trouvée</p>
        </div>
      )}

      {/* Table Detail Modal */}
      {selectedTableData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTable(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-emerald-700">{selectedTableData.number}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Table {selectedTableData.number}</h2>
                  <p className="text-sm text-slate-500">{selectedTableData.zone} · {selectedTableData.seats} places</p>
                </div>
              </div>
              <button onClick={() => setSelectedTable(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>

            {/* Status */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${getStatusDot(selectedTableData.status)}`} />
                <span className="text-sm font-medium text-slate-700">{getStatusLabel(selectedTableData.status)}</span>
              </div>
            </div>

            {/* Current Order */}
            {selectedTableData.currentOrder && (
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <ChefHat size={16} className="text-emerald-600" />
                  Commande en cours
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Serveur</span>
                    <span className="font-medium text-slate-700">{selectedTableData.currentOrder.server}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Début</span>
                    <span className="font-medium text-slate-700">
                      {new Date(selectedTableData.currentOrder.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Durée</span>
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                      <Clock size={12} />
                      {Math.round((Date.now() - new Date(selectedTableData.currentOrder.startTime).getTime()) / 60000)} min
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                    <span className="text-slate-500">Total</span>
                    <span className="font-bold text-emerald-600">{selectedTableData.currentOrder.total.toFixed(2)} CHF</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              {selectedTableData.status === 'available' && (
                <button
                  onClick={() => { updateTableStatus(selectedTableData.id, 'occupied'); setSelectedTable(null); }}
                  className="col-span-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Asseoir des clients
                </button>
              )}
              {selectedTableData.status === 'occupied' && (
                <>
                  <button
                    onClick={() => { updateTableStatus(selectedTableData.id, 'bill-requested'); setSelectedTable(null); }}
                    className="px-4 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600"
                  >
                    Demander l'addition
                  </button>
                  <button
                    onClick={() => { updateTableStatus(selectedTableData.id, 'available'); setSelectedTable(null); }}
                    className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
                  >
                    Libérer la table
                  </button>
                </>
              )}
              {selectedTableData.status === 'bill-requested' && (
                <button
                  onClick={() => { updateTableStatus(selectedTableData.id, 'available'); setSelectedTable(null); }}
                  className="col-span-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
                >
                  Encaisser & Libérer
                </button>
              )}
              {selectedTableData.status === 'reserved' && (
                <>
                  <button
                    onClick={() => { updateTableStatus(selectedTableData.id, 'occupied'); setSelectedTable(null); }}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Confirmer arrivée
                  </button>
                  <button
                    onClick={() => { updateTableStatus(selectedTableData.id, 'available'); setSelectedTable(null); }}
                    className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300"
                  >
                    Annuler réservation
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
