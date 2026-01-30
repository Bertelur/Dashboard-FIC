import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/types/currency";
import { getStatusLabel, getStatusVariant } from "../utils/orderStatusTransitions";
import { OrderStatusActions } from "./OrderStatusActions";
import type { Order } from "../models/order";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface OrderDetailDialogProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userRole: string;
}

function fmtDate(iso?: string | null) {
    if (!iso) return "-";
    const d = new Date(iso);
    return isNaN(d.getTime())
        ? "-"
        : d.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
}

export function OrderDetailDialog({ order, open, onOpenChange, userRole }: OrderDetailDialogProps) {
    if (!order) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Order Details
                        <Badge variant={getStatusVariant(order.status)}>
                            {getStatusLabel(order.status)}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>Order ID: {order.id}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Customer ID</div>
                            <div className="font-mono text-sm">{order.userId}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Shipping Method</div>
                            <div className="text-sm capitalize">{order.shippingMethod}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Total Amount</div>
                            <div className="text-lg font-bold">{formatIDR(order.totalAmount)}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Created</div>
                            <div className="text-sm">{fmtDate(order.createdAt)}</div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <div>
                            <div className="text-sm font-medium mb-2">Shipping Address</div>
                            <div className="text-sm space-y-1 bg-muted p-3 rounded-md">
                                <div>{order.shippingAddress.street}</div>
                                <div>
                                    {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                                    {order.shippingAddress.postalCode}
                                </div>
                                <div>Phone: {order.shippingAddress.phone}</div>
                                {order.shippingAddress.additionalNotes && (
                                    <div className="text-muted-foreground">
                                        Notes: {order.shippingAddress.additionalNotes}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    <div>
                        <div className="text-sm font-medium mb-2">Order Items</div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {item.imageUrl && (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className="w-10 h-10 object-cover rounded"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium">{item.name}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-mono text-xs">{item.sku}</div>
                                        </TableCell>
                                        <TableCell className="text-right">{formatIDR(item.price)}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatIDR(item.totalPrice)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Order Logs */}
                    <div>
                        <div className="text-sm font-medium mb-2">Order History</div>
                        <div className="space-y-2">
                            {order.logs
                                .slice()
                                .reverse()
                                .map((log, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-2 bg-muted rounded-md">
                                        <Badge variant={getStatusVariant(log.status)} className="shrink-0">
                                            {getStatusLabel(log.status)}
                                        </Badge>
                                        <div className="flex-1 text-sm">
                                            <div className="font-medium">{fmtDate(log.timestamp)}</div>
                                            {log.note && (
                                                <div className="text-muted-foreground">{log.note}</div>
                                            )}
                                            {log.by && (
                                                <div className="text-xs text-muted-foreground">
                                                    By: {log.by}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Status Actions */}
                    <div>
                        <div className="text-sm font-medium mb-2">Update Status</div>
                        <OrderStatusActions order={order} userRole={userRole} onStatusUpdated={() => onOpenChange(false)} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
