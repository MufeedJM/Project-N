export type ProductCategory = 
  | 'Vegetable Seeds'
  | 'Fruit Seeds'
  | 'Flower Seeds'
  | 'Leafy Vegetables'
  | 'Herbal Seeds'
  | 'Other Agricultural Seeds';

export interface GrowingConditions {
  soil: string;
  sunlight: string;
  temperature: string;
  watering: string;
}

export interface Product {
  id: string;
  name: string;
  variety: string;
  cropType: string;
  category: ProductCategory;
  price: number; // in LKR
  currency: 'LKR';
  quantity: number; // e.g. 100
  unit: string; // e.g. "Seeds" or "g"
  image: string;
  gallery: string[];
  description: string;
  germinationRate: number; // e.g. 92%
  growingConditions: GrowingConditions;
  plantingSeason: 'Yala & Maha' | 'Yala Season' | 'Maha Season' | 'Year-round';
  harvestInformation: string; // e.g. "60-75 days after sowing"
  plantSpacing: string; // e.g. "45cm x 60cm"
  sowingDepth: string; // e.g. "0.5 - 1 cm"
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  departmentApproved?: boolean; // Sri Lanka Dept. of Agriculture approved variety
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  notes?: string;
}

export type PaymentMethod = 'payhere' | 'bank_transfer' | 'cod';

export interface OrderItem {
  productId: string;
  productName: string;
  variety: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid (Sandbox)' | 'Cash On Delivery' | 'Awaiting Slip';
  orderStatus: 'Processing' | 'Dispatched' | 'Delivered';
  specialNotes?: string;
}

export interface QuestionInquiry {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  varietyInterest?: string;
  message: string;
  submittedAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
