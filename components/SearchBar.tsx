// E-Commercial-Market-Place/components/SearchBar.tsx
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
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (onSubmitEditing) {
      onSubmitEditing(trimmed);
    } else {
      navigation.navigate("SearchTab", {
        screen: "SearchResult",
        params: { query: trimmed, filters: null },
      });
    }
  };

  const handleFilterPress = () => {
    navigation.navigate("Filter", { query });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={22}
          color={COLORS.textLight}
          style={styles.iconLeft}
        />
        <TextInput
          placeholder="Tìm kiếm sản phẩm..."
          placeholderTextColor={COLORS.textLight}
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleFilterPress} style={styles.iconButton}>
          <Ionicons name="filter-outline" size={22} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.base * 2,
    marginHorizontal: SIZES.base * 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius * 1.2,
    paddingHorizontal: SIZES.base * 1.5,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconLeft: {
    marginRight: SIZES.base,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  iconButton: {
    paddingLeft: SIZES.base,
  },
});

export default SearchBar;
