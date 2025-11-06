// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";
import { api } from "../../api/api";
import { AdminAnalyticsDto } from "../../types/admin";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundColor: COLORS.surface,
  backgroundGradientFrom: COLORS.surface,
  backgroundGradientTo: COLORS.surface,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 139, 139, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: SIZES.radius },
  barPercentage: 0.7,
};

const emptyChartData = {
  labels: ["N/A"],
  datasets: [{ data: [0] }],
};

const AnalyticsScreen = ({ navigation }) => {
  const [data, setData] = useState<AdminAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/analytics/reports");
      setData(response);
    } catch (err: any) {
      console.error("Failed to load analytics data:", err);
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
          labels: data.revenueChartData.map((d) => d.month.split("-")[1]),
          datasets: [
            {
              data: data.revenueChartData.map((d) => d.monthly_revenue || 0),
            },
          ],
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
        <Text style={styles.headerTitle}>Analytics & Reports</Text>
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
            <View style={styles.chartContainer}>
              <Text style={globalStyles.sectionTitle}>Monthly Revenue (k)</Text>
              <BarChart
                data={chartData}
                width={screenWidth - SIZES.padding * 2}
                height={220}
                yAxisLabel="$"
                yAxisSuffix="k"
                chartConfig={chartConfig}
                style={styles.chart}
                fromZero={true}
              />
            </View>

            <View style={styles.section}>
              <Text style={globalStyles.sectionTitle}>
                Top Selling Products
              </Text>
              {data.topSellingProducts.length > 0 ? (
                data.topSellingProducts.map((item, index) => (
                  <View
                    key={item.id}
                    style={[styles.listItem, globalStyles.shadow]}
                  >
                    <Text style={styles.rank}>{index + 1}</Text>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDetail}>
                        {item.value1} sold
                        {item.value2
                          ? ` | $${item.value2.toFixed(2)} revenue`
                          : ""}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.itemDetail}>
                  No selling data available.
                </Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={globalStyles.sectionTitle}>Top Active Users</Text>
              {data.topActiveUsers.length > 0 ? (
                data.topActiveUsers.map((item, index) => (
                  <View
                    key={item.id}
                    style={[styles.listItem, globalStyles.shadow]}
                  >
                    <Text style={styles.rank}>{index + 1}</Text>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDetail}>
                        {item.value1} orders
                        {item.value2
                          ? ` | $${item.value2.toFixed(2)} spent`
                          : ""}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.itemDetail}>No user data available.</Text>
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
  errorText: { color: COLORS.error, textAlign: "center", marginTop: 30 },
});

export default AnalyticsScreen;
