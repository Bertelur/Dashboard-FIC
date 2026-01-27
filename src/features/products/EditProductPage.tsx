import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getDetailedProduct, updateProduct, type CreateProductInput } from "./services/products.service";
// import type { Product } from "./models/product";
import TableSkeleton from "./ProductSkeleton";

export function EditProductPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const qc = useQueryClient();

    const [form, setForm] = useState<CreateProductInput>({
        name: "",
        description: "",
        sku: "",
        category: "",
        price: 0,
        stock: 0,
        status: "active",
        imageUrl: "",
        imageType: "url",
    });

    const { data: product, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getDetailedProduct(id!),
        enabled: !!id,
    });

    useEffect(() => {
        if (product?.data) {
            setForm({
                name: product.data.name ?? "",
                description: product.data.description ?? "",
                sku: product.data.sku ?? "",
                category: product.data.category ?? "",
                price: Number(product.data.price ?? 0),
                stock: Number(product.data.stock ?? 0),
                status: product.data.status ?? "active",
                imageUrl: product.data.imageUrl ?? "",
                imageType: product.data.imageType ?? "url",
            });
        }
    }, [product]);

    const updateM = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: any }) => updateProduct(id, payload),
        onSuccess: () => {
            toast.success("Product updated");
            qc.invalidateQueries({ queryKey: ["products"] });
            qc.invalidateQueries({ queryKey: ["product", id] });
            navigate("/products");
        },
        onError: (e: any) => toast.error(e?.message ?? "Failed to update product"),
    });

    function onSubmitProduct() {
        if (!form.name.trim()) return toast.error("Name is required");
        if (!form.sku.trim()) return toast.error("SKU is required");

        if (id) {
            updateM.mutate({ id, payload: form });
        }
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Edit Produk</CardTitle>
                </CardHeader>
                <CardContent>
                    <TableSkeleton />
                </CardContent>
            </Card>
        );
    }

    if (!product?.data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Product not found</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => navigate("/products")}>Back to Products</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate("/products")}
                        aria-label="Back to products"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <CardTitle className="text-2xl font-bold">Edit Produk</CardTitle>
                        <CardDescription>Edit produk yang ada</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <div className="text-sm">Nama</div>
                        <Input
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="text-sm">Kode Produk</div>
                        <Input
                            value={form.sku}
                            onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                        />
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
                        <Input
                            value={form.category}
                            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                        />
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
                        <div className="text-sm">URL Gambar (optional)</div>
                        <Input
                            value={form.imageUrl ?? ""}
                            onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                        />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="gap-2">
                <Button variant="outline" onClick={() => navigate("/products")}>
                    Batal
                </Button>
                <Button
                    onClick={onSubmitProduct}
                    disabled={updateM.isPending}
                >
                    {updateM.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
            </CardFooter>
        </Card>
    );
}
