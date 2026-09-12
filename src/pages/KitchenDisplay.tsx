import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, ChefHat, CheckCircle, AlertTriangle, Timer, Flame } from 'lucide-react';

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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-[#FEECEC] text-[#DC2626] dark:bg-[#381B1B] dark:text-[#F87171]';
      case 'high': return 'bg-[#FEF3E7] text-[#B45309] dark:bg-[#3D2616] dark:text-[#F59E0B]';
      default: return 'bg-[#F0EAE1] text-[#6B635B] dark:bg-[#2D241C] dark:text-[#A89F95]';
    }
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto bg-[#F8F6F0] dark:bg-[#181512] min-h-screen text-[#1A1816] dark:text-[#F8F6F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] border border-[#EFECE6] dark:border-[#342D26] rounded-xl flex items-center justify-center">
            <ChefHat size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1816] dark:text-[#F8F6F0]">Affichage Cuisine</h1>
            <p className="text-[#6B635B] dark:text-[#A89F95] text-sm">Kitchen Display System</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF4ED] dark:bg-[#2D241C] border border-[#E8DEC8] dark:border-[#4A3B2C] rounded-full self-start sm:self-auto">
          <div className="w-2 h-2 bg-[#A87B43] rounded-full animate-pulse" />
          <span className="text-xs font-bold text-[#A87B43]">En direct</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-[#B45309]">{pendingCount}</p>
              <p className="text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95] font-medium">En attente</p>
            </div>
            <div className="w-11 h-11 bg-[#FEF3E7] dark:bg-[#3D2616] text-[#B45309] rounded-xl flex items-center justify-center">
              <Clock size={22} />
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-[#A87B43]">{preparingCount}</p>
              <p className="text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95] font-medium">En préparation</p>
            </div>
            <div className="w-11 h-11 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] rounded-xl flex items-center justify-center">
              <Flame size={22} />
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-[#2563EB]">{readyCount}</p>
              <p className="text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95] font-medium">Prêtes</p>
            </div>
            <div className="w-11 h-11 bg-[#EAF2FD] dark:bg-[#1E293B] text-[#2563EB] rounded-xl flex items-center justify-center">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full p-1.5 w-fit shadow-xs">
        {(['all', 'pending', 'preparing', 'ready'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              filter === f 
                ? 'bg-[#A87B43] text-white shadow-xs' 
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816] dark:hover:text-white'
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
            className={`warm-card bg-white dark:bg-[#221E1A] rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
              order.status === 'ready' ? 'border-[#2563EB]/50' :
              order.status === 'preparing' ? 'border-[#A87B43]/50' :
              'border-[#EFECE6] dark:border-[#342D26]'
            } ${isDelayed(order) ? 'ring-2 ring-[#DC2626]/60 ring-offset-2' : ''}`}
          >
            <div>
              {/* Order Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#1A1816] dark:text-[#F8F6F0]">{order.orderNumber}</span>
                  <span className="px-2.5 py-0.5 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] rounded-lg text-xs font-bold border border-[#E8DEC8] dark:border-[#4A3B2C]">
                    {order.table}
                  </span>
                  {order.priority !== 'normal' && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getPriorityBadge(order.priority)}`}>
                      {order.priority === 'urgent' ? '🔥 URGENT' : '⚡ PRIORITÉ'}
                    </span>
                  )}
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${
                  isDelayed(order) ? 'text-[#DC2626]' : 'text-[#6B635B] dark:text-[#A89F95]'
                }`}>
                  {isDelayed(order) ? <AlertTriangle size={13} /> : <Timer size={13} />}
                  <span>{getElapsedTime(order.timestamp)}</span>
                </div>
              </div>

              {/* Waiter & Notes */}
              <div className="flex items-center gap-2 mb-3 text-xs text-[#6B635B] dark:text-[#A89F95]">
                <span>👤 {order.waiter}</span>
                {order.notes && (
                  <span className="px-2 py-0.5 bg-[#FEF3E7] dark:bg-[#3D2616] text-[#B45309] font-medium rounded-md">
                    ⚠️ {order.notes}
                  </span>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      item.status === 'ready' 
                        ? 'bg-[#EAF2FD]/50 dark:bg-[#1E293B]/40 border-[#2563EB]/20' 
                        : item.status === 'preparing' 
                        ? 'bg-[#FAF4ED]/50 dark:bg-[#2D241C]/40 border-[#A87B43]/20' 
                        : 'bg-[#FAF8F3] dark:bg-[#25201A] border-[#EFECE6] dark:border-[#342D26]'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1A1816] dark:text-[#F8F6F0]">{item.quantity}x</span>
                        <span className={`text-sm font-medium ${item.status === 'ready' ? 'line-through text-[#9C9388]' : 'text-[#1A1816] dark:text-[#F8F6F0]'}`}>
                          {item.name}
                        </span>
                      </div>
                      {item.modifiers.length > 0 && (
                        <p className="text-xs text-[#B45309] ml-6 mt-0.5 font-medium">
                          → {item.modifiers.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {item.status === 'pending' && (
                        <button
                          onClick={() => updateItemStatus(order.id, item.id, 'preparing')}
                          className="p-1.5 bg-[#A87B43] text-white rounded-lg hover:bg-[#906B33] transition-colors"
                          title="Commencer la préparation"
                        >
                          <Flame size={13} />
                        </button>
                      )}
                      {item.status === 'preparing' && (
                        <button
                          onClick={() => updateItemStatus(order.id, item.id, 'ready')}
                          className="p-1.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors"
                          title="Marquer comme prêt"
                        >
                          <CheckCircle size={13} />
                        </button>
                      )}
                      {item.status === 'ready' && (
                        <CheckCircle size={16} className="text-[#2563EB]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {order.status !== 'ready' && (
                <button
                  onClick={() => markOrderReady(order.id)}
                  className="flex-1 py-2.5 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={14} />
                  Tout prêt
                </button>
              )}
              {order.status === 'ready' && (
                <button
                  onClick={() => markOrderServed(order.id)}
                  className="flex-1 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
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
        <div className="text-center py-20">
          <ChefHat size={48} className="mx-auto text-[#9C9388] mb-4 opacity-50" />
          <p className="text-base font-bold text-[#1A1816] dark:text-[#F8F6F0]">Aucune commande à afficher</p>
          <p className="text-xs text-[#6B635B] dark:text-[#A89F95] mt-1">Les nouvelles commandes apparaîtront ici</p>
        </div>
      )}
    </div>
  );
}
