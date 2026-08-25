import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach JWT token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token attached:", token.slice(0, 20) + "...");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handler for responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid/expired, log out
    if (error.response?.status === 401) {
      const isAuthPage = window.location.pathname === "/login" || window.location.pathname === "/register";
      if (!isAuthPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Optional: redirect handled by components
      }
    }
    return Promise.reject(error);
  }
);

export default api;

