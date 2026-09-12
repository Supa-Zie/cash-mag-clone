import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Phone, Mail, MapPin, Plus, Edit2, Trash2, Truck, Package, AlertTriangle, Clock, X, Search, Star, TrendingUp } from 'lucide-react';

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

  const [orders] = useState<Order[]>([
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
      case 'pending': return 'bg-[#FEF3E7] text-[#B45309] dark:bg-[#3D2616] dark:text-[#F59E0B]';
      case 'confirmed': return 'bg-[#FAF4ED] text-[#A87B43] dark:bg-[#2D241C] dark:text-[#C59E58]';
      case 'shipped': return 'bg-[#FEF3E7] text-[#B45309] dark:bg-[#3D2616] dark:text-[#F59E0B]';
      case 'delivered': return 'bg-[#EAF2FD] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]';
      case 'cancelled': return 'bg-[#FEECEC] text-[#DC2626] dark:bg-[#381B1B] dark:text-[#F87171]';
      default: return 'bg-[#F0EAE1] text-[#6B635B] dark:bg-[#2D241C] dark:text-[#A89F95]';
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto bg-[#F8F6F0] dark:bg-[#181512] min-h-screen text-[#1A1816] dark:text-[#F8F6F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1816] dark:text-[#F8F6F0]">Fournisseurs & Commandes</h1>
          <p className="text-[#6B635B] dark:text-[#A89F95] text-sm mt-0.5">Gérez vos fournisseurs et suivez vos commandes</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingSupplier(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-full text-sm font-bold shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Nouveau fournisseur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] rounded-xl flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">{suppliers.filter(s => s.status === 'active').length}</p>
              <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Fournisseurs actifs</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FEF3E7] dark:bg-[#3D2616] text-[#B45309] rounded-xl flex items-center justify-center">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">{pendingOrders}</p>
              <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Commandes en cours</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">{lowStockAlerts}</p>
              <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Délais courts (≤2j)</p>
            </div>
          </div>
        </div>

        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4 sm:p-5 border border-[#EFECE6] dark:border-[#342D26] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EAF2FD] dark:bg-[#1E293B] text-[#2563EB] rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">{totalSpent.toFixed(0)} CHF</p>
              <p className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">Total dépensé</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full p-1.5 w-fit shadow-xs">
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'suppliers' 
              ? 'bg-[#A87B43] text-white shadow-xs' 
              : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816] dark:hover:text-white'
          }`}
        >
          <Building2 size={14} /> Fournisseurs
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'orders' 
              ? 'bg-[#A87B43] text-white shadow-xs' 
              : 'text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816] dark:hover:text-white'
          }`}
        >
          <Package size={14} /> Commandes ({pendingOrders})
        </button>
      </div>

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9C9388]" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher un fournisseur..."
              className="w-full pl-11 pr-4 py-2 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] placeholder-[#9C9388] focus:border-[#A87B43] focus:ring-2 focus:ring-[#A87B43]/20 outline-none shadow-xs"
            />
          </div>

          {/* Supplier Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] p-5 shadow-xs hover:border-[#A87B43]/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] border border-[#EFECE6] dark:border-[#342D26] rounded-xl flex items-center justify-center">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#1A1816] dark:text-[#F8F6F0]">{supplier.name}</h3>
                      <span className="text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">{supplier.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleEditSupplier(supplier)} 
                      className="p-1.5 text-[#6B635B] hover:text-[#1A1816] hover:bg-[#FAF4ED] dark:hover:bg-[#2D241C] rounded-lg transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button 
                      onClick={() => handleDeleteSupplier(supplier.id)} 
                      className="p-1.5 text-[#6B635B] hover:text-[#DC2626] hover:bg-[#FEECEC] dark:hover:bg-[#381B1B] rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95]">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-[#A87B43]" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-[#A87B43]" />
                    <span>{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#A87B43]" />
                    <span className="truncate">{supplier.address}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#EFECE6] dark:border-[#342D26]">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={13} 
                        className={i < Math.floor(supplier.rating) ? 'text-[#A87B43] fill-[#A87B43]' : 'text-[#EFECE6] dark:text-[#342D26]'} 
                      />
                    ))}
                    <span className="text-xs font-semibold text-[#1A1816] dark:text-[#F8F6F0] ml-1">{supplier.rating}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#6B635B] dark:text-[#A89F95] font-medium">
                    <span className="flex items-center gap-1"><Clock size={11} /> {supplier.leadTime}j</span>
                    <span>{supplier.totalOrders} cmd.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAF8F3] dark:bg-[#25201A] border-b border-[#EFECE6] dark:border-[#342D26]">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Réf.</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Fournisseur</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Articles</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Total</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Statut</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#9C9388]">Livraison prévue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6] dark:divide-[#342D26]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F3]/70 dark:hover:bg-[#28221B]/40 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-bold text-[#1A1816] dark:text-[#F8F6F0]">{order.id}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-[#1A1816] dark:text-[#F8F6F0]">{order.supplierName}</td>
                    <td className="px-5 py-3.5 text-xs text-[#6B635B] dark:text-[#A89F95]">{order.date}</td>
                    <td className="px-5 py-3.5 text-xs text-[#6B635B] dark:text-[#A89F95]">{order.items.length} articles</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-[#A87B43]">{order.total.toFixed(2)} CHF</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#6B635B] dark:text-[#A89F95]">{order.expectedDelivery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Supplier Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-[#221E1A] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#EFECE6] dark:border-[#342D26] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[#EFECE6] dark:border-[#342D26] flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1A1816] dark:text-[#F8F6F0]">
                {editingSupplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#FAF4ED] dark:hover:bg-[#2D241C] text-[#6B635B] rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Nom de l'entreprise</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] placeholder-[#9C9388] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                  placeholder="Ex: Coca-Cola Suisse SA"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Personne de contact</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Adresse</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Délai de livraison (jours)</label>
                  <input
                    type="number"
                    value={formData.leadTime}
                    onChange={e => setFormData({ ...formData, leadTime: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5">Commande min. (CHF)</label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={e => setFormData({ ...formData, minOrder: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
                  />
                </div>
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
                onClick={handleSaveSupplier}
                className="px-5 py-2.5 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-full text-xs sm:text-sm font-bold shadow-xs transition-colors"
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
