import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";
import SearchBar from "../../components/SearchBar";
import { api } from "../../api/api";
import { getLocalImage } from "../../constants/imageMap";

// @ts-ignore
const ProductManagementScreen = ({ navigation }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Lấy danh sách sản phẩm từ BE
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.get("/api/products");
      setProducts(data);
      console.log("📦 Product data:", data);
    } catch (error: any) {
      console.error("❌ Lỗi khi tải sản phẩm:", error.message);
      Alert.alert("Lỗi", "Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Xóa sản phẩm
  const handleDeleteProduct = async (productId: number) => {
    console.log("Gửi DELETE tới:", productId);
    try {
      await api.delete(`/api/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
      Alert.alert("Đã xoá thành công!");
    } catch (error: any) {
      console.error(" Lỗi xoá sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    navigation.navigate("AddEditProduct", {
      product: null,
      onGoBack: fetchProducts,
    });
  };

  const handleEditProduct = (product: any) => {
    navigation.navigate("AddEditProduct", { product, onGoBack: fetchProducts });
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

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : viewMode === "list" ? (
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => (
              <ProductListItemAdmin
                item={item}
                onEdit={() => handleEditProduct(item)}
                onDelete={() => handleDeleteProduct(item.productId)}
              />
            )}
            keyExtractor={(item) => item.productId.toString()}
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

const ProductListItemAdmin = ({ item, onEdit, onDelete }: any) => (
  <View style={[styles.listItem, globalStyles.shadow]}>
    <Image source={getLocalImage(item.imageURL)} style={styles.itemImage} />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.itemPrice}>${item.price?.toFixed(2)}</Text>
      <Text
        style={[
          styles.itemStatus,
          item.stock === 0 && styles.itemStatusOutOfStock,
        ]}
      >
        {item.stock > 0 ? `In Stock (${item.stock})` : "Out of Stock"}
      </Text>
    </View>
    <View style={styles.itemActions}>
      <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
        <Ionicons name="pencil-outline" size={20} color={COLORS.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log("Nhấn xoá:", item.productId);
          onDelete();
        }}
        style={styles.actionButton}
      >
        <Ionicons name="trash-outline" size={20} color="red" />
      </TouchableOpacity>
    </View>
  </View>
);

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
  gridView: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ProductManagementScreen;
