// E-Commercial-Market-Place/screens/admin/OrderManagementScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SegmentedButtons } from "react-native-paper";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";

// Mock Data
type OrderStatus = "Pending" | "Shipping" | "Completed" | "Canceled";
const mockOrders = [
  {
    id: "#12345",
    customer: "Le Van C",
    total: 1290.0,
    status: "Pending" as OrderStatus,
    date: "2025-10-25",
  },
  {
    id: "#12346",
    customer: "Pham Thi D",
    total: 10.5,
    status: "Completed" as OrderStatus,
    date: "2025-10-24",
  },
  {
    id: "#12347",
    customer: "Le Van C",
    total: 89.9,
    status: "Shipping" as OrderStatus,
    date: "2025-10-23",
  },
  {
    id: "#12348",
    customer: "Tran Thi B",
    total: 45.0,
    status: "Canceled" as OrderStatus,
    date: "2025-10-22",
  },
];

// Component Item cho danh sách đơn hàng
const OrderListItem: React.FC<{ item: any; onPress: () => void }> = ({
  item,
  onPress,
}) => {
  let statusColor = COLORS.textLight;
  if (item.status === "Completed") statusColor = "green";
  else if (item.status === "Shipping") statusColor = COLORS.primary;
  else if (item.status === "Canceled") statusColor = "red";

  return (
    <TouchableOpacity
      style={[styles.listItem, globalStyles.shadow]}
      onPress={onPress}
    >
      <View style={styles.itemRow}>
        <Text style={styles.orderId}>{item.id}</Text>
        <Text style={[styles.orderStatus, { color: statusColor }]}>
          {item.status}
        </Text>
      </View>
      <View style={styles.itemRow}>
        <Text style={styles.orderCustomer}>{item.customer}</Text>
        <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
      </View>
      <Text style={styles.orderDate}>{item.date}</Text>
    </TouchableOpacity>
  );
};

// @ts-ignore
const OrderManagementScreen = ({ navigation }) => {
  const [orders, setOrders] = useState(mockOrders);
  const [filter, setFilter] = useState<OrderStatus | "All">("All");

  const filteredOrders = orders.filter(
    (order) => filter === "All" || order.status === filter
  );

  const handleViewOrderDetails = (orderId: string) => {
    alert(`View details for order: ${orderId} (Not implemented)`);
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ padding: 10 }}
        >
          <Ionicons name="menu-outline" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        {/* Filter Buttons */}
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter as any} // Cast as any to avoid type issue with 'All'
          style={styles.segmentedButtons}
          buttons={[
            { value: "All", label: "All" },
            { value: "Pending", label: "Pending" },
            { value: "Shipping", label: "Shipping" },
            { value: "Completed", label: "Completed" },
            { value: "Canceled", label: "Canceled" },
          ]}
          theme={{
            colors: { primary: COLORS.primary, outline: COLORS.border },
          }}
        />

        <FlatList
          data={filteredOrders}
          renderItem={({ item }) => (
            <OrderListItem
              item={item}
              onPress={() => handleViewOrderDetails(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                color: COLORS.textLight,
                marginTop: 30,
              }}
            >
              No orders found for this status.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: { flex: 1, padding: SIZES.padding },
  segmentedButtons: { marginBottom: SIZES.padding },
  // Styles for List Item
  listItem: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: { fontSize: 16, fontWeight: "bold" },
  orderStatus: { fontSize: 14, fontWeight: "bold" },
  orderCustomer: { fontSize: 14, color: COLORS.textLight },
  orderTotal: { fontSize: 16, fontWeight: "bold" },
  orderDate: { fontSize: 12, color: COLORS.textLight, marginTop: 5 },
});

export default OrderManagementScreen;
