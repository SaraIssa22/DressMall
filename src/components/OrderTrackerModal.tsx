import React, { useState } from 'react';
import { storeService, formatSYP } from '../services/storeService';
import { Order, CustomTailoringRequest } from '../types';
import { 
  X, 
  Search, 
  Compass, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [foundCustomRequest, setFoundCustomRequest] = useState<CustomTailoringRequest | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) return;

    setIsSearching(true);
    setSearchError(null);
    setFoundOrder(null);
    setFoundCustomRequest(null);

    try {
      if (clean.startsWith('CR-')) {
        const req = await storeService.findCustomRequestByNumber(clean);
        if (req) {
          setFoundCustomRequest(req);
        } else {
          setSearchError(`لم يتم العثور على طلب تفصيل بالرقم "${clean}". يرجى التأكد من الرمز.`);
        }
      } else {
        const ord = await storeService.findOrderByNumber(clean);
        if (ord) {
          setFoundOrder(ord);
        } else {
          const altReq = await storeService.findCustomRequestByNumber(clean);
          if (altReq) {
            setFoundCustomRequest(altReq);
          } else {
            setSearchError(`لم نجد طلباً مسجلاً بالرقم "${clean}". يرجى التحقق من الرقم المدون في إشعار الطلب.`);
          }
        }
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setSearchError('تعذر الاستعلام من السحابة حالياً. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSearching(false);
    }
  };

  const getOrderStatusArabic = (status: Order['status']): { label: string; color: string } => {
    switch (status) {
      case 'new':
        return { label: 'جديد (قيد الاستلام)', color: 'bg-blue-100 text-blue-800' };
      case 'pending_payment_verification':
        return { label: 'بانتظار التحقق من تحويل شام كاش', color: 'bg-amber-100 text-amber-800' };
      case 'pending_confirmation':
        return { label: 'قيد التأكيد والمطابقة', color: 'bg-purple-100 text-purple-800' };
      case 'in_tailoring_preparation':
        return { label: 'قيد التجهيز أو التفصيل', color: 'bg-indigo-100 text-indigo-800' };
      case 'ready_for_shipping':
        return { label: 'جاهز للشحن (في علبة التغليف)', color: 'bg-cyan-100 text-cyan-800' };
      case 'shipped':
        return { label: 'تم الشحن عبر شركة القدموس', color: 'bg-emerald-100 text-emerald-800' };
      case 'completed':
        return { label: 'مكتمل وتم التسليم', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { label: 'ملغى', color: 'bg-rose-100 text-rose-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getCustomStatusArabic = (status: CustomTailoringRequest['status']): { label: string; color: string } => {
    switch (status) {
      case 'new':
        return { label: 'طلب جديد (قيد الاطلاع)', color: 'bg-blue-100 text-blue-800' };
      case 'under_review':
        return { label: 'قيد المراجعة الفنية ودراسة القياسات', color: 'bg-amber-100 text-amber-800' };
      case 'quoted':
        return { label: 'تم تحديد عرض السعر وموعد التنفيذ', color: 'bg-purple-100 text-purple-800' };
      case 'accepted':
        return { label: 'تم الاعتماد وبدء التنفيذ', color: 'bg-emerald-100 text-emerald-800' };
      case 'in_production':
        return { label: 'قيد الحياكة والتطريز اليدوي', color: 'bg-indigo-100 text-indigo-800' };
      case 'completed':
        return { label: 'جاهز أو تم التسليم', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { label: 'ملغى', color: 'bg-rose-100 text-rose-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-[#E8C4C4]/50 my-6 relative text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-[#FAF7F5] border-b border-[#E8C4C4]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#9C5B5B] text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5 text-[#E5B869]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#361E1C] font-serif-luxury">
                تتبع حالة طلبكِ
              </h2>
              <p className="text-xs text-[#8C6D68]">استعلام فوري ومباشر من قاعدة البيانات السحابية</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6C5551] hover:bg-[#E8C4C4]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="text-xs font-bold text-[#361E1C] block">
              أدخلي رقم الطلب (مثال: DM-2026-12345 أو CR-2026-12345):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="DM-XXXX-XXXXX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-[#FAF7F5] border border-[#E8C4C4]/60 text-sm font-mono text-[#361E1C] outline-hidden focus:border-[#9C5B5B] uppercase text-right"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 rounded-2xl bg-[#9C5B5B] text-white font-bold text-xs sm:text-sm hover:bg-[#8A4C4C] transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>استعلام</span>
              </button>
            </div>
          </form>

          {searchError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {foundOrder && (
            <div className="bg-[#FAF7F5] rounded-3xl p-5 border border-[#E8C4C4]/50 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8C4C4]/40">
                <div>
                  <span className="text-[10px] text-[#8C6D68] block">طلب فستان من المتجر</span>
                  <span className="text-base font-mono font-extrabold text-[#9C5B5B]">
                    {foundOrder.orderNumber}
                  </span>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${getOrderStatusArabic(foundOrder.status).color}`}>
                  {getOrderStatusArabic(foundOrder.status).label}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#E8C4C4]/20">
                  <span className="text-[#8C6D68]">المستلمة:</span>
                  <span className="font-bold text-[#361E1C]">{foundOrder.customerName} ({foundOrder.city})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8C4C4]/20">
                  <span className="text-[#8C6D68]">إجمالي القيمة:</span>
                  <span className="font-extrabold text-[#361E1C]">{formatSYP(foundOrder.total)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8C4C4]/20">
                  <span className="text-[#8C6D68]">طريقة الشحن:</span>
                  <span className="font-medium text-[#361E1C]">شركة القدموس (تسليم بالفرع / العنوان)</span>
                </div>
                {foundOrder.paymentReference && (
                  <div className="flex justify-between py-1 border-b border-[#E8C4C4]/20">
                    <span className="text-[#8C6D68]">مرجع تحويل شام كاش:</span>
                    <span className="font-mono font-bold text-[#361E1C]">{foundOrder.paymentReference}</span>
                  </div>
                )}
                {foundOrder.adminNotes && (
                  <div className="p-3 rounded-xl bg-white border border-[#E8C4C4]/40 text-xs text-[#4A2E2B] mt-2">
                    <strong className="block text-[11px] text-[#9C5B5B] mb-0.5">تحديث من إدارة المتجر:</strong>
                    {foundOrder.adminNotes}
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-[#361E1C] block mb-2">القطع المطلوبة:</span>
                <div className="space-y-1.5">
                  {foundOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-xs bg-white p-2.5 rounded-xl border border-[#E8C4C4]/30">
                      <span>{it.name} ({it.size} - {it.color})</span>
                      <span className="font-bold">x{it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {foundCustomRequest && (
            <div className="bg-[#FAF7F5] rounded-3xl p-5 border border-[#E8C4C4]/50 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8C4C4]/40">
                <div>
                  <span className="text-[10px] text-[#8C6D68] block">طلب تفصيل خاص</span>
                  <span className="text-base font-mono font-extrabold text-[#9C5B5B]">
                    {foundCustomRequest.requestNumber}
                  </span>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${getCustomStatusArabic(foundCustomRequest.status).color}`}>
                  {getCustomStatusArabic(foundCustomRequest.status).label}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#E8C4C4]/20">
                  <span className="text-[#8C6D68]">المصممة المختارة:</span>
                  <span className="font-bold text-[#361E1C]">{foundCustomRequest.preferredDesignerName || 'أي مصممة متفرغة'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8C4C4]/20">
                  <span className="text-[#8C6D68]">نوع الفستان:</span>
                  <span className="font-bold text-[#361E1C]">{foundCustomRequest.dressType}</span>
                </div>
                {foundCustomRequest.quotedPriceSYP ? (
                  <div className="flex justify-between py-1 border-b border-[#E8C4C4]/20 bg-emerald-50/50 p-2 rounded-lg">
                    <span className="text-emerald-800 font-bold">عرض السعر المعتمد:</span>
                    <span className="font-black text-emerald-900">{formatSYP(foundCustomRequest.quotedPriceSYP)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between py-1 border-b border-[#E8C4C4]/20">
                    <span className="text-[#8C6D68]">التسعير:</span>
                    <span className="text-amber-700 font-semibold">بانتظار دراسة القياسات من المصممة</span>
                  </div>
                )}
                {foundCustomRequest.adminNotes && (
                  <div className="p-3 rounded-xl bg-white border border-[#E8C4C4]/40 text-xs text-[#4A2E2B] mt-2">
                    <strong className="block text-[11px] text-[#9C5B5B] mb-0.5">ملاحظات المصممة والإدارة:</strong>
                    {foundCustomRequest.adminNotes}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
