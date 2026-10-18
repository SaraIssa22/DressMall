import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  ClipboardList, 
  ShieldCheck, 
  Scissors, 
  Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

interface HeaderProps {
  onOpenCustomModal: () => void;
  onOpenTrackerModal: () => void;
  onOpenAdminModal: () => void;
  onNavigateSection: (sectionId: string) => void;
  selectedCategorySlug?: string | null;
  onSelectCategorySlug?: (slug: string | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCustomModal,
  onOpenTrackerModal,
  onOpenAdminModal,
  onNavigateSection,
  selectedCategorySlug = null,
  onSelectCategorySlug,
}) => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchOpen, setSearchOpen] = useState(false);

  const navTabs = [
    { id: 'home', label: 'الرئيسية', action: () => { setActiveTab('home'); onNavigateSection('hero'); if (onSelectCategorySlug) onSelectCategorySlug(null); } },
    { id: 'designers', label: 'المصممات', action: () => { setActiveTab('designers'); onNavigateSection('designers'); } },
    { id: 'evening', label: 'فساتين السهرة', action: () => { setActiveTab('evening'); onNavigateSection('products'); if (onSelectCategorySlug) onSelectCategorySlug('cat-evening'); } },
    { id: 'daily', label: 'الفساتين اليومية', action: () => { setActiveTab('daily'); onNavigateSection('products'); if (onSelectCategorySlug) onSelectCategorySlug('cat-daily'); } },
    { id: 'wedding', label: 'فساتين الزفاف', action: () => { setActiveTab('wedding'); onNavigateSection('products'); if (onSelectCategorySlug) onSelectCategorySlug('cat-wedding'); } },
    { id: 'modest', label: 'الفساتين المحتشمة', action: () => { setActiveTab('modest'); onNavigateSection('products'); if (onSelectCategorySlug) onSelectCategorySlug('cat-modest'); } },
    { id: 'custom', label: 'تفصيل مخصص', action: () => { setActiveTab('custom'); onOpenCustomModal(); } },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#F0EAE7] shadow-xs">
      
      {/* Top Header Row: Logo & Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4">
          
          {/* Right side (RTL): Brand Logo & Subtitle */}
          <div 
            onClick={() => {
              setActiveTab('home');
              onNavigateSection('hero');
            }}
            className="flex flex-col cursor-pointer select-none text-right group"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-normal font-serif-luxury text-[#2C2120] tracking-tight">
                DressMall
              </span>
              <span className="text-sm sm:text-base font-medium text-[#A75D67]">
                AI
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#8E7E7B] font-light mt-0.5">
              اختاري تصميمكِ، ودعي أناقتكِ تُفصّل خصيصاً لكِ
            </p>
          </div>

          {/* Left side (RTL): Action Icons (Search, Heart/Wishlist, Cart, Orders/Clipboard, Admin) */}
          <div className="flex items-center gap-1.5 sm:gap-3 text-[#4A3D3B]">
            
            {/* Search */}
            <button
              onClick={() => {
                onNavigateSection('products');
                const searchEl = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (searchEl) searchEl.focus();
              }}
              title="بحث"
              className="p-2 rounded-full hover:bg-[#FAF7F5] transition-colors relative"
            >
              <Search className="w-5 h-5 text-[#4A3D3B] stroke-[1.75]" />
            </button>

            {/* Wishlist / Favorites with Badge */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              title="قائمة فساتينكِ المفضلة"
              aria-label="قائمة المفضلة"
              className="p-2 rounded-full hover:bg-[#FAF7F5] transition-colors relative cursor-pointer"
            >
              <Heart 
                className={`w-5 h-5 stroke-[1.75] transition-colors ${
                  wishlistCount > 0 ? 'text-[#A75D67] fill-[#A75D67]/20' : 'text-[#4A3D3B]'
                }`} 
              />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#A75D67] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium shadow-xs animate-in zoom-in-50">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              title="سلة المشتريات"
              className="p-2 rounded-full hover:bg-[#FAF7F5] transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5 text-[#4A3D3B] stroke-[1.75]" />
              {totalItemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#A75D67] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Orders / Clipboard Tracker */}
            <button
              onClick={onOpenTrackerModal}
              title="متابعة الطلبات"
              className="p-2 rounded-full hover:bg-[#FAF7F5] transition-colors relative"
            >
              <ClipboardList className="w-5 h-5 text-[#4A3D3B] stroke-[1.75]" />
              <span className="absolute top-0.5 right-0.5 bg-[#A75D67] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium shadow-xs">
                1
              </span>
            </button>

            {/* Admin Shield */}
            <button
              onClick={onOpenAdminModal}
              title={isAdmin ? 'لوحة الإدارة' : 'دخول الإدارة'}
              className={`p-1.5 rounded-full border transition-all ${
                isAdmin 
                  ? 'border-[#A75D67] bg-[#A75D67]/10 text-[#A75D67]' 
                  : 'border-transparent text-[#8E7E7B] hover:bg-[#FAF7F5]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
            </button>

          </div>
        </div>
      </div>

      {/* Second Row: Horizontal Nav Tabs (Side-by-side in single scrollable row, never stacked vertically) */}
      <div className="border-t border-[#F2ECE9] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav 
            className="flex items-center gap-6 sm:gap-8 overflow-x-auto py-2.5 scrollbar-none whitespace-nowrap text-xs sm:text-sm font-normal"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={tab.action}
                  className={`relative py-1 transition-colors shrink-0 ${
                    isActive 
                      ? 'text-[#A75D67] font-medium' 
                      : 'text-[#61514F] hover:text-[#2C2120]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-2.5 right-0 left-0 h-[2px] bg-[#A75D67] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

    </header>
  );
};
