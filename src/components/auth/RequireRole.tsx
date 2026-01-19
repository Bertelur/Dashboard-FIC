import { Navigate } from "react-router-dom";
import type { Role } from "@/features/role-management/models/rbac";
import { useAuth } from "@/features/auth/store/auth.store";
import { canViewRoleManagement } from "@/lib/utils";

export function RequireRoleManagement({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!user) return <Navigate to="/login" replace />;

    if (!canViewRoleManagement(user.role as Role)) return <Navigate to="/403" replace />;

    return <>{children}</>;
}
