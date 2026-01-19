import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoiceReportFiltersStore } from "@/features/reports/store/invoiceReportFilters.store";
import { useInvoiceReportQuery } from "@/lib/hooks/useInvoiceReportQuery";
import { useInvoiceReportView } from "@/lib/hooks/useInvoiceReportView";

import { ReportKpiCards } from "@/components/reports/ReportKpiCards";
import { ReportCharts } from "@/components/reports/ReportCharts";
import { ReportItemsTable } from "@/components/reports/ReportItemsTable";
import { ReportExportButtons } from "@/components/reports/ReportExportButtons";
import type { ReportDateField } from "@/features/reports/models/invoiceReport";

function ReportFiltersBar(props: {
    from: string;
    to: string;
    dateField: ReportDateField;
    onFrom: (v: string) => void;
    onTo: (v: string) => void;
    onDateField: (v: ReportDateField) => void;
}) {
    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-4">
                <label className="mb-1 block text-xs text-muted-foreground">From</label>
                <input
                    type="date"
                    value={props.from}
                    onChange={(e) => props.onFrom(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
            </div>

            <div className="md:col-span-4">
                <label className="mb-1 block text-xs text-muted-foreground">To</label>
                <input
                    type="date"
                    value={props.to}
                    onChange={(e) => props.onTo(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
            </div>

            <div className="md:col-span-4">
                <label className="mb-1 block text-xs text-muted-foreground">Date Field</label>
                <select
                    value={props.dateField}
                    onChange={(e) => props.onDateField(e.target.value as ReportDateField)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                    <option value="paidAt">paidAt</option>
                    <option value="createdAt">createdAt</option>
                    <option value="updatedAt">updatedAt</option>
                </select>
            </div>
        </div>
    );
}

export function ReportsPage() {
    const { filters, setFrom, setTo, setDateField } = useInvoiceReportFiltersStore();
    const q = useInvoiceReportQuery(filters);

    const report = q.data?.data;

    const view = useInvoiceReportView({
        totals: report?.totals,
        items: report?.items,
    });

    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle className="text-2xl font-bold">Laporan Invoice</CardTitle>
                    <CardDescription>Laporan performa penjualan berdasarkan item untuk rentang tanggal yang dipilih.</CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <ReportFiltersBar
                    from={filters.from}
                    to={filters.to}
                    dateField={filters.dateField}
                    onFrom={setFrom}
                    onTo={setTo}
                    onDateField={setDateField}
                />

                {q.isLoading ? (
                    <div className="rounded-md border p-4 text-sm text-muted-foreground">Loading report…</div>
                ) : q.isError ? (
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                        {(q.error as Error).message}
                    </div>
                ) : report ? (
                    <>
                        <ReportKpiCards totals={report.totals} />

                        <ReportExportButtons report={report} />

                        <ReportCharts
                            salesBarData={view.salesBarData}
                            qtyBarData={view.qtyBarData}
                            mixScatterData={view.mixScatterData}
                        />

                        <div className="space-y-2">
                            <div className="text-sm font-medium">Items</div>
                            <ReportItemsTable items={report.items} />
                        </div>
                    </>
                ) : null}
            </CardContent>
        </Card>
    );
}
