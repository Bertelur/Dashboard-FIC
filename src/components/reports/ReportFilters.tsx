import type { ReportDateField } from "@/features/reports/models/invoiceReport";

export function ReportFilters(props: {
    from: string;
    to: string;
    dateField: ReportDateField;
    onFromChange: (v: string) => void;
    onToChange: (v: string) => void;
    onDateFieldChange: (v: ReportDateField) => void;
}) {
    const { from, to, dateField, onFromChange, onToChange, onDateFieldChange } = props;

    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-4">
                <label className="mb-1 block text-xs text-muted-foreground">From</label>
                <input
                    type="date"
                    value={from}
                    onChange={(e) => onFromChange(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
            </div>

            <div className="md:col-span-4">
                <label className="mb-1 block text-xs text-muted-foreground">To</label>
                <input
                    type="date"
                    value={to}
                    onChange={(e) => onToChange(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
            </div>

            <div className="md:col-span-4">
                <label className="mb-1 block text-xs text-muted-foreground">Date Field</label>
                <select
                    value={dateField}
                    onChange={(e) => onDateFieldChange(e.target.value as ReportDateField)}
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
