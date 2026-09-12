import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { salesData, weeklyData, categorySales, paymentBreakdown } from '../data/mockData';
import { BarChart3, Calendar, TrendingUp, Download, FileText, FileSpreadsheet, Printer, Shield, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Reports() {
  const { t, transactions } = useApp();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showExportModal, setShowExportModal] = useState(false);

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const totalTx = transactions.length;
  const avgTx = totalTx > 0 ? totalRevenue / totalTx : 0;
  const margin = totalRevenue * 0.32;

  const monthlyData = [
    { month: 'Sep', revenue: 28500 },
    { month: 'Oct', revenue: 31200 },
    { month: 'Nov', revenue: 29800 },
    { month: 'Dec', revenue: 35600 },
    { month: 'Jan', revenue: 32400 },
  ];

  const handleExport = (format: string) => {
    // Generate CSV content
    const headers = ['Date', 'Heure', 'Reçu', 'Articles', 'Sous-total', 'TVA', 'Total', 'Paiement', 'Caissier'];
    const rows = transactions.map(tx => [
      tx.date,
      tx.time,
      tx.receiptNo,
      tx.items.map(i => `${i.name} x${i.quantity}`).join('; '),
      tx.subtotal.toFixed(2),
      tx.tax.toFixed(2),
      tx.total.toFixed(2),
      tx.paymentMethod,
      tx.cashier,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cashmag_export_${format}_${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'txt'}`;
    link.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto bg-[#F8F6F0] dark:bg-[#181512] min-h-screen text-[#1A1816] dark:text-[#F8F6F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1816] dark:text-[#F8F6F0]">{t('reports')}</h1>
          <p className="text-[#6B635B] dark:text-[#A89F95] text-sm mt-0.5">Analyse des performances & export comptable</p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full text-xs sm:text-sm font-semibold text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816] dark:hover:text-white shadow-xs transition-colors"
          >
            <Printer size={15} />
            Imprimer
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-full text-xs sm:text-sm font-bold shadow-xs transition-colors"
          >
            <Download size={15} />
            {t('export')}
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full p-1.5 w-fit shadow-xs">
        <Calendar size={15} className="text-[#A87B43] ml-2.5" />
        {(['daily', 'weekly', 'monthly'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              period === p 
                ? 'bg-[#A87B43] text-white shadow-xs' 
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816] dark:hover:text-white'
            }`}
          >
            {p === 'daily' ? t('dailyReport') : p === 'weekly' ? t('weeklyReport') : t('monthlyReport')}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95]">{t('totalRevenue')}</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#A87B43] mt-1.5">{totalRevenue.toFixed(0)} CHF</p>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-[#1E7E34] dark:text-[#4ADE80]">
            <TrendingUp size={13} />
            <span>+12.5% vs période précédente</span>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95]">{t('totalTransactions')}</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#1A1816] dark:text-[#F8F6F0] mt-1.5">{totalTx}</p>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA]">
            <TrendingUp size={13} />
            <span>+8.2% vs période précédente</span>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95]">{t('avgTransaction')}</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#1A1816] dark:text-[#F8F6F0] mt-1.5">{avgTx.toFixed(2)} CHF</p>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-[#B45309] dark:text-[#F59E0B]">
            <TrendingUp size={13} />
            <span>+3.1% vs période précédente</span>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95]">{t('margins')}</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#A87B43] mt-1.5">{margin.toFixed(0)} CHF</p>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">
            <TrendingUp size={13} />
            <span>32% de marge brute</span>
          </div>
        </div>
      </div>

      {/* Accounting Compliance Badge */}
      <div className="bg-[#1A1816] dark:bg-[#221E1A] border border-[#342D26] rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FAF4ED]/10 border border-[#A87B43]/30 rounded-xl flex items-center justify-center">
            <Shield size={24} className="text-[#A87B43]" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Conformité NF525 / MRoS</h3>
            <p className="text-xs sm:text-sm text-[#A89F95] mt-0.5">Journal des ventes inaltérable · Export comptable certifié</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF4ED]/10 border border-[#A87B43]/30 rounded-full">
          <CheckCircle size={15} className="text-[#A87B43]" />
          <span className="text-xs font-bold text-[#FAF4ED]">Certifié conforme</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales Trend */}
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-[#A87B43]" />
            <h3 className="font-bold text-sm sm:text-base text-[#1A1816] dark:text-[#F8F6F0]">{t('salesOverview')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={period === 'daily' ? salesData : period === 'weekly' ? weeklyData : monthlyData}>
              <defs>
                <linearGradient id="reportGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A87B43" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#A87B43" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFECE6" />
              <XAxis dataKey={period === 'monthly' ? 'month' : period === 'weekly' ? 'day' : 'hour'} tick={{ fontSize: 11, fill: '#9C9388' }} stroke="#EFECE6" />
              <YAxis tick={{ fontSize: 11, fill: '#9C9388' }} stroke="#EFECE6" />
              <Tooltip contentStyle={{ backgroundColor: '#FAF8F3', borderRadius: '12px', border: '1px solid #EFECE6', color: '#1A1816' }} />
              <Area type="monotone" dataKey={period === 'monthly' ? 'revenue' : 'sales'} stroke="#A87B43" fill="url(#reportGradient)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <h3 className="font-bold text-sm sm:text-base text-[#1A1816] dark:text-[#F8F6F0] mb-4">{t('salesByCategory')}</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={categorySales} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {categorySales.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, '']} contentStyle={{ backgroundColor: '#FAF8F3', borderRadius: '12px', border: '1px solid #EFECE6', color: '#1A1816' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categorySales.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs sm:text-sm font-medium text-[#6B635B] dark:text-[#A89F95]">{cat.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#1A1816] dark:text-[#F8F6F0]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <h3 className="font-bold text-sm sm:text-base text-[#1A1816] dark:text-[#F8F6F0] mb-4">{t('salesByPayment')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={paymentBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#EFECE6" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9C9388' }} stroke="#EFECE6" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#9C9388' }} stroke="#EFECE6" width={60} />
              <Tooltip contentStyle={{ backgroundColor: '#FAF8F3', borderRadius: '12px', border: '1px solid #EFECE6', color: '#1A1816' }} formatter={(value: number) => [`${value}%`, '']} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {paymentBreakdown.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <h3 className="font-bold text-sm sm:text-base text-[#1A1816] dark:text-[#F8F6F0] mb-4">{t('performance')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFECE6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9C9388' }} stroke="#EFECE6" />
              <YAxis tick={{ fontSize: 11, fill: '#9C9388' }} stroke="#EFECE6" />
              <Tooltip contentStyle={{ backgroundColor: '#FAF8F3', borderRadius: '12px', border: '1px solid #EFECE6', color: '#1A1816' }} />
              <Line type="monotone" dataKey="sales" stroke="#A87B43" strokeWidth={2.5} dot={{ fill: '#A87B43', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setShowExportModal(false)}>
          <div className="bg-white dark:bg-[#221E1A] rounded-3xl w-full max-w-md p-6 border border-[#EFECE6] dark:border-[#342D26] shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1A1816] dark:text-[#F8F6F0] mb-1">Exporter les données</h2>
            <p className="text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95] mb-6">Choisissez le format d'export pour votre fiduciaire ou vos archives.</p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleExport('csv')}
                className="w-full flex items-center gap-4 p-4 border border-[#EFECE6] dark:border-[#342D26] rounded-2xl hover:border-[#A87B43] hover:bg-[#FAF4ED] dark:hover:bg-[#2D241C] transition-all group"
              >
                <div className="w-11 h-11 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] border border-[#EFECE6] dark:border-[#342D26] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileSpreadsheet size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-[#1A1816] dark:text-[#F8F6F0]">Export CSV</p>
                  <p className="text-xs text-[#6B635B] dark:text-[#A89F95]">Compatible Excel, Google Sheets</p>
                </div>
              </button>

              <button
                onClick={() => handleExport('txt')}
                className="w-full flex items-center gap-4 p-4 border border-[#EFECE6] dark:border-[#342D26] rounded-2xl hover:border-[#A87B43] hover:bg-[#FAF4ED] dark:hover:bg-[#2D241C] transition-all group"
              >
                <div className="w-11 h-11 bg-[#EAF2FD] dark:bg-[#1E293B] text-[#2563EB] border border-[#EFECE6] dark:border-[#342D26] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-[#1A1816] dark:text-[#F8F6F0]">Journal comptable (TXT)</p>
                  <p className="text-xs text-[#6B635B] dark:text-[#A89F95]">Format inaltérable NF525</p>
                </div>
              </button>

              <button
                onClick={handlePrintReport}
                className="w-full flex items-center gap-4 p-4 border border-[#EFECE6] dark:border-[#342D26] rounded-2xl hover:border-[#A87B43] hover:bg-[#FAF4ED] dark:hover:bg-[#2D241C] transition-all group"
              >
                <div className="w-11 h-11 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] border border-[#EFECE6] dark:border-[#342D26] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Printer size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-[#1A1816] dark:text-[#F8F6F0]">Rapport imprimé (PDF)</p>
                  <p className="text-xs text-[#6B635B] dark:text-[#A89F95]">Rapport complet avec graphiques</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="w-full mt-5 px-4 py-2.5 border border-[#EFECE6] dark:border-[#342D26] rounded-full text-xs sm:text-sm font-semibold text-[#6B635B] dark:text-[#A89F95] hover:bg-[#FAF4ED] dark:hover:bg-[#2D241C] transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
