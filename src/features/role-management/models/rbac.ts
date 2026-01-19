export type Role = "super-admin" | "admin" | "staff" | "keuangan";

export type Permission =
    | "role_management:view"
    | "users:create"
    | "users:update"
    | "users:delete";

export type AppUser = {
    id: string;
    username: string;
    role: Role;
    type?: string;
    name?: string;
    email?: string;
};
