import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '../i18n/translations';
import { products as initialProducts, transactions as initialTransactions } from '../data/mockData';

type Page = 'dashboard' | 'pos' | 'products' | 'inventory' | 'transactions' | 'cash-register' | 'reports' | 'settings' | 'employees' | 'loyalty' | 'tables';
type Currency = 'CHF' | 'EUR';

// Helper to load from localStorage
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`cashmag_${key}`);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn(`Failed to load ${key} from localStorage`, e);
  }
  return fallback;
}

// Helper to save to localStorage
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`cashmag_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage`, e);
  }
}

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
  hireDate: string;
  salesToday: number;
  salesMonth: number;
  avatar: string;
}

interface LoyaltyCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  tier: string;
  totalSpent: number;
  visits: number;
  lastVisit: string;
  joinDate: string;
}

interface TableItem {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'bill-requested';
  zone: string;
  currentOrder?: {
    total: number;
    startTime: string;
    server: string;
  };
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  products: typeof initialProducts;
  setProducts: React.Dispatch<React.SetStateAction<typeof initialProducts>>;
  transactions: typeof initialTransactions;
  setTransactions: React.Dispatch<React.SetStateAction<typeof initialTransactions>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  loyaltyCustomers: LoyaltyCustomer[];
  setLoyaltyCustomers: React.Dispatch<React.SetStateAction<LoyaltyCustomer[]>>;
  tables: TableItem[];
  setTables: React.Dispatch<React.SetStateAction<TableItem[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => loadFromStorage('language', 'fr'));
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [currency, setCurrencyState] = useState<Currency>(() => loadFromStorage('currency', 'CHF'));
  const [products, setProducts] = useState(() => loadFromStorage('products', initialProducts));
  const [transactions, setTransactions] = useState(() => loadFromStorage('transactions', initialTransactions));
  const [employees, setEmployees] = useState<Employee[]>(() => loadFromStorage('employees', [
    { id: 'emp-001', name: 'Marie Laurent', role: 'Manager', email: 'marie@cashmag.ch', phone: '+41 79 123 45 67', status: 'active', hireDate: '2020-03-15', salesToday: 1245.50, salesMonth: 28450.00, avatar: '👩‍💼' },
    { id: 'emp-002', name: 'Thomas Berger', role: 'Cashier', email: 'thomas@cashmag.ch', phone: '+41 79 234 56 78', status: 'active', hireDate: '2021-06-01', salesToday: 890.30, salesMonth: 19200.00, avatar: '👨‍💼' },
    { id: 'emp-003', name: 'Sophie Martin', role: 'Cashier', email: 'sophie@cashmag.ch', phone: '+41 79 345 67 89', status: 'active', hireDate: '2022-01-10', salesToday: 1102.75, salesMonth: 22340.00, avatar: '👩‍💻' },
    { id: 'emp-004', name: 'Lucas Dubois', role: 'Server', email: 'lucas@cashmag.ch', phone: '+41 79 456 78 90', status: 'active', hireDate: '2022-09-20', salesToday: 675.00, salesMonth: 15800.00, avatar: '🧑‍🍳' },
    { id: 'emp-005', name: 'Emma Rossier', role: 'Server', email: 'emma@cashmag.ch', phone: '+41 79 567 89 01', status: 'break', hireDate: '2023-02-14', salesToday: 430.20, salesMonth: 12100.00, avatar: '👩‍🍳' },
  ]));
  const [loyaltyCustomers, setLoyaltyCustomers] = useState<LoyaltyCustomer[]>(() => loadFromStorage('loyaltyCustomers', [
    { id: 'loy-001', name: 'Jean-Pierre Muller', email: 'jp.muller@email.ch', phone: '+41 79 111 22 33', points: 2450, tier: 'Gold', totalSpent: 4850.00, visits: 48, lastVisit: '2026-01-14', joinDate: '2023-06-15' },
    { id: 'loy-002', name: 'Isabelle Favre', email: 'i.favre@email.ch', phone: '+41 79 222 33 44', points: 1820, tier: 'Silver', totalSpent: 3200.00, visits: 32, lastVisit: '2026-01-13', joinDate: '2024-01-20' },
    { id: 'loy-003', name: 'Marc Rochat', email: 'm.rochat@email.ch', phone: '+41 79 333 44 55', points: 5200, tier: 'Platinum', totalSpent: 9800.00, visits: 87, lastVisit: '2026-01-15', joinDate: '2022-11-03' },
    { id: 'loy-004', name: 'Claire Perret', email: 'c.perret@email.ch', phone: '+41 79 444 55 66', points: 890, tier: 'Bronze', totalSpent: 1450.00, visits: 14, lastVisit: '2026-01-10', joinDate: '2025-03-08' },
    { id: 'loy-005', name: 'Antoine Girard', email: 'a.girard@email.ch', phone: '+41 79 555 66 77', points: 3100, tier: 'Gold', totalSpent: 5600.00, visits: 56, lastVisit: '2026-01-14', joinDate: '2023-09-22' },
    { id: 'loy-006', name: 'Nathalie Blanc', email: 'n.blanc@email.ch', phone: '+41 79 666 77 88', points: 420, tier: 'Bronze', totalSpent: 780.00, visits: 8, lastVisit: '2026-01-08', joinDate: '2025-08-14' },
  ]));
  const [tables, setTables] = useState<TableItem[]>(() => loadFromStorage('tables', [
    { id: 'tbl-001', number: 1, seats: 2, status: 'available', zone: 'Terrace' },
    { id: 'tbl-002', number: 2, seats: 2, status: 'occupied', zone: 'Terrace', currentOrder: { total: 45.50, startTime: '2026-01-15T12:30:00', server: 'Lucas Dubois' } },
    { id: 'tbl-003', number: 3, seats: 4, status: 'occupied', zone: 'Main Hall', currentOrder: { total: 128.00, startTime: '2026-01-15T12:15:00', server: 'Emma Rossier' } },
    { id: 'tbl-004', number: 4, seats: 4, status: 'reserved', zone: 'Main Hall' },
    { id: 'tbl-005', number: 5, seats: 6, status: 'available', zone: 'Main Hall' },
    { id: 'tbl-006', number: 6, seats: 6, status: 'occupied', zone: 'Main Hall', currentOrder: { total: 89.30, startTime: '2026-01-15T13:00:00', server: 'Lucas Dubois' } },
    { id: 'tbl-007', number: 7, seats: 2, status: 'available', zone: 'Bar' },
    { id: 'tbl-008', number: 8, seats: 4, status: 'bill-requested', zone: 'Bar', currentOrder: { total: 67.80, startTime: '2026-01-15T11:45:00', server: 'Emma Rossier' } },
    { id: 'tbl-009', number: 9, seats: 8, status: 'reserved', zone: 'Private' },
    { id: 'tbl-010', number: 10, seats: 4, status: 'available', zone: 'Private' },
    { id: 'tbl-011', number: 11, seats: 2, status: 'occupied', zone: 'Terrace', currentOrder: { total: 32.00, startTime: '2026-01-15T13:15:00', server: 'Lucas Dubois' } },
    { id: 'tbl-012', number: 12, seats: 6, status: 'available', zone: 'Main Hall' },
  ]));

  // Persist to localStorage on change
  useEffect(() => { saveToStorage('language', language); }, [language]);
  useEffect(() => { saveToStorage('currency', currency); }, [currency]);
  useEffect(() => { saveToStorage('products', products); }, [products]);
  useEffect(() => { saveToStorage('transactions', transactions); }, [transactions]);
  useEffect(() => { saveToStorage('employees', employees); }, [employees]);
  useEffect(() => { saveToStorage('loyaltyCustomers', loyaltyCustomers); }, [loyaltyCustomers]);
  useEffect(() => { saveToStorage('tables', tables); }, [tables]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const setCurrency = (curr: Currency) => setCurrencyState(curr);

  // Translation function
  const t = (key: string): string => {
    const langTranslations = translations[language] as Record<string, string>;
    return langTranslations[key] || key;
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage, t, currentPage, setCurrentPage,
      currency, setCurrency, products, setProducts,
      transactions, setTransactions,
      employees, setEmployees, loyaltyCustomers, setLoyaltyCustomers,
      tables, setTables,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
