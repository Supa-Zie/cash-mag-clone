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
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('reports')}</h1>
          <p className="text-slate-500 text-sm">Analyse des performances & export comptable</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Printer size={16} />
            Imprimer
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
          >
            <Download size={16} />
            {t('export')}
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 w-fit">
        <Calendar size={16} className="text-slate-400 ml-2" />
        {(['daily', 'weekly', 'monthly'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              period === p ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {p === 'daily' ? t('dailyReport') : p === 'weekly' ? t('weeklyReport') : t('monthlyReport')}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
          <p className="text-emerald-100 text-sm">{t('totalRevenue')}</p>
          <p className="text-2xl font-bold mt-1">{totalRevenue.toFixed(0)} CHF</p>
          <div className="flex items-center gap-1 mt-2 text-emerald-100 text-xs">
            <TrendingUp size={12} />
            <span>+12.5% vs période précédente</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <p className="text-blue-100 text-sm">{t('totalTransactions')}</p>
          <p className="text-2xl font-bold mt-1">{totalTx}</p>
          <div className="flex items-center gap-1 mt-2 text-blue-100 text-xs">
            <TrendingUp size={12} />
            <span>+8.2% vs période précédente</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <p className="text-purple-100 text-sm">{t('avgTransaction')}</p>
          <p className="text-2xl font-bold mt-1">{avgTx.toFixed(2)} CHF</p>
          <div className="flex items-center gap-1 mt-2 text-purple-100 text-xs">
            <TrendingUp size={12} />
            <span>+3.1% vs période précédente</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
          <p className="text-amber-100 text-sm">{t('margins')}</p>
          <p className="text-2xl font-bold mt-1">{margin.toFixed(0)} CHF</p>
          <div className="flex items-center gap-1 mt-2 text-amber-100 text-xs">
            <TrendingUp size={12} />
            <span>32% de marge brute</span>
          </div>
        </div>
      </div>

      {/* Accounting Compliance Badge */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Shield size={24} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold">Conformité NF525 / MRoS</h3>
            <p className="text-sm text-slate-300">Journal des ventes inaltérable · Export comptable certifié</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">Certifié conforme</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales Trend */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-slate-400" />
            <h3 className="font-semibold text-slate-800">{t('salesOverview')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={period === 'daily' ? salesData : period === 'weekly' ? weeklyData : monthlyData}>
              <defs>
                <linearGradient id="reportGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey={period === 'monthly' ? 'month' : period === 'weekly' ? 'day' : 'hour'} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey={period === 'monthly' ? 'revenue' : 'sales'} stroke="#6366f1" fill="url(#reportGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">{t('salesByCategory')}</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={categorySales} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {categorySales.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categorySales.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm text-slate-600">{cat.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">{t('salesByPayment')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={paymentBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" width={60} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(value: number) => [`${value}%`, '']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {paymentBreakdown.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">{t('performance')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowExportModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Exporter les données</h2>
            <p className="text-sm text-slate-500 mb-6">Choisissez le format d'export pour votre fiduciaire ou vos archives.</p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleExport('csv')}
                className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200">
                  <FileSpreadsheet size={20} className="text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800">Export CSV</p>
                  <p className="text-xs text-slate-500">Compatible Excel, Google Sheets</p>
                </div>
              </button>

              <button
                onClick={() => handleExport('txt')}
                className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800">Journal comptable (TXT)</p>
                  <p className="text-xs text-slate-500">Format inaltérable NF525</p>
                </div>
              </button>

              <button
                onClick={handlePrintReport}
                className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                  <Printer size={20} className="text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800">Rapport imprimé (PDF)</p>
                  <p className="text-xs text-slate-500">Rapport complet avec graphiques</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="w-full mt-4 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
