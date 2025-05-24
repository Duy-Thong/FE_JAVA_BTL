export interface Order {
  id: string; // UUID comes as string in frontend
  user: {
    id: string;
    name: string;
    email: string;
  };
  orderItems?: Array<{
    id: string;
    product: {
      name: string;
      price: number;
      img_url: string;
    };
    quantity: number;
    price: number;
  }>;
    customerName: string;
    note: string;
  totalAmount: number;
  shippingAddress: string;
  phoneNumber: string;
  paymentMethod: string;
  cardNumber?: string;
  cardHolder?: string;
  status: string;
  createdAt: string; // LocalDateTime comes as ISO string
  
}
