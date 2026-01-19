export const UserRole = ["super-admin", "admin", "staff", "keuangan"] as const;
export type UserRole = (typeof UserRole)[number];

export type AuthUser = {
    id: string;
    username: string;
    role: (typeof UserRole)[number];
    type: "dashboard";
};

export type LoginResponse = {
    success: boolean;
    message: string;
    data: {
        user: AuthUser;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    };
};