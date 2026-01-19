import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { X, Download } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import { DataTable } from "@/components/data-table/data-table";
import { invoiceColumns } from "./components/invoice-columns";
import { exportMyInvoices, getInvoices } from "./services/invoices.service";

function todayYMD() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export function InvoicesPage() {
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        paymentMethod: "",
        from: "",
        to: "",
    });

    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const t = window.setTimeout(() => setDebouncedSearch(filters.search), 350);
        return () => window.clearTimeout(t);
    }, [filters.search]);

    const effectiveFilters = useMemo(
        () => ({ ...filters, search: debouncedSearch }),
        [filters, debouncedSearch]
    );

    const q = useQuery({
        queryKey: ["invoices", effectiveFilters],
        queryFn: () => getInvoices(effectiveFilters),
        placeholderData: (prev) => prev,
        staleTime: 30_000,
    });

    const invoices = q.data?.data ?? [];

    const paymentMethods = useMemo(() => {
        const s = new Set<string>();
        for (const inv of invoices) if (inv.paymentMethod) s.add(inv.paymentMethod);
        return Array.from(s).sort();
    }, [invoices]);

    const statuses = useMemo(() => {
        const s = new Set<string>();
        for (const inv of invoices) if (inv.status) s.add(inv.status);
        return Array.from(s).sort();
    }, [invoices]);

    async function onExport() {
        const from = filters.from;
        const to = filters.to;

        if (!from || !to) return toast.error("Please set From and To dates");
        if (from > to) return toast.error("From must be <= To");

        try {
            const blob = await exportMyInvoices({ from, to });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `invoices-${from}-to-${to}.csv`; // adjust extension if server returns xlsx
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            toast.success("Export started");
        } catch (e: any) {
            toast.error(e?.message ?? "Export failed");
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                    <CardTitle className="text-2xl font-bold">Invoices</CardTitle>
                    <CardDescription>Daftar invoice dan status pembayaran</CardDescription>
                </div>

                <Button variant="outline" onClick={onExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* FILTERS */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                    <div className="md:col-span-4">
                        <Input
                            placeholder="Cari external id / customer email..."
                            value={filters.search}
                            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Select
                            value={filters.status || "all"}
                            onValueChange={(v) => setFilters((p) => ({ ...p, status: v === "all" ? "" : v }))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="all">All</SelectItem>
                                    {statuses.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-3">
                        <Select
                            value={filters.paymentMethod || "all"}
                            onValueChange={(v) =>
                                setFilters((p) => ({ ...p, paymentMethod: v === "all" ? "" : v }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Method</SelectLabel>
                                    <SelectItem value="all">All</SelectItem>
                                    {paymentMethods.map((m) => (
                                        <SelectItem key={m} value={m}>
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-3 grid grid-cols-2 gap-2">
                        <Input
                            type="date"
                            value={filters.from}
                            onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))}
                        />
                        <Input
                            type="date"
                            value={filters.to}
                            onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))}
                        />
                    </div>
                </div>

                {/* ACTIVE FILTER PILLS */}
                {(filters.search.trim() || filters.status || filters.paymentMethod || filters.from || filters.to) && (
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

                        {filters.paymentMethod && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                <span>Method: {filters.paymentMethod}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => setFilters((p) => ({ ...p, paymentMethod: "" }))}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}

                        {filters.from && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                <span>From: {filters.from}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => setFilters((p) => ({ ...p, from: "" }))}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}

                        {filters.to && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                <span>To: {filters.to}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => setFilters((p) => ({ ...p, to: "" }))}
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
                            onClick={() =>
                                setFilters({
                                    search: "",
                                    status: "",
                                    paymentMethod: "",
                                    from: "",
                                    to: "",
                                })
                            }
                        >
                            Clear all
                        </Button>

                        {/* quick set "today" if you want */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7"
                            onClick={() => setFilters((p) => ({ ...p, from: todayYMD(), to: todayYMD() }))}
                        >
                            Today
                        </Button>
                    </div>
                )}

                {/* TABLE */}
                {q.isLoading ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                ) : (
                    <DataTable columns={invoiceColumns} data={invoices} />
                )}

                {/* footer info */}
                {!!q.data && (
                    <div className="text-xs text-muted-foreground">
                        Total: {q.data.total} • Showing: {invoices.length} • Limit: {q.data.limit} • Skip: {q.data.skip}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
