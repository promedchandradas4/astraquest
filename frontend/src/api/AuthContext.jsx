import React, { createContext, useContext, useState, useCallback } from "react";
import client from "./client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("astraquest_user");
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (token, userData) => {
    localStorage.setItem("astraquest_token", token);
    localStorage.setItem("astraquest_user", JSON.stringify(userData));
    setUser(userData);
  };

  const signUp = useCallback(async ({ fullName, email, password, confirmPassword }) => {
    const { data } = await client.post("/auth/signup/", {
      full_name: fullName,
      email,
      password,
      confirm_password: confirmPassword,
    });
    persist(data.token, data.user);
    return data.user;
  }, []);

  const logIn = useCallback(async ({ email, password }) => {
    const { data } = await client.post("/auth/login/", { email, password });
    persist(data.token, data.user);
    return data.user;
  }, []);

  const logOut = useCallback(async () => {
    try {
      await client.post("/auth/logout/");
    } catch (e) {
      // token may already be invalid — clear local state regardless
    }
    localStorage.removeItem("astraquest_token");
    localStorage.removeItem("astraquest_user");
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(localStorage.getItem("astraquest_token"));

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
