import type { Role, Permission } from "@/features/role-management/models/rbac";

import type { InvoiceReportItem, InvoiceReportTotals } from "@/features/reports/models/invoiceReport";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  "super-admin": ["role_management:view", "users:create", "users:update", "users:delete"],
  staff: [],
};

const SUPER_ADMIN_MANAGEABLE_TARGETS: Role[] = ["staff"];

export function hasPermission(role: Role, perm: Permission) {
  return ROLE_PERMISSIONS[role]?.includes(perm) ?? false;
}

export function canViewRoleManagement(role: Role) {
  return hasPermission(role, "role_management:view");
}

export function canManageTargetRole(actorRole: Role, targetRole: Role) {
  if (actorRole === "super-admin") return SUPER_ADMIN_MANAGEABLE_TARGETS.includes(targetRole);
  return false;
}

export function manageableRoles(actorRole: Role): Role[] {
  if (actorRole === "super-admin") return [...SUPER_ADMIN_MANAGEABLE_TARGETS];
  return [];
}


export function buildQuery(params: Record<string, string | undefined>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === "string" && v.trim()) p.set(k, v.trim());
  }
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

function csvEscape(v: unknown) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

export function buildReportCsv(args: {
  fromIso: string;
  toIso: string;
  dateField: string;
  totals: InvoiceReportTotals;
  items: InvoiceReportItem[];
}) {
  const lines: string[] = [];

  lines.push(`Report Range,${csvEscape(args.fromIso)},${csvEscape(args.toIso)},${csvEscape(args.dateField)}`);
  lines.push("");

  lines.push("Totals");
  lines.push("ordersCount,totalSalesAmount,totalOrderItemsQty,avgUnitsPerOrder,avgSalesPerOrder,avgSalesPerItem");
  lines.push(
    [
      args.totals.ordersCount,
      args.totals.totalSalesAmount,
      args.totals.totalOrderItemsQty,
      args.totals.avgUnitsPerOrder,
      args.totals.avgSalesPerOrder,
      args.totals.avgSalesPerItem,
    ].map(csvEscape).join(",")
  );

  lines.push("");
  lines.push("Items");
  lines.push("productId,sku,name,ordersCount,quantity,salesAmount,avgUnitPrice");

  for (const it of args.items) {
    lines.push(
      [
        it.productId ?? "",
        it.sku ?? "",
        it.name,
        it.ordersCount,
        it.quantity,
        it.salesAmount,
        it.avgUnitPrice,
      ].map(csvEscape).join(",")
    );
  }

  return lines.join("\n");
}

export function downloadTextFile(filename: string, content: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
