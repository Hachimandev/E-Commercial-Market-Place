import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants/styles";
import { useNavigation } from "@react-navigation/native";

interface SearchBarProps {
  initialQuery?: string;
  onSubmitEditing?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = "",
  onSubmitEditing,
}) => {
  const navigation = useNavigation();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = () => {
    if (onSubmitEditing && query.trim().length > 0) {
      onSubmitEditing(query);
    }
  };

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
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      <TouchableOpacity
        style={styles.filterButton}
        // @ts-ignore
        onPress={() => navigation.navigate("Filter")}
      >
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
