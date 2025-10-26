// src/api/api.ts
const IP = "192.168.1.226"; // nhập lênh ipconfig lấy địa chỉ  IPv4 Address thay là đc
const PORT = 8080;

export const API_BASE_URL = `http://${IP}:${PORT}`;

// Hàm fetch mặc định
const request = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Lỗi ${response.status}: ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch API error:", error);
    throw error;
  }
};

// Các phương thức tiện dụng
export const api = {
  get: (endpoint: string) => request(endpoint),
  post: (endpoint: string, body: any) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint: string) => request(endpoint, { method: "DELETE" }),
};
