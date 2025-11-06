import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";

const OrderListItemAdmin: React.FC<{
  item: any;
  navigation: any;
  onDelete: () => void;
}> = ({ item, navigation, onDelete }) => (
  <View style={[styles.listItem, globalStyles.shadow]}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>Mã đơn: {item.orderId}</Text>
      <Text style={styles.itemDate}>
        Ngày đặt: {new Date(item.orderDate).toLocaleString()}
      </Text>
      <Text style={styles.itemPrice}>
        Tổng tiền: {item.totalAmount?.toLocaleString()} $
      </Text>
      <Text
        style={[
          styles.itemStatus,
          item.status === "CANCELLED" && styles.itemStatusCancelled,
          item.status === "DELIVERED" && styles.itemStatusCompleted,
          item.status === "SHIPPING" && styles.itemStatusShipping,
        ]}
      >
        Trạng thái: {item.status}
      </Text>
    </View>

    <View style={styles.itemActions}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("OrderDetailAdmin", { orderId: item.orderId })
        }
        style={styles.actionButton}
      >
        <Ionicons name="eye-outline" size={22} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
        <Ionicons name="trash-outline" size={22} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 10,
    marginBottom: SIZES.padding,
    alignItems: "center",
  },
  itemInfo: { flex: 1, marginRight: 10 },
  itemName: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  itemDate: { fontSize: 13, color: COLORS.textLight, marginVertical: 2 },
  itemPrice: { fontSize: 14, color: COLORS.primary, fontWeight: "bold" },
  itemStatus: {
    fontSize: 13,
    marginTop: 3,
    color: COLORS.warning,
    fontWeight: "500",
  },
  itemStatusCancelled: { color: COLORS.error },
  itemStatusCompleted: { color: COLORS.success },
  itemStatusShipping: { color: COLORS.info },
  itemActions: { flexDirection: "row" },
  actionButton: { padding: 8 },
});

export default OrderListItemAdmin;
