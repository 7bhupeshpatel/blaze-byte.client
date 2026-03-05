import { apiService } from './api.service';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED'
}

export interface SaleItem {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    category: string | null;
  };
}

export interface Sale {
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  totalAmount: number;
  status: OrderStatus;
  orderNumber: string | null;
  createdAt: string;
  items: SaleItem[];
  paymentMethod: "CASH" | "ONLINE";

  paymentStatus: PaymentStatus;

}

export const orderApiService = {
  /**
   * ✅ Fetch ALL orders (pipeline-ready)
   */
  async getAllOrders(): Promise<Sale[]> {
    try {
      const response = await apiService.get<any>('/orders');
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch orders');
    } catch (error: any) {
      throw error.response?.data?.message || error.message || 'Server error';
    }
  },

  /**
   * ✅ Confirm order (deduct stock + assign staff)
   */
  async confirmOrder(saleId: string): Promise<Sale> {
    try {
      const response = await apiService.patch<any>(`/orders/${saleId}/confirm`);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to confirm order');
    } catch (error: any) {
      throw error.response?.data?.message || error.message || 'Confirmation failed';
    }
  },

  /**
   * ✅ Update order status (PREPARING, COMPLETED, CANCELLED)
   */
  async updateStatus(saleId: string, status: OrderStatus, paymentStatus?: PaymentStatus): Promise<Sale> {
    try {
      const response = await apiService.patch<any>(
        `/orders/${saleId}/status`,
        { status, paymentStatus }
      );

      if (response.success) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to update status');
    } catch (error: any) {
      throw error.response?.data?.message || error.message || 'Update failed';
    }
  }
};