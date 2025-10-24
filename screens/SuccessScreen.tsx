// E-Commercial-Market-Place/screens/SuccessScreen.tsx

import React, { useEffect } from "react"; // <-- 1. IMPORT USEEFFECT
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import { useCart } from "../context/CartContext"; // <-- 2. IMPORT USECART

// @ts-ignore
const SuccessScreen = ({ route, navigation }) => {
  const { totalAmount, cardInfo } = route.params;
  const { clearCart } = useCart(); // <-- 3. LẤY HÀM CLEARCART

  const subtotal = totalAmount / 1.1;
  const tax = totalAmount - subtotal;

  // 4. SỬ DỤNG USEEFFECT ĐỂ XÓA GIỎ HÀNG
  useEffect(() => {
    // Xóa giỏ hàng ngay khi vào màn hình thành công
    clearCart();
  }, []); // Mảng rỗng đảm bảo nó chỉ chạy 1 lần khi mount

  const handleBackToHome = () => {
    // Điều hướng về Home (đóng modal stack)
    // Cập nhật: navigation.navigate('MainTabs') có thể không đóng modal
    // Cách chuẩn hơn là navigation.popToTop() rồi goBack()
    // Hoặc đơn giản là reset về Home
    navigation.navigate("MainTabs", { screen: "HomeTab" });
  };

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={100} color="green" />
      </View>

      {/* Message */}
      <Text style={styles.title}>Order placed successfully!</Text>
      <Text style={styles.subtitle}>
        Commodi eu ut sunt qui minim fugiat elit nisi enim
      </Text>

      {/* Summary Box */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax (10%)</Text>
          <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Fees</Text>
          <Text style={styles.summaryValue}>$0</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Card</Text>
          <View style={styles.cardInfo}>
            <Image
              source={cardInfo.icon}
              style={styles.cardIcon}
              resizeMode="contain"
            />
            <Text style={styles.summaryValue}>****** {cardInfo.last4}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
            <Text style={styles.statusText}>Success</Text>
          </View>
        </View>
      </View>

      {/* Rating */}
      <Text style={styles.ratingTitle}>How was your experience?</Text>
      <View style={styles.starsContainer}>
        <Ionicons name="star" size={30} color={COLORS.accent} />
        <Ionicons name="star" size={30} color={COLORS.accent} />
        <Ionicons name="star" size={30} color={COLORS.accent} />
        <Ionicons name="star" size={30} color={COLORS.accent} />
        <Ionicons name="star-outline" size={30} color={COLORS.accent} />
      </View>

      <View style={{ flex: 1 }} />

      {/* Back to Home Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
          <Ionicons name="home" size={20} color={COLORS.background} />
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ... (Styles giữ nguyên)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: SIZES.padding,
  },
  iconContainer: {
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 10,
    maxWidth: "80%",
  },
  summaryBox: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginTop: 30,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 30,
    height: 20,
    marginRight: 10,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 5,
  },
  totalLabel: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 14,
    color: "green",
    fontWeight: "bold",
  },
  ratingTitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 30,
  },
  starsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  footer: {
    width: "100%",
  },
  homeButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  homeButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default SuccessScreen;
