import { apiService, ApiResponse } from './api.service';

export interface GuestProduct {
    id: string;
    name: string;
    price: number;
    category: string | null;
    stock: number;
}

export interface CompanyMenu {
    id: string;
    name: string;
    products: GuestProduct[];
}

export interface OrderItem {
    productId: string;
    quantity: number;
}

export const guestApiService = {
    /**
     * Fetch menu for a specific company
     */
    async fetchMenu(companyId: string): Promise<CompanyMenu> {
        try {
            const response = await apiService.get<any>(`/guest/${companyId}/menu`);
            if (response.success) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch menu');
        } catch (error: any) {
            throw error.response?.data?.message || error.message || 'Server connection failed';
        }
    },

    /**
     * Submit guest order
     */
    async submitOrder(
        companyId: string, 
        orderData: { 
            customerName: string; 
            customerPhone?: string;
            paymentMethod: "CASH" | "ONLINE"; 
            items: OrderItem[] 
        }
    ): Promise<any> {
        try {
            const response = await apiService.post<any>(`/guest/${companyId}/order`, orderData);
            if (response.success) {
                return response.data;
            }
            throw new Error(response.message || 'Order submission failed');
        } catch (error: any) {
            throw error.response?.data?.message || error.message || 'Could not place order';
        }
    },

  async getOrderStatus(orderId: string): Promise<{ id: string; status: string }> {
        try {
            const response = await apiService.get<any>(`/guest/order/${orderId}/status`);
            if (response.success) {
                return response.data;
            }
            throw new Error(response.message || 'Failed to fetch order status');
        } catch (error: any) {
            throw error.response?.data?.message || error.message || 'Failed to fetch order status';
        }
    }
};