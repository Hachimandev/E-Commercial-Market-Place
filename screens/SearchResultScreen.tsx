// E-Commercial-Market-Place/screens/SearchResultScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageSourcePropType,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import SearchBar from "../components/SearchBar";
import ProductGridItem from "../components/ProductGridItem";
import { api, API_BASE_URL } from "../api/api";
import { getLocalImage } from "../constants/imageMap";
import { useCart } from "../context/CartContext";
import { useFocusEffect } from "@react-navigation/native";

interface GridProduct {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: ImageSourcePropType;
  detailScreen: "ProductDetailGeneral" | "ProductDetailVariant";
}

// @ts-ignore
const SearchResultScreen = ({ route, navigation }) => {
  const { query, filters } = route.params;

  const [products, setProducts] = useState<GridProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [totalResults, setTotalResults] = useState(0);

  const { loadCart } = useCart();
  const [itemCount, setItemCount] = useState(0);

  /** 🛒 Load lại số lượng sản phẩm trong giỏ */
  const refreshCartCount = useCallback(async () => {
    try {
      const cart = await loadCart();
      setItemCount(cart.items.length);
    } catch (e) {
      console.error("Failed to load cart count", e);
    }
  }, [loadCart]);

  useFocusEffect(
    useCallback(() => {
      refreshCartCount();
    }, [refreshCartCount])
  );

  /** ⚡ Cập nhật searchQuery khi route thay đổi (ví dụ tìm từ khác từ HomeScreen) */
  useEffect(() => {
    if (query && query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [query]);

  /** 📡 Gọi API tìm kiếm mỗi khi query hoặc filters thay đổi */
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (query) params.append("query", query);
        if (filters) {
          if (filters.minPrice)
            params.append("minPrice", filters.minPrice.toString());
          if (filters.maxPrice)
            params.append("maxPrice", filters.maxPrice.toString());
          if (filters.minRating)
            params.append("minRating", filters.minRating.toString());
          if (filters.featureText)
            params.append("featureText", filters.featureText);
        }

        const endpoint = `/api/products/search?${params.toString()}`;
        console.log("Fetching search:", endpoint);

        const data = await api.get(endpoint);
        const productList = data.content || [];
        setTotalResults(data.totalElements || 0);

        const mapped: GridProduct[] = productList.map((item: any) => {
          const categoryName = item.category?.name?.toLowerCase() || "";
          const detailScreenTarget =
            categoryName === "fashion" || categoryName === "beauty"
              ? "ProductDetailVariant"
              : "ProductDetailGeneral";

          return {
            id: item.productId.toString(),
            name: item.name,
            rating: item.rating,
            price: item.price,
            image: getLocalImage(item.imageURL, API_BASE_URL),
            detailScreen: detailScreenTarget,
          };
        });

        setProducts(mapped);
      } catch (err: any) {
        console.error("Error fetching search results:", err);
        setError(err.message || "Không thể tải kết quả tìm kiếm.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, filters]);

  /** Khi người dùng tìm từ mới trong thanh tìm kiếm */
  const handleSearchSubmit = (newQuery: string) => {
    setSearchQuery(newQuery);
    // Điều hướng lại chính màn hình này với query mới
    navigation.navigate("SearchResult", { query: newQuery, filters: null });
  };

  /** Khi bấm nút bộ lọc */
  const handleFilterPress = () => {
    navigation.navigate("Filter", { query: searchQuery, filters: filters });
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={[styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {searchQuery ? `Kết quả cho “${searchQuery}”` : "Kết quả tìm kiếm"}
        </Text>
        <View style={{ width: 24 }} /> {/* Giữ cân đối */}
      </View>

      {/* Nội dung */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 50 }}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              {/* 🔍 Thanh tìm kiếm */}
              <SearchBar
                initialQuery={searchQuery}
                onSubmitEditing={handleSearchSubmit}
              />

              {/* Dòng hiển thị số kết quả + nút lọc */}
              <View style={styles.resultHeader}>
                <Text style={styles.resultCount}>
                  {totalResults} sản phẩm được tìm thấy
                </Text>

                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={handleFilterPress}
                >
                  <Ionicons
                    name="filter-outline"
                    size={18}
                    color={COLORS.primary}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.filterText}>Bộ lọc</Text>
                </TouchableOpacity>
              </View>
            </>
          }
          data={products}
          renderItem={({ item }) => (
            <ProductGridItem
              item={item}
              onCartUpdated={refreshCartCount}
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="sad-outline"
                size={40}
                color={COLORS.textLight}
                style={{ marginBottom: 10 }}
              />
              <Text style={styles.emptyText}>
                Không tìm thấy sản phẩm nào phù hợp.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.base * 2,
    marginTop: SIZES.base,
    marginBottom: SIZES.base * 2,
  },
  resultCount: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.base * 0.7,
    paddingHorizontal: SIZES.base * 1.5,
    backgroundColor: COLORS.surface,
  },
  filterText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding,
  },
  errorText: {
    textAlign: "center",
    color: COLORS.error,
    marginTop: 50,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default SearchResultScreen;
