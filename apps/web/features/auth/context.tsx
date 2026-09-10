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
import { getAuthErrorDetails } from "./debug";
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
    const hasAuthStateCookie = hasAuthCookie();
    console.info("[MyGov Auth] Refreshing auth state", { hasAuthStateCookie });

    if (!hasAuthStateCookie) {
      console.info("[MyGov Auth] No authentication state cookie found");
      setUser(null);
      setLoading(false);
      return;
    }

    const token = getAuthToken();

    if (!token) {
      console.error(
        "[MyGov Auth] Authentication state cookie exists, but token cookie is missing",
      );
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      console.info("[MyGov Auth] Requesting current user", {
        endpoint: "/api/me",
        hasToken: true,
      });
      const response = await getMe(token);
      console.log("/api/me resp:", response);

      setUser(response.data);
      console.info("[MyGov Auth] Current user loaded", {
        authenticated: true,
      });
    } catch (error: unknown) {
      setUser(null);
      console.error(
        "[MyGov Auth] Current user request failed",
        getAuthErrorDetails(error),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void refreshUser();
    }, 0);

    const handleAuthChange = () => {
      console.info("[MyGov Auth] Authentication change event received");
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
