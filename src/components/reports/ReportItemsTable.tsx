import type { InvoiceReportItem } from "@/features/reports/models/invoiceReport";
import { formatIDR } from "@/lib/types/currency";
import { formatNumber } from "@/lib/types/number";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ReportItemsTable({ items }: { items: InvoiceReportItem[] }) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Orders</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Sales</TableHead>
                        <TableHead className="text-right">Avg Unit Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((i, idx) => (
                        <TableRow key={`${i.productId ?? "na"}-${idx}`}>
                            <TableCell className="font-medium">{i.name}</TableCell>
                            <TableCell>{i.sku ?? "-"}</TableCell>
                            <TableCell className="text-right">{formatNumber(i.ordersCount)}</TableCell>
                            <TableCell className="text-right">{formatNumber(i.quantity)}</TableCell>
                            <TableCell className="text-right">{formatIDR(i.salesAmount)}</TableCell>
                            <TableCell className="text-right">{formatIDR(i.avgUnitPrice)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
