import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router";
import { PROFILE_ROUTE, AUTH_ROUTE } from "@/utils/CONSTANTS.ts";
import { api } from "@/utils/api";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  refreshAuthToken: () => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("auth_token")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isAuthenticated = !!token;

  const clearError = () => setError(null);

  const setAuthToken = (accessToken: string) => {
    localStorage.setItem("auth_token", accessToken);
    setToken(accessToken);
  };

  const clearAuthToken = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.success && response.data.accessToken) {
        setAuthToken(response.data.accessToken);
        navigate(PROFILE_ROUTE);
      } else {
        throw new Error(response.error || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/register", userData);

      if (response.success && response.data.accessToken) {
        setAuthToken(response.data.accessToken);
        navigate(PROFILE_ROUTE);
      } else {
        throw new Error(response.error || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const refreshAuthToken = async (): Promise<boolean> => {
    try {
      const response = await api.post("/auth/refresh");

      if (response.success && response.data.accessToken) {
        setAuthToken(response.data.accessToken);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Token refresh failed:", err);
      clearAuthToken();
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearAuthToken();
      navigate(AUTH_ROUTE);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    const authStatus = urlParams.get("auth");
    const accessToken = urlParams.get("accessToken");

    if (errorParam) {
      setError(errorParam);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      return;
    }

    if (authStatus === "success" && accessToken) {
      setAuthToken(accessToken);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      navigate(PROFILE_ROUTE);
    }
  }, [navigate]);

  useEffect(() => {
    const initializeApiIntegration = async () => {
      const { setAuthContextFunctions } = await import("@/utils/api");
      setAuthContextFunctions(refreshAuthToken, logout);
    };

    initializeApiIntegration();
  }, [refreshAuthToken, logout]);

  const value: AuthContextType = {
    token,
    isAuthenticated,
    login,
    register,
    refreshAuthToken,
    logout,
    loading,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
