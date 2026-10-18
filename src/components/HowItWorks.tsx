import React from 'react';
import { 
  Sparkles, 
  Search, 
  Ruler, 
  CreditCard, 
  Scissors, 
  Truck, 
  ShieldCheck, 
  PackageCheck 
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'اختيار الفستان أو طلب تصميم',
      desc: 'اختاري فستانكِ المفضل من التشكيلة المتوفرة، أو أرسلي فكرة فستانكِ الخاص عبر نموذج التفصيل المخصص.',
      icon: Search,
    },
    {
      step: '02',
      title: 'تحديد القياسات والتفاصيل',
      desc: 'حددي قياسكِ المعتاد أو أدخلي قياساتكِ الخاصة (الصدر، الخصر، الورك، الطول) بمساعدة دليل القياس الموضح.',
      icon: Ruler,
    },
    {
      step: '03',
      title: 'تحويل شام كاش اليدوي',
      desc: 'يتم تحويل قيمة الطلب يدوياً عبر شام كاش وتدوين رقم مرجع العملية لتتحقق الإدارة منه وتأكيد البدء فوراً.',
      icon: CreditCard,
    },
    {
      step: '04',
      title: 'الحياكة والتجهيز الفني',
      desc: 'تتولى المصممة إعداد وتفصيل الفستان والتدقيق على كل غرزة وتطريز لضمان أعلى جودة ملموسة.',
      icon: Scissors,
    },
    {
      step: '05',
      title: 'الشحن الموثوق عبر القدموس',
      desc: 'يُغلف الفستان في علبة حماية فاخرة ويُشحن عبر شركة القدموس لاستلامه في فرع مدينتكِ أو عند الباب.',
      icon: Truck,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#FAF7F5] border-t border-[#E8C4C4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8C4C4]/40 text-xs font-semibold text-[#8A4C4C] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>تجربة تسوق وحياكة راقية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#361E1C] font-serif-luxury mb-4">
            كيف تسير رحلة فستانكِ مع DressMallAI؟
          </h2>
          <p className="text-sm sm:text-base text-[#6C5551]">
            صممنا خطوات واضحة وشفافة لضمان استلام فستان أحلامكِ بأعلى درجات الراحة والموثوقية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#E8C4C4]/50 shadow-xs hover:shadow-lg transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-[#E8C4C4] font-serif-luxury group-hover:text-[#9C5B5B] transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#FAF7F5] border border-[#E8C4C4]/60 flex items-center justify-center text-[#9C5B5B] group-hover:bg-[#9C5B5B] group-hover:text-white transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#361E1C] mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#7C6360] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#FAF7F5] flex items-center gap-1.5 text-[11px] text-[#A38A86]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>خطوة مؤكدة وآمنة</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-linear-to-r from-[#FAF7F5] via-[#F6ECE8] to-[#FAF7F5] p-6 rounded-3xl border border-[#E8C4C4]/60 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E5B869]/20 border border-[#E5B869]/40 flex items-center justify-center text-[#996D13] shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#361E1C] mb-1">
                سياسة التحويل عبر «شام كاش»
              </h4>
              <p className="text-xs text-[#6C5551] leading-relaxed">
                التحويل يتم يدوياً دون الحاجة لكلمات سر أو بطاقات بنكية. بعد إرسال الحوالة، تدونين رقم المرجع لنقوم بالمطابقة الإدارية اليدوية قبل بدء الخياطة.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#9C5B5B]/15 border border-[#9C5B5B]/30 flex items-center justify-center text-[#9C5B5B] shrink-0">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#361E1C] mb-1">
                الشحن الداخلي عبر «شركة القدموس»
              </h4>
              <p className="text-xs text-[#6C5551] leading-relaxed">
                تغطية شاملة لجميع المحافظات السورية الرئيسية. أجور الشحن محددة وشفافة وتُسدد مباشرة للقدموس عند الاستلام لضمان النزاهة التامة.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
