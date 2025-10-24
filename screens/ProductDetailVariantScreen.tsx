// E-Commercial-Market-Place/screens/ProductDetailVariantScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  ImageSourcePropType,
} from "react-native"; // <-- Thêm ImageSourcePropType
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import { useCart } from "../context/CartContext";

// --- 1. ĐỊNH NGHĨA TYPES RÕ RÀNG ---
interface ProductImage {
  id: string;
  image: ImageSourcePropType;
}

interface ProductColor {
  id: string;
  code: string;
}

interface ProductData {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  rating: number;
  offer: string;
  images: ProductImage[];
  colors: ProductColor[];
  sizes: string[];
}

// --- 2. ÁP DỤNG TYPE CHO productData ---
const productData: ProductData = {
  id: "tshirt-001",
  name: "Hoodie shirt",
  shortDescription: "Occaecat est deserunt tempor offici",
  price: 2.99,
  rating: 4.5,
  offer: "Buy 1 get 1",
  images: [
    {
      id: "img1",
      image: {
        uri: "https://images.unsplash.com/photo-1578918663372-3ab76643d83d?q=80&w=1964",
      },
    },
    {
      id: "img2",
      image: {
        uri: "https://images.unsplash.com/photo-1548883358-692c63c381c5?q=80&w=1964",
      },
    },
    {
      id: "img3",
      image: {
        uri: "https://images.unsplash.com/photo-1578918637741-599d1b02b66a?q=80&w=1964",
      },
    },
    {
      id: "img4",
      image: {
        uri: "https://images.unsplash.com/photo-1582845512747-e4233823c093?q=80&w=1964",
      },
    },
  ],
  colors: [
    { id: "c1", code: "#8B0000" }, // Dark Red
    { id: "c2", code: "#FF4500" }, // Orange Red
    { id: "c3", code: "#1E90FF" }, // Dodger Blue
  ],
  sizes: ["XS", "S", "M", "L", "XL"],
};

// @ts-ignore
const ProductDetailVariantScreen = ({ route, navigation }) => {
  const { name } = route.params;
  const { addItem } = useCart();

  // States
  const [mainImage, setMainImage] = useState(productData.images[0].image);
  const [selectedColor, setSelectedColor] = useState(productData.colors[0].id); // <-- LỖI ĐÃ ĐƯỢC SỬA
  const [selectedSize, setSelectedSize] = useState(productData.sizes[2]); // Default 'M'
  const [quantity, setQuantity] = useState(1);

  // Header (Giữ nguyên)
  const renderHeader = () => (
    <View
      style={[
        globalStyles.header,
        {
          paddingHorizontal: SIZES.padding,
          backgroundColor: "transparent",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[
          styles.headerButton,
          { backgroundColor: "rgba(255,255,255,0.7)" },
        ]}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <Text
        style={[
          globalStyles.headerTitle,
          { color: "white", textShadowColor: "black", textShadowRadius: 5 },
        ]}
      >
        {name || "T-Shirt"}
      </Text>
      <TouchableOpacity
        style={[
          styles.headerButton,
          { backgroundColor: "rgba(255,255,255,0.7)" },
        ]}
      >
        {/* Có thể thêm icon 'heart-outline' ở đây */}
      </TouchableOpacity>
    </View>
  );

  // Color Selector (Giữ nguyên)
  const renderColorOptions = () => (
    <View style={styles.optionContainer}>
      <Text style={styles.optionTitle}>Color</Text>
      <View style={styles.optionRow}>
        {productData.colors.map((color) => (
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

  // Size Selector (Giữ nguyên)
  const renderSizeOptions = () => (
    <View style={styles.optionContainer}>
      <Text style={styles.optionTitle}>Size</Text>
      <View style={styles.optionRow}>
        {productData.sizes.map((size) => (
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

  // Quantity Selector (Giữ nguyên)
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
        Total ${(productData.price * quantity).toFixed(2)}
      </Text>
    </View>
  );

  // Hàm xử lý "Add to cart" (Giữ nguyên)
  const handleAddToCart = () => {
    const itemToAdd = {
      id: `${productData.id}-${selectedColor}-${selectedSize}`,
      name: productData.name,
      price: productData.price,
      image: mainImage,
    };
    addItem(itemToAdd, quantity);
    navigation.navigate("CheckoutStack");
  };

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

        {/* Thumbnail Images */}
        <FlatList
          data={productData.images}
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
          <View style={styles.titleRow}>
            <Text style={styles.priceText}>${productData.price}</Text>
            {productData.offer && (
              <View style={styles.offerBadge}>
                <Text style={styles.offerText}>{productData.offer}</Text>
              </View>
            )}
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{productData.name}</Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color={COLORS.accent} />
              <Text style={styles.ratingText}>{productData.rating}</Text>
            </View>
          </View>
          <Text style={styles.descriptionText}>
            {productData.shortDescription}
          </Text>

          {renderColorOptions()}
          {renderSizeOptions()}
          {renderQuantitySelector()}

          {/* Links */}
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>Size guide</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>Reviews (99)</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart" size={22} color={COLORS.background} />
          <Text style={styles.addToCartButtonText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ... (Styles giữ nguyên)
const styles = StyleSheet.create({
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: { height: 350, backgroundColor: COLORS.surface },
  mainImage: { width: "100%", height: "100%" },
  thumbnailList: { padding: SIZES.padding },
  thumbnail: {
    width: 80,
    height: 80,
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
  priceText: { fontSize: 32, fontWeight: "bold" },
  offerBadge: {
    backgroundColor: "#E0F7FA",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  offerText: { color: COLORS.primary, fontWeight: "bold" },
  productName: { fontSize: 24, fontWeight: "600", color: COLORS.text },
  rating: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 5, color: COLORS.text, fontWeight: "bold" },
  descriptionText: {
    color: COLORS.textLight,
    fontSize: 14,
    marginVertical: 10,
  },
  optionContainer: { marginVertical: 10 },
  optionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  optionRow: { flexDirection: "row", alignItems: "center" },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    marginRight: 10,
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
    marginVertical: 15,
  },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  quantityButton: {
    width: 35,
    height: 35,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: { fontSize: 18, fontWeight: "600", marginHorizontal: 20 },
  totalPrice: { fontSize: 18, fontWeight: "bold" },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  linkText: { fontSize: 16, fontWeight: "500" },
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
    borderRadius: SIZES.radius,
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
