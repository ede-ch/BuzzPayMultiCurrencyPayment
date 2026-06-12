"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthUser, LoginResponse } from "@/lib/api";

const STORAGE_KEY = "buzzpay_session";

interface Session {
  user: AuthUser;
  access_token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isReady: boolean;
  setSession: (data: LoginResponse) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSessionState(JSON.parse(stored) as Session);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsReady(true);
  }, []);

  function setSession(data: LoginResponse) {
    const next: Session = { user: data.user, access_token: data.access_token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSessionState(next);
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    setSessionState(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.access_token ?? null,
        isReady,
        setSession,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
