import { Product, Order } from '../types/index.ts';
import { INITIAL_PRODUCTS } from '../data/defaultProducts.ts';

const PRODUCTS_KEY = 'apex_local_products';
const ORDERS_KEY = 'apex_local_orders';

// Get API base URL if specified in environment
const API_BASE_URL = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '') : '';

// Initialize local storage products if empty
export function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse local products, resetting to initial dataset:', e);
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

export function saveLocalProducts(products: Product[]) {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Failed to save products to localStorage:', e);
  }
}

// Local Orders helper
export function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse local orders:', e);
  }
  return [];
}

export function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Failed to save orders to localStorage:', e);
  }
}

/**
 * Universal safe API call helper
 * Automatically falls back if backend is unavailable or returns HTML (Netlify 404/rewrite)
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<{ ok: boolean; data: T | null; status: number }> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    
    // If Netlify served index.html instead of an API response
    if (contentType.includes('text/html')) {
      return { ok: false, data: null, status: 404 };
    }

    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      return { ok: true, data, status: res.status };
    }

    return { ok: false, data: null, status: res.status };
  } catch (err) {
    // Network error or offline
    return { ok: false, data: null, status: 0 };
  }
}

/**
 * Fetch products with search, category filtering, sorting, and pagination
 */
export async function getProducts(query: {
  search?: string;
  category?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  showOnHome?: boolean;
} = {}): Promise<{
  success: boolean;
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const params = new URLSearchParams();
  if (query.search?.trim()) params.append('search', query.search.trim());
  if (query.category && query.category !== 'all') params.append('category', query.category);
  if (query.sortBy) params.append('sortBy', query.sortBy);
  if (query.page) params.append('page', String(query.page));
  if (query.limit) params.append('limit', String(query.limit));
  if (query.showOnHome) params.append('showOnHome', 'true');

  // Attempt backend call first
  const result = await apiRequest<{
    success: boolean;
    products: Product[];
    total?: number;
    page?: number;
    totalPages?: number;
  }>(`/api/products?${params.toString()}`);

  if (result.ok && result.data && result.data.success && Array.isArray(result.data.products)) {
    // Save to local cache in case user goes offline
    if (result.data.products.length > 0) {
      saveLocalProducts(result.data.products);
    }
    return {
      success: true,
      products: result.data.products,
      total: result.data.total ?? result.data.products.length,
      page: result.data.page ?? 1,
      totalPages: result.data.totalPages ?? 1
    };
  }

  // Resilient fallback (For Netlify deployments without backend server)
  let list = [...getLocalProducts()];

  if (query.showOnHome) {
    list = list.filter(p => p.showOnHome);
  }

  if (query.category && query.category !== 'all') {
    list = list.filter(p => p.category.toLowerCase() === query.category!.toLowerCase());
  }

  if (query.search?.trim()) {
    const q = query.search.trim().toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (query.sortBy === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (query.sortBy === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else {
    // Newest
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = list.length;
  const page = query.page || 1;
  const limit = query.limit || 9;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    success: true,
    products: paginated,
    total,
    page,
    totalPages
  };
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const result = await apiRequest<{ success: boolean; product: Product }>(`/api/products/${id}`);
  if (result.ok && result.data && result.data.success && result.data.product) {
    return result.data.product;
  }

  // Fallback to local data
  const localList = getLocalProducts();
  const found = localList.find(p => p.id === id);
  return found || null;
}

/**
 * Place a new order with resilient fallback
 */
export async function submitOrder(orderPayload: {
  productId: string;
  orderQuantity: number;
  firstName: string;
  lastName: string;
  contactNumber: string;
  deliveryAddress: string;
  additionalNotes?: string;
  paymentOption: string;
  isOnlinePaid: boolean;
}): Promise<{ success: boolean; message?: string; order?: Order }> {
  const token = localStorage.getItem('apex_token');
  const result = await apiRequest<{ success: boolean; message?: string; order?: Order }>('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(orderPayload)
  });

  if (result.ok && result.data && result.data.success) {
    return result.data;
  }

  // Fallback for Netlify deployment
  const product = await getProductById(orderPayload.productId);
  if (!product) {
    return { success: false, message: 'Product not found.' };
  }

  const rawUser = localStorage.getItem('apex_user');
  const user = rawUser ? JSON.parse(rawUser) : { id: 'usr-buyer-01', name: `${orderPayload.firstName} ${orderPayload.lastName}`, email: 'buyer@garmentflow.com' };

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `AG-${Math.floor(100000 + Math.random() * 900000)}`,
    productId: product.id,
    productName: product.name,
    productImage: product.images[0] || '',
    productCategory: product.category,
    unitPrice: product.price,
    orderQuantity: orderPayload.orderQuantity,
    orderPrice: Number((orderPayload.orderQuantity * product.price).toFixed(2)),
    totalPrice: Number((orderPayload.orderQuantity * product.price).toFixed(2)),
    paymentOption: orderPayload.paymentOption as any,
    paymentStatus: orderPayload.isOnlinePaid ? 'Paid' : 'Pending',
    orderStatus: 'Pending',
    status: 'Pending',
    firstName: orderPayload.firstName,
    lastName: orderPayload.lastName,
    userEmail: user.email || 'buyer@garmentflow.com',
    contactNumber: orderPayload.contactNumber,
    deliveryAddress: orderPayload.deliveryAddress,
    additionalNotes: orderPayload.additionalNotes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trackingUpdates: [
      {
        stage: 'Order Placed',
        location: 'ApexGarments Central Hub',
        note: 'Order placed by buyer and queued for production approval.',
        timestamp: new Date().toISOString()
      }
    ]
  };

  const existing = getLocalOrders();
  existing.unshift(newOrder);
  saveLocalOrders(existing);

  return { success: true, order: newOrder };
}

/**
 * Fetch current buyer's orders with fallback
 */
export async function getBuyerOrders(): Promise<{ success: boolean; orders: Order[] }> {
  const token = localStorage.getItem('apex_token');
  const result = await apiRequest<{ success: boolean; orders: Order[] }>('/api/orders/my-orders', {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  if (result.ok && result.data && result.data.success && Array.isArray(result.data.orders)) {
    saveLocalOrders(result.data.orders);
    return result.data;
  }

  // Fallback to local storage orders
  const localOrders = getLocalOrders();
  return { success: true, orders: localOrders };
}

