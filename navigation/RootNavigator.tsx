import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";
import CheckoutStackNavigator from "./CheckoutStackNavigator";
import AdminDrawerNavigator from "./AdminDrawerNavigator";
import LoginScreen from "../screens/LoginScreen";
import LoadingScreen from "../screens/LoadingScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { useAuth } from "../context/AuthContext";

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, isLoggedIn } = useAuth();
  const [isLoadingAuth, setIsLoadingAuth] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoadingAuth(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoadingAuth) {
    return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      ) : user?.role === "SELLER" ? (
        <RootStack.Screen
          name="AdminDashboard"
          component={AdminDrawerNavigator}
        />
      ) : (
        <>
          <RootStack.Screen name="MainTabs" component={BottomTabNavigator} />
          <RootStack.Screen
            name="CheckoutStack"
            component={CheckoutStackNavigator}
            options={{ presentation: "modal" }}
          />
        </>
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
