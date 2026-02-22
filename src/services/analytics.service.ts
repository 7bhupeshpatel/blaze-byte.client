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
  /* ===== Core Revenue ===== */
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;

  /* ===== Payment Split ===== */
  dailyCash: number;
  dailyOnline: number;

  monthlyCash: number;
  monthlyOnline: number;

  /* ===== Orders ===== */
  totalOrdersToday: number;
  totalOrdersMonth: number;
  totalOrdersYear: number;

  /* ===== Discounts ===== */
  totalDiscountMonth: number;
  totalDiscountYear: number;

  /* ===== Performance ===== */
  averageOrderValue: number;

  monthlyGrowthPercent: number;
  isGrowing: boolean;

  /* ===== Trends ===== */
  last7Days: {
    date: string;
    revenue: number;
  }[];

  last12Months: {
    month: string;
    revenue: number;
  }[];

  /* ===== Staff Ranking ===== */
  staffRanking: {
    name: string;
    revenue: number;
  }[];

  /* ===== Category Intelligence ===== */
  mostSoldProduct: MostSoldProduct | null;
  mostSoldCategory: string | null;

  categoryBreakdown: {
    category: string;
    quantity: number;
  }[];
}


export interface StaffAnalytics {
  daily: number;
  weekly: number;
  monthly: number;

  dailyCash: number;
  dailyOnline: number;

  monthlyCash: number;
  monthlyOnline: number;
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
