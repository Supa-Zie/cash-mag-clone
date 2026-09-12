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
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-[#F8F6F0] dark:bg-[#1A1816] text-[#1A1816] dark:text-[#F8F6F0] flex flex-col transition-all duration-300 relative border-r border-[#EFECE6] dark:border-[#2C2620]`}>
      {/* Logo */}
      <div className="p-4 border-b border-[#EFECE6] dark:border-[#2C2620] flex items-center gap-3">
        <div className="w-10 h-10 bg-[#A87B43] rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 text-white shadow-sm">
          CM
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="font-bold text-lg leading-tight tracking-tight text-[#1A1816] dark:text-[#F8F6F0]">CashMag</h1>
            <p className="text-xs text-[#9C9388]">Gestion de caisse</p>
          </div>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-white dark:bg-[#24201D] text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816] dark:hover:text-[#F8F6F0] rounded-full flex items-center justify-center transition-colors z-10 border border-[#EFECE6] dark:border-[#342D26] shadow-sm"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2.5 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          if (collapsed) {
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                title={t(item.key)}
                className={`w-11 h-11 mx-auto flex items-center justify-center rounded-full transition-all ${
                  isActive
                    ? 'bg-[#1A1816] dark:bg-[#F8F6F0] text-white dark:text-[#1A1816] shadow-sm'
                    : 'text-[#6B635B] dark:text-[#A89F95] hover:bg-[#F0EAE1] dark:hover:bg-[#2A241E] hover:text-[#1A1816] dark:hover:text-[#F8F6F0]'
                }`}
              >
                <Icon size={18} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-all rounded-xl ${
                isActive
                  ? 'bg-[#F0EAE1] dark:bg-[#2A241E] text-[#1A1816] dark:text-[#F8F6F0] font-semibold shadow-xs'
                  : 'text-[#6B635B] dark:text-[#A89F95] hover:bg-[#F2ECE4]/70 dark:hover:bg-[#241E18]/70 hover:text-[#1A1816] dark:hover:text-[#F8F6F0]'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                isActive 
                  ? 'bg-[#1A1816] dark:bg-[#F8F6F0] text-white dark:text-[#1A1816] shadow-xs' 
                  : 'text-[#8C837A] dark:text-[#9C9388]'
              }`}>
                <Icon size={16} />
              </div>
              <span className="truncate">{t(item.key)}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      {!collapsed && (
        <div className="border-t border-[#EFECE6] dark:border-[#2C2620] bg-[#FAF8F3] dark:bg-[#181512]">
          {/* Notifications & Dark Mode */}
          <div className="p-3.5 flex items-center justify-between border-b border-[#EFECE6] dark:border-[#2C2620]">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-[#F0EAE1] dark:hover:bg-[#2A241E] rounded-xl transition-colors text-[#1A1816] dark:text-[#F8F6F0]"
                title={t('notifications')}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute 1 top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-[#F0EAE1] dark:hover:bg-[#2A241E] rounded-xl transition-colors text-[#1A1816] dark:text-[#F8F6F0]"
              title={darkMode ? t('lightMode') : t('darkMode')}
            >
              {darkMode ? <Sun size={18} className="text-[#E3B36C]" /> : <Moon size={18} className="text-[#1A1816]" />}
            </button>
          </div>

          {/* Sync Status */}
          <div className="px-3.5 py-2.5">
            <div className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
              syncStatus.isOnline 
                ? 'bg-[#EAF7ED] text-[#1E7E34] dark:bg-[#1A3320] dark:text-[#4ADE80]' 
                : 'bg-[#FEECEC] text-[#DC2626] dark:bg-[#381B1B] dark:text-[#F87171]'
            }`}>
              <div className="flex items-center gap-2">
                {syncStatus.isOnline ? (
                  <Wifi size={13} className="text-[#1E7E34] dark:text-[#4ADE80]" />
                ) : (
                  <WifiOff size={13} className="text-[#DC2626] dark:text-[#F87171]" />
                )}
                <span>
                  {syncStatus.isOnline ? t('online') : t('offline')}
                </span>
              </div>
              {syncStatus.isOnline && (
                <button
                  onClick={sync}
                  disabled={syncStatus.syncInProgress}
                  className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                  title={t('sync')}
                >
                  <RefreshCw size={13} className={`${syncStatus.syncInProgress ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="p-3.5 pt-1">
            <div className="flex items-center gap-1.5 mb-2">
              <Globe size={13} className="text-[#9C9388]" />
              <span className="text-[11px] font-semibold text-[#9C9388] uppercase tracking-wider">{t('language')}</span>
            </div>
            <div className="flex gap-1 bg-[#EFE9DF] dark:bg-[#25201A] p-1 rounded-xl">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 px-2 py-1 text-xs font-medium rounded-lg transition-all ${
                    language === lang
                      ? 'bg-[#A87B43] text-white shadow-xs'
                      : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816] dark:hover:text-[#F8F6F0]'
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
        <div className="border-t border-[#EFECE6] dark:border-[#2C2620] p-3 flex flex-col items-center gap-2 bg-[#FAF8F3] dark:bg-[#181512]">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-[#F0EAE1] dark:hover:bg-[#2A241E] rounded-xl transition-colors text-[#1A1816] dark:text-[#F8F6F0]"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-[#F0EAE1] dark:hover:bg-[#2A241E] rounded-xl transition-colors text-[#1A1816] dark:text-[#F8F6F0]"
          >
            {darkMode ? <Sun size={18} className="text-[#E3B36C]" /> : <Moon size={18} />}
          </button>
        </div>
      )}

      {/* Notification Panel */}
      {showNotifications && (
        <div className="absolute top-0 right-0 w-80 h-full bg-[#FFFFFF] dark:bg-[#221E1A] text-[#1A1816] dark:text-[#F8F6F0] shadow-2xl z-30 flex flex-col animate-in slide-in-from-right border-l border-[#EFECE6] dark:border-[#342D26]">
          <div className="p-4 border-b border-[#EFECE6] dark:border-[#342D26] flex items-center justify-between">
            <h3 className="font-bold text-base">{t('notifications')}</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button onClick={clearNotifications} className="text-xs text-[#A87B43] dark:text-[#E3B36C] hover:underline font-medium flex items-center gap-1">
                  <CheckCheck size={14} /> {t('markAllRead')}
                </button>
              )}
              <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-[#F0EAE1] dark:hover:bg-[#2A241E] rounded-lg">
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[#9C9388]">
                <Bell size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">{t('noNotifications')}</p>
              </div>
            ) : (
              <div className="divide-y divide-[#EFECE6] dark:divide-[#342D26]">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`w-full text-left p-4 hover:bg-[#FAF8F3] dark:hover:bg-[#2A241E] transition-colors ${!notif.read ? 'bg-[#F9F6F0]/60 dark:bg-[#2A241E]/40' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notif.read ? 'font-semibold' : 'font-medium'} text-[#1A1816] dark:text-[#F8F6F0]`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-[#6B635B] dark:text-[#A89F95] mt-0.5">{notif.message}</p>
                        <p className="text-[11px] text-[#9C9388] mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && <div className="w-2 h-2 bg-[#A87B43] rounded-full mt-2 flex-shrink-0" />}
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
