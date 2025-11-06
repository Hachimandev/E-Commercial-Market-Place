// DashboardScreen.tsx
import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";
import StatCard from "../../components/admin/StatCard";

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
      color: (o = 1) => `rgba(0,139,139,${o})`,
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

const DashboardScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Admin Dashboard",
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 15 }}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={26} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Dashboard Overview</Text>

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

        <View style={styles.chartContainer}>
          <Text style={globalStyles.sectionTitle}>Revenue (Last 6 Months)</Text>
          <LineChart
            data={revenueData}
            width={screenWidth - SIZES.padding * 2}
            height={220}
            yAxisLabel="$"
            yAxisSuffix="k"
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
            bezier
            style={styles.chart}
          />
        </View>

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
  container: { flex: 1, padding: SIZES.padding },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
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
});

export default DashboardScreen;
