import React from 'react';
import { Category } from '../types';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface CategoriesSectionProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
  onOpenCustomModal: () => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onOpenCustomModal,
}) => {
  return (
    <section id="categories" className="py-16 bg-[#FAF7F5] border-t border-[#E8C4C4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8C4C4]/30 text-xs font-semibold text-[#8A4C4C] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>تشكيلات متخصصة وحصرية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#361E1C] font-serif-luxury mb-4">
            أقسام الفساتين الرئيسية
          </h2>
          <p className="text-sm sm:text-base text-[#6C5551]">
            اخترنا لكِ باقة متنوعة تناسب أدق تفاصيل مناسباتكِ الخاصة ويومياتكِ المفعمة بالجمال
          </p>
        </div>

        {/* Categories container: strictly side-by-side, never stacked vertically */}
        <div 
          className="flex flex-row flex-nowrap lg:grid lg:grid-cols-5 gap-4 overflow-x-auto pb-4 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const isCustom = cat.slug === 'custom';

            return (
              <div
                key={cat.id}
                onClick={() => {
                  if (isCustom) {
                    onOpenCustomModal();
                  } else {
                    onSelectCategory(cat.id);
                  }
                }}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-white border transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-md shrink-0 w-[240px] sm:w-[260px] lg:w-auto ${
                  isSelected 
                    ? 'border-[#A75D67] ring-2 ring-[#A75D67]/30' 
                    : 'border-[#E8C4C4]/50 hover:border-[#D9A7A7]'
                }`}
              >
                <div className="aspect-4/5 overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#261413]/90 via-[#261413]/30 to-transparent" />
                  
                  {isCustom && (
                    <span className="absolute top-3 right-3 bg-[#E5B869] text-[#261413] text-[10px] font-medium px-2 py-0.5 rounded-full shadow-xs">
                      تفصيل خاص
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <h3 className="text-base font-semibold mb-1 group-hover:text-[#E8C4C4] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#FAF7F5]/85 line-clamp-2 leading-relaxed mb-2.5">
                    {cat.description}
                  </p>
                  
                  <div className="flex items-center gap-1 text-xs font-normal text-[#E5B869]">
                    <span>{isCustom ? 'ابدئي التفصيل' : 'تصفح الفساتين'}</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
