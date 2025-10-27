import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Switch,
  ScrollView,
  ActivityIndicator,
  ImageSourcePropType,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { api, API_BASE_URL } from "../api/api";
import { getLocalImage } from "../constants/imageMap";
import { useFocusEffect } from "@react-navigation/native";

interface ApiFeature {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}
interface ApiReview {
  id: string;
  user: string;
  date: string;
  comment: string;
  userImage: string;
}
interface ApiRelevantProduct {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: string;
}
interface ApiProductDetail {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  imageURL: string;
  features: ApiFeature[];
  reviews: ApiReview[];
  relevantProducts: ApiRelevantProduct[];
}
interface FrontendProductDetail {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  imageSource: ImageSourcePropType;
  features: ApiFeature[];
  reviews: ApiReview[];
  relevantProducts: {
    id: string;
    name: string;
    rating: number;
    price: number;
    image: ImageSourcePropType;
  }[];
}

// @ts-ignore
const ProductDetailGeneralScreen = ({ route, navigation }) => {
  const { productId, name: initialName } = route.params;
  const [notify, setNotify] = React.useState(false);

  const { addItem, loadCart } = useCart();
  const [itemCount, setItemCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchCartCount = async () => {
        try {
          const cart = await loadCart();
          setItemCount(cart.items.length);
        } catch (e) {
          console.error("Failed to load cart count in DetailScreen", e);
          setItemCount(0);
        }
      };
      fetchCartCount();
    }, [loadCart])
  );

  const [product, setProduct] = useState<FrontendProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError("");
    setProduct(null);
    try {
      const data: ApiProductDetail = await api.get(
        `/api/products/general/${productId}`
      );
      console.log("Product Detail Data (General):", data);

      if (!data || !data.id) {
        throw new Error("Product data is invalid or not found from API.");
      }

      const localImageSource = getLocalImage(data.imageURL, API_BASE_URL);

      const mappedRelevantProducts = data.relevantProducts.map((p) => ({
        ...p,
        image: getLocalImage(p.image, API_BASE_URL),
      }));

      const mappedReviews = data.reviews.map((r) => ({
        ...r,
      }));

      const mappedProduct: FrontendProductDetail = {
        id: data.id,
        name: data.name,
        price: data.price,
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
        description: data.description,
        imageSource: localImageSource,
        features: data.features,
        reviews: mappedReviews,
        relevantProducts: mappedRelevantProducts,
      };
      setProduct(mappedProduct);
    } catch (err: any) {
      console.error("Error fetching product details:", err);
      setError(err.message || "Không thể tải chi tiết sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addItem(Number(product.id), 1);
      Alert.alert("Success", "Product added to cart!");
      const cart = await loadCart();
      setItemCount(cart.items.length);
    } catch (error: any) {
      console.error("Failed to add item:", error);
      Alert.alert("Error", error.message || "Could not add item to cart.");
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addItem(Number(product.id), 1);
      const cart = await loadCart();
      setItemCount(cart.items.length);
      navigation.navigate("CheckoutStack");
    } catch (error: any) {
      console.error("Failed to add item for buy now:", error);
      Alert.alert("Error", error.message || "Could not add item to cart.");
    }
  };

  const renderHeader = () => (
    <View style={[globalStyles.header, { paddingHorizontal: SIZES.padding }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <Text
        style={globalStyles.headerTitle}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {product?.name || initialName || "Product"}
      </Text>
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

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        {renderHeader()}
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ flex: 1, justifyContent: "center" }}
        />
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || "Không tìm thấy sản phẩm."}
          </Text>
          <TouchableOpacity
            onPress={fetchProductDetails}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {renderHeader()}
      <ScrollView>
        {/* Image */}
        <View style={styles.carouselContainer}>
          <Image
            source={product.imageSource}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        {/* Price & Rating */}
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>${product.price.toFixed(2)}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color={COLORS.accent} />
            <Text style={styles.ratingText}>
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {product.features.map((item) => (
            <View key={item.id} style={styles.featureItem}>
              <Ionicons name={item.icon} size={20} color={COLORS.primary} />
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity>
              <Text style={globalStyles.viewAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reviewSummary}>
            {/* ... review summary JSX ... */}
          </View>
          {product.reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <Image
                source={{ uri: review.userImage }}
                style={styles.reviewUserImage}
              />
              <View style={styles.reviewContent}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>{review.user}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Relevant Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Relevant products</Text>
            <TouchableOpacity>
              <Text style={globalStyles.viewAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={product.relevantProducts}
            renderItem={({ item }) => (
              <ProductCard
                name={item.name}
                rating={item.rating || 0}
                price={item.price || 0}
                imageSource={item.image}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        </View>

        {/* Notify Me */}
        <View style={styles.notifyContainer}>{/* ... notify JSX ... */}</View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- (Styles) ---
const styles = StyleSheet.create({
  backButton: { marginRight: 10 },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    overflow: "hidden",
  },
  profileImage: { width: "100%", height: "100%" },
  carouselContainer: {
    height: 300,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  mainImage: { width: "80%", height: "80%" },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
  },
  priceText: { fontSize: 24, fontWeight: "bold", color: COLORS.text },
  rating: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 5, color: COLORS.textLight },
  section: { paddingHorizontal: SIZES.padding, marginBottom: 20 },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  descriptionText: {
    color: COLORS.text,
    marginTop: 5,
    lineHeight: 22,
    fontSize: 15,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding / 2,
    backgroundColor: COLORS.surface,
    marginVertical: 10,
    borderRadius: SIZES.radius,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 15,
    paddingLeft: SIZES.padding / 2,
  },
  featureText: { marginLeft: 10, color: COLORS.text, fontSize: 14 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  reviewSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: COLORS.surface,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  reviewScore: { fontSize: 24, fontWeight: "bold", color: COLORS.text },
  reviewCount: { color: COLORS.textLight, fontSize: 12 },
  ratingBars: { flex: 1, marginLeft: 20 },
  ratingBarContainer: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginBottom: 5,
  },
  ratingBar: {
    height: "100%",
    backgroundColor: COLORS.accent,
    borderRadius: 4,
  },
  reviewItem: {
    flexDirection: "row",
    marginBottom: 15,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 15,
  },
  reviewUserImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  reviewContent: { flex: 1 },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  reviewUser: { fontWeight: "bold", color: COLORS.text },
  reviewDate: { color: COLORS.textLight, fontSize: 12 },
  reviewComment: { color: COLORS.text, lineHeight: 18 },
  notifyContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginVertical: 10,
  },
  notifyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  notifyText: { flex: 1, fontWeight: "600", color: COLORS.text },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  cartButton: {
    width: 60,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    marginRight: 10,
  },
  buyButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
  },
  buyButtonText: { color: COLORS.background, fontSize: 16, fontWeight: "bold" },
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
  cartBadgeText: { color: "white", fontSize: 10, fontWeight: "bold" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.padding,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
  },
  retryButtonText: { color: COLORS.background, fontWeight: "bold" },
});
export default ProductDetailGeneralScreen;
