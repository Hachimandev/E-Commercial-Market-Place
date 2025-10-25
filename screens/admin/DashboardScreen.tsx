// E-Commercial-Market-Place/screens/admin/DashboardScreen.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";
import StatCard from "../../components/admin/StatCard"; // Import component mới

// Mock Data
const dashboardStats = {
  totalProducts: 125,
  totalUsers: 580,
  totalOrders: 85,
  todayRevenue: 1250.75,
};

const revenueData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(0, 139, 139, ${opacity})`, // Màu primary
      strokeWidth: 2,
    },
  ],
  legend: ["Revenue"],
};

const topSelling = [
  { id: "1", name: "iPhone 15 Pro", sales: 50 },
  { id: "2", name: "MacBook Air M3", sales: 30 },
  { id: "3", name: "Lipstick Chanel", sales: 120 },
];

const screenWidth = Dimensions.get("window").width;

// @ts-ignore
const DashboardScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Dashboard Overview</Text>

        {/* Stat Cards */}
        <View style={styles.statsRow}>
          <StatCard
            icon="cube-outline"
            title="Total Products"
            value={dashboardStats.totalProducts}
            color={COLORS.primary}
          />
          <StatCard
            icon="people-outline"
            title="Total Users"
            value={dashboardStats.totalUsers}
            color={COLORS.secondary}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            icon="cart-outline"
            title="Total Orders"
            value={dashboardStats.totalOrders}
            color="#FFA500"
          />
          <StatCard
            icon="cash-outline"
            title="Today Revenue"
            value={`$${dashboardStats.todayRevenue.toFixed(2)}`}
            color="#20B2AA"
          />
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartContainer}>
          <Text style={globalStyles.sectionTitle}>Revenue (Last 6 Months)</Text>
          <LineChart
            data={revenueData}
            width={screenWidth - SIZES.padding * 2} // from react-native
            height={220}
            yAxisLabel="$"
            yAxisSuffix="k" // Giả sử đơn vị nghìn đô
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: COLORS.background,
              backgroundGradientFrom: COLORS.background,
              backgroundGradientTo: COLORS.background,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: SIZES.radius },
              propsForDots: {
                r: "4",
                strokeWidth: "1",
                stroke: COLORS.primary,
              },
            }}
            bezier // Đường cong mượt
            style={styles.chart}
          />
        </View>

        {/* Top Selling Products */}
        <View style={styles.topSellingContainer}>
          <Text style={globalStyles.sectionTitle}>Top Selling Products</Text>
          {topSelling.map((item) => (
            <View
              key={item.id}
              style={[styles.topSellingItem, globalStyles.shadow]}
            >
              <Text style={styles.topSellingName}>{item.name}</Text>
              <Text style={styles.topSellingSales}>{item.sales} sold</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5, // Giảm khoảng cách giữa các hàng
  },
  chartContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: SIZES.radius,
  },
  topSellingContainer: {
    marginTop: 20,
  },
  topSellingItem: {
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topSellingName: {
    fontSize: 16,
    fontWeight: "500",
  },
  topSellingSales: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default DashboardScreen;
