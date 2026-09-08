import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { salesData, weeklyData, categorySales, paymentBreakdown, transactions } from '../data/mockData';
import { BarChart3, Calendar, TrendingUp, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Reports() {
  const { t } = useApp();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const totalTx = transactions.length;
  const avgTx = totalRevenue / totalTx;
  const margin = totalRevenue * 0.32; // simulated 32% margin

  const monthlyData = [
    { month: 'Sep', revenue: 28500 },
    { month: 'Oct', revenue: 31200 },
    { month: 'Nov', revenue: 29800 },
    { month: 'Dec', revenue: 35600 },
    { month: 'Jan', revenue: 32400 },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('reports')}</h1>
          <p className="text-slate-500 text-sm">Analyse des performances</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
          <Download size={16} />
          {t('export')}
        </button>
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
    </div>
  );
}
