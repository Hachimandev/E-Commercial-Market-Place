import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";
import SearchBar from "../../components/SearchBar";

const mockProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    price: 1200,
    stock: 15,
    image: require("../../assets/img/iphone.png"),
    status: "In Stock",
  },
  {
    id: "2",
    name: "MacBook Air M3",
    price: 1500,
    stock: 0,
    image: require("../../assets/img/macbook.png"),
    status: "Out of Stock",
  },
  {
    id: "3",
    name: "Lipstick Chanel",
    price: 45,
    stock: 100,
    image: require("../../assets/img/lipstick.png"),
    status: "In Stock",
  },
];

const ProductListItemAdmin: React.FC<{
  item: any;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ item, onEdit, onDelete }) => (
  <View style={[styles.listItem, globalStyles.shadow]}>
    <Image source={item.image} style={styles.itemImage} />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      <Text
        style={[
          styles.itemStatus,
          item.status === "Out of Stock" && styles.itemStatusOutOfStock,
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

// @ts-ignore
const ProductManagementScreen = ({ navigation }) => {
  const [products, setProducts] = useState(mockProducts);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    navigation.navigate("AddEditProduct", { product: null });
  };

  const handleEditProduct = (product: any) => {
    navigation.navigate("AddEditProduct", { product: product });
  };

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setProducts((prev) => prev.filter((p) => p.id !== productId));
            console.log("Deleted product:", productId);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ padding: 10 }}
        >
          <Ionicons name="menu-outline" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <SearchBar
          onSubmitEditing={setSearchQuery}
          initialQuery={searchQuery}
        />

        <View style={styles.actionBar}>
          <TouchableOpacity onPress={handleAddProduct} style={styles.addButton}>
            <Ionicons
              name="add-circle-outline"
              size={22}
              color={COLORS.background}
            />
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            style={styles.viewModeButton}
          >
            <Ionicons
              name={viewMode === "list" ? "grid-outline" : "list-outline"}
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {viewMode === "list" ? (
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => (
              <ProductListItemAdmin
                item={item}
                onEdit={() => handleEditProduct(item)}
                onDelete={() => handleDeleteProduct(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.gridView}>
            <Text style={{ color: COLORS.textLight }}>
              (Grid View placeholder)
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: { flex: 1, padding: SIZES.padding },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.padding,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
  },
  addButtonText: {
    color: COLORS.background,
    fontWeight: "bold",
    marginLeft: 5,
  },
  viewModeButton: { padding: 10 },
  // Styles cho List Item
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
    backgroundColor: COLORS.surface,
  },
  itemInfo: { flex: 1, marginRight: 10 },
  itemName: { fontSize: 16, fontWeight: "600", marginBottom: 3 },
  itemPrice: { fontSize: 14, color: COLORS.primary, fontWeight: "bold" },
  itemStatus: { fontSize: 12, color: "green", marginTop: 3 },
  itemStatusOutOfStock: { color: "red" },
  itemActions: { flexDirection: "row" },
  actionButton: { padding: 8 },
  gridView: { flex: 1, justifyContent: "center", alignItems: "center" }, // Placeholder
});

export default ProductManagementScreen;
