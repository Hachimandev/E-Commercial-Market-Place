// E-Commercial-Market-Place/screens/ProductGridScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ImageSourcePropType,
  ActivityIndicator,
} from "react-native"; // <-- Thêm ActivityIndicator
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import SearchBar from "../components/SearchBar";
import ProductGridItem from "../components/ProductGridItem";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext"; // <-- Import useCart

// --- 1. ĐỊNH NGHĨA TYPES ---
interface FrontendProduct {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: ImageSourcePropType;
  detailScreen: "ProductDetailGeneral" | "ProductDetailVariant";
}

interface RelevantProduct {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: ImageSourcePropType;
}

// --- 2. LOCAL IMAGE MAP (Giữ nguyên hoặc cập nhật) ---
const LOCAL_IMAGE_MAP: Record<string, any> = {
  "iphone15.jpg": require("../assets/img/iphone.png"),
  "macbook.jpg": require("../assets/img/macbook.png"),
  "lipstick.jpg": require("../assets/img/lipstick.png"),
  "mango.jpg": require("../assets/img/cherry.png"),
  "headphone1.png": require("../assets/img/headphone1.png"),
  "headphone2.png": require("../assets/img/headphone2.png"),
  // Thêm các ảnh khác nếu cần
};

// @ts-ignore
const ProductGridScreen = ({ route, navigation }) => {
  const { categoryName } = route.params;
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  // --- 3. THÊM STATE CHO FETCHING ---
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [relevantProducts, setRelevantProducts] = useState<RelevantProduct[]>(
    []
  ); // State cho sản phẩm liên quan (tạm thời rỗng)
  const [bannerImage, setBannerImage] = useState<ImageSourcePropType | null>(
    null
  ); // State cho banner (tạm thời null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- 4. THÊM LOGIC FETCH API ---
  useEffect(() => {
    fetchProductsByCategory();
  }, [categoryName]);

  const fetchProductsByCategory = async () => {
    setLoading(true);
    setError("");
    try {
      const API_BASE_URL = "http://localhost:8080"; // <<< THAY IP NẾU CẦN

      const res = await fetch(
        `${API_BASE_URL}/api/products/category/${categoryName.toLowerCase()}`
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Fetch failed: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      console.log(`Data for ${categoryName}:`, data);

      const mapped: FrontendProduct[] = data.map((item: any) => {
        const localImg = LOCAL_IMAGE_MAP[item.imageURL];

        let detailScreenTarget: "ProductDetailGeneral" | "ProductDetailVariant";
        if (
          categoryName.toLowerCase() === "fashion" ||
          categoryName.toLowerCase() === "beauty"
        ) {
          detailScreenTarget = "ProductDetailVariant";
        } else {
          detailScreenTarget = "ProductDetailGeneral";
        }

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
      // TODO: Cần fetch cả relevantProducts và banner từ API (nếu có)
      // setRelevantProducts(...)
      // setBannerImage(...)
    } catch (error: any) {
      console.error("Error loading products:", error);
      setError(`Could not load products. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- HEADER (Giữ nguyên) ---
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

  // --- LOADING / ERROR (Thêm mới) ---
  if (loading) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        {renderHeader()}
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 50 }}
        />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        {renderHeader()}
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Text style={{ color: COLORS.textLight }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
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
            {/* Hiển thị banner nếu có */}
            {bannerImage && (
              <View style={styles.bannerContainer}>
                <Image
                  source={bannerImage}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              </View>
            )}
          </>
        }
        data={products} // <-- Sử dụng state
        // --- 5. CẬP NHẬT RENDER ITEM VỚI ONPRESS ---
        renderItem={({ item }) => (
          <ProductGridItem
            item={item} // <-- Truyền cả object
            onPress={() =>
              navigation.navigate(item.detailScreen, {
                productId: item.id, // <-- Gửi productId
                name: item.name, // <-- Gửi name
              })
            }
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={{ paddingHorizontal: SIZES.padding }}>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
            {/* Hiển thị relevant products nếu có */}
            {relevantProducts.length > 0 && (
              <View style={styles.relevantContainer}>
                <View style={styles.relevantHeader}>
                  <Text style={globalStyles.sectionTitle}>
                    Relevant products
                  </Text>
                  <TouchableOpacity>
                    <Text style={globalStyles.viewAllText}>See all</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={relevantProducts} // <-- Sử dụng state
                  // @ts-ignore
                  renderItem={({ item }) => <ProductCard item={item} />} // <-- Sửa lại prop
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
            <View style={{ height: 50 }} />
          </View>
        }
      />
    </SafeAreaView>
  );
};

// --- STYLES (Cập nhật) ---
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
  bannerContainer: {
    height: 200,
    borderRadius: SIZES.radius,
    overflow: "hidden",
    marginBottom: SIZES.padding,
    marginHorizontal: SIZES.padding,
  },
  bannerImage: { width: "100%", height: "100%" },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding,
  },
  seeAllButton: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginVertical: 15,
  },
  seeAllText: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  relevantContainer: { marginTop: 10 },
  relevantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartBadge: {
    // Thêm style badge
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
    // Thêm style badge text
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default ProductGridScreen;
