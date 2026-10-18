import React, { useState } from 'react';
import { Product } from '../types';
import { formatSYP } from '../services/storeService';
import { useCart } from '../context/CartContext';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Scissors, 
  Clock, 
  Sparkles, 
  Layers,
  Heart
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onProceedToCheckout?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onProceedToCheckout,
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  if (!product) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '38 (M)');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'أساسي');
  const [quantity, setQuantity] = useState(1);
  const [isCustomMeasurements, setIsCustomMeasurements] = useState(false);
  const [customNotes, setCustomNotes] = useState('');
  const [showAddedSuccess, setShowAddedSuccess] = useState(false);

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedSize,
      selectedColor,
      quantity,
      isCustomMeasurements,
      customNotes
    );
    setShowAddedSuccess(true);
    setTimeout(() => {
      setShowAddedSuccess(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    addToCart(
      product,
      selectedSize,
      selectedColor,
      quantity,
      isCustomMeasurements,
      customNotes
    );
    onClose();
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-[#E8C4C4]/50 my-8 relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#4A2E2B] hover:bg-[#E8C4C4] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="md:w-1/2 p-6 bg-[#FAF7F5] flex flex-col justify-between">
          <div className="aspect-3/4 rounded-2xl overflow-hidden bg-white shadow-xs border border-[#E8C4C4]/40 relative">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {product.isCustomTailorable && (
              <span className="absolute top-3 right-3 bg-[#E5B869] text-[#261413] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 z-10">
                <Scissors className="w-3.5 h-3.5" />
                <span>متاح للتفصيل بالقياس</span>
              </span>
            )}

            {/* Wishlist Heart Button */}
            <button
              onClick={() => toggleWishlist(product)}
              title={isWishlisted(product.id) ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
              aria-label="المفضلة"
              className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
                isWishlisted(product.id)
                  ? 'bg-[#A75D67] text-white hover:bg-[#964E58] scale-105'
                  : 'bg-white/90 backdrop-blur-xs text-[#6C5551] hover:text-[#A75D67] hover:bg-white hover:scale-105'
              }`}
            >
              <Heart 
                className={`w-4 h-4 transition-transform ${
                  isWishlisted(product.id) ? 'fill-white stroke-white' : 'stroke-[1.75]'
                }`} 
              />
            </button>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIdx === idx ? 'border-[#9C5B5B] shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-right">
            
            <div className="flex items-center justify-between text-xs text-[#8C6D68]">
              <span className="bg-[#FAF7F5] px-2.5 py-1 rounded-full border border-[#E8C4C4]/40">
                {product.categoryName}
              </span>
              <span className="font-semibold text-[#9C5B5B] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>المصممة: {product.designerName}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#361E1C] font-serif-luxury">
              {product.name}
            </h2>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E8C4C4]/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#8C6D68] block">السعر التقديري (بالليرة السورية)</span>
                <span className="text-xl sm:text-2xl font-black text-[#361E1C]">
                  {formatSYP(product.priceSYP)}
                </span>
              </div>
              <span className="text-[10px] bg-[#E8C4C4]/50 text-[#6C3636] px-2.5 py-1 rounded-full font-medium">
                شامل المعاينة
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#6C5551] leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-[#F6ECE8] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#9C5B5B]" />
                <span className="text-[#4A2E2B] font-medium">{product.fabricDetails || 'أقمشة فاخرة مختارة'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F6ECE8] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9C5B5B]" />
                <span className="text-[#4A2E2B] font-medium">{product.estimatedDays}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#361E1C] block mb-2">
                الألوان المتاحة:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      selectedColor === color
                        ? 'bg-[#9C5B5B] text-white border-[#9C5B5B] shadow-xs'
                        : 'bg-white text-[#4A2E2B] border-[#E8C4C4]/60 hover:bg-[#FAF7F5]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#361E1C]">
                  المقاس المتاح:
                </label>
                {product.isCustomTailorable && (
                  <button
                    onClick={() => setIsCustomMeasurements(!isCustomMeasurements)}
                    className="text-[11px] text-[#9C5B5B] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Scissors className="w-3 h-3" />
                    <span>{isCustomMeasurements ? 'إلغاء التفصيل المخصص' : 'طلب تفصيل حسب قياسكِ'}</span>
                  </button>
                )}
              </div>

              {!isCustomMeasurements ? (
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        selectedSize === sz
                          ? 'bg-[#4A2E2B] text-white border-[#4A2E2B] shadow-xs'
                          : 'bg-white text-[#4A2E2B] border-[#E8C4C4]/60 hover:bg-[#FAF7F5]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4] space-y-2">
                  <div className="text-[11px] text-[#7C4A4A] flex items-center gap-1.5 font-bold">
                    <Scissors className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>تفصيل مخصص حسب مقاساتكِ الخاصة</span>
                  </div>
                  <textarea
                    placeholder="اكتبي قياساتكِ بالسم (الصدر، الخصر، الورك، الطول الكلي، طول الكم) أو أي تعديلات مطلوبة على التصميم..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-lg bg-white border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-[#361E1C]">الكمية:</span>
              <div className="flex items-center gap-2 border border-[#E8C4C4]/60 rounded-xl p-1 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-[#FAF7F5] text-[#4A2E2B] font-bold text-sm hover:bg-[#E8C4C4]/40"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-[#FAF7F5] text-[#4A2E2B] font-bold text-sm hover:bg-[#E8C4C4]/40"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-[#FAF7F5] space-y-2.5">
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`w-full py-2 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isWishlisted(product.id)
                  ? 'border-[#A75D67] bg-[#A75D67]/10 text-[#A75D67]'
                  : 'border-[#E8C4C4] bg-white hover:bg-[#FAF7F5] text-[#5C4D4A] hover:text-[#A75D67]'
              }`}
            >
              <Heart 
                className={`w-4 h-4 transition-transform ${
                  isWishlisted(product.id) ? 'fill-[#A75D67] text-[#A75D67] scale-110' : ''
                }`} 
              />
              <span>
                {isWishlisted(product.id) ? 'هذا الفستان في قائمة مفضلتكِ (اضغطي للحذف)' : 'حفظ هذا الفستان في قائمة المفضلة'}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#FAF7F5] border border-[#9C5B5B] text-[#9C5B5B] hover:bg-[#E8C4C4]/20 font-bold text-xs sm:text-sm transition-all"
              >
                {showAddedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">تمت الإضافة!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>إضافة إلى السلة</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-linear-to-r from-[#9C5B5B] to-[#7D4242] text-white hover:from-[#8A4C4C] hover:to-[#6C3636] font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <span>طلب وإتمام الشراء</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
