import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Star, Users, TrendingUp, Search, Gift, Crown, Medal, UserPlus, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';

export default function Loyalty() {
  const { t, loyaltyCustomers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const filteredCustomers = loyaltyCustomers.filter(cust => {
    const matchesSearch = cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || cust.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const totalPoints = loyaltyCustomers.reduce((sum, c) => sum + c.points, 0);
  const totalSpent = loyaltyCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalVisits = loyaltyCustomers.reduce((sum, c) => sum + c.visits, 0);
  const avgPointsPerCustomer = loyaltyCustomers.length > 0 ? totalPoints / loyaltyCustomers.length : 0;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-gradient-to-r from-slate-300 to-slate-400 text-white';
      case 'Gold': return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white';
      case 'Silver': return 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800';
      case 'Bronze': return 'bg-gradient-to-r from-orange-400 to-amber-600 text-white';
      default: return 'bg-slate-200 text-slate-700';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Platinum': return <Crown size={16} />;
      case 'Gold': return <Award size={16} />;
      case 'Silver': return <Medal size={16} />;
      case 'Bronze': return <Star size={16} />;
      default: return <Star size={16} />;
    }
  };

  const getTierThreshold = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 5000;
      case 'Gold': return 2000;
      case 'Silver': return 1000;
      case 'Bronze': return 0;
      default: return 0;
    }
  };

  const getNextTier = (tier: string) => {
    switch (tier) {
      case 'Bronze': return { name: 'Silver', threshold: 1000 };
      case 'Silver': return { name: 'Gold', threshold: 2000 };
      case 'Gold': return { name: 'Platinum', threshold: 5000 };
      case 'Platinum': return null;
      default: return null;
    }
  };

  const tierCounts = {
    Platinum: loyaltyCustomers.filter(c => c.tier === 'Platinum').length,
    Gold: loyaltyCustomers.filter(c => c.tier === 'Gold').length,
    Silver: loyaltyCustomers.filter(c => c.tier === 'Silver').length,
    Bronze: loyaltyCustomers.filter(c => c.tier === 'Bronze').length,
  };

  const selectedCust = selectedCustomer ? loyaltyCustomers.find(c => c.id === selectedCustomer) : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="text-emerald-600" />
            {t('loyalty')}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{loyaltyCustomers.length} membres actifs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <UserPlus size={18} />
          <span>Nouveau Membre</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Membres</p>
              <p className="text-xl font-bold text-slate-800">{loyaltyCustomers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Star size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Points Total</p>
              <p className="text-xl font-bold text-slate-800">{totalPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">CA Membres</p>
              <p className="text-xl font-bold text-slate-800">{totalSpent.toFixed(0)} CHF</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Visites Total</p>
              <p className="text-xl font-bold text-slate-800">{totalVisits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Distribution */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-4">Répartition par Niveau</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(tierCounts).map(([tier, count]) => (
            <div key={tier} className="text-center">
              <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium mb-2 ${getTierColor(tier)}`}>
                {getTierIcon(tier)}
                <span>{tier}</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{count}</p>
              <p className="text-xs text-slate-500">membres</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un membre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tous les niveaux</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Bronze">Bronze</option>
          </select>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => {
          const nextTier = getNextTier(customer.tier);
          const currentThreshold = getTierThreshold(customer.tier);
          const nextThreshold = nextTier ? nextTier.threshold : currentThreshold;
          const progress = nextTier ? ((customer.points - currentThreshold) / (nextThreshold - currentThreshold)) * 100 : 100;

          return (
            <div
              key={customer.id}
              onClick={() => setSelectedCustomer(customer.id)}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800">{customer.name}</h3>
                  <p className="text-xs text-slate-500">Membre depuis {new Date(customer.joinDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</p>
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getTierColor(customer.tier)}`}>
                  {getTierIcon(customer.tier)}
                  <span>{customer.tier}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className="text-lg font-bold text-amber-600">{customer.points.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Points</p>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className="text-lg font-bold text-emerald-600">{customer.totalSpent.toFixed(0)}</p>
                  <p className="text-xs text-slate-500">CHF dépensés</p>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-600">{customer.visits}</p>
                  <p className="text-xs text-slate-500">Visites</p>
                </div>
              </div>

              {/* Progress to next tier */}
              {nextTier && (
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Prochain niveau: {nextTier.name}</span>
                    <span>{customer.points}/{nextThreshold}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {!nextTier && (
                <div className="text-center py-2">
                  <span className="text-xs font-medium text-slate-500">✨ Niveau maximum atteint</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Award size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Aucun membre trouvé</p>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCust && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedCust.name}</h2>
                  <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${getTierColor(selectedCust.tier)}`}>
                    {getTierIcon(selectedCust.tier)}
                    <span>{selectedCust.tier}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Mail size={14} />
                  <span className="text-xs">Email</span>
                </div>
                <p className="text-sm font-medium text-slate-800">{selectedCust.email}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Phone size={14} />
                  <span className="text-xs">Téléphone</span>
                </div>
                <p className="text-sm font-medium text-slate-800">{selectedCust.phone}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Calendar size={14} />
                  <span className="text-xs">Dernière visite</span>
                </div>
                <p className="text-sm font-medium text-slate-800">{new Date(selectedCust.lastVisit).toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Star size={14} />
                  <span className="text-xs">Points</span>
                </div>
                <p className="text-sm font-medium text-amber-600">{selectedCust.points.toLocaleString()} pts</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 mb-4">
              <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                <Gift size={16} className="text-emerald-600" />
                Récompenses disponibles
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">☕ Café offert</span>
                  <span className="text-amber-600 font-medium">500 pts</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">🥐 Croissant offert</span>
                  <span className="text-amber-600 font-medium">300 pts</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">🎁 -10% sur la commande</span>
                  <span className="text-amber-600 font-medium">1000 pts</span>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedCustomer(null)} className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
