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

// Dữ liệu giả cho kết quả tìm kiếm
const MOCK_RESULTS: GridProduct[] = [
  {
    id: "a",
    name: "T-Shirt",
    rating: 4,
    price: 2.99,
    image: require("../assets/img/headphone1.png"),
    detailScreen: "ProductDetailVariant",
  },
  {
    id: "b",
    name: "T-Shirt Yellow",
    rating: 5,
    price: 15,
    image: require("../assets/img/headphone2.png"),
    detailScreen: "ProductDetailVariant",
  },
];

interface GridProduct {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: ImageSourcePropType;
  detailScreen: string;
}

// @ts-ignore
const SearchResultScreen = ({ route, navigation }) => {
  const { query } = route.params;

  // (Trong tương lai, bạn sẽ dùng useEffect để fetch API với 'query')
  const results = MOCK_RESULTS;

  const handleSearchSubmit = (newQuery: string) => {
    // Tải lại trang với query mới (hoặc fetch API)
    navigation.setParams({ query: newQuery });
    // fetchAPI(newQuery)...
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
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
            {/* Thanh search bar với từ khóa ban đầu */}
            <SearchBar
              initialQuery={query}
              onSubmitEditing={handleSearchSubmit}
            />
            <Text style={styles.resultCount}>
              {results.length} results found
            </Text>
          </View>
        }
        data={results}
        renderItem={({ item }) => (
          <ProductGridItem
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
