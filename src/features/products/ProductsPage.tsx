import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { createProduct, deleteProduct, getProducts, updateProduct, type CreateProductInput } from "./services/products.service";
import { Badge } from "@/components/ui/badge";
import TableSkeleton from "./ProductSkeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { Product } from "./models/product";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function ProductsPage() {
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

    const [openForm, setOpenForm] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [editing, setEditing] = useState<Product | null>(null);

    const emptyForm: CreateProductInput = {
        name: "",
        description: "",
        sku: "",
        category: "",
        price: 0,
        stock: 0,
        status: "active",
        imageUrl: "",
        imageType: "url",
    };

    const [form, setForm] = useState<CreateProductInput>(emptyForm);

    const [deleteId, setDeleteId] = useState<string | null>(null);

    function openCreate() {
        setMode("create");
        setEditing(null);
        setForm(emptyForm);
        setOpenForm(true);
    }

    function openEdit(p: Product) {
        setMode("edit");
        setEditing(p);
        setForm({
            name: p.name ?? "",
            description: p.description ?? "",
            sku: p.sku ?? "",
            category: p.category ?? "",
            price: Number(p.price ?? 0),
            stock: Number(p.stock ?? 0),
            status: p.status ?? "active",
            imageUrl: p.imageUrl ?? "",
            imageType: p.imageType ?? "url",
        });
        setOpenForm(true);
    }

    const createM = useMutation({
        mutationFn: createProduct,
        onSuccess: (_res) => {
            toast.success("Product created");
            setOpenForm(false);
            qc.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (e: any) => toast.error(e?.message ?? "Failed to create product"),
    });

    const updateM = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: any }) => updateProduct(id, payload),
        onSuccess: () => {
            toast.success("Product updated");
            setOpenForm(false);
            qc.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (e: any) => toast.error(e?.message ?? "Failed to update product"),
    });

    const deleteM = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            toast.success("Product deleted");
            setDeleteId(null);
            qc.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (e: any) => toast.error(e?.message ?? "Failed to delete product"),
    });

    function onSubmitProduct() {
        if (!form.name.trim()) return toast.error("Name is required");
        if (!form.sku.trim()) return toast.error("SKU is required");

        if (mode === "create") {
            createM.mutate(form);
            return;
        }

        if (mode === "edit" && editing?.id) {
            updateM.mutate({ id: editing.id, payload: form });
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                    <CardTitle className="text-2xl font-bold">Produk</CardTitle>
                    <CardDescription>Daftar produk yang tersedia</CardDescription>
                </div>

                <Button onClick={openCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Produk
                </Button>
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
                                            <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
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

                <Dialog open={openForm} onOpenChange={setOpenForm}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{mode === "create" ? "Tambah Produk" : "Edit Produk"}</DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <div className="text-sm">Nama</div>
                                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm">Kode Produk</div>
                                <Input value={form.sku} onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))} />
                            </div>

                            <div className="space-y-1 md:col-span-2">
                                <div className="text-sm">Deskripsi</div>
                                <Input
                                    value={form.description}
                                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm">Kategori</div>
                                <Input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm">Status Produk</div>
                                <Select
                                    value={form.status}
                                    onValueChange={(v) => setForm((p) => ({ ...p, status: v as any }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status Produk</SelectLabel>
                                            <SelectItem value="active">Aktif</SelectItem>
                                            <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                            <SelectItem value="archived">Diarsipkan</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm">Harga</div>
                                <Input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm">Stok</div>
                                <Input
                                    type="number"
                                    value={form.stock}
                                    onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                                />
                            </div>

                            <div className="space-y-1 md:col-span-2">
                                {/* upload gambar produk */}
                                <div className="text-sm">URL Gambar (optional)</div>
                                <Input
                                    value={form.imageUrl ?? ""}
                                    onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setOpenForm(false)}>
                                Batal
                            </Button>
                            <Button
                                onClick={onSubmitProduct}
                                disabled={createM.isPending || updateM.isPending}
                            >
                                {mode === "create"
                                    ? createM.isPending ? "Membuat..." : "Buat"
                                    : updateM.isPending ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
