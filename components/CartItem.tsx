// E-Commercial-Market-Place/components/CartItem.tsx

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, globalStyles } from "../constants/styles";
import { CartItem } from "../context/CartContext";
import { useCart } from "../context/CartContext";

interface CartItemProps {
  item: CartItem;
}

const CartItemRow: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleDecrease = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  return (
    <View style={[styles.container, globalStyles.shadow]}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.price}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={handleDecrease}>
          <Ionicons
            name={item.quantity === 1 ? "trash-outline" : "remove"}
            size={16}
            color={item.quantity === 1 ? "red" : COLORS.text}
          />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity style={styles.controlButton} onPress={handleIncrease}>
          <Ionicons name="add" size={16} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
