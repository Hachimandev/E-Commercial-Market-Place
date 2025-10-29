import AsyncStorage from "@react-native-async-storage/async-storage";

const getToken = async (): Promise<string | null> => {
  const token = await AsyncStorage.getItem("userToken");
  console.log("Retrieved Token:", token); // <--- Thêm dòng này
  return token;
};
// const IP = "192.168.1.226"; // nhập lênh ipconfig lấy địa chỉ  IPv4 Address thay là đc
const IP = "192.168.1.115";
const PORT = 8080;

export const API_BASE_URL = `http://${IP}:${PORT}`;

const request = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = await getToken();

  const headers = new Headers(options.headers || {});

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Lỗi ${response.status}: ${text}`);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch API error:", error);
    throw error;
  }
};

export const api = {
  get: (endpoint: string) => request(endpoint),
  post: (endpoint: string, body: any) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint: string) => request(endpoint, { method: "DELETE" }),
};
