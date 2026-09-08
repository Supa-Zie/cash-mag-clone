import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Plus, Edit2, Trash2, Clock, DollarSign, Award, X, Mail, Phone, Shield, UserCheck } from 'lucide-react';

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
      case 'manager': return 'bg-purple-100 text-purple-700';
      case 'cashier': return 'bg-blue-100 text-blue-700';
      case 'stock': return 'bg-amber-100 text-amber-700';
      case 'admin': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'manager': return 'Manager';
      case 'cashier': return 'Caissier(ère)';
      case 'stock': return 'Stock';
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
    <div className="p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('employees')}</h1>
          <p className="text-slate-500 text-sm">Gestion des employés, rôles et commissions</p>
        </div>
        <button onClick={() => { setEditingEmployee(null); setFormData({ name: '', role: 'cashier', email: '', phone: '', commission: 1.5 }); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          <Plus size={16} /> Nouvel employé
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><Users size={20} className="text-emerald-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{activeCount}</p><p className="text-xs text-slate-500">Actifs</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><DollarSign size={20} className="text-blue-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{totalSales.toLocaleString()} CHF</p><p className="text-xs text-slate-500">Ventes totales</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Award size={20} className="text-purple-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{totalTx}</p><p className="text-xs text-slate-500">Transactions</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><Clock size={20} className="text-amber-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{(totalSales / (totalTx || 1)).toFixed(0)} CHF</p><p className="text-xs text-slate-500">Panier moyen</p></div>
          </div>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${
                  emp.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>{emp.avatar}</div>
                <div>
                  <h3 className="font-semibold text-slate-800">{emp.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(emp.role)}`}>
                    {getRoleLabel(emp.role)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(emp)} className="p-1.5 hover:bg-slate-100 rounded-lg"><Edit2 size={14} className="text-slate-400" /></button>
                <button onClick={() => handleDelete(emp.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-400" /></button>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600"><Mail size={12} className="text-slate-400" /><span>{emp.email}</span></div>
              <div className="flex items-center gap-2 text-sm text-slate-600"><Phone size={12} className="text-slate-400" /><span>{emp.phone}</span></div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">{emp.totalSales > 0 ? `${(emp.totalSales / 1000).toFixed(1)}k` : '-'}</p>
                <p className="text-xs text-slate-500">CHF</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">{emp.transactions || '-'}</p>
                <p className="text-xs text-slate-500">Tx</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">{emp.commission}%</p>
                <p className="text-xs text-slate-500">Comm.</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">{editingEmployee ? 'Modifier' : 'Nouvel employé'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as Employee['role'] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="cashier">Caissier(ère)</option>
                  <option value="manager">Manager</option>
                  <option value="stock">Stock</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Commission (%)</label>
                <input type="number" step="0.1" value={formData.commission} onChange={e => setFormData({ ...formData, commission: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Annuler</button>
              <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
                {editingEmployee ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
