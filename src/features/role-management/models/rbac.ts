export type Role = "super-admin" | "staff";

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
