import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Plus, Search, Star, Gift, TrendingUp, X, Crown, Medal, Sparkles } from 'lucide-react';

interface LoyaltyCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  visits: number;
  lastVisit: string;
  joinDate: string;
  birthday?: string;
}

export default function Loyalty() {
  const { t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<LoyaltyCustomer | null>(null);

  const [customers, setCustomers] = useState<LoyaltyCustomer[]>([
    { id: '1', name: 'Anne-Claire Rochat', email: 'anne@email.ch', phone: '+41 79 111 22 33', points: 2450, tier: 'gold', totalSpent: 4850, visits: 67, lastVisit: '2026-01-15', joinDate: '2023-06-12', birthday: '1985-03-22' },
    { id: '2', name: 'Marc Dubois', email: 'marc@email.ch', phone: '+41 79 222 33 44', points: 5200, tier: 'platinum', totalSpent: 10400, visits: 134, lastVisit: '2026-01-15', joinDate: '2022-01-05', birthday: '1978-11-08' },
    { id: '3', name: 'Isabelle Favre', email: 'isabelle@email.ch', phone: '+41 79 333 44 55', points: 1200, tier: 'silver', totalSpent: 2400, visits: 32, lastVisit: '2026-01-14', joinDate: '2024-03-18' },
    { id: '4', name: 'Jean-Michel Perret', email: 'jm@email.ch', phone: '+41 79 444 55 66', points: 680, tier: 'bronze', totalSpent: 1360, visits: 18, lastVisit: '2026-01-13', joinDate: '2024-09-02' },
    { id: '5', name: 'Sophie Martin', email: 'sophie.m@email.ch', phone: '+41 79 555 66 77', points: 3100, tier: 'gold', totalSpent: 6200, visits: 85, lastVisit: '2026-01-15', joinDate: '2023-01-20', birthday: '1990-07-14' },
    { id: '6', name: 'François Blanc', email: 'francois@email.ch', phone: '+41 79 666 77 88', points: 450, tier: 'bronze', totalSpent: 900, visits: 12, lastVisit: '2026-01-10', joinDate: '2025-02-14' },
    { id: '7', name: 'Caroline Rossier', email: 'caro@email.ch', phone: '+41 79 777 88 99', points: 1850, tier: 'silver', totalSpent: 3700, visits: 48, lastVisit: '2026-01-14', joinDate: '2023-08-30' },
  ]);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', birthday: '' });

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPoints = customers.reduce((sum, c) => sum + c.points, 0);
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgVisits = customers.length > 0 ? customers.reduce((sum, c) => sum + c.visits, 0) / customers.length : 0;

  const tierCounts = {
    bronze: customers.filter(c => c.tier === 'bronze').length,
    silver: customers.filter(c => c.tier === 'silver').length,
    gold: customers.filter(c => c.tier === 'gold').length,
    platinum: customers.filter(c => c.tier === 'platinum').length,
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-700';
      case 'silver': return 'bg-slate-100 text-slate-600';
      case 'gold': return 'bg-yellow-100 text-yellow-700';
      case 'platinum': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return <Medal size={14} className="text-amber-600" />;
      case 'silver': return <Award size={14} className="text-slate-500" />;
      case 'gold': return <Crown size={14} className="text-yellow-600" />;
      case 'platinum': return <Sparkles size={14} className="text-purple-600" />;
      default: return null;
    }
  };

  const handleAddCustomer = () => {
    const newCustomer: LoyaltyCustomer = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      birthday: formData.birthday || undefined,
      points: 100, // welcome bonus
      tier: 'bronze',
      totalSpent: 0,
      visits: 0,
      lastVisit: '-',
      joinDate: new Date().toISOString().split('T')[0],
    };
    setCustomers([newCustomer, ...customers]);
    setShowModal(false);
    setFormData({ name: '', email: '', phone: '', birthday: '' });
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto" style={{ backgroundColor: '#f6f5fa' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('loyalty')}</h1>
          <p className="text-slate-500 text-sm">Programme de fidélité et gestion des clients</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
          <Plus size={16} /> Nouveau client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Award size={20} className="text-purple-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{customers.length}</p><p className="text-xs text-slate-500">Membres</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><Star size={20} className="text-amber-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{totalPoints.toLocaleString()}</p><p className="text-xs text-slate-500">Points totaux</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><TrendingUp size={20} className="text-emerald-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{totalSpent.toLocaleString()} CHF</p><p className="text-xs text-slate-500">CA fidélité</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Gift size={20} className="text-blue-600" /></div>
            <div><p className="text-2xl font-bold text-slate-800">{avgVisits.toFixed(0)}</p><p className="text-xs text-slate-500">Visites moy.</p></div>
          </div>
        </div>
      </div>

      {/* Tier Distribution */}
      <div className="bg-white rounded-xl p-5 border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-4">Répartition par niveau</h3>
        <div className="grid grid-cols-4 gap-4">
          {(['platinum', 'gold', 'silver', 'bronze'] as const).map((tier) => (
            <div key={tier} className="text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                tier === 'platinum' ? 'bg-purple-100' : tier === 'gold' ? 'bg-yellow-100' : tier === 'silver' ? 'bg-slate-100' : 'bg-amber-100'
              }`}>
                {getTierIcon(tier)}
              </div>
              <p className="text-lg font-bold text-slate-800">{tierCounts[tier]}</p>
              <p className="text-xs text-slate-500 capitalize">{tier}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          placeholder="Rechercher un client..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Client</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Niveau</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Points</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Total dépensé</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Visites</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Dernière visite</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.map((cust) => (
              <tr key={cust.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedCustomer(cust)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-700">
                      {cust.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{cust.name}</p>
                      <p className="text-xs text-slate-500">{cust.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getTierBadge(cust.tier)}`}>
                    {getTierIcon(cust.tier)}
                    <span className="capitalize">{cust.tier}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{cust.points.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{cust.totalSpent.toLocaleString()} CHF</td>
                <td className="px-4 py-3 text-sm text-slate-600">{cust.visits}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{cust.lastVisit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Fiche client</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-xl font-bold text-emerald-700">
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{selectedCustomer.name}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getTierBadge(selectedCustomer.tier)}`}>
                    {getTierIcon(selectedCustomer.tier)}
                    <span className="capitalize">{selectedCustomer.tier}</span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-slate-800">{selectedCustomer.points.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Points</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-slate-800">{selectedCustomer.totalSpent.toLocaleString()} CHF</p>
                  <p className="text-xs text-slate-500">Total dépensé</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-slate-600"><span className="text-slate-400">Email:</span> {selectedCustomer.email}</p>
                <p className="text-slate-600"><span className="text-slate-400">Téléphone:</span> {selectedCustomer.phone}</p>
                <p className="text-slate-600"><span className="text-slate-400">Membre depuis:</span> {selectedCustomer.joinDate}</p>
                <p className="text-slate-600"><span className="text-slate-400">Visites:</span> {selectedCustomer.visits}</p>
                {selectedCustomer.birthday && <p className="text-slate-600"><span className="text-slate-400">Anniversaire:</span> {selectedCustomer.birthday}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Nouveau client fidélité</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Anniversaire (optionnel)</label>
                <input type="date" value={formData.birthday} onChange={e => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <p className="text-xs text-slate-500 bg-emerald-50 p-3 rounded-lg">🎁 Bonus de bienvenue: 100 points offerts</p>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Annuler</button>
              <button onClick={handleAddCustomer} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Inscrire le client</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
