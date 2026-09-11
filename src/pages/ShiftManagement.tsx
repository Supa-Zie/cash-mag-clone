import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, User, LogIn, LogOut, Coffee, DollarSign, TrendingUp, Calendar, Users as UsersIcon, CheckCircle, XCircle } from 'lucide-react';

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
  const completedShifts = shifts.filter(s => s.status === 'completed');
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
    <div className="p-6 space-y-6 overflow-y-auto" style={{ backgroundColor: '#f6f5fa' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gestion des shifts</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Pointage, pauses et performance des employés</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Calendar size={16} />
          <span>15 Janvier 2026</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 w-fit">
        {(['shifts', 'timeclock', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab === 'shifts' ? 'Shifts actifs' : tab === 'timeclock' ? 'Pointage' : 'Historique'}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <UsersIcon size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{activeShifts.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">En service</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalActiveSales.toFixed(0)} CHF</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ventes en cours</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalActiveTx}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Transactions</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <Coffee size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalTips.toFixed(0)} CHF</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pourboires</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Shifts Tab */}
      {activeTab === 'shifts' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Shifts en cours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeShifts.map((shift) => (
              <div key={shift.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      {shift.employeeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">{shift.employeeName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Depuis {shift.startTime}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    shift.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {shift.status === 'active' ? <CheckCircle size={12} /> : <Coffee size={12} />}
                    {shift.status === 'active' ? 'Actif' : 'En pause'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-lg font-bold text-slate-800 dark:text-white">{shift.transactions}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Ventes</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{shift.totalSales.toFixed(0)}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">CHF</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{shift.tips}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Tips</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleBreak(shift.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                      shift.status === 'on-break'
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}
                  >
                    <Coffee size={14} />
                    {shift.status === 'on-break' ? 'Reprendre' : 'Pause'}
                  </button>
                  <button
                    onClick={() => handleClockOut(shift.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-all"
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
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Pointage rapide</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Clock In */}
              <div className="space-y-3">
                <h3 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <LogIn size={16} className="text-emerald-500" />
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
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          hasActiveShift
                            ? 'border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                            : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                            {name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{name}</span>
                        </div>
                        {hasActiveShift ? (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">En service</span>
                        ) : (
                          <LogIn size={16} className="text-emerald-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clock Out */}
              <div className="space-y-3">
                <h3 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <LogOut size={16} className="text-red-500" />
                  Pointer une sortie
                </h3>
                <div className="space-y-2">
                  {activeShifts.map((shift) => (
                    <button
                      key={shift.id}
                      onClick={() => handleClockOut(shift.id)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                          {shift.employeeName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block">{shift.employeeName}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Depuis {shift.startTime}</span>
                        </div>
                      </div>
                      <LogOut size={16} className="text-red-500" />
                    </button>
                  ))}
                  {activeShifts.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">Aucun shift actif</p>
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
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Historique des pointages</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Employé</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Entrée</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Sortie</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Pause</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {timeEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {entry.employeeName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">{entry.employeeName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{entry.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{entry.date}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{entry.clockIn}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{entry.clockOut || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{entry.breakDuration} min</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-white">{entry.totalHours}h</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        entry.clockOut
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
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
      )}
    </div>
  );
}
