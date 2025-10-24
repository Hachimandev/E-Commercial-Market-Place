// E-Commercial-Market-Place/screens/SearchResultScreen.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import SearchBar from "../components/SearchBar";
import ProductGridItem from "../components/ProductGridItem";

// --- 1. ĐỊNH NGHĨA TYPE RÕ RÀNG ---
interface GridProduct {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: ImageSourcePropType;
  detailScreen: string;
}

// --- 2. ÁP DỤNG TYPE CHO MOCK_RESULTS ---
const MOCK_RESULTS: GridProduct[] = [
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
    name: "T-Shirt Yellow",
    rating: 5,
    price: 15,
    image: require("../assets/img/denim-Jacket.png"),
    detailScreen: "ProductDetailVariant",
  },
];

// @ts-ignore
const SearchResultScreen = ({ route, navigation }) => {
  const { query } = route.params;
  const results = MOCK_RESULTS;

  const handleSearchSubmit = (newQuery: string) => {
    navigation.setParams({ query: newQuery });
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={[globalStyles.header, { paddingHorizontal: SIZES.padding }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>Results for "{query}"</Text>
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={{ paddingHorizontal: SIZES.padding }}>
            <SearchBar
              initialQuery={query}
              onSubmitEditing={handleSearchSubmit}
            />
            <Text style={styles.resultCount}>
              {results.length} results found
            </Text>
          </View>
        }
        data={results} // <-- data.products giờ đã có type
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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding,
  },
  resultCount: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SIZES.padding,
  },
});

export default SearchResultScreen;
