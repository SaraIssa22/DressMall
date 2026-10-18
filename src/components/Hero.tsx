import React from 'react';
import { ArrowLeft } from 'lucide-react';
import heroDressImg from '../assets/images/hero_blush_dress_1792309340943.jpg';

interface HeroProps {
  onExploreProducts: () => void;
  onOpenCustomModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProducts, onOpenCustomModal }) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#FAF7F5] min-h-[580px] sm:min-h-[640px] flex items-center">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroDressImg}
          alt="فستان الأحلام - DressMallAI"
          className="w-full h-full object-cover object-top sm:object-[center_20%]"
        />
        {/* Soft elegant white/cream gradient overlays to ensure text readability matching screenshot */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/70 to-white/95 sm:via-white/60 sm:to-white/90" />
        <div className="absolute inset-0 bg-linear-to-b from-white/40 via-transparent to-white/70" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-20">
        
        {/* Main Text Content (aligned to the right) */}
        <div className="max-w-xl text-right space-y-5 pt-4">
          
          {/* Subtle line prefix */}
          <div className="flex items-center gap-2 text-[#A75D67] text-xs sm:text-sm font-normal">
            <span className="w-8 h-[1.5px] bg-[#A75D67] inline-block" />
            <span>«أناقتكِ، عالمكِ، اختياركِ»</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-normal leading-[1.25] text-[#2C2120] tracking-tight">
            فستان أحلامكِ{' '}
            <span className="text-[#A75D67] font-normal">
              يبدأ من هنا
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm text-[#5C4D4A] leading-relaxed font-normal max-w-lg">
            اكتشفي أرقى تصاميم فساتين السهرة، الزفاف، والمناسبات اليومية والمحتشمة، مع خدمة التفصيل الحصري والتوصيل المباشر داخل سوريا.
          </p>

          {/* Two Buttons matching aesthetic */}
          <div className="flex flex-row items-center gap-3 pt-2">
            
            {/* Primary Action Button */}
            <button
              onClick={onExploreProducts}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-[#A75D67] hover:bg-[#964E58] text-white text-xs sm:text-sm font-medium shadow-xs transition-colors cursor-pointer"
            >
              <span>اكتشفي التشكيلات</span>
              <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
            </button>

            {/* Secondary Action Button */}
            <button
              onClick={onOpenCustomModal}
              className="flex items-center justify-center px-6 sm:px-7 py-3 rounded-xl bg-white hover:bg-[#FAF8F6] text-[#3D302E] border border-[#E5D5D3] text-xs sm:text-sm font-medium shadow-xs transition-colors cursor-pointer"
            >
              <span>طلب تفصيل خاص</span>
            </button>

          </div>

          {/* Micro-Features Row */}
          <div className="pt-4 flex items-center gap-3 text-[11px] sm:text-xs text-[#7A6A67] font-normal border-t border-[#EAE2DF]/60">
            <span>شحن لجميع المحافظات</span>
            <span className="text-[#D1C3C0]">•</span>
            <span>دفع عبر شام كاش</span>
            <span className="text-[#D1C3C0]">•</span>
            <span>تفصيل بمقاساتكِ الدقيقة</span>
          </div>

        </div>

      </div>

    </section>
  );
};
