import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, globalStyles } from "../constants/styles";
import { useCart } from "../context/CartContext";

interface ProductListItemProps {
  item: {
    id: string;
    name: string;
    rating: number;
    price: number;
    image: ImageSourcePropType;
  };
  onPress?: () => void;
  onCartUpdated?: () => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({
  item,
  onPress,
  onCartUpdated,
}) => {
  const { addItem } = useCart();

  const handleAddItem = async () => {
    try {
      await addItem(Number(item.id), 1);
      Alert.alert("Thành công", `${item.name} đã được thêm vào giỏ hàng.`);
      onCartUpdated?.();
    } catch (error: any) {
      console.error("Failed to add item from ProductListItem:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể thêm sản phẩm vào giỏ hàng."
      );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, globalStyles.shadow]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.rating}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons
              key={i}
              name="star"
              size={14}
              color={
                i <= Math.round(item.rating) ? COLORS.accent : COLORS.border
              }
            />
          ))}
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Ionicons name="add" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: SIZES.padding / 2,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#FAFAFA",
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZES.padding,
  },
  productImage: {
    width: "80%",
    height: "80%",
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 5,
  },
  rating: {
    flexDirection: "row",
  },
  priceContainer: {
    alignItems: "center",
    marginLeft: SIZES.padding,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: COLORS.border,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
});

export default ProductListItem;
