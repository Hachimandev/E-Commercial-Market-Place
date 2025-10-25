// E-Commercial-Market-Place/components/admin/StatCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, globalStyles } from "../../constants/styles";

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  return (
    <View style={[styles.card, globalStyles.shadow]}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color={COLORS.background} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.padding,
    flex: 1, // Để chia đều không gian
    marginHorizontal: 5, // Khoảng cách giữa các card
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZES.padding,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
});

export default StatCard;
