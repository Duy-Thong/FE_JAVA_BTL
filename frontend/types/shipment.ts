export interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    img_url: string;
    retailer: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user: {
    id: string;
  };
  orderItems: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  phoneNumber: string;
  customerName: string;
  note: string;
  paymentMethod: string;
  cardNumber?: string;
  cardHolder?: string;
  status: string;
  createdAt: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  notes: string;
  shippingFee: number;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
  order: Order;
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}
