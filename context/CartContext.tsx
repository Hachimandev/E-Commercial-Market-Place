import React, { createContext, useContext } from "react";
import { api } from "../api/api";
import { CartAPI } from "../types/cart";

interface CartContextType {
  loadCart: () => Promise<CartAPI>;
  addItem: (productId: number, quantity: number) => Promise<CartAPI>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<CartAPI>;
  removeItem: (cartItemId: string) => Promise<CartAPI>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const loadCart = async (): Promise<CartAPI> => {
    try {
      const cartData = await api.get("/api/cart");
      return cartData as CartAPI;
    } catch (error) {
      console.error("Failed to load cart:", error);
      throw error;
    }
  };

  const addItem = async (
    productId: number,
    quantity: number
  ): Promise<CartAPI> => {
    try {
      const updatedCart = await api.post("/api/cart/items", {
        productId,
        quantity,
      });
      return updatedCart as CartAPI;
    } catch (error) {
      console.error("Failed to add item:", error);
      throw error;
    }
  };
  const updateQuantity = async (
    cartItemId: string,
    quantity: number
  ): Promise<CartAPI> => {
    try {
      const updatedCart = await api.put(`/api/cart/items/${cartItemId}`, {
        quantity,
      });
      return updatedCart as CartAPI;
    } catch (error) {
      console.error("Failed to update quantity:", error);
      throw error;
    }
  };

  const removeItem = async (cartItemId: string): Promise<CartAPI> => {
    try {
      const updatedCart = await api.delete(`/api/cart/items/${cartItemId}`);
      return updatedCart as CartAPI;
    } catch (error) {
      console.error("Failed to remove item:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        loadCart,
        addItem,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
