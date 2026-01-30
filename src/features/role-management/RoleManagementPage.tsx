import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/features/auth/store/auth.store";
import type { Role } from "@/features/role-management/models/rbac";
import { RoleManagementTable } from "@/components/role-management/RoleManagementTable";

export function RoleManagementPage() {
    const { user } = useAuth();
    const actorRole = (user?.role ?? "staff") as Role;

    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle className="text-2xl font-bold">Akun Pengguna</CardTitle>
                    <CardDescription>Hanya Super Admin yang dapat mengelola role (menetapkan role staff). <span className="text-red-500">Disclaimer: Saat ini fitur belum bisa dipakai karena belum tersedia.</span></CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <RoleManagementTable actorRole={actorRole} />
            </CardContent>
        </Card>
    );
}
