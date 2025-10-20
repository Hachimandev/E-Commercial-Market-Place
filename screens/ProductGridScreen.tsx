// E-Commercial-Market-Place/screens/ProductGridScreen.tsx
// (Trước đây là ProductListScreen.tsx)

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

// === DỮ LIỆU GIẢ ĐỊNH ===
const MOCK_DATA = {
  "Fresh Fruits": {
    banner: {
      image: require("../assets/img/melon.png"),
    },
    products: [
      {
        id: "a",
        name: "Pear",
        rating: 4,
        price: 10,
        image: require("../assets/img/pear.png"),
      },
      {
        id: "b",
        name: "Avocado",
        rating: 5,
        price: 4,
        image: require("../assets/img/fresh.png"),
      },
      {
        id: "c",
        name: "Cherry",
        rating: 5,
        price: 10,
        image: require("../assets/img/cherry.png"),
      },
      {
        id: "d",
        name: "Orange",
        rating: 4,
        price: 7,
        image: require("../assets/img/orange.png"),
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
      {
        id: "f",
        name: "Pomegranate",
        rating: 4.5,
        price: 23,
        image: require("../assets/img/pomegranate.png"),
      },
    ],
  },
  Beauty: {
    banner: {
      image: require("../assets/img/beauty.png"),
    },
    products: [
      {
        id: "a",
        name: "Lipstick",
        rating: 4,
        price: 25,
        image: require("../assets/img/lipstick.png"),
      },
      {
        id: "b",
        name: "Foundation",
        rating: 5,
        price: 40,
        image: require("../assets/img/foundation.png"),
      },
      {
        id: "c",
        name: "Mascara",
        rating: 4,
        price: 18,
        image: require("../assets/img/mascara.png"),
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

interface GridProduct {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: ImageSourcePropType;
}

// @ts-ignore
const ProductGridScreen = ({ route, navigation }) => {
  const { categoryName } = route.params; // "Fresh Fruits" hoặc "Beauty"

  // @ts-ignore
  const data = MOCK_DATA[categoryName] || MOCK_DATA["Fresh Fruits"];

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
        <TouchableOpacity style={globalStyles.iconButton}>
          <Ionicons name="cart-outline" size={24} color={COLORS.text} />
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
                source={data.banner.image} // <-- Dùng dữ liệu động
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>
          </>
        }
        data={data.products} // <-- Dùng dữ liệu động
        renderItem={({ item }) => (
          <ProductGridItem
            name={item.name}
            rating={item.rating}
            price={item.price}
            imageSource={item.image}
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

            <View style={styles.relevantContainer}>
              <View style={styles.relevantHeader}>
                <Text style={globalStyles.sectionTitle}>Relevant products</Text>
                <TouchableOpacity>
                  <Text style={globalStyles.viewAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={data.relevantProducts} // <-- Dùng dữ liệu động
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
});

export default ProductGridScreen;
