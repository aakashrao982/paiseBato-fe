"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
};

export type AuthData = {
  token: string;
  tokenType: string;
  user: AuthUser;
};

type AuthContextValue = {
  token: string | null;
  tokenType: string | null;
  user: AuthUser | null;
  setAuth: (data: AuthData) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_COOKIE = "auth_token";
const TOKEN_TYPE_KEY = "auth_token_type";
const USER_STORAGE_KEY = "auth_user";

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

function getCookie(name: string): string | null {
  const cookieString = typeof document !== "undefined" ? document.cookie : "";
  const parts = cookieString.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (part.startsWith(`${name}=`)) {
      return decodeURIComponent(part.substring(name.length + 1));
    }
  }
  return null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const t = getCookie(TOKEN_COOKIE);
    const tt =
      typeof window !== "undefined"
        ? localStorage.getItem(TOKEN_TYPE_KEY)
        : null;
    const u =
      typeof window !== "undefined" &&
      localStorage.getItem(USER_STORAGE_KEY) !== "undefined"
        ? localStorage.getItem(USER_STORAGE_KEY)
        : null;
    setToken(t);
    setTokenType(tt);
    if (u) setUser(u ? (JSON.parse(u) as AuthUser) : null);
  }, []);

  const setAuth = (data: AuthData) => {
    setToken(data.token);
    setTokenType(data.tokenType);
    setUser(data.user);
    setCookie(TOKEN_COOKIE, data.token, 60 * 60 * 24 * 7);
    // also persist token type in a cookie for middleware
    setCookie(TOKEN_TYPE_KEY, data.tokenType, 60 * 60 * 24 * 7);
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_TYPE_KEY, data.tokenType);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    }
  };

  const clearAuth = () => {
    setToken(null);
    setTokenType(null);
    setUser(null);
    deleteCookie(TOKEN_COOKIE);
    deleteCookie(TOKEN_TYPE_KEY);
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_TYPE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const value = useMemo(
    () => ({ token, tokenType, user, setAuth, clearAuth }),
    [token, tokenType, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
