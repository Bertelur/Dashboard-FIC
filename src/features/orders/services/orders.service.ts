import type {
    Order,
    ApiListResponse,
    ApiItemResponse,
    GetOrdersParams,
    UpdateOrderStatusRequest,
} from "../models/order";
import { http } from "@/lib/api/http";

async function getOrders(params: GetOrdersParams): Promise<ApiListResponse<Order>> {
    const res = await http.get<ApiListResponse<Order>>("orders", { params });
    return res.data;
}

async function getOrderById(id: string): Promise<ApiItemResponse<Order>> {
    const res = await http.get<ApiItemResponse<Order>>(`orders/${id}`);
    return res.data;
}

async function updateOrderStatus(
    id: string,
    payload: UpdateOrderStatusRequest
): Promise<ApiItemResponse<Order>> {
    const res = await http.patch<ApiItemResponse<Order>>(`orders/${id}/status`, payload);
    return res.data;
}

export { getOrders, getOrderById, updateOrderStatus };
