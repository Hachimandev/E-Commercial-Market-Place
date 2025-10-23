import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { TextInput, Button, Text, useTheme, Card } from "react-native-paper";
import { useAuth } from "../context/AuthContext";

const AccountScreen = () => {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const { user, logout, getProfile } = useAuth();

  useEffect(() => {
    (async () => {
      const data = await getProfile();
      if (data) {
        setName(data.name || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
      }
    })();
  }, []);

  const handleSave = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }
    Alert.alert("Success", "Your account information has been updated!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileTitle}>{user?.name || "My Account"}</Text>
        <Text style={styles.roleText}>👑 Role: {user?.role || "Unknown"}</Text>
      </View>

      {/* Form Card */}
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Full Name"
            value={user?.name || "rỗng"}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Phone Number"
            value={user?.phone || "rỗng"}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Address"
            value={user?.address || "rỗng"}
            onChangeText={setAddress}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={[styles.input, { height: 90 }]}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            buttonColor={colors.primary}
          >
            Save Changes
          </Button>
        </Card.Content>
      </Card>

      {/* Logout */}
      <Button
        mode="outlined"
        onPress={logout}
        style={styles.logoutButton}
        textColor="#d32f2f"
        icon="logout"
      >
        Logout
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f2f4f8",
    flexGrow: 1,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#1976D2",
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  roleText: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  input: {
    marginBottom: 14,
    backgroundColor: "white",
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 8,
  },
  logoutButton: {
    marginTop: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d32f2f",
    alignSelf: "center",
    width: "60%",
  },
});

export default AccountScreen;
