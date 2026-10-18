import React, { useState, useMemo } from 'react';
import { Product, Category, Designer } from '../types';
import { formatSYP } from '../services/storeService';
import { 
  Search, 
  ShoppingBag, 
  Eye, 
  Sparkles, 
  Scissors, 
  RotateCcw, 
  Info,
  X,
  Heart
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

interface ProductsSectionProps {
  products: Product[];
  categories: Category[];
  designers: Designer[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  onProductClick: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  categories,
  designers,
  selectedCategoryId,
  onSelectCategory,
  onProductClick,
  onQuickAddToCart,
}) => {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesignerId, setSelectedDesignerId] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'newest'>('featured');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategoryId && p.categoryId !== selectedCategoryId) {
        return false;
      }
      if (selectedDesignerId !== 'all' && p.designerId !== selectedDesignerId) {
        return false;
      }
      if (selectedSize !== 'all' && !p.sizes.some(s => s.includes(selectedSize.split(' ')[0]))) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesDesigner = p.designerName.toLowerCase().includes(q);
        const matchesCategory = p.categoryName.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesDesigner && !matchesCategory) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.priceSYP - b.priceSYP;
      if (sortBy === 'priceDesc') return b.priceSYP - a.priceSYP;
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, selectedCategoryId, selectedDesignerId, selectedSize, searchQuery, sortBy]);

  const resetFilters = () => {
    onSelectCategory(null);
    setSelectedDesignerId('all');
    setSelectedSize('all');
    setSearchQuery('');
  };

  return (
    <section id="products" className="py-16 bg-[#FAF7F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8C4C4]/30 text-xs font-semibold text-[#8A4C4C] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>تشكيلات متجددة ومتميزة</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#361E1C] font-serif-luxury">
              تشكيلة فساتين DressMallAI
            </h2>
            <p className="text-sm text-[#6C5551] mt-1">
              تصاميم راقية جاهزة للطلب الفوري أو التفصيل حسب المقاس بالليرة السورية
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#F5EBE6] border border-[#E8C4C4]/40 text-xs text-[#6C5551] max-w-md">
            <Info className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>الأسعار المعروضة أولية وتخضع للتأكيد أو التعديل من قبل الإدارة والمصممة عند الحياكة.</span>
          </div>
        </div>

        {/* Active category filter chip (if filtered from header or categories) */ }
        {selectedCategoryId && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-[#6C5551]">تصفية معروضة:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A75D67]/10 text-[#A75D67] text-xs font-medium border border-[#A75D67]/20">
              {categories.find(c => c.id === selectedCategoryId)?.name || 'القسم المختار'}
              <button 
                onClick={() => onSelectCategory(null)} 
                className="hover:bg-[#A75D67]/20 p-0.5 rounded-full transition-colors cursor-pointer"
                title="عرض جميع الفساتين"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8C4C4]/40 shadow-xs mb-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-[#9C5B5B] absolute right-3.5 top-3.5" />
              <input
                type="text"
                placeholder="ابحثي عن اسم فستان، مصممة، أو قماش..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/50 focus:border-[#9C5B5B] focus:ring-1 focus:ring-[#9C5B5B] text-xs sm:text-sm text-[#361E1C] outline-hidden placeholder:text-[#A38A86]"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedDesignerId}
                onChange={(e) => setSelectedDesignerId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/50 text-xs sm:text-sm text-[#361E1C] focus:border-[#9C5B5B] outline-hidden"
              >
                <option value="all">كل المصممات</option>
                {designers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/50 text-xs sm:text-sm text-[#361E1C] focus:border-[#9C5B5B] outline-hidden"
              >
                <option value="featured">الفساتين المميزة أولاً</option>
                <option value="newest">الأحدث وصولاً</option>
                <option value="priceAsc">السعر: من الأقل للأعلى</option>
                <option value="priceDesc">السعر: من الأعلى للأقل</option>
              </select>
            </div>

            <div className="md:col-span-1 flex items-center justify-center">
              <button
                onClick={resetFilters}
                title="إعادة ضبط التصفية"
                className="w-full md:w-auto p-2.5 rounded-xl bg-[#FAF7F5] hover:bg-[#E8C4C4]/30 text-[#6C5551] flex items-center justify-center cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E8C4C4]/40 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F5] border border-[#E8C4C4] flex items-center justify-center mx-auto mb-4 text-[#9C5B5B]">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#361E1C] mb-2">لا توجد فساتين تطابق بحثكِ</h3>
            <p className="text-xs text-[#7C6360] mb-5">
              جربي تغيير معايير التصفية أو إزالة الكلمات المفتاحية لمشاهدة بقية التشكيلات
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-[#9C5B5B] text-white text-xs font-semibold hover:bg-[#8A4C4C] transition-colors"
            >
              عرض جميع الفساتين
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl overflow-hidden border border-[#E8C4C4]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div 
                    onClick={() => onProductClick(product)}
                    className="relative aspect-3/4 overflow-hidden bg-[#F6ECE8] cursor-pointer"
                  >
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80'}
                      alt={product.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges on Top-Right */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                      {product.featured && (
                        <span className="bg-[#E5B869] text-[#261413] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          مميز
                        </span>
                      )}
                      {product.isCustomTailorable && (
                        <span className="bg-[#FAF7F5]/90 backdrop-blur-xs text-[#6C3636] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#E8C4C4] shadow-xs flex items-center gap-1">
                          <Scissors className="w-2.5 h-2.5" />
                          <span>تفصيل خاص</span>
                        </span>
                      )}
                    </div>

                    {/* Wishlist Heart Button on Top-Left */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      title={isWishlisted(product.id) ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                      aria-label={isWishlisted(product.id) ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                      className={`absolute top-3 left-3 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
                        isWishlisted(product.id)
                          ? 'bg-[#A75D67] text-white hover:bg-[#964E58] scale-105 shadow-[#A75D67]/30'
                          : 'bg-white/90 backdrop-blur-xs text-[#6C5551] hover:text-[#A75D67] hover:bg-white hover:scale-105'
                      }`}
                    >
                      <Heart 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isWishlisted(product.id) ? 'fill-white stroke-white scale-110' : 'stroke-[1.75]'
                        }`} 
                      />
                    </button>

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full bg-white/90 text-[#361E1C] text-xs font-semibold flex items-center gap-2 shadow-md">
                        <Eye className="w-4 h-4 text-[#9C5B5B]" />
                        <span>معاينة التفاصيل</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#8C6D68]">
                      <span>{product.categoryName}</span>
                      <span className="font-semibold text-[#9C5B5B]">تصميم: {product.designerName}</span>
                    </div>

                    <h3 
                      onClick={() => onProductClick(product)}
                      className="text-base font-bold text-[#361E1C] cursor-pointer hover:text-[#9C5B5B] transition-colors line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#7C6360] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {product.sizes.slice(0, 3).map((sz, i) => (
                        <span key={i} className="text-[10px] bg-[#FAF7F5] text-[#55403D] px-2 py-0.5 rounded-md border border-[#E8C4C4]/30">
                          {sz}
                        </span>
                      ))}
                      {product.sizes.length > 3 && (
                        <span className="text-[10px] text-[#8C6D68] self-center">
                          +{product.sizes.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-[#FAF7F5] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8C6D68] block">السعر التقديري</span>
                    <span className="text-sm font-extrabold text-[#361E1C]">
                      {formatSYP(product.priceSYP)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onQuickAddToCart(product)}
                      title="إضافة سريعة إلى السلة"
                      className="p-2.5 rounded-xl bg-[#FAF7F5] hover:bg-[#E8C4C4]/40 text-[#9C5B5B] transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onProductClick(product)}
                      className="px-3 py-2 rounded-xl bg-[#9C5B5B] hover:bg-[#8A4C4C] text-white text-xs font-semibold transition-colors"
                    >
                      عرض الخيارات
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
