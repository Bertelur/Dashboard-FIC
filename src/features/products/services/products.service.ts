import type { Product } from "../models/product";
import { http } from "@/lib/api/http";

export type GetProductsParams = {
    search?: string;
    status?: string;
    category?: string;
};

export type ApiListResponse<T> = {
    success: boolean;
    data: T[];
};

export type ApiItemResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
};

export type CreateProductInput = {
    name: string;
    description: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: Product["status"];
    imageUrl?: string;
    imageType?: Product["imageType"];
};

export type UpdateProductInput = Partial<CreateProductInput>;

async function getProducts(params: GetProductsParams): Promise<ApiListResponse<Product>> {
    const res = await http.get<ApiListResponse<Product>>("products", { params });
    return res.data;
}

async function getDetailedProduct(id: string): Promise<ApiItemResponse<Product>> {
    const res = await http.get<ApiItemResponse<Product>>(`products/${id}`);
    return res.data;
}

async function createProduct(payload: CreateProductInput) {
    const res = await http.post<ApiItemResponse<Product>>("products", payload);
    return res.data;
}

async function updateProduct(id: string, payload: UpdateProductInput) {
    const res = await http.put<ApiItemResponse<Product>>(`products/${id}`, payload);
    return res.data;
}

async function deleteProduct(id: string): Promise<boolean> {
    const res = await http.delete<{ success: boolean; message?: string }>(`products/${id}`);
    return res.data.success;
}

export { getProducts, getDetailedProduct, createProduct, updateProduct, deleteProduct };