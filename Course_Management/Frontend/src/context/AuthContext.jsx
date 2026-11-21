import { createContext, useState, useContext, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import api from "../services/api";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // LOGIN
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      return { success: true, user: data.user };
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // REGISTER
  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", formData);
      toast.success(data.message || "Registration successful! Please login.");
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;

