import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // Sesuaikan URL backend Laravel kamu
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menyisipkan Bearer Token Sanctum
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
