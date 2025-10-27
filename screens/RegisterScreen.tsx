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

const COLORS = {
  primary: "#0078D7",
  textDark: "#1E293B",
  textLight: "#64748B",
  background: "#FFFFFF",
  border: "#CBD5E1",
};

const SIZES = {
  radius: 10,
  padding: 16,
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
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    Alert.alert("Thành công", "Đăng ký thành công!");
    navigation.goBack();
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
                label={<Text style={styles.labelText}>Tên đăng nhập</Text>}
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                left={<TextInput.Icon icon="account-outline" />}
                style={styles.input}
                contentStyle={styles.inputText}
                theme={{
                  colors: {
                    primary: COLORS.primary,
                    outline: COLORS.border,
                    onSurfaceVariant: COLORS.textDark,
                  },
                }}
              />

              <TextInput
                label={<Text style={styles.labelText}>Họ và tên</Text>}
                value={fullName}
                onChangeText={setFullName}
                mode="outlined"
                left={<TextInput.Icon icon="account-details-outline" />}
                style={styles.input}
                contentStyle={styles.inputText}
                theme={{
                  colors: {
                    primary: COLORS.primary,
                    outline: COLORS.border,
                    onSurfaceVariant: COLORS.textDark,
                  },
                }}
              />

              <TextInput
                label={<Text style={styles.labelText}>Số điện thoại</Text>}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                mode="outlined"
                left={<TextInput.Icon icon="phone-outline" />}
                style={styles.input}
                contentStyle={styles.inputText}
                theme={{
                  colors: {
                    primary: COLORS.primary,
                    outline: COLORS.border,
                    onSurfaceVariant: COLORS.textDark,
                  },
                }}
              />

              <TextInput
                label={<Text style={styles.labelText}>Địa chỉ</Text>}
                value={address}
                onChangeText={setAddress}
                mode="outlined"
                left={<TextInput.Icon icon="map-marker-outline" />}
                style={styles.input}
                contentStyle={styles.inputText}
                theme={{
                  colors: {
                    primary: COLORS.primary,
                    outline: COLORS.border,
                    onSurfaceVariant: COLORS.textDark,
                  },
                }}
              />

              <TextInput
                label={<Text style={styles.labelText}>Mật khẩu</Text>}
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                contentStyle={styles.inputText}
                theme={{
                  colors: {
                    primary: COLORS.primary,
                    outline: COLORS.border,
                    onSurfaceVariant: COLORS.textDark,
                  },
                }}
              />

              <TextInput
                label={<Text style={styles.labelText}>Xác nhận mật khẩu</Text>}
                value={confirm}
                onChangeText={setConfirm}
                mode="outlined"
                secureTextEntry={!showConfirm}
                left={<TextInput.Icon icon="lock-check-outline" />}
                right={
                  <TextInput.Icon
                    icon={showConfirm ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setShowConfirm(!showConfirm)}
                  />
                }
                style={styles.input}
                contentStyle={styles.inputText}
                theme={{
                  colors: {
                    primary: COLORS.primary,
                    outline: COLORS.border,
                    onSurfaceVariant: COLORS.textDark,
                  },
                }}
              />

              <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.button}
                buttonColor={COLORS.primary}
                loading={loading}
                labelStyle={styles.buttonText}
              >
                {loading ? "Đang tạo..." : "Đăng ký ngay"}
              </Button>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Đã có tài khoản?</Text>
                <Button
                  mode="text"
                  onPress={() => navigation.goBack()}
                  textColor={COLORS.primary}
                  labelStyle={{ fontWeight: "600" }}
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
  gradientContainer: {
    flex: 1,
  },
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
  backButton: {
    padding: 5,
  },
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
  labelText: {
    color: COLORS.textDark,
    fontWeight: "600",
    fontSize: 15,
  },
  input: {
    marginBottom: 15,
    backgroundColor: COLORS.background,
    borderRadius: 10,
  },
  inputText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
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
