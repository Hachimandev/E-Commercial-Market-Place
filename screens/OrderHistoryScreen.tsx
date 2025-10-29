// E-Commercial-Market-Place/screens/OrderHistoryScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../api/api";
import { OrderHistoryDto } from "../types/order";
import OrderCard from "../components/OrderCard";
import { COLORS, SIZES, globalStyles } from "../constants/styles";

const STATUS_TABS = ["PENDING", "SHIPPING", "DELIVERED", "CANCELLED"];
const STATUS_MAP_VI: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState<OrderHistoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>(STATUS_TABS[0]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: OrderHistoryDto[] = await api.get("/api/orders/history");
      setOrders(data);
    } catch (err: any) {
      console.error("Failed to fetch order history:", err);
      setError(err.message || "Không thể tải lịch sử đơn hàng.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  const filteredOrders = orders.filter(
    (order) => order.status === selectedStatus
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        {/* // Optional: Nút tìm kiếm đơn hàng */}
        {/* <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color={COLORS.text} />
        </TouchableOpacity> */}
      </View>

      {/* Thanh Tabs Trạng Thái */}
      <View style={styles.tabContainer}>
        {STATUS_TABS.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.tabButton,
              selectedStatus === status && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.tabText,
                selectedStatus === status && styles.tabTextActive,
              ]}
            >
              {STATUS_MAP_VI[status] || status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danh sách đơn hàng */}
      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={COLORS.primary}
        />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchOrders} style={styles.retryButton}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={({ item }) => <OrderCard order={item} />}
          keyExtractor={(item) => item.orderId}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="file-tray-outline"
                size={60}
                color={COLORS.textLight}
              />
              <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SIZES.padding * 1.5,
    paddingHorizontal: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: SIZES.radius * 2,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primaryLight,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textLight,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.padding,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: "center",
    marginBottom: SIZES.padding,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: SIZES.radius,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  listContainer: {
    padding: SIZES.padding,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
    opacity: 0.7,
  },
  emptyText: {
    marginTop: SIZES.padding,
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default OrderHistoryScreen;
