import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000"
});

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token; // 🔴 IMPORTANT
  }
  return config;
});

export default api;
