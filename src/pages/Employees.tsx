import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Plus, Edit2, Trash2, Clock, DollarSign, Award, X, Mail, Phone } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: 'manager' | 'cashier' | 'stock' | 'admin';
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive';
  totalSales: number;
  transactions: number;
  joinDate: string;
  commission: number;
}

export default function Employees() {
  const { t } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1', name: 'Marie Laurent', role: 'manager',
      email: 'marie@cashmag.ch', phone: '+41 79 123 45 67',
      avatar: 'ML', status: 'active', totalSales: 12450, transactions: 342,
      joinDate: '2023-03-15', commission: 2.5,
    },
    {
      id: '2', name: 'Pierre Dubois', role: 'cashier',
      email: 'pierre@cashmag.ch', phone: '+41 79 234 56 78',
      avatar: 'PD', status: 'active', totalSales: 8920, transactions: 256,
      joinDate: '2024-01-10', commission: 1.5,
    },
    {
      id: '3', name: 'Sophie Martin', role: 'cashier',
      email: 'sophie@cashmag.ch', phone: '+41 79 345 67 89',
      avatar: 'SM', status: 'active', totalSales: 7650, transactions: 198,
      joinDate: '2024-06-22', commission: 1.5,
    },
    {
      id: '4', name: 'Thomas Berger', role: 'stock',
      email: 'thomas@cashmag.ch', phone: '+41 79 456 78 90',
      avatar: 'TB', status: 'active', totalSales: 0, transactions: 0,
      joinDate: '2024-09-01', commission: 0,
    },
    {
      id: '5', name: 'Claire Moreau', role: 'cashier',
      email: 'claire@cashmag.ch', phone: '+41 79 567 89 01',
      avatar: 'CM', status: 'inactive', totalSales: 3200, transactions: 89,
      joinDate: '2023-11-05', commission: 1.5,
    },
  ]);

  const [formData, setFormData] = useState({
    name: '', role: 'cashier' as Employee['role'], email: '', phone: '', commission: 1.5,
  });

  const totalSales = employees.reduce((sum, e) => sum + e.totalSales, 0);
  const totalTx = employees.reduce((sum, e) => sum + e.transactions, 0);
  const activeCount = employees.filter(e => e.status === 'active').length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'manager': return 'bg-[#F5EBE1] text-[#A87B43] dark:bg-[#33271D] dark:text-[#E3B36C]';
      case 'cashier': return 'bg-[#EAF2FD] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]';
      case 'stock': return 'bg-[#FEF3E7] text-[#B45309] dark:bg-[#3D2616] dark:text-[#F59E0B]';
      case 'admin': return 'bg-[#1A1816] text-white dark:bg-[#F8F6F0] dark:text-[#1A1816]';
      default: return 'bg-[#F0EAE1] text-[#6B635B] dark:bg-[#2C2620] dark:text-[#A89F95]';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'manager': return 'Manager';
      case 'cashier': return 'Caissier(ère)';
      case 'stock': return 'Stockiste';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  const handleSave = () => {
    if (editingEmployee) {
      setEmployees(employees.map(e => e.id === editingEmployee.id ? {
        ...e, name: formData.name, role: formData.role, email: formData.email,
        phone: formData.phone, commission: formData.commission,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      } : e));
    } else {
      const newEmp: Employee = {
        id: Date.now().toString(),
        name: formData.name, role: formData.role, email: formData.email,
        phone: formData.phone, commission: formData.commission,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        status: 'active', totalSales: 0, transactions: 0,
        joinDate: new Date().toISOString().split('T')[0],
      };
      setEmployees([newEmp, ...employees]);
    }
    setShowModal(false);
    setEditingEmployee(null);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({ name: emp.name, role: emp.role, email: emp.email, phone: emp.phone, commission: emp.commission });
    setShowModal(true);
  };

  const handleDelete = (id: string) => setEmployees(employees.filter(e => e.id !== id));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-full bg-[#F8F6F0] dark:bg-[#181512] text-[#1A1816] dark:text-[#F8F6F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#A87B43] dark:text-[#E3B36C] tracking-tight">
              CashMag
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">
              {t('employees')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95] mt-1">
            Gestion du personnel, des stations d'encaissement et des commissions
          </p>
        </div>
        <button 
          onClick={() => { setEditingEmployee(null); setFormData({ name: '', role: 'cashier', email: '', phone: '', commission: 1.5 }); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-full font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Nouvel employé</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4.5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EAF7ED] dark:bg-[#1A3320] text-[#1E7E34] dark:text-[#4ADE80] rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{activeCount}</p>
              <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">Employés actifs</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4.5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F5EBE1] dark:bg-[#33271D] text-[#A87B43] dark:text-[#E3B36C] rounded-xl flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{totalSales.toLocaleString()} <span className="text-xs text-[#A87B43]">CHF</span></p>
              <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">Ventes totales</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4.5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F8F6F0] dark:bg-[#2A241E] text-[#C59E58] rounded-xl flex items-center justify-center border border-[#EFECE6]/60 dark:border-[#342D26]">
              <Award size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{totalTx}</p>
              <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">Transactions</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4.5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF8F3] dark:bg-[#2A241E] text-[#A87B43] rounded-xl flex items-center justify-center border border-[#EFECE6]/60 dark:border-[#342D26]">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{(totalSales / (totalTx || 1)).toFixed(0)} <span className="text-xs text-[#A87B43]">CHF</span></p>
              <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">Panier moyen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div key={emp.id} className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] p-5 hover:border-[#A87B43] transition-all shadow-xs">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#F0EAE1] dark:bg-[#2E2720] text-[#A87B43] font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-2xs">
                  {emp.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1A1816] dark:text-[#F8F6F0]">{emp.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${getRoleBadge(emp.role)}`}>
                    {getRoleLabel(emp.role)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(emp)} className="p-1.5 hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620] text-[#9C9388] hover:text-[#A87B43] rounded-lg transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(emp.id)} className="p-1.5 hover:bg-[#FEECEC] dark:hover:bg-[#381B1B] text-[#9C9388] hover:text-[#DC2626] rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="space-y-1.5 mb-4 text-xs text-[#6B635B] dark:text-[#A89F95]">
              <div className="flex items-center gap-2"><Mail size={13} className="text-[#9C9388]" /><span>{emp.email}</span></div>
              <div className="flex items-center gap-2"><Phone size={13} className="text-[#9C9388]" /><span>{emp.phone}</span></div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#EFECE6] dark:border-[#342D26]">
              <div className="text-center">
                <p className="text-xs sm:text-sm font-bold text-[#1A1816] dark:text-[#F8F6F0]">{emp.totalSales > 0 ? `${(emp.totalSales / 1000).toFixed(1)}k` : '-'}</p>
                <p className="text-[10px] text-[#9C9388]">CHF</p>
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm font-bold text-[#1A1816] dark:text-[#F8F6F0]">{emp.transactions || '-'}</p>
                <p className="text-[10px] text-[#9C9388]">Tx</p>
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm font-bold text-[#A87B43]">{emp.commission}%</p>
                <p className="text-[10px] text-[#9C9388]">Comm.</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-[#221E1A] rounded-2xl w-full max-w-md border border-[#EFECE6] dark:border-[#342D26] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#EFECE6] dark:border-[#342D26] flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1A1816] dark:text-[#F8F6F0]">{editingEmployee ? 'Modifier l\'employé' : 'Nouvel employé'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-[#9C9388] hover:text-[#1A1816] dark:hover:text-[#F8F6F0] rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#6B635B] dark:text-[#A89F95] mb-1">Nom complet</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43]" />
              </div>
              <div>
                <label className="block font-bold text-[#6B635B] dark:text-[#A89F95] mb-1">Rôle</label>
                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as Employee['role'] })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43]">
                  <option value="cashier">Caissier(ère)</option>
                  <option value="manager">Manager</option>
                  <option value="stock">Stockiste</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#6B635B] dark:text-[#A89F95] mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43]" />
                </div>
                <div>
                  <label className="block font-bold text-[#6B635B] dark:text-[#A89F95] mb-1">Téléphone</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43]" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-[#6B635B] dark:text-[#A89F95] mb-1">Commission (%)</label>
                <input type="number" step="0.1" value={formData.commission} onChange={e => setFormData({ ...formData, commission: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43]" />
              </div>
            </div>
            <div className="p-5 border-t border-[#EFECE6] dark:border-[#342D26] flex justify-end gap-2.5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs font-semibold text-[#6B635B] dark:text-[#A89F95] hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620] transition-colors">
                Annuler
              </button>
              <button onClick={handleSave} className="px-5 py-2 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-xl text-xs font-bold transition-colors shadow-xs">
                {editingEmployee ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
