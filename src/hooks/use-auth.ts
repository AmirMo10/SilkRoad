"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore, type AuthUser } from "@/stores/auth.store";

/**
 * Auth hook. On first mount, tries to refresh the access token using the
 * httpOnly refresh cookie. Provides login helpers that call the OTP API routes.
 */
export function useAuth() {
  const { user, accessToken, status, setAuth, clearAuth, setStatus } = useAuthStore();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (!res.ok) {
        clearAuth();
        return null;
      }
      const data = await res.json() as { user: AuthUser; accessToken: string };
      setAuth(data.user, data.accessToken);
      return data;
    } catch {
      clearAuth();
      return null;
    }
  }, [setAuth, clearAuth]);

  const sendOtp = useCallback(async (phone: string) => {
    const res = await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) {
      const data = await res.json() as { error: string };
      throw new Error(data.error);
    }
    return true;
  }, []);

  const verifyOtp = useCallback(async (phone: string, code: string) => {
    const res = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    if (!res.ok) {
      const data = await res.json() as { error: string };
      throw new Error(data.error);
    }
    const data = await res.json() as { user: AuthUser; accessToken: string };
    setAuth(data.user, data.accessToken);
    return data.user;
  }, [setAuth]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAuth();
  }, [clearAuth]);

  // Try refresh on mount
  useEffect(() => {
    if (status === "idle") {
      setStatus("loading");
      refresh().then((result) => {
        if (!result) setStatus("unauthenticated");
      });
    }
  }, [status, refresh, setStatus]);

  return {
    user,
    accessToken,
    isAuthenticated: status === "authenticated",
    isLoading: status === "idle" || status === "loading",
    sendOtp,
    verifyOtp,
    logout,
    refresh,
  };
}
