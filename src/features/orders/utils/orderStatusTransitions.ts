import type { OrderStatus, ShippingMethod } from "../models/order";

export type StatusOption = {
    value: OrderStatus;
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
};

export function getValidNextStatuses(
    currentStatus: OrderStatus,
    shippingMethod: ShippingMethod,
    role: string
): StatusOption[] {
    const options: StatusOption[] = [];

    // Buyer role transitions
    if (role === "buyer") {
        if (currentStatus === "shipped") {
            options.push({ value: "delivered", label: "Mark as Delivered" });
        }
        if (currentStatus === "pending") {
            options.push({ value: "cancelled", label: "Cancel Order", variant: "destructive" });
        }
        return options;
    }

    // Admin/Staff role transitions
    if (currentStatus === "pending") {
        options.push({ value: "processing", label: "Mark as Processing" });
        options.push({ value: "cancelled", label: "Cancel Order", variant: "destructive" });
    }

    if (currentStatus === "processing") {
        if (shippingMethod === "shipping") {
            options.push({ value: "shipped", label: "Mark as Shipped" });
        } else {
            // pickup
            options.push({ value: "ready_for_pickup", label: "Mark as Ready for Pickup" });
        }
        options.push({ value: "cancelled", label: "Cancel Order", variant: "destructive" });
    }

    if (currentStatus === "shipped") {
        options.push({ value: "delivered", label: "Mark as Delivered" });
    }

    if (currentStatus === "delivered") {
        options.push({ value: "completed", label: "Mark as Completed" });
    }

    if (currentStatus === "ready_for_pickup") {
        options.push({ value: "completed", label: "Mark as Completed" });
    }

    return options;
}

export function getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
        pending: "Pending",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered",
        ready_for_pickup: "Ready for Pickup",
        completed: "Completed",
        cancelled: "Cancelled",
    };
    return labels[status] || status;
}

export function getStatusVariant(status: OrderStatus): "default" | "secondary" | "destructive" {
    if (status === "completed") return "default";
    if (status === "cancelled") return "destructive";
    if (status === "pending") return "secondary";
    return "default";
}
