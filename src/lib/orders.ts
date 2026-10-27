export type OrderStatus =
  | 'PAYMENT_REVIEW'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'REJECTED';

export interface OrderItem {
  id: string;
  productId: string;
  name: string | null;
  imageUrl: string | null;
  quantity: number;
  price: number;
}

export interface StoreOrder {
  id: string;
  totalAmount: number;
  status: OrderStatus | string;
  customerName: string | null;
  phone: string | null;
  shippingAddress: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  paymentSubmittedAt: string | null;
  paymentReviewedAt: string | null;
  estimatedDeliveryAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user?: { id: string; name: string; email: string };
}

export interface OrderQuote {
  items: Array<{
    productId: string;
    name: string;
    imageUrl: string | null;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  total: number;
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  PAYMENT_REVIEW: 'Admin is checking your payment',
  CONFIRMED: 'Order confirmed',
  PROCESSING: 'Preparing order',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  REJECTED: 'Payment not verified',
};

export function formatOrderDate(value: string): string {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));
}
