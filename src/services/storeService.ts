import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  Product, 
  Category, 
  Designer, 
  StoreSettings, 
  Order, 
  CustomTailoringRequest, 
  OrderStatus, 
  PaymentStatus, 
  CustomRequestStatus 
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_DESIGNERS, 
  INITIAL_PRODUCTS, 
  INITIAL_STORE_SETTINGS 
} from '../data/initialData';

// Format Syrian Pound currency
export function formatSYP(amount: number): string {
  return new Intl.NumberFormat('ar-SY').format(amount) + ' ل.س';
}

// Generate unique order/request code
export function generateReferenceCode(prefix: 'DM' | 'CR'): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${year}-${random}`;
}

export const storeService = {
  // Fetch store settings from Firestore or fallback to initial
  async getSettings(): Promise<StoreSettings> {
    const path = 'storeSettings';
    try {
      const docRef = doc(db, path, 'general');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as StoreSettings;
      }
      return INITIAL_STORE_SETTINGS;
    } catch (error) {
      console.warn('Could not load settings from Firestore, using initial defaults:', error);
      return INITIAL_STORE_SETTINGS;
    }
  },

  // Save store settings (Admin only)
  async saveSettings(settings: StoreSettings): Promise<void> {
    const path = 'storeSettings';
    try {
      const docRef = doc(db, path, 'general');
      await setDoc(docRef, {
        ...settings,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${path}/general`);
    }
  },

  // Fetch all categories
  async getCategories(): Promise<Category[]> {
    const path = 'categories';
    const cleanCategory = (c: Category): Category => {
      if (c.slug === 'modest' || c.id === 'cat-modest') {
        return { ...c, image: '/images/user_modest_dress_1.jpg' };
      }
      if (c.slug === 'daily' || c.id === 'cat-daily') {
        return { ...c, image: '/images/daily_dress_category_1792311556508.jpg' };
      }
      return c;
    };

    try {
      const snap = await getDocs(collection(db, path));
      if (!snap.empty) {
        const cats = snap.docs.map(d => cleanCategory(d.data() as Category));
        return cats.sort((a, b) => a.order - b.order);
      }
      return INITIAL_CATEGORIES.map(cleanCategory);
    } catch (error) {
      console.warn('Falling back to initial categories:', error);
      return INITIAL_CATEGORIES.map(cleanCategory);
    }
  },

  // Fetch all designers
  async getDesigners(): Promise<Designer[]> {
    const path = 'designers';
    try {
      const snap = await getDocs(collection(db, path));
      if (!snap.empty) {
        return snap.docs.map(d => d.data() as Designer);
      }
      return INITIAL_DESIGNERS;
    } catch (error) {
      console.warn('Falling back to initial designers:', error);
      return INITIAL_DESIGNERS;
    }
  },

  // Fetch products with image sanitization (ensuring rose flower photo is never shown and modest/daily use appropriate images)
  async getProducts(): Promise<Product[]> {
    const path = 'products';
    const cleanProduct = (p: Product): Product => {
      const rosePhotoId = 'photo-1518895949257-7621c3c786d7';
      const replacementDress = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80';
      
      // If modest dress, use user uploaded images
      if (p.categoryId === 'cat-modest') {
        const modestImages = p.id === 'dm-prod-006' 
          ? ['/images/user_modest_dress_2.jpg', '/images/user_modest_dress_1.jpg']
          : ['/images/user_modest_dress_1.jpg', '/images/user_modest_dress_2.jpg'];
        return {
          ...p,
          images: modestImages,
        };
      }

      // If daily dress, use newly generated tailored daily dress images
      if (p.categoryId === 'cat-daily') {
        const dailyImages = p.id === 'dm-prod-004'
          ? ['/images/daily_linen_dress_1792311555699.jpg', '/images/daily_shirtdress_chic_1792311557062.jpg']
          : ['/images/daily_cotton_dress_1792311556565.jpg', '/images/daily_dress_category_1792311556508.jpg'];
        return {
          ...p,
          images: dailyImages,
        };
      }

      return {
        ...p,
        images: (p.images || []).map(img => img.includes(rosePhotoId) ? replacementDress : img),
      };
    };

    try {
      const snap = await getDocs(collection(db, path));
      if (!snap.empty) {
        const products = snap.docs.map(d => cleanProduct(d.data() as Product));
        return products.filter(p => p.isPublished !== false);
      }
      return INITIAL_PRODUCTS.map(cleanProduct);
    } catch (error) {
      console.warn('Falling back to initial products:', error);
      return INITIAL_PRODUCTS.map(cleanProduct);
    }
  },

  // Admin get all products including unpublished
  async getAllProductsAdmin(): Promise<Product[]> {
    const path = 'products';
    const cleanProduct = (p: Product): Product => {
      const rosePhotoId = 'photo-1518895949257-7621c3c786d7';
      const replacementDress = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80';
      
      if (p.categoryId === 'cat-modest') {
        const modestImages = p.id === 'dm-prod-006' 
          ? ['/images/user_modest_dress_2.jpg', '/images/user_modest_dress_1.jpg']
          : ['/images/user_modest_dress_1.jpg', '/images/user_modest_dress_2.jpg'];
        return {
          ...p,
          images: modestImages,
        };
      }

      if (p.categoryId === 'cat-daily') {
        const dailyImages = p.id === 'dm-prod-004'
          ? ['/images/daily_linen_dress_1792311555699.jpg', '/images/daily_shirtdress_chic_1792311557062.jpg']
          : ['/images/daily_cotton_dress_1792311556565.jpg', '/images/daily_dress_category_1792311556508.jpg'];
        return {
          ...p,
          images: dailyImages,
        };
      }

      return {
        ...p,
        images: (p.images || []).map(img => img.includes(rosePhotoId) ? replacementDress : img),
      };
    };

    try {
      const snap = await getDocs(collection(db, path));
      if (!snap.empty) {
        return snap.docs.map(d => cleanProduct(d.data() as Product));
      }
      return INITIAL_PRODUCTS.map(cleanProduct);
    } catch (error) {
      console.warn('Admin products fallback:', error);
      return INITIAL_PRODUCTS.map(cleanProduct);
    }
  },

  // Create new order in Firestore
  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'paymentStatus'> & { paymentReference?: string }): Promise<Order> {
    const path = 'orders';
    const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const orderNumber = generateReferenceCode('DM');
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      orderNumber,
      status: orderData.paymentReference ? 'pending_payment_verification' : 'new',
      paymentStatus: orderData.paymentReference ? 'pending_verification' : 'pending_verification',
      createdAt: now,
      updatedAt: now,
    };

    try {
      const docRef = doc(db, path, orderId);
      await setDoc(docRef, newOrder);
      return newOrder;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${path}/${orderId}`);
    }
  },

  // Lookup order by exact Order Number
  async findOrderByNumber(orderNumber: string): Promise<Order | null> {
    const cleanNumber = orderNumber.trim().toUpperCase();
    const path = 'orders';
    try {
      const q = query(collection(db, path), where('orderNumber', '==', cleanNumber));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as Order;
      }
      return null;
    } catch (error) {
      console.warn('Error querying order by number:', error);
      return null;
    }
  },

  // Create Custom Tailoring Request
  async createCustomTailoringRequest(
    data: Omit<CustomTailoringRequest, 'id' | 'requestNumber' | 'createdAt' | 'status'>
  ): Promise<CustomTailoringRequest> {
    const path = 'customRequests';
    const requestId = 'req_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const requestNumber = generateReferenceCode('CR');
    const now = new Date().toISOString();

    const newRequest: CustomTailoringRequest = {
      ...data,
      id: requestId,
      requestNumber,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    try {
      const docRef = doc(db, path, requestId);
      await setDoc(docRef, newRequest);
      return newRequest;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${path}/${requestId}`);
    }
  },

  // Lookup custom request by number
  async findCustomRequestByNumber(requestNumber: string): Promise<CustomTailoringRequest | null> {
    const cleanNumber = requestNumber.trim().toUpperCase();
    const path = 'customRequests';
    try {
      const q = query(collection(db, path), where('requestNumber', '==', cleanNumber));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as CustomTailoringRequest;
      }
      return null;
    } catch (error) {
      console.warn('Error querying custom request by number:', error);
      return null;
    }
  },

  // Admin: Fetch all orders
  async getAdminOrders(): Promise<Order[]> {
    const path = 'orders';
    try {
      const snap = await getDocs(collection(db, path));
      const orders = snap.docs.map(d => d.data() as Order);
      return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  // Admin: Update Order Status & Payment Status
  async updateOrderStatus(
    orderId: string, 
    status: OrderStatus, 
    paymentStatus: PaymentStatus, 
    adminNotes?: string
  ): Promise<void> {
    const path = 'orders';
    try {
      const docRef = doc(db, path, orderId);
      await updateDoc(docRef, {
        status,
        paymentStatus,
        adminNotes: adminNotes ?? '',
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${path}/${orderId}`);
    }
  },

  // Admin: Fetch all custom requests
  async getAdminCustomRequests(): Promise<CustomTailoringRequest[]> {
    const path = 'customRequests';
    try {
      const snap = await getDocs(collection(db, path));
      const requests = snap.docs.map(d => d.data() as CustomTailoringRequest);
      return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  // Admin: Update custom request status & quotation
  async updateCustomRequestStatus(
    requestId: string,
    status: CustomRequestStatus,
    quotedPriceSYP?: number,
    adminNotes?: string
  ): Promise<void> {
    const path = 'customRequests';
    try {
      const docRef = doc(db, path, requestId);
      const updates: Record<string, any> = {
        status,
        updatedAt: new Date().toISOString(),
      };
      if (quotedPriceSYP !== undefined) updates.quotedPriceSYP = quotedPriceSYP;
      if (adminNotes !== undefined) updates.adminNotes = adminNotes;
      await updateDoc(docRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${path}/${requestId}`);
    }
  },

  // Admin: Save or Edit Product
  async saveProduct(product: Product): Promise<void> {
    const path = 'products';
    try {
      const docRef = doc(db, path, product.id);
      await setDoc(docRef, {
        ...product,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${path}/${product.id}`);
    }
  },

  // Admin: Delete Product
  async deleteProduct(productId: string): Promise<void> {
    const path = 'products';
    try {
      const docRef = doc(db, path, productId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${path}/${productId}`);
    }
  },

  // Seed / Sync initial catalog into Firestore
  async seedInitialCatalog(force = false): Promise<{ success: boolean; count: number; message: string }> {
    try {
      if (!force) {
        const existing = await getDocs(collection(db, 'products'));
        if (!existing.empty) {
          return { success: true, count: existing.size, message: 'قاعدة البيانات تحتوي بالفعل على منتجات.' };
        }
      }

      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }

      for (const des of INITIAL_DESIGNERS) {
        await setDoc(doc(db, 'designers', des.id), des);
      }

      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }

      await setDoc(doc(db, 'storeSettings', 'general'), INITIAL_STORE_SETTINGS, { merge: true });

      return {
        success: true,
        count: INITIAL_PRODUCTS.length,
        message: 'تمت مزامنة وتهيئة كامل البيانات التأسيسية في Cloud Firestore بنجاح!',
      };
    } catch (error) {
      console.error('Error during initial catalog seed:', error);
      return {
        success: false,
        count: 0,
        message: error instanceof Error ? error.message : 'فشلت عملية التهيئة السحابية',
      };
    }
  },
};
