import React from 'react';
import { Sparkles, Mail, MapPin, ShieldCheck, Truck, CreditCard, Scissors } from 'lucide-react';

interface FooterProps {
  onOpenCustomModal: () => void;
  onOpenTrackerModal: () => void;
  onOpenAdminModal: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCustomModal,
  onOpenTrackerModal,
  onOpenAdminModal,
  onNavigateSection,
}) => {
  return (
    <footer className="bg-[#2D1B19] text-[#FAF7F5] border-t-4 border-[#E8C4C4]/40 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10 text-right">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#E8C4C4] to-[#C99E9E] flex items-center justify-center text-[#2D1B19]">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-serif-luxury text-white">DressMallAI</span>
            </div>

            <p className="text-sm font-semibold text-[#E8C4C4]">
              «أناقتكِ، عالمكِ، اختياركِ»
            </p>

            <p className="text-xs text-[#FAF7F5]/70 leading-relaxed">
              متجر إلكتروني افتراضي متخصص حصرياً في فساتين النساء الفاخرة وتصاميم الهوت كوتور المخصصة في سوريا. نستقبل طلبات الشراء والتفصيل ونتولى التنسيق للتصنيع والشحن الموثوق.
            </p>

            <div className="pt-1 text-xs text-[#E5B869] flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>صاحبة المتجر الافتراضي: Sara Issa</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide border-b border-white/10 pb-2">
              روابط المتجر
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F5]/80">
              <li>
                <button onClick={() => onNavigateSection('hero')} className="hover:text-[#E8C4C4] transition-colors">
                  الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('categories')} className="hover:text-[#E8C4C4] transition-colors">
                  أقسام الفساتين الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('products')} className="hover:text-[#E8C4C4] transition-colors">
                  تشكيلة الفساتين والأسعار
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('designers')} className="hover:text-[#E8C4C4] transition-colors">
                  المصممات (Rana Issa & Rama Allan)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('how-it-works')} className="hover:text-[#E8C4C4] transition-colors">
                  رحلة الطلب والحياكة والشحن
                </button>
              </li>
              <li>
                <button onClick={onOpenCustomModal} className="hover:text-[#E8C4C4] transition-colors font-bold text-[#E5B869]">
                  طلب تفصيل فستان خاص
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide border-b border-white/10 pb-2">
              الخدمات والسياسات المعتمدة
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF7F5]/80">
              <li className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#E8C4C4] shrink-0 mt-0.5" />
                <span>الشحن الداخلي عبر شركة القدموس إلى كافة المحافظات والمراكز السورية.</span>
              </li>
              <li className="flex items-start gap-2">
                <CreditCard className="w-4 h-4 text-[#E5B869] shrink-0 mt-0.5" />
                <span>طريقة الدفع: «شام كاش - تحويل يدوي» مع التحقق اليدوي والمطابقة.</span>
              </li>
              <li className="flex items-start gap-2">
                <Scissors className="w-4 h-4 text-[#E8C4C4] shrink-0 mt-0.5" />
                <span>حياكة حسب القياس الدقيق بالسم بإشراف ومتابعة فنية.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide border-b border-white/10 pb-2">
              التواصل والدعم
            </h4>
            <div className="space-y-2 text-xs text-[#FAF7F5]/80">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E5B869] shrink-0" />
                <a href="mailto:saraissa265@gmail.com" className="hover:underline font-mono">
                  saraissa265@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E8C4C4] shrink-0" />
                <span>السوق المستهدف: الجمهورية العربية السورية</span>
              </div>
              <p className="text-[11px] text-[#FAF7F5]/60 pt-2 leading-relaxed">
                متجر افتراضي إلكتروني متكامل - لا يوجد مقر جغرافي مادي، جميع الطلبات تُشحن مباشرة بعد الحياكة والتجهيز.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenTrackerModal}
                className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/10"
              >
                <span>تتبع طلب سابق بالرقم</span>
              </button>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF7F5]/60 gap-4">
          <p>© {new Date().getFullYear()} DressMallAI. جميع الحقوق محفوظة • «أناقتكِ، عالمكِ، اختياركِ»</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdminModal}
              className="text-[#FAF7F5]/50 hover:text-[#E5B869] transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>لوحة الإدارة</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
