import type { ColumnDef } from "@tanstack/react-table";
import type { Order } from "../models/order";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/types/currency";
import { getStatusLabel, getStatusVariant } from "../utils/orderStatusTransitions";
import { OrderStatusActions } from "./OrderStatusActions";

function fmtDate(iso?: string | null) {
    if (!iso) return "-";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function createOrderColumns(
    userRole: string,
    onViewOrder?: (order: Order) => void
): ColumnDef<Order>[] {
    return [
        {
            accessorKey: "id",
            header: "Order ID",
            cell: ({ row }) => (
                <div className="font-mono text-xs break-all">{row.original.id}</div>
            ),
        },
        {
            accessorKey: "userId",
            header: "Customer ID",
            cell: ({ row }) => (
                <div className="font-mono text-xs">{row.original.userId}</div>
            ),
        },
        {
            id: "items",
            header: "Items",
            cell: ({ row }) => (
                <div className="text-sm">
                    <div className="font-medium">{row.original.items.length} item(s)</div>
                    <div className="text-xs text-muted-foreground">
                        {row.original.items.slice(0, 2).map((item) => item.name).join(", ")}
                        {row.original.items.length > 2 && "..."}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "totalAmount",
            header: () => <div className="text-right">Total Amount</div>,
            cell: ({ row }) => (
                <div className="text-right font-medium">{formatIDR(row.original.totalAmount)}</div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={getStatusVariant(row.original.status)}>
                    {getStatusLabel(row.original.status)}
                </Badge>
            ),
        },
        {
            accessorKey: "shippingMethod",
            header: "Method",
            cell: ({ row }) => (
                <div className="text-xs capitalize">{row.original.shippingMethod}</div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => <div className="text-xs">{fmtDate(row.original.createdAt)}</div>,
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <div className="flex flex-col items-end gap-2">
                    {onViewOrder && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewOrder(row.original)}
                        >
                            View Details
                        </Button>
                    )}
                    <OrderStatusActions
                        order={row.original}
                        userRole={userRole}
                    />
                </div>
            ),
        },
    ];
}
