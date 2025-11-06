import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";
import SearchBar from "../../components/SearchBar";
import { api } from "../../api/api";

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
        ]}
      >
        Trạng thái: {item.status}
      </Text>
    </View>

    <View style={styles.itemActions}>
      <TouchableOpacity
        onPress={() => navigation.navigate("OrderDetail", { order: item })}
        style={styles.actionButton}
      >
        <Ionicons name="eye-outline" size={22} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
        <Ionicons name="trash-outline" size={22} color="red" />
      </TouchableOpacity>
    </View>
  </View>
);

const OrderManagementScreen = ({ navigation }: any) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get("/api/orders");
      setOrders(data);
      console.log("Orders:", data);
    } catch (error: any) {
      console.error("Lỗi khi tải đơn hàng:", error);
      Alert.alert("Lỗi", error.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleViewOrder = (order: any) => {
    navigation.navigate("OrderDetail", { order });
  };

  const handleDeleteOrder = async (orderId: number) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa đơn hàng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/api/orders/admin/${orderId}`);
            setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
            Alert.alert("Thành công", "Đã xóa đơn hàng");
          } catch (error: any) {
            console.error("Lỗi khi xóa đơn hàng:", error);
            Alert.alert("Lỗi", error.message || "Không thể xóa đơn hàng");
          }
        },
      },
    ]);
  };

  const filteredOrders = orders.filter((o) => {
    const idText = o?.orderId ? o.orderId.toString() : "";
    const statusText = o?.status ? o.status.toLowerCase() : "";
    return (
      idText.includes(searchQuery.toLowerCase()) ||
      statusText.includes(searchQuery.toLowerCase())
    );
  });

  if (loading)
    return (
      <View style={[globalStyles.container, { flex: 1 }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10 }}>Đang tải đơn hàng...</Text>
      </View>
    );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ padding: 10 }}
        >
          <Ionicons name="menu-outline" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <SearchBar onSubmitEditing={setSearchQuery} />

        {/* Danh sách đơn hàng */}
        <FlatList
          data={filteredOrders}
          renderItem={({ item }) => (
            <OrderListItemAdmin
              item={item}
              navigation={navigation}
              onDelete={() => handleDeleteOrder(item.orderId)}
            />
          )}
          keyExtractor={(item) => item.orderId.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
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
  itemStatus: { fontSize: 13, marginTop: 3, color: COLORS.text },
  itemStatusCancelled: { color: "red" },
  itemStatusCompleted: { color: "green" },
  itemActions: { flexDirection: "row" },
  actionButton: { padding: 8 },
});

export default OrderManagementScreen;
