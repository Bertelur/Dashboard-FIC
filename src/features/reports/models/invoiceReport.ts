export type ReportDateField = "paidAt" | "createdAt" | "updatedAt";

export type InvoiceReportQueryParams = {
    from: string;
    to: string;
    dateField: ReportDateField;
};

export type InvoiceReportTotals = {
    ordersCount: number;
    totalSalesAmount: number;
    totalOrderItemsQty: number;
    avgUnitsPerOrder: number;
    avgSalesPerOrder: number;
    avgSalesPerItem: number;
};

export type InvoiceReportItem = {
    productId: string | null;
    sku?: string;
    name: string;
    ordersCount: number;
    quantity: number;
    salesAmount: number;
    avgUnitPrice: number;
};

export type InvoiceReportResponse = {
    success: boolean;
    data: {
        range: {
            from: string;
            to: string;
            dateField: ReportDateField;
        };
        totals: InvoiceReportTotals;
        items: InvoiceReportItem[];
    };
};
