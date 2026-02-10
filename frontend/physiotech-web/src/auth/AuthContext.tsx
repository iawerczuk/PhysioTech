import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiLogin, apiMe, apiRegister, clearToken, getToken } from "../api";

type User = {
  userId: string;
  email: string;
  roles: string[];
};

type AuthState = {
  user: User | null;
  isReady: boolean;
  isLoggedIn: boolean;
  refreshMe: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  registerAndLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  async function refreshMe() {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const me = await apiMe();
      setUser({ userId: me.userId, email: me.email, roles: me.roles ?? [] });
    } catch {
      clearToken();
      setUser(null);
    }
  }

  useEffect(() => {
    refreshMe().finally(() => setIsReady(true));
  }, []);

  async function login(email: string, password: string) {
    await apiLogin(email, password);
    await refreshMe();
  }

  async function registerAndLogin(email: string, password: string) {
    await apiRegister(email, password);
    await apiLogin(email, password);
    await refreshMe();
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  const value = useMemo<AuthState>(
    () => ({
      user,
      isReady,
      isLoggedIn: !!user,
      refreshMe,
      login,
      registerAndLogin,
      logout,
    }),
    [user, isReady]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const v = useContext(AuthCtx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
  return v;
}