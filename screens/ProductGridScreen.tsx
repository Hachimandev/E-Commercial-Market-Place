import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ImageSourcePropType,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import SearchBar from "../components/SearchBar";
import ProductGridItem from "../components/ProductGridItem";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { api, API_BASE_URL } from "../api/api";
import { getLocalImage } from "../constants/imageMap";
import { useFocusEffect } from "@react-navigation/native";

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

// @ts-ignore
const ProductGridScreen = ({ route, navigation }) => {
  const { categoryName } = route.params;
  const { loadCart } = useCart();
  const [itemCount, setItemCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    try {
      console.log("Refreshing cart count (Grid)...");
      const cart = await loadCart();
      setItemCount(cart.items.length);
    } catch (e) {
      console.error("Failed to refresh cart count (Grid)", e);
    }
  }, [loadCart]);

  useFocusEffect(
    useCallback(() => {
      refreshCartCount();
    }, [refreshCartCount])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchCartCount = async () => {
        try {
          const cart = await loadCart();
          setItemCount(cart.items.length);
        } catch (e) {
          console.error("Failed to load cart count", e);
          setItemCount(0);
        }
      };
      fetchCartCount();
    }, [loadCart])
  );

  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [relevantProducts, setRelevantProducts] = useState<RelevantProduct[]>(
    []
  );
  const [bannerImage, setBannerImage] = useState<ImageSourcePropType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductsByCategory();
  }, [categoryName]);

  const fetchProductsByCategory = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get(
        `/api/products/category/${categoryName.toLowerCase()}`
      );
      console.log(`Data for ${categoryName}:`, data);

      const mapped: FrontendProduct[] = data.map((item: any) => {
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
          image: getLocalImage(item.imageURL, API_BASE_URL),
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

  // --- HEADER --
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

  // --- LOADING / ERROR --
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
        data={products}
        renderItem={({ item }) => (
          <ProductGridItem
            item={item}
            onPress={() =>
              navigation.navigate(item.detailScreen, {
                productId: item.id,
                name: item.name,
              })
            }
            onCartUpdated={refreshCartCount}
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
                  data={relevantProducts}
                  renderItem={({ item }) => (
                    <ProductCard
                      name={item.name}
                      rating={item.rating || 0}
                      price={item.price || 0}
                      imageSource={item.image}
                      // onPress={() => navigation.push('ProductDetailGeneral', { productId: item.id, name: item.name })} // Thêm onPress nếu cần
                    />
                  )}
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

// --- STYLES ---
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

export default ProductGridScreen;
