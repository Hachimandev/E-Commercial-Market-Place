// E-Commercial-Market-Place/navigation/RootNavigator.tsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// Bỏ import không dùng: View, Text, useAuth, LoginScreen, LoadingScreen
import BottomTabNavigator from "./BottomTabNavigator";
import CheckoutStackNavigator from "./CheckoutStackNavigator";
import AdminDrawerNavigator from "./AdminDrawerNavigator";

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  // --- TẠM THỜI BỎ QUA LOGIC KIỂM TRA AUTH ---
  /*
  const { user, isLoggedIn } = useAuth();
  const [isLoadingAuth, setIsLoadingAuth] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingAuth(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoadingAuth) {
    return <LoadingScreen />;
  }

  // Logic cũ để chọn màn hình
  let initialStack = "MainTabs";
  if (!isLoggedIn) {
      initialStack = "Login";
  } else if (user?.role === 'ADMIN') {
      initialStack = "AdminDashboard";
  }
  */
  // --- KẾT THÚC BỎ QUA ---

  return (
    <RootStack.Navigator
      // --- LUÔN BẮT ĐẦU VỚI ADMIN DASHBOARD ---
      initialRouteName="AdminDashboard"
      screenOptions={{ headerShown: false }}
    >
      {/* Vẫn giữ các màn hình để có thể điều hướng qua lại nếu cần test */}
      {/* <RootStack.Screen name="Login" component={LoginScreen} /> */}
      <RootStack.Screen name="MainTabs" component={BottomTabNavigator} />
      <RootStack.Screen
        name="CheckoutStack"
        component={CheckoutStackNavigator}
        options={{ presentation: "modal" }}
      />
      <RootStack.Screen
        name="AdminDashboard"
        component={AdminDrawerNavigator}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
