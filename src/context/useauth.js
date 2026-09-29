"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // On first load, check localStorage for an existing session
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
        setIsLoggedIn(true);
      }
    } catch {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Called by useLogin() after a successful login API call
  const setAuth = useCallback((response) => {
    const { access_token, user } = response.data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, authLoading, setAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 👇 This is the useAuth hook
export const useAuth = () => useContext(AuthContext);