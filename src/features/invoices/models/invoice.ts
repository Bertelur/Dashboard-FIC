export type InvoiceItem = {
    productId?: string;
    productIdType?: string;
    sku?: string;
    name: string;
    quantity: number;
    price: number;
};

export type InvoiceCustomer = {
    givenNames?: string;
    surname?: string;
    email?: string;
    mobileNumber?: string;
} | null;

export type Invoice = {
    id: string;
    paymentExternalId: string;
    xenditInvoiceId: string;
    userId: string;
    amount: number;
    currency: string;
    status: "paid" | "pending" | "expired" | "failed" | string;
    paidAt?: string | null;
    paymentMethod?: string | null;
    invoiceUrl?: string | null;
    customer: InvoiceCustomer;
    items: InvoiceItem[];
    createdAt: string;
    updatedAt: string;
};
