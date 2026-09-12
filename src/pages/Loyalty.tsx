import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Plus, Gift, Award, Crown, Sparkles, Search, X, Medal, TrendingUp } from 'lucide-react';

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
  const [selectedCustomer, setSelectedCustomer] = useState<LoyaltyCustomer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', birthday: '' });

  const [customers, setCustomers] = useState<LoyaltyCustomer[]>([
    { id: '1', name: 'Jean Dupont', email: 'jean@example.com', phone: '+41 79 111 22 33', points: 450, tier: 'gold', totalSpent: 1250, visits: 28, lastVisit: '2026-01-14', joinDate: '2024-02-10' },
    { id: '2', name: 'Anne Richard', email: 'anne@example.com', phone: '+41 79 222 33 44', points: 820, tier: 'platinum', totalSpent: 2400, visits: 52, lastVisit: '2026-01-15', joinDate: '2023-08-15' },
    { id: '3', name: 'Marc Blanc', email: 'marc@example.com', phone: '+41 79 333 44 55', points: 150, tier: 'silver', totalSpent: 420, visits: 12, lastVisit: '2026-01-10', joinDate: '2024-06-01' },
    { id: '4', name: 'Lucie Favre', email: 'lucie@example.com', phone: '+41 79 444 55 66', points: 60, tier: 'bronze', totalSpent: 180, visits: 5, lastVisit: '2026-01-08', joinDate: '2024-10-20' },
    { id: '5', name: 'David Roux', email: 'david@example.com', phone: '+41 79 555 66 77', points: 310, tier: 'silver', totalSpent: 780, visits: 19, lastVisit: '2026-01-12', joinDate: '2024-04-12' },
  ]);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const totalPoints = customers.reduce((sum, c) => sum + c.points, 0);
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgVisits = customers.reduce((sum, c) => sum + c.visits, 0) / (customers.length || 1);

  const tierCounts = {
    bronze: customers.filter(c => c.tier === 'bronze').length,
    silver: customers.filter(c => c.tier === 'silver').length,
    gold: customers.filter(c => c.tier === 'gold').length,
    platinum: customers.filter(c => c.tier === 'platinum').length,
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-[#FEF3E7] text-[#B45309] dark:bg-[#3D2616] dark:text-[#F59E0B]';
      case 'silver': return 'bg-[#EAF2FD] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]';
      case 'gold': return 'bg-[#F5EBE1] text-[#A87B43] dark:bg-[#33271D] dark:text-[#E3B36C]';
      case 'platinum': return 'bg-[#1A1816] text-white dark:bg-[#F8F6F0] dark:text-[#1A1816]';
      default: return 'bg-[#F0EAE1] text-[#6B635B]';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return <Medal size={13} className="text-[#B45309]" />;
      case 'silver': return <Award size={13} className="text-[#2563EB]" />;
      case 'gold': return <Crown size={13} className="text-[#A87B43]" />;
      case 'platinum': return <Sparkles size={13} className="text-[#C59E58]" />;
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
      points: 100,
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-full bg-[#F8F6F0] dark:bg-[#181512] text-[#1A1816] dark:text-[#F8F6F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#A87B43] dark:text-[#E3B36C] tracking-tight">
              CashMag
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">
              {t('loyalty')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95] mt-1">
            Programme de fidélité, points de récompense et fiches clients
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-full font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Nouveau client</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4.5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F8F6F0] dark:bg-[#2C2620] text-[#A87B43] rounded-xl flex items-center justify-center border border-[#EFECE6]/60 dark:border-[#342D26]">
              <Award size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{customers.length}</p>
              <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">Membres inscrits</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4.5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F5EBE1] dark:bg-[#33271D] text-[#A87B43] rounded-xl flex items-center justify-center">
              <Star size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{totalPoints.toLocaleString()}</p>
              <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">Points totaux</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4.5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EAF7ED] dark:bg-[#1A3320] text-[#1E7E34] dark:text-[#4ADE80] rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{totalSpent.toLocaleString()} <span className="text-xs text-[#A87B43]">CHF</span></p>
              <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">CA Fidélité</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4.5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EAF2FD] dark:bg-[#1E293B] text-[#2563EB] rounded-xl flex items-center justify-center">
              <Gift size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{avgVisits.toFixed(0)}</p>
              <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">Visites moy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Distribution Card */}
      <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
        <h3 className="font-bold text-base text-[#1A1816] dark:text-[#F8F6F0] mb-4">Répartition par niveau de fidélité</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['platinum', 'gold', 'silver', 'bronze'] as const).map((tier) => (
            <div key={tier} className="text-center p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26]">
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                tier === 'platinum' ? 'bg-[#1A1816] text-white dark:bg-[#F8F6F0] dark:text-[#1A1816]' : 
                tier === 'gold' ? 'bg-[#F5EBE1] text-[#A87B43]' : 
                tier === 'silver' ? 'bg-[#EAF2FD] text-[#2563EB]' : 
                'bg-[#FEF3E7] text-[#B45309]'
              }`}>
                {getTierIcon(tier)}
              </div>
              <p className="text-lg font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{tierCounts[tier]}</p>
              <p className="text-[11px] font-bold text-[#9C9388] uppercase tracking-wider">{tier}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9388]" />
        <input 
          type="text" 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Rechercher un client fidélité par nom, email ou téléphone..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] placeholder-[#9C9388] outline-none focus:border-[#A87B43] focus:ring-2 focus:ring-[#A87B43]/15 transition-all shadow-2xs" 
        />
      </div>

      {/* Customer List */}
      <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F3] dark:bg-[#25201A] border-b border-[#EFECE6] dark:border-[#342D26] text-[#9C9388] font-bold">
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">Client</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">Niveau</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">Points</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">Total dépensé</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">Visites</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">Dernière visite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] dark:divide-[#2C2620]">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#FAF8F3]/70 dark:hover:bg-[#28221B]/40 cursor-pointer transition-colors" onClick={() => setSelectedCustomer(cust)}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#F0EAE1] dark:bg-[#2E2720] text-[#A87B43] rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs">
                        {cust.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1816] dark:text-[#F8F6F0]">{cust.name}</p>
                        <p className="text-[11px] text-[#9C9388]">{cust.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${getTierBadge(cust.tier)}`}>
                      {getTierIcon(cust.tier)}
                      <span className="capitalize">{cust.tier}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-[#A87B43]">{cust.points.toLocaleString()} pts</td>
                  <td className="px-4 py-3.5 font-bold text-[#1A1816] dark:text-[#F8F6F0]">{cust.totalSpent.toLocaleString()} CHF</td>
                  <td className="px-4 py-3.5 text-[#6B635B] dark:text-[#A89F95] font-medium">{cust.visits}</td>
                  <td className="px-4 py-3.5 text-[#9C9388] whitespace-nowrap">{cust.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white dark:bg-[#221E1A] rounded-2xl w-full max-w-md border border-[#EFECE6] dark:border-[#342D26] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#EFECE6] dark:border-[#342D26] flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1A1816] dark:text-[#F8F6F0]">Fiche client fidélité</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-1.5 text-[#9C9388] hover:text-[#1A1816] dark:hover:text-[#F8F6F0] rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#F0EAE1] dark:bg-[#2E2720] text-[#A87B43] rounded-full flex items-center justify-center text-lg font-bold shadow-xs">
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A1816] dark:text-[#F8F6F0]">{selectedCustomer.name}</h3>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${getTierBadge(selectedCustomer.tier)}`}>
                    {getTierIcon(selectedCustomer.tier)}
                    <span className="capitalize">{selectedCustomer.tier}</span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FAF8F3] dark:bg-[#28221B] rounded-xl p-3 text-center border border-[#EFECE6] dark:border-[#342D26]">
                  <p className="text-xl font-extrabold text-[#A87B43]">{selectedCustomer.points.toLocaleString()}</p>
                  <p className="text-[11px] font-semibold text-[#9C9388]">Points cumulés</p>
                </div>
                <div className="bg-[#FAF8F3] dark:bg-[#28221B] rounded-xl p-3 text-center border border-[#EFECE6] dark:border-[#342D26]">
                  <p className="text-xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{selectedCustomer.totalSpent.toLocaleString()} CHF</p>
                  <p className="text-[11px] font-semibold text-[#9C9388]">Total dépensé</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs pt-2">
                <p className="text-[#6B635B] dark:text-[#A89F95]"><span className="text-[#9C9388] font-medium">Email:</span> {selectedCustomer.email}</p>
                <p className="text-[#6B635B] dark:text-[#A89F95]"><span className="text-[#9C9388] font-medium">Téléphone:</span> {selectedCustomer.phone}</p>
                <p className="text-[#6B635B] dark:text-[#A89F95]"><span className="text-[#9C9388] font-medium">Membre depuis:</span> {selectedCustomer.joinDate}</p>
                <p className="text-[#6B635B] dark:text-[#A89F95]"><span className="text-[#9C9388] font-medium">Nombre de visites:</span> {selectedCustomer.visits}</p>
                {selectedCustomer.birthday && <p className="text-[#6B635B] dark:text-[#A89F95]"><span className="text-[#9C9388] font-medium">Anniversaire:</span> {selectedCustomer.birthday}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-[#221E1A] rounded-2xl w-full max-w-md border border-[#EFECE6] dark:border-[#342D26] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#EFECE6] dark:border-[#342D26] flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1A1816] dark:text-[#F8F6F0]">Nouveau client fidélité</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-[#9C9388] hover:text-[#1A1816] dark:hover:text-[#F8F6F0] rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#6B635B] dark:text-[#A89F95] mb-1">Nom complet</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43]" />
              </div>
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
              <div>
                <label className="block font-bold text-[#6B635B] dark:text-[#A89F95] mb-1">Anniversaire (optionnel)</label>
                <input type="date" value={formData.birthday} onChange={e => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43]" />
              </div>
              <p className="text-xs text-[#A87B43] bg-[#F5EBE1] dark:bg-[#33271D] p-3 rounded-xl font-medium">🎁 Bonus de bienvenue: 100 points fidélité offerts dès l'inscription</p>
            </div>
            <div className="p-5 border-t border-[#EFECE6] dark:border-[#342D26] flex justify-end gap-2.5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs font-semibold text-[#6B635B] dark:text-[#A89F95] hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620] transition-colors">
                Annuler
              </button>
              <button onClick={handleAddCustomer} className="px-5 py-2 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-xl text-xs font-bold transition-colors shadow-xs">
                Inscrire le client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
