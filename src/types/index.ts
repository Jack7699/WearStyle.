export type ProductCategory = 'hoodies' | 't-shirts' | 'all';

export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface SizeStock {
  size: ProductSize;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'hoodies' | 't-shirts';
  price: number; // in MAD (Moroccan Dirham)
  comparePrice?: number;
  image: string;
  secondaryImage?: string;
  description: string;
  fabric: string; // e.g. "450 GSM Heavy French Terry Cotton"
  fit: string; // e.g. "Boxy Oversized Drop-Shoulder"
  colors: string[];
  sizes: SizeStock[];
  isFeatured?: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: ProductSize;
  color: string;
  quantity: number;
  maxStock: number;
}

export type PaymentMethod = 'cod' | 'card';

export type OrderStatus =
  | 'pending_approval'
  | 'approved'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  phone: string; // Moroccan phone format (06/07/212...)
  email?: string;
  city: string;
  district: string; // Quartier / Neighborhood
  address: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. WS-MA-74921
  createdAt: string;
  customer: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  approvedAt?: string;
  trackingNumber?: string;
  cardLast4?: string;
}

export type DiscountType = 'percentage' | 'fixed';

export interface DiscountCode {
  id: string;
  code: string; // e.g. 'WEAR10', 'CASA50'
  type: DiscountType; // percentage (%) or fixed (MAD)
  value: number; // 10 for 10%, or 50 for 50 MAD
  minOrderAmount?: number; // minimum subtotal in MAD
  expiryDate: string; // ISO date string 'YYYY-MM-DD'
  isActive: boolean;
  usageCount: number;
  maxUses?: number;
}

export interface MoroccanCity {
  name: string;
  region: string;
  deliveryTime: string;
  shippingRate: number; // MAD
}
