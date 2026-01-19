import http from "@/lib/api/http";
import type { LoginResponse } from "@/lib/types/auth";

export async function loginApi(body: { username: string; password: string }) {
    const res = await http.post<LoginResponse>("/auth/login", body);
    return res.data;
}