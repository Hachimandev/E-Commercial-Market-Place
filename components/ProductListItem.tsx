// E-Commercial-Market-Place/components/ProductListItem.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, globalStyles } from "../constants/styles";

interface ProductListItemProps {
  imageSource: ImageSourcePropType;
  name: string;
  rating: number;
  price: number;
  onPress?: () => void; // <-- THÊM PROP ONPRESS
}

const ProductListItem: React.FC<ProductListItemProps> = ({
  imageSource,
  name,
  rating,
  price,
  onPress, // <-- NHẬN PROP
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, globalStyles.shadow]}
      onPress={onPress}
    >
      {" "}
      {/* <-- SỬ DỤNG ONPRESS */}
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.productName}>{name}</Text>
        <View style={styles.rating}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons
              key={i}
              name="star"
              size={14}
              color={i <= rating ? COLORS.accent : COLORS.border}
            />
          ))}
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>${price}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// ... (Styles giữ nguyên)
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.padding / 2,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
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
    fontSize: 18,
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
  },
});

export default ProductListItem;
