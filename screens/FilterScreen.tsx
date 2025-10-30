import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Checkbox } from "react-native-paper";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { globalStyles, COLORS, SIZES } from "../constants/styles";

const { width } = Dimensions.get("window");

// 🌟 Section có thể thu gọn
const CollapsibleSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={22}
          color={COLORS.textLight}
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

// @ts-ignore
const FilterScreen = ({ route, navigation }) => {
  const { query: currentQuery, filters: currentFilters } = route.params || {};

  const [shipping, setShipping] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([
    currentFilters?.minPrice || 0,
    currentFilters?.maxPrice || 5000,
  ]);
  const [rating, setRating] = useState(currentFilters?.minRating || 0);
  const [others, setOthers] = useState<string[]>(
    currentFilters?.featureText ? [currentFilters.featureText] : []
  );

  const toggleShipping = (option: string) => {
    setShipping((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const toggleOther = (option: string) => {
    setOthers(
      (prev) => (prev.includes(option) ? [] : [option]) // chỉ chọn 1
    );
  };

  const handleReset = () => {
    setShipping([]);
    setPriceRange([0, 5000]);
    setRating(0);
    setOthers([]);
  };

  const handleApplyFilters = () => {
    const newFilters = {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating: rating,
      featureText: others.length > 0 ? others[0] : null,
    };

    navigation.navigate("SearchResult", {
      query: currentQuery || "",
      filters: newFilters,
    });
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* 🌟 Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bộ lọc tìm kiếm</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* 🌟 Nội dung */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Giao hàng */}
        <CollapsibleSection title="Phương thức giao hàng">
          <Checkbox.Item
            label="Giao nhanh trong 2 giờ"
            status={shipping.includes("instant") ? "checked" : "unchecked"}
            onPress={() => toggleShipping("instant")}
            labelStyle={styles.checkboxLabel}
            color={COLORS.primary}
          />
          <Checkbox.Item
            label="Giao tiêu chuẩn (2 - 3 ngày)"
            status={shipping.includes("express") ? "checked" : "unchecked"}
            onPress={() => toggleShipping("express")}
            labelStyle={styles.checkboxLabel}
            color={COLORS.primary}
          />
          <Checkbox.Item
            label="Giao tiết kiệm (5 - 7 ngày)"
            status={shipping.includes("standard") ? "checked" : "unchecked"}
            onPress={() => toggleShipping("standard")}
            labelStyle={styles.checkboxLabel}
            color={COLORS.primary}
          />
        </CollapsibleSection>

        {/* Khoảng giá */}
        <CollapsibleSection title="Khoảng giá (VNĐ)">
          <View style={styles.priceInputContainer}>
            <TextInput
              style={styles.priceInput}
              value={`${priceRange[0].toLocaleString()}₫`}
              keyboardType="numeric"
              onChangeText={(text) =>
                setPriceRange([
                  Number(text.replace(/[^0-9]/g, "")),
                  priceRange[1],
                ])
              }
            />
            <TextInput
              style={styles.priceInput}
              value={`${priceRange[1].toLocaleString()}₫`}
              keyboardType="numeric"
              onChangeText={(text) =>
                setPriceRange([
                  priceRange[0],
                  Number(text.replace(/[^0-9]/g, "")),
                ])
              }
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <MultiSlider
              values={[priceRange[0], priceRange[1]]}
              onValuesChange={(values) => setPriceRange([values[0], values[1]])}
              min={0}
              max={5000}
              step={10}
              sliderLength={width - SIZES.padding * 4}
              selectedStyle={{ backgroundColor: COLORS.primary }}
              unselectedStyle={{ backgroundColor: COLORS.border }}
              markerStyle={styles.sliderMarker}
              containerStyle={{ height: 30 }}
            />
          </View>
        </CollapsibleSection>

        {/* Đánh giá */}
        <CollapsibleSection title="Đánh giá trung bình">
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={30}
                  color={star <= rating ? COLORS.accent : COLORS.textLight}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
            <Text style={styles.ratingText}>trở lên</Text>
          </View>
        </CollapsibleSection>

        {/* Khác */}
        <CollapsibleSection title="Tùy chọn khác">
          <View style={styles.othersContainer}>
            <TouchableOpacity
              style={[
                styles.otherButton,
                others.includes("30-day Free Return") &&
                  styles.otherButtonActive,
              ]}
              onPress={() => toggleOther("30-day Free Return")}
            >
              <Ionicons
                name="refresh"
                size={24}
                color={
                  others.includes("30-day Free Return")
                    ? COLORS.primary
                    : COLORS.textLight
                }
              />
              <Text
                style={[
                  styles.otherText,
                  others.includes("30-day Free Return") &&
                    styles.otherTextActive,
                ]}
              >
                Đổi trả miễn phí 30 ngày
              </Text>
            </TouchableOpacity>
          </View>
        </CollapsibleSection>
      </ScrollView>

      {/* 🌟 Footer cố định */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Đặt lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyFilters}
        >
          <Text style={styles.applyButtonText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// 🌟 Style tinh gọn & hiện đại
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  sectionContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 15,
  },
  checkboxLabel: {
    fontSize: 15,
    color: COLORS.textDark,
  },
  priceInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  priceInput: {
    width: "47%",
    height: 48,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    fontSize: 15,
    color: COLORS.textDark,
    backgroundColor: COLORS.background,
  },
  sliderMarker: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  star: {
    marginHorizontal: 5,
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textLight,
  },
  othersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  otherButton: {
    width: "48%",
    height: 80,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: COLORS.background,
  },
  otherButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  otherText: {
    marginTop: 5,
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: "500",
  },
  otherTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  resetButton: {
    width: "30%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    marginRight: 10,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  applyButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FilterScreen;
