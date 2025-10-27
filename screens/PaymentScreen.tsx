// E-Commercial-Market-Place/screens/PaymentScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import { api } from "../api/api";
import { PaymentMethodAPI, PAYMENT_ICON_MAP } from "../types/cart";

// @ts-ignore
const PaymentScreen = ({ route, navigation }) => {
  const { totalAmount } = route.params;

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodAPI[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setLoading(true);
        const methods: PaymentMethodAPI[] = await api.get(
          "/api/payment/methods"
        );
        setPaymentMethods(methods);
        if (methods.length > 0) {
          setSelectedMethod(methods[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch payment methods", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMethods();
  }, []);

  const handlePayNow = async () => {
    if (!selectedMethod || paying) return;

    setPaying(true);
    try {
      const orderData = await api.post("/api/orders/checkout", {
        paymentMethodId: Number(selectedMethod),
        voucherCode: null,
      });

      navigation.navigate("Success", { orderData: orderData });
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setPaying(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>
      {/* Total */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>TOTAL</Text>
        <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {/* Payment Methods*/}
          <RadioButton.Group
            onValueChange={(newValue) => setSelectedMethod(newValue)}
            value={selectedMethod || ""}
          >
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={styles.methodBox}
                onPress={() => setSelectedMethod(method.id)}
              >
                <Image
                  source={
                    PAYMENT_ICON_MAP[method.iconName] ||
                    PAYMENT_ICON_MAP.default
                  }
                  style={styles.methodIcon}
                  resizeMode="contain"
                />
                <Text style={styles.methodText}>
                  {method.type === "card"
                    ? `****** ${method.last4}`
                    : method.email}
                </Text>
                <RadioButton value={method.id} color={COLORS.primary} />
              </TouchableOpacity>
            ))}
          </RadioButton.Group>
          {/* Add new card */}
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={22} color={COLORS.primary} />
            <Text style={styles.addButtonText}>Add new card</Text>
          </TouchableOpacity>
        </>
      )}
      <View style={{ flex: 1 }} />
      {/* Nút Pay now */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            (paying || !selectedMethod) && { opacity: 0.7 },
          ]}
          onPress={handlePayNow}
          disabled={paying || !selectedMethod}
        >
          {paying ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <>
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={COLORS.background}
              />
              <Text style={styles.payButtonText}>Pay now</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
// ... (Styles)
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  totalContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  totalValue: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.text,
  },
  methodBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    marginBottom: 10,
  },
  methodIcon: {
    width: 40,
    height: 25,
    marginRight: 15,
  },
  methodText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: SIZES.padding,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  footer: {
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  payButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
export default PaymentScreen;
