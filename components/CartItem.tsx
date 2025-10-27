// E-Commercial-Market-Place/components/CartItem.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, globalStyles } from "../constants/styles";
import { CartAPI, CartItemAPI } from "../types/cart"; // Import types
import { useCart } from "../context/CartContext";
import { getLocalImage } from "../constants/imageMap"; // Import
import { API_BASE_URL } from "../api/api"; // Import

interface CartItemProps {
  item: CartItemAPI; // Dùng type từ API
  onCartUpdate: (updatedCart: CartAPI) => void; // Callback để báo cho parent
}

const CartItemRow: React.FC<CartItemProps> = ({ item, onCartUpdate }) => {
  const { updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newQuantity: number) => {
    if (loading) return;
    setLoading(true);
    try {
      // item.id là string (từ CartItem, không phải Product)
      const updatedCart = await updateQuantity(item.id, newQuantity);
      if (updatedCart) {
        onCartUpdate(updatedCart); // Cập nhật state ở CartScreen
      }
    } catch (error) {
      console.error("Failed to update quantity", error);
      // (Có thể thêm Alert ở đây)
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = () => {
    handleUpdate(item.quantity - 1);
  };

  const handleIncrease = () => {
    handleUpdate(item.quantity + 1);
  };

  // Lấy ảnh từ imageURL
  const imageSource = getLocalImage(item.imageURL, API_BASE_URL);

  return (
    <View style={[styles.container, globalStyles.shadow]}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.price}>
          {/* BE đã tính subtotal, nhưng ta tự tính cũng được */}$
          {(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
      <View style={styles.controls}>
        {loading ? (
          <ActivityIndicator style={styles.controlButton} />
        ) : (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleDecrease}
          >
            <Ionicons
              name={item.quantity === 1 ? "trash-outline" : "remove"}
              size={16}
              color={item.quantity === 1 ? "red" : COLORS.text}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.quantity}>{item.quantity}</Text>
        {loading ? (
          <ActivityIndicator style={styles.controlButton} />
        ) : (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleIncrease}
          >
            <Ionicons name="add" size={16} color={COLORS.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ... (Styles giữ nguyên)
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 10,
    marginBottom: SIZES.padding,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surface,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  price: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold",
    marginTop: 4,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
  },
  controlButton: {
    padding: 10,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    paddingHorizontal: 5,
  },
});
export default CartItemRow;
