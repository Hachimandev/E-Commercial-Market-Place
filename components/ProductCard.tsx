// E-Commercial-Market-Place/components/ProductCard.tsx

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
import { COLORS, SIZES, globalStyles } from "../constants/styles"; // Dùng style chung

interface ProductCardProps {
  imageSource: ImageSourcePropType;
  name: string;
  rating: number;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageSource,
  name,
  rating,
  price,
}) => {
  return (
    <TouchableOpacity style={[styles.card, globalStyles.shadow]}>
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.productName} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.ratingPrice}>
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color={COLORS.accent} />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.priceText}>${price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    marginRight: 15,
    borderRadius: SIZES.radius,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    backgroundColor: "#FAFAFA",
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
  },
  productImage: {
    width: "90%",
    height: 120,
    alignSelf: "center",
  },
  details: {
    padding: 10,
  },
  productName: {
    fontSize: SIZES.body,
    fontWeight: "600",
    marginBottom: 5,
    color: COLORS.text,
  },
  ratingPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.textLight,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
});

export default ProductCard;
