import type { Unit, ApiListResponse, ApiItemResponse } from "../models/unit";
import { http } from "@/lib/api/http";
import { storage } from "@/lib/api/storage";

async function getUnits(): Promise<ApiListResponse<Unit>> {
    const res = await http.get<ApiListResponse<Unit>>("units");
    return res.data;
}

async function createUnit(name: string): Promise<ApiItemResponse<Unit>> {
    const token = storage.getAccessToken();
    const config: any = {};

    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`,
        };
    }

    const res = await http.post<ApiItemResponse<Unit>>("units", { name }, config);
    return res.data;
}

export { getUnits, createUnit };
