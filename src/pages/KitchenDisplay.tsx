import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, ChefHat, CheckCircle, AlertTriangle, Timer, Flame, X } from 'lucide-react';

interface KitchenOrder {
  id: string;
  orderNumber: string;
  table: string;
  items: KitchenItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served';
  timestamp: Date;
  priority: 'normal' | 'high' | 'urgent';
  notes?: string;
  waiter: string;
}

interface KitchenItem {
  id: string;
  name: string;
  quantity: number;
  modifiers: string[];
  status: 'pending' | 'preparing' | 'ready';
  preparationTime: number; // in minutes
}

export default function KitchenDisplay() {
  const { t } = useApp();
  const [orders, setOrders] = useState<KitchenOrder[]>([
    {
      id: '1',
      orderNumber: 'K001',
      table: 'T5',
      waiter: 'Marie L.',
      items: [
        { id: '1a', name: 'Pizza Margherita', quantity: 1, modifiers: ['Sans oignons'], status: 'preparing', preparationTime: 12 },
        { id: '1b', name: 'Salade César', quantity: 2, modifiers: ['Sauce à part'], status: 'pending', preparationTime: 5 },
      ],
      status: 'preparing',
      timestamp: new Date(Date.now() - 8 * 60000),
      priority: 'normal',
      notes: 'Allergie arachides table 5',
    },
    {
      id: '2',
      orderNumber: 'K002',
      table: 'T3',
      waiter: 'Pierre D.',
      items: [
        { id: '2a', name: 'Burger Classic', quantity: 2, modifiers: ['Cuit à point', 'Sans tomate'], status: 'pending', preparationTime: 10 },
        { id: '2b', name: 'Frites maison', quantity: 2, modifiers: [], status: 'pending', preparationTime: 8 },
      ],
      status: 'pending',
      timestamp: new Date(Date.now() - 3 * 60000),
      priority: 'high',
    },
    {
      id: '3',
      orderNumber: 'K003',
      table: 'T8',
      waiter: 'Sophie M.',
      items: [
        { id: '3a', name: 'Pâtes Carbonara', quantity: 1, modifiers: [], status: 'ready', preparationTime: 15 },
      ],
      status: 'ready',
      timestamp: new Date(Date.now() - 18 * 60000),
      priority: 'normal',
    },
    {
      id: '4',
      orderNumber: 'K004',
      table: 'T1',
      waiter: 'Marie L.',
      items: [
        { id: '4a', name: 'Steak Frites', quantity: 1, modifiers: ['Saignant'], status: 'preparing', preparationTime: 20 },
        { id: '4b', name: 'Soupe du jour', quantity: 1, modifiers: [], status: 'ready', preparationTime: 3 },
      ],
      status: 'preparing',
      timestamp: new Date(Date.now() - 12 * 60000),
      priority: 'urgent',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');

  // Auto-refresh timer
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update timers
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getElapsedTime = (timestamp: Date): string => {
    const diff = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (diff < 1) return '< 1 min';
    return `${diff} min`;
  };

  const isDelayed = (order: KitchenOrder): boolean => {
    const elapsed = (Date.now() - order.timestamp.getTime()) / 60000;
    const maxPrepTime = Math.max(...order.items.map(i => i.preparationTime));
    return elapsed > maxPrepTime * 1.5;
  };

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  const updateItemStatus = (orderId: string, itemId: string, newStatus: KitchenItem['status']) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item =>
          item.id === itemId ? { ...item, status: newStatus } : item
        );
        const allReady = updatedItems.every(i => i.status === 'ready');
        return {
          ...order,
          items: updatedItems,
          status: allReady ? 'ready' : order.status,
        };
      }
      return order;
    }));
  };

  const markOrderReady = (orderId: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status: 'ready' as const, items: order.items.map(i => ({ ...i, status: 'ready' as const })) }
        : order
    ));
  };

  const markOrderServed = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-amber-400 bg-amber-50 dark:bg-amber-900/10';
      case 'preparing': return 'border-blue-400 bg-blue-50 dark:bg-blue-900/10';
      case 'ready': return 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10';
      case 'served': return 'border-slate-300 bg-slate-50 dark:bg-slate-800';
      default: return 'border-slate-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      default: return 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  return (
    <div className="p-6 space-y-6 overflow-y-auto min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <ChefHat size={22} className="text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Affichage Cuisine</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Kitchen Display System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">En direct</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">En attente</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Clock size={24} className="text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{preparingCount}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">En préparation</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Flame size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{readyCount}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Prêtes</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <CheckCircle size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 w-fit">
        {(['all', 'pending', 'preparing', 'ready'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              filter === f ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            {f === 'all' ? 'Toutes' : f === 'pending' ? 'En attente' : f === 'preparing' ? 'En préparation' : 'Prêtes'}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className={`rounded-xl border-2 p-4 transition-all ${getStatusColor(order.status)} ${
              isDelayed(order) ? 'ring-2 ring-red-400 ring-offset-2' : ''
            }`}
          >
            {/* Order Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-800 dark:text-white">{order.orderNumber}</span>
                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-medium text-slate-700 dark:text-slate-300">
                  {order.table}
                </span>
                {order.priority !== 'normal' && (
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityBadge(order.priority)}`}>
                    {order.priority === 'urgent' ? '🔥 URGENT' : '⚡ PRIORITÉ'}
                  </span>
                )}
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                isDelayed(order) ? 'text-red-600' : 'text-slate-500'
              }`}>
                {isDelayed(order) ? <AlertTriangle size={12} /> : <Timer size={12} />}
                <span>{getElapsedTime(order.timestamp)}</span>
              </div>
            </div>

            {/* Waiter & Notes */}
            <div className="flex items-center gap-2 mb-3 text-xs text-slate-500 dark:text-slate-400">
              <span>👤 {order.waiter}</span>
              {order.notes && (
                <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">
                  ⚠️ {order.notes}
                </span>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    item.status === 'ready' ? 'bg-emerald-100/50 dark:bg-emerald-900/20' :
                    item.status === 'preparing' ? 'bg-blue-100/50 dark:bg-blue-900/20' :
                    'bg-white/50 dark:bg-slate-700/50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800 dark:text-white">{item.quantity}x</span>
                      <span className={`text-sm ${item.status === 'ready' ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                        {item.name}
                      </span>
                    </div>
                    {item.modifiers.length > 0 && (
                      <p className="text-xs text-orange-600 dark:text-orange-400 ml-6 mt-0.5">
                        → {item.modifiers.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {item.status === 'pending' && (
                      <button
                        onClick={() => updateItemStatus(order.id, item.id, 'preparing')}
                        className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        title="Commencer la préparation"
                      >
                        <Flame size={12} />
                      </button>
                    )}
                    {item.status === 'preparing' && (
                      <button
                        onClick={() => updateItemStatus(order.id, item.id, 'ready')}
                        className="p-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                        title="Marquer comme prêt"
                      >
                        <CheckCircle size={12} />
                      </button>
                    )}
                    {item.status === 'ready' && (
                      <CheckCircle size={16} className="text-emerald-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {order.status !== 'ready' && (
                <button
                  onClick={() => markOrderReady(order.id)}
                  className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle size={14} />
                  Tout prêt
                </button>
              )}
              {order.status === 'ready' && (
                <button
                  onClick={() => markOrderServed(order.id)}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle size={14} />
                  Servi
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <ChefHat size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-lg text-slate-500 dark:text-slate-400">Aucune commande à afficher</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Les nouvelles commandes apparaîtront ici</p>
        </div>
      )}
    </div>
  );
}
