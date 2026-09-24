export type UserRole = 'admin' | 'manager' | 'buyer';
export type UserStatus = 'pending' | 'approved' | 'suspended';

export interface User {
  id: string;
  firebaseUid?: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  photoURL: string;
  createdAt: string;
  suspendReason?: string;
  suspendFeedback?: string;
}

export type ProductCategory = 'Shirt' | 'Pant' | 'Jacket' | 'Accessories' | 'Knitwear' | 'Denim' | 'Activewear';
export type PaymentOption = 'Cash on Delivery' | 'PayFirst';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  availableQuantity: number;
  minimumOrderQuantity: number;
  images: string[];
  demoVideoLink?: string;
  paymentOptions: PaymentOption;
  showOnHome: boolean;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Completed';

export type TrackingStage = 
  | 'Order Placed'
  | 'Cutting Completed'
  | 'Sewing Started'
  | 'Finishing'
  | 'QC Checked'
  | 'Packed'
  | 'Shipped / Out for Delivery'
  | 'Delivered';

export interface TrackingStep {
  id?: string;
  stage: TrackingStage;
  location: string;
  note: string;
  timestamp: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  productId: string;
  productName: string;
  productImage?: string;
  productCategory?: string;
  unitPrice?: number;
  orderQuantity: number;
  orderPrice: number;
  totalPrice?: number;
  paymentOption: PaymentOption;
  paymentStatus?: 'Pending' | 'Paid' | 'COD';
  orderStatus: OrderStatus;
  status?: OrderStatus;
  approvedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  contactNumber: string;
  deliveryAddress: string;
  additionalNotes?: string;
  customer?: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    deliveryAddress: string;
    additionalNotes?: string;
  };
  trackingUpdates: TrackingStep[];
  trackingHistory?: TrackingStep[];
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  timeRange: 'today' | '7days' | '30days';
  stats: {
    productsToday: number;
    productsWeek: number;
    productsMonth: number;
    totalProducts: number;
    ordersThisMonth: number;
    totalOrders: number;
    totalRevenueMonth: number;
    totalUsers: number;
    newUsers: number;
    activeManagers: number;
  };
  categoryDistribution: { name: string; value: number }[];
  statusCounts: {
    Pending: number;
    Approved: number;
    Rejected: number;
    Cancelled: number;
  };
  dailyTrend: { day: string; output: number; orders: number; revenue: number }[];
}
