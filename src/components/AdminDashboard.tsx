import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Order, 
  CustomTailoringRequest, 
  Product, 
  Category, 
  Designer, 
  StoreSettings, 
  OrderStatus, 
  PaymentStatus, 
  CustomRequestStatus 
} from '../types';
import { storeService, formatSYP } from '../services/storeService';
import { 
  X, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  Package, 
  Scissors, 
  Layers, 
  Settings as SettingsIcon, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  Truck, 
  Search, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  Loader2, 
  RefreshCw, 
  User, 
  Sparkles 
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  designers: Designer[];
  onDataMutated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  categories,
  designers,
  onDataMutated,
}) => {
  const { currentUser, isAdmin, isLoading: authLoading, loginWithGoogle, logout, authorizedAdminEmail } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'custom' | 'products' | 'settings' | 'seed'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomTailoringRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadAllAdminData();
    }
  }, [isOpen, isAdmin]);

  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      const [ordList, reqList, prodList, sets] = await Promise.all([
        storeService.getAdminOrders().catch(() => []),
        storeService.getAdminCustomRequests().catch(() => []),
        storeService.getAllProductsAdmin().catch(() => []),
        storeService.getSettings(),
      ]);
      setOrders(ordList);
      setCustomRequests(reqList);
      setProducts(prodList);
      setStoreSettings(sets);
    } catch (err: any) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const triggerToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleUpdateOrderStatus = async (
    orderId: string, 
    status: OrderStatus, 
    paymentStatus: PaymentStatus, 
    notes?: string
  ) => {
    try {
      await storeService.updateOrderStatus(orderId, status, paymentStatus, notes);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, paymentStatus, adminNotes: notes } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status, paymentStatus, adminNotes: notes } : null);
      }
      triggerToast('تم تحديث حالة الطلب والدفع بنجاح في السحابة.');
      onDataMutated();
    } catch (err: any) {
      setActionError('فشل تحديث حالة الطلب: ' + err.message);
    }
  };

  const handleUpdateCustomReq = async (
    requestId: string, 
    status: CustomRequestStatus, 
    price?: number, 
    notes?: string
  ) => {
    try {
      await storeService.updateCustomRequestStatus(requestId, status, price, notes);
      setCustomRequests(prev => prev.map(r => r.id === requestId ? { ...r, status, quotedPriceSYP: price, adminNotes: notes } : r));
      triggerToast('تم تحديث حالة طلب التفصيل وعرض السعر بنجاح.');
      onDataMutated();
    } catch (err: any) {
      setActionError('فشل تحديث طلب التفصيل: ' + err.message);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await storeService.saveProduct(editingProduct);
      setProducts(prev => {
        const idx = prev.findIndex(p => p.id === editingProduct.id);
        if (idx > -1) {
          const next = [...prev];
          next[idx] = editingProduct;
          return next;
        }
        return [editingProduct, ...prev];
      });
      setEditingProduct(null);
      triggerToast('تم حفظ الفستان بنجاح في قاعدة البيانات.');
      onDataMutated();
    } catch (err: any) {
      setActionError('فشل حفظ الفستان: ' + err.message);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('هل أنتِ متأكدة من رغبتكِ في حذف هذا الفستان؟')) return;
    try {
      await storeService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      triggerToast('تم حذف الفستان من الكتالوج بنجاح.');
      onDataMutated();
    } catch (err: any) {
      setActionError('فشل حذف الفستان: ' + err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeSettings) return;

    try {
      await storeService.saveSettings(storeSettings);
      triggerToast('تم تحديث إعدادات المتجر وبيانات شام كاش والقدموس بنجاح.');
      onDataMutated();
    } catch (err: any) {
      setActionError('فشل حفظ الإعدادات: ' + err.message);
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm('سيتم مزامنة وتهيئة الكتالوج الأولي في Cloud Firestore. هل تودين المتابعة؟')) return;
    setLoadingData(true);
    try {
      const res = await storeService.seedInitialCatalog(true);
      if (res.success) {
        triggerToast(res.message);
        await loadAllAdminData();
        onDataMutated();
      } else {
        setActionError(res.message);
      }
    } catch (err: any) {
      setActionError('فشلت المزامنة: ' + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-6xl min-h-[600px] overflow-hidden shadow-2xl border border-[#E8C4C4]/50 my-6 relative flex flex-col text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 bg-[#361E1C] text-white flex items-center justify-between border-b border-[#E8C4C4]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5B869] text-[#261413] flex items-center justify-center shadow-md font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif-luxury">لوحة إدارة DressMallAI</h2>
                <span className="text-[10px] bg-white/20 text-[#FAF7F5] px-2 py-0.5 rounded-full">
                  التحكم السحابي
                </span>
              </div>
              <p className="text-xs text-[#E8C4C4]/80">المديرة المعتمدة: Sara Issa ({authorizedAdminEmail})</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#E8C4C4]/90 bg-white/10 px-3 py-1.5 rounded-full">
                <User className="w-3.5 h-3.5 text-[#E5B869]" />
                <span>{currentUser.email}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/80 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isAdmin ? (
          <div className="flex-1 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#FAF7F5] border-2 border-[#E8C4C4] flex items-center justify-center text-[#9C5B5B] shadow-inner">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="text-2xl font-bold text-[#361E1C] font-serif-luxury">
                تسجيل دخول الإدارة المحمية
              </h3>
              <p className="text-xs sm:text-sm text-[#6C5551] leading-relaxed">
                هذه البوابة مخصصة حصرياً لصاحبة المتجر الافتراضي <strong>Sara Issa</strong> لإدارة الطلبات والأسعار وحسابات شام كاش عبر Firebase Authentication.
              </p>
            </div>

            {currentUser && !isAdmin && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs max-w-md">
                أنتِ مسجلة حالياً بالبريد <strong>{currentUser.email}</strong>، وهذا الحساب غير مصرح له بصلاحيات الإدارة. يرجى التبديل إلى حساب <strong>{authorizedAdminEmail}</strong>.
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={loginWithGoogle}
                disabled={authLoading}
                className="px-8 py-3.5 rounded-2xl bg-linear-to-r from-[#9C5B5B] to-[#7D4242] text-white font-bold text-sm shadow-md hover:from-[#8A4C4C] hover:to-[#6C3636] transition-all flex items-center justify-center gap-2.5"
              >
                {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5 text-[#E5B869]" />}
                <span>تسجيل الدخول عبر Google ({authorizedAdminEmail})</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {actionSuccess && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{actionSuccess}</span>
              </div>
            )}
            {actionError && (
              <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="p-5 bg-[#FAF7F5] border-b border-[#E8C4C4]/40 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#E8C4C4]/50 shadow-xs">
                <span className="text-xs text-[#8C6D68] block">إجمالي طلبات الشراء</span>
                <span className="text-2xl font-black text-[#361E1C]">{orders.length}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E8C4C4]/50 shadow-xs">
                <span className="text-xs text-[#8C6D68] block">بانتظار التحقق (شام كاش)</span>
                <span className="text-2xl font-black text-amber-600">
                  {orders.filter(o => o.paymentStatus === 'pending_verification' && o.paymentReference).length}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E8C4C4]/50 shadow-xs">
                <span className="text-xs text-[#8C6D68] block">طلبات التفصيل المخصص</span>
                <span className="text-2xl font-black text-[#9C5B5B]">{customRequests.length}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E8C4C4]/50 shadow-xs">
                <span className="text-xs text-[#8C6D68] block">فساتين الكتالوج النشطة</span>
                <span className="text-2xl font-black text-[#361E1C]">{products.length}</span>
              </div>
            </div>

            <div className="flex border-b border-[#E8C4C4]/40 px-6 bg-white gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'orders' ? 'border-[#9C5B5B] text-[#9C5B5B]' : 'border-transparent text-[#6C5551] hover:text-[#361E1C]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>طلبات الشراء ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('custom')}
                className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'custom' ? 'border-[#9C5B5B] text-[#9C5B5B]' : 'border-transparent text-[#6C5551] hover:text-[#361E1C]'
                }`}
              >
                <Scissors className="w-4 h-4" />
                <span>طلبات التفصيل المخصص ({customRequests.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'products' ? 'border-[#9C5B5B] text-[#9C5B5B]' : 'border-transparent text-[#6C5551] hover:text-[#361E1C]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>إدارة الفساتين ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'settings' ? 'border-[#9C5B5B] text-[#9C5B5B]' : 'border-transparent text-[#6C5551] hover:text-[#361E1C]'
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                <span>إعدادات شام كاش والقدموس</span>
              </button>

              <button
                onClick={() => setActiveTab('seed')}
                className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'seed' ? 'border-[#9C5B5B] text-[#9C5B5B]' : 'border-transparent text-[#6C5551] hover:text-[#361E1C]'
                }`}
              >
                <Database className="w-4 h-4 text-[#C5A059]" />
                <span>مزامنة السحابة</span>
              </button>

              <div className="mr-auto self-center">
                <button
                  onClick={logout}
                  className="p-2 text-[#A38A86] hover:text-rose-600 transition-colors flex items-center gap-1 text-xs"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto max-h-[calc(85vh-200px)]">
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#FAF7F5] p-3 rounded-2xl border border-[#E8C4C4]/40">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-[#9C5B5B] absolute right-3 top-3" />
                      <input
                        type="text"
                        placeholder="ابحثي برقم الطلب، اسم العميلة، أو الهاتف..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full pl-3 pr-9 py-2 rounded-xl bg-white border border-[#E8C4C4]/50 text-xs text-[#361E1C] outline-hidden"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-white border border-[#E8C4C4]/50 text-xs text-[#361E1C] outline-hidden w-full"
                      >
                        <option value="all">كل الحالات</option>
                        <option value="pending_payment_verification">بانتظار التحقق من شام كاش</option>
                        <option value="new">جديد</option>
                        <option value="pending_confirmation">قيد التأكيد</option>
                        <option value="in_tailoring_preparation">قيد التجهيز أو التفصيل</option>
                        <option value="ready_for_shipping">جاهز للشحن</option>
                        <option value="shipped">تم الشحن عبر القدموس</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغى</option>
                      </select>

                      <button
                        onClick={loadAllAdminData}
                        title="تحديث البيانات"
                        className="p-2 rounded-xl bg-white border border-[#E8C4C4]/50 hover:bg-[#FAF7F5]"
                      >
                        <RefreshCw className="w-4 h-4 text-[#4A2E2B]" />
                      </button>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-16 bg-[#FAF7F5] rounded-3xl border border-[#E8C4C4]/40">
                      <Package className="w-12 h-12 text-[#C99E9E] mx-auto mb-2" />
                      <p className="text-sm font-bold text-[#361E1C]">لا توجد طلبات مسجلة بعد</p>
                      <p className="text-xs text-[#7C6360]">الطلبات التي يقدمها الزوار ستظهر هنا لحظياً ومحفوظة في Cloud Firestore</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-[#E8C4C4]/40">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-[#FAF7F5] text-[#361E1C] border-b border-[#E8C4C4]/40">
                          <tr>
                            <th className="p-3.5">رقم الطلب</th>
                            <th className="p-3.5">العميلة</th>
                            <th className="p-3.5">المدينة</th>
                            <th className="p-3.5">المنتجات</th>
                            <th className="p-3.5">المجموع</th>
                            <th className="p-3.5">شام كاش (المرجع)</th>
                            <th className="p-3.5">حالة الدفع</th>
                            <th className="p-3.5">حالة الطلب</th>
                            <th className="p-3.5 text-center">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8C4C4]/30">
                          {orders
                            .filter(o => {
                              if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
                              if (orderSearch.trim()) {
                                const q = orderSearch.toLowerCase();
                                return (
                                  o.orderNumber.toLowerCase().includes(q) ||
                                  o.customerName.toLowerCase().includes(q) ||
                                  o.customerPhone.includes(q)
                                );
                              }
                              return true;
                            })
                            .map((ord) => (
                              <tr key={ord.id} className="hover:bg-[#FAF7F5]/50 transition-colors">
                                <td className="p-3.5 font-mono font-bold text-[#9C5B5B]">{ord.orderNumber}</td>
                                <td className="p-3.5">
                                  <div className="font-bold text-[#361E1C]">{ord.customerName}</div>
                                  <div className="text-[10px] text-[#8C6D68] font-mono">{ord.customerPhone}</div>
                                </td>
                                <td className="p-3.5">{ord.city}</td>
                                <td className="p-3.5">
                                  <span className="font-semibold">{ord.items.length} قطع</span>
                                </td>
                                <td className="p-3.5 font-bold">{formatSYP(ord.total)}</td>
                                <td className="p-3.5 font-mono">
                                  {ord.paymentReference ? (
                                    <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-bold">
                                      {ord.paymentReference}
                                    </span>
                                  ) : (
                                    <span className="text-[#A38A86]">لم يدخل</span>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  <select
                                    value={ord.paymentStatus}
                                    onChange={(e) => handleUpdateOrderStatus(ord.id, ord.status, e.target.value as PaymentStatus, ord.adminNotes)}
                                    className="px-2 py-1 rounded-lg border text-[11px] font-semibold bg-white"
                                  >
                                    <option value="pending_verification">بانتظار التحقق</option>
                                    <option value="verified">تم التحقق ومطابقة الحوالة</option>
                                    <option value="rejected">مرفوض</option>
                                    <option value="needs_review">يحتاج إلى مراجعة</option>
                                  </select>
                                </td>
                                <td className="p-3.5">
                                  <select
                                    value={ord.status}
                                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus, ord.paymentStatus, ord.adminNotes)}
                                    className="px-2 py-1 rounded-lg border text-[11px] font-bold bg-white"
                                  >
                                    <option value="new">جديد</option>
                                    <option value="pending_payment_verification">بانتظار التحقق من الدفع</option>
                                    <option value="pending_confirmation">قيد التأكيد</option>
                                    <option value="in_tailoring_preparation">قيد التجهيز أو التفصيل</option>
                                    <option value="ready_for_shipping">جاهز للشحن</option>
                                    <option value="shipped">تم الشحن عبر القدموس</option>
                                    <option value="completed">مكتمل</option>
                                    <option value="cancelled">ملغى</option>
                                  </select>
                                </td>
                                <td className="p-3.5 text-center">
                                  <button
                                    onClick={() => setSelectedOrder(ord)}
                                    className="px-3 py-1 rounded-lg bg-[#9C5B5B] text-white hover:bg-[#8A4C4C] text-[11px] font-semibold"
                                  >
                                    تفاصيل
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {selectedOrder && (
                    <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto text-right">
                        <div className="flex justify-between items-center border-b pb-3">
                          <h3 className="font-bold text-base text-[#361E1C]">
                            تفاصيل الطلب: {selectedOrder.orderNumber}
                          </h3>
                          <button onClick={() => setSelectedOrder(null)}>
                            <X className="w-5 h-5 text-[#6C5551]" />
                          </button>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div><strong>الاسم:</strong> {selectedOrder.customerName}</div>
                          <div><strong>الهاتف:</strong> {selectedOrder.customerPhone}</div>
                          <div><strong>المدينة والعنوان:</strong> {selectedOrder.city} - {selectedOrder.detailedAddress}</div>
                          {selectedOrder.customerNotes && (
                            <div className="p-2.5 bg-[#FAF7F5] rounded-xl">
                              <strong>ملاحظات العميلة:</strong> {selectedOrder.customerNotes}
                            </div>
                          )}
                          {selectedOrder.paymentReference && (
                            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                              <strong>مرجع شام كاش المدخل:</strong> {selectedOrder.paymentReference}
                            </div>
                          )}
                        </div>

                        <div className="pt-2">
                          <strong className="text-xs block mb-1">القطع المطلوبة:</strong>
                          <div className="space-y-1.5">
                            {selectedOrder.items.map((it, i) => (
                              <div key={i} className="flex justify-between text-xs p-2 bg-[#FAF7F5] rounded-xl">
                                <span>{it.name} (مقاس {it.size} - لون {it.color})</span>
                                <span className="font-bold">{formatSYP(it.priceSYP * it.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="text-xs font-bold block mb-1">ملاحظات الإدارة للمستلمة:</label>
                          <textarea
                            rows={2}
                            defaultValue={selectedOrder.adminNotes || ''}
                            onBlur={(e) => handleUpdateOrderStatus(selectedOrder.id, selectedOrder.status, selectedOrder.paymentStatus, e.target.value)}
                            placeholder="تدوين ملاحظات المتابعة أو رقم بوليصة القدموس..."
                            className="w-full p-2.5 rounded-xl border border-[#E8C4C4]/60 text-xs outline-hidden"
                          />
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => setSelectedOrder(null)}
                            className="px-5 py-2 rounded-xl bg-[#9C5B5B] text-white text-xs font-semibold"
                          >
                            إغلاق
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'custom' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm text-[#361E1C]">طلبات تصميم وحياكة الفساتين حسب المقاس</h3>
                    <button
                      onClick={loadAllAdminData}
                      className="p-2 rounded-xl bg-[#FAF7F5] border hover:bg-[#E8C4C4]/30"
                    >
                      <RefreshCw className="w-4 h-4 text-[#4A2E2B]" />
                    </button>
                  </div>

                  {customRequests.length === 0 ? (
                    <div className="text-center py-16 bg-[#FAF7F5] rounded-3xl border border-[#E8C4C4]/40">
                      <Scissors className="w-12 h-12 text-[#C99E9E] mx-auto mb-2" />
                      <p className="text-sm font-bold text-[#361E1C]">لا توجد طلبات تفصيل مخصص حالياً</p>
                      <p className="text-xs text-[#7C6360]">أي طلب تفصيل يقدمه الزوار سيتم حفظه سحابياً وإدراجه هنا للدراسة والتسعير</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customRequests.map((req) => (
                        <div
                          key={req.id}
                          className="bg-white p-5 rounded-3xl border border-[#E8C4C4]/50 shadow-xs space-y-3"
                        >
                          <div className="flex justify-between items-start pb-2 border-b border-[#E8C4C4]/30">
                            <div>
                              <span className="text-[10px] text-[#8C6D68] block">طلب تفصيل خاص</span>
                              <span className="font-mono font-bold text-base text-[#9C5B5B]">{req.requestNumber}</span>
                            </div>
                            <select
                              value={req.status}
                              onChange={(e) => handleUpdateCustomReq(req.id, e.target.value as CustomRequestStatus, req.quotedPriceSYP, req.adminNotes)}
                              className="px-2 py-1 rounded-lg border text-xs font-bold bg-[#FAF7F5]"
                            >
                              <option value="new">جديد</option>
                              <option value="under_review">قيد المراجعة الفنية</option>
                              <option value="quoted">تم التسعير</option>
                              <option value="accepted">معتمد وبدء التنفيذ</option>
                              <option value="in_production">قيد الحياكة</option>
                              <option value="completed">مكتمل</option>
                              <option value="cancelled">ملغى</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div><strong>العميلة:</strong> {req.customerName}</div>
                            <div><strong>الهاتف:</strong> {req.customerPhone}</div>
                            <div><strong>المصممة:</strong> {req.preferredDesignerName || 'أي مصممة'}</div>
                            <div><strong>المدينة:</strong> {req.city}</div>
                            <div><strong>نوع الفستان:</strong> {req.dressType}</div>
                            <div><strong>المناسبة:</strong> {req.eventType}</div>
                          </div>

                          <div className="p-3 bg-[#FAF7F5] rounded-2xl border border-[#E8C4C4]/30 text-xs space-y-1">
                            <span className="font-bold text-[#9C5B5B] block">القياسات بالسنتيمتر:</span>
                            <div className="flex flex-wrap gap-2 text-[11px]">
                              <span>الصدر: {req.bustCm || '-'} سم</span> • 
                              <span>الخصر: {req.waistCm || '-'} سم</span> • 
                              <span>الورك: {req.hipsCm || '-'} سم</span> • 
                              <span>الطول: {req.heightCm || '-'} سم</span> • 
                              <span>المقاس: {req.usualSize || '-'}</span>
                            </div>
                          </div>

                          <div className="text-xs text-[#6C5551]">
                            <strong>وصف التصميم:</strong> {req.designDescription}
                          </div>

                          <div className="pt-2 border-t border-[#FAF7F5] flex items-center justify-between gap-3">
                            <div>
                              <span className="text-[10px] text-[#8C6D68] block">عرض السعر (ل.س):</span>
                              <input
                                type="number"
                                placeholder="أدخلي السعر..."
                                defaultValue={req.quotedPriceSYP || ''}
                                onBlur={(e) => handleUpdateCustomReq(req.id, req.status, Number(e.target.value) || undefined, req.adminNotes)}
                                className="w-32 px-2 py-1 rounded-lg border text-xs font-bold"
                              />
                            </div>

                            <input
                              type="text"
                              placeholder="ملاحظات المصممة..."
                              defaultValue={req.adminNotes || ''}
                              onBlur={(e) => handleUpdateCustomReq(req.id, req.status, req.quotedPriceSYP, e.target.value)}
                              className="flex-1 px-2 py-1 rounded-lg border text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-[#361E1C]">إدارة وتعديل الفساتين والأسعار</h3>
                    <button
                      onClick={() => {
                        setIsNewProduct(true);
                        setEditingProduct({
                          id: 'dm-prod-' + Date.now(),
                          name: '',
                          description: '',
                          categoryId: categories[0]?.id || 'cat-wedding',
                          categoryName: categories[0]?.name || 'فساتين الزفاف',
                          designerId: designers[0]?.id || 'designer-rana-issa',
                          designerName: designers[0]?.name || 'Rana Issa',
                          priceSYP: 1500000,
                          images: ['https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80'],
                          sizes: ['36 (S)', '38 (M)', '40 (L)', 'تفصيل حسب المقاس'],
                          colors: ['أبيض', 'عاجي'],
                          inStock: true,
                          estimatedDays: '7-10 أيام',
                          isCustomTailorable: true,
                          isPublished: true,
                          featured: false,
                          createdAt: new Date().toISOString(),
                        });
                      }}
                      className="px-4 py-2 rounded-xl bg-[#9C5B5B] text-white text-xs font-semibold hover:bg-[#8A4C4C] flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة فستان جديد</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white p-4 rounded-3xl border border-[#E8C4C4]/50 flex gap-3 relative shadow-xs"
                      >
                        <img
                          src={prod.images[0] || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=400&q=80'}
                          alt={prod.name}
                          className="w-20 h-28 object-cover rounded-2xl shrink-0"
                        />

                        <div className="flex-1 flex flex-col justify-between text-right">
                          <div>
                            <span className="text-[10px] text-[#8C6D68]">{prod.categoryName} • {prod.designerName}</span>
                            <h4 className="font-bold text-xs text-[#361E1C] line-clamp-1">{prod.name}</h4>
                            <span className="text-xs font-black text-[#9C5B5B] block mt-1">
                              {formatSYP(prod.priceSYP)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={() => {
                                setIsNewProduct(false);
                                setEditingProduct(prod);
                              }}
                              className="px-3 py-1 rounded-lg bg-[#FAF7F5] border text-[11px] font-semibold hover:bg-[#E8C4C4]/30 flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              <span>تعديل</span>
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1 text-rose-500 hover:text-rose-700"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {editingProduct && (
                    <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
                      <form
                        onSubmit={handleSaveProduct}
                        className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto text-right"
                      >
                        <div className="flex justify-between items-center border-b pb-3">
                          <h3 className="font-bold text-base text-[#361E1C]">
                            {isNewProduct ? 'إضافة فستان جديد' : 'تعديل الفستان والأسعار'}
                          </h3>
                          <button type="button" onClick={() => setEditingProduct(null)}>
                            <X className="w-5 h-5 text-[#6C5551]" />
                          </button>
                        </div>

                        <div>
                          <label className="text-xs font-bold block mb-1">اسم الفستان</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold block mb-1">القسم</label>
                            <select
                              value={editingProduct.categoryId}
                              onChange={(e) => {
                                const cat = categories.find(c => c.id === e.target.value);
                                setEditingProduct({
                                  ...editingProduct,
                                  categoryId: e.target.value,
                                  categoryName: cat ? cat.name : editingProduct.categoryName,
                                });
                              }}
                              className="w-full px-3 py-2 rounded-xl border text-xs"
                            >
                              {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-bold block mb-1">المصممة</label>
                            <select
                              value={editingProduct.designerId}
                              onChange={(e) => {
                                const des = designers.find(d => d.id === e.target.value);
                                setEditingProduct({
                                  ...editingProduct,
                                  designerId: e.target.value,
                                  designerName: des ? des.name : editingProduct.designerName,
                                });
                              }}
                              className="w-full px-3 py-2 rounded-xl border text-xs"
                            >
                              {designers.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold block mb-1">السعر بالليرة السورية (ل.س)</label>
                            <input
                              type="number"
                              required
                              value={editingProduct.priceSYP}
                              onChange={(e) => setEditingProduct({ ...editingProduct, priceSYP: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold block mb-1">مدة التنفيذ التقديرية</label>
                            <input
                              type="text"
                              value={editingProduct.estimatedDays}
                              onChange={(e) => setEditingProduct({ ...editingProduct, estimatedDays: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold block mb-1">وصف الفستان</label>
                          <textarea
                            rows={3}
                            value={editingProduct.description}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="w-full p-2.5 rounded-xl border text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold block mb-1">رابط الصورة الرئيسية</label>
                          <input
                            type="url"
                            dir="ltr"
                            value={editingProduct.images[0] || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value, ...editingProduct.images.slice(1)] })}
                            className="w-full px-3 py-2 rounded-xl border text-xs text-right"
                          />
                        </div>

                        <div className="flex items-center gap-4 text-xs font-bold">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingProduct.isPublished}
                              onChange={(e) => setEditingProduct({ ...editingProduct, isPublished: e.target.checked })}
                            />
                            <span>منشور في الموقع</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingProduct.featured}
                              onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                            />
                            <span>مميز في الواجهة</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingProduct.isCustomTailorable}
                              onChange={(e) => setEditingProduct({ ...editingProduct, isCustomTailorable: e.target.checked })}
                            />
                            <span>متاح للتفصيل المخصص</span>
                          </label>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(null)}
                            className="px-4 py-2 rounded-xl border text-xs"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 rounded-xl bg-[#9C5B5B] text-white text-xs font-bold"
                          >
                            حفظ الفستان
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && storeSettings && (
                <form onSubmit={handleSaveSettings} className="max-w-2xl mx-auto space-y-6">
                  <div className="space-y-3 bg-[#FAF7F5] p-5 rounded-3xl border border-[#E8C4C4]/40">
                    <h3 className="font-bold text-sm text-[#361E1C]">المعلومات الأساسية للمتجر</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block mb-1 text-[#6C5551]">الاسم التجاري</label>
                        <input
                          type="text"
                          value={storeSettings.storeName}
                          onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white border text-xs"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-[#6C5551]">البريد الإلكتروني للتواصل</label>
                        <input
                          type="email"
                          value={storeSettings.contactEmail}
                          onChange={(e) => setStoreSettings({ ...storeSettings, contactEmail: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white border text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 bg-amber-50/60 p-5 rounded-3xl border border-amber-200">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-amber-700" />
                      <h3 className="font-bold text-sm text-amber-950">بيانات تحويل «شام كاش» الرسمية</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block mb-1 text-amber-900 font-semibold">رقم حساب / هاتف شام كاش</label>
                        <input
                          type="text"
                          placeholder="مثال: 09XXXXXXXX"
                          value={storeSettings.shamCashPhone || ''}
                          onChange={(e) => setStoreSettings({ ...storeSettings, shamCashPhone: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white border border-amber-300 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-amber-900 font-semibold">اسم المستفيد المعتمد</label>
                        <input
                          type="text"
                          placeholder="مثال: Sara Issa"
                          value={storeSettings.shamCashRecipientName || ''}
                          onChange={(e) => setStoreSettings({ ...storeSettings, shamCashRecipientName: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white border border-amber-300 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 text-xs text-amber-900 font-semibold">تعليمات التحويل المعروضة للعميلات</label>
                      <textarea
                        rows={2}
                        value={storeSettings.shamCashInstructions || ''}
                        onChange={(e) => setStoreSettings({ ...storeSettings, shamCashInstructions: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white border border-amber-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 bg-[#FAF7F5] p-5 rounded-3xl border border-[#E8C4C4]/40">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#9C5B5B]" />
                      <h3 className="font-bold text-sm text-[#361E1C]">إعدادات شحن «شركة القدموس»</h3>
                    </div>

                    <div>
                      <label className="block mb-1 text-xs text-[#6C5551]">تعليمات الاستلام وسياسة الشحن</label>
                      <textarea
                        rows={2}
                        value={storeSettings.qadmousInstructions || ''}
                        onChange={(e) => setStoreSettings({ ...storeSettings, qadmousInstructions: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white border text-xs"
                      />
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-2xl bg-[#9C5B5B] text-white font-bold text-sm shadow-md hover:bg-[#8A4C4C] transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ الإعدادات في Cloud Firestore</span>
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'seed' && (
                <div className="max-w-xl mx-auto p-8 bg-[#FAF7F5] rounded-3xl border border-[#E8C4C4]/50 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#E5B869]/20 text-[#996D13] flex items-center justify-center mx-auto">
                    <Database className="w-8 h-8" />
                  </div>

                  <h3 className="text-lg font-bold text-[#361E1C]">
                    مزامنة وتهيئة البيانات التأسيسية في Cloud Firestore
                  </h3>

                  <p className="text-xs text-[#6C5551] leading-relaxed">
                    تقوم هذه الأداة بكتابة المنتجات الـ 8 الفاخرة، والمصممتين (Rana Issa و Rama Allan)، والأقسام الخمسة، وإعدادات المتجر العامة داخل قاعدة بيانات Cloud Firestore السحابية مباشرة.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={handleSeedDatabase}
                      disabled={loadingData}
                      className="px-8 py-3.5 rounded-2xl bg-linear-to-r from-[#9C5B5B] to-[#7D4242] text-white font-bold text-xs sm:text-sm shadow-lg hover:from-[#8A4C4C] hover:to-[#6C3636] transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-60"
                    >
                      {loadingData ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#E5B869]" />}
                      <span>بدء المزامنة السحابية الفورية الآن</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
