"use client";

import { create } from "zustand";

export interface AuthUser {
  id: string;
  phone: string;
  name: string | null;
  role: "buyer" | "company_admin" | "platform_admin";
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  setAuth: (user: AuthUser, accessToken: string) => void;
  clearAuth: () => void;
  setStatus: (status: AuthState["status"]) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  status: "idle",

  setAuth: (user, accessToken) =>
    set({ user, accessToken, status: "authenticated" }),

  clearAuth: () =>
    set({ user: null, accessToken: null, status: "unauthenticated" }),

  setStatus: (status) => set({ status }),
}));
