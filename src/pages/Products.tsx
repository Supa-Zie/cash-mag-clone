import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { products, categories } from '../data/mockData';
import { Search, Plus, Edit2, Trash2, Package, X } from 'lucide-react';

export default function Products() {
  const { t, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

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

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const name = getProductNames(p);
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

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
              {t('products')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B635B] dark:text-[#A89F95] mt-1">
            {filteredProducts.length} {t('products').toLowerCase()} répertoriés
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-full font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>{t('addProduct')}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9388]" />
          <input
            type="text"
            placeholder={t('searchProducts')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] placeholder-[#9C9388] outline-none focus:border-[#A87B43] focus:ring-2 focus:ring-[#A87B43]/15 transition-all shadow-2xs"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43] shadow-2xs cursor-pointer"
        >
          <option value="all">{t('all')}</option>
          {categories.filter(c => c.id !== 'all').map(cat => (
            <option key={cat.id} value={cat.id}>{getCategoryName(cat.id)}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="warm-card bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F3] dark:bg-[#25201A] border-b border-[#EFECE6] dark:border-[#342D26] text-[#9C9388] font-bold">
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">{t('productName')}</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">{t('category')}</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">{t('price')}</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">{t('barcode')}</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">{t('stock')}</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider">{t('status')}</th>
                <th className="px-4 py-3.5 uppercase text-[11px] tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] dark:divide-[#2C2620]">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#FAF8F3]/70 dark:hover:bg-[#28221B]/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#F8F6F0] dark:bg-[#2A241E] rounded-xl flex items-center justify-center flex-shrink-0 text-[#A87B43] border border-[#EFECE6]/60 dark:border-[#342D26]">
                        <Package size={16} />
                      </div>
                      <span className="font-bold text-[#1A1816] dark:text-[#F8F6F0]">{getProductNames(product)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-semibold text-[#A87B43] bg-[#F5EBE1] dark:bg-[#33271D] px-2.5 py-1 rounded-full inline-block">
                      {getCategoryName(product.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-[#A87B43] whitespace-nowrap">
                    {product.price.toFixed(2)} <span className="text-xs text-[#9C9388]">CHF</span>
                  </td>
                  <td className="px-4 py-3.5 text-[#6B635B] dark:text-[#A89F95] font-mono text-[11px]">
                    {product.barcode || '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`font-bold ${product.stock <= product.reorderPoint ? 'text-[#B45309]' : 'text-[#1A1816] dark:text-[#F8F6F0]'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {product.status === 'active' ? (
                      <span className="status-badge-completed">
                        {t('active')}
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F0EAE1] dark:bg-[#2C2620] text-[#9C9388]">
                        {t('archived')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="p-1.5 text-[#9C9388] hover:text-[#A87B43] hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620] rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 text-[#9C9388] hover:text-[#DC2626] hover:bg-[#FEECEC] dark:hover:bg-[#381B1B] rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in">
          <div className="bg-white dark:bg-[#221E1A] rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-[#EFECE6] dark:border-[#342D26] relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1A1816] dark:text-[#F8F6F0]">{t('addProduct')}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#9C9388] hover:text-[#1A1816] dark:hover:text-[#F8F6F0] p-1.5 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#6B635B] dark:text-[#A89F95] mb-1.5 block">{t('productName')}</label>
                <input type="text" className="w-full px-3.5 py-2.5 bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#6B635B] dark:text-[#A89F95] mb-1.5 block">{t('price')} (CHF)</label>
                  <input type="number" step="0.01" className="w-full px-3.5 py-2.5 bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#6B635B] dark:text-[#A89F95] mb-1.5 block">{t('category')}</label>
                  <select className="w-full px-3.5 py-2.5 bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43]">
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{getCategoryName(cat.id)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#6B635B] dark:text-[#A89F95] mb-1.5 block">{t('barcode')}</label>
                  <input type="text" className="w-full px-3.5 py-2.5 bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#6B635B] dark:text-[#A89F95] mb-1.5 block">{t('stock')}</label>
                  <input type="number" className="w-full px-3.5 py-2.5 bg-[#FAF8F3] dark:bg-[#28221B] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs sm:text-sm text-[#1A1816] dark:text-[#F8F6F0] outline-none focus:border-[#A87B43]" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-xs font-semibold text-[#6B635B] dark:text-[#A89F95] hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620] transition-colors">
                  {t('cancel')}
                </button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-[#A87B43] hover:bg-[#906B33] text-white rounded-xl text-xs font-bold transition-colors shadow-xs">
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
