import { lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import { Loader2 } from 'lucide-react';

// Lazy-loaded pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PointOfSale = lazy(() => import('./pages/PointOfSale'));
const Products = lazy(() => import('./pages/Products'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Transactions = lazy(() => import('./pages/Transactions'));
const CashRegister = lazy(() => import('./pages/CashRegister'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const Employees = lazy(() => import('./pages/Employees'));
const Loyalty = lazy(() => import('./pages/Loyalty'));
const Tables = lazy(() => import('./pages/Tables'));
const Promotions = lazy(() => import('./pages/Promotions'));
const Suppliers = lazy(() => import('./pages/Suppliers'));
const ShiftManagement = lazy(() => import('./pages/ShiftManagement'));
const KitchenDisplay = lazy(() => import('./pages/KitchenDisplay'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-[#A87B43] animate-spin" />
        <span className="text-sm text-[#6B635B] dark:text-[#A89F95]">Chargement...</span>
      </div>
    </div>
  );
}

function AppContent() {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'pos': return <PointOfSale />;
      case 'products': return <Products />;
      case 'inventory': return <Inventory />;
      case 'transactions': return <Transactions />;
      case 'cash-register': return <CashRegister />;
      case 'employees': return <Employees />;
      case 'loyalty': return <Loyalty />;
      case 'tables': return <Tables />;
      case 'promotions': return <Promotions />;
      case 'suppliers': return <Suppliers />;
      case 'shifts': return <ShiftManagement />;
      case 'kitchen': return <KitchenDisplay />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden transition-colors bg-[#F8F6F0] dark:bg-[#181512] text-[#1A1816] dark:text-[#F8F6F0]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
