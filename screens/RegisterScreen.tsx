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
import {
  TextInput,
  Button,
  Text,
  Card,
  ActivityIndicator,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants/styles";

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password || !confirm || !fullName || !phone || !address) {
      Alert.alert("⚠️ Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== confirm) {
      Alert.alert("❌ Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    Alert.alert("🎉 Thành công", "Tài khoản đã được tạo, vui lòng đăng nhập.");
    navigation.goBack();
  };

  const handleSocialRegister = (provider: string) => {
    Alert.alert(
      "Thông báo",
      `Chức năng đăng ký bằng ${provider} sẽ sớm được cập nhật!`
    );
  };

  return (
    <LinearGradient
      colors={["#E0F7FA", "#B2EBF2", "#80DEEA"]}
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng ký tài khoản</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View>
            <Text style={styles.title}>Chào mừng bạn! 👋</Text>
            <Text style={styles.subtitle}>
              Tạo tài khoản để bắt đầu mua sắm cùng MarketPlaceX
            </Text>

            <Card style={styles.card}>
              <Card.Content>
                <TextInput
                  label="Tên đăng nhập"
                  mode="outlined"
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                  left={<TextInput.Icon icon="account-outline" />}
                  disabled={loading}
                />
                <TextInput
                  label="Họ và tên"
                  mode="outlined"
                  value={fullName}
                  onChangeText={setFullName}
                  style={styles.input}
                  left={<TextInput.Icon icon="account-details-outline" />}
                  disabled={loading}
                />
                <TextInput
                  label="Số điện thoại"
                  mode="outlined"
                  value={phone}
                  onChangeText={setPhone}
                  style={styles.input}
                  left={<TextInput.Icon icon="phone-outline" />}
                  keyboardType="phone-pad"
                  disabled={loading}
                />
                <TextInput
                  label="Địa chỉ"
                  mode="outlined"
                  value={address}
                  onChangeText={setAddress}
                  style={styles.input}
                  left={<TextInput.Icon icon="map-marker-outline" />}
                  disabled={loading}
                />
                <TextInput
                  label="Mật khẩu"
                  mode="outlined"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                  left={<TextInput.Icon icon="lock-outline" />}
                  disabled={loading}
                />
                <TextInput
                  label="Xác nhận mật khẩu"
                  mode="outlined"
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry
                  style={styles.input}
                  left={<TextInput.Icon icon="lock-check-outline" />}
                  disabled={loading}
                />

                <Button
                  mode="contained"
                  onPress={handleRegister}
                  style={styles.button}
                  buttonColor={COLORS.primary}
                  loading={loading}
                  disabled={loading}
                  labelStyle={{ fontWeight: "bold", fontSize: 16 }}
                >
                  {loading ? "Đang tạo..." : "Đăng ký ngay"}
                </Button>

                <Text style={styles.orText}>— Hoặc đăng ký bằng —</Text>

                <View style={styles.socialButtonContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => handleSocialRegister("Google")}
                    style={styles.socialButton}
                    icon={() => (
                      <AntDesign name="google" size={20} color="#DB4437" />
                    )}
                    textColor="#DB4437"
                  >
                    Google
                  </Button>

                  <Button
                    mode="outlined"
                    onPress={() => handleSocialRegister("Facebook")}
                    style={styles.socialButton}
                    icon={() => (
                      <FontAwesome
                        name="facebook-square"
                        size={20}
                        color="#4267B2"
                      />
                    )}
                    textColor="#4267B2"
                  >
                    Facebook
                  </Button>
                </View>
              </Card.Content>
            </Card>

            <View style={styles.footer}>
              <Text style={{ color: COLORS.textLight }}>Đã có tài khoản?</Text>
              <Button
                mode="text"
                onPress={() => navigation.goBack()}
                textColor={COLORS.primary}
              >
                Đăng nhập ngay
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 35,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    elevation: 5,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: COLORS.textLight,
    marginBottom: 20,
  },
  input: {
    marginBottom: 14,
    backgroundColor: COLORS.background,
  },
  button: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 10,
  },
  orText: {
    textAlign: "center",
    color: COLORS.textLight,
    marginTop: 20,
    marginBottom: 10,
  },
  socialButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    borderColor: COLORS.border,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
});
