// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import { useNavigate } from "react-router";
// import { DASHBOARD_ROUTE, AUTH_ROUTE } from "@/utils/CONSTANTS.ts";

// interface AuthContextType {
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (userData: any) => Promise<void>;
//   logout: () => void;
//   loading: boolean;
//   error: string | null;
//   clearError: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [token, setToken] = useState<string | null>(
//     localStorage.getItem("auth_token")
//   );
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const isAuthenticated = !!token;

//   const clearError = () => setError(null);

//   const setAuthToken = (accessToken: string) => {
//     localStorage.setItem("auth_token", accessToken);
//     setToken(accessToken);
//   };

//   const clearAuthToken = () => {
//     localStorage.removeItem("auth_token");
//     setToken(null);
//   };

//   const getAuthHeaders = (): HeadersInit => {
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("http://localhost:5090/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Login failed");
//       }

//       if (data.success && data.data.accessToken) {
//         setAuthToken(data.data.accessToken);
//         navigate(DASHBOARD_ROUTE);
//       }
//     } catch (err) {
//       setError(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (userData: any) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("http://localhost:5090/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Registration failed");
//       }

//       if (data.success && data.data.accessToken) {
//         setAuthToken(data.data.accessToken);
//         navigate(DASHBOARD_ROUTE);
//       }
//     } catch (err) {
//       setError(err.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await fetch("http://localhost:5090/api/auth/logout", {
//         method: "POST",
//         headers: getAuthHeaders(),
//       });
//     } catch (err) {
//       console.error("Logout error:", err);
//     } finally {
//       clearAuthToken();
//       navigate(AUTH_ROUTE);
//     }
//   };

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const errorParam = urlParams.get("error");
//     const authStatus = urlParams.get("auth");
//     const accessToken = urlParams.get("accessToken");

//     if (errorParam) {
//       setError(errorParam);
//       window.history.replaceState({}, document.title, window.location.pathname);
//       return;
//     }

//     if (authStatus === "success" && accessToken) {
//       setAuthToken(accessToken);
//       window.history.replaceState({}, document.title, window.location.pathname);
//       navigate(DASHBOARD_ROUTE);
//     }
//   }, [navigate]);

//   const value: AuthContextType = {
//     token,
//     isAuthenticated,
//     login,
//     register,
//     logout,
//     loading,
//     error,
//     clearError,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
