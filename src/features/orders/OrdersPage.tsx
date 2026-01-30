import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import { DataTable } from "@/components/data-table/data-table";
import { createOrderColumns } from "./components/order-columns";
import { getOrders } from "./services/orders.service";
import { OrderDetailDialog } from "./components/OrderDetailDialog";
import { useAuth } from "@/features/auth/store/auth.store";
import type { Order, OrderStatus } from "./models/order";

const ORDER_STATUSES: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "ready_for_pickup",
    "completed",
    "cancelled",
];

export function OrdersPage() {
    const { user } = useAuth();
    const userRole = user?.role || "staff";

    const [filters, setFilters] = useState({
        search: "",
        status: "",
    });

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const t = window.setTimeout(() => setDebouncedSearch(filters.search), 350);
        return () => window.clearTimeout(t);
    }, [filters.search]);

    const effectiveFilters = useMemo(
        () => ({
            ...(filters.status ? { status: filters.status as OrderStatus } : {}),
            ...(debouncedSearch.trim() ? { userId: debouncedSearch.trim() } : {}),
        }),
        [filters.status, debouncedSearch]
    );

    const q = useQuery({
        queryKey: ["orders", effectiveFilters],
        queryFn: () => getOrders(effectiveFilters),
        placeholderData: (prev) => prev,
        staleTime: 30_000,
    });

    const orders = q.data?.data ?? [];

    const filteredOrders = useMemo(() => {
        if (!debouncedSearch.trim()) return orders;

        const search = debouncedSearch.trim().toLowerCase();
        return orders.filter((order) => {
            return (
                order.id.toLowerCase().includes(search) ||
                order.userId.toLowerCase().includes(search) ||
                order.items.some((item) => item.name.toLowerCase().includes(search))
            );
        });
    }, [orders, debouncedSearch]);

    const handleViewOrder = useCallback((order: Order) => {
        setSelectedOrder(order);
        setDetailOpen(true);
    }, []);

    const columns = useMemo(() => createOrderColumns(userRole, handleViewOrder), [userRole, handleViewOrder]);

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl font-bold">Orders</CardTitle>
                        <CardDescription>Manage and track order status</CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* FILTERS */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                        <div className="md:col-span-6">
                            <Input
                                placeholder="Search by Order ID, Customer ID, or product name..."
                                value={filters.search}
                                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                            />
                        </div>

                        <div className="md:col-span-3">
                            <Select
                                value={filters.status || "all"}
                                onValueChange={(v) =>
                                    setFilters((p) => ({ ...p, status: v === "all" ? "" : v }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status</SelectLabel>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        {ORDER_STATUSES.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ACTIVE FILTER PILLS */}
                    {(filters.search.trim() || filters.status) && (
                        <div className="flex flex-wrap items-center gap-2">
                            {filters.search.trim() && (
                                <Badge variant="secondary" className="gap-1 pr-1">
                                    <span>Search: "{filters.search.trim()}"</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5"
                                        onClick={() => setFilters((p) => ({ ...p, search: "" }))}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}

                            {filters.status && (
                                <Badge variant="secondary" className="gap-1 pr-1">
                                    <span>Status: {filters.status}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5"
                                        onClick={() => setFilters((p) => ({ ...p, status: "" }))}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7"
                                onClick={() => setFilters({ search: "", status: "" })}
                            >
                                Clear all
                            </Button>
                        </div>
                    )}

                    {/* TABLE */}
                    {q.isLoading ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : (
                        <DataTable columns={columns} data={filteredOrders} />
                    )}

                    {/* footer info */}
                    {!!q.data && (
                        <div className="text-xs text-muted-foreground">
                            Total: {q.data.data.length} orders
                        </div>
                    )}
                </CardContent>
            </Card>

            <OrderDetailDialog
                order={selectedOrder}
                open={detailOpen}
                onOpenChange={setDetailOpen}
                userRole={userRole}
            />
        </>
    );
}
