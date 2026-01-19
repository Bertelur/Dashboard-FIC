import type { ColumnDef } from "@tanstack/react-table";
import type { Invoice } from "../models/invoice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/types/currency";

function fmtDate(iso?: string | null) {
    if (!iso) return "-";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
}

function statusVariant(status: string) {
    if (status === "paid") return "default";
    if (status === "pending") return "secondary";
    return "destructive";
}

export const invoiceColumns: ColumnDef<Invoice>[] = [
    {
        accessorKey: "paymentExternalId",
        header: "External ID",
        cell: ({ row }) => (
            <div className="font-mono text-xs break-all">{row.original.paymentExternalId}</div>
        ),
    },
    {
        id: "customer",
        header: "Customer",
        cell: ({ row }) => {
            const c = row.original.customer;
            const name = c?.givenNames ? `${c.givenNames}${c.surname ? ` ${c.surname}` : ""}` : "-";
            return (
                <div className="text-sm">
                    <div className="font-medium">{name}</div>
                    <div className="text-xs text-muted-foreground">{c?.email ?? "-"}</div>
                </div>
            );
        },
    },
    {
        accessorKey: "paymentMethod",
        header: "Method",
        cell: ({ row }) => <div className="text-xs">{row.original.paymentMethod ?? "-"}</div>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant={statusVariant(row.original.status)}>{row.original.status}</Badge>,
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => <div className="text-right">{formatIDR(row.original.amount)}</div>,
    },
    {
        accessorKey: "paidAt",
        header: "Paid At",
        cell: ({ row }) => <div className="text-xs">{fmtDate(row.original.paidAt ?? null)}</div>,
    },
    {
        id: "items",
        header: () => <div className="text-right">Items</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm">{row.original.items?.length ?? 0}</div>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const url = row.original.invoiceUrl;
            return (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!url}
                        onClick={() => url && window.open(url, "_blank")}
                    >
                        Open
                    </Button>
                </div>
            );
        },
    },
];
