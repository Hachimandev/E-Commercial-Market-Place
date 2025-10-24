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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import SearchBar from "../components/SearchBar";
import ProductGridItem from "../components/ProductGridItem";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

// --- 1. ĐỊNH NGHĨA TYPES RÕ RÀNG ---
interface GridProduct {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: ImageSourcePropType;
  detailScreen: string;
}

interface RelevantProduct {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: ImageSourcePropType;
}

interface MockDataCategory {
  banner: ImageSourcePropType;
  products: GridProduct[];
  relevantProducts: RelevantProduct[];
}

interface MockData {
  [key: string]: MockDataCategory;
}

// --- 2. ÁP DỤNG TYPE CHO MOCK_DATA ---
const MOCK_DATA: MockData = {
  "Fresh Fruits": {
    banner: {
      uri: "https://images.unsplash.com/photo-1543083477-4f785aeafaa9?q=80&w=2070",
    },
    products: [
      {
        id: "a",
        name: "Pear",
        rating: 4,
        price: 10,
        image: require("../assets/img/pear.png"),
        detailScreen: "ProductDetailGeneral",
      },
      {
        id: "b",
        name: "Avocado",
        rating: 5,
        price: 4,
        image: require("../assets/img/fresh.png"),
        detailScreen: "ProductDetailGeneral",
      },
    ],
    relevantProducts: [
      {
        id: "e",
        name: "Peach",
        rating: 4.0,
        price: 15,
        image: require("../assets/img/peach.png"),
      },
    ],
  },
  Beauty: {
    banner: {
      uri: "https://images.unsplash.com/photo-1556228720-19b0672b2a0d?q=80&w=2070",
    },
    products: [
      {
        id: "a",
        name: "Lipstick",
        rating: 4,
        price: 25,
        image: require("../assets/img/lipstick.png"),
        detailScreen: "ProductDetailVariant",
      },
      {
        id: "b",
        name: "Foundation",
        rating: 5,
        price: 40,
        image: require("../assets/img/foundation.png"),
        detailScreen: "ProductDetailVariant",
      },
    ],
    relevantProducts: [
      {
        id: "e",
        name: "Perfume",
        rating: 4.8,
        price: 120,
        image: require("../assets/img/perfume.png"),
      },
    ],
  },
};

// @ts-ignore
const ProductGridScreen = ({ route, navigation }) => {
  const { categoryName } = route.params;
  const { getCartItemCount } = useCart(); // <-- 2. LẤY HÀM
  const itemCount = getCartItemCount();

  // @ts-ignore
  const data = MOCK_DATA[categoryName] || MOCK_DATA["Fresh Fruits"];

  // ... (renderHeader giữ nguyên)
  const renderHeader = () => (
    <View style={[globalStyles.header, { paddingHorizontal: SIZES.padding }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      <Text style={globalStyles.headerTitle}>{categoryName}</Text>
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

      <FlatList
        ListHeaderComponent={
          <>
            <View style={{ paddingHorizontal: SIZES.padding }}>
              <SearchBar />
            </View>
            <View style={styles.bannerContainer}>
              <Image
                source={data.banner}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>
          </>
        }
        data={data.products} // <-- data.products giờ đã có type
        // --- 3. SỬA LỖI RENDERITEM ---
        renderItem={({ item }) => (
          <ProductGridItem
            item={item} // <-- Truyền cả object 'item'
            onPress={() =>
              navigation.navigate(item.detailScreen, {
                productId: item.id,
                name: item.name,
              })
            }
          />
        )}
        keyExtractor={(item) => item.id} // <-- Lỗi 'never' đã được sửa
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={{ paddingHorizontal: SIZES.padding }}>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
            <View style={styles.relevantContainer}>
              <View style={styles.relevantHeader}>
                <Text style={globalStyles.sectionTitle}>Relevant products</Text>
                <TouchableOpacity>
                  <Text style={globalStyles.viewAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={data.relevantProducts}
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
              />
            </View>
            <View style={{ height: 50 }} />
          </View>
        }
      />
    </SafeAreaView>
  );
};

// ... (Styles giữ nguyên)
const styles = StyleSheet.create({
  backButton: {
    marginRight: 15,
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 15,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  bannerContainer: {
    height: 200,
    borderRadius: SIZES.radius,
    overflow: "hidden",
    marginBottom: SIZES.padding,
    marginHorizontal: SIZES.padding,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
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
  seeAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  relevantContainer: {
    marginTop: 10,
  },
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
