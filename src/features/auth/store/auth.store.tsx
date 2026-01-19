import React, { createContext, useContext, useMemo, useState } from "react";
import type { AuthUser } from "@/lib/models/user";
import { storage } from "@/lib/api/storage";
import { loginApi } from "@/features/auth/service/auth.api";

type AuthState = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (args: { username: string; password: string }) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => storage.getUser() as unknown as AuthUser | null);

    const isAuthenticated = !!storage.getAccessToken() && !!user;

    async function login(args: { username: string; password: string }) {
        const data = await loginApi(args);
        if (!data.success) throw new Error(data.message || "Login failed");

        storage.setAccessToken(data.data.tokens.accessToken);
        storage.setRefreshToken(data.data.tokens.refreshToken);
        storage.setUser(data.data.user as AuthUser);
        setUser(data.data.user as AuthUser);
    }

    function logout() {
        storage.clear();
        setUser(null);
    }

    const value = useMemo<AuthState>(
        () => ({ user, isAuthenticated, login, logout }),
        [user, isAuthenticated]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
