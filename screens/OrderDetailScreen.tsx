// E-Commercial-Market-Place/screens/OrderDetailScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { api } from "../api/api";
import { OrderDetailAPI, OrderItemDto } from "../types/order";
import { COLORS, SIZES, globalStyles } from "../constants/styles";
import { getLocalImage } from "../constants/imageMap";
import { API_BASE_URL } from "../api/api";
const getStatusStyle = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        color: COLORS.warning,
        icon: "time-outline" as const,
        text: "Chờ xác nhận",
      };
    case "SHIPPING":
      return {
        color: COLORS.info,
        icon: "rocket-outline" as const,
        text: "Đang giao",
      };
    case "DELIVERED":
      return {
        color: COLORS.success,
        icon: "checkmark-circle-outline" as const,
        text: "Đã giao",
      };
    case "CANCELLED":
      return {
        color: COLORS.error,
        icon: "close-circle-outline" as const,
        text: "Đã hủy",
      };
    default:
      return {
        color: COLORS.textLight,
        icon: "help-circle-outline" as const,
        text: status,
      };
  }
};

// @ts-ignore
const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<OrderDetailAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: OrderDetailAPI = await api.get(`/api/orders/${orderId}`);
        setOrder(data);
      } catch (err: any) {
        console.error("Failed to fetch order detail:", err);
        setError(err.message || "Không thể tải chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        {/* Simple Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
          <View style={{ width: 24 }} />
        </View>
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={COLORS.primary}
        />
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        {/* Simple Header */}
        <View style={styles.header}></View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || "Không tìm thấy đơn hàng."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusStyle(order.status);
  const formattedDate = format(new Date(order.orderDate), "dd/MM/yyyy HH:mm");

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng #{order.orderId}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Thông tin chung */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={COLORS.textLight}
              style={styles.icon}
            />
            <Text style={styles.infoText}>Ngày đặt: {formattedDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name={statusStyle.icon}
              size={20}
              color={statusStyle.color}
              style={styles.icon}
            />
            <Text
              style={[
                styles.infoText,
                { color: statusStyle.color, fontWeight: "bold" },
              ]}
            >
              Trạng thái: {statusStyle.text}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Địa chỉ giao hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
          <Text style={styles.addressText}>
            <Ionicons name="person-outline" size={16} /> {order.buyerName}
          </Text>
          <Text style={styles.addressText}>
            <Ionicons name="call-outline" size={16} /> {order.buyerPhone}
          </Text>
          <Text style={styles.addressText}>
            <Ionicons name="location-outline" size={16} />{" "}
            {order.shippingAddress}
          </Text>
        </View>

        <Divider style={styles.divider} />

        {/* Danh sách sản phẩm */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Sản phẩm ({order.items.length})
          </Text>
          {order.items.map((item) => (
            <View
              key={item.productId + Math.random()}
              style={styles.productRow}
            >
              <Image
                source={getLocalImage(item.productImageURL, API_BASE_URL)}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.productName}
                </Text>
                <Text style={styles.productQty}>SL: {item.quantity}</Text>
              </View>
              <Text style={styles.productPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <Divider style={styles.divider} />

        {/* Tổng kết thanh toán */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phương thức:</Text>
            <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Trạng thái TT:</Text>
            <Text
              style={[
                styles.summaryValue,
                order.paymentStatus === "COMPLETED" ? styles.successText : {},
              ]}
            >
              {order.paymentStatus}
            </Text>
          </View>
          <Divider style={{ marginVertical: 10 }} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>
              ${order.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
      {/* // Optional: Nút Hủy đơn / Mua lại ở dưới */}
      {/* <View style={styles.footer}> ... </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginRight: SIZES.padding,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  container: {
    paddingBottom: SIZES.padding * 2,
    backgroundColor: COLORS.surface,
  },
  loader: {
    marginTop: 50,
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
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginBottom: SIZES.padding / 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: SIZES.padding / 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SIZES.padding / 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius / 2,
    marginRight: SIZES.padding,
    backgroundColor: COLORS.surface,
  },
  productInfo: {
    flex: 1,
    marginRight: SIZES.padding / 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  productQty: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "500",
  },
  successText: {
    color: COLORS.success,
    fontWeight: "bold",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
});

export default OrderDetailScreen;
