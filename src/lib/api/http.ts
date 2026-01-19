import axios from "axios";
import { storage } from "./storage";

export const http = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = storage.getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use((response) => {
  return response;
}, (error) => {
  return Promise.reject(error);
});

export default http;