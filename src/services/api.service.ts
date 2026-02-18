
import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

// Interfaces for your specific Backend responses
// export interface ApiResponse<T = any> {
//     success: boolean;
//     message: string;
//     data?: T;
//     token?: string;
//     role?: string;
// }

export type ApiResponse<T = any> = {
    success: boolean;
    message?: string;
} & T;


class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            // Ensure this is in your .env or hardcoded for now
            baseURL: process.env.REACT_APP_BASE_API_URL || 'http://localhost:6969/api/v1',
            timeout: 100000,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.client.interceptors.request.use(
            config => {
                const token = localStorage.getItem('blaze_token');
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('blaze_token');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
        const response = await this.client.get<ApiResponse<T>>(url, { params });
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.client.post<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        const response = await this.client.patch<ApiResponse<T>>(url, data);
        return response.data;
    }

    async delete<T>(url: string, p0?: { data: { ids: string[]; }; }): Promise<ApiResponse<T>> {
        const response = await this.client.delete<ApiResponse<T>>(url);
        return response.data;
    }
}

export const apiService = new ApiService();