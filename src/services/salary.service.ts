import { apiService } from './api.service'; // Adjust path to where your ApiService is

export interface SalaryRecord {
  id: string;
  amount: number;
  month: number;
  year: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
  paymentMethod: 'CASH' | 'ONLINE';
  paymentDate: string;
  notes?: string;
  userId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    metadata?: any;
  };
}

export interface RecordSalaryPayload {
  userId: string;
  amount: number;
  month: number;
  year: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
  paymentMethod: 'CASH' | 'ONLINE';
  paymentDate?: string;
  notes?: string;
}

export const salaryService = {
  fetchSalaries: async () => {
    return await apiService.get<{ data: SalaryRecord[] }>('/salary');
  },

  recordSalary: async (data: RecordSalaryPayload) => {
    return await apiService.post<{ data: SalaryRecord }>('/salary', data);
  }
};