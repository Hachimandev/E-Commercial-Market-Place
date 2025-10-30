import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ImageSourcePropType,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryIcon from "../components/CategoryIcon";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import { useCart } from "../context/CartContext";
import { useFocusEffect } from "@react-navigation/native";
import { api, API_BASE_URL } from "../api/api";
import { getLocalImage } from "../constants/imageMap";

const categories = [
  {
    id: "1",
    name: "Electronics",
    color: "#8A2BE2",
    image: require("../assets/img/electronics.png"),
    targetScreen: "ProductList", // <-- List View
  },
  {
    id: "2",
    name: "Fashion",
    color: "#4682B4",
    image: require("../assets/img/fashion.png"),
    targetScreen: "ProductList", // <-- List View
  },
  {
    id: "3",
    name: "Beauty",
    color: "#FF6347",
    image: require("../assets/img/beauty.png"),
    targetScreen: "ProductGrid", // <-- Grid View
  },
  {
    id: "4",
    name: "Fresh Fruits",
    color: "#DC143C",
    image: require("../assets/img/fresh.png"),
    targetScreen: "ProductGrid", // <-- Grid View
  },
];

interface RecommendedProduct {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: ImageSourcePropType;
  detailScreen: "ProductDetailGeneral" | "ProductDetailVariant";
}

// @ts-ignore
const HomeScreen: React.FC = ({ navigation }) => {
  const { loadCart } = useCart();

  const [itemCount, setItemCount] = useState(0);

  const [recommendedProducts, setRecommendedProducts] = useState<
    RecommendedProduct[]
  >([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [errorRecommended, setErrorRecommended] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchCartCount = async () => {
        try {
          const cart = await loadCart();
          setItemCount(cart.items.length);
        } catch (e) {
          console.error("Failed to load cart count on HomeScreen", e);
          setItemCount(0);
        }
      };
      fetchCartCount();
    }, [loadCart])
  );

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setLoadingRecommended(true);
      setErrorRecommended(null);
      try {
        // 1. Gọi API endpoint mới
        const data = await api.get("/api/products/recommended");

        // 2. Map dữ liệu API sang interface Frontend
        const mappedProducts: RecommendedProduct[] = data.map((item: any) => {
          // (Logic xác định màn hình chi tiết, bạn có thể cần 'item.category.name')
          const categoryName = item.category?.name?.toLowerCase() || "";
          const detailScreenTarget =
            categoryName === "fashion" || categoryName === "beauty"
              ? "ProductDetailVariant"
              : "ProductDetailGeneral";

          return {
            id: item.productId.toString(),
            name: item.name,
            rating: item.rating,
            price: item.price,
            image: getLocalImage(item.imageURL, API_BASE_URL), // Map ảnh
            detailScreen: detailScreenTarget, // Lưu màn hình chi tiết
          };
        });

        setRecommendedProducts(mappedProducts);
      } catch (err: any) {
        console.error("Failed to fetch recommended products:", err);
        setErrorRecommended(err.message || "Could not load recommendations.");
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommendedProducts(); // Gọi hàm fetch
  }, []);

  const handleCategoryPress = (item: any) => {
    navigation.navigate(item.targetScreen, { categoryName: item.name });
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Header (Sử dụng itemCount từ state) */}
        <View style={globalStyles.header}>
          <Text style={globalStyles.headerTitle}>All Deals</Text>
          <View style={globalStyles.headerIconContainer}>
            <TouchableOpacity
              style={globalStyles.iconButton}
              onPress={() => navigation.navigate("CheckoutStack")}
            >
              <View>
                <Ionicons name="cart-outline" size={24} color="black" />
                {itemCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{itemCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileIcon}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/44.jpg",
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar />

        {/* Categories */}
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCategoryPress(item)}>
              <CategoryIcon
                name={item.name}
                imageSource={item.image}
                backgroundColor={item.color}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />

        {/* Banner */}
        <View style={styles.mainBanner}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Shoes</Text>
            <Text style={styles.bannerSubtitle}>50% off</Text>
            <TouchableOpacity style={styles.buyNowButton}>
              <Text style={styles.buyNowText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require("../assets/img/shoes-sale-50.png")}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        {/* Small Banners */}
        <View style={styles.smallBannersContainer}>
          <View style={styles.smallBanner}>
            <Text style={styles.discountBadge}>30%</Text>
            <Image
              source={require("../assets/img/tuixach-sale-30.png")}
              style={styles.smallBannerImage}
            />
          </View>
          <View style={styles.smallBanner}>
            <Text style={styles.discountBadge}>30%</Text>
            <Image
              source={require("../assets/img/macbook-sale-30.png")}
              style={styles.smallBannerImage}
            />
          </View>
        </View>

        {/* Recommended for you */}
        <View style={styles.recommendedHeader}>
          <Text style={globalStyles.sectionTitle}>Recommended for you</Text>
          <TouchableOpacity>
            <Text style={globalStyles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Products */}
        {loadingRecommended ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginVertical: 30 }}
          />
        ) : errorRecommended ? (
          <Text style={styles.errorText}>{errorRecommended}</Text>
        ) : (
          <FlatList
            data={recommendedProducts} // <-- Sử dụng data từ state API
            renderItem={({ item }) => (
              <ProductCard
                name={item.name}
                rating={item.rating}
                price={item.price}
                imageSource={item.image}
                onPress={() =>
                  navigation.navigate(item.detailScreen, {
                    productId: item.id,
                    name: item.name,
                  })
                }
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          />
        )}

        {/* Đệm dưới cùng */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "lightgray",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  categoryList: {
    paddingVertical: 10,
  },
  mainBanner: {
    backgroundColor: "#f9f9f9",
    borderRadius: SIZES.radius,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginTop: 10,
    height: 180,
    overflow: "hidden",
  },
  bannerTextContainer: { zIndex: 1 },
  bannerTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },
  bannerSubtitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#FF0000",
    marginBottom: 15,
  },
  buyNowButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buyNowText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  bannerImage: {
    position: "absolute",
    right: -50,
    top: -30,
    width: "70%",
    height: "140%",
  },
  smallBannersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  smallBanner: {
    width: "48%",
    height: 120,
    borderRadius: SIZES.radius,
    overflow: "hidden",
    position: "relative",
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 0,
    backgroundColor: "red",
    color: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopRightRadius: SIZES.radius,
    borderBottomRightRadius: SIZES.radius,
    zIndex: 10,
    fontWeight: "bold",
  },
  smallBannerImage: {
    width: "100%",
    height: "100%",
  },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  productList: {
    paddingBottom: 20,
  },
  cartBadge: {
    position: "absolute",
    right: -8, // Tinh chỉnh vị trí
    top: -5, // Tinh chỉnh vị trí
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
  errorText: {
    // Style cho text báo lỗi
    textAlign: "center",
    color: COLORS.error,
    marginTop: 20,
    fontSize: 14,
  },
});

export default HomeScreen;
