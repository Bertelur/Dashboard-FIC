import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ReportSkeleton({ rows = 8 }: { rows?: number }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Value</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: rows }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="h-4 animate-pulse bg-muted" />
                        <TableCell className="h-4 animate-pulse bg-muted" />
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
