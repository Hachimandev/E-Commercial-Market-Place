// E-Commercial-Market-Place/components/CategoryCard.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { SIZES, COLORS } from "../constants/styles";

interface CategoryCardProps {
  imageSource: ImageSourcePropType;
  backgroundColor: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  imageSource,
  backgroundColor,
}) => {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor }]}>
      <Image
        source={imageSource}
        style={styles.cardImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardImage: {
    width: "70%",
    height: "70%",
  },
});

export default CategoryCard;
