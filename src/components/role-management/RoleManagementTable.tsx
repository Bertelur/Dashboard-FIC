import { useMemo, useState } from "react";
import type { Role } from "@/features/role-management/models/rbac";
import type { AppUser } from "@/features/role-management/models/rbac";
import { canManageTargetRole, manageableRoles } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAuth } from "@/features/auth/store/auth.store";

export function RoleManagementTable({ actorRole }: { actorRole: Role }) {
    const { user } = useAuth();
    const [users, setUsers] = useState<AppUser[]>([
        { id: "1", username: user?.username ?? "", role: "super-admin" },
    ]);

    const assignableRoles = useMemo(() => manageableRoles(actorRole), [actorRole]);

    function updateUserRole(userId: string, nextRole: Role) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u)));
    }

    async function onSave(user: AppUser) {
        if (!canManageTargetRole(actorRole, user.role)) {
            throw new Error("Not allowed to modify this role");
        }
    }

    async function onDelete(_user: AppUser) {
        if (actorRole !== "super-admin") {
            throw new Error("Only super-admin can delete users");
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {users.map((u) => {
                        const canEditThisUser = canManageTargetRole(actorRole, u.role);
                        const canDeleteThisUser = actorRole === "super-admin";

                        return (
                            <TableRow key={u.id}>
                                <TableCell className="font-medium">{u.username}</TableCell>

                                <TableCell>
                                    <Select
                                        value={u.role}
                                        disabled={!canEditThisUser}
                                        onValueChange={(value) => updateUserRole(u.id, value as Role)}
                                    >
                                        <SelectTrigger className="w-[160px]">
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(!assignableRoles.includes(u.role) ? [u.role] : [])
                                                .concat(assignableRoles)
                                                .filter((v, i, arr) => arr.indexOf(v) === i)
                                                .map((r) => (
                                                    <SelectItem key={r} value={r}>
                                                        {r}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>

                                    {!canEditThisUser && (
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            Anda tidak dapat mengubah role ini.
                                        </div>
                                    )}
                                </TableCell>

                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="disabled"
                                        size="sm"
                                        disabled={!canEditThisUser}
                                        onClick={() => onSave(u)}
                                    >
                                        Simpan
                                    </Button>

                                    <Button
                                        variant="disabled"
                                        size="sm"
                                        disabled={!canDeleteThisUser}
                                        onClick={() => onDelete(u)}
                                    >
                                        Hapus
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
