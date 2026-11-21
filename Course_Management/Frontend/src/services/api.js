import axios from "axios";
import apiCache from "../utils/apiCache";

const api = axios.create({
  baseURL: "https://course-management-backend-hejk.onrender.com/api",
});

// Attach JWT token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      const isAuthPage =
        window.location.pathname === "/login" ||
        window.location.pathname === "/register";
      if (!isAuthPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

// Cached GET request with automatic deduplication and caching
api.getCached = async (url, config = {}) => {
  const params = config.params || {};
  const ttl = config.cacheTtl || 5 * 60 * 1000; // 5 minutes default

  // Check cache first
  const cached = apiCache.get(url, params);
  if (cached) {
    return { data: cached, fromCache: true };
  }

  // Fetch with deduplication
  const key = apiCache.getKey(url, params);
  const data = await apiCache.fetchOrWait(key, async () => {
    const response = await api.get(url, config);
    apiCache.set(url, params, response.data, ttl);
    return response.data;
  });

  return { data, fromCache: false };
};

// Invalidate cache for a specific URL or pattern
api.invalidateCache = (url, params = {}) => {
  apiCache.invalidate(url, params);
};

api.invalidateCachePattern = (pattern) => {
  apiCache.invalidatePattern(pattern);
};

api.clearCache = () => {
  apiCache.clear();
};

export default api;

