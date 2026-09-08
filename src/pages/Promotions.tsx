import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tag, Percent, Clock, Plus, Edit2, Trash2, Calendar, AlertCircle, CheckCircle, X, Zap } from 'lucide-react';

interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'flash' | 'code';
  value: number;
  code?: string;
  startDate: string;
  endDate: string;
  minPurchase?: number;
  maxUses?: number;
  currentUses: number;
  status: 'active' | 'scheduled' | 'expired' | 'disabled';
  categories?: string[];
  description: string;
}

export default function Promotions() {
  const { t } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'scheduled' | 'expired'>('all');

  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      name: 'Soldes d\'été -20%',
      type: 'percentage',
      value: 20,
      startDate: '2026-01-10',
      endDate: '2026-01-31',
      currentUses: 142,
      maxUses: 500,
      status: 'active',
      categories: ['drinks', 'snacks'],
      description: 'Remise de 20% sur toutes les boissons et snacks'
    },
    {
      id: '2',
      name: 'BIENVENUE10',
      type: 'code',
      value: 10,
      code: 'BIENVENUE10',
      startDate: '2026-01-01',
      endDate: '2026-03-31',
      minPurchase: 30,
      currentUses: 87,
      maxUses: 1000,
      status: 'active',
      description: '10 CHF de réduction pour les nouveaux clients (min. 30 CHF)'
    },
    {
      id: '3',
      name: 'Happy Hour Boulangerie',
      type: 'flash',
      value: 15,
      startDate: '2026-01-15',
      endDate: '2026-01-15',
      currentUses: 23,
      maxUses: 50,
      status: 'active',
      categories: ['bakery'],
      description: 'Flash sale 15% sur la boulangerie de 16h à 18h'
    },
    {
      id: '4',
      name: 'Black Friday -30%',
      type: 'percentage',
      value: 30,
      startDate: '2025-11-28',
      endDate: '2025-11-28',
      currentUses: 312,
      maxUses: 312,
      status: 'expired',
      description: 'Remise exceptionnelle Black Friday 30% sur tout le magasin'
    },
    {
      id: '5',
      name: 'Valentine -5 CHF',
      type: 'fixed',
      value: 5,
      startDate: '2026-02-10',
      endDate: '2026-02-14',
      minPurchase: 25,
      currentUses: 0,
      maxUses: 200,
      status: 'scheduled',
      description: '5 CHF de réduction pour la Saint-Valentin (min. 25 CHF)'
    },
    {
      id: '6',
      name: 'PROMO2026',
      type: 'code',
      value: 15,
      code: 'PROMO2026',
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      minPurchase: 50,
      currentUses: 45,
      maxUses: 300,
      status: 'active',
      description: '15% de réduction sur commande de 50 CHF et plus'
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'flash' | 'code',
    value: 0,
    code: '',
    startDate: '',
    endDate: '',
    minPurchase: 0,
    maxUses: 100,
    description: '',
    categories: [] as string[],
  });

  const filteredPromos = filter === 'all' ? promotions : promotions.filter(p => p.status === filter);

  const statusCounts = {
    all: promotions.length,
    active: promotions.filter(p => p.status === 'active').length,
    scheduled: promotions.filter(p => p.status === 'scheduled').length,
    expired: promotions.filter(p => p.status === 'expired').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'expired': return 'bg-slate-100 text-slate-500';
      case 'disabled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent size={16} />;
      case 'fixed': return <Tag size={16} />;
      case 'flash': return <Zap size={16} />;
      case 'code': return <span className="text-xs font-mono font-bold">#</span>;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage': return '%';
      case 'fixed': return 'CHF';
      case 'flash': return 'Flash';
      case 'code': return 'Code';
      default: return '';
    }
  };

  const handleSave = () => {
    if (editingPromo) {
      setPromotions(promotions.map(p => p.id === editingPromo.id ? {
        ...p,
        name: formData.name,
        type: formData.type,
        value: formData.value,
        code: formData.code || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        minPurchase: formData.minPurchase || undefined,
        maxUses: formData.maxUses,
        description: formData.description,
        categories: formData.categories,
      } : p));
    } else {
      const newPromo: Promotion = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        value: formData.value,
        code: formData.code || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        minPurchase: formData.minPurchase || undefined,
        maxUses: formData.maxUses,
        currentUses: 0,
        status: new Date(formData.startDate) > new Date() ? 'scheduled' : 'active',
        description: formData.description,
        categories: formData.categories,
      };
      setPromotions([newPromo, ...promotions]);
    }
    setShowModal(false);
    setEditingPromo(null);
    resetForm();
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormData({
      name: promo.name,
      type: promo.type,
      value: promo.value,
      code: promo.code || '',
      startDate: promo.startDate,
      endDate: promo.endDate,
      minPurchase: promo.minPurchase || 0,
      maxUses: promo.maxUses || 100,
      description: promo.description,
      categories: promo.categories || [],
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setPromotions(promotions.filter(p => p.id !== id));
  };

  const toggleStatus = (id: string) => {
    setPromotions(promotions.map(p => p.id === id ? {
      ...p,
      status: p.status === 'active' ? 'disabled' : 'active'
    } : p));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'percentage',
      value: 0,
      code: '',
      startDate: '',
      endDate: '',
      minPurchase: 0,
      maxUses: 100,
      description: '',
      categories: [],
    });
  };

  const toggleCategory = (catId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter(c => c !== catId)
        : [...prev.categories, catId]
    }));
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Promotions & Coupons</h1>
          <p className="text-slate-500 text-sm">Gérez vos offres, remises et codes promotionnels</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingPromo(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <Plus size={16} />
          Nouvelle promotion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{statusCounts.active}</p>
              <p className="text-xs text-slate-500">Actives</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{statusCounts.scheduled}</p>
              <p className="text-xs text-slate-500">Planifiées</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{statusCounts.expired}</p>
              <p className="text-xs text-slate-500">Expirées</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Tag size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {promotions.reduce((sum, p) => sum + p.currentUses, 0)}
              </p>
              <p className="text-xs text-slate-500">Utilisations totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 w-fit">
        {(['all', 'active', 'scheduled', 'expired'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded text-sm font-medium transition-all ${
              filter === f ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f === 'all' ? 'Toutes' : f === 'active' ? 'Actives' : f === 'scheduled' ? 'Planifiées' : 'Expirées'}
            <span className="ml-2 text-xs opacity-70">({statusCounts[f]})</span>
          </button>
        ))}
      </div>

      {/* Promotions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPromos.map((promo) => (
          <div key={promo.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  promo.type === 'flash' ? 'bg-amber-100 text-amber-600' :
                  promo.type === 'code' ? 'bg-purple-100 text-purple-600' :
                  promo.type === 'percentage' ? 'bg-emerald-100 text-emerald-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {getTypeIcon(promo.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{promo.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(promo.status)}`}>
                    {promo.status === 'active' ? 'Active' : promo.status === 'scheduled' ? 'Planifiée' : promo.status === 'expired' ? 'Expirée' : 'Désactivée'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleStatus(promo.id)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title="Activer/Désactiver">
                  <CheckCircle size={16} className="text-slate-400" />
                </button>
                <button onClick={() => handleEdit(promo)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                  <Edit2 size={16} className="text-slate-400" />
                </button>
                <button onClick={() => handleDelete(promo.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-3">{promo.description}</p>

            <div className="flex items-center gap-4 mb-3">
              <div className="bg-slate-50 px-3 py-1.5 rounded-lg">
                <span className="text-lg font-bold text-slate-800">
                  {promo.type === 'percentage' ? `-${promo.value}%` : promo.type === 'fixed' ? `-${promo.value} CHF` : promo.type === 'flash' ? `-${promo.value}%` : `${promo.value} CHF`}
                </span>
              </div>
              {promo.code && (
                <div className="bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg">
                  <span className="text-sm font-mono font-bold text-purple-700">{promo.code}</span>
                </div>
              )}
              {promo.minPurchase && (
                <span className="text-xs text-slate-500">Min. {promo.minPurchase} CHF</span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{promo.startDate} → {promo.endDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{promo.currentUses}/{promo.maxUses} utilisations</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min((promo.currentUses / (promo.maxUses || 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {editingPromo ? 'Modifier la promotion' : 'Nouvelle promotion'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom de la promotion</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Ex: Soldes d'été -20%"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {([
                    { value: 'percentage', label: 'Pourcentage' },
                    { value: 'fixed', label: 'Montant fixe' },
                    { value: 'flash', label: 'Flash' },
                    { value: 'code', label: 'Code promo' },
                  ] as const).map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                        formData.type === type.value
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Value & Code */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Valeur ({formData.type === 'percentage' ? '%' : 'CHF'})
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={e => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                {formData.type === 'code' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono"
                      placeholder="BIENVENUE10"
                    />
                  </div>
                )}
                {formData.type !== 'code' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Achat minimum (CHF)</label>
                    <input
                      type="number"
                      value={formData.minPurchase}
                      onChange={e => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date de début</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date de fin</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Max Uses */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre max. d'utilisations</label>
                <input
                  type="number"
                  value={formData.maxUses}
                  onChange={e => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Catégories concernées (optionnel)</label>
                <div className="flex flex-wrap gap-2">
                  {['drinks', 'food', 'bakery', 'snacks', 'hygiene', 'tobacco'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        formData.categories.includes(cat)
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {cat === 'drinks' ? 'Boissons' : cat === 'food' ? 'Alimentation' : cat === 'bakery' ? 'Boulangerie' : cat === 'snacks' ? 'Snacks' : cat === 'hygiene' ? 'Hygiène' : 'Tabac'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                  rows={2}
                  placeholder="Description de la promotion..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                {editingPromo ? 'Mettre à jour' : 'Créer la promotion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
