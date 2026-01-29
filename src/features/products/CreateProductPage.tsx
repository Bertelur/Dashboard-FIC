import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
import { createProduct, type CreateProductInput } from "./services/products.service";
import { getUnits } from "../units/services/units.service";

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
    unitId: "",
};

export function CreateProductPage() {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [form, setForm] = useState<CreateProductInput>(emptyForm);

    const { data: unitsData, isLoading: unitsLoading } = useQuery({
        queryKey: ["units"],
        queryFn: getUnits,
        staleTime: 30_000,
        placeholderData: (prev) => prev,
    });

    const createM = useMutation({
        mutationFn: createProduct,
        onSuccess: (_res) => {
            toast.success("Product created");
            qc.invalidateQueries({ queryKey: ["products"] });
            navigate("/products");
        },
        onError: (e: any) => toast.error(e?.message ?? "Failed to create product"),
    });

    function onSubmitProduct() {
        if (!form.name.trim()) return toast.error("Name is required");
        if (!form.sku.trim()) return toast.error("SKU is required");

        createM.mutate(form);
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
                        <CardTitle className="text-2xl font-bold">Tambah Produk</CardTitle>
                        <CardDescription>Buat produk baru</CardDescription>
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

                    {/* Satuan Produk */}
                    <div className="space-y-1">
                        <div className="text-sm">Satuan Produk</div>
                        <Select
                            value={form.unitId ?? ""}
                            onValueChange={(v) => {
                                if (v === "__create_unit__") {
                                    navigate("/products/units/new");
                                } else {
                                    setForm((p) => ({ ...p, unitId: v }));
                                }
                            }}
                            disabled={unitsLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={unitsLoading ? "Memuat..." : "Pilih satuan"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Satuan Produk</SelectLabel>
                                    {!unitsData?.data || unitsData.data.length === 0 ? (
                                        <SelectItem value="__create_unit__">
                                            Tambahkan satuan (cth: kg, ton)
                                        </SelectItem>
                                    ) : (
                                        unitsData.data.map((unit) => (
                                            <SelectItem key={unit._id} value={unit._id}>
                                                {unit.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
                    disabled={createM.isPending}
                >
                    {createM.isPending ? "Membuat..." : "Buat"}
                </Button>
            </CardFooter>
        </Card>
    );
}
