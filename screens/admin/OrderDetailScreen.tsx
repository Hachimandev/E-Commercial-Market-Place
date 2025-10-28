// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";
import { api } from "../../api/api";

const OrderDetailScreen = ({ route, navigation }: any) => {
  const { order } = route.params;
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await api.get(`/api/orders/${order.orderId}`);
        setOrderDetails(data);
        console.log("Chi tiết đơn hàng:", data);
      } catch (error: any) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", error);
        Alert.alert("Lỗi", "Không thể tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [order.orderId]);

  if (loading)
    return (
      <View style={[globalStyles.center, { flex: 1 }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10 }}>Đang tải chi tiết đơn hàng...</Text>
      </View>
    );

  if (!orderDetails)
    return (
      <View style={[globalStyles.center, { flex: 1 }]}>
        <Text>Không tìm thấy chi tiết đơn hàng</Text>
      </View>
    );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 10 }}
        >
          <Ionicons name="arrow-back-outline" size={26} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Thông tin đơn hàng */}
        <View style={[styles.card, globalStyles.shadow]}>
          <Text style={styles.title}>Thông tin đơn hàng</Text>
          <Text style={styles.text}>Mã đơn: {orderDetails.orderId}</Text>
          <Text style={styles.text}>
            Ngày đặt: {new Date(orderDetails.orderDate).toLocaleString()}
          </Text>
          <Text style={styles.text}>
            Tổng tiền: {orderDetails.totalAmount?.toLocaleString()} $
          </Text>
          <Text style={[styles.text, { color: COLORS.primary }]}>
            Trạng thái: {orderDetails.status}
          </Text>
        </View>

        {/* Danh sách sản phẩm */}
        {orderDetails.items?.length > 0 && (
          <View style={[styles.card, globalStyles.shadow]}>
            <Text style={styles.title}>Sản phẩm trong đơn</Text>
            {orderDetails.items.map((item: any, index: number) => (
              <View key={index} style={styles.productRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>
                    {item.product?.name ?? "Sản phẩm không xác định"}
                  </Text>
                  <Text style={styles.productDesc}>
                    {item.product?.description ?? ""}
                  </Text>
                  <Text style={styles.productQty}>
                    Số lượng: {item.quantity}
                  </Text>
                  <Text style={styles.productPriceUnit}>
                    Giá: {item.price?.toLocaleString()} $
                  </Text>
                </View>
                <Text style={styles.productTotal}>
                  {(item.price * item.quantity).toLocaleString()} $
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  container: {
    flex: 1,
    padding: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
    color: COLORS.primary,
  },
  text: {
    fontSize: 15,
    marginBottom: 4,
    color: COLORS.text,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    paddingVertical: 8,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  productDesc: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  productQty: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  productPriceUnit: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  productTotal: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
  },
});

export default OrderDetailScreen;
