import type { InvoiceReportTotals } from "@/features/reports/models/invoiceReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR } from "@/lib/types/currency";
import { formatNumber } from "@/lib/types/number";

export function ReportKpiCards({ totals }: { totals: InvoiceReportTotals }) {
    const cards = [
        { label: "Orders", value: formatNumber(totals.ordersCount) },
        { label: "Units Sold", value: formatNumber(totals.totalOrderItemsQty) },
        { label: "Total Sales", value: formatIDR(totals.totalSalesAmount) },
        { label: "Avg Units/Order", value: formatNumber(totals.avgUnitsPerOrder) },
        { label: "Avg Sales/Order", value: formatIDR(totals.avgSalesPerOrder) },
        { label: "Avg Sales/Item", value: formatIDR(totals.avgSalesPerItem) },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {cards.map((c) => (
                <Card key={c.label}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">{c.value}</CardContent>
                </Card>
            ))}
        </div>
    );
}
