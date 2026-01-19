import { useMemo } from "react";
import type { InvoiceReportItem, InvoiceReportTotals } from "@/features/reports/models/invoiceReport";

export function useInvoiceReportView(args: { totals?: InvoiceReportTotals; items?: InvoiceReportItem[] }) {
    const items = args.items ?? [];

    return useMemo(() => {
        const topBySales = [...items].sort((a, b) => b.salesAmount - a.salesAmount).slice(0, 8);
        const topByQty = [...items].sort((a, b) => b.quantity - a.quantity).slice(0, 8);

        const salesBarData = topBySales.map((i) => ({
            name: i.sku ? `${i.name} (${i.sku})` : i.name,
            salesAmount: i.salesAmount,
        }));

        const qtyBarData = topByQty.map((i) => ({
            name: i.sku ? `${i.name} (${i.sku})` : i.name,
            quantity: i.quantity,
        }));

        const mixScatterData = items.map((i) => ({
            name: i.sku ? `${i.name} (${i.sku})` : i.name,
            salesAmount: i.salesAmount,
            quantity: i.quantity,
            ordersCount: i.ordersCount,
        }));

        return { topBySales, topByQty, salesBarData, qtyBarData, mixScatterData };
    }, [items]);
}
