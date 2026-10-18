import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { StoreSettings, Order } from '../types';
import { storeService, formatSYP } from '../services/storeService';
import { SYRIAN_CITIES } from '../data/initialData';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  ShieldAlert, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  Copy, 
  Check, 
  Printer, 
  Sparkles 
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState(SYRIAN_CITIES[0] || 'دمشق');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentReference, setPaymentReference] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): string | null => {
    if (items.length === 0) return 'سلة المشتريات خالية! يرجى إضافة فساتين أولاً.';
    if (!customerName.trim() || customerName.trim().length < 3) return 'يرجى كتابة الاسم الكامل (3 أحرف على الأقل).';
    if (!customerPhone.trim() || customerPhone.trim().length < 8) return 'يرجى إدخال رقم هاتف صحيح للتواصل والتأكيد عبر الواتساب أو الاتصال.';
    if (!city) return 'يرجى اختيار المدينة.';
    if (!detailedAddress.trim()) return 'يرجى تحديد العنوان التفصيلي أو فرع القدموس المفضل للاستلام.';
    return null;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const error = validateForm();
    if (error) {
      setSubmitError(error);
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrder = await storeService.createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        city,
        detailedAddress: detailedAddress.trim(),
        customerNotes: customerNotes.trim() || undefined,
        items,
        paymentMethod: 'sham_cash',
        paymentReference: paymentReference.trim() || undefined,
        shippingMethod: 'qadmous',
        shippingCost: 0,
        subtotal,
        total: subtotal,
      });

      setCompletedOrder(newOrder);
      clearCart();
    } catch (err: any) {
      console.error('Failed to save order to Firestore:', err);
      setSubmitError('تعذر حفظ الطلب في قاعدة البيانات السحابية. يرجى التحقق من اتصالكِ بالإنترنت والمحاولة مجدداً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.orderNumber);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#E8C4C4]/50 my-6 relative text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-[#FAF7F5] border-b border-[#E8C4C4]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#9C5B5B] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#E5B869]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#361E1C] font-serif-luxury">
                {completedOrder ? 'تأكيد استلام الطلب' : 'إتمام طلب الشراء'}
              </h2>
              <p className="text-xs text-[#8C6D68]">DressMallAI • شحن القدموس • دفع شام كاش</p>
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
          {completedOrder ? (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#361E1C] font-serif-luxury mb-1">
                  شكراً لكِ! تم تسجيل طلبكِ بنجاح
                </h3>
                <p className="text-xs sm:text-sm text-[#6C5551]">
                  تم حفظ بيانات طلبكِ في قاعدة البيانات السحابية برقم مرجعي فريد لمتابعته
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E8C4C4] max-w-md mx-auto space-y-2">
                <span className="text-xs text-[#8C6D68] font-bold block">رقم طلبكِ الفريد:</span>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-mono font-extrabold text-[#9C5B5B] tracking-wider">
                    {completedOrder.orderNumber}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 rounded-lg bg-white border border-[#E8C4C4] text-[#4A2E2B] hover:bg-[#FAF7F5] transition-colors"
                    title="نسخ رقم الطلب"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#A38A86]">
                  احفظي هذا الرقم للاستعلام عن حالة التجهيز والشحن في أي وقت
                </p>
              </div>

              <div className="bg-[#FAF7F5] rounded-2xl p-4 text-right text-xs space-y-2 border border-[#E8C4C4]/40 max-w-md mx-auto">
                <div className="flex justify-between py-1 border-b border-[#E8C4C4]/30">
                  <span className="text-[#8C6D68]">الاسم والمدينة:</span>
                  <span className="font-bold text-[#361E1C]">{completedOrder.customerName} - {completedOrder.city}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8C4C4]/30">
                  <span className="text-[#8C6D68]">الهاتف:</span>
                  <span className="font-mono text-[#361E1C]">{completedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8C4C4]/30">
                  <span className="text-[#8C6D68]">إجمالي المنتجات:</span>
                  <span className="font-bold text-[#9C5B5B]">{formatSYP(completedOrder.total)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8C4C4]/30">
                  <span className="text-[#8C6D68]">حالة الدفع:</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                    بانتظار التحقق من التحويل
                  </span>
                </div>
                {completedOrder.paymentReference && (
                  <div className="flex justify-between py-1">
                    <span className="text-[#8C6D68]">مرجع تحويل شام كاش:</span>
                    <span className="font-mono font-bold text-[#361E1C]">{completedOrder.paymentReference}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-right text-xs text-amber-900 leading-relaxed max-w-md mx-auto">
                <strong>الخطوة التالية:</strong> ستقوم إدارة المتجر بمطابقة رقم مرجع التحويل اليدوي والتواصل معكِ لتأكيد موعد التسليم مع شركة القدموس في مدينتكِ.
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl border border-[#9C5B5B] text-[#9C5B5B] text-xs font-semibold hover:bg-[#FAF7F5] flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الإشعار</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#9C5B5B] text-white text-xs font-semibold hover:bg-[#8A4C4C]"
                >
                  العودة للمتجر
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {submitError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#361E1C] border-b border-[#E8C4C4]/40 pb-1.5">
                  1. معلومات المستلمة والتوصيل
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                      الاسم الكامل <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: ريم العلي"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                      رقم الهاتف / الواتساب <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="09XXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B] text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                      المحافظة / المدينة <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                    >
                      {SYRIAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                      العنوان التفصيلي أو فرع القدموس <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="اسم الحي أو فرع القدموس المفضل للاستلام"
                      value={detailedAddress}
                      onChange={(e) => setDetailedAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A2E2B] block mb-1">
                    ملاحظات إضافية على الطلب أو القياس (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="أي توضيحات للمصممة أو وقت محدد للتسليم..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#361E1C] border-b border-[#E8C4C4]/40 pb-1.5 flex items-center justify-between">
                  <span>2. طريقة الشحن (شركة القدموس)</span>
                  <span className="text-[11px] text-[#9C5B5B] font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>تغطية سورية شاملة</span>
                  </span>
                </h3>

                <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E8C4C4]/40 text-xs space-y-1.5 text-[#6C5551]">
                  <p className="font-semibold text-[#361E1C]">
                    يتم شحن طلبكِ عبر أمانات شركة القدموس للنقل الداخلي.
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    ملاحظة الشحن: أجور النقل لشركة القدموس تُسدد من قبل المستلمة عند الاستلام مباشرة، ولا يتم تحصيل أي رسوم شحن غير مؤكدة مسبقاً في الفاتورة.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#361E1C] border-b border-[#E8C4C4]/40 pb-1.5 flex items-center justify-between">
                  <span>3. طريقة الدفع (شام كاش - تحويل يدوي)</span>
                  <span className="text-[11px] text-[#E5B869] font-bold bg-[#361E1C] px-2 py-0.5 rounded">
                    شام كاش اليدوي
                  </span>
                </h3>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5 text-xs text-amber-950">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <CreditCard className="w-4 h-4 text-amber-700" />
                    <span>تعليمات التحويل عبر شام كاش:</span>
                  </div>

                  {settings.shamCashPhone && settings.shamCashRecipientName ? (
                    <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1 font-mono">
                      <div><span className="text-amber-800 font-sans">رقم الحساب / الهاتف: </span><strong>{settings.shamCashPhone}</strong></div>
                      <div><span className="text-amber-800 font-sans">اسم المستفيد: </span><strong>{settings.shamCashRecipientName}</strong></div>
                    </div>
                  ) : (
                    <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
                      {settings.shamCashInstructions || 'تعليمات ورقم حساب شام كاش الرسمي قيد الإعداد والاعتماد من الإدارة. يمكنكِ إتمام الطلب وسيتواصل معكِ فريق المتجر برقم الحساب المعتمد فوراً لمطابقة التحويل.'}
                    </div>
                  )}

                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-bold text-[#361E1C] block">
                      رقم مرجع التحويل في شام كاش (إن قمتِ بالتحويل مسبقاً):
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: رقم العملية 849204..."
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-300 text-xs text-[#361E1C] outline-hidden focus:border-[#9C5B5B]"
                    />
                    <p className="text-[10px] text-amber-800 flex items-center gap-1 mt-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>تنبيه أمان: إدخال الرقم يسجل الطلب بحالة «بانتظار التحقق من الدفع»، وتتم المراجعة اليدوية قبل تأكيد التجهيز.</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E8C4C4]/50 space-y-2 text-xs">
                <div className="flex justify-between items-center text-sm font-bold text-[#361E1C]">
                  <span>إجمالي المنتجات ({items.length} قطعة):</span>
                  <span className="text-base text-[#9C5B5B] font-extrabold">{formatSYP(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#8C6D68]">
                  <span>أجور شحن شركة القدموس:</span>
                  <span>تُدفع عند الاستلام للقدموس</span>
                </div>
                <div className="pt-2 border-t border-[#E8C4C4]/40 flex justify-between items-center text-sm font-black text-[#361E1C]">
                  <span>المبلغ المطلوب تحويله:</span>
                  <span className="text-lg text-[#361E1C]">{formatSYP(subtotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-linear-to-r from-[#9C5B5B] to-[#7D4242] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#9C5B5B]/25 hover:from-[#8A4C4C] hover:to-[#6C3636] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري حفظ الطلب في السحابة...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-[#E5B869]" />
                    <span>تأكيد وإرسال الطلب الآن</span>
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
