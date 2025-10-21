// E-Commercial-Market-Place/navigation/BottomTabNavigator.tsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ProductListScreen from "../screens/ProductListScreen"; // <-- Tên mới (List View)
import ProductGridScreen from "../screens/ProductGridScreen"; // <-- Tên mới (Grid View)
import { Text, View, StyleSheet } from "react-native";
import { COLORS } from "../constants/styles";
import ProductDetailGeneralScreen from "../screens/ProductDetailGeneralScreen";
import ProductDetailVariantScreen from "../screens/ProductDetailVariantScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Component cho các màn hình chưa làm (Giữ nguyên)
const PlaceholderScreen = ({ route }: { route: any }) => (
  <View style={placeholderStyles.container}>
    <Text style={placeholderStyles.text}>{route.params.name} Screen</Text>
    <Text style={placeholderStyles.subtext}>Sẽ được xây dựng sau...</Text>
  </View>
);

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  text: { fontSize: 24, fontWeight: "bold", color: "#555" },
  subtext: { fontSize: 16, color: "#888", marginTop: 8 },
});

// Stack cho Tab Home (Cập nhật)
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* CẬP NHẬT TÊN MÀN HÌNH ĐÍCH */}
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductGrid" component={ProductGridScreen} />
      <Stack.Screen
        name="ProductDetailGeneral"
        component={ProductDetailGeneralScreen}
      />
      <Stack.Screen
        name="ProductDetailVariant"
        component={ProductDetailVariantScreen}
      />
    </Stack.Navigator>
  );
}

// Cấu hình Tab Bar chính (Giữ nguyên)
export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "HomeTab":
              iconName = color === COLORS.primary ? "home" : "home-outline";
              break;
            case "SearchTab":
              iconName = "search-outline";
              break;
            case "FavoritesTab":
              return (
                <View style={{ position: "relative" }}>
                  <Ionicons
                    name={color === COLORS.primary ? "heart" : "heart-outline"}
                    size={size}
                    color={color}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -10,
                      backgroundColor: "red",
                      borderRadius: 10,
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      50+
                    </Text>
                  </View>
                </View>
              );
            case "InboxTab":
              iconName =
                color === COLORS.primary ? "chatbox" : "chatbox-outline";
              break;
            case "AccountTab":
              iconName = color === COLORS.primary ? "person" : "person-outline";
              break;
            default:
              iconName = "alert-circle-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* HomeTab (giữ nguyên) */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: "Home" }}
      />

      {/* Các tab khác (giữ nguyên) */}
      <Tab.Screen
        name="SearchTab"
        component={PlaceholderScreen}
        options={{ title: "Search" }}
        initialParams={{ name: "Search" }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={PlaceholderScreen}
        options={{ title: "Favorites" }}
        initialParams={{ name: "Favorites" }}
      />
      <Tab.Screen
        name="InboxTab"
        component={PlaceholderScreen}
        options={{ title: "Inbox" }}
        initialParams={{ name: "Inbox" }}
      />
      <Tab.Screen
        name="AccountTab"
        component={PlaceholderScreen}
        options={{ title: "Account" }}
        initialParams={{ name: "Account" }}
      />
    </Tab.Navigator>
  );
}
