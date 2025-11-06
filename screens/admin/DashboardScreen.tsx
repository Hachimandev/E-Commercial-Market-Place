// @ts-nocheck
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";
import StatCard from "../../components/admin/StatCard";
import { api } from "../../api/api";
import { AdminDashboardStatsDto } from "../../types/admin";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const emptyChartData = {
  labels: ["N/A"],
  datasets: [
    {
      data: [0],
      color: (opacity = 1) => `rgba(0, 139, 139, ${opacity})`,
      strokeWidth: 2,
    },
  ],
  legend: ["Revenue (k)"],
};

const chartConfig = {
  backgroundColor: COLORS.background,
  backgroundGradientFrom: COLORS.background,
  backgroundGradientTo: COLORS.background,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: SIZES.radius },
  propsForDots: { r: "4", strokeWidth: "1", stroke: COLORS.primary },
};

const DashboardScreen = ({ navigation }) => {
  const [data, setData] = useState<AdminDashboardStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await api.get("/api/analytics/dashboard");
      setData(dashboardData);
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      setError(err.message || "Could not load data");
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const chartData =
    data && data.revenueChartData && data.revenueChartData.length > 0
      ? {
          labels: data.revenueChartData.map(
            (d) => d.month.split("-")[1] || d.month
          ),
          datasets: [
            {
              data: data.revenueChartData.map((d) => d.monthly_revenue || 0),
              color: (opacity = 1) => `rgba(0, 139, 139, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ["Revenue (k)"],
        }
      : emptyChartData;

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ padding: 10 }}
        >
          <Ionicons name="menu-outline" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 50 }}
          />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : data ? (
          <>
            <View style={styles.statsRow}>
              <StatCard
                icon="cube-outline"
                title="Total Products"
                value={data.totalProducts}
                color={COLORS.primary}
              />
              <StatCard
                icon="people-outline"
                title="Total Users"
                value={data.totalUsers}
                color={COLORS.secondary}
              />
            </View>
            <View style={styles.statsRow}>
              <StatCard
                icon="cart-outline"
                title="Total Orders"
                value={data.totalOrders}
                color="#FFA500"
              />
              <StatCard
                icon="cash-outline"
                title="Today Revenue"
                value={`$${data.todayRevenue.toFixed(2)}`}
                color="#20B2AA"
              />
            </View>

            <View style={styles.chartContainer}>
              <Text style={globalStyles.sectionTitle}>
                Revenue (Last 6 Months)
              </Text>
              <LineChart
                data={chartData}
                width={screenWidth - SIZES.padding * 2}
                height={220}
                yAxisLabel="$"
                yAxisSuffix="k"
                yAxisInterval={1}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                fromZero={true}
              />
            </View>

            <View style={styles.topSellingContainer}>
              <Text style={globalStyles.sectionTitle}>
                Top 5 Selling Products
              </Text>
              {data.topSellingProducts.length > 0 ? (
                data.topSellingProducts.map((item) => (
                  <View
                    key={item.productId}
                    style={[styles.topSellingItem, globalStyles.shadow]}
                  >
                    <Text style={styles.topSellingName}>{item.name}</Text>
                    <Text style={styles.topSellingSales}>
                      {item.totalSold} sold
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.topSellingSales}>
                  No selling data available.
                </Text>
              )}
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>No data available.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ... (Styles)
const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.padding },
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.padding,
  },
  chartContainer: { marginTop: 20, alignItems: "center" },
  chart: { marginVertical: 8, borderRadius: SIZES.radius },
  topSellingContainer: { marginTop: 20 },
  topSellingItem: {
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topSellingName: { fontSize: 16, fontWeight: "500" },
  topSellingSales: { fontSize: 14, color: COLORS.textLight },
  errorText: { color: COLORS.error, textAlign: "center", marginTop: 30 },
});

export default DashboardScreen;
