// E-Commercial-Market-Place/screens/admin/SettingsScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";

// @ts-ignore
const SettingsScreen = ({ navigation }) => {
  const [shopName, setShopName] = useState("My Awesome Shop");
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState(COLORS.primary);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogoUpload = () => {
    Alert.alert("Upload Logo", "Image upload feature not implemented yet.");
  };

  const handleSaveChanges = () => {
    Alert.alert("Settings Saved", "Your changes have been saved (simulated).");
    console.log({ shopName, logoUri, themeColor, isDarkMode });
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ padding: 10 }}
        >
          <Ionicons name="menu-outline" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={handleSaveChanges} style={{ padding: 10 }}>
          <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.label}>Shop Name</Text>
          <TextInput
            style={styles.input}
            value={shopName}
            onChangeText={setShopName}
            placeholder="Enter shop name"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Shop Logo</Text>
          <TouchableOpacity
            style={styles.logoButton}
            onPress={handleLogoUpload}
          >
            {logoUri ? (
              <Text style={styles.logoText}>Change Logo</Text>
            ) : (
              <Ionicons name="image-outline" size={24} color={COLORS.primary} />
            )}
            <Text style={styles.logoText}>
              {logoUri ? "Change Logo" : "Upload Logo"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Theme Color</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[styles.colorPreview, { backgroundColor: themeColor }]}
            />
            <Text style={{ marginLeft: 10, color: COLORS.textLight }}>
              (Color Picker Placeholder)
            </Text>
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.background}
            onValueChange={setIsDarkMode}
            value={isDarkMode}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  container: { padding: SIZES.padding },
  section: { marginBottom: 25 },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 15,
    fontSize: 16,
  },
  logoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: SIZES.radius,
    justifyContent: "center",
  },
  logoText: { color: COLORS.primary, marginLeft: 10, fontWeight: "bold" },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default SettingsScreen;
