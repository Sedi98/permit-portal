"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getMe } from "./api";
import { getAuthToken, hasAuthCookie } from "./cookies";
import type { MeUser } from "./types";

type AuthContextValue = {
  user: MeUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!hasAuthCookie()) {
      setUser(null);
      setLoading(false);
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await getMe(token);
      setUser(response.data);
      console.log("/api/me response:", response);
    } catch (error: unknown) {
      setUser(null);
      console.error("/api/me error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void refreshUser();
    }, 0);

    const handleAuthChange = () => {
      void refreshUser();
    };

    window.addEventListener("portal-auth-change", handleAuthChange);
    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener("portal-auth-change", handleAuthChange);
    };
  }, [refreshUser]);

  const clearUser = useCallback(() => setUser(null), []);
  const value = useMemo(
    () => ({ user, loading, refreshUser, clearUser }),
    [clearUser, loading, refreshUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
