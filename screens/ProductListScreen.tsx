import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import SearchBar from "../components/SearchBar";
import ProductListItem from "../components/ProductListItem";
import { useCart } from "../context/CartContext";
import { api, API_BASE_URL } from "../api/api";

const filterTabs = ["Best Sales", "Best Matched", "Popular"];

interface FrontendProduct {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: ImageSourcePropType;
  detailScreen: "ProductDetailGeneral" | "ProductDetailVariant";
}

const LOCAL_IMAGE_MAP: Record<string, any> = {
  "iphone15.jpg": require("../assets/img/iphone.png"),
  "macbook.jpg": require("../assets/img/macbook.png"),
  "lipstick.jpg": require("../assets/img/lipstick.png"),
  "mango.jpg": require("../assets/img/cherry.png"),
  "headphone1.png": require("../assets/img/headphone1.png"),
  "headphone2.png": require("../assets/img/headphone2.png"),
};

// @ts-ignore
const ProductListScreen = ({ route, navigation }) => {
  const { categoryName } = route.params;
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  const [activeTab, setActiveTab] = useState("Best Sales");
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductsByCategory();
  }, [categoryName]);

  const fetchProductsByCategory = async () => {
    setLoading(true);
    setError("");
    try {
      // ✅ dùng api.get thay vì fetch
      const data = await api.get(
        `/api/products/category/${categoryName.toLowerCase()}`
      );
      console.log(`Data for ${categoryName}:`, data);

      const mapped: FrontendProduct[] = data.map((item: any) => {
        const localImg = LOCAL_IMAGE_MAP[item.imageURL];

        const detailScreenTarget =
          categoryName.toLowerCase() === "fashion" ||
          categoryName.toLowerCase() === "beauty"
            ? "ProductDetailVariant"
            : "ProductDetailGeneral";

        return {
          id: item.productId?.toString() ?? `temp_${Math.random()}`,
          name: item.name || "Unnamed Product",
          rating: item.rating || 0,
          price: item.price || 0,
          image: localImg ?? { uri: `${API_BASE_URL}/images/${item.imageURL}` },
          detailScreen: detailScreenTarget,
        };
      });

      setProducts(mapped);
    } catch (err: any) {
      console.error("Error loading products:", err);
      setError(`Không thể tải sản phẩm: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  // --- HEADER  ---
  const renderHeader = () => (
    <View style={[globalStyles.header, { paddingHorizontal: SIZES.padding }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <Text style={globalStyles.headerTitle}>{categoryName || "Products"}</Text>
      <View style={globalStyles.headerIconContainer}>
        <TouchableOpacity
          style={globalStyles.iconButton}
          onPress={() => navigation.navigate("CheckoutStack")}
        >
          <View>
            <Ionicons name="cart-outline" size={24} color={COLORS.text} />
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileIcon}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- FILTER TABS  ---
  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      {filterTabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={styles.tabButton}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
          >
            {tab}
          </Text>
          {activeTab === tab && <View style={styles.activeLine} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  // --- HIỂN THỊ LOADING / LỖI (Giữ nguyên) ---
  if (loading) {
    /* ... */
  }
  if (error) {
    /* ... */
  }

  // --- HIỂN THỊ SẢN PHẨM ---
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {renderHeader()}
      <FlatList
        ListHeaderComponent={
          <>
            <View style={{ paddingHorizontal: SIZES.padding }}>
              <SearchBar />
            </View>
            {renderFilterTabs()}
          </>
        }
        data={products}
        keyExtractor={(item) => item.id}
        // --- 5. CẬP NHẬT RENDER ITEM VỚI ONPRESS ---
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: SIZES.padding }}>
            <ProductListItem
              item={item}
              onPress={() =>
                navigation.navigate(item.detailScreen, {
                  productId: item.id, // <-- Gửi productId
                  name: item.name, // <-- Gửi name
                })
              }
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 80 }} />}
      />
    </SafeAreaView>
  );
};

// --- STYLES (Giữ nguyên) ---
const styles = StyleSheet.create({
  backButton: { marginRight: 15 },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 15,
    overflow: "hidden",
  },
  profileImage: { width: "100%", height: "100%" },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    paddingHorizontal: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: { paddingBottom: 10, alignItems: "center" },
  tabText: { fontSize: 16, color: COLORS.textLight, fontWeight: "500" },
  tabTextActive: { color: COLORS.primary, fontWeight: "700" },
  activeLine: {
    height: 2,
    width: "60%",
    backgroundColor: COLORS.primary,
    position: "absolute",
    bottom: 0,
  },
  cartBadge: {
    position: "absolute",
    right: -8,
    top: -5,
    backgroundColor: "red",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default ProductListScreen;
