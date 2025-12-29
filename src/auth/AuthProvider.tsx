import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { login, logout, refreshAccessToken } from "./api"; // Import API functions

// Define separate interface for context value
interface AuthContextType {
  user: {
    token: string;
    username: string;
    email: string;
  } | null;
  loginUser: (username: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ token: string; username: string; email: string; } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user info from sessionStorage
    const token = sessionStorage.getItem("access_token");
    const username = sessionStorage.getItem("username");
    const email = sessionStorage.getItem("email");

    if (token && username && email) {
      setUser({ token, username, email });
    }
    setLoading(false);
  }, []);

  const loginUser = async (emailInput: string, password: string) => {
    try {
      // api.login handles sessionStorage updates
      const data = await login(emailInput, password);

      // Update local state
      // Backend returns { access, refresh, user: { username, email, ... } }
      if (data.access && data.user) {
        setUser({
          token: data.access,
          username: data.user.username,
          email: data.user.email
        });
        navigate("/"); // Redirect user after login
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Re-throw so UI can handle it
    }
  };

  const logoutUser = async () => {
    await logout(); // This handles API call and clearing sessionStorage
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading, setUser } as any}>
      {children}
    </AuthContext.Provider>
  );
};
