import { useQuery } from "@tanstack/react-query";
import type { InvoiceReportQueryParams } from "@/features/reports/models/invoiceReport";
import { getInvoiceReport } from "@/features/reports/services/invoiceReport.service";

export function useInvoiceReportQuery(params: InvoiceReportQueryParams) {
    return useQuery({
        queryKey: ["invoice-report", params],
        queryFn: () => getInvoiceReport(params),
        staleTime: 30_000,
    });
}
