import { http } from "@/lib/api/http";
import type { Invoice } from "../models/invoice";
import { storage } from "@/lib/api/storage";

export type GetInvoicesParams = {
    search?: string;
    status?: string;
    paymentMethod?: string;
    from?: string; // YYYY-MM-DD
    to?: string;   // YYYY-MM-DD
};

export type InvoicesResponse = {
    success: boolean;
    data: Invoice[];
    total: number;
    limit: number;
    skip: number;
};

export async function getInvoices(params: GetInvoicesParams) {
    const res = await http.get<InvoicesResponse>("invoices", { params });
    return res.data;
}

export async function exportMyInvoices(params: { from: string; to: string }) {
    const token = storage.getAccessToken();
    // If API returns a file (csv/xlsx), you likely want blob:
    const res = await http.get("invoices/my/export", {
        params,
        responseType: "blob",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data as Blob;
}
