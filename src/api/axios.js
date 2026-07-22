import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor
api.interceptors.request.use((config) => {
  //const token = localStorage.getItem("token");
  const token = sessionStorage.getItem("token"); // ✅ plus sûr que localStorage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;