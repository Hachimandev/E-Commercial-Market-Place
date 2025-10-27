import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  ImageSourcePropType,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import { useCart } from "../context/CartContext";
import { api, API_BASE_URL } from "../api/api";
import { getLocalImage } from "../constants/imageMap";
import { useFocusEffect } from "@react-navigation/native";

interface ApiProductImage {
  id: string;
  imageURL: string;
}
interface ApiProductColor {
  id: string;
  code: string;
}
interface ApiProductDetail {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  rating: number;
  offer: string;
  mainImageURL: string;
  images: ApiProductImage[];
  colors: ApiProductColor[];
  sizes: string[];
}
interface ProductImageFE {
  id: string;
  image: ImageSourcePropType;
}
interface ProductColorFE {
  id: string;
  code: string;
}
interface FrontendProductDetail {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  rating: number;
  offer: string;
  images: ProductImageFE[];
  colors: ProductColorFE[];
  sizes: string[];
}

// @ts-ignore
const ProductDetailVariantScreen = ({ route, navigation }) => {
  const { productId, name: initialName } = route.params;

  const { addItem, loadCart } = useCart();
  const [itemCount, setItemCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchCartCount = async () => {
        try {
          const cart = await loadCart();
          setItemCount(cart.items.length);
        } catch (e) {
          console.error("Failed to load cart count in VariantScreen", e);
          setItemCount(0);
        }
      };
      fetchCartCount();
    }, [loadCart])
  );

  const [product, setProduct] = useState<FrontendProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mainImage, setMainImage] = useState<ImageSourcePropType>(
    getLocalImage()
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError("");
    setProduct(null);
    try {
      const data: ApiProductDetail = await api.get(
        `/api/products/variant/${productId}`
      );
      console.log("Product Detail Data (Variant):", data);

      if (!data || !data.id) {
        throw new Error("Product data is invalid or not found from API.");
      }

      const localImageSource = getLocalImage(data.mainImageURL, API_BASE_URL);

      const mappedImages = data.images.map((img) => ({
        id: img.id,
        image: getLocalImage(img.imageURL, API_BASE_URL),
      }));
      const allImages = [
        { id: "img_main", image: localImageSource },
        ...mappedImages,
      ];

      const mappedProduct: FrontendProductDetail = {
        id: data.id,
        name: data.name,
        price: data.price,
        rating: data.rating || 0,
        shortDescription: data.shortDescription,
        offer: data.offer,
        images: allImages,
        colors: data.colors,
        sizes: data.sizes,
      };

      setProduct(mappedProduct);
      setMainImage(localImageSource);

      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0].id);
      }
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
    } catch (err: any) {
      console.error("Error fetching product details:", err);
      setError(err.message || "Could not load product details.");
    } finally {
      setLoading(false);
    }
  };
  const renderHeader = () => (
    <View style={[globalStyles.header, styles.headerTransparent]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.headerButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <Text
        style={styles.headerTitleText}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {product?.name || initialName || "Product"}
      </Text>
      <TouchableOpacity style={styles.headerButton}>
        <Ionicons name="heart-outline" size={24} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );

  const renderColorOptions = () => (
    <View style={styles.optionContainer}>
      <Text style={styles.optionTitle}>Color</Text>
      <View style={styles.optionRow}>
        {product?.colors.map((color) => (
          <TouchableOpacity
            key={color.id}
            style={[styles.colorCircle, { backgroundColor: color.code }]}
            onPress={() => setSelectedColor(color.id)}
          >
            {selectedColor === color.id && (
              <Ionicons name="checkmark" size={20} color="white" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSizeOptions = () => (
    <View style={styles.optionContainer}>
      <Text style={styles.optionTitle}>Size</Text>
      <View style={styles.optionRow}>
        {product?.sizes.map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.sizeBox,
              selectedSize === size && styles.sizeBoxActive,
            ]}
            onPress={() => setSelectedSize(size)}
          >
            <Text
              style={[
                styles.sizeText,
                selectedSize === size && styles.sizeTextActive,
              ]}
            >
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderQuantitySelector = () => (
    <View style={styles.quantityContainer}>
      <Text style={styles.optionTitle}>Quantity</Text>
      <View style={styles.quantityRow}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity((q) => Math.max(1, q - 1))}
        >
          <Ionicons name="remove" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity((q) => q + 1)}
        >
          <Ionicons name="add" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      <Text style={styles.totalPrice}>
        Total ${((product?.price || 0) * quantity).toFixed(2)}
      </Text>
    </View>
  );

  const handleAddToCart = async () => {
    if (!product) return;

    if (product.colors.length > 0 && !selectedColor) {
      Alert.alert("Please select a color");
      return;
    }
    if (product.sizes.length > 0 && !selectedSize) {
      Alert.alert("Please select a size");
      return;
    }

    try {
      await addItem(Number(product.id), quantity);
      Alert.alert("Success", "Product added to cart!");
      const cart = await loadCart();
      setItemCount(cart.items.length);
      navigation.goBack();
    } catch (error: any) {
      console.error("Failed to add variant item:", error);
      Alert.alert("Error", error.message || "Could not add item to cart.");
    }
  };
  if (loading) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        {renderHeader()}
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.centerSpinner}
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
    <SafeAreaView style={[globalStyles.safeArea, { position: "relative" }]}>
      <ScrollView>
        {renderHeader()}
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image
            source={mainImage}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        {/* Thumbnails */}
        <FlatList
          data={product.images}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setMainImage(item.image)}>
              <Image source={item.image} style={styles.thumbnail} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailList}
        />

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>{/* ... price & offer ... */}</View>
          <View style={styles.titleRow}>{/* ... name & rating ... */}</View>
          <Text style={styles.descriptionText}>{product.shortDescription}</Text>

          {renderColorOptions()}
          {renderSizeOptions()}
          {renderQuantitySelector()}

          {/* Links */}
          <TouchableOpacity style={styles.linkRow}>
            {/* ... size guide ... */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow}>
            {/* ... reviews ... */}
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart} // Gọi hàm đã sửa
        >
          <Ionicons name="cart" size={22} color={COLORS.background} />
          <Text style={styles.addToCartButtonText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- (Styles) ---
const styles = StyleSheet.create({
  headerTransparent: {
    paddingHorizontal: SIZES.padding,
    backgroundColor: "transparent",
    position: "absolute",
    top: Platform.OS === "ios" ? SIZES.padding * 2.5 : SIZES.padding * 1.5,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  headerTitleText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginHorizontal: 10,
  },
  centerSpinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  imageContainer: { height: 400, backgroundColor: COLORS.surface },
  mainImage: { width: "100%", height: "100%" },
  thumbnailList: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: SIZES.radius,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoContainer: { padding: SIZES.padding },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  priceText: { fontSize: 32, fontWeight: "bold", color: COLORS.text },
  offerBadge: {
    backgroundColor: "#E0F2F7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  offerText: { color: COLORS.primary, fontWeight: "bold" },
  productName: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 5,
  },
  rating: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 5, color: COLORS.text, fontWeight: "bold" },
  descriptionText: {
    color: COLORS.textLight,
    fontSize: 15,
    marginVertical: 15,
    lineHeight: 22,
  },
  optionContainer: { marginVertical: 15 },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: COLORS.text,
  },
  optionRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  colorCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 15,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  sizeBox: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    marginRight: 10,
    marginBottom: 10,
  },
  sizeBoxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeText: { color: COLORS.text, fontWeight: "500" },
  sizeTextActive: { color: COLORS.background },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 20,
    color: COLORS.text,
  },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  linkText: { fontSize: 16, fontWeight: "500", color: COLORS.text },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  addToCartButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius * 2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  addToCartButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default ProductDetailVariantScreen;
