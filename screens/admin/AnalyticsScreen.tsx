import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";

const revenueData = {
  labels: ["Aug", "Sep", "Oct"],
  datasets: [{ data: [80, 99, 115] }],
};

const topSelling = [
  { id: "3", name: "Lipstick Chanel", sales: 120, revenue: 5400 },
  { id: "1", name: "iPhone 15 Pro", sales: 50, revenue: 60000 },
  { id: "2", name: "MacBook Air M3", sales: 30, revenue: 45000 },
];

const topUsers = [
  { id: "1", name: "Le Van C", orders: 15, totalSpent: 2500 },
  { id: "2", name: "Pham Thi D", orders: 12, totalSpent: 1800 },
];

const screenWidth = Dimensions.get("window").width;

// @ts-ignore
const AnalyticsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ padding: 10 }}
        >
          <Ionicons name="menu-outline" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics & Reports</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container}>
        {/* Revenue Chart */}
        <View style={styles.chartContainer}>
          <Text style={globalStyles.sectionTitle}>Monthly Revenue</Text>
          <BarChart
            data={revenueData}
            width={screenWidth - SIZES.padding * 2}
            height={220}
            yAxisLabel="$"
            yAxisSuffix="k"
            chartConfig={{
              backgroundColor: COLORS.surface,
              backgroundGradientFrom: COLORS.surface,
              backgroundGradientTo: COLORS.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 139, 139, ${opacity})`, // Primary color
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: SIZES.radius },
              barPercentage: 0.7,
            }}
            style={styles.chart}
            verticalLabelRotation={0} // Chữ thẳng đứng
          />
        </View>

        {/* Top Selling Products */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Top Selling Products</Text>
          {topSelling.map((item, index) => (
            <View key={item.id} style={[styles.listItem, globalStyles.shadow]}>
              <Text style={styles.rank}>{index + 1}</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetail}>
                  {item.sales} sold | ${item.revenue}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Top Active Users */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Top Active Users</Text>
          {topUsers.map((item, index) => (
            <View key={item.id} style={[styles.listItem, globalStyles.shadow]}>
              <Text style={styles.rank}>{index + 1}</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetail}>
                  {item.orders} orders | ${item.totalSpent} spent
                </Text>
              </View>
            </View>
          ))}
        </View>
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
  container: { flex: 1, padding: SIZES.padding },
  chartContainer: { marginBottom: 30, alignItems: "center" },
  chart: { marginVertical: 8, borderRadius: SIZES.radius },
  section: { marginBottom: 30 },
  listItem: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 10,
    alignItems: "center",
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginRight: 15,
    width: 25,
    textAlign: "center",
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "600", marginBottom: 3 },
  itemDetail: { fontSize: 14, color: COLORS.textLight },
});

export default AnalyticsScreen;
