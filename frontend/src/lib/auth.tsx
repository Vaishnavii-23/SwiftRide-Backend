import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchApi, setTokens, clearTokens } from "./api";

// Backend uses uppercase roles: RIDER, DRIVER, ADMIN, SUPER_ADMIN
export type Role = "RIDER" | "DRIVER" | "ADMIN" | "SUPER_ADMIN";

// Backend User model: id, email, phone, role (NO name field in the DB)
export interface User {
  id: string;
  email: string;
  phone: string;
  role: Role;
}

interface AuthContextValue {
  user: User | null;
  role: Role | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, phone: string, password: string, role: Role) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_STORAGE_KEY = "swiftride-user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }, []);

  const persistUser = (u: User | null) => {
    if (u) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    setUser(u);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,

      // Backend POST /api/auth/login expects { email, password }
      // Returns { message, accessToken, refreshToken, user: { id, email, phone, role } }
      login: async (email: string, password: string) => {
        const res = await fetchApi("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        // Store both tokens for authenticated requests
        setTokens(res.accessToken, res.refreshToken);
        persistUser(res.user);
        return res.user;
      },

      // Backend POST /api/auth/register expects { email, phone, password, role }
      // Returns { message, user: { id, email, phone, role } }
      register: async (email: string, phone: string, password: string, role: Role) => {
        const res = await fetchApi("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, phone, password, role }),
        });
        return res.user;
      },

      logout: () => {
        clearTokens();
        persistUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
