import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { formatSYP } from '../services/storeService';
import { Product } from '../types';
import { 
  X, 
  Trash2, 
  Heart, 
  ArrowLeft, 
  ShoppingBag, 
  Eye, 
  Sparkles,
  Scissors
} from 'lucide-react';

interface WishlistDrawerProps {
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onExploreProducts: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  onSelectProduct,
  onQuickAddToCart,
  onExploreProducts,
}) => {
  const { 
    items, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    removeFromWishlist, 
    clearWishlist, 
    wishlistCount 
  } = useWishlist();

  if (!isWishlistOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsWishlistOpen(false)}
    >
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300 border-r border-[#E8C4C4]/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8C4C4]/40 flex items-center justify-between bg-[#FAF7F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#A75D67]/15 flex items-center justify-center text-[#A75D67]">
              <Heart className="w-4 h-4 fill-[#A75D67]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#361E1C]">قائمة فساتينكِ المفضلة</h2>
              <span className="text-[11px] text-[#8C6D68]">
                {wishlistCount > 0 ? `(${wishlistCount} فستان محفوظ)` : 'خالية حالياً'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            aria-label="إغلاق"
            className="p-2 rounded-full text-[#6C5551] hover:bg-[#E8C4C4]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list or empty state */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F5] border border-[#E8C4C4]/60 flex items-center justify-center mx-auto text-[#C99E9E]">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#361E1C]">لم تحفظي أي فستان بعد</h3>
              <p className="text-xs text-[#7C6360] max-w-xs mx-auto leading-relaxed">
                اضغطي على زر القلب بجانب أي فستان في التشكيلات لإضافته إلى قائمة المفضلة هنا والرجوع إليه متى أردتِ
              </p>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  onExploreProducts();
                }}
                className="mt-3 px-6 py-2.5 rounded-xl bg-[#A75D67] text-white text-xs font-semibold hover:bg-[#964E58] transition-colors shadow-xs inline-flex items-center gap-2"
              >
                <span>استعراض الفساتين</span>
                <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-2xl border border-[#E8C4C4]/60 bg-[#FAF7F5]/50 hover:bg-[#FAF7F5] transition-all flex gap-3.5 items-center group relative"
                >
                  {/* Thumbnail */}
                  <div 
                    onClick={() => {
                      setIsWishlistOpen(false);
                      onSelectProduct(product);
                    }}
                    className="w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-[#F6ECE8] cursor-pointer relative"
                  >
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=400&q=80'}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isCustomTailorable && (
                      <span className="absolute bottom-1 right-1 bg-white/90 text-[#6C3636] p-1 rounded-md shadow-xs">
                        <Scissors className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#8C6D68] truncate">
                        {product.categoryName || 'تشكيلة مميزة'}
                      </span>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        title="إزالة من المفضلة"
                        className="text-[#B38F8F] hover:text-[#9C5B5B] p-1 rounded-full hover:bg-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 
                      onClick={() => {
                        setIsWishlistOpen(false);
                        onSelectProduct(product);
                      }}
                      className="text-xs sm:text-sm font-bold text-[#361E1C] truncate cursor-pointer hover:text-[#A75D67] transition-colors"
                    >
                      {product.name}
                    </h4>

                    <div className="text-[11px] font-semibold text-[#8A4C4C]">
                      {formatSYP(product.priceSYP)}
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onQuickAddToCart(product)}
                        className="px-2.5 py-1 rounded-lg bg-[#A75D67] text-white hover:bg-[#964E58] text-[10px] font-medium transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>إضافة للسلة</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsWishlistOpen(false);
                          onSelectProduct(product);
                        }}
                        className="px-2 py-1 rounded-lg bg-white border border-[#E8C4C4] text-[#6C5551] hover:text-[#361E1C] text-[10px] font-medium transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>معاينة</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E8C4C4]/40 bg-[#FAF7F5] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#6C5551]">
              <span>إجمالي الفساتين المحفوظة</span>
              <span className="font-bold text-[#361E1C]">{items.length} فساتين</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  onExploreProducts();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#A75D67] hover:bg-[#964E58] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>متابعة التسوق</span>
                <ArrowLeft className="w-3.5 h-3.5 stroke-[1.75]" />
              </button>

              <button
                onClick={clearWishlist}
                className="py-2.5 px-3 rounded-xl border border-[#E8C4C4] bg-white hover:bg-[#FBEBEB] text-[#9C5B5B] text-xs font-medium transition-colors flex items-center gap-1"
                title="تفريغ قائمة المفضلة"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح الكل</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
