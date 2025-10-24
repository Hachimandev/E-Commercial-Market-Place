import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Switch,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

// @ts-ignore
const productData = {
  id: "prod-headphone-1",
  name: "Headphone",
  price: 59,
  rating: 4.5,
  reviewCount: 99,
  description:
    "Quis occaecat magna elit magna do nisi ipsum amet excepteur tempor nisi exercitation qui...",
  images: [
    {
      id: "1",
      image: {
        uri: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070",
      },
    },
  ],
  features: [
    { id: "1", icon: "rocket-outline", text: "Express" },
    { id: "2", icon: "refresh-outline", text: "30-day free return" },
    { id: "3", icon: "shield-checkmark-outline", text: "Authorized shop" },
    { id: "4", icon: "star-outline", text: "Good review" },
  ],
  reviews: [
    {
      id: "r1",
      user: "Jevon Raynor",
      date: "A day ago",
      comment: "Deserunt minim incididunt cillum",
      userImage: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "r2",
      user: "Jason D.",
      date: "3 days ago",
      comment: "Magna pariatur sit et ullamco paria",
      userImage: "https://randomuser.me/api/portraits/men/33.jpg",
    },
  ],
  relevantProducts: [
    {
      id: "a",
      name: "Headphone",
      rating: 4.5,
      price: 99,
      image: require("../assets/img/headphone1.png"),
    },
    {
      id: "b",
      name: "Headphone",
      rating: 4.5,
      price: 99,
      image: require("../assets/img/headphone2.png"),
    },
    {
      id: "c",
      name: "Headphone",
      rating: 4.5,
      price: 99,
      image: require("../assets/img/headphone3.png"),
    },
  ],
};

// @ts-ignore
const ProductDetailGeneralScreen = ({ route, navigation }) => {
  const { name } = route.params;
  const [notify, setNotify] = React.useState(false);
  const { addItem, getCartItemCount } = useCart(); // <-- 2. LẤY HÀM TỪ CONTEXT
  const itemCount = getCartItemCount();
  // 3. TẠO ITEM ĐỂ THÊM VÀO GIỎ HÀNG
  const itemToAdd = {
    id: productData.id,
    name: productData.name,
    price: productData.price,
    image: productData.images[0].image,
  };

  // 4. HÀM XỬ LÝ
  const handleAddToCart = () => {
    addItem(itemToAdd, 1);
    // (Bạn có thể thêm 1 thông báo "Đã thêm vào giỏ" ở đây)
  };

  const handleBuyNow = () => {
    addItem(itemToAdd, 1); // Thêm 1 sản phẩm
    navigation.navigate("CheckoutStack"); // Lập tức đi tới giỏ hàng
  };

  const renderHeader = () => (
    <View style={[globalStyles.header, { paddingHorizontal: SIZES.padding }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <Text style={globalStyles.headerTitle}>{name}</Text>
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

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {renderHeader()}
      <ScrollView>
        <View style={styles.carouselContainer}>
          <Image
            source={productData.images[0].image}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        {/* Price & Rating */}
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>${productData.price}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color={COLORS.accent} />
            <Text style={styles.ratingText}>
              {productData.rating} ({productData.reviewCount} reviews)
            </Text>
          </View>
        </View>

        {/* Description  */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{productData.description}</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {productData.features.map((item) => (
            <View key={item.id} style={styles.featureItem}>
              <Ionicons
                name={item.icon as any}
                size={20}
                color={COLORS.primary}
              />
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
          {/* Review Summary */}
          <View style={styles.reviewSummary}>
            <View>
              <Text style={styles.reviewScore}>{productData.rating}/5</Text>
              <Text style={styles.reviewCount}>
                ({productData.reviewCount} reviews)
              </Text>
            </View>
            <View style={styles.ratingBars}>
              <View style={styles.ratingBarContainer}>
                <View style={[styles.ratingBar, { width: "80%" }]} />
              </View>
              <View style={styles.ratingBarContainer}>
                <View style={[styles.ratingBar, { width: "40%" }]} />
              </View>
            </View>
          </View>
          {/* Individual Reviews */}
          {productData.reviews.map((review) => (
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
            data={productData.relevantProducts}
            renderItem={({ item }) => (
              <ProductCard
                name={item.name}
                rating={item.rating}
                price={item.price}
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
        <View style={styles.notifyContainer}>
          <View style={styles.notifyIcon}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.notifyText}>Notify me of promotions</Text>
          <Switch
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.background}
            onValueChange={() => setNotify((prev) => !prev)}
            value={notify}
          />
        </View>

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
  carouselContainer: { height: 250, backgroundColor: COLORS.surface },
  mainImage: { width: "100%", height: "100%" },
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
  sectionTitle: { fontSize: SIZES.h3, fontWeight: "bold", color: COLORS.text },
  descriptionText: { color: COLORS.textLight, marginTop: 5, lineHeight: 20 },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    marginVertical: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 10,
  },
  featureText: { marginLeft: 10, color: COLORS.text, fontSize: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  reviewScore: { fontSize: 24, fontWeight: "bold" },
  reviewCount: { color: COLORS.textLight, fontSize: 12 },
  ratingBars: { flex: 1, marginLeft: 20 },
  ratingBarContainer: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginBottom: 4,
  },
  ratingBar: {
    height: "100%",
    backgroundColor: COLORS.accent,
    borderRadius: 3,
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
  reviewUser: { fontWeight: "bold" },
  reviewDate: { color: COLORS.textLight, fontSize: 12 },
  reviewComment: { color: COLORS.text },
  notifyContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
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
  notifyText: { flex: 1, fontWeight: "600" },
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
  cartBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default ProductDetailGeneralScreen;
