export enum OrderStatusAPI {
  PENDING = "PENDING",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface OrderItemDto {
  productId: string;
  productName: string;
  productImageURL: string; 
  quantity: number;
  price: number; 
}

export interface OrderHistoryDto {
  orderId: string;
  orderDate: string; 
  totalAmount: number;
  status: OrderStatusAPI; 
  itemCount: number;
  items: OrderItemDto[];
}

export interface OrderDetailAPI {
  orderId: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatusAPI;
  items: OrderItemDto[];

  buyerName: string;
  shippingAddress: string;
  buyerPhone: string;

  paymentMethod: string;
  paymentStatus: string; 
}