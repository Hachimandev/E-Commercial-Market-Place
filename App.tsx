// E-Commercial-Market-Place/App.tsx

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import CheckoutStackNavigator from "./navigation/CheckoutStackNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Provider as PaperProvider } from "react-native-paper";

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <PaperProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <RootStack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                <RootStack.Screen
                  name="MainTabs"
                  component={BottomTabNavigator}
                />
                <RootStack.Screen
                  name="CheckoutStack"
                  component={CheckoutStackNavigator}
                  options={{
                    presentation: "modal",
                  }}
                />
              </RootStack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </PaperProvider>
      </CartProvider>
    </AuthProvider>
  );
}
