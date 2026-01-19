import type { InvoiceReportResponse } from "@/features/reports/models/invoiceReport";
import { Button } from "@/components/ui/button";
import { buildReportCsv, downloadTextFile } from "@/lib/utils";

export function ReportExportButtons({ report }: { report: InvoiceReportResponse["data"] }) {
    const filename = `invoice-report_${report.range.from.slice(0, 10)}_${report.range.to.slice(0, 10)}.csv`;

    return (
        <div className="flex flex-wrap gap-2">
            <Button
                variant="outline"
                onClick={() => {
                    const csv = buildReportCsv({
                        fromIso: report.range.from,
                        toIso: report.range.to,
                        dateField: report.range.dateField,
                        totals: report.totals,
                        items: report.items,
                    });
                    downloadTextFile(filename, csv);
                }}
            >
                Export CSV
            </Button>
        </div>
    );
}
