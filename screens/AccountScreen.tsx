import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";

const AccountScreen = () => {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSave = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    Alert.alert("Success", "Your account information has been updated!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileTitle}>My Account</Text>
      </View>

      <TextInput
        label="Full Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Address"
        value={address}
        onChangeText={setAddress}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={[styles.input, { height: 100 }]}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        buttonColor={colors.primary}
      >
        Save Changes
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb",
    flexGrow: 1,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 8,
  },
});

export default AccountScreen;
