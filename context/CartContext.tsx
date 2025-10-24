// E-Commercial-Market-Place/context/CartContext.tsx

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { ImageSourcePropType } from "react-native";

// 1. Định nghĩa kiểu dữ liệu (Giữ nguyên)
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: ImageSourcePropType;
  quantity: number;
}
interface CartState {
  items: CartItem[];
}

// --- CẬP NHẬT INTERFACE ---
interface CartContextProps {
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void; // <-- THÊM HÀM MỚI
  getCartTotal: () => number;
  getCartItemCount: () => number;
}
// --- KẾT THÚC CẬP NHẬT ---

// 2. Tạo Context (Giữ nguyên)
const CartContext = createContext<CartContextProps | undefined>(undefined);

// 3. Định nghĩa Reducer (Cập nhật)
type CartAction =
  | {
      type: "ADD_ITEM";
      payload: { item: Omit<CartItem, "quantity">; quantity: number };
    }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { itemId: string } }
  | { type: "CLEAR_CART" }; // <-- THÊM ACTION MỚI

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, quantity } = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...item, quantity }],
      };
    }

    case "UPDATE_QUANTITY": {
      // ... (Giữ nguyên)
      const { itemId, quantity } = action.payload;
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        ),
      };
    }

    case "REMOVE_ITEM": {
      // ... (Giữ nguyên)
      const { itemId } = action.payload;
      return {
        ...state,
        items: state.items.filter((i) => i.id !== itemId),
      };
    }

    // --- THÊM CASE MỚI ---
    case "CLEAR_CART":
      return {
        ...state,
        items: [], // Trả về mảng rỗng
      };
    // --- KẾT THÚC THÊM ---

    default:
      return state;
  }
};

// 4. Tạo Provider (Cập nhật)
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { item, quantity } });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } });
    }
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
  };

  // --- THÊM HÀM MỚI ---
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };
  // --- KẾT THÚC THÊM ---

  const getCartTotal = () => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        updateQuantity,
        removeItem,
        clearCart, // <-- Thêm vào value
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 5. Tạo Hook (Giữ nguyên)
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
