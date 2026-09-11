import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { transactions } from '../data/mockData';
import { Search, Download, Eye, CreditCard, Banknote, Split, Filter, Calendar } from 'lucide-react';
import { exportTransactionsToCSV } from '../utils/csvExport';

export default function Transactions() {
  const { t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cash' | 'card' | 'split'>('all');
  const [selectedTx, setSelectedTx] = useState<typeof transactions[0] | null>(null);

  const filteredTransactions = transactions.filter(tx => {
    const matchesPayment = paymentFilter === 'all' || tx.paymentMethod === paymentFilter;
    const matchesSearch = tx.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.cashier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPayment && matchesSearch;
  });

  const totalAmount = filteredTransactions.reduce((sum, tx) => sum + tx.total, 0);

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'cash': return <Banknote size={14} />;
      case 'card': return <CreditCard size={14} />;
      case 'split': return <Split size={14} />;
      default: return null;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'cash': return t('cash');
      case 'card': return t('card');
      case 'split': return t('splitPayment');
      default: return method;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#906b33] dark:text-[#f4f1e9]">{t('transactions')}</h1>
          <p className="text-sm text-[#a6885b] dark:text-[#b8a587] mt-1">
            {filteredTransactions.length} transactions · {totalAmount.toFixed(2)} CHF
          </p>
        </div>
        <button 
          onClick={() => exportTransactionsToCSV(filteredTransactions)}
          className="flex items-center gap-2 px-4 py-2 bg-[#906b33] text-[#f4f1e9] rounded-lg text-sm font-medium hover:bg-[#a6885b] transition-all shadow-md hover:shadow-lg"
        >
          <Download size={16} />
          {t('exportCSV')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('search') + '...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <Filter size={14} className="text-slate-400 ml-2" />
            {(['all', 'cash', 'card', 'split'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentFilter(method)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  paymentFilter === method ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {method === 'all' ? t('all') : getPaymentLabel(method)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t('receiptNo')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t('date')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t('time')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t('paymentMethod')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t('cashier')}</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t('amount')}</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono font-medium text-slate-700">{tx.receiptNo}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600">{tx.date}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{tx.time}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        tx.paymentMethod === 'cash' ? 'bg-emerald-100 text-emerald-600' :
                        tx.paymentMethod === 'card' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {getPaymentIcon(tx.paymentMethod)}
                      </div>
                      <span className="text-sm text-slate-600">{getPaymentLabel(tx.paymentMethod)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{tx.cashier}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-bold text-slate-800">{tx.total.toFixed(2)} CHF</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">{t('details')}</h3>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">{t('receiptNo')}</span>
                  <span className="font-mono font-medium">{selectedTx.receiptNo}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">{t('date')}</span>
                  <span>{selectedTx.date} {selectedTx.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t('cashier')}</span>
                  <span>{selectedTx.cashier}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Articles</h4>
                <div className="space-y-2">
                  {selectedTx.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-600">{item.name} × {item.quantity}</span>
                      <span className="font-medium">{(item.price * item.quantity).toFixed(2)} CHF</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t('subtotal')}</span>
                  <span>{selectedTx.subtotal.toFixed(2)} CHF</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t('tax')}</span>
                  <span>{selectedTx.tax.toFixed(2)} CHF</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-100">
                  <span>{t('total')}</span>
                  <span className="text-emerald-600">{selectedTx.total.toFixed(2)} CHF</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                  {t('refund')}
                </button>
                <button onClick={() => setSelectedTx(null)} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
