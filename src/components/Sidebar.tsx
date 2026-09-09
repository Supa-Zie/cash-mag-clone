import { useApp } from '../context/AppContext';
import { languageNames } from '../i18n/translations';
import {
  LayoutDashboard, ShoppingCart, Package, Warehouse,
  Receipt, Banknote, BarChart3, Settings, Globe, ChevronLeft, ChevronRight,
  Users, Award, UtensilsCrossed, Tag, Truck, Bell, Moon, Sun, X, CheckCheck,
  AlertTriangle, Info, CheckCircle, XCircle, Wifi, WifiOff, RefreshCw, Clock, ChefHat
} from 'lucide-react';
import { useState } from 'react';
import { useSync } from '../hooks/useSync';

type Page = 'dashboard' | 'pos' | 'products' | 'inventory' | 'transactions' | 'cash-register' | 'reports' | 'settings' | 'employees' | 'loyalty' | 'tables' | 'promotions' | 'suppliers' | 'shifts' | 'kitchen';

const navItems: { id: Page; icon: typeof LayoutDashboard; key: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { id: 'pos', icon: ShoppingCart, key: 'pointOfSale' },
  { id: 'products', icon: Package, key: 'products' },
  { id: 'inventory', icon: Warehouse, key: 'inventory' },
  { id: 'transactions', icon: Receipt, key: 'transactions' },
  { id: 'cash-register', icon: Banknote, key: 'cashRegister' },
  { id: 'employees', icon: Users, key: 'employees' },
  { id: 'loyalty', icon: Award, key: 'loyalty' },
  { id: 'tables', icon: UtensilsCrossed, key: 'tables' },
  { id: 'promotions', icon: Tag, key: 'promotions' },
  { id: 'suppliers', icon: Truck, key: 'suppliers' },
  { id: 'shifts', icon: Clock, key: 'shifts' },
  { id: 'kitchen', icon: ChefHat, key: 'kitchen' },
  { id: 'reports', icon: BarChart3, key: 'reports' },
  { id: 'settings', icon: Settings, key: 'settings' },
];

export default function Sidebar() {
  const { t, currentPage, setCurrentPage, language, setLanguage, darkMode, toggleDarkMode, notifications, markAsRead, clearNotifications, unreadCount } = useApp();
  const { syncStatus, sync } = useSync();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const languages: Array<'fr' | 'en' | 'de'> = ['fr', 'en', 'de'];

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'info': return <Info size={16} className="text-blue-500" />;
      case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'error': return <XCircle size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-slate-500" />;
    }
  };

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white flex flex-col transition-all duration-300 relative`}>
      {/* Logo */}
      <div className="p-4 border-b border-slate-700 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
          CM
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-lg leading-tight">CashMag</h1>
            <p className="text-xs text-slate-400">Gestion de caisse</p>
          </div>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${
                isActive
                  ? 'bg-emerald-600/20 text-emerald-400 border-r-3 border-emerald-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span>{t(item.key)}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      {!collapsed && (
        <div className="border-t border-slate-700">
          {/* Notifications & Dark Mode */}
          <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Bell size={18} className="text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title={darkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-300" />}
            </button>
          </div>

          {/* Sync Status */}
          <div className="px-4 pb-3">
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${
              syncStatus.isOnline ? 'bg-emerald-900/30' : 'bg-red-900/30'
            }`}>
              <div className="flex items-center gap-2">
                {syncStatus.isOnline ? (
                  <Wifi size={14} className="text-emerald-400" />
                ) : (
                  <WifiOff size={14} className="text-red-400" />
                )}
                <span className="text-xs text-slate-300">
                  {syncStatus.isOnline ? 'En ligne' : 'Hors ligne'}
                </span>
              </div>
              {syncStatus.isOnline && (
                <button
                  onClick={sync}
                  disabled={syncStatus.syncInProgress}
                  className="p-1 hover:bg-slate-700 rounded transition-colors disabled:opacity-50"
                  title="Synchroniser"
                >
                  <RefreshCw size={14} className={`text-slate-300 ${syncStatus.syncInProgress ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={14} className="text-slate-400" />
              <span className="text-xs text-slate-400 uppercase">Langue</span>
            </div>
            <div className="flex gap-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                    language === lang
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {languageNames[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Collapsed: just icons */}
      {collapsed && (
        <div className="border-t border-slate-700 p-3 flex flex-col items-center gap-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Bell size={18} className="text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-300" />}
          </button>
        </div>
      )}

      {/* Notification Panel */}
      {showNotifications && (
        <div className="absolute top-0 right-0 w-80 h-full bg-white text-slate-800 shadow-2xl z-20 flex flex-col animate-in slide-in-from-right">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-lg">Notifications</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button onClick={clearNotifications} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCheck size={14} /> Tout lire
                </button>
              )}
              <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-emerald-50/50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notif.read ? 'font-semibold' : 'font-medium'} text-slate-800`}>{notif.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
