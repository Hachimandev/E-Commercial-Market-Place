// E-Commercial-Market-Place/navigation/CheckoutStackNavigator.tsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "../screens/CartScreen";
import PaymentScreen from "../screens/PaymentScreen";
import SuccessScreen from "../screens/SuccessScreen";

const Stack = createNativeStackNavigator();

const CheckoutStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
    </Stack.Navigator>
  );
};

export default CheckoutStackNavigator;
