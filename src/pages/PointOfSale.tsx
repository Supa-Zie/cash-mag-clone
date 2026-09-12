import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { products, categories, CartItem } from '../data/mockData';
import { Search, Plus, Minus, Trash2, ShoppingBag, CreditCard, Banknote, X, Check, Printer } from 'lucide-react';
import { printReceipt } from '../utils/receipt';

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
    <div className="flex h-full bg-[#F8F6F0] dark:bg-[#181512] text-[#1A1816] dark:text-[#F8F6F0]">
      {/* Products Grid Section */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
        {/* Search & Category Filter */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C9388]" />
            <input
              type="text"
              placeholder={t('searchProducts')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#221E1A] border border-[#EFECE6] dark:border-[#342D26] rounded-full text-sm text-[#1A1816] dark:text-[#F8F6F0] placeholder-[#9C9388] outline-none focus:border-[#A87B43] focus:ring-2 focus:ring-[#A87B43]/15 transition-all shadow-2xs"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#A87B43] text-white shadow-xs'
                      : 'bg-white dark:bg-[#221E1A] text-[#6B635B] dark:text-[#A89F95] hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620] hover:text-[#1A1816] dark:hover:text-[#F8F6F0] border border-[#EFECE6] dark:border-[#342D26]'
                  }`}
                >
                  {getCategoryName(cat)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 content-start pr-1">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white dark:bg-[#221E1A] rounded-2xl p-3.5 border border-[#EFECE6] dark:border-[#342D26] hover:border-[#A87B43] hover:shadow-md transition-all text-left group flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-20 bg-[#F8F6F0] dark:bg-[#2A241E] rounded-xl mb-2.5 flex items-center justify-center border border-[#EFECE6]/60 dark:border-[#342D26]">
                  <ShoppingBag size={24} className="text-[#A87B43] group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#1A1816] dark:text-[#F8F6F0] line-clamp-1">{getProductNames(product)}</p>
                <p className="text-sm sm:text-base font-extrabold text-[#A87B43] mt-1">{product.price.toFixed(2)} <span className="text-xs font-semibold text-[#9C9388]">CHF</span></p>
              </div>
              
              <div className="mt-2">
                {product.stock <= product.reorderPoint && product.stock > 0 && (
                  <span className="text-[10px] font-bold text-[#B45309] bg-[#FEF3E7] dark:bg-[#3D2616] dark:text-[#F59E0B] px-2 py-0.5 rounded-full inline-block">
                    ⚠ {t('lowStock')} ({product.stock})
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEECEC] dark:bg-[#381B1B] dark:text-[#F87171] px-2 py-0.5 rounded-full inline-block">
                    {t('outOfStock')}
                  </span>
                )}
                {product.stock > product.reorderPoint && (
                  <span className="text-[10px] font-medium text-[#9C9388]">
                    Stock: {product.stock}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-80 sm:w-96 bg-white dark:bg-[#221E1A] border-l border-[#EFECE6] dark:border-[#342D26] flex flex-col shadow-xs">
        {/* Cart Header */}
        <div className="p-4 border-b border-[#EFECE6] dark:border-[#342D26] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-[#A87B43]" />
            <h2 className="font-bold text-sm sm:text-base text-[#1A1816] dark:text-[#F8F6F0]">{t('cart')}</h2>
            <span className="bg-[#F0EAE1] dark:bg-[#2C2620] text-[#A87B43] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-xs text-[#9C9388] hover:text-[#DC2626] font-medium transition-colors">
              {t('clear')}
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#9C9388]">
              <div className="w-16 h-16 rounded-full bg-[#F8F6F0] dark:bg-[#2A241E] flex items-center justify-center mb-3 text-[#A87B43]/50">
                <ShoppingBag size={28} />
              </div>
              <p className="text-sm font-medium">{t('emptyCart')}</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 bg-[#FAF8F3] dark:bg-[#26201A] border border-[#EFECE6] dark:border-[#342D26] rounded-xl p-3 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-[#1A1816] dark:text-[#F8F6F0] truncate">{getProductNames(item.product)}</p>
                  <p className="text-xs text-[#9C9388] mt-0.5">{item.product.price.toFixed(2)} CHF × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-1 bg-white dark:bg-[#201B17] border border-[#EFECE6] dark:border-[#342D26] rounded-lg p-0.5">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620] text-[#1A1816] dark:text-[#F8F6F0] transition-colors"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-7 text-center text-xs font-bold text-[#1A1816] dark:text-[#F8F6F0]">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#F0EAE1] dark:hover:bg-[#2C2620] text-[#1A1816] dark:text-[#F8F6F0] transition-colors"
                  >
                    <Plus size={11} />
                  </button>
                </div>
                <div className="text-right flex items-center gap-2">
                  <p className="text-xs sm:text-sm font-bold text-[#1A1816] dark:text-[#F8F6F0]">{(item.product.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-[#9C9388] hover:text-[#DC2626] transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[#EFECE6] dark:border-[#342D26] p-4 space-y-3 bg-[#FAF8F3]/60 dark:bg-[#201B17]/60">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B635B] dark:text-[#A89F95]">
                <span>{t('subtotal')}</span>
                <span className="font-semibold">{subtotal.toFixed(2)} CHF</span>
              </div>
              <div className="flex justify-between text-[#6B635B] dark:text-[#A89F95]">
                <span>{t('tax')} (18%)</span>
                <span className="font-semibold">{tax.toFixed(2)} CHF</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#1A1816] dark:text-[#F8F6F0] pt-2 border-t border-[#EFECE6] dark:border-[#342D26]">
                <span>{t('total')}</span>
                <span className="text-[#A87B43] text-lg">{total.toFixed(2)} CHF</span>
              </div>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="w-full py-3 bg-[#A87B43] hover:bg-[#906B33] text-white font-bold rounded-xl transition-all shadow-xs active:scale-[0.99]"
            >
              {t('pay')} — {total.toFixed(2)} CHF
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in">
          <div className="bg-white dark:bg-[#221E1A] rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#EFECE6] dark:border-[#342D26] relative">
            {paymentComplete ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#EAF7ED] dark:bg-[#1A3320] text-[#1E7E34] dark:text-[#4ADE80] rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xs">
                  <Check size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-[#1A1816] dark:text-[#F8F6F0]">✓ Paiement réussi!</h3>
                <p className="text-base font-bold text-[#A87B43] mt-2">{total.toFixed(2)} CHF</p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      const receiptNo = `REC-${Date.now().toString().slice(-6)}`;
                      const transaction = {
                        id: Date.now().toString(),
                        date: new Date().toISOString().split('T')[0],
                        time: new Date().toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' }),
                        items: cart.map(item => ({
                          productId: item.product.id,
                          name: item.product.name,
                          quantity: item.quantity,
                          price: item.product.price,
                        })),
                        subtotal,
                        tax,
                        total,
                        paymentMethod,
                        cashier: 'Marie L.',
                        receiptNo,
                      };
                      printReceipt(transaction);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#F0EAE1] dark:bg-[#2C2620] hover:bg-[#EAE2D7] text-[#1A1816] dark:text-[#F8F6F0] font-semibold text-xs rounded-xl transition-colors"
                  >
                    <Printer size={16} />
                    Imprimer reçu
                  </button>
                  <button
                    onClick={() => {
                      setPaymentComplete(false);
                      setShowPayment(false);
                      setCart([]);
                    }}
                    className="flex-1 py-3 bg-[#A87B43] hover:bg-[#906B33] text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                  >
                    Nouvelle vente
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-[#1A1816] dark:text-[#F8F6F0]">{t('pay')}</h3>
                  <button onClick={() => setShowPayment(false)} className="text-[#9C9388] hover:text-[#1A1816] dark:hover:text-[#F8F6F0] p-1 rounded-lg">
                    <X size={18} />
                  </button>
                </div>
                <div className="text-center mb-6">
                  <p className="text-3xl font-extrabold text-[#A87B43]">{total.toFixed(2)} CHF</p>
                  <p className="text-xs text-[#9C9388] mt-1">{cart.reduce((sum, item) => sum + item.quantity, 0)} articles</p>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'cash' 
                        ? 'border-[#A87B43] bg-[#F5EBE1] dark:bg-[#33271D] text-[#A87B43]' 
                        : 'border-[#EFECE6] dark:border-[#342D26] text-[#6B635B] dark:text-[#A89F95] hover:border-[#A87B43]/50'
                    }`}
                  >
                    <Banknote size={24} className={paymentMethod === 'cash' ? 'text-[#A87B43]' : 'text-[#9C9388]'} />
                    <span className="text-xs font-bold">{t('cash')}</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-[#A87B43] bg-[#F5EBE1] dark:bg-[#33271D] text-[#A87B43]' 
                        : 'border-[#EFECE6] dark:border-[#342D26] text-[#6B635B] dark:text-[#A89F95] hover:border-[#A87B43]/50'
                    }`}
                  >
                    <CreditCard size={24} className={paymentMethod === 'card' ? 'text-[#A87B43]' : 'text-[#9C9388]'} />
                    <span className="text-xs font-bold">{t('card')}</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('split')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'split' 
                        ? 'border-[#A87B43] bg-[#F5EBE1] dark:bg-[#33271D] text-[#A87B43]' 
                        : 'border-[#EFECE6] dark:border-[#342D26] text-[#6B635B] dark:text-[#A89F95] hover:border-[#A87B43]/50'
                    }`}
                  >
                    <div className="w-6 h-6 flex justify-center">
                      <Banknote size={16} className={paymentMethod === 'split' ? 'text-[#A87B43]' : 'text-[#9C9388]'} />
                      <CreditCard size={16} className={`${paymentMethod === 'split' ? 'text-[#A87B43]' : 'text-[#9C9388]'} -ml-1`} />
                    </div>
                    <span className="text-xs font-bold">{t('splitPayment')}</span>
                  </button>
                </div>
                <button
                  onClick={handlePayment}
                  className="w-full py-3 bg-[#A87B43] hover:bg-[#906B33] text-white font-bold rounded-xl transition-all shadow-xs"
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
