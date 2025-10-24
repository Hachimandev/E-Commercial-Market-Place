import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  username: string;
  role: string;
  name: string;
  phone: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getProfile: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const API_URL = "http://localhost:8080/api/auth";

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      const userData: User = {
        username,
        role: data.role,
        name: data.fullName,
        phone: data.phone,
        address: data.address,
      };
      console.log(data);
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setToken(data.token);
      setUser(userData);

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

  const getProfile = async (): Promise<User | null> => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken) return null;

      const res = await fetch(`localhost:8080/api/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!res.ok) {
        console.log(await res.text());
        throw new Error("Cannot fetch profile");
      }

      const data = await res.json();
      const profile: User = {
        username: data.username,
        role: data.role,
        name: data.fullName || data.name,
        phone: data.phone,
        address: data.address,
      };

      setUser(profile);
      return profile;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");
      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          await getProfile();
        }
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
