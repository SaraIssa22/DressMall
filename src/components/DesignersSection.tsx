import React from 'react';
import { Designer } from '../types';
import { Sparkles, MapPin, Scissors, ArrowLeft } from 'lucide-react';

interface DesignersSectionProps {
  designers: Designer[];
  onSelectDesignerForCustom: (designer: Designer) => void;
  onFilterByDesigner: (designerName: string) => void;
}

export const DesignersSection: React.FC<DesignersSectionProps> = ({
  designers,
  onSelectDesignerForCustom,
  onFilterByDesigner,
}) => {
  return (
    <section id="designers" className="py-20 bg-linear-to-b from-[#FAF7F5] via-[#F4EBE7] to-[#FAF7F5] border-t border-[#E8C4C4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8C4C4]/40 text-xs font-semibold text-[#8A4C4C] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>نخبة مصممات الأزياء في سوريا</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#361E1C] font-serif-luxury mb-4">
            مصممات DressMallAI المعتمدات
          </h2>
          <p className="text-sm sm:text-base text-[#6C5551]">
            نعمل مع مصممات متخصصات يمتلكن رؤية فنية راقية ويشرفن على حياكة وتنفيذ فستانكِ بأعلى معايير الإتقان
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {designers.map((designer) => (
            <div
              key={designer.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8C4C4]/60 shadow-lg shadow-[#E8C4C4]/15 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-6">
                
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img
                      src={designer.avatar}
                      alt={designer.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#E8C4C4] shadow-md"
                    />
                    <div className="absolute -bottom-2 -left-2 bg-[#E5B869] text-[#261413] p-1 rounded-full shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#361E1C] font-serif-luxury">
                        {designer.name}
                      </h3>
                      <span className="text-[10px] bg-[#E8C4C4]/40 text-[#6C3636] font-semibold px-2 py-0.5 rounded-full">
                        معتمدة
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-[#9C5B5B]">
                      {designer.specialty}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-[#7C6360] pt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span className="text-[11px]">{designer.coverageArea}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#6C5551] leading-relaxed bg-[#FAF7F5] p-4 rounded-2xl border border-[#E8C4C4]/30">
                  {designer.bio}
                </p>

                {designer.featuredDesigns && designer.featuredDesigns.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-[#361E1C] block mb-2">
                      أبرز القطع المرتبطة بالمصممة:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {designer.featuredDesigns.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-[#F6ECE8] text-[#4A2E2B] px-3 py-1 rounded-full border border-[#E8C4C4]/40"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              <div className="pt-6 mt-6 border-t border-[#FAF7F5] grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => onFilterByDesigner(designer.name)}
                  className="py-2.5 px-4 rounded-xl bg-[#FAF7F5] hover:bg-[#E8C4C4]/30 text-[#4A2E2B] text-xs font-semibold border border-[#E8C4C4]/60 transition-colors flex items-center justify-center gap-2"
                >
                  <span>عرض فساتينها</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-[#9C5B5B]" />
                </button>

                <button
                  onClick={() => onSelectDesignerForCustom(designer)}
                  className="py-2.5 px-4 rounded-xl bg-linear-to-r from-[#9C5B5B] to-[#7D4242] text-white text-xs font-semibold shadow-md hover:from-[#8A4C4C] hover:to-[#6C3636] transition-all flex items-center justify-center gap-2"
                >
                  <Scissors className="w-3.5 h-3.5 text-[#E5B869]" />
                  <span>طلب تفصيل من المصممة</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
