import { useApp } from '../context/AppContext';
import { languageNames } from '../i18n/translations';
import {
  LayoutDashboard, ShoppingCart, Package, Warehouse,
  Receipt, Banknote, BarChart3, Settings, Globe, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, key: 'dashboard' as const },
  { id: 'pos', icon: ShoppingCart, key: 'pointOfSale' as const },
  { id: 'products', icon: Package, key: 'products' as const },
  { id: 'inventory', icon: Warehouse, key: 'inventory' as const },
  { id: 'transactions', icon: Receipt, key: 'transactions' as const },
  { id: 'cashregister', icon: Banknote, key: 'cashRegister' as const },
  { id: 'reports', icon: BarChart3, key: 'reports' as const },
  { id: 'settings', icon: Settings, key: 'settings' as const },
];

export default function Sidebar() {
  const { t, currentPage, setCurrentPage, language, setLanguage } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const languages: Array<'fr' | 'en' | 'de'> = ['fr', 'en', 'de'];

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
              title={collapsed ? t(item.key) : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span>{t(item.key)}</span>}
            </button>
          );
        })}
      </nav>

      {/* Language Switcher */}
      <div className="p-4 border-t border-slate-700">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-slate-400 flex-shrink-0" />
            <div className="flex gap-1 flex-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    language === lang
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1 items-center">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-1.5 py-0.5 rounded text-xs font-medium transition-all ${
                  language === lang
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        {!collapsed && (
          <p className="text-xs text-slate-500 mt-2 text-center">
            {languageNames[language]}
          </p>
        )}
      </div>
    </aside>
  );
}
