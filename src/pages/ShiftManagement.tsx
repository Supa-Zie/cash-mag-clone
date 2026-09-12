import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, LogIn, LogOut, Coffee, DollarSign, TrendingUp, Calendar, Users as UsersIcon, CheckCircle } from 'lucide-react';

interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'on-break';
  breakStart?: string;
  breakEnd?: string;
  totalSales: number;
  transactions: number;
  cashHandled: number;
  tips: number;
}

interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  breakDuration: number; // minutes
  totalHours: number;
  role: string;
}

export default function ShiftManagement() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'shifts' | 'timeclock' | 'history'>('shifts');

  const [shifts, setShifts] = useState<Shift[]>([
    { id: '1', employeeId: '1', employeeName: 'Marie Laurent', startTime: '08:00', status: 'active', totalSales: 845.50, transactions: 42, cashHandled: 1200, tips: 35 },
    { id: '2', employeeId: '2', employeeName: 'Pierre Dubois', startTime: '08:00', status: 'on-break', breakStart: '12:30', totalSales: 678.20, transactions: 35, cashHandled: 950, tips: 28 },
    { id: '3', employeeId: '3', employeeName: 'Sophie Martin', startTime: '13:00', status: 'active', totalSales: 312.80, transactions: 18, cashHandled: 500, tips: 15 },
    { id: '4', employeeId: '4', employeeName: 'Thomas Berger', startTime: '08:00', endTime: '16:00', status: 'completed', totalSales: 1250.00, transactions: 58, cashHandled: 1800, tips: 45 },
    { id: '5', employeeId: '5', employeeName: 'Julie Favre', startTime: '13:00', status: 'active', totalSales: 285.60, transactions: 15, cashHandled: 420, tips: 12 },
  ]);

  const [timeEntries] = useState<TimeEntry[]>([
    { id: '1', employeeId: '1', employeeName: 'Marie Laurent', date: '2026-01-15', clockIn: '08:00', clockOut: '16:00', breakDuration: 30, totalHours: 7.5, role: 'Caissière' },
    { id: '2', employeeId: '2', employeeName: 'Pierre Dubois', date: '2026-01-15', clockIn: '08:00', clockOut: '16:00', breakDuration: 45, totalHours: 7.25, role: 'Caissier' },
    { id: '3', employeeId: '3', employeeName: 'Sophie Martin', date: '2026-01-15', clockIn: '13:00', breakDuration: 0, totalHours: 0, role: 'Vendeuse' },
    { id: '4', employeeId: '4', employeeName: 'Thomas Berger', date: '2026-01-14', clockIn: '08:00', clockOut: '16:00', breakDuration: 30, totalHours: 7.5, role: 'Caissier' },
    { id: '5', employeeId: '5', employeeName: 'Julie Favre', date: '2026-01-15', clockIn: '13:00', breakDuration: 0, totalHours: 0, role: 'Vendeuse' },
  ]);

  const activeShifts = shifts.filter(s => s.status === 'active' || s.status === 'on-break');
  const totalActiveSales = activeShifts.reduce((sum, s) => sum + s.totalSales, 0);
  const totalActiveTx = activeShifts.reduce((sum, s) => sum + s.transactions, 0);
  const totalTips = activeShifts.reduce((sum, s) => sum + s.tips, 0);

  const handleClockIn = (employeeId: string, employeeName: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newShift: Shift = {
      id: Date.now().toString(),
      employeeId,
      employeeName,
      startTime: timeStr,
      status: 'active',
      totalSales: 0,
      transactions: 0,
      cashHandled: 0,
      tips: 0,
    };
    setShifts([newShift, ...shifts]);
  };

  const handleClockOut = (shiftId: string) => {
    setShifts(prev => prev.map(s => {
      if (s.id === shiftId) {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        return { ...s, status: 'completed' as const, endTime: timeStr };
      }
      return s;
    }));
  };

  const handleBreak = (shiftId: string) => {
    setShifts(prev => prev.map(s => {
      if (s.id === shiftId) {
        if (s.status === 'on-break') {
          return { ...s, status: 'active' as const, breakEnd: new Date().toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' }) };
        }
        return { ...s, status: 'on-break' as const, breakStart: new Date().toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' }) };
      }
      return s;
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto bg-[#F8F6F0] dark:bg-[#181512] min-h-screen text-[#1A1816] dark:text-[#F8F6F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1816] dark:text-[#F8F6F0]">Gestion des shifts</h1>
          <p className="text-[#6B635B] dark:text-[#A89F95] text-sm mt-0.5">Pointage, pauses et performance des employés</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full text-xs sm:text-sm font-semibold text-[#6B635B] dark:text-[#A89F95] shadow-xs self-start sm:self-auto">
          <Calendar size={15} className="text-[#A87B43]" />
          <span>15 Janvier 2026</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] rounded-xl flex items-center justify-center">
              <UsersIcon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">{activeShifts.length}</p>
              <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">En service</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FEF3E7] dark:bg-[#3D2616] text-[#B45309] rounded-xl flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">{totalActiveSales.toFixed(0)} CHF</p>
              <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Ventes en cours</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EAF2FD] dark:bg-[#1E293B] text-[#2563EB] rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">{totalActiveTx}</p>
              <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Transactions</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] rounded-xl flex items-center justify-center">
              <Coffee size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">{totalTips.toFixed(0)} CHF</p>
              <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Pourboires</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full p-1.5 w-fit shadow-xs">
        {(['shifts', 'timeclock', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              activeTab === tab 
                ? 'bg-[#A87B43] text-white shadow-xs' 
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816] dark:hover:text-white'
            }`}
          >
            {tab === 'shifts' ? 'Shifts actifs' : tab === 'timeclock' ? 'Pointage' : 'Historique'}
          </button>
        ))}
      </div>

      {/* Active Shifts Tab */}
      {activeTab === 'shifts' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#1A1816] dark:text-[#F8F6F0]">Shifts en cours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeShifts.map((shift) => (
              <div key={shift.id} className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] border border-[#EFECE6] dark:border-[#342D26] rounded-full flex items-center justify-center text-xs font-bold">
                      {shift.employeeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-sm sm:text-base text-[#1A1816] dark:text-[#F8F6F0]">{shift.employeeName}</p>
                      <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Depuis {shift.startTime}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    shift.status === 'active' 
                      ? 'bg-[#EAF2FD] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]' 
                      : 'bg-[#FEF3E7] text-[#B45309] dark:bg-[#3D2616] dark:text-[#F59E0B]'
                  }`}>
                    {shift.status === 'active' ? <CheckCircle size={12} /> : <Coffee size={12} />}
                    {shift.status === 'active' ? 'Actif' : 'En pause'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-[#FAF8F3] dark:bg-[#25201A] rounded-xl border border-[#EFECE6] dark:border-[#342D26]">
                    <p className="text-base font-bold text-[#1A1816] dark:text-[#F8F6F0]">{shift.transactions}</p>
                    <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Ventes</p>
                  </div>
                  <div className="text-center p-3 bg-[#FAF8F3] dark:bg-[#25201A] rounded-xl border border-[#EFECE6] dark:border-[#342D26]">
                    <p className="text-base font-bold text-[#A87B43]">{shift.totalSales.toFixed(0)}</p>
                    <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">CHF</p>
                  </div>
                  <div className="text-center p-3 bg-[#FAF8F3] dark:bg-[#25201A] rounded-xl border border-[#EFECE6] dark:border-[#342D26]">
                    <p className="text-base font-bold text-[#B45309]">{shift.tips}</p>
                    <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Tips</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleBreak(shift.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      shift.status === 'on-break'
                        ? 'bg-[#EAF2FD] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]'
                        : 'bg-[#FAF4ED] text-[#A87B43] border border-[#E8DEC8] dark:bg-[#2D241C] dark:text-[#C59E58] dark:border-[#4A3B2C] hover:bg-[#F3EAD9]'
                    }`}
                  >
                    <Coffee size={14} />
                    {shift.status === 'on-break' ? 'Reprendre' : 'Pause'}
                  </button>
                  <button
                    onClick={() => handleClockOut(shift.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#FEECEC] text-[#DC2626] dark:bg-[#381B1B] dark:text-[#F87171] rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#FCD8D8] transition-all"
                  >
                    <LogOut size={14} />
                    Pointer sortie
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Clock Tab */}
      {activeTab === 'timeclock' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#1A1816] dark:text-[#F8F6F0]">Pointage rapide</h2>
          <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] p-6 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Clock In */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#1A1816] dark:text-[#F8F6F0] flex items-center gap-2">
                  <LogIn size={16} className="text-[#A87B43]" />
                  Pointer une entrée
                </h3>
                <div className="space-y-2">
                  {['Marie Laurent', 'Pierre Dubois', 'Sophie Martin', 'Julie Favre'].map((name) => {
                    const hasActiveShift = shifts.some(s => s.employeeName === name && (s.status === 'active' || s.status === 'on-break'));
                    return (
                      <button
                        key={name}
                        onClick={() => !hasActiveShift && handleClockIn(name.split(' ')[0], name)}
                        disabled={hasActiveShift}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                          hasActiveShift
                            ? 'border-[#EFECE6] dark:border-[#342D26] opacity-50 cursor-not-allowed bg-[#FAF8F3]/50 dark:bg-[#25201A]/50'
                            : 'border-[#EFECE6] dark:border-[#342D26] hover:border-[#A87B43] hover:bg-[#FAF4ED] dark:hover:bg-[#2D241C]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] rounded-full flex items-center justify-center text-xs font-bold">
                            {name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-semibold text-[#1A1816] dark:text-[#F8F6F0]">{name}</span>
                        </div>
                        {hasActiveShift ? (
                          <span className="text-xs text-[#2563EB] font-semibold">En service</span>
                        ) : (
                          <LogIn size={16} className="text-[#A87B43]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clock Out */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#1A1816] dark:text-[#F8F6F0] flex items-center gap-2">
                  <LogOut size={16} className="text-[#DC2626]" />
                  Pointer une sortie
                </h3>
                <div className="space-y-2">
                  {activeShifts.map((shift) => (
                    <button
                      key={shift.id}
                      onClick={() => handleClockOut(shift.id)}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#EFECE6] dark:border-[#342D26] hover:border-[#DC2626]/40 hover:bg-[#FEECEC]/50 dark:hover:bg-[#381B1B]/40 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] rounded-full flex items-center justify-center text-xs font-bold">
                          {shift.employeeName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-semibold text-[#1A1816] dark:text-[#F8F6F0] block">{shift.employeeName}</span>
                          <span className="text-xs text-[#6B635B] dark:text-[#A89F95]">Depuis {shift.startTime}</span>
                        </div>
                      </div>
                      <LogOut size={16} className="text-[#DC2626]" />
                    </button>
                  ))}
                  {activeShifts.length === 0 && (
                    <p className="text-xs text-[#6B635B] dark:text-[#A89F95] text-center py-6">Aucun shift actif</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#1A1816] dark:text-[#F8F6F0]">Historique des pointages</h2>
          <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAF8F3] dark:bg-[#25201A] border-b border-[#EFECE6] dark:border-[#342D26]">
                  <tr>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Employé</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Date</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Entrée</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Sortie</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Pause</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Total</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6] dark:divide-[#342D26]">
                  {timeEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-[#FAF8F3]/70 dark:hover:bg-[#28221B]/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] rounded-full flex items-center justify-center text-xs font-bold">
                            {entry.employeeName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1A1816] dark:text-[#F8F6F0]">{entry.employeeName}</p>
                            <p className="text-xs text-[#6B635B] dark:text-[#A89F95]">{entry.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95]">{entry.date}</td>
                      <td className="px-5 py-3.5 text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95]">{entry.clockIn}</td>
                      <td className="px-5 py-3.5 text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95]">{entry.clockOut || '—'}</td>
                      <td className="px-5 py-3.5 text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95]">{entry.breakDuration} min</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-[#1A1816] dark:text-[#F8F6F0]">{entry.totalHours}h</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          entry.clockOut
                            ? 'bg-[#EAF2FD] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]'
                            : 'bg-[#FEF3E7] text-[#B45309] dark:bg-[#3D2616] dark:text-[#F59E0B]'
                        }`}>
                          {entry.clockOut ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {entry.clockOut ? 'Terminé' : 'En cours'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
