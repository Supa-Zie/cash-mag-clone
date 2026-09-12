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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-full bg-[#F8F6F0] dark:bg-[#181512] text-[#1A1816] dark:text-[#F8F6F0]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl font-black text-[#A87B43] dark:text-[#E3B36C] tracking-tight">
            CashMag
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-[#1A1816] dark:text-[#F8F6F0]">
            {t('inventory')}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95] mt-1">
          Suivi des stocks et alertes de réapprovisionnement ({products.length} articles)
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`warm-card p-4.5 rounded-2xl border text-left transition-all ${
            filter === 'all' 
              ? 'border-[#A87B43] bg-[#F5EBE1]/70 dark:bg-[#33271D]' 
              : 'border-[#EFECE6] dark:border-[#342D26] bg-white dark:bg-[#221E1A] hover:border-[#A87B43]/50'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-[#EAF7ED] dark:bg-[#1A3320] text-[#1E7E34] dark:text-[#4ADE80] rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle size={22} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{inStockCount}</p>
              <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">{t('inStock')}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('low')}
          className={`warm-card p-4.5 rounded-2xl border text-left transition-all ${
            filter === 'low' 
              ? 'border-[#B45309] bg-[#FEF3E7] dark:bg-[#3D2616]' 
              : 'border-[#EFECE6] dark:border-[#342D26] bg-white dark:bg-[#221E1A] hover:border-[#B45309]/50'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-[#FEF3E7] dark:bg-[#3D2616] text-[#B45309] dark:text-[#F59E0B] rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{lowStockCount}</p>
              <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">{t('lowStock')}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('out')}
          className={`warm-card p-4.5 rounded-2xl border text-left transition-all ${
            filter === 'out' 
              ? 'border-[#DC2626] bg-[#FEECEC] dark:bg-[#381B1B]' 
              : 'border-[#EFECE6] dark:border-[#342D26] bg-white dark:bg-[#221E1A] hover:border-[#DC2626]/50'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-[#FEECEC] dark:bg-[#381B1B] text-[#DC2626] dark:text-[#F87171] rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingDown size={22} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">{outOfStockCount}</p>
              <p className="text-xs font-semibold text-[#6B635B] dark:text-[#A89F95]">{t('outOfStock')}</p>
            </div>
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9388]" />
        <input
          type="text"
          placeholder={t('searchProducts')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] placeholder-[#9C9388] outline-none focus:border-[#A87B43] focus:ring-2 focus:ring-[#A87B43]/15 transition-all shadow-2xs"
        />
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const status = getStockStatus(product);
          const stockPercentage = product.reorderPoint > 0 ? Math.min((product.stock / (product.reorderPoint * 3)) * 100, 100) : 100;
          return (
            <div 
              key={product.id} 
              className={`warm-card bg-white dark:bg-[#221E1A] rounded-2xl p-4.5 border transition-all hover:shadow-md ${
                status === 'out' 
                  ? 'border-[#DC2626]/30' 
                  : status === 'low' 
                  ? 'border-[#B45309]/30' 
                  : 'border-[#EFECE6] dark:border-[#342D26]'
              }`}
            >
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    status === 'out' 
                      ? 'bg-[#FEECEC] text-[#DC2626] dark:bg-[#381B1B]' 
                      : status === 'low' 
                      ? 'bg-[#FEF3E7] text-[#B45309] dark:bg-[#3D2616]' 
                      : 'bg-[#F8F6F0] text-[#A87B43] dark:bg-[#2C2620]'
                  }`}>
                    <Package size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-[#1A1816] dark:text-[#F8F6F0] truncate">{getProductNames(product)}</p>
                    <p className="text-[11px] text-[#9C9388] truncate">{getCategoryName(product.category)}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                  status === 'out' 
                    ? 'bg-[#FEECEC] text-[#DC2626] dark:bg-[#381B1B] dark:text-[#F87171]' 
                    : status === 'low' 
                    ? 'bg-[#FEF3E7] text-[#B45309] dark:bg-[#3D2616] dark:text-[#F59E0B]' 
                    : 'bg-[#EAF7ED] text-[#1E7E34] dark:bg-[#1A3320] dark:text-[#4ADE80]'
                }`}>
                  {status === 'out' ? t('outOfStock') : status === 'low' ? t('lowStock') : t('inStock')}
                </span>
              </div>
              
              <div className="space-y-2 mt-4 pt-3 border-t border-[#EFECE6] dark:border-[#342D26]">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B635B] dark:text-[#A89F95]">{t('currentStock')}</span>
                  <span className="font-bold text-[#1A1816] dark:text-[#F8F6F0]">{product.stock} unités</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B635B] dark:text-[#A89F95]">{t('reorderPoint')}</span>
                  <span className="text-[#9C9388] font-medium">{product.reorderPoint}</span>
                </div>
                <div className="w-full h-2 bg-[#F0EAE1] dark:bg-[#2C2620] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      status === 'out' ? 'bg-[#DC2626]' : status === 'low' ? 'bg-[#B45309]' : 'bg-[#A87B43]'
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
