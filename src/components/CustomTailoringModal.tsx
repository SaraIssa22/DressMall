import React, { useState } from 'react';
import { Designer, CustomTailoringRequest } from '../types';
import { storeService } from '../services/storeService';
import { SYRIAN_CITIES } from '../data/initialData';
import { 
  X, 
  Scissors, 
  Ruler, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Copy, 
  Check, 
  HelpCircle 
} from 'lucide-react';

interface CustomTailoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  designers: Designer[];
  preselectedDesigner?: Designer | null;
}

export const CustomTailoringModal: React.FC<CustomTailoringModalProps> = ({
  isOpen,
  onClose,
  designers,
  preselectedDesigner,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState(SYRIAN_CITIES[0] || 'دمشق');
  const [eventType, setEventType] = useState('سهرة ومناسبة خاصة');
  const [dressType, setDressType] = useState('فستان سهرة منسدل');
  const [preferredDesignerId, setPreferredDesignerId] = useState(
    preselectedDesigner?.id || 'any'
  );
  const [usualSize, setUsualSize] = useState('38 (M)');
  const [heightCm, setHeightCm] = useState('');
  const [bustCm, setBustCm] = useState('');
  const [waistCm, setWaistCm] = useState('');
  const [hipsCm, setHipsCm] = useState('');
  const [measurementNotes, setMeasurementNotes] = useState('');
  const [preferredColor, setPreferredColor] = useState('');
  const [fabricNotes, setFabricNotes] = useState('');
  const [designDescription, setDesignDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');

  const [showMeasureGuide, setShowMeasureGuide] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedRequest, setCompletedRequest] = useState<CustomTailoringRequest | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const validate = (): string | null => {
    if (!customerName.trim() || customerName.trim().length < 3) {
      return 'يرجى كتابة الاسم الكامل (3 أحرف على الأقل).';
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      return 'يرجى إدخال رقم هاتف صحيح للتواصل عبر الواتساب أو الاتصال.';
    }
    if (!city) {
      return 'يرجى تحديد المدينة.';
    }
    if (!designDescription.trim() || designDescription.trim().length < 10) {
      return 'يرجى تدوين وصف مبسط لتصميم الفستان المطلوب (10 أحرف على الأقل).';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const valErr = validate();
    if (valErr) {
      setErrorMsg(valErr);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDes = designers.find((d) => d.id === preferredDesignerId);

      const req = await storeService.createCustomTailoringRequest({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        city,
        eventType,
        dressType,
        preferredDesignerId: preferredDesignerId === 'any' ? undefined : preferredDesignerId,
        preferredDesignerName: selectedDes ? selectedDes.name : 'أي مصممة متفرغة',
        usualSize,
        heightCm: heightCm.trim() || undefined,
        bustCm: bustCm.trim() || undefined,
        waistCm: waistCm.trim() || undefined,
        hipsCm: hipsCm.trim() || undefined,
        measurementNotes: measurementNotes.trim() || undefined,
        preferredColor: preferredColor.trim() || undefined,
        fabricNotes: fabricNotes.trim() || undefined,
        designDescription: designDescription.trim(),
        eventDate: eventDate || undefined,
        referenceImageUrl: referenceImageUrl.trim() || undefined,
      });

      setCompletedRequest(req);
    } catch (err: any) {
      console.error('Failed to submit custom request to Firestore:', err);
      setErrorMsg('تعذر حفظ طلب التفصيل في السحابة. يرجى التأكد من اتصال الإنترنت والمحاولة مجدداً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (completedRequest) {
      navigator.clipboard.writeText(completedRequest.requestNumber);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#E8C4C4]/50 my-6 relative text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-[#FAF7F5] border-b border-[#E8C4C4]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#9C5B5B] to-[#7D4242] text-white flex items-center justify-center shadow-xs">
              <Scissors className="w-5 h-5 text-[#E5B869]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#361E1C] font-serif-luxury">
                {completedRequest ? 'تم استلام طلب التفصيل' : 'طلب تصميم وتفصيل فستان مخصص'}
              </h2>
              <p className="text-xs text-[#8C6D68]">حياكة حصرية بالقياس الدقيق بإشراف مصمماتنا</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6C5551] hover:bg-[#E8C4C4]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {completedRequest ? (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#361E1C] font-serif-luxury mb-1">
                  تم إرسال طلب التفصيل بنجاح!
                </h3>
                <p className="text-xs sm:text-sm text-[#6C5551]">
                  تم تسجيل طلبكِ في السحابة وسيقوم فريق المصممات بمراجعة القياسات والموديل
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E8C4C4] max-w-md mx-auto space-y-2">
                <span className="text-xs text-[#8C6D68] font-bold block">رقم طلب التفصيل المرجعي:</span>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-mono font-extrabold text-[#9C5B5B] tracking-wider">
                    {completedRequest.requestNumber}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-white border border-[#E8C4C4] text-[#4A2E2B] hover:bg-[#FAF7F5] transition-colors"
                    title="نسخ رقم الطلب"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#A38A86]">
                  استخدمي هذا الرقم للاستعلام عن تسعير وحالة طلبكِ
                </p>
              </div>

              <div className="bg-[#FAF7F5] rounded-2xl p-4 text-right text-xs space-y-2 border border-[#E8C4C4]/40 max-w-md mx-auto">
                <div className="flex justify-between py-1 border-b border-[#E8C4C4]/30">
                  <span className="text-[#8C6D68]">المصممة المختارة:</span>
                  <span className="font-bold text-[#361E1C]">{completedRequest.preferredDesignerName || 'أي مصممة متفرغة'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8C4C4]/30">
                  <span className="text-[#8C6D68]">نوع الفستان والمناسبة:</span>
                  <span className="font-bold text-[#361E1C]">{completedRequest.dressType} ({completedRequest.eventType})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8C4C4]/30">
                  <span className="text-[#8C6D68]">المدينة:</span>
                  <span className="font-bold text-[#361E1C]">{completedRequest.city}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8C6D68]">حالة الطلب:</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                    قيد المراجعة الفنية والتسعير
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-right text-xs text-amber-900 leading-relaxed max-w-md mx-auto">
                ستتواصل معكِ المصممة عبر الهاتف أو الواتساب لمطابقة القياسات وتقديم عرض السعر ومدة التنفيذ، وتزويدكِ ببيانات شام كاش لدفع العربون عند الاعتماد.
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-[#9C5B5B] text-white text-xs sm:text-sm font-semibold hover:bg-[#8A4C4C] transition-colors"
              >
                العودة إلى الموقع
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#361E1C] border-b border-[#E8C4C4]/40 pb-1">
                  1. معلومات التواصل
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                      الاسم الكامل <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="اسمكِ الكريم"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                      الهاتف / الواتساب <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="09XXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B] text-right"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                      المحافظة / المدينة <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                    >
                      {SYRIAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#361E1C] border-b border-[#E8C4C4]/40 pb-1">
                  2. تفاصيل التصميم والمصممة
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                      المصممة المفضلة
                    </label>
                    <select
                      value={preferredDesignerId}
                      onChange={(e) => setPreferredDesignerId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                    >
                      <option value="any">أي مصممة متفرغة</option>
                      {designers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.specialty})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                      نوع المناسبة
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                    >
                      <option value="زفاف وعقد قران">زفاف وعقد قران</option>
                      <option value="خطوبة وسهرة">خطوبة وسهرة</option>
                      <option value="حفل تخرج">حفل تخرج</option>
                      <option value="إطلالة يومية راقية">إطلالة يومية راقية</option>
                      <option value="مناسبة عائلية خاصة">مناسبة عائلية خاصة</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                      موعد المناسبة التقريبي
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                      اللون المفضل
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: ليلكي هادئ، عاجي، أخضر زمردي..."
                      value={preferredColor}
                      onChange={(e) => setPreferredColor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                      نوع القماش المفضل
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: كريب جورجيت، ساتان حرير، تول مطرز..."
                      value={fabricNotes}
                      onChange={(e) => setFabricNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                    وصف التصميم وتفاصيله <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="اشرحي قصة الفستان (أكمام، ياقة، خصر، طول الذيل، كسرات، نوع التطريز المطلوب)..."
                    value={designDescription}
                    onChange={(e) => setDesignDescription(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                    رابط لصورة مرجعية للتصميم (إن توفر لديكِ)
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    placeholder="https://..."
                    value={referenceImageUrl}
                    onChange={(e) => setReferenceImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B] text-right"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8C4C4]/40 pb-1">
                  <h3 className="text-sm font-bold text-[#361E1C] flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-[#9C5B5B]" />
                    <span>3. القياسات الدقيقة (بالسنتيمتر)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowMeasureGuide(!showMeasureGuide)}
                    className="text-xs text-[#9C5B5B] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showMeasureGuide ? 'إخفاء دليل القياس' : 'كيف آخذ قياساتي؟'}</span>
                  </button>
                </div>

                {showMeasureGuide && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1.5 leading-relaxed">
                    <p className="font-bold">دليل أخذ القياسات الصحيحة بالمازورة:</p>
                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                      <li><strong>محيط الصدر:</strong> مرري شريط القياس حول أعلى بروز في منطقة الصدر بشكل أفقي مستقيم.</li>
                      <li><strong>محيط الخصر:</strong> قيسي أضيق جزء من الجذع (فوق السرة بقليل) مع التنفس الطبيعي.</li>
                      <li><strong>محيط الورك:</strong> قيسي أعرض نقطة في منطقة الورك والمؤخرة.</li>
                      <li><strong>الطول الكلي:</strong> من نقطة التقاء الكتف مع الرقبة وحتى الحافة السفلية المرغوبة للفستان مع احتساب الكعب.</li>
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-[#6C5551] block mb-1">المقاس المعتاد</label>
                    <input
                      type="text"
                      placeholder="38 أو M"
                      value={usualSize}
                      onChange={(e) => setUsualSize(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#6C5551] block mb-1">الصدر (سم)</label>
                    <input
                      type="number"
                      placeholder="مثال: 92"
                      value={bustCm}
                      onChange={(e) => setBustCm(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#6C5551] block mb-1">الخصر (سم)</label>
                    <input
                      type="number"
                      placeholder="مثال: 74"
                      value={waistCm}
                      onChange={(e) => setWaistCm(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#6C5551] block mb-1">الورك (سم)</label>
                    <input
                      type="number"
                      placeholder="مثال: 100"
                      value={hipsCm}
                      onChange={(e) => setHipsCm(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#6C5551] block mb-1">الطول الكلي أو طول القامة (سم)</label>
                    <input
                      type="number"
                      placeholder="مثال: 165"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#6C5551] block mb-1">ملاحظات إضافية على القياس</label>
                    <input
                      type="text"
                      placeholder="مثال: تفضيل قصة واسعة عند الذراعين..."
                      value={measurementNotes}
                      onChange={(e) => setMeasurementNotes(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#9C5B5B] to-[#7D4242] text-white font-bold text-sm shadow-md hover:from-[#8A4C4C] hover:to-[#6C3636] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري إرسال طلب التفصيل للسحابة...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5 text-[#E5B869]" />
                    <span>إرسال طلب التفصيل إلى المصممة</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
