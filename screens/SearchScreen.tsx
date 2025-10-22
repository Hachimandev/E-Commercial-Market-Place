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
  >
    {isRecent && (
      <Ionicons
        name="time-outline"
        size={16}
        color={COLORS.textLight}
        style={{ marginRight: 5 }}
      />
    )}
    <Text style={styles.tagText}>{term}</Text>
  </TouchableOpacity>
);

// @ts-ignore
const SearchScreen = ({ navigation }) => {
  const handleSearchSubmit = (query: string) => {
    navigation.navigate("SearchResult", { query: query });
  };

  const handleTagPress = (query: string) => {
    navigation.navigate("SearchResult", { query: query });
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>Search</Text>
      </View>

      <ScrollView style={styles.container}>
        <SearchBar onSubmitEditing={handleSearchSubmit} />

        {/* Recent Searches */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Recent Searches</Text>
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
          />
        </View>

        {/* Popular Now */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Popular Now</Text>
          <FlatList
            data={popularSearches}
            renderItem={({ item }) => (
              <SearchTag
                term={item.term}
                onPress={() => handleTagPress(item.term)}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={2} // Hiển thị 2 cột
            columnWrapperStyle={{ justifyContent: "space-between" }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  section: {
    marginBottom: SIZES.padding * 2,
  },
  tag: {
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: SIZES.radius,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  recentTag: {
    width: "auto",
  },
  tagText: {
    color: COLORS.text,
    fontSize: 14,
  },
});

export default SearchScreen;
