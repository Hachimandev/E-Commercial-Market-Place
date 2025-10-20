// E-Commercial-Market-Place/components/CategoryIcon.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";

interface CategoryIconProps {
  name: string;
  imageSource: ImageSourcePropType;
  backgroundColor: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  imageSource,
  backgroundColor,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor }]}>
        <Image
          source={imageSource}
          style={styles.iconImage}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.iconText}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 10,
    width: 80,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  iconImage: {
    width: "70%",
    height: "70%",
    // Đã xóa tintColor để hiển thị ảnh gốc
  },
  iconText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
});

export default CategoryIcon;
