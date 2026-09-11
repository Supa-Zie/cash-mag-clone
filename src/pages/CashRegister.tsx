import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Banknote, Lock, Unlock, ArrowDownCircle, ArrowUpCircle, Calculator, TrendingUp } from 'lucide-react';

export default function CashRegister() {
  const { t } = useApp();
  const [isOpen, setIsOpen] = useState(true);
  const [openingBalance, setOpeningBalance] = useState(200.00);
  const [closingBalance, setClosingBalance] = useState('');
  const [showCountModal, setShowCountModal] = useState(false);
  const [cashMovements, setCashMovements] = useState([
    { type: 'in' as const, amount: 50.00, reason: 'Fond de caisse', time: '08:00' },
    { type: 'out' as const, amount: 20.00, reason: 'Achat fournitures', time: '10:30' },
    { type: 'in' as const, amount: 100.00, reason: 'Retrait banque', time: '12:00' },
  ]);

  const totalIn = cashMovements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.amount, 0);
  const totalOut = cashMovements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.amount, 0);
  const expectedBalance = openingBalance + totalIn - totalOut;

  const denominations = [
    { value: 200, label: '200 CHF', count: 0 },
    { value: 100, label: '100 CHF', count: 0 },
    { value: 50, label: '50 CHF', count: 0 },
    { value: 20, label: '20 CHF', count: 0 },
    { value: 10, label: '10 CHF', count: 0 },
    { value: 5, label: '5 CHF', count: 0 },
    { value: 2, label: '2 CHF', count: 0 },
    { value: 1, label: '1 CHF', count: 0 },
    { value: 0.5, label: '50 cts', count: 0 },
    { value: 0.2, label: '20 cts', count: 0 },
    { value: 0.1, label: '10 cts', count: 0 },
    { value: 0.05, label: '5 cts', count: 0 },
  ];

  const [denomCounts, setDenomCounts] = useState(denominations);
  const countedTotal = denomCounts.reduce((sum, d) => sum + d.value * d.count, 0);

  const handleOpenRegister = () => {
    setIsOpen(true);
  };

  const handleCloseRegister = () => {
    setIsOpen(false);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto" style={{ backgroundColor: '#f6f5fa' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('cashRegister')}</h1>
          <p className="text-slate-500 text-sm">Caisse principale — 15 Janvier 2026</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>
          {isOpen ? <Unlock size={16} /> : <Lock size={16} />}
          <span className="font-medium text-sm">{isOpen ? t('opened') : t('closed')}</span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <Banknote size={18} className="text-blue-600" />
            </div>
            <span className="text-sm text-slate-500">{t('openingBalance')}</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{openingBalance.toFixed(2)} CHF</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
              <ArrowDownCircle size={18} className="text-emerald-600" />
            </div>
            <span className="text-sm text-slate-500">{t('cashIn')}</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">+{totalIn.toFixed(2)} CHF</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowUpCircle size={18} className="text-red-600" />
            </div>
            <span className="text-sm text-slate-500">{t('cashOut')}</span>
          </div>
          <p className="text-2xl font-bold text-red-600">-{totalOut.toFixed(2)} CHF</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-purple-600" />
            </div>
            <span className="text-sm text-slate-500">{t('expectedBalance')}</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{expectedBalance.toFixed(2)} CHF</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Movements */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Mouvements de caisse</h3>
          <div className="space-y-3">
            {cashMovements.map((movement, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    movement.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {movement.type === 'in' ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{movement.reason}</p>
                    <p className="text-xs text-slate-400">{movement.time}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${movement.type === 'in' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {movement.type === 'in' ? '+' : '-'}{movement.amount.toFixed(2)} CHF
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button className="flex-1 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100">
              + {t('cashIn')}
            </button>
            <button className="flex-1 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100">
              - {t('cashOut')}
            </button>
          </div>
        </div>

        {/* Cash Count */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">{t('countCash')}</h3>
            <button
              onClick={() => setShowCountModal(!showCountModal)}
              className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Calculator size={18} className="text-slate-600" />
            </button>
          </div>
          
          {showCountModal ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {denomCounts.map((denom, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-700 w-20">{denom.label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = [...denomCounts];
                        updated[i] = { ...updated[i], count: Math.max(0, updated[i].count - 1) };
                        setDenomCounts(updated);
                      }}
                      className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{denom.count}</span>
                    <button
                      onClick={() => {
                        const updated = [...denomCounts];
                        updated[i] = { ...updated[i], count: updated[i].count + 1 };
                        setDenomCounts(updated);
                      }}
                      className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-sm font-bold"
                    >
                      +
                    </button>
                    <span className="w-20 text-right text-sm font-medium text-slate-600">
                      {(denom.value * denom.count).toFixed(2)} CHF
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-200 flex justify-between">
                <span className="font-semibold text-slate-800">{t('total')}</span>
                <span className="font-bold text-emerald-600">{countedTotal.toFixed(2)} CHF</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t('difference')}</span>
                <span className={`font-bold ${(countedTotal - expectedBalance) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {(countedTotal - expectedBalance) >= 0 ? '+' : ''}{(countedTotal - expectedBalance).toFixed(2)} CHF
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Calculator size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Cliquez sur l'icône pour compter les espèces</p>
            </div>
          )}
        </div>
      </div>

      {/* Open/Close Register */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">{t('registerStatus')}</h3>
            <p className="text-sm text-slate-500 mt-1">
              {isOpen ? 'La caisse est ouverte depuis 08:00' : 'La caisse est fermée'}
            </p>
          </div>
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">{t('closingBalance')} (CHF)</label>
                <input
                  type="number"
                  value={closingBalance}
                  onChange={(e) => setClosingBalance(e.target.value)}
                  placeholder={expectedBalance.toFixed(2)}
                  className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={handleCloseRegister}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                {t('closeRegister')}
              </button>
            </div>
          ) : (
            <button
              onClick={handleOpenRegister}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              {t('openRegister')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
