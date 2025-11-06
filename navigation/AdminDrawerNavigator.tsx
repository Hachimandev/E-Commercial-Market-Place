// navigation/AdminDrawerNavigator.tsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/styles";

import DashboardScreen from "../screens/admin/DashboardScreen";
import ProductManagementScreen from "../screens/admin/ProductManagementScreen";
import UserManagementScreen from "../screens/admin/UserManagementScreen";
import OrderManagementScreen from "../screens/admin/OrderManagementScreen";
import AnalyticsScreen from "../screens/admin/AnalyticsScreen";
import SettingsScreen from "../screens/admin/SettingsScreen";
import AddEditProductScreen from "../screens/admin/AddEditProductScreen";
import AccountScreen from "../screens/AccountScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function ProductStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ProductListAdmin"
        component={ProductManagementScreen}
      />
      <Stack.Screen
        name="AddEditProduct"
        component={AddEditProductScreen}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

function OrderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrderManagement" component={OrderManagementScreen} />
      <Stack.Screen
        name="OrderDetail"
        component={require("../screens/admin/OrderDetailScreen").default}
      />
    </Stack.Navigator>
  );
}

const AdminDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.textLight,
        drawerStyle: {
          width: 260,
          backgroundColor: "#F8F9FA",
          borderTopRightRadius: 25,
          borderBottomRightRadius: 25,
        },
        drawerLabelStyle: { marginLeft: -5, fontSize: 16, fontWeight: "600" },
        drawerActiveBackgroundColor: "rgba(0,139,139,0.12)",
        drawerItemStyle: {
          paddingVertical: 8,
          paddingHorizontal: 6,
          borderRadius: 12,
          marginVertical: 2,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="ProductManagement"
        component={ProductStack}
        options={{
          title: "Product Management",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{
          title: "User Management",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="OrderManagement"
        component={OrderStack}
        options={{
          title: "Order Management",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          title: "Analytics",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: "Account",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AdminDrawerNavigator;
