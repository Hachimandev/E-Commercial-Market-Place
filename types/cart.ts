import { ImageSourcePropType } from "react-native";

export interface CartItemAPI {
  id: string; 
  quantity: number;
  subtotal: number;
  productId: string;
  name: string;
  price: number;
  imageURL: string;
}


export interface CartAPI {
  cartId: string;
  totalPrice: number;
  items: CartItemAPI[];
}

export interface PaymentMethodAPI {
  id: string;
  type: "card" | "paypal";
  brand: string; 
  last4: string; 
  email: string; 
  iconName: string; 
}

export interface OrderSuccessAPI {
  orderId: string;
  totalAmount: number;
  subtotal: number;
  tax: number;
  paymentMethod: PaymentMethodAPI;
  itemsPurchased: CartItemAPI[];
  status: string;
}

export const PAYMENT_ICON_MAP: Record<string, ImageSourcePropType> = {
  "visa-logo.png": require("../assets/img/visa-logo.png"),
  "mastercard-logo.png": require("../assets/img/mastercard-logo.png"),
  "paypal-logo.png": require("../assets/img/paypal-logo.png"),
  default: require("../assets/icon.png"), // Ảnh dự phòng
};
