import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// (Không cần import 'api' ở đây vì login dùng fetch riêng)
import { API_BASE_URL } from "../api/api"; // Chỉ cần import base URL

interface User {
  username: string;
  role: string;
  // Sửa lại tên trường cho khớp với response BE (nếu cần)
  fullName: string; // Đổi từ name
  phone: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// --- ĐỔI KEY TOKEN THÀNH 'userToken' ---
const TOKEN_KEY = "userToken";
const USER_KEY = "user"; // Key cho user data có thể giữ nguyên

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Giữ state loading

  // Load token và user khi app khởi động
  useEffect(() => {
    const loadUserData = async () => {
      console.log("AuthProvider: Loading user data...");
      try {
        // ✅ Sửa key đọc token
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);

        console.log("AuthProvider: Stored Token =", storedToken);
        console.log("AuthProvider: Stored User =", storedUser);

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            console.log("AuthProvider: User data loaded successfully.");
          } else {
            console.warn("AuthProvider: Token found but user data missing.");
            // Có thể gọi API lấy thông tin user ở đây nếu cần
          }
        } else {
          console.log("AuthProvider: No token found.");
        }
      } catch (err) {
        console.error("AuthProvider: Error loading user data:", err);
        // Xóa dữ liệu cũ nếu có lỗi đọc
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false); // Kết thúc loading
        console.log("AuthProvider: Finished loading user data.");
      }
    };

    loadUserData();
  }, []);

  // Hàm Login
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    console.log(`AuthProvider: Attempting login for user: ${username}`);
    try {
      // Sử dụng fetch trực tiếp (không cần api.ts vì chưa có token)
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log(`AuthProvider: Login API response status: ${res.status}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `AuthProvider: Login API failed with status ${res.status}: ${errorText}`
        );
        return false; // Đăng nhập thất bại
      }

      const data = await res.json();
      console.log("AuthProvider: Login API response data:", data);

      // --- Kiểm tra xem response có token không ---
      if (!data.token) {
        console.error(
          "AuthProvider: Login successful but token is missing in API response!"
        );
        return false;
      }

      // Map dữ liệu user từ response (kiểm tra tên trường cho đúng)
      const userData: User = {
        username, // Lấy username đã nhập
        role: data.role,
        fullName: data.fullName, // Đảm bảo backend trả về 'fullName'
        phone: data.phone,
        address: data.address,
      };

      // ✅ Sửa key lưu token
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      console.log(
        `AuthProvider: Token and user data saved successfully for ${username}.`
      );

      // Cập nhật state
      setToken(data.token);
      setUser(userData);

      return true; // Đăng nhập thành công
    } catch (err) {
      console.error("AuthProvider: Login function error:", err);
      // Đảm bảo xóa token cũ nếu login lỗi
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
      return false; // Đăng nhập thất bại
    }
  };

  // Hàm Logout
  const logout = async () => {
    console.log("AuthProvider: Logging out...");
    try {
      // ✅ Sửa key xóa token
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      console.log("AuthProvider: Token and user data removed from storage.");
    } catch (err) {
      console.error("AuthProvider: Error removing data on logout:", err);
    } finally {
      // Reset state
      setUser(null);
      setToken(null);
      console.log("AuthProvider: Auth state reset.");
    }
  };

  // Xác định trạng thái đăng nhập
  const isLoggedIn = !!token; // Dựa vào token state

  // Chỉ render children khi đã load xong dữ liệu ban đầu
  if (loading) {
    // Bạn có thể trả về một màn hình loading ở đây nếu muốn
    return null; // Hoặc một ActivityIndicator toàn màn hình
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook useAuth (giữ nguyên)
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
