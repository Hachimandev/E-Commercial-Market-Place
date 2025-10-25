// E-Commercial-Market-Place/screens/LoadingScreen.tsx

import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles, COLORS } from "../constants/styles";

const LoadingScreen = () => {
  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background, // Use background color from theme
  },
});

export default LoadingScreen;
