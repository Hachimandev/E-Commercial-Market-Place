import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  const API_URL = "http://192.168.1.92:8080/api/auth";

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      await AsyncStorage.setItem("token", data.token);
      setToken(data.token);
      setUser({ username, role: data.role });

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const getProfile = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken) return null;

      const res = await fetch(`http://192.168.1.92:8080/api/user/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (!res.ok) return null;
      const profile = await res.json();
      setUser(profile);
      return profile;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // ✅ Kiểm tra đăng nhập khi app khởi động
  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await getProfile();
      }
    })();
  }, []);

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, getProfile, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
