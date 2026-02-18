import { apiService } from './api.service';

/* ============================= */
/* ========= INTERFACES ======== */
/* ============================= */

export interface MostSoldProduct {
  id: string;
  name: string;
  price: number;
  category?: string | null;
}

export interface AdminAnalytics {
  daily: number;
  weekly: number;
  monthly: number;

  mostSoldProduct: MostSoldProduct | null;
  mostSoldCategory: string | null;
}

export interface StaffAnalytics {
  daily: number;
  weekly: number;
  monthly: number;
}

/* ============================= */
/* ========= SERVICE =========== */
/* ============================= */

export const analyticsService = {

  /* ===== ADMIN ANALYTICS ===== */
  async getAdminAnalytics(): Promise<AdminAnalytics> {
    const response = await apiService.get<any>('/analytics/admin');
    return response.data;
  },

  /* ===== STAFF ANALYTICS ===== */
  async getStaffAnalytics(): Promise<StaffAnalytics> {
    const response = await apiService.get<any>('/analytics/staff');
    return response.data;
  }

};
