import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Phone, Mail, MapPin, Plus, Edit2, Trash2, Truck, Package, AlertTriangle, CheckCircle, Clock, X, Search, Star, TrendingUp } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  products: string[];
  leadTime: number; // days
  rating: number;
  totalOrders: number;
  lastOrder: string;
  status: 'active' | 'inactive';
  minOrder?: number;
}

interface Order {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  expectedDelivery: string;
}

export default function Suppliers() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'suppliers' | 'orders'>('suppliers');
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Coca-Cola Suisse SA',
      contact: 'Jean-Pierre Müller',
      email: 'commandes@coca-ch.ch',
      phone: '+41 22 717 41 11',
      address: 'Route de l\'Aéroport 10, 1215 Genève',
      category: 'Boissons',
      products: ['Coca-Cola 33cl', 'Coca-Cola Zero', 'Fanta Orange', 'Sprite'],
      leadTime: 3,
      rating: 4.8,
      totalOrders: 156,
      lastOrder: '2026-01-13',
      status: 'active',
      minOrder: 200,
    },
    {
      id: '2',
      name: 'Barilla France',
      contact: 'Marie Laurent',
      email: 'b2b@barilla.fr',
      phone: '+33 1 49 87 20 00',
      address: '12 Rue de la Paix, 75002 Paris',
      category: 'Alimentation',
      products: ['Pasta Barilla 500g', 'Sauce Bolognaise', 'Penne Rigate'],
      leadTime: 5,
      rating: 4.5,
      totalOrders: 89,
      lastOrder: '2026-01-10',
      status: 'active',
      minOrder: 150,
    },
    {
      id: '3',
      name: 'Boulangerie Artisanale Duval',
      contact: 'François Duval',
      email: 'contact@boulangerie-duval.ch',
      phone: '+41 22 340 12 34',
      address: 'Rue du Marché 5, 1204 Genève',
      category: 'Boulangerie',
      products: ['Croissant', 'Pain au Chocolat', 'Baguette Tradition', 'Pain complet'],
      leadTime: 1,
      rating: 4.9,
      totalOrders: 312,
      lastOrder: '2026-01-15',
      status: 'active',
    },
    {
      id: '4',
      name: 'PepsiCo International',
      contact: 'Anna Schmidt',
      email: 'orders@pepsico-intl.com',
      phone: '+41 44 268 21 11',
      address: 'Birchstrasse 160, 8050 Zürich',
      category: 'Boissons',
      products: ['Lays Chips', 'Doritos', 'Cheetos'],
      leadTime: 4,
      rating: 4.2,
      totalOrders: 67,
      lastOrder: '2026-01-08',
      status: 'active',
      minOrder: 300,
    },
    {
      id: '5',
      name: 'Nestlé Hygiène SA',
      contact: 'Pierre Rochat',
      email: 'pro@nestle-hygiene.ch',
      phone: '+41 21 524 21 11',
      address: 'Av. Nestlé 1, 1800 Vevey',
      category: 'Hygiène',
      products: ['Savon Liquide', 'Dentifrice', 'Shampooing', 'Gel Douche'],
      leadTime: 3,
      rating: 4.6,
      totalOrders: 45,
      lastOrder: '2026-01-05',
      status: 'active',
      minOrder: 100,
    },
    {
      id: '6',
      name: 'Philip Morris Suisse',
      contact: 'Thomas Weber',
      email: 'b2b@pm-suisse.ch',
      phone: '+41 21 320 51 11',
      address: 'Quai Jeanrenaud 3, 2000 Neuchâtel',
      category: 'Tabac',
      products: ['Marlboro Rouge', 'Marlboro Gold', 'Camel Blue', 'IQOS'],
      leadTime: 2,
      rating: 4.4,
      totalOrders: 234,
      lastOrder: '2026-01-14',
      status: 'active',
      minOrder: 500,
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      supplierId: '3',
      supplierName: 'Boulangerie Artisanale Duval',
      date: '2026-01-15',
      items: [
        { name: 'Croissant', quantity: 48, price: 0.80 },
        { name: 'Pain au Chocolat', quantity: 36, price: 1.00 },
        { name: 'Baguette Tradition', quantity: 60, price: 0.60 },
      ],
      total: 111.60,
      status: 'delivered',
      expectedDelivery: '2026-01-16',
    },
    {
      id: 'ORD-002',
      supplierId: '1',
      supplierName: 'Coca-Cola Suisse SA',
      date: '2026-01-13',
      items: [
        { name: 'Coca-Cola 33cl', quantity: 96, price: 1.20 },
        { name: 'Coca-Cola Zero', quantity: 48, price: 1.20 },
        { name: 'Fanta Orange', quantity: 24, price: 1.30 },
      ],
      total: 202.40,
      status: 'shipped',
      expectedDelivery: '2026-01-16',
    },
    {
      id: 'ORD-003',
      supplierId: '2',
      supplierName: 'Barilla France',
      date: '2026-01-10',
      items: [
        { name: 'Pasta Barilla 500g', quantity: 48, price: 1.10 },
        { name: 'Sauce Bolognaise', quantity: 24, price: 2.50 },
      ],
      total: 112.80,
      status: 'confirmed',
      expectedDelivery: '2026-01-15',
    },
    {
      id: 'ORD-004',
      supplierId: '5',
      supplierName: 'Nestlé Hygiène SA',
      date: '2026-01-05',
      items: [
        { name: 'Savon Liquide', quantity: 24, price: 2.10 },
        { name: 'Dentifrice', quantity: 36, price: 1.80 },
      ],
      total: 115.20,
      status: 'delivered',
      expectedDelivery: '2026-01-08',
    },
    {
      id: 'ORD-005',
      supplierId: '4',
      supplierName: 'PepsiCo International',
      date: '2026-01-14',
      items: [
        { name: 'Lays Chips', quantity: 60, price: 1.10 },
        { name: 'Doritos', quantity: 30, price: 1.50 },
      ],
      total: 111.00,
      status: 'pending',
      expectedDelivery: '2026-01-18',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    leadTime: 3,
    minOrder: 0,
  });

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockAlerts = suppliers.filter(s => s.leadTime <= 2).length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const totalSpent = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const handleSaveSupplier = () => {
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? {
        ...s,
        name: formData.name,
        contact: formData.contact,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        category: formData.category,
        leadTime: formData.leadTime,
        minOrder: formData.minOrder || undefined,
      } : s));
    } else {
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        name: formData.name,
        contact: formData.contact,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        category: formData.category,
        products: [],
        leadTime: formData.leadTime,
        rating: 0,
        totalOrders: 0,
        lastOrder: '-',
        status: 'active',
        minOrder: formData.minOrder || undefined,
      };
      setSuppliers([newSupplier, ...suppliers]);
    }
    setShowModal(false);
    setEditingSupplier(null);
    resetForm();
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      category: supplier.category,
      leadTime: supplier.leadTime,
      minOrder: supplier.minOrder || 0,
    });
    setShowModal(true);
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      category: '',
      leadTime: 3,
      minOrder: 0,
    });
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fournisseurs & Commandes</h1>
          <p className="text-slate-500 text-sm">Gérez vos fournisseurs et suivez vos commandes</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingSupplier(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <Plus size={16} />
          Nouveau fournisseur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{suppliers.filter(s => s.status === 'active').length}</p>
              <p className="text-xs text-slate-500">Fournisseurs actifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Truck size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{pendingOrders}</p>
              <p className="text-xs text-slate-500">Commandes en cours</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{lowStockAlerts}</p>
              <p className="text-xs text-slate-500">Délais courts (≤2j)</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalSpent.toFixed(0)} CHF</p>
              <p className="text-xs text-slate-500">Total dépensé</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
            activeTab === 'suppliers' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center gap-2"><Building2 size={14} /> Fournisseurs</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
            activeTab === 'orders' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center gap-2"><Package size={14} /> Commandes ({pendingOrders})</span>
        </button>
      </div>

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <>
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher un fournisseur..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Supplier Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                      <Building2 size={20} className="text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{supplier.name}</h3>
                      <span className="text-xs text-slate-500">{supplier.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEditSupplier(supplier)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                      <Edit2 size={14} className="text-slate-400" />
                    </button>
                    <button onClick={() => handleDeleteSupplier(supplier.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={12} className="text-slate-400" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail size={12} className="text-slate-400" />
                    <span>{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={12} className="text-slate-400" />
                    <span className="truncate">{supplier.address}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < Math.floor(supplier.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                    ))}
                    <span className="text-xs text-slate-500 ml-1">{supplier.rating}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={10} /> {supplier.leadTime}j</span>
                    <span>{supplier.totalOrders} cmd.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Réf.</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Fournisseur</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Articles</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Total</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Livraison prévue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{order.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{order.supplierName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{order.date}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{order.items.length} articles</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{order.total.toFixed(2)} CHF</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{order.expectedDelivery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Supplier Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {editingSupplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'entreprise</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Ex: Coca-Cola Suisse SA"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Personne de contact</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Boissons">Boissons</option>
                    <option value="Alimentation">Alimentation</option>
                    <option value="Boulangerie">Boulangerie</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Hygiène">Hygiène</option>
                    <option value="Tabac">Tabac</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Délai de livraison (jours)</label>
                  <input
                    type="number"
                    value={formData.leadTime}
                    onChange={e => setFormData({ ...formData, leadTime: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Commande min. (CHF)</label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={e => setFormData({ ...formData, minOrder: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
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
                onClick={handleSaveSupplier}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                {editingSupplier ? 'Mettre à jour' : 'Ajouter le fournisseur'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
