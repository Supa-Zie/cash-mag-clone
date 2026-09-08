import { useApp } from '../context/AppContext';
import { transactions, salesData, weeklyData, categorySales, paymentBreakdown } from '../data/mockData';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, CreditCard, Banknote, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { t } = useApp();

  const totalSales = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const totalTx = transactions.length;
  const avgTx = totalSales / totalTx;
  const cashTotal = transactions.filter(tx => tx.paymentMethod === 'cash').reduce((sum, tx) => sum + tx.total, 0);
  const cardTotal = transactions.filter(tx => tx.paymentMethod === 'card').reduce((sum, tx) => sum + tx.total, 0);

  const kpis = [
    { label: t('todaySales'), value: `${totalSales.toFixed(2)} CHF`, icon: DollarSign, trend: '+12.5%', up: true, color: 'from-emerald-500 to-emerald-600' },
    { label: t('totalTransactions'), value: totalTx.toString(), icon: ShoppingBag, trend: '+8.2%', up: true, color: 'from-blue-500 to-blue-600' },
    { label: t('avgTransaction'), value: `${avgTx.toFixed(2)} CHF`, icon: TrendingUp, trend: '+3.1%', up: true, color: 'from-purple-500 to-purple-600' },
    { label: t('cashPayments'), value: `${cashTotal.toFixed(2)} CHF`, icon: Banknote, trend: '-2.4%', up: false, color: 'from-amber-500 to-amber-600' },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('dashboard')}</h1>
          <p className="text-slate-500 text-sm">{t('today')} — 15 Janvier 2026</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-medium">Caisse ouverte</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{kpi.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{kpi.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {kpi.up ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-red-500" />}
                <span className={`text-xs font-medium ${kpi.up ? 'text-emerald-600' : 'text-red-600'}`}>{kpi.trend}</span>
                <span className="text-xs text-slate-400">vs hier</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-4">{t('salesOverview')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                formatter={(value: number) => [`${value} CHF`, 'Ventes']}
              />
              <Area type="monotone" dataKey="sales" stroke="#10b981" fill="url(#salesGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Sales */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-4">{t('salesByCategory')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categorySales} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {categorySales.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {categorySales.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-slate-600">{cat.name} ({cat.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Bar Chart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-4">{t('weekSales')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                formatter={(value: number) => [`${value} CHF`, 'Ventes']}
              />
              <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-4">{t('salesByPayment')}</h3>
          <div className="space-y-3">
            {paymentBreakdown.map((method, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{method.name}</span>
                  <span className="font-medium text-slate-800">{method.value}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${method.value}%`, backgroundColor: method.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">{cashTotal.toFixed(0)} CHF</p>
              <p className="text-xs text-slate-500">{t('cashPayments')}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">{cardTotal.toFixed(0)} CHF</p>
              <p className="text-xs text-slate-500">{t('cardPayments')}</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">{t('recentTransactions')}</h3>
            <ArrowUpRight size={16} className="text-slate-400" />
          </div>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {transactions.slice(0, 6).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.paymentMethod === 'cash' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {tx.paymentMethod === 'cash' ? <Banknote size={14} /> : <CreditCard size={14} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{tx.receiptNo}</p>
                    <p className="text-xs text-slate-400">{tx.time} · {tx.items.length} article(s)</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-800">{tx.total.toFixed(2)} CHF</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
