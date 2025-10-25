// E-Commercial-Market-Place/components/admin/ProductListItemAdmin.tsx

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
import { COLORS, SIZES, globalStyles } from "../../constants/styles";

interface ProductListItemAdminProps {
  item: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image: ImageSourcePropType;
    status: "In Stock" | "Out of Stock" | string; // Allow string for flexibility
  };
  onEdit: () => void;
  onDelete: () => void;
}

const ProductListItemAdmin: React.FC<ProductListItemAdminProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  const isOutOfStock = item.status === "Out of Stock";

  return (
    <View style={[styles.listItem, globalStyles.shadow]}>
      <Image
        source={item.image}
        style={styles.itemImage}
        resizeMode="contain"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <Text
          style={[
            styles.itemStatus,
            isOutOfStock && styles.itemStatusOutOfStock,
          ]}
        >
          {item.status} ({item.stock})
        </Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Ionicons name="pencil-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 10,
    marginBottom: SIZES.padding,
    alignItems: "center",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius,
    marginRight: 10,
    backgroundColor: COLORS.surface, // Background for images
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 3,
    color: COLORS.text,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  itemStatus: {
    fontSize: 12,
    color: "green",
    marginTop: 3,
  },
  itemStatusOutOfStock: {
    color: "red",
  },
  itemActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
  },
});

export default ProductListItemAdmin;
