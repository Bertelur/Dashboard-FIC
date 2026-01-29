export type ProductStatus = "active" | "inactive" | "archived";

export type Product = {
    id: string;
    name: string;
    description: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: ProductStatus;
    imageUrl?: string | null;
    imageType?: string;
    unit?: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
};

export type ProductsResponse = {
    success: boolean;
    data: Product[];
    total: number;
    limit: number;
    skip: number;
};