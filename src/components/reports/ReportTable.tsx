import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function isPlainObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function ReportTable({ data }: { data: unknown }) {
    if (isPlainObject(data)) {
        const entries = Object.entries(data);

        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entries.map(([k, v]) => (
                        <TableRow key={k}>
                            <TableCell className="font-medium">{k}</TableCell>
                            <TableCell className="whitespace-pre-wrap">
                                {isPlainObject(v) || Array.isArray(v) ? JSON.stringify(v, null, 2) : String(v)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    if (Array.isArray(data)) {
        const first = data[0];
        const columns = isPlainObject(first) ? Object.keys(first) : ["value"];

        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((c) => (
                            <TableHead key={c}>{c}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, idx) => (
                        <TableRow key={idx}>
                            {isPlainObject(row)
                                ? columns.map((c) => (
                                    <TableCell key={c}>{String((row as unknown as Record<string, unknown>)[c] ?? "")}</TableCell>
                                ))
                                : [<TableCell key="v">{String(row)}</TableCell>]}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    return <pre className="rounded-md border bg-muted/30 p-3 text-xs">{JSON.stringify(data, null, 2)}</pre>;
}
