import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../api/api";
import { CommonActions } from "@react-navigation/native";

const COLORS = {
  primary: "#0078D7",
  textDark: "#1E293B",
  textLight: "#64748B",
  background: "#FFFFFF",
  border: "#CBD5E1",
};

const RegisterScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !fullName || !phone || !address || !password || !confirm) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        name: username,
        fullName,
        password,
        phone,
        address,
      });

      // Nếu đăng ký thành công, backend trả 200 và buyer object
      Alert.alert("Thành công", "Đăng ký thành công!", [
        {
          text: "OK",
          onPress: () => {
            setUsername("");
            setFullName("");
            setPhone("");
            setAddress("");
            setPassword("");
            setConfirm("");
            navigation.getParent()?.navigate("LoginScreen");
          },
        },
      ]);
    } catch (error: any) {
      const msg =
        error.response?.data?.error ||
        "Không thể đăng ký. Vui lòng thử lại sau!";
      Alert.alert("Lỗi", msg);
      console.log("Register error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <LinearGradient
      colors={["#E3F2FD", "#BBDEFB", "#90CAF9"]}
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Đăng ký tài khoản</Text>
            <View style={{ width: 30 }} />
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Chào mừng bạn!</Text>
              <Text style={styles.subtitle}>
                Vui lòng điền thông tin để tạo tài khoản
              </Text>

              <TextInput
                label="Tên đăng nhập"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                left={<TextInput.Icon icon="account-outline" />}
                style={styles.input}
              />

              <TextInput
                label="Họ và tên"
                value={fullName}
                onChangeText={setFullName}
                mode="outlined"
                left={<TextInput.Icon icon="account-details-outline" />}
                style={styles.input}
              />

              <TextInput
                label="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                mode="outlined"
                left={<TextInput.Icon icon="phone-outline" />}
                style={styles.input}
              />

              <TextInput
                label="Địa chỉ"
                value={address}
                onChangeText={setAddress}
                mode="outlined"
                left={<TextInput.Icon icon="map-marker-outline" />}
                style={styles.input}
              />

              <TextInput
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                mode="outlined"
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
              />

              <TextInput
                label="Xác nhận mật khẩu"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!showConfirm}
                mode="outlined"
                left={<TextInput.Icon icon="lock-check-outline" />}
                right={
                  <TextInput.Icon
                    icon={showConfirm ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setShowConfirm(!showConfirm)}
                  />
                }
                style={styles.input}
              />

              <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.button}
                loading={loading}
                disabled={loading}
              >
                {loading ? "Đang đăng ký..." : "Đăng ký ngay"}
              </Button>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Đã có tài khoản?</Text>
                <Button
                  mode="text"
                  onPress={() => navigation.goBack()}
                  textColor={COLORS.primary}
                >
                  Đăng nhập ngay
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: { padding: 5 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    elevation: 4,
    paddingVertical: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 15,
    color: COLORS.textLight,
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: COLORS.background,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: 15,
  },
});

export default RegisterScreen;
