// E-Commercial-Market-Place/components/SearchBar.tsx

import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants/styles";

const SearchBar = () => {
  return (
    <View style={styles.searchBar}>
      <Ionicons
        name="search-outline"
        size={20}
        color={COLORS.textLight}
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="Search for product"
        placeholderTextColor={COLORS.textLight}
        style={styles.searchInput}
      />
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="options-outline" size={24} color={COLORS.textLight} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginVertical: 15,
    paddingHorizontal: 10,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  filterButton: {
    padding: 5,
  },
});

export default SearchBar;
