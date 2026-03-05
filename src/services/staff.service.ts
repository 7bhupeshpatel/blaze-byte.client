import { apiService } from './api.service';

/* ============================= */
/* ========= INTERFACES ======== */
/* ============================= */

export interface StaffProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  stock: number  ;
  createdAt: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED'
}

export interface SaleItem {
  id: string;
  quantity: number;
  product: StaffProduct;
}

export interface Sale {
  id: string;
  totalAmount: number;
  createdAt: string;

  paymentMethod: "CASH" | "ONLINE";

  paymentStatus: PaymentStatus;
  paymentUpdateCount: number;

  customerName?: string | null;
  customerPhone?: string | null;

  discountAmount : number;
  subtotalAmount: number;
  discountPercent : number ;
  staff: {
    id: string;
    email: string;
  };

  items: SaleItem[];
}

/* ============================= */
/* ========= SERVICE =========== */
/* ============================= */

export const staffService = {

  /* ===== GET PRODUCTS ===== */
  async getProducts(): Promise<StaffProduct[]> {
    const response = await apiService.get<any>('/staff/products');
    return response.data;
  },

  /* ===== CREATE SALE ===== */
async createSale(payload: {
    items: {
      productId: string;
      quantity: number;
    }[];
    customer?: {
    name?: string;
    phone?: string;
  };
  discountPercent?: number;
  paymentMethod: "CASH" | "ONLINE";
  paymentStatus: PaymentStatus; // ✅ REQUIRED NOW
  }): Promise<Sale> {

    const response = await apiService.post<any>(
      '/staff/sale',
      payload
    );

    return response.data;
  },

  /* ===== GET MY SALES ===== */
  async getMySales(): Promise<Sale[]> {
    const response = await apiService.get<any>('/staff/sales');
    return response.data;
  },

  /* ===== UPDATE PAYMENT STATUS ===== */
  async updatePaymentStatus(saleId: string, paymentStatus: PaymentStatus): Promise<Sale> {
    const response = await apiService.patch<any>(
      `/staff/sale/${saleId}/payment-status`,
      { paymentStatus }
    );
    
    return response.data;
  }

};
