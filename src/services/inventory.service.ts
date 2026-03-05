import { apiService } from './api.service'; // Adjust path to where your ApiService is

export interface Inventory {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  cost: number;
  supplier?: string;
  purchaseDate: string;
  paymentMethod: 'CASH' | 'ONLINE';
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddInventoryPayload {
  name: string;
  category?: string;
  quantity: number;
  unit: string;
  cost: number;
  supplier?: string;
  purchaseDate?: string;
  paymentMethod: 'CASH' | 'ONLINE';
}

export const inventoryService = {
  fetchInventory: async () => {
    return await apiService.get<{ data: Inventory[] }>('/inventory');
  },

  addInventory: async (data: AddInventoryPayload) => {
    return await apiService.post<{ data: Inventory }>('/inventory', data);
  }
};