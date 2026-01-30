import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { updateOrderStatus } from "../services/orders.service";
import { getValidNextStatuses, type StatusOption } from "../utils/orderStatusTransitions";
import type { Order } from "../models/order";

interface OrderStatusActionsProps {
    order: Order;
    userRole: string;
    onStatusUpdated?: () => void;
}

export function OrderStatusActions({ order, userRole, onStatusUpdated }: OrderStatusActionsProps) {
    const qc = useQueryClient();
    const [confirmStatus, setConfirmStatus] = useState<StatusOption | null>(null);

    const updateM = useMutation({
        mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
            updateOrderStatus(id, { status: status as any, note }),
        onSuccess: () => {
            toast.success("Order status updated");
            qc.invalidateQueries({ queryKey: ["orders"] });
            qc.invalidateQueries({ queryKey: ["order", order.id] });
            setConfirmStatus(null);
            onStatusUpdated?.();
        },
        onError: (e: any) => toast.error(e?.message ?? "Failed to update order status"),
    });

    const validStatuses = getValidNextStatuses(order.status, order.shippingMethod, userRole);

    if (validStatuses.length === 0) {
        return null;
    }

    function handleStatusClick(statusOption: StatusOption) {
        // Show confirmation for destructive actions
        if (statusOption.variant === "destructive") {
            setConfirmStatus(statusOption);
        } else {
            // For "processing" from "pending", add note for manual transfer
            const note =
                order.status === "pending" && statusOption.value === "processing"
                    ? "Payment received via manual transfer"
                    : undefined;
            updateM.mutate({ id: order.id, status: statusOption.value, note });
        }
    }

    function handleConfirm() {
        if (!confirmStatus) return;
        const note =
            order.status === "pending" && confirmStatus.value === "processing"
                ? "Payment received via manual transfer"
                : undefined;
        updateM.mutate({ id: order.id, status: confirmStatus.value, note });
    }

    return (
        <>
            <div className="flex flex-wrap gap-2">
                {validStatuses.map((statusOption) => (
                    <Button
                        key={statusOption.value}
                        variant={statusOption.variant || "outline"}
                        size="sm"
                        onClick={() => handleStatusClick(statusOption)}
                        disabled={updateM.isPending}
                    >
                        {statusOption.label}
                    </Button>
                ))}
            </div>

            <AlertDialog open={!!confirmStatus} onOpenChange={(open) => !open && setConfirmStatus(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to {confirmStatus?.label.toLowerCase()}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={updateM.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            disabled={updateM.isPending}
                            className={confirmStatus?.variant === "destructive" ? "bg-destructive" : ""}
                        >
                            {updateM.isPending ? "Updating..." : "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
