import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import SearchBar from "../components/SearchBar";

const recentSearches = [
  { id: "1", term: "T-Shirt" },
  { id: "2", term: "Headphone" },
  { id: "3", term: "Avocado" },
  { id: "4", term: "Laptop" },
];

const popularSearches = [
  { id: "1", term: "iPhone 15 Pro" },
  { id: "2", term: "Nike Air Max" },
  { id: "3", term: "Beauty Lipstick" },
  { id: "4", term: "Summer Dress" },
];

const SearchTag: React.FC<{
  term: string;
  onPress: () => void;
  isRecent?: boolean;
}> = ({ term, onPress, isRecent = false }) => (
  <TouchableOpacity
    style={[styles.tag, isRecent && styles.recentTag]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {isRecent && (
      <Ionicons
        name="time-outline"
        size={16}
        color={COLORS.textLight}
        style={{ marginRight: 6 }}
      />
    )}
    <Text style={styles.tagText}>{term}</Text>
  </TouchableOpacity>
);

// @ts-ignore
const SearchScreen = ({ navigation }) => {
  const handleSearchSubmit = (query: string) => {
    navigation.navigate("SearchResult", { query });
  };

  const handleTagPress = (query: string) => {
    navigation.navigate("SearchResult", { query });
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tìm kiếm</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: SIZES.base * 6 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Thanh tìm kiếm */}
        <SearchBar onSubmitEditing={handleSearchSubmit} />

        {/* Recent Searches */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Tìm kiếm gần đây</Text>
          <FlatList
            data={recentSearches}
            renderItem={({ item }) => (
              <SearchTag
                term={item.term}
                onPress={() => handleTagPress(item.term)}
                isRecent
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginTop: SIZES.base }}
          />
        </View>

        {/* Popular Now */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Đang phổ biến</Text>
          <FlatList
            data={popularSearches}
            renderItem={({ item }) => (
              <SearchTag
                term={item.term}
                onPress={() => handleTagPress(item.term)}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            scrollEnabled={false}
            contentContainerStyle={{ marginTop: SIZES.base }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base * 2,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: "700",
    color: COLORS.text,
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.base * 2,
    backgroundColor: COLORS.background,
  },
  section: {
    marginBottom: SIZES.base * 3,
  },
  tag: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SIZES.base * 1.2,
    paddingHorizontal: SIZES.base * 2,
    borderRadius: SIZES.radius,
    marginRight: SIZES.base * 1.5,
    marginBottom: SIZES.base * 1.5,
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  recentTag: {
    width: "auto",
  },
  tagText: {
    color: COLORS.text,
    fontSize: SIZES.body,
  },
});

export default SearchScreen;
