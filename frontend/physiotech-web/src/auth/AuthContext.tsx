import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiLogin, apiMe, apiRegister, clearToken, getToken } from "../api";

export type UserMe = {
  userId?: string;
  email: string;
  roles?: string[];
  firstName?: string | null;
  lastName?: string | null;

  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  companyName?: string | null;
  nip?: string | null;
  needInvoice?: boolean;
};

type AuthContextValue = {
  user: UserMe | null;
  login: (email: string, password: string) => Promise<void>;
  registerAndLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserMe | null>(null);

  const refreshMe = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const me = await apiMe();

      if (!me?.email) {
        setUser(null);
        return;
      }

      setUser({
        userId: me.userId,
        email: me.email,
        roles: me.roles ?? [],

        firstName: me.firstName ?? null,
        lastName: me.lastName ?? null,

        address: me.address ?? null,
        city: me.city ?? null,
        postalCode: me.postalCode ?? null,
        companyName: me.companyName ?? null,
        nip: me.nip ?? null,
        needInvoice: me.needInvoice ?? false,
      });
    } catch {
      clearToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  const login = useCallback(
    async (email: string, password: string) => {
      await apiLogin(email, password);
      await refreshMe();
    },
    [refreshMe]
  );

  const registerAndLogin = useCallback(
    async (email: string, password: string) => {
      await apiRegister(email, password);
      await apiLogin(email, password);
      await refreshMe();
    },
    [refreshMe]
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, login, registerAndLogin, logout, refreshMe }),
    [user, login, registerAndLogin, logout, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth musi być użyty wewnątrz AuthProvider.");
  return ctx;
}