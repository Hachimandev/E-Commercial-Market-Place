import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ImageSourcePropType,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryIcon from "../components/CategoryIcon";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { globalStyles, COLORS, SIZES } from "../constants/styles";

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
}

const recommendedProducts: RecommendedProduct[] = [
  {
    id: "a",
    name: "Shoes",
    rating: 4.5,
    price: 299,
    image: require("../assets/img/shoes-boot.png"),
  },
  {
    id: "b",
    name: "Tablet",
    rating: 4.8,
    price: 499,
    image: require("../assets/img/tablet.png"),
  },
  {
    id: "c",
    name: "Pear",
    rating: 4.3,
    price: 12,
    image: require("../assets/img/pear.png"),
  },
];

// @ts-ignore
const HomeScreen: React.FC = ({ navigation }) => {
  const handleCategoryPress = (item: any) => {
    navigation.navigate(item.targetScreen, { categoryName: item.name });
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Header */}
        <View style={globalStyles.header}>
          <Text style={globalStyles.headerTitle}>All Deals</Text>
          <View style={globalStyles.headerIconContainer}>
            <TouchableOpacity style={globalStyles.iconButton}>
              <Ionicons name="cart-outline" size={24} color="black" />
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

        {/* Categories (Cập nhật onPress) */}
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

        <FlatList
          data={recommendedProducts}
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
          contentContainerStyle={styles.productList}
        />

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

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
});

export default HomeScreen;
