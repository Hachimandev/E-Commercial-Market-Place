// E-Commercial-Market-Place/screens/ProductListScreen.tsx

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
import CategoryCard from "../components/CategoryCard";
import ProductListItem from "../components/ProductListItem";
import { useCart } from "../context/CartContext";

// --- 1. ĐỊNH NGHĨA TYPES RÕ RÀNG ---
interface SubCategory {
  id: string;
  image: ImageSourcePropType;
  color: string;
}

interface ListItemProduct {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: ImageSourcePropType;
  detailScreen: string;
}

interface MockDataCategory {
  subCategories: SubCategory[];
  products: ListItemProduct[];
  banner: ImageSourcePropType;
}

interface MockData {
  [key: string]: MockDataCategory; // Type cho đối tượng MOCK_DATA
}

// --- 2. ÁP DỤNG TYPE CHO MOCK_DATA ---
const MOCK_DATA: MockData = {
  Electronics: {
    subCategories: [
      {
        id: "1",
        image: require("../assets/img/electronics.png"),
        color: "#E6E6FA",
      },
      {
        id: "2",
        image: require("../assets/img/tablet.png"),
        color: "#D8BFD8",
      },
      {
        id: "3",
        image: require("../assets/img/macbook.png"),
        color: "#FFE4E1",
      },
    ],
    products: [
      {
        id: "a",
        name: "Smartphone",
        rating: 4,
        price: 899,
        image: require("../assets/img/electronics.png"),
        detailScreen: "ProductDetailGeneral",
      },
      {
        id: "b",
        name: "Headphone",
        rating: 5,
        price: 59,
        image: require("../assets/img/headphone1.png"),
        detailScreen: "ProductDetailGeneral",
      },
      {
        id: "c",
        name: "Smartphone",
        rating: 4,
        price: 789,
        image: require("../assets/img/electronics.png"),
        detailScreen: "ProductDetailGeneral",
      },
    ],
    banner: {
      uri: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=2070",
    },
  },
  Fashion: {
    subCategories: [
      {
        id: "1",
        image: require("../assets/img/lipstick.png"),
        color: "#E0FFFF",
      },
      {
        id: "2",
        image: require("../assets/img/hoodie-shirt.png"),
        color: "#F0FFF0",
      },
      {
        id: "3",
        image: require("../assets/img/fashion.png"),
        color: "#F5F5DC",
      },
    ],
    products: [
      {
        id: "a",
        name: "T-Shirt",
        rating: 4,
        price: 2.99,
        image: require("../assets/img/hoodie-shirt.png"),
        detailScreen: "ProductDetailVariant",
      },
      {
        id: "b",
        name: "Denim Jacket",
        rating: 5,
        price: 89,
        image: require("../assets/img/denim-Jacket.png"),
        detailScreen: "ProductDetailVariant",
      },
    ],
    banner: {
      uri: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071",
    },
  },
};

const filterTabs = ["Best Sales", "Best Matched", "Popular"];

// @ts-ignore
const ProductListScreen = ({ route, navigation }) => {
  const { categoryName } = route.params;
  const [activeTab, setActiveTab] = useState("Best Sales");

  const { getCartItemCount } = useCart(); // <-- 2. LẤY HÀM
  const itemCount = getCartItemCount();

  // @ts-ignore
  const data = MOCK_DATA[categoryName] || MOCK_DATA.Electronics;

  // ... (renderHeader và renderFilterTabs giữ nguyên)
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

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {renderHeader()}

      <FlatList
        ListHeaderComponent={
          <>
            <View style={{ paddingHorizontal: SIZES.padding }}>
              <SearchBar />
            </View>
            <View>
              <View
                style={[styles.subHeader, { paddingHorizontal: SIZES.padding }]}
              >
                <Text style={globalStyles.sectionTitle}>Categories</Text>
                <TouchableOpacity>
                  <Text style={globalStyles.viewAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={data.subCategories}
                renderItem={({ item }) => (
                  <CategoryCard
                    imageSource={item.image}
                    backgroundColor={item.color}
                  />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: SIZES.padding }}
              />
            </View>
            {renderFilterTabs()}
          </>
        }
        data={data.products} // <-- data.products giờ đã có type
        // --- 3. SỬA LỖI RENDERITEM ---
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: SIZES.padding }}>
            <ProductListItem
              item={item} // <-- Truyền cả object 'item'
              onPress={() =>
                navigation.navigate(item.detailScreen, {
                  productId: item.id,
                  name: item.name,
                })
              }
            />
          </View>
        )}
        keyExtractor={(item) => item.id} // <-- Lỗi 'never' đã được sửa
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={{ paddingHorizontal: SIZES.padding }}>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
            <View style={styles.bottomBannerContainer}>
              <Image
                source={data.banner}
                style={styles.bottomBannerImage}
                resizeMode="cover"
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
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    paddingHorizontal: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    paddingBottom: 10,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  activeLine: {
    height: 2,
    width: "60%",
    backgroundColor: COLORS.primary,
    position: "absolute",
    bottom: 0,
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
  bottomBannerContainer: {
    height: 150,
    borderRadius: SIZES.radius,
    overflow: "hidden",
    marginBottom: SIZES.padding,
  },
  bottomBannerImage: {
    width: "100%",
    height: "100%",
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
