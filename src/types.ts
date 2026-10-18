export type DressCategorySlug = 
  | 'wedding' 
  | 'evening' 
  | 'daily' 
  | 'modest' 
  | 'custom';

export interface Category {
  id: string;
  name: string;
  slug: DressCategorySlug;
  description: string;
  image: string;
  order: number;
}

export interface Designer {
  id: string;
  name: string;
  title: string;
  bio: string;
  coverageArea: string;
  avatar: string;
  specialty: string;
  featuredDesigns?: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  designerId: string;
  designerName: string;
  priceSYP: number;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  estimatedDays: string;
  isCustomTailorable: boolean;
  isPublished: boolean;
  featured: boolean;
  fabricDetails?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  priceSYP: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  isCustomSize?: boolean;
  customMeasurementsNotes?: string;
}

export type OrderStatus = 
  | 'new'
  | 'pending_payment_verification'
  | 'pending_confirmation'
  | 'in_tailoring_preparation'
  | 'ready_for_shipping'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending_verification'
  | 'verified'
  | 'rejected'
  | 'needs_review';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  detailedAddress: string;
  customerNotes?: string;
  items: CartItem[];
  paymentMethod: 'sham_cash' | 'cash_on_delivery';
  paymentReference?: string;
  paymentStatus: PaymentStatus;
  shippingMethod: 'qadmous';
  shippingCost: number; // 0 if paid directly to Qadmous on receipt
  subtotal: number;
  total: number;
  status: OrderStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CustomRequestStatus =
  | 'new'
  | 'under_review'
  | 'quoted'
  | 'accepted'
  | 'in_production'
  | 'completed'
  | 'cancelled';

export interface CustomTailoringRequest {
  id: string;
  requestNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  eventType: string;
  dressType: string;
  preferredDesignerId?: string;
  preferredDesignerName?: string;
  usualSize?: string;
  heightCm?: string;
  bustCm?: string;
  waistCm?: string;
  hipsCm?: string;
  measurementNotes?: string;
  preferredColor?: string;
  fabricNotes?: string;
  designDescription: string;
  eventDate?: string;
  referenceImageUrl?: string;
  status: CustomRequestStatus;
  quotedPriceSYP?: number;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface QadmousCityRate {
  city: string;
  costSYP: number;
  estimatedDays: string;
  isAvailable: boolean;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  slogan: string;
  ownerName: string;
  contactEmail: string;
  currency: string;
  // Sham Cash settings
  shamCashActive: boolean;
  shamCashPhone?: string;
  shamCashRecipientName?: string;
  shamCashInstructions?: string;
  // Qadmous shipping settings
  qadmousActive: boolean;
  qadmousInstructions?: string;
  qadmousCities: QadmousCityRate[];
  announcement?: string;
  initialPricesDisclaimer: string;
}
