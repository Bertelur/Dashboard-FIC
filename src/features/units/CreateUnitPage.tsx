import {
    Card,
    CardTitle,
    CardFooter,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { createUnit } from "./services/units.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function CreateUnitPage() {
    const qc = useQueryClient();
    const navigate = useNavigate();
    const [unitName, setUnitName] = useState("");

    const createM = useMutation({
        mutationFn: createUnit,
        onSuccess: (_res) => {
            toast.success("Satuan berhasil ditambahkan");
            qc.invalidateQueries({ queryKey: ["units"] });
            navigate("/products");
        },
        onError: (e: any) => toast.error(e?.message ?? "Gagal menambahkan satuan"),
    });

    function onSubmitUnit() {
        if (!unitName.trim()) {
            return toast.error("Nama satuan wajib diisi");
        }
        createM.mutate(unitName.trim());
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
                        <CardTitle className="text-2xl font-bold">Tambahkan Satuan</CardTitle>
                        <CardDescription>Tambahkan satuan baru (cth: kg, ton)</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-1">
                    <div className="text-sm">Nama Satuan</div>
                    <Input
                        value={unitName}
                        onChange={(e) => setUnitName(e.target.value)}
                        placeholder="cth: kg, ton, ikat"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onSubmitUnit();
                            }
                        }}
                    />
                </div>
            </CardContent>

            <CardFooter className="gap-2">
                <Button variant="outline" onClick={() => navigate("/products")}>
                    Batal
                </Button>
                <Button
                    onClick={onSubmitUnit}
                    disabled={createM.isPending}
                >
                    {createM.isPending ? "Menambahkan..." : "Tambahkan"}
                </Button>
            </CardFooter>
        </Card>
    );
}
