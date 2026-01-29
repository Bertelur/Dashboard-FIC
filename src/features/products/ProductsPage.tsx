import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { formatIDR } from "@/lib/types/currency";
import { deleteProduct, getProducts } from "./services/products.service";
import { Badge } from "@/components/ui/badge";
import TableSkeleton from "./ProductSkeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function ProductsPage() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        category: "",
    });

    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
        const t = window.setTimeout(
            () => setDebouncedSearch(filters.search),
            350
        );
        return () => window.clearTimeout(t);
    }, [filters.search]);

    const effectiveFilters = useMemo(
        () => ({ ...filters, search: debouncedSearch }),
        [filters, debouncedSearch]
    );

    const q = useQuery({
        queryKey: ["products", effectiveFilters],
        queryFn: () => getProducts(effectiveFilters),
        placeholderData: (prev) => prev,
        staleTime: 30_000,
    });

    const allProducts = q.data?.data ?? [];

    const categories = useMemo(() => {
        const set = new Set<string>();
        for (const p of allProducts) if (p.category) set.add(p.category);
        return Array.from(set).sort();
    }, [allProducts]);

    const filteredProducts = useMemo(() => {
        const s = debouncedSearch.trim().toLowerCase();

        return allProducts.filter((p) => {
            const matchesSearch =
                !s ||
                p.name.toLowerCase().includes(s) ||
                p.sku.toLowerCase().includes(s) ||
                p.description.toLowerCase().includes(s);

            const matchesStatus = !filters.status || p.status === filters.status;
            const matchesCategory = !filters.category || p.category === filters.category;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [allProducts, debouncedSearch, filters.status, filters.category]);

    const statusLabel = (s: string) => {
        if (s === "active") return "Aktif";
        if (s === "inactive") return "Tidak Aktif";
        if (s === "archived") return "Diarsipkan";
        return s;
    };

    const qc = useQueryClient();

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const deleteM = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            toast.success("Product deleted");
            setDeleteId(null);
            qc.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (e: any) => toast.error(e?.message ?? "Failed to delete product"),
    });


    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                    <CardTitle className="text-2xl font-bold">Produk</CardTitle>
                    <CardDescription>Daftar produk yang tersedia</CardDescription>
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/products/units/new")}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambahkan satuan (cth: kg, ton)
                    </Button>
                    <Button onClick={() => navigate("/products/new")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Produk
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* FILTERS */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                    <div className="md:col-span-6">
                        <Input
                            type="text"
                            placeholder="Cari produk, SKU, atau deskripsi..."
                            value={filters.search}
                            onChange={(e) =>
                                setFilters((p) => ({ ...p, search: e.target.value }))
                            }
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Select
                            value={filters.status || "all"}
                            onValueChange={(value) =>
                                setFilters((p) => ({ ...p, status: value === "all" ? "" : value }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                    <SelectItem value="archived">Diarsipkan</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-3">
                        <Select
                            value={filters.category || "all"}
                            onValueChange={(value) =>
                                setFilters((p) => ({ ...p, category: value === "all" ? "" : value }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Kategori</SelectLabel>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* ACTIVE FILTER PILLS */}
                {(filters.search.trim() || filters.status || filters.category) && (
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
                                    aria-label="Remove search filter"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}

                        {filters.status && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                <span>Status: {statusLabel(filters.status)}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => setFilters((p) => ({ ...p, status: "" }))}
                                    aria-label="Remove status filter"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}

                        {filters.category && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                <span>Category: {filters.category}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => setFilters((p) => ({ ...p, category: "" }))}
                                    aria-label="Remove category filter"
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
                            onClick={() => setFilters({ search: "", status: "", category: "" })}
                        >
                            Clear all
                        </Button>
                    </div>
                )}


                {/* TABLE or SKELETON */}
                {q.isLoading ? (
                    <TableSkeleton />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell>{p.sku}</TableCell>
                                    <TableCell>{p.category}</TableCell>
                                    <TableCell className="text-right">{formatIDR(p.price)}</TableCell>
                                    <TableCell className="text-right">{p.stock}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                p.status === "active"
                                                    ? "default"
                                                    : p.status === "inactive"
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                        >
                                            {p.status}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => navigate(`/products/${p.id}/edit`)}>
                                                Edit
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => setDeleteId(p.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        {filteredProducts.length === 0 && (
                            <TableCaption>No products found.</TableCaption>
                        )}
                    </Table>
                )}

                <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus produk?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Aksi ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleteM.isPending}>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteId && deleteM.mutate(deleteId)}
                                disabled={deleteM.isPending}
                            >
                                {deleteM.isPending ? "Menghapus..." : "Hapus"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </CardContent>
        </Card>
    );
}
