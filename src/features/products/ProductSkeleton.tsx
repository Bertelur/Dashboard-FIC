import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TableSkeleton({ rows = 7 }: { rows?: number }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: rows }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="animate-pulse bg-muted h-4" />
                        <TableCell className="animate-pulse bg-muted h-4" />
                        <TableCell className="animate-pulse bg-muted h-4" />
                        <TableCell className="animate-pulse bg-muted h-4" />
                        <TableCell className="animate-pulse bg-muted h-4" />
                        <TableCell className="animate-pulse bg-muted h-4" />
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}