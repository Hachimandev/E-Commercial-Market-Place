import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import { useCart } from "../context/CartContext";
import { CartAPI } from "../types/cart";
import CartItemRow from "../components/CartItem";
import { useFocusEffect } from "@react-navigation/native";

// @ts-ignore
const CartScreen = ({ navigation }) => {
  const { loadCart } = useCart();
  const [cart, setCart] = useState<CartAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voucher, setVoucher] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchCart = async () => {
        setLoading(true);
        setError("");
        try {
          const cartData = await loadCart();
          setCart(cartData);
        } catch (err: any) {
          setError(err.message || "Failed to load cart.");
        } finally {
          setLoading(false);
        }
      };
      fetchCart();
    }, [loadCart])
  );

  const onCartUpdate = (updatedCart: CartAPI) => {
    setCart(updatedCart);
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );
  }

  const total = cart?.totalPrice || 0;
  const voucherDiscount = voucher === "SALE10" ? total * 0.1 : 0;
  const finalTotal = total - voucherDiscount;

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} /> {/* Đệm */}
      </View>

      {error ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: "red" }}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={cart?.items || []}
          renderItem={({ item }) => (
            <CartItemRow item={item} onCartUpdate={onCartUpdate} />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your cart is empty.</Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={
            <>
              {/* Total */}
              <View style={styles.totalContainer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                </View>
                {/* ... (phần voucher) ... */}
                <View style={[styles.totalRow, styles.finalTotalRow]}>
                  <Text style={styles.finalTotalLabel}>TOTAL</Text>
                  <Text style={styles.finalTotalValue}>
                    ${finalTotal.toFixed(2)}
                  </Text>
                </View>
              </View>
            </>
          }
        />
      )}

      {/* Nút Next */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            (!cart || cart.items.length === 0) && {
              backgroundColor: COLORS.border,
            },
          ]}
          onPress={() =>
            navigation.navigate("Payment", { totalAmount: finalTotal })
          }
          disabled={!cart || cart.items.length === 0}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.background} />
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
  listContainer: {
    padding: SIZES.padding,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  voucherContainer: {
    marginTop: 20,
  },
  voucherInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  voucherInput: {
    flex: 1,
    height: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: 15,
  },
  applyButton: {
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.radius,
    marginLeft: 10,
  },
  applyButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 15,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  totalValue: {
    fontSize: 16,
    color: COLORS.text,
  },
  finalTotalRow: {
    marginTop: 10,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  footer: {
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  nextButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
});
export default CartScreen;
