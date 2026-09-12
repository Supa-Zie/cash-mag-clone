import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { transactions as fallbackTransactions } from '../data/mockData';
import { Search, Download, Eye, CreditCard, Banknote, Split, Filter, Calendar, X } from 'lucide-react';
import { exportTransactionsToCSV } from '../utils/csvExport';

export default function Transactions() {
  const { t, transactions: contextTransactions } = useApp();
  const allTransactions = contextTransactions && contextTransactions.length > 0 
    ? contextTransactions 
    : fallbackTransactions;

  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cash' | 'card' | 'split'>('all');
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  const filteredTransactions = allTransactions.filter(tx => {
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-full bg-[#F8F6F0] dark:bg-[#181512] text-[#1A1816] dark:text-[#F8F6F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#A87B43] dark:text-[#E3B36C] tracking-tight">
              CashMag
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">
              {t('transactions')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95] mt-1">
            {filteredTransactions.length} transactions enregistrées · {totalAmount.toFixed(2)} CHF
          </p>
        </div>
        <button 
          onClick={() => exportTransactionsToCSV(filteredTransactions)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#221E1A] text-[#1A1816] dark:text-[#F8F6F0] border border-[#EFECE6] dark:border-[#342D26] hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620] rounded-full text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 self-start sm:self-auto"
        >
          <Download size={15} className="text-[#A87B43]" />
          <span>{t('exportCSV')}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9388]" />
          <input
            type="text"
            placeholder={t('search') + '...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] placeholder-[#9C9388] outline-none focus:border-[#A87B43] focus:ring-2 focus:ring-[#A87B43]/15 transition-all shadow-2xs"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1 bg-[#F0EAE1] dark:bg-[#25201A] p-1 rounded-xl">
            {(['all', 'cash', 'card', 'split'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentFilter(method)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  paymentFilter === method 
                    ? 'bg-[#A87B43] text-white shadow-xs' 
                    : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816] dark:hover:text-[#F8F6F0]'
                }`}
              >
                {method === 'all' ? t('all') : getPaymentLabel(method)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="warm-card bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F3] dark:bg-[#25201A] border-b border-[#EFECE6] dark:border-[#342D26] text-[#9C9388] font-bold">
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">{t('receiptNo')}</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">{t('date')}</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">{t('time')}</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">{t('paymentMethod')}</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">{t('cashier')}</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider text-right">{t('amount')}</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] dark:divide-[#2C2620]">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAF8F3]/70 dark:hover:bg-[#28221B]/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold text-[#A87B43]">#{tx.receiptNo}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-[#6B635B] dark:text-[#A89F95]">
                      <Calendar size={13} className="text-[#9C9388]" />
                      <span>{tx.date}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[#9C9388]">{tx.time}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        tx.paymentMethod === 'cash' ? 'bg-[#F5EBE1] text-[#A87B43]' :
                        tx.paymentMethod === 'card' ? 'bg-[#EAF2FD] text-[#2563EB]' :
                        'bg-[#FEF3E7] text-[#B45309]'
                      }`}>
                        {getPaymentIcon(tx.paymentMethod)}
                      </div>
                      <span className="font-medium text-[#1A1816] dark:text-[#F8F6F0]">{getPaymentLabel(tx.paymentMethod)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[#6B635B] dark:text-[#A89F95] font-medium">{tx.cashier}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-[#1A1816] dark:text-[#F8F6F0] whitespace-nowrap">
                    {tx.total.toFixed(2)} <span className="text-[11px] text-[#A87B43]">CHF</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="p-1.5 text-[#9C9388] hover:text-[#A87B43] hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620] rounded-lg transition-colors"
                      title="Voir détails"
                    >
                      <Eye size={15} />
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in">
          <div className="bg-white dark:bg-[#221E1A] rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#EFECE6] dark:border-[#342D26] relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1A1816] dark:text-[#F8F6F0]">{t('details')}</h3>
              <button onClick={() => setSelectedTx(null)} className="text-[#9C9388] hover:text-[#1A1816] dark:hover:text-[#F8F6F0] p-1.5 rounded-lg">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#FAF8F3] dark:bg-[#28221B] rounded-xl p-4 border border-[#EFECE6] dark:border-[#342D26]">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#9C9388]">{t('receiptNo')}</span>
                  <span className="font-mono font-bold text-[#A87B43]">#{selectedTx.receiptNo}</span>
                </div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#9C9388]">{t('date')}</span>
                  <span className="text-[#1A1816] dark:text-[#F8F6F0] font-medium">{selectedTx.date} {selectedTx.time}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9C9388]">{t('cashier')}</span>
                  <span className="text-[#1A1816] dark:text-[#F8F6F0] font-medium">{selectedTx.cashier}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9C9388] mb-2">Articles</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-[#EFECE6]/60 dark:divide-[#2C2620]">
                  {selectedTx.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs pt-1.5 first:pt-0">
                      <span className="text-[#1A1816] dark:text-[#F8F6F0] font-medium">{item.name} × {item.quantity}</span>
                      <span className="font-bold text-[#1A1816] dark:text-[#F8F6F0]">{(item.price * item.quantity).toFixed(2)} CHF</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#EFECE6] dark:border-[#342D26] pt-3 space-y-1 text-xs">
                <div className="flex justify-between text-[#6B635B] dark:text-[#A89F95]">
                  <span>{t('subtotal')}</span>
                  <span>{selectedTx.subtotal.toFixed(2)} CHF</span>
                </div>
                <div className="flex justify-between text-[#6B635B] dark:text-[#A89F95]">
                  <span>{t('tax')}</span>
                  <span>{selectedTx.tax.toFixed(2)} CHF</span>
                </div>
                <div className="flex justify-between text-base font-extrabold pt-2 border-t border-[#EFECE6] dark:border-[#342D26]">
                  <span>{t('total')}</span>
                  <span className="text-[#A87B43]">{selectedTx.total.toFixed(2)} CHF</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="flex-1 py-2.5 border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs font-semibold text-[#6B635B] dark:text-[#A89F95] hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620] transition-colors"
                >
                  {t('refund')}
                </button>
                <button 
                  onClick={() => setSelectedTx(null)} 
                  className="flex-1 py-2.5 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
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
