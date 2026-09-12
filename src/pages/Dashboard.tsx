import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { transactions as fallbackTransactions, salesData } from '../data/mockData';
import { 
  TrendingUp, 
  ShoppingBag, 
  Download, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ArrowUpRight, 
  Eye, 
  Printer, 
  X, 
  Store,
  BadgeCheck
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { exportTransactionsToCSV } from '../utils/csvExport';

export default function Dashboard() {
  const { t, transactions: contextTransactions, setCurrentPage } = useApp();
  
  // Use live transactions from context if available, otherwise fallback
  const allTransactions = contextTransactions && contextTransactions.length > 0 
    ? contextTransactions 
    : fallbackTransactions;

  // Local interactive state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'completed' | 'cash' | 'card' | 'split'>('all');
  const [selectedDay, setSelectedDay] = useState<number>(15);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [currentMonthName, setCurrentMonthName] = useState('Janvier 2026');

  // KPI Calculations
  const totalSales = useMemo(() => allTransactions.reduce((sum, tx) => sum + tx.total, 0), [allTransactions]);
  const totalTx = allTransactions.length;
  const avgTx = totalTx > 0 ? totalSales / totalTx : 0;
  const cashTotal = useMemo(() => allTransactions.filter(tx => tx.paymentMethod === 'cash').reduce((sum, tx) => sum + tx.total, 0), [allTransactions]);
  const cardTotal = useMemo(() => allTransactions.filter(tx => tx.paymentMethod === 'card').reduce((sum, tx) => sum + tx.total, 0), [allTransactions]);

  // Filtered transactions for the table
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(tx => {
      // Tab filter
      if (filterTab === 'completed') {
        // all completed
      } else if (filterTab === 'cash' && tx.paymentMethod !== 'cash') {
        return false;
      } else if (filterTab === 'card' && tx.paymentMethod !== 'card') {
        return false;
      } else if (filterTab === 'split' && tx.paymentMethod !== 'split') {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesReceipt = tx.receiptNo.toLowerCase().includes(q);
        const matchesCashier = tx.cashier.toLowerCase().includes(q);
        const matchesItem = tx.items.some(it => it.name.toLowerCase().includes(q));
        if (!matchesReceipt && !matchesCashier && !matchesItem) {
          return false;
        }
      }

      return true;
    });
  }, [allTransactions, filterTab, searchQuery]);

  // Staff on duty data
  const staffMembers = [
    {
      id: '1',
      name: 'Marie Laurent',
      role: 'Manager',
      location: 'Caisse 1 · Magasin',
      shift: '08:00 - 16:30',
      status: 'En service',
      statusColor: 'text-[#2563EB] bg-[#EAF2FD] dark:bg-[#1E293B] dark:text-[#60A5FA]',
      avatar: 'ML',
      avatarBg: 'bg-[#F0EAE1] text-[#A87B43]',
    },
    {
      id: '2',
      name: 'Pierre Dubois',
      role: 'Caissier',
      location: 'Caisse 2 · Comptoir',
      shift: '09:00 - 17:00',
      status: 'En service',
      statusColor: 'text-[#2563EB] bg-[#EAF2FD] dark:bg-[#1E293B] dark:text-[#60A5FA]',
      avatar: 'PD',
      avatarBg: 'bg-[#F0EAE1] text-[#A87B43]',
    },
    {
      id: '3',
      name: 'Sophie Martin',
      role: 'Vendeuse',
      location: 'Espace Boissons & Café',
      shift: '10:00 - 18:30',
      status: 'En service',
      statusColor: 'text-[#2563EB] bg-[#EAF2FD] dark:bg-[#1E293B] dark:text-[#60A5FA]',
      avatar: 'SM',
      avatarBg: 'bg-[#F0EAE1] text-[#A87B43]',
    },
    {
      id: '4',
      name: 'Thomas Berger',
      role: 'Logistique',
      location: 'Réserve & Réassort',
      shift: '07:30 - 15:30',
      status: 'Disponible',
      statusColor: 'text-[#1E7E34] bg-[#EAF7ED] dark:bg-[#1A3320] dark:text-[#4ADE80]',
      avatar: 'TB',
      avatarBg: 'bg-[#F0EAE1] text-[#A87B43]',
    },
    {
      id: '5',
      name: 'Claire Moreau',
      role: 'Caissière',
      location: 'Relève du soir',
      shift: '16:30 - 22:30',
      status: 'En pause',
      statusColor: 'text-[#B45309] bg-[#FEF3E7] dark:bg-[#3D2616] dark:text-[#F59E0B]',
      avatar: 'CM',
      avatarBg: 'bg-[#F0EAE1] text-[#A87B43]',
    },
  ];

  // Calendar days setup (Jan 2026 starting Thursday)
  const prevDays = [29, 30, 31];
  const currentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const nextMonthDays = [1, 2, 3, 4];
  const daysWithEvents = [8, 12, 15, 17, 22, 26, 29];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-full">
      {/* Top Header Row (Matches Reference Header layout) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#A87B43] dark:text-[#E3B36C] tracking-tight">
              CashMag
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">
              {t('dashboard')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95] mt-1">
            Information en direct sur l'activité et les encaissements de votre établissement
          </p>
        </div>

        {/* Right Section: Search Pill + Actions + Profile */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Pill Search Input */}
          <div className="relative flex items-center bg-[#F0EAE1] dark:bg-[#25201A] rounded-full px-3 py-1.5 border border-transparent focus-within:border-[#A87B43] focus-within:bg-white dark:focus-within:bg-[#221E1A] transition-all shadow-2xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher ticket, caissier, produit..."
              className="bg-transparent text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] placeholder-[#9C9388] outline-none pl-2 pr-8 w-44 sm:w-64"
            />
            <button 
              className="w-7 h-7 rounded-full bg-[#1A1816] text-white dark:bg-[#F8F6F0] dark:text-[#1A1816] flex items-center justify-center flex-shrink-0 transition-transform active:scale-95"
              title="Rechercher"
            >
              <Search size={13} />
            </button>
          </div>

          {/* Caisse Ouverte Badge */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1E7E34] dark:text-[#4ADE80] bg-[#EAF7ED] dark:bg-[#1A3320] px-3 py-2 rounded-full border border-[#10B981]/20 shadow-2xs">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
            <span>Caisse ouverte</span>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={() => exportTransactionsToCSV(allTransactions)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#24201D] text-[#1A1816] dark:text-[#F8F6F0] hover:bg-[#F0EAE1] dark:hover:bg-[#2A241E] text-xs sm:text-sm font-semibold rounded-full transition-all border border-[#EFECE6] dark:border-[#332B24] shadow-xs active:scale-95"
          >
            <Download size={14} className="text-[#A87B43]" />
            <span>{t('exportCSV')}</span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] pl-1.5 pr-3 py-1.5 rounded-full shadow-xs">
            <div className="w-7 h-7 rounded-full bg-[#A87B43] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              ML
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold leading-tight text-[#1A1816] dark:text-[#F8F6F0]">Marie Laurent</p>
              <p className="text-[10px] text-[#9C9388] font-medium leading-tight">Admin · Gérante</p>
            </div>
            <ChevronDown size={14} className="text-[#9C9388]" />
          </div>
        </div>
      </div>

      {/* KPI Cards Row (Matches Barber Dashboard Top Stats Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Chiffre d'affaires */}
        <div className="warm-card p-5 bg-white dark:bg-[#221E1A] flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1.5 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F5EBE1] text-[#A87B43] dark:bg-[#33271D] dark:text-[#E3B36C]">
              +12.5%
            </span>
            <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">
              {t('todaySales')}
            </p>
            <p className="text-2xl lg:text-3xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0] tracking-tight">
              {totalSales.toFixed(2)} <span className="text-base font-bold text-[#A87B43]">CHF</span>
            </p>
          </div>
          {/* Right Thematic Graphic */}
          <div className="w-14 h-14 rounded-2xl bg-[#F8F6F0] dark:bg-[#2C2620] flex items-center justify-center text-[#A87B43] border border-[#EFECE6] dark:border-[#383028] shadow-2xs group-hover:scale-105 transition-transform">
            <Store size={26} strokeWidth={1.8} />
          </div>
        </div>

        {/* KPI 2: Transactions / Completed */}
        <div className="warm-card p-5 bg-white dark:bg-[#221E1A] flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1.5 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F5EBE1] text-[#A87B43] dark:bg-[#33271D] dark:text-[#E3B36C]">
              +8.2%
            </span>
            <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">
              {t('totalTransactions')} (Validées)
            </p>
            <p className="text-2xl lg:text-3xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0] tracking-tight">
              {totalTx} <span className="text-sm font-semibold text-[#9C9388]">tickets</span>
            </p>
          </div>
          {/* Right Thematic Graphic */}
          <div className="w-14 h-14 rounded-2xl bg-[#F8F6F0] dark:bg-[#2C2620] flex items-center justify-center text-[#A87B43] border border-[#EFECE6] dark:border-[#383028] shadow-2xs group-hover:scale-105 transition-transform">
            <ShoppingBag size={26} strokeWidth={1.8} />
          </div>
        </div>

        {/* KPI 3: Panier Moyen */}
        <div className="warm-card p-5 bg-white dark:bg-[#221E1A] flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1.5 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F5EBE1] text-[#A87B43] dark:bg-[#33271D] dark:text-[#E3B36C]">
              +3.1%
            </span>
            <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">
              {t('avgTransaction')}
            </p>
            <p className="text-2xl lg:text-3xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0] tracking-tight">
              {avgTx.toFixed(2)} <span className="text-base font-bold text-[#A87B43]">CHF</span>
            </p>
          </div>
          {/* Right Thematic Graphic */}
          <div className="w-14 h-14 rounded-2xl bg-[#F8F6F0] dark:bg-[#2C2620] flex items-center justify-center text-[#A87B43] border border-[#EFECE6] dark:border-[#383028] shadow-2xs group-hover:scale-105 transition-transform">
            <TrendingUp size={26} strokeWidth={1.8} />
          </div>
        </div>

        {/* KPI 4: Espèces & Carte / Sceau d'or */}
        <div className="warm-card p-5 bg-white dark:bg-[#221E1A] flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1.5 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F5EBE1] text-[#A87B43] dark:bg-[#33271D] dark:text-[#E3B36C]">
              -2.4%
            </span>
            <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">
              Espèces ({cashTotal.toFixed(0)} CHF) · Carte ({cardTotal.toFixed(0)} CHF)
            </p>
            <p className="text-2xl lg:text-3xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0] tracking-tight">
              Caisse OK
            </p>
          </div>
          {/* Gold Seal / Badge Icon (Matching reference seal) */}
          <div className="w-14 h-14 rounded-2xl bg-[#F8F6F0] dark:bg-[#2C2620] flex items-center justify-center text-[#C59E58] border border-[#EFECE6] dark:border-[#383028] shadow-2xs group-hover:scale-105 transition-transform">
            <BadgeCheck size={28} strokeWidth={2} className="text-[#A87B43]" />
          </div>
        </div>
      </div>

      {/* Middle Row: Calendar Widget (Left) + Personnel Disponible (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Widget (Left 5 Cols) */}
        <div className="lg:col-span-5 warm-card p-5 bg-white dark:bg-[#221E1A] flex flex-col justify-between">
          <div>
            {/* Month Header & Controls */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#1A1816] dark:text-[#F8F6F0]">
                {currentMonthName}
              </h3>
              <div className="flex items-center gap-1 bg-[#F0EAE1] dark:bg-[#2C2620] p-1 rounded-xl">
                <button 
                  onClick={() => setCurrentMonthName('Décembre 2025')}
                  className="w-7 h-7 rounded-lg hover:bg-white dark:hover:bg-[#383028] flex items-center justify-center text-[#6B635B] dark:text-[#A89F95] transition-colors"
                  title="Mois précédent"
                >
                  <ChevronLeft size={15} />
                </button>
                <button 
                  onClick={() => setCurrentMonthName('Janvier 2026')}
                  className="w-7 h-7 rounded-lg hover:bg-white dark:hover:bg-[#383028] flex items-center justify-center text-[#6B635B] dark:text-[#A89F95] transition-colors"
                  title="Mois suivant"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 text-center mb-2">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d, idx) => (
                <div key={idx} className="text-[11px] font-bold text-[#9C9388] uppercase py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
              {/* Previous month padding days */}
              {prevDays.map((d) => (
                <div key={`prev-${d}`} className="text-[#C8BFB5] dark:text-[#574E45] py-1.5">
                  {d}
                </div>
              ))}

              {/* Current month days */}
              {currentMonthDays.map((d) => {
                const isSelected = d === selectedDay;
                const isHighlightedMock = d === 17 || d === 26; // Highlighted amber badges like reference image
                const hasDot = daysWithEvents.includes(d);

                return (
                  <button
                    key={`curr-${d}`}
                    onClick={() => setSelectedDay(d)}
                    className="relative flex flex-col items-center justify-center py-1 group outline-none"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#A87B43] text-white shadow-xs font-bold scale-105'
                        : isHighlightedMock
                        ? 'bg-[#C59E58] text-white font-bold'
                        : 'text-[#1A1816] dark:text-[#F8F6F0] hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620]'
                    }`}>
                      {d}
                    </div>

                    {/* Indicator Dot */}
                    {hasDot && !isSelected && (
                      <div className="w-1 h-1 bg-[#A87B43] rounded-full mt-0.5" />
                    )}
                  </button>
                );
              })}

              {/* Next month padding days */}
              {nextMonthDays.map((d) => (
                <div key={`next-${d}`} className="text-[#C8BFB5] dark:text-[#574E45] py-1.5">
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Legend (Matches Reference: Pending, Booking, Completed) */}
          <div className="mt-5 pt-3 border-t border-[#EFECE6] dark:border-[#332B24] flex items-center justify-between text-[11px] text-[#6B635B] dark:text-[#A89F95] font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C59E58]" />
              <span>En attente</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1A1816] dark:bg-[#F8F6F0]" />
              <span>Commandes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span>Complété</span>
            </div>
          </div>
        </div>

        {/* Personnel Disponible / Employee Available (Right 7 Cols) */}
        <div className="lg:col-span-7 warm-card p-5 bg-white dark:bg-[#221E1A] flex flex-col justify-between">
          <div>
            {/* Card Header with 'View All' */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-[#1A1816] dark:text-[#F8F6F0]">
                  Personnel disponible
                </h3>
                <p className="text-xs text-[#9C9388]">Planning des caissiers et personnel en poste</p>
              </div>
              <button 
                onClick={() => setCurrentPage('employees')}
                className="text-xs font-semibold text-[#A87B43] dark:text-[#E3B36C] hover:underline flex items-center gap-1"
              >
                <span>Voir tout</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            {/* Employee List */}
            <div className="divide-y divide-[#EFECE6] dark:divide-[#2C2620]">
              {staffMembers.map((emp) => (
                <div key={emp.id} className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#FAF8F3] dark:hover:bg-[#26201A] px-2 rounded-xl transition-colors">
                  {/* Left: Avatar + Name + Location */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full ${emp.avatarBg} font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                      {emp.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-[#1A1816] dark:text-[#F8F6F0] truncate">
                        {emp.name}
                      </p>
                      <p className="text-[11px] text-[#9C9388] truncate">
                        {emp.role} · {emp.location}
                      </p>
                    </div>
                  </div>

                  {/* Right: Shift Slot + Status Badge */}
                  <div className="flex items-center gap-3 text-right flex-shrink-0">
                    <div className="hidden sm:block">
                      <p className="text-xs font-medium text-[#6B635B] dark:text-[#A89F95]">
                        {emp.shift}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${emp.statusColor}`}>
                      {emp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shift Summary Footer */}
          <div className="mt-3 pt-3 border-t border-[#EFECE6] dark:border-[#332B24] flex items-center justify-between text-xs text-[#9C9388]">
            <span>3 caisses actives · 1 gestionnaire stock</span>
            <button 
              onClick={() => setCurrentPage('shifts')}
              className="text-[#A87B43] dark:text-[#E3B36C] hover:underline font-semibold"
            >
              Gérer les shifts
            </button>
          </div>
        </div>
      </div>

      {/* Performance Dual-Line Chart (Matching Analytics Chart in Reference Top-Left) */}
      <div className="warm-card p-5 bg-white dark:bg-[#221E1A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-base text-[#1A1816] dark:text-[#F8F6F0]">
              Aperçu des flux de ventes & transactions
            </h3>
            <p className="text-xs text-[#9C9388]">
              Évolution du chiffre d'affaires et volume par tranche horaire
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#F0EAE1] dark:bg-[#2C2620] p-1 rounded-xl text-xs font-semibold">
            <button className="px-3 py-1 bg-white dark:bg-[#383028] text-[#1A1816] dark:text-[#F8F6F0] rounded-lg shadow-2xs">
              Aujourd'hui
            </button>
            <button className="px-3 py-1 text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816] dark:hover:text-[#F8F6F0]">
              Semaine
            </button>
            <button className="px-3 py-1 text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816] dark:hover:text-[#F8F6F0]">
              Mois
            </button>
          </div>
        </div>

        <div className="h-[220px] sm:h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="warmOchreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A87B43" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#A87B43" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFECE6" vertical={false} />
              <XAxis 
                dataKey="hour" 
                tick={{ fontSize: 11, fill: '#9C9388' }} 
                stroke="#EFECE6" 
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#9C9388' }} 
                stroke="#EFECE6" 
                tickLine={false}
                tickFormatter={(val) => `${val}.-`}
              />
              <Tooltip
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid #EFECE6',
                  backgroundColor: '#FFFFFF',
                  color: '#1A1816',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value} CHF`, 'Chiffre d\'affaires']}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#A87B43" 
                strokeWidth={2.5}
                fill="url(#warmOchreGrad)" 
                dot={{ stroke: '#A87B43', strokeWidth: 2, r: 3.5, fill: '#FFFFFF' }}
                activeDot={{ stroke: '#1A1816', strokeWidth: 2, r: 5, fill: '#A87B43' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section: Booking List / Recent Transactions Table (Exact Match to Reference Table) */}
      <div className="warm-card bg-white dark:bg-[#221E1A] overflow-hidden">
        {/* Table Header & Tabs */}
        <div className="p-4 sm:p-5 border-b border-[#EFECE6] dark:border-[#2C2620] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-[#1A1816] dark:text-[#F8F6F0]">
                Liste des encaissements & commandes
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#F0EAE1] dark:bg-[#2C2620] text-[#6B635B] dark:text-[#A89F95] font-semibold">
                {filteredTransactions.length}
              </span>
            </div>
            <p className="text-xs text-[#9C9388] mt-0.5">
              Historique des ventes effectuées au comptoir
            </p>
          </div>

          {/* Filter Tabs (Matches: Upcoming, Ongoing, Past Appointments) */}
          <div className="flex items-center gap-1 bg-[#F0EAE1] dark:bg-[#2C2620] p-1 rounded-xl text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterTab === 'all'
                  ? 'bg-white dark:bg-[#383028] text-[#1A1816] dark:text-[#F8F6F0] shadow-2xs font-bold'
                  : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816]'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterTab === 'completed'
                  ? 'bg-white dark:bg-[#383028] text-[#1A1816] dark:text-[#F8F6F0] shadow-2xs font-bold'
                  : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816]'
              }`}
            >
              Complétées
            </button>
            <button
              onClick={() => setFilterTab('cash')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterTab === 'cash'
                  ? 'bg-white dark:bg-[#383028] text-[#1A1816] dark:text-[#F8F6F0] shadow-2xs font-bold'
                  : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816]'
              }`}
            >
              Espèces
            </button>
            <button
              onClick={() => setFilterTab('card')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterTab === 'card'
                  ? 'bg-white dark:bg-[#383028] text-[#1A1816] dark:text-[#F8F6F0] shadow-2xs font-bold'
                  : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816]'
              }`}
            >
              Carte
            </button>
            <button
              onClick={() => setFilterTab('split')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterTab === 'split'
                  ? 'bg-white dark:bg-[#383028] text-[#1A1816] dark:text-[#F8F6F0] shadow-2xs font-bold'
                  : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816]'
              }`}
            >
              Mixte
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Header row with light warm tint */}
            <thead>
              <tr className="bg-[#FAF8F3] dark:bg-[#25201A] text-[#9C9388] font-bold border-b border-[#EFECE6] dark:border-[#2C2620]">
                <th className="py-3 px-4 w-10">
                  <input type="checkbox" className="rounded text-[#A87B43] focus:ring-0 cursor-pointer" />
                </th>
                <th className="py-3 px-4 uppercase text-[11px] tracking-wider">Caissier / Client</th>
                <th className="py-3 px-4 uppercase text-[11px] tracking-wider">N° Ticket</th>
                <th className="py-3 px-4 uppercase text-[11px] tracking-wider">Articles</th>
                <th className="py-3 px-4 uppercase text-[11px] tracking-wider">Date</th>
                <th className="py-3 px-4 uppercase text-[11px] tracking-wider">Heure</th>
                <th className="py-3 px-4 uppercase text-[11px] tracking-wider">Statut</th>
                <th className="py-3 px-4 uppercase text-[11px] tracking-wider text-right">Montant</th>
                <th className="py-3 px-4 w-12 text-center">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] dark:divide-[#2C2620]">
              {filteredTransactions.map((tx) => {
                const itemsSummary = tx.items.map(it => `${it.name} (${it.quantity})`).join(', ');

                return (
                  <tr 
                    key={tx.id} 
                    className="hover:bg-[#FAF8F3]/80 dark:hover:bg-[#2A241E]/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedReceipt(tx)}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded text-[#A87B43] focus:ring-0 cursor-pointer" />
                    </td>

                    {/* Cashier / Customer */}
                    <td className="py-3.5 px-4 font-medium text-[#1A1816] dark:text-[#F8F6F0]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#F0EAE1] dark:bg-[#2E2720] text-[#A87B43] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                          {tx.cashier ? tx.cashier.charAt(0) : 'C'}
                        </div>
                        <span className="font-semibold text-xs">{tx.cashier}</span>
                      </div>
                    </td>

                    {/* Order Number */}
                    <td className="py-3.5 px-4 text-[#A87B43] font-mono font-semibold">
                      #{tx.receiptNo}
                    </td>

                    {/* Articles */}
                    <td className="py-3.5 px-4 text-[#6B635B] dark:text-[#A89F95] max-w-xs truncate" title={itemsSummary}>
                      {itemsSummary}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[#6B635B] dark:text-[#A89F95] whitespace-nowrap">
                      {tx.date}
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-4 text-[#9C9388] whitespace-nowrap">
                      {tx.time}
                    </td>

                    {/* Status Pill (Soft blue "Complété" matching reference image) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="status-badge-completed">
                        Complété
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-right text-[#1A1816] dark:text-[#F8F6F0] whitespace-nowrap">
                      {tx.total.toFixed(2)} CHF
                    </td>

                    {/* Action Eye */}
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReceipt(tx);
                        }}
                        className="p-1.5 rounded-lg text-[#9C9388] hover:text-[#A87B43] hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620] transition-colors"
                        title="Voir le ticket"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Details Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in">
          <div className="bg-white dark:bg-[#221E1A] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EFECE6] dark:border-[#332B24] relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-[#9C9388] hover:text-[#1A1816] dark:hover:text-[#F8F6F0] p-1.5 rounded-lg hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620]"
            >
              <X size={18} />
            </button>

            {/* Receipt Header */}
            <div className="text-center pb-4 border-b border-[#EFECE6] dark:border-[#332B24]">
              <h2 className="font-extrabold text-xl text-[#A87B43]">CashMag</h2>
              <p className="text-xs text-[#9C9388] mt-0.5">Ticket #{selectedReceipt.receiptNo}</p>
              <div className="flex justify-center gap-3 text-xs text-[#6B635B] dark:text-[#A89F95] mt-2">
                <span>{selectedReceipt.date}</span>
                <span>{selectedReceipt.time}</span>
                <span>Caissier: {selectedReceipt.cashier}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="py-4 space-y-2 max-h-60 overflow-y-auto divide-y divide-[#EFECE6]/60 dark:divide-[#2C2620]">
              {selectedReceipt.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-xs pt-2 first:pt-0">
                  <div>
                    <p className="font-semibold text-[#1A1816] dark:text-[#F8F6F0]">{item.name}</p>
                    <p className="text-[#9C9388]">Qté: {item.quantity} × {item.price.toFixed(2)} CHF</p>
                  </div>
                  <span className="font-bold text-[#1A1816] dark:text-[#F8F6F0]">
                    {(item.quantity * item.price).toFixed(2)} CHF
                  </span>
                </div>
              ))}
            </div>

            {/* Receipt Totals */}
            <div className="pt-4 border-t border-[#EFECE6] dark:border-[#332B24] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B635B] dark:text-[#A89F95]">
                <span>Sous-total</span>
                <span>{selectedReceipt.subtotal.toFixed(2)} CHF</span>
              </div>
              <div className="flex justify-between text-[#6B635B] dark:text-[#A89F95]">
                <span>TVA</span>
                <span>{selectedReceipt.tax.toFixed(2)} CHF</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#1A1816] dark:text-[#F8F6F0] pt-2 border-t border-dashed border-[#EFECE6] dark:border-[#332B24]">
                <span>Total TTC</span>
                <span className="text-[#A87B43] text-base">{selectedReceipt.total.toFixed(2)} CHF</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#9C9388] pt-1">
                <span>Mode de règlement</span>
                <span className="capitalize font-semibold">{selectedReceipt.paymentMethod}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#A87B43] hover:bg-[#906b33] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                <Printer size={15} />
                <span>Imprimer le ticket</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2.5 bg-[#F0EAE1] dark:bg-[#2C2620] hover:bg-[#EAE2D7] text-[#1A1816] dark:text-[#F8F6F0] text-xs font-semibold rounded-xl transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
