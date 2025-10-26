import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text, Divider, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

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

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert(
        "Lỗi đăng nhập",
        "Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu."
      );
      return;
    }

    setLoading(true);
    const success = await login(username, password);
    setLoading(false);

    if (!success) {
      Alert.alert(
        "Đăng nhập thất bại",
        "Tên đăng nhập hoặc mật khẩu không chính xác."
      );
    }
  };

  const handleGoToRegister = () => {
    navigation.navigate("RegisterScreen");
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(
      "Thông báo",
      `Chức năng đăng nhập bằng ${provider} chưa được hỗ trợ.`
    );
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
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/5087/5087579.png",
            }}
            style={styles.logo}
          />

          <Text style={styles.appName}>Chợ Thương Mại</Text>
          <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>

          <Card style={styles.card}>
            <Card.Content>
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
                label={<Text style={styles.labelText}>Mật khẩu</Text>}
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry
                left={<TextInput.Icon icon="lock-outline" />}
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

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                buttonColor={COLORS.primary}
                loading={loading}
                disabled={loading}
                labelStyle={styles.buttonText}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <Divider style={styles.divider} />
              <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>

              <View style={styles.socialButtonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => handleSocialLogin("Google")}
                  style={styles.socialButton}
                  icon={() => (
                    <AntDesign name="google" size={20} color="#DB4437" />
                  )}
                  textColor="#DB4437"
                  labelStyle={{ fontWeight: "600" }}
                >
                  Google
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => handleSocialLogin("Facebook")}
                  style={styles.socialButton}
                  icon={() => (
                    <FontAwesome
                      name="facebook-square"
                      size={20}
                      color="#4267B2"
                    />
                  )}
                  textColor="#4267B2"
                  labelStyle={{ fontWeight: "600" }}
                >
                  Facebook
                </Button>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Chưa có tài khoản?</Text>
            <Button
              mode="text"
              onPress={handleGoToRegister}
              textColor={COLORS.primary}
              labelStyle={{ fontWeight: "600" }}
            >
              Đăng ký ngay
            </Button>
          </View>
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
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.padding * 1.5,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 25,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius * 1.5,
    elevation: 4,
    marginBottom: 20,
    paddingVertical: 10,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  button: {
    borderRadius: 10,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 20,
    backgroundColor: COLORS.border,
  },
  orText: {
    textAlign: "center",
    color: COLORS.textLight,
    marginBottom: 15,
    fontSize: 15,
  },
  socialButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    borderColor: COLORS.border,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  registerText: {
    color: COLORS.textLight,
    fontSize: 15,
  },
});

export default LoginScreen;
