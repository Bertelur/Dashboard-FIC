export type OrderStatus =
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "ready_for_pickup"
    | "completed"
    | "cancelled";

export type ShippingMethod = "shipping" | "pickup";

export interface Address {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
    additionalNotes?: string;
    label?: string;
    lat?: number;
    lon?: number;
}

export interface OrderItem {
    productId: string;
    sku: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    totalPrice: number;
    imageUrl?: string;
}

export interface OrderLog {
    status: OrderStatus;
    timestamp: string;
    note?: string;
    by?: string;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    shippingMethod: ShippingMethod;
    shippingAddress?: Address;
    status: OrderStatus;
    logs: OrderLog[];
    createdAt: string;
    updatedAt: string;
}

export type ApiListResponse<T> = {
    success: boolean;
    data: T[];
};

export type ApiItemResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
};

export type GetOrdersParams = {
    status?: OrderStatus;
    userId?: string;
    limit?: number;
    skip?: number;
};

export type UpdateOrderStatusRequest = {
    status: OrderStatus;
    note?: string;
};
