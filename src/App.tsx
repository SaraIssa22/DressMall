import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductsSection } from './components/ProductsSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { DesignersSection } from './components/DesignersSection';
import { HowItWorks } from './components/HowItWorks';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomTailoringModal } from './components/CustomTailoringModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

import { Product, Category, Designer, StoreSettings } from './types';
import { storeService } from './services/storeService';
import { testConnection } from './firebase';
import { INITIAL_STORE_SETTINGS } from './data/initialData';
import { Loader2, Sparkles } from 'lucide-react';

const MainStoreContent: React.FC = () => {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDesignerForCustom, setSelectedDesignerForCustom] = useState<Designer | null>(null);

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadStoreData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats, des, sets] = await Promise.all([
        storeService.getProducts(),
        storeService.getCategories(),
        storeService.getDesigners(),
        storeService.getSettings(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setDesigners(des);
      setStoreSettings(sets);
    } catch (err) {
      console.warn('Error loading store data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
    loadStoreData();
  }, []);

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickAddToCart = (product: Product) => {
    const defaultSize = product.sizes[0] || '38 (M)';
    const defaultColor = product.colors[0] || 'أساسي';
    addToCart(product, defaultSize, defaultColor, 1);
    showToast(`تمت إضافة "${product.name}" إلى السلة`);
  };

  const handleSelectDesignerForCustom = (designer: Designer) => {
    setSelectedDesignerForCustom(designer);
    setIsCustomModalOpen(true);
  };

  const handleFilterByDesigner = (_designerName: string) => {
    handleNavigateSection('products');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5] text-[#2D2424] selection:bg-[#E8C4C4] selection:text-[#3A2323]">
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-60 bg-[#361E1C] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#E8C4C4]/30 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-[#E5B869]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Header
        onOpenCustomModal={() => {
          setSelectedDesignerForCustom(null);
          setIsCustomModalOpen(true);
        }}
        onOpenTrackerModal={() => setIsTrackerModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onNavigateSection={handleNavigateSection}
        selectedCategorySlug={selectedCategoryId}
        onSelectCategorySlug={(catId) => {
          setSelectedCategoryId(catId);
          handleNavigateSection('products');
        }}
      />

      <main className="flex-1">
        {isLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#9C5B5B] animate-spin" />
            <p className="text-sm font-bold text-[#6C5551]">جاري تجهيز تشكيلات DressMallAI...</p>
          </div>
        ) : (
          <>
            <Hero
              onExploreProducts={() => handleNavigateSection('products')}
              onOpenCustomModal={() => {
                setSelectedDesignerForCustom(null);
                setIsCustomModalOpen(true);
              }}
            />

            <CategoriesSection
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={(catId) => {
                setSelectedCategoryId(catId);
                handleNavigateSection('products');
              }}
              onOpenCustomModal={() => {
                setSelectedDesignerForCustom(null);
                setIsCustomModalOpen(true);
              }}
            />

            <ProductsSection
              products={products}
              categories={categories}
              designers={designers}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              onProductClick={(p) => setSelectedProduct(p)}
              onQuickAddToCart={handleQuickAddToCart}
            />

            <DesignersSection
              designers={designers}
              onSelectDesignerForCustom={handleSelectDesignerForCustom}
              onFilterByDesigner={handleFilterByDesigner}
            />

            <HowItWorks />
          </>
        )}
      </main>

      <Footer
        onOpenCustomModal={() => {
          setSelectedDesignerForCustom(null);
          setIsCustomModalOpen(true);
        }}
        onOpenTrackerModal={() => setIsTrackerModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onProceedToCheckout={() => setIsCheckoutModalOpen(true)}
      />

      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutModalOpen(true)}
        onExploreProducts={() => handleNavigateSection('products')}
      />

      <WishlistDrawer
        onSelectProduct={(p) => setSelectedProduct(p)}
        onQuickAddToCart={handleQuickAddToCart}
        onExploreProducts={() => handleNavigateSection('products')}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        settings={storeSettings}
      />

      <CustomTailoringModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        designers={designers}
        preselectedDesigner={selectedDesignerForCustom}
      />

      <OrderTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
      />

      <AdminDashboard
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        categories={categories}
        designers={designers}
        onDataMutated={loadStoreData}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <MainStoreContent />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
