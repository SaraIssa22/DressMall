import React from 'react';
import { useCart } from '../context/CartContext';
import { formatSYP } from '../services/storeService';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  Scissors, 
  ShieldCheck 
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onExploreProducts,
}) => {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    totalItemsCount 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300 border-r border-[#E8C4C4]/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#E8C4C4]/40 flex items-center justify-between bg-[#FAF7F5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E8C4C4]/40 flex items-center justify-center text-[#9C5B5B]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#361E1C]">سلة مشترياتكِ</h2>
              <span className="text-[11px] text-[#8C6D68]">({totalItemsCount} قطعة مختارة)</span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full text-[#6C5551] hover:bg-[#E8C4C4]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F5] border border-[#E8C4C4]/60 flex items-center justify-center mx-auto text-[#C99E9E]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#361E1C]">سلتكِ خالية حالياً</h3>
              <p className="text-xs text-[#7C6360] max-w-xs mx-auto">
                استعرضي باقة فساتين الزفاف والسهرة واليومية وأضيفي ما يعجبكِ بضغطة زر
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onExploreProducts();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9C5B5B] text-white text-xs font-semibold hover:bg-[#8A4C4C] transition-colors"
              >
                <span>تصفحي الفساتين الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}-${index}`}
                className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E8C4C4]/40 flex gap-3.5 relative group"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-xl border border-[#E8C4C4]/50 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between text-right">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#361E1C] line-clamp-1">
                      {item.name}
                    </h4>

                    <div className="flex flex-wrap gap-2 text-[11px] text-[#7C6360] mt-1">
                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#E8C4C4]/40">
                        المقاس: {item.size}
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#E8C4C4]/40">
                        اللون: {item.color}
                      </span>
                    </div>

                    {item.isCustomSize && (
                      <div className="text-[10px] text-[#9C5B5B] flex items-center gap-1 mt-1 font-semibold">
                        <Scissors className="w-2.5 h-2.5" />
                        <span>تفصيل حسب قياسكِ</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 border border-[#E8C4C4]/60 rounded-lg p-0.5 bg-white">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="w-5 h-5 rounded bg-[#FAF7F5] text-xs font-bold text-[#4A2E2B]"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="w-5 h-5 rounded bg-[#FAF7F5] text-xs font-bold text-[#4A2E2B]"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-[#361E1C]">
                      {formatSYP(item.priceSYP * item.quantity)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(index)}
                  className="text-[#A38A86] hover:text-rose-600 transition-colors p-1"
                  title="حذف من السلة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-[#E8C4C4]/40 bg-[#FAF7F5] space-y-4">
            
            <div className="space-y-1.5 text-xs text-[#6C5551]">
              <div className="flex justify-between items-center text-sm font-bold text-[#361E1C]">
                <span>المجموع الأولي للمنتجات:</span>
                <span className="text-base text-[#9C5B5B] font-black">
                  {formatSYP(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#8C6D68]">
                <span>طريقة الشحن المعتمدة:</span>
                <span className="font-medium">شركة القدموس (تسدد عند الاستلام)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#9C5B5B] to-[#7D4242] text-white font-bold text-sm shadow-md hover:from-[#8A4C4C] hover:to-[#6C3636] transition-all flex items-center justify-center gap-2"
            >
              <span>متابعة إتمام الطلب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#8C6D68] text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>دفع يدوي آمن عبر شام كاش • شحن موثوق عبر القدموس</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
