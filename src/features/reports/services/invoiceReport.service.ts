import type { InvoiceReportQueryParams, InvoiceReportResponse } from "../models/invoiceReport";
import { buildQuery } from "@/lib/utils";
import { storage } from "@/lib/api/storage";
const BASE_URL = import.meta.env.VITE_PUBLIC_API;

function authHeaders() {
    const token = storage.getAccessToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function getInvoiceReport(params: InvoiceReportQueryParams): Promise<InvoiceReportResponse> {
    const qs = buildQuery({ from: params.from, to: params.to, dateField: params.dateField });
    const res = await fetch(`${BASE_URL}/invoices/report${qs}`, { headers: authHeaders() });

    const text = await res.text();
    if (!res.ok) throw new Error(`GET /invoices/report failed (${res.status}): ${text.slice(0, 200)}`);
    return JSON.parse(text) as InvoiceReportResponse;
}
