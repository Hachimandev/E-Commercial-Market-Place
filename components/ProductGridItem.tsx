// E-Commercial-Market-Place/components/ProductGridItem.tsx

import React, { useContext } from "react"; // <-- Import useContext
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, globalStyles } from "../constants/styles";
import { useCart } from "../context/CartContext"; // <-- 1. Import useCart

const { width } = Dimensions.get("window");
const cardWidth = (width - SIZES.padding * 3) / 2;

interface ProductGridItemProps {
  // Thay đổi: Nhận toàn bộ item thay vì từng prop
  item: {
    id: string;
    name: string;
    rating: number;
    price: number;
    image: ImageSourcePropType;
  };
  onPress?: () => void;
}

const ProductGridItem: React.FC<ProductGridItemProps> = ({ item, onPress }) => {
  const { addItem } = useCart(); // <-- 2. Lấy hàm addItem

  const handleAddItem = () => {
    // 3. Gọi hàm addItem (quantity mặc định là 1)
    addItem(item);
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
              size={12}
              color={i <= item.rating ? COLORS.accent : COLORS.border}
            />
          ))}
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>${item.price}</Text>
          {/* 4. Thêm onPress vào nút + */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Ionicons name="add" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ... (Styles giữ nguyên)
const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  imageContainer: {
    backgroundColor: "#FAFAFA",
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    height: 140,
  },
  productImage: {
    width: "80%",
    height: "100%",
  },
  details: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: COLORS.text,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: COLORS.border,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductGridItem;
