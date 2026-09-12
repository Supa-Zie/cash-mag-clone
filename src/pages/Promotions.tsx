import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tag, Percent, Clock, Plus, Edit2, Trash2, Calendar, CheckCircle, X, Zap } from 'lucide-react';

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
      case 'active': return 'bg-[#EAF2FD] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]';
      case 'scheduled': return 'bg-[#FEF3E7] text-[#B45309] dark:bg-[#3D2616] dark:text-[#F59E0B]';
      case 'expired': return 'bg-[#F0EAE1] text-[#6B635B] dark:bg-[#2D241C] dark:text-[#A89F95]';
      case 'disabled': return 'bg-[#FEECEC] text-[#DC2626] dark:bg-[#381B1B] dark:text-[#F87171]';
      default: return 'bg-[#F0EAE1] text-[#6B635B] dark:bg-[#2D241C] dark:text-[#A89F95]';
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto bg-[#F8F6F0] dark:bg-[#181512] min-h-screen text-[#1A1816] dark:text-[#F8F6F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1816] dark:text-[#F8F6F0]">Promotions & Coupons</h1>
          <p className="text-[#6B635B] dark:text-[#A89F95] text-sm mt-0.5">Gérez vos offres, remises et codes promotionnels</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingPromo(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-full text-sm font-bold shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Nouvelle promotion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] rounded-xl flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">{statusCounts.active}</p>
              <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Actives</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FEF3E7] dark:bg-[#3D2616] text-[#B45309] rounded-xl flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">{statusCounts.scheduled}</p>
              <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Planifiées</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F0EAE1] dark:bg-[#2D241C] text-[#6B635B] dark:text-[#A89F95] rounded-xl flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">{statusCounts.expired}</p>
              <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Expirées</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EAF2FD] dark:bg-[#1E293B] text-[#2563EB] rounded-xl flex items-center justify-center">
              <Tag size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">
                {promotions.reduce((sum, p) => sum + p.currentUses, 0)}
              </p>
              <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Utilisations totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full p-1.5 w-fit shadow-xs">
        {(['all', 'active', 'scheduled', 'expired'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              filter === f 
                ? 'bg-[#A87B43] text-white shadow-xs' 
                : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816] dark:hover:text-white'
            }`}
          >
            {f === 'all' ? 'Toutes' : f === 'active' ? 'Actives' : f === 'scheduled' ? 'Planifiées' : 'Expirées'}
            <span className="ml-1.5 text-xs opacity-75 font-normal">({statusCounts[f]})</span>
          </button>
        ))}
      </div>

      {/* Promotions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPromos.map((promo) => (
          <div key={promo.id} className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] p-5 shadow-xs hover:border-[#A87B43]/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] border border-[#EFECE6] dark:border-[#342D26]">
                  {getTypeIcon(promo.type)}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1A1816] dark:text-[#F8F6F0]">{promo.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-0.5 ${getStatusBadge(promo.status)}`}>
                    {promo.status === 'active' ? 'Active' : promo.status === 'scheduled' ? 'Planifiée' : promo.status === 'expired' ? 'Expirée' : 'Désactivée'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => toggleStatus(promo.id)} 
                  className="p-1.5 text-[#6B635B] hover:text-[#1A1816] hover:bg-[#FAF4ED] dark:hover:bg-[#2D241C] rounded-lg transition-colors" 
                  title="Activer/Désactiver"
                >
                  <CheckCircle size={16} />
                </button>
                <button 
                  onClick={() => handleEdit(promo)} 
                  className="p-1.5 text-[#6B635B] hover:text-[#1A1816] hover:bg-[#FAF4ED] dark:hover:bg-[#2D241C] rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(promo.id)} 
                  className="p-1.5 text-[#6B635B] hover:text-[#DC2626] hover:bg-[#FEECEC] dark:hover:bg-[#381B1B] rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95] mb-4">{promo.description}</p>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="bg-[#FAF4ED] dark:bg-[#2D241C] border border-[#E8DEC8] dark:border-[#4A3B2C] px-3 py-1 rounded-xl">
                <span className="text-base font-bold text-[#A87B43]">
                  {promo.type === 'percentage' ? `-${promo.value}%` : promo.type === 'fixed' ? `-${promo.value} CHF` : promo.type === 'flash' ? `-${promo.value}%` : `${promo.value} CHF`}
                </span>
              </div>
              {promo.code && (
                <div className="bg-[#FAF4ED] dark:bg-[#2D241C] border border-[#E8DEC8] dark:border-[#4A3B2C] px-3 py-1 rounded-xl">
                  <span className="text-xs font-mono font-bold text-[#A87B43]">{promo.code}</span>
                </div>
              )}
              {promo.minPurchase && (
                <span className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Min. {promo.minPurchase} CHF</span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-[#6B635B] dark:text-[#A89F95] font-medium pt-2 border-t border-[#EFECE6] dark:border-[#342D26]">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-[#A87B43]" />
                <span>{promo.startDate} → {promo.endDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{promo.currentUses}/{promo.maxUses} utilisations</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2.5 w-full bg-[#F0EAE1] dark:bg-[#2D241C] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#A87B43] h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min((promo.currentUses / (promo.maxUses || 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-[#221E1A] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#EFECE6] dark:border-[#342D26] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[#EFECE6] dark:border-[#342D26] flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1A1816] dark:text-[#F8F6F0]">
                {editingPromo ? 'Modifier la promotion' : 'Nouvelle promotion'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#FAF4ED] dark:hover:bg-[#2D241C] text-[#6B635B] rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Nom de la promotion</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] placeholder-[#9C9388] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                  placeholder="Ex: Soldes d'été -20%"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {([
                    { value: 'percentage', label: 'Pourcentage' },
                    { value: 'fixed', label: 'Montant fixe' },
                    { value: 'flash', label: 'Flash' },
                    { value: 'code', label: 'Code promo' },
                  ] as const).map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        formData.type === type.value
                          ? 'bg-[#A87B43] border-[#A87B43] text-white shadow-xs'
                          : 'border-[#EFECE6] dark:border-[#342D26] text-[#6B635B] dark:text-[#A89F95] hover:bg-[#FAF4ED] dark:hover:bg-[#2D241C]'
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">
                    Valeur ({formData.type === 'percentage' ? '%' : 'CHF'})
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={e => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                  />
                </div>
                {formData.type === 'code' ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] font-mono font-bold focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                      placeholder="BIENVENUE10"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Achat minimum (CHF)</label>
                    <input
                      type="number"
                      value={formData.minPurchase}
                      onChange={e => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Date de début</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Date de fin</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                  />
                </div>
              </div>

              {/* Max Uses */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Nombre max. d'utilisations</label>
                <input
                  type="number"
                  value={formData.maxUses}
                  onChange={e => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Catégories concernées (optionnel)</label>
                <div className="flex flex-wrap gap-2">
                  {['drinks', 'food', 'bakery', 'snacks', 'hygiene', 'tobacco'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        formData.categories.includes(cat)
                          ? 'bg-[#A87B43] border-[#A87B43] text-white'
                          : 'border-[#EFECE6] dark:border-[#342D26] text-[#6B635B] dark:text-[#A89F95] hover:bg-[#FAF4ED] dark:hover:bg-[#2D241C]'
                      }`}
                    >
                      {cat === 'drinks' ? 'Boissons' : cat === 'food' ? 'Alimentation' : cat === 'bakery' ? 'Boulangerie' : cat === 'snacks' ? 'Snacks' : cat === 'hygiene' ? 'Hygiène' : 'Tabac'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] placeholder-[#9C9388] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none resize-none"
                  rows={2}
                  placeholder="Description de la promotion..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-[#EFECE6] dark:border-[#342D26] flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-[#EFECE6] dark:border-[#342D26] rounded-full text-xs sm:text-sm font-semibold text-[#6B635B] dark:text-[#A89F95] hover:bg-[#FAF4ED] dark:hover:bg-[#2D241C] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-full text-xs sm:text-sm font-bold shadow-xs transition-colors"
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
