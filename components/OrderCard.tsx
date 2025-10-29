// E-Commercial-Market-Place/components/OrderCard.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Card, Chip, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { OrderHistoryDto, OrderItemDto } from "../types/order";
import { COLORS, SIZES } from "../constants/styles";
import { getLocalImage } from "../constants/imageMap";
import { API_BASE_URL } from "../api/api";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "PENDING":
      return { color: COLORS.warning, icon: "time-outline" as const };
    case "SHIPPING":
      return { color: COLORS.info, icon: "rocket-outline" as const };
    case "DELIVERED":
      return {
        color: COLORS.success,
        icon: "checkmark-circle-outline" as const,
      };
    case "CANCELLED":
      return { color: COLORS.error, icon: "close-circle-outline" as const };
    default:
      return { color: COLORS.textLight, icon: "help-circle-outline" as const };
  }
};

interface OrderCardProps {
  order: OrderHistoryDto;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigation = useNavigation<any>();
  const statusStyle = getStatusStyle(order.status);
  const formattedDate = format(new Date(order.orderDate), "dd/MM/yyyy HH:mm");

  const handlePress = () => {
    navigation.navigate("OrderDetail", { orderId: order.orderId });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <Card.Title
          title={`Đơn hàng #${order.orderId}`}
          titleStyle={styles.cardTitle}
          subtitle={`Ngày đặt: ${formattedDate}`}
          subtitleStyle={styles.date}
          right={() => (
            <Chip
              icon={() => (
                <Ionicons
                  name={statusStyle.icon}
                  size={16}
                  color={statusStyle.color}
                />
              )}
              textStyle={[styles.statusText, { color: statusStyle.color }]}
              style={[styles.statusChip, { borderColor: statusStyle.color }]}
            >
              {order.status}
            </Chip>
          )}
        />
        <Divider style={styles.divider} />
        <Card.Content>
          {order.items && order.items.length > 0 && (
            <View style={styles.itemPreviewContainer}>
              <Image
                source={getLocalImage(
                  order.items[0].productImageURL,
                  API_BASE_URL
                )}
                style={styles.itemImage}
              />
              {order.items.length > 1 && (
                <Text style={styles.moreItemsText}>
                  {" "}
                  + {order.items.length - 1} sản phẩm khác
                </Text>
              )}
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số lượng:</Text>
            <Text style={styles.summaryValue}>{order.itemCount} sản phẩm</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng tiền:</Text>
            <Text style={styles.totalValue}>
              ${order.totalAmount.toFixed(2)}
            </Text>
          </View>
        </Card.Content>
        {/* // Optional: Thêm nút xem chi tiết hoặc mua lại */}
        {/* <Card.Actions>
        <Button mode="outlined">Xem chi tiết</Button>
        <Button mode="contained">Mua lại</Button>
      </Card.Actions> */}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SIZES.padding,
    backgroundColor: COLORS.background,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.textDark,
  },
  date: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  statusChip: {
    marginRight: SIZES.padding / 2,
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  divider: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding / 2,
  },
  itemPreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.padding / 2,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radius / 2,
    marginRight: 8,
    backgroundColor: COLORS.surface,
  },
  moreItemsText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
});

export default OrderCard;
