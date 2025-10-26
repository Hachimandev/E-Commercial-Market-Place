import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  Card,
  Avatar,
  Divider,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const AccountScreen = () => {
  const navigation: any = useNavigation();
  const { colors } = useTheme();
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  const handleLogout = () => {
    logout();
  };
  const handleSave = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert("⚠️ Lỗi xác thực", "Vui lòng nhập đầy đủ tất cả các trường.");
      return;
    }
    Alert.alert(
      "✅ Thành công",
      "Thông tin tài khoản của bạn đã được cập nhật!"
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Gradient */}
      <LinearGradient
        colors={["#4F46E5", "#5C6BC0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity activeOpacity={0.8} style={styles.avatarWrapper}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.username}>{user?.name || "Guest User"}</Text>
        <Text style={styles.role}>👑 {user?.role || "Customer"}</Text>
      </LinearGradient>

      {/* Account Info Card */}
      <Card style={styles.card}>
        <Card.Title
          title="Thông tin tài khoản"
          titleStyle={styles.cardTitle}
          left={(props) => <Avatar.Icon {...props} icon="account" />}
        />
        <Divider />

        <Card.Content>
          {/* --- Full Name --- */}
          <TextInput
            label={<Text style={styles.labelText}>Họ và tên</Text>}
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            contentStyle={styles.inputContent}
            theme={{
              colors: {
                primary: "#4F46E5", // màu viền khi focus
                outline: "#C5CAE9", // màu viền bình thường
                onSurfaceVariant: "#3F3D56", // màu label
              },
            }}
          />

          {/* --- Phone Number --- */}
          <TextInput
            label={<Text style={styles.labelText}>Số điện thoại</Text>}
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            contentStyle={styles.inputContent}
            placeholder="Nhập số điện thoại..."
            placeholderTextColor="#777"
            theme={{
              colors: {
                primary: "#4F46E5",
                outline: "#C5CAE9",
                onSurfaceVariant: "#3F3D56",
              },
            }}
          />

          {/* --- Address --- */}
          <TextInput
            label={<Text style={styles.labelText}>Địa chỉ</Text>}
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={[styles.input, { height: 100 }]}
            contentStyle={[styles.inputContent, { textAlignVertical: "top" }]}
            placeholder="Nhập địa chỉ của bạn..."
            placeholderTextColor="#777"
            theme={{
              colors: {
                primary: "#4F46E5",
                outline: "#C5CAE9",
                onSurfaceVariant: "#3F3D56",
              },
            }}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            labelStyle={{ fontSize: 16, fontWeight: "bold" }}
            buttonColor="#4F46E5"
            textColor="white"
          >
            💾 Lưu thay đổi
          </Button>
        </Card.Content>
      </Card>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <Button
          icon="logout"
          mode="outlined"
          textColor="#d32f2f"
          onPress={handleLogout}
          style={styles.logoutButton}
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
        >
          Đăng xuất
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFC",
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  avatarWrapper: {
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 60,
    padding: 3,
    marginBottom: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  username: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 6,
  },
  role: {
    fontSize: 16,
    color: "#E0E7FF",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 20,
    paddingVertical: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  labelText: {
    color: "#3F3D56",
    fontWeight: "600",
    fontSize: 15,
  },
  input: {
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  inputContent: {
    color: "#000",
    fontSize: 16,
    paddingVertical: 6,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 10,
  },
  logoutSection: {
    marginTop: 30,
    alignItems: "center",
  },
  logoutButton: {
    width: "60%",
    borderRadius: 10,
    borderColor: "#d32f2f",
    borderWidth: 1.3,
  },
});

export default AccountScreen;
