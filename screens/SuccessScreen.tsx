import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import { OrderSuccessAPI, PAYMENT_ICON_MAP } from "../types/cart";
import { getLocalImage } from "../constants/imageMap";
import { API_BASE_URL } from "../api/api";

// @ts-ignore
const SuccessScreen = ({ route, navigation }) => {
  const { orderData }: { orderData: OrderSuccessAPI } = route.params;

  const handleBackToHome = () => {
    navigation.navigate("MainTabs", { screen: "HomeTab" });
  };

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
      <ScrollView>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={100} color="green" />
        </View>

        {/* Message */}
        <Text style={styles.title}>Order placed successfully!</Text>
        <Text style={styles.subtitle}>
          Your order ID is: #{orderData.orderId}
        </Text>

        {/* Danh sách sản phẩm đã mua */}
        <Text style={styles.listTitle}>Items Purchased</Text>
        {orderData.itemsPurchased.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Image
              source={getLocalImage(item.imageURL, API_BASE_URL)}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>${item.subtotal.toFixed(2)}</Text>
          </View>
        ))}

        {/* Summary Box  */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${orderData.subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${orderData.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Card</Text>
            <View style={styles.cardInfo}>
              <Image
                source={
                  PAYMENT_ICON_MAP[orderData.paymentMethod.iconName] ||
                  PAYMENT_ICON_MAP.default
                }
                style={styles.cardIcon}
                resizeMode="contain"
              />
              <Text style={styles.summaryValue}>
                {orderData.paymentMethod.type === "card"
                  ? `****** ${orderData.paymentMethod.last4}`
                  : orderData.paymentMethod.email}
              </Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.totalValue}>
                ${orderData.totalAmount.toFixed(2)}
              </Text>
              <Text style={styles.statusText}>{orderData.status}</Text>
            </View>
          </View>
        </View>

        {/* Rating */}
        <View style={{ alignItems: "center" }}>
          <Text style={styles.ratingTitle}>How was your experience?</Text>
          <View style={styles.starsContainer}>
            <Ionicons name="star" size={30} color={COLORS.accent} />
            <Ionicons name="star" size={30} color={COLORS.accent} />
            <Ionicons name="star" size={30} color={COLORS.accent} />
            <Ionicons name="star" size={30} color={COLORS.accent} />
            <Ionicons name="star-outline" size={30} color={COLORS.accent} />
          </View>
        </View>
      </ScrollView>

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

// ... (Styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 10,
    maxWidth: "80%",
    alignSelf: "center",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: SIZES.padding,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    marginBottom: 10,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: COLORS.surface,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: COLORS.text,
  },
  itemQty: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  summaryBox: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginTop: 20,
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
    textAlign: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
  },
  footer: {
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderColor: COLORS.border,
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
