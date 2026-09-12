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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-full bg-[#F8F6F0] dark:bg-[#181512] text-[#1A1816] dark:text-[#F8F6F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#A87B43] dark:text-[#E3B36C] tracking-tight">
              CashMag
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">
              {t('cashRegister')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95] mt-1">
            Caisse principale — Session en direct
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold self-start sm:self-auto shadow-2xs ${
          isOpen 
            ? 'bg-[#EAF7ED] text-[#1E7E34] dark:bg-[#1A3320] dark:text-[#4ADE80] border border-[#10B981]/20' 
            : 'bg-[#FEECEC] text-[#DC2626] dark:bg-[#381B1B] dark:text-[#F87171] border border-[#DC2626]/20'
        }`}>
          {isOpen ? <Unlock size={14} /> : <Lock size={14} />}
          <span>{isOpen ? t('opened') : t('closed')}</span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-[#F8F6F0] dark:bg-[#2A241E] text-[#A87B43] rounded-xl flex items-center justify-center border border-[#EFECE6]/70 dark:border-[#342D26]">
              <Banknote size={18} />
            </div>
            <span className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">{t('openingBalance')}</span>
          </div>
          <p className="text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{openingBalance.toFixed(2)} <span className="text-xs text-[#A87B43]">CHF</span></p>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-[#EAF7ED] dark:bg-[#1A3320] text-[#1E7E34] dark:text-[#4ADE80] rounded-xl flex items-center justify-center">
              <ArrowDownCircle size={18} />
            </div>
            <span className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">{t('cashIn')}</span>
          </div>
          <p className="text-2xl font-extrabold text-[#1E7E34] dark:text-[#4ADE80]">+{totalIn.toFixed(2)} <span className="text-xs">CHF</span></p>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-[#FEF3E7] dark:bg-[#3D2616] text-[#B45309] dark:text-[#F59E0B] rounded-xl flex items-center justify-center">
              <ArrowUpCircle size={18} />
            </div>
            <span className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">{t('cashOut')}</span>
          </div>
          <p className="text-2xl font-extrabold text-[#B45309] dark:text-[#F59E0B]">-{totalOut.toFixed(2)} <span className="text-xs">CHF</span></p>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-[#F5EBE1] dark:bg-[#33271D] text-[#A87B43] dark:text-[#E3B36C] rounded-xl flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <span className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">{t('expectedBalance')}</span>
          </div>
          <p className="text-2xl font-extrabold text-[#A87B43] dark:text-[#E3B36C]">{expectedBalance.toFixed(2)} <span className="text-xs text-[#9C9388]">CHF</span></p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Movements */}
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] p-5 shadow-xs">
          <h3 className="font-bold text-base text-[#1A1816] dark:text-[#F8F6F0] mb-4">Mouvements de caisse</h3>
          <div className="space-y-2.5 divide-y divide-[#EFECE6] dark:divide-[#2C2620]">
            {cashMovements.map((movement, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 first:pt-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    movement.type === 'in' 
                      ? 'bg-[#EAF7ED] text-[#1E7E34] dark:bg-[#1A3320]' 
                      : 'bg-[#FEF3E7] text-[#B45309] dark:bg-[#3D2616]'
                  }`}>
                    {movement.type === 'in' ? <ArrowDownCircle size={15} /> : <ArrowUpCircle size={15} />}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#1A1816] dark:text-[#F8F6F0]">{movement.reason}</p>
                    <p className="text-[11px] text-[#9C9388]">{movement.time}</p>
                  </div>
                </div>
                <span className={`text-xs sm:text-sm font-bold ${
                  movement.type === 'in' ? 'text-[#1E7E34] dark:text-[#4ADE80]' : 'text-[#B45309] dark:text-[#F59E0B]'
                }`}>
                  {movement.type === 'in' ? '+' : '-'}{movement.amount.toFixed(2)} CHF
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-[#EFECE6] dark:border-[#342D26]">
            <button className="flex-1 py-2.5 bg-[#F5EBE1] hover:bg-[#EAE0D4] text-[#A87B43] border border-[#A87B43]/20 rounded-xl text-xs font-bold transition-colors">
              + {t('cashIn')}
            </button>
            <button className="flex-1 py-2.5 bg-[#FEF3E7] hover:bg-[#FDE7D2] text-[#B45309] border border-[#B45309]/20 rounded-xl text-xs font-bold transition-colors">
              - {t('cashOut')}
            </button>
          </div>
        </div>

        {/* Cash Count */}
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-[#1A1816] dark:text-[#F8F6F0]">{t('countCash')}</h3>
            <button
              onClick={() => setShowCountModal(!showCountModal)}
              className="p-2 bg-[#F0EAE1] dark:bg-[#2C2620] hover:bg-[#E8E0D4] text-[#A87B43] rounded-xl transition-colors"
              title="Calculatrice d'espèces"
            >
              <Calculator size={18} />
            </button>
          </div>
          
          {showCountModal ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {denomCounts.map((denom, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#EFECE6] dark:border-[#2C2620]">
                  <span className="text-xs font-bold text-[#1A1816] dark:text-[#F8F6F0] w-20">{denom.label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = [...denomCounts];
                        updated[i] = { ...updated[i], count: Math.max(0, updated[i].count - 1) };
                        setDenomCounts(updated);
                      }}
                      className="w-7 h-7 rounded-lg bg-[#F0EAE1] dark:bg-[#2C2620] hover:bg-[#E8E0D4] text-[#1A1816] dark:text-[#F8F6F0] flex items-center justify-center text-xs font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#1A1816] dark:text-[#F8F6F0]">{denom.count}</span>
                    <button
                      onClick={() => {
                        const updated = [...denomCounts];
                        updated[i] = { ...updated[i], count: updated[i].count + 1 };
                        setDenomCounts(updated);
                      }}
                      className="w-7 h-7 rounded-lg bg-[#F0EAE1] dark:bg-[#2C2620] hover:bg-[#E8E0D4] text-[#1A1816] dark:text-[#F8F6F0] flex items-center justify-center text-xs font-bold transition-colors"
                    >
                      +
                    </button>
                    <span className="w-20 text-right text-xs font-bold text-[#A87B43]">
                      {(denom.value * denom.count).toFixed(2)} CHF
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-[#EFECE6] dark:border-[#342D26] flex justify-between text-xs">
                <span className="font-bold text-[#1A1816] dark:text-[#F8F6F0]">{t('total')}</span>
                <span className="font-extrabold text-[#A87B43]">{countedTotal.toFixed(2)} CHF</span>
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="text-[#9C9388]">{t('difference')}</span>
                <span className={`font-bold ${(countedTotal - expectedBalance) >= 0 ? 'text-[#1E7E34]' : 'text-[#DC2626]'}`}>
                  {(countedTotal - expectedBalance) >= 0 ? '+' : ''}{(countedTotal - expectedBalance).toFixed(2)} CHF
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-[#9C9388]">
              <Calculator size={40} className="mx-auto mb-3 opacity-30 text-[#A87B43]" />
              <p className="text-xs">Cliquez sur la calculatrice pour compter les espèces du tiroir-caisse</p>
            </div>
          )}
        </div>
      </div>

      {/* Open/Close Register Card */}
      <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-[#1A1816] dark:text-[#F8F6F0]">{t('registerStatus')}</h3>
            <p className="text-xs text-[#9C9388] mt-1">
              {isOpen ? 'La caisse est actuellement ouverte pour le service' : 'La caisse est fermée'}
            </p>
          </div>
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div>
                <input
                  type="number"
                  value={closingBalance}
                  onChange={(e) => setClosingBalance(e.target.value)}
                  placeholder={`Clôture (${expectedBalance.toFixed(0)} CHF)`}
                  className="w-36 px-3.5 py-2 bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43]"
                />
              </div>
              <button
                onClick={handleCloseRegister}
                className="px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl font-bold text-xs transition-colors shadow-xs"
              >
                {t('closeRegister')}
              </button>
            </div>
          ) : (
            <button
              onClick={handleOpenRegister}
              className="px-6 py-2.5 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-xl font-bold text-xs transition-colors shadow-xs"
            >
              {t('openRegister')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
