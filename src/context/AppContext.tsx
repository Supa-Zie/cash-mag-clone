import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '../i18n/translations';
import { products as initialProducts, transactions as initialTransactions, Product, Transaction } from '../data/mockData';

type Page = 'dashboard' | 'pos' | 'products' | 'inventory' | 'transactions' | 'cash-register' | 'reports' | 'settings' | 'employees' | 'loyalty' | 'tables' | 'promotions' | 'suppliers';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface AppContextType {
  // Navigation
  currentPage: Page;
  setCurrentPage: (page: Page) => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;

  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Data
  products: Product[];
  transactions: Transaction[];
  setProducts: (products: Product[]) => void;
  setTransactions: (transactions: Transaction[]) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'time'>) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('cashmag_language');
    return (saved as Language) || 'fr';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cashmag_darkmode');
    return saved === 'true';
  });
  const [productsState, setProductsState] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cashmag_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [transactionsState, setTransactionsState] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('cashmag_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('cashmag_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        type: 'warning',
        title: 'Stock bas',
        message: 'Pain au Chocolat - Stock critique (8 unités)',
        time: 'Il y a 5 min',
        read: false,
      },
      {
        id: '2',
        type: 'info',
        title: 'Nouvelle commande fournisseur',
        message: 'Coca-Cola Suisse - Livraison prévue demain',
        time: 'Il y a 30 min',
        read: false,
      },
      {
        id: '3',
        type: 'success',
        title: 'Objectif atteint',
        message: 'Ventes du jour: 1\'050 CHF (+12%)',
        time: 'Il y a 1h',
        read: true,
      },
      {
        id: '4',
        type: 'warning',
        title: 'Quiche Lorraine',
        message: 'Point de réapprovisionnement atteint (3 unités)',
        time: 'Il y a 2h',
        read: true,
      },
    ];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cashmag_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cashmag_darkmode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('cashmag_products', JSON.stringify(productsState));
  }, [productsState]);

  useEffect(() => {
    localStorage.setItem('cashmag_transactions', JSON.stringify(transactionsState));
  }, [transactionsState]);

  useEffect(() => {
    localStorage.setItem('cashmag_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'time'>) => {
    const newNotif: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      time: 'À l\'instant',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      currentPage,
      setCurrentPage,
      language,
      setLanguage,
      t,
      darkMode,
      toggleDarkMode,
      products: productsState,
      transactions: transactionsState,
      setProducts: setProductsState,
      setTransactions: setTransactionsState,
      notifications,
      addNotification,
      markAsRead,
      clearNotifications,
      unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
