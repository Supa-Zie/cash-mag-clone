import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { products, categories, CartItem } from '../data/mockData';
import { Search, Plus, Minus, Trash2, ShoppingBag, CreditCard, Banknote, X, Check } from 'lucide-react';

export default function PointOfSale() {
  const { t, language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'split'>('cash');
  const [paymentComplete, setPaymentComplete] = useState(false);

  const getProductNames = (product: typeof products[0]) => {
    if (language === 'en') return product.nameEn;
    if (language === 'de') return product.nameDe;
    return product.name;
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const name = getProductNames(p);
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery);
    return matchesCategory && matchesSearch && p.status === 'active';
  });

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const taxRate = 0.18;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const getCategoryName = (cat: typeof categories[0]) => {
    if (language === 'en') return cat.nameEn;
    if (language === 'de') return cat.nameDe;
    return cat.name;
  };

  const handlePayment = () => {
    setPaymentComplete(true);
    setTimeout(() => {
      setPaymentComplete(false);
      setShowPayment(false);
      setCart([]);
    }, 2000);
  };

  return (
    <div className="flex h-full">
      {/* Products Grid */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* Search & Categories */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchProducts')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
                style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
              >
                {getCategoryName(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 content-start">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white rounded-xl p-3 border border-slate-100 hover:border-emerald-300 hover:shadow-md transition-all text-left group"
            >
              <div className="w-full h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg mb-2 flex items-center justify-center">
                <ShoppingBag size={24} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
              </div>
              <p className="text-sm font-medium text-slate-700 truncate">{getProductNames(product)}</p>
              <p className="text-lg font-bold text-emerald-600 mt-1">{product.price.toFixed(2)} CHF</p>
              {product.stock <= product.reorderPoint && product.stock > 0 && (
                <p className="text-xs text-amber-600 mt-1">⚠ {t('lowStock')}</p>
              )}
              {product.stock === 0 && (
                <p className="text-xs text-red-600 mt-1">{t('outOfStock')}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-emerald-600" />
            <h2 className="font-semibold text-slate-800">{t('cart')}</h2>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-700 font-medium">
              {t('clear')}
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <ShoppingBag size={48} className="mb-3 opacity-30" />
              <p className="text-sm">{t('emptyCart')}</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{getProductNames(item.product)}</p>
                  <p className="text-xs text-slate-500">{item.product.price.toFixed(2)} CHF × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{(item.product.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="border-t border-slate-100 p-4 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{t('subtotal')}</span>
                <span>{subtotal.toFixed(2)} CHF</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>{t('tax')} (18%)</span>
                <span>{tax.toFixed(2)} CHF</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-100">
                <span>{t('total')}</span>
                <span className="text-emerald-600">{total.toFixed(2)} CHF</span>
              </div>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
              {t('pay')} — {total.toFixed(2)} CHF
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            {paymentComplete ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">✓ Paiement réussi!</h3>
                <p className="text-slate-500 mt-2">{total.toFixed(2)} CHF</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800">{t('pay')}</h3>
                  <button onClick={() => setShowPayment(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-emerald-600">{total.toFixed(2)} CHF</p>
                  <p className="text-sm text-slate-500 mt-1">{cart.reduce((sum, item) => sum + item.quantity, 0)} articles</p>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Banknote size={24} className={paymentMethod === 'cash' ? 'text-emerald-600' : 'text-slate-400'} />
                    <span className="text-sm font-medium">{t('cash')}</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard size={24} className={paymentMethod === 'card' ? 'text-emerald-600' : 'text-slate-400'} />
                    <span className="text-sm font-medium">{t('card')}</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('split')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'split' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-6 h-6 flex">
                      <Banknote size={16} className={paymentMethod === 'split' ? 'text-emerald-600' : 'text-slate-400'} />
                      <CreditCard size={16} className={`${paymentMethod === 'split' ? 'text-emerald-600' : 'text-slate-400'} -ml-2`} />
                    </div>
                    <span className="text-sm font-medium">{t('splitPayment')}</span>
                  </button>
                </div>
                <button
                  onClick={handlePayment}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  {t('confirm')} — {total.toFixed(2)} CHF
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
