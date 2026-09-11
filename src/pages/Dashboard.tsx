import { useApp } from '../context/AppContext';
import { transactions, salesData, weeklyData, categorySales, paymentBreakdown } from '../data/mockData';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, CreditCard, Banknote, ArrowUpRight, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { exportTransactionsToCSV } from '../utils/csvExport';

export default function Dashboard() {
  const { t } = useApp();

  const totalSales = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const totalTx = transactions.length;
  const avgTx = totalSales / totalTx;
  const cashTotal = transactions.filter(tx => tx.paymentMethod === 'cash').reduce((sum, tx) => sum + tx.total, 0);
  const cardTotal = transactions.filter(tx => tx.paymentMethod === 'card').reduce((sum, tx) => sum + tx.total, 0);

  const kpis = [
    { label: t('todaySales'), value: `${totalSales.toFixed(2)} CHF`, icon: DollarSign, trend: '+12.5%', up: true, color: 'from-[#906b33] to-[#a6885b]' },
    { label: t('totalTransactions'), value: totalTx.toString(), icon: ShoppingBag, trend: '+8.2%', up: true, color: 'from-[#e3b36c] to-[#b8a587]' },
    { label: t('avgTransaction'), value: `${avgTx.toFixed(2)} CHF`, icon: TrendingUp, trend: '+3.1%', up: true, color: 'from-[#a6885b] to-[#906b33]' },
    { label: t('cashPayments'), value: `${cashTotal.toFixed(2)} CHF`, icon: Banknote, trend: '-2.4%', up: false, color: 'from-[#b8a587] to-[#a6885b]' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto h-full" style={{ backgroundColor: '#f6f5fa' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#906b33] dark:text-[#f4f1e9]">
            {t('dashboard')}
          </h1>
          <p className="text-sm text-[#a6885b] dark:text-[#b8a587] mt-1">
            {t('today')} — 15 Janvier 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportTransactionsToCSV(transactions)}
            className="flex items-center gap-2 px-4 py-2 bg-[#906b33] text-[#f4f1e9] rounded-lg hover:bg-[#a6885b] transition-all shadow-md hover:shadow-lg"
          >
            <Download size={16} />
            <span className="hidden sm:inline">{t('exportCSV')}</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-[#906b33] dark:text-[#e3b36c] bg-[#f4f1e9] dark:bg-[#2a2018] px-3 py-1.5 rounded-full border border-[#e3b36c]">
            <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
            <span className="font-medium hidden sm:inline">Caisse ouverte</span>
          </div>
        </div>
      </div>

      {/* KPI Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#2a2018] rounded-xl p-4 md:p-5 shadow-md hover:shadow-lg transition-all border border-[#e3b36c]/20">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-[#a6885b] dark:text-[#b8a587] truncate">{kpi.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-[#906b33] dark:text-[#f4f1e9] mt-1 truncate">
                    {kpi.value}
                  </p>
                </div>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center flex-shrink-0 ml-2`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {kpi.up ? <TrendingUp size={14} className="text-[#10b981]" /> : <TrendingDown size={14} className="text-[#ef4444]" />}
                <span className={`text-xs font-medium ${kpi.up ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                  {kpi.trend}
                </span>
                <span className="text-xs text-[#b8a587] hidden sm:inline">vs hier</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart - Takes 2/3 on large screens */}
        <div className="lg:col-span-2 bg-white dark:bg-[#2a2018] rounded-xl p-4 md:p-5 shadow-md border border-[#e3b36c]/20">
          <h3 className="font-semibold text-[#906b33] dark:text-[#f4f1e9] mb-4 text-sm md:text-base">
            {t('salesOverview')}
          </h3>
          <div className="h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e3b36c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e3b36c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3b36c22" />
                <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#a6885b' }} stroke="#b8a587" />
                <YAxis tick={{ fontSize: 12, fill: '#a6885b' }} stroke="#b8a587" />
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e3b36c',
                    backgroundColor: '#f4f1e9',
                    color: '#906b33'
                  }}
                  formatter={(value: number) => [`${value} CHF`, 'Ventes']}
                />
                <Area type="monotone" dataKey="sales" stroke="#906b33" fill="url(#salesGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales - Takes 1/3 on large screens */}
        <div className="bg-white dark:bg-[#2a2018] rounded-xl p-4 md:p-5 shadow-md border border-[#e3b36c]/20">
          <h3 className="font-semibold text-[#906b33] dark:text-[#f4f1e9] mb-4 text-sm md:text-base">
            {t('salesByCategory')}
          </h3>
          <div className="h-[180px] md:h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categorySales} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value" 
                  paddingAngle={3}
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, '']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e3b36c',
                    backgroundColor: '#f4f1e9',
                    color: '#906b33'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {categorySales.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-[#a6885b] dark:text-[#b8a587] truncate">
                  {cat.name} ({cat.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Weekly Bar Chart */}
        <div className="bg-white dark:bg-[#2a2018] rounded-xl p-4 md:p-5 shadow-md border border-[#e3b36c]/20">
          <h3 className="font-semibold text-[#906b33] dark:text-[#f4f1e9] mb-4 text-sm md:text-base">
            {t('weekSales')}
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3b36c22" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#a6885b' }} stroke="#b8a587" />
                <YAxis tick={{ fontSize: 11, fill: '#a6885b' }} stroke="#b8a587" />
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e3b36c',
                    backgroundColor: '#f4f1e9',
                    color: '#906b33'
                  }}
                  formatter={(value: number) => [`${value} CHF`, 'Ventes']}
                />
                <Bar dataKey="sales" fill="#906b33" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-[#2a2018] rounded-xl p-4 md:p-5 shadow-md border border-[#e3b36c]/20">
          <h3 className="font-semibold text-[#906b33] dark:text-[#f4f1e9] mb-4 text-sm md:text-base">
            {t('salesByPayment')}
          </h3>
          <div className="space-y-3">
            {paymentBreakdown.map((method, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#a6885b] dark:text-[#b8a587]">{method.name}</span>
                  <span className="font-medium text-[#906b33] dark:text-[#f4f1e9]">{method.value}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#f4f1e9] dark:bg-[#3a2f25] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all" 
                    style={{ width: `${method.value}%`, backgroundColor: method.color }} 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#e3b36c]/20 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-[#906b33] dark:text-[#f4f1e9]">{cashTotal.toFixed(0)} CHF</p>
              <p className="text-xs text-[#a6885b] dark:text-[#b8a587]">{t('cashPayments')}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#906b33] dark:text-[#f4f1e9]">{cardTotal.toFixed(0)} CHF</p>
              <p className="text-xs text-[#a6885b] dark:text-[#b8a587]">{t('cardPayments')}</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-[#2a2018] rounded-xl p-4 md:p-5 shadow-md border border-[#e3b36c]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#906b33] dark:text-[#f4f1e9] text-sm md:text-base">
              {t('recentTransactions')}
            </h3>
            <ArrowUpRight size={16} className="text-[#b8a587]" />
          </div>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {transactions.slice(0, 6).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-[#e3b36c]/10 last:border-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tx.paymentMethod === 'cash' ? 'bg-[#e3b36c]/20 text-[#906b33]' : 'bg-[#906b33]/20 text-[#e3b36c]'
                  }`}>
                    {tx.paymentMethod === 'cash' ? <Banknote size={14} /> : <CreditCard size={14} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#906b33] dark:text-[#f4f1e9] truncate">
                      {tx.receiptNo}
                    </p>
                    <p className="text-xs text-[#b8a587] truncate">
                      {tx.time} · {tx.items.length} article(s)
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#906b33] dark:text-[#f4f1e9] ml-2 flex-shrink-0">
                  {tx.total.toFixed(2)} CHF
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
