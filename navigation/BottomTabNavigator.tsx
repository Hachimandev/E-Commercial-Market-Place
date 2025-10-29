import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ProductListScreen from "../screens/ProductListScreen";
import ProductGridScreen from "../screens/ProductGridScreen";
import AccountScreen from "../screens/AccountScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { Text, View, StyleSheet } from "react-native";
import { COLORS } from "../constants/styles";
import ProductDetailGeneralScreen from "../screens/ProductDetailGeneralScreen";
import ProductDetailVariantScreen from "../screens/ProductDetailVariantScreen";
import { useAuth } from "../context/AuthContext";
import FilterScreen from "../screens/FilterScreen";
import SearchScreen from "../screens/SearchScreen";
import SearchResultScreen from "../screens/SearchResultScreen";
import InboxScreen from "../screens/InboxScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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

// Stack cho Tab Home
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />

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
      <Stack.Screen
        name="Filter"
        component={FilterScreen}
        options={{
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchBase" component={SearchScreen} />
      <Stack.Screen name="SearchResult" component={SearchResultScreen} />
      {/* Thêm các màn hình Detail và Filter để có thể điều hướng từ SearchResult */}
      <Stack.Screen
        name="ProductDetailGeneral"
        component={ProductDetailGeneralScreen}
      />
      <Stack.Screen
        name="ProductDetailVariant"
        component={ProductDetailVariantScreen}
      />
      <Stack.Screen
        name="Filter"
        component={FilterScreen}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

function OrderHistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrderHistoryBase" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
}

function InboxStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InboxBase" component={InboxScreen} />
      {/* // Sẵn sàng cho tương lai khi bạn thêm màn hình Chat
      <Stack.Screen name="Chat" component={ChatScreen} /> 
      */}
    </Stack.Navigator>
  );
}

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
              iconName = color === COLORS.primary ? "search" : "search-outline";
              break;
            case "OrdersTab":
              iconName =
                color === COLORS.primary ? "receipt" : "receipt-outline";
              break;
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
      {/* HomeTab*/}
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: "Home" }}
      />

      {/* Các tab khác */}
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{ title: "Search" }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrderHistoryStack}
        options={{ title: "Orders" }}
      />
      <Tab.Screen
        name="InboxTab"
        component={InboxStack}
        options={{ title: "Inbox" }}
      />
      <Tab.Screen
        name="AccountTab"
        component={AccountStack}
        options={{ title: "Account" }}
        initialParams={{ name: "Account" }}
      />
    </Tab.Navigator>
  );

  function AccountStack() {
    const { isLoggedIn } = useAuth();

    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="AccountScreen" component={AccountScreen} />
        ) : (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    );
  }
}
