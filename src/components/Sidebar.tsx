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
      case 'warning': return <AlertTriangle size={16} className="text-[#e3b36c]" />;
      case 'info': return <Info size={16} className="text-[#906b33]" />;
      case 'success': return <CheckCircle size={16} className="text-[#10b981]" />;
      case 'error': return <XCircle size={16} className="text-[#ef4444]" />;
      default: return <Info size={16} className="text-[#b8a587]" />;
    }
  };

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-[#906b33] dark:bg-[#1a1410] text-[#f4f1e9] flex flex-col transition-all duration-300 relative border-r border-[#e3b36c]/20`}>
      {/* Logo */}
      <div className="p-4 border-b border-[#e3b36c]/20 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#e3b36c] to-[#906b33] rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0 text-[#f4f1e9]">
          CM
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-lg leading-tight">CashMag</h1>
            <p className="text-xs text-[#b8a587]">Gestion de caisse</p>
          </div>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-[#906b33] dark:bg-[#2a2018] rounded-full flex items-center justify-center hover:bg-[#a6885b] transition-colors z-10 border border-[#e3b36c]/30"
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
                  ? 'bg-[#e3b36c]/20 text-[#e3b36c] border-r-3 border-[#e3b36c]'
                  : 'text-[#f4f1e9] hover:bg-[#a6885b]/20 hover:text-[#e3b36c]'
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
        <div className="border-t border-[#e3b36c]/20">
          {/* Notifications & Dark Mode */}
          <div className="p-4 flex items-center justify-between border-b border-[#e3b36c]/20">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-[#a6885b]/20 rounded-lg transition-colors"
              >
                <Bell size={18} className="text-[#f4f1e9]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-[#a6885b]/20 rounded-lg transition-colors"
              title={darkMode ? t('lightMode') : t('darkMode')}
            >
              {darkMode ? <Sun size={18} className="text-[#e3b36c]" /> : <Moon size={18} className="text-[#f4f1e9]" />}
            </button>
          </div>

          {/* Sync Status */}
          <div className="px-4 pb-3">
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${
              syncStatus.isOnline ? 'bg-[#10b981]/20' : 'bg-[#ef4444]/20'
            }`}>
              <div className="flex items-center gap-2">
                {syncStatus.isOnline ? (
                  <Wifi size={14} className="text-[#10b981]" />
                ) : (
                  <WifiOff size={14} className="text-[#ef4444]" />
                )}
                <span className="text-xs text-[#f4f1e9]">
                  {syncStatus.isOnline ? t('online') : t('offline')}
                </span>
              </div>
              {syncStatus.isOnline && (
                <button
                  onClick={sync}
                  disabled={syncStatus.syncInProgress}
                  className="p-1 hover:bg-[#a6885b]/20 rounded transition-colors disabled:opacity-50"
                  title={t('sync')}
                >
                  <RefreshCw size={14} className={`text-[#f4f1e9] ${syncStatus.syncInProgress ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={14} className="text-[#b8a587]" />
              <span className="text-xs text-[#b8a587] uppercase">{t('language')}</span>
            </div>
            <div className="flex gap-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                    language === lang
                      ? 'bg-[#e3b36c] text-[#906b33]'
                      : 'bg-[#a6885b]/20 text-[#f4f1e9] hover:bg-[#a6885b]/30'
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
        <div className="border-t border-[#e3b36c]/20 p-3 flex flex-col items-center gap-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-[#a6885b]/20 rounded-lg transition-colors"
          >
            <Bell size={18} className="text-[#f4f1e9]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-[#a6885b]/20 rounded-lg transition-colors"
          >
            {darkMode ? <Sun size={18} className="text-[#e3b36c]" /> : <Moon size={18} className="text-[#f4f1e9]" />}
          </button>
        </div>
      )}

      {/* Notification Panel */}
      {showNotifications && (
        <div className="absolute top-0 right-0 w-80 h-full bg-[#f4f1e9] dark:bg-[#2a2018] text-[#906b33] dark:text-[#f4f1e9] shadow-2xl z-20 flex flex-col animate-in slide-in-from-right border-l border-[#e3b36c]/30">
          <div className="p-4 border-b border-[#e3b36c]/20 flex items-center justify-between">
            <h3 className="font-bold text-lg">{t('notifications')}</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button onClick={clearNotifications} className="text-xs text-[#906b33] dark:text-[#e3b36c] hover:text-[#a6885b] font-medium flex items-center gap-1">
                  <CheckCheck size={14} /> {t('markAllRead')}
                </button>
              )}
              <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-[#e3b36c]/20 rounded">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[#b8a587]">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('noNotifications')}</p>
              </div>
            ) : (
              <div className="divide-y divide-[#e3b36c]/10">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`w-full text-left p-4 hover:bg-[#e3b36c]/10 transition-colors ${!notif.read ? 'bg-[#e3b36c]/5' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notif.read ? 'font-semibold' : 'font-medium'} text-[#906b33] dark:text-[#f4f1e9]`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-[#a6885b] dark:text-[#b8a587] mt-0.5">{notif.message}</p>
                        <p className="text-xs text-[#b8a587] mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && <div className="w-2 h-2 bg-[#e3b36c] rounded-full mt-2 flex-shrink-0" />}
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
