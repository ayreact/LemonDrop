import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const LOGIN_URL = import.meta.env.VITE_LOGIN_URL || "/login";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Important for HttpOnly cookies
});

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Message {
  id: number;
  message: string;
  timestamp: string;
}

// Function to fetch user info
const fetchUserInfo = async (accessToken: string) => {
  try {
    const response = await api.get("/social-auth/user-info/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.data) {
      sessionStorage.setItem("username", response.data.username);
      sessionStorage.setItem("email", response.data.email);
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user info", error);
  }
};

// --- Auth Services ---

export const signup = async (username: string, email: string, password: string) => {
  const response = await api.post("/uauth/register/", {
    username,
    email,
    password,
    confirm_password: password
  });

  if (response.data.access) {
    sessionStorage.setItem("access_token", response.data.access);
    // Refresh token is handled via HttpOnly cookie

    // Try to fetch user info if not provided
    if (response.data.user) {
      sessionStorage.setItem("username", response.data.user.username);
      sessionStorage.setItem("email", response.data.user.email);
    } else {
      await fetchUserInfo(response.data.access);
    }
  }

  return response.data;
};

export const login = async (username: string, password: string) => {
  const response = await api.post("/uauth/login/", { username, password });

  if (response.data.access) {
    sessionStorage.setItem("access_token", response.data.access);
    // Refresh token is handled via HttpOnly cookie

    if (response.data.user) {
      sessionStorage.setItem("username", response.data.user.username);
      sessionStorage.setItem("email", response.data.user.email);
    } else {
      // Fetch user info if not provided in login response
      const userData = await fetchUserInfo(response.data.access);
      if (userData) {
        response.data.user = userData;
      }
    }
  }

  return response.data;
};

export const logout = async () => {
  const accessToken = sessionStorage.getItem("access_token");

  try {
    await api.post(
      "/uauth/logout/",
      {}, // Body is empty as refresh token is in cookie
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (error: any) {
    console.error("Logout failed", error);
    if (error.response) {
      console.error("Logout Error Data:", error.response.data);
    }
  } finally {
    sessionStorage.clear();
  }
};

export const googleLogin = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/social-auth/google/`);
    const data = await response.json();
    window.location.href = data.authorization_url;
  } catch (error) {
    console.error("Failed to get Google authorization URL", error);
  }
};

export const refreshAccessToken = async () => {
  try {
    // No need to Read refresh token from storage, it's in the cookie
    const response = await api.post("/uauth/token/refresh/", {});

    if (response.data.access) {
      sessionStorage.setItem("access_token", response.data.access);
      return response.data.access;
    }
  } catch (error) {
    console.error("Refresh token failed", error);
    return null;
  }
};

// --- Message Services ---

export const sendMessage = async (username: string, message: string) => {
  const response = await api.post(`/messages/new_message/${username}/`, { message });
  return response.data;
};

export const getMessages = async (username: string) => {
  const response = await api.get(`/messages/retrieve/${username}/`);
  return response.data;
};

export const deleteMessage = async (messageId: number) => {
  const response = await api.delete(`/messages/delete_message/${messageId}/`);
  return response.data;
};


// Axios interceptor to automatically refresh the access token
api.interceptors.request.use(
  async (config) => {
    let accessToken = sessionStorage.getItem("access_token");

    if (accessToken) {
      try {
        const decodedToken: any = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;

        // If the token is about to expire (giving 10s buffer), refresh it
        if (decodedToken.exp < currentTime + 10) {
          accessToken = await refreshAccessToken();
          if (!accessToken) {
            throw new Error("Session expired");
          }
        }
      } catch (e) {
        console.warn("Token decoding failed or session expired", e)
        sessionStorage.clear();
        window.location.href = LOGIN_URL;
        return Promise.reject("Session expired");
      }

      // Attach the new token to the request
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
