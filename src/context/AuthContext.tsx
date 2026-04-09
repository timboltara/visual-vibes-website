"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export interface SavedAddress {
  firstName: string;
  lastName: string;
  address: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
}

export interface VVUser {
  email: string;
  passwordHash: string; // base64 of email+password — demo only, not real security
  firstName: string;
  lastName: string;
  phone: string;
  address: SavedAddress | null;
  createdAt: string;
}

interface AuthContextValue {
  user: VVUser | null;
  loading: boolean;
  login: (email: string, password: string) => string | null; // returns error or null
  signup: (data: SignupData) => string | null;
  logout: () => void;
  updateProfile: (data: Partial<Pick<VVUser, "firstName" | "lastName" | "phone">>) => void;
  updateAddress: (address: SavedAddress) => void;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const STORAGE_KEY = "vv_users";
const SESSION_KEY = "vv_session";

function hashPassword(email: string, password: string): string {
  return btoa(`${email}::${password}`);
}

function getUsers(): Record<string, VVUser> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, VVUser>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VVUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem(SESSION_KEY);
    if (email) {
      const users = getUsers();
      if (users[email]) setUser(users[email]);
    }
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string): string | null => {
    const users = getUsers();
    const found = users[email.toLowerCase()];
    if (!found) return "No account found with that email.";
    if (found.passwordHash !== hashPassword(email.toLowerCase(), password))
      return "Incorrect password.";
    localStorage.setItem(SESSION_KEY, email.toLowerCase());
    setUser(found);
    return null;
  }, []);

  const signup = useCallback((data: SignupData): string | null => {
    const users = getUsers();
    const key = data.email.toLowerCase();
    if (users[key]) return "An account with that email already exists.";
    const newUser: VVUser = {
      email: key,
      passwordHash: hashPassword(key, data.password),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: "",
      address: null,
      createdAt: new Date().toISOString(),
    };
    users[key] = newUser;
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, key);
    setUser(newUser);
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (data: Partial<Pick<VVUser, "firstName" | "lastName" | "phone">>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...data };
        const users = getUsers();
        users[prev.email] = updated;
        saveUsers(users);
        return updated;
      });
    },
    []
  );

  const updateAddress = useCallback((address: SavedAddress) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, address };
      const users = getUsers();
      users[prev.email] = updated;
      saveUsers(users);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, updateProfile, updateAddress }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
