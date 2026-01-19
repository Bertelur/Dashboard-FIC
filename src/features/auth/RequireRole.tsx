import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/store/auth.store";

type Role = "super-admin" | "admin" | "staff" | "keuangan";

export function RequireRole(props: { allowed: Role[] }) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }

    const role = user?.role as Role | undefined;

    if (!role) {
        return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }

    if (!props.allowed.includes(role)) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <Outlet />;
}
