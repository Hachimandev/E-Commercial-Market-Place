import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const success = login(username, password);

    if (success) {
      Alert.alert("Success", "Login successful!");
      navigation.navigate("AccountTab"); // quay lại tab Account
    } else {
      Alert.alert("Login Failed", "Invalid username or password.");
    }
  };

  const handleGoToRegister = () => {
    navigation.navigate("RegisterScreen");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
        }}
        style={styles.logo}
      />
      <Text style={styles.title}>MarketPlaceX Login</Text>

      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        buttonColor={colors.primary}
      >
        Login
      </Button>

      <Button
        mode="text"
        onPress={handleGoToRegister}
        style={styles.registerButton}
        textColor="#1976D2"
      >
        Don’t have an account? Register
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 8,
  },
  registerButton: {
    marginTop: 10,
  },
});

export default LoginScreen;
