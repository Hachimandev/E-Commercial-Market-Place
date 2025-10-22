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
          size={20}
          color={COLORS.textLight}
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

// @ts-ignore
const FilterScreen = ({ navigation }) => {
  const [shipping, setShipping] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([10, 1000]);
  const [rating, setRating] = useState(0);
  const [others, setOthers] = useState<string[]>(["30-day Free Return"]);

  const toggleShipping = (option: string) => {
    setShipping((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const toggleOther = (option: string) => {
    setOthers((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} /> {/* Đệm trái */}
        <Text style={styles.headerTitle}>Filter</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Shipping Options */}
        <CollapsibleSection title="Shipping options">
          <Checkbox.Item
            label="Instant (2 hours delivery)"
            status={shipping.includes("instant") ? "checked" : "unchecked"}
            onPress={() => toggleShipping("instant")}
            labelStyle={styles.checkboxLabel}
            color={COLORS.primary}
          />
          <Checkbox.Item
            label="Express (2 days delivery)"
            status={shipping.includes("express") ? "checked" : "unchecked"}
            onPress={() => toggleShipping("express")}
            labelStyle={styles.checkboxLabel}
            color={COLORS.primary}
          />
          <Checkbox.Item
            label="Standard (7- 10 days delivery)"
            status={shipping.includes("standard") ? "checked" : "unchecked"}
            onPress={() => toggleShipping("standard")}
            labelStyle={styles.checkboxLabel}
            color={COLORS.primary}
          />
        </CollapsibleSection>
        {/* Price Range */}
        <CollapsibleSection title="Price range">
          <View style={styles.priceInputContainer}>
            <TextInput
              style={styles.priceInput}
              value={`$ ${priceRange[0]}`}
              keyboardType="numeric"
              onChangeText={(text) =>
                setPriceRange([Number(text.replace("$", "")), priceRange[1]])
              }
            />
            <TextInput
              style={styles.priceInput}
              value={`$ ${priceRange[1]}`}
              keyboardType="numeric"
              onChangeText={(text) =>
                setPriceRange([priceRange[0], Number(text.replace("$", ""))])
              }
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <MultiSlider
              values={[priceRange[0], priceRange[1]]}
              onValuesChange={(values) => setPriceRange(values)}
              min={0}
              max={5000}
              step={10}
              sliderLength={width - SIZES.padding * 4}
              selectedStyle={{ backgroundColor: COLORS.primary }}
              unselectedStyle={{ backgroundColor: COLORS.border }}
              markerStyle={{
                backgroundColor: COLORS.background,
                borderWidth: 2,
                borderColor: COLORS.primary,
              }}
              containerStyle={{ height: 30 }}
            />
          </View>
        </CollapsibleSection>
        {/* Average Review */}
        <CollapsibleSection title="Average review">
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
            <Text style={styles.ratingText}>& Up</Text>
          </View>
        </CollapsibleSection>
        {/* Others */}
        <CollapsibleSection title="Others">
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
                30-day Free Return
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.otherButton,
                others.includes("Buyer Protection") && styles.otherButtonActive,
              ]}
              onPress={() => toggleOther("Buyer Protection")}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={
                  others.includes("Buyer Protection")
                    ? COLORS.primary
                    : COLORS.textLight
                }
              />
              <Text
                style={[
                  styles.otherText,
                  others.includes("Buyer Protection") && styles.otherTextActive,
                ]}
              >
                Buyer Protection
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.otherButton,
                others.includes("Best Deal") && styles.otherButtonActive,
              ]}
              onPress={() => toggleOther("Best Deal")}
            >
              <Ionicons
                name="pricetag-outline"
                size={24}
                color={
                  others.includes("Best Deal")
                    ? COLORS.primary
                    : COLORS.textLight
                }
              />
              <Text
                style={[
                  styles.otherText,
                  others.includes("Best Deal") && styles.otherTextActive,
                ]}
              >
                Best Deal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.otherButton,
                others.includes("Ship to store") && styles.otherButtonActive,
              ]}
              onPress={() => toggleOther("Ship to store")}
            >
              <Ionicons
                name="location-outline"
                size={24}
                color={
                  others.includes("Ship to store")
                    ? COLORS.primary
                    : COLORS.textLight
                }
              />
              <Text
                style={[
                  styles.otherText,
                  others.includes("Ship to store") && styles.otherTextActive,
                ]}
              >
                Ship to store
              </Text>
            </TouchableOpacity>
          </View>
        </CollapsibleSection>
        <View style={{ height: 100 }} /> {/* Đệm cho footer */}
      </ScrollView>

      {/* Sticky Footer (Phần hoàn thiện) */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            // Reset all states
            setShipping([]);
            setPriceRange([10, 1000]);
            setRating(0);
            setOthers([]);
          }}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingBottom: 100, // Đảm bảo không bị che bởi footer
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: "600",
  },
  sectionContent: {
    padding: SIZES.padding,
    paddingTop: 0,
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  priceInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  priceInput: {
    width: "45%",
    height: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: 10,
    fontSize: 16,
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
  },
  otherButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#E0F7FA",
  },
  otherText: {
    marginTop: 5,
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: "500",
  },
  otherTextActive: {
    color: COLORS.primary,
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
