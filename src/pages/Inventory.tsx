import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { products, categories } from '../data/mockData';
import { Search, AlertTriangle, Package, TrendingDown, CheckCircle } from 'lucide-react';

export default function Inventory() {
  const { t, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  const getProductNames = (product: typeof products[0]) => {
    if (language === 'en') return product.nameEn;
    if (language === 'de') return product.nameDe;
    return product.name;
  };

  const getCategoryName = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return catId;
    if (language === 'en') return cat.nameEn;
    if (language === 'de') return cat.nameDe;
    return cat.name;
  };

  const getStockStatus = (product: typeof products[0]) => {
    if (product.stock === 0) return 'out';
    if (product.stock <= product.reorderPoint) return 'low';
    return 'ok';
  };

  const filteredProducts = products.filter(p => {
    const name = getProductNames(p);
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const status = getStockStatus(p);
    const matchesFilter = filter === 'all' || status === filter;
    return matchesSearch && matchesFilter;
  });

  const lowStockCount = products.filter(p => getStockStatus(p) === 'low').length;
  const outOfStockCount = products.filter(p => getStockStatus(p) === 'out').length;
  const inStockCount = products.filter(p => getStockStatus(p) === 'ok').length;

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{t('inventory')}</h1>
        <p className="text-slate-500 text-sm">{products.length} {t('products').toLowerCase()}</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`p-4 rounded-xl border transition-all ${filter === 'all' ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{inStockCount}</p>
              <p className="text-sm text-slate-500">{t('inStock')}</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`p-4 rounded-xl border transition-all ${filter === 'low' ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{lowStockCount}</p>
              <p className="text-sm text-slate-500">{t('lowStock')}</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setFilter('out')}
          className={`p-4 rounded-xl border transition-all ${filter === 'out' ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{outOfStockCount}</p>
              <p className="text-sm text-slate-500">{t('outOfStock')}</p>
            </div>
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={t('searchProducts')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const status = getStockStatus(product);
          const stockPercentage = product.reorderPoint > 0 ? Math.min((product.stock / (product.reorderPoint * 3)) * 100, 100) : 100;
          return (
            <div key={product.id} className={`bg-white rounded-xl p-4 border transition-all hover:shadow-md ${
              status === 'out' ? 'border-red-200' : status === 'low' ? 'border-amber-200' : 'border-slate-100'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    status === 'out' ? 'bg-red-100' : status === 'low' ? 'bg-amber-100' : 'bg-emerald-100'
                  }`}>
                    <Package size={18} className={
                      status === 'out' ? 'text-red-600' : status === 'low' ? 'text-amber-600' : 'text-emerald-600'
                    } />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{getProductNames(product)}</p>
                    <p className="text-xs text-slate-500">{getCategoryName(product.category)}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  status === 'out' ? 'bg-red-100 text-red-700' : status === 'low' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {status === 'out' ? t('outOfStock') : status === 'low' ? t('lowStock') : t('inStock')}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t('currentStock')}</span>
                  <span className="font-semibold text-slate-800">{product.stock}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t('reorderPoint')}</span>
                  <span className="text-slate-600">{product.reorderPoint}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      status === 'out' ? 'bg-red-500' : status === 'low' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${stockPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
